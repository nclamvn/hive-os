import { randomUUID } from "node:crypto";

import { notFound } from "next/navigation";
import { CheckCircle2, Clock3 } from "lucide-react";

import {
  requestComputationRunAction,
  requestResearchRunAction,
  reviewComputationRunAction,
  reviewResearchRunAction,
} from "@/app/actions/research-sandbox";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { getResearchCopy } from "@/i18n/research-copy";
import { getTranslator } from "@/i18n/server";
import { hasCapability } from "@/modules/identity-workspace";
import {
  listComputationRuns,
  listResearchRuns,
  listResearchTargets,
} from "@/modules/research-sandbox";
import { loadWorkspacePage } from "@/server/auth/workspace-page";

export const dynamic = "force-dynamic";

const inputClass = "text-body text-ink border-line mt-1 min-h-10 w-full rounded-md border bg-surface px-3 py-2 outline-none focus:border-line-strong";

function statusTone(status: string) {
  if (status === "APPROVED") return "text-emerald-700 dark:text-emerald-300";
  if (["FAILED", "REJECTED", "CANCELLED"].includes(status)) return "text-red-700 dark:text-red-300";
  if (status === "AWAITING_REVIEW") return "text-amber-700 dark:text-amber-300";
  return "text-ink-muted";
}

export default async function ResearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<{ missionId?: string }>;
}) {
  const [{ workspaceSlug }, query] = await Promise.all([params, searchParams]);
  const data = await loadWorkspacePage(workspaceSlug);
  const { locale } = await getTranslator();
  const copy = getResearchCopy(locale);
  if (!hasCapability(data.ctx.membership.role, "research.read")) notFound();
  const [runs, computations, targets] = await Promise.all([
    listResearchRuns(data.ctx),
    listComputationRuns(data.ctx),
    listResearchTargets(data.ctx),
  ]);
  const canRequest = hasCapability(data.ctx.membership.role, "research.request");
  const canReview = hasCapability(data.ctx.membership.role, "research.review");
  const canCompute = hasCapability(data.ctx.membership.role, "sandbox.request");
  const selectedMissionId = targets.missions.some(
    (mission) => mission.id === query.missionId,
  )
    ? query.missionId
    : undefined;

  return (
    <WorkspaceShell data={data} title={copy.title} subtitle={copy.subtitle}>
      <Panel className="overflow-hidden">
        <div className="grid gap-6 p-5 min-[980px]:grid-cols-[minmax(0,1fr)_380px] min-[980px]:p-7">
          <div>
            <p className="text-eyebrow text-ink-muted">{copy.eyebrow}</p>
            <h1 className="text-thesis text-ink-strong mt-3 max-w-4xl">{copy.thesis}</h1>
            <p className="text-body text-ink-muted mt-4 max-w-3xl">{copy.hint}</p>
            <ol className="border-line mt-6 grid border-y sm:grid-cols-4" aria-label={copy.provenance}>
              {copy.stages.map((stage, index) => (
                <li key={stage} className="border-line relative py-4 sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0">
                  <span className="text-meta text-ink-muted font-medium tabular">0{index + 1}</span>
                  <p className="text-meta text-ink-strong mt-2 font-semibold">{stage}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="border-line bg-surface-subtle rounded-lg border p-4">
            <div className="flex gap-3"><Clock3 className="text-ink-muted mt-0.5 size-4 shrink-0" /><div><p className="text-meta text-ink-strong font-semibold tabular">{runs.length} · {computations.length}</p><p className="text-meta text-ink-muted mt-1">{copy.workerNotice}</p></div></div>
          </div>
        </div>
      </Panel>

      {canRequest ? (
        <Panel className="p-5 min-[980px]:p-7">
          <SectionHeader title={copy.newResearch} />
          <form action={requestResearchRunAction} className="mt-4 grid gap-4 min-[900px]:grid-cols-2">
            <input type="hidden" name="slug" value={workspaceSlug} />
            <input type="hidden" name="idempotencyKey" value={`research:${randomUUID()}`} />
            <label className="text-meta text-ink font-medium">{copy.mission}<select name="missionId" required defaultValue={selectedMissionId} className={inputClass}>{targets.missions.map((mission) => <option key={mission.id} value={mission.id}>{mission.referenceCode} · {mission.title}</option>)}</select></label>
            <label className="text-meta text-ink font-medium">{copy.document}<select name="documentId" className={inputClass}><option value="">{copy.noDocument}</option>{targets.documents.map((document) => <option key={document.id} value={document.id}>{document.documentKey} · {document.title}</option>)}</select></label>
            <label className="text-meta text-ink font-medium min-[900px]:col-span-2">{copy.question}<textarea name="question" required rows={3} maxLength={8000} className={inputClass} /></label>
            <label className="text-meta text-ink font-medium min-[900px]:col-span-2">{copy.scope}<textarea name="scope" required rows={3} maxLength={8000} className={inputClass} /></label>
            <label className="text-meta text-ink font-medium">{copy.provider}<input name="providerName" required defaultValue="openai" className={inputClass} /></label>
            <label className="text-meta text-ink font-medium">{copy.model}<input name="modelName" required defaultValue="gpt-5.6-sol" className={inputClass} /></label>
            <label className="text-meta text-ink font-medium min-[900px]:col-span-2">{copy.queries}<textarea name="queries" required rows={3} className={inputClass} /></label>
            <label className="text-meta text-ink font-medium">{copy.allowedDomains}<textarea name="allowedDomains" rows={3} className={inputClass} /></label>
            <label className="text-meta text-ink font-medium">{copy.primaryDomains}<textarea name="primaryDomains" rows={3} className={inputClass} /></label>
            <label className="text-meta text-ink font-medium">{copy.maxSources}<input name="maxSources" type="number" min={1} max={50} defaultValue={20} className={inputClass} /></label>
            <label className="text-body text-ink flex items-center gap-2 self-end pb-2"><input name="requirePrimary" type="checkbox" />{copy.requirePrimary}</label>
            <div className="min-[900px]:col-span-2"><Button type="submit" variant="primary">{copy.queue}</Button></div>
          </form>
        </Panel>
      ) : null}

      <section aria-labelledby="research-runs">
        <SectionHeader id="research-runs" title={copy.runs} />
        <div className="mt-3 space-y-3">
          {runs.length ? runs.map((run) => (
            <Panel key={run.id} className="overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div className="min-w-0"><p className="text-eyebrow text-ink-muted">{run.mission.referenceCode} · {run.providerName}/{run.modelName}</p><h2 className="text-section-title text-ink-strong mt-2">{run.question}</h2><p className="text-body text-ink-muted mt-2 line-clamp-2">{run.scope}</p></div>
                <span className={`text-meta font-semibold ${statusTone(run.status)}`}>{copy.status}: {run.status}</span>
              </div>
              <div className="border-line grid border-t sm:grid-cols-3">
                <div className="p-4 sm:border-r sm:border-line"><p className="text-meta text-ink-muted">{run.sources.length} {copy.source}</p></div>
                <div className="p-4 sm:border-r sm:border-line"><p className="text-meta text-ink-muted">{run.findings.length} {copy.finding}</p></div>
                <div className="p-4"><p className="text-meta text-ink-muted tabular">{run.approvedDigest ? run.approvedDigest.slice(0, 16) + "…" : "Digest pending"}</p></div>
              </div>
              {run.sources.length ? <div className="border-line border-t p-5"><p className="text-eyebrow text-ink-muted mb-3">{copy.provenance}</p><div className="grid gap-2 sm:grid-cols-2">{run.sources.map((source) => <a key={source.id} href={source.canonicalUri} target="_blank" rel="noreferrer" className="border-line hover:border-line-strong rounded-md border p-3"><p className="text-body text-ink font-medium">{source.title}</p><p className="text-meta text-ink-muted mt-1">{source.publisher} · {source.provenance}</p></a>)}</div></div> : null}
              {run.findings.length ? <div className="border-line border-t p-5"><div className="space-y-3">{run.findings.map((finding) => <article key={finding.id} className="border-line rounded-md border p-4"><div className="flex justify-between gap-3"><p className="text-body text-ink-strong font-medium">{finding.claim}</p><span className="text-meta text-ink-muted">{finding.kind}</span></div>{finding.exactExcerpt ? <blockquote className="text-meta text-ink-muted border-line mt-3 border-l-2 pl-3">{finding.exactExcerpt}</blockquote> : null}{finding.decision ? <p className="text-meta text-ink-muted mt-3">{finding.decision.decision} · {finding.decision.rationale}</p> : null}</article>)}</div></div> : null}
              {canReview && run.status === "AWAITING_REVIEW" && run.requestedByMembershipId !== data.ctx.membership.id ? (
                <form action={reviewResearchRunAction} className="border-line bg-surface-subtle border-t p-5">
                  <input type="hidden" name="slug" value={workspaceSlug} /><input type="hidden" name="runId" value={run.id} />
                  <SectionHeader title={copy.review} />
                  <div className="mt-3 space-y-3">{run.findings.map((finding) => <div key={finding.id} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px]"><input type="hidden" name="findingId" value={finding.id} /><input required name={`rationale:${finding.id}`} placeholder={copy.rationale} className={inputClass} /><select name={`decision:${finding.id}`} className={inputClass}><option value="ACCEPTED">{copy.accept}</option><option value="REJECTED">{copy.reject}</option><option value="FLAGGED">{copy.flag}</option></select></div>)}</div>
                  <textarea name="runRationale" required placeholder={copy.rationale} rows={2} className={`${inputClass} mt-4`} />
                  <div className="mt-3 flex flex-wrap gap-2"><Button name="runDecision" value="APPROVED" type="submit" variant="primary">{copy.approveRun}</Button><Button name="runDecision" value="REJECTED" type="submit">{copy.rejectRun}</Button></div>
                </form>
              ) : null}
            </Panel>
          )) : <Panel className="flex min-h-40 items-center justify-center p-6"><p className="text-body text-ink-muted">{copy.empty}</p></Panel>}
        </div>
      </section>

      {canCompute ? (
        <Panel className="p-5 min-[980px]:p-7">
          <SectionHeader title={copy.sandbox} />
          <p className="text-body text-ink-muted mt-2">{copy.sandboxHint}</p>
          <form action={requestComputationRunAction} className="mt-4 grid gap-4 min-[900px]:grid-cols-2">
            <input type="hidden" name="slug" value={workspaceSlug} /><input type="hidden" name="idempotencyKey" value={`sandbox:${randomUUID()}`} />
            <label className="text-meta text-ink font-medium">{copy.mission}<select name="missionId" defaultValue={selectedMissionId} className={inputClass}>{targets.missions.map((mission) => <option key={mission.id} value={mission.id}>{mission.referenceCode} · {mission.title}</option>)}</select></label>
            <label className="text-meta text-ink font-medium">{copy.document}<select name="documentId" className={inputClass}><option value="">{copy.noDocument}</option>{targets.documents.map((document) => <option key={document.id} value={document.id}>{document.documentKey} · {document.title}</option>)}</select></label>
            <label className="text-meta text-ink font-medium">{copy.runtime}<div className="grid grid-cols-2 gap-2"><input name="runtimeId" required defaultValue="jupyter-python" className={inputClass} /><input name="runtimeVersion" required defaultValue="3.12" className={inputClass} /></div></label>
            <label className="text-meta text-ink font-medium">Kind<select name="kind" className={inputClass}><option value="JUPYTER">Jupyter</option><option value="CAS">CAS</option><option value="LATEX_BUILD">LaTeX</option></select></label>
            <label className="text-meta text-ink font-medium">{copy.inputRef}<input name="inputReference" required placeholder="s3://… or artifact://…" className={inputClass} /></label>
            <label className="text-meta text-ink font-medium">{copy.inputDigest}<input name="inputDigest" required pattern="[a-f0-9]{64}" className={inputClass} /></label>
            <label className="text-meta text-ink font-medium min-[900px]:col-span-2">{copy.entrypoint}<input name="entrypoint" required defaultValue="main.ipynb" className={inputClass} /></label>
            <input type="hidden" name="maxCpuMillis" value="120000" /><input type="hidden" name="maxWallSeconds" value="300" /><input type="hidden" name="maxMemoryMb" value="1024" /><input type="hidden" name="maxOutputBytes" value="10000000" />
            <div className="min-[900px]:col-span-2"><Button type="submit" variant="primary">{copy.requestCompute}</Button></div>
          </form>
          {computations.length ? <div className="border-line mt-6 divide-y divide-line border-y">{computations.map((run) => <div key={run.id} className="py-4"><div className="flex flex-wrap justify-between gap-3"><div><p className="text-body text-ink-strong font-medium">{run.kind} · {run.runtimeId}/{run.runtimeVersion}</p><p className="text-meta text-ink-muted mt-1">{run.mission.referenceCode} · DENY_ALL · {run.outputBytes ?? 0} bytes</p></div><span className={`text-meta font-semibold ${statusTone(run.status)}`}>{run.status}</span></div>{canReview && run.status === "AWAITING_REVIEW" && run.requestedByMembershipId !== data.ctx.membership.id ? <form action={reviewComputationRunAction} className="mt-3 flex flex-wrap gap-2"><input type="hidden" name="slug" value={workspaceSlug} /><input type="hidden" name="runId" value={run.id} /><input name="rationale" required placeholder={copy.rationale} className={`${inputClass} !mt-0 flex-1`} /><Button name="decision" value="APPROVED" type="submit" variant="primary"><CheckCircle2 className="size-4" />{copy.accept}</Button><Button name="decision" value="REJECTED" type="submit">{copy.reject}</Button></form> : null}</div>)}</div> : null}
        </Panel>
      ) : null}
    </WorkspaceShell>
  );
}
