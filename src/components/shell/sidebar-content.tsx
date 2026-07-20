import type { ReactNode } from "react";
import Link from "next/link";
import { Hexagon, Plus, UserRound } from "lucide-react";

import { NAV_ITEMS } from "./navigation";

const NOT_IMPLEMENTED = "Not implemented in the current build stage";

export interface SidebarAccount {
  name: string;
  email: string;
}

export interface SidebarContentProps {
  /** Icon rail (tablet) collapses labels to accessible names + tooltips. */
  iconOnly?: boolean;
  /** Invoked after any navigation affordance is activated (drawer closes). */
  onNavigate?: () => void;
  /** Real authenticated identity; when absent a truthful signed-out state shows. */
  account?: SidebarAccount | null;
  /** Rendered under the brand (workspace switcher). */
  brandSlot?: ReactNode;
  /** Rendered in the account footer (sign-out control). */
  footerSlot?: ReactNode;
  /** Base path for the primary "New mission" affordance. */
  homeHref?: string;
}

export function SidebarContent({
  iconOnly = false,
  onNavigate,
  account,
  brandSlot,
  footerSlot,
  homeHref = "#mission-composer",
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div
        className={`flex items-center gap-2 border-b border-line px-4 ${iconOnly ? "justify-center" : ""}`}
        style={{ height: "var(--shell-header)" }}
      >
        <Hexagon className="text-navy-800 size-5 shrink-0" aria-hidden="true" />
        {iconOnly ? (
          <span className="sr-only">HIVE OS</span>
        ) : (
          <span className="text-section-title text-ink-strong tracking-tight">
            HIVE OS
          </span>
        )}
      </div>

      {!iconOnly && brandSlot ? (
        <div className="border-b border-line px-3 py-3">{brandSlot}</div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* Primary action */}
        <a
          href={homeHref}
          onClick={onNavigate}
          aria-label="New mission"
          title="New mission"
          className={`text-body bg-navy-800 hover:bg-navy-900 flex h-10 items-center gap-2 rounded-md font-medium text-white transition-colors ${
            iconOnly ? "justify-center px-0" : "px-3"
          }`}
        >
          <Plus className="size-4 shrink-0" aria-hidden="true" />
          {!iconOnly && <span>New mission</span>}
        </a>

        {/* Navigation */}
        <nav aria-label="Primary" className="mt-4">
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const title = item.implemented
                ? item.label
                : `${item.label} — ${NOT_IMPLEMENTED}`;
              const rowClass = `text-body flex h-9 items-center gap-3 rounded-md font-medium ${
                iconOnly ? "justify-center px-0" : "px-3"
              }`;

              if (item.implemented) {
                return (
                  <li key={item.label}>
                    <Link
                      href={homeHref.startsWith("/") ? homeHref : "/"}
                      aria-current="page"
                      aria-label={item.label}
                      title={title}
                      onClick={onNavigate}
                      className={`${rowClass} bg-surface-selected text-ink-strong`}
                    >
                      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                      {iconOnly ? (
                        <span className="sr-only">{item.label}</span>
                      ) : (
                        <span>{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    aria-disabled="true"
                    aria-label={title}
                    title={title}
                    onClick={(e) => e.preventDefault()}
                    className={`${rowClass} text-ink-muted hover:bg-surface-subtle w-full cursor-not-allowed text-left`}
                  >
                    <Icon
                      className="text-ink-faint size-[18px] shrink-0"
                      aria-hidden="true"
                    />
                    {iconOnly ? (
                      <span className="sr-only">{item.label}</span>
                    ) : (
                      <span className="flex-1">{item.label}</span>
                    )}
                    {!iconOnly && (
                      <span className="text-ink-faint" aria-hidden="true">
                        —
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Account footer — real identity when authenticated. */}
      <div className="border-t border-line p-3">
        <div
          className={`flex items-center gap-2 rounded-md px-2 py-2 ${iconOnly ? "justify-center" : ""}`}
        >
          <span
            className="border-line text-ink-faint flex size-8 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <UserRound className="size-4" />
          </span>
          {!iconOnly && (
            <span className="min-w-0 flex-1">
              <span className="text-body text-ink block truncate font-medium">
                {account ? account.name : "Not signed in"}
              </span>
              <span className="text-meta text-ink-muted block truncate">
                {account ? account.email : "Sign-in arrives in a later stage"}
              </span>
            </span>
          )}
        </div>
        {!iconOnly && footerSlot ? (
          <div className="mt-1">{footerSlot}</div>
        ) : null}
      </div>
    </div>
  );
}
