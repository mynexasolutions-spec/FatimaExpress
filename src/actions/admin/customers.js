"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getAllCustomers() {
  const supabase = createAdminClient();

  const [{ data: userList }, { data: orders }] = await Promise.all([
    supabase.auth.admin.listUsers({ perPage: 200 }),
    supabase.from("orders").select("email, total"),
  ]);

  const orderStats = {};
  for (const order of orders || []) {
    const key = order.email?.toLowerCase();
    if (!key) continue;
    if (!orderStats[key]) orderStats[key] = { count: 0, total: 0 };
    orderStats[key].count += 1;
    orderStats[key].total += Number(order.total);
  }

  return (userList?.users || [])
    .map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || null,
      phone: user.user_metadata?.phone || null,
      company: user.user_metadata?.company || null,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at,
      orderCount: orderStats[user.email?.toLowerCase()]?.count || 0,
      totalSpent: orderStats[user.email?.toLowerCase()]?.total || 0,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
