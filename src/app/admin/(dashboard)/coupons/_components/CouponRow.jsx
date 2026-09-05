"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCoupon } from "@/actions/admin/coupons";
import { formatAED } from "@/lib/format";

export default function CouponRow({ coupon }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteCoupon(coupon.id);
      router.refresh();
    });
  };

  const expired = coupon.expires_at && new Date(coupon.expires_at) < new Date();

  return (
    <tr className="transition-colors duration-300 hover:bg-brand-50/30">
      <td className="py-3.5 pl-1 pr-4 font-mono text-sm font-bold text-brand-800">{coupon.code}</td>
      <td className="py-3.5 pr-4 text-sm">
        {coupon.discount_type === "percent" ? `${coupon.discount_value}%` : formatAED(coupon.discount_value)}
      </td>
      <td className="py-3.5 pr-4 text-sm text-slate-500">{formatAED(coupon.min_order)}</td>
      <td className="py-3.5 pr-4">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${
            expired
              ? "border-red-200 bg-red-50 text-red-600"
              : coupon.is_active
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-slate-200 bg-slate-100 text-slate-500"
          }`}
        >
          {expired ? "Expired" : coupon.is_active ? "Active" : "Disabled"}
        </span>
      </td>
      <td className="py-3.5 pr-1 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/coupons/${coupon.id}/edit`}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2 text-xs font-bold text-brand-700 transition-all duration-300 hover:border-brand-300 hover:bg-brand-100 hover:shadow-sm"
          >
            <Pencil size={13} /> Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={pending}
            className={`rounded-xl border p-2 transition ${
              confirming ? "border-red-200 bg-red-50 text-red-600" : "border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
