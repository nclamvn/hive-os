/** Stable Mission Kernel domain errors with machine-readable codes. */
export class MissionError extends Error {
  readonly code: string;
  constructor(code: string, message?: string) {
    super(message ?? code);
    this.name = "MissionError";
    this.code = code;
  }
}

export const MissionErrorCode = {
  InvalidTransition: "INVALID_MISSION_TRANSITION",
  MissionVersionConflict: "MISSION_VERSION_CONFLICT",
  ContractVersionConflict: "CONTRACT_VERSION_CONFLICT",
  ContractIncomplete: "CONTRACT_INCOMPLETE",
  ContractAlreadyApproved: "CONTRACT_ALREADY_APPROVED",
  CurrentContractExists: "CURRENT_CONTRACT_EXISTS",
  IdempotencyConflict: "IDEMPOTENCY_CONFLICT",
  MaterialDecisionRequired: "MATERIAL_DECISION_REQUIRED",
  NotFound: "MISSION_NOT_FOUND",
  Forbidden: "MISSION_FORBIDDEN",
  Invariant: "MISSION_INVARIANT",
  // Later-kernel fail-closed guards
  TruthKernelRequired: "TRUTH_KERNEL_REQUIRED",
  ExecutionFabricRequired: "EXECUTION_FABRIC_REQUIRED",
  VerificationKernelRequired: "VERIFICATION_KERNEL_REQUIRED",
  ReleaseAuthorizationRequired: "RELEASE_AUTHORIZATION_REQUIRED",
} as const;
