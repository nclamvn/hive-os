import { defineConfig } from "@playwright/test";
import { E2E_ENV } from "./tests/e2e/env";

const baseURL="http://localhost:3116";
if(process.env.HIVE_E2E_BASE_URL!==baseURL) throw new Error("TIP076 focused E2E requires fixed HIVE_E2E_BASE_URL=http://localhost:3116");
if(!process.env.HIVE_TIP076_STORAGE_ROOT) throw new Error("TIP076 focused E2E requires an explicit task-owned storage root reusable for visible QA");
// Main prepares the isolated schema serially. No global setup, migrations,
// truncation or reuse of another Builder's app server is performed here.
export default defineConfig({
  testDir:"tests/e2e",testMatch:"research-campaign-v3.spec.ts",fullyParallel:false,workers:1,
  timeout:60000,retries:0,forbidOnly:true,reporter:[["list"],["json",{outputFile:"artifacts/tip076/results.json"}]],
  outputDir:"artifacts/tip076/playwright",use:{baseURL,trace:"retain-on-failure"},
  webServer:{command:"PORT=3116 node scripts/test/start-tip076-standalone.mjs",url:`${baseURL}/api/health`,reuseExistingServer:false,timeout:30000,
    env:{...E2E_ENV,BETTER_AUTH_URL:baseURL,HIVE_E2E_BASE_URL:baseURL,HIVE_TIP076_STORAGE_ROOT:process.env.HIVE_TIP076_STORAGE_ROOT}},
});
