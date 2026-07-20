import { Panel, SectionHeader } from "@/components/ui/panel";
import { EmptyState } from "@/components/ui/empty-state";

const COLUMNS = ["Mission", "Type", "Stage", "Progress", "Updated"] as const;

/**
 * Active-missions projection. On a greenfield database there are no missions,
 * so no rows are fabricated. The table structure (column headers) is a
 * table-shaped shell projection at >=820px; below 820px it becomes a stacked
 * semantic block rather than a horizontally scrolling table.
 */
export function ActiveMissions() {
  return (
    <Panel>
      <div className="p-[var(--shell-card-padding)] pb-3">
        <SectionHeader title="Active missions" />
      </div>

      {/* Table-shaped projection (>=820px). */}
      <div className="hidden min-[820px]:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-t border-line">
              {COLUMNS.map((col) => (
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
            <tr>
              <td colSpan={COLUMNS.length} className="p-0" data-testid="missions-empty-table">
                <EmptyState
                  title="No active missions"
                  hint="Create a mission to begin"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Stacked semantic alternative (<820px). */}
      <div className="border-t border-line min-[820px]:hidden" data-testid="missions-empty-stacked">
        <EmptyState
          title="No active missions"
          hint="Create a mission to begin"
        />
      </div>
    </Panel>
  );
}
