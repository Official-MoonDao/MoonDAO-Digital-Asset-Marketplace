/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  images: {
    domains: ["gateway.ipfscdn.io", "i.seadn.io", "ipfs.io"],
  },
};

module.exports = nextConfig;
