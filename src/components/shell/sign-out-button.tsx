"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { usePreferences } from "@/components/preferences/preferences-provider";

export function SignOutButton() {
  const router = useRouter();
  const { t } = usePreferences();
  const [busy, setBusy] = useState(false);

  async function handleSignOut() {
    setBusy(true);
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={busy}
      className="text-meta text-ink-muted hover:bg-surface-subtle border-line flex h-8 w-full items-center gap-2 rounded-md border px-2 font-medium disabled:opacity-50"
    >
      <LogOut className="size-4" aria-hidden="true" />
      {busy ? t("common.signingOut") : t("common.signOut")}
    </button>
  );
}
