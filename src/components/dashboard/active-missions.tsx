"use client";

import Link from "next/link";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { EmptyState } from "@/components/ui/empty-state";
import { MissionStatusBadge } from "@/components/mission/mission-status-badge";

export interface MissionRow {
  id: string;
  referenceCode: string;
  title: string;
  status: string;
  assuranceProfile: string;
  progressBasisPoints?: number | null;
  nextGate?: string | null;
  updatedAt: string;
}

/**
 * Active-missions projection. Renders real workspace-scoped missions when they
 * exist, or a truthful empty state. No records are fabricated.
 */
export function ActiveMissions({
  missions = [],
  basePath = "",
}: {
  missions?: MissionRow[];
  basePath?: string;
}) {
  const { t } = usePreferences();
  const columns = [
    t("dashboard.columns.reference"),
    t("dashboard.columns.mission"),
    t("dashboard.columns.stage"),
    t("dashboard.columns.progress"),
    t("dashboard.columns.nextGate"),
    t("dashboard.columns.updated"),
  ];
  const empty = missions.length === 0;
  return (
    <Panel>
      <div className="p-[var(--shell-card-padding)] pb-3">
        <SectionHeader
          title={t("dashboard.activeMissions")}
          action={
            basePath ? (
              <Link
                href={`${basePath}/missions`}
                className="text-meta text-blue-600 font-medium"
              >
                {t("dashboard.viewAll")}
              </Link>
            ) : undefined
          }
        />
      </div>

      <div className="hidden min-[820px]:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-t border-line">
              {columns.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="text-meta text-ink-muted bg-surface-subtle px-5 py-2 text-left font-medium"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empty ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-0"
                  data-testid="missions-empty-table"
                >
                  <EmptyState
                    title={t("dashboard.noActive")}
                    hint={t("dashboard.createToBegin")}
                  />
                </td>
              </tr>
            ) : (
              missions.map((m) => (
                <tr key={m.id} className="border-t border-line">
                  <td className="text-meta text-ink-muted tabular px-5 py-3">
                    {m.referenceCode}
                  </td>
                  <td className="text-body text-ink px-5 py-3 font-medium">
                    <Link
                      href={`${basePath}/missions/${m.id}`}
                      className="hover:underline"
                    >
                      {m.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <MissionStatusBadge status={m.status} />
                  </td>
                  <td className="text-meta text-ink-muted tabular px-5 py-3">
                    {m.progressBasisPoints == null
                      ? t("dashboard.unavailable")
                      : `${(m.progressBasisPoints / 100).toFixed(0)}%`}
                  </td>
                  <td className="text-meta text-ink-muted px-5 py-3">
                    {m.nextGate ?? t("dashboard.noOpenGate")}
                  </td>
                  <td className="text-meta text-ink-muted tabular px-5 py-3">
                    {m.updatedAt.slice(0, 10)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        className="border-t border-line min-[820px]:hidden"
        data-testid="missions-empty-stacked"
      >
        {empty ? (
          <EmptyState
            title={t("dashboard.noActive")}
            hint={t("dashboard.createToBegin")}
          />
        ) : (
          <ul>
            {missions.map((m) => (
              <li
                key={m.id}
                className="border-line flex items-center justify-between gap-3 border-b px-5 py-3 last:border-b-0"
              >
                <span className="min-w-0">
                  <Link
                    href={`${basePath}/missions/${m.id}`}
                    className="text-body text-ink block truncate font-medium hover:underline"
                  >
                    {m.title}
                  </Link>
                  <span className="text-meta text-ink-muted tabular">
                    {m.referenceCode} · {m.assuranceProfile.toLowerCase()}
                    {m.progressBasisPoints == null
                      ? ""
                      : ` · ${(m.progressBasisPoints / 100).toFixed(0)}%`}
                  </span>
                </span>
                <MissionStatusBadge status={m.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}
