/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Limit static generation to prevent OOM in sandbox
  staticPageGenerationTimeout: 120,
  experimental: {
    // Disable worker threads to reduce memory during build
    workerThreads: false,
    // Limit concurrent static generation
    cpus: 1,
  },
};

module.exports = nextConfig;
