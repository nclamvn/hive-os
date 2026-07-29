"use client";

import { Panel, SectionHeader } from "@/components/ui/panel";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";

import { MissionStatusBadge } from "@/components/mission/mission-status-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import type { getDashboardProjection } from "@/server/dashboard";
import { usePreferences } from "@/components/preferences/preferences-provider";

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
  const { t } = usePreferences();
  return (
    <aside
      data-testid="dashboard-context-rail"
      className="flex min-w-0 flex-col gap-6"
    >
      <Panel>
        <div className="border-line border-b p-[var(--shell-card-padding)] py-3">
          <SectionHeader title={t("dashboard.missionOverview")} eyebrow />
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
            title={t("dashboard.noMissionSelected")}
            hint={t("dashboard.createToBegin")}
          />
        )}
      </Panel>

      <Panel>
        <div className="border-line border-b p-[var(--shell-card-padding)] py-3">
          <SectionHeader title={t("dashboard.recentActivity")} eyebrow />
        </div>
        {projection.decisions.length === 0 ? (
          <EmptyState title={t("dashboard.noDecisions")} />
        ) : (
          <ul>
            {projection.decisions.map((decision) => (
              <li
                key={decision.id}
                className="border-line border-b p-4 last:border-b-0"
              >
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
          <SectionHeader title={t("dashboard.resourceUsage")} eyebrow />
        </div>
        {projection.usage.length === 0 ? (
          <EmptyState title={t("dashboard.noUsage")} />
        ) : (
          <dl className="divide-line divide-y">
            {projection.usage.map((item) => (
              <div
                key={`${item.metric}-${item.unit}`}
                className="flex items-center justify-between gap-3 p-4"
              >
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
    </aside>
  );
}
