"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field, FormError } from "./auth-card";

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const { error } = await authClient.signUp.email({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    if (error) {
      setError(error.message ?? "Unable to create account");
      setBusy(false);
      return;
    }
    // New identity is authenticated; onboarding provisions the workspace.
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormError message={error} />
      <Field id="name" label="Name" autoComplete="name" />
      <Field id="email" label="Email" type="email" autoComplete="email" />
      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
      />
      <Button type="submit" variant="primary" disabled={busy} className="mt-2 w-full">
        {busy ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
