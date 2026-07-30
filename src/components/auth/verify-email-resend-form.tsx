"use client";

import { type FormEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field } from "./auth-card";
import { FormStatus } from "./auth-fields";

/**
 * Request another verification message. The confirmation is always neutral so a
 * different entered email is never confirmed or denied.
 */
export function VerifyEmailResendForm() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    await authClient
      .sendVerificationEmail({
        email,
        callbackURL: "/verify-email?status=complete",
      })
      .catch(() => undefined);
    setBusy(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <FormStatus>
        If that email needs verification, a new link is on its way. It expires in
        1 hour.
      </FormStatus>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Field id="email" label="Email" type="email" autoComplete="email" />
      <Button type="submit" variant="primary" disabled={busy} className="mt-2 w-full">
        {busy ? "Sending…" : "Resend verification"}
      </Button>
    </form>
  );
}
