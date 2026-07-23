import type {
  Capability,
  WorkspaceContext,
} from "@/modules/identity-workspace";
import { hasCapability } from "@/modules/identity-workspace";

import { ExecutionError, ExecutionErrorCode } from "./errors";

export function requireExecutionCapability(
  ctx: WorkspaceContext,
  capability: Capability,
): void {
  if (!hasCapability(ctx.membership.role, capability)) {
    throw new ExecutionError(
      ExecutionErrorCode.Forbidden,
      `Missing capability: ${capability}`,
    );
  }
}
