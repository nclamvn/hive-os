"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
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
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!token) {
    return (
      <div>
        <FormError message="This reset link is missing or invalid. Request a new one." />
        <Link
          href="/forgot-password"
          className="text-blue-600 font-medium underline"
        >
          Request a new reset link
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
      setError(`Password must be between ${MIN} and ${MAX} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token: token!,
    });
    if (resetError) {
      setBusy(false);
      setError("This reset link has expired or already been used. Request a new one.");
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
        label="New password"
        autoComplete="new-password"
        requirementText={`Use ${MIN}–${MAX} characters.`}
      />
      <PasswordField
        id="confirm"
        label="Confirm new password"
        autoComplete="new-password"
      />
      <Button type="submit" variant="primary" disabled={busy} className="mt-2 w-full">
        {busy ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
