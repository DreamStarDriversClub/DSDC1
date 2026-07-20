/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone disabled for sandbox; build-vercel.sh uses next.config.vercel.js
  // output: 'standalone',
  // Limit static generation to prevent OOM in sandbox
  staticPageGenerationTimeout: 120,
  // Skip type checking during build (too slow in sandbox; CI handles this separately)
  typescript: { ignoreBuildErrors: true },
  experimental: {
    // Disable worker threads to reduce memory during build
    workerThreads: false,
    // Limit concurrent static generation
    cpus: 1,
  },
};

module.exports = nextConfig;
