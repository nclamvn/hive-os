"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { inviteMemberAction } from "@/app/actions/identity";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/auth-card";
import type { Locale } from "@/i18n/config";
import { settingsValueLabel, type SettingsCopy } from "@/i18n/settings-copy";

export function InviteForm({
  slug,
  canInviteOwner,
  locale,
  copy,
}: {
  slug: string;
  canInviteOwner: boolean;
  locale: Locale;
  copy: SettingsCopy["members"];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const roles = canInviteOwner
    ? ["ADMIN", "MEMBER", "VIEWER", "OWNER"]
    : ["ADMIN", "MEMBER", "VIEWER"];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setToken(null);
    setBusy(true);
    const result = await inviteMemberAction(
      slug,
      new FormData(event.currentTarget),
    );
    setBusy(false);
    if (result.ok && result.token) {
      setToken(result.token);
      event.currentTarget.reset();
      router.refresh();
    } else {
      setError(
        locale === "en" ? (result.error ?? copy.createError) : copy.createError,
      );
    }
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex flex-wrap items-end gap-3"
      >
        <div className="min-w-[220px] flex-1">
          <label
            htmlFor="invite-email"
            className="text-meta text-ink mb-1 block font-medium"
          >
            {copy.email}
          </label>
          <input
            id="invite-email"
            name="email"
            type="email"
            required
            className="text-body text-ink border-line focus:border-line-strong h-10 w-full rounded-md border bg-surface-subtle px-3 outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="invite-role"
            className="text-meta text-ink mb-1 block font-medium"
          >
            {copy.role}
          </label>
          <select
            id="invite-role"
            name="role"
            defaultValue="MEMBER"
            className="text-body text-ink border-line bg-surface h-10 rounded-md border px-2"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {settingsValueLabel(locale, r)}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="primary" disabled={busy}>
          {busy ? copy.creating : copy.create}
        </Button>
      </form>

      <div className="mt-3">
        <FormError message={error} />
        {token ? (
          <div className="border-warning-600/30 bg-warning-50 rounded-md border p-3">
            <p className="text-meta text-ink-strong font-medium">
              {copy.tokenNotice}
            </p>
            <code className="text-meta text-ink mt-2 block break-all rounded bg-surface px-2 py-1">
              {`${typeof window !== "undefined" ? window.location.origin : ""}/invitations/${token}`}
            </code>
          </div>
        ) : null}
      </div>
    </div>
  );
}
