/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Limit static generation to prevent OOM
  staticPageGenerationTimeout: 120,
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

module.exports = nextConfig;
