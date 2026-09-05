import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { DEFAULT_HOME_CONTENT } from "@/lib/homeContent";

export default function InspirationGallery({ setups, heading }) {
  const cards = setups?.length ? setups : DEFAULT_HOME_CONTENT.gallery;
  const { eyebrow, heading: title } = heading ?? DEFAULT_HOME_CONTENT.galleryHeading;

  return (
    <section className="container-page py-12 lg:py-16">
      {/* Header */}
      <div className="flex flex-col items-start gap-2 mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE7F3] px-4 py-1.5 font-display text-base font-bold text-[#D946EF] shadow-2xs">
          <Sparkles size={13} className="text-[#EAB308] fill-[#EAB308]" />
          {eyebrow || "Get Inspired"}
        </span>
        <h2 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A]">
          {title || "Decorations That Speak Volumes"}
        </h2>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((setup, idx) => (
          <Link
            key={idx}
            href={`/shop?theme=${setup.theme}`}
            className="group relative flex aspect-[4/5] sm:aspect-square flex-col justify-end overflow-hidden rounded-3xl border border-pink-100/80 shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-pink-300 hover:shadow-xl hover:shadow-purple-900/10"
          >
            <Image
              src={setup.image}
              alt={setup.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

            {/* Bottom Label Pill — Full Title Display (No '...' Truncation) */}
            <div className="relative z-10 m-2.5 sm:m-3 flex items-center justify-center rounded-2xl sm:rounded-full bg-white/95 px-3 sm:px-4 py-2 sm:py-2.5 text-center text-sm sm:text-base font-extrabold text-[#0F172A] shadow-md backdrop-blur-md transition-all duration-300 group-hover:bg-[#7E22CE] group-hover:text-white group-hover:shadow-lg">
              <span className="whitespace-normal leading-tight text-center">{setup.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
