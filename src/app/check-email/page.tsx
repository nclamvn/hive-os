import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const intent = params.intent === "signup" ? "signup" : "reset";
  const title =
    intent === "signup" ? "Confirm your email" : "Check your email";
  const hint =
    intent === "signup"
      ? "We've sent a confirmation link to finish creating your account. Open it to verify your email, then sign in. The link expires in 1 hour."
      : "If an account exists for that email, a password-reset link is on its way. The link expires in 30 minutes.";
  return (
    <AuthCard
      title={title}
      footer={
        <Link href="/sign-in" className="text-blue-600 font-medium underline">
          Back to sign in
        </Link>
      }
    >
      <EmptyState title="Check your inbox" hint={hint} />
    </AuthCard>
  );
}
