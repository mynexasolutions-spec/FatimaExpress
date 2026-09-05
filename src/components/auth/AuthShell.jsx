import Link from "next/link";
import { CheckCircle2, ShieldCheck, Sparkles, Truck } from "lucide-react";

const defaultPerks = [
  { title: "Wholesale Pricing", desc: "Exclusive bulk discounts for event planners & trade" },
  { title: "UAE-Wide Delivery", desc: "Express delivery across all 7 emirates" },
  { title: "Fast 1-Tap Reordering", desc: "Access order history and saved items anytime" },
];

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="font-sans min-h-[calc(100vh-80px)] bg-slate-50/50 flex items-center justify-center py-10 lg:py-16">
      <div className="container-page max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm lg:grid lg:grid-cols-12 lg:min-h-[580px]">
          {/* Left Decorative Banner — desktop only */}
          <div className="relative hidden overflow-hidden bg-purple-50/60 border-r border-purple-100 p-10 xl:p-12 text-slate-950 lg:col-span-5 lg:flex lg:flex-col lg:justify-between">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-purple-100/70 blur-3xl" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-purple-700 shadow-xs">
                <Sparkles size={13} />
                Fatima Express
              </span>

              <h2 className="mt-6 text-3xl xl:text-4xl font-bold leading-tight tracking-tight text-slate-950">
                Wholesale Party Supplies, Delivered UAE-Wide
              </h2>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed font-medium">
                Join hundreds of event planners, retailers, and party lovers creating memorable celebrations.
              </p>

              {/* Perks List */}
              <div className="mt-8 space-y-4">
                {defaultPerks.map((perk) => (
                  <div key={perk.title} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-purple-100 text-purple-700">
                      <CheckCircle2 size={13} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{perk.title}</p>
                      <p className="text-sm text-slate-500">{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Strip */}
            <div className="relative z-10 mt-8 pt-6 border-t border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <ShieldCheck size={16} className="text-purple-600" />
                <span>Verified Trade Partner</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Truck size={16} className="text-purple-600" />
                <span>Dubai Express</span>
              </div>
            </div>
          </div>

          {/* Right Form Area */}
          <div className="p-6 sm:p-12 lg:col-span-7 flex flex-col justify-center bg-white relative">
            <div className="max-w-md mx-auto w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                {title}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-500 font-normal">
                {subtitle}
              </p>

              <div className="mt-8">{children}</div>

              {footer && (
                <div className="mt-6 text-center text-sm sm:text-base text-slate-500 border-t border-slate-100 pt-6">
                  {footer}
                </div>
              )}

              <p className="mt-6 text-center text-sm text-slate-500">
                By continuing you agree to our service terms.{" "}
                <Link href="/contact" className="font-semibold text-purple-700 hover:underline">
                  Need help?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
