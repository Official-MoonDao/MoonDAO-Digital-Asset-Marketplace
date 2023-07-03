/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  images: {
    domains: [
      "ipfs-3.thirdwebcdn.com",
      "ipfs-public.thirdwebcdn.com",
      "i.seadn.io",
      "ipfs.io",
    ],
  },

  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};

module.exports = nextConfig;
