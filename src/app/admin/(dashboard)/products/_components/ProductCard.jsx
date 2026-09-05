"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Star, Trash2 } from "lucide-react";
import BalloonVisual from "@/components/product/BalloonVisual";
import { deleteProduct } from "@/actions/admin/products";
import { formatAED } from "@/lib/format";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteProduct(product.id);
      router.refresh();
    });
  };

  return (
    <li className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex items-start gap-3">
        <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-brand-50">
          {product.image_url ? (
            <Image src={product.image_url} alt="" fill sizes="48px" className="object-cover" />
          ) : (
            <BalloonVisual visual={product.visual} size={36} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-bold text-ink">
            {product.name}
            {product.is_featured && <Star size={12} className="shrink-0 fill-amber-400 text-amber-400" />}
          </p>
          <p className="truncate text-xs text-slate-500">{product.categoryName || "—"}</p>
        </div>
        <p className="shrink-0 text-sm font-bold text-brand-800">{formatAED(product.price)}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${
            product.is_active ? "border-green-200 bg-green-50 text-green-700" : "border-slate-200 bg-slate-100 text-slate-500"
          }`}
        >
          {product.is_active ? "Active" : "Hidden"}
        </span>
        <span className={`text-xs font-semibold ${product.stock_quantity <= 5 ? "text-amber-600" : "text-slate-500"}`}>
          {product.stock_quantity} in stock
        </span>

        <div className="ml-auto flex items-center gap-1.5">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="inline-flex items-center gap-1 rounded-xl border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700"
          >
            <Pencil size={13} /> Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={pending}
            className={`rounded-xl border p-2 transition ${
              confirming ? "border-red-200 bg-red-50 text-red-600" : "border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600"
            }`}
            title={confirming ? "Click again to confirm" : "Delete"}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </li>
  );
}
