export class SkillRegistryError extends Error {
  readonly code: string;

  constructor(code: string, message?: string) {
    super(message ?? code);
    this.name = "SkillRegistryError";
    this.code = code;
  }
}

export const SkillRegistryErrorCode = {
  NotFound: "SKILL_NOT_FOUND",
  Forbidden: "SKILL_FORBIDDEN",
  InvalidContract: "SKILL_CONTRACT_INVALID",
  Conflict: "SKILL_CONFLICT",
  StaleVersion: "SKILL_STALE_VERSION",
  Invariant: "SKILL_INVARIANT",
} as const;
