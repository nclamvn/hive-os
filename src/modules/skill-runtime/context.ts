import type {
  Capability,
  WorkspaceContext,
} from "@/modules/identity-workspace";
import { hasCapability } from "@/modules/identity-workspace";

import { SkillRegistryError, SkillRegistryErrorCode } from "./errors";

export function requireSkillCapability(
  ctx: WorkspaceContext,
  capability: Capability,
): void {
  if (!hasCapability(ctx.membership.role, capability)) {
    throw new SkillRegistryError(
      SkillRegistryErrorCode.Forbidden,
      `Missing capability: ${capability}`,
    );
  }
}
