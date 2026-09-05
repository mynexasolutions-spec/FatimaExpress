"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getAllCouponsAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function getCouponById(id) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("coupons").select("*").eq("id", id).maybeSingle();
  return data;
}

function parseCouponFields(formData) {
  return {
    code: (formData.get("code") || "").toUpperCase().trim(),
    discount_type: formData.get("discount_type") === "flat" ? "flat" : "percent",
    discount_value: Number(formData.get("discount_value") || 0),
    min_order: Number(formData.get("min_order") || 0),
    is_active: formData.get("is_active") === "on",
    expires_at: formData.get("expires_at") || null,
  };
}

export async function createCoupon(_prevState, formData) {
  const supabase = createAdminClient();
  const fields = parseCouponFields(formData);
  if (!fields.code) return { error: "Coupon code is required." };

  const { error } = await supabase.from("coupons").insert(fields);
  if (error) return { error: error.code === "23505" ? "That coupon code already exists." : error.message };

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function updateCoupon(_prevState, formData) {
  const supabase = createAdminClient();
  const id = formData.get("id");
  const fields = parseCouponFields(formData);
  if (!id || !fields.code) return { error: "Coupon code is required." };

  const { error } = await supabase.from("coupons").update(fields).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCoupon(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/coupons");
  return { success: true };
}
