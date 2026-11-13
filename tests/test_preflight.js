'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const NativeURL = require('node:url').URL;

const html = fs.readFileSync('google-feed-preflight.html', 'utf8');
const start = html.indexOf('<script>');
const end = html.indexOf('</script>', start);
assert.ok(start >= 0 && end > start, 'application script exists');
const appScript = html.slice(start + '<script>'.length, end);

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
class BlobStub {
  constructor(parts,opts={}) { this.parts=parts; this.type=opts.type||''; lastBlob=this; }
  text() { return Promise.resolve(this.parts.join('')); }
}
class URLStub {
  constructor(value) { this.protocol = new NativeURL(value).protocol; }
  static createObjectURL() { return 'blob:test'; }
  static revokeObjectURL() {}
}
async function main() {
  vm.runInNewContext(appScript,{document,Blob:BlobStub,URL:URLStub,console},{timeout:3000});
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
  const csv=await lastBlob.text();
  assert.match(csv,/duplicate_id/);
  assert.match(csv,/invalid_price/);
  console.log('PASS: 3 sample rows, 4 critical findings, 4 warnings, 1 clean row; CSV export works.');
}
main().catch(err=>{console.error(err);process.exitCode=1;});
