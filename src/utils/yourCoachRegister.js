// YOURCOACH_CHECKOUT a7f3c2e1-9b4d-4f8a-b6c2-1d8e5f0a3c7b

export const YOURCOACH_REGISTER_URL =
  "https://panel.whitelabelmd.com/idunrx/api/yourcoach/register";

export function normalizeGenderForYourCoach(gender) {
  const g = String(gender || "")
    .trim()
    .toLowerCase();
  if (!g) return "na";
  if (g === "male" || g === "m") return "male";
  if (g === "female" || g === "f") return "female";
  return g;
}

export function getYourCoachProductMeta(apiProduct) {
  if (!apiProduct) return null;
  const sku = String(apiProduct.sku || apiProduct.product_sku || "").trim();
  const product_category = String(
    apiProduct.category_name || apiProduct.product_category || "",
  ).trim();
  if (!sku || !product_category) return null;
  return { sku, product_category };
}

export function parseCreateOrderResult(data, orderIdFallback) {
  if (!data) return null;
  let result = null;
  if (Array.isArray(data)) {
    const first = data[0];
    result = first && typeof first === "object" ? first : null;
  } else if (typeof data === "object") {
    result = data;
  }
  if (result && result.order_id == null && orderIdFallback != null) {
    result = { ...result, order_id: orderIdFallback };
  }
  return result;
}

function isRegisterResponseSuccess(ok, data) {
  if (ok && data.success === true) return true;
  const msg = String(data.message || "").toLowerCase();
  return msg.includes("already registered");
}

function getMissingRequiredFields(orderResult, form, product) {
  if (orderResult?.status !== 1 || orderResult?.user_id == null) {
    return "order_not_success";
  }
  if (!String(form.first_name || "").trim()) return "missing_first_name";
  if (!String(form.last_name || "").trim()) return "missing_last_name";
  if (!String(form.email || "").trim()) return "missing_email";
  if (!String(form.phone || "").trim()) return "missing_phone";
  if (!String(form.state_name || "").trim()) return "missing_state";
  if (!String(form.zip_code || "").trim()) return "missing_zip_code";
  if (!product?.sku) return "missing_sku";
  if (!product?.product_category) return "missing_product_category";
  if (orderResult.order_id == null) return "missing_order_id";
  return null;
}

/**
 * Register member with YourCoach after order success.
 * Non-blocking: errors are logged; thank-you flow should continue.
 */
export async function registerYourCoachAfterOrder(
  orderResult,
  form,
  apiProduct,
) {
  const product = getYourCoachProductMeta(apiProduct);
  const missing = getMissingRequiredFields(orderResult, form, product);
  if (missing) {
    return { skipped: true, reason: missing };
  }

  const body = {
    member_id: String(orderResult.user_id),
    first_name: String(form.first_name).trim(),
    last_name: String(form.last_name).trim(),
    email: String(form.email).trim(),
    phone: String(form.phone).trim(),
    state: String(form.state_name).trim(),
    zipcode: String(form.zip_code).trim(),
    date_of_birth: form.date_of_birth || "1990-01-01",
    gender: normalizeGenderForYourCoach(form.gender),
    sku: product.sku,
    product_category: product.product_category,
    order_id: String(orderResult.order_id),
  };

  try {
    const res = await fetch(YOURCOACH_REGISTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!isRegisterResponseSuccess(res.ok, data)) {
      console.error("[YourCoach register]", res.status, data);
      return { success: false, error: data };
    }

    console.log("[YourCoach register] success", {
      member_id: body.member_id,
      order_id: body.order_id,
      sku: body.sku,
    });
    return { success: true, data };
  } catch (err) {
    console.error("[YourCoach register] failed", err);
    return { success: false, error: err };
  }
}
