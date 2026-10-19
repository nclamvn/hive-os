import {defineConfig} from "vitest/config";

// Actual allocation-kernel fixtures only, NOT supported-grammar acceptance.
export default defineConfig({envDir: false, test: {
  name: "tip081-p2-private-allocation-kernel", environment: "node", setupFiles: [],
  include: ["tests/unit/evidence-studio-p2-allocation-kernel.test.ts"],
  fileParallelism: false, testTimeout: 10000,
}});
