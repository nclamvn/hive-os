"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavItemLink({
  href,
  label,
  title,
  iconOnly,
  onNavigate,
  children,
}: {
  href: string;
  label: string;
  title: string;
  iconOnly: boolean;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const active =
    href.endsWith("/control-room") ||
    href.endsWith("/missions") ||
    href.endsWith("/observatory") ||
    href.endsWith("/reports")
      ? pathname === href || pathname.startsWith(`${href}/`)
      : pathname === href;

  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      title={title}
      onClick={onNavigate}
      className={`text-body flex h-9 items-center gap-3 rounded-md font-medium transition-colors ${
        iconOnly ? "justify-center px-0" : "px-3"
      } ${
        active
          ? "bg-surface-selected text-ink-strong"
          : "text-ink-strong hover:bg-surface-subtle"
      }`}
    >
      {children}
    </Link>
  );
}
