import { redirect } from "next/navigation";

import { listWorkspacesForUser } from "@/modules/identity-workspace";
import { currentUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

/**
 * Root routing boundary:
 *  - unauthenticated → sign-in
 *  - no membership → onboarding
 *  - one workspace → that workspace
 *  - multiple → workspace chooser
 */
export default async function Root() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const workspaces = await listWorkspacesForUser(user.id);
  if (workspaces.length === 0) redirect("/onboarding");
  if (workspaces.length === 1) redirect(`/w/${workspaces[0].workspace.slug}`);
  redirect("/workspaces");
}
