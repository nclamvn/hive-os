"use client";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { Panel } from "@/components/ui/panel";

/**
 * Bottom metric-projection region. Metrics are derived from real governed
 * records only (docs/contractor RRI REQ-P13). On a greenfield database there
 * are none, so every value is explicitly unavailable and the region is
 * explicitly labelled unavailable. No counts are fabricated.
 */
export function MetricProjection({
  metrics,
}: {
  metrics: {
    missions: number;
    evidenceSources: number;
    claims: number;
    verifications: number;
    releases: number;
  };
}) {
  const { t } = usePreferences();
  const values = [
    [t("dashboard.metrics.missions"), metrics.missions],
    [t("dashboard.metrics.evidence"), metrics.evidenceSources],
    [t("dashboard.metrics.claims"), metrics.claims],
    [t("dashboard.metrics.verifications"), metrics.verifications],
    [t("dashboard.metrics.releases"), metrics.releases],
  ] as const;
  return (
    <Panel
      role="region"
      aria-label={t("dashboard.systemMetrics")}
      className="p-[var(--shell-card-padding)]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-eyebrow text-ink-muted">
          {t("dashboard.systemMetrics")}
        </h2>
        <span className="text-meta text-ink-muted">
          {t("dashboard.authoritativeTotals")}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 min-[560px]:grid-cols-3 min-[820px]:grid-cols-5">
        {values.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1">
            <dt className="text-meta text-ink-muted">{label}</dt>
            <dd className="text-page-title text-ink-strong tabular">{value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
