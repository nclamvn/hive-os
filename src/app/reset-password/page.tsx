import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { authCopy } from "@/i18n/auth-copy";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const copy = authCopy[await getLocale()];
  const raw = params.token;
  const token = typeof raw === "string" && raw.length > 0 ? raw : null;
  return (
    <AuthCard
      title={copy.resetPassword.title}
      description={copy.resetPassword.description}
      footer={
        <Link href="/sign-in" className="text-blue-600 font-medium underline">
          {copy.common.backToSignIn}
        </Link>
      }
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
