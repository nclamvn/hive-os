"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { updateObligationAction } from "@/app/actions/missions";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { localizedActionError } from "@/i18n/action-errors";

export function ObligationControls({
  slug,
  obligationId,
  status,
}: {
  slug: string;
  obligationId: string;
  status: string;
}) {
  const router = useRouter();
  const { locale } = usePreferences();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function set(next: "IN_PROGRESS" | "SATISFIED" | "BLOCKED") {
    setBusy(true);
    setError(null);
    try {
      const result = await updateObligationAction(slug, obligationId, next);
      if (result.ok) router.refresh();
      else setError(localizedActionError(locale, result));
    } finally {
      setBusy(false);
    }
  }

  if (status === "SATISFIED" || status === "WAIVED") {
    return (
      <span className="text-meta text-ink-faint">
        {locale === "vi" ? "Không có" : "None"}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-1">
      {busy ? (
        <span
          role="status"
          className="text-meta text-ink-muted inline-flex h-7 items-center gap-1.5 px-2"
        >
          <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
          {locale === "vi" ? "Đang cập nhật" : "Updating"}
        </span>
      ) : null}
      {status !== "IN_PROGRESS" ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => set("IN_PROGRESS")}
          className="text-meta text-ink-muted border-line hover:bg-surface-subtle h-7 rounded-md border px-2 disabled:hidden"
        >
          {locale === "vi" ? "Bắt đầu" : "Start"}
        </button>
      ) : null}
      <button
        type="button"
        disabled={busy}
        onClick={() => set("SATISFIED")}
        className="text-meta text-success-600 border-line hover:bg-success-50 h-7 rounded-md border px-2 font-medium disabled:hidden"
      >
        {locale === "vi" ? "Hoàn thành" : "Satisfy"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => set("BLOCKED")}
        className="text-meta text-warning-600 border-line hover:bg-warning-50 h-7 rounded-md border px-2 disabled:hidden"
      >
        {locale === "vi" ? "Chặn" : "Block"}
      </button>
      {error ? (
        <span role="alert" className="text-meta text-danger-600 basis-full text-right">
          {error}
        </span>
      ) : null}
    </div>
  );
}
