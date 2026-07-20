import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { AuthCard } from "@/components/auth/auth-card";
import { listWorkspacesForUser } from "@/modules/identity-workspace";
import { currentUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function WorkspaceChooserPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const workspaces = await listWorkspacesForUser(user.id);
  if (workspaces.length === 0) redirect("/onboarding");
  if (workspaces.length === 1) redirect(`/w/${workspaces[0].workspace.slug}`);

  return (
    <AuthCard
      title="Choose a workspace"
      description="You belong to more than one workspace."
    >
      <ul className="flex flex-col gap-2">
        {workspaces.map((w) => (
          <li key={w.workspace.slug}>
            <Link
              href={`/w/${w.workspace.slug}`}
              className="border-line hover:bg-surface-subtle flex items-center justify-between gap-3 rounded-md border px-3 py-3"
            >
              <span className="min-w-0">
                <span className="text-body text-ink-strong block truncate font-medium">
                  {w.workspace.name}
                </span>
                <span className="text-meta text-ink-muted block truncate">
                  {w.role.toLowerCase()}
                </span>
              </span>
              <ArrowRight className="text-ink-faint size-4 shrink-0" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </AuthCard>
  );
}
