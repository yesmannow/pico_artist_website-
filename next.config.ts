import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Note: If you see a "Multiple Lockfiles" warning, it's because Next.js detected
  // a package-lock.json in your user home directory (C:\Users\hoosi\package-lock.json).
  // This is informational only - Next.js will use the lockfile in this project directory.
  // To suppress the warning, delete the unrelated lockfile at the user root if not needed.

  // Image optimization configuration
  // CLOUDFLARE FIX: unoptimized: true required for Cloudflare Pages
  images: {
    unoptimized: true, // Cloudflare Pages cannot resize images dynamically
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
