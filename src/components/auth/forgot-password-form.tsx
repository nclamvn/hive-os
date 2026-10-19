"use client";

import { type FormEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useAuthCopy } from "@/i18n/use-core-copy";
import { Field } from "./auth-card";
import { FormStatus } from "./auth-fields";

/**
 * Password-reset request. The outcome is always the same neutral confirmation
 * regardless of whether the account exists — no enumeration.
 */
export function ForgotPasswordForm() {
  const copy = useAuthCopy();
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
    return <FormStatus>{copy.forgotPassword.outcome}</FormStatus>;
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Field
        id="email"
        label={copy.common.email}
        type="email"
        autoComplete="email"
      />
      <Button
        type="submit"
        variant="primary"
        disabled={busy}
        className="mt-2 w-full"
      >
        {busy ? copy.forgotPassword.busy : copy.forgotPassword.submit}
      </Button>
    </form>
  );
}
