import type {
  Capability,
  WorkspaceContext,
} from "@/modules/identity-workspace";
import { hasCapability } from "@/modules/identity-workspace";

import {
  VerificationGovernanceError,
  VerificationGovernanceErrorCode,
} from "./errors";

export function requireVerificationCapability(
  ctx: WorkspaceContext,
  capability: Capability,
): void {
  if (!hasCapability(ctx.membership.role, capability)) {
    throw new VerificationGovernanceError(
      VerificationGovernanceErrorCode.Forbidden,
      `Missing capability: ${capability}`,
    );
  }
}
