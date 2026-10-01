import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { sha256 } from "./integrity";
import { mathPortfolioDraftSchema, mathPortfolioSchema,
  type MathCycleEventPayload } from "./math-cycle";
import { normalizedMathClaim, type MathProofObligation } from "./math-proof-obligations";

type Draft = ReturnType<typeof mathPortfolioDraftSchema.parse>;
export type MathPortfolio = ReturnType<typeof mathPortfolioSchema.parse>;
export type MathPortfolioBranch = MathPortfolio["branches"][number];

function branchDigest(rootReviewDigest: string, index: number, branch: Draft["branches"][number]): string {
  return sha256(canonicalJson({ rootReviewDigest, index, branch }));
}

function portfolioDigest(portfolio: Omit<MathPortfolio, "portfolioDigest">): string {
  return sha256(canonicalJson(portfolio));
}

/** Model proposals are untrusted. Bind them to exact gaps and validated obligation IDs. */
export function sealMathPortfolio(input: { draft: unknown; rootReviewDigest: string;
  availableGaps: readonly string[]; priorObligations: readonly MathProofObligation[];
  maxObservedTokens: number; maxRounds: number }): MathPortfolio {
  const draft = mathPortfolioDraftSchema.parse(input.draft);
  if (!/^[a-f0-9]{64}$/.test(input.rootReviewDigest) || input.maxRounds < 1 || input.maxRounds > 2 ||
    !Number.isInteger(input.maxObservedTokens) || input.maxObservedTokens < 10_000 || input.maxObservedTokens > 200_000) {
    throw new Error("Invalid portfolio root or resource envelope");
  }
  const strategies = new Set<string>();
  const hypotheses = new Set<string>();
  const perBranchTokens = Math.max(10_000, Math.floor(input.maxObservedTokens / input.maxRounds));
  const perBranchSeconds = Math.floor(3_000 / input.maxRounds);
  const branches = draft.branches.map((branch, index) => {
    const hypothesis = normalizedMathClaim(branch.proposal.hypothesis);
    if (!input.availableGaps.includes(branch.proposal.sourceGap) ||
      hypotheses.has(hypothesis) || strategies.has(branch.strategy)) {
      throw new Error("Portfolio branches need distinct strategies, hypotheses and exact retained gaps");
    }
    hypotheses.add(hypothesis);
    strategies.add(branch.strategy);
    if (Boolean(branch.proposal.structuralProbePlan) !== branch.toolNeeds.includes("STRUCTURAL_PROBE") ||
      Boolean(branch.proposal.exactSurveyPlan) !== branch.toolNeeds.includes("RESIDUAL_SURVEY")) {
      throw new Error("Portfolio tool needs do not match executable plans");
    }
    const inheritedParents = [...new Set(input.priorObligations.filter((obligation) =>
      obligation.kind === "GAP" && normalizedMathClaim(obligation.statement) ===
        normalizedMathClaim(branch.proposal.sourceGap)).map((obligation) => obligation.id))].slice(0, 8);
    // Root review gaps predate cycle proof-obligation projection. Give each a
    // stable, review-digest-bound parent identity rather than leaving an orphan.
    const parentObligationIds = inheritedParents.length ? inheritedParents : [sha256(canonicalJson({
      kind: "ROOT_REVIEW_GAP", rootReviewDigest: input.rootReviewDigest,
      statement: branch.proposal.sourceGap,
    }))];
    return { ...branch, branchId: branchDigest(input.rootReviewDigest, index, branch),
      parentObligationIds, maxObservedTokens: perBranchTokens, maxWallSeconds: perBranchSeconds };
  });
  const body = { version: 1 as const, rootReviewDigest: input.rootReviewDigest, branches };
  return mathPortfolioSchema.parse({ ...body, portfolioDigest: portfolioDigest(body) });
}

/** Validates the sealed manifest without reapplying evolving admission policy to history. */
export function validMathPortfolio(raw: unknown): raw is MathPortfolio {
  const parsed = mathPortfolioSchema.safeParse(raw);
  if (!parsed.success) return false;
  const { portfolioDigest: recorded, ...body } = parsed.data;
  if (portfolioDigest(body) !== recorded) return false;
  const ids = new Set<string>();
  const strategies = new Set<string>();
  for (const [index, branch] of parsed.data.branches.entries()) {
    const draft = { strategy: branch.strategy, proposal: branch.proposal,
      anticipatedFalsifier: branch.anticipatedFalsifier,
      expectedInformationGain: branch.expectedInformationGain, toolNeeds: branch.toolNeeds };
    if (branch.branchId !== branchDigest(parsed.data.rootReviewDigest, index, draft) ||
      branch.parentObligationIds.length === 0 || ids.has(branch.branchId) ||
      strategies.has(branch.strategy)) return false;
    ids.add(branch.branchId);
    strategies.add(branch.strategy);
  }
  return true;
}

const gainScore = { LOW: 0, MEDIUM: 2, HIGH: 4 } as const;
function branchScore(branch: MathPortfolioBranch): number {
  // Model-stated gain only breaks ties after executable falsification potential.
  return (branch.proposal.structuralProbePlan ? 40 : 0) +
    (branch.proposal.exactSurveyPlan ? 30 : 0) + gainScore[branch.expectedInformationGain];
}

export function selectMathPortfolioBranch(input: { portfolio: MathPortfolio;
  selectedBranchIds: readonly string[]; priorClaims: readonly string[] }): MathPortfolioBranch | null {
  const selected = new Set(input.selectedBranchIds);
  const claims = new Set(input.priorClaims.map(normalizedMathClaim));
  const lastStrategy = input.portfolio.branches.find((branch) =>
    branch.branchId === input.selectedBranchIds.at(-1))?.strategy;
  return input.portfolio.branches.filter((branch) => !selected.has(branch.branchId) &&
    !claims.has(normalizedMathClaim(branch.proposal.hypothesis)))
    .sort((a, b) => (Number(b.strategy !== lastStrategy) - Number(a.strategy !== lastStrategy)) * 100 +
      branchScore(b) - branchScore(a) || a.branchId.localeCompare(b.branchId))[0] ?? null;
}

export function summarizeMathPortfolio(portfolio: MathPortfolio,
  events: readonly MathCycleEventPayload[]): Extract<MathCycleEventPayload, { phase: "PORTFOLIO_EXHAUSTED" }>["branches"] {
  return portfolio.branches.map((branch) => {
    const closed = events.find((event) => event.phase === "BRANCH_CLOSED" && event.branchId === branch.branchId);
    return { branchId: branch.branchId, state: closed?.phase === "BRANCH_CLOSED" ? closed.outcome : "NOT_RUN" as const,
      reason: closed?.phase === "BRANCH_CLOSED" ? closed.reason : "Not selected within the bounded cycle" };
  });
}

/** Thresholds are checked before calls; an in-flight Codex call may exceed them. */
export function branchResourceStopReason(input: { branch: MathPortfolioBranch;
  baselineObservedTokens: number; currentObservedTokens: number; selectedAt: string; now: Date }):
  "BRANCH_TOKEN_LIMIT" | "BRANCH_TIME_LIMIT" | null {
  if (input.currentObservedTokens - input.baselineObservedTokens >= input.branch.maxObservedTokens) return "BRANCH_TOKEN_LIMIT";
  if (input.now.getTime() - Date.parse(input.selectedAt) >= input.branch.maxWallSeconds * 1_000) return "BRANCH_TIME_LIMIT";
  return null;
}
