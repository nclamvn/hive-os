"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

type ResearchLiveRefreshProps = {
  active: boolean;
  activeLabel: string;
  idleLabel: string;
  refreshLabel: string;
  updatedLabel: string;
};

const REFRESH_INTERVAL_MS = 5_000;

export function ResearchLiveRefresh({
  active,
  activeLabel,
  idleLabel,
  refreshLabel,
  updatedLabel,
}: ResearchLiveRefreshProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const refresh = useCallback(() => {
    startTransition(() => {
      router.refresh();
      setLastUpdated(
        new Intl.DateTimeFormat(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date()),
      );
    });
  }, [router]);

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [active, refresh]);

  return (
    <div className="flex min-w-0 flex-wrap items-center justify-end gap-x-3 gap-y-1">
      <p className="text-meta text-ink-muted" aria-live="polite">
        {isPending ? refreshLabel : active ? activeLabel : idleLabel}
        {lastUpdated ? ` · ${updatedLabel} ${lastUpdated}` : ""}
      </p>
      <button
        type="button"
        onClick={refresh}
        disabled={isPending}
        className="text-meta text-ink hover:text-ink-strong inline-flex min-h-10 items-center gap-2 rounded-md px-2 font-medium transition-colors disabled:opacity-50"
      >
        <RefreshCw
          className={`size-4 motion-reduce:animate-none ${isPending ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
        {refreshLabel}
      </button>
    </div>
  );
}
