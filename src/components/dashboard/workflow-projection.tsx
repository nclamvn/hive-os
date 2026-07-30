"use client";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { Panel } from "@/components/ui/panel";
import { WORKFLOW_STAGES } from "@/components/shell/workflow";
import type { MessageKey } from "@/i18n/config";

const STAGE_KEYS = [
  "mission.stages.DRAFT",
  "mission.stages.INTAKE",
  "mission.stages.SCOPED",
  "mission.stages.CONTRACT_REVIEW",
  "mission.stages.APPROVED",
  "mission.stages.EXPLORING",
  "mission.stages.BUILDING",
  "mission.stages.VERIFYING",
  "mission.stages.REVIEW",
  "mission.stages.RELEASED",
] satisfies readonly MessageKey[];

/**
 * Inactive explanatory projection of the governed mission workflow
 * (docs/contractor/04_BLUEPRINT.md §3). It describes the canonical stage
 * sequence; it does NOT represent any running mission or fabricate progress.
 */
export function WorkflowProjection() {
  const { t } = usePreferences();
  return (
    <Panel className="p-[var(--shell-card-padding)]">
      {/* OBL-UI-001: header and note stack vertically below 768px so the
          title always receives normal available width. */}
      <div className="flex flex-col gap-1 min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between min-[768px]:gap-3">
        <h2 className="text-section-title text-ink">
          {t("dashboard.workflow")}
        </h2>
        <span className="text-meta text-ink-muted">
          {t("dashboard.workflowNote")}
        </span>
      </div>
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
                {t(STAGE_KEYS[index])}
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
