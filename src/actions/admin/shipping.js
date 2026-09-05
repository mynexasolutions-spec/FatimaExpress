"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

const DEFAULT_SHIPPING = { free_threshold: 1000, dubai_fee: 25, courier_fee: 40 };

export async function getShippingSettings() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_settings").select("shipping").eq("id", 1).maybeSingle();
  return data?.shipping || DEFAULT_SHIPPING;
}

export async function updateShippingSettings(_prevState, formData) {
  const supabase = createAdminClient();
  const shipping = {
    free_threshold: Number(formData.get("free_threshold") || 0),
    dubai_fee: Number(formData.get("dubai_fee") || 0),
    courier_fee: Number(formData.get("courier_fee") || 0),
  };

  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, shipping, updated_at: new Date().toISOString() });

  if (error) return { error: error.message };

  revalidatePath("/admin/settings/shipping");
  revalidatePath("/checkout");
  revalidatePath("/");
  return { success: true };
}
