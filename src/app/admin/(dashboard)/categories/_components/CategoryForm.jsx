"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

export default function CategoryForm({ action, category }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [imageUrl, setImageUrl] = useState(category?.image_url || null);

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <div>
      <Link href="/admin/categories" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-700">
        <ArrowLeft size={15} />
        Back to categories
      </Link>

      <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
        {category ? "Edit Category" : "New Category"}
      </h1>

      <form action={formAction} className="mt-6 max-w-xl space-y-5 rounded-2xl border border-slate-100 bg-white p-6">
        {category && <input type="hidden" name="id" value={category.id} />}
        <input type="hidden" name="image_url" value={imageUrl || ""} />

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Image</label>
          <ImageUploader value={imageUrl} onChange={setImageUrl} folder="fatima-express/categories" previewClassName="h-28 w-28" />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Name</label>
          <input required name="name" defaultValue={category?.name} className={inputClass} placeholder="e.g. Foil Balloons" />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Short description</label>
          <textarea
            name="blurb"
            rows={2}
            defaultValue={category?.blurb || ""}
            className={inputClass}
            placeholder="Shown under the category name on the shop page"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Sort order</label>
          <input
            type="number"
            name="sort_order"
            defaultValue={category?.sort_order ?? 0}
            className={inputClass}
          />
        </div>

        <label className="flex items-center gap-2.5 text-sm font-medium">
          <input type="checkbox" name="is_active" defaultChecked={category?.is_active ?? true} className="h-4 w-4 rounded accent-brand-700" />
          Visible in shop
        </label>

        {state.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-brand-800 px-7 py-3 text-sm font-bold text-white transition hover:bg-brand-900 disabled:opacity-70"
        >
          {pending && <LoaderCircle size={16} className="animate-spin" />}
          {category ? "Save Changes" : "Create Category"}
        </button>
      </form>
    </div>
  );
}
