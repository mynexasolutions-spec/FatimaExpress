"use client";

import { useActionState, useState } from "react";
import { Award, LoaderCircle, MessageSquareQuote, Sparkles, Truck } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { updateAboutContent } from "@/actions/admin/aboutContent";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

const TABS = [
  { id: "hero", label: "Hero", icon: Sparkles },
  { id: "stats", label: "Stats", icon: Award },
  { id: "story", label: "Our Story", icon: MessageSquareQuote },
  { id: "offers", label: "What We Offer", icon: Sparkles },
  { id: "reasons", label: "Why Choose Us", icon: Sparkles },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "cta", label: "CTA Banner", icon: Sparkles },
];

export default function AboutContentForm({ content }) {
  const [state, formAction, pending] = useActionState(updateAboutContent, {});
  const [activeTab, setActiveTab] = useState("hero");

  const [stats, setStats] = useState(content.stats);
  const [story, setStory] = useState(content.story);
  const [offers, setOffers] = useState(content.offers);
  const [reasons, setReasons] = useState(content.reasons);
  const [deliveryTiers, setDeliveryTiers] = useState(content.delivery.tiers);

  const setStoryField = (field) => (e) => setStory((current) => ({ ...current, [field]: e.target.value }));
  const updateStat = (idx, field, value) =>
    setStats((current) => current.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  const updateOffer = (idx, field, value) =>
    setOffers((current) => current.map((o, i) => (i === idx ? { ...o, [field]: value } : o)));
  const updateReason = (idx, field, value) =>
    setReasons((current) => current.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  const updateTier = (idx, field, value) =>
    setDeliveryTiers((current) => current.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="stats" value={JSON.stringify(stats)} />
      <input type="hidden" name="story_eyebrow" value={story.eyebrow} />
      <input type="hidden" name="story_heading" value={story.heading} />
      <input type="hidden" name="story_paragraph" value={story.paragraph} />
      <input type="hidden" name="story_quote" value={story.quote} />
      <input type="hidden" name="story_badgeLabel" value={story.badgeLabel} />
      <input type="hidden" name="story_badgeValue" value={story.badgeValue} />
      <input type="hidden" name="story_image" value={story.image || ""} />
      <input type="hidden" name="offers" value={JSON.stringify(offers)} />
      <input type="hidden" name="reasons" value={JSON.stringify(reasons)} />
      <input type="hidden" name="delivery_tiers" value={JSON.stringify(deliveryTiers)} />

      {/* Section tabs */}
      <div className="no-scrollbar sticky top-0 z-20 -mx-1 mb-6 flex gap-1.5 overflow-x-auto border-b border-slate-100 bg-slate-50/80 px-1 py-2 backdrop-blur">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                active ? "bg-gradient-to-r from-brand-700 to-brand-800 text-white shadow-sm" : "text-slate-600 hover:bg-white hover:text-brand-700"
              }`}
            >
              <tab.icon size={15} className={active ? "text-white" : "text-slate-400"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-xs">
        {/* Hero */}
        <div className={activeTab === "hero" ? "" : "hidden"}>
          <h2 className="font-display text-lg font-bold">Hero</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Badge text</label>
              <input name="hero_badge" defaultValue={content.hero.badge} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Heading</label>
              <input name="hero_heading" defaultValue={content.hero.heading} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea name="hero_description" rows={3} defaultValue={content.hero.description} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Primary button text</label>
              <input name="hero_ctaText" defaultValue={content.hero.ctaText} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Primary button link</label>
              <input name="hero_ctaLink" defaultValue={content.hero.ctaLink} className={inputClass} placeholder="/shop" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={activeTab === "stats" ? "" : "hidden"}>
          <h2 className="font-display text-lg font-bold">Stats Strip</h2>
          <p className="mt-1 text-xs text-slate-500">The 4 numbers shown under the hero.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-2 rounded-xl border border-slate-100 p-3.5">
                <input
                  value={stat.value}
                  onChange={(e) => updateStat(idx, "value", e.target.value)}
                  placeholder="Value, e.g. 7"
                  className={inputClass}
                />
                <input
                  value={stat.label}
                  onChange={(e) => updateStat(idx, "label", e.target.value)}
                  placeholder="Label, e.g. Emirates Delivered"
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <div className={activeTab === "story" ? "" : "hidden"}>
          <h2 className="font-display text-lg font-bold">Our Story</h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-[220px_1fr]">
            <div>
              <label className={labelClass}>Photo</label>
              <ImageUploader value={story.image} onChange={(url) => setStory((c) => ({ ...c, image: url }))} previewClassName="aspect-square w-full" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Eyebrow text</label>
                <input value={story.eyebrow} onChange={setStoryField("eyebrow")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Heading</label>
                <input value={story.heading} onChange={setStoryField("heading")} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Paragraph</label>
                <textarea rows={4} value={story.paragraph} onChange={setStoryField("paragraph")} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Quote</label>
                <textarea rows={2} value={story.quote} onChange={setStoryField("quote")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Floating badge label</label>
                <input value={story.badgeLabel} onChange={setStoryField("badgeLabel")} className={inputClass} placeholder="Coverage" />
              </div>
              <div>
                <label className={labelClass}>Floating badge value</label>
                <input value={story.badgeValue} onChange={setStoryField("badgeValue")} className={inputClass} placeholder="All 7 Emirates" />
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className={activeTab === "offers" ? "" : "hidden"}>
          <h2 className="font-display text-lg font-bold">What We Offer</h2>
          <p className="mt-1 text-xs text-slate-500">The 3 catalogue highlight cards.</p>
          <div className="mt-4 space-y-3">
            {offers.map((offer, idx) => (
              <div key={idx} className="space-y-2 rounded-xl border border-slate-100 p-3.5">
                <input
                  value={offer.title}
                  onChange={(e) => updateOffer(idx, "title", e.target.value)}
                  placeholder="Title"
                  className={inputClass}
                />
                <textarea
                  rows={2}
                  value={offer.copy}
                  onChange={(e) => updateOffer(idx, "copy", e.target.value)}
                  placeholder="Description"
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className={activeTab === "reasons" ? "" : "hidden"}>
          <h2 className="font-display text-lg font-bold">Why Choose Us</h2>
          <p className="mt-1 text-xs text-slate-500">The 3 numbered reason cards.</p>
          <div className="mt-4 space-y-3">
            {reasons.map((reason, idx) => (
              <div key={idx} className="space-y-2 rounded-xl border border-slate-100 p-3.5">
                <input
                  value={reason.title}
                  onChange={(e) => updateReason(idx, "title", e.target.value)}
                  placeholder="Title"
                  className={inputClass}
                />
                <textarea
                  rows={2}
                  value={reason.copy}
                  onChange={(e) => updateReason(idx, "copy", e.target.value)}
                  placeholder="Description"
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Delivery */}
        <div className={activeTab === "delivery" ? "" : "hidden"}>
          <h2 className="font-display text-lg font-bold">Delivery Across the UAE</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Eyebrow text</label>
              <input name="delivery_eyebrow" defaultValue={content.delivery.eyebrow} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Heading</label>
              <input name="delivery_heading" defaultValue={content.delivery.heading} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <input name="delivery_description" defaultValue={content.delivery.description} className={inputClass} />
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <h3 className="text-sm font-bold">Delivery Tiers</h3>
            <p className="mt-0.5 text-xs text-slate-500">The 3 pricing cards — first one is highlighted automatically.</p>
            <div className="mt-3 space-y-3">
              {deliveryTiers.map((tier, idx) => (
                <div key={idx} className="space-y-2 rounded-xl border border-slate-100 p-3.5">
                  <div className="flex gap-2.5">
                    <input
                      value={tier.title}
                      onChange={(e) => updateTier(idx, "title", e.target.value)}
                      placeholder="Title, e.g. Dubai — AED 1,000+"
                      className={inputClass}
                    />
                    <input
                      value={tier.badge}
                      onChange={(e) => updateTier(idx, "badge", e.target.value)}
                      placeholder="Badge (optional), e.g. FREE"
                      className={`${inputClass} sm:max-w-[160px]`}
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={tier.copy}
                    onChange={(e) => updateTier(idx, "copy", e.target.value)}
                    placeholder="Description"
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className={activeTab === "cta" ? "" : "hidden"}>
          <h2 className="font-display text-lg font-bold">CTA Banner</h2>
          <p className="mt-1 text-xs text-slate-500">Shown at the bottom of the About page.</p>
          <div className="mt-4 grid gap-4">
            <div>
              <label className={labelClass}>Badge text</label>
              <input name="ctaBanner_badge" defaultValue={content.ctaBanner.badge} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Heading</label>
              <input name="ctaBanner_heading" defaultValue={content.ctaBanner.heading} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea name="ctaBanner_description" rows={2} defaultValue={content.ctaBanner.description} className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      {state.error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">About page updated.</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-brand-800 px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {pending && <LoaderCircle size={16} className="animate-spin" />}
        Save About Page
      </button>
    </form>
  );
}
