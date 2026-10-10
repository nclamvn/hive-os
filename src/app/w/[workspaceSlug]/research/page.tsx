import { randomUUID } from "node:crypto";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileSearch,
  FlaskConical,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  requestComputationRunAction,
  importApprovedResearchBundleAction,
  requestResearchRunAction,
  reviewComputationRunAction,
  reviewResearchRunAction,
} from "@/app/actions/research-sandbox";
import { ResearchLiveRefresh } from "@/components/research/research-live-refresh";
import { ResearchCampaignRegion } from "@/components/research/research-campaign-region";
import { getResearchCampaignCopy } from "@/i18n/research-campaign-copy";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/i18n/format";
import { getResearchCopy } from "@/i18n/research-copy";
import { getTranslator } from "@/i18n/server";
import { hasCapability } from "@/modules/identity-workspace";
import {
  listComputationRuns,
  listResearchRuns,
  listResearchTargets,
} from "@/modules/research-sandbox/kernel";
import { loadWorkspacePage } from "@/server/auth/workspace-page";

export const dynamic = "force-dynamic";

const inputClass =
  "text-body text-ink border-line mt-1 min-h-11 w-full rounded-md border bg-surface px-3 py-2 outline-none transition-colors focus:border-line-strong";

const terminalStatuses = new Set([
  "APPROVED",
  "REJECTED",
  "FAILED",
  "CANCELLED",
]);

function statusTone(status: string): "neutral" | "success" | "warning" | "danger" | "info" {
  if (status === "APPROVED") return "success";
  if (["FAILED", "REJECTED", "CANCELLED"].includes(status)) return "danger";
  if (status === "AWAITING_REVIEW") return "warning";
  if (status === "RUNNING") return "info";
  return "neutral";
}

function workerSignal(run: {
  status: string;
  createdAt: Date;
  job: null | {
    status: string;
    leaseExpiresAt: Date | null;
  };
}) {
  if (["APPROVED", "REJECTED", "FAILED", "CANCELLED"].includes(run.status)) {
    return "COMPLETE" as const;
  }
  if (run.status === "AWAITING_REVIEW") return "HUMAN" as const;
  if (
    run.status === "RUNNING" &&
    run.job?.status === "RUNNING" &&
    run.job.leaseExpiresAt &&
    run.job.leaseExpiresAt.getTime() > Date.now()
  ) {
    return "ACTIVE" as const;
  }
  if (run.status === "RUNNING") return "STALLED" as const;
  if (!run.job && Date.now() - run.createdAt.getTime() < 15_000) {
    return "DISPATCHING" as const;
  }
  return "WAITING" as const;
}

export default async function ResearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<{ missionId?: string; advanced?: string }>;
}) {
  const [{ workspaceSlug }, query] = await Promise.all([params, searchParams]);
  const data = await loadWorkspacePage(workspaceSlug);
  const { locale } = await getTranslator();
  const copy = getResearchCopy(locale);
  const campaignCopy = getResearchCampaignCopy(locale);
  if (!hasCapability(data.ctx.membership.role, "research.read")) notFound();

  const [runs, computations, targets] = await Promise.all([
    listResearchRuns(data.ctx),
    listComputationRuns(data.ctx),
    listResearchTargets(data.ctx),
  ]);
  const canRequest = hasCapability(data.ctx.membership.role, "research.request");
  const canReview = hasCapability(data.ctx.membership.role, "research.review");
  const canCompute = hasCapability(data.ctx.membership.role, "sandbox.request");
  const canAuthor = hasCapability(data.ctx.membership.role, "authoring.write");
  const selectedMissionId = targets.missions.some(
    (mission) => mission.id === query.missionId,
  )
    ? query.missionId
    : targets.missions[0]?.id;
  const selectedMission = targets.missions.find(
    (mission) => mission.id === selectedMissionId,
  );
  const expertMode = query.advanced === "1";
  const hasActiveWork = [...runs, ...computations].some(
    (run) => !terminalStatuses.has(run.status) && run.status !== "AWAITING_REVIEW",
  );

  return (
    <WorkspaceShell data={data} title={copy.title} subtitle={copy.subtitle}>
      <section className="mx-auto w-full max-w-5xl">
        <Link href={`/w/${workspaceSlug}/research/kakeya`} className="text-meta text-ink mb-3 mr-5 inline-flex min-h-11 items-center underline underline-offset-4">{locale==="vi"?"Hồ sơ Kakeya · chặn dưới toàn cục cho năm tam giác":"Kakeya dossier · global lower bound for five triangles"}</Link>
        {canRequest?<Link href={`/w/${workspaceSlug}/research/lean`} className="text-meta text-ink mb-3 inline-flex min-h-11 items-center underline underline-offset-4">{locale==="vi"?"Bàn nghiên cứu gọn · nhập đầu ra thủ công":"Lean research workbench · manual output import"}</Link>:null}
        <ResearchCampaignRegion ctx={data.ctx} locale={locale} workspaceSlug={workspaceSlug}
          missionId={selectedMissionId} canRequest={canRequest} canReview={canReview}/>
        <Link href={`/w/${workspaceSlug}/research/math-pilot${selectedMissionId ? `?missionId=${encodeURIComponent(selectedMissionId)}` : ""}#research-campaign-v3`}
          className="text-meta text-ink mt-3 inline-flex min-h-10 items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{campaignCopy.overview}</Link>
        <Link href={`/w/${workspaceSlug}/research/poly19${selectedMissionId ? `?missionId=${encodeURIComponent(selectedMissionId)}` : ""}#poly19-showcase`}
          className="text-meta text-ink mt-3 ml-4 inline-flex min-h-10 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{locale==="vi"?"Bản chứng minh Poly19 và bằng chứng":"Poly19 proof and evidence"}</Link>
      </section>
      <section id="new-research" className="mx-auto w-full max-w-5xl scroll-mt-24">
        <div className="px-1 pb-5 pt-2 sm:pb-7 sm:pt-5">
          {selectedMission ? (
            <p className="text-meta text-ink-muted mb-3 tabular">
              {selectedMission.referenceCode} · {selectedMission.title}
            </p>
          ) : null}
          <h1 className="text-page-title text-ink-strong max-w-3xl">
            {copy.intentTitle}
          </h1>
          <p className="text-body text-ink-muted mt-3 max-w-3xl">
            {copy.intentHint}
          </p>
          <Link
            href={`/w/${workspaceSlug}/research/math-pilot${selectedMissionId ? `?missionId=${encodeURIComponent(selectedMissionId)}` : ""}`}
            className="text-meta text-ink-muted hover:text-ink mt-4 inline-flex min-h-10 items-center gap-2 font-medium"
            title={copy.mathPilotHint}
          >
            <FlaskConical className="size-4" aria-hidden="true" />
            {copy.mathPilot}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {canRequest && selectedMission ? (
          <Panel className="overflow-hidden border-line-strong">
            <form action={requestResearchRunAction}>
            <input type="hidden" name="slug" value={workspaceSlug} />
            <input
              type="hidden"
              name="idempotencyKey"
              value={`research:${randomUUID()}`}
            />
            <input type="hidden" name="language" value={locale} />
            <input type="hidden" name="providerName" value="openai" />
            <input type="hidden" name="modelName" value="gpt-5.6-sol" />

            <div className="p-5 min-[980px]:p-7">
              <label className="text-body text-ink font-semibold">
                {copy.intentLabel}
                <textarea
                  name="intent"
                  required
                  rows={6}
                  maxLength={8000}
                  autoFocus
                  placeholder={copy.intentPlaceholder}
                  aria-describedby="research-intent-hint"
                  className={`${inputClass} text-section-title mt-3 min-h-40 resize-y font-normal leading-relaxed`}
                />
                <span id="research-intent-hint" className="text-meta text-ink-muted mt-3 block max-w-3xl font-normal">
                  {copy.automaticGuardrails}
                </span>
              </label>
            </div>

            <details className="group border-line border-t">
              <summary className="text-body text-ink hover:bg-surface-subtle flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold transition-colors min-[980px]:px-7 [&::-webkit-details-marker]:hidden">
                <span>
                  {copy.context}
                  <span className="text-meta text-ink-muted mt-1 block font-normal">
                    {copy.contextHint}
                  </span>
                </span>
                <ChevronDown className="text-ink-muted size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="border-line bg-surface-subtle grid gap-4 border-t p-5 min-[900px]:grid-cols-2 min-[980px]:px-7">
                <label className="text-meta text-ink font-medium">
                  {copy.mission}
                  <select name="missionId" required defaultValue={selectedMissionId} className={inputClass}>
                    {targets.missions.map((mission) => (
                      <option key={mission.id} value={mission.id}>
                        {mission.referenceCode} · {mission.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-meta text-ink font-medium">
                  {copy.document}
                  <select name="documentId" className={inputClass}>
                    <option value="">{copy.noDocument}</option>
                    {targets.documents.map((document) => (
                      <option key={document.id} value={document.id}>
                        {document.documentKey} · {document.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </details>

            {expertMode ? (
              <details open className="group border-line border-t">
                <summary className="text-body text-ink hover:bg-surface-subtle flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold transition-colors min-[980px]:px-7 [&::-webkit-details-marker]:hidden">
                  <span>{copy.advancedSources}</span>
                  <ChevronDown className="text-ink-muted size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="border-line bg-surface-subtle grid gap-4 border-t p-5 min-[900px]:grid-cols-2 min-[980px]:px-7">
                  <label className="text-meta text-ink font-medium min-[900px]:col-span-2">
                    {copy.queries}
                    <textarea name="queries" rows={3} className={inputClass} />
                  </label>
                  <label className="text-meta text-ink font-medium">
                    {copy.allowedDomains}
                    <textarea name="allowedDomains" rows={3} className={inputClass} />
                  </label>
                  <label className="text-meta text-ink font-medium">
                    {copy.primaryDomains}
                    <textarea name="primaryDomains" rows={3} className={inputClass} />
                  </label>
                  <label className="text-meta text-ink font-medium">
                    {copy.maxSources}
                    <input
                      name="maxSources"
                      type="number"
                      min={1}
                      max={50}
                      defaultValue={20}
                      className={inputClass}
                    />
                  </label>
                  <label className="text-body text-ink flex min-h-11 items-center gap-2 self-end">
                    <input name="requirePrimary" type="checkbox" />
                    {copy.requirePrimary}
                  </label>
                </div>
              </details>
            ) : null}

            <div className="border-line flex border-t p-5 min-[980px]:px-7">
              <Button
                type="submit"
                variant="primary"
                disabled={!targets.missions.length}
                className="w-full sm:ml-auto sm:w-auto"
              >
                <FileSearch className="size-4" aria-hidden="true" />
                {copy.startResearch}
              </Button>
            </div>
            </form>
          </Panel>
        ) : canRequest ? (
          <Panel className="p-6 sm:p-8">
            <p className="text-section-title text-ink-strong">{copy.noMission}</p>
            <Link
              href={`/w/${workspaceSlug}/missions/new`}
              className="text-body text-ink-strong mt-4 inline-flex min-h-10 items-center gap-2 font-semibold"
            >
              {copy.createMission}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Panel>
        ) : null}
      </section>

      <section aria-labelledby="research-runs">
        <SectionHeader
          id="research-runs"
          title={copy.recentWork}
          action={
            <ResearchLiveRefresh
              active={hasActiveWork}
              activeLabel={copy.liveActive}
              idleLabel={copy.liveIdle}
              refreshLabel={copy.refresh}
              updatedLabel={copy.refreshedAt}
            />
          }
        />
        <div className="mt-3 space-y-3">
          {runs.length ? (
            runs.map((run) => (
              <Panel key={run.id} className="overflow-hidden">
                <div className="grid min-[980px]:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="min-w-0 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-eyebrow text-ink-muted">
                        {run.mission.referenceCode}
                      </p>
                      <StatusBadge
                        tone={statusTone(run.status)}
                        live={workerSignal(run) === "ACTIVE"}
                      >
                        {copy.statusLabels[run.status]}
                      </StatusBadge>
                    </div>
                    <h2 className="text-section-title text-ink-strong mt-3">
                      {run.question}
                    </h2>
                    <div className="text-meta text-ink-muted mt-4 flex flex-wrap gap-x-5 gap-y-2">
                      <span>{run.sources.length} {copy.source}</span>
                      <span>{run.findings.length} {copy.finding}</span>
                      <span className="tabular">{copy.updatedAt}: {formatDateTime(locale, run.updatedAt)}</span>
                    </div>
                  </div>
                  <aside className="border-line bg-surface-subtle border-t p-5 min-[980px]:border-t-0 min-[980px]:border-l">
                    <p className="text-meta text-ink-muted mb-4 flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${
                          workerSignal(run) === "ACTIVE"
                            ? "research-live-dot research-live-dot-success bg-success-600"
                            : workerSignal(run) === "STALLED" || workerSignal(run) === "WAITING"
                              ? "bg-warning-600"
                              : "bg-ink-faint"
                        }`}
                        aria-hidden="true"
                      />
                      {copy.workerSignal}: {copy.workerSignals[workerSignal(run)]}
                    </p>
                    <p className="text-eyebrow text-ink-muted">{copy.nextAction}</p>
                    <p className="text-body text-ink mt-2">{copy.nextActions[run.status]}</p>
                    {run.failureCode ? (
                      <p className="text-meta text-danger-700 dark:text-danger-300 mt-3 font-medium">
                        {copy.failureCode}: {run.failureCode}
                      </p>
                    ) : null}
                    {run.status === "APPROVED" && run.mathPilotCase && !run.mathPilotCase.assessment ? (
                      <Link
                        href={`/w/${workspaceSlug}/research/math-pilot?missionId=${encodeURIComponent(run.missionId)}`}
                        className="text-meta text-ink mt-4 inline-flex min-h-10 items-center gap-2 font-medium"
                      >
                        {copy.mathPilotAssessmentPending}
                        <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                      </Link>
                    ) : null}
                    {run.status === "APPROVED" && canAuthor && (!run.mathPilotCase || run.mathPilotCase.assessment) ? (
                      <div className="border-line mt-4 border-t pt-4">
                        <p className="text-meta text-ink-muted">{copy.importResearchHint}</p>
                        {run.documentId ? (
                          <form action={importApprovedResearchBundleAction} className="mt-3">
                            <input type="hidden" name="slug" value={workspaceSlug} />
                            <input type="hidden" name="locale" value={locale} />
                            <input type="hidden" name="runId" value={run.id} />
                            <input type="hidden" name="documentId" value={run.documentId} />
                            <Button type="submit" variant="primary" className="w-full">
                              {copy.importResearch}
                              <ArrowRight className="size-4" aria-hidden="true" />
                            </Button>
                          </form>
                        ) : targets.documents.some((document) => document.missionId === run.missionId) ? (
                          <form action={importApprovedResearchBundleAction} className="mt-3">
                            <input type="hidden" name="slug" value={workspaceSlug} />
                            <input type="hidden" name="locale" value={locale} />
                            <input type="hidden" name="runId" value={run.id} />
                            <label className="text-meta text-ink font-medium">
                              {copy.chooseTargetDocument}
                              <select name="documentId" required className={inputClass}>
                                {targets.documents
                                  .filter((document) => document.missionId === run.missionId)
                                  .map((document) => (
                                    <option key={document.id} value={document.id}>
                                      {document.documentKey} · {document.title}
                                    </option>
                                  ))}
                              </select>
                            </label>
                            <Button type="submit" variant="primary" className="mt-3 w-full">
                              {copy.importResearch}
                              <ArrowRight className="size-4" aria-hidden="true" />
                            </Button>
                          </form>
                        ) : (
                          <Link
                            href={`/w/${workspaceSlug}/authoring?missionId=${run.missionId}`}
                            className="text-body text-ink-strong mt-3 inline-flex min-h-10 items-center gap-2 font-semibold"
                          >
                            {copy.createTargetDocument}
                            <ArrowRight className="size-4" aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    ) : null}
                  </aside>
                </div>

                {run.sources.length ? (
                  <div className="border-line border-t p-5">
                    <p className="text-eyebrow text-ink-muted mb-3">{copy.provenance}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {run.sources.map((source) => (
                        <a
                          key={source.id}
                          href={source.canonicalUri}
                          target="_blank"
                          rel="noreferrer"
                          className="border-line hover:border-line-strong rounded-md border p-3 transition-colors"
                        >
                          <p className="text-body text-ink font-medium">{source.title}</p>
                          <p className="text-meta text-ink-muted mt-1">
                            {source.publisher} · {source.provenance}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}

                {run.findings.length ? (
                  <div className="border-line border-t p-5">
                    <div className="space-y-3">
                      {run.findings.map((finding) => (
                        <article key={finding.id} className="border-line rounded-md border p-4">
                          <div className="flex justify-between gap-3">
                            <p className="text-body text-ink-strong font-medium">{finding.claim}</p>
                            <span className="text-meta text-ink-muted">{finding.kind}</span>
                          </div>
                          {finding.exactExcerpt ? (
                            <blockquote className="text-meta text-ink-muted border-line mt-3 border-l-2 pl-3">
                              {finding.exactExcerpt}
                            </blockquote>
                          ) : null}
                          {finding.decision ? (
                            <p className="text-meta text-ink-muted mt-3">
                              {finding.decision.decision} · {finding.decision.rationale}
                            </p>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                {canReview &&
                run.status === "AWAITING_REVIEW" &&
                run.requestedByMembershipId !== data.ctx.membership.id ? (
                  <form action={reviewResearchRunAction} className="border-line bg-surface-subtle border-t p-5">
                    <input type="hidden" name="slug" value={workspaceSlug} />
                    <input type="hidden" name="runId" value={run.id} />
                    <SectionHeader title={copy.review} />
                    <div className="mt-3 space-y-3">
                      {run.findings.map((finding) => (
                        <div key={finding.id} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px]">
                          <input type="hidden" name="findingId" value={finding.id} />
                          <input
                            required
                            name={`rationale:${finding.id}`}
                            placeholder={copy.rationale}
                            className={inputClass}
                          />
                          <select name={`decision:${finding.id}`} className={inputClass}>
                            <option value="ACCEPTED">{copy.accept}</option>
                            <option value="REJECTED">{copy.reject}</option>
                            <option value="FLAGGED">{copy.flag}</option>
                          </select>
                        </div>
                      ))}
                    </div>
                    <textarea
                      name="runRationale"
                      required
                      placeholder={copy.rationale}
                      rows={2}
                      className={`${inputClass} mt-4`}
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button name="runDecision" value="APPROVED" type="submit" variant="primary">
                        {copy.approveRun}
                      </Button>
                      <Button name="runDecision" value="REJECTED" type="submit">
                        {copy.rejectRun}
                      </Button>
                    </div>
                  </form>
                ) : null}
              </Panel>
            ))
          ) : (
            <Panel className="flex min-h-36 flex-col items-center justify-center p-6 text-center">
              <p className="text-section-title text-ink">{copy.empty}</p>
              <p className="text-body text-ink-muted mt-2 max-w-xl">{copy.emptyHint}</p>
            </Panel>
          )}
        </div>
      </section>

      {canCompute && !expertMode ? (
        <div className="flex w-full justify-end">
          <Link
            href={`/w/${workspaceSlug}/research?${new URLSearchParams({
              ...(selectedMissionId ? { missionId: selectedMissionId } : {}),
              advanced: "1",
            }).toString()}#expert-tools`}
            className="text-meta text-ink-muted hover:text-ink inline-flex min-h-10 items-center gap-2 transition-colors"
          >
            <Settings2 className="size-4" aria-hidden="true" />
            <span>
              {copy.advancedTools}
              <span className="sr-only"> · {copy.advancedToolsHint}</span>
            </span>
          </Link>
        </div>
      ) : null}

      {canCompute && expertMode ? (
        <details className="group border-line bg-surface shadow-panel rounded-panel overflow-hidden border">
          <summary id="expert-tools" className="hover:bg-surface-subtle flex scroll-mt-24 cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors min-[980px]:px-7 [&::-webkit-details-marker]:hidden">
            <span className="flex min-w-0 items-center gap-3">
              <span className="border-line grid size-9 shrink-0 place-items-center rounded-md border">
                <FlaskConical className="text-ink-muted size-4" aria-hidden="true" />
              </span>
              <span>
                <span className="text-section-title text-ink block">{copy.sandbox}</span>
                <span className="text-meta text-ink-muted mt-1 block">{copy.sandboxSummary}</span>
              </span>
            </span>
            <ChevronDown className="text-ink-muted size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="border-line border-t p-5 min-[980px]:p-7">
            <p className="text-body text-ink-muted max-w-4xl">{copy.sandboxHint}</p>
            <form action={requestComputationRunAction} className="mt-5 grid gap-4 min-[900px]:grid-cols-2">
              <input type="hidden" name="slug" value={workspaceSlug} />
              <input type="hidden" name="idempotencyKey" value={`sandbox:${randomUUID()}`} />
              <label className="text-meta text-ink font-medium">
                {copy.mission}
                <select name="missionId" defaultValue={selectedMissionId} className={inputClass}>
                  {targets.missions.map((mission) => (
                    <option key={mission.id} value={mission.id}>{mission.referenceCode} · {mission.title}</option>
                  ))}
                </select>
              </label>
              <label className="text-meta text-ink font-medium">
                {copy.document}
                <select name="documentId" className={inputClass}>
                  <option value="">{copy.noDocument}</option>
                  {targets.documents.map((document) => (
                    <option key={document.id} value={document.id}>{document.documentKey} · {document.title}</option>
                  ))}
                </select>
              </label>
              <label className="text-meta text-ink font-medium">
                {copy.runtime}
                <span className="grid grid-cols-2 gap-2">
                  <input name="runtimeId" required defaultValue="jupyter-python" className={inputClass} />
                  <input name="runtimeVersion" required defaultValue="3.12" className={inputClass} />
                </span>
              </label>
              <label className="text-meta text-ink font-medium">
                {copy.computeKind}
                <select name="kind" className={inputClass}>
                  <option value="JUPYTER">Jupyter</option>
                  <option value="CAS">CAS</option>
                  <option value="LATEX_BUILD">LaTeX</option>
                </select>
              </label>
              <label className="text-meta text-ink font-medium">
                {copy.inputRef}
                <input name="inputReference" required placeholder="artifact://…" className={inputClass} />
              </label>
              <label className="text-meta text-ink font-medium">
                {copy.inputDigest}
                <input name="inputDigest" required pattern="[a-f0-9]{64}" className={inputClass} />
              </label>
              <label className="text-meta text-ink font-medium min-[900px]:col-span-2">
                {copy.entrypoint}
                <input name="entrypoint" required defaultValue="main.ipynb" className={inputClass} />
              </label>
              <input type="hidden" name="maxCpuMillis" value="120000" />
              <input type="hidden" name="maxWallSeconds" value="300" />
              <input type="hidden" name="maxMemoryMb" value="1024" />
              <input type="hidden" name="maxOutputBytes" value="10000000" />
              <div className="min-[900px]:col-span-2">
                <Button type="submit" variant="primary">{copy.requestCompute}</Button>
              </div>
            </form>

            {computations.length ? (
              <div className="border-line mt-6 divide-y divide-line border-y">
                {computations.map((run) => (
                  <div key={run.id} className="py-4">
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <p className="text-body text-ink-strong font-medium">{run.kind} · {run.runtimeId}/{run.runtimeVersion}</p>
                        <p className="text-meta text-ink-muted mt-1">{run.mission.referenceCode} · {copy.networkDenied} · {run.outputBytes ?? 0} bytes</p>
                      </div>
                      <StatusBadge tone={statusTone(run.status)}>{copy.statusLabels[run.status]}</StatusBadge>
                    </div>
                    {canReview && run.status === "AWAITING_REVIEW" && run.requestedByMembershipId !== data.ctx.membership.id ? (
                      <form action={reviewComputationRunAction} className="mt-3 flex flex-wrap gap-2">
                        <input type="hidden" name="slug" value={workspaceSlug} />
                        <input type="hidden" name="runId" value={run.id} />
                        <input name="rationale" required placeholder={copy.rationale} className={`${inputClass} !mt-0 flex-1`} />
                        <Button name="decision" value="APPROVED" type="submit" variant="primary">
                          <CheckCircle2 className="size-4" />{copy.accept}
                        </Button>
                        <Button name="decision" value="REJECTED" type="submit">{copy.reject}</Button>
                      </form>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </details>
      ) : null}
    </WorkspaceShell>
  );
}
