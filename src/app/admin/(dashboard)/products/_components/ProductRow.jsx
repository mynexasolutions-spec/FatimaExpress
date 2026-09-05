"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Star, Trash2 } from "lucide-react";
import BalloonVisual from "@/components/product/BalloonVisual";
import { deleteProduct } from "@/actions/admin/products";
import { formatAED } from "@/lib/format";

export default function ProductRow({ product }) {
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
    <tr className="transition-colors duration-300 hover:bg-brand-50/30">
      <td className="py-3.5 pl-1 pr-4">
        <div className="flex items-center gap-3">
          <div className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-brand-50">
            {product.image_url ? (
              <Image src={product.image_url} alt="" fill sizes="44px" className="object-cover" />
            ) : (
              <BalloonVisual visual={product.visual} size={34} />
            )}
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
              {product.name}
              {product.is_featured && <Star size={12} className="shrink-0 fill-amber-400 text-amber-400" />}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3.5 pr-4 text-sm text-slate-500">{product.categoryName || "—"}</td>
      <td className="py-3.5 pr-4 text-sm font-semibold text-brand-800">{formatAED(product.price)}</td>
      <td className="py-3.5 pr-4">
        <span className={`text-sm font-semibold ${product.stock_quantity <= 5 ? "text-amber-600" : "text-slate-600"}`}>
          {product.stock_quantity}
        </span>
      </td>
      <td className="py-3.5 pr-4">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${
            product.is_active ? "border-green-200 bg-green-50 text-green-700" : "border-slate-200 bg-slate-100 text-slate-500"
          }`}
        >
          {product.is_active ? "Active" : "Hidden"}
        </span>
      </td>
      <td className="py-3.5 pr-1 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/products/${product.id}/edit`}
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
            title={confirming ? "Click again to confirm" : "Delete"}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
