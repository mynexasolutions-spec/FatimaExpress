"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

export default function CouponForm({ action, coupon }) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <div>
      <Link href="/admin/coupons" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-700">
        <ArrowLeft size={15} />
        Back to coupons
      </Link>

      <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">{coupon ? "Edit Coupon" : "New Coupon"}</h1>

      <form action={formAction} className="mt-6 max-w-xl space-y-5 rounded-2xl border border-slate-100 bg-white p-6">
        {coupon && <input type="hidden" name="id" value={coupon.id} />}

        <div>
          <label className={labelClass}>Coupon code</label>
          <input required name="code" defaultValue={coupon?.code} className={`${inputClass} uppercase`} placeholder="e.g. PARTY10" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Discount type</label>
            <select name="discount_type" defaultValue={coupon?.discount_type || "percent"} className={inputClass}>
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat amount (AED)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Discount value</label>
            <input required type="number" step="0.01" name="discount_value" defaultValue={coupon?.discount_value ?? ""} className={inputClass} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Minimum order (AED)</label>
            <input type="number" step="0.01" name="min_order" defaultValue={coupon?.min_order ?? 0} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Expires on (optional)</label>
            <input
              type="date"
              name="expires_at"
              defaultValue={coupon?.expires_at ? coupon.expires_at.slice(0, 10) : ""}
              className={inputClass}
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm font-medium">
          <input type="checkbox" name="is_active" defaultChecked={coupon?.is_active ?? true} className="h-4 w-4 rounded accent-brand-700" />
          Active
        </label>

        {state.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-brand-800 px-7 py-3 text-sm font-bold text-white transition hover:bg-brand-900 disabled:opacity-70"
        >
          {pending && <LoaderCircle size={16} className="animate-spin" />}
          {coupon ? "Save Changes" : "Create Coupon"}
        </button>
      </form>
    </div>
  );
}
