"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { formatAuthCopy } from "@/i18n/auth-copy";
import { useAuthCopy } from "@/i18n/use-core-copy";
import { FormError } from "./auth-card";
import { PasswordField } from "./auth-fields";

const MIN = 12;
const MAX = 128;

/**
 * Set a new password from a reset token. Missing, expired, invalid, or consumed
 * tokens fail truthfully without exposing token internals. Success sends the
 * user to sign-in; no implicit session is created here.
 */
export function ResetPasswordForm({ token }: { token: string | null }) {
  const copy = useAuthCopy();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!token) {
    return (
      <div>
        <FormError message={copy.resetPassword.missing} />
        <Link
          href="/forgot-password"
          className="text-blue-600 font-medium underline"
        >
          {copy.resetPassword.requestNew}
        </Link>
      </div>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    if (password.length < MIN || password.length > MAX) {
      setError(
        formatAuthCopy(copy.resetPassword.rangeError, { min: MIN, max: MAX }),
      );
      return;
    }
    if (password !== confirm) {
      setError(copy.resetPassword.mismatch);
      return;
    }
    setBusy(true);
    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token: token!,
    });
    if (resetError) {
      setBusy(false);
      setError(copy.resetPassword.expired);
      return;
    }
    router.push("/sign-in?reset=1");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormError message={error} />
      <PasswordField
        id="password"
        label={copy.resetPassword.newPassword}
        autoComplete="new-password"
        requirementText={formatAuthCopy(copy.common.passwordRange, {
          min: MIN,
          max: MAX,
        })}
      />
      <PasswordField
        id="confirm"
        label={copy.resetPassword.confirm}
        autoComplete="new-password"
      />
      <Button
        type="submit"
        variant="primary"
        disabled={busy}
        className="mt-2 w-full"
      >
        {busy ? copy.resetPassword.busy : copy.resetPassword.submit}
      </Button>
    </form>
  );
}
