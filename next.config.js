const isVercel = process.env.VERCEL === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  staticPageGenerationTimeout: 120,
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
