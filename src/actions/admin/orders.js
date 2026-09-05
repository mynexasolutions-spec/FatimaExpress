"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getAllOrdersAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("id, reference, customer_name, email, phone, emirate, total, status, payment_method, created_at")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getOrderById(id) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function updateOrderStatus(orderId, status) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
