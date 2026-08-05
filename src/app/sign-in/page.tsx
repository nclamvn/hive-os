import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getEnv } from "@/server/env";
import { currentUser } from "@/server/auth/session";
import { authCopy } from "@/i18n/auth-copy";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  if (await currentUser()) redirect("/");
  const allowSignup = getEnv().AUTH_ALLOW_SELF_SIGNUP;
  const copy = authCopy[await getLocale()];

  return (
    <AuthCard
      title={copy.signIn.title}
      description={copy.signIn.description}
      footer={
        allowSignup ? (
          <>
            {copy.signIn.noAccount}{" "}
            <Link
              href="/sign-up"
              className="text-blue-600 font-medium underline"
            >
              {copy.signIn.createOne}
            </Link>
          </>
        ) : (
          <>{copy.signIn.signupDisabled}</>
        )
      }
    >
      <SignInForm />
    </AuthCard>
  );
}
