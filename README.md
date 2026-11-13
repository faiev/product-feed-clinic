# Product Feed Clinic

Product Feed Clinic is an independent, file-based Google Shopping feed QA pilot for small paid-media agencies and freelance performance marketers managing ecommerce catalogs.

## Intended customer

Independent Google Ads / PPC agencies and performance marketers managing multiple Shopify or other ecommerce clients, without a dedicated product-feed specialist for every catalog issue.

The service reviews CSV/TSV exports, produces row-level findings, documents corrections only when source data supports them, and lists unresolved questions. It does not guarantee Google approval, resolve account suspensions, manage campaigns, or edit a live store.

## Files

- `index.html` — service overview, audience, provisional packages and scope.
- `google-feed-preflight.html` — local-only CSV/TSV checker. Feed files are processed in the browser and are not uploaded.
- `demo/sample-feed.csv` — synthetic example feed.
- `demo/sample-report.html` — synthetic sample report.
- `tests/test_preflight.js` — dependency-free regression test.

## Run locally

Open `index.html` in a browser. No build step, server, account or dependencies are required.

Run the regression test with Node.js 18 or later:

```bash
node tests/test_preflight.js
```

## GitHub Pages

This repository is intended to publish as a static GitHub Pages site from the `main` branch and repository root. In repository Settings → Pages, select **Deploy from a branch**, branch `main`, folder `/(root)`, then Save.

## Limitations and safety

- A feed-only check cannot determine account-level policy status, Merchant Center suspension status, shipping/tax configuration, crawlability, or price/availability consistency on live product pages and checkout.
- Google makes final product eligibility decisions. Approval or sales outcomes are not guaranteed.
- Never send passwords, customer/order exports, or payment data.
- Do not invent GTINs, brands, prices, availability or product claims.
- Prices displayed on the service page are provisional pilot prices, not validated customer demand.

## Status

Pilot concept. No customer, marketplace listing, paid order or revenue is being claimed.
