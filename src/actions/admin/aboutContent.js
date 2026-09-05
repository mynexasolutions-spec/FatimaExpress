"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { DEFAULT_ABOUT_CONTENT } from "@/lib/aboutContent";

export async function getAboutContent() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_settings").select("about_content").eq("id", 1).maybeSingle();
  const content = data?.about_content;

  return {
    hero: { ...DEFAULT_ABOUT_CONTENT.hero, ...content?.hero },
    stats: content?.stats?.length ? content.stats : DEFAULT_ABOUT_CONTENT.stats,
    story: { ...DEFAULT_ABOUT_CONTENT.story, ...content?.story },
    offers: content?.offers?.length ? content.offers : DEFAULT_ABOUT_CONTENT.offers,
    reasons: content?.reasons?.length ? content.reasons : DEFAULT_ABOUT_CONTENT.reasons,
    delivery: {
      ...DEFAULT_ABOUT_CONTENT.delivery,
      ...content?.delivery,
      tiers: content?.delivery?.tiers?.length ? content.delivery.tiers : DEFAULT_ABOUT_CONTENT.delivery.tiers,
    },
    ctaBanner: { ...DEFAULT_ABOUT_CONTENT.ctaBanner, ...content?.ctaBanner },
  };
}

export async function updateAboutContent(_prevState, formData) {
  const supabase = createAdminClient();

  const hero = {
    badge: formData.get("hero_badge") || "",
    heading: formData.get("hero_heading") || "",
    description: formData.get("hero_description") || "",
    ctaText: formData.get("hero_ctaText") || "",
    ctaLink: formData.get("hero_ctaLink") || "",
  };

  const story = {
    eyebrow: formData.get("story_eyebrow") || "",
    heading: formData.get("story_heading") || "",
    paragraph: formData.get("story_paragraph") || "",
    quote: formData.get("story_quote") || "",
    badgeLabel: formData.get("story_badgeLabel") || "",
    badgeValue: formData.get("story_badgeValue") || "",
    image: formData.get("story_image") || "",
  };

  const delivery = {
    eyebrow: formData.get("delivery_eyebrow") || "",
    heading: formData.get("delivery_heading") || "",
    description: formData.get("delivery_description") || "",
  };

  const ctaBanner = {
    badge: formData.get("ctaBanner_badge") || "",
    heading: formData.get("ctaBanner_heading") || "",
    description: formData.get("ctaBanner_description") || "",
  };

  let stats;
  let offers;
  let reasons;
  let deliveryTiers;
  try {
    stats = JSON.parse(formData.get("stats") || "[]");
    offers = JSON.parse(formData.get("offers") || "[]");
    reasons = JSON.parse(formData.get("reasons") || "[]");
    deliveryTiers = JSON.parse(formData.get("delivery_tiers") || "[]");
  } catch {
    return { error: "Invalid stats, offers, reasons or delivery tier data." };
  }

  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    about_content: {
      hero,
      stats,
      story,
      offers,
      reasons,
      delivery: { ...delivery, tiers: deliveryTiers },
      ctaBanner,
    },
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/about");
  revalidatePath("/about");
  return { success: true };
}
