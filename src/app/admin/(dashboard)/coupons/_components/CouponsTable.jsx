"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import CouponRow from "./CouponRow";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
  { value: "expired", label: "Expired" },
];

export default function CouponsTable({ coupons }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    // eslint-disable-next-line react-hooks/purity -- intentional: comparing against wall-clock time to flag expired coupons
    const now = Date.now();
    return coupons.filter((coupon) => {
      const expired = coupon.expires_at && new Date(coupon.expires_at).getTime() < now;
      if (status === "expired" && !expired) return false;
      if (status === "active" && (expired || !coupon.is_active)) return false;
      if (status === "disabled" && (expired || coupon.is_active)) return false;
      if (q && !coupon.code.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [coupons, query, status]);

  return (
    <div className="overflow-x-auto rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-xs sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by code…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100 sm:w-48"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {coupons.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No coupons yet.</p>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No coupons match your search.</p>
      ) : (
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="pb-3 pl-1 font-medium">Code</th>
              <th className="pb-3 font-medium">Discount</th>
              <th className="pb-3 font-medium">Min. Order</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 pr-1 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((coupon) => (
              <CouponRow key={coupon.id} coupon={coupon} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
