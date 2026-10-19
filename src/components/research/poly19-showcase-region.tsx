import { randomUUID } from "node:crypto";
import Link from "next/link";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import type { Locale } from "@/i18n/config";
import { getPoly19ShowcaseCopy } from "@/i18n/poly19-showcase-copy";
import { getPoly19Readiness,getPoly19Showcase,isShowcaseAvailable,listPoly19Showcases } from "@/modules/research-showcase";
import { requestEngineeringPoly19Action,requestNativePoly19Action,revokePoly19Action } from "@/app/actions/research-showcase";
import { Button } from "@/components/ui/button";
import { Panel,SectionHeader } from "@/components/ui/panel";
import { Poly19ProofPanel } from "./poly19-proof-panel";
import { projectPoly19Showcase } from "./poly19-showcase-presentation";
import { ResearchLiveRefresh } from "./research-live-refresh";

export async function Poly19ShowcaseRegion({ctx,locale,workspaceSlug,missionId,runId,canRequest,canReview,compact=false,actionRefused=false}:{ctx:WorkspaceContext;locale:Locale;workspaceSlug:string;missionId?:string;runId?:string;canRequest:boolean;canReview:boolean;compact?:boolean;actionRefused?:boolean}) {
  const c=getPoly19ShowcaseCopy(locale),base=`/w/${workspaceSlug}/research/poly19`;
  if(!isShowcaseAvailable()) return <Panel id="poly19-showcase" className="min-w-0 scroll-mt-24 p-5"><SectionHeader title={c.compactTitle}/><p className="text-body text-ink mt-3">{c.inactive}</p><p className="text-meta text-ink-muted mt-2 max-w-[75ch]">{c.inactiveHint}</p><p className="text-meta text-ink-muted mt-2 max-w-[75ch]">{c.blocked}</p></Panel>;
  let records:Awaited<ReturnType<typeof listPoly19Showcases>>=[],view:ReturnType<typeof projectPoly19Showcase>|null=null,invalid=false,engineeringReady=false;
  try {
    if(missionId) {
      records=await listPoly19Showcases(ctx,missionId);
      if(canRequest&&canReview) engineeringReady=(await getPoly19Readiness(ctx,missionId)).engineeringReady;
      const selected=runId?records.find(r=>r.runId===runId):records[0];
      if(selected) {const current=await getPoly19Showcase(ctx,selected.runId);if(current.missionId!==missionId) throw new Error("SHOWCASE_MISSION_REFUSED");view=projectPoly19Showcase(current);}
    }
  } catch {invalid=true;}
  const href=(id?:string)=>`${base}?${new URLSearchParams({...missionId?{missionId}:{},...id?{runId:id}:{}})}#poly19-showcase`;
  const controls=<>
    {actionRefused?<p role="alert" className="text-meta text-ink mb-4">{c.refused}</p>:null}
    {invalid?<p role="alert" className="text-meta text-ink mb-4">{c.invalid}</p>:runId&&!view?<p role="alert" className="text-meta text-ink mb-4">{c.badSelection}</p>:null}
    {records.length?<nav aria-label={c.select} className="mb-4 flex min-w-0 flex-wrap gap-2">{records.map(r=><Link key={r.runId} href={href(r.runId)} aria-current={view?.runId===r.runId?"page":undefined} className="border-line text-meta text-ink min-h-10 max-w-full break-all rounded-sm border px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{r.runId.slice(0,8)} · {r.provenance}</Link>)}</nav>:null}
    <p className="text-meta text-ink-muted max-w-[80ch]">{c.resources}: {c.envelope}</p>
    {canRequest&&canReview&&missionId&&!invalid?<div className="mt-4 flex flex-wrap items-start gap-4"><form action={requestNativePoly19Action}><input type="hidden" name="slug" value={workspaceSlug}/><input type="hidden" name="missionId" value={missionId}/><Button type="submit" disabled title={c.blocked}>{c.start}</Button></form><form action={requestEngineeringPoly19Action} className="min-w-0 max-w-[70ch]"><input type="hidden" name="slug" value={workspaceSlug}/><input type="hidden" name="missionId" value={missionId}/><input type="hidden" name="idempotencyKey" value={`poly19:${randomUUID()}`}/><label className="text-meta text-ink flex items-start gap-2"><input type="checkbox" name="confirmed" value="yes" required disabled={!engineeringReady} className="mt-1 size-4 shrink-0 focus-visible:outline focus-visible:outline-2"/>{c.confirm}</label><Button type="submit" variant="secondary" disabled={!engineeringReady} className="mt-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{c.control}</Button><p className="text-meta text-ink-muted mt-2">{c.controlHint}</p>{!engineeringReady?<p className="text-meta text-ink-muted mt-2">{c.readiness}</p>:null}</form></div>:null}
    {view&&view.canRevoke&&canReview&&missionId?<form action={revokePoly19Action} className="mt-4"><input type="hidden" name="slug" value={workspaceSlug}/><input type="hidden" name="missionId" value={missionId}/><input type="hidden" name="runId" value={view.runId}/><input type="hidden" name="expectedVersion" value={view.version}/><input type="hidden" name="idempotencyKey" value={`poly19-revoke:${randomUUID()}`}/><Button type="submit" variant="secondary">{c.revoke}</Button></form>:null}
    <p className="text-meta text-ink-muted mt-3 max-w-[80ch]">{c.readiness}</p>
    {compact?<Link href={href(view?.runId)} className="text-meta text-ink mt-3 inline-flex min-h-10 items-center underline underline-offset-4 focus-visible:outline focus-visible:outline-2">{c.open}</Link>:<ResearchLiveRefresh active={!!view&&["QUEUED","RUNNING","VERIFYING"].includes(view.status)} activeLabel={c.state} idleLabel={c.run} refreshLabel={c.open} updatedLabel=""/>}
  </>;
  return <div data-poly19-run-id={view?.runId??""}><Poly19ProofPanel locale={locale} view={invalid?null:view} compact={compact} controls={controls} exportBase={view?`/api/w/${workspaceSlug}/research/poly19/${view.runId}/export`:undefined}/></div>;
}
