import { describe, expect, it } from "vitest";

import { projectMathProofObligations, repeatedMathClaim } from "@/modules/research-sandbox/math-proof-obligations";
import type { MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";

const proposal = {
  sourceGap: "The proof lacks a general argument for the residual class.",
  hypothesis: "Every residual object has an additional structural invariant.",
  taskStatement: "Prove or disprove the additional invariant for every residual object.",
  falsificationPlan: "Find one residual object without the proposed invariant.",
  successEvidence: "Supply a general proof checked independently, or a counterexample.",
  rationale: "The proposed invariant may distinguish the hard residual class.",
};
const context = { threadId: "planner-1", usage: { inputTokens: 1, cachedInputTokens: 0,
  outputTokens: 1, reasoningOutputTokens: 0 } };

describe("math proof-obligation projection", () => {
  it("builds a stable five-node DAG without promoting AI review to formal proof", () => {
    const trace: MathCycleEventPayload[] = [
      { phase: "PROPOSED", round: 1, proposal, context },
      { phase: "VERIFIED", round: 1, verification: {
        decision: "ACCEPT", sourceGap: proposal.sourceGap,
        scopeCheck: "The quantifiers and definitions match the root domain.",
        noveltyCheck: "No exact prior task duplicates this proposal.",
        falsifiabilityCheck: "A single checked object can refute it.",
        unresolvedRisk: "Novelty outside the captured sources is unknown.",
      }, context: { ...context, threadId: "verifier-1" }, accepted: true,
      reason: "Exact gap and context checks passed." },
      { phase: "ROUND_CLOSED", round: 1, disposition: "AI_REVIEWED", conclusion: "PARTIAL", nextGap: null },
    ];
    const nodes = projectMathProofObligations({ cycleId: "cycle-1", ledgerDigest: "a".repeat(64), trace });
    expect(nodes.map((node) => [node.kind, node.state])).toEqual([
      ["GAP", "OPEN"], ["CLAIM", "TASK_ACCEPTED"], ["FALSIFICATION", "OPEN"],
      ["PROOF", "AI_REVIEWED"], ["PRIOR_ART", "OPEN"],
    ]);
    expect(nodes[1]?.parentId).toBe(nodes[0]?.id);
    expect(nodes.slice(2).every((node) => node.parentId === nodes[1]?.id)).toBe(true);
    expect(projectMathProofObligations({ cycleId: "cycle-1", ledgerDigest: "a".repeat(64), trace })).toEqual(nodes);
    expect(projectMathProofObligations({ cycleId: "cycle-1", ledgerDigest: "bad", trace })).toEqual([]);
  });

  it("recognizes only an exact normalized claim repeat, not semantic equivalence", () => {
    expect(repeatedMathClaim({ ...proposal, hypothesis: "  EVERY residual object has an additional   structural invariant. " },
      [proposal.hypothesis])).toBe(true);
    expect(repeatedMathClaim({ ...proposal, hypothesis: "A different invariant may hold." },
      [proposal.hypothesis])).toBe(false);
  });

  it("links a later review gap to the proof obligation that left it unresolved", () => {
    const nextGap = "The general proof still lacks the induction step for larger objects.";
    const trace: MathCycleEventPayload[] = [
      { phase: "PROPOSED", round: 1, proposal, context },
      { phase: "ROUND_CLOSED", round: 1, disposition: "INCONCLUSIVE", conclusion: "INCONCLUSIVE", nextGap },
      { phase: "PROPOSED", round: 2, proposal: { ...proposal, sourceGap: nextGap,
        hypothesis: "The induction step may follow from a stronger invariant." }, context },
    ];
    const nodes = projectMathProofObligations({ cycleId: "cycle-1", ledgerDigest: "a".repeat(64), trace });
    expect(nodes[5]?.kind).toBe("GAP");
    expect(nodes[5]?.parentId).toBe(nodes[3]?.id);
  });
});
