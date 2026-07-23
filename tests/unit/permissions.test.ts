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

  it("TIP-006 skill reads are universal and management is Owner/Admin only", () => {
    for (const role of ALL_ROLES) {
      expect(hasCapability(role, "skills.read")).toBe(true);
    }
    expect(hasCapability("OWNER", "skills.manage")).toBe(true);
    expect(hasCapability("ADMIN", "skills.manage")).toBe(true);
    expect(hasCapability("MEMBER", "skills.manage")).toBe(false);
    expect(hasCapability("VIEWER", "skills.manage")).toBe(false);
  });

  it("TIP-007 execution reads are universal, operation excludes Viewer, and review is Owner/Admin", () => {
    for (const role of ALL_ROLES) {
      expect(hasCapability(role, "execution.read")).toBe(true);
    }
    expect(hasCapability("OWNER", "execution.operate")).toBe(true);
    expect(hasCapability("ADMIN", "execution.operate")).toBe(true);
    expect(hasCapability("MEMBER", "execution.operate")).toBe(true);
    expect(hasCapability("VIEWER", "execution.operate")).toBe(false);
    expect(hasCapability("OWNER", "execution.review")).toBe(true);
    expect(hasCapability("ADMIN", "execution.review")).toBe(true);
    expect(hasCapability("MEMBER", "execution.review")).toBe(false);
  });

  it("TIP-008 verification reads are universal while review and release approval are privileged", () => {
    for (const role of ALL_ROLES) {
      expect(hasCapability(role, "verification.read")).toBe(true);
    }
    expect(hasCapability("MEMBER", "verification.operate")).toBe(true);
    expect(hasCapability("VIEWER", "verification.operate")).toBe(false);
    for (const capability of ["verification.review", "release.approve"] as const) {
      expect(hasCapability("OWNER", capability)).toBe(true);
      expect(hasCapability("ADMIN", capability)).toBe(true);
      expect(hasCapability("MEMBER", capability)).toBe(false);
      expect(hasCapability("VIEWER", capability)).toBe(false);
    }
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
