"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field, FormError } from "./auth-card";
import { PasswordField } from "./auth-fields";

const MIN = 12;
const MAX = 128;

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    if (password.length < MIN || password.length > MAX) {
      setError(`Password must be between ${MIN} and ${MAX} characters.`);
      return;
    }
    setBusy(true);
    // Verification is required, so no session is created here. The result is
    // funnelled to the same neutral check-email outcome whether the email is
    // new or already registered — no account enumeration.
    await authClient.signUp
      .email({
        name,
        email,
        password,
        callbackURL: "/verify-email?status=complete",
      })
      .catch(() => undefined);
    router.push("/check-email?intent=signup");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormError message={error} />
      <Field id="name" label="Name" autoComplete="name" />
      <Field id="email" label="Email" type="email" autoComplete="email" />
      <PasswordField
        id="password"
        label="Password"
        autoComplete="new-password"
        requirementText={`Use ${MIN}–${MAX} characters. You'll confirm your email before signing in.`}
      />
      <Button type="submit" variant="primary" disabled={busy} className="mt-2 w-full">
        {busy ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
