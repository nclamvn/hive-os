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
      title={iconOnly ? title : undefined}
      onClick={onNavigate}
      className={`text-body relative flex h-9 items-center gap-3 rounded-md font-medium transition-[color,transform] duration-150 ${
        iconOnly ? "justify-center px-0" : "px-3"
      } ${
        active
          ? "text-ink-strong before:bg-ink-strong before:absolute before:top-1/2 before:left-0 before:h-5 before:w-px before:-translate-y-1/2 before:rounded-full"
          : "text-ink-muted hover:translate-x-0.5 hover:text-ink-strong"
      }`}
    >
      {children}
    </Link>
  );
}
