import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/api/w/*": [
      "./node_modules/notosans-fontface/fonts/NotoSans-Regular.ttf",
      "./node_modules/notosans-fontface/fonts/NotoSans-Bold.ttf",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "11mb",
    },
  },
};

export default nextConfig;
