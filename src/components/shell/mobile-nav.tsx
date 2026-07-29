"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";

import { usePreferences } from "@/components/preferences/preferences-provider";

import { type SidebarAccount, SidebarContent } from "./sidebar-content";

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  /** Focus returns here when the drawer closes. */
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
  account?: SidebarAccount | null;
  footerSlot?: ReactNode;
  homeHref?: string;
}

export function MobileNav({
  open,
  onClose,
  returnFocusRef,
  account,
  footerSlot,
  homeHref,
}: MobileNavProps) {
  const { t } = usePreferences();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes; focus moves into the drawer on open and returns on close.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = returnFocusRef.current;
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Simple focus trap within the drawer.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 min-[768px]:hidden">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("common.navigation")}
        className="bg-surface absolute inset-y-0 left-0 flex w-[min(84vw,300px)] flex-col border-r border-line shadow-panel"
      >
        <div className="relative h-full">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t("common.closeNavigation")}
            className="border-line text-ink-muted hover:bg-surface-subtle absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-md border"
          >
            <X className="size-[18px]" aria-hidden="true" />
          </button>
          <SidebarContent
            onNavigate={onClose}
            account={account}
            footerSlot={footerSlot}
            homeHref={homeHref}
          />
        </div>
      </div>
    </div>
  );
}
