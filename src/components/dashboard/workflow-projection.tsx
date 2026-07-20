import { Panel, SectionHeader } from "@/components/ui/panel";
import { WORKFLOW_STAGES } from "@/components/shell/workflow";

/**
 * Inactive explanatory projection of the governed mission workflow
 * (docs/contractor/04_BLUEPRINT.md §3). It describes the canonical stage
 * sequence; it does NOT represent any running mission or fabricate progress.
 */
export function WorkflowProjection() {
  return (
    <Panel className="p-[var(--shell-card-padding)]">
      <SectionHeader
        title="HIVE OS mission workflow"
        action={
          <span className="text-meta text-ink-muted">
            Explanatory sequence — not an active mission
          </span>
        }
      />
      <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3">
        {WORKFLOW_STAGES.map((stage, index) => (
          <li key={stage} className="flex items-center gap-2">
            <span className="flex items-center gap-2">
              <span
                className="border-line text-ink-muted text-meta tabular flex size-5 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="text-meta text-ink-muted font-medium">
                {stage}
              </span>
            </span>
            {index < WORKFLOW_STAGES.length - 1 && (
              <span className="text-ink-faint" aria-hidden="true">
                ›
              </span>
            )}
          </li>
        ))}
      </ol>
    </Panel>
  );
}
