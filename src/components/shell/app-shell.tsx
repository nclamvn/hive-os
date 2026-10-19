"use client";

import {
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";

import { usePreferences } from "@/components/preferences/preferences-provider";

import { MobileNav } from "./mobile-nav";
import {
  type SidebarAccount,
  SidebarContent,
  type SidebarEnterpriseScope,
} from "./sidebar-content";
import { TopHeader } from "./top-header";

export interface AppShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Optional right context rail; reflows below the main canvas under 1180px. */
  rail?: ReactNode;
  /** Full-width region beneath the canvas (metric projection). */
  footer?: ReactNode;
  /** Real authenticated identity for the sidebar footer. */
  account?: SidebarAccount | null;
  /** Sign-out control rendered inside the account disclosure. */
  footerSlot?: ReactNode;
  /** Base href for the primary action / current nav item. */
  homeHref?: string;
  controlRoomHref?: string;
  enterpriseScope?: SidebarEnterpriseScope;
  /** Quiet mathematical desk; all other routes keep the full module navigator. */
  researcherMode?: boolean;
}

export function AppShell({
  title,
  subtitle,
  children,
  rail,
  footer,
  account,
  footerSlot,
  homeHref,
  controlRoomHref,
  enterpriseScope,
  researcherMode,
}: AppShellProps) {
  const { t } = usePreferences();
  const [navOpen, setNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);

  const openNav = useCallback(() => setNavOpen(true), []);
  const closeNav = useCallback(() => setNavOpen(false), []);
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((current) => !current);
  }, []);

  return (
    <div className="flex min-h-screen">
      <a
        href="#main-content"
        className="text-body bg-surface text-ink border-line sr-only rounded-md border px-3 py-2 font-medium focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
      >
        {t("common.skipToContent")}
      </a>

      {/* Desktop sidebar (>=1024px) */}
      <aside
        aria-label="Sidebar"
        data-testid="sidebar-desktop"
        className="bg-surface sticky top-0 hidden h-screen shrink-0 border-r border-line transition-[width] duration-200 min-[1024px]:block"
        style={{
          width: sidebarCollapsed
            ? "var(--shell-iconrail)"
            : "var(--shell-sidebar)",
        }}
      >
        <SidebarContent
          iconOnly={sidebarCollapsed}
          account={account}
          footerSlot={footerSlot}
          homeHref={homeHref}
          onToggleCollapsed={toggleSidebar}
          enterpriseScope={enterpriseScope}
          researcherMode={researcherMode}
        />
      </aside>

      {/* Tablet icon rail (768px–1023px) */}
      <aside
        aria-label="Sidebar"
        data-testid="sidebar-iconrail"
        className="bg-surface sticky top-0 hidden h-screen shrink-0 border-r border-line min-[768px]:block min-[1024px]:hidden"
        style={{ width: "var(--shell-iconrail)" }}
      >
        <SidebarContent
          iconOnly
          account={account}
          footerSlot={footerSlot}
          homeHref={homeHref}
          enterpriseScope={enterpriseScope}
          researcherMode={researcherMode}
        />
      </aside>

      {/* Mobile drawer (<768px) */}
      <MobileNav
        open={navOpen}
        onClose={closeNav}
        returnFocusRef={menuRef}
        account={account}
        footerSlot={footerSlot}
        homeHref={homeHref}
        enterpriseScope={enterpriseScope}
        researcherMode={researcherMode}
      />

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader
          ref={menuRef}
          onOpenNav={openNav}
          title={title}
          subtitle={subtitle}
          controlRoomHref={controlRoomHref}
          researcherMode={researcherMode}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 px-4 py-5 min-[768px]:px-5 min-[1180px]:px-[var(--shell-gutter-desktop)]"
        >
          <div
            className={`grid grid-cols-1 gap-6 ${
              rail
                ? "min-[1180px]:grid-cols-[minmax(0,1fr)_var(--shell-rail)] min-[1180px]:gap-[var(--shell-gutter-desktop)]"
                : ""
            }`}
          >
            <div className="flex min-w-0 flex-col gap-6">{children}</div>
            {rail ? (
              <div className="flex min-w-0 flex-col gap-6">{rail}</div>
            ) : null}
          </div>

          {footer ? <div className="mt-6">{footer}</div> : null}
        </main>
      </div>
    </div>
  );
}
