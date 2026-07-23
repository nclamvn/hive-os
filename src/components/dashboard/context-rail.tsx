import { Panel, SectionHeader } from "@/components/ui/panel";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";

import { MissionStatusBadge } from "@/components/mission/mission-status-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import type { getDashboardProjection } from "@/server/dashboard";

/**
 * Right context rail. Every region shows a truthful empty state — no mission
 * overview, activity records, or resource telemetry is fabricated.
 */
export function ContextRail({
  projection,
  basePath,
}: {
  projection: Awaited<ReturnType<typeof getDashboardProjection>>;
  basePath: string;
}) {
  return (
    <>
      <Panel>
        <div className="border-line border-b p-[var(--shell-card-padding)] py-3">
          <SectionHeader title="Mission overview" eyebrow />
        </div>
        {projection.currentMission ? (
          <div className="p-4">
            <Link
              href={`${basePath}/missions/${projection.currentMission.id}`}
              className="text-body text-ink-strong font-semibold hover:underline"
            >
              {projection.currentMission.title}
            </Link>
            <p className="text-meta text-ink-muted tabular mt-1">
              {projection.currentMission.referenceCode} ·{" "}
              {projection.currentMission.assuranceProfile.toLowerCase()}
            </p>
            <div className="mt-3">
              <MissionStatusBadge status={projection.currentMission.status} />
            </div>
          </div>
        ) : (
          <EmptyState
            title="No mission selected"
            hint="Create a mission to begin."
          />
        )}
      </Panel>

      <Panel>
        <div className="border-line border-b p-[var(--shell-card-padding)] py-3">
          <SectionHeader title="Recent activity" eyebrow />
        </div>
        {projection.decisions.length === 0 ? (
          <EmptyState title="No decisions require action" />
        ) : (
          <ul>
            {projection.decisions.map((decision) => (
              <li key={decision.id} className="border-line border-b p-4 last:border-b-0">
                <Link
                  href={`${basePath}/missions/${decision.mission.id}?view=decisions`}
                  className="text-body text-ink-strong font-medium hover:underline"
                >
                  {decision.question}
                </Link>
                <p className="text-meta text-ink-muted mt-1">
                  {decision.mission.referenceCode}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel>
        <div className="border-line border-b p-[var(--shell-card-padding)] py-3">
          <SectionHeader title="Resource usage" eyebrow />
        </div>
        {projection.usage.length === 0 ? (
          <EmptyState title="No measured resource usage" />
        ) : (
          <dl className="divide-line divide-y">
            {projection.usage.map((item) => (
              <div key={`${item.metric}-${item.unit}`} className="flex items-center justify-between gap-3 p-4">
                <dt className="text-meta text-ink-muted">
                  {item.metric.replaceAll("_", " ")}
                </dt>
                <dd>
                  <StatusBadge tone="neutral">
                    {item.quantity} {item.unit}
                  </StatusBadge>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Panel>
    </>
  );
}
