import { forwardRef } from "react";
import { Menu, Search } from "lucide-react";
import Link from "next/link";

import { PreferencesControls } from "@/components/preferences/preferences-controls";
import { usePreferences } from "@/components/preferences/preferences-provider";

export interface TopHeaderProps {
  onOpenNav: () => void;
  title: string;
  subtitle: string;
  controlRoomHref?: string;
}

/**
 * Top header: mobile menu trigger, greeting/title region, and a search
 * trigger. Workspace routes deep-link to the real governed-object finder.
 */
export const TopHeader = forwardRef<HTMLButtonElement, TopHeaderProps>(
  function TopHeader({ onOpenNav, title, subtitle, controlRoomHref }, menuRef) {
    const { t } = usePreferences();
    return (
      <header
        className="bg-surface sticky top-0 z-30 flex items-center gap-3 border-b border-line px-4 min-[768px]:px-5 min-[1180px]:px-[var(--shell-gutter-desktop)]"
        style={{ height: "var(--shell-header)" }}
      >
        <button
          ref={menuRef}
          type="button"
          onClick={onOpenNav}
          aria-label={t("common.openNavigation")}
          className="border-line text-ink-muted hover:bg-surface-subtle flex size-9 items-center justify-center rounded-md border min-[768px]:hidden"
        >
          <Menu className="size-[18px]" aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-section-title text-ink-strong truncate">
            {title}
          </h1>
          <p className="text-meta text-ink-muted truncate">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {controlRoomHref ? (
            <Link
              href={controlRoomHref}
              aria-label={t("common.findGovernedObjects")}
              title={t("common.findGovernedObjects")}
              className="border-line bg-surface-subtle text-ink-muted hover:border-line-strong hover:text-ink hidden h-10 items-center gap-2 rounded-md border px-3 transition-colors min-[1024px]:flex"
              style={{ width: "clamp(220px, 24vw, 320px)" }}
            >
              <Search
                className="text-ink-muted size-4 shrink-0"
                aria-hidden="true"
              />
              <span className="text-body truncate">
                {t("common.findObjects")}
              </span>
            </Link>
          ) : (
            <div
              role="search"
              className="border-line bg-surface-subtle hidden items-center gap-2 rounded-md border px-3 min-[1024px]:flex"
              style={{ height: "40px", width: "clamp(180px, 22vw, 320px)" }}
            >
              <Search
                className="text-ink-faint size-4 shrink-0"
                aria-hidden="true"
              />
              <label htmlFor="global-search" className="sr-only">
                Search
              </label>
              <input
                id="global-search"
                type="search"
                disabled
                aria-disabled="true"
                placeholder="Search is not connected yet"
                className="text-body text-ink placeholder:text-ink-faint w-full min-w-0 bg-transparent outline-none"
              />
            </div>
          )}
          {controlRoomHref ? (
            <Link
              href={controlRoomHref}
              aria-label={t("common.findGovernedObjects")}
              title={t("common.findGovernedObjects")}
              className="border-line text-ink-muted flex size-9 items-center justify-center rounded-md border min-[1024px]:hidden"
            >
              <Search className="size-[18px]" aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              aria-label="Search · not connected yet"
              aria-disabled="true"
              title="Search · not connected yet"
              onClick={(e) => e.preventDefault()}
              className="border-line text-ink-muted flex size-9 cursor-not-allowed items-center justify-center rounded-md border min-[1024px]:hidden"
            >
              <Search className="size-[18px]" aria-hidden="true" />
            </button>
          )}
          <span
            className="bg-line mx-1 hidden h-5 w-px min-[480px]:block"
            aria-hidden="true"
          />
          <PreferencesControls compact />
        </div>
      </header>
    );
  },
);
