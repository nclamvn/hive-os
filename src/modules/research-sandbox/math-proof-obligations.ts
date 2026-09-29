import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { sha256 } from "./integrity";
import type { MathCycleEventPayload, MathCycleProposal } from "./math-cycle";

export type ObligationKind = "GAP" | "CLAIM" | "FALSIFICATION" | "PROOF" | "PRIOR_ART";
export type ObligationState = "OPEN" | "TASK_REJECTED" | "TASK_ACCEPTED" | "TYPED_REFUTATION" |
  "NOT_REFUTED_IN_BOUND" | "FINITE_REPLAYED" | "AI_ATTEMPTED" | "AI_REVIEWED" |
  "KNOWN_SCOPE" | "SOURCE_HOLD" | "RESEARCH_ONLY";

export interface MathProofObligation {
  id: string;
  parentId: string | null;
  cycleId: string;
  round: number;
  kind: ObligationKind;
  statement: string;
  state: ObligationState;
  /** The validated ledger tip, not a free-standing mathematical certificate. */
  ledgerDigest: string;
}

export function normalizedMathClaim(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");
}

function obligationId(cycleId: string, round: number, kind: ObligationKind, statement: string): string {
  return sha256(canonicalJson({ cycleId, round, kind, statement }));
}

/** A read-only DAG projection of a validated cycle. No AI verdict is promoted to a theorem. */
export function projectMathProofObligations(input: {
  cycleId: string; ledgerDigest: string; trace: MathCycleEventPayload[];
}): MathProofObligation[] {
  if (!/^[a-f0-9]{64}$/.test(input.ledgerDigest)) return [];
  const nodes: MathProofObligation[] = [];
  for (const proposed of input.trace) {
    if (proposed.phase !== "PROPOSED") continue;
    const { round, proposal } = proposed;
    const events = input.trace.filter((event) => event.round === round);
    const verified = events.find((event) => event.phase === "VERIFIED");
    const probe = events.find((event) => event.phase === "STRUCTURAL_PROBED");
    const replay = events.find((event) => event.phase === "INDEPENDENT_REPLAY");
    const attempted = events.some((event) => event.phase === "ATTEMPTED");
    const reviewed = events.some((event) => event.phase === "ROUND_CLOSED");
    const frontier = events.find((event) => event.phase === "FRONTIER_GATE");
    const gapId = obligationId(input.cycleId, round, "GAP", proposal.sourceGap);
    const claimId = obligationId(input.cycleId, round, "CLAIM", proposal.hypothesis);
    const sourceRound = input.trace.filter((event) => event.phase === "ROUND_CLOSED" &&
      event.round < round && event.nextGap === proposal.sourceGap).at(-1)?.round;
    const sourceProposal = input.trace.find((event) => event.phase === "PROPOSED" &&
      event.round === sourceRound);
    const gapParentId = sourceProposal?.phase === "PROPOSED"
      ? obligationId(input.cycleId, sourceProposal.round, "PROOF", sourceProposal.proposal.successEvidence)
      : null;
    const add = (kind: ObligationKind, statement: string, state: ObligationState, parentId: string | null) => {
      nodes.push({ id: obligationId(input.cycleId, round, kind, statement), parentId,
        cycleId: input.cycleId, round, kind, statement, state, ledgerDigest: input.ledgerDigest });
    };
    add("GAP", proposal.sourceGap, "OPEN", gapParentId);
    add("CLAIM", proposal.hypothesis,
      verified?.phase === "VERIFIED" ? verified.accepted ? "TASK_ACCEPTED" : "TASK_REJECTED" : "OPEN", gapId);
    add("FALSIFICATION", proposal.falsificationPlan,
      probe?.phase === "STRUCTURAL_PROBED" && probe.report.status === "REFUTED" ? "TYPED_REFUTATION" :
      probe?.phase === "STRUCTURAL_PROBED" && probe.report.status === "NOT_REFUTED_IN_BOUND" ? "NOT_REFUTED_IN_BOUND" :
      replay?.phase === "INDEPENDENT_REPLAY" && replay.report.status === "PASS" ? "FINITE_REPLAYED" : "OPEN", claimId);
    add("PROOF", proposal.successEvidence, reviewed ? "AI_REVIEWED" : attempted ? "AI_ATTEMPTED" : "OPEN", claimId);
    add("PRIOR_ART", proposal.taskStatement,
      frontier?.phase === "FRONTIER_GATE" ? frontier.decision === "KNOWN" ? "KNOWN_SCOPE" :
        frontier.decision === "HOLD" ? "SOURCE_HOLD" : "RESEARCH_ONLY" : "OPEN", claimId);
  }
  return nodes;
}

export function priorClaimsFromTraces(traces: readonly MathCycleEventPayload[][]): string[] {
  return [...new Set(traces.flatMap((trace) => trace.flatMap((event) => event.phase === "PROPOSED"
    ? [event.proposal.hypothesis] : [])))];
}

export function repeatedMathClaim(proposal: MathCycleProposal, priorClaims: readonly string[]): boolean {
  return priorClaims.some((claim) => normalizedMathClaim(claim) === normalizedMathClaim(proposal.hypothesis));
}
