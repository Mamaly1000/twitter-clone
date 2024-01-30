/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  experimental: {
    esmExternals: false, // THIS IS THE FLAG THAT MATTERS
  },
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
    ],
  },
};

module.exports = nextConfig;
