import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.hercules.app',
      },
      // Allow Facebook CDN images used by some car images
      {
        protocol: 'https',
        hostname: 'scontent.ftpa1-1.fna.fbcdn.net',
      },
      // Additional Facebook CDN host variant
      {
        protocol: 'https',
        hostname: 'scontent.ftpa1-2.fna.fbcdn.net',
      },
      // External shop CDN used by older car images
      {
        protocol: 'https',
        hostname: 'exoticsbythebay.co',
      },
      // Additional external CDN used by some car images
      {
        protocol: 'https',
        hostname: 'luxexotica.com',
      },
    ],
  },
};

export default nextConfig;
