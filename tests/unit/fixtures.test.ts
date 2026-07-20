import { afterEach, describe, expect, it } from "vitest";

import { resetEnvCache } from "@/server/env";
import { demoFixturesAllowed, loadDemoFixtures } from "@/server/fixtures/demo";

function withEnv(overrides: Record<string, string>) {
  resetEnvCache();
  const previous: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(overrides)) {
    previous[key] = process.env[key];
    process.env[key] = value;
  }
  return () => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    resetEnvCache();
  };
}

describe("demo fixture boundary", () => {
  let restore: (() => void) | undefined;

  afterEach(() => {
    restore?.();
    restore = undefined;
  });

  it("is disabled by default", async () => {
    restore = withEnv({
      DATABASE_URL: "postgresql://u:p@localhost:5433/hiveos_test",
      DEMO_FIXTURES_ENABLED: "false",
    });
    expect(demoFixturesAllowed()).toBe(false);
    expect(await loadDemoFixtures()).toEqual({ loaded: false });
  });

  it("loads only with the explicit flag outside production", async () => {
    restore = withEnv({
      NODE_ENV: "development",
      DATABASE_URL: "postgresql://u:p@localhost:5433/hiveos_test",
      DEMO_FIXTURES_ENABLED: "true",
    });
    expect(demoFixturesAllowed()).toBe(true);
    expect(await loadDemoFixtures()).toEqual({ loaded: true });
  });
});
