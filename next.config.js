const isVercel = process.env.VERCEL === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  staticPageGenerationTimeout: 120,

  // Image optimization — enables next/image with automatic WebP/AVIF serving
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Add Content-Disposition for clean image URLs
  async headers() {
    return [
      {
        source: '/images/:path*.webp',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/brand-assets/:path*.webp',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

// Sandbox-specific memory/disk optimizations.
// Skip on Vercel's build servers — they have more resources and benefit from
// worker threads + filesystem caching.
if (!isVercel) {
  nextConfig.experimental = {
    workerThreads: false,
    cpus: 1,
  };
  nextConfig.webpack = (config) => {
    config.cache = false;
    return config;
  };
}

module.exports = nextConfig;
