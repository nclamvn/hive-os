import type { ReactNode } from "react";

import type { WorkspacePageData } from "@/server/auth/workspace-page";

import { AccountMenuActions } from "./account-menu-actions";
import { AppShell } from "./app-shell";
import type { SidebarEnterpriseScope } from "./sidebar-content";

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
  enterpriseScope,
  researcherMode,
}: {
  data: WorkspacePageData;
  title: string;
  subtitle: string;
  rail?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  enterpriseScope?: SidebarEnterpriseScope;
  researcherMode?: boolean;
}) {
  const { ctx } = data;

  return (
    <AppShell
      title={title}
      subtitle={subtitle}
      account={{ name: ctx.user.name, email: ctx.user.email }}
      homeHref={`/w/${ctx.workspace.slug}`}
      controlRoomHref={`/w/${ctx.workspace.slug}/control-room?find=1`}
      footerSlot={<AccountMenuActions />}
      rail={rail}
      footer={footer}
      enterpriseScope={enterpriseScope}
      researcherMode={researcherMode}
    >
      {children}
    </AppShell>
  );
}
