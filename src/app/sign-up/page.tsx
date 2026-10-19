import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { EmptyState } from "@/components/ui/empty-state";
import { getEnv } from "@/server/env";
import { currentUser } from "@/server/auth/session";
import { authCopy } from "@/i18n/auth-copy";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  if (await currentUser()) redirect("/");
  const copy = authCopy[await getLocale()];

  // Truthful unavailable state when self-sign-up is disabled.
  if (!getEnv().AUTH_ALLOW_SELF_SIGNUP) {
    return (
      <AuthCard
        title={copy.signUp.unavailableTitle}
        footer={
          <Link href="/sign-in" className="text-blue-600 font-medium underline">
            {copy.common.backToSignIn}
          </Link>
        }
      >
        <EmptyState
          title={copy.signUp.unavailableState}
          hint={copy.signUp.unavailableHint}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={copy.signUp.title}
      description={copy.signUp.description}
      footer={
        <>
          {copy.signUp.already}{" "}
          <Link href="/sign-in" className="text-blue-600 font-medium underline">
            {copy.signUp.signIn}
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
