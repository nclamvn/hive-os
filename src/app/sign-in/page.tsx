import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { SignInCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getEnv } from "@/server/env";
import { currentUser } from "@/server/auth/session";
import { LOCAL_DEMO_LOGIN, localDemoLoginAllowed } from "@/server/fixtures/local-demo-login";
import { authCopy } from "@/i18n/auth-copy";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  if (await currentUser()) redirect("/");
  const env = getEnv();
  const allowSignup = env.AUTH_ALLOW_SELF_SIGNUP;
  const localDemo = localDemoLoginAllowed(env, (await headers()).get("host"));
  const copy = authCopy[await getLocale()];

  return (
    <SignInCard
      title={copy.signIn.title}
      description={copy.signIn.description}
      kicker={copy.signIn.kicker}
      footer={
        allowSignup ? (
          <>
            {copy.signIn.noAccount}{" "}
            <Link
              href="/sign-up"
              className="signin-text-link"
            >
              {copy.signIn.createOne}
            </Link>
          </>
        ) : (
          <>{copy.signIn.signupDisabled}</>
        )
      }
    >
      <SignInForm demoCredentials={localDemo ? LOCAL_DEMO_LOGIN : undefined} />
    </SignInCard>
  );
}
