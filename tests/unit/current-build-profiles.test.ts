import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

// Successor product configuration, not a reseal of any research campaign.
const exclusions = [
  "attempt-lrc-p139-generation-v2.py",
  "attempt-lrc-p139-generation-v3.py",
  "attempt-lrc-p139-generation-v4.py",
  "attempt-lrc-p139-generation-v5.py",
  "attempt-lrc-p139-generation.py",
  "capture-lrc-p139-generation-v2.py",
  "capture-lrc-p139-generation-v3.py",
  "capture-lrc-p139-generation-v4.py",
  "capture-lrc-p139-generation-v5.py",
  "capture-lrc-p139-generation-v6.py",
  "verify-lrc-p139-g-release.py",
  "verify-lrc-p139-g-segments.py",
  "verify-lrc-p139-g-stream.py",
].map((file) => `./scripts/operations/${file}`);

describe("Current reusable build output and scoped tracing", () => {
  it.each(["LOCAL_QA", "TIP076_QA", "TIP079_QA", "TIP080_QA"])(
    "%s uses the same isolated output without broadening trace exclusions",
    async (profile) => {
      vi.stubEnv("HIVE_BUILD_PROFILE", profile);
      const config = (await import("../../next.config")).default;
      expect(config.distDir).toBe(".next-build");
      expect(config.output).toBe("standalone");
      expect(config.outputFileTracingExcludes).toEqual({ "/*": exclusions });
      expect(config.outputFileTracingIncludes).toEqual({
        "/api/w/*": [
          "./node_modules/notosans-fontface/fonts/NotoSans-Regular.ttf",
          "./node_modules/notosans-fontface/fonts/NotoSans-Bold.ttf",
        ],
      });
      expect(config.experimental?.serverActions).toEqual({ bodySizeLimit: "11mb" });
      const postcss = (await import("../../postcss.config.mjs")).default;
      expect(postcss.plugins["@tailwindcss/postcss"]).toEqual(
        profile === "TIP076_QA" ? {} : { base: path.resolve(process.cwd(), "src") },
      );
    },
  );

  it.each(["", "UNRECOGNIZED_QA"])("ordinary/unknown profile %s stays unscoped", async (profile) => {
    vi.stubEnv("HIVE_BUILD_PROFILE", profile);
    const config = (await import("../../next.config")).default;
    expect(config.distDir).toBe(".next");
    expect(config.outputFileTracingExcludes).toBeUndefined();
    expect(config.output).toBe("standalone");
    const postcss = (await import("../../postcss.config.mjs")).default;
    expect(postcss.plugins["@tailwindcss/postcss"]).toEqual({});
  });
});
