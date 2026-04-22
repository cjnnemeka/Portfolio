import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_ACTIONS ? '/Portfolio' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
