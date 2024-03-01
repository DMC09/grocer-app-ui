/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1000logos.net",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "*.dribbble.com",
      },
      {
        protocol: "https",
        hostname: "runescape.wiki",
      },
    ],
  },
};

module.exports = nextConfig;
