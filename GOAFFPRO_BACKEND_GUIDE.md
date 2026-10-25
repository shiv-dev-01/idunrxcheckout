# GoAffPro Backend Integration Guide — idunRX

**Project:** idunRX Affiliate Program  
**Store type:** Custom / SDK (not Shopify)  
**GoAffPro shop key:** `gfktsmnyfy` (from checkout loader script)  
**Backend base (existing):** `https://panel.whitelabelmd.com/idunrx/api/`  
**Checkout site:** `https://checkout.idunrx.co`  
**Date:** June 11, 2026

---

## 1. Overview

GoAffPro is the affiliate marketing platform for idunRX. Affiliates sign up, share referral links or coupon codes, and earn commission when customers purchase.

idunRX uses a **custom checkout** (React + PHP API on `panel.whitelabelmd.com`). Unlike Shopify stores, GoAffPro **cannot** automatically pull products or create coupon codes. For custom stores, GoAffPro calls **your backend APIs** whenever it needs store data.

### What is already done (frontend — no backend work needed)

| Piece | Location | Status |
|---|---|---|
| Affiliate click tracking script | `public/index.html` | ✅ Live |
| Conversion tracking on order success | `src/utils/goaffpro.js` → `Checkout2.js` | ✅ Basic (will be improved separately) |
| Promo code validation at checkout | `check_coupons` API | ✅ Live |

### What is missing (backend work — this guide)

| Feature | Why it matters | GoAffPro admin symptom |
|---|---|---|
| **Product list API** | Lets admins set per-product commission rates | "Create Product Commission" search is empty |
| **Create coupon API** | Auto-generates affiliate discount codes on signup | Coupons page shows "No Data" |
| **Delete coupon API** | Removes codes when affiliate is deleted/updated | Orphaned codes in your system |
| **Order lookup APIs** (optional) | Manual sale attribution in GoAffPro admin | "Add a sale" feature won't work |

**Without these APIs, affiliates can sign up in GoAffPro but will not receive auto-generated coupon codes, and product-based commissions cannot be configured.**

---

## 2. How it fits together

```
┌─────────────────────┐         ┌──────────────────────────┐
│  GoAffPro Admin     │         │  panel.whitelabelmd.com  │
│  (affiliate portal) │ ──API──▶│  /idunrx/api/goaffpro/*  │
└─────────────────────┘         └──────────────────────────┘
         │                                    │
         │  SDK config points here            │ reads/writes
         │                                    ▼
         │                          ┌─────────────────────┐
         │                          │  Products DB        │
         │                          │  Promo codes DB     │
         │                          │  Orders DB          │
         │                          └─────────────────────┘
         │
         │  loader.js tracks clicks
         ▼
┌─────────────────────┐   conversion    ┌─────────────────────┐
│  checkout.idunrx.co │ ──────────────▶│  GoAffPro servers   │
│  (React checkout)   │  on purchase   │  (attributes sale)  │
└─────────────────────┘                 └─────────────────────┘
```

**Two separate integration paths:**

1. **Browser → GoAffPro** — tracking script + conversion event (frontend, already in place)
2. **GoAffPro → Your backend** — product/coupon/order APIs (backend, **needs to be built**)

---

## 3. GoAffPro SDK configuration (after APIs are built)

Once endpoints are deployed, configure in GoAffPro admin:

**Settings → SDK Settings → API Configuration**

### Demo / staging (Hostinger — Kishan, June 2026)

Paste this JSON into GoAffPro **SDK Settings → API Configuration** (file: `GOAFFPRO_SDK_CONFIG.demo.json`):

```json
{
  "base": {
    "url": "https://lightgoldenrodyellow-okapi-586794.hostingersite.com/kishan/demo_clone/api",
    "auth": {},
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "getProducts": {
    "url": "/products?search={{keyword}}",
    "method": "get"
  },
  "createDiscountCode": {
    "url": "/coupons",
    "method": "post"
  },
  "deleteDiscountCode": {
    "url": "/coupons/{{code}}",
    "method": "delete"
  },
  "getOrders": {
    "url": "/orders?before={{before}}",
    "method": "get"
  },
  "getOrder": {
    "url": "/order/{{id}}",
    "method": "get"
  },
  "getCategories": {
    "url": "/categories?search={{keyword}}",
    "method": "get"
  },
  "getProductsInCategory": {
    "url": "/productsInCategory?category_id={{category_id}}",
    "method": "get"
  },
  "searchCustomers": {
    "url": "/searchCustomers?search={{keyword}}",
    "method": "get"
  }
}
```

**Coupon API contract (demo backend):**

| Action | URL | Body |
|--------|-----|------|
| Create | `POST .../api/coupons` | `{"affiliate_id":"20384533","code":"TESTAFF12","discount_value":10,"discount_type":"percentage"}` |
| Delete | `DELETE .../api/coupons/TESTAFF11` | `{"affiliate_id":"20384533"}` |

GoAffPro should send `affiliate_id` automatically when calling `createDiscountCode` / `deleteDiscountCode`. Your backend must accept it. The numeric ID is shown in GoAffPro admin on the affiliate profile (e.g. **500614** for affiliate `ref=MAX`) — it is **not** the same as the referral code.

**Manual test (curl):**

```bash
curl -X POST "https://lightgoldenrodyellow-okapi-586794.hostingersite.com/kishan/demo_clone/api/coupons" \
  -H "Content-Type: application/json" \
  -d '{"affiliate_id":"20384533","code":"TESTAFF12","discount_value":10,"discount_type":"percentage"}'

curl -X DELETE "https://lightgoldenrodyellow-okapi-586794.hostingersite.com/kishan/demo_clone/api/coupons/TESTAFF11" \
  -H "Content-Type: application/json" \
  -d '{"affiliate_id":"20384533"}'
```

### Production (when deployed to panel.whitelabelmd.com)

Suggested config (paste into GoAffPro SDK settings JSON):

```json
{
  "base": {
    "url": "https://panel.whitelabelmd.com/idunrx/api/goaffpro",
    "headers": {
      "Authorization": "Bearer YOUR_SECRET_TOKEN_HERE"
    }
  },
  "getProducts": {
    "url": "/products?search={{keyword}}",
    "method": "get"
  },
  "createDiscountCode": {
    "url": "/coupons",
    "method": "post"
  },
  "deleteDiscountCode": {
    "url": "/coupons/{{code}}",
    "method": "delete"
  },
  "getOrders": {
    "url": "/orders?before={{before}}",
    "method": "get"
  },
  "getOrder": {
    "url": "/orders/{{id}}",
    "method": "get"
  }
}
```

Then enable in admin:

- **Setup → Coupons → Automatic Coupons** — ON (after `POST /coupons` works)
- **Setup → Coupons → Personal Coupons** — ON (optional, same API)

---

## 4. Security

GoAffPro will call these endpoints from their servers. **Do not leave them public without auth.**

**Recommended:**

- Shared secret Bearer token in `Authorization` header
- Token stored in GoAffPro SDK config and in backend env (e.g. `GOAFFPRO_API_TOKEN`)
- Reject requests without valid token → `401 Unauthorized`
- Rate limiting on coupon creation endpoint

---

## 5. Required API endpoints

**Suggested base path:** `https://panel.whitelabelmd.com/idunrx/api/goaffpro/`

All responses should be **JSON**. GoAffPro expects the exact shapes below (from [GoAffPro Custom Integration docs](https://github.com/anujtenani/goaffpro/wiki/Custom-Integration-advanced-guide)).

---

### 5.1 GET `/products` — Product list for commissions

**Called when:** Admin opens **Setup → Commissions → New Product Commission** and searches for a product.

**Query params:**

| Param | Type | Description |
|---|---|---|
| `search` | string | Search keyword typed by admin (may be empty) |

**Example request:**

```
GET /idunrx/api/goaffpro/products?search=NAD
Authorization: Bearer YOUR_SECRET_TOKEN
```

**Required response:** JSON array

```json
[
  {
    "id": "12345",
    "name": "NAD+ 1000MG"
  },
  {
    "id": "12346",
    "name": "GLP-1 R 10 MG"
  }
]
```

| Field | Type | Notes |
|---|---|---|
| `id` | string | **Must match** `product_id` sent in order `line_items` during conversion tracking |
| `name` | string | Display name in GoAffPro admin |

**Implementation notes for idunRX:**

- Reuse data from existing `get_products` or `get_product_details_v3`
- Map `product_id` → `id`, `product_name` → `name`
- Filter by `search` against product name (case-insensitive)
- `id` must be consistent with what checkout sends to GoAffPro on conversion (see Section 7)

**Example mapping from existing product object:**

```php
// Existing checkout product shape (from get_product_details_v3):
// product_id, product_name, product_price, product_sku, product_img, ...

[
  'id'   => (string) $product['product_id'],
  'name' => $product['product_name'],
]
```

---

### 5.2 POST `/coupons` — Create affiliate discount code

**Called when:**

- New affiliate signs up (if Automatic Coupons is ON)
- Admin manually assigns a coupon to an affiliate
- Affiliate updates their coupon code

**Request body (demo backend — includes `affiliate_id`):**

```json
{
  "affiliate_id": "20384533",
  "code": "TESTAFF12",
  "discount_value": 10,
  "discount_type": "percentage"
}
```

**Request body (minimal — GoAffPro may also send only):**

```json
{
  "code": "SARAH10",
  "discount_value": 10,
  "discount_type": "percentage"
}
```

| Field | Type | Values |
|---|---|---|
| `affiliate_id` | string | GoAffPro affiliate ID (e.g. `500614` in admin UI) — **required on demo API** |
| `code` | string | Coupon code to create (e.g. affiliate name or generated code) |
| `discount_value` | number | Discount amount (e.g. `10` for 10%) |
| `discount_type` | string | `"percentage"` or `"fixed"` (confirm which GoAffPro sends for your setup) |

**Required response:** `200` or `201` on success. Body format is flexible; GoAffPro mainly needs success.

**Suggested success response:**

```json
{
  "status": 1,
  "message": "Coupon created",
  "data": {
    "code": "SARAH10",
    "discount_percent": "10.00",
    "discount_amount": "0.00"
  }
}
```

**Implementation notes for idunRX:**

- Create a promo code in the **same system** used by `check_coupons`
- Checkout validates codes via:

  ```
  POST https://panel.whitelabelmd.com/idunrx/api/check_coupons
  Body: { "promo_codes": "SARAH10", "amount": 299.00, "campaign_id": "..." }
  ```

- Success response from `check_coupons` today:

  ```json
  {
    "status": 1,
    "data": { "code": "SARAH10" },
    "discount_percent": "10.00",
    "discount_amount": "0.00"
  }
  ```

- New GoAffPro-created codes **must** pass `check_coupons` validation at checkout
- Handle duplicate code → return `409` or clear error if code already exists
- Store metadata: `source = goaffpro`, `affiliate_code = SARAH10` (for reporting)

**Error responses:**

| Status | When |
|---|---|
| `400` | Invalid code format or missing fields |
| `409` | Code already exists |
| `401` | Invalid/missing auth token |
| `500` | Database or internal error |

---

### 5.3 DELETE `/coupons/{code}` — Remove affiliate discount code

**Called when:**

- Affiliate is deleted from GoAffPro
- Affiliate changes their coupon code (old code deleted)
- Admin deletes coupon in GoAffPro Coupons page

**Example request:**

```
DELETE /idunrx/api/goaffpro/coupons/SARAH10
Authorization: Bearer YOUR_SECRET_TOKEN
Content-Type: application/json

{"affiliate_id": "20384533"}
```

Demo URL:

```
DELETE https://lightgoldenrodyellow-okapi-586794.hostingersite.com/kishan/demo_clone/api/coupons/TESTAFF11
Content-Type: application/json

{"affiliate_id": "20384533"}
```

**Required response:** `200` or `204` on success.

**Suggested response:**

```json
{
  "status": 1,
  "message": "Coupon deleted"
}
```

**Implementation notes:**

- Soft-delete or deactivate in promo table (do not break historical orders)
- If code not found → `404` is acceptable

---

### 5.4 GET `/orders` — Order search (optional, Phase 2)

**Called when:** Admin or affiliate uses **Sales → Create a new sale** (manual attribution).

**Query params:**

| Param | Type | Description |
|---|---|---|
| `before` | string (ISO date) | Optional — filter orders before this date |

**Required response:**

```json
[
  {
    "id": "98765",
    "number": "#98765"
  },
  {
    "id": "98764",
    "number": "#98764"
  }
]
```

| Field | Type | Notes |
|---|---|---|
| `id` | string | Internal order ID (used in `getOrder`) |
| `number` | string | Human-readable order number shown in UI |

---

### 5.5 GET `/orders/{id}` — Single order detail (optional, Phase 2)

**Called when:** User selects an order from the list above.

**Required response:** Full order object (basic or extended schema). Minimum:

```json
{
  "id": "98765",
  "number": "#98765",
  "total": 249.00,
  "currency": "USD",
  "date": "2026-06-10T14:30:00.000Z",
  "customer": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
  },
  "coupons": ["SARAH10"],
  "line_items": [
    {
      "name": "NAD+ 1000MG",
      "quantity": 1,
      "price": 249.00,
      "sku": "NAD-1000",
      "product_id": "12345"
    }
  ],
  "status": "approved"
}
```

**Extended fields** (recommended): `subtotal`, `discount`, `tax`, `shipping`

**Implementation notes:**

- Pull from same orders table used by `createOrder_stripe` / `createOrder_test`
- `product_id` in `line_items` must match `id` from `/products` endpoint

---

### 5.6 Optional endpoints (not needed for launch)

| Endpoint | GoAffPro feature | Priority |
|---|---|---|
| `GET /categories?search={{keyword}}` | Collection-based commissions | Low |
| `GET /productsInCategory?category_id={{category_id}}` | Collection sync | Low |
| `GET /searchCustomers?search={{keyword}}` | Customer-affiliate connect | Low |

Skip unless product categories become a requirement.

---

## 6. Relationship to existing idunRX APIs

| Existing endpoint | Purpose today | GoAffPro equivalent |
|---|---|---|
| `get_products` | Product catalog | Source data for `GET /goaffpro/products` |
| `get_product_details_v3` | Single product by SKU | Reference for product field mapping |
| `check_coupons` | Validate promo at checkout | New codes from `POST /goaffpro/coupons` must work here |
| `createOrder_stripe` | Create paid order | Source data for `GET /goaffpro/orders/{id}` |
| `createOrder_test` | Create order (legacy) | Same |

**Important:** GoAffPro does **not** replace `check_coupons`. Flow is:

1. GoAffPro calls `POST /goaffpro/coupons` → code created in your DB  
2. Customer enters code at checkout → existing `check_coupons` validates it  
3. Order completes → frontend fires GoAffPro conversion with `coupons: ["SARAH10"]`

---

## 7. Frontend conversion payload (for product ID alignment)

The checkout will send order data to GoAffPro on purchase. Backend `product_id` values **must match** `/products` API `id` field.

Target conversion shape (frontend update planned separately):

```javascript
window.goaffpro_order = {
  id: "98765",
  number: "98765",
  total: 249.00,
  currency: "USD",
  forceSDK: true,
  coupons: ["SARAH10"],
  customer: {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com"
  },
  line_items: [
    {
      name: "NAD+ 1000MG",
      quantity: 1,
      price: 249.00,
      sku: "NAD-1000",
      product_id: "12345"   // ← must match GET /products id
    }
  ],
  status: "approved"
};
```

Current checkout product fields available at order time:

| Checkout field | Use in line_items |
|---|---|
| `product_id` | `product_id` |
| `product_name` | `name` |
| `product_price` | `price` |
| `product_sku` | `sku` |
| `quantity` | `quantity` |

---

## 8. Implementation priority

### Phase 1 — Unblocks affiliate coupons and product commissions (required)

| # | Endpoint | Effort estimate |
|---|---|---|
| 1 | `POST /goaffpro/coupons` | Medium — wire to promo code table |
| 2 | `DELETE /goaffpro/coupons/{code}` | Low |
| 3 | `GET /goaffpro/products` | Low — wrap existing product query |
| 4 | Auth middleware (Bearer token) | Low |
| 5 | Configure SDK settings in GoAffPro admin | Config only |

### Phase 2 — Manual sale attribution (optional)

| # | Endpoint |
|---|---|
| 6 | `GET /goaffpro/orders` |
| 7 | `GET /goaffpro/orders/{id}` |

### Phase 3 — Frontend improvements (separate dev task)

- Add `forceSDK: true`, `line_items`, `coupons`, `customer` to `trackGoAffProConversion()`
- File: `src/utils/goaffpro.js`

---

## 9. Testing checklist

### Backend API tests (Postman/curl)

- [ ] `GET /goaffpro/products` returns array with `id` + `name`
- [ ] `GET /goaffpro/products?search=NAD` filters correctly
- [ ] `POST /goaffpro/coupons` creates code in DB
- [ ] New code passes existing `check_coupons` validation at checkout
- [ ] `DELETE /goaffpro/coupons/{code}` deactivates code
- [ ] Deleted code fails `check_coupons` validation
- [ ] Requests without Bearer token return `401`

### GoAffPro admin tests (after SDK config)

- [ ] **Setup → Commissions → New Product Commission** — products appear in search
- [ ] **Setup → Coupons** — enable Automatic Coupons
- [ ] Create test affiliate → coupon appears in Coupons table
- [ ] Delete test affiliate → coupon removed from your DB
- [ ] **Settings → Developer → Debug Integration** — referral link sets cookie on checkout

### End-to-end affiliate test

- [ ] Affiliate signs up → receives coupon code (e.g. `TESTAFF10`)
- [ ] Customer visits `checkout.idunrx.co/?a_aid=TESTAFF` → cookie set
- [ ] Customer applies `TESTAFF10` at checkout → discount applies
- [ ] Order completes → sale appears in **GoAffPro → Manage → Sales**
- [ ] Commission calculated correctly

---

## 10. Troubleshooting

| Symptom | Likely cause |
|---|---|
| Products empty in GoAffPro | SDK `getProducts` URL wrong, or API not deployed, or auth failing |
| Coupons page empty | Automatic Coupons OFF, or `createDiscountCode` API not configured |
| Affiliate signs up but no code | `POST /coupons` failing — check GoAffPro webhook/logs |
| Code created but invalid at checkout | Code not in same DB/table as `check_coupons` |
| Sale not attributed | Conversion tracking issue (frontend), not backend API |
| Product commission not applied | `product_id` in order `line_items` doesn't match `/products` `id` |

---

## 11. Reference links

- GoAffPro Custom Integration (advanced): https://github.com/anujtenani/goaffpro/wiki/Custom-Integration-advanced-guide
- GoAffPro Developer settings: https://docs.goaffpro.com/goaffpro/admin-panel/settings/developer
- GoAffPro Admin API docs: https://api.goaffpro.com/docs/admin/
- idunRX checkout loader: `public/index.html` (`shop=gfktsmnyfy`)
- idunRX conversion utility: `src/utils/goaffpro.js`

---

## 12. Summary for backend team

**Build 3 endpoints under `/idunrx/api/goaffpro/`:**

1. **`GET /products?search=`** — return `[{ id, name }]` from existing product data  
2. **`POST /coupons`** — create promo code compatible with existing `check_coupons`  
3. **`DELETE /coupons/{code}`** — deactivate promo code  

**Secure all endpoints with a shared Bearer token.**

**After deployment:** share the base URL + token with the frontend/product team to configure GoAffPro SDK settings and enable Automatic Coupons.

**Without this work:** referral **links** may still track sales, but **automatic affiliate coupons** and **product-specific commissions** will not work — which is the issue reported in the GoAffPro admin dashboard.
