# Stripe setup (idunrx checkout)

## Keys (hardcoded)

Sandbox keys are in:

- `src/utils/stripe.js` — publishable key + payment-intent URL
- `server/index.js` — secret key

Same approach as myfastrx wlcheckout. Update those files for live keys.

## Payment intent URL (live vs local)

| Environment | URL |
|-------------|-----|
| **localhost** | `http://localhost:4242/api/create-payment-intent` (run `npm run start:server`) |
| **checkout.idunrx.com** | `https://panel.whitelabelmd.com/idunrx/api/stripe/create-payment-intent` |

The frontend picks the URL automatically from `window.location.hostname` — live never calls localhost.

**Backend:** Live uses `https://panel.whitelabelmd.com/idunrx/api/stripe/create-payment-intent` (already on panel).

## PaymentIntent metadata (checkout → panel API)

The frontend sends billing fields with `create-payment-intent`:

| Checkout source | POST body field | Stripe metadata key | Notes |
|-----------------|-----------------|---------------------|--------|
| `email` | `email` | `email` | Also `receipt_email` + Stripe Customer |
| `phoneNumber` | `phone` | `phone` | Also Customer + shipping.phone |
| `appliedDiscount` (validated code) | `promoCode` | `promoCode` | Same value as order `promo_codes` / impact `orderPromoCode` — not the raw input before Apply |
| `address` | `address` | `addressLine1` + combined `address` | Shipping line1 |
| `aptSuite` | `address2` | `addressLine2` | Apt/suite |
| `city` | `city` | `city` | |
| `getselectedStateCode.state_code` | `state` | `state` | 2-letter state code (same as order `state_name`) |
| `postalCode` | `zip` | `zip` | Same as order `zip_code` |
| `firstName` / `lastName` | `firstName`, `lastName` | same | Shipping name |

Deploy `server/createPaymentIntent_stripe.php` + `stripePaymentIntentHelpers.php` on panel if the live route does not yet map these fields.

## Order API after payment

`POST https://panel.whitelabelmd.com/idunrx/api/createOrder_stripe`

JSON body includes `payment_token` (Stripe PaymentIntent id, e.g. `pi_...`) plus shipping/billing fields from checkout.

## Install & run locally

```bash
cd idunrx_checkout
npm install
npm run dev
```

This starts:

- Stripe server on port **4242** (`npm run start:server`)
- React app on port **3000** (`npm start`)

Or run separately in two terminals: `npm run start:server` and `npm start`.

## 3. Production

Deploy `server/index.js` (or equivalent) with `STRIPE_SECRET_KEY` set, and point:

`REACT_APP_STRIPE_PAYMENT_INTENT_URL` to your hosted `/api/create-payment-intent` URL.

## 4. Order API

After Stripe payment succeeds, the app calls the existing `createOrder_test` API with:

- `apple_pay_token` / `payment_id` = Stripe PaymentIntent id  
- Empty card fields (same pattern as myfastrx)

Confirm your idunrx backend accepts these fields for Stripe charges.
