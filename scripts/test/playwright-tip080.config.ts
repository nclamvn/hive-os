import {defineConfig} from "@playwright/test";
import path from "node:path";
const origin="http://127.0.0.1:3003";
if(process.env.NODE_ENV!=="test"||process.env.HIVE_E2E_BASE_URL!==origin)throw new Error("TIP080_ISOLATED_ORIGIN_REQUIRED");
for(const key of ["DATABASE_URL","DATABASE_MIGRATION_URL"]) {const db=new URL(process.env[key]??"");if(!["localhost","127.0.0.1"].includes(db.hostname)||db.port!=="5433"||db.pathname!=="/hiveos_test")throw new Error("TIP080_TEST_DATABASE_REQUIRED");}
// Already reviewed external server only. No setup, migration, cleanup or launch.
export default defineConfig({testDir:path.resolve("tests/e2e"),testMatch:"permutation-bridge.spec.ts",fullyParallel:false,workers:1,retries:0,timeout:45000,forbidOnly:true,reporter:"list",outputDir:path.resolve("artifacts/tip080/playwright"),use:{baseURL:origin,trace:"off",screenshot:"off"}});
