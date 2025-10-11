import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ✅ no i18n block here — we’re handling translation manually
  experimental: {
    // optional: if you’re using new App Router features
  },
};

export default nextConfig;
