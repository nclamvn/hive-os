export class DossierExportError extends Error {
  constructor(
    readonly code:
      | "INVALID_INPUT"
      | "NOT_FOUND"
      | "INVALID_TRANSITION"
      | "SOURCE_CHANGED"
      | "JOB_CONFLICT"
      | "EXPORT_FAILED",
    message: string,
  ) {
    super(message);
    this.name = "DossierExportError";
  }
}
