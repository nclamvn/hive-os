/**
 * Typed identity errors. Cross-workspace lookups deliberately collapse
 * "does not exist" and "not authorized" into NotFound so the API never leaks
 * whether an object in another workspace exists.
 */
export class UnauthenticatedError extends Error {
  readonly code = "UNAUTHENTICATED";
  constructor(message = "Authentication required") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

export class NotFoundError extends Error {
  readonly code = "NOT_FOUND";
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends Error {
  readonly code = "FORBIDDEN";
  constructor(message = "Not permitted") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** Business-rule violation, e.g. removing the last active Owner. */
export class InvariantError extends Error {
  readonly code = "INVARIANT";
  constructor(message: string) {
    super(message);
    this.name = "InvariantError";
  }
}
