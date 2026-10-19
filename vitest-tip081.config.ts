import path from "node:path";
import {defineConfig} from "vitest/config";

// Invocation-only: no global setup, migration, grant, fixture cleanup or worker.
export default defineConfig({resolve:{alias:{"@":path.resolve("src")}},test:{projects:[
  {extends:true,test:{name:"tip081-unit",environment:"node",setupFiles:[],include:["tests/unit/evidence-studio*.test.ts"],fileParallelism:false,testTimeout:10000}},
  {extends:true,test:{name:"tip081-integration",environment:"node",setupFiles:[],include:["tests/integration/evidence-studio.test.ts"],fileParallelism:false,testTimeout:30000}},
]}});
