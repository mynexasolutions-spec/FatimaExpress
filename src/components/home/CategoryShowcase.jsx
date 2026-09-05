import Link from "next/link";
import Image from "next/image";
import { Sparkles, Layers, ArrowRight } from "lucide-react";
import { categories as staticCategories } from "@/data/products";

export default function CategoryShowcase({ categories }) {
  const cats = categories?.length ? categories : staticCategories;

  return (
    <section className="container-page py-12 lg:py-16 font-sans">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE7F3] px-4 py-1.5 font-display text-base font-bold text-[#D946EF] shadow-2xs">
            <Sparkles size={13} className="text-[#EAB308] fill-[#EAB308] animate-pulse" />
            Explore Our Range
          </span>
          <h2 className="mt-2.5 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Shop By Category
          </h2>
        </div>
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 rounded-full bg-[#7E22CE] hover:bg-[#6D28D9] px-5 py-2.5 font-display text-base font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <span>View All Categories</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className="group relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-3xl border border-purple-100 bg-white p-6 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/10 hover:border-purple-300"
          >
            {cat.image ? (
              <>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              </>
            ) : (
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-purple-50 group-hover:bg-pink-100/50 transition-colors duration-500 blur-2xl" />
            )}

            <div className="relative z-10 flex items-center justify-between">
              <span
                className={`grid h-10 w-10 place-items-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 ${
                  cat.image
                    ? "bg-white/20 text-white backdrop-blur-md"
                    : "bg-purple-100/80 text-[#7E22CE] group-hover:bg-[#7E22CE] group-hover:text-white"
                }`}
              >
                <Layers size={18} />
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-extrabold transition-colors ${
                  cat.image ? "bg-white/20 text-white backdrop-blur-md" : "bg-slate-100 text-slate-700 group-hover:bg-purple-50 group-hover:text-[#7E22CE]"
                }`}
              >
                Wholesale Stock
              </span>
            </div>

            <div className="relative z-10 mt-auto pt-4">
              <h3 className={`font-display text-2xl font-extrabold tracking-tight transition-colors ${cat.image ? "text-white" : "text-[#0F172A] group-hover:text-[#7E22CE]"}`}>
                {cat.name}
              </h3>
              <p className={`mt-1 line-clamp-1 text-base font-medium ${cat.image ? "text-white/90" : "text-slate-500"}`}>{cat.blurb}</p>
              <div
                className={`mt-3 flex items-center gap-1.5 text-base font-bold opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 ${
                  cat.image ? "text-white" : "text-[#7E22CE]"
                }`}
              >
                <span>Browse Products</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
