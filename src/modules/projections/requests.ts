import type { WorkspaceContext } from "@/modules/identity-workspace";
import { executeDurableCommand } from "@/modules/command-runtime";

export async function requestWorkspaceProjectionRebuild(
  ctx: WorkspaceContext,
  input: { idempotencyKey: string },
) {
  return executeDurableCommand(
    ctx,
    {
      idempotencyKey: input.idempotencyKey,
      commandType: "projection.workspace.rebuild.request",
      payload: { workspaceId: ctx.workspace.id },
      requiredCapability: "projections.manage",
    },
    async (_tx, command) => ({
      outcome: {
        workspaceId: command.workspaceId,
        status: "QUEUED",
      },
      outbox: [
        {
          topic: "projection.workspace.rebuild",
          aggregateType: "WorkspaceOperationalProjection",
          aggregateId: command.workspaceId,
          payload: {
            workspaceId: command.workspaceId,
            commandId: command.commandId,
          },
        },
      ],
    }),
  );
}
