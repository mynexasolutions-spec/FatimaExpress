// Single source of truth for the site's canonical domain — sitemap.xml,
// robots.txt, canonical tags and structured data all read from here.
// Update NEXT_PUBLIC_SITE_URL in .env.local once the real domain is live.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.fatimaexpress.ae").replace(/\/$/, "");

export function absoluteUrl(path = "") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
