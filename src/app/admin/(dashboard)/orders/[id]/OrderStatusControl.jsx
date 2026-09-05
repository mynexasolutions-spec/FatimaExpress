"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { updateOrderStatus } from "@/actions/admin/orders";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function OrderStatusControl({ orderId, currentStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  const handleChange = (event) => {
    const next = event.target.value;
    setStatus(next);
    startTransition(async () => {
      await updateOrderStatus(orderId, next);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleChange}
        disabled={pending}
        className="w-full rounded-xl border-2 border-brand-200 bg-brand-50/40 px-4 py-2.5 text-sm font-bold capitalize text-brand-800 outline-none transition focus:border-brand-500 focus:bg-white disabled:opacity-70"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {pending && <LoaderCircle size={16} className="shrink-0 animate-spin text-brand-600" />}
    </div>
  );
}
