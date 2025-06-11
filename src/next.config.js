// filepath: src/next.config.js
// This is a Next.js configuration file that sets up various options for the application.

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Add other Next.js config options here as needed
  // reactStrictMode: true,
  // swcMinify: true,
  // images: {
  //   domains: ['example.com', 'another-example.com'],
  // },
  // async redirects() {
  //   return [
  //     {
  //       source: '/old-path',
  //       destination: '/new-path',
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
