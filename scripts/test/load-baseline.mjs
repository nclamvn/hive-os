// Local loopback observation only. This is not a production SLO or capacity
// claim. The script starts the built app under the isolated test environment,
// records bounded request observations, then stops the child process.
import { spawn } from "node:child_process";
import { performance } from "node:perf_hooks";
import { setTimeout as sleep } from "node:timers/promises";

import dotenv from "dotenv";

dotenv.config({ path: ".env.test", override: true });

const PORT = 4001;
const REQUESTS = 100;
const CONCURRENCY = 10;
const baseUrl = `http://127.0.0.1:${PORT}`;
const child = spawn("node", [".next/standalone/server.js"], {
  env: {
    ...process.env,
    NODE_ENV: "production",
    DEPLOYMENT_ENV: "staging",
    PORT: String(PORT),
    MAINTENANCE_MODE: "false",
    BETTER_AUTH_URL: "https://app.example.test",
    AUTH_ALLOW_SELF_SIGNUP: "false",
    AUTH_RATE_LIMIT_ENABLED: "true",
    AUTH_THROTTLE_SECRET: "local-load-throttle-secret-16-chars",
    MAIL_DRIVER: "smtp",
    SMTP_HOST: "smtp.example.test",
    MAIL_FROM: "HIVE OS <noreply@example.test>",
    MAIL_BASE_URL: "https://app.example.test",
    STORAGE_DRIVER: "s3",
    S3_REGION: "us-east-1",
    S3_BUCKET: "local-load-not-contacted",
    S3_ACCESS_KEY_ID: "local-load-key",
    S3_SECRET_ACCESS_KEY: "local-load-secret",
    S3_SERVER_SIDE_ENCRYPTION: "AES256",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
child.stdout.on("data", (chunk) => (output += chunk.toString()));
child.stderr.on("data", (chunk) => (output += chunk.toString()));

async function waitUntilLive() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error("load-baseline: server exited before liveness");
    }
    try {
      const response = await fetch(`${baseUrl}/api/health/live`);
      if (response.ok) return;
    } catch {
      // Process is still starting.
    }
    await sleep(500);
  }
  throw new Error("load-baseline: server did not become live");
}

async function observe(pathname) {
  const timings = [];
  let next = 0;
  let failures = 0;
  async function worker() {
    while (next < REQUESTS) {
      next += 1;
      const started = performance.now();
      try {
        const response = await fetch(`${baseUrl}${pathname}`, {
          redirect: "manual",
        });
        if (response.status >= 500) failures += 1;
      } catch {
        failures += 1;
      }
      timings.push(performance.now() - started);
    }
  }
  const started = performance.now();
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  const durationMs = performance.now() - started;
  timings.sort((a, b) => a - b);
  const percentile = (value) =>
    Math.round(timings[Math.min(timings.length - 1, Math.ceil(value * timings.length) - 1)]);
  return {
    path: pathname,
    requests: REQUESTS,
    concurrency: CONCURRENCY,
    failures,
    durationMs: Math.round(durationMs),
    observedRequestsPerSecond: Number(
      ((REQUESTS * 1000) / durationMs).toFixed(1),
    ),
    latencyMs: {
      p50: percentile(0.5),
      p95: percentile(0.95),
      max: Math.round(timings.at(-1) ?? 0),
    },
  };
}

try {
  await waitUntilLive();
  const observations = [
    await observe("/api/health/live"),
    await observe("/sign-in"),
  ];
  if (observations.some((item) => item.failures > 0)) {
    throw new Error("load-baseline: one or more requests failed");
  }
  console.log(
    JSON.stringify(
      {
        schema: "hive-os.local-load-observation.v1",
        classification: "LOCAL_LOOPBACK_NON_SLO",
        observedAt: new Date().toISOString(),
        observations,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  if (output) console.error(output);
  process.exitCode = 1;
} finally {
  child.kill("SIGTERM");
  await sleep(500);
  if (child.exitCode === null) child.kill("SIGKILL");
}
