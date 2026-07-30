export type WorkflowErrorCode =
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "CONFLICT"
  | "STALE_VERSION"
  | "INDEPENDENCE_REQUIRED"
  | "APPROVAL_CLOSED";

export class WorkflowError extends Error {
  constructor(
    readonly code: WorkflowErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "WorkflowError";
  }
}
