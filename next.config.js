/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net", // za Contentful
      },
      {
        protocol: "https",
        hostname: "**", // Ovo dopušta SVE HTTPS domene
      },
    ],
  },
};

module.exports = nextConfig;
