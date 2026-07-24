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
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} name={name} required={!optional} className={field}>
        <option value="">
          {optional ? "No linked requirement" : "Select…"}
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
          Governance console
        </h2>
        <p className="text-meta text-ink-muted mt-1">
          Each save crosses an authorized kernel boundary and retains immutable
          evidence.
        </p>
      </div>
      <div className="space-y-3">
        {canOperate ? (
          <>
            <Operation
              title="Define verification scenario"
              note="Bind a deterministic method and expected outcome to a building Mission."
            >
              {buildingMissions.length ? (
                <GovernedForm
                  label="Define verification scenario"
                  button="Create scenario"
                  success="Verification scenario created"
                  action={(data) =>
                    createVerificationScenarioAction(slug, data)
                  }
                >
                  <div className="grid gap-3 min-[680px]:grid-cols-2">
                    <Select
                      id="scenario-mission"
                      name="missionId"
                      label="Building Mission"
                      options={buildingMissions}
                    />
                    <Select
                      id="scenario-requirement"
                      name="requirementId"
                      label="Approved requirement"
                      options={requirements}
                      optional
                    />
                  </div>
                  <div className="grid gap-3 min-[680px]:grid-cols-[180px_1fr_220px]">
                    <div>
                      <Label htmlFor="scenario-code">Scenario code</Label>
                      <input
                        id="scenario-code"
                        name="code"
                        required
                        placeholder="VG-01"
                        className={field}
                      />
                    </div>
                    <div>
                      <Label htmlFor="scenario-title">Title</Label>
                      <input
                        id="scenario-title"
                        name="title"
                        required
                        className={field}
                      />
                    </div>
                    <div>
                      <Label htmlFor="scenario-kind">Kind</Label>
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
                            {kind.toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="scenario-method">Verification method</Label>
                    <textarea
                      id="scenario-method"
                      name="method"
                      rows={3}
                      required
                      className={area}
                    />
                  </div>
                  <div>
                    <Label htmlFor="scenario-outcome">Expected outcome</Label>
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
                    Required for release
                  </label>
                </GovernedForm>
              ) : (
                <p className="text-body text-ink-muted">
                  No building Mission is available.
                </p>
              )}
            </Operation>

            <Operation
              title="Begin independent verification"
              note="Consumes one completed VERIFIER attempt and atomically moves the Mission to verifying."
            >
              {buildingMissions.length && verifierAttempts.length ? (
                <GovernedForm
                  label="Begin independent verification"
                  button="Begin verification"
                  success="Verification run begun"
                  action={(data) => beginVerificationRunAction(slug, data)}
                >
                  <div className="grid gap-3 min-[680px]:grid-cols-2">
                    <Select
                      id="run-mission"
                      name="missionId"
                      label="Building Mission"
                      options={buildingMissions}
                    />
                    <Select
                      id="run-verifier"
                      name="verifierAgentRunId"
                      label="Completed verifier attempt"
                      options={verifierAttempts}
                    />
                  </div>
                </GovernedForm>
              ) : (
                <p className="text-body text-ink-muted">
                  A building Mission and an unused completed VERIFIER attempt
                  are required.
                </p>
              )}
            </Operation>

            <Operation
              title="Import four-section Verify Report"
              note="The JSON contract must exactly cover approved requirements and required scenarios."
            >
              {activeRuns.length ? (
                <GovernedForm
                  key={runId}
                  label="Import Verify Report"
                  button="Complete verification"
                  success="Immutable Verify Report created"
                  action={(data) => completeVerificationRunAction(slug, data)}
                >
                  <div>
                    <Label htmlFor="report-run">Active verification run</Label>
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
                    <Label htmlFor="verify-report">Verify Report JSON</Label>
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
                <p className="text-body text-ink-muted">
                  No active verification run is awaiting a report.
                </p>
              )}
            </Operation>
          </>
        ) : null}

        {canReview ? (
          <>
            <Operation
              title="Record governance sign-off"
              note="Approval and rejection are immutable human decisions; later decisions do not erase history."
            >
              {reviewableReports.length ? (
                <GovernedForm
                  label="Record governance sign-off"
                  button="Record sign-off"
                  success="Governance sign-off retained"
                  action={(data) => recordGovernanceSignoffAction(slug, data)}
                >
                  <Select
                    id="signoff-report"
                    name="verificationReportId"
                    label="Ready Verify Report"
                    options={reviewableReports}
                  />
                  <div className="grid gap-3 min-[540px]:grid-cols-2">
                    <div>
                      <Label htmlFor="signoff-type">Sign-off type</Label>
                      <select
                        id="signoff-type"
                        name="signoffType"
                        className={field}
                      >
                        <option value="VERIFICATION">Verification</option>
                        <option value="RELEASE">Release</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="signoff-decision">Decision</Label>
                      <select
                        id="signoff-decision"
                        name="decision"
                        className={field}
                      >
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signoff-rationale">Rationale</Label>
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
                <p className="text-body text-ink-muted">
                  No ready Verify Report is available.
                </p>
              )}
            </Operation>

            <Operation
              title="Move verified Mission to review"
              note="The kernel requires a ready report, independence when applicable, and no rejection."
            >
              {verifyingMissions.length ? (
                <GovernedForm
                  label="Move verified Mission to review"
                  button="Enter review"
                  success="Mission entered governance review"
                  action={(data) => moveMissionToReviewAction(slug, data)}
                >
                  <Select
                    id="review-mission"
                    name="missionId"
                    label="Verifying Mission"
                    options={verifyingMissions}
                  />
                  <div>
                    <Label htmlFor="review-reason">Reason</Label>
                    <textarea
                      id="review-reason"
                      name="reason"
                      rows={2}
                      required
                      defaultValue="Ready Verify Report and required sign-offs accepted."
                      className={area}
                    />
                  </div>
                </GovernedForm>
              ) : (
                <p className="text-body text-ink-muted">
                  No Mission is awaiting review transition.
                </p>
              )}
            </Operation>
          </>
        ) : null}

        {canRelease ? (
          <>
            <Operation
              title="Authorize governed release manifest"
              note="Select exact ClaimVersion IDs. Public release fails closed on state, provenance or evidence ceiling."
            >
              {reviewMissions.length && releaseReports.length ? (
                <GovernedForm
                  label="Authorize governed release"
                  button="Authorize manifest"
                  success="Immutable release manifest authorized"
                  action={(data) => authorizeGovernedReleaseAction(slug, data)}
                >
                  <div className="grid gap-3 min-[680px]:grid-cols-2">
                    <Select
                      id="release-mission"
                      name="missionId"
                      label="Mission in review"
                      options={reviewMissions}
                    />
                    <Select
                      id="release-report"
                      name="verificationReportId"
                      label="Release-ready report"
                      options={releaseReports}
                    />
                  </div>
                  <div>
                    <Label htmlFor="release-visibility">Visibility</Label>
                    <select
                      id="release-visibility"
                      name="visibility"
                      className={field}
                    >
                      <option value="INTERNAL">Internal</option>
                      <option value="PUBLIC">Public</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="release-claims">
                      Exact ClaimVersion IDs · one per line
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
                        Methods · one per line
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
                        Limitations · one per line
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
                  No Mission and report pair is ready for release authorization.
                </p>
              )}
            </Operation>

            <Operation
              title="Release approved Mission"
              note="Final lifecycle transition requires an immutable approved manifest and every required runtime gate passed."
            >
              {releasableMissions.length ? (
                <GovernedForm
                  label="Release approved Mission"
                  button="Release Mission"
                  success="Mission released"
                  action={(data) => releaseMissionAction(slug, data)}
                >
                  <Select
                    id="final-release-mission"
                    name="missionId"
                    label="Manifest-authorized Mission"
                    options={releasableMissions}
                  />
                  <div>
                    <Label htmlFor="release-reason">Release reason</Label>
                    <textarea
                      id="release-reason"
                      name="reason"
                      rows={2}
                      required
                      defaultValue="Approved immutable release manifest and required gates accepted."
                      className={area}
                    />
                  </div>
                </GovernedForm>
              ) : (
                <p className="text-body text-ink-muted">
                  No manifest-authorized Mission is ready.
                </p>
              )}
            </Operation>
          </>
        ) : null}
      </div>
    </section>
  );
}
