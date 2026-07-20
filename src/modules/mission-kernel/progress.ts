import type { ObligationStatus } from "@prisma/client";

export interface ProgressInput {
  status: ObligationStatus;
  weight: number;
}

export interface Progress {
  closedWeight: number;
  totalWeight: number;
  basisPoints: number;
}

// Only these count as closed. OPEN / IN_PROGRESS / BLOCKED stay in the
// denominator and are never removed to inflate progress.
const CLOSED: ReadonlySet<ObligationStatus> = new Set(["SATISFIED", "WAIVED"]);

/**
 * Deterministic progress projection from the runtime obligations of the
 * currently approved contract. Never stored; computed from records only.
 * `basisPoints = floor(closedWeight * 10000 / totalWeight)`.
 */
export function computeProgress(obligations: ProgressInput[]): Progress {
  let totalWeight = 0;
  let closedWeight = 0;
  for (const o of obligations) {
    totalWeight += o.weight;
    if (CLOSED.has(o.status)) closedWeight += o.weight;
  }
  const basisPoints =
    totalWeight > 0 ? Math.floor((closedWeight * 10000) / totalWeight) : 0;
  return { closedWeight, totalWeight, basisPoints };
}
