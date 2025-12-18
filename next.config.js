/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Provide generateBuildId that returns null to use Next.js fallback
  // This fixes the "generate is not a function" error
  generateBuildId: async () => {
    return null; // Return null to trigger nanoid fallback
  },

  // Redirects for site restructure
  async redirects() {
    return [
      {
        source: '/music',
        destination: '/media?tab=tracks',
        permanent: true,
      },
      {
        source: '/videos',
        destination: '/media?tab=videos',
        permanent: true,
      },
      {
        source: '/bio',
        destination: '/#bio',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/#bio',
        permanent: true,
      },
      {
        source: '/gallery',
        destination: '/media?tab=videos',
        permanent: true,
      },
      {
        source: '/tour',
        destination: '/events',
        permanent: true,
      },
    ];
  },

  // Headers for media file caching and byte-range requests
  async headers() {
    return [
      {
        source: '/:all*(mp3|wav|m4a|mp4|webm)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Accept-Ranges', value: 'bytes' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },

  // Image optimization configuration
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
    // Type checking enabled for production stability
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;

