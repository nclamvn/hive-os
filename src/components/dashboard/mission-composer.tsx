"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { ProvenanceRail } from "@/components/ui/provenance-rail";

/**
 * Mission composer — the first actionable element of the main canvas. It opens
 * the real governed mission-creation flow. No governed state is mutated here;
 * creation happens on the dedicated form.
 */
export function MissionComposer({ basePath }: { basePath: string }) {
  const { t } = usePreferences();
  return (
    <Panel id="mission-composer" className="overflow-hidden">
      <div className="grid gap-6 p-5 min-[760px]:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)] min-[760px]:p-7">
        <div className="min-w-0">
          <p className="text-eyebrow text-blue-600">{t("dashboard.eyebrow")}</p>
          <h2 className="text-thesis text-ink-strong mt-3 max-w-3xl">
            {t("dashboard.thesis")}
          </h2>
          <p className="text-body text-ink-muted mt-4 max-w-2xl">
            {t("dashboard.thesisHint")}
          </p>
        </div>
        <div className="border-line min-w-0 border-t pt-5 min-[760px]:border-t-0 min-[760px]:border-l min-[760px]:pt-0 min-[760px]:pl-6">
          <SectionHeader title={t("dashboard.startMission")} />
          <p className="text-meta text-ink-muted mt-1">
            {t("dashboard.objectiveHint")}
          </p>
          <div className="mt-4">
            <label htmlFor="mission-objective" className="sr-only">
              {t("dashboard.objectiveLabel")}
            </label>
            <textarea
              id="mission-objective"
              name="objective"
              rows={3}
              placeholder={t("dashboard.objectivePlaceholder")}
              className="text-body text-ink placeholder:text-ink-muted border-line focus:border-line-strong w-full resize-y rounded-md border bg-surface-subtle px-3 py-2.5 outline-none"
            />

            <div className="mt-4 flex justify-end">
              <Link
                href={`${basePath}/missions/new`}
                className="text-body bg-navy-800 hover:bg-navy-900 inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 font-medium text-white"
              >
                {t("dashboard.defineMission")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ProvenanceRail active={0} />
    </Panel>
  );
}
