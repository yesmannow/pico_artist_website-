/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare optimization
  images: {
    unoptimized: true,
  },
  // Ensure we are not using experimental features that break Node 22
  reactStrictMode: true,

  // Generate build ID - required for Next.js 14.2.18 on Node.js 22
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

module.exports = nextConfig;
