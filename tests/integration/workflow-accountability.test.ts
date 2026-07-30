import pg from "pg";
import { beforeEach, describe, expect, it } from "vitest";

import {
  createScopedGrant,
  revokeScopedGrant,
} from "@/modules/authorization";
import {
  acceptInvitation,
  createInvitation,
  type WorkspaceContext,
} from "@/modules/identity-workspace";
import { createMission } from "@/modules/mission-kernel";
import {
  bulkReassignWorkflowAssignments,
  createApprovalChain,
  createSlaPolicy,
  createWorkflowAssignment,
  evaluateSlaEscalations,
  getWorkInbox,
  listObligationAccountability,
  recordWorkflowApprovalAction,
  requestWorkflowApproval,
} from "@/modules/workflow-accountability";
import { getDb } from "@/server/db";

import {
  asOwner,
  contextForMembership,
  createUser,
  ownerQuery,
  truncateAll,
} from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

async function addMember(
  owner: WorkspaceContext,
  prefix: string,
  role: "ADMIN" | "MEMBER" = "MEMBER",
) {
  const user = await createUser(prefix);
  const invitation = await createInvitation(owner, {
    email: user.email,
    role,
  });
  await acceptInvitation(user, invitation.rawToken);
  return {
    user,
    ctx: await contextForMembership(user, owner.workspace.id),
  };
}

async function addRuntimeObligation(
  owner: WorkspaceContext,
  mission: Awaited<ReturnType<typeof createMission>>,
  code: string,
) {
  const definition = await getDb().contractObligation.create({
    data: {
      workspaceId: owner.workspace.id,
      contractId: mission.currentContractId!,
      code,
      title: `${code} title`,
      description: `${code} description`,
      weight: 1,
      closureRule: "manual",
    },
  });
  return getDb().runtimeObligation.create({
    data: {
      workspaceId: owner.workspace.id,
      missionId: mission.id,
      contractObligationId: definition.id,
    },
  });
}

describe("enterprise workflow and accountability (TIP-023D)", () => {
  it("WORK-01/02/07 exposes honest ownership, retained reassignments and bounded bulk outcomes", async () => {
    const owner = await asOwner(await createUser("work-owner"));
    const member = await addMember(owner, "work-member");
    const mission = await createMission(owner, { title: "Accountable work" });
    const firstTarget = await addRuntimeObligation(owner, mission, "OBL-001");
    const secondTarget = await addRuntimeObligation(owner, mission, "OBL-002");

    const unassigned = await listObligationAccountability(
      owner,
      mission.id,
      { first: 1, includeTotalCount: true },
    );
    expect(unassigned.nodes[0]?.slaState).toBe("UNASSIGNED");
    expect(unassigned.totalCount).toBe(2);
    expect(unassigned.pageInfo.hasNextPage).toBe(true);

    const first = await createWorkflowAssignment(owner, {
      targetType: "RUNTIME_OBLIGATION",
      targetId: firstTarget.id,
      assigneeUserId: owner.user.id,
      reason: "Initial accountable owner",
    });
    await expect(
      createWorkflowAssignment(owner, {
        targetType: "RUNTIME_OBLIGATION",
        targetId: firstTarget.id,
        assigneeUserId: member.user.id,
        reason: "Conflicting accountable owner",
      }),
    ).rejects.toMatchObject({ code: "CONFLICT" });
    const second = await createWorkflowAssignment(owner, {
      targetType: "RUNTIME_OBLIGATION",
      targetId: secondTarget.id,
      assigneeUserId: owner.user.id,
      reason: "Second accountable owner",
    });
    const results = await bulkReassignWorkflowAssignments(owner, {
      items: [
        { assignmentId: first.id, expectedVersion: first.version },
        { assignmentId: second.id, expectedVersion: second.version + 1 },
      ],
      assigneeUserId: member.user.id,
      reason: "Shift handover",
    });
    expect(results.map((result) => result.status)).toEqual([
      "SUCCEEDED",
      "FAILED",
    ]);
    expect(results[1]).toMatchObject({ code: "STALE_VERSION" });

    const history = await ownerQuery<{
      status: string;
      assignee_organization_membership_id: string;
    }>(
      `SELECT status, assignee_organization_membership_id
       FROM workflow_assignment
       WHERE target_id = '${firstTarget.id}'
       ORDER BY created_at ASC`,
    );
    expect(history.map((row) => row.status)).toEqual(["ENDED", "ACTIVE"]);

    const inbox = await getWorkInbox(member.ctx, { first: 10 });
    expect(inbox.nodes).toHaveLength(1);
    expect(inbox.nodes[0]?.assignment.targetId).toBe(firstTarget.id);
  });

  it("WORK-03/04 derives SLA state and emits one retained escalation", async () => {
    const owner = await asOwner(await createUser("sla-owner"));
    const mission = await createMission(owner, { title: "SLA work" });
    const target = await addRuntimeObligation(owner, mission, "SLA-001");
    const policy = await createSlaPolicy(owner, {
      policyKey: "critical-obligation",
      name: "Critical obligation",
      targetType: "RUNTIME_OBLIGATION",
      dueAfterMinutes: 60,
      warningBeforeMinutes: 15,
      escalateAfterMinutes: 0,
      escalationSeverity: "P1",
    });
    const dueAt = new Date("2026-07-30T10:00:00.000Z");
    await createWorkflowAssignment(owner, {
      targetType: "RUNTIME_OBLIGATION",
      targetId: target.id,
      assigneeUserId: owner.user.id,
      reason: "SLA accountable owner",
      dueAt,
      slaPolicyId: policy.id,
    });

    const projection = await listObligationAccountability(
      owner,
      mission.id,
      {},
      new Date("2026-07-30T11:00:00.000Z"),
    );
    expect(projection.nodes[0]?.slaState).toBe("ESCALATION_DUE");
    const first = await evaluateSlaEscalations(
      owner,
      new Date("2026-07-30T11:00:00.000Z"),
    );
    const second = await evaluateSlaEscalations(
      owner,
      new Date("2026-07-30T12:00:00.000Z"),
    );
    expect(first.escalationIds).toHaveLength(1);
    expect(second.escalationIds).toHaveLength(0);
    expect(
      await getDb().escalation.count({
        where: {
          workspaceId: owner.workspace.id,
          sourceType: "WORKFLOW_ASSIGNMENT",
        },
      }),
    ).toBe(1);
  });

  it("WORK-05 enforces requester and cross-step approval independence", async () => {
    const owner = await asOwner(await createUser("approval-owner"));
    const requester = await addMember(owner, "approval-requester");
    const independent = await addMember(
      owner,
      "approval-independent",
      "ADMIN",
    );
    const mission = await createMission(owner, { title: "Approval work" });
    const chain = await createApprovalChain(owner, {
      chainKey: "two-person-release",
      name: "Two-person release",
      workflowType: "RELEASE",
      steps: [
        { name: "Review", requiredCapability: "workflow.approve" },
        {
          name: "Release",
          requiredCapability: "workflow.approve",
          requireIndependentFromPrevious: true,
        },
      ],
    });
    const request = await requestWorkflowApproval(requester.ctx, {
      targetType: "MISSION",
      targetId: mission.id,
      chainDefinitionId: chain.id,
    });
    const first = await recordWorkflowApprovalAction(owner, {
      requestId: request.id,
      expectedVersion: request.version,
      decision: "APPROVED",
      rationale: "Review evidence is sufficient",
    });
    await expect(
      recordWorkflowApprovalAction(owner, {
        requestId: request.id,
        expectedVersion: first.request.version,
        decision: "APPROVED",
        rationale: "Attempt same-person release",
      }),
    ).rejects.toMatchObject({ code: "INDEPENDENCE_REQUIRED" });
    const final = await recordWorkflowApprovalAction(independent.ctx, {
      requestId: request.id,
      expectedVersion: first.request.version,
      decision: "APPROVED",
      rationale: "Independent release approval",
    });
    expect(final.request.status).toBe("APPROVED");

    const selfApprovalMission = await createMission(owner, {
      title: "Self approval must fail",
    });
    const selfApproval = await requestWorkflowApproval(owner, {
      targetType: "MISSION",
      targetId: selfApprovalMission.id,
      chainDefinitionId: chain.id,
    });
    await expect(
      recordWorkflowApprovalAction(owner, {
        requestId: selfApproval.id,
        expectedVersion: selfApproval.version,
        decision: "APPROVED",
        rationale: "Requester attempts own approval",
      }),
    ).rejects.toMatchObject({ code: "INDEPENDENCE_REQUIRED" });
  });

  it("WORK-06 re-evaluates delegated authority while retaining prior work", async () => {
    const owner = await asOwner(await createUser("delegate-owner"));
    const delegate = await addMember(owner, "delegate-member");
    const mission = await createMission(owner, { title: "Delegated work" });
    const firstTarget = await addRuntimeObligation(owner, mission, "DEL-001");
    const secondTarget = await addRuntimeObligation(owner, mission, "DEL-002");
    const parent = await createScopedGrant(owner, {
      subjectType: "USER",
      subjectUserId: owner.user.id,
      role: "MISSION_OWNER",
      effect: "ALLOW",
      scopeType: "WORKSPACE",
      workspaceId: owner.workspace.id,
      reason: "Delegable workflow authority",
    });
    await createScopedGrant(owner, {
      subjectType: "USER",
      subjectUserId: delegate.user.id,
      role: "MISSION_OWNER",
      effect: "ALLOW",
      scopeType: "WORKSPACE",
      workspaceId: owner.workspace.id,
      delegatedFromGrantId: parent.id,
      validUntil: new Date(Date.now() + 60_000),
      reason: "Temporary workflow delegation",
    });
    const retained = await createWorkflowAssignment(delegate.ctx, {
      targetType: "RUNTIME_OBLIGATION",
      targetId: firstTarget.id,
      assigneeUserId: owner.user.id,
      reason: "Created during valid delegation",
    });
    await revokeScopedGrant(
      owner,
      parent.id,
      parent.version,
      "Delegation closed",
    );
    await expect(
      createWorkflowAssignment(delegate.ctx, {
        targetType: "RUNTIME_OBLIGATION",
        targetId: secondTarget.id,
        assigneeUserId: owner.user.id,
        reason: "Attempt after authority ended",
      }),
    ).rejects.toThrow(/workflow\.manage/i);
    expect(
      await ownerQuery<{ status: string }>(
        `SELECT status FROM workflow_assignment WHERE id = '${retained.id}'`,
      ),
    ).toEqual([{ status: "ACTIVE" }]);
  });

  it("WORK-08 forces tenant isolation on workflow tables for the runtime role", async () => {
    const ownerA = await asOwner(await createUser("workflow-rls-a"));
    const ownerB = await asOwner(await createUser("workflow-rls-b"));
    const policyA = await createSlaPolicy(ownerA, {
      policyKey: "tenant-policy",
      name: "Tenant A policy",
      targetType: "MISSION",
      dueAfterMinutes: 60,
      warningBeforeMinutes: 10,
      escalateAfterMinutes: 10,
      escalationSeverity: "P2",
    });
    await createSlaPolicy(ownerB, {
      policyKey: "tenant-policy",
      name: "Tenant B policy",
      targetType: "MISSION",
      dueAfterMinutes: 60,
      warningBeforeMinutes: 10,
      escalateAfterMinutes: 10,
      escalationSeverity: "P2",
    });
    const organizationA = (
      await ownerQuery<{ organization_id: string }>(
        `SELECT organization_id FROM workspace WHERE id = '${ownerA.workspace.id}'`,
      )
    )[0]!.organization_id;
    const organizationB = (
      await ownerQuery<{ organization_id: string }>(
        `SELECT organization_id FROM workspace WHERE id = '${ownerB.workspace.id}'`,
      )
    )[0]!.organization_id;
    const runtime = new pg.Client({
      connectionString: process.env.DATABASE_URL,
    });
    await runtime.connect();
    try {
      await runtime.query("BEGIN");
      await runtime.query(
        "SELECT set_config('hiveos.organization_id', $1, true)",
        [organizationA],
      );
      const visible = await runtime.query(
        "SELECT id FROM sla_policy ORDER BY id",
      );
      expect(visible.rows.map((row) => row.id)).toEqual([policyA.id]);
      await expect(
        runtime.query(
          `UPDATE sla_policy SET name = 'tampered'
           WHERE organization_id = $1`,
          [organizationB],
        ),
      ).rejects.toMatchObject({ code: "42501" });
      await runtime.query("ROLLBACK");
    } finally {
      await runtime.end();
    }
  });
});
