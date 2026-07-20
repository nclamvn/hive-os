import { Panel } from "@/components/ui/panel";

/**
 * Bottom metric-projection region. Metrics are derived from real governed
 * records only (docs/contractor RRI REQ-P13). On a greenfield database there
 * are none, so every value is a non-operational em dash and the region is
 * explicitly labelled unavailable. No counts are fabricated.
 */
const METRIC_LABELS = [
  "Missions",
  "Evidence sources",
  "Claims",
  "Verifications",
  "Releases",
] as const;

export function MetricProjection() {
  return (
    <Panel
      role="region"
      aria-label="System metrics"
      className="p-[var(--shell-card-padding)]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-eyebrow text-ink-muted">System metrics</h2>
        <span className="text-meta text-ink-muted">
          No governed metrics available
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 min-[560px]:grid-cols-3 min-[820px]:grid-cols-5">
        {METRIC_LABELS.map((label) => (
          <div key={label} className="flex flex-col gap-1">
            <dt className="text-meta text-ink-muted">{label}</dt>
            <dd
              className="text-page-title text-ink-muted tabular"
              aria-label={`${label}: no governed metric available`}
            >
              —
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
