import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Build caching configuration for Netlify
  experimental: {
    incrementalCacheHandlerPath: process.env.NETLIFY
      ? require.resolve('@netlify/plugin-nextjs/src/run/handlers/cache.cjs')
      : undefined,
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
