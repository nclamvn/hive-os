import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const CONFIRM = "TIP-024Q-R1-MANAGED-RECOVERY";
const TARGET_DATABASE = "hiveos_recovery_tip024q_r1";

function argument(name) {
  return process.argv
    .find((value) => value.startsWith(`--${name}=`))
    ?.slice(name.length + 3);
}

if (argument("confirm-run") !== CONFIRM) {
  throw new Error(`managed-recovery: pass --confirm-run=${CONFIRM}`);
}

const sourceUrl = process.env.DATABASE_MIGRATION_URL;
if (!sourceUrl) {
  throw new Error("managed-recovery: DATABASE_MIGRATION_URL is required");
}
const source = new URL(sourceUrl);
const sourceDatabase = source.pathname.slice(1);
if (!sourceDatabase || sourceDatabase === TARGET_DATABASE) {
  throw new Error("managed-recovery: source database boundary is invalid");
}
const target = new URL(sourceUrl);
target.pathname = `/${TARGET_DATABASE}`;
target.search = "";

function run(binary, args, options = {}) {
  const output = execFileSync(binary, args, {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    ...options,
  });
  return typeof output === "string" ? output.trim() : "";
}

function inventory(databaseUrl) {
  const sql = `
    SELECT json_build_object(
      'organizations', (SELECT count(*) FROM organization),
      'workspaces', (SELECT count(*) FROM workspace),
      'missions', (SELECT count(*) FROM mission),
      'auditEvents', (SELECT count(*) FROM audit_event),
      'projections', (SELECT count(*) FROM workspace_operational_projection),
      'migrations', (SELECT count(*) FROM _prisma_migrations WHERE finished_at IS NOT NULL)
    )::text;
  `;
  return JSON.parse(
    run("psql", [databaseUrl, "--no-align", "--tuples-only", "--command", sql]),
  );
}

const workingDirectory = mkdtempSync(
  path.join(os.tmpdir(), "hiveos-managed-recovery-"),
);
const dumpPath = path.join(workingDirectory, "database.dump");
let targetCreated = false;

try {
  const before = inventory(sourceUrl);
  run("pg_dump", ["--format=custom", "--file", dumpPath, sourceUrl]);
  const dump = {
    sizeBytes: statSync(dumpPath).size,
    sha256: createHash("sha256").update(readFileSync(dumpPath)).digest("hex"),
  };

  run("dropdb", [
    "--if-exists",
    `--maintenance-db=${sourceUrl}`,
    TARGET_DATABASE,
  ]);
  run("createdb", [`--maintenance-db=${sourceUrl}`, TARGET_DATABASE]);
  targetCreated = true;
  run("pg_restore", [
    "--exit-on-error",
    "--no-owner",
    "--no-privileges",
    `--dbname=${target.toString()}`,
    dumpPath,
  ]);
  const restored = inventory(target.toString());
  if (JSON.stringify(before) !== JSON.stringify(restored)) {
    throw new Error(
      "managed-recovery: restored authoritative inventory differs",
    );
  }

  const identifiers = JSON.parse(
    run("psql", [
      target.toString(),
      "--no-align",
      "--tuples-only",
      "--command",
      `SELECT json_build_object(
        'organizationId', organization_id,
        'workspaceId', id,
        'actorUserId', created_by_id,
        'missionCount', (SELECT count(*) FROM mission WHERE workspace_id = workspace.id)
      )::text FROM workspace ORDER BY created_at, id LIMIT 1;`,
    ]),
  );
  run(
    "npx",
    [
      "vitest",
      "run",
      "--project",
      "scale",
      "tests/scale/managed-staging-recovery.test.ts",
    ],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: target.toString(),
        DATABASE_MIGRATION_URL: target.toString(),
        TIP024Q_ORGANIZATION_ID: identifiers.organizationId,
        TIP024Q_WORKSPACE_ID: identifiers.workspaceId,
        TIP024Q_ACTOR_USER_ID: identifiers.actorUserId,
        TIP024Q_EXPECTED_MISSION_COUNT: String(identifiers.missionCount),
      },
    },
  );

  process.stdout.write(
    `${JSON.stringify({
      type: "MANAGED_RECOVERY_PASS",
      sourceDatabase,
      targetDatabase: TARGET_DATABASE,
      dump,
      before,
      restored,
      projectionRebuild: "PASS",
    })}\n`,
  );
} finally {
  if (targetCreated) {
    run("dropdb", [
      "--if-exists",
      `--maintenance-db=${sourceUrl}`,
      TARGET_DATABASE,
    ]);
  }
  rmSync(workingDirectory, { recursive: true, force: true });
}
