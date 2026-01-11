import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bbvojsaxozpvmmfd.public.blob.vercel-storage.com",
        pathname: "/**",
      }
    ]
  },
  output: "standalone"
};

export default nextConfig;