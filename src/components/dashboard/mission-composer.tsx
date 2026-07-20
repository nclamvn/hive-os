import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Panel, SectionHeader } from "@/components/ui/panel";

/**
 * Mission composer — the first actionable element of the main canvas. It opens
 * the real governed mission-creation flow. No governed state is mutated here;
 * creation happens on the dedicated form.
 */
export function MissionComposer({ basePath }: { basePath: string }) {
  return (
    <Panel id="mission-composer" className="p-[var(--shell-card-padding)]">
      <SectionHeader title="Start a new mission" />
      <p className="text-meta text-ink-muted mt-1">
        Describe an objective in plain language. Methodology, provenance, and
        verification are handled by the system.
      </p>

      <div className="mt-4">
        <label htmlFor="mission-objective" className="sr-only">
          Mission objective
        </label>
        <textarea
          id="mission-objective"
          name="objective"
          rows={3}
          placeholder="e.g. Assess the evidence for a technical claim and report limitations."
          className="text-body text-ink placeholder:text-ink-muted border-line focus:border-line-strong w-full resize-y rounded-md border bg-surface-subtle px-3 py-2.5 outline-none"
        />

        <div className="mt-4 flex justify-end">
          <Link
            href={`${basePath}/missions/new`}
            className="text-body bg-navy-800 hover:bg-navy-900 inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 font-medium text-white"
          >
            Define mission
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Panel>
  );
}
