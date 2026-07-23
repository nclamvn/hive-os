export class ExecutionError extends Error {
  readonly code: string;

  constructor(code: string, message?: string) {
    super(message ?? code);
    this.name = "ExecutionError";
    this.code = code;
  }
}

export const ExecutionErrorCode = {
  NotFound: "EXECUTION_NOT_FOUND",
  Forbidden: "EXECUTION_FORBIDDEN",
  InvalidInput: "EXECUTION_INPUT_INVALID",
  InvalidReport: "COMPLETION_REPORT_INVALID",
  DependencyBlocked: "EXECUTION_DEPENDENCY_BLOCKED",
  ReportAlreadyImported: "COMPLETION_REPORT_ALREADY_IMPORTED",
  Conflict: "EXECUTION_CONFLICT",
  Invariant: "EXECUTION_INVARIANT",
} as const;
