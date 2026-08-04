import { createHash } from "node:crypto";

import { Prisma } from "@prisma/client";

import {
  organizationIdForWorkspace,
  requireWorkspaceAuthorization,
} from "@/modules/authorization";
import {
  completeJob,
  executeDurableCommand,
  failJob,
  heartbeatJob,
} from "@/modules/command-runtime";
import { canonicalJson, sha256 } from "@/modules/execution-fabric";
import {
  AuditEventType,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import { getObjectStorage } from "@/server/storage";
import {
  type TenantTransaction,
  withOrganizationTenant,
} from "@/server/tenant-context";

import { DossierExportError } from "./errors";

export const DOSSIER_PART_MAX_BYTES = 1_048_576;
export const DOSSIER_QUERY_MAX_ROWS = 100;
export const DOSSIER_MANIFEST_MAX_PARTS = 100_000;

type Section = {
  name: string;
  from: string;
  scope: string;
  row: string;
};

const direct = (table: string, row = "to_jsonb(t)"): Section => ({
  name: table,
  from: `"${table}" t`,
  scope: "t.workspace_id = $1 AND t.mission_id = $2",
  row,
});
const contract = (table: string, row = "to_jsonb(t)"): Section => ({
  name: table,
  from: `"${table}" t JOIN mission_contract c ON c.id = t.contract_id`,
  scope: "c.workspace_id = $1 AND c.mission_id = $2",
  row,
});

const AUDIT_DIRECT_ENTITY_TABLES = [
  "mission",
  "mission_contract",
  "runtime_obligation",
  "runtime_gate",
  "gate_run",
  "decision",
  "escalation",
  "evidence_source",
  "snapshot",
  "evidence_span",
  "claim",
  "claim_version",
  "dispute",
  "honest_null_record",
  "provenance_edge",
  "execution_tip",
  "execution_tip_dependency",
  "execution_artifact",
  "skill_run",
  "agent_run",
  "completion_report",
  "execution_deviation",
  "resource_usage_record",
  "verification_scenario",
  "verification_run",
  "verification_requirement_coverage",
  "verification_scenario_result",
  "verification_technical_health",
  "corruption_test_run",
  "verification_report",
  "governance_signoff",
  "evidence_ceiling_assessment",
  "governed_release",
  "release_manifest",
  "workflow_assignment",
  "workflow_approval_request",
] as const;
const AUDIT_CONTRACT_ENTITY_TABLES = [
  "requirement",
  "assumption",
  "constraint",
  "mission_input",
  "contract_obligation",
  "contract_gate",
] as const;
const auditEntityIds = [
  ...AUDIT_DIRECT_ENTITY_TABLES.map(
    (table) =>
      `SELECT e.id FROM "${table}" e WHERE e.workspace_id = $1 AND ${table === "mission" ? "e.id" : "e.mission_id"} = $2`,
  ),
  ...AUDIT_CONTRACT_ENTITY_TABLES.map(
    (table) =>
      `SELECT e.id FROM "${table}" e JOIN mission_contract ec ON ec.id = e.contract_id WHERE ec.workspace_id = $1 AND ec.mission_id = $2`,
  ),
  "SELECT e.id FROM claim_evidence e JOIN claim_version cv ON cv.id = e.claim_version_id WHERE cv.workspace_id = $1 AND cv.mission_id = $2",
  "SELECT e.id FROM workflow_approval_action e JOIN workflow_approval_request wr ON wr.id = e.request_id WHERE wr.workspace_id = $1 AND wr.mission_id = $2",
].join(" UNION ALL ");

const SECTIONS: readonly Section[] = [
  {
    name: "mission",
    from: '"mission" t',
    scope: "t.workspace_id = $1 AND t.id = $2",
    row: "to_jsonb(t) - 'idempotency_key'",
  },
  direct("mission_contract"),
  contract("requirement"),
  contract("assumption"),
  contract("constraint"),
  contract("mission_input", "to_jsonb(t) - 'storage_reference'"),
  contract("contract_obligation"),
  contract("contract_gate"),
  direct("runtime_obligation"),
  direct("runtime_gate"),
  direct("gate_run"),
  direct("decision"),
  direct("escalation"),
  direct("evidence_source"),
  direct("snapshot", "to_jsonb(t) - 'storage_reference'"),
  direct("evidence_span"),
  direct("claim"),
  direct("claim_version"),
  {
    name: "claim_evidence",
    from: '"claim_evidence" t JOIN claim_version v ON v.id = t.claim_version_id',
    scope: "v.workspace_id = $1 AND v.mission_id = $2",
    row: "to_jsonb(t)",
  },
  direct("dispute"),
  direct("honest_null_record"),
  direct("provenance_edge"),
  direct("execution_tip"),
  direct("execution_tip_dependency"),
  direct("execution_artifact", "to_jsonb(t) - 'content'"),
  direct("skill_run"),
  direct("agent_run"),
  direct("completion_report"),
  direct("execution_deviation"),
  direct("resource_usage_record"),
  direct("verification_scenario"),
  direct("verification_run"),
  direct("verification_requirement_coverage"),
  direct("verification_scenario_result"),
  direct("verification_technical_health"),
  direct("corruption_test_run"),
  direct("verification_report"),
  direct("governance_signoff"),
  direct("evidence_ceiling_assessment"),
  direct("governed_release"),
  direct("release_manifest"),
  direct("workflow_assignment"),
  direct("workflow_approval_request"),
  {
    name: "workflow_approval_action",
    from: '"workflow_approval_action" t JOIN workflow_approval_request r ON r.id = t.request_id',
    scope: "r.workspace_id = $1 AND r.mission_id = $2",
    row: "to_jsonb(t)",
  },
  {
    name: "audit_event",
    from: '"audit_event" t',
    scope: `t.workspace_id = $1 AND t.entity_id IN (${auditEntityIds})`,
    row: "to_jsonb(t)",
  },
];

type CursorState = { lastId: string; activeId?: string; offset?: number };
type ExportRow = { id: string; data: Prisma.JsonValue; byte_size: number };

function parseCursor(value: string | null): CursorState {
  if (!value) return { lastId: "" };
  try {
    const parsed = JSON.parse(value) as CursorState;
    if (
      typeof parsed.lastId !== "string" ||
      (parsed.activeId !== undefined && typeof parsed.activeId !== "string") ||
      (parsed.offset !== undefined &&
        (!Number.isInteger(parsed.offset) || parsed.offset < 0))
    ) {
      throw new Error("shape");
    }
    return parsed;
  } catch {
    throw new DossierExportError("EXPORT_FAILED", "Retained export cursor is invalid");
  }
}

function exportObjectPrefix(workspaceId: string, exportId: string) {
  return `workspaces/${workspaceId}/exports/${exportId}`;
}

function partKey(workspaceId: string, exportId: string, sequence: number) {
  return `${exportObjectPrefix(workspaceId, exportId)}/parts/${String(sequence).padStart(10, "0")}.jsonl.part`;
}

async function fetchRows(
  tx: TenantTransaction,
  section: Section,
  workspaceId: string,
  missionId: string,
  cursor: CursorState,
) {
  if (cursor.activeId) {
    return tx.$queryRawUnsafe<ExportRow[]>(
      `SELECT t.id, ${section.row} AS data,
        octet_length((${section.row})::text) + 1 AS byte_size
       FROM ${section.from}
       WHERE ${section.scope} AND t.id = $3
       LIMIT 1`,
      workspaceId,
      missionId,
      cursor.activeId,
    );
  }
  return tx.$queryRawUnsafe<ExportRow[]>(
    `WITH candidates AS (
       SELECT t.id, ${section.row} AS data,
         octet_length((${section.row})::text) + 1 AS byte_size
       FROM ${section.from}
       WHERE ${section.scope} AND t.id > $3
       ORDER BY t.id ASC
       LIMIT $4
     ), measured AS (
       SELECT *,
         sum(byte_size) OVER (ORDER BY id ASC) AS cumulative_bytes,
         row_number() OVER (ORDER BY id ASC) AS ordinal
       FROM candidates
     )
     SELECT id, data, byte_size
     FROM measured
     WHERE cumulative_bytes <= $5 OR ordinal = 1
     ORDER BY id ASC`,
    workspaceId,
    missionId,
    cursor.lastId,
    DOSSIER_QUERY_MAX_ROWS,
    DOSSIER_PART_MAX_BYTES,
  );
}

function encodeRow(section: string, row: ExportRow) {
  return Buffer.from(`${canonicalJson({ section, record: row.data })}\n`, "utf8");
}

async function writeNextPart(input: {
  organizationId: string;
  actorUserId: string;
  exportId: string;
}) {
  const storage = getObjectStorage();
  const snapshot = await withOrganizationTenant(
    input.organizationId,
    input.actorUserId,
    async (tx) => {
      await tx.$queryRaw`
        SELECT id FROM dossier_export
        WHERE organization_id = ${input.organizationId} AND id = ${input.exportId}
        FOR UPDATE
      `;
      const record = await tx.dossierExport.findFirst({
        where: {
          id: input.exportId,
          organizationId: input.organizationId,
          status: { in: ["READY", "RUNNING"] },
        },
      });
      if (!record) {
        throw new DossierExportError("INVALID_TRANSITION", "Export is not runnable");
      }
      const mission = await tx.mission.findFirst({
        where: { id: record.missionId, workspaceId: record.workspaceId },
        select: { version: true },
      });
      const source = await tx.missionSourceRevision.findFirst({
        where: {
          organizationId: record.organizationId,
          workspaceId: record.workspaceId,
          missionId: record.missionId,
        },
        select: { revision: true },
      });
      if (
        !mission ||
        !source ||
        mission.version !== record.missionVersion ||
        source.revision !== record.sourceRevision
      ) {
        throw new DossierExportError(
          "SOURCE_CHANGED",
          "Mission dossier sources changed after the export boundary was captured",
        );
      }
      return record;
    },
  );

  if (snapshot.nextSection >= SECTIONS.length) return { complete: true as const };
  const section = SECTIONS[snapshot.nextSection]!;
  const cursor = parseCursor(snapshot.nextCursor);
  const rows = await withOrganizationTenant(
    input.organizationId,
    input.actorUserId,
    (tx) => fetchRows(tx, section, snapshot.workspaceId, snapshot.missionId, cursor),
  );
  if (!rows.length) {
    await withOrganizationTenant(input.organizationId, input.actorUserId, (tx) =>
      tx.dossierExport.updateMany({
        where: { id: snapshot.id, version: snapshot.version, status: { in: ["READY", "RUNNING"] } },
        data: {
          status: "RUNNING",
          startedAt: snapshot.startedAt ?? new Date(),
          nextSection: { increment: 1 },
          nextCursor: null,
          version: { increment: 1 },
        },
      }),
    );
    return { complete: false as const };
  }

  const buffers: Buffer[] = [];
  let remaining = DOSSIER_PART_MAX_BYTES;
  let next = { ...cursor };
  let completedRows = 0;
  let firstRowId: string | null = null;
  let lastRowId: string | null = null;
  for (const row of rows) {
    const encoded = encodeRow(section.name, row);
    const offset = next.activeId === row.id ? next.offset ?? 0 : 0;
    const slice = encoded.subarray(offset, offset + remaining);
    if (!slice.byteLength) break;
    firstRowId ??= row.id;
    lastRowId = row.id;
    buffers.push(slice);
    remaining -= slice.byteLength;
    if (offset + slice.byteLength < encoded.byteLength) {
      next = { lastId: cursor.lastId, activeId: row.id, offset: offset + slice.byteLength };
      break;
    }
    next = { lastId: row.id };
    completedRows += 1;
    if (remaining === 0) break;
  }
  const body = Buffer.concat(buffers);
  if (!body.byteLength || body.byteLength > DOSSIER_PART_MAX_BYTES) {
    throw new DossierExportError("EXPORT_FAILED", "Export part byte ceiling violated");
  }
  const sequence = snapshot.partCount;
  const storageKey = partKey(snapshot.workspaceId, snapshot.id, sequence);
  const contentHash = createHash("sha256").update(body).digest("hex");
  await storage.put(storageKey, body, { contentType: "application/x-ndjson" });

  const committed = await withOrganizationTenant(
    input.organizationId,
    input.actorUserId,
    async (tx) => {
      const existing = await tx.dossierExportPart.findUnique({
        where: { exportId_sequence: { exportId: snapshot.id, sequence } },
      });
      if (existing) return existing.contentHash === contentHash;
      const updated = await tx.dossierExport.updateMany({
        where: { id: snapshot.id, version: snapshot.version, partCount: sequence },
        data: {
          status: "RUNNING",
          startedAt: snapshot.startedAt ?? new Date(),
          nextCursor: JSON.stringify(next),
          partCount: { increment: 1 },
          rowCount: { increment: completedRows },
          totalBytes: { increment: BigInt(body.byteLength) },
          version: { increment: 1 },
        },
      });
      if (updated.count !== 1) return false;
      await tx.dossierExportPart.create({
        data: {
          organizationId: input.organizationId,
          workspaceId: snapshot.workspaceId,
          exportId: snapshot.id,
          sequence,
          section: section.name,
          firstRowId,
          lastRowId,
          rowCount: completedRows,
          storageKey,
          contentHash,
          sizeBytes: body.byteLength,
        },
      });
      return true;
    },
  );
  if (!committed) {
    await storage.delete(storageKey);
    throw new DossierExportError("JOB_CONFLICT", "Export cursor changed concurrently");
  }
  return { complete: false as const };
}

async function publishManifest(input: {
  organizationId: string;
  actorUserId: string;
  exportId: string;
  correlationId: string;
}) {
  const storage = getObjectStorage();
  const record = await withOrganizationTenant(
    input.organizationId,
    input.actorUserId,
    (tx) =>
      tx.dossierExport.findFirstOrThrow({
        where: { id: input.exportId, organizationId: input.organizationId, status: "RUNNING" },
        include: {
          parts: {
            orderBy: { sequence: "asc" },
            take: DOSSIER_MANIFEST_MAX_PARTS + 1,
          },
        },
      }),
  );
  if (
    record.partCount > DOSSIER_MANIFEST_MAX_PARTS ||
    record.parts.length !== record.partCount
  ) {
    throw new DossierExportError(
      "EXPORT_FAILED",
      "Export manifest part ceiling or completeness check failed",
    );
  }
  const parts = record.parts.map((part) => ({
    sequence: part.sequence,
    section: part.section,
    key: part.storageKey,
    sha256: part.contentHash,
    sizeBytes: part.sizeBytes,
    rowCount: part.rowCount,
  }));
  const manifest = {
    schema: "hive-os.mission-dossier-manifest.v2",
    exportId: record.id,
    workspaceId: record.workspaceId,
    missionId: record.missionId,
    missionVersion: record.missionVersion,
    sourceRevision: record.sourceRevision.toString(),
    snapshotAt: record.snapshotAt.toISOString(),
    format: "canonical-jsonl-byte-stream",
    partCount: record.partCount,
    rowCount: record.rowCount,
    totalBytes: record.totalBytes.toString(),
    bundleHash: sha256(canonicalJson(parts.map((part) => part.sha256))),
    parts,
  };
  const body = Buffer.from(`${canonicalJson(manifest)}\n`, "utf8");
  const manifestHash = sha256(body.toString("utf8"));
  const manifestStorageKey = `${exportObjectPrefix(record.workspaceId, record.id)}/manifest.json`;
  await storage.put(manifestStorageKey, body, { contentType: "application/json" });
  const completed = await withOrganizationTenant(
    input.organizationId,
    input.actorUserId,
    async (tx) => {
      const updated = await tx.dossierExport.updateMany({
        where: {
          id: record.id,
          version: record.version,
          status: "RUNNING",
          nextSection: { gte: SECTIONS.length },
          manifestStorageKey: null,
        },
        data: {
          status: "SUCCEEDED",
          manifestStorageKey,
          manifestHash,
          failureCode: null,
          failureMessage: null,
          completedAt: new Date(),
          version: { increment: 1 },
        },
      });
      if (updated.count !== 1) return false;
      await writeAuditEvent(tx, {
        workspaceId: record.workspaceId,
        actorUserId: input.actorUserId,
        actorMembershipId: null,
        eventType: AuditEventType.DossierExportCompleted,
        entityType: "DossierExport",
        entityId: record.id,
        correlationId: input.correlationId,
        payload: { exportId: record.id, partCount: record.partCount, rowCount: record.rowCount },
      });
      return true;
    },
  );
  if (!completed) {
    await storage.delete(manifestStorageKey);
    throw new DossierExportError("JOB_CONFLICT", "Export changed before manifest publication");
  }
  return { manifestStorageKey, manifestHash, manifest };
}

export async function requestMissionDossierExport(
  ctx: WorkspaceContext,
  input: { missionId: string; idempotencyKey: string },
) {
  await requireWorkspaceAuthorization(ctx, "exports.request", input.missionId);
  return executeDurableCommand(
    ctx,
    {
      idempotencyKey: input.idempotencyKey,
      commandType: "export.mission.dossier.request",
      payload: { missionId: input.missionId },
      requiredCapability: "exports.request",
      missionId: input.missionId,
    },
    async (tx, command) => {
      const mission = await tx.mission.findFirst({
        where: { id: input.missionId, workspaceId: ctx.workspace.id },
        select: { id: true, version: true },
      });
      if (!mission) throw new DossierExportError("NOT_FOUND", "Mission not found");
      const source = await tx.missionSourceRevision.findFirst({
        where: {
          organizationId: command.organizationId,
          workspaceId: ctx.workspace.id,
          missionId: mission.id,
        },
        select: { revision: true },
      });
      if (!source) {
        throw new DossierExportError(
          "EXPORT_FAILED",
          "Mission source revision boundary is unavailable",
        );
      }
      const exportRecord = await tx.dossierExport.create({
        data: {
          organizationId: command.organizationId,
          workspaceId: ctx.workspace.id,
          missionId: mission.id,
          requestedByOrganizationMembershipId: command.actorOrganizationMembershipId,
          commandId: command.commandId,
          snapshotAt: command.issuedAt,
          missionVersion: mission.version,
          sourceRevision: source.revision,
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.DossierExportRequested,
        entityType: "DossierExport",
        entityId: exportRecord.id,
        correlationId: command.correlationId,
        payload: { exportId: exportRecord.id, missionId: mission.id },
      });
      return {
        outcome: { exportId: exportRecord.id, status: exportRecord.status },
        outbox: [
          {
            topic: "export.mission.dossier",
            aggregateType: "DossierExport",
            aggregateId: exportRecord.id,
            payload: { exportId: exportRecord.id, missionId: mission.id },
          },
        ],
      };
    },
  );
}

export async function getMissionDossierExport(
  ctx: WorkspaceContext,
  exportId: string,
) {
  await requireWorkspaceAuthorization(ctx, "exports.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const record = await withOrganizationTenant(organizationId, ctx.user.id, (tx) =>
    tx.dossierExport.findFirst({
      where: { id: exportId, organizationId, workspaceId: ctx.workspace.id },
      include: { parts: { orderBy: { sequence: "asc" }, take: 1 } },
    }),
  );
  if (!record) throw new DossierExportError("NOT_FOUND", "Export not found");
  return {
    ...record,
    totalBytes: record.totalBytes.toString(),
    manifestAvailable: record.status === "SUCCEEDED" && Boolean(record.manifestStorageKey),
  };
}

export async function readMissionDossierManifest(
  ctx: WorkspaceContext,
  exportId: string,
) {
  const record = await getMissionDossierExport(ctx, exportId);
  if (!record.manifestAvailable || !record.manifestStorageKey) {
    throw new DossierExportError("INVALID_TRANSITION", "Export manifest is not available");
  }
  const body = await getObjectStorage().get(record.manifestStorageKey);
  if (!body || sha256(Buffer.from(body).toString("utf8")) !== record.manifestHash) {
    throw new DossierExportError("EXPORT_FAILED", "Export manifest integrity check failed");
  }
  return body;
}

export async function getLatestMissionDossierExport(
  ctx: WorkspaceContext,
  missionId: string,
) {
  await requireWorkspaceAuthorization(ctx, "exports.read", missionId);
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const record = await withOrganizationTenant(organizationId, ctx.user.id, (tx) =>
    tx.dossierExport.findFirst({
      where: { organizationId, workspaceId: ctx.workspace.id, missionId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
  );
  if (!record) throw new DossierExportError("NOT_FOUND", "Export not found");
  return { ...record, totalBytes: record.totalBytes.toString() };
}

export async function readMissionDossierPart(
  ctx: WorkspaceContext,
  exportId: string,
  sequence: number,
) {
  if (!Number.isInteger(sequence) || sequence < 0) {
    throw new DossierExportError("INVALID_INPUT", "Part sequence is invalid");
  }
  await requireWorkspaceAuthorization(ctx, "exports.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const part = await withOrganizationTenant(organizationId, ctx.user.id, (tx) =>
    tx.dossierExportPart.findFirst({
      where: {
        organizationId,
        workspaceId: ctx.workspace.id,
        exportId,
        sequence,
        export: { status: "SUCCEEDED" },
      },
    }),
  );
  if (!part) throw new DossierExportError("NOT_FOUND", "Export part not found");
  const body = await getObjectStorage().get(part.storageKey);
  if (
    !body ||
    createHash("sha256").update(body).digest("hex") !== part.contentHash
  ) {
    throw new DossierExportError("EXPORT_FAILED", "Export part integrity check failed");
  }
  return { body, part };
}

export async function executeMissionDossierExportJob(input: {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  jobId: string;
  expectedVersion: number;
  correlationId: string;
}) {
  const job = await withOrganizationTenant(input.organizationId, input.actorUserId, (tx) =>
    tx.durableJob.findFirst({
      where: {
        id: input.jobId,
        organizationId: input.organizationId,
        status: "RUNNING",
        lockedBy: input.workerId,
        version: input.expectedVersion,
        leaseExpiresAt: { gt: new Date() },
        jobType: "export.mission.dossier",
      },
    }),
  );
  if (!job) throw new DossierExportError("JOB_CONFLICT", "Export job lease is invalid");
  const payload = job.payload as Record<string, unknown>;
  const exportId = typeof payload.exportId === "string" ? payload.exportId : null;
  if (!exportId) throw new DossierExportError("INVALID_INPUT", "Export job payload is invalid");
  await withOrganizationTenant(input.organizationId, input.actorUserId, (tx) =>
    tx.dossierExport.updateMany({
      where: { id: exportId, organizationId: input.organizationId, jobId: null },
      data: { jobId: job.id, status: "RUNNING", startedAt: new Date(), version: { increment: 1 } },
    }),
  );
  let jobVersion = job.version;
  try {
    for (;;) {
      const result = await writeNextPart({
        organizationId: input.organizationId,
        actorUserId: input.actorUserId,
        exportId,
      });
      if (result.complete) break;
      const heartbeat = await heartbeatJob({
        organizationId: input.organizationId,
        actorUserId: input.actorUserId,
        workerId: input.workerId,
        jobId: job.id,
        expectedVersion: jobVersion,
      });
      jobVersion = heartbeat.version;
    }
    const published = await publishManifest({
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      exportId,
      correlationId: input.correlationId,
    });
    return completeJob({
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      workerId: input.workerId,
      jobId: job.id,
      expectedVersion: jobVersion,
      result: {
        exportId,
        manifestHash: published.manifestHash,
        partCount: published.manifest.partCount,
      },
    });
  } catch (error) {
    const code = error instanceof DossierExportError ? error.code : "EXPORT_FAILED";
    const failedJob = await failJob({
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      workerId: input.workerId,
      jobId: job.id,
      expectedVersion: jobVersion,
      errorCode: code,
      errorMessage: "Dossier export did not complete",
      retryable: code !== "SOURCE_CHANGED",
    });
    await withOrganizationTenant(input.organizationId, input.actorUserId, (tx) =>
      tx.dossierExport.updateMany({
        where: { id: exportId, organizationId: input.organizationId, status: { in: ["READY", "RUNNING"] } },
        data: {
          status: failedJob.status === "DEAD_LETTER" ? "FAILED" : "RUNNING",
          failureCode: code,
          failureMessage: "Dossier export did not complete",
          version: { increment: 1 },
        },
      }),
    );
    throw error;
  }
}
