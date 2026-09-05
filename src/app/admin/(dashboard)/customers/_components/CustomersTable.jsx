"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { formatAED } from "@/lib/format";

const initials = (name) =>
  (name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function CustomersTable({ customers }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => {
      const haystack = `${c.fullName ?? ""} ${c.email ?? ""} ${c.company ?? ""} ${c.phone ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [customers, query]);

  return (
    <div className="overflow-x-auto rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-xs sm:p-6">
      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email or company…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
        />
      </div>

      {customers.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No customers have registered yet.</p>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No customers match your search.</p>
      ) : (
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="pb-3 pl-1 font-medium">Customer</th>
              <th className="pb-3 font-medium">Contact</th>
              <th className="pb-3 font-medium">Orders</th>
              <th className="pb-3 font-medium">Total Spent</th>
              <th className="pb-3 pr-1 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((customer) => (
              <tr key={customer.id} className="transition-colors duration-300 hover:bg-brand-50/30">
                <td className="py-3.5 pl-1 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                      {initials(customer.fullName)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{customer.fullName || "—"}</p>
                      {customer.company && <p className="truncate text-xs text-slate-400">{customer.company}</p>}
                    </div>
                  </div>
                </td>
                <td className="py-3.5 pr-4">
                  <p className="text-sm text-slate-600">{customer.email}</p>
                  {customer.phone && <p className="text-xs text-slate-400">{customer.phone}</p>}
                </td>
                <td className="py-3.5 pr-4 text-sm font-semibold">{customer.orderCount}</td>
                <td className="py-3.5 pr-4 text-sm font-bold text-brand-800">{formatAED(customer.totalSpent)}</td>
                <td className="py-3.5 pr-1 text-xs text-slate-400">{new Date(customer.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
