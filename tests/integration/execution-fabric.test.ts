import { beforeEach, describe, expect, it } from "vitest";

import type { WorkspaceContext } from "@/modules/identity-workspace";
import {
  acceptInvitation,
  createInvitation,
} from "@/modules/identity-workspace";
import {
  createExecutionTip,
  getExecutionProjection,
  importCompletionReport,
  issueManualRun,
  resolveExecutionDeviation,
  retryManualRun,
} from "@/modules/execution-fabric";
import {
  addObligation,
  addRequirement,
  approveContract,
  createMission,
  submitContract,
  transitionMission,
} from "@/modules/mission-kernel";
import {
  registerSkill,
  type SkillContractInput,
} from "@/modules/skill-runtime";
import { getDb } from "@/server/db";
import { getExecutionOperationsProjection } from "@/server/execution-operations";

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

const completeReport = {
  result: "DONE" as const,
  summary: "Manual provider completed the governed work package",
  requirementCoverage: {
    implemented: 1,
    total: 1,
    missing: [],
    deferred: [],
  },
  scenarioResults: [
    {
      scenarioId: "EF-01",
      result: "PASS" as const,
      severity: null,
      evidenceArtifactIds: [],
    },
  ],
  technicalHealth: {
    build: "PASS" as const,
    typecheck: { errors: 0, warnings: 0 },
    lint: { errors: 0, warnings: 0 },
    unit: { passed: 1, failed: 0, skipped: 0 },
    integration: { passed: 1, failed: 0, skipped: 0 },
    e2e: { passed: 0, failed: 0, skipped: 1 },
    accessibilityViolations: 0,
    vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0 },
  },
  overallStatus: "READY" as const,
  deviations: [],
  resourceUsage: [
    { metric: "duration_ms", quantity: 1200, unit: "ms" },
    { metric: "input_tokens", quantity: 400, unit: "tokens" },
  ],
};

function skillContract(): SkillContractInput {
  return {
    semanticVersion: "1.0.0",
    capabilities: ["implementation_planning"],
    inputSchema: { type: "object", properties: {} },
    outputSchema: { type: "object", properties: {} },
    requiredEvidence: ["completion_report"],
    failureStates: ["BLOCKED"],
    verifierBinding: {
      kind: "HUMAN",
      verifierKey: "manual-completion",
    },
    resourceEstimate: {
      maxDurationSeconds: 3600,
      maxMemoryMb: 1024,
    },
    assuranceCompatibility: ["PROFESSIONAL"],
  };
}

async function executionFixture(ctx: WorkspaceContext) {
  const mission = await createMission(ctx, {
    title: "Execution mission",
    objective: "Implement one governed package",
    scope: "Local Manual Bridge",
    successDefinition: "Strict report imported",
  });
  await addRequirement(ctx, mission.currentContractId!, {
    code: "REQ-1",
    title: "Execution",
    description: "Execute the package",
    acceptanceCriteria: "Completion Report exists",
  });
  await addObligation(ctx, mission.currentContractId!, {
    code: "OBL-1",
    title: "Execution",
    description: "Retain execution evidence",
    weight: 1,
    closureRule: "manual",
  });
  await transitionMission(ctx, mission.id, "INTAKE", { reason: "intake" });
  await transitionMission(ctx, mission.id, "SCOPED", { reason: "scope" });
  await submitContract(ctx, mission.id);
  await approveContract(ctx, mission.id);
  await transitionMission(ctx, mission.id, "EXPLORING", {
    reason: "truth loop ready",
  });
  const skill = await registerSkill(
    ctx,
    {
      skillKey: "manual-builder",
      displayName: "Manual Builder",
      description: "Provider-independent manual implementation",
    },
    skillContract(),
  );
  return { mission, skill };
}

async function createTip(
  ctx: WorkspaceContext,
  missionId: string,
  skillVersionId: string,
  code = "TIP-1",
  predecessorTipIds: string[] = [],
) {
  return createExecutionTip(ctx, missionId, {
    code,
    title: `Work package ${code}`,
    description: "Execute the governed local package",
    skillVersionId,
    predecessorTipIds,
  });
}

const runInput = {
  executionRole: "BUILDER" as const,
  providerName: "manual-operator",
  modelName: "external-model",
  instruction: "# Immutable instruction\nImplement the accepted package.",
};

describe("Execution Fabric Manual Bridge", () => {
  it("EF-01 records an immutable hashed instruction and attributed first attempt", async () => {
    const ctx = await asOwner(await createUser("execution-owner"));
    const { mission, skill } = await executionFixture(ctx);
    const tip = await createTip(
      ctx,
      mission.id,
      skill.activeVersion.id,
    );
    const { run, artifact } = await issueManualRun(ctx, tip.id, runInput);

    expect(run).toMatchObject({
      attemptNumber: 1,
      executionRole: "BUILDER",
      providerName: "manual-operator",
      modelName: "external-model",
      providerMode: "MANUAL_BRIDGE",
      inputArtifactId: artifact.id,
    });
    expect(artifact.contentHash).toMatch(/^[0-9a-f]{64}$/);
    await expect(
      ownerQuery(
        `UPDATE execution_artifact SET content='changed' WHERE id='${artifact.id}'`,
      ),
    ).rejects.toThrow(/append-only/i);
  });

  it("EF-02 retry appends attempt 2 without overwriting attempt 1", async () => {
    const ctx = await asOwner(await createUser("execution-owner"));
    const { mission, skill } = await executionFixture(ctx);
    const tip = await createTip(ctx, mission.id, skill.activeVersion.id);
    const first = await issueManualRun(ctx, tip.id, runInput);
    await importCompletionReport(ctx, first.run.id, {
      ...completeReport,
      result: "BLOCKED",
      overallStatus: "NOT_READY",
      summary: "External provider blocked; retry required",
    });
    const second = await retryManualRun(ctx, first.run.id, {
      ...runInput,
      instruction: "# Retry instruction\nCorrect the blocked work package.",
    });

    expect(second.run.attemptNumber).toBe(2);
    expect(second.run.previousRunId).toBe(first.run.id);
    const retained = await getDb().agentRun.findUniqueOrThrow({
      where: { id: first.run.id },
    });
    expect(retained.status).toBe("BLOCKED");
    expect(retained.outputArtifactId).toBeTruthy();
    await expect(
      retryManualRun(ctx, first.run.id, runInput),
    ).rejects.toMatchObject({ code: "EXECUTION_INVARIANT" });
  });

  it("EF-03/04 imports a complete report atomically and rejects missing fields", async () => {
    const ctx = await asOwner(await createUser("execution-owner"));
    const { mission, skill } = await executionFixture(ctx);
    const tip = await createTip(ctx, mission.id, skill.activeVersion.id);
    const { run } = await issueManualRun(ctx, tip.id, runInput);

    const { report, artifact } = await importCompletionReport(
      ctx,
      run.id,
      completeReport,
    );
    const completed = await getDb().agentRun.findUniqueOrThrow({
      where: { id: run.id },
    });
    expect(completed.outputArtifactId).toBe(artifact.id);
    expect(report.artifactId).toBe(artifact.id);
    expect(
      await getDb().resourceUsageRecord.count({
        where: { reportId: report.id },
      }),
    ).toBe(2);
    await expect(
      ownerQuery(
        `UPDATE completion_report SET summary='changed' WHERE id='${report.id}'`,
      ),
    ).rejects.toThrow(/append-only/i);

    const next = await createTip(
      ctx,
      mission.id,
      skill.activeVersion.id,
      "TIP-2",
    );
    const nextRun = await issueManualRun(ctx, next.id, runInput);
    const incomplete: Record<string, unknown> = { ...completeReport };
    Reflect.deleteProperty(incomplete, "technicalHealth");
    await expect(
      importCompletionReport(ctx, nextRun.run.id, incomplete as never),
    ).rejects.toMatchObject({ code: "COMPLETION_REPORT_INVALID" });
    expect(
      await getDb().completionReport.count({
        where: { runId: nextRun.run.id },
      }),
    ).toBe(0);
    expect(
      await getDb().agentRun.findUniqueOrThrow({
        where: { id: nextRun.run.id },
      }),
    ).toMatchObject({ status: "AWAITING_REPORT", outputArtifactId: null });
  });

  it("EF-05/06/07 exposes material deviations and blocks dependents until resolution", async () => {
    const ctx = await asOwner(await createUser("execution-owner"));
    const { mission, skill } = await executionFixture(ctx);
    const predecessor = await createTip(
      ctx,
      mission.id,
      skill.activeVersion.id,
      "TIP-1",
    );
    const dependent = await createTip(
      ctx,
      mission.id,
      skill.activeVersion.id,
      "TIP-2",
      [predecessor.id],
    );
    const first = await issueManualRun(ctx, predecessor.id, runInput);
    await importCompletionReport(ctx, first.run.id, {
      ...completeReport,
      deviations: [
        {
          code: "DEV-1",
          title: "Interface changed",
          description: "Builder changed the accepted output interface",
          materiality: "MATERIAL",
          proposedResolution: "Contractor reviews and accepts the correction",
        },
      ],
    });

    const projection = await getExecutionProjection(ctx, mission.id);
    expect(projection.openDeviations).toHaveLength(1);
    expect(projection.openDeviations[0].tip.code).toBe("TIP-1");
    await expect(
      issueManualRun(ctx, dependent.id, runInput),
    ).rejects.toMatchObject({ code: "EXECUTION_DEPENDENCY_BLOCKED" });

    await resolveExecutionDeviation(
      ctx,
      projection.openDeviations[0].id,
      {
        resolution: "Contractor accepted the corrected interface",
        expectedVersion: 1,
      },
    );
    await expect(
      issueManualRun(ctx, dependent.id, runInput),
    ).resolves.toBeTruthy();
  });

  it("EF-08 fails closed on cross-workspace TIP access", async () => {
    const ctxA = await asOwner(await createUser("execution-a"));
    const ctxB = await asOwner(await createUser("execution-b"));
    const { mission, skill } = await executionFixture(ctxA);
    const tip = await createTip(ctxA, mission.id, skill.activeVersion.id);
    await expect(issueManualRun(ctxB, tip.id, runInput)).rejects.toMatchObject({
      code: "EXECUTION_NOT_FOUND",
    });
    const foreignProjection = await getExecutionOperationsProjection(ctxB);
    expect(foreignProjection.tips).toEqual([]);
    expect(foreignProjection.counts.artifacts).toBe(0);
  });

  it("EF-09 serializes competing report imports so exactly one succeeds", async () => {
    const ctx = await asOwner(await createUser("execution-owner"));
    const { mission, skill } = await executionFixture(ctx);
    const tip = await createTip(ctx, mission.id, skill.activeVersion.id);
    const { run } = await issueManualRun(ctx, tip.id, runInput);
    const outcomes = await Promise.allSettled([
      importCompletionReport(ctx, run.id, completeReport),
      importCompletionReport(ctx, run.id, completeReport),
    ]);

    expect(
      outcomes.filter((outcome) => outcome.status === "fulfilled"),
    ).toHaveLength(1);
    expect(
      outcomes.filter((outcome) => outcome.status === "rejected"),
    ).toHaveLength(1);
    expect(
      await getDb().completionReport.count({ where: { runId: run.id } }),
    ).toBe(1);
  });

  it("EF-10/11/12 gates BUILDING on execution readiness and keeps VERIFYING closed", async () => {
    const ctx = await asOwner(await createUser("execution-owner"));
    const { mission, skill } = await executionFixture(ctx);
    await expect(
      transitionMission(ctx, mission.id, "BUILDING", {
        reason: "premature",
      }),
    ).rejects.toMatchObject({ code: "EXECUTION_FABRIC_REQUIRED" });

    const tip = await createTip(ctx, mission.id, skill.activeVersion.id);
    const { run } = await issueManualRun(ctx, tip.id, runInput);
    await importCompletionReport(ctx, run.id, completeReport);
    await expect(
      transitionMission(ctx, mission.id, "BUILDING", {
        reason: "execution evidence complete",
      }),
    ).resolves.toBeUndefined();
    await expect(
      transitionMission(ctx, mission.id, "VERIFYING", {
        reason: "verification next",
      }),
    ).rejects.toMatchObject({ code: "VERIFICATION_KERNEL_REQUIRED" });
  });

  it("Viewer can read the claim-labelled projection but cannot operate runs", async () => {
    const owner = await asOwner(await createUser("execution-owner"));
    const { mission, skill } = await executionFixture(owner);
    const tip = await createTip(owner, mission.id, skill.activeVersion.id);
    const viewerUser = await createUser("execution-viewer");
    const invitation = await createInvitation(owner, {
      email: viewerUser.email,
      role: "VIEWER",
    });
    await acceptInvitation(viewerUser, invitation.rawToken);
    const viewer = await contextForMembership(
      viewerUser,
      owner.workspace.id,
    );

    expect((await getExecutionProjection(viewer, mission.id)).disclaimer).toMatch(
      /not independent verification/i,
    );
    const operations = await getExecutionOperationsProjection(viewer);
    expect(operations.tips).toHaveLength(1);
    expect(operations.permissions).toEqual({
      canOperate: false,
      canReview: false,
    });
    expect(operations.tips[0].mission.referenceCode).toBeTruthy();
    await expect(issueManualRun(viewer, tip.id, runInput)).rejects.toMatchObject(
      { code: "EXECUTION_FORBIDDEN" },
    );
  });
});
