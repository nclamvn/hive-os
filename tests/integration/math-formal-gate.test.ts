import { randomUUID } from "node:crypto";

import { beforeEach, describe, expect, it } from "vitest";

import { claimJobs, dispatchOutboxBatch } from "@/modules/command-runtime";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { createMission } from "@/modules/mission-kernel";
import { executeResearchJob, listMathPilotCases, mathPilotScope, requestResearchRun,
  resolveMathPilotContract } from "@/modules/research-sandbox";
import { executeMathPilotFormalAttemptJob } from "@/modules/research-sandbox/math-formal-kernel";
import { requestMathPilotFormalAttempt } from "@/modules/research-sandbox/math-formal-request";
import { assembleFormalSource, formalClaimDigest, type FormalClaim } from "@/modules/research-sandbox/math-formal-claim";
import { validateRecordedMathFormalAttempt } from "@/modules/research-sandbox/math-formal-record";
import { requestMathPilotFormalReplay } from "@/modules/research-sandbox/math-formal-replay-request";
import { executeMathPilotFormalReplayJob } from "@/modules/research-sandbox/math-formal-replay-kernel";
import { validateRecordedMathFormalReplay } from "@/modules/research-sandbox/math-formal-replay-record";
import { attestMathPilotFormalAlignment } from "@/modules/research-sandbox/math-formal-alignment-kernel";
import { FORMAL_ALIGNMENT_CHECKS, validateRecordedFormalAlignment } from "@/modules/research-sandbox/math-formal-alignment";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { getDb } from "@/server/db";

import { asOwner, createUser, ownerQuery, truncateAll } from "./helpers";

beforeEach(async () => { await truncateAll(); });

describe("append-only formal attempt gate", () => {
  it("binds a model tactic attempt to a sealed proof case and retains a non-theorem checker result", async () => {
    const owner = await asOwner(await createUser("formal-owner"));
    const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
    const mission = await createMission(owner, { title: "Formal calibration" });
    const contract = resolveMathPilotContract({ caseType: "CALIBRATION_PROOF" });
    const requested = await requestResearchRun(owner, {
      missionId: mission.id, documentId: null, question: contract.statement, scope: mathPilotScope(contract),
      providerName: "codex-local", modelName: "gpt-6-sol",
      sourcePolicy: { allowedDomains: [], primaryDomains: [], requirePrimary: false, maxSources: 1 },
      queryPlan: { queries: [contract.statement], languages: ["en"] },
      mathPilot: { caseType: "CALIBRATION_PROOF" }, idempotencyKey: randomUUID(),
    });
    expect(requested.status).toBe("SUCCEEDED");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "formal-dispatch" });
    const [attemptJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "formal-worker", jobTypes: ["math-pilot.codex-local.execute"] });
    const usage = { inputTokens: 100, cachedInputTokens: 0, outputTokens: 50, reasoningOutputTokens: 10 };
    await executeResearchJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "formal-worker", jobId: attemptJob!.id, expectedVersion: attemptJob!.version,
      correlationId: owner.correlationId, provider: { providerName: "codex-local", modelName: "gpt-6-sol", async execute() {
        return { providerName: "codex-local", modelName: "gpt-6-sol", sources: [],
          findings: [{ key: "no-source", kind: "HONEST_NULL" as const, claim: "No external source was captured.",
            sourceKey: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0 }],
          mathAttempt: { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "author-thread",
            attemptType: "PROOF_ATTEMPT" as const, argument: "For n=2k, n²=2(2k²).",
            candidateCounterexample: null, selfChecks: [], limitations: [], usage } };
      } } });
    const [pilotCase] = await listMathPilotCases(owner, mission.id);
    expect(pilotCase).toBeDefined();
    expect((await requestMathPilotFormalAttempt(owner, pilotCase!.id)).status).toBe("SUCCEEDED");
    expect((await requestMathPilotFormalAttempt(owner, pilotCase!.id)).status).toBe("SUCCEEDED");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "formal-dispatch" });
    const [formalJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "formal-worker", jobTypes: ["math-pilot.formalize.check"] });
    const failedTactics = "exact False.elim (by contradiction)";
    const tactics = "obtain ⟨k, hk⟩ := h\nrefine ⟨2 * k * k, ?_⟩\nrw [hk]\nsimp only [Int.mul_assoc, Int.mul_comm, Int.mul_left_comm]";
    let formalizerCalls = 0;
    const retained = await executeMathPilotFormalAttemptJob({ organizationId: workspace.organizationId,
      actorUserId: owner.user.id, workerId: "formal-worker", jobId: formalJob!.id,
      expectedVersion: formalJob!.version,
      formalizer: { modelName: "gpt-6-sol", async formalize(_target, _argument, revision) {
        formalizerCalls += 1;
        if (formalizerCalls === 2) expect(revision).toMatchObject({ priorTactics: failedTactics,
          compilerFeedback: "unsolved goals" });
        return {
        modelName: "gpt-6-sol", threadId: `formalizer-thread-${formalizerCalls}`,
        proofTactics: revision ? tactics : failedTactics,
        reasoningSummary: "Test fixture", limitations: [],
        usage: { input_tokens: 300, cached_input_tokens: 0, output_tokens: 70, reasoning_output_tokens: 10 },
      }; } },
      checker: async (target: FormalClaim, candidate: string, image: string) => ({
        version: 1, method: "PINNED_LEAN_AXIOM_AUDIT_V1",
        status: candidate === tactics ? "KERNEL_ACCEPTED_ALIGNMENT_PENDING" : "REJECTED",
        reason: candidate === tactics ? "ALLOWED_AXIOMS" : "COMPILER_ERROR", targetDigest: formalClaimDigest(target),
        sourceDigest: sha256(assembleFormalSource(target, candidate)), image,
        toolchain: "Lean 4.10.0 / no mathlib import", axioms: ["propext"], outputDigest: "a".repeat(64),
        diagnostic: "Lean accepted the fixed statement; semantic alignment is not yet attested",
        compilerFeedback: candidate === tactics ? null : "unsolved goals",
      }),
    });
    expect(formalizerCalls).toBe(2);
    expect(retained.check).toMatchObject({ status: "KERNEL_ACCEPTED_ALIGNMENT_PENDING" });
    const [listed] = await listMathPilotCases(owner, mission.id);
    const valid = validateRecordedMathFormalAttempt({ record: listed!.formalAttempts[0]!,
      contractDigest: listed!.contractDigest, attemptDigest: listed!.researchRun.mathModelAttemptDigest,
      researchDigest: listed!.researchIntegrityDigest });
    expect(valid?.check.status).toBe("KERNEL_ACCEPTED_ALIGNMENT_PENDING");
    expect(valid?.trace).toHaveLength(2);
    expect(validateRecordedMathFormalAttempt({ record: listed!.formalAttempts[0]!,
      contractDigest: listed!.contractDigest, attemptDigest: listed!.researchRun.mathModelAttemptDigest,
      researchDigest: "0".repeat(64) })).toBeNull();
    const other = await asOwner(await createUser("formal-other-tenant"));
    expect(await requestMathPilotFormalReplay(other, retained.id)).toMatchObject({ status: "FAILED", errorCode: "COMMAND_FAILED" });
    expect((await requestMathPilotFormalReplay(owner, retained.id)).status).toBe("SUCCEEDED");
    expect((await requestMathPilotFormalReplay(owner, retained.id)).status).toBe("SUCCEEDED");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "replay-dispatch" });
    const [replayJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "replay-worker", jobTypes: ["math-pilot.formal-replay.check"] });
    const replayRecord = await executeMathPilotFormalReplayJob({ organizationId: workspace.organizationId,
      actorUserId: owner.user.id, workerId: "replay-worker", jobId: replayJob!.id,
      expectedVersion: replayJob!.version,
      replayer: async ({ target, tactics: replayTactics, primaryCheck, imageId }) => ({
        version: 1, method: "LEAN4CHECKER_FRESH_V1", status: "REPLAY_ACCEPTED", reason: "FRESH_REPLAY_OK",
        targetDigest: formalClaimDigest(target), sourceDigest: sha256(assembleFormalSource(target, replayTactics)),
        primaryCheckDigest: sha256(canonicalJson(primaryCheck)), imageId: imageId!,
        checkerCommit: "0c3323271991c2dfe75f8be7d21bf93886419736",
        toolchain: "Lean 4.10.0 / Std / lean4checker --fresh", outputDigest: "b".repeat(64),
        diagnostic: "The compiled olean was replayed through a fresh Lean kernel environment",
      }),
    });
    const [withReplay] = await listMathPilotCases(owner, mission.id);
    expect(validateRecordedMathFormalReplay({ replay: withReplay!.formalAttempts[0]!.replay,
      formalAttempt: withReplay!.formalAttempts[0]! })).toMatchObject({ status: "REPLAY_ACCEPTED" });
    expect(validateRecordedMathFormalReplay({ replay: { ...replayRecord, resultDigest: "0".repeat(64) },
      formalAttempt: withReplay!.formalAttempts[0]! })).toBeNull();
    const alignmentInput = { formalAttemptId: retained.id, confirmed: true,
      rationale: "The local formal target preserves the stated integer domain, implication, and exact even-square conclusion; publication still needs external review.",
      checks: FORMAL_ALIGNMENT_CHECKS.map((criterion) => ({ criterion,
        verdict: "ALIGNED" as const, note: `The ${criterion} clause was compared against the fixed original problem contract.` })) };
    expect(await attestMathPilotFormalAlignment(owner, alignmentInput)).toMatchObject({
      report: { status: "OPERATOR_ALIGNED" },
    });
    await expect(attestMathPilotFormalAlignment(owner, alignmentInput)).rejects.toThrow(/already reviewed/i);
    const audit = await getDb().auditEvent.findFirstOrThrow({ where: {
      workspaceId: workspace.id, eventType: "math_pilot.formal_alignment_attested",
      entityId: retained.id,
    } });
    expect(audit).toMatchObject({ actorMembershipId: owner.membership.id,
      payload: { status: "OPERATOR_ALIGNED", formalAttemptId: retained.id } });
    const [withAlignment] = await listMathPilotCases(owner, mission.id);
    expect(validateRecordedFormalAlignment({ record: withAlignment!.formalAttempts[0]!.alignment,
      formalAttempt: withAlignment!.formalAttempts[0]! })).toMatchObject({ status: "OPERATOR_ALIGNED" });
    expect(validateRecordedFormalAlignment({ record: { ...withAlignment!.formalAttempts[0]!.alignment!,
      reportDigest: "0".repeat(64) }, formalAttempt: withAlignment!.formalAttempts[0]! })).toBeNull();
    await expect(ownerQuery(`UPDATE math_pilot_formal_alignment SET report_digest = '${"0".repeat(64)}' WHERE formal_attempt_id = '${retained.id}'`))
      .rejects.toThrow(/append-only|immutable/i);
    await expect(ownerQuery(`UPDATE math_pilot_formal_replay SET result_digest = '${"0".repeat(64)}' WHERE id = '${replayRecord.id}'`))
      .rejects.toThrow(/append-only|immutable/i);
    await expect(ownerQuery(`UPDATE math_pilot_formal_attempt SET proof_tactics = 'sorry' WHERE id = '${retained.id}'`))
      .rejects.toThrow(/append-only|immutable/i);
  });
});
