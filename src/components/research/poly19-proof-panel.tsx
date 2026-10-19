import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { getPoly19ShowcaseCopy } from "@/i18n/poly19-showcase-copy";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { MathText } from "./math-text";

export type Poly19StageKey = "ATTEMPT" | "CRITIC" | "FINAL" | "EXACT_REPLAY" | "POSTREVIEW";
export interface Poly19RolePresentation {
  role: "ATTEMPT" | "CRITIC" | "FINAL" | "POSTREVIEW";
  status: string; original: string | null; digest: string | null;
  requestedModel: string; servedModel: string | null; threadId: string | null;
  inputTokens: number | null; outputTokens: number | null; elapsedSeconds: number | null;
}
/** Pure observation only. Populated exclusively from the authenticated A service. */
export interface Poly19ProofPresentation {
  runId: string; missionId: string; version: number;
  provenance: "LIVE_NATIVE" | "ENGINEERING_ONLY" | "IMPORTED_REPLAY";
  status: string; sourceDigest: string; eventCut: string; canRevoke: boolean;
  stages: Array<{key: Poly19StageKey; status: string}>;
  roles: Poly19RolePresentation[];
  exact: {status: string; assumptions: string[]; operations: number | null; elapsedSeconds: number | null} | null;
  fault: {status: string; originalDigest: string; changedDigest: string} | null;
  reservedRequests: number; nextAction: string | null;
  proofText: string | null; informalStatus: string | null; certificateJson: string | null;
}

const linkClass="text-meta text-ink min-h-10 inline-flex items-center underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
export function Poly19ProofPanel({locale,view,controls,exportBase,compact=false}:{locale:Locale;view:Poly19ProofPresentation|null;controls?:ReactNode;exportBase?:string;compact?:boolean}) {
  const c=getPoly19ShowcaseCopy(locale),final=view?.roles.find(r=>r.role==="FINAL" && r.original!==null),attempt=view?.roles.find(r=>r.role==="ATTEMPT" && r.original!==null);
  const displayed=final??attempt,review=view?.roles.find(r=>r.role==="POSTREVIEW" && r.original!==null);
  return <Panel id="poly19-showcase" role="region" aria-label={c.compactTitle} className="min-w-0 scroll-mt-24 overflow-hidden">
    <header className="border-line border-b px-5 py-6 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-3"><h2 className="text-section-title text-ink-strong max-w-[32ch]">{compact?c.compactTitle:c.title}</h2>{view?<StatusBadge tone={view.provenance==="LIVE_NATIVE"?"info":"neutral"}>{view.provenance}</StatusBadge>:null}</div>
      {!compact?<p className="text-body text-ink-muted mt-3 max-w-[70ch]">{c.subtitle}</p>:null}
      <p className="text-meta text-ink-muted mt-3 max-w-[80ch]">{c.exposure}</p>
      <details className="text-meta text-ink-muted mt-4"><summary className="text-ink min-h-10 cursor-pointer focus-visible:outline focus-visible:outline-2">{c.source}</summary><p className="text-body text-ink mt-3 max-w-[70ch]">{c.task}</p><a className={linkClass} href="https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems" rel="noreferrer" target="_blank">{c.sourceLink}</a><p data-poly19-task-clauses className="mt-2 flex max-w-[70ch] flex-wrap gap-x-3 gap-y-2"><MathText text={String.raw`\(\deg p=19\)`}/>{" "}<MathText text={String.raw`\(p(-x)=-p(x)\)`}/>{" "}<MathText text={String.raw`\([x]p=-19\)`}/>{" "}<MathText text={String.raw`\([x^{19}]p=1\)`}/></p></details>
      <p role="status" className="text-meta text-ink border-warning-600 mt-4 max-w-[80ch] border-l-2 pl-3">{c.blocked}</p>
      {view?<p className="text-meta text-ink-muted mt-3 break-words">{view.provenance==="IMPORTED_REPLAY"?c.importedHint:view.provenance==="ENGINEERING_ONLY"?c.controlHint:c.liveHint}</p>:null}
      {controls?<div className="mt-5">{controls}</div>:null}
    </header>
    {view?<>
      <div className="border-line border-b px-5 py-4 sm:px-8"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-body text-ink font-semibold">{c.timeline}</h3><StatusBadge tone={view.status.includes("PAUSED")?"warning":"neutral"}>{view.status}</StatusBadge></div>
        <ol className="mt-4 grid min-w-0 gap-3 sm:grid-cols-5" aria-label={c.timeline}>{view.stages.map(s=><li key={s.key} data-stage={s.key} className="border-line min-w-0 border-l-2 pl-3"><p className="text-meta text-ink font-medium">{c[s.key]}</p><p className="text-meta text-ink-muted mt-1 break-words">{s.status}</p></li>)}</ol>
        {view.status.includes("PAUSED")?<p role="alert" className="text-meta text-ink mt-4 max-w-[75ch]">{c.paused}</p>:null}{view.nextAction?<p className="text-meta text-ink-muted mt-3 break-words">{view.nextAction}</p>:null}
      </div>
      {!compact?<div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <article className="min-w-0 px-5 py-6 sm:px-8" data-original-role={displayed?.role??"NONE"}>
          <h3 className="text-body text-ink-strong font-semibold">{c.proof}</h3>
          {!final?<p className="text-meta text-ink-muted mt-3 max-w-[75ch]">{c.provisional}</p>:null}
          {displayed?<><p className="text-meta text-ink-muted mt-2">{c[displayed.role]}</p><div className="math-proof-body text-body text-ink mt-5 max-w-[75ch] whitespace-pre-wrap break-words leading-7"><MathText text={final && view.proofText!==null?view.proofText:displayed.original!}/></div><p className="text-meta text-ink-muted mt-5 break-all">{c.checksum}: {displayed.digest??c.unknown}</p></>:<p className="text-body text-ink-muted mt-5 max-w-[65ch]">{c.noProof}</p>}
          {view.roles.filter(r=>r.original!==null).map(r=><details key={r.role} className="border-line mt-6 min-w-0 border-t pt-4"><summary className="text-meta text-ink min-h-10 cursor-pointer focus-visible:outline focus-visible:outline-2">{c.raw}: {c[r.role]}</summary><div className="math-proof-body text-body text-ink mt-3 max-w-[75ch] whitespace-pre-wrap break-words leading-7"><MathText text={r.original!}/></div><p className="text-meta text-ink-muted mt-3 break-all">{r.digest??c.unknown}</p></details>)}
        </article>
        <aside className="border-line bg-surface-subtle min-w-0 border-t px-5 py-6 lg:border-l lg:border-t-0" aria-label={c.exact}>
          <section><h3 className="text-body text-ink font-semibold">{c.exact}</h3><p className="text-meta text-ink mt-3 break-words" data-exact-status={view.exact?.status??"NOT_RETAINED"}>{view.exact?.status??c.noExact}</p><p className="text-meta text-ink-muted mt-3 max-w-[65ch]">{c.ceiling}</p>{view.exact?<details className="mt-3"><summary className="text-meta text-ink min-h-10 cursor-pointer focus-visible:outline focus-visible:outline-2">{c.assumptions}</summary><ul className="text-meta text-ink-muted mt-2 list-disc space-y-2 pl-4">{view.exact.assumptions.map(a=><li key={a} className="break-words"><MathText text={a}/></li>)}</ul><p className="text-meta text-ink-muted mt-3">{view.exact.operations??c.unknown} ops / {view.exact.elapsedSeconds??c.unknown}s</p></details>:null}</section>
          <section className="border-line mt-6 border-t pt-5"><h3 className="text-body text-ink font-semibold">{c.informal}</h3><p className="text-meta text-ink-muted mt-3">{view.informalStatus??review?.status??c.noReview}</p></section>
          <section className="border-line mt-6 border-t pt-5"><h3 className="text-body text-ink font-semibold">{c.usage}</h3><p className="text-meta text-ink-muted mt-2">{c.reserved}: {view.reservedRequests}</p><dl className="text-meta mt-3 space-y-3">{view.roles.map(r=><div key={r.role}><dt className="text-ink">{c[r.role]}</dt><dd className="text-ink-muted mt-1 break-words">{c.input}: {r.inputTokens??c.unknown}<br/>{c.output}: {r.outputTokens??c.unknown}<br/>{c.elapsed}: {r.elapsedSeconds??c.unknown}<br/>{c.model}: {r.requestedModel}<br/>{c.actualModel}: {r.servedModel??c.unknown}</dd></div>)}</dl><p className="text-meta text-ink-muted mt-4">{c.currency}: {c.unknown}<br/>{c.hidden}: {c.unknown}</p></section>
        </aside>
      </div>:<div className="px-5 py-5 sm:px-8"><p className="text-meta text-ink break-words">{c.exact}: {view.exact?.status??c.noExact}</p><p className="text-meta text-ink-muted mt-2">{c.informal}: {view.informalStatus??c.noReview}</p></div>}
      {!compact?<section className="border-line border-t px-5 py-5 sm:px-8" aria-label={c.fault}><div className="flex flex-wrap items-center gap-3"><h3 className="text-body text-ink font-semibold">{c.fault}</h3><StatusBadge>ENGINEERING_ONLY</StatusBadge></div><p className="text-meta text-ink-muted mt-3 max-w-[85ch]">{c.faultHint}</p><p className="text-meta text-ink mt-3" data-fault-status={view.fault?.status??"NOT_RETAINED"}>{view.fault?.status??c.noFault}</p>{view.fault?<details className="text-meta text-ink-muted mt-3"><summary className="text-ink min-h-10 cursor-pointer focus-visible:outline focus-visible:outline-2">{c.audit}</summary><p className="mt-2 break-all">{view.fault.originalDigest}</p><p className="mt-2 break-all">{view.fault.changedDigest}</p></details>:null}</section>:null}
      <details className="border-line text-meta border-t px-5 py-5 sm:px-8"><summary className="text-ink min-h-10 cursor-pointer focus-visible:outline focus-visible:outline-2">{c.audit}</summary><dl className="text-ink-muted mt-3 space-y-3">{[[c.run,view.runId],[c.sourceDigest,view.sourceDigest],[c.eventCut,view.eventCut]].map(([label,value])=><div key={label}><dt>{label}</dt><dd className="text-ink mt-1 break-all">{value}</dd></div>)}</dl>{exportBase?<div className="mt-4 flex flex-wrap gap-x-5"><a href={`${exportBase}?format=json`} className={linkClass}>{c.exportJson}</a>{final?<a href={`${exportBase}?format=text`} className={linkClass}>{c.exportText}</a>:null}</div>:null}<p className="text-meta text-ink-muted mt-4 max-w-[75ch]">{c.noRetry}</p></details>
    </>:<div className="px-5 py-6 sm:px-8"><p className="text-body text-ink-muted">{c.missing}</p><p className="text-meta text-ink-muted mt-3 max-w-[80ch]">{c.noProof}</p></div>}
  </Panel>;
}
