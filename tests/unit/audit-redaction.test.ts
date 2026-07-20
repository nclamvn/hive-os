import { describe, expect, it } from "vitest";

import { assertRedactedPayload } from "@/modules/identity-workspace/audit";

describe("audit payload redaction (ID-18)", () => {
  it("accepts a clean allowlisted payload", () => {
    expect(() =>
      assertRedactedPayload({ role: "OWNER", name: "Alpha", email: "a@b.co" }),
    ).not.toThrow();
  });

  it.each([
    { password: "x" },
    { passwordHash: "x" },
    { token: "x" },
    { tokenHash: "x" },
    { sessionToken: "x" },
    { secret: "x" },
    { authorization: "x" },
    { apiKey: "x" },
    { databaseUrl: "x" },
    { credential: "x" },
  ])("rejects forbidden key %o", (payload) => {
    expect(() => assertRedactedPayload(payload)).toThrow(/forbidden key/);
  });

  it("rejects forbidden keys nested in objects", () => {
    expect(() =>
      assertRedactedPayload({ actor: { name: "a", passwordHash: "x" } }),
    ).toThrow(/forbidden key/);
  });
});
