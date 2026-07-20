import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { EmptyState } from "@/components/ui/empty-state";
import { getEnv } from "@/server/env";
import { currentUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  if (await currentUser()) redirect("/");

  // Truthful unavailable state when self-sign-up is disabled.
  if (!getEnv().AUTH_ALLOW_SELF_SIGNUP) {
    return (
      <AuthCard
        title="Sign-up unavailable"
        footer={
          <Link href="/sign-in" className="text-blue-600 font-medium underline">
            Back to sign in
          </Link>
        }
      >
        <EmptyState
          title="Self-sign-up is disabled"
          hint="An existing workspace owner must invite you to join."
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create account"
      description="Start a new HIVE OS workspace."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-600 font-medium underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
