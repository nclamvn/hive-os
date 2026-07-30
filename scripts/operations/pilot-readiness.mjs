import { randomUUID } from "node:crypto";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: process.env.PILOT_ENV_FILE || ".env", quiet: true });

const checks = [];
const add = (id, required, pass, detail, status = pass ? "PASS" : "FAIL") => {
  checks.push({ id, required, status, detail });
};
const exists = async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

const deployment = process.env.DEPLOYMENT_ENV || "development";
const external = ["staging", "production"].includes(deployment);
const baseUrl =
  process.env.PILOT_BASE_URL ||
  `http://127.0.0.1:${process.env.PORT || "3000"}`;
const pilotWorkspaceSlug = process.env.PILOT_WORKSPACE_SLUG || "";
let activePilotMembershipIds = new Set();

const requiredFiles = [
  "docs/operations/LOCAL_PRODUCTION_REHEARSAL.md",
  "docs/operations/PILOT_DRY_RUN.md",
  "docs/operations/OWNER_DECISIONS_TIP-021C-B.md",
  "scripts/db/backup-local.mjs",
  "scripts/db/restore-local.mjs",
];
for (const file of requiredFiles) {
  add(`file:${file}`, true, await exists(file), "Required operator artifact.");
}

add(
  "config:database",
  true,
  /^(postgresql|postgres):\/\//.test(process.env.DATABASE_URL || ""),
  "DATABASE_URL is present and PostgreSQL-shaped; value is never emitted.",
);
add(
  "config:auth-secret",
  true,
  (process.env.BETTER_AUTH_SECRET || "").length >= 16,
  "BETTER_AUTH_SECRET satisfies the minimum runtime contract; value is never emitted.",
);
add(
  "config:throttle-secret",
  true,
  process.env.NODE_ENV === "test" ||
    (process.env.AUTH_THROTTLE_SECRET || "").length >= 16,
  "AUTH_THROTTLE_SECRET is required outside automated tests; value is never emitted.",
);
add(
  "config:storage-driver",
  true,
  ["local", "s3"].includes(process.env.STORAGE_DRIVER || "local"),
  "Configured storage driver is supported.",
);
add(
  "config:pilot-workspace",
  true,
  Boolean(pilotWorkspaceSlug),
  "PILOT_WORKSPACE_SLUG identifies the governed pilot workspace.",
);

if (process.env.DATABASE_URL) {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    connectionTimeoutMillis: 5_000,
  });
  try {
    await pool.query("SELECT 1");
    add(
      "database:connectivity",
      true,
      true,
      "Database responded to a bounded read-only readiness query.",
    );
    if (pilotWorkspaceSlug) {
      const result = await pool.query(
        `SELECT m.id, m.role
         FROM membership m
         JOIN workspace w ON w.id = m.workspace_id
         WHERE m.status = 'ACTIVE' AND w.slug = $1`,
        [pilotWorkspaceSlug],
      );
      activePilotMembershipIds = new Set(result.rows.map((row) => row.id));
      const activeOwners = result.rows.filter(
        (row) => row.role === "OWNER",
      ).length;
      add(
        "pilot-team:workspace-members",
        true,
        result.rows.length >= 3 && activeOwners >= 1,
        `${result.rows.length} active members and ${activeOwners} active owners observed in the selected pilot workspace; minimum is 3 members including an Owner.`,
      );
    } else {
      add(
        "pilot-team:workspace-members",
        true,
        false,
        "Pilot workspace membership cannot be checked until PILOT_WORKSPACE_SLUG is set.",
      );
    }
  } catch {
    add(
      "database:connectivity",
      true,
      false,
      "Database readiness query failed; no connection detail was emitted.",
    );
    add(
      "pilot-team:workspace-members",
      true,
      false,
      "Workspace membership state unavailable because the database check failed.",
    );
  } finally {
    await pool.end();
  }
} else {
  add("database:connectivity", true, false, "DATABASE_URL is unavailable.");
  add(
    "pilot-team:workspace-members",
    true,
    false,
    "Workspace membership state is unavailable.",
  );
}

const migrationUrl =
  process.env.DATABASE_MIGRATION_URL || process.env.DATABASE_URL;
if (migrationUrl) {
  const migrationPool = new pg.Pool({
    connectionString: migrationUrl,
    max: 1,
    connectionTimeoutMillis: 5_000,
  });
  try {
    const result = await migrationPool.query(
      `SELECT count(*)::int AS migrations
       FROM "_prisma_migrations"
       WHERE finished_at IS NOT NULL`,
    );
    const migrations = Number(result.rows[0]?.migrations);
    add(
      "database:migrations",
      true,
      migrations >= 13,
      `${migrations} completed migrations observed; expected at least 13.`,
    );
  } catch {
    add(
      "database:migrations",
      true,
      false,
      "Migration state query failed; no connection detail was emitted.",
    );
  } finally {
    await migrationPool.end();
  }
} else {
  add("database:migrations", true, false, "Migration state is unavailable.");
}

try {
  const response = await fetch(`${baseUrl}/api/health/ready`, {
    signal: AbortSignal.timeout(5_000),
  });
  add(
    "runtime:readiness",
    true,
    response.ok,
    response.ok
      ? "Runtime readiness endpoint returned success."
      : `Runtime readiness endpoint returned HTTP ${response.status}.`,
  );
} catch {
  add(
    "runtime:readiness",
    true,
    false,
    "Runtime readiness endpoint was unreachable.",
  );
}

const probe = new TextEncoder().encode(`hive-os-pilot-probe:${randomUUID()}`);
const storageDriver = process.env.STORAGE_DRIVER || "local";
if (storageDriver === "local") {
  const root = process.env.STORAGE_LOCAL_ROOT || ".storage";
  const probePath = path.join(root, "pilot-readiness", `${randomUUID()}.probe`);
  try {
    await mkdir(path.dirname(probePath), { recursive: true });
    await writeFile(probePath, probe);
    const retained = await readFile(probePath);
    add(
      "storage:roundtrip",
      true,
      Buffer.compare(retained, probe) === 0,
      "Local object storage write/read/delete probe completed.",
    );
  } catch {
    add(
      "storage:roundtrip",
      true,
      false,
      "Local object storage probe failed.",
    );
  } finally {
    await rm(probePath, { force: true });
  }
} else {
  const required = [
    "S3_REGION",
    "S3_BUCKET",
    "S3_ACCESS_KEY_ID",
    "S3_SECRET_ACCESS_KEY",
    "S3_SERVER_SIDE_ENCRYPTION",
  ];
  const configured = required.every((key) => Boolean(process.env[key]));
  if (!configured) {
    add(
      "storage:roundtrip",
      true,
      false,
      "S3 storage probe cannot run because required configuration is incomplete.",
    );
  } else {
    const client = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
    const key = `pilot-readiness/${randomUUID()}.probe`;
    try {
      await client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
          Body: probe,
          ServerSideEncryption: process.env.S3_SERVER_SIDE_ENCRYPTION,
          SSEKMSKeyId:
            process.env.S3_SERVER_SIDE_ENCRYPTION === "aws:kms"
              ? process.env.S3_KMS_KEY_ID
              : undefined,
        }),
      );
      const result = await client.send(
        new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }),
      );
      const retained = result.Body
        ? await result.Body.transformToByteArray()
        : new Uint8Array();
      add(
        "storage:roundtrip",
        true,
        Buffer.compare(retained, probe) === 0,
        "S3-compatible storage write/read/delete probe completed.",
      );
    } catch {
      add(
        "storage:roundtrip",
        true,
        false,
        "S3-compatible storage probe failed; credentials and endpoint were not emitted.",
      );
    } finally {
      try {
        await client.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
          }),
        );
      } catch {
        // The failed readiness result remains authoritative. Operators must
        // reconcile a probe object if the provider rejected deletion.
      }
    }
  }
}

const attestationPath = process.env.PILOT_TEAM_ATTESTATION;
let attestationPass = false;
if (attestationPath) {
  try {
    const attestation = JSON.parse(await readFile(attestationPath, "utf8"));
    const roles = attestation.roles || {};
    const attestedMembershipIds = [
      roles.owner,
      ...(Array.isArray(roles.engineers) ? roles.engineers : []),
      roles.verifier,
      roles.operations,
    ];
    attestationPass =
      attestation.workspaceSlug === pilotWorkspaceSlug &&
      typeof roles.owner === "string" &&
      Array.isArray(roles.engineers) &&
      roles.engineers.length >= 1 &&
      typeof roles.verifier === "string" &&
      typeof roles.operations === "string" &&
      !roles.engineers.includes(roles.verifier) &&
      new Set(attestedMembershipIds).size >= 3 &&
      attestedMembershipIds.every((id) => activePilotMembershipIds.has(id));
  } catch {
    attestationPass = false;
  }
}
add(
  "pilot-team:functional-attestation",
  true,
  attestationPass,
  attestationPass
    ? "Owner, engineering, independent verification and operations responsibilities are attested."
    : "Set PILOT_TEAM_ATTESTATION to a completed attestation based on the provided example.",
);

add(
  "external:provider-evidence",
  external,
  !external,
  external
    ? "External provider, region, managed secrets, DNS, SLO/RPO/RTO and remote-CI evidence remain unverified."
    : "Not applicable to this local controlled-environment check.",
  external ? "UNVERIFIED_EXTERNAL" : "NOT_APPLICABLE",
);

const failedRequired = checks.filter(
  (check) => check.required && check.status !== "PASS",
);
const report = {
  schema: "hive-os.pilot-readiness.v1",
  classification: external
    ? "EXTERNAL_ENVIRONMENT_UNVERIFIED"
    : "LOCAL_CONTROLLED_ENVIRONMENT",
  deploymentEnvironment: deployment,
  observedAt: new Date().toISOString(),
  ready: failedRequired.length === 0,
  checks,
  externalClaims: {
    remoteCi: "BLOCKED_EXTERNAL",
    productionRelease: "NOT_AUTHORIZED",
    publicRelease: "NOT_AUTHORIZED",
  },
};
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.ready ? 0 : 1;
