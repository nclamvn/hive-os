import {defineConfig} from "vitest/config";

// Exactly this new synthetic file, no old suites/application/.env/setup imports.
export default defineConfig({envDir: false, test: {
  name: "tip081-p3-private-summary-replay", environment: "node", setupFiles: [],
  include: ["tests/unit/private-summary-tip081-p3.test.ts"],
  fileParallelism: false, testTimeout: 7500,
}});
