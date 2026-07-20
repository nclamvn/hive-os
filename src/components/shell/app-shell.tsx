"use client";

import { type ReactNode, useCallback, useRef, useState } from "react";

import { MobileNav } from "./mobile-nav";
import { SidebarContent } from "./sidebar-content";
import { TopHeader } from "./top-header";

export interface AppShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Optional right context rail; reflows below the main canvas under 1180px. */
  rail?: ReactNode;
  /** Full-width region beneath the canvas (metric projection). */
  footer?: ReactNode;
}

export function AppShell({
  title,
  subtitle,
  children,
  rail,
  footer,
}: AppShellProps) {
  const [navOpen, setNavOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);

  const openNav = useCallback(() => setNavOpen(true), []);
  const closeNav = useCallback(() => setNavOpen(false), []);

  return (
    <div className="flex min-h-screen">
      <a
        href="#main-content"
        className="text-body bg-surface text-ink border-line sr-only rounded-md border px-3 py-2 font-medium focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
      >
        Skip to content
      </a>

      {/* Desktop sidebar (>=1024px) */}
      <aside
        aria-label="Sidebar"
        data-testid="sidebar-desktop"
        className="bg-surface sticky top-0 hidden h-screen shrink-0 border-r border-line min-[1024px]:block"
        style={{ width: "var(--shell-sidebar)" }}
      >
        <SidebarContent />
      </aside>

      {/* Tablet icon rail (768px–1023px) */}
      <aside
        aria-label="Sidebar"
        data-testid="sidebar-iconrail"
        className="bg-surface sticky top-0 hidden h-screen shrink-0 border-r border-line min-[768px]:block min-[1024px]:hidden"
        style={{ width: "var(--shell-iconrail)" }}
      >
        <SidebarContent iconOnly />
      </aside>

      {/* Mobile drawer (<768px) */}
      <MobileNav open={navOpen} onClose={closeNav} returnFocusRef={menuRef} />

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader ref={menuRef} onOpenNav={openNav} title={title} subtitle={subtitle} />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 px-4 py-5 min-[768px]:px-5 min-[1180px]:px-[var(--shell-gutter-desktop)]"
        >
          <div className="grid grid-cols-1 gap-6 min-[1180px]:grid-cols-[minmax(0,1fr)_var(--shell-rail)] min-[1180px]:gap-[var(--shell-gutter-desktop)]">
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
