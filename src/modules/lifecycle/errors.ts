export class LifecycleError extends Error {
  constructor(
    readonly code:
      | "INVALID_INPUT"
      | "NOT_FOUND"
      | "NOT_ELIGIBLE"
      | "LEGAL_HOLD"
      | "VERSION_CONFLICT"
      | "SEPARATION_OF_DUTIES"
      | "INVALID_TRANSITION",
    message: string,
  ) {
    super(message);
    this.name = "LifecycleError";
  }
}
