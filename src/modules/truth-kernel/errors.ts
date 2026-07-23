export class TruthError extends Error {
  readonly code: string;

  constructor(code: string, message?: string) {
    super(message ?? code);
    this.name = "TruthError";
    this.code = code;
  }
}

export const TruthErrorCode = {
  NotFound: "TRUTH_NOT_FOUND",
  Forbidden: "TRUTH_FORBIDDEN",
  Invariant: "TRUTH_INVARIANT",
  SpanMismatch: "EVIDENCE_SPAN_MISMATCH",
  CorroborationInsufficient: "CORROBORATION_INSUFFICIENT",
  ProjectionForbidden: "TRUTH_PROJECTION_FORBIDDEN",
} as const;
