import { describe, expect, it } from "vitest";

import type { Env } from "@/server/env";
import { localDemoLoginAllowed } from "@/server/fixtures/local-demo-login";

const localEnv = {
  NODE_ENV: "development",
  DEPLOYMENT_ENV: "development",
  DEMO_FIXTURES_ENABLED: true,
  BETTER_AUTH_URL: "http://localhost:3000",
  DATABASE_URL: "postgresql://user:pass@localhost:5433/hiveos_dev",
} as Env;

describe("local demo login gate", () => {
  it("allows the explicit demo only on the local development database and host", () => {
    expect(localDemoLoginAllowed(localEnv, "localhost:3000")).toBe(true);
    expect(localDemoLoginAllowed(localEnv, "127.0.0.1:3000")).toBe(true);
  });

  it("fails closed for production, disabled fixtures, remote hosts and other databases", () => {
    expect(localDemoLoginAllowed({ ...localEnv, NODE_ENV: "production" }, "localhost:3000")).toBe(false);
    expect(localDemoLoginAllowed({ ...localEnv, DEMO_FIXTURES_ENABLED: false }, "localhost:3000")).toBe(false);
    expect(localDemoLoginAllowed(localEnv, "hiveos.example.com")).toBe(false);
    expect(localDemoLoginAllowed({ ...localEnv, DATABASE_URL: "postgresql://user:pass@localhost:5433/hiveos_test" }, "localhost:3000")).toBe(false);
    expect(localDemoLoginAllowed({ ...localEnv, DEPLOYMENT_ENV: "staging" }, "localhost:3000")).toBe(false);
  });
});
