import type { NextConfig } from "next";

const tip076Qa = process.env.HIVE_BUILD_PROFILE === "TIP076_QA";
const tip079Qa = process.env.HIVE_BUILD_PROFILE === "TIP079_QA";
const tip080Qa = process.env.HIVE_BUILD_PROFILE === "TIP080_QA";
// Ordinary maintenance builds have no historical research execution authority.
const localQa = process.env.HIVE_BUILD_PROFILE === "LOCAL_QA";
const isolatedQa = localQa || tip076Qa || tip079Qa || tip080Qa;
const nextConfig: NextConfig = {
  // Reuse one isolated build output; a TIP must not allocate its own directory.
  // Profile/source authority is unchanged, and ordinary dev retains .next.
  distDir: isolatedQa ? ".next-build" : ".next",
  output: "standalone",
  // Exact generated-NFT references only. This isolated engineering standalone
  // cannot execute historical runners; ordinary builds retain their own traces.
  ...(isolatedQa ? { outputFileTracingExcludes: { "/*": [
    "./scripts/operations/attempt-lrc-p139-generation-v2.py",
    "./scripts/operations/attempt-lrc-p139-generation-v3.py",
    "./scripts/operations/attempt-lrc-p139-generation-v4.py",
    "./scripts/operations/attempt-lrc-p139-generation-v5.py",
    "./scripts/operations/attempt-lrc-p139-generation.py",
    "./scripts/operations/capture-lrc-p139-generation-v2.py",
    "./scripts/operations/capture-lrc-p139-generation-v3.py",
    "./scripts/operations/capture-lrc-p139-generation-v4.py",
    "./scripts/operations/capture-lrc-p139-generation-v5.py",
    "./scripts/operations/capture-lrc-p139-generation-v6.py",
    "./scripts/operations/verify-lrc-p139-g-release.py",
    "./scripts/operations/verify-lrc-p139-g-segments.py",
    "./scripts/operations/verify-lrc-p139-g-stream.py",
  ] } } : {}),
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
