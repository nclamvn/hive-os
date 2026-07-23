"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateObligationAction } from "@/app/actions/missions";

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
  const [busy, setBusy] = useState(false);

  async function set(next: "IN_PROGRESS" | "SATISFIED" | "BLOCKED") {
    setBusy(true);
    await updateObligationAction(slug, obligationId, next);
    setBusy(false);
    router.refresh();
  }

  if (status === "SATISFIED" || status === "WAIVED") {
    return <span className="text-meta text-ink-faint">None</span>;
  }

  return (
    <div className="flex flex-wrap justify-end gap-1">
      {status !== "IN_PROGRESS" ? (
        <button type="button" disabled={busy} onClick={() => set("IN_PROGRESS")} className="text-meta text-ink-muted border-line hover:bg-surface-subtle h-7 rounded-md border px-2">
          Start
        </button>
      ) : null}
      <button type="button" disabled={busy} onClick={() => set("SATISFIED")} className="text-meta text-success-600 border-line hover:bg-success-50 h-7 rounded-md border px-2 font-medium">
        Satisfy
      </button>
      <button type="button" disabled={busy} onClick={() => set("BLOCKED")} className="text-meta text-warning-600 border-line hover:bg-warning-50 h-7 rounded-md border px-2">
        Block
      </button>
    </div>
  );
}
