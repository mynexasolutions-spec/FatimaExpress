// Inserts a delivery-time transformation into a stored Cloudinary URL.
// f_auto lets Cloudinary's own CDN pick WebP/AVIF per visitor's browser —
// this replaces the automatic format conversion Vercel's image optimizer
// used to do before `images.unoptimized` was turned on in next.config.mjs.
export function cldUrl(url, transform = "f_auto,q_auto") {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
}
