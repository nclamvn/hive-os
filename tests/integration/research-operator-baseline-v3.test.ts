import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { claimJobs, dispatchOutboxBatch } from "@/modules/command-runtime";
import { createMission } from "@/modules/mission-kernel";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { requestResearchRun } from "@/modules/research-sandbox/kernel";
import { executeResearchJob } from "@/modules/research-sandbox/worker";
import { requestMathPilotAgentReview } from "@/modules/research-sandbox/agent-review-request";
import { executeMathPilotAgentReviewJob } from "@/modules/research-sandbox/agent-review-kernel";
import { mathPilotScope, resolveMathPilotContract, type MathPilotRequest } from "@/modules/research-sandbox/math-pilot";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";
import { asOwner, createUser } from "./helpers";

// No truncation: this owned QA organization retains both success and refusal.
// The baseline is fixed before generic integration and is not selected for a win.
const CANDIDATE = '{"kind":"INTEGER_WITNESS","values":["2","3"]}';
const PINS = {
  "src/modules/research-sandbox/worker.ts": "d6a8b8f2022d53e473064914f8f3af8bb9669f9ec3964a4647f7f246e8c83bbb",
  "src/modules/research-sandbox/agent-review-request.ts": "4dc726143379e12b21ca4001363395a5a3b8207ccbce3037d1561c546840a8cf",
  "src/modules/research-sandbox/agent-review-kernel.ts": "03912151a298e746b4465e94ca6c2b1166c248125a5d60dea79483682c073dcf",
};
const DISPATCHER = "src/server/workers/research-sandbox-cycle.ts";
const FROZEN_BASELINE_DISPATCHER = "dedada6c512b22da37c2e124a57d1eb8f5740464e640d6330a8fff6f83d1f8ff";
const USAGE = { inputTokens: 100, outputTokens: 50, cachedInputTokens: 0, reasoningOutputTokens: 10 };
const sha = (s: string | Buffer) => createHash("sha256").update(s).digest("hex");

describe("fixed observed legacy operator baseline, controlled provider only", () => {
  it("retains actual x+y=5 automatic review and zero routine continuation, never inventing one", async () => {
    expect(new URL(process.env.DATABASE_URL!).pathname).toBe("/hiveos_test");
    for (const [file, pin] of Object.entries(PINS)) expect(sha(await readFile(file))).toBe(pin);
    const dispatcherPin = sha(await readFile(DISPATCHER));
    const owner = await asOwner(await createUser("tip076-baseline"));
    const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
    const organizationId = workspace.organizationId;
    const mission = await createMission(owner, { title: "TIP076 fixed baseline x+y=5, synthetic engineering only" });
    const receipts: { caseId: string; runId: string; solverJobId: string; reviewJobId: string; commandId: string; kind: string }[] = [];
    const recordInvocation = async (jobId: string, role: string) => {
      await getDb().auditEvent.create({ data: { workspaceId: workspace.id, actorUserId: owner.user.id,
        eventType: "tip076.controlled-provider.invoked", entityType: "DurableJob", entityId: jobId,
        correlationId: owner.correlationId, payload: { provenance: "CONTROLLED_TEST_PROVIDER_NOT_LIVE_MODEL", role, usage: USAGE } } });
    };
    const open: MathPilotRequest = { caseType: "OPEN", statement: "Find positive integers x and y such that x+y=5.",
      definitions: "x and y are positive integers; addition is exact integer addition.",
      assumptions: "Only existence for the single sealed equation x+y=5 is requested.",
      falsificationCriterion: "A proposed pair with nonpositive entries or sum different from 5 fails.",
      successCriterion: "Return only the exact JSON positive integer witness; no universal or novelty claim.",
      exclusions: "No domain changes, universal theorem, research novelty or human mathematical acceptance." };
    for (const request of [{ caseType: "CALIBRATION_PROOF" }, { caseType: "CALIBRATION_COUNTEREXAMPLE" }, open] as MathPilotRequest[]) {
      const contract = resolveMathPilotContract(request);
      const result = await requestResearchRun(owner, { missionId: mission.id, documentId: null,
        question: contract.statement, scope: mathPilotScope(contract), providerName: "codex-local", modelName: "gpt-6-sol",
        sourcePolicy: { allowedDomains: [], primaryDomains: [], requirePrimary: false, maxSources: 5 },
        queryPlan: { queries: [contract.statement], languages: ["en"] }, mathPilot: request,
        idempotencyKey: `tip076-baseline:${randomUUID()}` });
      expect(result.status, JSON.stringify(result)).toBe("SUCCEEDED");
      if (result.status !== "SUCCEEDED") throw new Error("Baseline request refused");
      const runId = String(result.outcome.runId);
      await dispatchOutboxBatch({ organizationId, actorUserId: owner.user.id, workerId: "baseline-dispatcher" });
      const [solver] = await claimJobs({ organizationId, actorUserId: owner.user.id, workerId: "baseline-worker",
        jobTypes: ["math-pilot.codex-local.execute"] });
      expect(solver).toBeDefined();
      const argument = request.caseType === "CALIBRATION_PROOF" ? "Let n=2k. Then n^2=4k^2=2(2k^2), which is even."
        : request.caseType === "CALIBRATION_COUNTEREXAMPLE" ? "The number 2 is prime, since its only divisors are 1 and 2, but 2 is even." : CANDIDATE;
      await executeResearchJob({ organizationId, actorUserId: owner.user.id, workerId: "baseline-worker",
        jobId: solver!.id, expectedVersion: solver!.version, correlationId: owner.correlationId,
        provider: { providerName: "codex-local", modelName: "gpt-6-sol", async execute() {
          await recordInvocation(solver!.id, "SOLVER");
          return { providerName: this.providerName, modelName: this.modelName, sources: [],
            findings: [{ key: "no-source", kind: "HONEST_NULL", claim: "Controlled fixture; no external source captured.",
              sourceKey: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0 }],
            mathAttempt: { providerName: "codex-local", modelName: "gpt-6-sol", threadId: `fixture-solver-${solver!.id}`,
              attemptType: request.caseType === "CALIBRATION_COUNTEREXAMPLE" ? "COUNTEREXAMPLE_ATTEMPT" : "PROOF_ATTEMPT",
              argument, candidateCounterexample: request.caseType === "CALIBRATION_COUNTEREXAMPLE" ? "2" : null,
              selfChecks: [], limitations: ["Synthetic controlled provider, not live AI or real mathematical reviewer."], usage: USAGE } };
        } } });
      const pilotCase = await withOrganizationTenant(organizationId, owner.user.id, tx => tx.mathPilotCase.findFirstOrThrow({ where: { researchRunId: runId } }));
      const autoOutbox = await withOrganizationTenant(organizationId, owner.user.id, tx => tx.outboxEvent.findMany({
        where: { aggregateId: pilotCase.id, topic: "math-pilot.codex-local.review" } }));
      expect(autoOutbox).toHaveLength(1);
      if (request.caseType === "OPEN") {
        const duplicate = await requestMathPilotAgentReview(owner, pilotCase.id);
        expect(duplicate.status).toBe("FAILED"); // Optional duplicate is NOT a needed operator prompt.
      }
      await dispatchOutboxBatch({ organizationId, actorUserId: owner.user.id, workerId: "baseline-dispatcher" });
      const [review] = await claimJobs({ organizationId, actorUserId: owner.user.id, workerId: "baseline-worker",
        jobTypes: ["math-pilot.codex-local.review"] });
      expect(review).toBeDefined();
      await executeMathPilotAgentReviewJob({ organizationId, actorUserId: owner.user.id, workerId: "baseline-worker",
        jobId: review!.id, expectedVersion: review!.version, correlationId: owner.correlationId,
        reviewer: { modelName: "gpt-6-sol", async review() {
          for (const role of ["CRITIC", "ADVERSARY"]) await recordInvocation(review!.id, role);
          return (["CRITIC", "ADVERSARY"] as const).map(role => ({ role, verdict: "SUPPORTS" as const,
            candidateConclusion: request.caseType === "CALIBRATION_COUNTEREXAMPLE" ? "VALID_COUNTEREXAMPLE" as const
              : request.caseType === "CALIBRATION_PROOF" ? "SUPPORTED_ARGUMENT" as const : "PARTIAL" as const,
            exactQuote: request.caseType === "CALIBRATION_PROOF" ? "n^2=4k^2" : request.caseType === "CALIBRATION_COUNTEREXAMPLE" ? "2 is prime" : CANDIDATE,
            reasoning: "Controlled engineering review checks the exact retained target and candidate scope.",
            checks: ["Exact candidate and stated domain checked; this is not a real participant."], unresolvedGap: null,
            threadId: `fixture-${role}-${review!.id}`, usage: USAGE })) as Awaited<ReturnType<Parameters<typeof executeMathPilotAgentReviewJob>[0]["reviewer"]["review"]>>;
        } } });
      receipts.push({ caseId: pilotCase.id, runId, solverJobId: solver!.id, reviewJobId: review!.id, commandId: result.commandId, kind: request.caseType });
    }
    const observed = await withOrganizationTenant(organizationId, owner.user.id, async tx => ({
      run: await tx.researchRun.findUniqueOrThrow({ where: { id: receipts[2].runId } }),
      review: await tx.mathPilotAgentReview.findUniqueOrThrow({ where: { caseId: receipts[2].caseId } }),
      commands: await tx.commandRecord.findMany({ where: { organizationId }, orderBy: { createdAt: "asc" } }),
      jobs: await tx.durableJob.findMany({ where: { organizationId, id: { in: receipts.flatMap(r => [r.solverJobId, r.reviewJobId]) } } }),
    }));
    const invocations = await getDb().auditEvent.findMany({ where: { workspaceId: workspace.id, eventType: "tip076.controlled-provider.invoked" } });
    expect((observed.run.mathModelAttempt as { argument: string }).argument).toBe(CANDIDATE);
    expect(observed.jobs).toHaveLength(6); expect(observed.jobs.every(j => j.status === "SUCCEEDED")).toBe(true);
    expect(invocations).toHaveLength(9);
    expect(observed.commands.filter(c => c.commandType === "math-pilot.agent-review.request")).toHaveLength(1);
    expect(observed.commands.find(c => c.commandType === "math-pilot.agent-review.request")?.status).toBe("FAILED");
    for (const [file, pin] of Object.entries(PINS)) expect(sha(await readFile(file))).toBe(pin);
    expect(sha(await readFile(DISPATCHER))).toBe(dispatcherPin);
    const body = { version: 3, provenance: "ACTUAL_ISOLATED_DB_CONTROLLED_PROVIDER_NOT_LIVE_MODEL", organizationId,
      workspaceId: workspace.id, missionId: mission.id, sourcePins: { ...PINS, [DISPATCHER]: dispatcherPin }, receipts,
      frozenBaselineDispatcher: FROZEN_BASELINE_DISPATCHER,
      observationPurpose: dispatcherPin === FROZEN_BASELINE_DISPATCHER ? "ORIGINAL_FIXED_BASELINE" : "LEGACY_COMPATIBILITY_RERUN_NOT_BASELINE_REPLACEMENT",
      candidateBytes: CANDIDATE, candidateDigest: sha(CANDIDATE), routineContinuationCommands: 0,
      duplicateRequestRefusals: 1, prerequisiteCases: 2, jobsSucceeded: observed.jobs.length,
      actualControlledInvocations: invocations.length, simulatedTokens: invocations.length * 150,
      actualModel: "UNKNOWN", actualPrice: "UNKNOWN", realUserMinutes: "UNKNOWN",
      reduction: "UNDEFINED_ZERO_LEGACY_DENOMINATOR", efficacy: "NOT_ESTABLISHED",
      legacyDisposition: observed.review.disposition, legacyConclusion: observed.review.conclusion };
    const observation = { ...body, digest: sha(canonicalJson(body)) };
    await getDb().auditEvent.create({ data: { workspaceId: workspace.id, actorUserId: owner.user.id,
      eventType: "tip076.operator-baseline.observed", entityType: "Mission", entityId: mission.id,
      correlationId: owner.correlationId, payload: observation } });
    console.log("TIP076_LEGACY_BASELINE", JSON.stringify(observation));
  }, 30_000);
});
