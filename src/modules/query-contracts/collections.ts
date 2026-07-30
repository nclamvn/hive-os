import type {
  AssuranceProfile,
  ClaimState,
  ExecutionTipStatus,
  MissionStatus,
  Prisma,
  SkillStatus,
} from "@prisma/client";

import {
  requireCapability,
  type WorkspaceContext,
} from "@/modules/identity-workspace";
import { requireExecutionCapability } from "@/modules/execution-fabric";
import { requireMissionCapability } from "@/modules/mission-kernel";
import { requireSkillCapability } from "@/modules/skill-runtime";
import { requireTruthCapability } from "@/modules/truth-kernel";
import { requireVerificationCapability } from "@/modules/verification-governance";
import { getDb } from "@/server/db";

import {
  decodeCursor,
  encodeCursor,
  normalizePageSize,
  QueryContractError,
  type PageRequest,
  toConnection,
} from "./primitives";

type CountOption = { includeTotalCount?: boolean };
type DateCursor = { at: Date; id: string };

function dateCursor(kind: string, after?: string): DateCursor | undefined {
  if (!after) return undefined;
  const cursor = decodeCursor(kind, after);
  const at = new Date(cursor.s[0] ?? "");
  if (cursor.s.length !== 1 || Number.isNaN(at.getTime())) {
    throw new QueryContractError("Cursor date is invalid", "INVALID_CURSOR");
  }
  return { at, id: cursor.i };
}

function descendingDateSeek(
  field: "createdAt" | "updatedAt" | "approvedAt",
  cursor?: DateCursor,
) {
  if (!cursor) return {};
  return {
    OR: [
      { [field]: { lt: cursor.at } },
      { [field]: cursor.at, id: { lt: cursor.id } },
    ],
  };
}

export type MissionSort = "UPDATED_DESC" | "CREATED_DESC";

export async function listMissionPage(
  ctx: WorkspaceContext,
  input: PageRequest &
    CountOption & {
      ids?: string[];
      statuses?: MissionStatus[];
      assuranceProfiles?: AssuranceProfile[];
      sort?: MissionSort;
    } = {},
) {
  requireMissionCapability(ctx, "missions.read");
  const first = normalizePageSize(input.first);
  const ids = [...new Set(input.ids ?? [])];
  if (ids.length > 100) {
    throw new QueryContractError(
      "Mission ID filter exceeds the bounded limit",
      "INVALID_QUERY",
    );
  }
  const sort = input.sort ?? "UPDATED_DESC";
  const field = sort === "UPDATED_DESC" ? "updatedAt" : "createdAt";
  const kind = `mission:${sort.toLowerCase()}`;
  const cursor = dateCursor(kind, input.after);
  const where: Prisma.MissionWhereInput = {
    workspaceId: ctx.workspace.id,
    ...(input.ids !== undefined ? { id: { in: ids } } : {}),
    ...(input.statuses?.length ? { status: { in: input.statuses } } : {}),
    ...(input.assuranceProfiles?.length
      ? { assuranceProfile: { in: input.assuranceProfiles } }
      : {}),
    ...descendingDateSeek(field, cursor),
  };
  const [rows, totalCount] = await Promise.all([
    getDb().mission.findMany({
      where,
      orderBy: [{ [field]: "desc" }, { id: "desc" }],
      take: first + 1,
    }),
    input.includeTotalCount
      ? getDb().mission.count({
          where: {
            workspaceId: ctx.workspace.id,
            ...(input.ids !== undefined ? { id: { in: ids } } : {}),
            ...(input.statuses?.length
              ? { status: { in: input.statuses } }
              : {}),
            ...(input.assuranceProfiles?.length
              ? { assuranceProfile: { in: input.assuranceProfiles } }
              : {}),
          },
        })
      : undefined,
  ]);
  return toConnection(
    rows,
    first,
    (row) => encodeCursor(kind, [row[field]], row.id),
    totalCount,
  );
}

export async function listSkillPage(
  ctx: WorkspaceContext,
  input: PageRequest &
    CountOption & {
      statuses?: SkillStatus[];
      requiredCapabilities?: string[];
      assuranceProfile?: AssuranceProfile;
    } = {},
) {
  requireSkillCapability(ctx, "skills.read");
  const first = normalizePageSize(input.first);
  const kind = "skill:updated_desc";
  const cursor = dateCursor(kind, input.after);
  const requiredCapabilities = [
    ...new Set(input.requiredCapabilities ?? []),
  ].sort();
  const where: Prisma.SkillWhereInput = {
    workspaceId: ctx.workspace.id,
    ...(input.statuses?.length ? { status: { in: input.statuses } } : {}),
    ...(requiredCapabilities.length || input.assuranceProfile
      ? {
          activeVersion: {
            ...(requiredCapabilities.length
              ? { capabilities: { hasEvery: requiredCapabilities } }
              : {}),
            ...(input.assuranceProfile
              ? {
                  assuranceCompatibility: {
                    has: input.assuranceProfile,
                  },
                }
              : {}),
          },
        }
      : {}),
    ...descendingDateSeek("updatedAt", cursor),
  };
  const [rows, totalCount] = await Promise.all([
    getDb().skill.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      take: first + 1,
      include: {
        activeVersion: true,
        _count: { select: { versions: true } },
      },
    }),
    input.includeTotalCount ? getDb().skill.count({ where }) : undefined,
  ]);
  return toConnection(
    rows,
    first,
    (row) => encodeCursor(kind, [row.updatedAt], row.id),
    totalCount,
  );
}

export async function listClaimPage(
  ctx: WorkspaceContext,
  input: PageRequest &
    CountOption & { missionId?: string; states?: ClaimState[] } = {},
) {
  requireTruthCapability(ctx, "truth.read");
  const first = normalizePageSize(input.first);
  const kind = "claim:updated_desc";
  const cursor = dateCursor(kind, input.after);
  const where: Prisma.ClaimWhereInput = {
    workspaceId: ctx.workspace.id,
    ...(input.missionId ? { missionId: input.missionId } : {}),
    ...(input.states?.length ? { state: { in: input.states } } : {}),
    ...descendingDateSeek("updatedAt", cursor),
  };
  const [rows, totalCount] = await Promise.all([
    getDb().claim.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      take: first + 1,
      include: {
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
        },
      },
    }),
    input.includeTotalCount ? getDb().claim.count({ where }) : undefined,
  ]);
  return toConnection(
    rows,
    first,
    (row) => encodeCursor(kind, [row.updatedAt], row.id),
    totalCount,
  );
}

export async function listExecutionTipPage(
  ctx: WorkspaceContext,
  input: PageRequest &
    CountOption & {
      missionId?: string;
      statuses?: ExecutionTipStatus[];
    } = {},
) {
  requireExecutionCapability(ctx, "execution.read");
  const first = normalizePageSize(input.first);
  const kind = "execution-tip:updated_desc";
  const cursor = dateCursor(kind, input.after);
  const where: Prisma.ExecutionTipWhereInput = {
    workspaceId: ctx.workspace.id,
    ...(input.missionId ? { missionId: input.missionId } : {}),
    ...(input.statuses?.length ? { status: { in: input.statuses } } : {}),
    ...descendingDateSeek("updatedAt", cursor),
  };
  const [rows, totalCount] = await Promise.all([
    getDb().executionTip.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      take: first + 1,
      include: {
        mission: { select: { referenceCode: true, title: true } },
      },
    }),
    input.includeTotalCount
      ? getDb().executionTip.count({ where })
      : undefined,
  ]);
  return toConnection(
    rows,
    first,
    (row) => encodeCursor(kind, [row.updatedAt], row.id),
    totalCount,
  );
}

export async function listVerificationReportPage(
  ctx: WorkspaceContext,
  input: PageRequest & CountOption & { missionId?: string } = {},
) {
  requireVerificationCapability(ctx, "verification.read");
  const first = normalizePageSize(input.first);
  const kind = "verification-report:created_desc";
  const cursor = dateCursor(kind, input.after);
  const where: Prisma.VerificationReportWhereInput = {
    workspaceId: ctx.workspace.id,
    ...(input.missionId ? { missionId: input.missionId } : {}),
    ...descendingDateSeek("createdAt", cursor),
  };
  const [rows, totalCount] = await Promise.all([
    getDb().verificationReport.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: first + 1,
      include: {
        mission: { select: { referenceCode: true, title: true, status: true } },
      },
    }),
    input.includeTotalCount
      ? getDb().verificationReport.count({ where })
      : undefined,
  ]);
  return toConnection(
    rows,
    first,
    (row) => encodeCursor(kind, [row.createdAt], row.id),
    totalCount,
  );
}

export async function listAuditEventPage(
  ctx: WorkspaceContext,
  input: PageRequest &
    CountOption & { eventTypes?: string[]; entityTypes?: string[] } = {},
) {
  requireCapability(ctx, "audit.read");
  const first = normalizePageSize(input.first);
  const kind = "audit-event:created_desc";
  const cursor = dateCursor(kind, input.after);
  const where: Prisma.AuditEventWhereInput = {
    workspaceId: ctx.workspace.id,
    ...(input.eventTypes?.length
      ? { eventType: { in: input.eventTypes } }
      : {}),
    ...(input.entityTypes?.length
      ? { entityType: { in: input.entityTypes } }
      : {}),
    ...descendingDateSeek("createdAt", cursor),
  };
  const [rows, totalCount] = await Promise.all([
    getDb().auditEvent.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: first + 1,
    }),
    input.includeTotalCount ? getDb().auditEvent.count({ where }) : undefined,
  ]);
  return toConnection(
    rows,
    first,
    (row) => encodeCursor(kind, [row.createdAt], row.id),
    totalCount,
  );
}

export type MissionHistoryKind = "decision" | "escalation" | "gate-run";

export async function listMissionHistoryPage(
  ctx: WorkspaceContext,
  missionId: string,
  historyKind: MissionHistoryKind,
  input: PageRequest = {},
) {
  requireMissionCapability(ctx, "missions.read");
  const first = normalizePageSize(input.first);
  const kind = `mission-history:${historyKind}:created_desc`;
  const cursor = dateCursor(kind, input.after);
  const where = {
    workspaceId: ctx.workspace.id,
    missionId,
    ...descendingDateSeek("createdAt", cursor),
  };
  const orderBy = [{ createdAt: "desc" as const }, { id: "desc" as const }];
  const rows =
    historyKind === "decision"
      ? await getDb().decision.findMany({ where, orderBy, take: first + 1 })
      : historyKind === "escalation"
        ? await getDb().escalation.findMany({
            where,
            orderBy,
            take: first + 1,
          })
        : await getDb().gateRun.findMany({
            where,
            orderBy,
            take: first + 1,
          });
  const hasNextPage = rows.length > first;
  const nodes = rows.slice(0, first);
  const last = nodes[nodes.length - 1];
  return {
    nodes,
    pageInfo: {
      endCursor: last
        ? encodeCursor(kind, [last.createdAt], last.id)
        : null,
      hasNextPage,
    },
  };
}
