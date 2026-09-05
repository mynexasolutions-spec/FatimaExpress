"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Send, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { createClient, supabaseEnabled } from "@/lib/supabase/client";
import { DEFAULT_HOME_CONTENT } from "@/lib/homeContent";

export default function Newsletter({ content }) {
  const { heading, image, subtext } = content ?? DEFAULT_HOME_CONTENT.newsletter;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const subscribe = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    if (!supabaseEnabled) {
      setStatus("done");
      setMessage("You're subscribed! Use promo code FATIMA10 for 10% off.");
      setEmail("");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim() });

    if (error && error.code !== "23505") {
      setStatus("error");
      setMessage("Something went wrong. Please try again or message us on WhatsApp.");
      return;
    }

    setStatus("done");
    setMessage("You're subscribed! Use promo code FATIMA10 for 10% off.");
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden py-12 lg:py-16 font-sans">
      <div className="container-page relative">
        
        {/* Main Luxury Floating Card Container */}
        <div className="relative overflow-hidden rounded-3xl bg-[#7E22CE] p-6 sm:p-10 lg:p-12 text-white shadow-2xl shadow-purple-900/20 border border-purple-500/30">
          
          {/* Subtle Decorative Glow Background */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#D946EF]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-900/40 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Area (Col 7) */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-md border border-white/20">
                <Sparkles size={14} className="text-[#EAB308] fill-[#EAB308] animate-pulse" />
                <span className="font-display text-base font-bold text-pink-200">
                  Special Offers & Gifts
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {heading || "Special Offers & Party Ideas Straight To Your Inbox!"}
              </h2>

              {/* Subscription Form / Success Card */}
              <div className="pt-2 max-w-lg mx-auto lg:mx-0">
                {status === "done" ? (
                  <div className="rounded-2xl border border-emerald-400/40 bg-emerald-950/60 p-4 backdrop-blur-md flex items-center gap-3.5 text-left text-emerald-200 animate-fadeIn">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-md">
                      <CheckCircle2 size={20} />
                    </span>
                    <div>
                      <p className="text-base font-extrabold text-white">🎉 Subscription Confirmed!</p>
                      <p className="text-base font-medium text-emerald-300 mt-0.5">{message}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={subscribe} className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch gap-2.5 rounded-2xl bg-white p-1.5 shadow-xl">
                      <div className="relative flex-1 flex items-center pl-3.5">
                        <Mail size={18} className="text-slate-400 shrink-0" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address..."
                          className="w-full bg-transparent px-3 py-2.5 text-base sm:text-base font-medium text-[#0F172A] placeholder-slate-400 outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#EC4899] hover:bg-[#D946EF] px-6 py-3 font-display text-base sm:text-base font-extrabold text-white shadow-md transition-all hover:scale-102 active:scale-95 disabled:opacity-70 shrink-0"
                      >
                        {status === "loading" ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <>
                            <span>Subscribe</span>
                            <Send size={14} className="stroke-[2.5]" />
                          </>
                        )}
                      </button>
                    </div>

                    {status === "error" && (
                      <p className="text-base font-semibold text-pink-200 text-center lg:text-left">{message}</p>
                    )}
                  </form>
                )}
              </div>

            </div>

            {/* Right Image / Showcase Area (Col 5) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-4/3 rounded-2xl overflow-hidden animate-float-slow">
                <Image
                  src={image || "/newsletter.png"}
                  alt="Special Offers & Gifts"
                  fill
                  priority
                  sizes="(max-width: 1024px) 280px, 340px"
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
