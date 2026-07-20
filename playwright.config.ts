import { defineConfig } from "@playwright/test";

import { E2E_ENV } from "./tests/e2e/env";

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
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    // globalSetup builds in production; here we only serve, with the test env
    // (NODE_ENV=test) so the SEC-04 guard permits disabling rate limiting.
    command: "npm run start",
    url: "http://localhost:3000/api/health",
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: { ...E2E_ENV },
  },
});
