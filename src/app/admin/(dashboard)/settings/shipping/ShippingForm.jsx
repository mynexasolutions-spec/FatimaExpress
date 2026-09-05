"use client";

import { useActionState } from "react";
import { LoaderCircle, MapPin, Truck } from "lucide-react";
import { updateShippingSettings } from "@/actions/admin/shipping";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

export default function ShippingForm({ shipping }) {
  const [state, formAction, pending] = useActionState(updateShippingSettings, {});

  return (
    <form action={formAction} className="mt-6 max-w-xl space-y-5 rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-xs">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700 shadow-xs">
          <Truck size={17} />
        </span>
        <h2 className="font-display text-lg font-bold">Delivery Fees</h2>
      </div>

      <div>
        <label className={labelClass}>Free delivery threshold — Dubai (AED)</label>
        <input type="number" step="0.01" name="free_threshold" defaultValue={shipping.free_threshold} className={inputClass} />
        <p className="mt-1 text-xs text-slate-400">Orders inside Dubai at or above this amount ship free.</p>
      </div>

      <div>
        <label className={labelClass}>Dubai courier fee (AED)</label>
        <input type="number" step="0.01" name="dubai_fee" defaultValue={shipping.dubai_fee} className={inputClass} />
        <p className="mt-1 text-xs text-slate-400">Charged on Dubai orders below the free-delivery threshold.</p>
      </div>

      <div>
        <label className={`${labelClass} flex items-center gap-1.5`}>
          <MapPin size={12} />
          Other emirates courier fee (AED)
        </label>
        <input type="number" step="0.01" name="courier_fee" defaultValue={shipping.courier_fee} className={inputClass} />
        <p className="mt-1 text-xs text-slate-400">Applied to Abu Dhabi, Sharjah and all other emirates, regardless of order size.</p>
      </div>

      {state.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">Shipping settings saved.</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-brand-800 px-7 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {pending && <LoaderCircle size={16} className="animate-spin" />}
        Save Settings
      </button>
    </form>
  );
}
