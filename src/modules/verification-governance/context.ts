import type {
  Capability,
  WorkspaceContext,
} from "@/modules/identity-workspace";
import { hasCapability } from "@/modules/identity-workspace";
import {
  AuthorizationError,
  requireWorkspaceAuthorization,
} from "@/modules/authorization";

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

export async function requireScopedVerificationCapability(
  ctx: WorkspaceContext,
  capability: Capability,
  missionId: string,
): Promise<void> {
  try {
    await requireWorkspaceAuthorization(ctx, capability, missionId);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      throw new VerificationGovernanceError(
        VerificationGovernanceErrorCode.Forbidden,
        `Scoped authorization denied: ${error.reasonCodes.join(",")}`,
      );
    }
    throw error;
  }
}
