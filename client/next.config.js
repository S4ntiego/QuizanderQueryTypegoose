/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "pottertrivia.s3.eu-central-1.amazonaws.com",
      "d16toh0t29dtt4.cloudfront.net",
    ],
  },
};

module.exports = nextConfig;
