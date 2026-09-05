"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductRow from "./ProductRow";
import ProductCard from "./ProductCard";

export default function ProductsTable({ products, categories }) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      if (categoryId && product.category_id !== categoryId) return false;
      if (q && !product.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, query, categoryId]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100 sm:w-56"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table (sm and up) */}
      <div className="hidden overflow-x-auto rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-xs sm:block sm:p-6">
        {products.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">No products yet — create your first one.</p>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">No products match your search.</p>
        ) : (
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-1 font-medium">Product</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 pr-1 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Card list (mobile only) */}
      <div className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-xs sm:hidden">
        {products.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">No products yet — create your first one.</p>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">No products match your search.</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
