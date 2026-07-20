/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Limit static generation to prevent OOM
  staticPageGenerationTimeout: 120,
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  webpack: (config, { dev }) => {
    // Disable filesystem cache to save disk space in constrained environments
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
