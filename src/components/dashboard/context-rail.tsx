import { Panel, SectionHeader } from "@/components/ui/panel";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Right context rail. Every region shows a truthful empty state — no mission
 * overview, activity records, or resource telemetry is fabricated.
 */
export function ContextRail() {
  return (
    <>
      <Panel>
        <div className="border-line border-b p-[var(--shell-card-padding)] py-3">
          <SectionHeader title="Mission overview" eyebrow />
        </div>
        <EmptyState
          title="No mission selected"
          hint="Select a mission to see its overview"
        />
      </Panel>

      <Panel>
        <div className="border-line border-b p-[var(--shell-card-padding)] py-3">
          <SectionHeader title="Recent activity" eyebrow />
        </div>
        <EmptyState title="No recent activity" />
      </Panel>

      <Panel>
        <div className="border-line border-b p-[var(--shell-card-padding)] py-3">
          <SectionHeader title="Resource usage" eyebrow />
        </div>
        <EmptyState title="Resource telemetry is not connected" />
      </Panel>
    </>
  );
}
