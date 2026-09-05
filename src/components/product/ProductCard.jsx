"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star, Eye } from "lucide-react";
import BalloonVisual from "./BalloonVisual";
import { useCart } from "@/context/CartContext";
import { formatAED } from "@/lib/format";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white font-sans border border-pink-100/90 shadow-2xs transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-300/80 hover:shadow-[0_20px_40px_-15px_rgba(147,51,234,0.18)]">

      {/* ── Image Area ─────────────────────────────── */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-purple-50/40 shrink-0"
      >
        {/* Product image — 1:1 fully visible */}
        {product.image ? (
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-108">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center transition-transform duration-700 ease-out group-hover:scale-108">
            <div className="drop-shadow-xl">
              <BalloonVisual visual={product.visual} size={150} />
            </div>
          </div>
        )}

        {/* Hover overlay with glassmorphism view badge */}
        <div className="absolute inset-0 flex items-center justify-center bg-purple-950/20 backdrop-blur-[2px] opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#0F172A] shadow-xl backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
            <Eye size={14} className="text-[#7E22CE]" />
            Quick View
          </span>
        </div>

        {/* Badges — top left */}
        {product.badge && (
          <div className="absolute left-3 top-3 z-10">
            <span className="w-fit rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md shadow-rose-500/25">
              {product.badge}
            </span>
          </div>
        )}
      </Link>

      {/* ── Card Body ──────────────────────────────── */}
      <div className="flex flex-1 flex-col p-4 sm:p-4.5">

        {/* Rating row inside Card Body */}
        {product.rating && (
          <div className="flex items-center gap-1 text-xs font-extrabold text-amber-600">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
        )}

        {/* Product name */}
        <Link
          href={`/shop/${product.slug}`}
          className="mt-1 line-clamp-2 text-xs sm:text-sm font-extrabold leading-snug text-[#0F172A] transition-colors group-hover:text-[#7E22CE] sm:min-h-[2.4rem] flex items-start"
        >
          {product.name}
        </Link>

        {/* ── Price + CTA ──────────────────────────── */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 sm:pt-3.5 border-t border-slate-100">
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <span className="text-sm sm:text-base font-black tracking-tight text-[#0F172A] truncate">
              {formatAED(product.price)}
            </span>
            {product.compareAt && (
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 line-through truncate">
                {formatAED(product.compareAt)}
              </span>
            )}
            <span className="hidden sm:block text-[10px] font-extrabold uppercase tracking-wider text-[#7E22CE]/80 mt-0.5">
              Wholesale
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              addItem(product, {
                size: product.sizes?.[0],
                color: product.colors?.[0]?.name,
              })
            }
            aria-label={`Add ${product.name} to cart`}
            className="group/btn relative flex shrink-0 h-9 w-9 sm:h-auto sm:w-auto items-center justify-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-[#6D28D9] via-[#7E22CE] to-[#8B5CF6] sm:px-4 sm:py-2 text-xs font-extrabold text-white shadow-md shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ShoppingBag size={15} className="relative shrink-0 transition-transform duration-300 group-hover/btn:-rotate-12" />
            <span className="hidden sm:inline relative text-xs font-black">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
