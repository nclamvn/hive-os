import { readFileSync } from "node:fs";
import path from "node:path";

import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { proxy } from "@/proxy";
import {
  isValidCorrelationId,
  resolveCorrelationId,
} from "@/server/observability/correlation";
import { writeOperationalEvent } from "@/server/observability/operational-log";

const root = path.resolve(__dirname, "../..");
const originalMaintenanceMode = process.env.MAINTENANCE_MODE;

afterEach(() => {
  if (originalMaintenanceMode === undefined) {
    delete process.env.MAINTENANCE_MODE;
  } else {
    process.env.MAINTENANCE_MODE = originalMaintenanceMode;
  }
  vi.restoreAllMocks();
});

describe("production contract", () => {
  it("PRC-01 defines a standalone non-root container without copied env files", () => {
    const dockerfile = readFileSync(path.join(root, "Dockerfile"), "utf8");
    const dockerignore = readFileSync(path.join(root, ".dockerignore"), "utf8");
    const packageJson = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8"),
    ) as { scripts: Record<string, string> };
    expect(dockerfile).toContain("USER hiveos");
    expect(dockerfile).toContain("/app/.next/standalone");
    expect(dockerfile).not.toMatch(/COPY\\s+\\.env/);
    expect(dockerignore).toContain(".env.*");
    expect(packageJson.scripts.build).toContain("scrub-standalone-env.mjs");
  });

  it("PRC-04 accepts bounded correlation IDs and replaces malformed input", () => {
    expect(isValidCorrelationId("request_01:pilot")).toBe(true);
    expect(isValidCorrelationId("unsafe value")).toBe(false);
    expect(resolveCorrelationId("request_01:pilot")).toBe("request_01:pilot");
    expect(resolveCorrelationId("unsafe value")).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("PRC-05 emits one-line structured metadata without arbitrary values", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    writeOperationalEvent({
      level: "error",
      event: "storage.readiness_failed",
      outcome: "failure",
      correlationId: "request-1",
      errorType: "AccessDenied",
      component: "storage",
    });
    const line = String(error.mock.calls[0][0]);
    expect(line).not.toContain("\n");
    expect(JSON.parse(line)).toMatchObject({
      level: "error",
      event: "storage.readiness_failed",
      outcome: "failure",
      correlationId: "request-1",
      errorType: "AccessDenied",
      component: "storage",
    });
  });

  it("PRC-11 maintenance mode blocks user traffic but preserves health", () => {
    process.env.MAINTENANCE_MODE = "true";
    const blocked = proxy(new NextRequest("http://localhost/sign-in"));
    expect(blocked.status).toBe(503);
    expect(blocked.headers.get("retry-after")).toBe("300");

    const health = proxy(
      new NextRequest("http://localhost/api/health/live"),
    );
    expect(health.status).toBe(200);
    expect(health.headers.get("x-middleware-next")).toBe("1");
  });
});
