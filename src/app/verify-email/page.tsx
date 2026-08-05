import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { EmptyState } from "@/components/ui/empty-state";
import { VerifyEmailResendForm } from "@/components/auth/verify-email-resend-form";
import { authCopy } from "@/i18n/auth-copy";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const copy = authCopy[await getLocale()];
  // Better Auth appends `error` on failure and returns to the explicit
  // `status=complete` callback on success. A direct visit has neither marker
  // and must never be presented as a successful verification.
  const failed = typeof params.error === "string" && params.error.length > 0;
  const completed = params.status === "complete";

  if (failed) {
    return (
      <AuthCard
        title={copy.verifyEmail.invalidTitle}
        description={copy.verifyEmail.invalidDescription}
        footer={
          <Link href="/sign-in" className="text-blue-600 font-medium underline">
            {copy.common.backToSignIn}
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
        title={copy.verifyEmail.unavailableTitle}
        description={copy.verifyEmail.unavailableDescription}
        footer={
          <Link href="/sign-in" className="text-blue-600 font-medium underline">
            {copy.common.backToSignIn}
          </Link>
        }
      >
        <VerifyEmailResendForm />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={copy.verifyEmail.verifiedTitle}
      footer={
        <Link href="/sign-in" className="text-blue-600 font-medium underline">
          {copy.verifyEmail.continue}
        </Link>
      }
    >
      <EmptyState
        title={copy.verifyEmail.confirmed}
        hint={copy.verifyEmail.confirmedHint}
      />
    </AuthCard>
  );
}
