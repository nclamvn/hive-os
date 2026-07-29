"use client";

import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  authorizeGovernedReleaseAction,
  beginVerificationRunAction,
  completeVerificationRunAction,
  createVerificationScenarioAction,
  moveMissionToReviewAction,
  recordGovernanceSignoffAction,
  releaseMissionAction,
  type VerificationActionResult,
} from "@/app/actions/verification";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { localizedActionError } from "@/i18n/action-errors";
import { useVerificationCopy } from "@/i18n/use-core-copy";

const field =
  "text-body text-ink border-line focus:border-line-strong h-10 w-full min-w-0 rounded-md border bg-surface-subtle px-3 outline-none";
const area =
  "text-body text-ink border-line focus:border-line-strong w-full min-w-0 resize-y rounded-md border bg-surface-subtle px-3 py-2 outline-none";

interface Option {
  id: string;
  label: string;
}

interface RunOption extends Option {
  template: string;
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
  const copy = useVerificationCopy();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} name={name} required={!optional} className={field}>
        <option value="">
          {optional ? copy.common.noRequirement : copy.common.select}
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
  action: (data: FormData) => Promise<VerificationActionResult>;
  children: ReactNode;
}) {
  const copy = useVerificationCopy();
  const { locale } = usePreferences();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<VerificationActionResult | null>(null);

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

function Operation({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <details className="border-line bg-surface rounded-panel border p-5">
      <summary className="text-body text-ink-strong cursor-pointer font-semibold">
        {title}
      </summary>
      <p className="text-meta text-ink-muted mt-2 mb-4">{note}</p>
      {children}
    </details>
  );
}

export function VerificationOperationsForms({
  slug,
  buildingMissions,
  verifyingMissions,
  reviewMissions,
  releasableMissions,
  requirements,
  verifierAttempts,
  activeRuns,
  reviewableReports,
  releaseReports,
  canOperate,
  canReview,
  canRelease,
}: {
  slug: string;
  buildingMissions: Option[];
  verifyingMissions: Option[];
  reviewMissions: Option[];
  releasableMissions: Option[];
  requirements: Option[];
  verifierAttempts: Option[];
  activeRuns: RunOption[];
  reviewableReports: Option[];
  releaseReports: Option[];
  canOperate: boolean;
  canReview: boolean;
  canRelease: boolean;
}) {
  const copy = useVerificationCopy();
  const [runId, setRunId] = useState(activeRuns[0]?.id ?? "");
  const selectedTemplate = useMemo(
    () => activeRuns.find((run) => run.id === runId)?.template ?? "",
    [activeRuns, runId],
  );

  return (
    <section aria-labelledby="verification-console-title">
      <div className="mb-3">
        <h2
          id="verification-console-title"
          className="text-section-title text-ink-strong"
        >
          {copy.console.title}
        </h2>
        <p className="text-meta text-ink-muted mt-1">{copy.console.hint}</p>
      </div>
      <div className="space-y-3">
        {canOperate ? (
          <>
            <Operation title={copy.scenario.title} note={copy.scenario.note}>
              {buildingMissions.length ? (
                <GovernedForm
                  label={copy.scenario.title}
                  button={copy.scenario.button}
                  success={copy.scenario.success}
                  action={(data) =>
                    createVerificationScenarioAction(slug, data)
                  }
                >
                  <div className="grid gap-3 min-[680px]:grid-cols-2">
                    <Select
                      id="scenario-mission"
                      name="missionId"
                      label={copy.scenario.mission}
                      options={buildingMissions}
                    />
                    <Select
                      id="scenario-requirement"
                      name="requirementId"
                      label={copy.scenario.requirement}
                      options={requirements}
                      optional
                    />
                  </div>
                  <div className="grid gap-3 min-[680px]:grid-cols-[180px_1fr_220px]">
                    <div>
                      <Label htmlFor="scenario-code">
                        {copy.scenario.code}
                      </Label>
                      <input
                        id="scenario-code"
                        name="code"
                        required
                        placeholder="VG-01"
                        className={field}
                      />
                    </div>
                    <div>
                      <Label htmlFor="scenario-title">
                        {copy.scenario.name}
                      </Label>
                      <input
                        id="scenario-title"
                        name="title"
                        required
                        className={field}
                      />
                    </div>
                    <div>
                      <Label htmlFor="scenario-kind">
                        {copy.scenario.kind}
                      </Label>
                      <select
                        id="scenario-kind"
                        name="kind"
                        defaultValue="REQUIREMENT"
                        className={field}
                      >
                        {[
                          "REQUIREMENT",
                          "FUNCTIONAL",
                          "SECURITY",
                          "ACCESSIBILITY",
                          "PERFORMANCE",
                          "OTHER",
                        ].map((kind) => (
                          <option key={kind} value={kind}>
                            {kind}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="scenario-method">
                      {copy.scenario.method}
                    </Label>
                    <textarea
                      id="scenario-method"
                      name="method"
                      rows={3}
                      required
                      className={area}
                    />
                  </div>
                  <div>
                    <Label htmlFor="scenario-outcome">
                      {copy.scenario.outcome}
                    </Label>
                    <textarea
                      id="scenario-outcome"
                      name="expectedOutcome"
                      rows={2}
                      required
                      className={area}
                    />
                  </div>
                  <label className="text-meta text-ink inline-flex items-center gap-2">
                    <input name="required" type="checkbox" defaultChecked />
                    {copy.scenario.required}
                  </label>
                </GovernedForm>
              ) : (
                <p className="text-body text-ink-muted">
                  {copy.scenario.empty}
                </p>
              )}
            </Operation>

            <Operation title={copy.begin.title} note={copy.begin.note}>
              {buildingMissions.length && verifierAttempts.length ? (
                <GovernedForm
                  label={copy.begin.title}
                  button={copy.begin.button}
                  success={copy.begin.success}
                  action={(data) => beginVerificationRunAction(slug, data)}
                >
                  <div className="grid gap-3 min-[680px]:grid-cols-2">
                    <Select
                      id="run-mission"
                      name="missionId"
                      label={copy.begin.mission}
                      options={buildingMissions}
                    />
                    <Select
                      id="run-verifier"
                      name="verifierAgentRunId"
                      label={copy.begin.attempt}
                      options={verifierAttempts}
                    />
                  </div>
                </GovernedForm>
              ) : (
                <p className="text-body text-ink-muted">{copy.begin.empty}</p>
              )}
            </Operation>

            <Operation title={copy.report.title} note={copy.report.note}>
              {activeRuns.length ? (
                <GovernedForm
                  key={runId}
                  label={copy.report.form}
                  button={copy.report.button}
                  success={copy.report.success}
                  action={(data) => completeVerificationRunAction(slug, data)}
                >
                  <div>
                    <Label htmlFor="report-run">{copy.report.run}</Label>
                    <select
                      id="report-run"
                      name="verificationRunId"
                      value={runId}
                      onChange={(event) => setRunId(event.target.value)}
                      className={field}
                    >
                      {activeRuns.map((run) => (
                        <option key={run.id} value={run.id}>
                          {run.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="verify-report">{copy.report.json}</Label>
                    <textarea
                      id="verify-report"
                      name="report"
                      rows={24}
                      required
                      defaultValue={selectedTemplate}
                      className={`${area} font-mono text-[12px]`}
                    />
                  </div>
                </GovernedForm>
              ) : (
                <p className="text-body text-ink-muted">{copy.report.empty}</p>
              )}
            </Operation>
          </>
        ) : null}

        {canReview ? (
          <>
            <Operation title={copy.signoff.title} note={copy.signoff.note}>
              {reviewableReports.length ? (
                <GovernedForm
                  label={copy.signoff.title}
                  button={copy.signoff.button}
                  success={copy.signoff.success}
                  action={(data) => recordGovernanceSignoffAction(slug, data)}
                >
                  <Select
                    id="signoff-report"
                    name="verificationReportId"
                    label={copy.signoff.report}
                    options={reviewableReports}
                  />
                  <div className="grid gap-3 min-[540px]:grid-cols-2">
                    <div>
                      <Label htmlFor="signoff-type">{copy.signoff.type}</Label>
                      <select
                        id="signoff-type"
                        name="signoffType"
                        className={field}
                      >
                        <option value="VERIFICATION">
                          {copy.signoff.verification}
                        </option>
                        <option value="RELEASE">{copy.signoff.release}</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="signoff-decision">
                        {copy.signoff.decision}
                      </Label>
                      <select
                        id="signoff-decision"
                        name="decision"
                        className={field}
                      >
                        <option value="APPROVED">
                          {copy.signoff.approved}
                        </option>
                        <option value="REJECTED">
                          {copy.signoff.rejected}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signoff-rationale">
                      {copy.signoff.rationale}
                    </Label>
                    <textarea
                      id="signoff-rationale"
                      name="rationale"
                      rows={3}
                      required
                      className={area}
                    />
                  </div>
                </GovernedForm>
              ) : (
                <p className="text-body text-ink-muted">{copy.signoff.empty}</p>
              )}
            </Operation>

            <Operation title={copy.review.title} note={copy.review.note}>
              {verifyingMissions.length ? (
                <GovernedForm
                  label={copy.review.title}
                  button={copy.review.button}
                  success={copy.review.success}
                  action={(data) => moveMissionToReviewAction(slug, data)}
                >
                  <Select
                    id="review-mission"
                    name="missionId"
                    label={copy.review.mission}
                    options={verifyingMissions}
                  />
                  <div>
                    <Label htmlFor="review-reason">{copy.common.reason}</Label>
                    <textarea
                      id="review-reason"
                      name="reason"
                      rows={2}
                      required
                      defaultValue={copy.review.defaultReason}
                      className={area}
                    />
                  </div>
                </GovernedForm>
              ) : (
                <p className="text-body text-ink-muted">{copy.review.empty}</p>
              )}
            </Operation>
          </>
        ) : null}

        {canRelease ? (
          <>
            <Operation title={copy.authorize.title} note={copy.authorize.note}>
              {reviewMissions.length && releaseReports.length ? (
                <GovernedForm
                  label={copy.authorize.form}
                  button={copy.authorize.button}
                  success={copy.authorize.success}
                  action={(data) => authorizeGovernedReleaseAction(slug, data)}
                >
                  <div className="grid gap-3 min-[680px]:grid-cols-2">
                    <Select
                      id="release-mission"
                      name="missionId"
                      label={copy.authorize.mission}
                      options={reviewMissions}
                    />
                    <Select
                      id="release-report"
                      name="verificationReportId"
                      label={copy.authorize.report}
                      options={releaseReports}
                    />
                  </div>
                  <div>
                    <Label htmlFor="release-visibility">
                      {copy.authorize.visibility}
                    </Label>
                    <select
                      id="release-visibility"
                      name="visibility"
                      className={field}
                    >
                      <option value="INTERNAL">
                        {copy.authorize.internal}
                      </option>
                      <option value="PUBLIC">{copy.authorize.public}</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="release-claims">
                      {copy.authorize.claims}
                    </Label>
                    <textarea
                      id="release-claims"
                      name="claimVersionIds"
                      rows={4}
                      className={`${area} font-mono text-[12px]`}
                    />
                  </div>
                  <div className="grid gap-3 min-[680px]:grid-cols-2">
                    <div>
                      <Label htmlFor="release-methods">
                        {copy.authorize.methods}
                      </Label>
                      <textarea
                        id="release-methods"
                        name="methods"
                        rows={4}
                        required
                        className={area}
                      />
                    </div>
                    <div>
                      <Label htmlFor="release-limitations">
                        {copy.authorize.limitations}
                      </Label>
                      <textarea
                        id="release-limitations"
                        name="limitations"
                        rows={4}
                        required
                        className={area}
                      />
                    </div>
                  </div>
                </GovernedForm>
              ) : (
                <p className="text-body text-ink-muted">
                  {copy.authorize.empty}
                </p>
              )}
            </Operation>

            <Operation title={copy.release.title} note={copy.release.note}>
              {releasableMissions.length ? (
                <GovernedForm
                  label={copy.release.title}
                  button={copy.release.button}
                  success={copy.release.success}
                  action={(data) => releaseMissionAction(slug, data)}
                >
                  <Select
                    id="final-release-mission"
                    name="missionId"
                    label={copy.release.mission}
                    options={releasableMissions}
                  />
                  <div>
                    <Label htmlFor="release-reason">
                      {copy.release.reason}
                    </Label>
                    <textarea
                      id="release-reason"
                      name="reason"
                      rows={2}
                      required
                      defaultValue={copy.release.defaultReason}
                      className={area}
                    />
                  </div>
                </GovernedForm>
              ) : (
                <p className="text-body text-ink-muted">{copy.release.empty}</p>
              )}
            </Operation>
          </>
        ) : null}
      </div>
    </section>
  );
}
