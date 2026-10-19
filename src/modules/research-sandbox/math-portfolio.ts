import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { sha256 } from "./integrity";
import { mathPortfolioDraftSchema, mathPortfolioDraftV2Schema, mathPortfolioDraftV3Schema, mathPortfolioDraftV2BranchSchema, mathPortfolioSchema,
  type MathCycleEventPayload } from "./math-cycle";
import { normalizedMathClaim, type MathProofObligation } from "./math-proof-obligations";
import { adaptiveSelection, type ResearchOutcome } from "./math-adaptive-strategy";
import type { ResearchMethodPacket } from "./math-method-map";
import type { MathPilotContract } from "./math-pilot";
import { lemmaGraphDraft, lemmaGraphSchema, sealMathLemmaGraph, validMathLemmaGraph } from "./math-lemma-graph";
import { digestMathPilotContract } from "./math-pilot";

export type MathPortfolio = ReturnType<typeof mathPortfolioSchema.parse>;
export type MathPortfolioBranch = MathPortfolio["branches"][number];

function branchDigest(rootReviewDigest: string, index: number, branch: unknown): string {
  return sha256(canonicalJson({ rootReviewDigest, index, branch }));
}

function portfolioDigest(portfolio: unknown): string {
  return sha256(canonicalJson(portfolio));
}

/** Model proposals are untrusted. Bind them to exact gaps and validated obligation IDs. */
export function sealMathPortfolio(input: { draft: unknown; rootReviewDigest: string;
  availableGaps: readonly string[]; priorObligations: readonly MathProofObligation[];
  maxObservedTokens: number; maxRounds: number; methodPacket?: ResearchMethodPacket | null;
  graphPolicy?: { cycleId: string; root: MathPilotContract } }): MathPortfolio {
  const draft = input.graphPolicy ? mathPortfolioDraftV3Schema.parse(input.draft)
    : input.methodPacket ? mathPortfolioDraftV2Schema.parse(input.draft) : mathPortfolioDraftSchema.parse(input.draft);
  if (input.graphPolicy && (!input.methodPacket || digestMathPilotContract(input.graphPolicy.root) !== input.methodPacket.rootDigest))
    throw new Error("Graph root must match the sealed method packet");
  if (!/^[a-f0-9]{64}$/.test(input.rootReviewDigest) || input.maxRounds < 1 || input.maxRounds > 2 ||
    !Number.isInteger(input.maxObservedTokens) || input.maxObservedTokens < 10_000 || input.maxObservedTokens > 200_000) {
    throw new Error("Invalid portfolio root or resource envelope");
  }
  const strategies = new Set<string>();
  const families = new Set<string>();
  const hypotheses = new Set<string>();
  const perBranchTokens = Math.max(10_000, Math.floor(input.maxObservedTokens / input.maxRounds));
  const perBranchSeconds = Math.floor(3_000 / input.maxRounds);
  const branches = draft.branches.map((branch, index) => {
    const hypothesis = normalizedMathClaim(branch.proposal.hypothesis);
    if (!input.availableGaps.includes(branch.proposal.sourceGap) ||
      hypotheses.has(hypothesis) || (!input.methodPacket && strategies.has(branch.strategy))) {
      throw new Error("Portfolio branches need distinct strategies, hypotheses and exact retained gaps");
    }
    hypotheses.add(hypothesis);
    strategies.add(branch.strategy);
    if (input.methodPacket && "methodId" in branch) {
      const adaptive = mathPortfolioDraftV2BranchSchema.parse("lemmaGraph" in branch
        ? Object.fromEntries(Object.entries(branch).filter(([key]) => key !== "lemmaGraph")) : branch);
      const method = input.methodPacket.methods.find((card) => card.id === adaptive.methodId);
      if (!method || families.has(adaptive.methodFamily) || method.family !== adaptive.methodFamily || method.applicability === "QUARANTINED_LEAD" ||
        Boolean(branch.proposal.structuralProbePlan) !== adaptive.requiredTools.includes("STRUCTURAL_PROBE") ||
        Boolean(branch.proposal.exactSurveyPlan) !== adaptive.requiredTools.includes("RESIDUAL_SURVEY") ||
        adaptive.evaluationScope === "DEVELOPMENT_WARMUP" && adaptive.rootContribution.kind !== "DEVELOPMENT_WARMUP") {
        throw new Error("Adaptive branch method, scope or governed runtime is inconsistent");
      }
      families.add(adaptive.methodFamily);
    }
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
    const branchId = branchDigest(input.rootReviewDigest, index, branch);
    return { ...branch, ...(input.graphPolicy && "lemmaGraph" in branch ? { lemmaGraph: sealMathLemmaGraph({
      draft: branch.lemmaGraph, root: input.graphPolicy.root, cycleId: input.graphPolicy.cycleId, branchId,
      rootReviewDigest: input.rootReviewDigest, methodPacketDigest: input.methodPacket!.packetDigest }) } : {}), branchId,
      parentObligationIds, maxObservedTokens: perBranchTokens, maxWallSeconds: perBranchSeconds };
  });
  const body = input.graphPolicy ? { version: 3 as const, cycleId: input.graphPolicy.cycleId,
    rootReviewDigest: input.rootReviewDigest, branches, methodPacketDigest: input.methodPacket!.packetDigest,
    rootContractDigest: input.methodPacket!.rootDigest, policyId: "ADAPTIVE_RESEARCH_V2" as const }
    : input.methodPacket ? { version: 2 as const, rootReviewDigest: input.rootReviewDigest, branches,
    methodPacketDigest: input.methodPacket.packetDigest, rootContractDigest: input.methodPacket.rootDigest,
    policyId: "ADAPTIVE_RESEARCH_V1" as const } : { version: 1 as const, rootReviewDigest: input.rootReviewDigest, branches };
  return mathPortfolioSchema.parse({ ...body, portfolioDigest: portfolioDigest(body) });
}

/** Validates the sealed manifest without reapplying evolving admission policy to history. */
export function validMathPortfolio(raw: unknown, methodPacket?: ResearchMethodPacket): raw is MathPortfolio {
  const parsed = mathPortfolioSchema.safeParse(raw);
  if (!parsed.success) return false;
  const { portfolioDigest: recorded, ...body } = parsed.data;
  if (portfolioDigest(body) !== recorded) return false;
  const ids = new Set<string>();
  const strategies = new Set<string>();
  const families = new Set<string>();
  const hypotheses = new Set<string>();
  for (const [index, branch] of parsed.data.branches.entries()) {
    const { branchId: _id, parentObligationIds: _parents, maxObservedTokens: _tokens, maxWallSeconds: _seconds, ...fullDraft } = branch;
    void _id; void _parents; void _tokens; void _seconds;
    const draft = parsed.data.version === 3 && "lemmaGraph" in branch
      ? { ...fullDraft, lemmaGraph: lemmaGraphDraft(lemmaGraphSchema.parse(branch.lemmaGraph)) }
      : parsed.data.version === 2 ? fullDraft : { strategy: branch.strategy, proposal: branch.proposal,
      anticipatedFalsifier: branch.anticipatedFalsifier,
      expectedInformationGain: branch.expectedInformationGain, toolNeeds: branch.toolNeeds };
    if (branch.branchId !== branchDigest(parsed.data.rootReviewDigest, index, draft) ||
      branch.parentObligationIds.length === 0 || ids.has(branch.branchId) ||
      parsed.data.version === 1 && strategies.has(branch.strategy)) return false;
    if ("methodId" in branch) {
      const adaptive = mathPortfolioDraftV2BranchSchema.parse("lemmaGraph" in branch
        ? Object.fromEntries(Object.entries(fullDraft).filter(([key]) => key !== "lemmaGraph")) : fullDraft);
      const methodFamilies = { TAO_TYPE_II_DIVISOR: "TYPE_II_DIVISOR_RAYS", SALEZ_MODULAR_SIEVE: "MODULAR_SIEVE",
        TAO_LOCAL_OBSTRUCTION: "LOCAL_OBSTRUCTION", ELSHOLTZ_TAO_AVERAGE: "AVERAGE_COUNTS",
        SUPPORT_UNIFORM_BRIDGE: "GLOBAL_BRIDGE", JIANG_WITHDRAWN_LEAD: "QUARANTINED_LEAD" };
      const method = methodPacket?.methods.find((card) => card.id === adaptive.methodId);
      if (families.has(adaptive.methodFamily) || hypotheses.has(normalizedMathClaim(branch.proposal.hypothesis)) ||
        methodFamilies[adaptive.methodId] !== adaptive.methodFamily || adaptive.methodId === "JIANG_WITHDRAWN_LEAD" ||
        methodPacket && (!method || method.applicability === "QUARANTINED_LEAD" ||
          parsed.data.version === 1 || parsed.data.methodPacketDigest !== methodPacket.packetDigest ||
          parsed.data.rootContractDigest !== methodPacket.rootDigest) ||
        Boolean(branch.proposal.structuralProbePlan) !== branch.toolNeeds.includes("STRUCTURAL_PROBE") ||
        Boolean(branch.proposal.exactSurveyPlan) !== branch.toolNeeds.includes("RESIDUAL_SURVEY") ||
        Boolean(branch.proposal.structuralProbePlan) !== adaptive.requiredTools.includes("STRUCTURAL_PROBE") ||
        Boolean(branch.proposal.exactSurveyPlan) !== adaptive.requiredTools.includes("RESIDUAL_SURVEY") ||
        adaptive.evaluationScope === "DEVELOPMENT_WARMUP" && adaptive.rootContribution.kind !== "DEVELOPMENT_WARMUP") return false;
      families.add(adaptive.methodFamily);
      hypotheses.add(normalizedMathClaim(branch.proposal.hypothesis));
    }
    if (parsed.data.version === 3 && (!('lemmaGraph' in branch) || !validMathLemmaGraph(branch.lemmaGraph, {
      cycleId: parsed.data.cycleId, branchId: branch.branchId, rootContractDigest: parsed.data.rootContractDigest,
      rootReviewDigest: parsed.data.rootReviewDigest, methodPacketDigest: parsed.data.methodPacketDigest }))) return false;
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
  selectedBranchIds: readonly string[]; priorClaims: readonly string[];
  methodPacket?: ResearchMethodPacket | null; outcomes?: readonly ResearchOutcome[]; root?: MathPilotContract }): MathPortfolioBranch | null {
  if (input.portfolio.version !== 1) {
    if (!input.methodPacket || input.methodPacket.packetDigest !== input.portfolio.methodPacketDigest) return null;
    const selection = adaptiveSelection({ packet: input.methodPacket, portfolioDigest: input.portfolio.portfolioDigest,
      policyId: input.portfolio.policyId,
      branches: input.portfolio.branches, selectedBranchIds: input.selectedBranchIds, priorClaims: input.priorClaims,
      outcomes: input.outcomes ?? [], root: input.root });
    return input.portfolio.branches.find((branch) => branch.branchId === selection.selectedBranchId) ?? null;
  }
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
