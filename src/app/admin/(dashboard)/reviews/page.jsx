import { MessageSquare, Clock, CheckCircle2, Star } from "lucide-react";
import { getAllReviewsAdmin } from "@/actions/admin/reviews";
import StatCard from "@/components/admin/StatCard";
import ReviewList from "./_components/ReviewList";

export const metadata = { title: "Reviews" };

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsAdmin();

  const pendingCount = reviews.filter((r) => !r.is_approved).length;
  const approvedCount = reviews.length - pendingCount;
  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const stats = [
    { label: "Total Reviews", value: reviews.length, icon: MessageSquare, accent: "from-brand-600 to-brand-800" },
    { label: "Pending", value: pendingCount, icon: Clock, accent: "from-amber-500 to-amber-600" },
    { label: "Approved", value: approvedCount, icon: CheckCircle2, accent: "from-emerald-500 to-emerald-700" },
    { label: "Avg Rating", value: avgRating ? avgRating.toFixed(1) : "—", icon: Star, accent: "from-amber-400 to-amber-600" },
  ];

  return (
    <div>
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Review <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">Management</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">Approve reviews before they appear on product pages.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <ReviewList reviews={reviews} />
    </div>
  );
}
