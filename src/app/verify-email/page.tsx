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
  // Better Auth appends `error` on failure and returns to the explicit
  // `status=complete` callback on success. A direct visit has neither marker
  // and must never be presented as a successful verification.
  const failed = typeof params.error === "string" && params.error.length > 0;
  const completed = params.status === "complete";

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

  if (!completed) {
    return (
      <AuthCard
        title="Verification status unavailable"
        description="Open the verification link from your email, or request a new one below."
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
