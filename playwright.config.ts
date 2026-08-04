import { defineConfig } from "@playwright/test";

import { E2E_BASE_URL, E2E_ENV } from "./tests/e2e/env";

const e2ePort = new URL(E2E_BASE_URL).port || "3000";

export default defineConfig({
  testDir: "tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: true,
  // Bounded concurrency keeps the shared test database and single app server
  // stable under auth + mission write load.
  workers: 2,
  timeout: 45_000,
  forbidOnly: !!process.env.CI,
  // One retry absorbs transient slowness of the single shared app server under
  // concurrent auth + mission write load (infrastructural, not correctness).
  retries: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: E2E_BASE_URL,
    trace: "on-first-retry",
  },
  webServer: {
    // Serve the production standalone build through the test-only launcher.
    // Next's generated server hard-sets NODE_ENV=production; the launcher
    // retains NODE_ENV=test for the isolated E2E data/mail/throttle boundary
    // without weakening the shipped `npm start` fail-closed contract.
    command: `PORT=${e2ePort} node scripts/test/start-e2e-standalone.mjs`,
    url: `${E2E_BASE_URL}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: { ...E2E_ENV },
  },
});
