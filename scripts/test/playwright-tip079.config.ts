import {defineConfig} from "@playwright/test";
import path from "node:path";

// External reviewed server only. Configuration validation precedes fixtures;
// there is no global setup, migration, cleanup, build or web-server launcher.
const origin="http://127.0.0.1:3002";
if(process.env.NODE_ENV!=="test" || process.env.HIVE_E2E_BASE_URL!==origin) throw new Error("TIP079 isolated test origin required");
for(const key of ["DATABASE_URL","DATABASE_MIGRATION_URL"]) {
  const db=new URL(process.env[key]??"");
  if(!["localhost","127.0.0.1"].includes(db.hostname)||db.port!=="5433"||db.pathname!=="/hiveos_test") throw new Error("TIP079 loopback test database required");
}
export default defineConfig({
  testDir:path.resolve("tests/e2e"),testMatch:"poly19-showcase.spec.ts",
  fullyParallel:false,workers:1,retries:0,timeout:45000,forbidOnly:true,
  reporter:"list",outputDir:path.resolve("artifacts/tip079/playwright"),
  use:{baseURL:origin,trace:"retain-on-failure",screenshot:"only-on-failure"},
});
