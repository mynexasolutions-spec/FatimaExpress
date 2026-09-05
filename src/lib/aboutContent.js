import { createPublicClient, publicCatalogEnabled } from "@/lib/supabase/publicClient";

// Matches the current hardcoded copy on /about — used whenever the DB is
// unreachable or about_content hasn't been set yet, so the page always has
// something sensible to render.
export const DEFAULT_ABOUT_CONTENT = {
  hero: {
    badge: "About Fatima Express",
    heading: "A Premier Supplier of High-Quality Party Supplies",
    description:
      "We specialise in premium foil balloons, crystal-clear bubble balloons and professional balloon equipment — serving party planners, decorators and retailers across the UAE.",
    ctaText: "Browse Catalogue",
    ctaLink: "/shop",
  },
  stats: [
    { value: "7", label: "Emirates Delivered" },
    { value: "3", label: "Core Product Lines" },
    { value: "AED 1,000", label: "Free Dubai Delivery" },
    { value: "100%", label: "Quality Checked" },
  ],
  story: {
    eyebrow: "Our Story",
    heading: "Built by people who love a great celebration",
    paragraph:
      "Fatima Express started with a simple idea: party planners and decorators in the UAE deserve one trusted source for balloons and equipment, instead of juggling several suppliers to get an order out the door. Today we carry an expanding catalogue of foil balloons, bubble balloons and professional accessories, picked for durability, vibrant colour and reliable float time.",
    quote:
      "Every order — from a single balloon bouquet to a full wholesale restock — gets the same attention to quality and turnaround.",
    badgeLabel: "Coverage",
    badgeValue: "All 7 Emirates",
    image: "/hero-balloon-bouquet.jpg",
  },
  offers: [
    {
      title: "Extensive Balloon Selection",
      copy: "Heart and round classics, star shapes, animal themes, character prints and full numbers and letters for every occasion.",
    },
    {
      title: "Specialty Products",
      copy: "Durable crystal-clear bubble balloons designed for maximum float time and stunning visual impact.",
    },
    {
      title: "Professional Equipment",
      copy: "Reliable electric and hand pumps, balloon weights, ribbons, clips and every assembly accessory you need.",
    },
  ],
  reasons: [
    {
      title: "One-Stop Shop",
      copy: "Everything needed to plan, decorate and execute a party set-up in one catalogue — no chasing three suppliers.",
    },
    {
      title: "Quality Guaranteed",
      copy: "Premium materials chosen for durability, vibrant colour and optimal helium and air retention.",
    },
    {
      title: "Reliable UAE Shipping",
      copy: "Direct delivery across Dubai and fast courier fulfilment to Abu Dhabi, Sharjah and every other emirate.",
    },
  ],
  delivery: {
    eyebrow: "Fulfilment & Logistics",
    heading: "Delivery Across the UAE",
    description: "Delivery charges depend on where your order is going and how much it totals.",
    tiers: [
      {
        title: "Dubai — AED 1,000+",
        copy: "Free local delivery handled directly by our own team inside the Dubai emirate.",
        badge: "FREE",
      },
      {
        title: "Dubai — Below AED 1,000",
        copy: "Delivered within Dubai by courier with a standard shipping fee applied at checkout.",
        badge: "",
      },
      {
        title: "All Other Emirates",
        copy: "Abu Dhabi, Sharjah, Ajman, RAK, Fujairah and UAQ are served by courier with charges applied at checkout.",
        badge: "",
      },
    ],
  },
  ctaBanner: {
    badge: "Custom Orders",
    heading: "Planning a large event or reselling?",
    description: "Send us your list on WhatsApp and we will put together wholesale pricing for your order.",
  },
};

function mergeAboutContent(content) {
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

export async function getAboutContentPublic() {
  if (publicCatalogEnabled) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase.from("site_settings").select("about_content").eq("id", 1).maybeSingle();
      if (!error && data?.about_content) {
        return mergeAboutContent(data.about_content);
      }
    } catch {
      // fall through to defaults
    }
  }

  return DEFAULT_ABOUT_CONTENT;
}
