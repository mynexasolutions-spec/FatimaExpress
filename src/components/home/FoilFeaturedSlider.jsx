"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import BalloonVisual from "@/components/product/BalloonVisual";

const AUTO_SWIPE_INTERVAL_MS = 5000;

export default function FoilFeaturedSlider({ slides }) {
  const [index, setIndex] = useState(0);
  const hasMultiple = slides?.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTO_SWIPE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [hasMultiple, slides?.length]);

  if (!slides?.length) return null;
  const slide = slides[Math.min(index, slides.length - 1)];

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div className="lg:col-span-6 rounded-3xl bg-[#F6F0FD] border border-purple-100/80 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group/card transition-all duration-300">
      
      <div className="grid sm:grid-cols-12 gap-6 items-center my-auto">
        
        {/* Left: Big Floating Balloon Image */}
        <div className="sm:col-span-6 relative aspect-square w-full flex items-center justify-center p-2">
          {slide.image ? (
            <Image
              key={slide.image}
              src={slide.image}
              alt={slide.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            />
          ) : slide.visual ? (
            <div className="drop-shadow-2xl transition-transform duration-500 hover:scale-105">
              <BalloonVisual visual={slide.visual} size={280} />
            </div>
          ) : null}
        </div>

        {/* Right: Title, Specs & Shop Now Button */}
        <div className="sm:col-span-6 flex flex-col justify-center text-left">
          <h3 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
            {slide.title}
          </h3>

          {/* Specs List with Solid Purple Checkmark Badges */}
          {slide.specs?.length > 0 && (
            <ul className="mt-4 space-y-2.5 text-base font-bold text-slate-700">
              {slide.specs.map((spec, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#7E22CE] text-white shadow-2xs">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="leading-snug">{spec}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Solid CTA Button */}
          <div className="mt-6">
            <Link
              href={slide.productSlug ? `/shop/${slide.productSlug}` : "/shop?category=foil-balloons"}
              className="inline-flex items-center justify-center rounded-2xl bg-[#7E22CE] hover:bg-[#6D28D9] px-7 py-3 font-display text-base font-extrabold text-white shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Centered Slider Navigation Controls at Bottom */}
      {slides.length > 1 && (
        <div className="mt-6 pt-3 flex items-center justify-center gap-3 relative z-10 text-[#7E22CE]">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="p-1 text-[#7E22CE] hover:scale-125 transition-transform"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          
          <div className="flex items-center gap-1.5 px-1">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-2.5 bg-[#7E22CE]" : "w-2 bg-[#7E22CE]/30 hover:bg-[#7E22CE]/60"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="p-1 text-[#7E22CE] hover:scale-125 transition-transform"
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      )}

    </div>
  );
}
