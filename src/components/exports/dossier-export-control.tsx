"use client";

import { useEffect, useRef, useState } from "react";

type State =
  | { phase: "idle" }
  | { phase: "requesting" }
  | { phase: "processing"; exportId: string }
  | { phase: "ready"; exportId: string }
  | { phase: "failed"; message: string };

export function DossierExportControl({
  endpoint,
  compact = false,
}: {
  endpoint: string;
  compact?: boolean;
}) {
  const [state, setState] = useState<State>({ phase: "idle" });
  const pollCount = useRef(0);

  useEffect(() => {
    if (state.phase !== "processing") return;
    const exportId = state.exportId;
    const timer = window.setInterval(async () => {
      pollCount.current += 1;
      try {
        const response = await fetch(
          `${endpoint}?exportId=${encodeURIComponent(exportId)}`,
          { cache: "no-store" },
        );
        if (response.status === 200) {
          window.clearInterval(timer);
          setState({ phase: "ready", exportId });
        } else if (response.status !== 202) {
          window.clearInterval(timer);
          setState({ phase: "failed", message: "Export unavailable" });
        } else if (pollCount.current >= 30) {
          window.clearInterval(timer);
        }
      } catch {
        window.clearInterval(timer);
        setState({ phase: "failed", message: "Export status unavailable" });
      }
    }, 2_000);
    return () => window.clearInterval(timer);
  }, [endpoint, state]);

  async function requestExport() {
    setState({ phase: "requesting" });
    pollCount.current = 0;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Idempotency-Key": crypto.randomUUID() },
      });
      const result = (await response.json()) as {
        status?: string;
        outcome?: { exportId?: string };
        error?: string;
      };
      const exportId = result.outcome?.exportId;
      if (!response.ok || result.status !== "SUCCEEDED" || !exportId) {
        throw new Error(result.error || "Export request rejected");
      }
      setState({ phase: "processing", exportId });
    } catch (error) {
      setState({
        phase: "failed",
        message: error instanceof Error ? error.message : "Export request failed",
      });
    }
  }

  const className = compact
    ? "text-meta text-navy-700 border-line hover:border-line-strong inline-flex rounded-md border px-2.5 py-1.5 font-medium disabled:opacity-50"
    : "text-meta text-navy-700 border-line hover:border-line-strong inline-flex rounded-md border px-3 py-2 font-medium disabled:opacity-50";

  if (state.phase === "ready") {
    return (
      <a
        href={`${endpoint}?exportId=${encodeURIComponent(state.exportId)}`}
        download
        className={className}
      >
        Download dossier manifest
      </a>
    );
  }
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        className={className}
        disabled={state.phase === "requesting" || state.phase === "processing"}
        onClick={requestExport}
      >
        {state.phase === "requesting"
          ? "Requesting…"
          : state.phase === "processing"
            ? "Building dossier…"
            : "Build dossier"}
      </button>
      {state.phase === "failed" ? (
        <span className="text-caption text-danger-700">{state.message}</span>
      ) : null}
    </span>
  );
}
