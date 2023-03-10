/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  images: {
    domains: ["gateway.ipfscdn.io"],
  },
};

module.exports = nextConfig;
