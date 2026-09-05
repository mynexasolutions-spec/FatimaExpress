import Link from "next/link";
import { CheckCircle2, EyeOff, FolderTree, PackageX, Plus } from "lucide-react";
import { getAllCategoriesAdmin } from "@/actions/admin/categories";
import StatCard from "@/components/admin/StatCard";
import CategoryRow from "./_components/CategoryRow";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin();
  const activeCount = categories.filter((c) => c.is_active).length;
  const emptyCount = categories.filter((c) => c.product_count === 0).length;

  const stats = [
    { label: "Total Categories", value: categories.length, icon: FolderTree, accent: "from-brand-600 to-brand-800" },
    { label: "Active", value: activeCount, icon: CheckCircle2, accent: "from-emerald-500 to-emerald-700" },
    { label: "Hidden", value: categories.length - activeCount, icon: EyeOff, accent: "from-slate-400 to-slate-600" },
    { label: "Empty", value: emptyCount, icon: PackageX, accent: "from-amber-500 to-amber-600" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Category <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">Organize balloons and accessories into shop sections.</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-brand-700 to-brand-800 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus size={16} />
          New Category
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="overflow-x-auto rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-xs sm:p-6">
        {categories.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">No categories yet — create your first one.</p>
        ) : (
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-1 font-medium">Name</th>
                <th className="pb-3 font-medium">Slug</th>
                <th className="pb-3 font-medium">Products</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 pr-1 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
