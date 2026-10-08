import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `npm run build` writes plain files to out/ for Cloudflare Pages.
  output: "export",
  images: { unoptimized: true },
  // Cache Components is deliberately off: the site is fully static and doesn't use it, and its
  // hidden-route preservation (Activity) re-runs GSAP effects in a way that breaks ScrollTrigger.
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
