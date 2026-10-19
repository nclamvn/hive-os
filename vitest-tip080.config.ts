import path from "node:path";
import {defineConfig} from "vitest/config";

// Invocation-only focused acceptance. No setup/migration/role grants/cleanup.
export default defineConfig({resolve:{alias:{"@":path.resolve("src")}},test:{projects:[
  {extends:true,test:{name:"tip080-unit",environment:"node",setupFiles:[],include:["tests/unit/permutation-bridge.test.ts","tests/unit/permutation-bridge-ui.test.ts","tests/unit/permutation-checker.test.ts"],testTimeout:10000}},
  {extends:true,test:{name:"tip080-integration",environment:"node",setupFiles:[],include:["tests/integration/permutation-bridge.test.ts"],fileParallelism:false,testTimeout:30000}},
]}});
