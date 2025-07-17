import { createMDX } from 'fumadocs-mdx/next';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  distDir: 'out',
};

const withMDX = createMDX();

export default withMDX(nextConfig);