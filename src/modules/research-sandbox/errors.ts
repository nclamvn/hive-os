export type ResearchSandboxErrorCode =
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "INVALID_TRANSITION"
  | "INTEGRITY_FAILURE"
  | "SEPARATION_OF_DUTIES"
  | "PROVIDER_MISMATCH"
  | "SANDBOX_LIMIT_EXCEEDED"
  | "JOB_CONFLICT";

export class ResearchSandboxError extends Error {
  constructor(
    public readonly code: ResearchSandboxErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ResearchSandboxError";
  }
}
