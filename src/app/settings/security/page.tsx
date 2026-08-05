import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Hexagon } from "lucide-react";

import { SecuritySettings } from "@/components/auth/security-settings";
import { PreferencesControls } from "@/components/preferences/preferences-controls";
import { auth } from "@/server/auth";
import { authCopy } from "@/i18n/auth-copy";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function SecuritySettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");
  const copy = authCopy[await getLocale()];

  return (
    <main className="bg-canvas min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-[560px]">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="text-navy-800 size-6" aria-hidden="true" />
            <span className="text-section-title text-ink-strong tracking-tight">
              HIVE OS
            </span>
          </div>
          <Link
            href="/"
            className="text-meta text-blue-600 font-medium underline"
          >
            {copy.security.back}
          </Link>
        </div>
        <div className="mb-4 ml-auto w-[220px]">
          <PreferencesControls toolbar />
        </div>
        <div className="border-line bg-surface shadow-panel rounded-panel border p-6">
          <h1 className="text-page-title text-ink-strong mb-1">
            {copy.security.title}
          </h1>
          <p className="text-body text-ink-muted mb-5">
            {copy.security.description}
          </p>
          <SecuritySettings
            email={session.user.email}
            emailVerified={session.user.emailVerified}
          />
        </div>
      </div>
    </main>
  );
}
