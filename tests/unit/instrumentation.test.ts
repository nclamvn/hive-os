import { afterEach, describe, expect, it, vi } from "vitest";

import { register } from "@/instrumentation";
import { resetEnvCache } from "@/server/env";

const originalDatabaseUrl = process.env.DATABASE_URL;
const originalNextPhase = process.env.NEXT_PHASE;

afterEach(() => {
  if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = originalDatabaseUrl;
  if (originalNextPhase === undefined) delete process.env.NEXT_PHASE;
  else process.env.NEXT_PHASE = originalNextPhase;
  resetEnvCache();
  vi.restoreAllMocks();
});

describe("runtime instrumentation", () => {
  it("XC-04 throws on invalid runtime configuration without process.exit", async () => {
    delete process.env.DATABASE_URL;
    delete process.env.NEXT_PHASE;
    resetEnvCache();
    const exit = vi.spyOn(process, "exit");
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(register()).rejects.toThrow(
      /environment validation failed; refusing to serve/,
    );
    expect(exit).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledOnce();
  });

  it("skips runtime validation during the production build phase", async () => {
    delete process.env.DATABASE_URL;
    process.env.NEXT_PHASE = "phase-production-build";
    resetEnvCache();

    await expect(register()).resolves.toBeUndefined();
  });
});
