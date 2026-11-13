'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('google-feed-preflight.html', 'utf8');
const match = html.match(/<script>([\\s\\S]*?)<\\/script>/);
assert.ok(match, 'application script exists');

class Element {
  constructor(id) { this.id=id; this.textContent=''; this.innerHTML=''; this.hidden=false; this.disabled=false; this.listeners={}; }
  addEventListener(type, fn) { this.listeners[type]=fn; }
  click() { this.listeners.click?.(); }
}
const elements = new Map();
let lastBlob = null;
let lastDownload = null;
const document = {
  getElementById(id) { if(!elements.has(id)) elements.set(id,new Element(id)); return elements.get(id); },
  createElement(tag) { const el=new Element(tag); el.click=()=>{lastDownload={name:el.download,href:el.href};}; return el; }
};
class BlobStub { constructor(parts,opts={}) { this.parts=parts; this.type=opts.type||''; lastBlob=this; } text(){return Promise.resolve(this.parts.join(''));} }
const context = { document, Blob:BlobStub, URL:{createObjectURL:()=> 'blob:test', revokeObjectURL:()=>{}}, console };
vm.runInNewContext(match[1],context,{timeout:3000});

elements.get('sample').click();
assert.equal(elements.get('rows').textContent,'3');
assert.equal(elements.get('critical').textContent,'4');
assert.equal(elements.get('warnings').textContent,'4');
assert.equal(elements.get('clean').textContent,'1');
assert.match(elements.get('body').innerHTML,/Duplicate product ID/);
assert.match(elements.get('body').innerHTML,/Price format needs review/);
assert.match(elements.get('body').innerHTML,/Image link is missing or not a valid HTTPS URL/);

elements.get('csv').click();
assert.equal(lastDownload.name,'feed-preflight-findings.csv');
lastBlob.text().then(csv=>{
  assert.match(csv,/duplicate_id/);
  assert.match(csv,/invalid_price/);
  console.log('PASS: sample feed produces 3 rows, 4 critical findings, 4 warnings, 1 clean row; CSV export works.');
}).catch(err=>{console.error(err);process.exitCode=1;});
