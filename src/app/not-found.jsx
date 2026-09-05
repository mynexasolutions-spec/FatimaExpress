import Link from "next/link";
import { ArrowLeft, Compass, Home, Sparkles } from "lucide-react";
import BalloonVisual from "@/components/product/BalloonVisual";

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FDF4FA] to-[#FFF5F8] py-16 sm:py-24 font-sans">
      
      {/* ── Atmospheric Glowing Ambient Blobs ──────────────── */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-[420px] w-[420px] rounded-full bg-[#D946EF]/15 blur-[120px] animate-pulse" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-[420px] w-[420px] rounded-full bg-[#7E22CE]/15 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container-page relative z-10 flex flex-col items-center text-center">
        
        {/* Giant 404 Watermark + Floating Balloon Centerpiece */}
        <div className="relative flex items-center justify-center">
          <span className="font-display text-[120px] sm:text-[180px] lg:text-[220px] font-black leading-none tracking-tighter text-purple-900/5 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center animate-float drop-shadow-[0_20px_35px_rgba(217,70,239,0.3)]">
            <BalloonVisual visual={{ kind: "round", color: "#EC4899" }} size={160} />
          </div>
        </div>

        {/* Eyebrow Badge */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-pink-200/90 bg-white/90 px-4 py-1.5 font-display text-xs sm:text-sm font-bold text-[#D946EF] shadow-xs backdrop-blur-md">
          <Sparkles size={14} className="text-[#EAB308] fill-[#EAB308]" />
          Oops! Lost In The Air
        </div>

        {/* Headline */}
        <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0F172A] leading-tight">
          This Balloon <span className="bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#E11D48] bg-clip-text text-transparent">Popped!</span>
        </h1>

        {/* Description */}
        <p className="mt-3.5 text-sm sm:text-base text-slate-600 max-w-md font-medium leading-relaxed">
          The page you&apos;re looking for might have floated away, been moved, or no longer exists in our catalog.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#6D28D9] via-[#7E22CE] to-[#8B5CF6] px-7 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 active:scale-95"
          >
            <Home size={16} />
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2.5 rounded-full border border-purple-200/90 bg-white/90 px-7 py-3.5 text-xs sm:text-sm font-extrabold text-[#7E22CE] shadow-xs backdrop-blur-md transition-all duration-300 hover:bg-purple-50 hover:border-purple-300 hover:scale-105 active:scale-95"
          >
            <Compass size={16} className="text-[#7E22CE]" />
            Explore Wholesale Shop
          </Link>
        </div>

      </div>
    </div>
  );
}

