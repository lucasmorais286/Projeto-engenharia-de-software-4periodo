import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.fna.fbcdn.net',
        pathname: '/**',
      },
    ],
    domains: ['i.imgur.com', 'randomuser.me'],
  }
};

export default nextConfig;

