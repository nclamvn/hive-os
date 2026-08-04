"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { usePreferences } from "@/components/preferences/preferences-provider";

import { SignOutButton } from "./sign-out-button";

export function AccountMenuActions() {
  const { t } = usePreferences();

  return (
    <div className="space-y-1">
      <Link
        href="/settings/security"
        className="text-meta text-ink-muted hover:bg-surface-subtle hover:text-ink flex h-9 w-full items-center gap-2 rounded-md px-2 font-medium transition-colors"
      >
        <ShieldCheck className="size-4" aria-hidden="true" />
        {t("common.accountSecurity")}
      </Link>
      <SignOutButton />
    </div>
  );
}
