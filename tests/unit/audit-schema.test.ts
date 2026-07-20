import { describe, expect, it } from "vitest";

import {
  AuditEventType,
  validateAuditPayload,
} from "@/modules/identity-workspace/audit";

const VALID: Record<string, Record<string, unknown>> = {
  [AuditEventType.WorkspaceCreated]: { name: "Acme", slug: "acme" },
  [AuditEventType.WorkspaceUpdated]: { name: "Acme" },
  [AuditEventType.MembershipCreated]: { role: "OWNER", via: "onboarding" },
  [AuditEventType.MembershipRoleChanged]: { from: "OWNER", to: "ADMIN" },
  [AuditEventType.MembershipSuspended]: { role: "MEMBER" },
  [AuditEventType.InvitationCreated]: { email: "a@b.co", role: "MEMBER" },
  [AuditEventType.InvitationAccepted]: { role: "ADMIN" },
  [AuditEventType.InvitationRevoked]: { email: "a@b.co" },
};

describe("audit payload contract (SEC-02)", () => {
  it("AUD-PAYLOAD-01 accepts a valid payload for every event type", () => {
    for (const [eventType, payload] of Object.entries(VALID)) {
      expect(() =>
        validateAuditPayload(eventType as never, payload),
      ).not.toThrow();
    }
  });

  it("AUD-PAYLOAD-02 rejects an unknown field", () => {
    expect(() =>
      validateAuditPayload(AuditEventType.WorkspaceUpdated, {
        name: "Acme",
        extra: "nope",
      }),
    ).toThrow(/invalid shape/);
  });

  it("AUD-PAYLOAD-03 rejects a credential/token/secret-like field", () => {
    for (const key of ["password", "token", "secret", "sessionToken"]) {
      expect(() =>
        validateAuditPayload(AuditEventType.MembershipSuspended, {
          role: "MEMBER",
          [key]: "x",
        }),
      ).toThrow(/invalid shape/);
    }
  });

  it("AUD-PAYLOAD-04 rejects an arbitrary request-shaped object", () => {
    expect(() =>
      validateAuditPayload(AuditEventType.InvitationCreated, {
        email: "a@b.co",
        role: "MEMBER",
        headers: { cookie: "session=abc" },
        body: { password: "p" },
      }),
    ).toThrow(/invalid shape/);
  });

  it("rejects an unknown event type", () => {
    expect(() =>
      validateAuditPayload("totally.unknown.event" as never, {}),
    ).toThrow(/unknown event type/);
  });
});
