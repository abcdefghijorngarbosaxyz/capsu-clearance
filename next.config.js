/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "api.cloudinary.com"],
  },
};

module.exports = nextConfig;
