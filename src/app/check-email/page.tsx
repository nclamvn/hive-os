import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { EmptyState } from "@/components/ui/empty-state";
import { authCopy } from "@/i18n/auth-copy";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const copy = authCopy[await getLocale()];
  const intent = params.intent === "signup" ? "signup" : "reset";
  const title =
    intent === "signup"
      ? copy.checkEmail.signupTitle
      : copy.checkEmail.resetTitle;
  const hint =
    intent === "signup"
      ? copy.checkEmail.signupHint
      : copy.checkEmail.resetHint;
  return (
    <AuthCard
      title={title}
      footer={
        <Link href="/sign-in" className="text-blue-600 font-medium underline">
          {copy.common.backToSignIn}
        </Link>
      }
    >
      <EmptyState title={copy.checkEmail.inbox} hint={hint} />
    </AuthCard>
  );
}
