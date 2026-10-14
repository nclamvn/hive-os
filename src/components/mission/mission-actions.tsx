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
    <div className="flex w-full flex-col gap-2 min-[760px]:w-auto min-[760px]:shrink-0">
      <div className="grid grid-cols-1 gap-2 min-[760px]:auto-cols-fr min-[760px]:grid-flow-col min-[760px]:grid-cols-none">
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
      </div>
      {error ? (
        <span role="alert" className="text-meta text-danger-600 w-full">
          {error}
        </span>
      ) : null}
    </div>
  );
}
