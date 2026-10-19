"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { formatAuthCopy } from "@/i18n/auth-copy";
import { useAuthCopy } from "@/i18n/use-core-copy";
import { Field, FormError } from "./auth-card";
import { PasswordField } from "./auth-fields";

const MIN = 12;
const MAX = 128;

export function SignUpForm() {
  const copy = useAuthCopy();
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
      setError(formatAuthCopy(copy.signUp.rangeError, { min: MIN, max: MAX }));
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
      <Field id="name" label={copy.common.name} autoComplete="name" />
      <Field
        id="email"
        label={copy.common.email}
        type="email"
        autoComplete="email"
      />
      <PasswordField
        id="password"
        label={copy.common.password}
        autoComplete="new-password"
        requirementText={formatAuthCopy(copy.signUp.requirement, {
          min: MIN,
          max: MAX,
        })}
      />
      <Button
        type="submit"
        variant="primary"
        disabled={busy}
        className="mt-2 w-full"
      >
        {busy ? copy.signUp.busy : copy.signUp.submit}
      </Button>
    </form>
  );
}
