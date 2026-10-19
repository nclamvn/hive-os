import path from "node:path";
import { defineConfig } from "vitest/config";

// These immutable campaign checks require the original reviewed source tree.
// Keep them runnable and failing closed, without freezing unrelated product work.
// Match complete names in mixed suites: their behavioral tests stay active.
// The separate one-shot capture file is handled below, before its root hooks.
const historicalSourceContracts = [
  "TIP081 original-source preservation and read-only module boundary keeps all 78 old080 source pins plus review exact",
  "TIP081 explicit shadow compiler overlay source controls; no compiler executions preserves exact original bytes and emits separately pinned deterministic provenance",
  "TIP081 explicit shadow compiler overlay source controls; no compiler executions refuses repeated overlay creation and complete known config collisions",
  "TIP081 explicit shadow compiler overlay source controls; no compiler executions refuses overlay and provenance tamper",
  "TIP081 two-stage T1 source-bound overlay, engineering-only T1-02 create-only overlay preserves original config bytes and verifies its exact receipt",
  "TIP081 two-stage T1 source-bound overlay, engineering-only T1-04 overlay bytes and lineage tampering are not automatically repaired",
  "TIP081 config-proof C1 and C4 exact prepared inputs, no config evaluation C1-01 preparation records bounded source-bound inputs and zero probe/build effects",
  "TIP081 config-proof C1 and C4 exact prepared inputs, no config evaluation C1-02 all original, baseline and predecessor config copies retain exact pinned original bytes",
  "TIP081 config-proof C1 and C4 exact prepared inputs, no config evaluation C1-03 roots, collision files, extra directories and missing inputs refuse before evaluation",
  "TIP081 config-proof C1 and C4 exact prepared inputs, no config evaluation C1-04 trusted dependency links cannot be replaced with alternate owned roots or nested links",
  "TIP081 config-proof C1 and C4 exact prepared inputs, no config evaluation C1-05 preparation input and child directory ownership modes cannot be relaxed",
  "TIP081 config-proof C1 and C4 exact prepared inputs, no config evaluation C1-06 missing execution profile refuses before Next loading with every prepared byte unchanged",
  "TIP081 config-proof C1 and C4 exact prepared inputs, no config evaluation C4-01 revalidation rejects independent original, predecessor and successor byte changes",
  "TIP081 config-proof C1 and C4 exact prepared inputs, no config evaluation C4-02 create-only preparation records reject unknown fields and source/profile/root lineage changes",
  "TIP081 config-proof optional Darwin intrinsic validation and discard, synthetic values withheld CF-08 exact execution argv remains required before environment cleanup and any Next load",
  "R3 independently authored sealed rational interval/floor adapter pins entire frozen generic/QA manifest without any core edit",
  ...["TIP076_QA", "TIP079_QA", "TIP080_QA"].map((profile) =>
    `TIP080 ENGINEERING_ONLY pure hostile ledger/intake controls profile ${profile} preserves existingroutes and exactQA tracing boundary`,
  ),
];
const escapedNames = historicalSourceContracts.map((name) =>
  name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
).join("|");
const scope = process.env.HIVE_TEST_SCOPE ?? "all";
if (!["all", "product", "archive"].includes(scope)) {
  throw new Error("HIVE_TEST_SCOPE must be all, product, or archive");
}
const testNamePattern = scope === "archive"
  ? new RegExp(`^(?:${escapedNames})$|^P3 new synthetic controls; named OPEN variations are not closure `)
  : scope === "product"
    ? new RegExp(`^(?!(?:${escapedNames})$)`)
    : undefined;

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    testNamePattern,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/unit/**/*.test.ts"],
          // Exact replay guards use wall-clock ceilings. Concurrent CPU-heavy
          // files compete for that budget and make unchanged fixtures flaky.
          // Serialize files rather than increasing test/runtime limits.
          fileParallelism: false,
          // One-shot research capture has root hooks writing a fixed, immutable
          // observation file. Product regression must never execute those hooks.
          ...(scope === "product" ? {
            exclude: ["tests/unit/private-summary-tip081-p3.test.ts"],
          } : {}),
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.test.ts"],
          setupFiles: ["tests/integration/setup.ts"],
          // Integration tests share one database; avoid cross-file races.
          fileParallelism: false,
        },
      },
      {
        extends: true,
        test: {
          name: "scale",
          environment: "node",
          include: ["tests/scale/**/*.test.ts"],
          fileParallelism: false,
        },
      },
      {
        extends: true,
        test: {
          name: "container",
          environment: "node",
          include: ["tests/container/**/*.test.ts"],
          fileParallelism: false,
          testTimeout: 30_000,
        },
      },
    ],
  },
});
