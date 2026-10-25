import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent_stripe } from "./Constant";

const LIVE_PUBLISHABLE_KEY =
  "pk_live_51THsHkFnVfxnZqKdh2xpXFy9qoqXHfVspyS6vIAPBKUgjvCo4cNX6wVQMgnpqrktgBzfQgSzw7NxMsOTACAGgooS00ut20eUvx";

// Live publishable key — override via REACT_APP_STRIPE_PUBLISHABLE_KEY in .env
export const STRIPE_PUBLISHABLE_KEY =
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || LIVE_PUBLISHABLE_KEY;

/** Same panel route as funnel checkouts; optional REACT_APP_STRIPE_PAYMENT_INTENT_URL override. */
export const getStripePaymentIntentUrl = () => {
  const envUrl = process.env.REACT_APP_STRIPE_PAYMENT_INTENT_URL?.trim();
  if (envUrl) return envUrl;
  return createPaymentIntent_stripe;
};

export const isTestPublishableKey = () =>
  !!STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_");

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const stripeAppearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#c8ad68",
    colorBackground: "#ffffff",
    colorText: "#111111",
    colorDanger: "#ef4444",
    fontFamily: "system-ui, sans-serif",
    borderRadius: "8px",
  },
  rules: {
    ".Input": {
      border: "1px solid #e2e8f0",
      padding: "12px 16px",
    },
    ".Input:focus": {
      border: "1px solid #c8ad68",
      boxShadow: "0 0 0 3px rgba(200, 173, 104, 0.2)",
    },
  },
};

const META_VALUE_MAX = 500;

export const truncateStripeMeta = (value, max = META_VALUE_MAX) =>
  String(value ?? "").trim().slice(0, max);

/** Request body for panel create-payment-intent (includes billing fields for metadata). */
export const buildStripePaymentIntentRequestBody = (payload) => {
  const firstName = truncateStripeMeta(payload.firstName);
  const lastName = truncateStripeMeta(payload.lastName);
  const address = truncateStripeMeta(payload.address);
  const city = truncateStripeMeta(payload.city);
  const state = truncateStripeMeta(payload.state);
  const zip = truncateStripeMeta(payload.zip);
  const promoCode = truncateStripeMeta(payload.promoCode);

  return {
    email: payload.email,
    phone: truncateStripeMeta(payload.phone),
    promoCode,
    coupon: promoCode,
    firstName,
    lastName,
    // snake_case aliases — panel order API uses these names
    first_name: firstName,
    last_name: lastName,
    address,
    address2: truncateStripeMeta(payload.address2),
    city,
    city_name: city,
    state,
    state_name: state,
    zip,
    zip_code: zip,
    productName: payload.productName || "",
    sku: payload.sku || "",
    amount: payload.amount,
    currency: (payload.currency || "usd").toLowerCase(),
    productId: String(payload.productId || ""),
  };
};

export const createStripePaymentIntent = async (payload) => {
  const body = buildStripePaymentIntentRequestBody(payload);

  const response = await fetch(getStripePaymentIntentUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Payment setup failed (${response.status})`);
  }

  const clientSecret = data.clientSecret || data.client_secret;
  if (!clientSecret) {
    throw new Error("No client secret returned from payment server");
  }

  return clientSecret;
};

/**
 * Confirm with Stripe that payment succeeded before creating an order.
 * @returns {Promise<object>} paymentIntent
 */
export const verifyStripePaymentSucceeded = async (
  paymentIntentId,
  clientSecret
) => {
  if (!clientSecret) {
    throw new Error("Missing payment verification secret");
  }

  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error("Stripe is not loaded");
  }

  const { paymentIntent, error } =
    await stripe.retrievePaymentIntent(clientSecret);

  if (error) {
    throw new Error(error.message || "Could not verify payment");
  }

  if (!paymentIntent || paymentIntent.status !== "succeeded") {
    throw new Error(
      paymentIntent?.status
        ? `Payment not completed (${paymentIntent.status})`
        : "Payment verification failed"
    );
  }

  if (paymentIntentId && paymentIntent.id !== paymentIntentId) {
    throw new Error("Payment intent ID mismatch");
  }

  return paymentIntent;
};

/** User-facing message after Amazon Pay / Klarna redirect failure */
export const resolveStripeRedirectFailureMessage = async (
  clientSecret,
  redirectStatus
) => {
  if (redirectStatus === "canceled") {
    return "Payment was canceled. Please try again or choose another payment method.";
  }

  let detailMessage = "";
  if (clientSecret) {
    try {
      const stripe = await stripePromise;
      if (stripe) {
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        detailMessage = paymentIntent?.last_payment_error?.message || "";
      }
    } catch {
      /* use fallback below */
    }
  }

  if (detailMessage) return detailMessage;

  if (redirectStatus === "failed") {
    return "Your payment could not be completed. Please try again or use a different payment method.";
  }

  if (redirectStatus && redirectStatus !== "succeeded") {
    return `Payment was not completed (${redirectStatus}). Please try again.`;
  }

  return "Payment failed. Please try again or use a different payment method.";
};
