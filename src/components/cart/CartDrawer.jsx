"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Lock, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatAED } from "@/lib/format";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/shipping";
import BalloonVisual from "@/components/product/BalloonVisual";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal } = useCart();

  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDelivery = remaining === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-dvh w-full max-w-[440px] flex-col bg-white font-sans shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        {/* ── HEADER ─────────────────────────────── */}
        <div className="relative flex items-center justify-between border-b border-slate-100 bg-white/90 px-6 py-4.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#7E22CE]/10 text-[#7E22CE] shadow-xs">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Your Cart</h2>
              <p className="text-xs font-semibold text-slate-500">
                {items.length === 0
                  ? "No items added yet"
                  : `${items.length} product${items.length !== 1 ? "s" : ""} selected`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition-all duration-200 hover:bg-slate-200 hover:text-slate-900 active:scale-95"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── FREE DELIVERY PROGRESS BAR ──────────────── */}
        {items.length > 0 && (
          <div className={`px-6 py-3.5 border-b transition-colors duration-300 ${freeDelivery ? "bg-emerald-50/90 border-emerald-100" : "bg-purple-50/50 border-purple-100/60"}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2">
                <Truck size={16} className={freeDelivery ? "text-emerald-600" : "text-[#7E22CE]"} />
                {freeDelivery ? (
                  <span className="text-emerald-700 font-extrabold">Free Dubai Express Delivery Unlocked! 🎉</span>
                ) : (
                  <>Add <span className="font-black text-[#7E22CE]">{formatAED(remaining)}</span> for Free Delivery</>
                )}
              </p>
              <span className="text-xs font-black text-slate-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200/80 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  freeDelivery
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm"
                    : "bg-gradient-to-r from-[#7E22CE] to-purple-500 shadow-sm"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* ── CART ITEMS LIST ──────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
              <div className="relative grid h-24 w-24 place-items-center rounded-3xl bg-purple-50 text-[#7E22CE] shadow-inner">
                <ShoppingBag size={40} className="opacity-80" />
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#7E22CE] text-xs font-black text-white shadow-md">
                  0
                </span>
              </div>
              <div className="max-w-[260px]">
                <p className="text-lg font-extrabold text-slate-900">Your cart is empty</p>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                  Explore our premium balloons, party decor, and helium supplies!
                </p>
              </div>
              <Link
                href="/shop"
                onClick={closeCart}
                className="inline-flex items-center justify-center rounded-xl bg-[#7E22CE] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-purple-200 transition-all duration-200 hover:bg-[#6B21A8] hover:shadow-purple-300 active:scale-98"
              >
                Explore Shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((line) => (
                <li
                  key={line.key}
                  className="group relative flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 transition-all duration-200 hover:border-purple-200 hover:shadow-md hover:shadow-purple-50/50"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/shop/${line.slug}`}
                    onClick={closeCart}
                    className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-50 border border-slate-100 transition group-hover:border-purple-200"
                  >
                    {line.image ? (
                      <Image
                        src={line.image}
                        alt={line.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <BalloonVisual visual={line.visual} size={56} />
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/shop/${line.slug}`}
                          onClick={closeCart}
                          className="block text-sm font-bold text-slate-900 leading-snug line-clamp-2 hover:text-[#7E22CE] transition"
                        >
                          {line.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(line.key)}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-300 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remove ${line.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {(line.size || line.color) && (
                        <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-500">
                          {line.size && (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700">
                              {line.size.label || line.size}
                            </span>
                          )}
                          {line.color && (
                            <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[#7E22CE]">
                              {line.color}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quantity + Price Row */}
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQty(line.key, line.qty - 1)}
                          className="flex h-8 w-8 items-center justify-center text-slate-600 transition hover:text-[#7E22CE]"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-xs sm:text-sm font-bold text-slate-900">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(line.key, line.qty + 1)}
                          className="flex h-8 w-8 items-center justify-center text-slate-600 transition hover:text-[#7E22CE]"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className="font-display text-base font-extrabold text-[#7E22CE]">
                        {formatAED(line.price * line.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── FOOTER / CHECKOUT AREA ──────────────────── */}
        {items.length > 0 && (
          <div className="border-t border-slate-200/80 bg-white p-6 shadow-lg space-y-4">
            {/* Subtotal */}
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Cart Subtotal</p>
                <p className="mt-0.5 font-display text-2xl font-black tracking-tight text-slate-900">
                  {formatAED(subtotal)}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <ShieldCheck size={13} />
                VAT Included
              </span>
            </div>

            {/* Security Note */}
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium border-t border-slate-100 pt-3">
              <Lock size={13} className="text-slate-400 shrink-0" />
              Secure 256-Bit Encrypted Wholesale Checkout
            </p>

            {/* Checkout CTA Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="group flex w-full items-center justify-center rounded-xl bg-[#7E22CE] py-4 text-sm sm:text-base font-extrabold text-white shadow-lg shadow-purple-200 transition-all duration-200 hover:bg-[#6B21A8] hover:shadow-purple-300 active:scale-[0.98]"
            >
              Proceed to Checkout
            </Link>

            <button
              type="button"
              onClick={closeCart}
              className="w-full text-center text-xs sm:text-sm font-bold text-slate-500 transition hover:text-[#7E22CE]"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
