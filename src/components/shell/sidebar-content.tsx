"use client";

import type { ReactNode } from "react";
import {
  ChevronDown,
  Hexagon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  UserRound,
} from "lucide-react";

import { usePreferences } from "@/components/preferences/preferences-provider";

import { NAV_ITEMS } from "./navigation";
import { NavItemLink } from "./nav-item-link";

const NOT_IMPLEMENTED = "Not implemented in the current build stage";
const GROUPS = ["command", "truth", "assurance", "system"] as const;

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
  /** Rendered inside the account disclosure (sign-out control). */
  footerSlot?: ReactNode;
  /** Base path for the primary "New mission" affordance. */
  homeHref?: string;
  /** Desktop-only control for the persistent full/icon rail state. */
  onToggleCollapsed?: () => void;
}

export function SidebarContent({
  iconOnly = false,
  onNavigate,
  account,
  footerSlot,
  homeHref = "#mission-composer",
  onToggleCollapsed,
}: SidebarContentProps) {
  const { t } = usePreferences();
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div
        className={`flex items-center border-b border-line px-3 ${
          iconOnly ? "justify-center" : "gap-2"
        }`}
        style={{ height: "var(--shell-header)" }}
      >
        {!iconOnly || !onToggleCollapsed ? (
          <Hexagon
            className="text-ink-strong size-5 shrink-0"
            aria-hidden="true"
          />
        ) : null}
        {iconOnly ? (
          <span className="sr-only">HIVE OS</span>
        ) : (
          <span className="text-section-title text-ink-strong flex-1 tracking-tight">
            HIVE OS
          </span>
        )}
        {onToggleCollapsed ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={
              iconOnly
                ? t("common.expandSidebar")
                : t("common.collapseSidebar")
            }
            title={
              iconOnly
                ? t("common.expandSidebar")
                : t("common.collapseSidebar")
            }
            className="text-ink-muted hover:bg-surface-subtle hover:text-ink flex size-8 shrink-0 items-center justify-center rounded-md transition-colors"
          >
            {iconOnly ? (
              <PanelLeftOpen className="size-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="size-4" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* Primary action */}
        <a
          href={homeHref}
          onClick={onNavigate}
          aria-label={t("common.newMission")}
          title={iconOnly ? t("common.newMission") : undefined}
          className={`text-body text-ink-strong hover:text-ink group flex h-10 items-center gap-2 rounded-md font-medium transition-[color,transform] duration-150 hover:translate-x-0.5 ${
            iconOnly ? "justify-center px-0" : "px-3"
          }`}
        >
          <Plus
            className="text-ink-muted size-4 shrink-0 transition-[color,transform] duration-150 group-hover:scale-110 group-hover:text-current"
            aria-hidden="true"
          />
          {!iconOnly && <span>{t("common.newMission")}</span>}
        </a>

        {/* Navigation */}
        <nav aria-label={t("common.primaryNavigation")} className="mt-4">
          <div className="flex flex-col gap-4">
            {GROUPS.map((group) => (
              <div key={group}>
                {!iconOnly ? (
                  <p className="text-eyebrow text-ink-muted mb-1.5 px-3">
                    {t(`nav.${group}`)}
                  </p>
                ) : null}
                <ul className="flex flex-col gap-0.5">
                  {NAV_ITEMS.filter((item) => item.group === group).map(
                    (item) => {
                      const Icon = item.icon;
                      const label = t(item.labelKey);
                      const title = item.implemented
                        ? label
                        : `${label} · ${NOT_IMPLEMENTED}`;
                      const rowClass = `text-body flex h-9 items-center gap-3 rounded-md font-medium transition-[color,transform] duration-150 ${
                        iconOnly ? "justify-center px-0" : "px-3"
                      }`;

                      if (item.implemented) {
                        const wsBase = homeHref.startsWith("/w/")
                          ? homeHref
                          : "/";
                        const href =
                          item.segment && wsBase !== "/"
                            ? `${wsBase}/${item.segment}`
                            : wsBase;
                        return (
                          <li key={item.label}>
                            <NavItemLink
                              href={href}
                              label={label}
                              title={title}
                              onNavigate={onNavigate}
                              iconOnly={iconOnly}
                            >
                              <Icon
                                className="size-[18px] shrink-0"
                                aria-hidden="true"
                              />
                              {iconOnly ? (
                                <span className="sr-only">{label}</span>
                              ) : (
                                <span>{label}</span>
                              )}
                            </NavItemLink>
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
                            className={`${rowClass} text-ink-muted w-full cursor-not-allowed text-left opacity-65`}
                          >
                            <Icon
                              className="text-ink-faint size-[18px] shrink-0"
                              aria-hidden="true"
                            />
                            {iconOnly ? (
                              <span className="sr-only">{label}</span>
                            ) : (
                              <span className="flex-1">{label}</span>
                            )}
                            {!iconOnly && (
                              <span
                                className="text-meta text-ink-muted"
                                aria-hidden="true"
                              >
                                Planned
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    },
                  )}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Account footer — administrative actions stay behind one disclosure. */}
      <div className="border-t border-line p-3">
        {iconOnly ? (
          <div
            className="text-ink-muted flex h-10 items-center justify-center"
            title={account ? `${account.name} · ${account.email}` : "Account"}
          >
            <UserRound className="size-[18px]" aria-hidden="true" />
            <span className="sr-only">
              {account ? account.name : "Not signed in"}
            </span>
          </div>
        ) : (
          <details className="group">
            <summary className="hover:bg-surface-subtle flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-2 transition-colors [&::-webkit-details-marker]:hidden">
              <span
                className="border-line text-ink-faint flex size-8 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <UserRound className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-body text-ink block truncate font-medium">
                  {account ? account.name : "Not signed in"}
                </span>
                <span className="text-meta text-ink-muted block truncate">
                  {account ? account.email : "Account unavailable"}
                </span>
              </span>
              <ChevronDown
                className="text-ink-faint size-4 shrink-0 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            {footerSlot ? (
              <div className="border-line mt-1 border-t pt-2">{footerSlot}</div>
            ) : null}
          </details>
        )}
      </div>
    </div>
  );
}
