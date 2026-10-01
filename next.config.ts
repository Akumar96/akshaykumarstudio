import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingExcludes: { "/*": ["./.studio/**/*"] },
  images: {
    formats: ["image/webp"],
    deviceSizes: [480, 640, 828, 1080, 1440, 1920, 2400],
    imageSizes: [64, 128, 256, 384],
    qualities: [75, 80, 85],
  },
};
export default nextConfig;
