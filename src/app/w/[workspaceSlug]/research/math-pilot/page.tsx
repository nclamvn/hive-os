import { randomUUID } from "node:crypto";

import { ArrowLeft, ArrowRight, FlaskConical } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  assessMathPilotCaseAction,
  requestMathResearchCycleAction,
  requestMathPilotAgentReviewAction,
  reviewMathPilotResearchAction,
  requestMathPilotCaseAction,
} from "@/app/actions/research-sandbox";
import { ResearchLiveRefresh } from "@/components/research/research-live-refresh";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { getMathPilotCopy } from "@/i18n/math-pilot-copy";
import { getTranslator } from "@/i18n/server";
import { hasCapability } from "@/modules/identity-workspace";
import {
  calibratedCaseTypes,
  digestMathPilotContract,
  digestResearchResult,
  listMathPilotCases,
  listMathResearchCycles,
  listResearchTargets,
  MATH_PILOT_BENCHMARK,
  MATH_PILOT_CALIBRATIONS,
  MATH_REVIEW_CRITERIA,
  digestMathReviewChecklist,
  mathPilotContractSchema,
  mathReviewChecklistSchema,
  validateRecordedMathAgentReview,
} from "@/modules/research-sandbox";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getEnv } from "@/server/env";
import { researchProviderUsageSchema } from "@/modules/research-sandbox/contracts";
import { mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";
import { hasErdosStrausEquation, verifyErdosStrausWitness } from "@/modules/research-sandbox/math-certificates";
import { analyzeTwoGateResidualPrime } from "@/modules/research-sandbox/math-two-gate-structure";
import { validateIndependentReplayReport } from "@/modules/research-sandbox/math-independent-replay";
import { priorFiniteFindingFromTrace } from "@/modules/research-sandbox/math-cycle";
import { knownScopeForTask, mathPriorArtFor } from "@/modules/research-sandbox/math-prior-art";
import type { MathPilotContract } from "@/modules/research-sandbox/math-pilot";

export const dynamic = "force-dynamic";

const inputClass =
  "text-body text-ink border-line mt-1 min-h-11 w-full rounded-md border bg-surface px-3 py-2 outline-none transition-colors focus:border-line-strong";

export default async function MathPilotPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<{ missionId?: string; request?: string }>;
}) {
  const [{ workspaceSlug }, query] = await Promise.all([params, searchParams]);
  const data = await loadWorkspacePage(workspaceSlug);
  const { locale } = await getTranslator();
  const copy = getMathPilotCopy(locale);
  if (!hasCapability(data.ctx.membership.role, "research.read")) notFound();

  const targets = await listResearchTargets(data.ctx);
  const selectedMissionId = targets.missions.some((mission) => mission.id === query.missionId)
    ? query.missionId
    : targets.missions[0]?.id;
  const cases = selectedMissionId ? await listMathPilotCases(data.ctx, selectedMissionId) : [];
  const cycles = selectedMissionId ? await listMathResearchCycles(data.ctx, selectedMissionId) : [];
  const cyclesByCase = new Map<string, typeof cycles>();
  for (const cycle of cycles) {
    const history = cyclesByCase.get(cycle.rootCaseId) ?? [];
    history.push(cycle);
    cyclesByCase.set(cycle.rootCaseId, history);
  }
  const codexMode = getEnv().RESEARCH_CODEX_LOCAL_ENABLED;
  const pilotProvider = codexMode ? "codex-local" : "openai";
  const pilotModel = codexMode ? "gpt-6-sol" : "gpt-5.6-sol";
  const passed = calibratedCaseTypes(cases.map((item) => ({
    ...item,
    agentReviewValid: Boolean(validateRecordedMathAgentReview({
      contract: item.contract, contractDigest: item.contractDigest,
      attempt: item.researchRun.mathModelAttempt, attemptDigest: item.researchRun.mathModelAttemptDigest,
      researchDigest: item.researchIntegrityDigest, review: item.agentReview,
    })),
  })), pilotProvider, pilotModel);
  const canRequest = hasCapability(data.ctx.membership.role, "research.request");
  const canReview = hasCapability(data.ctx.membership.role, "research.review");
  const canInviteReviewer = hasCapability(data.ctx.membership.role, "members.invite");
  const queueEnabled = getEnv().MATH_PILOT_QUEUE_ENABLED;
  const hasActiveWork = cases.some((item) => ["QUEUED", "RUNNING"].includes(item.researchRun.status) ||
    ["PENDING", "READY", "RUNNING"].includes(item.agentReviewJobStatus ?? "")) ||
    cycles.some((cycle) => ["QUEUED", "RUNNING"].includes(cycle.status));

  return (
    <WorkspaceShell data={data} title={copy.title} subtitle={copy.subtitle}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-8">
        <Link
          href={`/w/${workspaceSlug}/research`}
          className="text-meta text-ink-muted hover:text-ink inline-flex min-h-10 items-center gap-2 self-start"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> {copy.back}
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-eyebrow text-ink-muted mb-2">MATH PILOT GATE</p>
            <h1 className="text-page-title text-ink-strong">{copy.title}</h1>
            <p className="text-body text-ink-muted mt-2 max-w-3xl">{copy.subtitle}</p>
          </div>
          <ResearchLiveRefresh
            active={hasActiveWork}
            activeLabel={locale === "vi" ? "Đang theo dõi" : "Live tracking"}
            idleLabel={locale === "vi" ? "Không có tác vụ đang chạy" : "No active work"}
            refreshLabel={locale === "vi" ? "Làm mới" : "Refresh"}
            updatedLabel={locale === "vi" ? "lúc" : "at"}
          />
        </div>

        {targets.missions.length ? (
          <form method="get" className="border-line bg-surface rounded-panel flex flex-wrap items-end gap-3 border p-4">
            <label className="text-meta text-ink min-w-0 flex-1 font-medium">
              {copy.mission}
              <select name="missionId" defaultValue={selectedMissionId} className={inputClass}>
                {targets.missions.map((mission) => (
                  <option key={mission.id} value={mission.id}>{mission.referenceCode} · {mission.title}</option>
                ))}
              </select>
            </label>
            <Button type="submit" variant="secondary">{copy.choose}</Button>
          </form>
        ) : (
          <Panel className="p-6"><p className="text-body text-ink">{copy.noMission}</p></Panel>
        )}

        {query.request === "failed" ? (
          <Panel className="border-danger-500 p-4" role="alert">
            <p className="text-body text-ink">
              {locale === "vi"
                ? "Không thể giao ca thử nghiệm. Kiểm tra hiệu chuẩn, quyền truy cập và cấu hình nhà cung cấp trước khi thử lại."
                : "Could not queue this case. Check calibration, access, and provider configuration before retrying."}
            </p>
          </Panel>
        ) : null}

        {selectedMissionId ? (
          <>
            <Panel className="p-4" role="status">
              <p className="text-body text-ink">{queueEnabled ? copy.dispatchReady : copy.dispatchLocked}</p>
              {codexMode ? <p className="text-meta text-ink-muted mt-2">{copy.codexMode}</p> : null}
            </Panel>
            <section aria-labelledby="math-calibration-title">
              <SectionHeader title={copy.calibration} id="math-calibration-title" />
              <p className="text-body text-ink-muted mt-2 max-w-3xl">{copy.calibrationHint}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {(["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE"] as const).map((caseType) => {
                  const contract = MATH_PILOT_CALIBRATIONS[caseType];
                  const isPassed = passed.has(caseType);
                  const hasActiveCase = cases.some((item) =>
                    item.caseType === caseType &&
                    item.researchRun.providerName === pilotProvider &&
                    item.researchRun.modelName === pilotModel &&
                    ["QUEUED", "RUNNING", "AWAITING_REVIEW"].includes(item.researchRun.status),
                  );
                  return (
                    <Panel key={caseType} className="flex min-w-0 flex-col p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-meta text-ink-muted font-semibold">
                          {caseType === "CALIBRATION_PROOF" ? copy.proofCase : copy.counterexampleCase}
                        </p>
                        <StatusBadge tone={isPassed ? "success" : "warning"}>
                          {isPassed ? copy.passed : copy.pending}
                        </StatusBadge>
                      </div>
                      <p className="text-section-title text-ink-strong mt-4 flex-1">{contract.statement}</p>
                      {canRequest ? (
                        <form action={requestMathPilotCaseAction} className="mt-5">
                          <input type="hidden" name="slug" value={workspaceSlug} />
                          <input type="hidden" name="missionId" value={selectedMissionId} />
                          <input type="hidden" name="caseType" value={caseType} />
                          <input type="hidden" name="idempotencyKey" value={`math-pilot:${randomUUID()}`} />
                          <Button type="submit" variant="secondary" disabled={isPassed || hasActiveCase || !queueEnabled}>
                            {copy.queueCase} <ArrowRight className="size-4" aria-hidden="true" />
                          </Button>
                        </form>
                      ) : null}
                    </Panel>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="math-benchmark-title">
              <Panel className="p-5 sm:p-6">
                <SectionHeader title={copy.benchmarkTitle} id="math-benchmark-title" />
                <p className="text-body text-ink-muted mt-2 max-w-3xl">
                  {passed.size === 2 ? copy.benchmarkHint : copy.benchmarkLocked}
                </p>
                <p className="text-section-title text-ink-strong mt-4 max-w-3xl">{MATH_PILOT_BENCHMARK.statement}</p>
                {canRequest ? (
                  <form action={requestMathPilotCaseAction} className="mt-5">
                    <input type="hidden" name="slug" value={workspaceSlug} />
                    <input type="hidden" name="missionId" value={selectedMissionId} />
                    <input type="hidden" name="caseType" value="BENCHMARK_PROOF" />
                    <input type="hidden" name="idempotencyKey" value={`math-pilot:${randomUUID()}`} />
                    <Button type="submit" variant="secondary" disabled={passed.size !== 2 || !queueEnabled || cases.some((item) =>
                      item.caseType === "BENCHMARK_PROOF" &&
                      item.researchRun.providerName === pilotProvider &&
                      item.researchRun.modelName === pilotModel &&
                      (["QUEUED", "RUNNING"].includes(item.researchRun.status) ||
                        (item.researchRun.status === "AWAITING_REVIEW" && !item.agentReview)),
                    )}>
                      {copy.benchmarkRun} <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                  </form>
                ) : null}
              </Panel>
            </section>

            <section aria-labelledby="math-open-title">
              <Panel className="overflow-hidden">
                <div className="border-line border-b p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <FlaskConical className="text-ink-muted size-5" aria-hidden="true" />
                    <SectionHeader title={copy.openTitle} id="math-open-title" />
                  </div>
                  <p className="text-body text-ink-muted mt-2">{passed.size === 2 ? copy.openHint : copy.openLocked}</p>
                </div>
                {passed.size === 2 && canRequest && queueEnabled ? (
                  <form action={requestMathPilotCaseAction} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    <input type="hidden" name="slug" value={workspaceSlug} />
                    <input type="hidden" name="missionId" value={selectedMissionId} />
                    <input type="hidden" name="caseType" value="OPEN" />
                    <input type="hidden" name="idempotencyKey" value={`math-pilot:${randomUUID()}`} />
                    {([
                      ["statement", copy.statement, 4000],
                      ["definitions", copy.definitions, 1000],
                      ["assumptions", copy.assumptions, 1000],
                      ["falsificationCriterion", copy.falsificationCriterion, 1000],
                      ["successCriterion", copy.successCriterion, 1000],
                      ["exclusions", copy.exclusions, 1000],
                    ] as const).map(([name, label, maxLength]) => (
                      <label key={name} className={`text-meta text-ink font-medium ${name === "statement" ? "sm:col-span-2" : ""}`}>
                        {label}
                        <textarea name={name} rows={name === "statement" ? 3 : 2} required maxLength={maxLength} className={inputClass} />
                      </label>
                    ))}
                    <div className="sm:col-span-2">
                      <Button type="submit">{copy.startOpen} <ArrowRight className="size-4" aria-hidden="true" /></Button>
                    </div>
                  </form>
                ) : null}
              </Panel>
            </section>

            <section aria-labelledby="math-history-title">
              <SectionHeader title={copy.history} id="math-history-title" />
              <div className="mt-4 space-y-4">
                {cases.length ? cases.map((item) => {
                  const parsed = mathPilotContractSchema.safeParse(item.contract);
                  const contractValid = parsed.success && digestMathPilotContract(parsed.data) === item.contractDigest;
                  const usage = researchProviderUsageSchema.safeParse(item.researchRun.providerUsage);
                  const parsedAttempt = mathModelAttemptSchema.safeParse(item.researchRun.mathModelAttempt);
                  const attempt = parsedAttempt.success && digestResearchResult(parsedAttempt.data) === item.researchRun.mathModelAttemptDigest
                    ? parsedAttempt
                    : { success: false as const };
                  const attemptPriorArt = parsed.success && attempt.success
                    ? knownScopeForTask(parsed.data, attempt.data.argument)
                    : null;
                  const independentReviewer = canReview && item.researchRun.requestedByMembershipId !== data.ctx.membership.id;
                  const attemptValid = item.researchRun.providerName !== "codex-local" || attempt.success;
                  const providerValid = item.researchRun.providerName !== "openai" || usage.success;
                  const checklist = item.assessment ? mathReviewChecklistSchema.safeParse(item.assessment.reviewChecklist) : null;
                  const checklistValid = checklist?.success && digestMathReviewChecklist(checklist.data) === item.assessment?.reviewChecklistDigest;
                  const agentLedger = validateRecordedMathAgentReview({
                    contract: item.contract, contractDigest: item.contractDigest,
                    attempt: item.researchRun.mathModelAttempt, attemptDigest: item.researchRun.mathModelAttemptDigest,
                    researchDigest: item.researchIntegrityDigest, review: item.agentReview,
                  });
                  return (
                    <Panel key={item.id} className="min-w-0 overflow-hidden p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-eyebrow text-ink-muted">{item.caseType === "BENCHMARK_PROOF" ? copy.benchmarkTitle : item.caseType.replaceAll("_", " ")}</p>
                          <h3 className="text-section-title text-ink-strong mt-2 break-words">{item.researchRun.question}</h3>
                        </div>
                        <StatusBadge tone={item.researchRun.status === "APPROVED" ? "success" : item.researchRun.status === "FAILED" || item.researchRun.status === "REJECTED" ? "danger" : "warning"}>
                          {item.researchRun.status}
                        </StatusBadge>
                      </div>
                      <p className="text-meta text-ink-muted mt-3 break-all">{copy.contract}: {contractValid ? item.contractDigest : "INTEGRITY FAILURE"}</p>
                      <div className="border-line mt-3 border-t pt-3">
                        <p className="text-meta text-ink-muted font-semibold">{copy.providerUsage}</p>
                        <p className="text-meta text-ink-muted mt-1">
                          {attempt.success
                            ? `${copy.subscriptionTokens}: ${attempt.data.usage.inputTokens.toLocaleString(locale)} / ${attempt.data.usage.outputTokens.toLocaleString(locale)}`
                            : usage.success
                            ? `${copy.usageTokens}: ${usage.data.inputTokens.toLocaleString(locale)} / ${usage.data.outputTokens.toLocaleString(locale)} · ${copy.usageSearches}: ${usage.data.webSearchCalls}`
                            : copy.usageUnverified}
                        </p>
                        {usage.success ? <p className="text-meta text-ink-muted mt-1 break-all">{usage.data.modelName} · {usage.data.responseId}</p> : null}
                      </div>
                      {attempt.success && item.researchRun.mathModelAttemptDigest ? (
                        <div className="border-line mt-4 border-t pt-4">
                          <p className="text-meta text-ink-muted font-semibold">{copy.modelAttempt} · {attempt.data.attemptType.replaceAll("_", " ")}</p>
                          {attemptPriorArt ? <p role="alert" className="text-meta text-danger-700 mt-2">
                            {copy.modelAttemptPriorArt} <a className="underline underline-offset-2" href={attemptPriorArt.sourceUrl} target="_blank" rel="noreferrer">{attemptPriorArt.sourceTitle}</a>
                          </p> : null}
                          <p className="text-body text-ink mt-3 whitespace-pre-wrap break-words">{attempt.data.argument}</p>
                          {attempt.data.candidateCounterexample ? <p className="text-body text-ink mt-3 break-words">{copy.attemptCounterexample}: {attempt.data.candidateCounterexample}</p> : null}
                          {attempt.data.selfChecks.length ? <p className="text-meta text-ink-muted mt-3 whitespace-pre-wrap">{copy.attemptChecks}: {attempt.data.selfChecks.join(" · ")}</p> : null}
                          {attempt.data.limitations.length ? <p className="text-meta text-ink-muted mt-2 whitespace-pre-wrap">{copy.attemptLimits}: {attempt.data.limitations.join(" · ")}</p> : null}
                          {parsed.success && hasErdosStrausEquation(parsed.data) && attempt.data.erdosStrausWitnesses?.length ? (
                            <div className="border-line mt-3 border-l-2 pl-3">
                              <p className="text-meta text-ink font-semibold">{copy.exactWitness}</p>
                              <ul className="text-meta mt-2 space-y-2">{attempt.data.erdosStrausWitnesses.map((witness, index) => {
                                const certificate = verifyErdosStrausWitness(witness);
                                return <li key={index} className="break-all">
                                  <span className={certificate.valid ? "text-success-700" : "text-danger-700"}>{certificate.classification}</span>
                                  {` · (n,x,y,z)=(${witness.n}, ${witness.x}, ${witness.y}, ${witness.z}) · ${certificate.reason}`}
                                  {certificate.identityDigest ? <span className="block">SHA-256: {certificate.identityDigest}</span> : null}
                                </li>;
                              })}</ul>
                              <p className="text-meta text-ink-muted mt-2">{copy.exactWitnessLimit}</p>
                            </div>
                          ) : null}
                          <p className="text-meta text-ink-muted mt-3 break-all">SHA-256: {item.researchRun.mathModelAttemptDigest}</p>
                        </div>
                      ) : null}
                      <div className="border-line mt-5 border-t pt-5">
                        <h4 className="text-section-title text-ink-strong">{copy.reviewDesk}</h4>
                        <p className="text-meta text-ink-muted mt-1">{copy.reviewPrinciple}</p>
                        <div className="mt-4 grid gap-5">
                          <section className="border-line border-l-2 pl-4" aria-label={copy.stageProtocol}>
                            <h5 className="text-meta text-ink font-semibold">{copy.stageProtocol}</h5>
                            <p className={`text-meta mt-2 font-medium ${contractValid ? "text-success-700" : "text-danger-700"}`}>
                              {contractValid ? copy.integrityGood : copy.integrityBad}
                            </p>
                            {parsed.success ? (
                              <dl className="text-meta text-ink-muted mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                                {([
                                  [copy.definitions, parsed.data.definitions],
                                  [copy.assumptions, parsed.data.assumptions],
                                  [copy.falsificationCriterion, parsed.data.falsificationCriterion],
                                  [copy.successCriterion, parsed.data.successCriterion],
                                  [copy.exclusions, parsed.data.exclusions],
                                ] as const).map(([label, value]) => (
                                  <div key={label} className="min-w-0"><dt className="text-ink font-medium">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words">{value}</dd></div>
                                ))}
                              </dl>
                            ) : null}
                          </section>

                          <section className="border-line border-l-2 pl-4" aria-label={copy.stageEvidence}>
                            <h5 className="text-meta text-ink font-semibold">{copy.stageEvidence}</h5>
                            {!attemptValid ? <p role="alert" className="text-meta text-danger-700 mt-2">{copy.attemptIntegrityBad}</p> : null}
                            {item.researchRun.status === "APPROVED" && !item.approvedIntegrityValid ? <p role="alert" className="text-meta text-danger-700 mt-2">{copy.researchIntegrityBad}</p> : null}
                            {item.researchRun.sources.length ? (
                              <ul className="text-meta text-ink-muted mt-2 space-y-1">
                                {item.researchRun.sources.map((source) => <li key={source.canonicalUri} className="break-all">{copy.sourceLabel}: {source.canonicalUri}</li>)}
                              </ul>
                            ) : <p className="text-meta text-ink-muted mt-2">{copy.noExternalSource}</p>}
                            {item.researchRun.status === "AWAITING_REVIEW" && independentReviewer && contractValid && attemptValid && providerValid ? (
                              <form action={reviewMathPilotResearchAction} className="mt-3 grid gap-4">
                                <input type="hidden" name="slug" value={workspaceSlug} />
                                <input type="hidden" name="runId" value={item.researchRun.id} />
                                {item.researchRun.findings.map((finding) => (
                                  <fieldset key={finding.id} className="border-line min-w-0 border-t pt-3">
                                    <input type="hidden" name="findingId" value={finding.id} />
                                    <legend className="text-meta text-ink font-medium">{copy.findingLabel} · {finding.kind}</legend>
                                    <p className="text-body text-ink mt-2 break-words">{finding.claim}</p>
                                    {finding.exactExcerpt ? <blockquote className="text-meta text-ink-muted border-line mt-2 border-l-2 pl-3">{finding.exactExcerpt}</blockquote> : null}
                                    <label className="text-meta text-ink mt-3 block font-medium">{copy.findingDecision}
                                      <select name={`decision:${finding.id}`} required defaultValue="" className={inputClass}>
                                        <option value="" disabled>{copy.chooseDecision}</option>
                                        <option value="ACCEPTED">{copy.acceptFinding}</option>
                                        <option value="REJECTED">{copy.rejectFinding}</option>
                                        <option value="FLAGGED">{copy.flagFinding}</option>
                                      </select>
                                    </label>
                                    <label className="text-meta text-ink mt-3 block font-medium">{copy.findingRationale}
                                      <textarea name={`rationale:${finding.id}`} required rows={2} maxLength={4000} className={inputClass} />
                                    </label>
                                  </fieldset>
                                ))}
                                <label className="text-meta text-ink font-medium">{copy.researchRationale}
                                  <textarea name="runRationale" required rows={2} maxLength={4000} className={inputClass} />
                                </label>
                                <p className="text-meta text-ink-muted">{copy.approveRule}</p>
                                <div className="flex flex-wrap gap-2">
                                  <Button type="submit" name="runDecision" value="APPROVED">{copy.approveResearch}</Button>
                                  <Button type="submit" name="runDecision" value="REJECTED" variant="secondary">{copy.rejectResearch}</Button>
                                </div>
                              </form>
                            ) : (
                              <p className="text-meta text-ink-muted mt-2">
                                {item.researchRun.status === "APPROVED" ? copy.researchApproved
                                  : item.researchRun.status === "REJECTED" ? copy.researchRejected
                                  : item.researchRun.status === "FAILED" ? copy.runFailed
                                  : ["QUEUED", "RUNNING"].includes(item.researchRun.status) ? copy.runInProgress
                                  : !independentReviewer && item.researchRun.status === "AWAITING_REVIEW" && !codexMode ? copy.reviewerNeeded
                                  : codexMode && item.researchRun.status === "AWAITING_REVIEW" ? copy.agentSourcePending
                                  : copy.waitingResearch}
                              </p>
                            )}
                            {item.researchRun.status === "AWAITING_REVIEW" && !independentReviewer && canInviteReviewer && !codexMode ? (
                              <Link href={`/w/${workspaceSlug}/settings/members`} className="text-meta text-ink mt-2 inline-flex min-h-10 items-center gap-1 font-medium">
                                {copy.reviewerLink} <ArrowRight className="size-4" aria-hidden="true" />
                              </Link>
                            ) : null}
                            {item.researchRun.reviewRationale ? <p className="text-meta text-ink-muted mt-2 whitespace-pre-wrap">{item.researchRun.reviewRationale}</p> : null}
                            {["APPROVED", "REJECTED"].includes(item.researchRun.status) ? (
                              <dl className="border-line mt-3 grid gap-3 border-t pt-3">
                                {item.researchRun.findings.map((finding) => (
                                  <div key={finding.id} className="min-w-0">
                                    <dt className="text-meta text-ink font-medium break-words">{finding.claim}</dt>
                                    <dd className="text-meta text-ink-muted mt-1 break-words">
                                      {finding.decision ? copy.findingOutcome[finding.decision.decision] : copy.chooseDecision}
                                      {finding.decision?.rationale ? ` · ${finding.decision.rationale}` : ""}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                            ) : null}
                          </section>

                          <section className="border-line border-l-2 pl-4" aria-label={copy.stageMath}>
                            <h5 className="text-meta text-ink font-semibold">{copy.stageMath}</h5>
                            {codexMode && attempt.success && contractValid && ["AWAITING_REVIEW", "APPROVED"].includes(item.researchRun.status) ? (
                              <div className="border-line bg-surface-subtle mt-3 rounded-md border p-4">
                                <p className="text-body text-ink font-semibold">{copy.agentReviewTitle}</p>
                                <p className="text-meta text-ink-muted mt-1">{copy.agentReviewHint}</p>
                                {item.agentReview ? agentLedger ? (
                                  <div className="mt-3">
                                    <StatusBadge tone={agentLedger.disposition === "AI_REVIEWED" ? "success" : "warning"}>
                                      {agentLedger.disposition === "AI_REVIEWED" ? copy.agentReviewReviewed : copy.agentReviewInconclusive}
                                    </StatusBadge>
                                    <p className="text-meta text-ink-muted mt-2">{copy.conclusion[agentLedger.conclusion]}</p>
                                    <div className="border-line mt-3 grid gap-3 border-t pt-3">
                                      {agentLedger.reports.map((report) => (
                                        <div key={report.role} className="min-w-0">
                                          <p className="text-meta text-ink font-semibold">{copy.agentRole[report.role]} · {report.verdict}</p>
                                          <p className="text-meta text-ink-muted mt-1 whitespace-pre-wrap break-words">{report.reasoning}</p>
                                          {report.unresolvedGap ? <p className="text-meta text-danger-700 mt-1 whitespace-pre-wrap break-words">{report.unresolvedGap}</p> : null}
                                        </div>
                                      ))}
                                    </div>
                                    <p className="text-meta text-ink-muted mt-3">{agentLedger.oracle.note}</p>
                                    <p className="text-meta text-ink-muted mt-2 break-all">SHA-256: {item.agentReview.ledgerDigest}</p>
                                    <p className="text-meta text-ink-muted mt-2">{copy.agentReviewCaution}</p>
                                  </div>
                                ) : <p role="alert" className="text-meta text-danger-700 mt-2">{copy.agentReviewIntegrityBad}</p>
                                : item.agentReviewJobStatus === "DEAD_LETTER" ? <p role="alert" className="text-meta text-danger-700 mt-2">{copy.agentReviewFailed}</p>
                                : ["PENDING", "READY", "RUNNING"].includes(item.agentReviewJobStatus ?? "") ? <p className="text-meta text-ink-muted mt-2">{copy.agentReviewQueued}</p>
                                : canRequest ? (
                                  <form action={requestMathPilotAgentReviewAction} className="mt-3">
                                    <input type="hidden" name="slug" value={workspaceSlug} />
                                    <input type="hidden" name="caseId" value={item.id} />
                                    <Button type="submit" variant="secondary">{copy.agentReviewStart}</Button>
                                  </form>
                                ) : null}
                              </div>
                            ) : null}
                            {codexMode && item.caseType === "OPEN" && agentLedger && contractValid && attempt.success ? (
                              <MathCycleDesk
                                cycle={cyclesByCase.get(item.id)?.[0]}
                                history={cyclesByCase.get(item.id)?.slice(1) ?? []}
                                locale={locale}
                                canRequest={canRequest && queueEnabled}
                                slug={workspaceSlug}
                                caseId={item.id}
                                rootContract={parsed.success ? parsed.data : null}
                                gaps={agentLedger.reports.map((report) => report.unresolvedGap).filter((gap): gap is string => Boolean(gap))}
                              />
                            ) : null}
                            {item.assessment ? (
                              <div className="mt-3">
                                <StatusBadge tone="info">{copy.conclusion[item.assessment.conclusion]}</StatusBadge>
                                <p className="text-body text-ink mt-3">{item.assessment.rationale}</p>
                                <p className="text-meta text-ink-muted mt-2 whitespace-pre-wrap">{item.assessment.verificationNotes}</p>
                                {checklistValid && checklist?.success ? (
                                  <div className="border-line mt-4 border-t pt-3">
                                    <p className="text-meta text-ink font-semibold">{copy.recordedChecklist}</p>
                                    <dl className="mt-3 grid gap-3">
                                      {checklist.data.checks.map((check) => (
                                        <div key={check.criterion} className="min-w-0">
                                          <dt className="text-meta text-ink font-medium">{copy.reviewCriteria[check.criterion]} · {copy.verdict[check.verdict]}</dt>
                                          <dd className="text-meta text-ink-muted mt-1 whitespace-pre-wrap break-words">{check.note}</dd>
                                        </div>
                                      ))}
                                    </dl>
                                    <p className="text-meta text-ink-muted mt-3 break-all">{copy.reviewDigest}: {item.assessment.reviewChecklistDigest}</p>
                                  </div>
                                ) : <p className="text-meta text-ink-muted mt-3">{item.assessment.reviewChecklist ? copy.integrityBad : copy.legacyChecklist}</p>}
                                <p className="text-meta text-ink-muted mt-3">{copy.positiveCaution}</p>
                              </div>
                            ) : independentReviewer && contractValid && item.approvedIntegrityValid && item.researchRun.status === "APPROVED" && providerValid && attemptValid ? (
                              <form action={assessMathPilotCaseAction} className="mt-3 grid gap-4">
                                <input type="hidden" name="slug" value={workspaceSlug} />
                                <input type="hidden" name="caseId" value={item.id} />
                                <p className="text-meta text-ink-muted">{copy.reviewChecklistHint}</p>
                                <p className="text-meta text-ink-muted border-line border-l-2 pl-3">{copy.reviewGuide[item.caseType]}</p>
                                {MATH_REVIEW_CRITERIA.map((criterion) => (
                                  <fieldset key={criterion} className="border-line min-w-0 border-t pt-3">
                                    <legend className="text-meta text-ink font-semibold">{copy.reviewCriteria[criterion]}</legend>
                                    <select name={`verdict:${criterion}`} required defaultValue="" aria-label={`${copy.reviewCriteria[criterion]} — ${copy.chooseVerdict}`} className={inputClass}>
                                      <option value="" disabled>{copy.chooseVerdict}</option>
                                      {Object.entries(copy.verdict).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                    </select>
                                    <label className="text-meta text-ink mt-2 block font-medium">{copy.checkNote}
                                      <textarea name={`note:${criterion}`} required rows={2} minLength={12} maxLength={1000} className={inputClass} />
                                    </label>
                                  </fieldset>
                                ))}
                                <label className="text-meta text-ink font-medium">{copy.assessment}
                                  <select name="conclusion" required className={inputClass} defaultValue="INCONCLUSIVE">
                                    {Object.entries(copy.conclusion).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                  </select>
                                </label>
                                <label className="text-meta text-ink font-medium">{copy.rationale}
                                  <textarea name="rationale" required rows={2} maxLength={4000} className={inputClass} />
                                </label>
                                <label className="text-meta text-ink font-medium">{copy.notes}
                                  <textarea name="verificationNotes" required rows={3} maxLength={8000} className={inputClass} />
                                </label>
                                <label className="text-meta text-ink flex items-start gap-2 font-medium">
                                  <input type="checkbox" name="independentVerification" required className="mt-1 size-4" />
                                  <span>{copy.humanAttestation}</span>
                                </label>
                                <p className="text-meta text-ink-muted">{copy.positiveCaution}</p>
                                <Button type="submit" className="justify-self-start">{copy.submitAssessment}</Button>
                              </form>
                            ) : <p className="text-meta text-ink-muted mt-2">{
                              item.researchRun.providerName === "openai" && item.researchRun.status === "APPROVED" && !usage.success
                                ? copy.assessmentBlockedUsage
                                : codexMode && item.researchRun.status === "AWAITING_REVIEW" ? copy.agentMathPending
                                : item.researchRun.status === "APPROVED" && !independentReviewer ? copy.reviewerNeeded : copy.waitingMath
                            }</p>}
                          </section>
                        </div>
                      </div>
                      <Link href={`/w/${workspaceSlug}/research#research-runs`} className="text-meta text-ink mt-4 inline-flex min-h-10 items-center gap-2 font-medium">
                        {copy.research} <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Panel>
                  );
                }) : <Panel className="p-6"><p className="text-body text-ink-muted">{copy.empty}</p></Panel>}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </WorkspaceShell>
  );
}

function MathCycleDesk({ cycle, history, locale, canRequest, slug, caseId, rootContract, gaps }: {
  cycle: Awaited<ReturnType<typeof listMathResearchCycles>>[number] | undefined;
  history: Awaited<ReturnType<typeof listMathResearchCycles>>;
  locale: "vi" | "en"; canRequest: boolean; slug: string; caseId: string; rootContract: MathPilotContract | null; gaps: string[];
}) {
  const vi = locale === "vi";
  const label = vi ? {
    title: "Vòng lặp nghiên cứu có kiểm soát", subtitle: "AI tạo nhiệm vụ từ khoảng trống phản biện; một phiên độc lập kiểm tra trước khi thử nghiệm. Không phải chứng nhận định lý.",
    start: "Khởi động vòng lặp", rounds: "Số vòng tối đa", tokens: "Ngưỡng token quan sát", limit: "Giới hạn",
    calls: "lượt gọi đã bắt đầu", used: "token đã ghi nhận", time: "Hạn dừng", status: "Trạng thái",
    integrity: "Nhật ký không vượt qua kiểm tra toàn vẹn", noGap: "Phản biện chưa ghi khoảng trống cụ thể để tạo nhiệm vụ.",
    round: "Vòng", hypothesis: "Giả thuyết", task: "Nhiệm vụ", sourceGap: "Khoảng trống gốc",
    verification: "Kiểm tra độc lập", attempt: "Thử nghiệm", computation: "Khảo sát chính xác có giới hạn", testedPrimes: "số nguyên tố đã kiểm", outsideBound: "trường hợp chưa có nghiệm trong giới hạn", computationDetails: "Chi tiết phép tính và dấu băm", finiteOnly: "Chỉ kết luận trong khoảng và họ mẫu số đã ghi, không phải chứng minh tổng quát.", exactWitness: "Chứng chỉ nghiệm hữu hạn", noWitness: "Mô hình không xuất bộ nghiệm có cấu trúc để kiểm tra.", review: "Phản biện", pending: "Chưa có kết quả vòng này", exclusionAudit: "Kiểm toán loại trừ từng A", factorPairs: "cặp ước đã xét", admissiblePairs: "cặp hợp lệ", primeTrial: "Thử chia nguyên tố đến", auditScope: "Kiểm toán số học thứ hai, tự tính lại khi đọc; không phải chứng nhận định lý hay phản biện học thuật.", independentReplay: "Công cụ phát lại Python độc lập", replayMissing: "Vòng cũ chưa có bước phát lại độc lập.", replayLimit: "Đã đối chiếu số đếm và từng hàng loại trừ trong miền hữu hạn; chưa xác nhận mệnh đề tổng quát hoặc tính mới.",
    stopped: "Lý do dừng", ledger: "Dấu băm cuối của nhật ký", scope: "Giới hạn phạm vi", novelty: "Không trùng nhiệm vụ", falsifiability: "Khả năng bác bỏ",
    caution: "Token được ghi sau từng lượt; ngưỡng token và thời hạn được kiểm trước lượt kế tiếp, không ngắt một lượt đang chạy. Số lượt và giới hạn 4 phút/lượt là trần cứng. Các phiên cùng họ mô hình, không thay thế phản biện học thuật độc lập.",
    priorArt: "Kết quả đã biết có nguồn", priorArtWarning: "Nhiệm vụ này trùng một phép dựng đã có nguồn; phần trùng không được tính là khám phá mới.",
    unknownNovelty: "Danh mục nguồn hiện chưa bao phủ toàn bộ tài liệu. Tính mới ngoài danh mục vẫn chưa được xác minh.",
    retrospective: "Đối chiếu hồi cứu bằng danh mục hiện tại; nhật ký vòng cũ không được viết lại.",
    frontier: "Hồ sơ biên giới tri thức", frontierGate: "Cổng nguồn và phạm vi",
    frontierMissing: "Vòng cũ chưa có hồ sơ nguồn TIP-032; không thể suy ra tính mới từ vòng này.",
    frontierCoverage: "Nguồn chỉ bao phủ một phần; kết quả tìm kiếm không chứng minh tính mới.",
    sourceAssessment: "Phản biện nguồn", discovery: "Tìm tài liệu", captured: "Đoạn trích lưu giữ",
    externalDiscovery: "Tên và phát biểu toán học sẽ được gửi đến Crossref để tìm tài liệu. Không dùng vòng này cho bài toán mật.",
  } : {
    title: "Controlled research loop", subtitle: "AI turns review gaps into tasks; a separate context verifies each task before execution. This is not theorem certification.",
    start: "Start research loop", rounds: "Maximum rounds", tokens: "Observed token threshold", limit: "Limits",
    calls: "calls started", used: "tokens observed", time: "Deadline", status: "Status",
    integrity: "The event ledger failed integrity validation", noGap: "The review has no explicit gap from which to generate a task.",
    round: "Round", hypothesis: "Hypothesis", task: "Task", sourceGap: "Source review gap",
    verification: "Independent-context check", attempt: "Attempt", computation: "Bounded exact survey", testedPrimes: "primes checked", outsideBound: "cases without a witness within", computationDetails: "Computation details and digest", finiteOnly: "Only the recorded interval and denominator family are covered; this is not a universal proof.", exactWitness: "Finite witness certificate", noWitness: "The model supplied no structured tuple to check.", review: "Peer review", pending: "No round output yet", exclusionAudit: "Per-A exclusion audit", factorPairs: "factor pairs checked", admissiblePairs: "admissible pairs", primeTrial: "Primality trial division through", auditScope: "A second arithmetic audit, recomputed on read; not theorem certification or academic peer review.", independentReplay: "Independent Python tool replay", replayMissing: "This older round has no independent tool replay.", replayLimit: "Counts and per-A exclusions were compared within the finite scope; no universal theorem or novelty is certified.",
    stopped: "Stop reason", ledger: "Final ledger digest", scope: "Scope fidelity", novelty: "AI prior-task check", falsifiability: "Falsifiability",
    caution: "Tokens are recorded after each call; token threshold and deadline are checked before the next call, not mid-call. Call count and the four-minute per-call timeout are hard bounds. Separate sessions of one model family do not replace an independent academic referee.",
    priorArt: "Sourced known results", priorArtWarning: "This task overlaps a sourced known construction; that overlap is not a new discovery.",
    unknownNovelty: "The source catalog is not a complete literature review. Novelty beyond it remains unverified.",
    retrospective: "Retrospective check against the current catalog; the historical ledger is unchanged.",
    frontier: "Knowledge-frontier dossier", frontierGate: "Source and scope gate",
    frontierMissing: "This older round has no TIP-032 source dossier; novelty cannot be inferred from it.",
    frontierCoverage: "Source coverage is partial; search results do not establish novelty.",
    sourceAssessment: "Source assessment", discovery: "Literature discovery", captured: "Retained passage",
    externalDiscovery: "The mathematical statement is sent to Crossref for literature discovery. Do not use this loop for confidential problems.",
  };
  const priorArt = rootContract ? mathPriorArtFor(rootContract) : [];
  const retrospective = Boolean(cycle && cycle.trace && !cycle.trace.some((event) => event.phase === "PRIOR_ART"));
  const rounds = cycle?.trace ? [...new Set(cycle.trace.map((event) => event.round).filter((round) => round > 0))] : [];
  const guided = cycle?.trace?.find((event) => event.phase === "HUMAN_STEERED");
  const seededReplay = cycle?.trace?.find((event) => event.phase === "PRIOR_COUNTEREXAMPLE_REPLAY");
  const gateDossier = cycle?.trace?.find((event) => event.phase === "PRIOR_GATE_DOSSIER");
  const priorFindingEvent = cycle?.trace?.find((event) => event.phase === "PRIOR_FINDINGS");
  const historicalFindings = history.flatMap((previous) => {
    if (!previous.trace) return [];
    const finding = priorFiniteFindingFromTrace({ cycleId: previous.id,
      sourceLedgerDigest: previous.events.at(-1)?.digest ?? "", trace: previous.trace });
    return finding ? [finding] : [];
  }).slice(0, 8);
  const visibleFindings = priorFindingEvent?.phase === "PRIOR_FINDINGS"
    ? priorFindingEvent.findings : historicalFindings;
  return (
    <section className="border-line bg-surface-subtle mt-5 min-w-0 rounded-md border p-4 sm:p-5" aria-label={label.title}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h5 className="text-section-title text-ink-strong">{label.title}</h5>
          <p className="text-meta text-ink-muted mt-1 max-w-2xl">{label.subtitle}</p>
        </div>
        {cycle ? <StatusBadge tone={cycle.status === "STOPPED" ? "neutral" : cycle.status === "FAILED" ? "danger" : "warning"}>
          {cycle.status}
        </StatusBadge> : null}
      </div>
      <div className="border-line text-meta text-ink-muted mt-4 border-t pt-3">
        <p className="text-ink font-medium">{label.priorArt}</p>
        {priorArt.length ? <ul className="mt-2 space-y-1">
          {priorArt.map((fact) => <li key={fact.id}>{fact.claim} <a className="underline underline-offset-2" href={fact.sourceUrl} target="_blank" rel="noreferrer">{fact.sourceTitle}</a>
            <span className="block">{fact.sourceScope} · {fact.scopeLift}</span>
          </li>)}
        </ul> : null}
        <p className="mt-2">{label.unknownNovelty}</p>
        {retrospective ? <p className="mt-2">{label.retrospective}</p> : null}
      </div>
      {!cycle ? gaps.length && canRequest ? rootContract && hasErdosStrausEquation(rootContract) ? (
        <MathCycleSteeringForm slug={slug} caseId={caseId} locale={locale} />
      ) : (
        <form action={requestMathResearchCycleAction} className="border-line mt-4 flex flex-wrap items-end gap-3 border-t pt-4">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="caseId" value={caseId} />
          <label className="text-meta text-ink min-w-36 flex-1 font-medium">{label.rounds}
            <select name="maxRounds" defaultValue="2" className={inputClass}>
              <option value="1">1</option><option value="2">2</option>
            </select>
          </label>
          <label className="text-meta text-ink min-w-40 flex-1 font-medium">{label.tokens}
            <select name="maxObservedTokens" defaultValue="60000" className={inputClass}>
              <option value="20000">20,000</option><option value="60000">60,000</option><option value="120000">120,000</option><option value="200000">200,000</option>
            </select>
          </label>
          <Button type="submit" className="self-end">{label.start}</Button>
          <p className="text-meta text-ink-muted w-full">{label.externalDiscovery}</p>
        </form>
      ) : <p className="text-meta text-ink-muted mt-3">{label.noGap}</p> : (
        <>
          <dl className="border-line text-meta mt-4 grid gap-3 border-y py-3 sm:grid-cols-3">
            <div><dt className="text-ink-muted">{label.limit}</dt><dd className="text-ink font-medium">{cycle.completedRounds}/{cycle.maxRounds} {label.rounds.toLowerCase()} · {cycle.callsStarted}/{cycle.maxCalls} {label.calls}</dd></div>
            <div><dt className="text-ink-muted">{label.tokens}</dt><dd className="text-ink font-medium">{cycle.observedTokens.toLocaleString(locale)} / {cycle.maxObservedTokens.toLocaleString(locale)} {label.used}</dd></div>
            <div><dt className="text-ink-muted">{label.time}</dt><dd className="text-ink font-medium">{cycle.deadlineAt.toLocaleString(locale)}</dd></div>
          </dl>
          {guided ? <div className="border-line text-meta text-ink-muted mt-3 rounded-md border p-3">
              <p className="text-ink font-medium">{vi ? "Chỉ thị người dùng đã xác nhận" : "Human-confirmed research directive"}</p>
              <p className="mt-1">{guided.steering.focus} · A={guided.steering.targetA}</p>
              {guided.steering.note ? <p className="mt-1 whitespace-pre-wrap break-words">{guided.steering.note}</p> : null}
              <p className="mt-1 break-all">SHA-256: {guided.steeringDigest}</p>
            </div> : null}
          {seededReplay?.phase === "PRIOR_COUNTEREXAMPLE_REPLAY" ? <details className="border-line text-meta text-ink-muted mt-3 rounded-md border p-3">
              <summary className="text-ink cursor-pointer font-medium">{vi ? "Chứng chỉ phản ví dụ trước planner" : "Counterexample replay before planning"} · {seededReplay.report.status} · p={seededReplay.candidate.prime.toLocaleString(locale)} · A≤{seededReplay.candidate.failedThroughA}</summary>
              <p className="mt-2">{vi ? "Kiểm bằng hai chương trình riêng trước cuộc gọi AI đầu tiên." : "Checked by two separate programs before the first AI call."}</p>
              <p className="mt-1">{vi ? "x₃ là số chính phương" : "x₃ is square"}: {String(seededReplay.report.a3Square)} ·
                {` ${vi ? "x₃ không có thừa số nguyên tố 2 mod 3" : "x₃ has no prime factor 2 mod 3"}: ${String(seededReplay.report.a3NoPrime2Mod3)}`} ·
                {` ${vi ? "x₇ không có ước 5 mod 7" : "x₇ has no divisor 5 mod 7"}: ${String(seededReplay.report.a7NoDivisor5Mod7)}`}</p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">{seededReplay.report.rows.map((row) => <li key={row.a}>
                A={row.a} · x={row.x.toLocaleString(locale)} · {row.factorPairsChecked} {label.factorPairs} · {row.admissiblePairs} {label.admissiblePairs}
              </li>)}</ul>
              {seededReplay.report.mismatches.map((mismatch) => <p key={mismatch} role="alert" className="text-danger-700 mt-1">{mismatch}</p>)}
              <p className="mt-2">{vi ? "Chỉ là ràng buộc hữu hạn cho giả thuyết mới, không chứng minh bài toán gốc." :
                "A finite constraint for a new hypothesis, not a proof of the root problem."}</p>
              <p className="mt-1 break-all">Python SHA-256: {seededReplay.report.pythonScriptDigest ?? "n/a"} · Output SHA-256: {seededReplay.report.pythonOutputDigest ?? "n/a"} · Report SHA-256: {seededReplay.report.reportDigest}</p>
            </details> : null}
          {gateDossier?.phase === "PRIOR_GATE_DOSSIER" ? <details className="border-line text-meta text-ink-muted mt-3 rounded-md border p-3">
              <summary className="text-ink cursor-pointer font-medium">{vi ? "Hồ sơ đầy đủ các cửa A" : "Full A-gate dossier"} · p={gateDossier.dossier.candidate.prime.toLocaleString(locale)} · A={gateDossier.dossier.targetA}</summary>
              <p className="mt-2">{vi ? "Mỗi cửa trước mục tiêu được loại trừ bằng phép tính và phát lại độc lập; cửa mục tiêu có nghiệm chính xác. Đây chỉ là chứng cứ hữu hạn." :
                "Every earlier gate was excluded by computation and independent replay; the target has an exact witness. This is finite evidence only."}</p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">{gateDossier.dossier.rows.map((row) => <li key={row.a}>
                A={row.a} · x={row.x.toLocaleString(locale)} · {row.xFactors.map((factor) => `${factor.prime}${factor.exponent > 1 ? `^${factor.exponent}` : ""}`).join("×")} · {row.factorPairsChecked} {label.factorPairs}
              </li>)}</ul>
              <p className="mt-2 break-all">A={gateDossier.dossier.firstSuccessA}: (x,y,z)=({gateDossier.dossier.witness.x}, {gateDossier.dossier.witness.y}, {gateDossier.dossier.witness.z})</p>
              <p className="mt-1 break-all">SHA-256: {gateDossier.dossier.dossierDigest}</p>
            </details> : null}
          {visibleFindings.length ? <div className="border-line text-meta text-ink-muted mt-3 rounded-md border p-3">
              <p className="text-ink font-medium">{vi ? "Chứng cứ hữu hạn đã phát lại từ đợt trước" : "Independently replayed prior finite evidence"}</p>
              <ul className="mt-1 space-y-1">{visibleFindings.map((finding) =>
                <li key={finding.sourceCycleId}>
                  p={finding.prime.toLocaleString(locale)} · A≤{finding.failedThroughA}: {vi ? "không có nghiệm trong họ này" : "no witness in this family"}
                  {finding.firstSuccessA ? ` · ${vi ? "nghiệm ở" : "witness at"} A=${finding.firstSuccessA}` : ""}
                  {finding.structuralFacts && finding.structuralFacts.a3Square !== null &&
                    finding.structuralFacts.a3NoPrime2Mod3 !== null &&
                    finding.structuralFacts.a7NoDivisor5Mod7 !== null ? <span className="block">
                    {vi ? "Tiền đề định kiểu" : "Typed premise facts"}: x₃ {finding.structuralFacts.a3Square ? (vi ? "là số chính phương" : "is square") : (vi ? "không là số chính phương" : "is not square")};
                    {" "}A=3 {finding.structuralFacts.a3NoPrime2Mod3 ? (vi ? "không có ước nguyên tố 2 mod 3" : "has no prime factor 2 mod 3") : (vi ? "có ước nguyên tố 2 mod 3" : "has a prime factor 2 mod 3")};
                    {" "}A=7 {finding.structuralFacts.a7NoDivisor5Mod7 ? (vi ? "không có ước 5 mod 7" : "has no divisor 5 mod 7") : (vi ? "có ước 5 mod 7" : "has a divisor 5 mod 7")}.
                  </span> : null}
                  <span className="block break-all">SHA-256: {finding.replayDigest}</span>
                </li>)}</ul>
              <p className="mt-2">{vi ? "Đây là ràng buộc phản ví dụ cho mệnh đề mới, không phải chứng minh phổ quát." :
                "These are counterexample constraints for new claims, not a universal proof."}</p>
            </div> : null}
          {cycle.trace === null ? <p className="text-meta text-danger-700 mt-3" role="alert">{label.integrity}</p> :
            rounds.length ? <ol className="mt-4 space-y-4">
              {rounds.map((round) => {
                const events = cycle.trace!.filter((event) => event.round === round);
                const proposed = events.find((event) => event.phase === "PROPOSED");
                const structuralProbe = events.find((event) => event.phase === "STRUCTURAL_PROBED");
                const frontier = events.find((event) => event.phase === "FRONTIER_DOSSIER");
                const frontierDecision = events.find((event) => event.phase === "FRONTIER_GATE");
                const sourceReviews = events.filter((event) => event.phase === "FRONTIER_REVIEWED");
                const verified = events.find((event) => event.phase === "VERIFIED");
                const computed = events.find((event) => event.phase === "COMPUTED");
                const replay = events.find((event) => event.phase === "INDEPENDENT_REPLAY");
                const attempted = events.find((event) => event.phase === "ATTEMPTED");
                const certificateChecked = events.find((event) => event.phase === "CERTIFICATE_CHECKED");
                const parametricChecked = events.find((event) => event.phase === "PARAMETRIC_CHECKED");
                const structuralReplay = events.find((event) => event.phase === "COUNTEREXAMPLE_REPLAY");
                const reviewed = events.filter((event) => event.phase === "REVIEWED");
                const known = proposed?.phase === "PROPOSED" && rootContract
                  ? knownScopeForTask(rootContract, `${proposed.proposal.hypothesis}\n${proposed.proposal.taskStatement}`)
                    ?? knownScopeForTask(rootContract, proposed.proposal.taskStatement)
                    ?? knownScopeForTask(rootContract, proposed.proposal.hypothesis)
                  : null;
                const twoGate = (() => {
                  if (computed?.phase !== "COMPUTED" || !computed.evidence.firstFailure ||
                    replay?.phase !== "INDEPENDENT_REPLAY" ||
                    !validateIndependentReplayReport(computed.evidence, replay.report)) return null;
                  try { return analyzeTwoGateResidualPrime(computed.evidence.firstFailure.n); }
                  catch { return null; }
                })();
                return <li key={round} className="border-line border-l-2 pl-4">
                  <h6 className="text-meta text-ink font-semibold">{label.round} {round}</h6>
                  {proposed?.phase === "PROPOSED" ? <div className="text-meta text-ink-muted mt-2 space-y-2">
                    <p><span className="text-ink font-medium">{label.sourceGap}:</span> {proposed.proposal.sourceGap}</p>
                    <p><span className="text-ink font-medium">{label.hypothesis}:</span> {proposed.proposal.hypothesis}</p>
                    <p><span className="text-ink font-medium">{label.task}:</span> {proposed.proposal.taskStatement}</p>
                  </div> : <p className="text-meta text-ink-muted mt-2">{label.pending}</p>}
                  {structuralProbe?.phase === "STRUCTURAL_PROBED" ? <section className="border-line text-meta mt-3 border-t pt-3">
                    <h6 className="text-ink font-semibold">{vi ? "Dò phản ví dụ trước nghiệm thu task" : "Pre-acceptance counterexample probe"}</h6>
                    <p className={structuralProbe.report.status === "REFUTED" ? "text-danger-700 mt-1" : "text-ink-muted mt-1"}>
                      {structuralProbe.report.status === "REFUTED"
                        ? vi ? `Mệnh đề định kiểu bị bác bỏ bởi p=${structuralProbe.report.candidate?.prime}; các cửa A≤${structuralProbe.report.plan.targetA} đã phát lại độc lập.`
                          : `Typed implication refuted by p=${structuralProbe.report.candidate?.prime}; gates through A=${structuralProbe.report.plan.targetA} independently replayed.`
                        : vi ? `Chưa thấy phản ví dụ trong ${structuralProbe.report.eligiblePrimesTested.toLocaleString(locale)} số nguyên tố p≡1 (mod 840), p≤${structuralProbe.report.plan.upperInclusive.toLocaleString(locale)}. Đây không phải chứng minh.`
                          : `No counterexample among ${structuralProbe.report.eligiblePrimesTested.toLocaleString(locale)} primes p≡1 (mod 840), p≤${structuralProbe.report.plan.upperInclusive.toLocaleString(locale)}. This is not a proof.`}
                    </p>
                    {structuralProbe.report.candidate?.divisorWitnesses.length ? <p className="text-ink-muted mt-1">
                      {vi ? "Ước chia kiểm được" : "Checked divisor witnesses"}: {structuralProbe.report.candidate.divisorWitnesses.join(", ")}
                    </p> : null}
                    <p className="text-ink-muted mt-1 break-all">SHA-256: {structuralProbe.report.reportDigest}</p>
                  </section> : null}
                  {known ? <p role="alert" className="text-meta text-danger-700 mt-2">
                    {label.priorArtWarning} <a className="underline underline-offset-2" href={known.sourceUrl} target="_blank" rel="noreferrer">{known.sourceTitle}</a>
                  </p> : null}
                  {known && frontier?.phase === "FRONTIER_DOSSIER" &&
                    !frontier.dossier.sources.some((source) => source.id === known.id)
                    ? <p className="text-meta text-ink-muted mt-1">{label.retrospective}</p> : null}
                  {frontier?.phase === "FRONTIER_DOSSIER" ? <details className="text-meta text-ink-muted mt-3">
                    <summary className="text-ink cursor-pointer font-medium">{label.frontier} · {frontier.dossier.sources.length} {label.captured.toLowerCase()}</summary>
                    <p className="mt-2">{label.discovery}: {frontier.dossier.discovery.status} · Crossref · {frontier.dossier.discovery.candidates.length}</p>
                    <p className="mt-1">{label.frontierCoverage}</p>
                    <ul className="mt-2 space-y-2">{frontier.dossier.sources.map((source) => <li key={source.id} className="break-words">
                      <a className="text-ink underline underline-offset-2" href={source.canonicalUri} target="_blank" rel="noreferrer">{source.title}</a>
                      {` · ${source.authors} (${source.publicationYear}) · ${source.scope}`}
                      <p className="mt-1">{label.captured}: “{source.exactQuote}”</p>
                      <p className="break-all">SHA-256: {source.contentDigest}</p>
                    </li>)}</ul>
                    <p className="mt-2 break-all">Dossier SHA-256: {frontier.dossier.dossierDigest}</p>
                  </details> : proposed?.phase === "PROPOSED" && !frontierDecision ?
                    <p className="text-meta text-ink-muted mt-2">{label.frontierMissing}</p> : null}
                  {sourceReviews.map((event) => event.phase === "FRONTIER_REVIEWED" ? <p key={event.role} className="text-meta text-ink-muted mt-2">
                    <span className="text-ink font-medium">{label.sourceAssessment} · {event.role}:</span> {event.assessment.relevance} · {event.assessment.quantifiers} · {event.assessment.overlap} · {event.assessment.explanation}
                  </p> : null)}
                  {frontierDecision?.phase === "FRONTIER_GATE" ? <p role={frontierDecision.decision === "RESEARCH_ONLY" ? undefined : "alert"}
                    className={`text-meta mt-2 font-medium ${frontierDecision.decision === "RESEARCH_ONLY" ? "text-ink" : "text-danger-700"}`}>
                    {label.frontierGate}: {frontierDecision.decision} · {frontierDecision.reason}
                  </p> : null}
                  {verified?.phase === "VERIFIED" ? <details className="text-meta text-ink-muted mt-2">
                    <summary className="text-ink cursor-pointer font-medium">{label.verification} · {verified.accepted ? "ACCEPT" : "REJECT"}</summary>
                    <dl className="mt-2 grid gap-2">
                      <div><dt className="text-ink font-medium">{label.scope}</dt><dd>{verified.verification.scopeCheck}</dd></div>
                      <div><dt className="text-ink font-medium">{label.novelty}</dt><dd>{verified.verification.noveltyCheck}</dd></div>
                      <div><dt className="text-ink font-medium">{label.falsifiability}</dt><dd>{verified.verification.falsifiabilityCheck}</dd></div>
                    </dl>
                    <p className="mt-2">{verified.reason} · {verified.verification.unresolvedRisk}</p>
                  </details> : null}
                  {computed?.phase === "COMPUTED" ? <section aria-label={label.computation} className="border-line text-meta mt-3 border-t pt-3">
                    <h6 className="text-ink font-semibold">{label.computation}</h6>
                    <p className="text-ink mt-1 font-medium">
                      {computed.evidence.primeCount.toLocaleString(locale)} {label.testedPrimes} · {computed.evidence.failureCount.toLocaleString(locale)} {label.outsideBound} A≤{computed.evidence.plan.maxA}
                    </p>
                    <p className="text-ink-muted mt-1 break-words">p ≡ 1 (mod 840), {computed.evidence.plan.lowerExclusive.toLocaleString(locale)} &lt; p ≤ {computed.evidence.plan.upperInclusive.toLocaleString(locale)}; x=(p+A)/4.</p>
                    <p className="text-ink-muted mt-1">{label.finiteOnly}</p>
                    <details className="text-ink-muted mt-2">
                      <summary className="text-ink cursor-pointer font-medium">{label.computationDetails}</summary>
                      {computed.evidence.firstFailure ? <p className="mt-2 break-words">p={computed.evidence.firstFailure.n}: {vi ? "không có nghiệm trong giới hạn A" : "no witness within the A-bound"}.{computed.evidence.firstFailureRescue?.witness ? ` A=${computed.evidence.firstFailureRescue.firstA}: (${computed.evidence.firstFailureRescue.witness.x}, ${computed.evidence.firstFailureRescue.witness.y}, ${computed.evidence.firstFailureRescue.witness.z})` : ""}</p> : null}
                      <p className="mt-1 break-all">SHA-256: {computed.evidence.manifestDigest}</p>
                      {computed.evidence.firstFailureAudit ? <div className="border-line mt-3 border-t pt-3">
                        <p className="text-ink font-medium">{label.exclusionAudit} · p={computed.evidence.firstFailureAudit.n}</p>
                        <p className="mt-1">{label.primeTrial} ⌊√p⌋={computed.evidence.firstFailureAudit.primeTrialLimit}. {label.auditScope}</p>
                        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                          {computed.evidence.firstFailureAudit.rows.map((row) => <li key={row.a} className="break-words">
                            A={row.a} · x={row.x.toLocaleString(locale)}={row.xFactors.map((factor) => `${factor.prime}${factor.exponent > 1 ? `^${factor.exponent}` : ""}`).join("×")} · {row.factorPairsChecked} {label.factorPairs} · {row.admissiblePairs} {label.admissiblePairs}
                          </li>)}
                        </ul>
                        <p className="mt-2 break-all">Audit SHA-256: {computed.evidence.firstFailureAudit.auditDigest}</p>
                      </div> : null}
                    </details>
                  </section> : null}
                  {replay?.phase === "INDEPENDENT_REPLAY" ? <details className="text-meta text-ink-muted mt-2">
                    <summary className="text-ink cursor-pointer font-medium">{label.independentReplay} · {replay.report.status}</summary>
                    <p className="mt-2">{replay.report.primeCount.toLocaleString(locale)} {label.testedPrimes} · {replay.report.failureCount.toLocaleString(locale)} {label.outsideBound} A≤{computed?.phase === "COMPUTED" ? computed.evidence.plan.maxA : "?"} · {replay.report.auditedRows.length} A {label.factorPairs}</p>
                    <p className="mt-1">{label.replayLimit}</p>
                    {replay.report.mismatches.map((mismatch) => <p key={mismatch} role="alert" className="text-danger-700 mt-1">{mismatch}</p>)}
                    <p className="mt-2 break-all">Python SHA-256: {replay.report.intervalScriptDigest} · {replay.report.exclusionScriptDigest ?? "n/a"}</p>
                    <p className="mt-1 break-all">Replay SHA-256: {replay.report.reportDigest}</p>
                  </details> : computed?.phase === "COMPUTED" && attempted?.phase === "ATTEMPTED" ? <p className="text-meta text-ink-muted mt-2">{label.replayMissing}</p> : null}
                  {computed?.phase === "COMPUTED" && replay?.phase === "INDEPENDENT_REPLAY" &&
                    computed.evidence.firstFailure && validateIndependentReplayReport(computed.evidence, replay.report)
                    ? <p role="status" className="border-line bg-surface text-meta text-ink mt-3 rounded-md border px-3 py-2">
                      {vi ? "Cột mốc hữu hạn đã phát lại độc lập" : "Independently replayed finite milestone"}:
                      {` p=${computed.evidence.firstFailure.n}`} {vi ? "không có nghiệm trong họ mẫu số đầu" : "has no solution in the first-denominator family"} A≤{computed.evidence.plan.maxA}.
                      {computed.evidence.firstFailureRescue?.firstA ? ` ${vi ? "Có nghiệm ngoài giới hạn tại" : "A witness exists outside that bound at"} A=${computed.evidence.firstFailureRescue.firstA}.` : ""}
                      {` ${label.finiteOnly}`}
                    </p> : null}
                  {twoGate ? <details className="border-line text-meta text-ink-muted mt-3 rounded-md border p-3">
                    <summary className="text-ink cursor-pointer font-medium">
                      {vi ? "Cấu trúc hai cửa A=3,7" : "Two-gate structure A=3,7"} · p={twoGate.n}
                    </summary>
                    <p className="mt-2">{vi
                      ? "Định lý điều kiện cho mọi p ≡ 1 (mod 840); phân tích thừa số dưới đây chỉ cho p đã phát lại. Không chứng minh hay bác bỏ giả thuyết Erdős–Straus."
                      : "A conditional lemma for every p ≡ 1 (mod 840); the factorizations below concern only the replayed p. This neither proves nor refutes Erdős–Straus."}</p>
                    <ul className="mt-2 space-y-1">{twoGate.gates.map((gate) => <li key={gate.a} className="break-words">
                      A={gate.a} · x={gate.x.toLocaleString(locale)}={gate.factors.map(({ prime, exponent }) => `${prime}${exponent > 1 ? `^${exponent}` : ""}`).join("×")}
                      {` · ${gate.status}`}{gate.divisor ? ` · d=${gate.divisor}` : ""}
                    </li>)}</ul>
                    <p className="mt-2">{twoGate.bothObstructed
                      ? (vi ? "Cả hai cửa đều bị chặn bởi cấu trúc thừa số; cần khảo sát A lớn hơn." : "Both gates are structurally obstructed; larger A must be investigated.")
                      : (vi ? "Có nhân chứng chính xác ở ít nhất một cửa." : "At least one gate has an exact witness.")}</p>
                    <p className="mt-2">{vi ? "Nền tảng tiêu chuẩn d | x²" : "Prior divisor criterion d | x²"}: <a className="underline underline-offset-2" href="https://math.colgate.edu/~integers/z54/z54.pdf" target="_blank" rel="noreferrer">Bradford, Integers 25 (2025)</a>. {vi ? "Không tuyên bố tính mới." : "No novelty claim."}</p>
                    <p className="mt-1 break-all">SHA-256: {twoGate.profileDigest}</p>
                  </details> : null}
                  {attempted?.phase === "ATTEMPTED" ? <details className="text-meta text-ink-muted mt-2">
                    <summary className="text-ink cursor-pointer font-medium">{label.attempt} · {attempted.attempt.attemptType}</summary>
                    <p className="mt-2 whitespace-pre-wrap break-words">{attempted.attempt.argument}</p>
                    {rootContract && hasErdosStrausEquation(rootContract) && attempted.attempt.erdosStrausWitnesses?.length ? <ul className="mt-2 space-y-1">
                      {attempted.attempt.erdosStrausWitnesses.map((witness, index) => {
                        const certificate = verifyErdosStrausWitness(witness);
                        return <li key={index} className="break-all">{label.exactWitness}: {certificate.classification} · ({witness.n}, {witness.x}, {witness.y}, {witness.z}) · {certificate.reason}</li>;
                      })}
                    </ul> : null}
                    {attempted.attempt.limitations.length ? <p className="mt-2 whitespace-pre-wrap">{attempted.attempt.limitations.join(" · ")}</p> : null}
                  </details> : null}
                  {certificateChecked?.phase === "CERTIFICATE_CHECKED" ? <p className="text-meta text-ink-muted mt-2">
                    {label.exactWitness}: {certificateChecked.checks.length ? certificateChecked.checks.map((check) => `${check.witness.n}: ${check.valid ? "EXACT_IDENTITY" : "INVALID"}`).join(" · ") : label.noWitness}
                  </p> : null}
                  {structuralReplay?.phase === "COUNTEREXAMPLE_REPLAY" ? <details className="border-line text-meta text-ink-muted mt-3 rounded-md border p-3">
                    <summary className="text-ink cursor-pointer font-medium">
                      {vi ? "Phát lại phản ví dụ cấu trúc" : "Structural counterexample replay"} · {structuralReplay.report.status} · p={structuralReplay.candidate.prime}
                    </summary>
                    <p className="mt-2">A≤{structuralReplay.candidate.failedThroughA} · {structuralReplay.report.rows.length} {vi ? "cửa được kiểm" : "gates checked"} · TypeScript + Python.</p>
                    <p className="mt-1">{vi ? "u=(p+3)/4 là số chính phương" : "u=(p+3)/4 is a square"}: {String(structuralReplay.report.a3Square)} ·
                      {` ${vi ? "u không có thừa số nguyên tố 2 mod 3" : "u has no prime factor 2 mod 3"}: ${String(structuralReplay.report.a3NoPrime2Mod3)}`} ·
                      {` ${vi ? "v không có ước 5 mod 7" : "v has no divisor 5 mod 7"}: ${String(structuralReplay.report.a7NoDivisor5Mod7)}`}</p>
                    <ul className="mt-2 grid gap-1 sm:grid-cols-2">{structuralReplay.report.rows.map((row) => <li key={row.a}>
                      A={row.a} · x={row.x.toLocaleString(locale)} · {row.factorPairsChecked} {label.factorPairs} · {row.admissiblePairs} {label.admissiblePairs}
                    </li>)}</ul>
                    {structuralReplay.report.mismatches.map((mismatch) => <p key={mismatch} role="alert" className="text-danger-700 mt-1">{mismatch}</p>)}
                    <p className="mt-2">{vi ? "Chỉ chứng nhận loại trừ hữu hạn trong họ x=(p+A)/4; các tiền đề văn bản và mệnh đề tổng quát cần phản biện riêng." :
                      "Certifies only finite exclusions in x=(p+A)/4; textual premises and general claims need separate review."}</p>
                    <p className="mt-1 break-all">Python SHA-256: {structuralReplay.report.pythonScriptDigest ?? "n/a"} · Replay SHA-256: {structuralReplay.report.reportDigest}</p>
                  </details> : null}
                  {parametricChecked?.phase === "PARAMETRIC_CHECKED" ? <details className="text-meta text-ink-muted mt-2">
                    <summary className="text-ink cursor-pointer font-medium">{vi ? "Chứng chỉ đồng nhất thức tham số" : "Parametric identity certificate"} · {parametricChecked.checks.filter((check) => check.certificate.valid).length}/{parametricChecked.checks.length}</summary>
                    {parametricChecked.checks.map((check, index) => <div key={index} className="mt-2 break-words">
                      <p className={check.certificate.valid ? "text-ink" : "text-danger-700"}>{check.certificate.classification} · n(t)={check.family.n[0]}+{check.family.n[1]}t</p>
                      {check.certificate.firstDenominatorOffset ? <p>A=4x(t)−n(t)={check.certificate.firstDenominatorOffset}</p> : null}
                      <p>{check.certificate.reason}</p>
                      {check.certificate.identityDigest ? <p className="break-all">SHA-256: {check.certificate.identityDigest}</p> : null}
                    </div>)}
                    <p className="mt-2">{vi ? "Chỉ chứng minh đồng nhất thức trên cấp số được ghi. Giới hạn A/mẫu số đầu của bài toán gốc, toàn bộ lớp còn sót lại và tính mới cần kiểm riêng." : "Only the identity on this progression is checked. Root-specific A/first-denominator bounds, the full residual class and novelty need separate checks."}</p>
                  </details> : null}
                  {reviewed.map((event) => event.phase === "REVIEWED" ? <p key={event.role} className="text-meta text-ink-muted mt-2 whitespace-pre-wrap break-words">
                    <span className="text-ink font-medium">{label.review} · {event.role} · {event.report.verdict}:</span> {event.report.reasoning}
                    {event.report.unresolvedGap ? ` · ${event.report.unresolvedGap}` : ""}
                  </p> : null)}
                </li>;
              })}
            </ol> : <p className="text-meta text-ink-muted mt-3">{label.pending}</p>}
          {cycle.stopReason ? <p className="text-meta text-ink mt-4 font-medium">{label.stopped}: {cycle.stopReason}</p> : null}
          {cycle.stopReason === "COUNTEREXAMPLE_REJECTED" ? <p role="alert" className="text-meta text-danger-700 mt-1">
            {vi ? "Ứng viên phản ví dụ thiếu chứng chỉ định kiểu, lệch cửa A được duyệt, hoặc không qua kiểm toán số học. Không chuyển sang phản biện AI." :
              "The counterexample candidate lacked typed evidence, missed the approved A gate, or failed exact arithmetic replay. AI peer review was not dispatched."}
          </p> : null}
          {cycle.stopReason === "STRUCTURAL_REFUTED" ? <p role="alert" className="text-meta text-danger-700 mt-1">
            {vi ? "Giả thuyết định kiểu bị phản ví dụ số học bác bỏ trước lượt task verifier/solver; không suy diễn điều này thành lời giải bài toán gốc." :
              "An exact counterexample refuted the typed hypothesis before task verification or solving; this does not settle the root problem."}
          </p> : null}
          {cycle.stopReason === "STRUCTURAL_PROBE_HOLD" ? <p role="alert" className="text-meta text-danger-700 mt-1">
            {vi ? "Đề xuất cấu trúc thiếu phép dò định kiểu hoặc lệch cửa A được duyệt; vòng dừng trước phản biện và solver." :
              "The structural proposal lacks a supported typed probe or misses the approved A gate; review and solver were not dispatched."}
          </p> : null}
          {cycle.events.length ? <p className="text-meta text-ink-muted mt-2 break-all">{label.ledger}: {cycle.events.at(-1)?.digest}</p> : null}
          {cycle.status === "STOPPED" && canRequest && gaps.length && rootContract && hasErdosStrausEquation(rootContract)
            ? <MathCycleSteeringForm slug={slug} caseId={caseId} locale={locale} repeat /> : null}
        </>
      )}
      {history.length ? <details className="border-line text-meta text-ink-muted mt-4 rounded-md border p-3">
        <summary className="text-ink cursor-pointer font-medium">{vi ? "Các đợt gần đây đã niêm phong" : "Recent sealed campaigns"} ({history.length})</summary>
        <ol className="mt-3 space-y-3">{history.map((previous) => {
          const directive = previous.trace?.find((event) => event.phase === "HUMAN_STEERED");
          const proposal = previous.trace?.find((event) => event.phase === "PROPOSED");
          const frontier = previous.trace?.find((event) => event.phase === "FRONTIER_GATE");
          const review = previous.trace?.find((event) => event.phase === "ROUND_CLOSED");
          return <li key={previous.id} className="border-line border-t pt-3 first:border-t-0 first:pt-0">
            <p className="text-ink font-medium">{previous.createdAt.toLocaleString(locale)} · {previous.status}{previous.stopReason ? ` · ${previous.stopReason}` : ""}</p>
            {previous.trace === null ? <p role="alert" className="text-danger-700 mt-1">{label.integrity}</p> : <>
              {directive?.phase === "HUMAN_STEERED" ? <p className="mt-1">{directive.steering.focus} · A={directive.steering.targetA}</p> : null}
              {proposal?.phase === "PROPOSED" ? <p className="mt-1 whitespace-pre-wrap break-words">{proposal.proposal.taskStatement}</p> : null}
              {frontier?.phase === "FRONTIER_GATE" ? <p className="mt-1">{label.frontierGate}: {frontier.decision} · {frontier.reason}</p> : null}
              {review?.phase === "ROUND_CLOSED" ? <p className="mt-1">{label.review}: {review.conclusion}{review.nextGap ? ` · ${review.nextGap}` : ""}</p> : null}
            </>}
            <p className="mt-1 break-all">SHA-256: {previous.events.at(-1)?.digest ?? "—"}</p>
          </li>;
        })}</ol>
      </details> : null}
      <p className="text-meta text-ink-muted border-line mt-4 border-t pt-3">{label.caution}</p>
    </section>
  );
}

function MathCycleSteeringForm({ slug, caseId, locale, repeat = false }: {
  slug: string; caseId: string; locale: "vi" | "en"; repeat?: boolean;
}) {
  const vi = locale === "vi";
  return <form action={requestMathResearchCycleAction} className="border-line mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2">
    <input type="hidden" name="slug" value={slug} />
    <input type="hidden" name="caseId" value={caseId} />
    <input type="hidden" name="maxRounds" value="1" />
    <div className="sm:col-span-2">
      <p className="text-ink text-meta font-semibold">{repeat
        ? (vi ? "Điều chỉnh hướng và khởi động đợt kế tiếp" : "Adjust direction and start the next campaign")
        : (vi ? "Xác nhận hướng nghiên cứu tự trị" : "Confirm autonomous research direction")}</p>
      <p className="text-ink-muted text-meta mt-1">{vi
        ? "Mỗi đợt chạy một vòng có giới hạn. AI tự đề xuất và phản biện; bạn xem kết quả rồi điều chỉnh trước đợt sau. Không tự công bố định lý."
        : "Each campaign runs one bounded round. AI proposes and challenges; you review and adjust before the next campaign. No theorem is published automatically."}</p>
    </div>
    <label className="text-meta text-ink font-medium">{vi ? "Phương pháp ưu tiên" : "Research priority"}
      <select name="steeringFocus" defaultValue="STRUCTURAL_LEMMA" className={inputClass}>
        <option value="STRUCTURAL_LEMMA">{vi ? "Mệnh đề cấu trúc tổng quát" : "General structural lemma"}</option>
        <option value="FINITE_FALSIFICATION">{vi ? "Tìm phản ví dụ hữu hạn" : "Bounded falsification"}</option>
      </select>
    </label>
    <label className="text-meta text-ink font-medium">{vi ? "Cửa A cần khảo sát" : "Target A gate"}
      <select name="targetA" defaultValue="11" className={inputClass}>
        {[11, 15, 19, 23, 27, 31, 35, 39, 43, 47].map((a) => <option key={a} value={a}>A={a}</option>)}
      </select>
    </label>
    <label className="text-meta text-ink font-medium">{vi ? "Ngưỡng token quan sát" : "Observed token threshold"}
      <select name="maxObservedTokens" defaultValue="120000" className={inputClass}>
        <option value="60000">60,000</option><option value="120000">120,000</option><option value="200000">200,000</option>
      </select>
    </label>
    <div className="sm:col-span-2">
      <p className="text-meta text-ink font-medium">{vi ? "Phát lại phản ví dụ đã biết trước khi AI lập giả thuyết (tuỳ chọn)" :
        "Replay a known counterexample before AI plans (optional)"}</p>
      <p className="text-meta text-ink-muted mt-1">{vi ? "Nhập cả số nguyên tố p và cửa A cuối thất bại; công cụ sẽ tự kiểm, không tin mô tả văn bản." :
        "Enter both prime p and last failed A; the fixed tool verifies them rather than trusting prose."}</p>
    </div>
    <label className="text-meta text-ink font-medium">{vi ? "Số nguyên tố p" : "Prime p"}
      <input name="replayPrime" type="number" min="841" max="200000000" step="1" className={inputClass} />
    </label>
    <label className="text-meta text-ink font-medium">{vi ? "Thất bại đến A" : "Failed through A"}
      <select name="replayFailedThroughA" defaultValue="" className={inputClass}>
        <option value="">{vi ? "Không phát lại" : "No replay"}</option>
        {[3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43].map((a) => <option key={a} value={a}>A={a}</option>)}
      </select>
    </label>
    <label className="text-meta text-ink font-medium sm:col-span-2">{vi ? "Điều chỉnh của bạn (tuỳ chọn, tối đa 500 ký tự)" : "Your adjustment (optional, 500 characters max)"}
      <textarea name="steeringNote" rows={2} maxLength={500} className={inputClass} placeholder={vi
        ? "Ví dụ: ưu tiên chứng minh điều kiện đủ, không suy luận từ mẫu hữu hạn"
        : "For example: prioritize a sufficient condition, not extrapolation from finite samples"} />
    </label>
    <label className="text-meta text-ink flex items-start gap-2 font-medium sm:col-span-2">
      <input type="checkbox" name="confirmSteering" required className="mt-1 size-4" />
      <span>{vi ? "Tôi xác nhận hướng và giới hạn này; AI chỉ được tạo kết quả nghiên cứu có kiểm chứng, không tự chứng nhận định lý." :
        "I confirm this direction and these limits; AI may produce checked research evidence but cannot certify a theorem."}</span>
    </label>
    <p className="text-meta text-ink-muted sm:col-span-2">{vi
      ? "Ghi chú được gửi cho tác nhân Codex cục bộ; không nhập bí mật. Khảo sát hữu hạn sẽ dùng công cụ và phát lại độc lập."
      : "The note is sent to the local Codex agent; do not enter secrets. Finite surveys use fixed tools and independent replay."}</p>
    <Button type="submit" className="justify-self-start">{repeat
      ? (vi ? "Xác nhận đợt tiếp theo" : "Confirm next campaign")
      : (vi ? "Xác nhận và khởi động" : "Confirm and start")}</Button>
  </form>;
}
