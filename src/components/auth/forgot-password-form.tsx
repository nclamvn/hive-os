"use client";

import { type FormEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field } from "./auth-card";
import { FormStatus } from "./auth-fields";

/**
 * Password-reset request. The outcome is always the same neutral confirmation
 * regardless of whether the account exists — no enumeration.
 */
export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    // Ignore the result: the response must not reveal account existence.
    await authClient
      .requestPasswordReset({ email, redirectTo: "/reset-password" })
      .catch(() => undefined);
    setBusy(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <FormStatus>
        If an account exists for that email, a password-reset link is on its way.
        The link expires in 30 minutes.
      </FormStatus>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Field id="email" label="Email" type="email" autoComplete="email" />
      <Button type="submit" variant="primary" disabled={busy} className="mt-2 w-full">
        {busy ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
