const SNAPSHOT_KEY = "idunrx_checkout_snapshot";
const FAILURE_KEY = "idunrx_stripe_payment_failure";
const processedKey = (paymentIntentId) => `idunrx_pi_processed_${paymentIntentId}`;
const returnHandledKey = (paymentIntentId) =>
  `idunrx_stripe_return_handled_${paymentIntentId}`;

export const saveCheckoutSnapshot = (snapshot) => {
  try {
    sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch (e) {
    console.warn("[stripe] could not save checkout snapshot", e);
  }
};

export const loadCheckoutSnapshot = () => {
  try {
    const raw = sessionStorage.getItem(SNAPSHOT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearCheckoutSnapshot = () => {
  try {
    sessionStorage.removeItem(SNAPSHOT_KEY);
  } catch {
    /* ignore */
  }
};

export const isPaymentIntentProcessed = (paymentIntentId) =>
  sessionStorage.getItem(processedKey(paymentIntentId)) === "1";

export const markPaymentIntentProcessed = (paymentIntentId) => {
  try {
    sessionStorage.setItem(processedKey(paymentIntentId), "1");
  } catch {
    /* ignore */
  }
};

/** Remove Stripe return params so refresh does not re-trigger order creation */
export const cleanStripeReturnParamsFromUrl = () => {
  const url = new URL(window.location.href);
  [
    "payment_intent",
    "payment_intent_client_secret",
    "redirect_status",
  ].forEach((key) => url.searchParams.delete(key));
  window.history.replaceState({}, "", url.toString());
};

export const getStripeReturnParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    paymentIntentId: params.get("payment_intent"),
    clientSecret: params.get("payment_intent_client_secret"),
    redirectStatus: params.get("redirect_status"),
  };
};

export const buildReturnUrl = () => {
  const url = new URL(window.location.href);
  [
    "payment_intent",
    "payment_intent_client_secret",
    "redirect_status",
  ].forEach((key) => url.searchParams.delete(key));
  return url.toString();
};

/** Survives StrictMode remounts so wallet redirect failures stay visible */
export const persistStripePaymentFailure = (message, paymentIntentId = "") => {
  try {
    sessionStorage.setItem(
      FAILURE_KEY,
      JSON.stringify({ message, paymentIntentId, ts: Date.now() })
    );
  } catch {
    /* ignore */
  }
};

export const loadStripePaymentFailure = () => {
  try {
    const raw = sessionStorage.getItem(FAILURE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearStripePaymentFailure = () => {
  try {
    sessionStorage.removeItem(FAILURE_KEY);
  } catch {
    /* ignore */
  }
};

export const isStripeReturnHandled = (paymentIntentId) =>
  sessionStorage.getItem(returnHandledKey(paymentIntentId)) === "1";

export const markStripeReturnHandled = (paymentIntentId) => {
  try {
    sessionStorage.setItem(returnHandledKey(paymentIntentId), "1");
  } catch {
    /* ignore */
  }
};
