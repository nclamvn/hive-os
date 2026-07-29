"use client";

import { type FormEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { FormError } from "./auth-card";
import { FormStatus, PasswordField } from "./auth-fields";

const MIN = 12;
const MAX = 128;

export function SecuritySettings({
  email,
  emailVerified,
}: {
  email: string;
  emailVerified: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resent, setResent] = useState(false);

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const current = String(data.get("current") ?? "");
    const next = String(data.get("next") ?? "");
    const confirm = String(data.get("confirm") ?? "");
    if (next.length < MIN || next.length > MAX) {
      setError(`New password must be between ${MIN} and ${MAX} characters.`);
      return;
    }
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setBusy(true);
    const { error: changeError } = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: true,
    });
    setBusy(false);
    if (changeError) {
      setError("Could not change password. Check your current password.");
      return;
    }
    form.reset();
    setStatus("Password changed. Other sessions were signed out.");
  }

  async function revokeOthers() {
    setError(null);
    setStatus(null);
    await authClient.revokeOtherSessions().catch(() => undefined);
    setStatus("Other sessions were signed out.");
  }

  async function resendVerification() {
    await authClient
      .sendVerificationEmail({
        email,
        callbackURL: "/verify-email?status=complete",
      })
      .catch(() => undefined);
    setResent(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="email-status">
        <h2 id="email-status" className="text-section-title text-ink-strong mb-1">
          Email
        </h2>
        <p className="text-body text-ink-muted">
          {emailVerified
            ? "Your email address is verified."
            : "Your email address is not verified yet."}
        </p>
        {!emailVerified &&
          (resent ? (
            <FormStatus>A new verification link is on its way.</FormStatus>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={resendVerification}
              className="mt-2"
            >
              Resend verification email
            </Button>
          ))}
      </section>

      <section aria-labelledby="change-password">
        <h2
          id="change-password"
          className="text-section-title text-ink-strong mb-2"
        >
          Change password
        </h2>
        {error ? <FormError message={error} /> : null}
        {status ? <FormStatus>{status}</FormStatus> : null}
        <form onSubmit={changePassword} noValidate>
          <PasswordField
            id="current"
            label="Current password"
            autoComplete="current-password"
          />
          <PasswordField
            id="next"
            label="New password"
            autoComplete="new-password"
            requirementText={`Use ${MIN}–${MAX} characters.`}
          />
          <PasswordField
            id="confirm"
            label="Confirm new password"
            autoComplete="new-password"
          />
          <Button type="submit" variant="primary" disabled={busy} className="mt-2">
            {busy ? "Updating…" : "Update password"}
          </Button>
        </form>
      </section>

      <section aria-labelledby="sessions">
        <h2 id="sessions" className="text-section-title text-ink-strong mb-2">
          Sessions
        </h2>
        <p className="text-body text-ink-muted mb-2">
          Sign out everywhere except this device.
        </p>
        <Button type="button" variant="secondary" onClick={revokeOthers}>
          Revoke other sessions
        </Button>
      </section>
    </div>
  );
}
