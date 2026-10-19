// Local loopback observation only. This is not a production SLO or capacity
// claim. The script starts the built app under the isolated test environment,
// records bounded request observations, then stops the child process.
import { spawn } from "node:child_process";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { performance } from "node:perf_hooks";
import { setTimeout as sleep } from "node:timers/promises";
import { promisify } from "node:util";

import dotenv from "dotenv";

dotenv.config({ path: ".env.test", override: true });

const PORT = 4001;
const S3_STUB_PORT = 4002;
const baseUrl = `http://127.0.0.1:${PORT}`;
const execFileAsync = promisify(execFile);
const rounds = Math.max(
  1,
  Number.parseInt(process.env.LOAD_ROUNDS ?? "1", 10) || 1,
);
const stages = [
  { name: "warmup", requests: 100, concurrency: 5 },
  { name: "baseline", requests: 500, concurrency: 25 },
  { name: "load", requests: 1_000, concurrency: 50 },
  { name: "stress", requests: 2_000, concurrency: 100 },
];
const paths = ["/api/health/live", "/api/health/ready", "/sign-in"];
const s3Stub = createServer((request, response) => {
  if (request.method === "HEAD") {
    response.writeHead(404, {
      "x-amz-request-id": "local-stress-stub",
    });
    response.end();
    return;
  }
  response.writeHead(405);
  response.end();
});
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
    S3_ENDPOINT: `http://127.0.0.1:${S3_STUB_PORT}`,
    S3_REGION: "us-east-1",
    S3_BUCKET: "local-stress-stub",
    S3_ACCESS_KEY_ID: "local-load-key",
    S3_SECRET_ACCESS_KEY: "local-load-secret",
    S3_FORCE_PATH_STYLE: "true",
    S3_SERVER_SIDE_ENCRYPTION: "AES256",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
function retainOutput(chunk) {
  output = (output + chunk.toString()).slice(-65_536);
}
child.stdout.on("data", retainOutput);
child.stderr.on("data", retainOutput);

const resources = {
  samples: 0,
  firstRssBytes: 0,
  lastRssBytes: 0,
  peakRssBytes: 0,
  peakCpuPercent: 0,
  unavailableReason: null,
};
let stopResourceSampling = false;

async function sampleResources() {
  if (!child.pid || resources.unavailableReason) return;
  try {
    const { stdout } = await execFileAsync("ps", [
      "-o",
      "rss=,%cpu=",
      "-p",
      String(child.pid),
    ]);
    const [rssKb, cpuPercent] = stdout.trim().split(/\s+/).map(Number);
    if (!Number.isFinite(rssKb) || !Number.isFinite(cpuPercent)) {
      throw new Error("unexpected ps output");
    }
    const rssBytes = rssKb * 1024;
    if (resources.samples === 0) resources.firstRssBytes = rssBytes;
    resources.samples += 1;
    resources.lastRssBytes = rssBytes;
    resources.peakRssBytes = Math.max(resources.peakRssBytes, rssBytes);
    resources.peakCpuPercent = Math.max(
      resources.peakCpuPercent,
      cpuPercent,
    );
  } catch (error) {
    resources.unavailableReason =
      error instanceof Error ? error.message : String(error);
  }
}

async function monitorResources() {
  while (!stopResourceSampling) {
    await sampleResources();
    await sleep(250);
  }
  await sampleResources();
}

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

async function observe(pathname, stage) {
  const timings = [];
  let next = 0;
  let transportFailures = 0;
  let serverFailures = 0;
  const statuses = {};
  async function worker() {
    while (next < stage.requests) {
      next += 1;
      const started = performance.now();
      try {
        const response = await fetch(`${baseUrl}${pathname}`, {
          redirect: "manual",
          signal: AbortSignal.timeout(10_000),
        });
        statuses[response.status] = (statuses[response.status] ?? 0) + 1;
        if (response.status >= 500) serverFailures += 1;
        await response.arrayBuffer();
      } catch {
        transportFailures += 1;
      }
      timings.push(performance.now() - started);
    }
  }
  const started = performance.now();
  await Promise.all(
    Array.from({ length: stage.concurrency }, () => worker()),
  );
  const durationMs = performance.now() - started;
  timings.sort((a, b) => a - b);
  const percentile = (value) =>
    Math.round(timings[Math.min(timings.length - 1, Math.ceil(value * timings.length) - 1)]);
  return {
    stage: stage.name,
    path: pathname,
    requests: stage.requests,
    concurrency: stage.concurrency,
    transportFailures,
    serverFailures,
    statuses,
    durationMs: Math.round(durationMs),
    observedRequestsPerSecond: Number(
      ((stage.requests * 1000) / durationMs).toFixed(1),
    ),
    latencyMs: {
      p50: percentile(0.5),
      p95: percentile(0.95),
      p99: percentile(0.99),
      max: Math.round(timings.at(-1) ?? 0),
    },
  };
}

try {
  await new Promise((resolve, reject) => {
    s3Stub.once("error", reject);
    s3Stub.listen(S3_STUB_PORT, "127.0.0.1", resolve);
  });
  await waitUntilLive();
  const resourceMonitor = monitorResources();
  const observations = [];
  for (let round = 1; round <= rounds; round += 1) {
    for (const stage of stages) {
      for (const pathname of paths) {
        await sampleResources();
        const rssBeforeBytes = resources.lastRssBytes;
        const observation = await observe(pathname, stage);
        await sampleResources();
        observations.push({
          round,
          ...observation,
          processRssBeforeBytes: rssBeforeBytes,
          processRssAfterBytes: resources.lastRssBytes,
          processRssDeltaBytes: resources.lastRssBytes - rssBeforeBytes,
        });
      }
    }
  }
  await sleep(2_000);
  stopResourceSampling = true;
  await resourceMonitor;
  const report = {
    schema: "hive-os.local-load-observation.v2",
    classification: "LOCAL_LOOPBACK_NON_SLO",
    observedAt: new Date().toISOString(),
    dependencyProfile: {
      database: "LOCAL_POSTGRESQL_TEST_DATABASE",
      objectStorage: "LOCAL_S3_HEAD_STUB",
    },
    rounds,
    totalRequests: observations.reduce(
      (total, item) => total + item.requests,
      0,
    ),
    processResources: resources,
    rssGrowthBytes:
      resources.samples > 0
        ? resources.lastRssBytes - resources.firstRssBytes
        : null,
    observations,
  };
  console.log(JSON.stringify(report, null, 2));
  if (
    observations.some(
      (item) => item.transportFailures > 0 || item.serverFailures > 0,
    )
  ) {
    throw new Error("load-baseline: transport or HTTP 5xx failure observed");
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  if (output) console.error(output);
  process.exitCode = 1;
} finally {
  stopResourceSampling = true;
  child.kill("SIGTERM");
  s3Stub.close();
  await sleep(500);
  if (child.exitCode === null) child.kill("SIGKILL");
}
