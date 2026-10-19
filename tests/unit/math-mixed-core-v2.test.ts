import { beforeAll, describe, expect, it } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { validateMathCycleTrace } from "@/modules/research-sandbox/math-cycle-kernel";
import { compareMixedCoreKernelReplay } from "@/modules/research-sandbox/math-mixed-core-kernel-replay";
import { mixedCoreEvidencePassed, mixedCoreRefutation, runMixedCoreAgentEvidence,
  mixedCoreAgentMandate, validateMixedCoreAgentEvidence, type MixedCoreAgentEvidence } from "@/modules/research-sandbox/math-mixed-core-agent";

type V2 = Extract<MixedCoreAgentEvidence, { method: "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V2" }>;
const root = "a".repeat(64), claim = "KNOWN_RELATION_BOUND_IS_EXACT_FOR_EVERY_PRIME_MODULUS" as const;
let v1: MixedCoreAgentEvidence, v2: V2;
const marker = { phase: "PRIOR_ART", round: 1, facts: [], coverage: "CURATED_PARTIAL", researchMethod: "MIXED_CORE_REPLAY_V2" };
const call = { phase: "CALL_STARTED", round: 1, role: "PLANNER" };
const retained = (evidence: MixedCoreAgentEvidence = v2) => ({ phase: "MIXED_CORE_EVIDENCE", round: 1, evidence });
function seal(body: Record<string, unknown>) { return { ...body, evidenceDigest: sha256(canonicalJson(body)) }; }
function body(record: MixedCoreAgentEvidence) {
  const { evidenceDigest: _digest, ...rest } = record;
  void _digest;
  return rest;
}
function chain(payloads: Record<string, unknown>[]) {
  let previousDigest: string | null = null;
  return payloads.map((payload, i) => {
    const digest = sha256(canonicalJson({ previousDigest, payload }));
    const event = { sequence: i + 1, round: payload.round as number, phase: payload.phase as string,
      payload, previousDigest, digest };
    previousDigest = digest;
    return event;
  });
}
const proposed = { phase: "PROPOSED", round: 1, proposal: {
  sourceGap: "A target-sensitive structural hypothesis is missing.",
  hypothesis: "The known-relation bound is exact for every prime modulus.",
  taskStatement: "Prove the bound is exact for every prime modulus s=4m-1.",
  falsificationPlan: "Inspect the prime-modulus counterexample in the retained packet.",
  successEvidence: "A proof with exact quantifiers and independent arithmetic checks.",
  rationale: "This precise registered assertion should be pruned before source calls.", mixedCoreClaim: claim,
}, context: { threadId: "v2-planner", usage: { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1, reasoningOutputTokens: 0 } } };

describe("versioned retained collision-kernel evidence", () => {
  beforeAll(async () => {
    v1 = await runMixedCoreAgentEvidence(root, "MIXED_CORE_REPLAY_V1");
    v2 = await runMixedCoreAgentEvidence(root, "MIXED_CORE_REPLAY_V2") as V2;
  });
  it("freshly replays both pins with unchanged V1 baseline and exact fixed controls", () => {
    expect(mixedCoreEvidencePassed(v2)).toBe(true);
    expect(validateMixedCoreAgentEvidence(v2, root)).toBe(true);
    expect(v2.packet).toEqual(v1.packet);
    expect(v2.replay).toEqual(v1.replay);
    expect(v2.kernel.replay.primaryDigest).toBe("e4d7b0a4c03ab08c80a6d8a032dc9c8f4d117dd611ac61d981ffd25eb2820cf4");
    expect(v2.kernel.packet.rows).toHaveLength(6);
    expect(v2.kernel.packet.polynomialFamily).toHaveLength(9);
    expect(v2.kernel.packet.rows.find((row) => row.m === 132840)).toMatchObject({ sIsPrime: true,
      s: 531359, knownRelationBound: 527, residueCount: 525 });
    expect(compareMixedCoreKernelReplay(v2.kernel.packet, v2.kernel.packet)).toBe("PASS");
    expect(compareMixedCoreKernelReplay(v2.kernel.packet, { ...v2.kernel.packet, rows: [] })).toBe("MISMATCH");
  });
  it("does not downgrade historical V1 or overclaim its prime-only refutation", () => {
    expect(mixedCoreRefutation(claim, v1)).toBeNull();
    expect(mixedCoreAgentMandate(v1)).not.toContain("m132840");
    expect(mixedCoreAgentMandate(v2)).toContain("m132840");
    expect(mixedCoreRefutation(claim, v2)?.counterexample).toContain("527 but exactly 525");
    expect(validateMathCycleTrace(chain([{ ...marker, researchMethod: "MIXED_CORE_REPLAY_V1" }, retained(v1), call]), root)).not.toBeNull();
    expect(validateMathCycleTrace(chain([{ ...marker, researchMethod: "MIXED_CORE_REPLAY_V1" }, retained(v1), call,
      { phase: "PRIOR_ART", round: 2, facts: [], coverage: "CURATED_PARTIAL" },
      { ...call, round: 2 }]), root)).not.toBeNull();
    expect(validateMathCycleTrace(chain([{ ...marker, researchMethod: "MIXED_CORE_REPLAY_V1" }, retained(v1), call, proposed, call]), root)).not.toBeNull();
    expect(validateMathCycleTrace(chain([marker, retained(v1)]), root)).toBeNull();
    expect(validateMathCycleTrace(chain([retained(v2)]), root)).toBeNull();
    expect(validateMathCycleTrace(chain([{ ...marker, researchMethod: "MIXED_CORE_REPLAY_V1" }, retained(v2)]), root)).toBeNull();
  });
  it("rejects removed or changed supplement, root/hash drift and accepts JSONB key reordering", () => {
    const { kernel: _kernel, evidenceDigest: _evidenceDigest, ...stripped } = v2;
    void _kernel; void _evidenceDigest;
    expect(validateMixedCoreAgentEvidence(seal(stripped), root)).toBe(false);
    for (const changed of [
      { ...body(v2), rootContractDigest: "b".repeat(64) },
      { ...body(v2), kernel: { ...v2.kernel, packet: { ...v2.kernel.packet, polynomialFamily: [] } } },
      { ...body(v2), kernel: { ...v2.kernel, replay: { ...v2.kernel.replay, scriptDigest: "b".repeat(64) } } },
      { ...body(v2), kernel: { ...v2.kernel, replay: { ...v2.kernel.replay, outputDigest: "b".repeat(64) } } },
    ]) expect(validateMathCycleTrace(chain([marker, { ...retained(), evidence: seal(changed) }]), root)).toBeNull();
    expect(validateMixedCoreAgentEvidence({ ...v2, evidenceDigest: "b".repeat(64) }, root)).toBe(false);
    const reordered = JSON.parse(JSON.stringify(v2), (_key, value) => value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).reverse()) : value);
    expect(validateMixedCoreAgentEvidence(reordered, root)).toBe(true);
  });
  it("rejects duplicate/late evidence and any downstream call after typed refutation", () => {
    const prefix = [marker, retained(), call, proposed];
    const refuted = { phase: "MIXED_CORE_CLAIM_REFUTED", round: 1, claim, evidenceDigest: v2.evidenceDigest };
    expect(validateMathCycleTrace(chain([...prefix, refuted, { phase: "STOPPED", round: 1, reason: "STRUCTURAL_REFUTED" }]), root)).not.toBeNull();
    expect(validateMathCycleTrace(chain([...prefix, call]), root)).toBeNull();
    expect(validateMathCycleTrace(chain([...prefix, refuted, call]), root)).toBeNull();
    expect(validateMathCycleTrace(chain([marker, retained(), retained()]), root)).toBeNull();
    expect(validateMathCycleTrace(chain([call, marker, retained()]), root)).toBeNull();
    expect(validateMathCycleTrace(chain([marker, call, retained()]), root)).toBeNull();
  });
  it.each(["MISMATCH", "UNAVAILABLE"] as const)("kernel %s stops before first dispatch", (status) => {
    const failed = seal({ ...body(v2), kernel: { ...v2.kernel, replay: { ...v2.kernel.replay,
      status, outputDigest: status === "UNAVAILABLE" ? null : "b".repeat(64) } } });
    expect(validateMixedCoreAgentEvidence(failed, root)).toBe(true);
    const prefix = [marker, { ...retained(), evidence: failed }];
    expect(validateMathCycleTrace(chain([...prefix, { phase: "STOPPED", round: 1, reason: "INTEGRITY_FAILURE" }]), root)).not.toBeNull();
    expect(validateMathCycleTrace(chain([...prefix, call]), root)).toBeNull();
    expect(validateMathCycleTrace(chain([...prefix, { phase: "STOPPED", round: 1, reason: "NO_GAP" }]), root)).toBeNull();
  });
});
