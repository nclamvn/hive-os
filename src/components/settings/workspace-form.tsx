"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { updateWorkspaceNameAction } from "@/app/actions/identity";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/auth-card";
import type { Locale } from "@/i18n/config";
import type { SettingsCopy } from "@/i18n/settings-copy";

export function WorkspaceForm({
  slug,
  currentName,
  canUpdate,
  locale,
  copy,
}: {
  slug: string;
  currentName: string;
  canUpdate: boolean;
  locale: Locale;
  copy: SettingsCopy["workspace"];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!canUpdate) {
    return (
      <div>
        <span className="text-meta text-ink-muted block">{copy.name}</span>
        <span className="text-body text-ink-strong block font-medium">
          {currentName}
        </span>
        <p className="text-meta text-ink-muted mt-2">{copy.readOnly}</p>
      </div>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setBusy(true);
    const result = await updateWorkspaceNameAction(
      slug,
      new FormData(event.currentTarget),
    );
    setBusy(false);
    if (result.ok) {
      setSaved(true);
      router.refresh();
    } else {
      setError(
        locale === "en" ? (result.error ?? copy.updateError) : copy.updateError,
      );
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-md">
      <FormError message={error} />
      <label
        htmlFor="ws-name"
        className="text-meta text-ink mb-1 block font-medium"
      >
        {copy.name}
      </label>
      <input
        id="ws-name"
        name="name"
        defaultValue={currentName}
        required
        className="text-body text-ink border-line focus:border-line-strong h-10 w-full rounded-md border bg-surface-subtle px-3 outline-none"
      />
      <div className="mt-3 flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={busy}>
          {busy ? copy.saving : copy.save}
        </Button>
        {saved ? (
          <span role="status" className="text-meta text-success-600">
            {copy.saved}
          </span>
        ) : null}
      </div>
    </form>
  );
}
