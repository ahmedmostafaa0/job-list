import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cgmfaeimyr.ufs.sh",
        protocol: 'https',
        port: ''
      },
    ],
  },
};

export default nextConfig;
