"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Banknote, CreditCard, Eye, Search } from "lucide-react";
import { formatAED } from "@/lib/format";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-brand-50 text-brand-700 border-brand-200",
  shipped: "bg-sky-50 text-sky-700 border-sky-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const paymentMeta = {
  cod: { label: "Cash on Delivery", icon: Banknote },
  transfer: { label: "Bank Transfer", icon: CreditCard },
};

export default function OrdersTable({ orders }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (status && order.status !== status) return false;
      if (!q) return true;
      const haystack = `${order.reference} ${order.customer_name} ${order.email} ${order.phone ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [orders, query, status]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by reference, customer, email or phone…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 text-sm capitalize text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100 sm:w-48"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table (sm and up) */}
      <div className="hidden overflow-x-auto rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-xs sm:block sm:p-6">
        {orders.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">No orders yet.</p>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">No orders match your search.</p>
        ) : (
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-1 font-medium">Reference</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Emirate</th>
                <th className="pb-3 font-medium">Payment</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Placed</th>
                <th className="pb-3 pr-1 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((order) => {
                const payment = paymentMeta[order.payment_method];
                return (
                  <tr key={order.id} className="group/row transition-colors duration-300 hover:bg-brand-50/30">
                    <td className="py-3.5 pl-1 pr-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-sm font-bold text-brand-800 group-hover/row:underline">
                        {order.reference}
                      </Link>
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="text-sm font-medium">{order.customer_name}</p>
                      <p className="text-xs text-slate-400">{order.email}</p>
                    </td>
                    <td className="py-3.5 pr-4 text-sm text-slate-500">{order.emirate}</td>
                    <td className="py-3.5 pr-4">
                      {payment ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <payment.icon size={13} className="text-slate-400" />
                          {payment.label}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 text-sm font-bold text-brand-800">{formatAED(order.total)}</td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${statusStyles[order.status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-slate-400">
                      {new Date(order.created_at).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}
                      <span className="block text-[11px] text-slate-300">
                        {new Date(order.created_at).toLocaleTimeString("en-AE", { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </td>
                    <td className="py-3.5 pr-1 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2 text-xs font-bold text-brand-700 transition-all duration-300 hover:border-brand-300 hover:bg-brand-100 hover:shadow-sm"
                      >
                        <Eye size={13} /> See Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Card list (mobile only) */}
      <div className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-xs sm:hidden">
        {orders.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">No orders yet.</p>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">No orders match your search.</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((order) => {
              const payment = paymentMeta[order.payment_method];
              return (
                <li key={order.id}>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="block rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold text-brand-800">{order.reference}</span>
                      <span className="text-sm font-bold text-slate-900">{formatAED(order.total)}</span>
                    </div>
                    <p className="mt-1 truncate text-xs font-medium text-slate-500">{order.customer_name}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${statusStyles[order.status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}
                      >
                        {order.status}
                      </span>
                      {payment && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                          <payment.icon size={12} />
                          {payment.label}
                        </span>
                      )}
                      <span className="ml-auto text-xs font-medium text-slate-400">
                        {new Date(order.created_at).toLocaleDateString("en-AE", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-700">
                      <Eye size={13} /> See Details
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
