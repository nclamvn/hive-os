import { describe, expect, it } from "vitest";

import { branchResourceStopReason, sealMathPortfolio, selectMathPortfolioBranch,
  summarizeMathPortfolio, validMathPortfolio } from "@/modules/research-sandbox/math-portfolio";
import { mathCycleEventDigest, type MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";
import { validateMathCycleTrace } from "@/modules/research-sandbox/math-cycle-kernel";

const gap = "The remaining prime class has no proved structural implication.";
const base = { sourceGap: gap,
  taskStatement: "Test a bounded and precisely stated condition on the residual prime class.",
  falsificationPlan: "Find a prime satisfying every premise but violating the proposed conclusion.",
  successEvidence: "An exact counterexample or a checked derivation of the conditional statement.",
  rationale: "This branch distinguishes an exact finite obstruction from a universal implication.",
  exactSurveyPlan: null, structuralProbePlan: null };
const draft = { branches: [
  { strategy: "FINITE_FALSIFICATION" as const, proposal: { ...base,
    hypothesis: "The next finite residual interval contains a prime outside the first denominator gates.",
    exactSurveyPlan: { kind: "ERDOS_STRAUS_RESIDUAL_A" as const,
      lowerExclusive: 840, upperInclusive: 1_681, maxA: 11 } },
    anticipatedFalsifier: "One exhaustively checked prime without the proposed bounded property.",
    expectedInformationGain: "MEDIUM" as const, toolNeeds: ["RESIDUAL_SURVEY" as const] },
  { strategy: "STRUCTURAL_LEMMA" as const, proposal: { ...base,
    hypothesis: "A cross-gate factor relation constrains the remaining prime class.",
    taskStatement: "Derive or refute a cross-gate factor relation for every prime in the residual class." },
    anticipatedFalsifier: "A replayed prime that satisfies the premises but fails the factor relation.",
    expectedInformationGain: "HIGH" as const, toolNeeds: ["SOURCE_REVIEW" as const] },
] };

function sealed() {
  return sealMathPortfolio({ draft, rootReviewDigest: "a".repeat(64), availableGaps: [gap],
    priorObligations: [{ id: "b".repeat(64), parentId: null, cycleId: "cycle-1", round: 1,
      kind: "GAP", statement: gap, state: "OPEN", ledgerDigest: "c".repeat(64) }],
    maxObservedTokens: 120_000, maxRounds: 2 });
}

describe("bounded mathematical research portfolio", () => {
  it("seals two distinct branches with source obligation and per-branch ceilings", () => {
    const portfolio = sealed();
    expect(validMathPortfolio(portfolio)).toBe(true);
    expect(portfolio.branches).toHaveLength(2);
    expect(portfolio.branches[0]).toMatchObject({ parentObligationIds: ["b".repeat(64)],
      maxObservedTokens: 60_000, maxWallSeconds: 1_500 });
    expect(validMathPortfolio({ ...portfolio, branches: [
      { ...portfolio.branches[0], proposal: { ...portfolio.branches[0].proposal,
        hypothesis: "Tampered mathematical claim" } }, portfolio.branches[1],
    ] })).toBe(false);
    expect(() => sealMathPortfolio({ draft: { branches: [draft.branches[0], draft.branches[0]] },
      rootReviewDigest: "a".repeat(64), availableGaps: [gap], priorObligations: [],
      maxObservedTokens: 120_000, maxRounds: 2 })).toThrow(/distinct strategies/);
    expect(() => sealMathPortfolio({ draft: { branches: [
      { ...draft.branches[0], toolNeeds: ["LEAN_CHECK"] }, draft.branches[1]] },
      rootReviewDigest: "a".repeat(64), availableGaps: [gap], priorObligations: [],
      maxObservedTokens: 120_000, maxRounds: 2 })).toThrow();
  });

  it("prefers executable falsification, then a different pending line; repeated claims are pruned", () => {
    const portfolio = sealed();
    const first = selectMathPortfolioBranch({ portfolio, selectedBranchIds: [], priorClaims: [] });
    expect(first?.strategy).toBe("FINITE_FALSIFICATION");
    const second = selectMathPortfolioBranch({ portfolio, selectedBranchIds: [first!.branchId], priorClaims: [] });
    expect(second?.strategy).toBe("STRUCTURAL_LEMMA");
    expect(selectMathPortfolioBranch({ portfolio, selectedBranchIds: [first!.branchId],
      priorClaims: [second!.proposal.hypothesis] })).toBeNull();
  });

  it("checks resource thresholds between calls and reports unrun branches honestly", () => {
    const portfolio = sealed();
    const branch = portfolio.branches[0];
    const selectedAt = "2026-09-30T00:00:00.000Z";
    expect(branchResourceStopReason({ branch, baselineObservedTokens: 10, currentObservedTokens: 60_009,
      selectedAt, now: new Date("2026-09-30T00:01:00.000Z") })).toBeNull();
    expect(branchResourceStopReason({ branch, baselineObservedTokens: 10, currentObservedTokens: 60_010,
      selectedAt, now: new Date("2026-09-30T00:01:00.000Z") })).toBe("BRANCH_TOKEN_LIMIT");
    expect(branchResourceStopReason({ branch, baselineObservedTokens: 10, currentObservedTokens: 10,
      selectedAt, now: new Date("2026-09-30T00:25:00.000Z") })).toBe("BRANCH_TIME_LIMIT");
    const closed: MathCycleEventPayload = { phase: "BRANCH_CLOSED", round: 1,
      portfolioDigest: portfolio.portfolioDigest, branchId: branch.branchId,
      outcome: "PRUNED", reason: "STRUCTURAL_REFUTED" };
    expect(summarizeMathPortfolio(portfolio, [closed])).toEqual([
      { branchId: branch.branchId, state: "PRUNED", reason: "STRUCTURAL_REFUTED" },
      { branchId: portfolio.branches[1].branchId, state: "NOT_RUN",
        reason: "Not selected within the bounded cycle" },
    ]);
  });

  it("replays sealed selection, local pruning, second branch and honest exhaustion", () => {
    const portfolio = sealed();
    const [first, second] = portfolio.branches;
    const usage = { inputTokens: 4, cachedInputTokens: 0, outputTokens: 2, reasoningOutputTokens: 0 };
    const payloads: MathCycleEventPayload[] = [
      { phase: "CALL_STARTED", role: "PLANNER", round: 1 },
      { phase: "PORTFOLIO_PLANNED", round: 1, portfolio,
        context: { threadId: "planner-1", usage } },
      { phase: "BRANCH_SELECTED", round: 1, portfolioDigest: portfolio.portfolioDigest,
        branchId: first.branchId, baselineObservedTokens: 6, selectedAt: "2026-09-30T00:00:00.000Z" },
      { phase: "PROPOSED", round: 1, proposal: first.proposal,
        context: { threadId: "planner-1", usage: { ...usage, inputTokens: 0, outputTokens: 0 } } },
      { phase: "ROUND_CLOSED", round: 1, disposition: "INCONCLUSIVE", conclusion: "INCONCLUSIVE", nextGap: null },
      { phase: "BRANCH_CLOSED", round: 1, portfolioDigest: portfolio.portfolioDigest,
        branchId: first.branchId, outcome: "PRUNED", reason: "VERIFICATION_REJECTED" },
      { phase: "BRANCH_SELECTED", round: 2, portfolioDigest: portfolio.portfolioDigest,
        branchId: second.branchId, baselineObservedTokens: 40, selectedAt: "2026-09-30T00:01:00.000Z" },
      { phase: "PROPOSED", round: 2, proposal: second.proposal,
        context: { threadId: "planner-1", usage: { ...usage, inputTokens: 0, outputTokens: 0 } } },
      { phase: "ROUND_CLOSED", round: 2, disposition: "INCONCLUSIVE", conclusion: "INCONCLUSIVE", nextGap: null },
      { phase: "BRANCH_CLOSED", round: 2, portfolioDigest: portfolio.portfolioDigest,
        branchId: second.branchId, outcome: "PRUNED", reason: "KNOWN_SCOPE" },
      { phase: "PORTFOLIO_EXHAUSTED", round: 2, portfolioDigest: portfolio.portfolioDigest,
        branches: [{ branchId: first.branchId, state: "PRUNED", reason: "VERIFICATION_REJECTED" },
          { branchId: second.branchId, state: "PRUNED", reason: "KNOWN_SCOPE" }] },
      { phase: "STOPPED", round: 2, reason: "ROUND_LIMIT" },
    ];
    const ledger = (items: MathCycleEventPayload[]) => {
      let previousDigest: string | null = null;
      return items.map((payload, index) => {
        const event = { sequence: index + 1, round: payload.round, phase: payload.phase,
          payload, previousDigest, digest: mathCycleEventDigest(previousDigest, payload) };
        previousDigest = event.digest;
        return event;
      });
    };
    expect(validateMathCycleTrace(ledger(payloads))).toEqual(payloads);
    expect(validateMathCycleTrace(ledger(payloads.map((item, index) => index === 7 &&
      item.phase === "PROPOSED" ? { ...item, proposal: first.proposal } : item)))).toBeNull();
    expect(validateMathCycleTrace(ledger(payloads.map((item, index) => index === 10 &&
      item.phase === "PORTFOLIO_EXHAUSTED" ? { ...item, branches: [{
        branchId: first.branchId, state: "AI_REVIEWED", reason: "ROUND_COMPLETE" },
        ...item.branches.slice(1)] } : item)))).toBeNull();
    expect(validateMathCycleTrace(ledger(payloads.filter((item) => item.phase !== "PORTFOLIO_EXHAUSTED")))).toBeNull();
    const failed: MathCycleEventPayload[] = [payloads[0], payloads[1], payloads[2], payloads[3],
      { phase: "BRANCH_CLOSED", round: 1, portfolioDigest: portfolio.portfolioDigest,
        branchId: first.branchId, outcome: "FAILED", reason: "MODEL_FAILURE" },
      { phase: "PORTFOLIO_EXHAUSTED", round: 1, portfolioDigest: portfolio.portfolioDigest,
        branches: [{ branchId: first.branchId, state: "FAILED", reason: "MODEL_FAILURE" },
          { branchId: second.branchId, state: "NOT_RUN", reason: "Not selected within the bounded cycle" }] },
      { phase: "STOPPED", round: 1, reason: "MODEL_FAILURE" }];
    expect(validateMathCycleTrace(ledger(failed))).toEqual(failed);
  });
});
