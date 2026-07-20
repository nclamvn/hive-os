"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  approveContractAction,
  blockMissionAction,
  submitContractAction,
} from "@/app/actions/missions";
import { Button } from "@/components/ui/button";

export function MissionActions({
  slug,
  missionId,
  status,
  canApprove,
}: {
  slug: string;
  missionId: string;
  status: string;
  canApprove: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    setBusy(true);
    const result = await fn();
    setBusy(false);
    if (result.ok) router.refresh();
    else setError(result.error ?? "Action failed");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "SCOPED" ? (
        <Button variant="primary" disabled={busy} onClick={() => run(() => submitContractAction(slug, missionId))}>
          Submit for review
        </Button>
      ) : null}
      {status === "CONTRACT_REVIEW" && canApprove ? (
        <Button variant="primary" disabled={busy} onClick={() => run(() => approveContractAction(slug, missionId))}>
          Approve contract
        </Button>
      ) : null}
      {["INTAKE", "SCOPED", "CONTRACT_REVIEW", "APPROVED"].includes(status) ? (
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() => run(() => blockMissionAction(slug, missionId, "blocked by operator"))}
        >
          Block
        </Button>
      ) : null}
      {error ? (
        <span role="alert" className="text-meta text-danger-600 w-full">
          {error}
        </span>
      ) : null}
    </div>
  );
}
