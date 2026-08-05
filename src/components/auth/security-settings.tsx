"use client";

import { type FormEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { formatAuthCopy } from "@/i18n/auth-copy";
import { useAuthCopy } from "@/i18n/use-core-copy";
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
  const copy = useAuthCopy();
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
      setError(
        formatAuthCopy(copy.security.rangeError, { min: MIN, max: MAX }),
      );
      return;
    }
    if (next !== confirm) {
      setError(copy.security.mismatch);
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
      setError(copy.security.changeFailed);
      return;
    }
    form.reset();
    setStatus(copy.security.changed);
  }

  async function revokeOthers() {
    setError(null);
    setStatus(null);
    await authClient.revokeOtherSessions().catch(() => undefined);
    setStatus(copy.security.revoked);
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
        <h2
          id="email-status"
          className="text-section-title text-ink-strong mb-1"
        >
          {copy.security.email}
        </h2>
        <p className="text-body text-ink-muted">
          {emailVerified ? copy.security.verified : copy.security.unverified}
        </p>
        {!emailVerified &&
          (resent ? (
            <FormStatus>{copy.security.resent}</FormStatus>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={resendVerification}
              className="mt-2"
            >
              {copy.security.resend}
            </Button>
          ))}
      </section>

      <section aria-labelledby="change-password">
        <h2
          id="change-password"
          className="text-section-title text-ink-strong mb-2"
        >
          {copy.security.changePassword}
        </h2>
        {error ? <FormError message={error} /> : null}
        {status ? <FormStatus>{status}</FormStatus> : null}
        <form onSubmit={changePassword} noValidate>
          <PasswordField
            id="current"
            label={copy.security.currentPassword}
            autoComplete="current-password"
          />
          <PasswordField
            id="next"
            label={copy.security.newPassword}
            autoComplete="new-password"
            requirementText={formatAuthCopy(copy.common.passwordRange, {
              min: MIN,
              max: MAX,
            })}
          />
          <PasswordField
            id="confirm"
            label={copy.security.confirmPassword}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={busy}
            className="mt-2"
          >
            {busy ? copy.security.busy : copy.security.submit}
          </Button>
        </form>
      </section>

      <section aria-labelledby="sessions">
        <h2 id="sessions" className="text-section-title text-ink-strong mb-2">
          {copy.security.sessions}
        </h2>
        <p className="text-body text-ink-muted mb-2">
          {copy.security.sessionsHint}
        </p>
        <Button type="button" variant="secondary" onClick={revokeOthers}>
          {copy.security.revoke}
        </Button>
      </section>
    </div>
  );
}
