import { Star } from "lucide-react";

export default function StarRating({ rating = 0, size = 14, showValue = false }) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            width={size}
            height={size}
            className={n <= rounded ? "fill-amber-400 text-amber-400" : "fill-none text-slate-300"}
          />
        ))}
      </div>
      {showValue && rating > 0 && <span className="text-sm text-slate-500">{rating.toFixed(1)}</span>}
    </div>
  );
}
