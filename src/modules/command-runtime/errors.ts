export type CommandRuntimeErrorCode =
  | "INVALID_INPUT"
  | "IDEMPOTENCY_CONFLICT"
  | "NOT_FOUND"
  | "STALE_VERSION"
  | "LEASE_CONFLICT"
  | "INVALID_TRANSITION";

export class CommandRuntimeError extends Error {
  constructor(
    readonly code: CommandRuntimeErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "CommandRuntimeError";
  }
}

export class CommandEffectError extends Error {
  constructor(
    readonly code: string,
    safeMessage: string,
  ) {
    super(safeMessage);
    this.name = "CommandEffectError";
  }
}
