import {defineConfig} from "vitest/config";

// One new private, trusted-loader fixture file only. Never installed Acorn/root work.
export default defineConfig({envDir: false, test: {
  name: "tip081-p2-private-bounded-grammar", environment: "node", setupFiles: [],
  include: ["tests/unit/private-grammar-tip081-p2.test.ts"],
  fileParallelism: false, testTimeout: 5000,
}});
