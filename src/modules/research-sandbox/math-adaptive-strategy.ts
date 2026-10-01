import { z } from "zod";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "./integrity";
import { methodFamilySchema, methodIdSchema, type ResearchMethodPacket } from "./math-method-map";
import { normalizedMathClaim } from "./math-proof-obligations";
import type { MathCycleEventPayload } from "./math-cycle";
import type { MathPilotContract } from "./math-pilot";
import { knownScopeForTask } from "./math-prior-art";
import { structuralProbePlanSchema } from "./math-structural-probe";
import { mixedCoreClaimSchema } from "./math-mixed-core-agent";
import { lemmaGraphMandate, type MathLemmaGraph } from "./math-lemma-graph";

const digest = z.string().regex(/^[a-f0-9]{64}$/);
const text = z.string().trim().min(20).max(1_000);
export const adaptivePolicySchema = z.object({ policyId: z.enum(["ADAPTIVE_RESEARCH_V1", "ADAPTIVE_RESEARCH_V2"]),
  cycleId: z.uuid(), rootContractDigest: digest, rootReviewDigest: digest }).strict();
export type AdaptivePolicy = z.infer<typeof adaptivePolicySchema>;
export const adaptiveBranchFields = {
  methodId: methodIdSchema, methodFamily: methodFamilySchema,
  rootContribution: z.object({ kind: z.enum(["ROOT_BRIDGE", "STRUCTURAL_REDUCTION", "DISCRIMINATING_FALSIFICATION", "DEVELOPMENT_WARMUP"]),
    statement: text }).strict(),
  applicabilityAssumptions: text,
  discriminatingExperiment: z.object({ question: text, supportOutcome: text, refutationOutcome: text,
    inconclusiveOutcome: text }).strict(),
  requiredTools: z.array(z.enum(["PROOF_ATTEMPT", "SOURCE_REVIEW", "STRUCTURAL_PROBE", "RESIDUAL_SURVEY",
    "SPLIT_RAY_REPLAY", "SEVEN_EQUATION_SIEVE", "POINTWISE_ANALYTIC_BOUND", "GLOBAL_SUPPORT_CERTIFICATE"])).min(1).max(6),
  evaluationScope: z.enum(["DEVELOPMENT_WARMUP", "UNVALIDATED_RESEARCH"]),
};
export const adaptiveBranchSchema = z.object(adaptiveBranchFields).strict();
export type AdaptiveBranch = z.infer<typeof adaptiveBranchSchema>;
export const researchOutcomeSchema = z.object({ sourceCycleId: z.string().min(1).max(160), sourceLedgerDigest: digest,
  hypothesis: z.string().min(20).max(2_000), methodFamily: methodFamilySchema.nullable(),
  outcome: z.enum(["TYPED_PREDICATE_REFUTED", "KNOWN", "REJECTED", "REVIEWED_ARGUMENT", "INCONCLUSIVE", "ATTEMPTED_ONLY", "PRUNED"]),
  refutation: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("MIXED_CORE_CLAIM"), scope: z.literal("REGISTERED_PREDICATE_ONLY"),
      claimId: mixedCoreClaimSchema, evidenceDigest: digest }).strict(),
    z.object({ kind: z.literal("STRUCTURAL_PROBE"), scope: z.literal("REGISTERED_PREDICATE_ONLY"),
      plan: structuralProbePlanSchema, planDigest: digest, reportDigest: digest }).strict(),
  ]).nullable(),
  authority: z.literal("RECORDED_EVENTS_NOT_THEOREM_CERTIFICATION") }).strict().superRefine((record, ctx) => {
    if ((record.outcome === "TYPED_PREDICATE_REFUTED") !== Boolean(record.refutation) ||
      record.refutation?.kind === "STRUCTURAL_PROBE" && record.refutation.planDigest !== sha256(canonicalJson(record.refutation.plan)))
      ctx.addIssue({ code: "custom", message: "Typed refutation must carry its exact predicate and evidence binding" });
  });
export type ResearchOutcome = z.infer<typeof researchOutcomeSchema>;
export const adaptiveSelectionSchema = z.object({ policyId: z.enum(["ADAPTIVE_RESEARCH_V1", "ADAPTIVE_RESEARCH_V2"]),
  methodPacketDigest: digest, portfolioDigest: digest, memoryDigest: digest, selectedBranchId: digest.nullable(),
  ranking: z.array(z.object({ branchId: digest, priority: z.number().int(), state: z.enum(["READY", "DEFERRED", "EXCLUDED"]),
    missingTools: z.array(z.string().max(80)).max(6), reason: z.string().min(12).max(500) }).strict()).min(2).max(3),
  meaning: z.literal("PROPOSED_ROUTING_NOT_VERIFIED_SCIENCE"), selectionDigest: digest }).strict();
export type AdaptiveSelection = z.infer<typeof adaptiveSelectionSchema>;
export type AdaptiveResearchContext = { packet: ResearchMethodPacket; outcomes: ResearchOutcome[];
  selectedBranch: AdaptiveBranch | null; selection: AdaptiveSelection | null;
  policyId?: AdaptivePolicy["policyId"]; lemmaGraph?: MathLemmaGraph | null };

/** Trusted command outcome is the downgrade barrier; malformed markers fail, never become legacy. */
export function commandAdaptivePolicy(outcome: unknown, cycle: { id: string; rootContractDigest: string; rootReviewDigest: string }): AdaptivePolicy | null {
  if (!outcome || typeof outcome !== "object" || !("strategyPolicy" in outcome)) return null;
  const policy = adaptivePolicySchema.parse((outcome as { strategyPolicy: unknown }).strategyPolicy);
  if (policy.cycleId !== cycle.id || policy.rootContractDigest !== cycle.rootContractDigest ||
    policy.rootReviewDigest !== cycle.rootReviewDigest) throw new Error("Command strategy policy does not match sealed cycle");
  return policy;
}

/** Only governed existing runtimes are ready. Model labels cannot create tool authority. */
const readyTools = new Set(["PROOF_ATTEMPT", "SOURCE_REVIEW", "STRUCTURAL_PROBE", "RESIDUAL_SURVEY"]);
export function missingAdaptiveTools(branch: AdaptiveBranch): string[] {
  return branch.requiredTools.filter((tool) => !readyTools.has(tool));
}

/** Use real attempt/review/refutation events, never the coarse ROUND_CLOSED projection alone. */
export function projectResearchOutcomes(input: { cycleId: string; ledgerDigest: string; trace: readonly MathCycleEventPayload[] }): ResearchOutcome[] {
  const portfolio = input.trace.find((event) => event.phase === "PORTFOLIO_PLANNED")?.portfolio;
  return input.trace.filter((event) => event.phase === "PROPOSED").map((event) => {
    const round = input.trace.filter((item) => item.round === event.round);
    const selected = round.find((item) => item.phase === "BRANCH_SELECTED");
    const branch = portfolio && portfolio.version !== 1 ? portfolio.branches.find((item) => item.branchId === selected?.branchId) : null;
    const refuted = round.find((item) => item.phase === "MIXED_CORE_CLAIM_REFUTED" ||
      item.phase === "STRUCTURAL_PROBED" && item.report.status === "REFUTED");
    const refutation = refuted?.phase === "MIXED_CORE_CLAIM_REFUTED" ? {
      kind: "MIXED_CORE_CLAIM" as const, scope: "REGISTERED_PREDICATE_ONLY" as const,
      claimId: refuted.claim, evidenceDigest: refuted.evidenceDigest } : refuted?.phase === "STRUCTURAL_PROBED" ? {
        kind: "STRUCTURAL_PROBE" as const, scope: "REGISTERED_PREDICATE_ONLY" as const,
        plan: refuted.report.plan, planDigest: sha256(canonicalJson(refuted.report.plan)), reportDigest: refuted.report.reportDigest } : null;
    const known = round.some((item) => item.phase === "FRONTIER_GATE" && item.decision === "KNOWN");
    const rejected = round.some((item) => item.phase === "VERIFIED" && !item.accepted);
    const attempted = round.some((item) => item.phase === "ATTEMPTED");
    const reviews = round.filter((item) => item.phase === "REVIEWED");
    const outcome = refuted ? "TYPED_PREDICATE_REFUTED" : known ? "KNOWN" : rejected ? "REJECTED" :
      attempted && reviews.length === 2 ? reviews.every((item) => item.report.verdict === "SUPPORTS" &&
        item.report.unresolvedGap === null) ? "REVIEWED_ARGUMENT" : "INCONCLUSIVE" : attempted ? "ATTEMPTED_ONLY" : "PRUNED";
    return { sourceCycleId: input.cycleId, sourceLedgerDigest: input.ledgerDigest,
      hypothesis: event.proposal.hypothesis, methodFamily: branch?.methodFamily ?? null, outcome, refutation,
      authority: "RECORDED_EVENTS_NOT_THEOREM_CERTIFICATION" as const };
  });
}

const priority = { ROOT_BRIDGE: 40, STRUCTURAL_REDUCTION: 30, DISCRIMINATING_FALSIFICATION: 20, DEVELOPMENT_WARMUP: 0 };
export function adaptiveSelection(input: { packet: ResearchMethodPacket; portfolioDigest: string;
  policyId?: AdaptivePolicy["policyId"];
  branches: readonly (AdaptiveBranch & { branchId: string; proposal: { hypothesis: string; taskStatement: string }; })[];
  root?: MathPilotContract;
  selectedBranchIds: readonly string[]; priorClaims: readonly string[]; outcomes: readonly ResearchOutcome[] }): AdaptiveSelection {
  const claims = new Set(input.priorClaims.map(normalizedMathClaim));
  const previousFamilies = new Set(input.outcomes.filter((record) => record.outcome === "INCONCLUSIVE" ||
    record.outcome === "ATTEMPTED_ONLY").map((record) => record.methodFamily));
  const ranking = input.branches.map((branch) => {
    const method = input.packet.methods.find((card) => card.id === branch.methodId);
    const repeated = claims.has(normalizedMathClaim(branch.proposal.hypothesis)) ||
      input.outcomes.some((record) => normalizedMathClaim(record.hypothesis) === normalizedMathClaim(branch.proposal.hypothesis));
    const known = input.root && knownScopeForTask(input.root, `${branch.proposal.hypothesis}\n${branch.proposal.taskStatement}`);
    const excluded = input.selectedBranchIds.includes(branch.branchId) || repeated || known ||
      !method || method.family !== branch.methodFamily || method.applicability === "QUARANTINED_LEAD" ||
      branch.rootContribution.kind === "DEVELOPMENT_WARMUP" || branch.evaluationScope === "DEVELOPMENT_WARMUP";
    const missingTools = missingAdaptiveTools(branch);
    return { branchId: branch.branchId,
      priority: priority[branch.rootContribution.kind] - (previousFamilies.has(branch.methodFamily) ? 5 : 0),
      state: excluded ? "EXCLUDED" as const : missingTools.length ? "DEFERRED" as const : "READY" as const,
      missingTools, reason: excluded ? "Already selected/repeated, known-scope, warmup-only, or quarantined: not a new root-directed experiment." :
        missingTools.length ? "Scientifically proposed direction retained; required governed runtime is missing, so it cannot execute." :
          previousFamilies.has(branch.methodFamily) ? "Runnable root-directed candidate; prior inconclusive family is penalized to diversify routing." :
            "Runnable root-directed candidate ranked by proposed contribution, without a tool-existence bonus." };
  }).sort((a, b) => b.priority - a.priority || a.branchId.localeCompare(b.branchId));
  const body = { policyId: input.policyId ?? "ADAPTIVE_RESEARCH_V1", methodPacketDigest: input.packet.packetDigest,
    portfolioDigest: input.portfolioDigest, memoryDigest: sha256(canonicalJson(input.outcomes)),
    selectedBranchId: ranking.find((row) => row.state === "READY")?.branchId ?? null,
    ranking, meaning: "PROPOSED_ROUTING_NOT_VERIFIED_SCIENCE" as const };
  return { ...body, selectionDigest: sha256(canonicalJson(body)) };
}

export function adaptiveAgentMandate(context?: AdaptiveResearchContext | null): string {
  if (!context) return "";
  return `${context.policyId ?? "ADAPTIVE_RESEARCH_V1"}: literature status is not mathematical certification. All method premises require proof; unavailable/stale/historical sources remain hypothetical background, never current accepted premises; quarantined sources cannot be accepted premises. Corpus is partial. Contributions/priorities are proposed routing, not verified science. TYPED_PREDICATE_REFUTED applies ONLY to the exact retained registered claim/probe predicate; equivalence to the originating prose hypothesis is not certified. Generic counterexample replay PASS is finite arithmetic evidence, not hypothesis refutation. Four fixed arithmetic targets are development/warmup, not held-out validation. Missing tools are deferred requests; never invent or execute model-written runtimes. Discriminating support/refutation/inconclusive outcomes must remain scoped.\n${JSON.stringify({
    rootDigest: context.packet.rootDigest, packetDigest: context.packet.packetDigest,
    frontierDossierDigest: context.packet.frontierDossierDigest, sources: context.packet.sources.map(({ publicationId, status, selectedVersion, latestVersion, notice }) =>
      ({ publicationId, status, selectedVersion, latestVersion, notice })), methods: context.packet.methods,
    outcomes: context.outcomes, selectedBranch: context.selectedBranch, selection: context.selection })}\n${context.policyId === "ADAPTIVE_RESEARCH_V2" ? "ADAPTIVE_RESEARCH_V2: every autonomous branch requires a sealed lemma graph; structural validation is not proof." : "Historical/steered adaptive V1 has no required lemma graph; do not synthesize one."}\n${lemmaGraphMandate(context.lemmaGraph)}`;
}
