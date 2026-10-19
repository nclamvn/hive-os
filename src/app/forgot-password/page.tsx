import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { currentUser } from "@/server/auth/session";
import { authCopy } from "@/i18n/auth-copy";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage() {
  if (await currentUser()) redirect("/");
  const copy = authCopy[await getLocale()];
  return (
    <AuthCard
      title={copy.forgotPassword.title}
      description={copy.forgotPassword.description}
      footer={
        <Link href="/sign-in" className="text-blue-600 font-medium underline">
          {copy.common.backToSignIn}
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
