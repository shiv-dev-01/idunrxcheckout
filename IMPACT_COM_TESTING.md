# impact.com — Testing guide (Funnel + Checkout)

Program **52708** | Events: **74027** Initial · **74028** Approved · **74029** Recurring

---

## Where to test (primary path: funnel)

Most purchases happen in the **funnel** (`idunrx.com/v1/`), not `checkout.idunrx.com`.

| Environment | Base URL |
|-------------|----------|
| **Local funnel dev** | `http://localhost:8080/v1/` |
| **Production funnel** | `https://idunrx.com/v1/` |
| **Simple checkout** (alternate) | `https://checkout.idunrx.com/` |

Always start tests with an affiliate click id:

```text
?im_ref=TEST1234567
```

Example local entry:

```text
http://localhost:8080/v1/?im_ref=TEST1234567
```

Disable ad blockers. Use incognito and clear cookies between runs.

---

## Phase A — Tag checks (before purchase)

Open DevTools → **Network** + **Console**.

### A1. Universal Tracking Tag (UTT)

1. Load funnel with `?im_ref=TEST1234567`
2. Filter Network: `utt.impactcdn.com`
3. Console should show: `[impact.com] UTT script loaded`

Repeat on `/v1/plans`, `/v1/shipping`, `/v1/payment`, `/v1/thank-you`.

### A2. Click ID capture

1. Console: `[impact.com] click id captured: TEST1234567`
2. Application → Cookies → `im_ref` should be set (30 days)
3. Navigate funnel steps — internal URLs should keep `im_ref` in query (via `mergeAffiliateIntoSearch`)

### A3. Identify function

1. Filter Network: `xur` or `cur` or `ur` and program **52708**
2. **Anonymous** (before email): `customprofileid` present; `custid` / `custemail` empty
3. **After email** on questionnaire/shipping/payment: `custemail` = SHA1 hash; `custid` if API returns customer id

Console: `[impact.com] identify sent`

**Note:** On `localhost`, `verifySiteDefinitionMatch` is `false`. Full site verification requires **`idunrx.com`** (production).

---

## Phase B — Funnel purchase tests (74027 Initial Purchase)

Flow: **Questionnaire → Plans → Shipping → Payment → Thank-you**

Use impact.com **Test Actions** link when possible (Engage → Transactions → Test Actions → Generate test link). Otherwise append `im_ref` manually.

| # | Scenario | Steps |
|---|----------|--------|
| 1 | **No promo** | Complete funnel; do not apply coupon |
| 2 | **With promo** | Apply valid coupon on Payment page before pay |
| 3 | **Plan variants** | Test at least monthly and one multi-month plan (3/6/12) |

### After successful payment

1. Land on `/v1/thank-you`
2. Console: `[impact.com] trackConversion sent` with `eventId: 74027`, real `orderId`
3. Network: filter `pxf.io` or `74027` — POST conversion payload

### Payload checklist (Ayanda)

| Field | Expected |
|-------|----------|
| `orderId` | Real order id from `createOrder_test` — **not** `undefined` |
| `customerId` | From API response if returned; else empty string (not placeholder) |
| `customerEmail` | SHA1 of shopper email |
| `customProfileId` | UUID cookie |
| `orderPromoCode` | Applied promo code, or empty |
| `orderDiscount` | Discount amount when promo used |
| `items[]` | SKU, quantity, subTotal, name |
| `clickId` | Same as `im_ref` when affiliate test |

### sessionStorage fallback

Order context is saved as `idunrx_impact_order_context` so thank-you refresh can still fire 74027.

---

## Phase C — impact.com dashboard validation

1. Login → **Engage → Transactions → Test Actions**
2. Find test by **Order Id** (up to ~30 min delay)
3. **See Details** → verify revenue, SKUs, promo, customerId
4. **Approve** if correct; **Reject** and fix if not

---

## Phase D — Follow-up events (not auto-fired in funnel yet)

| Event | ID | When |
|-------|-----|------|
| Approved Purchase | 74028 | After medical approval / intake (onboarding) |
| Recurring Subscription | 74029 | Subscription rebill |

Helpers in `idunrx_funnel__new/src/lib/impactCom.ts`:

```typescript
import {
  trackImpactApprovedPurchase,
  trackImpactRecurringSubscription,
} from "@/lib/impactCom";

await trackImpactApprovedPurchase({
  orderId: "12345",
  customerId: "...",
  email: "user@example.com",
});
```

Wire these on onboarding completion (`ThankYou3` → `idunrx.com/onboarding/`) and member portal rebill.

---

## Simple checkout (secondary path)

If testing `checkout.idunrx.com` directly:

```text
https://checkout.idunrx.com/?sku=YOUR_SKU&im_ref=TEST123&uniqueId=CUST-TEST-001
```

Multi-SKU: `?sku=SKU1,SKU2&qty=2`

Code: `src/utils/impactCom.js`, `Checkout2.js`, `NewThankyouPage.js`

---

## Run funnel locally

```bash
cd idunrx_funnel__new
npm install
npm run dev
```

Open: `http://localhost:8080/v1/?im_ref=TEST1234567`

Build verify: `npm run build`

---

## Key files (funnel)

| File | Role |
|------|------|
| `idunrx_funnel__new/index.html` | UTT script |
| `idunrx_funnel__new/src/lib/impactCom.ts` | identify, trackConversion, helpers |
| `idunrx_funnel__new/src/components/ImpactTracking.tsx` | All routes |
| `idunrx_funnel__new/src/context/CheckoutFlowContext.tsx` | Order + impact payload |
| `idunrx_funnel__new/src/pages/ThankYou3.tsx` | Fires **74027** |
| `idunrx_funnel__new/src/lib/affiliateTracking.ts` | Preserves `im_ref` in funnel URLs |
