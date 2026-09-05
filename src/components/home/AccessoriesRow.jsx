"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import BalloonVisual from "@/components/product/BalloonVisual";
import { useCart } from "@/context/CartContext";
import { formatAED } from "@/lib/format";
import { DEFAULT_HOME_CONTENT } from "@/lib/homeContent";

export default function AccessoriesRow({ accessories, content }) {
  const { addItem } = useCart();
  if (!accessories?.length) return null;
  const { eyebrow, heading } = content ?? DEFAULT_HOME_CONTENT.accessories;

  return (
    <section className="relative overflow-hidden py-12 lg:py-16 font-sans">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE7F3] px-4 py-1.5 font-display text-base font-bold text-[#D946EF] shadow-2xs">
              <Sparkles size={13} className="text-[#EAB308] fill-[#EAB308]" />
              {eyebrow || "Essential Inflation & Accessories"}
            </span>
            <h2 className="mt-2.5 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
              {heading || "Everything You Need, All In One Place"}
            </h2>
          </div>
          <Link
            href="/shop?category=accessories"
            className="group inline-flex items-center gap-2 rounded-full bg-[#7E22CE] hover:bg-[#6D28D9] px-5 py-2.5 font-display text-base font-bold text-white shadow-md shadow-purple-300/40 transition-all hover:shadow-lg hover:scale-102"
          >
            <span>View All Accessories</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 2-Column Grid on Mobile, 3 on Tablet, 5 on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
          {accessories.slice(0, 5).map((product) => {
            const discount =
              product.compareAt && product.price < product.compareAt
                ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
                : null;

            return (
              <article
                key={product.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-pink-100/90 bg-white p-3.5 sm:p-4.5 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-pink-200 hover:shadow-xl hover:shadow-purple-900/10"
              >
                <div>
                  <Link
                    href={`/shop/${product.slug}`}
                    className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl bg-[#FFF5F8] p-2.5 sm:p-3 border border-pink-100/60"
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="200px"
                        className="object-contain p-1 drop-shadow-xs transition-transform duration-500 ease-out group-hover:scale-108"
                      />
                    ) : (
                      <div className="transition-transform duration-500 ease-out group-hover:scale-108 drop-shadow-xs">
                        <BalloonVisual visual={product.visual} size={100} />
                      </div>
                    )}

                    {discount && (
                      <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-extrabold text-white shadow-xs">
                        −{discount}%
                      </span>
                    )}
                  </Link>

                  <Link
                    href={`/shop/${product.slug}`}
                    className="mt-3 block font-sans text-base sm:text-base font-extrabold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#7E22CE] transition-colors"
                  >
                    {product.name}
                  </Link>

                </div>

                <div className="mt-3 flex items-center justify-between gap-1.5 pt-2.5 border-t border-slate-100">
                  <div className="min-w-0 flex flex-col">
                    <p className="font-sans text-base sm:text-base font-black text-[#0F172A] leading-tight">
                      {formatAED(product.price)}
                    </p>
                    {product.compareAt && (
                      <p className="text-sm sm:text-base font-semibold text-slate-400 line-through leading-tight">
                        {formatAED(product.compareAt)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => addItem(product, { size: product.sizes?.[0], color: product.colors?.[0]?.name })}
                    className="grid h-8.5 w-8.5 sm:h-9 sm:w-9 place-items-center rounded-xl bg-[#7E22CE] hover:bg-[#6D28D9] text-white shadow-md shadow-purple-200 transition-all hover:scale-105 active:scale-95 shrink-0"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingBag size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
