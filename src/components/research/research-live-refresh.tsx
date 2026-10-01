"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useTransition } from "react";
import { createResearchRefreshScheduler } from "./research-refresh-scheduler";

type ResearchLiveRefreshProps = {
  active: boolean;
  activeLabel: string;
  idleLabel: string;
  refreshLabel: string;
  updatedLabel: string;
};

export function ResearchLiveRefresh({
  active,
  activeLabel,
  idleLabel,
  refreshLabel,
}: ResearchLiveRefreshProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const scheduler = useRef<ReturnType<typeof createResearchRefreshScheduler> | null>(null);

  const requestRefresh = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router, startTransition]);

  useEffect(() => {
    const controller = createResearchRefreshScheduler(requestRefresh);
    scheduler.current = controller;
    const visibilityChanged = () => controller.setVisible(document.visibilityState === "visible");
    visibilityChanged();
    document.addEventListener("visibilitychange", visibilityChanged);
    return () => {
      controller.dispose();
      scheduler.current = null;
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, [requestRefresh]);

  useEffect(() => {
    scheduler.current?.setActive(active);
    scheduler.current?.observeTransition(isPending);
  }, [active, isPending, requestRefresh]);

  const refresh = useCallback(() => scheduler.current?.request(), []);

  return (
    <div className="flex min-w-0 flex-wrap items-center justify-end gap-x-3 gap-y-1">
      <p className="text-meta text-ink-muted" aria-live="polite">
        {isPending ? refreshLabel : active ? activeLabel : idleLabel}
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
