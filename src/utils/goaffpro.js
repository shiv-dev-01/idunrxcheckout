// ============================================================
// GoAffPro Affiliate Integration Utility
// ============================================================
// The GoAffPro loader script (in public/index.html) automatically
// tracks visitors arriving via ?ref= / ?a_aid= affiliate links.
// ============================================================

export const GOAFFPRO_ORDER_CONTEXT_KEY = "idunrx_goaffpro_order_context";
const LOADER_WAIT_MS = 10000;

const buildLineItems = (products) => {
  if (!Array.isArray(products) || products.length === 0) return [];

  return products.map((product) => ({
    name: product.product_name || "Product",
    quantity: parseInt(product.quantity, 10) || 1,
    price: parseFloat(product.product_price ?? product.price) || 0,
    sku: product.product_sku || product.sku || String(product.product_id || ""),
    product_id: String(product.product_id || ""),
  }));
};

const computeSubtotal = (products) => {
  if (!Array.isArray(products) || products.length === 0) return null;

  return products.reduce((sum, product) => {
    const qty = parseInt(product.quantity, 10) || 1;
    const price = parseFloat(product.product_price ?? product.price) || 0;
    return sum + price * qty;
  }, 0);
};

const readRefCookie = () => {
  if (typeof window.gfpGetCookie === "function") {
    return window.gfpGetCookie("ref")?.trim() || null;
  }
  const match = document.cookie.match(/(?:^|;\s*)ref=([^;]+)/);
  return match ? decodeURIComponent(match[1]).trim() : null;
};

/** Tell GoAffPro loader to set the ref cookie (async via custom event). */
export const syncGoAffProRefCookie = (ref) => {
  if (!ref || typeof window === "undefined") return;
  try {
    window.dispatchEvent(
      new CustomEvent("goaffproReferralCode", { detail: { ref } }),
    );
  } catch {
    /* ignore */
  }
};

/** GoAffPro POST uses ref *cookie*, not payload.referrer — set synchronously before convert. */
export const ensureGoAffProRefCookie = (ref) => {
  if (!ref) return;
  if (typeof window.gfpSetCookie === "function") {
    window.gfpSetCookie("ref", ref);
    return;
  }
  syncGoAffProRefCookie(ref);
};

export const waitForGoAffProLoader = (timeoutMs = LOADER_WAIT_MS) =>
  new Promise((resolve) => {
    if (typeof window.goaffproTrackConversion === "function") {
      resolve(true);
      return;
    }
    if (window.__goaffproError) {
      console.error(
        "[GoAffPro] Loader blocked or failed — allow api.goaffpro.com",
      );
      resolve(false);
      return;
    }

    const onReady = () => {
      cleanup();
      resolve(typeof window.goaffproTrackConversion === "function");
    };

    const cleanup = () => {
      window.removeEventListener("goaffproScriptLoaded", onReady);
      clearInterval(poll);
      clearTimeout(timeout);
    };

    window.addEventListener("goaffproScriptLoaded", onReady);

    const poll = setInterval(() => {
      if (typeof window.goaffproTrackConversion === "function") {
        onReady();
      }
    }, 50);

    const timeout = setTimeout(() => {
      cleanup();
      console.warn("[GoAffPro] Loader timed out.");
      resolve(false);
    }, timeoutMs);
  });

export const saveGoAffProOrderContext = (context) => {
  try {
    sessionStorage.setItem(GOAFFPRO_ORDER_CONTEXT_KEY, JSON.stringify(context));
  } catch {
    /* ignore */
  }
};

export const loadGoAffProOrderContext = () => {
  try {
    const raw = sessionStorage.getItem(GOAFFPRO_ORDER_CONTEXT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Fires a GoAffPro conversion event after a successful order.
 * @returns {boolean} whether conversion was sent
 */
export const trackGoAffProConversion = (orderData) => {
  try {
    const {
      orderId,
      total,
      products,
      email,
      firstName,
      lastName,
      phone,
      coupon,
      referrer,
    } = orderData;

    if (typeof window.goaffproTrackConversion === "undefined") {
      console.warn("[GoAffPro] Loader script not ready yet.");
      return false;
    }

    if (referrer) {
      ensureGoAffProRefCookie(referrer);
    }

    const refCookie = readRefCookie();
    const visitId =
      typeof window.gfpGetCookie === "function"
        ? window.gfpGetCookie("gfp_v_id")
        : null;
    console.log("[GoAffPro] pre-conversion cookies:", {
      refCookie,
      visitId,
      payloadReferrer: referrer || null,
    });

    if (referrer && refCookie !== referrer) {
      console.warn(
        "[GoAffPro] ref cookie mismatch — sale may not attribute to affiliate. Expected:",
        referrer,
        "Got:",
        refCookie,
      );
    }

    const orderTotal = parseFloat(total) || 0;
    const lineItems = buildLineItems(products || []);
    const subtotal = computeSubtotal(products) ?? orderTotal;
    const discount = Math.max(0, parseFloat((subtotal - orderTotal).toFixed(2)));

    window.goaffpro_order = {
      id: String(orderId),
      number: String(orderId),
      total: orderTotal.toFixed(2),
      subtotal: parseFloat(subtotal).toFixed(2),
      discount,
      currency: "USD",
      date: new Date().toISOString(),
      forceSDK: true,
      status: "approved",
      line_items: lineItems,
    };

    if (coupon) {
      window.goaffpro_order.coupons = [coupon];
    }

    if (email || firstName || lastName || phone) {
      window.goaffpro_order.customer = {
        ...(firstName && { first_name: firstName }),
        ...(lastName && { last_name: lastName }),
        ...(email && { email }),
        ...(phone && { phone }),
      };
    }

    if (referrer) {
      window.goaffpro_order.referrer = referrer;
    }

    window.goaffproTrackConversion(window.goaffpro_order);
    console.log("[GoAffPro] Conversion tracked:", orderId, window.goaffpro_order);
    return true;
  } catch (err) {
    console.error("[GoAffPro] Error during conversion tracking:", err);
    return false;
  }
};

export const trackGoAffProConversionAsync = async (orderData) => {
  const ready = await waitForGoAffProLoader();
  if (!ready) return false;
  if (orderData.referrer) {
    ensureGoAffProRefCookie(orderData.referrer);
    if (!readRefCookie() && orderData.referrer) {
      await new Promise((r) => setTimeout(r, 150));
    }
  }
  return trackGoAffProConversion(orderData);
};

/**
 * Capture GoAffPro referral param from URL (?ref= or ?a_aid=) or hash (#a_aid=).
 */
export const captureGoAffProReferrer = () => {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("ref") || params.get("a_aid");
  if (fromQuery) {
    ensureGoAffProRefCookie(fromQuery);
    return fromQuery;
  }

  const hash = window.location.hash.replace(/^#/, "");
  if (hash) {
    const hashParams = new URLSearchParams(hash);
    const fromHash = hashParams.get("a_aid") || hashParams.get("ref");
    if (fromHash) {
      ensureGoAffProRefCookie(fromHash);
      return fromHash;
    }
  }

  return null;
};
