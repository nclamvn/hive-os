import {defineConfig} from "vitest/config";

// P1 synthetic fixture only; no setup, migration, application glob or parser oracle.
export default defineConfig({envDir: false, test: {
  name: "tip081-p1-guard-scanners", environment: "node", setupFiles: [],
  include: ["tests/unit/evidence-studio-p1-guard-scanners.test.ts"],
  fileParallelism: false, testTimeout: 10000,
}});
