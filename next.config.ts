import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  distDir: 'out',
};

const withMDX = createMDX();

export default withMDX(nextConfig);
