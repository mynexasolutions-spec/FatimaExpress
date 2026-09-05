"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { submitReview } from "@/actions/reviews";
import StarRating from "./StarRating";

export default function ReviewForm({ productId, existingReview }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [requiresLogin, setRequiresLogin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setRequiresLogin(false);

    if (rating === 0) {
      setError("Please choose a star rating.");
      return;
    }

    startTransition(async () => {
      const result = await submitReview(productId, rating, text);
      if (!result.success) {
        setError(result.error || "Something went wrong.");
        if (result.requiresLogin) setRequiresLogin(true);
        return;
      }
      setDone(true);
    });
  };

  if (done) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-brand-100 bg-brand-50/60 p-6 text-base text-brand-900 shadow-soft">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-200/30 blur-2xl" />
        <p className="relative font-display text-lg font-bold">Thank you for your review!</p>
        <p className="relative mt-1 text-brand-800/80">It will appear here once approved by our team.</p>
      </div>
    );
  }

  if (existingReview) {
    return (
      <div className="space-y-2.5 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
        <p className="font-display text-lg font-bold">Your Review</p>
        <StarRating rating={existingReview.rating} size={15} />
        {existingReview.review_text && <p className="text-base text-slate-600">&ldquo;{existingReview.review_text}&rdquo;</p>}
        {!existingReview.is_approved && (
          <p className="text-sm text-slate-400">Pending approval — it will appear publicly once our team reviews it.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand-100/50 blur-3xl" />
      <div className="relative">
        <p className="font-display text-lg font-bold">Write a Review</p>
        <p className="mt-0.5 text-sm text-slate-500">Share how this product worked for your event.</p>
      </div>

      <div className="relative flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(n)}
            aria-label={`Rate ${n} stars`}
            className="transition-transform hover:scale-110"
          >
            <Star size={26} className={n <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "fill-none text-slate-300"} />
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={800}
        placeholder="How was this product for your event?"
        className="relative w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />

      {error && (
        <p className="relative rounded-xl bg-red-50 px-4 py-3 text-base text-red-600">
          {error}
          {requiresLogin && (
            <>
              {" "}
              <Link href="/login" className="font-semibold underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="relative inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3 text-base font-bold text-white shadow-glow transition-all hover:bg-brand-800 hover:-translate-y-0.5 disabled:opacity-70"
      >
        {pending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
