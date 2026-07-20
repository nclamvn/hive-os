import Link from "next/link";
import { redirect } from "next/navigation";

import { AcceptInvitation } from "@/components/auth/accept-invitation";
import { AuthCard } from "@/components/auth/auth-card";
import { currentUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const user = await currentUser();

  // Acceptance requires an authenticated user; send them to sign-in first.
  if (!user) {
    redirect(`/sign-in?next=${encodeURIComponent(`/invitations/${token}`)}`);
  }

  return (
    <AuthCard
      title="Workspace invitation"
      description={`Signed in as ${user.email}. Accepting will add you to the workspace if this invitation was issued to your email.`}
      footer={
        <Link href="/" className="text-blue-600 font-medium underline">
          Go to your workspaces instead
        </Link>
      }
    >
      <AcceptInvitation token={token} />
    </AuthCard>
  );
}
