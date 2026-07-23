export class VerificationGovernanceError extends Error {
  readonly code: string;

  constructor(code: string, message?: string) {
    super(message ?? code);
    this.name = "VerificationGovernanceError";
    this.code = code;
  }
}

export const VerificationGovernanceErrorCode = {
  NotFound: "VERIFICATION_NOT_FOUND",
  Forbidden: "VERIFICATION_FORBIDDEN",
  InvalidInput: "VERIFICATION_INPUT_INVALID",
  InvalidReport: "VERIFY_REPORT_INVALID",
  NotIndependent: "VERIFIER_NOT_INDEPENDENT",
  NotReady: "VERIFICATION_NOT_READY",
  SignoffRequired: "GOVERNANCE_SIGNOFF_REQUIRED",
  ReleaseBlocked: "RELEASE_BLOCKED",
  Conflict: "VERIFICATION_CONFLICT",
  Invariant: "VERIFICATION_INVARIANT",
} as const;
