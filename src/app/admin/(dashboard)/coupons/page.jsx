import Link from "next/link";
import { CheckCircle2, Clock, Plus, Tag } from "lucide-react";
import { getAllCouponsAdmin } from "@/actions/admin/coupons";
import StatCard from "@/components/admin/StatCard";
import CouponsTable from "./_components/CouponsTable";

export const metadata = { title: "Coupons" };

export default async function AdminCouponsPage() {
  const coupons = await getAllCouponsAdmin();
  const activeCount = coupons.filter((c) => c.is_active).length;
  // eslint-disable-next-line react-hooks/purity -- server component: comparing against wall-clock time to count expired coupons
  const now = Date.now();
  const expiredCount = coupons.filter((c) => c.expires_at && new Date(c.expires_at).getTime() < now).length;

  const stats = [
    { label: "Total Coupons", value: coupons.length, icon: Tag, accent: "from-brand-600 to-brand-800" },
    { label: "Active", value: activeCount, icon: CheckCircle2, accent: "from-emerald-500 to-emerald-700" },
    { label: "Expired", value: expiredCount, icon: Clock, accent: "from-slate-400 to-slate-600" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Coupon <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">Discount codes customers can apply at checkout.</p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-brand-700 to-brand-800 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus size={16} />
          New Coupon
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <CouponsTable coupons={coupons} />
    </div>
  );
}
