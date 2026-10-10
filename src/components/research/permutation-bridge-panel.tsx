import {createHash} from "node:crypto";
import type {ReactNode} from "react";
import type {Locale} from "@/i18n/config";
import {getPermutationBridgeCopy} from "@/i18n/permutation-bridge-copy";
import type {BridgeView} from "@/modules/permutation-bridge";
import {Panel} from "@/components/ui/panel";
import {StatusBadge} from "@/components/ui/status-badge";
import {MathText} from "./math-text";
import {permutationFinalSchema} from "@/modules/permutation-bridge/checker";
import {boundedJson} from "@/modules/research-sandbox/research-core-v3/bounded-json";
import {assertNoCredentialMaterial} from "@/modules/execution-fabric/contracts";
import katex from "katex";

// Public fixed task only, not an original/candidate renderer. The labelled parent
// owns horizontal scrolling; no nested shared .math-tex-inline scroll regions.
const taskFormula=[String.raw`n=10^{12},\quad F(\varnothing)=\varnothing`,String.raw`F(LmR)=F(L)F(R)m`,String.raw`X=\mathbb E\!\left[\sum_{i=1}^{n-1}\mathbf 1\{\operatorname{pos}_{F(\sigma)}(i+1)<\operatorname{pos}_{F(\sigma)}(i)\}\right]`];
function FixedTaskFormula() {return <>{taskFormula.map((tex,i)=><span key={tex}><span className="inline-block whitespace-nowrap" dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{displayMode:false,output:"htmlAndMathml",trust:false,strict:"error",throwOnError:true,maxExpand:100,maxSize:10})}}/>{i<taskFormula.length-1?<br/>:null}</span>)}</>;}

export function PermutationBridgePanel({locale,view,controls,exportBase,unavailable=false,invalid=false}:{locale:Locale;view:BridgeView|null;controls?:ReactNode;exportBase?:string;unavailable?:boolean;invalid?:boolean}) {
  const c=getPermutationBridgeCopy(locale);
  const seals=view?.originals.every(o=>{if(o.text===null)return true;try{assertNoCredentialMaterial(o.text.replace(/\\u([a-f0-9]{4})/gi,(_,hex:string)=>String.fromCharCode(parseInt(hex,16))));return Buffer.byteLength(o.text)<=32768&&Buffer.byteLength(o.text)===o.bytes&&createHash("sha256").update(o.text).digest("hex")===o.digest;}catch{return false;}});
  const shown=!invalid&&seals?view:null;
  const order=["ATTEMPT","CRITIC","FINAL","CHECKER","POSTREVIEW"] as const;
  const link="text-meta text-ink min-h-10 inline-flex items-center underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return <Panel id="permutation-bridge" role="region" aria-label={c.title} className="min-w-0 scroll-mt-24 overflow-hidden">
    <header className="border-line border-b px-5 py-6 sm:px-8"><div className="flex flex-wrap items-start justify-between gap-3"><h2 className="text-section-title text-ink-strong max-w-[36ch]">{c.title}</h2><StatusBadge>CODEX_ASSISTED</StatusBadge></div>
      <p className="text-meta text-ink-muted mt-4 max-w-[80ch]">{c.disclosure}</p>
      <div tabIndex={0} role="region" aria-label={locale==="vi"?"Công thức hoán vị cố định":"Fixed permutation formula"} className="text-body text-ink mt-5 max-w-full overflow-x-auto p-1 focus-visible:outline focus-visible:outline-2"><FixedTaskFormula/></div>
      <p className="text-body text-ink mt-4 max-w-[75ch]">{c.task}</p><a href="https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems#tier-2" target="_blank" rel="noreferrer" className={link}>Epoch AI · FrontierMath Tier 2</a>
      {unavailable?<p role="status" className="text-meta text-ink mt-4 max-w-[75ch]">{c.inactive}</p>:null}
      {invalid||view&&!seals?<p role="alert" className="text-meta text-ink mt-4 max-w-[75ch]">{c.invalid}</p>:null}
      {shown?.state.status==="DRAFT"?<p role="status" className="text-body text-ink border-warning-600 mt-5 border-l-2 pl-3">{c.draft}</p>:null}
      {controls&&!invalid&&(!view||seals)?<div className="mt-5">{controls}</div>:null}
    </header>
    {shown?<>
      <section className="border-line border-b px-5 py-5 sm:px-8"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-body text-ink font-semibold">{c.timeline}</h3><StatusBadge>{shown.state.status}</StatusBadge></div>
        <ol className="mt-4 grid min-w-0 gap-3 sm:grid-cols-5" aria-label={c.timeline}>{order.map(role=>{const stage=role==="CHECKER"?null:shown.state.stages.find(s=>s.role===role);const status=role==="CHECKER"?shown.checker?.status??c.noCheck:stage?.original?stage.original.accepted?c.retained:c.rejected:stage?c.reserved:c.notReserved;return <li key={role} data-bridge-stage={role} className="border-line min-w-0 border-l-2 pl-3"><p className="text-meta text-ink font-medium">{c[role]}</p><p className="text-meta text-ink-muted mt-1 break-words">{status}</p></li>;})}</ol>
        {shown.expired?<p role="alert" className="text-meta text-ink mt-4 max-w-[75ch]">{c.expired}</p>:null}{shown.state.reason?<p className="text-meta text-ink-muted mt-4 break-words">{shown.state.reason}</p>:null}
      </section>
      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="min-w-0 px-5 py-6 sm:px-8"><h3 className="text-body text-ink-strong font-semibold">{c.originals}</h3>
          {!shown.originals.length?<p className="text-body text-ink-muted mt-4 max-w-[70ch]">{c.empty}</p>:shown.originals.map(o=>{let rendered=o.text;if(o.role==="FINAL"&&o.text!==null){try{rendered=permutationFinalSchema.parse(boundedJson(o.text,6*32768,16)).proof;}catch{rendered=null;}}return <article key={o.role} data-bridge-original={o.role} className="border-line mt-5 min-w-0 border-t pt-5"><div className="flex flex-wrap items-center gap-3"><h4 className="text-body text-ink font-semibold">{c[o.role]}</h4><StatusBadge>{o.accepted?c.retained:c.rejected}</StatusBadge></div>
            {o.text!==null?<>{o.role==="FINAL"?<p className="text-meta text-ink-muted mt-3">{locale==="vi"?rendered!==null?"Bản hiển thị riêng của lập luận; không sửa nguyên bản thô.":"FINAL không đúng cấu trúc hỗ trợ; chỉ hiển thị nguyên bản thô, không sửa lập luận.":rendered!==null?"Rendering-only proof projection; raw original is unchanged.":"Unsupported FINAL structure; raw original only, no proof repair."}</p>:null}{rendered!==null?<div tabIndex={0} role="region" aria-label={`${c.originals}: ${c[o.role]}`} className="math-proof-body text-body text-ink mt-4 max-w-full overflow-x-auto whitespace-pre-wrap break-words leading-7 focus-visible:outline focus-visible:outline-2"><MathText text={rendered}/></div>:null}<details className="text-meta mt-4"><summary className="text-ink min-h-10 cursor-pointer focus-visible:outline focus-visible:outline-2">{c.raw}</summary><pre className="text-ink-muted max-w-full whitespace-pre-wrap break-words">{o.text}</pre></details></>:<p className="text-meta text-ink-muted mt-4">{c.noText}</p>}
            <p className="text-meta text-ink-muted mt-4 break-all">SHA-256: {o.digest} ({o.bytes} bytes)</p>
          </article>;})}
        </section>
        <aside className="border-line bg-surface-subtle min-w-0 border-t px-5 py-6 lg:border-l lg:border-t-0" aria-label={c.exact}><h3 className="text-body text-ink font-semibold">{c.exact}</h3><p data-bridge-checker={shown.checker?.status??"NOT_RUN"} className="text-meta text-ink mt-3 break-words">{shown.checker?.status??c.noCheck}</p><p className="text-meta text-ink-muted mt-3 max-w-[70ch]">{c.ceiling}</p>
          {shown.checker?<dl className="text-meta text-ink-muted mt-4 space-y-3"><div><dt>{locale==="vi"?"Lý do":"Reason"}</dt><dd className="text-ink break-words">{shown.checker.reason}</dd></div><div><dt>{locale==="vi"?"Giá trị khai báo":"Claimed floor"}</dt><dd className="text-ink break-all">{shown.checker.claimedFloor??c.unknown}</dd></div>{shown.checker.arithmetic?<div><dt>{locale==="vi"?"Phần nguyên từ kiểm số học":"Arithmetic-derived floor"}</dt><dd className="text-ink break-all">{shown.checker.arithmetic.derivedFloor}</dd></div>:null}</dl>:null}
          {shown.checker?.arithmetic?<div tabIndex={0} role="region" aria-label={locale==="vi"?"Khoảng hữu tỉ chính xác":"Exact rational interval"} className="text-meta text-ink mt-4 max-w-full overflow-x-auto p-1 focus-visible:outline focus-visible:outline-2"><MathText text={`\\(\\frac{${shown.checker.arithmetic.expectationBounds.lower.numerator}}{${shown.checker.arithmetic.expectationBounds.lower.denominator}}<X<\\frac{${shown.checker.arithmetic.expectationBounds.upper.numerator}}{${shown.checker.arithmetic.expectationBounds.upper.denominator}}\\)`}/></div>:null}
          {shown.checker?<details className="mt-4"><summary className="text-meta text-ink min-h-10 cursor-pointer focus-visible:outline focus-visible:outline-2">{c.assumptions}</summary><ul className="text-meta text-ink-muted mt-3 list-disc space-y-2 pl-4">{shown.checker.assumptions.map(a=><li key={a}><MathText text={a}/></li>)}</ul></details>:null}
          <p className="text-meta text-ink-muted mt-5">{locale==="vi"?"Token / chi phí / công cụ phía trên: UNKNOWN":"Tokens / costs / upstream tools: UNKNOWN"}</p><p className="text-meta text-ink-muted mt-3 max-w-[65ch]">{c.declared}</p>
        </aside>
      </div>
      {shown.currentPrompt?<section className="border-line border-t px-5 py-5 sm:px-8"><h3 className="text-body text-ink font-semibold">{c.prompt}: {c[shown.currentPrompt.role]}</h3><textarea aria-label={c.prompt} readOnly value={shown.currentPrompt.text} rows={8} className="border-line bg-surface text-meta text-ink mt-3 w-full min-w-0 resize-y rounded-sm border p-3 focus-visible:outline focus-visible:outline-2"/><p className="text-meta text-ink-muted mt-2 break-all">SHA-256: {shown.currentPrompt.digest}</p>{exportBase?<a className={link} href={`${exportBase}?format=prompt`}>{c.downloadPrompt}</a>:null}</section>:null}
      <details className="border-line border-t px-5 py-5 sm:px-8"><summary className="text-meta text-ink min-h-10 cursor-pointer focus-visible:outline focus-visible:outline-2">{c.audit}</summary><dl className="text-meta text-ink-muted mt-3 space-y-3">{[["Run",shown.binding.runId],[c.source,shown.binding.sourceDigest],[c.cut,`${shown.events.at(-1)?.sequence}:${shown.events.at(-1)?.eventDigest}`]].map(([label,value])=><div key={label}><dt>{label}</dt><dd className="text-ink mt-1 break-all">{value}</dd></div>)}</dl>{shown.failed.length?<p className="text-meta text-ink-muted mt-3">{c.failed}: {shown.failed.length}</p>:null}{exportBase?<a className={link} href={exportBase}>{c.export}</a>:null}<p className="text-meta text-ink-muted mt-3 max-w-[75ch]">{c.revocation}</p></details>
    </>:<p className="text-body text-ink-muted px-5 py-6 sm:px-8">{c.none}</p>}
  </Panel>;
}
