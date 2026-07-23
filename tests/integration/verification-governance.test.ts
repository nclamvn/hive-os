import { beforeEach, describe, expect, it } from "vitest";

import type { AssuranceProfile } from "@prisma/client";

import type { WorkspaceContext } from "@/modules/identity-workspace";
import {
  createExecutionTip,
  importCompletionReport,
  issueManualRun,
} from "@/modules/execution-fabric";
import {
  addObligation,
  addRequirement,
  approveContract,
  createMission,
  submitContract,
  transitionMission,
} from "@/modules/mission-kernel";
import { registerSkill } from "@/modules/skill-runtime";
import {
  addClaimVersion,
  captureSnapshot,
  createClaim,
  createEvidenceSource,
  createEvidenceSpan,
} from "@/modules/truth-kernel";
import {
  authorizeGovernedRelease,
  beginVerificationRun,
  completeVerificationRun,
  createVerificationScenario,
  getVerificationProjection,
  listApprovedReleaseProjections,
  recordGovernanceSignoff,
} from "@/modules/verification-governance";
import { getDb } from "@/server/db";

import {
  asOwner,
  createUser,
  ownerQuery,
  truncateAll,
} from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

const technicalHealth = {
  build: "PASS" as const,
  typecheck: { errors: 0, warnings: 0 },
  lint: { errors: 0, warnings: 0 },
  unit: { passed: 101, failed: 0, skipped: 0 },
  integration: { passed: 1, failed: 0, skipped: 0 },
  e2e: { passed: 1, failed: 0, skipped: 0 },
  accessibilityViolations: 0,
  vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0 },
};

const completionReport = {
  result: "DONE" as const,
  summary: "Governed local work completed",
  requirementCoverage: {
    implemented: 1,
    total: 1,
    missing: [],
    deferred: [],
  },
  scenarioResults: [
    {
      scenarioId: "VG-EXECUTION",
      result: "PASS" as const,
      severity: null,
      evidenceArtifactIds: [],
    },
  ],
  technicalHealth,
  overallStatus: "READY" as const,
  deviations: [],
  resourceUsage: [{ metric: "duration_ms", quantity: 1, unit: "ms" }],
};

async function publicSpan(
  ctx: WorkspaceContext,
  missionId: string,
  key: string,
) {
  const source = await createEvidenceSource(ctx, missionId, {
    title: key,
    canonicalUri: `https://example.test/${key}`,
    sourceType: "WEB",
    independenceKey: key,
    qualifiesForCorroboration: true,
    accessLevel: "PUBLIC",
  });
  const content = "The governed value is 42.";
  const snapshot = await captureSnapshot(ctx, source.id, {
    content,
    capturedAt: new Date("2026-07-23T00:00:00Z"),
  });
  return createEvidenceSpan(ctx, snapshot.id, {
    startOffset: content.indexOf("42"),
    endOffset: content.indexOf("42") + 2,
    exactText: "42",
  });
}

async function fixture(
  profile: AssuranceProfile = "RESEARCH",
  verifierPair = { providerName: "independent-provider", modelName: "verifier-v1" },
) {
  const ctx = await asOwner(await createUser("verification-owner"));
  const mission = await createMission(ctx, {
    title: "Verification governance mission",
    assuranceProfile: profile,
    objective: "Verify and govern an exact release",
    scope: "Local retained evidence",
    successDefinition: "Immutable Verify Report and release manifest",
  });
  const requirement = await addRequirement(ctx, mission.currentContractId!, {
    code: "REQ-VERIFY",
    title: "Governed verification",
    description: "Retain exact evidence for the accepted outcome",
    acceptanceCriteria: "Required scenario and corruption run pass",
  });
  await addObligation(ctx, mission.currentContractId!, {
    code: "OBL-VERIFY",
    title: "Retain evidence",
    description: "Preserve report and release artifacts",
    weight: 1,
    closureRule: "governed release",
  });
  await transitionMission(ctx, mission.id, "INTAKE", { reason: "intake" });
  await transitionMission(ctx, mission.id, "SCOPED", { reason: "scope" });
  await submitContract(ctx, mission.id);
  await approveContract(ctx, mission.id);
  await transitionMission(ctx, mission.id, "EXPLORING", {
    reason: "truth exploration",
  });

  const spanA = await publicSpan(ctx, mission.id, "publisher-a");
  const createdClaim = await createClaim(ctx, mission.id, {
    claimKey: "governed-value",
    statement: "The governed value is 42",
    normalizedValue: "42",
    accessLevel: "PUBLIC",
    evidence: [{ spanId: spanA.id }],
  });
  const spanB = await publicSpan(ctx, mission.id, "publisher-b");
  const corroborated = await addClaimVersion(ctx, createdClaim.claim.id, {
    statement: "The governed value is 42",
    normalizedValue: "42",
    accessLevel: "PUBLIC",
    evidence: [{ spanId: spanB.id }],
  });
  expect(corroborated.claim.state).toBe("CORROBORATED");

  const skill = await registerSkill(
    ctx,
    {
      skillKey: `verification-skill-${profile.toLowerCase()}`,
      displayName: "Verification-capable Manual Bridge",
      description: "Local builder and verifier fixture",
    },
    {
      semanticVersion: "1.0.0",
      capabilities: ["implementation", "verification"],
      inputSchema: { type: "object", properties: {} },
      outputSchema: { type: "object", properties: {} },
      requiredEvidence: ["completion_report"],
      failureStates: ["BLOCKED"],
      verifierBinding: { kind: "HUMAN", verifierKey: "manual-review" },
      resourceEstimate: { maxDurationSeconds: 3600, maxMemoryMb: 1024 },
      assuranceCompatibility: [profile],
    },
  );
  const builderTip = await createExecutionTip(ctx, mission.id, {
    code: "TIP-BUILD",
    title: "Build accepted package",
    description: "Produce the governed output",
    skillVersionId: skill.activeVersion.id,
    predecessorTipIds: [],
  });
  const builder = await issueManualRun(ctx, builderTip.id, {
    executionRole: "BUILDER",
    providerName: "builder-provider",
    modelName: "builder-v1",
    instruction: "Build the exact accepted local package.",
  });
  await importCompletionReport(ctx, builder.run.id, completionReport);

  const verifierTip = await createExecutionTip(ctx, mission.id, {
    code: "TIP-VERIFY",
    title: "Verify accepted package",
    description: "Independently inspect retained evidence",
    skillVersionId: skill.activeVersion.id,
    predecessorTipIds: [builderTip.id],
  });
  const verifier = await issueManualRun(ctx, verifierTip.id, {
    executionRole: "VERIFIER",
    ...verifierPair,
    instruction: "Verify independently against the accepted contract.",
  });
  const verifierCompletion = await importCompletionReport(
    ctx,
    verifier.run.id,
    completionReport,
  );
  await transitionMission(ctx, mission.id, "BUILDING", {
    reason: "execution complete",
  });
  const scenario = await createVerificationScenario(ctx, mission.id, {
    code: "VG-01",
    title: "Accepted requirement passes",
    kind: "REQUIREMENT",
    method: "Trace the approved requirement to retained execution evidence.",
    expectedOutcome: "Coverage and evidence are explicit.",
    required: true,
    requirementId: requirement.id,
  });
  return {
    ctx,
    mission,
    requirement,
    scenario,
    verifier,
    verifierCompletion,
    claimVersion: corroborated.version,
  };
}

function verifyReport(
  data: Awaited<ReturnType<typeof fixture>>,
  overallStatus: "READY" | "READY_WITH_DEFERRED" | "NOT_READY" = "READY",
) {
  const evidenceArtifactIds = [data.verifierCompletion.artifact.id];
  return {
    requirementCoverage: [
      {
        requirementId: data.requirement.id,
        result: "PASS" as const,
        method: "Approved requirement traced to immutable verifier output.",
        evidenceArtifactIds,
      },
    ],
    scenarioResults: [
      {
        scenarioId: data.scenario.id,
        result: "PASS" as const,
        severity: null,
        detail: "Expected governed behavior observed.",
        evidenceArtifactIds,
      },
    ],
    technicalHealth,
    corruptionTests: [
      {
        code: "VG-CORRUPT-01",
        title: "Tampered evidence digest",
        method: "Mutate the digest and require deterministic rejection.",
        result: "PASS" as const,
        severity: "P0" as const,
        detail: "Corrupt evidence was rejected.",
        evidenceArtifactIds,
      },
    ],
    overallStatus,
    deferredItems: [],
  };
}

describe("Verification Governance", () => {
  it("VG-01..07 runs an independent four-section verification into REVIEW", async () => {
    const data = await fixture();
    const run = await beginVerificationRun(
      data.ctx,
      data.mission.id,
      data.verifier.run.id,
    );
    expect(run.independenceStatus).toBe("INDEPENDENT");
    expect(
      await getDb().mission.findUniqueOrThrow({ where: { id: data.mission.id } }),
    ).toMatchObject({ status: "VERIFYING" });

    const completed = await completeVerificationRun(
      data.ctx,
      run.id,
      verifyReport(data),
    );
    expect(completed.report.overallStatus).toBe("READY");
    await recordGovernanceSignoff(data.ctx, completed.report.id, {
      signoffType: "VERIFICATION",
      decision: "APPROVED",
      rationale: "Independent report and corruption evidence accepted.",
    });
    await transitionMission(data.ctx, data.mission.id, "REVIEW", {
      reason: "verification accepted",
    });
    expect((await getVerificationProjection(data.ctx, data.mission.id)).counts).toMatchObject({
      scenarios: 1,
      activeRuns: 0,
      reports: 1,
      notReady: 0,
      signoffs: 1,
    });
    await expect(
      ownerQuery(
        `UPDATE verification_report SET overall_status='NOT_READY' WHERE id='${completed.report.id}'`,
      ),
    ).rejects.toThrow(/append-only/i);
  });

  it("VG-08 fails closed when a Research verifier reuses the builder pair", async () => {
    const data = await fixture("RESEARCH", {
      providerName: "builder-provider",
      modelName: "builder-v1",
    });
    await expect(
      beginVerificationRun(data.ctx, data.mission.id, data.verifier.run.id),
    ).rejects.toMatchObject({ code: "VERIFIER_NOT_INDEPENDENT" });
    expect(
      await getDb().verificationRun.count({ where: { missionId: data.mission.id } }),
    ).toBe(0);
    expect(
      await getDb().mission.findUniqueOrThrow({ where: { id: data.mission.id } }),
    ).toMatchObject({ status: "BUILDING" });
  });

  it("VG-09..11 rejects contradictory status and serializes completion", async () => {
    const data = await fixture();
    const run = await beginVerificationRun(
      data.ctx,
      data.mission.id,
      data.verifier.run.id,
    );
    await expect(
      completeVerificationRun(data.ctx, run.id, verifyReport(data, "NOT_READY")),
    ).rejects.toMatchObject({ code: "VERIFY_REPORT_INVALID" });
    const outcomes = await Promise.allSettled([
      completeVerificationRun(data.ctx, run.id, verifyReport(data)),
      completeVerificationRun(data.ctx, run.id, verifyReport(data)),
    ]);
    expect(outcomes.filter((outcome) => outcome.status === "fulfilled")).toHaveLength(1);
    expect(outcomes.filter((outcome) => outcome.status === "rejected")).toHaveLength(1);
    expect(
      await getDb().verificationReport.count({ where: { verificationRunId: run.id } }),
    ).toBe(1);
  });

  it("VG-12..16 authorizes an exact public manifest and only then projects release", async () => {
    const data = await fixture();
    const run = await beginVerificationRun(
      data.ctx,
      data.mission.id,
      data.verifier.run.id,
    );
    const { report } = await completeVerificationRun(
      data.ctx,
      run.id,
      verifyReport(data),
    );
    await recordGovernanceSignoff(data.ctx, report.id, {
      signoffType: "VERIFICATION",
      decision: "APPROVED",
      rationale: "Verification evidence accepted.",
    });
    await transitionMission(data.ctx, data.mission.id, "REVIEW", {
      reason: "ready for release governance",
    });
    await expect(
      authorizeGovernedRelease(data.ctx, data.mission.id, {
        verificationReportId: report.id,
        visibility: "PUBLIC",
        claimVersionIds: [data.claimVersion.id],
        methods: ["Independent verifier", "Corruption test"],
        limitations: ["Bounded to retained evidence captured on 2026-07-23."],
      }),
    ).rejects.toMatchObject({ code: "GOVERNANCE_SIGNOFF_REQUIRED" });

    await recordGovernanceSignoff(data.ctx, report.id, {
      signoffType: "RELEASE",
      decision: "APPROVED",
      rationale: "Public methods and limitations are explicit.",
    });
    const approved = await authorizeGovernedRelease(data.ctx, data.mission.id, {
      verificationReportId: report.id,
      visibility: "PUBLIC",
      claimVersionIds: [data.claimVersion.id],
      methods: ["Independent verifier", "Corruption test"],
      limitations: ["Bounded to retained evidence captured on 2026-07-23."],
    });
    expect(approved.manifest.contentHash).toMatch(/^[0-9a-f]{64}$/);
    expect(await listApprovedReleaseProjections(data.ctx)).toHaveLength(0);
    await transitionMission(data.ctx, data.mission.id, "RELEASED", {
      reason: "approved immutable release manifest",
    });
    const projection = await listApprovedReleaseProjections(data.ctx);
    expect(projection).toHaveLength(1);
    expect(projection[0].manifest?.contentHash).toBe(
      approved.manifest.contentHash,
    );
    await expect(
      ownerQuery(
        `UPDATE release_manifest SET limitations=ARRAY['hidden'] WHERE id='${approved.manifest.id}'`,
      ),
    ).rejects.toThrow(/append-only/i);
  });
});
