import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here
  TO READ IMAGES STORED IN APPWRITE */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
    ],
  },
};

export default nextConfig;
