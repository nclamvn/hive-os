import { beforeEach, describe, expect, it } from "vitest";

import {
  acceptInvitation,
  createInvitation,
  updateWorkspaceName,
  validateAuditPayload,
} from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { asOwner, createUser, truncateAll } from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

describe("stored audit payloads (SEC-02 / AUD-PAYLOAD-05)", () => {
  it("emitted database payloads contain only the event allowlist", async () => {
    const owner = await createUser("owner");
    const ctx = await asOwner(owner); // workspace.created + membership.created
    await updateWorkspaceName(ctx, "Renamed"); // workspace.updated
    const invitee = await createUser("invitee");
    const invite = await createInvitation(ctx, {
      email: invitee.email,
      role: "MEMBER",
    }); // invitation.created
    await acceptInvitation(invitee, invite.rawToken); // invitation.accepted + membership.created

    const events = await getDb().auditEvent.findMany({
      where: { workspaceId: ctx.workspace.id },
    });
    expect(events.length).toBeGreaterThanOrEqual(5);

    for (const e of events) {
      // Re-validating the stored payload against its strict schema proves it
      // carries only the allowlisted keys (no extra/leaked fields).
      expect(() =>
        validateAuditPayload(
          e.eventType as never,
          e.payload as Record<string, unknown>,
        ),
      ).not.toThrow();
    }
  });
});
