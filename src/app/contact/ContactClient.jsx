"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Headphones,
  LoaderCircle,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { createClient, supabaseEnabled } from "@/lib/supabase/client";
import { site, whatsappLink } from "@/data/site";
import Reveal from "@/components/ui/Reveal";

const TOPICS = ["Wholesale enquiry", "Bulk order quote", "Event decoration", "Delivery question", "Other"];

const TRUST_BADGES = [
  { icon: Truck, title: "Fast UAE-Wide Delivery", desc: "Dispatched across all seven emirates" },
  { icon: ShieldCheck, title: "Official Wholesale Distributor", desc: "Trusted by event partners & retailers" },
  { icon: Headphones, title: "Dedicated Support", desc: "WhatsApp & email assistance" },
];

const FAQS = [
  {
    q: "Do you offer wholesale / bulk pricing?",
    a: "Yes — most products carry quantity-based discount tiers, and larger orders get custom wholesale pricing. Send us your requirement via the form or WhatsApp for a quote.",
  },
  {
    q: "Which areas in the UAE do you deliver to?",
    a: "We deliver across all seven emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah and Umm Al Quwain.",
  },
  {
    q: "How fast will I get a response?",
    a: "Our team typically replies within 2 hours during business hours. For the fastest response, message us directly on WhatsApp.",
  },
  {
    q: "What are your business hours?",
    a: "We're available Saturday to Thursday, 9:00 AM to 7:00 PM. Outside these hours, drop a message and we'll get back to you first thing.",
  },
];

export default function ContactClient({ contact = site }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Wholesale enquiry", message: "" });
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLocation, setCopiedLocation] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus("loading");

    if (supabaseEnabled) {
      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").insert(form);
      if (error) {
        setStatus("error");
        setFeedback("Message delivery failed. Please connect directly via WhatsApp.");
        return;
      }
    }

    setStatus("done");
    setForm({ name: "", email: "", phone: "", subject: "Wholesale enquiry", message: "" });
  };

  const copyToClipboard = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const mapsQuery = encodeURIComponent(contact.location);
  const googleMapsUrl = `https://www.google.com/maps?q=${mapsQuery}`;
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;

  const inputClass =
    "w-full rounded-2xl border border-purple-100 bg-purple-50/30 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100";
  const labelClass = "mb-1.5 block font-display text-sm font-bold text-slate-700";

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero Header */}
      <div className="relative overflow-hidden py-14 sm:py-20">
        <div className="pointer-events-none absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-purple-200/25 blur-[120px]" />
        <div className="pointer-events-none absolute -right-24 top-1/3 h-[480px] w-[480px] rounded-full bg-pink-200/20 blur-[130px]" />

        <div className="container-page relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center gap-3 sm:gap-6">
            <span className="h-[1.5px] w-6 shrink-0 bg-gradient-to-r from-transparent via-purple-300 to-pink-400 sm:w-16" />
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-purple-200 bg-white px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold text-purple-700 shadow-sm">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Avg. Reply Under 2 Hours
            </span>
            <span className="h-[1.5px] w-6 shrink-0 bg-gradient-to-l from-transparent via-purple-300 to-pink-400 sm:w-16" />
          </div>

          <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl">
            Let&apos;s Talk About Your{" "}
            <span className="bg-gradient-to-r from-[#7E22CE] via-[#9333EA] to-[#D946EF] bg-clip-text text-transparent">
              Next Order
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
            For wholesale accounts, bulk orders, product specifications, or delivery schedules across the UAE, our
            team responds promptly.
          </p>
        </div>
      </div>

      {/* Main Grid: Form left, Channels right */}
      <div className="container-page grid max-w-6xl items-start gap-8 pb-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-3xl border border-purple-100 bg-white p-6 shadow-xl transition-all duration-500 hover:border-purple-200 sm:p-8 md:p-10">
            <div className="pointer-events-none absolute -left-12 -top-12 h-56 w-56 rounded-full bg-purple-100/50 blur-3xl" />

            {status === "done" ? (
              <div className="relative py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-purple-200 bg-purple-50 text-purple-700 ring-8 ring-purple-50">
                  <CheckCircle2 size={30} />
                </div>
                <span className="mt-5 inline-flex font-display text-sm font-bold text-purple-700">
                  Message Received
                </span>
                <h3 className="mt-2 font-display text-2xl font-extrabold text-slate-950">Thank You for Reaching Out</h3>
                <p className="mx-auto mt-2.5 max-w-sm text-sm text-slate-600">
                  We&apos;ve received your message and will respond within 2 hours during business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6D28D9] to-[#9333EA] px-7 py-3 font-display text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:from-[#5B21B6] hover:to-[#7E22CE]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="relative mb-6 flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 font-display text-xs font-extrabold text-purple-700">
                    <Sparkles size={13} /> Send Us A Message
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                    <ShieldCheck size={14} /> Priority Response
                  </span>
                </div>
                <h2 className="relative font-display text-2xl font-extrabold text-slate-950 sm:text-3xl">
                  How Can We Help You Today?
                </h2>
                <p className="relative mt-1.5 text-sm text-slate-500">
                  Select a topic below or type your query — we reply promptly.
                </p>

                <form onSubmit={submit} className="relative mt-6 space-y-5">
                  <div>
                    <label className={labelClass}>What is your query about?</label>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setForm((current) => ({ ...current, subject: topic }))}
                          className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition-all duration-300 ${
                            form.subject === topic
                              ? "bg-gradient-to-r from-[#6D28D9] to-[#9333EA] text-white shadow-sm ring-2 ring-purple-200"
                              : "border border-purple-100 bg-purple-50/40 text-slate-600 hover:border-purple-300 hover:text-purple-700"
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input required value={form.name} onChange={update("name")} className={inputClass} placeholder="John Doe" />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <input value={form.phone} onChange={update("phone")} className={inputClass} placeholder="+971 50 123 4567" />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input required type="email" value={form.email} onChange={update("email")} className={inputClass} placeholder="name@company.com" />
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className={labelClass}>Your Message *</label>
                      <span className="text-xs font-semibold text-slate-400">{form.message.length} / 500</span>
                    </div>
                    <textarea
                      required
                      rows={5}
                      maxLength={500}
                      value={form.message}
                      onChange={update("message")}
                      className={`${inputClass} resize-none`}
                      placeholder="Write your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6D28D9] to-[#9333EA] px-8 py-3.5 font-display text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:from-[#5B21B6] hover:to-[#7E22CE] disabled:opacity-70 sm:w-fit"
                  >
                    {status === "loading" ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} className="transition-transform group-hover:translate-x-1" />
                    )}
                    Submit Inquiry
                  </button>

                  {status === "error" && (
                    <p className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                      <AlertCircle size={15} /> {feedback}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </Reveal>

        {/* Right Column: Direct Channels */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <Reveal>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-purple-100 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-purple-50 text-purple-700 shadow-inner transition-transform duration-500 group-hover:scale-110">
                    <Mail size={20} />
                  </span>
                  <div className="min-w-0">
                    <span className="font-display text-xs font-bold text-purple-600">Email Support</span>
                    <p className="mt-0.5 truncate font-display text-base font-bold text-slate-950 transition-colors group-hover:text-purple-700">
                      {contact.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(contact.email, setCopiedEmail)}
                  title="Copy email"
                  className="shrink-0 rounded-xl border border-purple-100 bg-purple-50/50 p-2 text-slate-500 transition-all hover:border-purple-300 hover:text-purple-700"
                >
                  {copiedEmail ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-purple-50 pt-4 text-sm font-medium text-slate-500">
                <span>Direct inquiries</span>
                <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1 font-bold text-purple-700 transition hover:text-purple-900">
                  Send email <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <a
              href={whatsappLink(undefined, contact.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.25)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-inner transition-transform duration-500 group-hover:scale-110">
                    <WhatsAppIcon size={20} />
                  </span>
                  <div className="min-w-0">
                    <span className="font-display text-xs font-bold text-emerald-700">WhatsApp Support</span>
                    <p className="mt-0.5 truncate font-display text-base font-bold text-slate-950 transition-colors group-hover:text-emerald-800">
                      {contact.whatsappDisplay}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-xl border border-emerald-200 bg-emerald-100/70 p-2 text-emerald-700 transition-transform group-hover:scale-110">
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-emerald-100 pt-4 text-sm font-medium text-emerald-800/80">
                <span>Instant chat response</span>
                <span className="font-bold text-emerald-700 group-hover:underline">Chat Now</span>
              </div>
            </a>
          </Reveal>

          <Reveal delay={160}>
            <div className="flex h-full flex-col justify-between rounded-3xl border border-purple-100 bg-white p-6 shadow-lg transition-all duration-500 hover:border-purple-300">
              <div className="flex items-center gap-3.5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-purple-50 text-purple-700 shadow-inner">
                  <Clock size={20} />
                </span>
                <div>
                  <span className="font-display text-xs font-bold text-purple-600">Business Hours</span>
                  <p className="mt-0.5 font-display text-base font-bold text-slate-950">Sat – Thu, 9 AM – 7 PM</p>
                </div>
              </div>
              <p className="mt-3.5 text-sm leading-relaxed text-slate-500">
                Friday: WhatsApp stays active for urgent order inquiries.
              </p>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-lg">
              <span className="mb-3 block font-display text-xs font-bold text-purple-600">
                Connect With Us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="grid h-11 w-11 place-items-center rounded-2xl border border-purple-100 bg-purple-50/40 text-purple-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white"
                >
                  <FacebookIcon size={18} />
                </a>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="grid h-11 w-11 place-items-center rounded-2xl border border-purple-100 bg-purple-50/40 text-purple-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white"
                >
                  <InstagramIcon size={18} />
                </a>
                <a
                  href={`tel:${contact.whatsapp}`}
                  aria-label="Direct call"
                  className="grid h-11 w-11 place-items-center rounded-2xl border border-purple-100 bg-purple-50/40 text-purple-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white"
                >
                  <Phone size={18} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Map Section */}
      <Reveal>
        <div className="container-page max-w-6xl py-14 sm:py-20">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-4 py-1.5 font-display text-sm font-extrabold text-purple-700 shadow-sm">
              <MapPin size={14} /> Head Office &amp; Dispatch
            </span>
            <h2 className="mt-2.5 font-display text-3xl font-black text-slate-950 sm:text-4xl">Visit or Reach Our Team</h2>
            <p className="mt-1.5 max-w-md text-sm text-slate-600">
              {contact.location} — delivering wholesale balloons across all seven emirates.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-purple-100 bg-white shadow-2xl">
            <div className="relative h-[300px] w-full sm:h-[420px]">
              <iframe
                title="Fatima Express location map"
                src={googleMapsEmbedUrl}
                className="h-full w-full border-0"
                style={{ filter: "contrast(1.05) saturate(1.1)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className="relative border-t border-purple-100 bg-white/95 p-5 shadow-2xl backdrop-blur-md sm:absolute sm:bottom-6 sm:left-6 sm:max-w-md sm:rounded-2xl sm:border sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-display text-xs font-bold text-purple-600">
                    Fatima Express Headquarters
                  </span>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{contact.location}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(contact.location, setCopiedLocation)}
                  title="Copy address"
                  className="shrink-0 rounded-xl border border-purple-100 bg-purple-50/50 p-2 text-slate-500 transition-all hover:border-purple-300 hover:text-purple-700"
                >
                  {copiedLocation ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-purple-50 pt-3.5">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Dispatch Center Open
                </span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#6D28D9] to-[#9333EA] px-4 py-2 font-display text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5"
                >
                  Get Directions <Navigation size={13} className="transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Trust Badges */}
      <div className="container-page grid max-w-6xl grid-cols-1 gap-4 pb-14 sm:grid-cols-3">
        {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3.5 rounded-3xl border border-purple-100 bg-white p-5 shadow-md">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-purple-100 bg-purple-50 text-purple-700">
              <Icon size={20} />
            </span>
            <div>
              <h4 className="font-display text-sm font-bold text-slate-950">{title}</h4>
              <p className="text-sm font-medium text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="relative border-t border-purple-100 pb-20 pt-14">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-100/30 blur-3xl" />
        <div className="container-page relative max-w-3xl">
          <Reveal className="mb-10 text-center">
            <div className="mb-2.5 flex items-center justify-center gap-3 sm:gap-6">
              <span className="h-[1.5px] w-6 shrink-0 bg-gradient-to-r from-transparent via-purple-300 to-pink-400 sm:w-16" />
              <span className="inline-flex items-center gap-1.5 font-display text-sm font-extrabold text-purple-700">
                <Sparkles size={14} /> Frequently Asked Questions
              </span>
              <span className="h-[1.5px] w-6 shrink-0 bg-gradient-to-l from-transparent via-purple-300 to-pink-400 sm:w-16" />
            </div>
            <h2 className="font-display text-3xl font-black text-slate-950 sm:text-4xl">Everything You Need To Know</h2>
          </Reveal>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen ? "border-purple-300 bg-white shadow-lg" : "border-purple-100 bg-white/80 shadow-sm hover:border-purple-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3 pr-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-purple-200 bg-purple-50 text-sm font-extrabold text-purple-700">
                        0{idx + 1}
                      </span>
                      <span className="font-display text-sm font-bold text-slate-950 sm:text-base">{faq.q}</span>
                    </div>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen ? "rotate-180 border-purple-600 bg-purple-600 text-white" : "border-purple-100 bg-purple-50 text-purple-600"
                      }`}
                    >
                      <ChevronDown size={15} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-purple-50 px-5 pb-5 pt-3.5">
                      <div className="border-l-2 border-purple-300 pl-3.5 text-sm leading-relaxed text-slate-600">{faq.a}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
