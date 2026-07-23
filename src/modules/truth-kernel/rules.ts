import type { ClaimState } from "@prisma/client";

export interface AssertionEvidence {
  normalizedValue: string | null;
  relation: "SUPPORTS" | "CONTRADICTS" | null;
  independenceKey: string | null;
  qualifiesForCorroboration: boolean;
}

export interface TruthEvaluation {
  state: ClaimState;
  independentQualifyingSources: number;
  distinctValues: number;
}

/** Deterministic claim-state projection from the retained assertion ledger. */
export function evaluateTruth(
  evidence: readonly AssertionEvidence[],
  hasFalsificationCriterion: boolean,
): TruthEvaluation {
  const values = new Set(
    evidence
      .map((item) => item.normalizedValue)
      .filter((value): value is string => value !== null),
  );
  const hasContradiction = evidence.some((item) => item.relation === "CONTRADICTS");
  const qualifying = new Set(
    evidence
      .filter(
        (item) =>
          item.relation === "SUPPORTS" &&
          item.qualifiesForCorroboration &&
          item.independenceKey !== null,
      )
      .map((item) => item.independenceKey!),
  );

  let state: ClaimState;
  if (values.size > 1 || hasContradiction) state = "DISPUTED";
  else if (qualifying.size >= 2) state = "CORROBORATED";
  else if (evidence.some((item) => item.relation === "SUPPORTS")) state = "SOURCED";
  else state = hasFalsificationCriterion ? "HYPOTHESIS" : "DRAFT";

  return {
    state,
    independentQualifyingSources: qualifying.size,
    distinctValues: values.size,
  };
}

export function assertExactSpan(
  content: string,
  startOffset: number,
  endOffset: number,
  exactText: string,
): boolean {
  return (
    Number.isInteger(startOffset) &&
    Number.isInteger(endOffset) &&
    startOffset >= 0 &&
    endOffset > startOffset &&
    endOffset <= content.length &&
    content.slice(startOffset, endOffset) === exactText
  );
}
