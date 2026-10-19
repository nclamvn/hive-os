import "dotenv/config";

import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { setTimeout as sleep } from "node:timers/promises";

import pg from "pg";

import { validateTip023hReport } from "./report-contract.mjs";

const SCALE_DB = "hiveos_tip023h_scale";
const RESTORE_DB = "hiveos_tip023h_restore";
const CONFIRMATION = "TIP-023H";
const LEDGER_ROWS = 1_000_000;
const MISSION_ROWS = 10_000;
const CONTENTION = 100;
const JOB_ROWS = 1_000;
const WORKERS = 4;
const ORG_A = "023h0000-0000-4000-8000-00000000000a";
const ORG_B = "023h0000-0000-4000-8000-00000000000b";
const USER_A = "023h0000-0000-4000-8000-00000000001a";
const USER_B = "023h0000-0000-4000-8000-00000000001b";
const ORG_MEMBER_A = "023h0000-0000-4000-8000-00000000002a";
const ORG_MEMBER_B = "023h0000-0000-4000-8000-00000000002b";
const UNIT_A = "023h0000-0000-4000-8000-00000000003a";
const UNIT_B = "023h0000-0000-4000-8000-00000000003b";
const WORKSPACE_A = "023h0000-0000-4000-8000-00000000004a";
const WORKSPACE_B = "023h0000-0000-4000-8000-00000000004b";
const MEMBER_A = "023h0000-0000-4000-8000-00000000005a";
const MEMBER_B = "023h0000-0000-4000-8000-00000000005b";

function argument(name) {
  return process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
}
function boolArgument(name) {
  return process.argv.includes(`--${name}`);
}
function numberArgument(name, fallback) {
  const value = Number(argument(name) ?? fallback);
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be positive`);
  return value;
}

if (argument("confirm-run") !== CONFIRMATION) {
  throw new Error("TIP-023H certification requires --confirm-run=TIP-023H");
}
const durationSeconds = numberArgument("duration-seconds", 3_600);
const certificationProfile = durationSeconds >= 3_600;
const reportPath = path.resolve(
  argument("report") ?? "docs/verification/evidence/TIP-023H_SCALE_REPORT.json",
);
if (!certificationProfile && !argument("report")) {
  throw new Error("A short smoke run must use an explicit non-certification report path");
}

const ownerBase = process.env.DATABASE_MIGRATION_URL;
const runtimeBase = process.env.DATABASE_URL;
if (!ownerBase || !runtimeBase) {
  throw new Error("DATABASE_MIGRATION_URL and DATABASE_URL are required");
}
const urlFor = (base, database) => {
  const url = new URL(base);
  url.pathname = `/${database}`;
  return url.toString();
};
const ownerUrl = urlFor(ownerBase, SCALE_DB);
const runtimeUrl = urlFor(runtimeBase, SCALE_DB);
const restoreOwnerUrl = urlFor(ownerBase, RESTORE_DB);
const restoreRuntimeUrl = urlFor(runtimeBase, RESTORE_DB);
const adminUrl = urlFor(ownerBase, "postgres");
const startedAt = new Date();
const powerGuard = process.platform === "darwin"
  ? spawn("caffeinate", ["-dimsu", "-w", String(process.pid)], { stdio: "ignore" })
  : null;
const failures = [];
const gates = {};
const observations = {};
const temporaryRoot = mkdtempSync(path.join(tmpdir(), "hiveos-tip023h-"));

function recordFailure(gate, error, severity = "P0", disposition = "BLOCK_CERTIFICATION") {
  failures.push({
    gate,
    severity,
    disposition,
    message: error instanceof Error ? error.message : String(error),
  });
  gates[gate] = "FAIL";
}
function assertInvariant(condition, message) {
  if (!condition) throw new Error(message);
}
async function recreateDatabase(admin, name) {
  assertInvariant(name === SCALE_DB || name === RESTORE_DB, "Unsafe database target");
  await admin.query(
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname=$1 AND pid<>pg_backend_pid()",
    [name],
  );
  await admin.query(`DROP DATABASE IF EXISTS "${name}"`);
  await admin.query(`CREATE DATABASE "${name}"`);
}
async function dropDatabase(admin, name) {
  assertInvariant(name === SCALE_DB || name === RESTORE_DB, "Unsafe database target");
  await admin.query(
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname=$1 AND pid<>pg_backend_pid()",
    [name],
  );
  await admin.query(`DROP DATABASE IF EXISTS "${name}"`);
}
function applyMigrations(databaseOwnerUrl) {
  execFileSync("npx", ["prisma", "migrate", "deploy"], {
    env: { ...process.env, DATABASE_URL: databaseOwnerUrl, DATABASE_MIGRATION_URL: databaseOwnerUrl },
    stdio: "pipe",
  });
  execFileSync("node", ["scripts/db/apply-app-role.mjs"], {
    env: { ...process.env, DATABASE_URL: databaseOwnerUrl, DATABASE_MIGRATION_URL: databaseOwnerUrl },
    stdio: "pipe",
  });
}

async function seedFixture(owner) {
  await owner.query(`
    INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
    VALUES
      ('${USER_A}', 'TIP-023H Owner A', 'tip023h-a@test.local', true, now(), now()),
      ('${USER_B}', 'TIP-023H Owner B', 'tip023h-b@test.local', true, now(), now());
    INSERT INTO organization (id, slug, name, status, created_by_id, created_at, updated_at, version)
    VALUES
      ('${ORG_A}', 'tip023h-org-a', 'TIP-023H Organization A', 'ACTIVE', '${USER_A}', now(), now(), 1),
      ('${ORG_B}', 'tip023h-org-b', 'TIP-023H Organization B', 'ACTIVE', '${USER_B}', now(), now(), 1);
    INSERT INTO organization_membership
      (id, organization_id, user_id, role, status, created_by_id, created_at, updated_at, version)
    VALUES
      ('${ORG_MEMBER_A}', '${ORG_A}', '${USER_A}', 'OWNER', 'ACTIVE', '${USER_A}', now(), now(), 1),
      ('${ORG_MEMBER_B}', '${ORG_B}', '${USER_B}', 'OWNER', 'ACTIVE', '${USER_B}', now(), now(), 1);
    INSERT INTO org_unit
      (id, organization_id, parent_id, unit_key, name, type, status, created_by_id, created_at, updated_at, version)
    VALUES
      ('${UNIT_A}', '${ORG_A}', NULL, 'root', 'Root A', 'ROOT', 'ACTIVE', '${USER_A}', now(), now(), 1),
      ('${UNIT_B}', '${ORG_B}', NULL, 'root', 'Root B', 'ROOT', 'ACTIVE', '${USER_B}', now(), now(), 1);
    INSERT INTO workspace
      (id, organization_id, org_unit_id, slug, name, status, created_by_id, created_at, updated_at, version)
    VALUES
      ('${WORKSPACE_A}', '${ORG_A}', '${UNIT_A}', 'tip023h-workspace-a', 'TIP-023H Workspace A', 'ACTIVE', '${USER_A}', now(), now(), 1),
      ('${WORKSPACE_B}', '${ORG_B}', '${UNIT_B}', 'tip023h-workspace-b', 'TIP-023H Workspace B', 'ACTIVE', '${USER_B}', now(), now(), 1);
    INSERT INTO membership
      (id, workspace_id, user_id, role, status, created_by_id, created_at, updated_at, version)
    VALUES
      ('${MEMBER_A}', '${WORKSPACE_A}', '${USER_A}', 'OWNER', 'ACTIVE', '${USER_A}', now(), now(), 1),
      ('${MEMBER_B}', '${WORKSPACE_B}', '${USER_B}', 'OWNER', 'ACTIVE', '${USER_B}', now(), now(), 1);
  `);
  const fixtureStarted = performance.now();
  await owner.query(
    `INSERT INTO mission
       (id, workspace_id, reference_code, title, status, assurance_profile,
        created_by_membership_id, created_at, updated_at, version)
     SELECT 'tip023h-mission-' || lpad(value::text, 10, '0'), $1,
            'SCALE-' || lpad(value::text, 10, '0'),
            'Deterministic scale mission ' || value, 'DRAFT', 'PROFESSIONAL',
            $2, timestamp '2026-08-04 00:00:00' + value * interval '1 millisecond',
            timestamp '2026-08-04 00:00:00' + value * interval '1 millisecond', 1
     FROM generate_series(1, $3) value`,
    [WORKSPACE_A, MEMBER_A, MISSION_ROWS],
  );
  await owner.query(
    `INSERT INTO audit_event
       (id, workspace_id, actor_user_id, actor_membership_id, event_type,
        entity_type, entity_id, correlation_id, payload, created_at)
     SELECT 'tip023h-ledger-' || lpad(value::text, 10, '0'), $1, $2, $3,
            'scale.fixture', 'ScaleLedger',
            'scale-entity-' || lpad(value::text, 10, '0'),
            'tip023h-fixture-' || lpad((value % 10000)::text, 5, '0'),
            jsonb_build_object('ordinal', value, 'fixture', 'TIP-023H'),
            timestamp '2026-08-04 00:00:00' + value * interval '1 millisecond'
     FROM generate_series(1, $4) value`,
    [WORKSPACE_A, USER_A, MEMBER_A, LEDGER_ROWS],
  );
  const result = await owner.query(
    `SELECT
       (SELECT count(*)::int FROM audit_event WHERE workspace_id=$1 AND event_type='scale.fixture') AS ledger_rows,
       (SELECT count(*)::int FROM mission WHERE workspace_id=$1) AS mission_rows,
       md5(concat_ws('|',
         (SELECT count(*)::text FROM audit_event WHERE workspace_id=$1 AND event_type='scale.fixture'),
         (SELECT min(id) FROM audit_event WHERE workspace_id=$1 AND event_type='scale.fixture'),
         (SELECT max(id) FROM audit_event WHERE workspace_id=$1 AND event_type='scale.fixture'),
         (SELECT sum((payload->>'ordinal')::bigint)::text FROM audit_event WHERE workspace_id=$1 AND event_type='scale.fixture')
       )) AS fingerprint`,
    [WORKSPACE_A],
  );
  return { ...result.rows[0], durationMs: Math.round(performance.now() - fixtureStarted) };
}

async function contention(runtime) {
  const physicalPoolMax = 64;
  const pool = new pg.Pool({ connectionString: runtime, max: physicalPoolMax });
  const started = performance.now();
  try {
    const results = await Promise.allSettled(Array.from({ length: CONTENTION }, async (_, index) => {
      const client = await pool.connect();
      try {
      await client.query("BEGIN");
      try {
        await client.query("SELECT set_config('hiveos.organization_id', $1, true)", [ORG_A]);
        const result = await client.query(
          `INSERT INTO command_record
             (id, organization_id, workspace_id, idempotency_key, command_type,
              actor_user_id, actor_organization_membership_id, correlation_id,
              issued_at, payload, payload_hash, status, outcome, completed_at, created_at)
           VALUES ($1, $2, $3, 'tip023h-contention-single', 'scale.contention',
                   $4, $5, 'tip023h-contention', now(), '{}'::jsonb,
                   repeat('0', 64), 'SUCCEEDED', '{}'::jsonb, now(), now())
           ON CONFLICT (organization_id, idempotency_key) DO NOTHING
           RETURNING id`,
          [`tip023h-contention-${String(index).padStart(3, "0")}`, ORG_A, WORKSPACE_A, USER_A, ORG_MEMBER_A],
        );
        await client.query("COMMIT");
        return result.rowCount ?? 0;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
      } finally {
        client.release();
      }
    }));
    const rejected = results.filter((result) => result.status === "rejected");
    const inserted = results.reduce((sum, result) =>
      sum + (result.status === "fulfilled" ? result.value : 0), 0);
    const verifier = await pool.connect();
    try {
    await verifier.query("BEGIN");
    await verifier.query("SELECT set_config('hiveos.organization_id', $1, true)", [ORG_A]);
    const count = await verifier.query(
      "SELECT count(*)::int AS count FROM command_record WHERE idempotency_key='tip023h-contention-single'",
    );
    await verifier.query("COMMIT");
    return { logicalContenders: CONTENTION, physicalPoolMax, inserted,
      retained: count.rows[0].count, rejected: rejected.length,
      durationMs: Math.round(performance.now() - started) };
    } finally {
      verifier.release();
    }
  } finally {
    await pool.end();
  }
}

async function tenantIsolation(runtime) {
  const hotClients = Array.from({ length: 16 }, () => new pg.Client({ connectionString: runtime }));
  const probe = new pg.Client({ connectionString: runtime });
  await Promise.all([...hotClients, probe].map((client) => client.connect()));
  let hotOperations = 0;
  let foreignRowsObserved = 0;
  const deadline = performance.now() + 5_000;
  try {
    await Promise.all([
      ...hotClients.map(async (client, worker) => {
        while (performance.now() < deadline) {
          await client.query("BEGIN");
          await client.query("SELECT set_config('hiveos.organization_id', $1, true)", [ORG_A]);
          await client.query(
            `SELECT id FROM command_record
             WHERE organization_id=$1 ORDER BY created_at DESC, id DESC LIMIT 25`,
            [ORG_A],
          );
          await client.query("COMMIT");
          hotOperations += 1;
          if (worker % 4 === 0) await sleep(1);
        }
      }),
      (async () => {
        while (performance.now() < deadline) {
          await probe.query("BEGIN");
          await probe.query("SELECT set_config('hiveos.organization_id', $1, true)", [ORG_B]);
          const foreign = await probe.query(
            "SELECT count(*)::int AS count FROM command_record WHERE organization_id=$1",
            [ORG_A],
          );
          foreignRowsObserved += foreign.rows[0].count;
          await probe.query(
            `INSERT INTO command_record
               (id, organization_id, workspace_id, idempotency_key, command_type,
                actor_user_id, actor_organization_membership_id, correlation_id,
                issued_at, payload, payload_hash, status, outcome, completed_at, created_at)
             VALUES (md5(random()::text || clock_timestamp()::text), $1, $2,
               md5(random()::text || clock_timestamp()::text), 'scale.tenant.probe',
               $3, $4, 'tip023h-tenant-probe', now(), '{}'::jsonb,
               repeat('0', 64), 'SUCCEEDED', '{}'::jsonb, now(), now())`,
            [ORG_B, WORKSPACE_B, USER_B, ORG_MEMBER_B],
          );
          await probe.query("COMMIT");
        }
      })(),
    ]);
    await probe.query("BEGIN");
    await probe.query("SELECT set_config('hiveos.organization_id', $1, true)", [ORG_B]);
    const own = await probe.query(
      "SELECT count(*)::int AS count FROM command_record WHERE command_type='scale.tenant.probe'",
    );
    await probe.query("COMMIT");
    return { durationSeconds: 5, hotOperations, foreignRowsObserved, tenantBProbeWrites: own.rows[0].count };
  } finally {
    await Promise.all([...hotClients, probe].map((client) => client.end()));
  }
}

function runWorker(runtime, index) {
  return new Promise((resolve, reject) => {
    const child = spawn("node", ["scripts/scale/tip023h-worker.mjs"], {
      env: { ...process.env, TIP023H_DATABASE_URL: runtime,
        TIP023H_ORGANIZATION_ID: ORG_A, TIP023H_WORKER_ID: `tip023h-worker-${index}` },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code !== 0) reject(new Error(`worker ${index} failed: ${stderr.slice(-500)}`));
      else resolve(JSON.parse(stdout.trim()));
    });
  });
}

async function multiProcessWorkers(owner, runtime) {
  await owner.query(
    `INSERT INTO durable_job
       (id, organization_id, workspace_id, job_type, payload, status,
        priority, attempts, max_attempts, available_at, created_at, updated_at, version)
     SELECT 'tip023h-job-' || lpad(value::text, 6, '0'), $1, $2,
            'scale.certification.noop', jsonb_build_object('ordinal', value),
            'READY', 100, 0, 5, now(), now(), now(), 1
     FROM generate_series(1, $3) value`,
    [ORG_A, WORKSPACE_A, JOB_ROWS],
  );
  const started = performance.now();
  const workers = await Promise.all(
    Array.from({ length: WORKERS }, (_, index) => runWorker(runtime, index + 1)),
  );
  const result = await owner.query(
    `SELECT
       count(*) FILTER (WHERE status='SUCCEEDED')::int AS succeeded,
       count(*) FILTER (WHERE status<>'SUCCEEDED')::int AS non_terminal,
       count(*) FILTER (WHERE attempts<>1)::int AS invalid_attempts,
       (SELECT count(*)::int FROM durable_job_event e
         WHERE e.organization_id=$1 AND e.event_type='SUCCEEDED'
           AND e.job_id LIKE 'tip023h-job-%') AS success_events,
       (SELECT count(*)::int FROM (
          SELECT job_id FROM durable_job_event
          WHERE organization_id=$1 AND event_type='SUCCEEDED'
            AND job_id LIKE 'tip023h-job-%'
          GROUP BY job_id HAVING count(*)<>1
        ) duplicate) AS duplicate_terminal_events
     FROM durable_job WHERE organization_id=$1 AND job_type='scale.certification.noop'`,
    [ORG_A],
  );
  return { processes: WORKERS, jobs: JOB_ROWS, workers, ...result.rows[0],
    durationMs: Math.round(performance.now() - started) };
}

function createLatencyAccumulator() {
  const sample = [];
  let count = 0;
  let sum = 0;
  let max = 0;
  return {
    add(value) {
      count += 1; sum += value; max = Math.max(max, value);
      if (sample.length < 50_000) sample.push(value);
      else sample[count % sample.length] = value;
    },
    summary() {
      sample.sort((a, b) => a - b);
      const percentile = (p) => sample[Math.min(sample.length - 1, Math.ceil(sample.length * p) - 1)] ?? 0;
      return { count, averageMs: Number((sum / Math.max(1, count)).toFixed(2)),
        p50Ms: Number(percentile(0.5).toFixed(2)), p95Ms: Number(percentile(0.95).toFixed(2)),
        p99Ms: Number(percentile(0.99).toFixed(2)), maxMs: Number(max.toFixed(2)), sampleSize: sample.length };
    },
  };
}

async function soak(owner, runtime, seconds) {
  const clients = Array.from({ length: 8 }, () => new pg.Client({ connectionString: runtime }));
  await Promise.all(clients.map((client) => client.connect()));
  const latency = createLatencyAccumulator();
  const intervals = [];
  const soakStartedAt = new Date();
  const started = performance.now();
  const deadline = started + seconds * 1_000;
  let operations = 0;
  let reads = 0;
  let writes = 0;
  let errors = 0;
  let sequence = 0;
  let stopSampling = false;
  const initialCpu = process.cpuUsage();
  const sampler = (async () => {
    let previousCpu = process.cpuUsage();
    let previousTime = performance.now();
    while (!stopSampling) {
      await sleep(Math.min(10_000, Math.max(1_000, deadline - performance.now())));
      const now = performance.now();
      const currentCpu = process.cpuUsage();
      const elapsedMicros = (now - previousTime) * 1_000;
      const usedMicros = currentCpu.user - previousCpu.user + currentCpu.system - previousCpu.system;
      const state = await owner.query(
        `SELECT
           (SELECT count(*)::int FROM pg_stat_activity WHERE datname=$1) AS connections,
           (SELECT count(*)::int FROM durable_job WHERE organization_id=$2 AND status='READY') AS queue_depth`,
        [SCALE_DB, ORG_A],
      );
      intervals.push({ elapsedSeconds: Math.round((now - started) / 1_000), operations, errors,
        harnessCpuPercent: Number(((usedMicros / Math.max(1, elapsedMicros)) * 100).toFixed(2)),
        harnessRssBytes: process.memoryUsage().rss,
        databaseConnections: state.rows[0].connections, queueDepth: state.rows[0].queue_depth });
      previousCpu = currentCpu;
      previousTime = now;
      process.stdout.write(`[TIP-023H soak] ${Math.round((now - started) / 1_000)}/${seconds}s operations=${operations} errors=${errors}\n`);
    }
  })();
  try {
    await Promise.all(clients.map(async (client, worker) => {
      while (performance.now() < deadline) {
        sequence += 1;
        const operation = sequence;
        const operationStarted = performance.now();
        try {
          await client.query("BEGIN");
          await client.query("SELECT set_config('hiveos.organization_id', $1, true)", [ORG_A]);
          if (operation % 10 === 0) {
            await client.query(
              `INSERT INTO command_record
                 (id, organization_id, workspace_id, idempotency_key, command_type,
                  actor_user_id, actor_organization_membership_id, correlation_id,
                  issued_at, payload, payload_hash, status, outcome, completed_at, created_at)
               VALUES ($1, $2, $3, $4, 'scale.soak', $5, $6, 'tip023h-soak',
                 now(), '{}'::jsonb, repeat('0', 64), 'SUCCEEDED', '{}'::jsonb, now(), now())
               ON CONFLICT (organization_id, idempotency_key) DO NOTHING`,
              [`tip023h-soak-${worker}-${operation}`, ORG_A, WORKSPACE_A,
                `tip023h-soak-${worker}-${operation}`, USER_A, ORG_MEMBER_A],
            );
            writes += 1;
          } else {
            const cursor = 1 + ((operation * 97) % (LEDGER_ROWS - 100));
            await client.query(
              `SELECT id, entity_id, created_at FROM audit_event
               WHERE workspace_id=$1 AND (created_at, id) >= ($2, $3)
               ORDER BY created_at ASC, id ASC LIMIT 100`,
              [WORKSPACE_A,
                new Date(Date.UTC(2026, 7, 4, 0, 0, 0, cursor)),
                `tip023h-ledger-${String(cursor).padStart(10, "0")}`],
            );
            reads += 1;
          }
          await client.query("COMMIT");
        } catch {
          errors += 1;
          await client.query("ROLLBACK").catch(() => undefined);
        }
        operations += 1;
        latency.add(performance.now() - operationStarted);
        await sleep(20);
      }
    }));
  } finally {
    stopSampling = true;
    await sampler;
    await Promise.all(clients.map((client) => client.end()));
  }
  const endedAt = new Date();
  const actualDurationSeconds = (performance.now() - started) / 1_000;
  const cpu = process.cpuUsage(initialCpu);
  let maxIntervalGapSeconds = 0;
  for (let index = 1; index < intervals.length; index += 1) {
    maxIntervalGapSeconds = Math.max(
      maxIntervalGapSeconds,
      intervals[index].elapsedSeconds - intervals[index - 1].elapsedSeconds,
    );
  }
  return { requestedDurationSeconds: seconds, actualDurationSeconds: Number(actualDurationSeconds.toFixed(3)),
    startedAt: soakStartedAt.toISOString(), endedAt: endedAt.toISOString(), operations, reads, writes, errors,
    observedOperationsPerSecond: Number((operations / actualDurationSeconds).toFixed(2)), latencyMs: latency.summary(),
    harnessCpuTimeMicros: cpu.user + cpu.system, peakHarnessRssBytes: Math.max(...intervals.map((item) => item.harnessRssBytes), process.memoryUsage().rss),
    continuity: {
      maxIntervalGapSeconds,
      expectedMinimumSamples: Math.floor((seconds / 10) * 0.9),
      retainedSamples: intervals.length,
    },
    intervals };
}

async function recovery(admin, owner) {
  const backupDirectory = path.join(temporaryRoot, "backup");
  const storageDirectory = path.join(temporaryRoot, "storage");
  mkdirSync(storageDirectory, { recursive: true });
  const backupStartedAt = new Date();
  execFileSync("node", ["scripts/db/backup-local.mjs", `--output=${backupDirectory}`], {
    env: { ...process.env, DATABASE_MIGRATION_URL: ownerUrl, STORAGE_LOCAL_ROOT: storageDirectory },
    stdio: "pipe",
  });
  const manifest = JSON.parse(readFileSync(path.join(backupDirectory, "manifest.json"), "utf8"));
  const dump = readFileSync(path.join(backupDirectory, manifest.database.file));
  assertInvariant(createHash("sha256").update(dump).digest("hex") === manifest.database.sha256,
    "Backup hash mismatch before restore");
  await recreateDatabase(admin, RESTORE_DB);
  execFileSync("node", ["scripts/db/restore-local.mjs", `--backup=${backupDirectory}`,
    `--database-url=${restoreOwnerUrl}`, `--confirm-target=${RESTORE_DB}`], { stdio: "pipe" });
  execFileSync("node", ["scripts/db/apply-app-role.mjs"], {
    env: { ...process.env, DATABASE_URL: restoreOwnerUrl, DATABASE_MIGRATION_URL: restoreOwnerUrl }, stdio: "pipe",
  });
  const restored = new pg.Client({ connectionString: restoreOwnerUrl });
  await restored.connect();
  try {
    const sourceCounts = await owner.query(
      "SELECT (SELECT count(*)::int FROM audit_event WHERE workspace_id=$1) ledger, (SELECT count(*)::int FROM mission WHERE workspace_id=$1) missions",
      [WORKSPACE_A],
    );
    const restoreCounts = await restored.query(
      "SELECT (SELECT count(*)::int FROM audit_event WHERE workspace_id=$1) ledger, (SELECT count(*)::int FROM mission WHERE workspace_id=$1) missions",
      [WORKSPACE_A],
    );
    assertInvariant(JSON.stringify(sourceCounts.rows[0]) === JSON.stringify(restoreCounts.rows[0]),
      "Restored authoritative counts differ from source");
    execFileSync("npx", ["vitest", "run", "--project", "scale"], {
      env: { ...process.env, DATABASE_URL: restoreRuntimeUrl, DATABASE_MIGRATION_URL: restoreOwnerUrl,
        TIP023H_ORGANIZATION_ID: ORG_A, TIP023H_WORKSPACE_ID: WORKSPACE_A,
        TIP023H_ACTOR_USER_ID: USER_A, TIP023H_BACKUP_STARTED_AT: backupStartedAt.toISOString() },
      stdio: "pipe",
    });
    const projection = await restored.query(
      `SELECT status, counts, source_watermark_at, last_job_id
       FROM workspace_operational_projection WHERE organization_id=$1 AND workspace_id=$2`,
      [ORG_A, WORKSPACE_A],
    );
    return { backupSizeBytes: manifest.database.sizeBytes, backupSha256: manifest.database.sha256,
      sourceCounts: sourceCounts.rows[0], restoredCounts: restoreCounts.rows[0], projection: projection.rows[0] };
  } finally {
    await restored.end();
  }
}

const admin = new pg.Client({ connectionString: adminUrl });
await admin.connect();
let owner;
try {
  await recreateDatabase(admin, SCALE_DB);
  await recreateDatabase(admin, RESTORE_DB);
  applyMigrations(ownerUrl);
  owner = new pg.Client({ connectionString: ownerUrl });
  await owner.connect();

  try {
    observations.fixture = await seedFixture(owner);
    assertInvariant(observations.fixture.ledger_rows === LEDGER_ROWS, "Ledger fixture count mismatch");
    assertInvariant(observations.fixture.mission_rows === MISSION_ROWS, "Mission fixture count mismatch");
    gates["SCALE-01"] = "PASS";
  } catch (error) { recordFailure("SCALE-01", error); throw error; }

  try {
    observations.contention = await contention(runtimeUrl);
    assertInvariant(observations.contention.retained === 1, "Idempotent contention retained more than one command");
    assertInvariant(observations.contention.rejected === 0, "Contention transaction failed");
    gates["CONC-01"] = "PASS";
  } catch (error) { recordFailure("CONC-01", error); throw error; }

  try {
    observations.tenantIsolation = await tenantIsolation(runtimeUrl);
    assertInvariant(observations.tenantIsolation.foreignRowsObserved === 0, "Forced RLS disclosed foreign rows");
    assertInvariant(observations.tenantIsolation.tenantBProbeWrites > 0, "Tenant B probe did not retain own writes");
    gates["TEN-01"] = "PASS";
  } catch (error) { recordFailure("TEN-01", error); throw error; }

  try {
    observations.workers = await multiProcessWorkers(owner, runtimeUrl);
    assertInvariant(observations.workers.succeeded === JOB_ROWS, "Not every job succeeded");
    assertInvariant(observations.workers.non_terminal === 0, "Non-terminal jobs remain");
    assertInvariant(observations.workers.invalid_attempts === 0, "A job executed more or less than once");
    assertInvariant(observations.workers.success_events === JOB_ROWS, "Terminal event count mismatch");
    assertInvariant(observations.workers.duplicate_terminal_events === 0, "Duplicate terminal job events detected");
    gates["WORK-01"] = "PASS";
  } catch (error) { recordFailure("WORK-01", error); throw error; }

  try {
    observations.soak = await soak(owner, runtimeUrl, durationSeconds);
    assertInvariant(observations.soak.errors === 0, "Soak recorded operation errors");
    assertInvariant(!certificationProfile || observations.soak.actualDurationSeconds >= 3_600,
      "Certification soak duration was shorter than 3,600 seconds");
    assertInvariant(!certificationProfile || observations.soak.continuity.maxIntervalGapSeconds <= 30,
      "Certification soak contains an interval gap longer than 30 seconds");
    assertInvariant(!certificationProfile ||
      observations.soak.continuity.retainedSamples >= observations.soak.continuity.expectedMinimumSamples,
      "Certification soak retained too few interval samples for continuous evidence");
    gates["SOAK-01"] = certificationProfile ? "PASS" : "SMOKE_ONLY";
  } catch (error) { recordFailure("SOAK-01", error); throw error; }

  try {
    observations.recovery = await recovery(admin, owner);
    assertInvariant(observations.recovery.projection.status === "READY", "Projection is not READY after rebuild");
    assertInvariant(Number(observations.recovery.projection.counts.missions) === MISSION_ROWS,
      "Projection mission count mismatch after rebuild");
    gates["REC-01"] = "PASS";
  } catch (error) { recordFailure("REC-01", error); throw error; }
} catch (error) {
  if (!failures.length) recordFailure("HARNESS", error);
} finally {
  if (owner) await owner.end().catch(() => undefined);
  const report = {
    schema: "hive-os.enterprise-scale-certification.v1",
    classification: certificationProfile ? "LOCAL_CERTIFICATION_NON_SLO" : "LOCAL_SMOKE_NON_CERTIFYING",
    startedAt: startedAt.toISOString(), completedAt: new Date().toISOString(),
    environment: { node: process.version, platform: process.platform, arch: process.arch,
      powerGuard: powerGuard ? "caffeinate:-dimsu" : "UNAVAILABLE_OR_NOT_REQUIRED",
      cpuCount: (await import("node:os")).cpus().length, totalMemoryBytes: (await import("node:os")).totalmem() },
    parameters: { ledgerRows: LEDGER_ROWS, missionRows: MISSION_ROWS, contention: CONTENTION,
      jobs: JOB_ROWS, workerProcesses: WORKERS, requestedSoakSeconds: durationSeconds },
    gates, observations, failures,
    overallStatus: failures.length ? "FAIL" : certificationProfile ? "PASS" : "SMOKE_PASS",
  };
  if (!failures.length) validateTip023hReport(report, { requireCertification: certificationProfile });
  mkdirSync(path.dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  if (!boolArgument("keep-databases") && !failures.length) {
    await dropDatabase(admin, SCALE_DB).catch(() => undefined);
    await dropDatabase(admin, RESTORE_DB).catch(() => undefined);
  }
  await admin.end();
  powerGuard?.kill("SIGTERM");
  rmSync(temporaryRoot, { recursive: true, force: true });
  process.stdout.write(`TIP-023H report: ${reportPath}\nTIP-023H status: ${report.overallStatus}\n`);
  if (failures.length) process.exitCode = 1;
}
