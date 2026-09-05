"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Crown,
  Gem,
  Gift,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wind,
} from "lucide-react";
import { DEFAULT_HOME_CONTENT } from "@/lib/homeContent";

const highlights = [
  {
    icon: Gem,
    title: "Premium Quality Balloons",
    bg: "bg-[#FCE7F3]",
    iconColor: "text-[#E11D48]",
  },
  {
    icon: Truck,
    title: "Fast Delivery Across UAE",
    bg: "bg-[#F3E8FF]",
    iconColor: "text-[#7E22CE]",
  },
  {
    icon: Wind,
    title: "Helium & Air Compatible",
    bg: "bg-[#E0F2FE]",
    iconColor: "text-[#0284C7]",
  },
];

const stats = [
  { icon: Gift, value: "5000+", label: "Happy Customers", color: "text-pink-500" },
  { icon: Star, value: "100+", label: "Event Partners", color: "text-amber-400 fill-amber-400" },
  { icon: Truck, value: "7", label: "Emirates Delivery", color: "text-purple-600" },
  { icon: ShieldCheck, value: "Trusted", label: "By Businesses", color: "text-emerald-500" },
];

const AUTO_ADVANCE_MS = 6000;

export default function Hero({ slides }) {
  const items = slides?.length ? slides : DEFAULT_HOME_CONTENT.heroSlides;
  const [active, setActive] = useState(0);
  const hasMultiple = items.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [hasMultiple, items.length]);

  useEffect(() => {
    if (active >= items.length) setActive(0);
  }, [items.length, active]);

  const hero = items[active] ?? items[0];
  const goTo = (index) => setActive((index + items.length) % items.length);

  return (
    <section className="relative w-full overflow-hidden bg-[#FFF5F8] pt-6 pb-6 sm:pt-10 sm:pb-8 lg:py-24 lg:min-h-[740px] flex items-center">

      {/* ========================================================================= */}
      {/* 🖼️ FULL-BLEED BACKGROUND IMAGES FOR MOBILE & DESKTOP                      */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {items.map((slide, index) => {
          const mobileImg = slide.mobileImage || slide.image;
          const desktopImg = slide.image || slide.mobileImage;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                index === active ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Mobile Background Image */}
              {mobileImg && (
                <Image
                  src={mobileImg}
                  alt="Wholesale balloons background"
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1023px) 100vw, 1px"
                  className="block lg:hidden object-cover object-center"
                />
              )}
              {/* Desktop Background Image */}
              {desktopImg && (
                <Image
                  src={desktopImg}
                  alt="Wholesale balloons background desktop"
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 100vw, 1px"
                  className="hidden lg:block object-cover object-right"
                />
              )}
            </div>
          );
        })}

        {/* Mobile Gradient Overlay (Ultra light for 100% clear image visibility) */}
        <div className="block lg:hidden absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30 pointer-events-none" />

        {/* Desktop Gradient Overlay */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#FFF5F8] via-[#FFF5F8]/95 via-55% sm:via-[#FFF5F8]/85 lg:via-[#FFF5F8]/75 to-transparent sm:w-[70%] lg:w-[60%]" />
      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE HERO LAYOUT — MATCHING EXACT USER REFERENCE DESIGN              */}
      {/* ========================================================================= */}
      <div className="container-page relative z-10 w-full lg:hidden flex flex-col items-center text-center pt-2 pb-2 min-h-[720px] justify-between">

        {/* --- TOP HEADER & TEXT AREA --- */}
        <div className="w-full flex flex-col items-center">
          {/* 1. Top Badges */}
          <div className="flex flex-nowrap items-center justify-center gap-1.5 sm:gap-2 animate-fade-up pt-1 max-w-full">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-[#FCE7F3]/95 px-3 py-1 font-display text-xs sm:text-xs font-bold text-[#D946EF] shadow-2xs whitespace-nowrap backdrop-blur-xs">
              <Sparkles size={11} className="text-[#EAB308] fill-[#EAB308]" />
              WHOLESALE PRICING
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-slate-100 bg-white/95 px-3 py-1 font-display text-xs sm:text-xs font-bold text-[#334155] shadow-xs backdrop-blur-xs whitespace-nowrap">
              <span className="relative flex h-3.5 w-3.5 shrink-0 overflow-hidden rounded-full border border-slate-200">
                <span className="absolute left-0 top-0 bottom-0 w-[30%] bg-[#EF4444] z-10" />
                <span className="absolute right-0 top-0 w-[70%] h-[33.33%] bg-[#10B981]" />
                <span className="absolute right-0 top-[33.33%] w-[70%] h-[33.33%] bg-white" />
                <span className="absolute right-0 bottom-0 w-[70%] h-[33.33%] bg-[#0F172A]" />
              </span>
              DELIVERY ACROSS UAE
            </span>
          </div>

          {/* 2. Main Headline */}
          <h1 className="animate-fade-up mt-3 font-display text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A] leading-[1.12] max-w-md">
            {hero.heading_line1 || "Bulk Orders For"}{" "}
            <span className="relative inline-block mt-0.5 bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#E11D48] bg-clip-text text-transparent pb-1">
              {hero.heading_line2 || "Events & Retail"}
              <svg
                className="absolute -bottom-1 left-0 w-full h-2.5 text-[#D946EF]/80 pointer-events-none"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 9C40 3 100 11 198 4" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* 4. Three Feature Icons with Whitish Blur Background */}
          <div className="animate-fade-up mt-3.5 grid grid-cols-3 gap-2 w-full max-w-xs sm:max-w-sm mx-auto text-center justify-items-center">
            {highlights.map(({ icon: Icon, title, bg, iconColor }) => (
              <div key={title} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/80 backdrop-blur-md p-2 border border-white/70 shadow-xs w-full">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${bg} shadow-xs`}>
                  <Icon size={16} className={iconColor} />
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#0F172A] leading-tight max-w-[85px]">
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- MIDDLE STAGE CONTROLS & FLOATING STAMP --- */}
        <div className="relative w-full my-auto py-14 flex items-center justify-center pointer-events-none">

          {/* Floating Pink Crown Badge (Right Side) */}
          <div className="pointer-events-auto absolute right-1 sm:right-4 top-2 z-20 flex h-20 w-20 rotate-6 flex-col items-center justify-center rounded-full border-2 border-dashed border-white/90 bg-[#EC4899] p-1.5 text-center text-white shadow-xl shadow-pink-500/40 ring-4 ring-pink-400/30 animate-float-slow">
            <Crown size={14} className="mb-0.5 text-yellow-300 fill-yellow-300 animate-pulse" />
            <p className="text-[10px] font-extrabold leading-tight drop-shadow-xs">
              EVENTS BIRTHDAYS RETAIL & MORE ♥
            </p>
          </div>
        </div>

        {/* --- BOTTOM BUTTONS & STATS --- */}
        <div className="w-full flex flex-col items-center">
          {/* Carousel Dots Pill Indicator (Shifted lower below balloons) */}
          {hasMultiple && (
            <div className="pointer-events-auto mb-3 flex items-center justify-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-pink-100/90 shadow-xs">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === active ? "w-5 bg-[#7E22CE]" : "w-1.5 bg-purple-300"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Action CTAs Row */}
          <div className="animate-fade-up flex items-center justify-center w-full max-w-sm mx-auto mb-3.5">
            <Link
              href={hero.ctaLink || "/contact"}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6D28D9] via-[#7E22CE] to-[#8B5CF6] px-6 py-3.5 font-display text-base font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-102 active:scale-98"
            >
              <span>{hero.ctaText || "Get Wholesale Pricing"}</span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </Link>
          </div>

          {/* Bottom Stats Card (2x2 Grid on Mobile to eliminate '...' text clipping) */}
          <div className="animate-fade-up w-full max-w-md rounded-2xl border border-pink-100/90 bg-white/95 backdrop-blur-md p-3 sm:p-4 shadow-md">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left">
              {stats.map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="flex items-center gap-2 rounded-xl bg-pink-50/40 p-2 sm:p-0 sm:bg-transparent border border-pink-100/50 sm:border-none">
                  <Icon size={18} className={`shrink-0 ${color}`} />
                  <div className="min-w-0 leading-tight">
                    <p className="text-sm sm:text-base font-black text-[#0F172A] tracking-tight whitespace-nowrap">{value}</p>
                    <p className="text-xs sm:text-xs font-bold text-slate-600 leading-tight whitespace-nowrap">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 💻 LAPTOP / DESKTOP LAYOUT (lg:) — FLOATING ACCENTS & CONTENT              */}
      {/* ========================================================================= */}

      {/* Floating Badges for Laptop with Gradient Glow & Animation */}
      <div className="hidden lg:flex absolute right-[5%] top-[8%] z-20 h-28 w-28 rotate-6 flex-col items-center justify-center rounded-full border-2 border-dashed border-white/90 bg-gradient-to-br from-[#EC4899] via-[#E11D48] to-[#7E22CE] p-2 text-center text-white shadow-2xl shadow-pink-500/40 ring-4 ring-pink-400/30 animate-float-slow transition-all duration-300 hover:rotate-12 hover:scale-110 group">
        <Crown size={20} className="mb-0.5 text-yellow-300 fill-yellow-300 animate-pulse transition-transform group-hover:scale-125" />
        <p className="text-xs font-extrabold leading-tight drop-shadow-sm">
          EVENTS BIRTHDAYS RETAIL & MORE ♥
        </p>
      </div>

      <Link
        href="/shop"
        className="hidden lg:flex absolute bottom-[8%] right-[4%] z-20 items-center gap-3 rounded-full bg-white/95 px-5 py-3 shadow-2xl backdrop-blur-md border border-purple-100 transition-all hover:-translate-y-1 hover:scale-105 hover:bg-white group"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#7E22CE] to-[#D946EF] text-white shadow-md transition-transform group-hover:rotate-12">
          <Truck size={15} />
        </span>
        <span className="leading-tight">
          <span className="block text-base font-extrabold text-[#0F172A] group-hover:text-[#7E22CE] transition-colors">Wholesale Supply</span>
          <span className="block text-sm font-medium text-slate-500">Across UAE</span>
        </span>
        <ChevronRight size={14} className="ml-0.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Laptop Main Content Column */}
      <div className="container-page relative z-10 w-full hidden lg:block">
        <div key={active} className="max-w-2xl">
          {/* Top Badges */}
          <div className="animate-fade-up flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE7F3] px-4 py-1.5 font-display text-base font-bold text-[#D946EF] shadow-2xs">
              <Sparkles size={14} className="text-[#EAB308] fill-[#EAB308]" />
              Wholesale Pricing
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white/90 px-4 py-1.5 font-display text-base font-bold text-[#334155] shadow-xs backdrop-blur">
              <span className="relative flex h-4 w-4 shrink-0 overflow-hidden rounded-full border border-slate-200">
                <span className="absolute left-0 top-0 bottom-0 w-[30%] bg-[#EF4444] z-10" />
                <span className="absolute right-0 top-0 w-[70%] h-[33.33%] bg-[#10B981]" />
                <span className="absolute right-0 top-[33.33%] w-[70%] h-[33.33%] bg-white" />
                <span className="absolute right-0 bottom-0 w-[70%] h-[33.33%] bg-[#0F172A]" />
              </span>
              Delivery Across UAE
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up mt-4 font-display text-[56px] font-extrabold tracking-tight text-[#0F172A] leading-[1.08]">
            {hero.heading_line1 || "Bulk Orders For"}{" "}
            <span className="relative inline-block mt-1 bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#E11D48] bg-clip-text text-transparent pb-1">
              {hero.heading_line2 || "Events & Retail"}
              <svg
                className="absolute -bottom-1.5 left-0 w-full h-3 text-[#D946EF]/80 pointer-events-none"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 9C40 3 100 11 198 4" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="animate-fade-up mt-4 text-base font-normal leading-relaxed text-[#475569] max-w-lg">
            {hero.description ||
              "Planning a big event or stocking your store? Get wholesale pricing on foil balloons, bubble balloons and accessories with fast delivery across all seven emirates."}
          </p>

          {/* Feature Highlights Row */}
          <div className="animate-fade-up mt-7 flex flex-wrap items-center gap-8">
            {highlights.map(({ icon: Icon, title, bg, iconColor }) => (
              <div key={title} className="group flex items-center gap-3">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${bg} shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                  <Icon size={20} className={iconColor} />
                </span>
                <span className="text-base font-bold text-[#0F172A] leading-tight max-w-[110px]">
                  {title}
                </span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="animate-fade-up mt-7 flex items-center gap-6">
            <Link
              href={hero.ctaLink || "/contact"}
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#6D28D9] via-[#7E22CE] to-[#8B5CF6] px-7 py-3.5 font-display text-base font-bold text-white shadow-lg shadow-purple-300/50 transition-all duration-200 hover:from-[#5B21B6] hover:to-[#7E22CE] hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>{hero.ctaText || "Get Wholesale Pricing"}</span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#6D28D9] shadow-xs transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={16} className="stroke-[2.5]" />
              </span>
            </Link>
          </div>

          {/* Stats Bar (Desktop/Laptop - No '...' text clipping) */}
          <div className="animate-fade-up mt-8 grid grid-cols-4 gap-3 rounded-2xl border border-pink-100/80 bg-white/95 p-4 shadow-sm backdrop-blur-md max-w-2xl">
            {stats.map(({ icon: Icon, value, label, color }, idx) => (
              <div key={label} className={`flex items-center gap-2.5 ${idx > 0 ? "border-l border-slate-100 pl-3.5" : ""}`}>
                <Icon size={22} className={`shrink-0 ${color}`} />
                <div className="min-w-0 leading-tight">
                  <p className="text-base font-black text-[#0F172A] tracking-tight whitespace-nowrap">{value}</p>
                  <p className="text-xs font-bold text-slate-600 leading-tight whitespace-nowrap">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Laptop Slider Pagination Dots */}
      {hasMultiple && (
        <div className="absolute bottom-4 left-1/2 z-20 hidden lg:flex -translate-x-1/2 items-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to banner ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${index === active ? "w-6 bg-[#7E22CE]" : "w-2 bg-purple-200 hover:bg-purple-300"
                }`}
            />
          ))}
        </div>
      )}

    </section>
  );
}
