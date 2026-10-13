import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here
  TO READ IMAGES STORED IN APPWRITE */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nyc.cloud.appwrite.io",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB",
    },
  },
};

export default nextConfig;
