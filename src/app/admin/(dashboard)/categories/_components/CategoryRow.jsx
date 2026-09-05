"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FolderTree, Pencil, Trash2 } from "lucide-react";
import { deleteCategory } from "@/actions/admin/categories";

export default function CategoryRow({ category }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteCategory(category.id);
      router.refresh();
    });
  };

  return (
    <tr className="transition-colors duration-300 hover:bg-brand-50/30">
      <td className="py-3.5 pl-1 pr-4">
        <div className="flex items-center gap-3">
          <div className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-brand-50">
            {category.image_url ? (
              <Image src={category.image_url} alt="" fill sizes="40px" className="object-cover" />
            ) : (
              <FolderTree size={16} className="text-brand-300" />
            )}
          </div>
          <span className="text-sm font-semibold">{category.name}</span>
        </div>
      </td>
      <td className="py-3.5 pr-4 font-mono text-xs text-slate-400">{category.slug}</td>
      <td className="py-3.5 pr-4">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            category.product_count === 0 ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"
          }`}
        >
          {category.product_count}
        </span>
      </td>
      <td className="py-3.5 pr-4">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${
            category.is_active ? "border-green-200 bg-green-50 text-green-700" : "border-slate-200 bg-slate-100 text-slate-500"
          }`}
        >
          {category.is_active ? "Active" : "Hidden"}
        </span>
      </td>
      <td className="py-3.5 pr-1 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/categories/${category.id}/edit`}
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
