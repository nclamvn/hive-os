import {defineConfig} from "@playwright/test";
import path from "node:path";
const origin="http://127.0.0.1:3004";
if(process.env.NODE_ENV!=="test"||process.env.HIVE_E2E_BASE_URL!==origin)throw new Error("TIP081_FIXED_ORIGIN_REQUIRED");
for(const key of ["DATABASE_URL","DATABASE_MIGRATION_URL"]){const u=new URL(process.env[key]??"");if(!["localhost","127.0.0.1"].includes(u.hostname)||u.port!=="5433"||u.pathname!=="/hiveos_test")throw new Error("TIP081_TEST_DB_REQUIRED");}
// Reviewed externally started server. No global setup, cleanup, migrations or grant.
export default defineConfig({testDir:path.resolve("tests/e2e"),testMatch:"evidence-studio*.spec.ts",fullyParallel:false,workers:1,retries:0,timeout:120000,globalTimeout:120000,forbidOnly:true,reporter:"list",outputDir:path.resolve("artifacts/tip081/playwright"),use:{baseURL:origin,trace:"off",screenshot:"off"}});
