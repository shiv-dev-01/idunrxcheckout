/** Stripe metadata: max 500 chars per value, 40 chars per key */
const META_VALUE_MAX = 500;

const meta = (value) => String(value ?? "").trim().slice(0, META_VALUE_MAX);

/** Accept camelCase (frontend) and snake_case (panel order API) field names. */
const normalizePaymentIntentInput = (body) => {
  const input = { ...body };
  const aliases = [
    ["first_name", "firstName"],
    ["last_name", "lastName"],
    ["city_name", "city"],
    ["state_name", "state"],
    ["zip_code", "zip"],
    ["promo_codes", "promoCode"],
  ];
  for (const [from, to] of aliases) {
    if (!input[to] && input[from]) input[to] = input[from];
  }
  if (!input.address && input.addressLine1) input.address = input.addressLine1;
  return input;
};

/** Map checkout POST body → Stripe metadata (keys align with order API / impact.com). */
const buildPaymentIntentMetadata = (body) => {
  body = normalizePaymentIntentInput(body);
  const line1 = meta(body.address);
  const line2 = meta(body.address2);
  const city = meta(body.city);
  const state = meta(body.state);
  const zip = meta(body.zip);
  const fullAddress = [line1, line2, city, state, zip]
    .filter(Boolean)
    .join(", ");

  // promoCode = validated code (order: promo_codes, impact: orderPromoCode)
  const promoCode = meta(body.promoCode ?? body.coupon);

  return {
    email: meta(body.email),
    phone: meta(body.phone),
    promoCode,
    firstName: meta(body.firstName),
    lastName: meta(body.lastName),
    address: meta(fullAddress || line1),
    addressLine1: line1,
    addressLine2: line2,
    city,
    state,
    zip,
    productName: meta(body.productName),
    sku: meta(body.sku),
    productId: meta(body.productId),
  };
};

const buildShipping = (body) => {
  body = normalizePaymentIntentInput(body);
  const line1 = meta(body.address);
  if (!line1) return undefined;

  const name = [meta(body.firstName), meta(body.lastName)]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    name: name || meta(body.email),
    phone: meta(body.phone) || undefined,
    address: {
      line1,
      line2: meta(body.address2) || undefined,
      city: meta(body.city) || undefined,
      state: meta(body.state) || undefined,
      postal_code: meta(body.zip) || undefined,
      country: "US",
    },
  };
};

module.exports = { meta, buildPaymentIntentMetadata, buildShipping };
