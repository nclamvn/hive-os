"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Role } from "@prisma/client";

import { changeRoleAction, suspendMemberAction } from "@/app/actions/identity";
import type { Locale } from "@/i18n/config";
import { settingsValueLabel, type SettingsCopy } from "@/i18n/settings-copy";

export function MemberRowActions({
  slug,
  membershipId,
  role,
  status,
  isSelf,
  canManageOwner,
  canManageOrdinary,
  locale,
  copy,
}: {
  slug: string;
  membershipId: string;
  role: Role;
  status: string;
  isSelf: boolean;
  canManageOwner: boolean;
  canManageOrdinary: boolean;
  locale: Locale;
  copy: SettingsCopy["members"];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Changing anything about an Owner requires Owner-management authority.
  const targetIsOwner = role === "OWNER";
  const canEdit = targetIsOwner ? canManageOwner : canManageOrdinary;
  const roleOptions: Role[] = canManageOwner
    ? ["OWNER", "ADMIN", "MEMBER", "VIEWER"]
    : ["ADMIN", "MEMBER", "VIEWER"];

  async function onRoleChange(next: Role) {
    setError(null);
    setBusy(true);
    const result = await changeRoleAction(slug, membershipId, next);
    setBusy(false);
    if (result.ok) router.refresh();
    else
      setError(
        locale === "en"
          ? (result.error ?? copy.changeRoleError)
          : copy.changeRoleError,
      );
  }

  async function onSuspend() {
    setError(null);
    setBusy(true);
    const result = await suspendMemberAction(slug, membershipId);
    setBusy(false);
    if (result.ok) router.refresh();
    else
      setError(
        locale === "en"
          ? (result.error ?? copy.suspendError)
          : copy.suspendError,
      );
  }

  if (status === "SUSPENDED") {
    return <span className="text-meta text-ink-faint">{copy.suspended}</span>;
  }

  if (!canEdit) {
    return <span className="text-meta text-ink-faint">{copy.none}</span>;
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <label className="sr-only" htmlFor={`role-${membershipId}`}>
        {copy.role}
      </label>
      <select
        id={`role-${membershipId}`}
        value={role}
        disabled={busy}
        onChange={(e) => onRoleChange(e.target.value as Role)}
        className="text-meta text-ink border-line bg-surface h-8 rounded-md border px-2"
      >
        {roleOptions.map((r) => (
          <option key={r} value={r}>
            {settingsValueLabel(locale, r)}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onSuspend}
        disabled={busy || isSelf}
        title={isSelf ? copy.cannotSuspendSelf : copy.suspendMember}
        className="text-meta text-danger-600 border-line hover:bg-danger-50 h-8 rounded-md border px-2 font-medium disabled:opacity-40"
      >
        {copy.suspend}
      </button>
      {error ? (
        <span
          role="alert"
          className="text-meta text-danger-600 w-full text-right"
        >
          {error}
        </span>
      ) : null}
    </div>
  );
}
