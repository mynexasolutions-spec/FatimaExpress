"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, ChevronRight, LoaderCircle, LogOut, Package, Search, ShieldAlert, Sparkles, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatAED } from "@/lib/format";
import ProfileCard from "./ProfileCard";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  confirmed: "bg-purple-50 text-[#7E22CE] border border-purple-200",
  shipped: "bg-sky-50 text-sky-700 border border-sky-200",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

const TABS = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "orders", label: "Order History", icon: Package },
];

export default function AccountPage() {
  const { user, loading, signOut, supabase } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const loadingOrders = Boolean(supabase && user) && orders === null;

  useEffect(() => {
    if (!supabase || !user) return;
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
      });
  }, [supabase, user]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (status && order.status !== status) return false;
      if (!q) return true;
      return order.reference?.toLowerCase().includes(q);
    });
  }, [orders, query, status]);

  if (loading) {
    return (
      <div className="container-page grid place-items-center py-24 min-h-[60vh]">
        <LoaderCircle size={32} className="animate-spin text-[#7E22CE]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative overflow-hidden bg-[#FAF9FC] min-h-[75vh] flex items-center py-20">
        <div className="container-page text-center font-sans max-w-lg mx-auto">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-purple-50 text-[#7E22CE] border border-purple-100 shadow-xs">
            <ShieldAlert size={36} />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-slate-900">Sign in to view account</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500 font-medium">Log in or create a customer account to track wholesale orders and manage profiles.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/login" className="rounded-xl bg-[#7E22CE] hover:bg-[#6B21A8] px-7 py-3.5 text-sm font-extrabold text-white shadow-md shadow-purple-200 transition-all active:scale-95">
              Sign In
            </Link>
            <Link href="/register" className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-all active:scale-95">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const meta = user.user_metadata ?? {};
  const memberSince = new Date(user.created_at).toLocaleDateString("en-AE", { month: "long", year: "numeric" });

  return (
    <div className="bg-[#FAF9FC] min-h-[calc(100vh-4rem)] font-sans pb-16">
      {/* Account Top Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-[#2A0E4E] py-10 lg:py-14 text-white">
        <div className="container-page max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Customer Dashboard</span>
              <h1 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                Welcome, {meta.full_name || "Valued Customer"}
              </h1>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-bold text-purple-100 backdrop-blur-md">
              <Sparkles size={15} className="text-purple-300" />
              Fatima Wholesale Member
            </span>
          </div>
        </div>
      </section>

      <div className="container-page max-w-6xl py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Navigation */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex flex-col items-center text-center">
                <span className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-[#7E22CE] to-purple-800 text-3xl font-black text-white shadow-md shadow-purple-200">
                  {(meta.full_name || user.email || "?").charAt(0).toUpperCase()}
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-slate-900">{meta.full_name || "Customer Account"}</h2>
                <p className="mt-0.5 truncate text-xs sm:text-sm font-medium text-slate-500 max-w-[220px]">{user.email}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-xs font-bold text-[#7E22CE]">
                  <Calendar size={13} />
                  Member since {memberSince}
                </span>
              </div>

              <nav className="mt-6 space-y-1.5 border-t border-slate-100 pt-5">
                {TABS.map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-extrabold transition-all duration-200 ${
                        active ? "bg-[#7E22CE] text-white shadow-md shadow-purple-200" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <tab.icon size={18} className={active ? "text-white" : "text-slate-400"} />
                      {tab.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={18} className="text-slate-400" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div>
            {activeTab === "profile" && <ProfileCard user={user} supabase={supabase} />}

            {activeTab === "orders" && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="font-display text-xl font-bold text-slate-900">Order History</h2>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-medium">Track wholesale order statuses and view past invoices.</p>
                  </div>
                  {orders?.length > 0 && (
                    <span className="rounded-full bg-purple-50 border border-purple-100 px-3.5 py-1 text-xs font-bold text-[#7E22CE]">
                      {orders.length} Total Orders
                    </span>
                  )}
                </div>

                {loadingOrders ? (
                  <div className="grid place-items-center py-16">
                    <LoaderCircle size={28} className="animate-spin text-[#7E22CE]" />
                  </div>
                ) : !orders?.length ? (
                  <div className="py-16 text-center">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-purple-50 text-[#7E22CE] mb-3">
                      <Package size={28} />
                    </div>
                    <p className="text-base font-bold text-slate-800">No orders placed yet</p>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">Explore our wholesale balloons and party supplies collection.</p>
                    <Link href="/shop" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#7E22CE] px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-purple-200 transition hover:bg-[#6B21A8]">
                      Start Shopping
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="relative flex-1">
                        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search by order reference…"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#7E22CE] focus:bg-white focus:ring-4 focus:ring-purple-100"
                        />
                      </div>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 text-xs sm:text-sm font-semibold capitalize text-slate-900 outline-none transition focus:border-[#7E22CE] focus:bg-white focus:ring-4 focus:ring-purple-100 sm:w-48 cursor-pointer"
                      >
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="capitalize">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {filteredOrders.length === 0 ? (
                      <p className="py-12 text-center text-sm font-semibold text-slate-400">No orders match your filter criteria.</p>
                    ) : (
                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        {filteredOrders.map((order) => {
                          const orderItems = Array.isArray(order.items) ? order.items : [];
                          return (
                            <Link
                              key={order.id}
                              href={`/account/orders/${order.id}`}
                              className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md hover:shadow-purple-50"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate font-black text-slate-900 text-base">{order.reference}</p>
                                  <p className="mt-0.5 text-xs font-semibold text-slate-400">
                                    {new Date(order.created_at).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}
                                  </p>
                                </div>
                                <span
                                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold capitalize ${
                                    statusStyles[order.status] ?? "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>

                              <p className="mt-3 text-xs font-semibold text-slate-500">
                                {orderItems.length} item{orderItems.length === 1 ? "" : "s"} included
                              </p>

                              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
                                <p className="font-display text-lg font-black text-[#7E22CE]">{formatAED(order.total)}</p>
                                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#7E22CE] group-hover:underline">
                                  View Details
                                  <ChevronRight size={15} />
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
