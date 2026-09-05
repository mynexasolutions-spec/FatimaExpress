"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getDashboardStats() {
  const supabase = createAdminClient();

  const [
    { data: orders, count: orderCount },
    { count: productCount },
    { count: categoryCount },
    { data: lowStock },
    { data: recentOrders },
    { count: unresolvedInquiryCount },
    { count: pendingReviewCount },
  ] = await Promise.all([
    supabase.from("orders").select("total, status", { count: "exact" }),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id, name, stock_quantity").lte("stock_quantity", 5).eq("is_active", true).order("stock_quantity", { ascending: true }),
    supabase.from("orders").select("id, reference, total, status, created_at").order("created_at", { ascending: false }).limit(6),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_resolved", false),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_approved", false),
  ]);

  const revenue = (orders || [])
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = (orders || []).filter((o) => o.status === "pending").length;

  return {
    orderCount: orderCount || 0,
    productCount: productCount || 0,
    categoryCount: categoryCount || 0,
    revenue,
    pendingOrders,
    lowStock: lowStock || [],
    recentOrders: recentOrders || [],
    unresolvedInquiryCount: unresolvedInquiryCount || 0,
    pendingReviewCount: pendingReviewCount || 0,
  };
}

export async function getSidebarBadgeCounts() {
  const supabase = createAdminClient();

  const [{ count: pendingOrders }, { count: unresolvedInquiryCount }, { count: pendingReviewCount }] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_resolved", false),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_approved", false),
  ]);

  return {
    pendingOrders: pendingOrders || 0,
    unresolvedInquiryCount: unresolvedInquiryCount || 0,
    pendingReviewCount: pendingReviewCount || 0,
  };
}
