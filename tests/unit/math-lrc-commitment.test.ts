import { describe, expect, it } from "vitest";
import { admitResearchCommitment, sealResearchCommitment } from "@/modules/research-sandbox/math-research-commitment";
import { createLrcLoopHostRegistry, planLrcResearchLoop, LRC_LOOP_FIXED_REPRODUCTION_PREDICATE } from "@/modules/research-sandbox/math-lrc-research-loop";
import { LRC_METHOD_UNIT_DIGEST } from "@/modules/research-sandbox/math-lrc-method-unit";
import { candidateA, usage } from "./math-lrc-research-loop-fixture";
import { verifyInstalledMethodUnitSources } from "@/server/operations/math-method-unit-source-loader";
const policy = () => ({ version: 1, bindings: [], associations: [], information: [], relations: [], batch: { id: "committed-batch", sealed: true,
  currentCandidateId: "a", cap: { experiments: 2, roleCalls: 6, inputTokens: 7404, outputTokens: 4734, wallMs: 20000, toolCalls: 2, checkerCalls: 2, primeChecks: 2 },
  candidates: [structuredClone(candidateA)], experiments: [] } });
function binding() { return sealResearchCommitment({ confirmed: true, previous: null, host: { organizationId: "org", workspaceId: "workspace",
  rootCaseId: "ROOT_LRC_14_MOVING_15_TOTAL", rootContractDigest: LRC_METHOD_UNIT_DIGEST, rootReviewDigest: "a".repeat(64), cycleId: "committed-batch",
  commandId: "offline-human-command", approvedByUserId: "human", approvedAt: "2026-10-05T07:00:00.000Z" }, choice: {
  mode: "REPRODUCTION", milestone: "Reproduce only the exact fixed method unit; no full LRC proof grant", sourceDigest: LRC_METHOD_UNIT_DIGEST,
  obligations: [{ id: "FEW_EXCEPTION_SHIFT_14", predicate: LRC_LOOP_FIXED_REPRODUCTION_PREDICATE, scope: "UNIVERSAL", evidence: { kind: "UNIVERSAL_PROOF_UNSUPPORTED" }, operations: ["LRC_OFFLINE_PLANNING"] }],
  maxNoClosure: 2, maxWork: 2, revision: "INITIAL", expectedPreviousDigest: null, reason: "Explicit offline host planning scope" } }); }
describe("TIP074 LRC offline planning remains a separate no-execution layer", () => {
  it("sealed batch without commitment cannot select next work", () => { const p = policy(); const out = planLrcResearchLoop({ registry: createLrcLoopHostRegistry(p), records: [] });
    expect(out).toMatchObject({ decision: "STOP_HARD", reason: "COMMITMENT_REQUIRED", nextCandidateId: null, dispatchAllowed: false }); });
  it("batch:null remains passive without any commitment", () => { const out = planLrcResearchLoop({ registry: createLrcLoopHostRegistry({ ...policy(), batch: null }), records: [] });
    expect(out).toMatchObject({ decision: "PLANNING_ONLY", commitmentStatus: "PASSIVE_DIAGNOSTIC", dispatchAllowed: false }); });
  it("an exact INITIAL token can route only its fixed offline candidate", () => { const out = planLrcResearchLoop({ registry: createLrcLoopHostRegistry(policy()), records: [], commitment: admitResearchCommitment(binding(), {}) });
    expect(out).toMatchObject({ decision: "CONTINUE", nextCandidateId: "a", dispatchAllowed: false, proofClosure: false }); });
  it.each(["batch", "predicate", "mode", "obligation"])("%s drift refuses without changing accounting", fault => {
    const p = policy(); if (fault === "batch") p.batch.id = "renamed-batch";
    if (fault === "predicate") p.batch.candidates[0].predicate.domain = "Only a conditional local family";
    if (fault === "mode") Object.assign(p.batch.candidates[0], { mode: "DISCOVERY", discovery: { differenceFromSource: "Changed target", falsification: "Find a counterexample", expectedGain: "New family", strongestObjection: "Scope mismatch", novelty: "PENDING" } });
    if (fault === "obligation") p.batch.candidates[0].targetedObligationId = "changed-obligation";
    const out = planLrcResearchLoop({ registry: createLrcLoopHostRegistry(p), records: [], commitment: admitResearchCommitment(binding(), {}) });
    expect(out.nextCandidateId).toBeNull(); expect(out.dispatchAllowed).toBe(false); expect(out.commitmentStatus).not.toBe("OFFLINE_SCOPE_ALIGNED_NO_EXECUTION_AUTHORITY");
  });
  it("offline continuation cannot wash durable history that this sidecar cannot attest", () => {
    const previous = binding(), next = sealResearchCommitment({ confirmed: true, previous, host: { organizationId: previous.organizationId, workspaceId: previous.workspaceId,
      rootCaseId: previous.rootCaseId, rootContractDigest: previous.rootContractDigest, rootReviewDigest: previous.rootReviewDigest,
      approvedByUserId: previous.approvedByUserId, approvedAt: previous.approvedAt, cycleId: "next-batch", commandId: "next-command" },
      choice: { ...previous.choice, revision: "CONTINUE", expectedPreviousDigest: previous.commitmentDigest, reason: "Ordinary continuation" } });
    const p = policy(); p.batch.id = "next-batch";
    expect(planLrcResearchLoop({ registry: createLrcLoopHostRegistry(p), records: [], commitment: admitResearchCommitment(next, {}) }).commitmentStatus).toBe("COMMITMENT_LRC_DURABLE_HISTORY_UNSUPPORTED");
  });
  it("old accounting refusal remains primary and charges failed work", () => {
    const p = policy(); Object.assign(p.batch, { experiments: [{ id: "failed", candidateId: "a", recordBindingId: null, state: "OPERATIONAL_FAILED", usage,
      criterion: { id: "criterion", obligationId: "FEW_EXCEPTION_SHIFT_14", uncertainty: null, baselineEvidenceDigests: [] } }] });
    const out = planLrcResearchLoop({ registry: createLrcLoopHostRegistry(p), records: [] });
    expect(out).toMatchObject({ reason: "OPERATIONAL_FAILED", chargedExperiments: 1, nextCandidateId: null }); expect(out.consumed.roleCalls).toBe(3);
  });
  it("unchanged fixed37 refuses changed executable source instead of silently resealing", async () => { await expect(verifyInstalledMethodUnitSources()).rejects.toThrow(); });
});
