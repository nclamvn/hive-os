import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { EmptyState } from "@/components/ui/empty-state";
import { VerifyEmailResendForm } from "@/components/auth/verify-email-resend-form";

export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  // Better Auth redirects here with an `error` query on failure, otherwise the
  // verification succeeded. The raw token is never rendered.
  const failed = typeof params.error === "string" && params.error.length > 0;

  if (failed) {
    return (
      <AuthCard
        title="Verification link invalid"
        description="This link is invalid or has expired. Request a new one below."
        footer={
          <Link href="/sign-in" className="text-blue-600 font-medium underline">
            Back to sign in
          </Link>
        }
      >
        <VerifyEmailResendForm />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Email verified"
      footer={
        <Link href="/sign-in" className="text-blue-600 font-medium underline">
          Continue to sign in
        </Link>
      }
    >
      <EmptyState
        title="Your email is confirmed"
        hint="You can now sign in to your HIVE OS workspace."
      />
    </AuthCard>
  );
}
