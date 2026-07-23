import Link from "next/link";

import { Panel, SectionHeader } from "@/components/ui/panel";
import { EmptyState } from "@/components/ui/empty-state";
import { MissionStatusBadge } from "@/components/mission/mission-status-badge";

const COLUMNS = ["Reference", "Mission", "Stage", "Progress", "Next gate", "Updated"] as const;

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
  const empty = missions.length === 0;
  return (
    <Panel>
      <div className="p-[var(--shell-card-padding)] pb-3">
        <SectionHeader
          title="Active missions"
          action={
            basePath ? (
              <Link href={`${basePath}/missions`} className="text-meta text-blue-600 font-medium">
                View all
              </Link>
            ) : undefined
          }
        />
      </div>

      <div className="hidden min-[820px]:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-t border-line">
              {COLUMNS.map((col) => (
                <th key={col} scope="col" className="text-meta text-ink-muted bg-surface-subtle px-5 py-2 text-left font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empty ? (
              <tr>
                <td colSpan={COLUMNS.length} className="p-0" data-testid="missions-empty-table">
                  <EmptyState title="No active missions" hint="Create a mission to begin" />
                </td>
              </tr>
            ) : (
              missions.map((m) => (
                <tr key={m.id} className="border-t border-line">
                  <td className="text-meta text-ink-muted tabular px-5 py-3">{m.referenceCode}</td>
                  <td className="text-body text-ink px-5 py-3 font-medium">
                    <Link href={`${basePath}/missions/${m.id}`} className="hover:underline">
                      {m.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3"><MissionStatusBadge status={m.status} /></td>
                  <td className="text-meta text-ink-muted tabular px-5 py-3">
                    {m.progressBasisPoints == null
                      ? "Unavailable"
                      : `${(m.progressBasisPoints / 100).toFixed(0)}%`}
                  </td>
                  <td className="text-meta text-ink-muted px-5 py-3">
                    {m.nextGate ?? "No open gate"}
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

      <div className="border-t border-line min-[820px]:hidden" data-testid="missions-empty-stacked">
        {empty ? (
          <EmptyState title="No active missions" hint="Create a mission to begin" />
        ) : (
          <ul>
            {missions.map((m) => (
              <li key={m.id} className="border-line flex items-center justify-between gap-3 border-b px-5 py-3 last:border-b-0">
                <span className="min-w-0">
                  <Link href={`${basePath}/missions/${m.id}`} className="text-body text-ink block truncate font-medium hover:underline">
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
