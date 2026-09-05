import Link from "next/link";
import { AlertTriangle, CheckCircle2, Package, Plus, Star } from "lucide-react";
import { getAllProductsAdmin } from "@/actions/admin/products";
import { getAllCategoriesAdmin } from "@/actions/admin/categories";
import StatCard from "@/components/admin/StatCard";
import ProductsTable from "./_components/ProductsTable";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getAllProductsAdmin(), getAllCategoriesAdmin()]);
  const activeCount = products.filter((p) => p.is_active).length;
  const featuredCount = products.filter((p) => p.is_featured).length;
  const lowStockCount = products.filter((p) => p.stock_quantity <= 5).length;

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, accent: "from-brand-600 to-brand-800" },
    { label: "Active", value: activeCount, icon: CheckCircle2, accent: "from-emerald-500 to-emerald-700" },
    { label: "Featured", value: featuredCount, icon: Star, accent: "from-amber-400 to-amber-600" },
    { label: "Low Stock", value: lowStockCount, icon: AlertTriangle, accent: "from-rose-500 to-rose-600" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Product <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">Catalog</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">Everything customers see in the shop.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-brand-700 to-brand-800 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus size={16} />
          New Product
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <ProductsTable products={products} categories={categories} />
    </div>
  );
}
