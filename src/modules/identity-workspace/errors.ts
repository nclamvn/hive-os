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
  readonly code: string;
  constructor(message: string, code = "INVARIANT") {
    super(message);
    this.name = "InvariantError";
    this.code = code;
  }
}

/** Stable domain error raised when a mutation would remove the last Owner. */
export class LastOwnerError extends InvariantError {
  constructor(message = "A workspace must keep at least one active Owner") {
    super(message, "LAST_ACTIVE_OWNER");
    this.name = "LastOwnerError";
  }
}
