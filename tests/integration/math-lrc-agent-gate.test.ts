import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { claimJobs, dispatchOutboxBatch } from "@/modules/command-runtime";
import { createMission } from "@/modules/mission-kernel";
import { executeMathPilotAgentReviewJob } from "@/modules/research-sandbox/agent-review-kernel";
import { executeResearchJob, requestResearchRun, requestMathResearchCycle, resolveMathPilotContract, mathPilotScope, type MathPilotRequest, type ResearchProvider } from "@/modules/research-sandbox";
import { digestResearchResult } from "@/modules/research-sandbox/integrity";
import { validateRecordedMathAgentReview, type MathAgentReport } from "@/modules/research-sandbox/agent-review";
import * as replay from "@/modules/research-sandbox/math-lrc-replay";
import { getDb } from "@/server/db";
import { withOrganizationTenant, type TenantTransaction } from "@/server/tenant-context";
import { asOwner, createUser, truncateAll } from "./helpers";

beforeEach(async () => { await truncateAll(); });
const usage = { inputTokens: 100, cachedInputTokens: 0, outputTokens: 40, reasoningOutputTokens: 0 };
const finiteArgument = "The retained finite grid certificate is checked; it does not prove continuous-time or universal LRC.";
function reports(argument: string, conclusion: MathAgentReport["candidateConclusion"], id: string): [MathAgentReport, MathAgentReport] {
  return (["CRITIC", "ADVERSARY"] as const).map((role) => ({ role, verdict: "SUPPORTS" as const, candidateConclusion: conclusion,
    exactQuote: argument.slice(0, 24), reasoning: "Checked the exact stated domain and finite-versus-universal distinction.", checks: ["Checked the explicit algebraic or finite witness."], unresolvedGap: null, threadId: `${role}-${id}`, usage })) as [MathAgentReport, MathAgentReport];
}

describe("LRC certificate worker and review composition (isolated database)", () => {
  it("runs pinned Python before the model fence, retains host evidence, blocks injection and downgrade, and excludes ES cycles", async () => {
    const owner = await asOwner(await createUser("lrc-owner"));
    const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
    const mission = await createMission(owner, { title: "Finite LRC certificate gate" });
    const runtime = { organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "lrc-worker", correlationId: owner.correlationId };
    const scoped = <T>(read: (tx: TenantTransaction) => Promise<T>) => withOrganizationTenant(runtime.organizationId, runtime.actorUserId, read);
    async function request(mathPilot: MathPilotRequest, providerName = "codex-local") {
      const contract = resolveMathPilotContract(mathPilot);
      return requestResearchRun(owner, { missionId: mission.id, documentId: null, question: contract.statement, scope: mathPilotScope(contract), providerName, modelName: "gpt-6-sol", sourcePolicy: { allowedDomains: [], primaryDomains: [], requirePrimary: false, maxSources: 5 }, queryPlan: { queries: [contract.statement], languages: ["en"] }, mathPilot, idempotencyKey: randomUUID() });
    }
    async function job(type: string) {
      await dispatchOutboxBatch({ ...runtime, workerId: "lrc-dispatcher" });
      const [claimed] = await claimJobs({ ...runtime, jobTypes: [type] });
      expect(claimed).toBeDefined(); return claimed!;
    }
    async function provider(argument: string, thread: string, counter: string | null = null, inspect?: (input: Parameters<ResearchProvider["execute"]>[0]) => Promise<void>, inject = false): Promise<ResearchProvider> {
      return { providerName: "codex-local", modelName: "gpt-6-sol", async execute(input) {
        await inspect?.(input);
        return { providerName: "codex-local", modelName: "gpt-6-sol", sources: [], findings: [{ key: "no-source", kind: "HONEST_NULL", claim: "No external source captured.", sourceKey: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0 }], mathAttempt: { providerName: "codex-local", modelName: "gpt-6-sol", threadId: thread, attemptType: counter ? "COUNTEREXAMPLE_ATTEMPT" : "PROOF_ATTEMPT", argument, candidateCounterexample: counter, selfChecks: [], limitations: [], usage, ...(inject ? { lrcEvidence: input.lrcEvidence } : {}) } };
      } };
    }
    for (const caseType of ["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE"] as const) {
      expect((await request({ caseType })).status).toBe("SUCCEEDED");
      const solverJob = await job("math-pilot.codex-local.execute");
      const argument = caseType === "CALIBRATION_PROOF" ? "Let n=2k. Then n^2=4k^2=2(2k^2), which is even." : "The number 2 is prime, since its only positive divisors are 1 and 2, but 2 is not odd.";
      await executeResearchJob({ ...runtime, jobId: solverJob.id, expectedVersion: solverJob.version, provider: await provider(argument, `calibration-${caseType}`, caseType === "CALIBRATION_COUNTEREXAMPLE" ? "2" : null) });
      const reviewJob = await job("math-pilot.codex-local.review");
      await executeMathPilotAgentReviewJob({ ...runtime, jobId: reviewJob.id, expectedVersion: reviewJob.version, reviewer: { modelName: "gpt-6-sol", async review(_c, a, _r, _i, e) { expect(e).toBeUndefined(); expect(a.lrcEvidence).toBeUndefined(); return reports(argument, caseType === "CALIBRATION_PROOF" ? "SUPPORTED_ARGUMENT" : "VALID_COUNTEREXAMPLE", caseType); } } });
    }
    const finite = { caseType: "LRC_FINITE" as const, preset: "GRID_6_14" as const };
    await expect(request(finite, "openai")).rejects.toThrow(/local Codex/);
    const requested = await request(finite); expect(requested.status).toBe("SUCCEEDED");
    const solverJob = await job("math-pilot.codex-local.execute"); let trusted: replay.LrcCertificateEvidence | undefined;
    const execute = vi.fn(async (input: Parameters<ResearchProvider["execute"]>[0]) => {
      trusted = input.lrcEvidence; expect(trusted?.primary.gridExcludedTuples).toBe(1);
      const pilot = await scoped((tx) => tx.mathPilotCase.findFirstOrThrow({ where: { missionId: mission.id, caseType: "OPEN" } }));
      const run = await scoped((tx) => tx.researchRun.findUniqueOrThrow({ where: { id: pilot.researchRunId } }));
      expect(run.providerDispatchAttemptedAt).not.toBeNull();
      expect(replay.validateRetainedLrcEvidence(trusted, resolveMathPilotContract(finite).lrcFiniteScope!, pilot.contractDigest)).toBe(true);
    });
    await executeResearchJob({ ...runtime, jobId: solverJob.id, expectedVersion: solverJob.version, provider: await provider(finiteArgument, "lrc-author", null, execute) });
    expect(execute).toHaveBeenCalledOnce();
    const pilot = await scoped((tx) => tx.mathPilotCase.findFirstOrThrow({ where: { missionId: mission.id, caseType: "OPEN" }, include: { researchRun: true } }));
    expect(pilot.caseType).toBe("OPEN"); const retained = pilot.researchRun.mathModelAttempt as unknown as { lrcEvidence: replay.LrcCertificateEvidence };
    expect(retained.lrcEvidence).toEqual(trusted);
    expect(pilot.researchRun.mathModelAttemptDigest).toBe(digestResearchResult(retained));
    const reviewJob = await job("math-pilot.codex-local.review"); const review = vi.fn(async (_c, a, _r, _i, e) => { expect(e).toEqual(trusted); expect(a.lrcEvidence).toEqual(trusted); return reports(finiteArgument, "SUPPORTED_ARGUMENT", "finite"); });
    await executeMathPilotAgentReviewJob({ ...runtime, jobId: reviewJob.id, expectedVersion: reviewJob.version, reviewer: { modelName: "gpt-6-sol", review } });
    const recorded = await scoped((tx) => tx.mathPilotAgentReview.findUniqueOrThrow({ where: { caseId: pilot.id } }));
    expect(recorded.conclusion).toBe("PARTIAL"); expect(recorded.ledger).toMatchObject({ version: 4, lrcEvidence: { evidenceDigest: trusted!.evidenceDigest } });
    const input = { contract: pilot.contract, contractDigest: pilot.contractDigest, attempt: retained, attemptDigest: pilot.researchRun.mathModelAttemptDigest, researchDigest: recorded.researchDigest, review: recorded };
    expect(validateRecordedMathAgentReview(input)).not.toBeNull();
    const stripped = { ...retained }; delete (stripped as Partial<typeof stripped>).lrcEvidence;
    expect(validateRecordedMathAgentReview({ ...input, attempt: stripped, attemptDigest: digestResearchResult(stripped), review: { ...recorded, attemptDigest: digestResearchResult(stripped) } })).toBeNull();
    const cycle = await requestMathResearchCycle(owner, { caseId: pilot.id, maxRounds: 1, maxObservedTokens: 10000 }); expect(cycle.status).not.toBe("SUCCEEDED");

    // Tool unavailable: no model callback and no provider single-dispatch stamp.
    expect((await request(finite)).status).toBe("SUCCEEDED"); const blockedJob = await job("math-pilot.codex-local.execute");
    const failedTool = vi.spyOn(replay, "runLrcCertificateEvidence").mockRejectedValueOnce(new Error("independent replay unavailable"));
    const noModel = vi.fn();
    try {
      await expect(executeResearchJob({ ...runtime, jobId: blockedJob.id, expectedVersion: blockedJob.version, provider: await provider(finiteArgument, "blocked", null, noModel) })).rejects.toThrow(/unavailable/);
    } finally { failedTool.mockRestore(); }
    expect(noModel).not.toHaveBeenCalled();
    const failedRun = await scoped((tx) => tx.researchRun.findFirstOrThrow({ where: { jobId: blockedJob.id } }));
    expect(failedRun.providerDispatchAttemptedAt).toBeNull(); expect(failedRun.mathModelAttempt).toBeNull();

    // Provider tries returning host evidence: even a valid copied envelope is rejected.
    expect((await request(finite)).status).toBe("SUCCEEDED"); const injectedJob = await job("math-pilot.codex-local.execute");
    await expect(executeResearchJob({ ...runtime, jobId: injectedJob.id, expectedVersion: injectedJob.version, provider: await provider(finiteArgument, "injected", null, undefined, true) })).rejects.toThrow(/LRC evidence/);
    const injectedRun = await scoped((tx) => tx.researchRun.findFirstOrThrow({ where: { jobId: injectedJob.id } }));
    expect(injectedRun.failureCode).toBe("INTEGRITY_FAILURE"); expect(injectedRun.mathModelAttempt).toBeNull();

    // Removing an envelope from a retained attempt is forbidden by the existing
    // database freeze trigger. Do not disable that stronger immutability gate.
    expect((await request(finite)).status).toBe("SUCCEEDED"); const missingJob = await job("math-pilot.codex-local.execute");
    await executeResearchJob({ ...runtime, jobId: missingJob.id, expectedVersion: missingJob.version, provider: await provider(finiteArgument, "missing-author") });
    await job("math-pilot.codex-local.review");
    const missingRun = await scoped((tx) => tx.researchRun.findFirstOrThrow({ where: { jobId: missingJob.id } }));
    const missingAttempt = { ...(missingRun.mathModelAttempt as Prisma.JsonObject) }; delete missingAttempt.lrcEvidence;
    const missingDigest = digestResearchResult(missingAttempt);
    await expect(withOrganizationTenant(runtime.organizationId, runtime.actorUserId, async (tx) => {
      await tx.researchRun.update({ where: { id: missingRun.id }, data: { mathModelAttempt: missingAttempt, mathModelAttemptDigest: missingDigest } });
    })).rejects.toThrow();
    const unchanged = await scoped((tx) => tx.researchRun.findUniqueOrThrow({ where: { id: missingRun.id } }));
    expect(unchanged.mathModelAttemptDigest).toBe(missingRun.mathModelAttemptDigest);
    expect(unchanged.mathModelAttempt).toEqual(missingRun.mathModelAttempt);
  }, 90000);
});
