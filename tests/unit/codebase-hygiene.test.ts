import { describe, expect, it } from "vitest";
import { ESLint } from "eslint";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import * as historicalRuntime from "../../scripts/test/runtime-tip081-package.mjs";

describe("maintenance keeps project lint and archived authority separate", () => {
  it("lints handwritten application, test and parser sources", async () => {
    const lint = new ESLint();
    for (const file of [
      "src/server/kakeya-dossier.ts",
      "scripts/test/check-private-summary-tip081-p3.r3.mjs",
      "tests/unit/codebase-hygiene.test.ts",
      "scripts/test/generated/new-handwritten-control.mjs",
    ]) expect(await lint.isPathIgnored(file)).toBe(false);
  });

  it("excludes only emitted candidates, reusable builds and dependency caches", async () => {
    const lint = new ESLint();
    for (const file of [
      "scripts/test/generated/private-grammar-tip081-p2.candidate.mjs",
      "scripts/test/generated/private-grammar-tip081-p2.checked.candidate.mjs",
      "scripts/test/generated/private-grammar-tip081-p2.v5.candidate.mjs",
      "scripts/test/generated/private-grammar-tip081-p2.v6.candidate.mjs",
      "scripts/test/generated/private-summary-tip081-p3.candidate.mjs",
      "scripts/test/generated/private-summary-tip081-p3.alias-fault.candidate.mjs",
      ".next-build/server/generated.js",
      ".next-qa/server/generated.js",
      ".pnpm-store/v3/dependency.js",
      "node_modules/dependency/index.js",
    ]) expect(await lint.isPathIgnored(file)).toBe(true);
  });

  it("parses the handwritten replay precheck without importing or executing it", () => {
    const result = spawnSync(process.execPath, ["--check", "scripts/test/check-private-summary-tip081-p3.r3.mjs"], {
      encoding: "utf8",
      timeout: 10_000,
    });
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
  });

  it("refuses historical configuration authority when live configuration has drifted", () => {
    const before = readFileSync("next.config.ts");
    const digest = createHash("sha256").update(before).digest("hex");
    // This checkpoint intentionally uses the new reusable build configuration,
    // not TIP081's frozen original. Never update its pins to make fixtures pass.
    expect(digest).not.toBe(historicalRuntime.CONFIG_PROOF_INPUT_PINS["next.config.ts"]);
    expect(() => historicalRuntime.prepareConfigProof()).toThrow("TIP081_ORIGINAL_CONFIG_CHANGED");
    expect(readFileSync("next.config.ts")).toEqual(before);
  });
});
