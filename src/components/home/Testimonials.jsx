"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Quote,
  ShoppingBag,
  Sparkles,
  Star,
  ThumbsUp,
  User,
} from "lucide-react";
import { DEFAULT_HOME_CONTENT } from "@/lib/homeContent";

const AUTO_ADVANCE_MS = 5000;

export default function Testimonials({ testimonials, heading }) {
  const items = testimonials?.length ? testimonials : DEFAULT_HOME_CONTENT.testimonials;
  const { eyebrow, heading: title } = heading ?? DEFAULT_HOME_CONTENT.testimonialsHeading;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  useEffect(() => {
    const track = trackRef.current;
    const card = track?.children[index];
    if (card) track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }, [index]);

  if (!items.length) return null;

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FDF3F8] to-[#FFF5F8] py-16 lg:py-24 font-sans">
      {/* Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-[#D946EF]/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-24 bottom-1/3 h-96 w-96 rounded-full bg-[#7E22CE]/10 blur-[130px]" />

      <div className="container-page relative z-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/90 px-4 py-1.5 font-display text-base font-bold text-[#D946EF] shadow-2xs backdrop-blur-md">
            <Sparkles size={14} className="text-[#EAB308] fill-[#EAB308]" />
            {eyebrow || "Real Buyer Reviews"}
          </span>

          <h2 className="mt-3.5 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
            {title || "Trusted By UAE Decorators & Retailers"}
          </h2>

          {/* UAE Trust Summary Bar */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 rounded-2xl sm:rounded-full bg-white/90 px-4 sm:px-6 py-2.5 sm:py-2 border border-purple-100/90 shadow-2xs text-xs sm:text-sm font-semibold text-slate-700 backdrop-blur-sm max-w-sm sm:max-w-none">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-extrabold text-[#0F172A] text-xs sm:text-sm">4.9 / 5.0 Rating</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center justify-center gap-1.5 text-[#7E22CE] font-bold text-xs sm:text-sm text-center">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>500+ Verified Business Reviews Across UAE</span>
            </div>
          </div>
        </div>

        {/* REVIEWS CAROUSEL */}
        <div
          className="relative mt-12 sm:mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Previous Arrow */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={prev}
              aria-label="Previous review"
              className="absolute left-0 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-100 bg-white/95 p-3 text-slate-700 shadow-xl backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-[#7E22CE] hover:scale-110 sm:-translate-x-6 sm:flex"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Review Cards Grid / Track */}
          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth py-4 px-1"
          >
            {items.map((testimonial, i) => (
              <div
                key={i}
                className="w-full shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              >
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-purple-100/90 bg-gradient-to-b from-white via-white to-[#FDF5FA]/80 p-6 sm:p-7 shadow-lg shadow-purple-950/5 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-pink-300 hover:shadow-2xl hover:shadow-purple-500/15">
                  
                  {/* Top Accent Gradient Bar on Hover */}
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#E11D48] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Watermark Quote Icon */}
                  <Quote
                    size={52}
                    className="pointer-events-none absolute right-4 top-4 text-purple-100/40 transition-colors duration-300 group-hover:text-pink-100/60"
                  />

                  <div>
                    {/* Top Row: Stars + Location Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            size={15}
                            className={
                              starIdx < (testimonial.rating ?? 5)
                                ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                                : "fill-slate-100 text-slate-200"
                            }
                          />
                        ))}
                      </div>

                      {testimonial.location && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50/80 px-2.5 py-0.5 text-sm font-bold text-[#7E22CE] border border-purple-100">
                          <MapPin size={11} className="text-purple-600" />
                          {testimonial.location}
                        </span>
                      )}
                    </div>

                    {/* Review Quote Body */}
                    <p className="relative mt-4 text-base sm:text-base font-semibold leading-relaxed text-slate-800">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {/* Purchased Item Tag */}
                    {testimonial.purchase && (
                      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#FCE7F3] px-3 py-1 font-display text-sm font-bold text-[#D946EF]">
                        <ShoppingBag size={11} />
                        Order: {testimonial.purchase}
                      </div>
                    )}
                  </div>

                  {/* Customer Info Footer */}
                  <div className="relative mt-6 flex items-center gap-3.5 border-t border-slate-100/90 pt-4">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-purple-200 shadow-sm ring-2 ring-purple-50">
                      {testimonial.avatar ? (
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#7E22CE] to-[#EC4899] text-white text-base font-extrabold">
                          {testimonial.name?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="truncate text-base sm:text-base font-extrabold text-[#0F172A] group-hover:text-[#7E22CE] transition-colors">
                          {testimonial.name}
                        </p>
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      </div>
                      {testimonial.role && (
                        <p className="truncate text-sm font-medium text-slate-500">
                          {testimonial.role}
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Next Arrow */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={next}
              aria-label="Next review"
              className="absolute right-0 top-1/2 z-20 hidden translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-100 bg-white/95 p-3 text-slate-700 shadow-xl backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-[#7E22CE] hover:scale-110 sm:translate-x-6 sm:flex"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Mobile Carousel Indicators */}
          {items.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-1.5 lg:hidden">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-5 bg-gradient-to-r from-[#7E22CE] to-[#D946EF]"
                      : "w-1.5 bg-purple-200 hover:bg-purple-300"
                  }`}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
