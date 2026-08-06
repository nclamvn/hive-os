import type { AssuranceProfile, MissionStatus, Prisma } from "@prisma/client";

import { authorize, organizationIdForWorkspace } from "@/modules/authorization";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { getOrganizationHierarchy } from "@/modules/organization";
import { getWorkspaceOperationalProjection } from "@/modules/projections";
import { listMissionPage, type MissionSort } from "@/modules/query-contracts";
import { getWorkInbox } from "@/modules/workflow-accountability";
import { withOrganizationTenant } from "@/server/tenant-context";

const ATTENTION_STATUSES: MissionStatus[] = [
  "CONTRACT_REVIEW",
  "BLOCKED",
  "REVIEW",
  "PARTIAL",
];

export type MissionCommandView = "all" | "attention" | "my-work";

export interface MissionCommandQuery {
  view?: MissionCommandView;
  statuses?: MissionStatus[];
  assuranceProfiles?: AssuranceProfile[];
  sort?: MissionSort;
  after?: string;
}

const COMMAND_CAPABILITIES = [
  "missions.create",
  "authoring.write",
  "research.request",
  "truth.write",
  "execution.operate",
  "verification.operate",
  "workflow.manage",
  "projections.manage",
] as const;

export async function getMissionCommandProjection(
  ctx: WorkspaceContext,
  query: MissionCommandQuery = {},
) {
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const view = query.view ?? "all";

  const [hierarchy, projection, inbox] = await Promise.all([
    getOrganizationHierarchy(ctx, 100),
    getWorkspaceOperationalProjection(ctx),
    getWorkInbox(ctx, { first: view === "my-work" ? 100 : 12 }),
  ]);

  const myMissionIds = [
    ...new Set(inbox.nodes.map((item) => item.assignment.missionId)),
  ];
  const statuses = query.statuses?.length
    ? query.statuses
    : view === "attention"
      ? ATTENTION_STATUSES
      : undefined;

  const missions = await listMissionPage(ctx, {
    first: 25,
    after: query.after,
    includeTotalCount: true,
    ids: view === "my-work" ? myMissionIds : undefined,
    statuses,
    assuranceProfiles: query.assuranceProfiles,
    sort: query.sort ?? "UPDATED_DESC",
  });

  const missionIds = missions.nodes.map((mission) => mission.id);
  const [scope, assignments, commandDecisions] = await Promise.all([
    withOrganizationTenant(organizationId, ctx.user.id, (tx) =>
      tx.workspace.findFirstOrThrow({
        where: { id: ctx.workspace.id, organizationId },
        select: {
          id: true,
          slug: true,
          name: true,
          organization: { select: { id: true, slug: true, name: true } },
          orgUnit: {
            select: { id: true, unitKey: true, name: true, type: true },
          },
          portfolio: {
            select: { id: true, portfolioKey: true, name: true },
          },
        },
      }),
    ),
    missionIds.length
      ? withOrganizationTenant(organizationId, ctx.user.id, (tx) =>
          tx.workflowAssignment.findMany({
            where: {
              organizationId,
              workspaceId: ctx.workspace.id,
              missionId: { in: missionIds },
              targetType: "MISSION",
              accountabilityRole: "ACCOUNTABLE",
              status: "ACTIVE",
            },
            select: {
              id: true,
              missionId: true,
              dueAt: true,
              assignee: {
                select: {
                  user: { select: { name: true, email: true } },
                },
              },
            },
            orderBy: [{ missionId: "asc" }, { id: "asc" }],
            take: missionIds.length,
          }),
        )
      : Promise.resolve([]),
    Promise.all(
      COMMAND_CAPABILITIES.map(async (capability) => {
        const decision = await authorize(ctx.user.id, capability, {
          organizationId,
          workspaceId: ctx.workspace.id,
        });
        return [capability, decision.allowed] as const;
      }),
    ),
  ]);

  const assignmentByMission = new Map(
    assignments.map((assignment) => [assignment.missionId, assignment]),
  );

  return {
    scope: {
      organization: scope.organization,
      unit: scope.orgUnit,
      portfolio: scope.portfolio,
      workspace: {
        id: scope.id,
        slug: scope.slug,
        name: scope.name,
      },
      hierarchyTruncated: hierarchy.pageInfo.truncated,
    },
    view,
    savedViews: [
      { id: "all", owner: "HIVE OS", visibility: "WORKSPACE" },
      { id: "attention", owner: "HIVE OS", visibility: "WORKSPACE" },
      { id: "my-work", owner: ctx.user.name, visibility: "PRIVATE" },
    ] as const,
    missions: {
      nodes: missions.nodes.map((mission) => {
        const assignment = assignmentByMission.get(mission.id);
        return {
          id: mission.id,
          referenceCode: mission.referenceCode,
          title: mission.title,
          status: mission.status,
          assuranceProfile: mission.assuranceProfile,
          currentContractId: mission.currentContractId,
          approvedContractId: mission.approvedContractId,
          blockedFromStatus: mission.blockedFromStatus,
          createdAt: mission.createdAt.toISOString(),
          updatedAt: mission.updatedAt.toISOString(),
          version: mission.version,
          accountability: assignment
            ? {
                ownerName: assignment.assignee.user.name,
                ownerEmail: assignment.assignee.user.email,
                dueAt: assignment.dueAt?.toISOString() ?? null,
              }
            : null,
        };
      }),
      pageInfo: missions.pageInfo,
      totalCount: missions.totalCount ?? null,
    },
    inbox: inbox.nodes.slice(0, 12).map((item) => ({
      id: item.assignment.id,
      missionId: item.assignment.missionId,
      referenceCode: item.assignment.mission.referenceCode,
      missionTitle: item.assignment.mission.title,
      targetType: item.assignment.targetType,
      accountabilityRole: item.assignment.accountabilityRole,
      dueAt: item.assignment.dueAt?.toISOString() ?? null,
      slaState: item.slaState,
    })),
    operational: {
      counts: projection.counts,
      freshness: projection.freshness,
    },
    commands: Object.fromEntries(commandDecisions) as Record<
      (typeof COMMAND_CAPABILITIES)[number],
      boolean
    >,
  };
}

export type MissionCommandProjection = Prisma.PromiseReturnType<
  typeof getMissionCommandProjection
>;
