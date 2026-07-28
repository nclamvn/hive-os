"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field, FormError } from "./auth-card";
import { FormStatus } from "./auth-fields";

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setUnverifiedEmail(null);
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const { error: signInError } = await authClient.signIn.email({
      email,
      password: String(form.get("password") ?? ""),
    });
    setBusy(false);
    if (signInError) {
      const unverified =
        signInError.status === 403 ||
        /verif/i.test(signInError.message ?? "");
      if (unverified) {
        setUnverifiedEmail(email);
        return;
      }
      setError(signInError.message ?? "Unable to sign in");
      return;
    }
    router.push("/");
    router.refresh();
  }

  async function resend() {
    if (!unverifiedEmail) return;
    await authClient
      .sendVerificationEmail({
        email: unverifiedEmail,
        callbackURL: "/verify-email",
      })
      .catch(() => undefined);
    setResent(true);
  }

  if (unverifiedEmail) {
    return (
      <div>
        <FormStatus>
          Your email isn&apos;t verified yet. Check your inbox for the
          confirmation link to finish signing in.
        </FormStatus>
        {resent ? (
          <FormStatus>
            If this account still needs verification, a new link is on its way.
          </FormStatus>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={resend}
            className="w-full"
          >
            Resend verification email
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormError message={error} />
      <Field id="email" label="Email" type="email" autoComplete="email" />
      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
      />
      <div className="mb-1 text-right">
        <Link
          href="/forgot-password"
          className="text-meta text-blue-600 font-medium underline"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" variant="primary" disabled={busy} className="mt-2 w-full">
        {busy ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
