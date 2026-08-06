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

  it("TIP-024D packages the research worker as a separate non-root image", () => {
    const dockerfile = readFileSync(path.join(root, "Dockerfile"), "utf8");
    const packageJson = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8"),
    ) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    const workflow = readFileSync(
      path.join(root, ".github/workflows/staging-images.yml"),
      "utf8",
    );
    expect(dockerfile).toContain("FROM deps AS worker");
    expect(dockerfile).toMatch(
      /FROM deps AS worker[\s\S]*USER node[\s\S]*CMD \["npm", "run", "worker:research-sandbox"\]/,
    );
    expect(dockerfile).toContain("./node_modules/.bin/tsx --version");
    expect(dockerfile).toContain("--validate-startup-contract=TIP-024D");
    expect(packageJson.dependencies.tsx).toBe("4.23.8");
    expect(packageJson.devDependencies.tsx).toBeUndefined();
    expect(workflow).toContain("target: worker");
    expect(workflow).toContain("hiveos-staging-worker:${{ github.sha }}");
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

  it("OBS-01 retains bounded numeric operational evidence", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    writeOperationalEvent({
      level: "info",
      event: "worker.cycle",
      outcome: "success",
      correlationId: "cycle-1",
      component: "organization_worker",
      durationMs: 12.7,
      count: 4,
      queueDepth: 2,
    });
    expect(JSON.parse(String(info.mock.calls[0][0]))).toMatchObject({
      durationMs: 13,
      count: 4,
      queueDepth: 2,
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
