import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static export – no server, no database. Output lands in ./out and can
  // be served by any static host (Vercel, Cloudflare Pages, GitHub Pages, …).
  output: "export",
  images: {
    // The default image optimizer needs a server; static export requires this.
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
