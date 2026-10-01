import { createHash, randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { createMission } from "@/modules/mission-kernel";
import { listMathPilotCases, listMathPilotCaseSummaries, requestResearchRun } from "@/modules/research-sandbox/kernel";
import { listMathResearchCyclePage } from "@/modules/research-sandbox/math-cycle-kernel";
import { mathCycleEventDigest, type MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";
import { loadMathCalibrationReadiness } from "@/modules/research-sandbox/math-dossier-loader";
import { decodeDossierCursor, encodeDossierCursor } from "@/modules/research-sandbox/math-dossier-pagination";
import { MATH_PILOT_CALIBRATIONS, MATH_PILOT_BENCHMARK, MATH_REVIEW_CRITERIA,
  digestMathPilotContract, digestMathReviewChecklist, mathPilotScope } from "@/modules/research-sandbox/math-pilot";
import { researchDossierDigest } from "@/modules/research-sandbox/integrity";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";
import { asOwner, createUser, truncateAll } from "./helpers";
beforeEach(truncateAll);
type Context = Awaited<ReturnType<typeof asOwner>>;

/** Synthetic retained test evidence, NOT a model execution or human attestation.
 * Inserts only into guarded hiveos_test; no ledger overwrite or worker dispatch. */
async function seedCases(ctx: Context, missionId: string, pending: number, invalidCandidates = 0) {
  const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: ctx.workspace.id } });
  return withOrganizationTenant(workspace.organizationId, ctx.user.id, async (tx) => {
    const actor = await tx.organizationMembership.findUniqueOrThrow({ where: { organizationId_userId: {
      organizationId: workspace.organizationId, userId: ctx.user.id } } });
    const rows = Array.from({ length: 2 + pending + invalidCandidates }, (_, index) => {
      const caseType = index % 2 ? "CALIBRATION_COUNTEREXAMPLE" as const : "CALIBRATION_PROOF" as const;
      const contract = MATH_PILOT_CALIBRATIONS[caseType], commandId = randomUUID(), runId = randomUUID(), id = randomUUID();
      const createdAt = new Date(Date.UTC(2026, 0, 1, 0, 0, index));
      const approved = index < 2 || index >= 2 + pending;
      const digest = researchDossierDigest({ sources: [], findings: [] });
      return { id, runId, commandId, caseType, contract, createdAt, approved, digest, valid: index < 2 };
    });
    await tx.commandRecord.createMany({ data: rows.map((row) => ({ id: row.commandId,
      organizationId: workspace.organizationId, workspaceId: ctx.workspace.id, actorUserId: ctx.user.id,
      actorOrganizationMembershipId: actor.id, correlationId: ctx.correlationId, idempotencyKey: `dossier-fixture:${row.id}`,
      commandType: "dossier.fixture", issuedAt: row.createdAt, createdAt: row.createdAt,
      payload: {}, payloadHash: createHash("sha256").update("{}").digest("hex"), status: "SUCCEEDED",
      completedAt: row.createdAt, outcome: { runId: row.runId, status: "QUEUED" } })) });
    await tx.researchRun.createMany({ data: rows.map((row) => ({ id: row.runId,
      organizationId: workspace.organizationId, workspaceId: ctx.workspace.id, missionId, commandId: row.commandId,
      requestedByMembershipId: ctx.membership.id, question: row.contract.statement, scope: mathPilotScope(row.contract),
      sourcePolicy: { allowedDomains: [], primaryDomains: [], requirePrimary: false, maxSources: 5 }, queryPlan: { queries: [row.contract.statement], languages: ["en"] },
      providerName: "test-research", modelName: "research-v1", status: row.approved ? "APPROVED" : "QUEUED",
      approvedDigest: row.approved ? row.digest : null, createdAt: row.createdAt })) });
    await tx.mathPilotCase.createMany({ data: rows.map((row) => ({ id: row.id, organizationId: workspace.organizationId,
      workspaceId: ctx.workspace.id, missionId, researchRunId: row.runId, caseType: row.caseType,
      contract: row.contract, contractDigest: digestMathPilotContract(row.contract), createdAt: row.createdAt })) });
    const checklist = { version: 1 as const, independentVerification: true as const,
      checks: MATH_REVIEW_CRITERIA.map((criterion) => ({ criterion, verdict: "VERIFIED" as const, note: "Synthetic independent-check fixture, not a live attestation." })) };
    await tx.mathPilotAssessment.createMany({ data: rows.filter((row) => row.approved).map((row) => ({
      id: randomUUID(), organizationId: workspace.organizationId, workspaceId: ctx.workspace.id, missionId,
      caseId: row.id, reviewerMembershipId: ctx.membership.id, conclusion: row.caseType === "CALIBRATION_PROOF" ? "SUPPORTED_ARGUMENT" : "VALID_COUNTEREXAMPLE",
      rationale: "Synthetic retained dossier fixture only.", verificationNotes: "Not live scientific or human sign-off.",
      researchDigest: row.digest, reviewChecklist: checklist,
      reviewChecklistDigest: row.valid ? digestMathReviewChecklist(checklist) : "b".repeat(64) })) });
    return rows;
  });
}

describe("authorized bounded Math Pilot dossier", () => {
  it("paginates summaries deterministically and retrieves older selected details without unrelated bodies", async () => {
    const owner = await asOwner(await createUser("dossier-owner"));
    const mission = await createMission(owner, { title: "Dossier history" });
    const rows = await seedCases(owner, mission.id, 28);
    const first = await listMathPilotCaseSummaries(owner, mission.id);
    expect(first.total).toBe(30); expect(first.items).toHaveLength(20); expect(first.nextCursor).not.toBeNull();
    const second = await listMathPilotCaseSummaries(owner, mission.id, decodeDossierCursor(first.nextCursor, mission.id));
    expect(second.items).toHaveLength(10); expect(second.nextCursor).toBeNull();
    expect(new Set([...first.items, ...second.items].map((item) => item.id)).size).toBe(30);
    const old = await listMathPilotCases(owner, mission.id, { ids: [rows[0]!.id] });
    expect(old).toHaveLength(1); expect(old[0]?.id).toBe(rows[0]?.id);
    expect(first.items.some((item) => item.id === rows[0]?.id)).toBe(false);
    const another = await createMission(owner, { title: "Another dossier" });
    expect(await listMathPilotCases(owner, another.id, { ids: [rows[0]!.id] })).toEqual([]);
    const foreign = await asOwner(await createUser("foreign-dossier-owner"));
    const foreignMission = await createMission(foreign, { title: "Foreign dossier" });
    expect(await listMathPilotCases(foreign, foreignMission.id, { ids: [rows[0]!.id] })).toEqual([]);
    await expect(listMathPilotCases(owner, mission.id, { ids: [rows[0]!.id, rows[0]!.id] })).rejects.toThrow();
  }, 30_000);

  it("keeps older accepted calibrations visible and authoritative despite 501 newer pending cases", async () => {
    const owner = await asOwner(await createUser("dossier-calibration-owner"));
    const mission = await createMission(owner, { title: "Calibration is not presentation" });
    const rows = await seedCases(owner, mission.id, 501);
    const summary = await listMathPilotCaseSummaries(owner, mission.id);
    expect(summary.total).toBe(503); expect(summary.items.some((item) => item.id === rows[0]?.id)).toBe(false);
    const readiness = await loadMathCalibrationReadiness(owner, mission.id, "test-research", "research-v1");
    expect(readiness.complete).toBe(true); expect(readiness.passed.size).toBe(2); expect(readiness.inspected).toBe(2);
    const requested = await requestResearchRun(owner, { missionId: mission.id, documentId: null,
      question: MATH_PILOT_BENCHMARK.statement, scope: mathPilotScope(MATH_PILOT_BENCHMARK), providerName: "test-research", modelName: "research-v1",
      sourcePolicy: { allowedDomains: [], primaryDomains: [], requirePrimary: false, maxSources: 5 },
      queryPlan: { queries: [MATH_PILOT_BENCHMARK.statement], languages: ["en"] }, mathPilot: { caseType: "BENCHMARK_PROOF" },
      idempotencyKey: `dossier-calibration:${randomUUID()}` });
    expect(requested.status).toBe("SUCCEEDED");
  }, 30_000);

  it("fails readiness closed at the candidate cap without claiming a definitive missing calibration", async () => {
    const owner = await asOwner(await createUser("dossier-cap-owner"));
    const mission = await createMission(owner, { title: "Calibration scan ceiling" });
    await seedCases(owner, mission.id, 0, 200);
    const readiness = await loadMathCalibrationReadiness(owner, mission.id, "test-research", "research-v1");
    expect(readiness.complete).toBe(false); expect(readiness.passed.size).toBe(0); expect(readiness.inspected).toBe(200);
    const requested = await requestResearchRun(owner, { missionId: mission.id, documentId: null,
      question: MATH_PILOT_BENCHMARK.statement, scope: mathPilotScope(MATH_PILOT_BENCHMARK), providerName: "test-research", modelName: "research-v1",
      sourcePolicy: { allowedDomains: [], primaryDomains: [], requirePrimary: false, maxSources: 5 },
      queryPlan: { queries: [MATH_PILOT_BENCHMARK.statement], languages: ["en"] }, mathPilot: { caseType: "BENCHMARK_PROOF" },
      idempotencyKey: `dossier-cap:${randomUUID()}` });
    expect(requested.status).toBe("FAILED");
  }, 30_000);

  it("loads bounded complete cycle chains and authorizes direct historical cycle selection", async () => {
    const owner = await asOwner(await createUser("dossier-cycle-owner"));
    const mission = await createMission(owner, { title: "Bounded full chains" });
    const rows = await seedCases(owner, mission.id, 0);
    const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
    const ids = Array.from({ length: 7 }, () => randomUUID());
    await withOrganizationTenant(workspace.organizationId, owner.user.id, async (tx) => {
      await tx.mathResearchCycle.createMany({ data: ids.map((id, index) => ({
        id, organizationId: workspace.organizationId, workspaceId: owner.workspace.id, missionId: mission.id,
        rootCaseId: rows[0]!.id, rootContractDigest: digestMathPilotContract(rows[0]!.contract),
        rootAttemptDigest: "a".repeat(64), rootReviewDigest: "b".repeat(64), commandId: rows[0]!.commandId,
        status: "STOPPED", stopReason: "NO_GAP", completedRounds: 1,
        maxRounds: 2, maxCalls: 14, maxObservedTokens: 200_000, deadlineAt: new Date("2026-10-02"),
        createdAt: new Date(Date.UTC(2026, 0, 1, 0, 0, index)) })) });
      const jobs = ids.map((cycleId) => ({ id: randomUUID(), cycleId }));
      // Synthetic already-terminal fixture jobs, never dispatched/executed by a worker.
      await tx.durableJob.createMany({ data: jobs.map((job) => ({ id: job.id,
        organizationId: workspace.organizationId, workspaceId: owner.workspace.id,
        jobType: "math-pilot.cycle.round", payload: { cycleId: job.cycleId, round: 1 },
        status: "SUCCEEDED", completedAt: new Date("2026-01-02"), attempts: 1, maxAttempts: 1,
        result: { fixtureOnly: true, liveExecution: false } })) });
      const prior: MathCycleEventPayload = { phase: "PRIOR_ART", round: 1, facts: [], coverage: "CURATED_PARTIAL" };
      const stopped: MathCycleEventPayload = { phase: "STOPPED", round: 1, reason: "NO_GAP" };
      const firstDigest = mathCycleEventDigest(null, prior);
      await tx.mathResearchCycleEvent.createMany({ data: jobs.flatMap((job) => [
        { id: randomUUID(), organizationId: workspace.organizationId, workspaceId: owner.workspace.id,
          cycleId: job.cycleId, jobId: job.id, sequence: 1, round: 1, phase: prior.phase, payload: prior,
          previousDigest: null, digest: firstDigest },
        { id: randomUUID(), organizationId: workspace.organizationId, workspaceId: owner.workspace.id,
          cycleId: job.cycleId, jobId: job.id, sequence: 2, round: 1, phase: stopped.phase, payload: stopped,
          previousDigest: firstDigest, digest: mathCycleEventDigest(firstDigest, stopped) },
      ]) });
    });
    const first = await listMathResearchCyclePage(owner, mission.id, rows[0]!.id);
    expect(first.items).toHaveLength(3); expect(first.total).toBe(7); expect(first.hasMore).toBe(true);
    expect(first.items.every((item) => item.trace !== null)).toBe(true);
    for (const cycle of first.items) {
      expect(cycle.status).toBe("STOPPED"); expect(cycle.events).toHaveLength(2);
      expect(cycle.trace).toEqual([{ phase: "PRIOR_ART", round: 1, facts: [], coverage: "CURATED_PARTIAL" },
        { phase: "STOPPED", round: 1, reason: "NO_GAP" }]);
      expect(cycle.events[1]?.previousDigest).toBe(cycle.events[0]?.digest);
    }
    const cursor = decodeDossierCursor(encodeDossierCursor({ missionId: mission.id, scopeId: rows[0]!.id,
      id: first.last!.id, createdAt: first.last!.createdAt.toISOString() }), mission.id, rows[0]!.id);
    const second = await listMathResearchCyclePage(owner, mission.id, rows[0]!.id, cursor);
    expect(second.items).toHaveLength(3); expect(new Set([...first.items, ...second.items].map((item) => item.id)).size).toBe(6);
    const direct = await listMathResearchCyclePage(owner, mission.id, rows[0]!.id, null, ids[0]!);
    expect(direct.items.map((item) => item.id)).toEqual([ids[0]]);
    expect(direct.items[0]?.events).toHaveLength(2); expect(direct.items[0]?.trace).toHaveLength(2);
    expect((await listMathResearchCyclePage(owner, mission.id, rows[1]!.id, null, ids[0]!)).items).toEqual([]);
  }, 30_000);
});
