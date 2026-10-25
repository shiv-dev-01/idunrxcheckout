/**
 * Build JSON body for POST /idunrx/api/createOrder_stripe
 */
export const buildCreateOrderStripeBody = ({
  email,
  firstName,
  lastName,
  phoneNumber,
  address,
  aptSuite,
  city,
  stateCode,
  postalCode,
  sameAsShipping,
  address2,
  city2,
  billingStateCode,
  postalCode2,
  appliedDiscount,
  productId,
  paymentToken,
  uniqueId,
  contactDetailsId,
}) => {
  const body = {
    email,
    first_name: firstName,
    last_name: lastName,
    phone: phoneNumber,
    address,
    city_name: city,
    state_name: stateCode,
    zip_code: postalCode,
    start_url: window.location.href,
    payment_token: paymentToken,
    product_id: productId,
    address2: aptSuite || "",
    billingSameAsShipping: sameAsShipping ? "YES" : "NO",
    promo_codes: appliedDiscount || null,
  };

  if (uniqueId) body.unique_id = uniqueId;
  if (contactDetailsId) body.contact_details_id = contactDetailsId;

  if (sameAsShipping) {
    body.billing_address = address;
    body.billing_address2 = aptSuite || "";
    body.billing_city_name = city;
    body.billing_state_name = stateCode;
    body.billing_zip_code = postalCode;
  } else {
    body.billing_address = address2 || "";
    body.billing_address2 = "";
    body.billing_city_name = city2 || "";
    body.billing_state_name = billingStateCode || "";
    body.billing_zip_code = postalCode2 || "";
  }

  return body;
};
