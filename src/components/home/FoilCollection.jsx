import Link from "next/link";
import Image from "next/image";
import BalloonVisual from "@/components/product/BalloonVisual";
import FoilFeaturedSlider from "@/components/home/FoilFeaturedSlider";
import { shapes, themes } from "@/data/products";
import { DEFAULT_HOME_CONTENT } from "@/lib/homeContent";

// Shown automatically when no admin-authored slides exist yet, so the
// section never looks empty on a fresh install.
const FALLBACK_SPECS = [
  "Inflated Size: 18 inch / 45 cm",
  "Helium Support: Yes",
  "Float Time: Up to 5–7 days",
  "Self Sealing Valve",
];

const themeVisuals = {
  birthday: { kind: "cluster", color: "#e8bcae" },
  wedding: { kind: "heart", color: "#f3b9cd" },
  animal: { kind: "cluster", color: "#128740" },
  seasonal: { kind: "round", color: "#6d28c9" },
};

export default function FoilCollection({ featured, content }) {
  const { eyebrow, heading, slides: adminSlides } = content ?? DEFAULT_HOME_CONTENT.foil;

  const slides = adminSlides?.length
    ? adminSlides
    : featured
      ? [
          {
            image: featured.image,
            visual: featured.visual,
            title: featured.name,
            specs: FALLBACK_SPECS,
            productSlug: featured.slug,
          },
        ]
      : [];

  if (!slides.length) return null;

  return (
    <section className="container-page py-12 lg:py-16 font-sans">
      {/* Main Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-display text-base font-bold text-[#D946EF] block mb-1">
            {eyebrow || "FOIL BALLOONS COLLECTION"}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            {heading || "Find The Perfect Foil Balloon"}
          </h2>
        </div>
        <Link
          href="/shop?category=foil-balloons"
          className="group inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-5 py-2 font-display text-base font-bold text-[#7E22CE] shadow-2xs transition-all hover:bg-purple-50 hover:border-purple-300"
        >
          <span>View All Foil Balloons</span>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-stretch">
        {/* Left Side: Combined Filter Box (Responsive: 2x2 grid on mobile for BIG images, 1x4 on laptop) */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm flex flex-col justify-between">
          
          {/* ROW 1: BY SHAPE */}
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight mb-4">
              By Shape
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 text-center sm:divide-x sm:divide-slate-100">
              {shapes.map((shape, idx) => (
                <Link
                  key={shape.slug}
                  href={`/shop?category=foil-balloons&shape=${shape.slug}`}
                  className={`group flex flex-col items-center justify-between h-full rounded-2xl border sm:border-0 border-slate-100 bg-[#FFF5F8]/40 sm:bg-transparent p-3 sm:p-0 ${
                    idx > 0 ? "sm:pl-2" : ""
                  } transition-all duration-300 hover:scale-102 sm:hover:scale-100`}
                >
                  <div className="relative h-28 sm:h-24 w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-108">
                    {shape.image ? (
                      <Image
                        src={shape.image}
                        alt={shape.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 100px"
                        className="object-contain p-1 drop-shadow-xs"
                      />
                    ) : (
                      <BalloonVisual visual={{ kind: shape.visual, color: shape.color, label: "5" }} size={90} />
                    )}
                  </div>
                  <span className="mt-2.5 text-base font-bold text-slate-800 group-hover:text-[#7E22CE] transition-colors leading-tight">
                    {shape.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-slate-100 my-5 sm:my-6" />

          {/* ROW 2: BY THEME */}
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight mb-4">
              By Theme
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 text-center sm:divide-x sm:divide-slate-100">
              {themes.map((theme, idx) => (
                <Link
                  key={theme.slug}
                  href={`/shop?category=foil-balloons&theme=${theme.slug}`}
                  className={`group flex flex-col items-center justify-between h-full rounded-2xl border sm:border-0 border-slate-100 bg-[#FFF5F8]/40 sm:bg-transparent p-3 sm:p-0 ${
                    idx > 0 ? "sm:pl-2" : ""
                  } transition-all duration-300 hover:scale-102 sm:hover:scale-100`}
                >
                  <div className="relative h-28 sm:h-24 w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-108">
                    {theme.image ? (
                      <Image
                        src={theme.image}
                        alt={theme.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 100px"
                        className="object-contain p-1 drop-shadow-xs"
                      />
                    ) : (
                      <BalloonVisual visual={themeVisuals[theme.slug]} size={90} />
                    )}
                  </div>
                  <span className="mt-2.5 text-base font-bold text-slate-800 group-hover:text-[#7E22CE] transition-colors leading-tight">
                    {theme.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Featured Product Banner Card */}
        <FoilFeaturedSlider slides={slides} />
      </div>
    </section>
  );
}
