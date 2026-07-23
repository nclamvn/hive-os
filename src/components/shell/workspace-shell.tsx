import type { ReactNode } from "react";

import type { WorkspacePageData } from "@/server/auth/workspace-page";

import { AppShell } from "./app-shell";
import { SignOutButton } from "./sign-out-button";
import { WorkspaceSwitcher } from "./workspace-switcher";

/**
 * Authenticated application shell for workspace routes. Renders real identity
 * (user name/email), a workspace switcher, and a sign-out control.
 */
export function WorkspaceShell({
  data,
  title,
  subtitle,
  rail,
  footer,
  children,
}: {
  data: WorkspacePageData;
  title: string;
  subtitle: string;
  rail?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const { ctx, workspaces } = data;
  const options = workspaces.map((w) => ({
    slug: w.workspace.slug,
    name: w.workspace.name,
  }));

  return (
    <AppShell
      title={title}
      subtitle={subtitle}
      account={{ name: ctx.user.name, email: ctx.user.email }}
      homeHref={`/w/${ctx.workspace.slug}`}
      controlRoomHref={`/w/${ctx.workspace.slug}/control-room?find=1`}
      brandSlot={
        <WorkspaceSwitcher
          current={{ slug: ctx.workspace.slug, name: ctx.workspace.name }}
          workspaces={options}
        />
      }
      footerSlot={<SignOutButton />}
      rail={rail}
      footer={footer}
    >
      {children}
    </AppShell>
  );
}
