"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  approveContractAction,
  blockMissionAction,
  submitContractAction,
} from "@/app/actions/missions";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { localizedActionError } from "@/i18n/action-errors";

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
  const { locale } = usePreferences();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(
    fn: () => Promise<{
      ok: boolean;
      error?: string;
      errorCode?: string;
    }>,
  ) {
    setError(null);
    setBusy(true);
    const result = await fn();
    setBusy(false);
    if (result.ok) router.refresh();
    else setError(localizedActionError(locale, result));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "SCOPED" ? (
        <Button
          variant="primary"
          disabled={busy}
          onClick={() => run(() => submitContractAction(slug, missionId))}
        >
          {locale === "vi" ? "Gửi rà soát" : "Submit for review"}
        </Button>
      ) : null}
      {status === "CONTRACT_REVIEW" && canApprove ? (
        <Button
          variant="primary"
          disabled={busy}
          onClick={() => run(() => approveContractAction(slug, missionId))}
        >
          {locale === "vi" ? "Duyệt hợp đồng" : "Approve contract"}
        </Button>
      ) : null}
      {["INTAKE", "SCOPED", "CONTRACT_REVIEW", "APPROVED"].includes(status) ? (
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() =>
            run(() =>
              blockMissionAction(
                slug,
                missionId,
                locale === "vi"
                  ? "bị người vận hành chặn"
                  : "blocked by operator",
              ),
            )
          }
        >
          {locale === "vi" ? "Chặn" : "Block"}
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
