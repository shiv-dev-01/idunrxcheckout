// ============================================================
// impact.com Client-Side Integration (UTT + Identify + trackConversion)
// Program ID: 52708 | Account: 7283073
// ============================================================

export const IMPACT_PROGRAM_ID = "52708";
export const IMPACT_EVENT_INITIAL_PURCHASE = 74027;
export const IMPACT_EVENT_APPROVED_PURCHASE = 74028;
export const IMPACT_EVENT_RECURRING_SUBSCRIPTION = 74029;

const CLICK_ID_COOKIE = "im_ref";
const PROFILE_ID_COOKIE = "impact_custom_profile_id";
const CUSTOMER_ID_COOKIE = "impact_customer_id";
const COOKIE_DAYS = 30;
const UTT_WAIT_MS = 8000;

const isProductionHost = () => {
  const host = window.location.hostname;
  return host === "idunrx.com" || host.endsWith(".idunrx.com");
};

/** impact.com only allows verifySiteDefinitionMatch on registered production domains */
const shouldVerifySiteDefinition = () => isProductionHost();

/**
 * Wait until the UTT script has loaded (set in public/index.html onload).
 * Calls queued on window.ire before load are replayed by impact's library.
 */
export const waitForImpactUtt = (timeoutMs = UTT_WAIT_MS) =>
  new Promise((resolve) => {
    if (window.__impactUttReady) {
      resolve(true);
      return;
    }
    if (window.__impactUttError) {
      console.error(
        "[impact.com] UTT blocked or failed. Disable ad blockers and allow utt.impactcdn.com + idunrx.pxf.io"
      );
      resolve(false);
      return;
    }

    const started = Date.now();
    const tick = () => {
      if (window.__impactUttReady) {
        resolve(true);
        return;
      }
      if (window.__impactUttError || Date.now() - started >= timeoutMs) {
        if (!window.__impactUttError) {
          console.warn(
            "[impact.com] UTT load timed out. Check Network for utt.impactcdn.com (blocked or slow)."
          );
        }
        resolve(false);
        return;
      }
      setTimeout(tick, 50);
    };
    tick();
  });

const callIre = (...args) => {
  if (typeof window.ire !== "function") {
    console.warn("[impact.com] window.ire missing — UTT snippet not on page:", args[0]);
    return false;
  }
  window.ire(...args);
  return true;
};

const getCookieValue = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

const setCookie = (name, value, days = COOKIE_DAYS) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

const createUuid = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const sha1Email = async (email) => {
  if (!email || !email.trim()) return "";
  const normalized = email.trim().toLowerCase();
  const data = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const getOrCreateCustomProfileId = () => {
  let profileId = getCookieValue(PROFILE_ID_COOKIE);
  if (!profileId) {
    profileId = createUuid();
    setCookie(PROFILE_ID_COOKIE, profileId);
  }
  return profileId;
};

const pickIdField = (obj, keys) => {
  if (!obj || typeof obj !== "object") return null;
  for (const key of keys) {
    const value = obj[key];
    if (value != null && value !== "") return String(value);
  }
  return null;
};

/** Parse order id(s) from createOrder API responses (handles nested / alternate field names). */
export const extractOrderIdsFromApiResponse = (data) => {
  if (!data) return [];

  const orderKeys = ["order_id", "orderId", "orderid", "id"];

  if (Array.isArray(data)) {
    return data.map((entry) => pickIdField(entry, orderKeys)).filter(Boolean);
  }

  if (Array.isArray(data.orders)) {
    return data.orders
      .map((entry) => pickIdField(entry, orderKeys))
      .filter(Boolean);
  }

  if (Array.isArray(data.order_ids)) {
    return data.order_ids.map(String).filter(Boolean);
  }

  if (Array.isArray(data.success_orders)) {
    return data.success_orders.map(String).filter(Boolean);
  }

  const nested = data.data;
  if (nested && nested !== data) {
    const fromNested = extractOrderIdsFromApiResponse(nested);
    if (fromNested.length) return fromNested;
  }

  const single = pickIdField(data, orderKeys);
  return single ? [single] : [];
};

/** Parse customer id from createOrder API responses. */
export const extractCustomerIdFromApiResponse = (data) => {
  if (!data) return "";

  const customerKeys = [
    "customer_id",
    "customerId",
    "customerid",
    "unique_id",
    "uniqueId",
    "user_id",
    "userId",
    "contact_details_id",
    "contactDetailsId",
  ];

  const sources = Array.isArray(data) ? data : [data, data.data].filter(Boolean);

  for (const source of sources) {
    const id = pickIdField(source, customerKeys);
    if (id) return id;
  }

  return "";
};

export const persistImpactCustomerId = (customerId) => {
  if (customerId) setCookie(CUSTOMER_ID_COOKIE, String(customerId));
};

export const getPersistedImpactCustomerId = () =>
  getCookieValue(CUSTOMER_ID_COOKIE) || "";

/** Resolve impact.com customerId from URL state, checkout context, or API. */
export const resolveImpactCustomerId = ({
  uniqueId = "",
  contactDetailsId = "",
  apiCustomerId = "",
} = {}) => {
  const resolved =
    uniqueId ||
    contactDetailsId ||
    apiCustomerId ||
    getPersistedImpactCustomerId() ||
    "";

  if (resolved) persistImpactCustomerId(resolved);
  return String(resolved);
};

export const captureImpactClickId = () => {
  const params = new URLSearchParams(window.location.search);
  const clickId =
    params.get("im_ref") || params.get("irclickid") || getCookieValue(CLICK_ID_COOKIE);

  if (clickId) {
    setCookie(CLICK_ID_COOKIE, clickId);
    console.log("[impact.com] click id captured:", clickId);
    return clickId;
  }
  return null;
};

export const getImpactClickId = () => getCookieValue(CLICK_ID_COOKIE);

export const identifyImpactUser = async ({
  customerId = "",
  customerEmail = "",
} = {}) => {
  try {
    const uttReady = await waitForImpactUtt();
    if (!uttReady) return;

    const customProfileId = getOrCreateCustomProfileId();
    const hashedEmail =
      customerEmail && customerEmail.trim()
        ? await sha1Email(customerEmail)
        : "";

    callIre("identify", {
      customerId: customerId ? String(customerId) : "",
      customerEmail: hashedEmail,
      customProfileId,
    });

    console.log("[impact.com] identify sent — check Network for /xur/ /cur/ /ur/ + 52708", {
      customProfileId,
      host: window.location.hostname,
    });
  } catch (err) {
    console.error("[impact.com] identify error:", err);
  }
};

const buildLineItems = (products = []) =>
  products.map((product) => {
    const price = parseFloat(product.product_price) || 0;
    const qty = parseInt(product.quantity, 10) || 1;
    return {
      subTotal: parseFloat((price * qty).toFixed(2)),
      category: product.category || product.product_category || "Product",
      sku: String(product.product_sku || product.product_id || "unknown"),
      quantity: qty,
      name: product.product_name || "",
    };
  });

const parseMoneyAmount = (value) => {
  if (value == null || value === "") return 0;
  const n = parseFloat(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const calcOrderDiscount = (subtotal, discountPercent, discountAmount) => {
  if (discountPercent && discountPercent !== "0.00") {
    return parseFloat(
      ((subtotal * parseMoneyAmount(discountPercent)) / 100).toFixed(2)
    );
  }
  if (discountAmount) {
    return parseFloat(parseMoneyAmount(discountAmount).toFixed(2));
  }
  return 0;
};

export const trackImpactConversion = async (orderData) => {
  try {
    const uttReady = await waitForImpactUtt();
    if (!uttReady) return;

    const {
      orderId,
      total,
      coupon,
      email,
      customerStatus = "New",
      products = [],
      discountPercent,
      discountAmount,
      clickId,
      eventId = IMPACT_EVENT_INITIAL_PURCHASE,
    } = orderData;

    const customProfileId = getOrCreateCustomProfileId();
    const customerEmail = email ? await sha1Email(email) : "";
    const storedClickId = clickId || getImpactClickId();

    const subtotal = products.reduce((sum, p) => {
      const price = parseFloat(p.product_price) || 0;
      const qty = parseInt(p.quantity, 10) || 1;
      return sum + price * qty;
    }, 0);

    const orderDiscount = calcOrderDiscount(
      subtotal || parseFloat(total) || 0,
      discountPercent,
      discountAmount
    );

    const items = buildLineItems(products);

    const normalizedOrderId =
      orderId != null &&
      orderId !== "" &&
      String(orderId) !== "undefined" &&
      String(orderId) !== "null"
        ? String(orderId)
        : "";

    if (!normalizedOrderId) {
      console.error("[impact.com] trackConversion skipped — orderId is missing");
      return;
    }

    // Team requirement: custid is always the order id (not API/URL/cookie customer ids).
    const payload = {
      orderId: normalizedOrderId,
      customProfileId,
      customerId: normalizedOrderId,
      customerEmail,
      customerStatus,
      currencyCode: "USD",
      orderPromoCode: coupon || "",
      orderDiscount,
      ...(storedClickId ? { clickId: storedClickId } : {}),
      ...(items.length > 0
        ? { items }
        : {
            items: [
              {
                subTotal: parseFloat(parseFloat(total).toFixed(2)) || 0,
                category: "Product",
                sku: normalizedOrderId,
                quantity: 1,
                name: "Order",
              },
            ],
          }),
    };

    const verifySite = shouldVerifySiteDefinition();
    const fired = callIre(
      "trackConversion",
      eventId,
      payload,
      { verifySiteDefinitionMatch: verifySite }
    );

    if (fired) {
      console.log(
        "[impact.com] trackConversion sent — check Network for idunrx.pxf.io",
        {
          eventId,
          orderId: normalizedOrderId,
          customerId: normalizedOrderId,
          verifySiteDefinitionMatch: verifySite,
          host: window.location.hostname,
        }
      );
    }
  } catch (err) {
    console.error("[impact.com] trackConversion error:", err);
  }
};
