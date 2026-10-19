import type { LrcLoopReadinessDto } from "@/server/operations/math-lrc-loop-readiness";

export const readinessUiCaseId = "00000000-0000-4000-8000-000000000002";
/** Synthetic DTO controls only: no claim of an actual retained scientific admission. */
export function readinessUiFixture(overrides: Partial<LrcLoopReadinessDto> = {}): LrcLoopReadinessDto {
  return {
    version: 1, status: "AUTHENTICATED_READ_ONLY", session: "AUTHORIZED", sources: "VERIFIED_FIXED_37",
    cases: [{ caseId: readinessUiCaseId, status: "LEGACY_NOT_ADMISSIBLE", reason: "LEGACY_NOT_ADMISSIBLE", retainedJobs: "NOT_ADMITTED" }],
    admittedCount: 0, tasks: [], decision: "PLANNING_ONLY",
    blockers: ["NO_SEALED_BATCH", "INDEPENDENT_INFORMATION_NOT_BOUND", "INDEPENDENT_RELATIONS_NOT_BOUND",
      "ROOT_ASSOCIATIONS_NOT_BOUND", "FRESH_FINITE_REPLAY_NOT_RUN", "G2_NOT_AUTHORIZED", "NO_ADMITTED_METHOD_RECORD"],
    freshFiniteReplay: "NOT_RUN", independentInformation: "NOT_BOUND", batch: "NOT_BOUND",
    executionGate: "G2_NOT_AUTHORIZED", dispatchAllowed: false, proofClosure: false,
    globalLrc: "NOT_ESTABLISHED", formalProof: "NOT_ESTABLISHED", externalAcceptance: "NOT_ESTABLISHED", novelty: "NOT_ESTABLISHED",
    ...overrides,
  };
}
