import { beforeAll, describe, expect, it } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { mathCycleProposalSchema } from "@/modules/research-sandbox/math-cycle";
import { validateMathCycleTrace } from "@/modules/research-sandbox/math-cycle-kernel";
import { mixedCoreClaimSchema, mixedCoreRefutation, runMixedCoreAgentEvidence,
  validateMixedCoreAgentEvidence, type MixedCoreAgentEvidence } from "@/modules/research-sandbox/math-mixed-core-agent";

const root = "a".repeat(64);
let evidence: MixedCoreAgentEvidence;
const marker = { phase: "PRIOR_ART", round: 1, facts: [], coverage: "CURATED_PARTIAL", researchMethod: "MIXED_CORE_REPLAY_V1" };
const call = { phase: "CALL_STARTED", round: 1, role: "PLANNER" };
const proposal = { sourceGap: "A precise structural condition is still missing.",
  hypothesis: "Every residual prime admits a normalized single-core rescue.",
  taskStatement: "Prove that every residual prime admits a normalized single-core rescue.",
  falsificationPlan: "Inspect a prime with a complete single-core exclusion certificate.",
  successEvidence: "A general theorem with every quantified premise checked.",
  rationale: "The exact typed assertion must be checked against retained counterexamples.",
  mixedCoreClaim: mixedCoreClaimSchema.options[0] };
function seal(body: Omit<MixedCoreAgentEvidence, "evidenceDigest">) {
  return { ...body, evidenceDigest: sha256(canonicalJson(body)) };
}
function bodyOf(record: MixedCoreAgentEvidence) {
  const { method, rootContractDigest, packet, replay } = record;
  return { method, rootContractDigest, packet, replay };
}
// Raw chaining deliberately permits invalid payloads, testing more than hashes.
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
const retained = () => ({ phase: "MIXED_CORE_EVIDENCE", round: 1, evidence });

describe("mixed-core evidence before agent dispatch", () => {
  beforeAll(async () => { evidence = await runMixedCoreAgentEvidence(root); });

  it("executes the independently pinned Python replay and binds the root", () => {
    expect(evidence.replay.status).toBe("PASS");
    expect(validateMixedCoreAgentEvidence(evidence, root)).toBe(true);
    expect(validateMixedCoreAgentEvidence(evidence, "b".repeat(64))).toBe(false);
    expect(evidence.packet.certificates.slice(0, 2).map((c) => c.minimumSupport)).toEqual([2, 2]);
  });

  it("accepts JSONB-style key reordering but rejects altered counts, scope and extra fields", () => {
    const reordered = JSON.parse(JSON.stringify(evidence), (_key, value) => value &&
      typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).reverse()) : value);
    expect(validateMixedCoreAgentEvidence(reordered, root)).toBe(true);
    const body = bodyOf(evidence);
    for (const packet of [
      { ...body.packet, scope: "Universal root theorem" },
      { ...body.packet, pellCounterexample: { ...body.packet.pellCounterexample,
        atlas: { ...body.packet.pellCounterexample.atlas, residueCount: 93 } } },
      { ...body.packet, unexpected: true },
    ]) expect(validateMixedCoreAgentEvidence(seal({ ...body, packet }), root)).toBe(false);
    expect(validateMixedCoreAgentEvidence({ ...evidence, evidenceDigest: "b".repeat(64) })).toBe(false);
    expect(validateMixedCoreAgentEvidence({ ...evidence, packet: null })).toBe(false);
  });

  it("requires unique replay evidence before calls and rejects a rebound root despite rebuilt chain hashes", () => {
    expect(validateMathCycleTrace(chain([marker, retained(), call]), root)).not.toBeNull();
    expect(validateMathCycleTrace(chain([marker, call]), root)).toBeNull();
    expect(validateMathCycleTrace(chain([marker, retained(), retained()]), root)).toBeNull();
    expect(validateMathCycleTrace(chain([call, marker, retained()]), root)).toBeNull();
    const body = bodyOf(evidence);
    const rebound = seal({ ...body, rootContractDigest: "b".repeat(64) });
    expect(validateMathCycleTrace(chain([marker, { ...retained(), evidence: rebound }]), root)).toBeNull();
  });

  it.each(mixedCoreClaimSchema.options)("stops the registered false assertion %s before downstream calls", (claim) => {
    expect(mixedCoreRefutation(claim, evidence)?.counterexample).toBeTruthy();
    const proposed = { phase: "PROPOSED", round: 1, proposal: { ...proposal, mixedCoreClaim: claim },
      context: { threadId: "planner", usage: { inputTokens: 1, cachedInputTokens: 0,
        outputTokens: 1, reasoningOutputTokens: 0 } } };
    const refuted = { phase: "MIXED_CORE_CLAIM_REFUTED", round: 1, claim, evidenceDigest: evidence.evidenceDigest };
    const prefix = [marker, retained(), call, proposed];
    expect(validateMathCycleTrace(chain([...prefix, refuted,
      { phase: "STOPPED", round: 1, reason: "STRUCTURAL_REFUTED" }]), root)).not.toBeNull();
    expect(validateMathCycleTrace(chain([...prefix, call]), root)).toBeNull();
    expect(validateMathCycleTrace(chain([...prefix, refuted, call]), root)).toBeNull();
    expect(validateMathCycleTrace(chain([...prefix, { ...refuted, evidenceDigest: "b".repeat(64) }]), root)).toBeNull();
  });

  it.each(["UNAVAILABLE", "MISMATCH"] as const)("retains %s replay only as a fail-closed stop", (status) => {
    const body = bodyOf(evidence);
    const failed = seal({ ...body, replay: { ...body.replay, status,
      outputDigest: status === "UNAVAILABLE" ? null : "b".repeat(64) } });
    const prefix = [marker, { ...retained(), evidence: failed }];
    expect(validateMixedCoreAgentEvidence(failed, root)).toBe(true);
    expect(validateMathCycleTrace(chain([...prefix,
      { phase: "STOPPED", round: 1, reason: "INTEGRITY_FAILURE" }]), root)).not.toBeNull();
    expect(validateMathCycleTrace(chain([...prefix, call]), root)).toBeNull();
    expect(validateMathCycleTrace(chain([...prefix,
      { phase: "STOPPED", round: 1, reason: "NO_GAP" }]), root)).toBeNull();
    expect(mixedCoreRefutation(mixedCoreClaimSchema.options[0], failed)).toBeNull();
  });

  it("keeps historical traces readable and does not pretend to detect untyped semantic paraphrases", () => {
    expect(validateMathCycleTrace(chain([call]))).not.toBeNull();
    const legacy = { sourceGap: proposal.sourceGap, hypothesis: proposal.hypothesis,
      taskStatement: proposal.taskStatement, falsificationPlan: proposal.falsificationPlan,
      successEvidence: proposal.successEvidence, rationale: proposal.rationale };
    expect(mathCycleProposalSchema.safeParse(legacy).success).toBe(true);
    expect(mathCycleProposalSchema.safeParse({ ...legacy, mixedCoreClaim: "OTHER_THEOREM" }).success).toBe(false);
    expect(mathCycleProposalSchema.safeParse({ ...legacy, mixedCoreClaim: null }).success).toBe(true);
  });
});
