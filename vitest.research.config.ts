import {resolve} from "node:path";
import {defineConfig} from "vitest/config";

export default defineConfig({
  envDir:false,
  resolve:{alias:{"@":resolve("src")}},
  test:{environment:"node",setupFiles:[],fileParallelism:false,testTimeout:10000,
    include:["tests/unit/permutation-checker.test.ts","tests/unit/research-development.test.ts","tests/unit/lean-execution.test.ts"]},
});
