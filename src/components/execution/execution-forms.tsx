"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createExecutionTipAction,
  enterBuildingAction,
  importCompletionReportAction,
  issueManualRunAction,
  openExplorationAction,
  resolveExecutionDeviationAction,
  retryManualRunAction,
  type ExecutionActionResult,
} from "@/app/actions/execution";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { localizedActionError } from "@/i18n/action-errors";
import { useExecutionCopy } from "@/i18n/use-core-copy";

const field =
  "text-body text-ink border-line focus:border-line-strong h-10 w-full min-w-0 rounded-md border bg-surface-subtle px-3 outline-none";
const area =
  "text-body text-ink border-line focus:border-line-strong w-full min-w-0 resize-y rounded-md border bg-surface-subtle px-3 py-2 outline-none";

interface Option {
  id: string;
  label: string;
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-meta text-ink mb-1 block font-medium"
    >
      {children}
    </label>
  );
}

function Select({
  id,
  name,
  label,
  options,
  optional = false,
}: {
  id: string;
  name: string;
  label: string;
  options: Option[];
  optional?: boolean;
}) {
  const copy = useExecutionCopy();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} name={name} required={!optional} className={field}>
        <option value="">
          {optional ? copy.common.noPredecessor : copy.common.select}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function GovernedForm({
  label,
  button,
  success,
  action,
  children,
}: {
  label: string;
  button: string;
  success: string;
  action: (data: FormData) => Promise<ExecutionActionResult>;
  children: ReactNode;
}) {
  const router = useRouter();
  const { locale } = usePreferences();
  const copy = useExecutionCopy();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ExecutionActionResult | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setResult(null);
    const form = event.currentTarget;
    const next = await action(new FormData(form));
    setBusy(false);
    setResult(next);
    if (next.ok) {
      form.reset();
      router.refresh();
    }
  }

  return (
    <form aria-label={label} onSubmit={submit} className="space-y-3">
      {children}
      {result ? (
        <p
          role={result.ok ? "status" : "alert"}
          className={`text-meta ${result.ok ? "text-success-600" : "text-danger-600"}`}
        >
          {result.ok ? success : localizedActionError(locale, result)}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="text-body bg-navy-800 hover:bg-navy-900 inline-flex min-h-10 items-center rounded-md px-4 font-medium text-white disabled:opacity-50"
      >
        {busy ? copy.common.saving : button}
      </button>
    </form>
  );
}

const REPORT_TEMPLATE = JSON.stringify(
  {
    result: "DONE",
    summary: "Describe the completed governed work package.",
    requirementCoverage: {
      implemented: 1,
      total: 1,
      missing: [],
      deferred: [],
    },
    scenarioResults: [],
    technicalHealth: {
      build: "NOT_RUN",
      typecheck: { errors: 0, warnings: 0 },
      lint: { errors: 0, warnings: 0 },
      unit: { passed: 0, failed: 0, skipped: 0 },
      integration: { passed: 0, failed: 0, skipped: 0 },
      e2e: { passed: 0, failed: 0, skipped: 0 },
      accessibilityViolations: 0,
      vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0 },
    },
    overallStatus: "READY",
    deviations: [],
    resourceUsage: [],
  },
  null,
  2,
);

function ManualRunFields({ prefix }: { prefix: string }) {
  const copy = useExecutionCopy();
  return (
    <>
      <div className="grid gap-3 min-[520px]:grid-cols-3">
        <div>
          <Label htmlFor={`${prefix}-role`}>{copy.manual.role}</Label>
          <select
            id={`${prefix}-role`}
            name="executionRole"
            defaultValue="BUILDER"
            className={field}
          >
            <option value="CONTRACTOR">{copy.manual.contractor}</option>
            <option value="BUILDER">{copy.manual.builder}</option>
            <option value="VERIFIER">{copy.manual.verifier}</option>
          </select>
        </div>
        <div>
          <Label htmlFor={`${prefix}-provider`}>{copy.manual.provider}</Label>
          <input
            id={`${prefix}-provider`}
            name="providerName"
            required
            placeholder="manual-operator"
            className={field}
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-model`}>{copy.manual.model}</Label>
          <input
            id={`${prefix}-model`}
            name="modelName"
            required
            placeholder="external-model"
            className={field}
          />
        </div>
      </div>
      <div>
        <Label htmlFor={`${prefix}-instruction`}>
          {copy.manual.instruction}
        </Label>
        <textarea
          id={`${prefix}-instruction`}
          name="instruction"
          rows={8}
          required
          placeholder={copy.manual.instructionPlaceholder}
          className={`${area} font-mono text-[12px]`}
        />
      </div>
      <p className="text-meta text-ink-muted">{copy.manual.secretWarning}</p>
    </>
  );
}

export function ExecutionOperationsForms({
  slug,
  approvedMissions,
  operatingMissions,
  exploringMissions,
  skills,
  tips,
  unissuedTips,
  awaitingRuns,
  retryRuns,
}: {
  slug: string;
  approvedMissions: Option[];
  operatingMissions: Option[];
  exploringMissions: Option[];
  skills: Option[];
  tips: Option[];
  unissuedTips: Option[];
  awaitingRuns: Option[];
  retryRuns: Option[];
}) {
  const copy = useExecutionCopy();
  return (
    <section aria-labelledby="execution-console-title">
      <div className="mb-3">
        <h2
          id="execution-console-title"
          className="text-section-title text-ink-strong"
        >
          {copy.console.title}
        </h2>
        <p className="text-meta text-ink-muted mt-1">{copy.console.hint}</p>
      </div>
      <div className="space-y-3">
        {approvedMissions.length ? (
          <details className="border-line bg-surface rounded-panel border p-5">
            <summary className="text-body text-ink-strong cursor-pointer font-semibold">
              {copy.exploration.title}
            </summary>
            <p className="text-meta text-ink-muted mt-2 mb-4">
              {copy.exploration.hint}
            </p>
            <GovernedForm
              label={copy.exploration.title}
              button={copy.exploration.button}
              success={copy.exploration.success}
              action={(data) => openExplorationAction(slug, data)}
            >
              <Select
                id="exploration-mission"
                name="missionId"
                label={copy.exploration.mission}
                options={approvedMissions}
              />
              <div>
                <Label htmlFor="exploration-reason">{copy.common.reason}</Label>
                <textarea
                  id="exploration-reason"
                  name="reason"
                  rows={2}
                  required
                  defaultValue={copy.exploration.defaultReason}
                  className={area}
                />
              </div>
            </GovernedForm>
          </details>
        ) : null}

        <details className="border-line bg-surface rounded-panel border p-5">
          <summary className="text-body text-ink-strong cursor-pointer font-semibold">
            {copy.package.title}
          </summary>
          <p className="text-meta text-ink-muted mt-2 mb-4">
            {copy.package.hint}
          </p>
          {operatingMissions.length && skills.length ? (
            <GovernedForm
              label={copy.package.title}
              button={copy.package.button}
              success={copy.package.success}
              action={(data) => createExecutionTipAction(slug, data)}
            >
              <div className="grid gap-3 min-[620px]:grid-cols-2">
                <Select
                  id="tip-mission"
                  name="missionId"
                  label={copy.package.mission}
                  options={operatingMissions}
                />
                <Select
                  id="tip-skill"
                  name="skillVersionId"
                  label={copy.package.skill}
                  options={skills}
                />
              </div>
              <div className="grid gap-3 min-[620px]:grid-cols-[180px_1fr]">
                <div>
                  <Label htmlFor="tip-code">{copy.package.code}</Label>
                  <input
                    id="tip-code"
                    name="code"
                    required
                    placeholder="TIP-001"
                    className={field}
                  />
                </div>
                <div>
                  <Label htmlFor="tip-title">{copy.package.name}</Label>
                  <input
                    id="tip-title"
                    name="title"
                    required
                    className={field}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tip-description">
                  {copy.package.description}
                </Label>
                <textarea
                  id="tip-description"
                  name="description"
                  rows={3}
                  required
                  className={area}
                />
              </div>
              <Select
                id="tip-predecessor"
                name="predecessorTipId"
                label={copy.package.predecessor}
                options={tips}
                optional
              />
            </GovernedForm>
          ) : (
            <p className="text-body text-ink-muted border-line rounded-md border p-4">
              {copy.package.unavailable}
            </p>
          )}
        </details>

        <details className="border-line bg-surface rounded-panel border p-5">
          <summary className="text-body text-ink-strong cursor-pointer font-semibold">
            {copy.issue.title}
          </summary>
          <p className="text-meta text-ink-muted mt-2 mb-4">
            {copy.issue.hint}
          </p>
          {unissuedTips.length ? (
            <GovernedForm
              label={copy.issue.form}
              button={copy.issue.button}
              success={copy.issue.success}
              action={(data) => issueManualRunAction(slug, data)}
            >
              <Select
                id="issue-tip"
                name="tipId"
                label={copy.issue.package}
                options={unissuedTips}
              />
              <ManualRunFields prefix="issue" />
            </GovernedForm>
          ) : (
            <p className="text-body text-ink-muted">{copy.issue.empty}</p>
          )}
        </details>

        <details className="border-line bg-surface rounded-panel border p-5">
          <summary className="text-body text-ink-strong cursor-pointer font-semibold">
            {copy.report.title}
          </summary>
          <p className="text-meta text-ink-muted mt-2 mb-4">
            {copy.report.hint}
          </p>
          {awaitingRuns.length ? (
            <GovernedForm
              label={copy.report.title}
              button={copy.report.button}
              success={copy.report.success}
              action={(data) => importCompletionReportAction(slug, data)}
            >
              <Select
                id="report-run"
                name="runId"
                label={copy.report.attempt}
                options={awaitingRuns}
              />
              <div>
                <Label htmlFor="completion-report">{copy.report.json}</Label>
                <textarea
                  id="completion-report"
                  name="report"
                  rows={24}
                  required
                  defaultValue={REPORT_TEMPLATE}
                  spellCheck={false}
                  className={`${area} font-mono text-[12px]`}
                />
              </div>
            </GovernedForm>
          ) : (
            <p className="text-body text-ink-muted">{copy.report.empty}</p>
          )}
        </details>

        <details className="border-line bg-surface rounded-panel border p-5">
          <summary className="text-body text-ink-strong cursor-pointer font-semibold">
            {copy.retry.title}
          </summary>
          <p className="text-meta text-ink-muted mt-2 mb-4">
            {copy.retry.hint}
          </p>
          {retryRuns.length ? (
            <GovernedForm
              label={copy.retry.form}
              button={copy.retry.button}
              success={copy.retry.success}
              action={(data) => retryManualRunAction(slug, data)}
            >
              <Select
                id="retry-run"
                name="previousRunId"
                label={copy.retry.attempt}
                options={retryRuns}
              />
              <ManualRunFields prefix="retry" />
            </GovernedForm>
          ) : (
            <p className="text-body text-ink-muted">{copy.retry.empty}</p>
          )}
        </details>

        <details className="border-line bg-surface rounded-panel border p-5">
          <summary className="text-body text-ink-strong cursor-pointer font-semibold">
            {copy.building.title}
          </summary>
          <p className="text-meta text-ink-muted mt-2 mb-4">
            {copy.building.hint}
          </p>
          {exploringMissions.length ? (
            <GovernedForm
              label={copy.building.title}
              button={copy.building.button}
              success={copy.building.success}
              action={(data) => enterBuildingAction(slug, data)}
            >
              <Select
                id="building-mission"
                name="missionId"
                label={copy.building.mission}
                options={exploringMissions}
              />
              <div>
                <Label htmlFor="building-reason">{copy.building.reason}</Label>
                <textarea
                  id="building-reason"
                  name="reason"
                  rows={2}
                  required
                  defaultValue={copy.building.defaultReason}
                  className={area}
                />
              </div>
            </GovernedForm>
          ) : (
            <p className="text-body text-ink-muted">{copy.building.empty}</p>
          )}
        </details>
      </div>
    </section>
  );
}

export function DeviationResolutionForm({
  slug,
  deviationId,
  version,
  code,
}: {
  slug: string;
  deviationId: string;
  version: number;
  code: string;
}) {
  const copy = useExecutionCopy();
  return (
    <GovernedForm
      label={`${copy.deviation.resolve} ${code}`}
      button={copy.deviation.button}
      success={copy.deviation.success}
      action={(data) => resolveExecutionDeviationAction(slug, data)}
    >
      <input type="hidden" name="deviationId" value={deviationId} />
      <input type="hidden" name="expectedVersion" value={version} />
      <div>
        <Label htmlFor={`resolution-${deviationId}`}>
          {copy.deviation.record}
        </Label>
        <textarea
          id={`resolution-${deviationId}`}
          name="resolution"
          rows={3}
          required
          className={area}
        />
      </div>
    </GovernedForm>
  );
}
