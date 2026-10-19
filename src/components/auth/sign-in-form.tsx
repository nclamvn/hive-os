"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useAuthCopy } from "@/i18n/use-core-copy";
import { Field, FormError } from "./auth-card";
import { FormStatus } from "./auth-fields";

export function SignInForm({
  demoCredentials,
}: {
  demoCredentials?: { email: string; password: string };
}) {
  const copy = useAuthCopy();
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
        signInError.status === 403 || /verif/i.test(signInError.message ?? "");
      if (unverified) {
        setUnverifiedEmail(email);
        return;
      }
      setError(copy.signIn.unable);
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
        callbackURL: "/verify-email?status=complete",
      })
      .catch(() => undefined);
    setResent(true);
  }

  if (unverifiedEmail) {
    return (
      <div>
        <FormStatus>{copy.signIn.unverified}</FormStatus>
        {resent ? (
          <FormStatus>{copy.signIn.resent}</FormStatus>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={resend}
            className="w-full"
          >
            {copy.signIn.resend}
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="signin-form">
      <FormError message={error} />
      {demoCredentials ? (
        <div className="signin-demo-note" role="note">
          <span className="signin-demo-pulse" aria-hidden="true" />
          {copy.signIn.localDemo}
        </div>
      ) : null}
      <Field
        id="email"
        label={copy.common.email}
        type="email"
        autoComplete="email"
        defaultValue={demoCredentials?.email}
      />
      <Field
        id="password"
        label={copy.common.password}
        type="password"
        autoComplete="current-password"
        defaultValue={demoCredentials?.password}
      />
      <div className="mb-1 text-right">
        <Link
          href="/forgot-password"
          className="signin-text-link text-meta"
        >
          {copy.signIn.forgotPassword}
        </Link>
      </div>
      <Button
        type="submit"
        variant="primary"
        disabled={busy}
        className="signin-submit mt-3 w-full"
      >
        {busy ? copy.signIn.busy : copy.signIn.submit}
        {!busy ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
      </Button>
    </form>
  );
}
