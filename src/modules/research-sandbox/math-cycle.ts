import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { mathAgentReportSchema } from "./agent-review";
import { mathModelAttemptSchema } from "./contracts";
import { sha256 } from "./integrity";
import { mathPilotContractSchema, type MathPilotContract } from "./math-pilot";
import { knownScopeForTask } from "./math-prior-art";
import { frontierAssessmentSchema, frontierDossierSchema } from "./math-frontier";

const text = (minimum: number, maximum: number) => z.string().trim().min(minimum).max(maximum);
export const mathCycleLimitsSchema = z.object({
  maxRounds: z.number().int().min(1).max(2),
  maxObservedTokens: z.number().int().min(10_000).max(120_000),
}).strict();

export const mathCycleProposalSchema = z.object({
  sourceGap: text(12, 2_000),
  hypothesis: text(20, 2_000),
  taskStatement: text(30, 4_000),
  falsificationPlan: text(20, 1_000),
  successEvidence: text(20, 1_000),
  rationale: text(30, 2_000),
}).strict();

export const mathCycleVerificationSchema = z.object({
  decision: z.enum(["ACCEPT", "REJECT"]),
  sourceGap: text(12, 2_000),
  scopeCheck: text(20, 1_000),
  noveltyCheck: text(20, 1_000),
  falsifiabilityCheck: text(20, 1_000),
  unresolvedRisk: text(20, 1_000),
}).strict();

export const mathCycleUsageSchema = mathModelAttemptSchema.shape.usage;
export const mathCycleModelResultSchema = z.object({
  threadId: text(1, 160),
  usage: mathCycleUsageSchema,
}).strict();

const priorArtFactSchema = z.object({
  id: text(4, 160), claim: text(20, 1_000), sourceUrl: z.url(), sourceTitle: text(8, 300),
  modulus: z.number().int().positive(), residue: z.number().int().nonnegative(),
  // Optional only to keep pre-TIP-032 immutable PRIOR_ART events readable.
  sourceScope: z.enum(["ALL_INTEGERS", "ODD_PRIMES"]).optional(), scopeLift: text(20, 1_000).optional(),
}).strict();

export const mathCycleEventPayloadSchema = z.discriminatedUnion("phase", [
  z.object({ phase: z.literal("PRIOR_ART"), round: z.number().int().positive(), facts: z.array(priorArtFactSchema).max(32),
    coverage: z.literal("CURATED_PARTIAL") }).strict(),
  z.object({ phase: z.literal("FRONTIER_DOSSIER"), round: z.number().int().positive(), dossier: frontierDossierSchema }).strict(),
  z.object({ phase: z.literal("FRONTIER_REVIEWED"), round: z.number().int().positive(), role: z.enum(["SOURCE_ANALYST", "SOURCE_CHALLENGER"]),
    dossierDigest: z.string().regex(/^[a-f0-9]{64}$/), assessment: frontierAssessmentSchema, context: mathCycleModelResultSchema }).strict(),
  z.object({ phase: z.literal("FRONTIER_GATE"), round: z.number().int().positive(), decision: z.enum(["KNOWN", "RESEARCH_ONLY", "HOLD"]),
    dossierDigest: z.string().regex(/^[a-f0-9]{64}$/).nullable(), reason: text(12, 1_000) }).strict(),
  z.object({ phase: z.literal("CALL_STARTED"), role: z.enum(["PLANNER", "SOURCE_ANALYST", "SOURCE_CHALLENGER", "VERIFIER", "SOLVER", "CRITIC", "ADVERSARY"]), round: z.number().int().positive() }).strict(),
  z.object({ phase: z.literal("PROPOSED"), round: z.number().int().positive(), proposal: mathCycleProposalSchema, context: mathCycleModelResultSchema }).strict(),
  z.object({ phase: z.literal("VERIFIED"), round: z.number().int().positive(), verification: mathCycleVerificationSchema, context: mathCycleModelResultSchema, accepted: z.boolean(), reason: text(12, 1_000) }).strict(),
  z.object({ phase: z.literal("ATTEMPTED"), round: z.number().int().positive(), contract: mathPilotContractSchema, attempt: mathModelAttemptSchema }).strict(),
  z.object({ phase: z.literal("REVIEWED"), round: z.number().int().positive(), role: z.enum(["CRITIC", "ADVERSARY"]), report: mathAgentReportSchema }).strict(),
  z.object({ phase: z.literal("ROUND_CLOSED"), round: z.number().int().positive(), disposition: z.enum(["AI_REVIEWED", "INCONCLUSIVE"]), conclusion: z.enum(["PARTIAL", "INCONCLUSIVE"]), nextGap: text(12, 2_000).nullable() }).strict(),
  z.object({ phase: z.literal("STOPPED"), round: z.number().int().nonnegative(), reason: z.enum(["ROUND_LIMIT", "TOKEN_LIMIT", "TIME_LIMIT", "NO_GAP", "VERIFICATION_REJECTED", "FRONTIER_HOLD", "KNOWN_SCOPE", "MODEL_FAILURE", "INTEGRITY_FAILURE"]) }).strict(),
]);

export type MathCycleProposal = z.infer<typeof mathCycleProposalSchema>;
export type MathCycleVerification = z.infer<typeof mathCycleVerificationSchema>;
export type MathCycleEventPayload = z.infer<typeof mathCycleEventPayloadSchema>;
export type MathCycleUsage = z.infer<typeof mathCycleUsageSchema>;

export function mathCycleEventDigest(previousDigest: string | null, payload: MathCycleEventPayload): string {
  return sha256(canonicalJson({ previousDigest, payload: mathCycleEventPayloadSchema.parse(payload) }));
}

export function verifyMathCycleProposal(input: {
  rootContract: MathPilotContract;
  availableGaps: string[];
  priorTasks: string[];
  proposal: MathCycleProposal;
  verification: MathCycleVerification;
  plannerThreadId: string;
  verifierThreadId: string;
}): { accepted: boolean; reason: string } {
  const { rootContract, proposal, verification } = input;
  if (input.plannerThreadId === input.verifierThreadId) return { accepted: false, reason: "Planner and verifier did not use independent contexts" };
  if (!input.availableGaps.includes(proposal.sourceGap)) return { accepted: false, reason: "Proposed gap is not an exact retained review gap" };
  if (verification.sourceGap !== proposal.sourceGap) return { accepted: false, reason: "Verifier did not bind to the same review gap" };
  if (proposal.taskStatement === rootContract.statement || input.priorTasks.includes(proposal.taskStatement)) {
    return { accepted: false, reason: "Task duplicates the root statement or an earlier task" };
  }
  const priorArt = knownScopeForTask(rootContract, proposal.taskStatement) ??
    knownScopeForTask(rootContract, proposal.hypothesis);
  if (priorArt) return { accepted: false, reason: `Task targets a covered congruence class (${priorArt.id}): ${priorArt.sourceUrl}` };
  if (verification.decision !== "ACCEPT") return { accepted: false, reason: "Independent verifier rejected the task" };
  return { accepted: true, reason: "Exact-gap and distinct-context checks passed; literature novelty remains unverified beyond the curated prior-art screen" };
}

export function taskContract(root: MathPilotContract, proposal: MathCycleProposal): MathPilotContract {
  return mathPilotContractSchema.parse({
    ...root,
    statement: proposal.taskStatement,
    falsificationCriterion: proposal.falsificationPlan,
    successCriterion: proposal.successEvidence,
    exclusions: root.exclusions,
  });
}

export function observedTokens(usage: MathCycleUsage): number {
  return usage.inputTokens + usage.outputTokens;
}

/** Evaluated before every call; token usage is only known after a call. */
export function cycleResourceStopReason(input: {
  callsStarted: number; maxCalls: number; observedTokens: number; maxObservedTokens: number;
  deadlineAt: Date; now: Date;
}): "ROUND_LIMIT" | "TOKEN_LIMIT" | "TIME_LIMIT" | null {
  if (input.callsStarted >= input.maxCalls) return "ROUND_LIMIT";
  if (input.observedTokens >= input.maxObservedTokens) return "TOKEN_LIMIT";
  if (input.now >= input.deadlineAt) return "TIME_LIMIT";
  return null;
}
