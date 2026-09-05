import { createPublicClient, publicCatalogEnabled } from "@/lib/supabase/publicClient";
import { FREE_DELIVERY_THRESHOLD, DUBAI_DELIVERY_FEE, COURIER_FEE } from "@/lib/shipping";

const DEFAULT_SHIPPING = {
  free_threshold: FREE_DELIVERY_THRESHOLD,
  dubai_fee: DUBAI_DELIVERY_FEE,
  courier_fee: COURIER_FEE,
};

export async function getShippingSettingsPublic() {
  if (publicCatalogEnabled) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase.from("site_settings").select("shipping").eq("id", 1).maybeSingle();
      if (!error && data?.shipping) return data.shipping;
    } catch {
      // fall through to defaults
    }
  }

  return DEFAULT_SHIPPING;
}

export async function validateCoupon(code, subtotal) {
  if (!code?.trim()) return { error: "Enter a coupon code." };
  if (!publicCatalogEnabled) return { error: "Coupons are not available right now." };

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .ilike("code", code.trim())
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) return { error: "That coupon code is not valid." };
    if (data.expires_at && new Date(data.expires_at) < new Date()) return { error: "That coupon has expired." };
    if (subtotal < Number(data.min_order)) {
      return { error: `This coupon needs a minimum order of AED ${data.min_order}.` };
    }

    const discount =
      data.discount_type === "percent" ? (subtotal * Number(data.discount_value)) / 100 : Number(data.discount_value);

    return { coupon: { code: data.code, type: data.discount_type, value: Number(data.discount_value) }, discount: Math.min(discount, subtotal) };
  } catch {
    return { error: "Could not validate that coupon. Please try again." };
  }
}
