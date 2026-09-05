import Link from "next/link";
import Image from "next/image";
import { Wind, Shield, Sparkles } from "lucide-react";
import { DEFAULT_HOME_CONTENT } from "@/lib/homeContent";

const featureIcons = [Wind, Shield, Sparkles];

export default function BubbleSection({ content }) {
  const bubble = content ?? DEFAULT_HOME_CONTENT.bubble;
  const features = bubble.features?.length ? bubble.features : DEFAULT_HOME_CONTENT.bubble.features;
  const steps = bubble.steps?.length ? bubble.steps : DEFAULT_HOME_CONTENT.bubble.steps;

  return (
    <section className="relative overflow-hidden bg-[#FAF5FF] py-14 lg:py-20 font-sans border-y border-purple-100/50">

      <div className="container-page relative z-10 grid items-center gap-8 lg:grid-cols-12 w-full">

        {/* Left Column: Title, Features & CTA Button */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left">
          <span className="font-display text-base font-bold text-[#EC4899] block mb-2">
            {bubble.eyebrow || "BUBBLE & SPECIALTY BALLOONS"}
          </span>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-[1.1]">
            {bubble.heading || "CRYSTAL CLEAR. STUNNING INSIDE & OUT."}
          </h2>

          <p className="mt-3.5 text-base sm:text-base font-medium leading-relaxed text-slate-600 max-w-xl">
            {bubble.description || "Our stretchy bubble balloons are made from durable, crystal-clear TPU — perfect for creative decorations, gift reveals and long-lasting float."}
          </p>

          {/* Features List */}
          <ul className="mt-6 space-y-4.5">
            {features.map(({ title, copy }, index) => {
              const Icon = featureIcons[index] ?? featureIcons[0];
              return (
                <li key={title} className="group flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F3E8FF] text-[#7E22CE] shadow-2xs transition-transform duration-300 group-hover:scale-110">
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <div>
                    <p className="text-base sm:text-base font-extrabold text-[#0F172A] leading-snug">{title}</p>
                    <p className="text-sm sm:text-base font-medium text-slate-500 mt-0.5 leading-relaxed">{copy}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* CTA Button */}
          <div className="mt-8">
            <Link
              href="/shop?category=bubble-balloons"
              className="inline-flex items-center justify-center rounded-full bg-[#7E22CE] hover:bg-[#6D28D9] px-8 py-3.5 font-display text-base font-extrabold text-white shadow-lg shadow-purple-900/15 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {bubble.buttonText || "EXPLORE BUBBLE BALLOONS"}
            </Link>
          </div>
        </div>

        {/* Center Column: Big Floating Hero Bubble Balloon */}
        <div className="lg:col-span-3 flex justify-center items-center py-4 lg:py-0">
          <div className="relative aspect-square w-full max-w-[280px] sm:max-w-[340px] lg:max-w-full flex items-center justify-center animate-float-slow">
            <Image
              src={bubble.image || "https://res.cloudinary.com/b0g8psvq/image/upload/f_auto,q_auto,w_600/fatima-express/products/feather-filled-bubble.jpg"}
              alt="Crystal Clear Bubble Balloon Showcase"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Right Column: "How To Pre-Stretch" Card */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl shadow-purple-900/5 border border-slate-100/90">
            
            {/* Card Header */}
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
                {bubble.howToHeading || "How To Pre-Stretch"}
              </h3>
            </div>

            {/* Steps Vertical List */}
            <div className="mt-4 space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="relative h-16 w-22 shrink-0 overflow-hidden rounded-xl bg-purple-50/60 border border-purple-100/80 shadow-2xs flex items-center justify-center">
                    <Image
                      src={step.image}
                      alt={step.copy}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 grid h-5 w-5 place-items-center rounded-full bg-[#7E22CE] text-sm font-extrabold text-white shadow-md z-10">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-base font-bold text-[#0F172A] leading-snug">
                    {step.copy}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

