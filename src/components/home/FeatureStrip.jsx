import { Award, Grid3x3, Headphones, ShieldCheck, Truck } from "lucide-react";
import { DEFAULT_HOME_CONTENT } from "@/lib/homeContent";

const ICONS = [Award, Grid3x3, ShieldCheck, Truck, Headphones];

export default function FeatureStrip({ features }) {
  const items = features?.length ? features : DEFAULT_HOME_CONTENT.featureStrip;

  return (
    <section className="relative overflow-hidden border-y border-purple-400/30 bg-gradient-to-r from-[#1E0942] via-[#3B0A6B] to-[#1E0942] py-7 sm:py-9 shadow-2xl font-sans">
      {/* Shimmer hairlines top & bottom */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-400/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-pink-400/80 to-transparent" />

      {/* Ambient center glowing blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
        <div className="absolute left-1/4 top-1/2 h-64 w-[500px] -translate-y-1/2 rounded-full bg-purple-500/20 blur-[100px] animate-pulse-subtle" />
        <div className="absolute right-1/4 top-1/2 h-64 w-[500px] -translate-y-1/2 rounded-full bg-pink-500/20 blur-[100px] animate-pulse-subtle" />
      </div>

      <div className="container-page relative z-10">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-5 sm:gap-x-4 sm:gap-y-0 sm:divide-x sm:divide-purple-400/25">
          {items.map(({ title, copy }, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <div
                key={index}
                className={`group flex items-center gap-3 sm:gap-4 text-left sm:px-4 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                  index === 0
                    ? "justify-start"
                    : index === items.length - 1
                      ? "justify-start sm:justify-end"
                      : "justify-start sm:justify-center"
                }`}
              >
                {/* Icon ring — tinted at rest, fills brand gradient + glows on hover */}
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-purple-300/40 bg-white/10 text-purple-200 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-pink-300/70 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-pink-500/30 sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 sm:h-5.5 sm:w-5.5" strokeWidth={1.75} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-extrabold text-white leading-snug transition-colors group-hover:text-pink-200 sm:text-base md:text-base">
                    {title}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium leading-snug text-purple-200/80 transition-colors group-hover:text-purple-100 sm:text-base">
                    {copy}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
