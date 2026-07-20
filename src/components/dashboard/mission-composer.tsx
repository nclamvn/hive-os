"use client";

import { type FormEvent, useState } from "react";
import { Paperclip, LayoutTemplate, ArrowRight } from "lucide-react";

import { Panel, SectionHeader } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { MISSION_TYPES } from "@/components/shell/workflow";

/**
 * Mission composer — the first actionable element of the main canvas.
 *
 * TIP-002 scope: visual and accessibility scaffolding only. Submission mutates
 * NO governed state; it surfaces a truthful boundary message instead.
 */
export function MissionComposer() {
  const [type, setType] = useState<string>(MISSION_TYPES[0]);
  const [note, setNote] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNote("Mission creation arrives in a later build stage.");
  }

  return (
    <Panel id="mission-composer" className="p-[var(--shell-card-padding)]">
      <SectionHeader title="Start a new mission" />
      <p className="text-meta text-ink-muted mt-1">
        Describe an objective in plain language. Methodology, provenance, and
        verification are handled by the system.
      </p>

      <form className="mt-4" onSubmit={handleSubmit}>
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

        {/* Mission type — canonical affordances; selection mutates nothing. */}
        <fieldset className="mt-3">
          <legend className="sr-only">Mission type</legend>
          <div className="flex flex-wrap gap-2">
            {MISSION_TYPES.map((option) => {
              const selected = option === type;
              return (
                <label
                  key={option}
                  className={`text-meta flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 font-medium ${
                    selected
                      ? "border-navy-700 bg-surface-selected text-ink-strong"
                      : "border-line text-ink-muted hover:bg-surface-subtle"
                  }`}
                >
                  <input
                    type="radio"
                    name="mission-type"
                    value={option}
                    checked={selected}
                    onChange={() => setType(option)}
                    className="sr-only"
                  />
                  {option}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" type="button" aria-disabled="true" title="Attachments arrive in a later stage">
              <Paperclip className="size-4" aria-hidden="true" />
              Attach
            </Button>
            <Button variant="secondary" type="button" aria-disabled="true" title="Templates arrive in a later stage">
              <LayoutTemplate className="size-4" aria-hidden="true" />
              Use a template
            </Button>
          </div>
          <Button variant="primary" type="submit">
            Define mission
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Truthful, polite status — no state is created. */}
        <p role="status" aria-live="polite" className="text-meta text-ink-muted mt-3 min-h-[18px]">
          {note}
        </p>
      </form>
    </Panel>
  );
}
