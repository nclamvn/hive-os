export type AuthoringErrorCode =
  | "INVALID_AUTHORING_INPUT"
  | "AUTHORING_NOT_FOUND"
  | "AUTHORING_CONFLICT"
  | "AUTHORING_QUALITY_BLOCKED";

export class AuthoringError extends Error {
  constructor(
    readonly code: AuthoringErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AuthoringError";
  }
}
