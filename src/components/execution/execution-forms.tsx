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

const field =
  "text-body text-ink border-line focus:border-line-strong h-10 w-full min-w-0 rounded-md border bg-surface-subtle px-3 outline-none";
const area =
  "text-body text-ink border-line focus:border-line-strong w-full min-w-0 resize-y rounded-md border bg-surface-subtle px-3 py-2 outline-none";

interface Option {
  id: string;
  label: string;
}

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-meta text-ink mb-1 block font-medium">
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
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} name={name} required={!optional} className={field}>
        <option value="">{optional ? "No predecessor" : "Select…"}</option>
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
          {result.ok ? success : result.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="text-body bg-navy-800 hover:bg-navy-900 inline-flex min-h-10 items-center rounded-md px-4 font-medium text-white disabled:opacity-50"
      >
        {busy ? "Saving…" : button}
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
  return (
    <>
      <div className="grid gap-3 min-[520px]:grid-cols-3">
        <div>
          <Label htmlFor={`${prefix}-role`}>Execution role</Label>
          <select
            id={`${prefix}-role`}
            name="executionRole"
            defaultValue="BUILDER"
            className={field}
          >
            <option value="CONTRACTOR">Contractor</option>
            <option value="BUILDER">Builder</option>
            <option value="VERIFIER">Verifier</option>
          </select>
        </div>
        <div>
          <Label htmlFor={`${prefix}-provider`}>Provider name</Label>
          <input
            id={`${prefix}-provider`}
            name="providerName"
            required
            placeholder="manual-operator"
            className={field}
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-model`}>Model or operator</Label>
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
        <Label htmlFor={`${prefix}-instruction`}>Immutable instruction</Label>
        <textarea
          id={`${prefix}-instruction`}
          name="instruction"
          rows={8}
          required
          placeholder="# Work package&#10;State the accepted scope, output contract and evidence duties."
          className={`${area} font-mono text-[12px]`}
        />
      </div>
      <p className="text-meta text-ink-muted">
        Never paste API keys, passwords, bearer tokens or private keys.
      </p>
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
  return (
    <section aria-labelledby="execution-console-title">
      <div className="mb-3">
        <h2 id="execution-console-title" className="text-section-title text-ink-strong">
          Operator console
        </h2>
        <p className="text-meta text-ink-muted mt-1">
          Open only the operation you are performing. Every save crosses a
          governed kernel boundary.
        </p>
      </div>
      <div className="space-y-3">
        {approvedMissions.length ? (
          <details className="border-line bg-surface rounded-panel border p-5">
            <summary className="text-body text-ink-strong cursor-pointer font-semibold">
              Open Mission exploration
            </summary>
            <p className="text-meta text-ink-muted mt-2 mb-4">
              Moves an approved contract into governed exploration. It does not
              create execution work automatically.
            </p>
            <GovernedForm
              label="Open Mission exploration"
              button="Open exploration"
              success="Mission entered exploration"
              action={(data) => openExplorationAction(slug, data)}
            >
              <Select
                id="exploration-mission"
                name="missionId"
                label="Approved Mission"
                options={approvedMissions}
              />
              <div>
                <Label htmlFor="exploration-reason">Reason</Label>
                <textarea
                  id="exploration-reason"
                  name="reason"
                  rows={2}
                  required
                  defaultValue="Approved contract is ready for governed exploration."
                  className={area}
                />
              </div>
            </GovernedForm>
          </details>
        ) : null}

        <details className="border-line bg-surface rounded-panel border p-5">
          <summary className="text-body text-ink-strong cursor-pointer font-semibold">
            Define execution work package
          </summary>
          <p className="text-meta text-ink-muted mt-2 mb-4">
            Binds one active compatible SkillVersion to a Mission. A predecessor
            is optional and must belong to the same Mission.
          </p>
          {operatingMissions.length && skills.length ? (
            <GovernedForm
              label="Define execution work package"
              button="Create work package"
              success="Execution work package created"
              action={(data) => createExecutionTipAction(slug, data)}
            >
              <div className="grid gap-3 min-[620px]:grid-cols-2">
                <Select
                  id="tip-mission"
                  name="missionId"
                  label="Exploring or building Mission"
                  options={operatingMissions}
                />
                <Select
                  id="tip-skill"
                  name="skillVersionId"
                  label="Active skill contract"
                  options={skills}
                />
              </div>
              <div className="grid gap-3 min-[620px]:grid-cols-[180px_1fr]">
                <div>
                  <Label htmlFor="tip-code">Package code</Label>
                  <input
                    id="tip-code"
                    name="code"
                    required
                    placeholder="TIP-001"
                    className={field}
                  />
                </div>
                <div>
                  <Label htmlFor="tip-title">Package title</Label>
                  <input id="tip-title" name="title" required className={field} />
                </div>
              </div>
              <div>
                <Label htmlFor="tip-description">Bounded description</Label>
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
                label="Predecessor"
                options={tips}
                optional
              />
            </GovernedForm>
          ) : (
            <p className="text-body text-ink-muted border-line rounded-md border p-4">
              An exploring Mission and an active assurance-compatible skill are
              required.
            </p>
          )}
        </details>

        <details className="border-line bg-surface rounded-panel border p-5">
          <summary className="text-body text-ink-strong cursor-pointer font-semibold">
            Issue immutable instruction
          </summary>
          <p className="text-meta text-ink-muted mt-2 mb-4">
            Creates attempt 1 and the exact instruction artifact for the human
            operator to exchange with an external provider.
          </p>
          {unissuedTips.length ? (
            <GovernedForm
              label="Issue manual instruction"
              button="Issue instruction"
              success="Instruction artifact and attempt 1 created"
              action={(data) => issueManualRunAction(slug, data)}
            >
              <Select
                id="issue-tip"
                name="tipId"
                label="Ready work package"
                options={unissuedTips}
              />
              <ManualRunFields prefix="issue" />
            </GovernedForm>
          ) : (
            <p className="text-body text-ink-muted">
              No unissued work package is ready.
            </p>
          )}
        </details>

        <details className="border-line bg-surface rounded-panel border p-5">
          <summary className="text-body text-ink-strong cursor-pointer font-semibold">
            Import Completion Report
          </summary>
          <p className="text-meta text-ink-muted mt-2 mb-4">
            Paste the provider response into the strict report contract. Missing
            sections fail atomically and remain awaiting.
          </p>
          {awaitingRuns.length ? (
            <GovernedForm
              label="Import Completion Report"
              button="Import report"
              success="Completion Report imported atomically"
              action={(data) => importCompletionReportAction(slug, data)}
            >
              <Select
                id="report-run"
                name="runId"
                label="Awaiting attempt"
                options={awaitingRuns}
              />
              <div>
                <Label htmlFor="completion-report">Strict report JSON</Label>
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
            <p className="text-body text-ink-muted">
              No attempt is awaiting a Completion Report.
            </p>
          )}
        </details>

        <details className="border-line bg-surface rounded-panel border p-5">
          <summary className="text-body text-ink-strong cursor-pointer font-semibold">
            Append retry attempt
          </summary>
          <p className="text-meta text-ink-muted mt-2 mb-4">
            Only the latest terminal attempt can be retried. Earlier artifacts
            and reports remain unchanged.
          </p>
          {retryRuns.length ? (
            <GovernedForm
              label="Append execution retry"
              button="Create retry"
              success="New retry attempt appended"
              action={(data) => retryManualRunAction(slug, data)}
            >
              <Select
                id="retry-run"
                name="previousRunId"
                label="Latest terminal attempt"
                options={retryRuns}
              />
              <ManualRunFields prefix="retry" />
            </GovernedForm>
          ) : (
            <p className="text-body text-ink-muted">
              No terminal attempt is eligible for retry.
            </p>
          )}
        </details>

        <details className="border-line bg-surface rounded-panel border p-5">
          <summary className="text-body text-ink-strong cursor-pointer font-semibold">
            Enter governed building
          </summary>
          <p className="text-meta text-ink-muted mt-2 mb-4">
            Mission Kernel permits this only when every execution package is
            complete and no material deviation remains open.
          </p>
          {exploringMissions.length ? (
            <GovernedForm
              label="Enter governed building"
              button="Enter building"
              success="Mission entered governed building"
              action={(data) => enterBuildingAction(slug, data)}
            >
              <Select
                id="building-mission"
                name="missionId"
                label="Exploring Mission"
                options={exploringMissions}
              />
              <div>
                <Label htmlFor="building-reason">Readiness reason</Label>
                <textarea
                  id="building-reason"
                  name="reason"
                  rows={2}
                  required
                  defaultValue="All execution packages are complete with no open material deviation."
                  className={area}
                />
              </div>
            </GovernedForm>
          ) : (
            <p className="text-body text-ink-muted">
              No exploring Mission is available for the readiness gate.
            </p>
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
  return (
    <GovernedForm
      label={`Resolve execution deviation ${code}`}
      button="Resolve deviation"
      success="Deviation resolution retained"
      action={(data) => resolveExecutionDeviationAction(slug, data)}
    >
      <input type="hidden" name="deviationId" value={deviationId} />
      <input type="hidden" name="expectedVersion" value={version} />
      <div>
        <Label htmlFor={`resolution-${deviationId}`}>Resolution record</Label>
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
