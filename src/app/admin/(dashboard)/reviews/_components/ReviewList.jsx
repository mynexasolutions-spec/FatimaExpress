"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Search, Trash2 } from "lucide-react";
import StarRating from "@/components/product/StarRating";
import { approveReview, deleteReview } from "@/actions/admin/reviews";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
];

export default function ReviewList({ reviews }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const handleApprove = (id) => {
    startTransition(async () => {
      await approveReview(id);
      router.refresh();
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      await deleteReview(id);
      router.refresh();
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reviews.filter((r) => {
      if (tab === "pending" && r.is_approved) return false;
      if (tab === "approved" && !r.is_approved) return false;
      if (!q) return true;
      const haystack = `${r.reviewer_name ?? ""} ${r.products?.name ?? ""} ${r.review_text ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [reviews, tab, query]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                tab === t.key
                  ? "bg-brand-700 text-white shadow-md"
                  : "border border-slate-200 text-slate-500 hover:border-brand-200 hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reviews…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-slate-100 bg-white py-12 text-center text-sm text-slate-400">
          {query ? "No reviews match your search." : "No reviews here."}
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => (
            <li key={r.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StarRating rating={r.rating} size={13} />
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        r.is_approved ? "border-green-200 bg-green-50 text-green-700" : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {r.is_approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{r.review_text || <em className="text-slate-400">No comment</em>}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {r.reviewer_name || "Customer"} on <span className="text-slate-600">{r.products?.name}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!r.is_approved && (
                    <button
                      onClick={() => handleApprove(r.id)}
                      disabled={pending}
                      className="flex items-center gap-1 rounded-xl border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition-all hover:border-green-300 hover:bg-green-100"
                    >
                      <Check size={14} /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={pending}
                    className="rounded-xl border border-slate-200 p-2 text-slate-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    title="Reject / delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
