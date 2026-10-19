export class AuthorizationError extends Error {
  readonly code = "SCOPED_AUTHORIZATION_DENIED";

  constructor(
    message: string,
    readonly reasonCodes: readonly string[],
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}
