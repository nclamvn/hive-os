import { beforeEach, expect, it } from "vitest";

import {
  readMissionDossierManifest,
  requestMissionDossierExport,
} from "@/modules/dossier-export";
import {
  acceptInvitation,
  createInvitation,
  type WorkspaceContext,
} from "@/modules/identity-workspace";
import {
  addObligation,
  addRequirement,
  approveContract,
  createMission,
  submitContract,
  transitionMission,
} from "@/modules/mission-kernel";
import { captureSnapshot, createEvidenceSource } from "@/modules/truth-kernel";
import {
  createApprovalChain,
  recordWorkflowApprovalAction,
  requestWorkflowApproval,
} from "@/modules/workflow-accountability";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";
import { runOrganizationWorkerCycle } from "@/server/workers/organization-cycle";

import {
  asOwner,
  contextForMembership,
  createUser,
  truncateAll,
} from "./helpers";

beforeEach(async () => truncateAll());

async function addMember(
  owner: WorkspaceContext,
  prefix: string,
  role: "ADMIN" | "MEMBER",
) {
  const user = await createUser(prefix);
  const invitation = await createInvitation(owner, { email: user.email, role });
  await acceptInvitation(user, invitation.rawToken);
  return {
    user,
    ctx: await contextForMembership(user, owner.workspace.id),
  };
}

it("PILOT-E01 certifies five governed multi-role Mission dossiers without replacing human attestation", async () => {
  const owner = await asOwner(await createUser("pilot-cert-owner"));
  const requester = await addMember(owner, "pilot-cert-requester", "MEMBER");
  const independent = await addMember(owner, "pilot-cert-independent", "ADMIN");
  const foreign = await asOwner(await createUser("pilot-cert-foreign"));
  const chain = await createApprovalChain(owner, {
    chainKey: "enterprise-pilot-two-person",
    name: "Enterprise pilot two-person approval",
    workflowType: "RELEASE",
    steps: [
      { name: "Evidence review", requiredCapability: "workflow.approve" },
      {
        name: "Independent release",
        requiredCapability: "workflow.approve",
        requireIndependentFromPrevious: true,
      },
    ],
  });
  const organization = await getDb().workspace.findUniqueOrThrow({
    where: { id: owner.workspace.id },
    select: { organizationId: true },
  });
  const exports: Array<{ exportId: string; missionId: string }> = [];

  for (let index = 1; index <= 5; index += 1) {
    const code = String(index).padStart(2, "0");
    const mission = await createMission(owner, {
      title: `Enterprise acceptance Mission ${code}`,
      objective: `Verify governed enterprise scenario ${code}`,
      scope: "Bounded QA certification data only",
      successDefinition:
        "Independent approval and a hash-addressed dossier are retained",
    });
    await addRequirement(owner, mission.currentContractId!, {
      code: `REQ-PILOT-${code}`,
      title: `Retain evidence for scenario ${code}`,
      description: "The record must remain attributable and tenant scoped",
      acceptanceCriteria:
        "A source snapshot, approval chain and dossier manifest are retained",
    });
    await addObligation(owner, mission.currentContractId!, {
      code: `OBL-PILOT-${code}`,
      title: `Close scenario ${code}`,
      description: "Preserve the governed acceptance envelope",
      weight: index,
      closureRule: "Independent approval required",
    });
    await transitionMission(owner, mission.id, "INTAKE", {
      reason: "Enterprise pilot intake",
    });
    await transitionMission(owner, mission.id, "SCOPED", {
      reason: "Enterprise pilot scope locked",
    });
    await submitContract(owner, mission.id);
    await approveContract(owner, mission.id);

    const source = await createEvidenceSource(owner, mission.id, {
      title: `Enterprise evidence ${code}`,
      canonicalUri: `urn:hiveos:enterprise-pilot:${code}`,
      sourceType: "TEST_RESULT",
      independenceKey: `enterprise-pilot-lab-${code}`,
    });
    const evidence =
      index === 5
        ? `large-retained-evidence-${code}:`.repeat(32_768)
        : `Retained acceptance evidence for scenario ${code}.`;
    await captureSnapshot(owner, source.id, {
      content: evidence,
      capturedAt: new Date(`2026-08-05T00:0${index}:00.000Z`),
    });

    const approval = await requestWorkflowApproval(requester.ctx, {
      targetType: "MISSION",
      targetId: mission.id,
      chainDefinitionId: chain.id,
    });
    const first = await recordWorkflowApprovalAction(owner, {
      requestId: approval.id,
      expectedVersion: approval.version,
      decision: "APPROVED",
      rationale: `Evidence review ${code}`,
    });
    if (index === 1) {
      await expect(
        recordWorkflowApprovalAction(owner, {
          requestId: approval.id,
          expectedVersion: first.request.version,
          decision: "APPROVED",
          rationale: "Same-person approval must fail",
        }),
      ).rejects.toMatchObject({ code: "INDEPENDENCE_REQUIRED" });
    }
    const final = await recordWorkflowApprovalAction(independent.ctx, {
      requestId: approval.id,
      expectedVersion: first.request.version,
      decision: "APPROVED",
      rationale: `Independent approval ${code}`,
    });
    expect(final.request.status).toBe("APPROVED");

    const requested = await requestMissionDossierExport(owner, {
      missionId: mission.id,
      idempotencyKey: `enterprise-pilot-dossier-${code}`,
    });
    expect(requested.status).toBe("SUCCEEDED");
    if (requested.status !== "SUCCEEDED") throw new Error("request failed");
    exports.push({
      exportId: String(requested.outcome.exportId),
      missionId: mission.id,
    });
  }

  await expect(
    requestMissionDossierExport(foreign, {
      missionId: exports[0]!.missionId,
      idempotencyKey: "enterprise-pilot-foreign",
    }),
  ).rejects.toMatchObject({ code: "SCOPED_AUTHORIZATION_DENIED" });

  const cycle = await runOrganizationWorkerCycle({
    organizationId: organization.organizationId,
    actorUserId: owner.user.id,
    workerId: "enterprise-pilot-certifier",
    correlationId: owner.correlationId,
    claimFirst: 10,
  });
  expect(cycle).toMatchObject({ succeeded: 5, failed: 0 });

  for (const retained of exports) {
    const manifest = JSON.parse(
      Buffer.from(
        await readMissionDossierManifest(owner, retained.exportId),
      ).toString("utf8"),
    ) as {
      schema: string;
      missionId: string;
      bundleHash: string;
      partCount: number;
    };
    expect(manifest).toMatchObject({
      schema: "hive-os.mission-dossier-manifest.v2",
      missionId: retained.missionId,
    });
    expect(manifest.bundleHash).toMatch(/^[a-f0-9]{64}$/);
    expect(manifest.partCount).toBeGreaterThan(0);
  }

  expect(
    await getDb().mission.count({ where: { workspaceId: owner.workspace.id } }),
  ).toBe(5);
  const retainedCounts = await withOrganizationTenant(
    organization.organizationId,
    owner.user.id,
    async (tx) => ({
      approvalActions: await tx.workflowApprovalAction.count({
        where: { workspaceId: owner.workspace.id },
      }),
      snapshots: await tx.snapshot.count({
        where: { workspaceId: owner.workspace.id },
      }),
    }),
  );
  expect(retainedCounts.approvalActions).toBe(10);
  expect(retainedCounts.snapshots).toBe(5);
}, 30_000);
