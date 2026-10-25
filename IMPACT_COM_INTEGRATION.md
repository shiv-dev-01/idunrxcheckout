# impact.com Integration — Status & Next Steps
**Project:** Idun Rx (Account #52708)
**Integration Engineer:** Ayanda (impact.com)
**Tech Plan:** https://docs.google.com/document/d/1b1swrkW-sXAgp0du7Vz5WnRVtIbVitGmqsVOdMgOfwo/edit?usp=sharing
**Date:** May 15, 2026

---

## Overview

impact.com is an affiliate/partner tracking platform. When a visitor arrives from an affiliate link they click, impact.com appends `?irclickid=XXXX` to the URL. The integration must:
1. Capture that click ID on arrival.
2. Fire a conversion event back to impact.com when a purchase is completed.

---

## What Has Been Implemented ✅

### 1. `irclickid` Capture on Page Load
**File:** `src/pages/paymentgetway/Checkout2.js` (lines ~671–691)

- On mount, reads `?irclickid=` from the URL query string.
- Falls back to reading `irclickid` from a first-party cookie if not in the URL.
- Stores the value in React state (`irclickid`).
- Persists the value in a **30-day first-party cookie** (`SameSite=Lax`) to survive page redirects.

### 2. Conversion Tracking Utility
**File:** `src/utils/impactCom.js`

- `trackImpactConversion(orderData)` — fires a 1×1 invisible image pixel to report a completed purchase back to impact.com.
- Accepts: `orderId`, `total` (USD, after discount), `coupon` (optional), `irclickid`.
- Builds the pixel URL as: `{IMPACT_TRACKING_URL}/{IMPACT_CAMPAIGN_ID}/sale?...`
- Silently no-ops (with `console.warn`) if tracking URL/Campaign ID are not yet configured, or if there is no `irclickid` (non-affiliate visitor).

### 3. Conversion Fired on Successful Purchase
**File:** `src/pages/paymentgetway/Checkout2.js` (lines ~1314 and ~1456)

- `trackImpactConversion()` is called in **both** success paths:
  - Array response (multiple orders) — uses `orderIds[0]`
  - Single-order response — uses `Response.data.order_id`
- Passes the final computed total (after applying `discount_percent` or `discount_amount`), the applied coupon, and the stored `irclickid`.

### 4. Other Tracking Already Live (for reference)
| Platform | Status | Notes |
|---|---|---|
| GoAffPro | ✅ Live | Loader in `public/index.html`, conversion called via `trackGoAffProConversion()` |
| Google Ads (gtag) | ✅ Live | `AW-11515103107`, fires `Purchase` event on success |
| Facebook Pixel | ✅ Live | `593192600037395`, fires `Purchase` event on success |

---

## What Is NOT Done / Blockers ❌

### BLOCKER 1 — Tracking URL and Campaign ID Are Empty
**File:** `src/utils/impactCom.js` (lines 15–16)

```js
const IMPACT_TRACKING_URL = ""; // ← EMPTY — nothing will fire
const IMPACT_CAMPAIGN_ID  = ""; // ← EMPTY — nothing will fire
```

**Action Required:** Get the actual values from Ayanda (impact.com Integration Engineer).
- The account number `52708` appears in the tech plan document filename but this is the **Account ID**, not the Campaign ID or tracking URL.
- The tracking URL typically looks like: `https://idunrx.sjv.io` (campaign-specific subdomain).
- Once received, fill these two constants in `src/utils/impactCom.js`.

---

### BLOCKER 2 — No Universal Tracking Tag (UTT) on Site
**File:** `public/index.html`

impact.com typically requires their **Universal Tracking Tag** (a JavaScript snippet) loaded on **all pages** for:
- Attributing clicks to affiliates before the visitor reaches checkout.
- Visitor identification (the UTT sets its own cookies alongside `irclickid`).

Currently `public/index.html` only has the GoAffPro loader. No impact.com UTT is present.

**Action Required:** Ask Ayanda for the UTT snippet and add it to `public/index.html` (similar to how GoAffPro loader is placed).

Example of what it typically looks like:
```html
<script>
  (function(a,b,c,d,e,f,g){
    e['ire_o']=c;e[c]=e[c]||function(){(e[c].q=e[c].q||[]).push(arguments)};
    f=d.createElement(b);f.async=1;f.src=a;g=d.getElementsByTagName(b)[0];
    g.parentNode.insertBefore(f,g);
  })('https://utt.impactcdn.com/AXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXutt.min.js',
  'script','ire',document,window);
</script>
```

---

### GAP 3 — Only `Checkout2.js` Has Tracking
**Files:** `PaymentGetways.js`, `PaymentGetways2.js`, `PaymentGetways3.js`

These are older/alternative checkout pages with **zero impact.com integration**. If any traffic still flows through them, conversions will not be tracked.

**Action Required:** Confirm with team whether these pages are still in active use. If yes, replicate the irclickid capture + conversion call from `Checkout2.js`.

---

### GAP 4 — Pixel Approach vs. Conversion API (Server-Side)
The email from Ayanda specifically says **"Implement Conversion API requests"** — this is impact.com's **server-side** API, not the client-side image pixel approach currently implemented.

The client-side pixel approach (`new Image(); img.src = pixelUrl`) has limitations:
- Ad blockers can suppress image pixels.
- No guarantee of delivery.
- May not pass impact.com's validation checks.

The **Conversion API** sends a POST request from the backend (server-to-server), which is more reliable.

**Action Required:** Confirm with Ayanda whether client-side pixel is acceptable OR if a server-side Conversion API call is required. The tech plan document will clarify this.

---

### GAP 5 — No Staging Testing Done
Per the process outlined by Ayanda, the staging phase has not been started:
- No end-to-end test purchases on staging.
- No validation in the impact.com dashboard.

---

## Next Steps (Prioritized)

| # | Action | Owner | Dependency |
|---|---|---|---|
| 1 | Reply to Ayanda and confirm tech plan is feasible | Team | — |
| 2 | Ask Ayanda for: Tracking URL, Campaign ID, UTT snippet | Team | Reply sent |
| 3 | Fill `IMPACT_TRACKING_URL` and `IMPACT_CAMPAIGN_ID` in `impactCom.js` | Dev | Values from Ayanda |
| 4 | Add impact.com UTT snippet to `public/index.html` | Dev | Snippet from Ayanda |
| 5 | Confirm whether Conversion API (server-side) is required vs. pixel | Team + Ayanda | Tech plan review |
| 6 | If server-side required: implement backend POST to impact.com API | Dev | API spec from Ayanda |
| 7 | Confirm if `PaymentGetways.js/2/3` are still in use; add tracking if yes | Team | — |
| 8 | Staging: do a test purchase and verify event appears in impact.com | Dev + Team | Steps 3–4 done |
| 9 | Production: deploy and repeat validation | Dev | Staging passed |
| 10 | Final review + project closure with Ayanda | Team | Production validated |

---

## Key Files Reference

| File | Purpose |
|---|---|
| `src/utils/impactCom.js` | Conversion pixel utility — **fill IMPACT_TRACKING_URL and IMPACT_CAMPAIGN_ID here** |
| `src/pages/paymentgetway/Checkout2.js` | Main checkout — irclickid capture (line ~671) + trackImpactConversion calls (lines ~1314, ~1456) |
| `public/index.html` | Where the UTT snippet needs to be added |

---

## Questions to Clarify with Ayanda

1. What is the **Tracking URL** (e.g. `https://idunrx.sjv.io`) and **Campaign ID** for the pixel?
2. What is the **Universal Tracking Tag (UTT)** snippet for Idun Rx?
3. Is a **server-side Conversion API** call required, or is a client-side pixel acceptable?
4. What specific **conversion event types** need to be tracked? (e.g., Purchase only, or also Lead/Registration?)
5. Do you have a **staging/test Campaign ID** for development testing?
6. What are the **validation criteria** impact.com will check before project closure?
