import { describe, expect, it } from "vitest";

import {
  ALL_ROLES,
  canChangeRole,
  hasCapability,
} from "@/modules/identity-workspace/permissions";

describe("permission matrix (ID-09)", () => {
  it("workspace.read is granted to every role", () => {
    for (const role of ALL_ROLES) {
      expect(hasCapability(role, "workspace.read")).toBe(true);
      expect(hasCapability(role, "members.read")).toBe(true);
    }
  });

  it("workspace.update, invite, audit are Owner/Admin only", () => {
    for (const cap of ["workspace.update", "members.invite", "audit.read"] as const) {
      expect(hasCapability("OWNER", cap)).toBe(true);
      expect(hasCapability("ADMIN", cap)).toBe(true);
      expect(hasCapability("MEMBER", cap)).toBe(false);
      expect(hasCapability("VIEWER", cap)).toBe(false);
    }
  });

  it("Owner management is restricted to Owners", () => {
    expect(hasCapability("OWNER", "members.manage_owner")).toBe(true);
    expect(hasCapability("ADMIN", "members.manage_owner")).toBe(false);
    expect(hasCapability("MEMBER", "members.manage_owner")).toBe(false);
  });
});

describe("role transition authority (ID-10)", () => {
  it("Admin cannot grant, demote, or touch an Owner", () => {
    expect(canChangeRole("ADMIN", "MEMBER", "OWNER")).toBe(false); // grant
    expect(canChangeRole("ADMIN", "OWNER", "ADMIN")).toBe(false); // demote
    expect(canChangeRole("ADMIN", "OWNER", "MEMBER")).toBe(false);
  });

  it("Admin can change ordinary member roles", () => {
    expect(canChangeRole("ADMIN", "MEMBER", "VIEWER")).toBe(true);
    expect(canChangeRole("ADMIN", "VIEWER", "MEMBER")).toBe(true);
  });

  it("Owner may grant and demote Owners", () => {
    expect(canChangeRole("OWNER", "MEMBER", "OWNER")).toBe(true);
    expect(canChangeRole("OWNER", "OWNER", "ADMIN")).toBe(true);
  });

  it("Member and Viewer cannot change any role", () => {
    expect(canChangeRole("MEMBER", "VIEWER", "MEMBER")).toBe(false);
    expect(canChangeRole("VIEWER", "MEMBER", "VIEWER")).toBe(false);
  });
});
