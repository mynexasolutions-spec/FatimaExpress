"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgeCheck, Check, ChevronRight, ListChecks, MessageSquareText, Minus, Percent, Plus, ShieldCheck, ShoppingBag, Sparkles, Star, Truck, Zap } from "lucide-react";
import BalloonVisual from "@/components/product/BalloonVisual";
import ProductCard from "@/components/product/ProductCard";
import ReviewForm from "@/components/product/ReviewForm";
import ReviewsList from "@/components/product/ReviewsList";
import { useCart } from "@/context/CartContext";
import { formatAED } from "@/lib/format";
import { getActiveTier, getUnitPrice, sortedTiers } from "@/lib/bulkPricing";

const FALLBACK_SIZE = { label: "One size", price: 0 };

export default function ProductDetail({ product, related, reviews = [], existingReview = null }) {
  const { addItem } = useCart();
  const router = useRouter();
  const sizeOptions = product.sizes?.length ? product.sizes : [{ ...FALLBACK_SIZE, price: product.price }];
  const colorOptions = product.colors ?? [];
  const [size, setSize] = useState(sizeOptions[0]);
  const [color, setColor] = useState(colorOptions[0]?.name ?? null);
  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);

  const selectedColor = colorOptions.find((c) => c.name === color) ?? null;
  const visual = { ...product.visual, color: selectedColor?.hex ?? product.visual.color };
  const galleryImages = selectedColor?.images?.length
    ? selectedColor.images
    : selectedColor?.image_url
      ? [selectedColor.image_url]
      : product.image
        ? [product.image]
        : [];
  const displayImage = galleryImages[imageIndex] || galleryImages[0];

  const selectColor = (name) => {
    setColor(name);
    setImageIndex(0);
  };

  const bulkTiers = sortedTiers(product.bulkPricing);
  const activeTier = getActiveTier(bulkTiers, qty);
  const unitPrice = getUnitPrice(size.price, bulkTiers, qty);
  const cartSize = { ...size, price: unitPrice };

  const buyNow = () => {
    addItem(product, { size: cartSize, color, qty });
    router.push("/checkout");
  };

  return (
    <div className="bg-[#FAF9FC] min-h-screen">
      {/* ── BREADCRUMB ─────────────────────────────────── */}
      <div className="container-page pt-6 sm:pt-8">
        <nav className="flex max-w-full items-center gap-2 overflow-x-auto whitespace-nowrap text-xs sm:text-sm lg:text-base font-semibold text-slate-500">
          <Link href="/" className="transition-colors hover:text-[#7E22CE]">
            Home
          </Link>
          <ChevronRight size={15} className="shrink-0 text-slate-300" />
          <Link href={`/shop?category=${product.category}`} className="capitalize transition-colors hover:text-[#7E22CE]">
            {product.category.replace(/-/g, " ")}
          </Link>
          <ChevronRight size={15} className="shrink-0 text-slate-300" />
          <span className="truncate font-bold text-slate-900">{product.name}</span>
        </nav>
      </div>

      {/* ── MAIN PRODUCT SECTION ─────────────────────────────── */}
      <div className="container-page grid gap-8 py-6 sm:gap-10 sm:py-8 lg:grid-cols-2 lg:gap-12 lg:py-10">
        {/* Left Column: Gallery & Main Image */}
        <div>
          <div className="group relative grid aspect-square place-items-center overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
            {product.badge && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-[#7E22CE] px-4 py-1.5 text-xs lg:text-sm font-bold uppercase tracking-wider text-white shadow-xs">
                {product.badge}
              </span>
            )}
            {displayImage ? (
              <Image
                key={displayImage}
                src={displayImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                priority
              />
            ) : (
              <div className="animate-float drop-shadow-xl">
                <BalloonVisual visual={visual} size={360} />
              </div>
            )}
          </div>

          {/* Thumbnail Gallery Row */}
          {galleryImages.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {galleryImages.map((img, idx) => (
                <button
                  key={img + idx}
                  type="button"
                  onClick={() => setImageIndex(idx)}
                  className={`relative h-16 w-16 lg:h-20 lg:w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${idx === imageIndex
                      ? "border-[#7E22CE] ring-2 ring-purple-100"
                      : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300"
                    }`}
                >
                  <Image src={img} alt={`${product.name} photo ${idx + 1}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Professional Details & Buying Area */}
        <div className="flex flex-col">
          {/* Category & In Stock Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-xs sm:text-sm lg:text-base font-bold uppercase tracking-widest text-[#7E22CE]">
              {product.category.replace(/-/g, " ")}
            </span>
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm lg:text-base font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              In Stock — UAE Express Dispatch
            </span>
          </div>

          {/* Product Title */}
          <h1 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-snug">
            {product.name}
          </h1>

          {/* Rating & Reviews */}
          {product.rating && (
            <a href="#reviews" className="mt-3 inline-flex items-center gap-2.5 text-sm sm:text-base lg:text-lg font-semibold text-slate-600 transition hover:text-slate-900">
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className={index < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                  />
                ))}
              </span>
              <span className="font-bold text-slate-900 text-base lg:text-lg">{product.rating}</span>
              <span className="text-slate-500">
                ({product.reviews} verified reviews)
              </span>
            </a>
          )}

          {/* Pricing Header */}
          <div className="mt-5 flex flex-wrap items-baseline gap-3 sm:gap-4 rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-xs">
            <div>
              <span className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">Wholesale Unit Price</span>
              <p className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#7E22CE] tracking-tight">
                {formatAED(unitPrice)}
              </p>
            </div>
            {unitPrice < size.price ? (
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-400 line-through">{formatAED(size.price)}</p>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs sm:text-sm font-bold text-emerald-700 border border-emerald-200">
                  {activeTier.discountPercent}% Bulk Saving Applied
                </span>
              </div>
            ) : (
              product.compareAt && (
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-400 line-through">{formatAED(product.compareAt)}</p>
                  <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs sm:text-sm font-bold text-emerald-700 border border-emerald-200">
                    Save {Math.round((1 - size.price / product.compareAt) * 100)}%
                  </span>
                </div>
              )
            )}
          </div>

          {/* Bulk Pricing Tier Matrix */}
          {bulkTiers.length > 0 && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:p-6 shadow-xs">
              <p className="flex items-center gap-2 text-xs sm:text-sm lg:text-base font-bold uppercase tracking-wider text-slate-700">
                <Percent size={16} className="text-[#7E22CE] shrink-0" />
                Volume Discount Pricing Matrix
              </p>
              <div className="mt-3.5 overflow-hidden rounded-xl border border-slate-200 text-xs sm:text-sm lg:text-base">
                <div className="grid grid-cols-3 bg-slate-50 p-3 sm:p-3.5 font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  <span>Quantity</span>
                  <span>Price / Unit</span>
                  <span className="text-right">Savings</span>
                </div>
                <div className={`grid grid-cols-3 p-3 sm:p-3.5 font-medium border-b border-slate-100 transition ${!activeTier ? "bg-purple-50/70 font-bold text-[#7E22CE]" : "text-slate-700"}`}>
                  <span>1–{bulkTiers[0] ? bulkTiers[0].minQty - 1 : "+"} pcs</span>
                  <span>{formatAED(size.price)}</span>
                  <span className="text-right text-slate-400">Standard</span>
                </div>
                {bulkTiers.map((tier, idx) => {
                  const next = bulkTiers[idx + 1];
                  const isActive = activeTier?.minQty === tier.minQty;
                  return (
                    <div
                      key={tier.minQty}
                      className={`grid grid-cols-3 p-3 sm:p-3.5 font-medium border-b border-slate-100 last:border-b-0 transition ${isActive ? "bg-purple-50/70 font-bold text-[#7E22CE]" : "text-slate-700"
                        }`}
                    >
                      <span>{tier.minQty}{next ? `–${next.minQty - 1}` : "+"} pcs</span>
                      <span>{formatAED(getUnitPrice(size.price, bulkTiers, tier.minQty))}</span>
                      <span className="text-right font-bold text-emerald-600">-{tier.discountPercent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="mt-5 text-sm sm:text-base lg:text-lg font-normal leading-relaxed text-slate-700">{product.description}</p>

          {/* Options: Size Selector */}
          <div className="mt-6">
            <label className="block text-xs sm:text-sm lg:text-base font-bold uppercase tracking-wider text-slate-700">Select Size Option</label>
            <div className="mt-2.5 flex flex-wrap gap-2.5 sm:gap-3">
              {sizeOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setSize(option)}
                  className={`rounded-xl border-2 px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-3.5 text-sm sm:text-base font-bold transition-all duration-200 ${size.label === option.label
                      ? "border-[#7E22CE] bg-[#7E22CE] text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Options: Color Selector */}
          {colorOptions.length > 1 && (
            <div className="mt-5">
              <label className="block text-xs sm:text-sm lg:text-base font-bold uppercase tracking-wider text-slate-700">
                Selected Color: <span className="text-slate-900 font-bold">{color}</span>
              </label>
              <div className="mt-2.5 flex flex-wrap gap-3">
                {colorOptions.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => selectColor(c.name)}
                    title={c.name}
                    aria-label={c.name}
                    className={`h-9 w-9 lg:h-11 lg:w-11 rounded-full border-2 transition-all ${color === c.name ? "scale-110 border-[#7E22CE] ring-2 ring-purple-200 shadow-sm" : "border-slate-200 hover:scale-105"
                      }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3.5 sm:gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center rounded-xl border border-slate-300 bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => setQty((current) => Math.max(1, current - 1))}
                className="p-3 lg:p-4 text-slate-600 transition hover:text-[#7E22CE]"
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>
              <span className="w-10 lg:w-12 text-center text-base lg:text-lg font-bold text-slate-900">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((current) => current + 1)}
                className="p-3 lg:p-4 text-slate-600 transition hover:text-[#7E22CE]"
                aria-label="Increase quantity"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={() => addItem(product, { size: cartSize, color, qty })}
              className="group inline-flex flex-1 items-center justify-center gap-2.5 rounded-xl bg-[#7E22CE] px-6 sm:px-7 lg:px-8 py-3.5 sm:py-4 lg:py-4.5 text-sm sm:text-base lg:text-lg font-extrabold text-white shadow-sm transition-all hover:bg-[#6B21A8] active:scale-98"
            >
              <ShoppingBag size={20} />
              Add to Cart
            </button>

            {/* Buy Now */}
            <button
              type="button"
              onClick={buyNow}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white px-6 lg:px-8 py-3.5 sm:py-4 lg:py-4.5 text-sm sm:text-base lg:text-lg font-extrabold text-slate-900 transition-all hover:bg-slate-50 active:scale-98"
            >
              <Zap size={19} className="text-[#7E22CE]" />
              Buy Now
            </button>
          </div>

          {/* UAE Shipping & Trust Highlights */}
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:p-6 text-xs sm:text-sm lg:text-base text-slate-700 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm sm:text-base lg:text-lg">
              <Truck size={20} className="text-[#7E22CE] shrink-0" />
              <span>Free Delivery in Dubai on orders over AED 1,000</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-slate-600 text-xs sm:text-sm lg:text-base">
              <span className="flex items-center gap-2 font-medium">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                100% Authentic Quality
              </span>
              <span className="flex items-center gap-2 font-medium">
                <BadgeCheck size={18} className="text-emerald-600 shrink-0" />
                Wholesale Verified
              </span>
            </div>
          </div>

          {/* Specifications */}
          {product.specs?.length > 0 && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:p-6 shadow-2xs">
              <p className="flex items-center gap-2 text-xs sm:text-sm lg:text-base font-bold uppercase tracking-wider text-slate-700">
                <ListChecks size={18} className="text-[#7E22CE] shrink-0" />
                Product Specifications
              </p>
              <ul className="mt-3.5 grid gap-2.5 sm:grid-cols-2 text-xs sm:text-sm lg:text-base">
                {product.specs.map((spec) => (
                  <li key={spec.label} className="flex items-start gap-2">
                    <Check size={18} className="mt-0.5 shrink-0 text-[#7E22CE]" />
                    <span>
                      <span className="font-bold text-slate-800">{spec.label}:</span>{" "}
                      <span className="text-slate-600">{spec.value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ── REVIEWS SECTION ─────────────────────────────── */}
      <section id="reviews" className="container-page grid scroll-mt-24 gap-8 border-t border-slate-200/80 pb-12 pt-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="flex items-center gap-2 text-xs sm:text-sm lg:text-base font-bold uppercase tracking-wider text-[#7E22CE]">
            <MessageSquareText size={18} />
            Customer Feedback
          </p>
          <h2 className="mt-1.5 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Verified Reviews</h2>

          <div className="mt-4">
            <ReviewsList reviews={reviews} />
          </div>
        </div>

        <div>
          <ReviewForm productId={product.id} existingReview={existingReview} />
        </div>
      </section>

      {/* ── RELATED PRODUCTS ─────────────────────────────── */}
      {related.length > 0 && (
        <section className="container-page border-t border-slate-200/80 pb-12 pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs sm:text-sm lg:text-base font-bold uppercase tracking-wider text-[#7E22CE]">
                <Sparkles size={18} />
                Related Supplies
              </p>
              <h2 className="mt-1.5 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Recommended Products</h2>
            </div>
            <Link
              href={`/shop?category=${product.category}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm lg:text-base font-bold text-slate-800 transition hover:border-[#7E22CE] hover:text-[#7E22CE]"
            >
              View Category
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {/* ── STICKY MOBILE BOTTOM BAR ─────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3.5 shadow-lg lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">{product.name}</p>
            <p className="font-display text-lg font-black text-[#7E22CE]">{formatAED(unitPrice * qty)}</p>
          </div>
          <button
            type="button"
            onClick={() => addItem(product, { size: cartSize, color, qty })}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#7E22CE] px-5 py-3 text-sm font-extrabold text-white shadow-xs active:scale-95"
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        </div>
      </div>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
