"use client";

import { useState } from "react";
import { BadgeCheck, ChevronDown, MessageSquare } from "lucide-react";
import { Star } from "lucide-react";

const BATCH = 4;

const palette = [
  "from-violet-500 to-purple-700",
  "from-pink-500 to-rose-600",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-600",
  "from-sky-400 to-blue-600",
  "from-fuchsia-500 to-pink-600",
];

const initials = (name) =>
  (name || "F E")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const timeAgo = (dateString) => {
  if (!dateString) return "";
  const d = Math.max(1, Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000));
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
};

function Stars({ rating, size = 13 }) {
  const r = Math.round(rating * 2) / 2;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          width={size}
          height={size}
          className={n <= r ? "fill-amber-400 text-amber-400" : "fill-none text-slate-200"}
        />
      ))}
    </div>
  );
}

// Average rating + distribution bars summary
function RatingSummary({ reviews }) {
  const avg = reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-slate-50 border border-slate-200/70 p-5 sm:p-6">
      {/* Big avg score */}
      <div className="flex flex-col items-center shrink-0">
        <span className="text-5xl font-extrabold text-slate-950 tracking-tight">
          {avg.toFixed(1)}
        </span>
        <Stars rating={avg} size={16} />
        <span className="mt-1.5 text-sm text-slate-500 font-medium">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 w-full space-y-2">
        {dist.map(({ star, count }) => {
          const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-2.5 text-sm">
              <span className="w-4 shrink-0 text-right font-bold text-slate-500">{star}</span>
              <Star size={10} className="shrink-0 fill-amber-400 text-amber-400" />
              <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-6 shrink-0 text-slate-400 font-medium">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ReviewsList({ reviews }) {
  const [visibleCount, setVisibleCount] = useState(BATCH);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center font-sans">
        <MessageSquare size={28} className="mx-auto text-slate-300" />
        <p className="mt-3 text-sm font-bold text-slate-500">No reviews yet</p>
        <p className="mt-1 text-sm text-slate-400">Be the first to share your experience.</p>
      </div>
    );
  }

  const visible = reviews.slice(0, visibleCount);
  const remaining = reviews.length - visibleCount;

  return (
    <div className="space-y-6 font-sans">
      {/* Summary */}
      <RatingSummary reviews={reviews} />

      {/* Review Cards */}
      <ul className="space-y-3">
        {visible.map((r, index) => {
          const name = r.reviewer_name || "Fatima Express Customer";
          return (
            <li
              key={r.id ?? index}
              className="group rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md hover:shadow-purple-50"
            >
              <div className="flex items-start gap-3.5">
                {/* Avatar */}
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-extrabold text-white shadow-sm ${palette[index % palette.length]}`}
                >
                  {initials(name)}
                </span>

                <div className="min-w-0 flex-1">
                  {/* Name + time */}
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
                    <p className="flex items-center gap-1.5 text-base font-bold text-slate-900">
                      {name}
                      <BadgeCheck size={14} className="text-purple-600 shrink-0" />
                    </p>
                    <span className="text-sm font-medium text-slate-400 shrink-0">
                      {timeAgo(r.created_at)}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="mt-1">
                    <Stars rating={r.rating} size={13} />
                  </div>

                  {/* Review text */}
                  {r.review_text && (
                    <p className="mt-2.5 text-base leading-relaxed text-slate-600">
                      &ldquo;{r.review_text}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Load more */}
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisibleCount((c) => c + BATCH)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white py-3 text-base font-bold text-slate-700 transition-all hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50/50"
        >
          <ChevronDown size={16} />
          Load {Math.min(remaining, BATCH)} more reviews
          <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-sm font-bold text-slate-500">
            {remaining} left
          </span>
        </button>
      )}
    </div>
  );
}
