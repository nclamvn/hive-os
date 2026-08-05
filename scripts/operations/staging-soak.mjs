import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { setTimeout as wait } from "node:timers/promises";

function parseArgs(argv) {
  const values = new Map();
  for (const value of argv) {
    if (!value.startsWith("--") || !value.includes("=")) continue;
    const [key, ...rest] = value.slice(2).split("=");
    values.set(key, rest.join("="));
  }
  return values;
}

function positiveInteger(value, fallback, name) {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

function percentile(sorted, fraction) {
  if (sorted.length === 0) return null;
  return sorted[
    Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)
  ];
}

function summarize(samples) {
  const sorted = [...samples].sort((a, b) => a - b);
  return {
    count: sorted.length,
    p50Ms: percentile(sorted, 0.5),
    p95Ms: percentile(sorted, 0.95),
    p99Ms: percentile(sorted, 0.99),
    maxMs: sorted.at(-1) ?? null,
  };
}

function classifyTransportError(error) {
  if (!(error instanceof Error)) return "UNKNOWN";
  const cause = error.cause;
  const causeCode =
    cause && typeof cause === "object" && "code" in cause
      ? String(cause.code)
      : "";
  return [error.name || "Error", causeCode].filter(Boolean).join(":");
}

const args = parseArgs(process.argv.slice(2));
const baseUrl = new URL(args.get("base-url") ?? "");
if (baseUrl.protocol !== "https:") {
  throw new Error("base-url must use HTTPS");
}

const durationSeconds = positiveInteger(
  args.get("duration-seconds"),
  1_800,
  "duration-seconds",
);
const concurrency = positiveInteger(args.get("concurrency"), 5, "concurrency");
const timeoutMs = positiveInteger(args.get("timeout-ms"), 15_000, "timeout-ms");
const paceMs = positiveInteger(args.get("pace-ms"), 500, "pace-ms");
const reportPath = path.resolve(
  args.get("report") ?? "/tmp/hiveos-staging-soak.json",
);
const endpoints = ["/api/health/live", "/api/health/ready", "/sign-in"];
const startedAt = new Date();
const deadline = performance.now() + durationSeconds * 1_000;
const observations = Object.fromEntries(
  endpoints.map((endpoint) => [
    endpoint,
    { latencies: [], statuses: {}, errors: 0, errorKinds: {} },
  ]),
);
let requests = 0;
let lastCompletion = performance.now();
let maxCompletionGapMs = 0;

async function worker(workerId) {
  let sequence = workerId;
  while (performance.now() < deadline) {
    const endpoint = endpoints[sequence % endpoints.length];
    sequence += concurrency;
    const observation = observations[endpoint];
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const began = performance.now();
    try {
      const response = await fetch(new URL(endpoint, baseUrl), {
        cache: "no-store",
        redirect: "manual",
        signal: controller.signal,
        headers: { "user-agent": "hiveos-tip024q-r1-soak/1" },
      });
      const elapsed = Number((performance.now() - began).toFixed(2));
      observation.latencies.push(elapsed);
      observation.statuses[response.status] =
        (observation.statuses[response.status] ?? 0) + 1;
      await response.body?.cancel();
    } catch (error) {
      observation.errors += 1;
      const errorKind = classifyTransportError(error);
      observation.errorKinds[errorKind] =
        (observation.errorKinds[errorKind] ?? 0) + 1;
    } finally {
      clearTimeout(timeout);
      requests += 1;
      const completed = performance.now();
      maxCompletionGapMs = Math.max(
        maxCompletionGapMs,
        completed - lastCompletion,
      );
      lastCompletion = completed;
    }
    if (performance.now() < deadline) await wait(paceMs);
  }
}

const progress = setInterval(() => {
  const elapsedSeconds = Math.round((Date.now() - startedAt.getTime()) / 1_000);
  process.stdout.write(
    `${JSON.stringify({ type: "SOAK_PROGRESS", elapsedSeconds, requests })}\n`,
  );
}, 60_000);

await Promise.all(
  Array.from({ length: concurrency }, (_, index) => worker(index)),
);
clearInterval(progress);

const finishedAt = new Date();
const elapsedSeconds = (finishedAt.getTime() - startedAt.getTime()) / 1_000;
const endpointResults = Object.fromEntries(
  Object.entries(observations).map(([endpoint, value]) => [
    endpoint,
    {
      ...summarize(value.latencies),
      statuses: value.statuses,
      transportErrors: value.errors,
      transportErrorKinds: value.errorKinds,
    },
  ]),
);
const totalTransportErrors = Object.values(observations).reduce(
  (total, value) => total + value.errors,
  0,
);
const total5xx = Object.values(observations).reduce(
  (total, value) =>
    total +
    Object.entries(value.statuses).reduce(
      (subtotal, [status, count]) =>
        subtotal + (Number(status) >= 500 ? count : 0),
      0,
    ),
  0,
);

const report = {
  schemaVersion: 2,
  classification: "MANAGED_STAGING_BOUNDED_NON_SLO",
  baseUrl: baseUrl.origin,
  startedAt: startedAt.toISOString(),
  finishedAt: finishedAt.toISOString(),
  requestedDurationSeconds: durationSeconds,
  elapsedSeconds,
  concurrency,
  paceMs,
  requests,
  requestsPerSecond: Number((requests / elapsedSeconds).toFixed(2)),
  maxCompletionGapMs: Number(maxCompletionGapMs.toFixed(2)),
  totalTransportErrors,
  total5xx,
  endpoints: endpointResults,
  passed: totalTransportErrors === 0 && total5xx === 0,
};

await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, {
  encoding: "utf8",
  mode: 0o600,
});
process.stdout.write(`${JSON.stringify({ type: "SOAK_COMPLETE", report })}\n`);
if (!report.passed) process.exitCode = 1;
