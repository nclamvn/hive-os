import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { currentUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage() {
  if (await currentUser()) redirect("/");
  return (
    <AuthCard
      title="Reset password"
      description="Enter your email and we'll send a reset link."
      footer={
        <Link href="/sign-in" className="text-blue-600 font-medium underline">
          Back to sign in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
