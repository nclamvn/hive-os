import { beforeEach, describe, expect, it } from "vitest";

import { auth } from "@/server/auth";
import {
  clearCapturedMail,
  findCapturedMail,
  readCapturedMail,
} from "@/server/auth/mail";
import { getDb } from "@/server/db";

import { ownerQuery, truncateAll } from "./helpers";

const PASSWORD = "correct-horse-battery-staple";
const NEW_PASSWORD = "brand-new-battery-staple-9";

beforeEach(async () => {
  await truncateAll();
  await ownerQuery(
    "TRUNCATE identity_security_event, auth_throttle_counter, verification CASCADE",
  );
  clearCapturedMail();
});

async function signUp(email: string) {
  await auth.api.signUpEmail({
    body: { email, password: PASSWORD, name: "Recovery User" },
  });
  return getDb().user.findUniqueOrThrow({ where: { email } });
}

function verifyTokenFrom(url: string): string {
  return new URL(url).searchParams.get("token") ?? "";
}

function resetTokenFrom(url: string): string {
  return url.match(/reset-password\/([^?/]+)/)?.[1] ?? "";
}

async function events(eventType: string) {
  return ownerQuery<{ count: string }>(
    `SELECT count(*)::text AS count FROM identity_security_event WHERE event_type = '${eventType}'`,
  );
}

describe("email verification (IR-01..IR-12)", () => {
  it("IR-01/IR-02 signup creates an unverified user and sends a verification message", async () => {
    const email = `ir01-${Date.now()}@test.local`;
    const user = await signUp(email);
    expect(user.emailVerified).toBe(false);
    const mail = findCapturedMail(email, "VERIFY_EMAIL");
    expect(mail?.actionUrl).toContain("token=");
  });

  it("IR-03 an unverified user cannot create a session", async () => {
    const email = `ir03-${Date.now()}@test.local`;
    await signUp(email);
    await expect(
      auth.api.signInEmail({ body: { email, password: PASSWORD } }),
    ).rejects.toBeTruthy();
  });

  it("IR-04/IR-05 a valid token verifies the email without auto-sign-in", async () => {
    const email = `ir04-${Date.now()}@test.local`;
    const user = await signUp(email);
    const token = verifyTokenFrom(findCapturedMail(email, "VERIFY_EMAIL")!.actionUrl!);
    await auth.api.verifyEmail({ query: { token } });
    const after = await getDb().user.findUniqueOrThrow({ where: { email } });
    expect(after.emailVerified).toBe(true);
    // No session is created by verification.
    const sessions = await getDb().session.count({ where: { userId: user.id } });
    expect(sessions).toBe(0);
    expect(auth.options.emailVerification?.autoSignInAfterVerification).toBe(false);
  });

  it("IR-07 a consumed verification token cannot be reused for a new session path", async () => {
    const email = `ir07-${Date.now()}@test.local`;
    await signUp(email);
    const token = verifyTokenFrom(findCapturedMail(email, "VERIFY_EMAIL")!.actionUrl!);
    await auth.api.verifyEmail({ query: { token } });
    // Already verified: re-verifying is a no-op/verified, never a fresh session.
    const before = await getDb().session.count();
    await auth.api.verifyEmail({ query: { token } }).catch(() => undefined);
    expect(await getDb().session.count()).toBe(before);
  });

  it("IR-09 the raw verification token is never stored in the database", async () => {
    const email = `ir09-${Date.now()}@test.local`;
    await signUp(email);
    const token = verifyTokenFrom(findCapturedMail(email, "VERIFY_EMAIL")!.actionUrl!);
    const rows = await ownerQuery<{ n: string }>(
      `SELECT count(*)::text AS n FROM verification WHERE identifier = '${token}' OR value = '${token}'`,
    );
    expect(rows[0].n).toBe("0");
  });

  it("IR-31/IR-33 requesting verification records an append-only security event with no email", async () => {
    const email = `ir31-${Date.now()}@test.local`;
    await signUp(email);
    const requested = await events("EMAIL_VERIFICATION_REQUESTED");
    expect(Number(requested[0].count)).toBeGreaterThanOrEqual(1);
    const payloads = await ownerQuery<{ payload: unknown }>(
      "SELECT payload::text AS payload FROM identity_security_event",
    );
    for (const row of payloads) {
      expect(String(row.payload)).not.toContain("@");
    }
  });

  it("IR-31 identity_security_event is append-only under the runtime role", async () => {
    const email = `ir31b-${Date.now()}@test.local`;
    await signUp(email);
    await expect(
      getDb().$executeRawUnsafe("UPDATE identity_security_event SET outcome = 'FAILURE'"),
    ).rejects.toBeTruthy();
    await expect(
      getDb().$executeRawUnsafe("DELETE FROM identity_security_event"),
    ).rejects.toBeTruthy();
  });
});

describe("password recovery (IR-13..IR-28)", () => {
  async function verifiedUser(email: string) {
    const user = await signUp(email);
    await getDb().user.update({ where: { email }, data: { emailVerified: true } });
    clearCapturedMail();
    return user;
  }

  it("IR-13/IR-15 an existing account gets a generic response and a reset message", async () => {
    const email = `ir13-${Date.now()}@test.local`;
    await verifiedUser(email);
    const res = await auth.api.requestPasswordReset({
      body: { email, redirectTo: "/reset-password" },
    });
    expect(res.status).toBe(true);
    expect(findCapturedMail(email, "RESET_PASSWORD")).toBeTruthy();
  });

  it("IR-14/IR-16 an unknown account gets the same response and no message", async () => {
    const res = await auth.api.requestPasswordReset({
      body: { email: `nobody-${Date.now()}@test.local`, redirectTo: "/reset-password" },
    });
    expect(res.status).toBe(true);
    expect(readCapturedMail().filter((m) => m.purpose === "RESET_PASSWORD")).toHaveLength(0);
  });

  it("IR-17/IR-18 the reset identifier is hashed and the raw token is absent from the DB", async () => {
    const email = `ir17-${Date.now()}@test.local`;
    await verifiedUser(email);
    await auth.api.requestPasswordReset({ body: { email, redirectTo: "/reset-password" } });
    const token = resetTokenFrom(findCapturedMail(email, "RESET_PASSWORD")!.actionUrl!);
    expect(token).toBeTruthy();
    const rows = await ownerQuery<{ identifier: string; value: string }>(
      "SELECT identifier, value FROM verification",
    );
    // The stored identifier is a hash, never the raw `reset-password:<token>`.
    for (const row of rows) {
      expect(row.identifier).not.toContain(token);
      expect(row.identifier).not.toContain("reset-password:");
      expect(row.value).not.toContain(token);
    }
  });

  it("IR-19/IR-20/IR-21/IR-25/IR-26 reset changes the password, revokes sessions, no implicit session", async () => {
    const email = `ir19-${Date.now()}@test.local`;
    const user = await verifiedUser(email);
    // An active session exists before reset.
    await auth.api.signInEmail({ body: { email, password: PASSWORD } });
    expect(await getDb().session.count({ where: { userId: user.id } })).toBeGreaterThanOrEqual(1);

    await auth.api.requestPasswordReset({ body: { email, redirectTo: "/reset-password" } });
    const token = resetTokenFrom(findCapturedMail(email, "RESET_PASSWORD")!.actionUrl!);
    await auth.api.resetPassword({ body: { newPassword: NEW_PASSWORD, token } });

    // Old password fails, new password works.
    await expect(
      auth.api.signInEmail({ body: { email, password: PASSWORD } }),
    ).rejects.toBeTruthy();
    // All prior sessions were revoked and reset created none.
    expect(await getDb().session.count({ where: { userId: user.id } })).toBe(0);
    const ok = await auth.api.signInEmail({ body: { email, password: NEW_PASSWORD } });
    expect(ok.user?.email).toBe(email);
  });

  it("IR-22/IR-23 an invalid or consumed reset token is rejected", async () => {
    const email = `ir22-${Date.now()}@test.local`;
    await verifiedUser(email);
    await auth.api.requestPasswordReset({ body: { email, redirectTo: "/reset-password" } });
    const token = resetTokenFrom(findCapturedMail(email, "RESET_PASSWORD")!.actionUrl!);
    await auth.api.resetPassword({ body: { newPassword: NEW_PASSWORD, token } });
    // Reusing the consumed token fails.
    await expect(
      auth.api.resetPassword({ body: { newPassword: "another-brand-new-1", token } }),
    ).rejects.toBeTruthy();
    // A garbage token fails.
    await expect(
      auth.api.resetPassword({ body: { newPassword: "another-brand-new-2", token: "garbage" } }),
    ).rejects.toBeTruthy();
  });

  it("IR-24 concurrent reset with one token yields at most one success", async () => {
    const email = `ir24-${Date.now()}@test.local`;
    await verifiedUser(email);
    await auth.api.requestPasswordReset({ body: { email, redirectTo: "/reset-password" } });
    const token = resetTokenFrom(findCapturedMail(email, "RESET_PASSWORD")!.actionUrl!);
    const results = await Promise.allSettled([
      auth.api.resetPassword({ body: { newPassword: NEW_PASSWORD, token } }),
      auth.api.resetPassword({ body: { newPassword: NEW_PASSWORD, token } }),
    ]);
    const ok = results.filter((r) => r.status === "fulfilled").length;
    expect(ok).toBeLessThanOrEqual(1);
  });

  it("IR-28 reset requests are destination-throttled", async () => {
    const email = `ir28-${Date.now()}@test.local`;
    await verifiedUser(email);
    for (let i = 0; i < 5; i += 1) {
      await auth.api.requestPasswordReset({ body: { email, redirectTo: "/reset-password" } });
    }
    // Policy is 3 per 15 minutes per destination; extra requests send no mail.
    const sent = readCapturedMail().filter((m) => m.purpose === "RESET_PASSWORD");
    expect(sent.length).toBeLessThanOrEqual(3);
  });
});

describe("existing-account signup notice (RC-SIGNUP-01..06)", () => {
  it("RC-SIGNUP-01/02/03/06 duplicate signup notifies the owner without enumeration", async () => {
    const email = `rc-signup-${Date.now()}@test.local`;
    const first = await auth.api.signUpEmail({
      body: { email, password: PASSWORD, name: "Owner" },
    });
    clearCapturedMail();

    // Duplicate signup: Better Auth returns a generic response (no session),
    // indistinguishable from a new signup, and notifies the real owner.
    const dup = await auth.api.signUpEmail({
      body: { email, password: "totally-different-1", name: "Impostor" },
    });
    // RC-SIGNUP-01: neither response leaks a session token.
    expect(first.token ?? null).toBeNull();
    expect(dup.token ?? null).toBeNull();

    const notice = findCapturedMail(email, "EXISTING_ACCOUNT_SIGNUP_NOTICE");
    // RC-SIGNUP-02: exactly one notice.
    expect(
      readCapturedMail().filter((m) => m.purpose === "EXISTING_ACCOUNT_SIGNUP_NOTICE"),
    ).toHaveLength(1);
    // RC-SIGNUP-03: no verification email is (re)sent to the existing account.
    expect(readCapturedMail().filter((m) => m.purpose === "VERIFY_EMAIL")).toHaveLength(0);
    // RC-SIGNUP-06: the notice carries no action URL / token.
    expect(notice?.actionUrl).toBeUndefined();
    expect(notice?.text ?? "").not.toMatch(/https?:\/\//);
  });

  it("RC-SIGNUP-03 a brand-new signup receives no existing-account notice", async () => {
    const email = `rc-new-${Date.now()}@test.local`;
    await auth.api.signUpEmail({ body: { email, password: PASSWORD, name: "New" } });
    expect(
      readCapturedMail().filter((m) => m.purpose === "EXISTING_ACCOUNT_SIGNUP_NOTICE"),
    ).toHaveLength(0);
    expect(findCapturedMail(email, "VERIFY_EMAIL")).toBeTruthy();
  });

  it("RC-SIGNUP-04 repeated duplicate attempts are throttled", async () => {
    const email = `rc-throttle-${Date.now()}@test.local`;
    await auth.api.signUpEmail({ body: { email, password: PASSWORD, name: "Owner" } });
    clearCapturedMail();
    for (let i = 0; i < 5; i += 1) {
      await auth.api.signUpEmail({
        body: { email, password: `dup-attempt-${i}-x`, name: "Impostor" },
      });
    }
    // 3 per 15 minutes per destination.
    expect(
      readCapturedMail().filter((m) => m.purpose === "EXISTING_ACCOUNT_SIGNUP_NOTICE").length,
    ).toBeLessThanOrEqual(3);
  });
});

describe("configuration invariants (IR-21 origin, IR-25 revoke policy)", () => {
  it("keeps auth callbacks same-origin and revokes sessions on reset", () => {
    expect(auth.options.trustedOrigins).toBeTruthy();
    expect(auth.options.emailAndPassword?.revokeSessionsOnPasswordReset).toBe(true);
    expect(auth.options.emailAndPassword?.resetPasswordTokenExpiresIn).toBe(1800);
    expect(auth.options.verification?.storeIdentifier).toBe("hashed");
  });
});
