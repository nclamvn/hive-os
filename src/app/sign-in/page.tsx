import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getEnv } from "@/server/env";
import { currentUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  if (await currentUser()) redirect("/");
  const allowSignup = getEnv().AUTH_ALLOW_SELF_SIGNUP;

  return (
    <AuthCard
      title="Sign in"
      description="Access your HIVE OS workspace."
      footer={
        allowSignup ? (
          <>
            No account?{" "}
            <Link href="/sign-up" className="text-blue-600 font-medium underline">
              Create one
            </Link>
          </>
        ) : (
          <>Self-sign-up is disabled. Ask a workspace owner for an invitation.</>
        )
      }
    >
      <SignInForm />
    </AuthCard>
  );
}
