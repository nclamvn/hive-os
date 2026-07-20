import { redirect } from "next/navigation";

import { AuthCard, Field } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { createWorkspaceAction } from "@/app/actions/identity";
import { listWorkspacesForUser } from "@/modules/identity-workspace";
import { currentUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // Idempotent: if a workspace already exists, go straight to it.
  const workspaces = await listWorkspacesForUser(user.id);
  if (workspaces.length > 0) redirect(`/w/${workspaces[0].workspace.slug}`);

  return (
    <AuthCard
      title="Create your workspace"
      description="Name the workspace where your missions will live. You will be its owner."
    >
      <form action={createWorkspaceAction} noValidate>
        <Field id="name" label="Workspace name" autoComplete="organization" />
        <Button type="submit" variant="primary" className="mt-2 w-full">
          Create workspace
        </Button>
      </form>
    </AuthCard>
  );
}
