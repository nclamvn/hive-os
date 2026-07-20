"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { resolveDecisionAction } from "@/app/actions/missions";

export function DecisionControls({
  slug,
  decisionId,
}: {
  slug: string;
  decisionId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function resolve(approve: boolean) {
    setBusy(true);
    await resolveDecisionAction(slug, decisionId, approve);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex gap-1">
      <button type="button" disabled={busy} onClick={() => resolve(true)} className="text-meta text-success-600 border-line hover:bg-success-50 h-7 rounded-md border px-2 font-medium">
        Approve
      </button>
      <button type="button" disabled={busy} onClick={() => resolve(false)} className="text-meta text-danger-600 border-line hover:bg-danger-50 h-7 rounded-md border px-2">
        Reject
      </button>
    </div>
  );
}
