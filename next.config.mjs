/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    // Cloudinary already resizes/compresses every image once at upload time
    // (see ImageUploader.jsx's `transformation` option) and serves it off
    // its own CDN — Vercel's image optimizer re-processing the same file on
    // top of that is redundant work that burns its optimization quota for
    // no visual benefit. Turning it off guarantees that quota stays at 0.
    unoptimized: true,
  },
};

export default nextConfig;
