import { MathText } from "@/components/research/math-text";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { getLrcResearchCockpitCopy } from "@/components/research/math-lrc-research-cockpit-copy";
import { projectLrcResearchCockpitPresentation, type LrcResearchCockpitRecord } from "@/components/research/math-lrc-research-cockpit-presentation";

const goalMath = [String.raw`\(\forall u\in\mathbb{Z}_{>0}^{13},\ \exists t\in\mathbb{R},\ \forall i,\ \|tu_i\|\ge\frac1{14}\)`,
  String.raw`\(\forall u\in\mathbb{Z}_{>0}^{14},\ \exists t\in\mathbb{R},\ \forall i,\ \|tu_i\|\ge\frac1{15}\)`];
export function MathLrcResearchCockpitPanel({ locale, toolsBase, record }: {
  locale: string; toolsBase: string; record?: LrcResearchCockpitRecord | null;
}) {
  const copy = getLrcResearchCockpitCopy(locale), view = projectLrcResearchCockpitPresentation(record), p = view.program;
  const aggregates = p.nodes.filter(node => node.category === "AGGREGATE");
  const lower = p.nodes.filter(node => node.category === "LOWER");
  return <section id="math-lrc-research-cockpit" aria-labelledby="math-lrc-research-cockpit-title" className="min-w-0">
    <Panel className="min-w-0 overflow-hidden p-5 sm:p-6">
      <SectionHeader id="math-lrc-research-cockpit-title" title={copy.title} />
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{copy.passive}</p>
      <div className="border-line mt-5 min-w-0 border-t pt-4">
        <h3 className="text-body text-ink font-semibold">{copy.goal}</h3>
        <dl className="text-meta text-ink-muted mt-3 grid min-w-0 gap-2 sm:grid-cols-2">
          <div><dt>{copy.mode}</dt><dd className="text-ink">{p.mode} ({view.strategy ? (locale === "vi" ? "phạm vi đã lưu; trạng thái chạy tách riêng" : "retained scope; operational state separate") : locale === "vi" ? "baseline, chưa phải lượt chạy" : "baseline, not a dispatched run"})</dd></div>
          <div><dt>{copy.trust}</dt><dd className="text-ink break-words">{p.trustPolicy}</dd></div>
        </dl>
        <p className="text-meta text-ink-muted mt-3 max-w-[76ch]">{p.baseline.convention}</p>
        <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{copy.sourceStatus}: <a className="text-ink underline underline-offset-2" href={view.source.url} rel="noreferrer" target="_blank">{view.source.author}, {view.source.title}, v{view.source.version}</a>. {locale === "vi" ? "Nguồn báo cáo; HTML gốc chưa được lưu đầy đủ tại local. Không xem đây là tái chứng minh độc lập." : "Source-reported; full primary HTML bytes are not locally retained. This is not independent reproduction."}</p>
        {p.baseline.targets.map((target, index) => <div key={target.id} className="border-line mt-4 min-w-0 border-l-2 pl-3">
          <p className="text-body text-ink font-medium">{target.totalRunners} {locale === "vi" ? "người chạy" : "total runners"} / {target.movingSpeeds} {locale === "vi" ? "vận tốc chuyển động" : "moving speeds"}</p>
          <p className="text-meta text-ink-muted mt-1 max-w-[76ch] break-words">{target.statement}</p>
          <div className="text-body text-ink mt-2 overflow-x-auto"><MathText text={goalMath[index]} /></div>
          <p className="text-meta text-ink-muted mt-2">{target.primeCount} {locale === "vi" ? "số nguyên tố đúng tập v2; không dùng tập 111 của v1" : "primes in the exact v2 set; not the archived v1 set of 111"}</p>
          <StatusBadge tone="neutral">{copy.open}</StatusBadge>
        </div>)}
        <h4 className="text-meta text-ink mt-4 font-semibold">{copy.strategy}</h4>
        {view.strategy ? <dl className="text-meta text-ink-muted mt-2 max-w-[76ch] space-y-2">
          <div><dt>{locale === "vi" ? "Phương pháp / nghĩa vụ đích" : "Method / targeted obligation"}</dt><dd className="text-ink break-words">{view.strategy.unitId} / {view.strategy.targetedObligationId}</dd></div>
          <div><dt>{locale === "vi" ? "Phân biệt cần kiểm" : "Discriminating output"}</dt><dd className="whitespace-pre-wrap break-words">{view.strategy.discrimination}</dd></div>
          <div><dt>Stop / pivot</dt><dd className="whitespace-pre-wrap break-words">{view.strategy.stopPivot}</dd></div>
          <div><dt>{locale === "vi" ? "Giả thiết nguồn được nhận có điều kiện" : "Explicit conditional source assumptions"}</dt><dd className="break-words">{view.strategy.sourceAssumptionIds.join(", ")}</dd></div>
        </dl> : <p className="text-meta text-ink-muted mt-1 max-w-[76ch]">{copy.absentStrategy}</p>}
      </div>
      <div className="border-line mt-5 min-w-0 border-t pt-4">
        <h3 className="text-body text-ink font-semibold">{copy.obligations}</h3>
        <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{p.nodes.length} {copy.count.toLowerCase()}; {aggregates.length} {locale === "vi" ? "nghĩa vụ master tổng hợp, không phải 23 application trên từng prime" : "aggregate master dependencies, not 23 per-prime applications"}. {copy.noPercentage}</p>
        <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{locale === "vi" ? "Đóng node hoặc nối DAG không đủ: từng hàm ý trọng yếu phải có bằng chứng đã admission đúng phát biểu, miền, lượng từ và giả thiết." : "Closed nodes or a connected DAG are insufficient: every critical implication needs admitted statement, domain, quantifier and assumption alignment."}</p>
        <details className="text-meta text-ink-muted mt-3 min-w-0">
          <summary className="text-ink cursor-pointer font-medium">{copy.blockers}</summary>
          <ul className="mt-3 max-w-[76ch] space-y-2">{aggregates.map(node => <li key={node.id} className="break-words"><span className="text-ink">{node.id}</span> — {node.state}</li>)}</ul>
          <p className="mt-3 max-w-[76ch]">{p.baseline.lowerStatement}</p>
          <ul className="mt-2 space-y-1">{lower.map(node => <li key={node.id}>{node.id}: {node.state}</li>)}</ul>
        </details>
        <details className="text-meta text-ink-muted mt-3 min-w-0">
          <summary className="text-ink cursor-pointer font-medium">{copy.allNodes} ({p.nodes.length})</summary>
          <ul className="mt-3 max-w-[76ch] space-y-2">{p.nodes.map(node => <li key={node.id} className="break-words"><span className="text-ink">{node.id}</span>: {node.state}<p>{node.statement}</p></li>)}</ul>
        </details>
      </div>
      <div className="border-line mt-5 min-w-0 border-t pt-4">
        <h3 className="text-body text-ink font-semibold">{copy.evidence}</h3>
        <dl className="text-meta text-ink-muted mt-2 flex flex-wrap gap-x-6 gap-y-2"><div><dt>{copy.operation}</dt><dd className="text-ink">{view.runStatus}</dd></div><div><dt>{locale === "vi" ? "Job phản biện" : "Review job"}</dt><dd className="text-ink">{view.reviewJobStatus}</dd></div><div><dt>{locale === "vi" ? "Nguyên nhân vận hành" : "Operational cause"}</dt><dd className="text-ink">{view.operationalCause}</dd></div></dl>
        <p className="text-meta text-ink-muted mt-2">{copy.lane}</p>
        <p role={view.recordState === "INVALID" ? "alert" : "status"} className="text-meta text-ink-muted mt-2 max-w-[76ch]">{view.recordState === "INVALID" ? copy.invalid : view.recordState === "ADMITTED" ? (locale === "vi" ? "Đầu ra solver vượt qua admission liên kết đã lưu; không phải nghiệm thu chứng minh." : "The retained solver output passed binding admission, not proof acceptance.") : copy.noRun}</p>
        {view.isMethod ? <p className="text-meta text-ink-muted mt-2">{locale === "vi" ? "Ledger phản biện" : "Review ledger"}: {view.reviewState}{view.reviewState === "INVALID" && !record?.finiteSourcePins ? ` (${locale === "vi" ? "thiếu source pins host tin cậy; không lấy pins từ ledger" : "trusted host source pins unavailable; never read pins back from ledger"})` : ""}</p> : null}
        {view.ledger ? <p className="text-meta text-ink mt-2">{view.ledger.lrcMethodUnitAuditSummary.status} / {view.ledger.conclusion} — {locale === "vi" ? "kết luận có phạm vi, không PROVED" : "scoped outcome, not PROVED"}</p> : null}
        {view.finiteEvidence ? <details className="text-meta text-ink-muted mt-3 min-w-0">
          <summary className="text-ink cursor-pointer font-medium">{copy.finite}: {view.finiteEvidence.status}</summary>
          <p className="mt-2 max-w-[76ch] break-words">{view.finiteEvidence.summary}</p>
          <p className="mt-2">{locale === "vi" ? "Chứng cứ host local không chữ ký; GET không chạy lại checker." : "Unsigned local host provenance; GET does not rerun the checker."}</p>
          {view.finiteEvidence.result ? <dl className="mt-2 grid gap-2 sm:grid-cols-2">
            <div><dt>{copy.scope}</dt><dd>d={view.finiteEvidence.input!.d}, e={view.finiteEvidence.input!.e}; {view.finiteEvidence.result.partitions} unit partitions / {view.finiteEvidence.result.cells} cells</dd></div>
            <div><dt>{locale === "vi" ? "Các dịch chuyển tốt" : "Good shift indices"}</dt><dd>{view.finiteEvidence.result.goodShiftIndices.join(", ")}</dd></div>
            <div><dt>{locale === "vi" ? "Thời gian checker đã lưu (ms)" : "Retained checker elapsed (ms)"}</dt><dd>{view.finiteEvidence.checker!.elapsedMs}</dd></div>
            <div><dt>{locale === "vi" ? "Phép toán đã tính phí" : "Charged operations"}</dt><dd>{view.finiteEvidence.checker!.chargedOperations}</dd></div>
          </dl> : <p className="mt-2">{view.finiteEvidence.status === "MISSING" ? copy.missingFinite : copy.refusedFinite}</p>}
        </details> : null}
        {view.roles.length ? <details className="text-meta text-ink-muted mt-3 min-w-0">
          <summary className="text-ink cursor-pointer font-medium">{copy.roles} ({view.roles.length})</summary>
          <p className="mt-2 max-w-[76ch]">{copy.roleCaution} {copy.usageCaution}</p>
          {view.roles.map(role => <section key={role.role} className="border-line mt-4 min-w-0 border-t pt-3" aria-label={role.role}>
            <h4 className="text-ink font-semibold">{role.role}: {role.result}</h4>
            <dl className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2"><div><dt>{locale === "vi" ? "Mô hình CLI yêu cầu" : "Requested CLI model"}</dt><dd>{role.requestedModel}</dd></div><div><dt>Context</dt><dd className="break-all">{role.context}</dd></div>
              <div><dt>Input / cached input</dt><dd>{role.usage.inputTokens} / {role.usage.cachedInputTokens}</dd></div><div><dt>Output / reasoning output</dt><dd>{role.usage.outputTokens} / {role.usage.reasoningOutputTokens}</dd></div>
              <div className="sm:col-span-2"><dt>Input / schema digest</dt><dd className="break-all">{role.input.inputDigest} / {role.input.schemaDigest}</dd></div>
              {role.input.finiteEvidenceDigest ? <div className="sm:col-span-2"><dt>Finite evidence digest</dt><dd className="break-all">{role.input.finiteEvidenceDigest}</dd></div> : null}
            </dl>
            {role.quote ? <><blockquote className="border-line mt-3 max-w-[76ch] whitespace-pre-wrap break-words border-l-2 pl-3">{role.quote}</blockquote>{role.quoteMatches === false ? <p role="alert" className="mt-2 max-w-[76ch]">{copy.quoteCaution}</p> : null}</> : null}
            <p className="mt-3 max-w-[76ch] whitespace-pre-wrap break-words">{role.text}</p>
            {role.gap ? <p className="mt-2 max-w-[76ch] whitespace-pre-wrap break-words">{role.gap}</p> : null}
            <p className="mt-2 max-w-[76ch] whitespace-pre-wrap break-words">{role.feedback.summary}</p>
            <ul className="mt-2 max-w-[76ch] space-y-1">{role.checks.map((check, index) => <li key={index} className="whitespace-pre-wrap break-words">{check}</li>)}</ul>
            <ul className="mt-3 max-w-[76ch] space-y-2">{[...role.feedback.premiseFindings, ...role.feedback.stepFindings].map(finding => <li key={finding.id} className="break-words"><span className="text-ink">{finding.id}: {finding.status}</span><p className="whitespace-pre-wrap">{finding.reason}</p></li>)}</ul>
          </section>)}
        </details> : null}
        {view.digests ? <details className="text-meta text-ink-muted mt-3 min-w-0"><summary className="text-ink cursor-pointer font-medium">{copy.digests}</summary><dl className="mt-2 space-y-2">{Object.entries(view.digests).map(([key, value]) => <div key={key}><dt>{key}</dt><dd className="break-all">{value ?? copy.unavailable}</dd></div>)}</dl></details> : null}
        <div className="text-body text-ink mt-3 overflow-x-auto"><MathText text={String.raw`\(B_i=\{j:\|\alpha_i+a_i j/d\|<1/15\},\quad G=\{0,\ldots,d-1\}\setminus\bigcup_i B_i\)`} /></div>
        <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{copy.arithmetic}</p>
        {view.historical064 ? <p role="status" className="text-meta text-ink-muted mt-3 max-w-[76ch]">{copy.oldFailure}</p> : null}
        <p className="text-meta text-ink-muted mt-3 max-w-[76ch]">{copy.ceiling}</p>
        <dl className="text-meta text-ink-muted mt-3 grid min-w-0 gap-2 sm:grid-cols-2">
          {[["Global LRC", p.globalLrc], ["Formal", p.formalProof], ["External", p.externalAcceptance], ["Novelty", p.novelty]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd className="text-ink">{value}</dd></div>)}
        </dl>
      </div>
      <details className="border-line text-meta text-ink-muted mt-5 min-w-0 border-t pt-4">
        <summary className="text-ink cursor-pointer font-medium">{copy.historical}</summary>
        <p className="mt-3 max-w-[76ch]">{locale === "vi" ? "Chứng chỉ p83 hữu hạn đã lưu thuộc lịch sử riêng; không phải kiểm mới và chưa được tự chuyển thành hàm ý master v2. Snapshot OPEN cũ không bị viết lại." : "Retained finite p83 certificates belong to their separate history; they are not fresh checks or automatically admitted v2 master implications. Earlier OPEN snapshots are unchanged."}</p>
        <a className="text-ink mt-2 inline-block min-h-10 py-2 underline underline-offset-2" href={`${toolsBase}?view=allikvere-proof#allikvere-proof`}>{copy.nativeArchive}</a>
        <dl className="mt-3 space-y-2"><div><dt>{copy.program}</dt><dd className="break-all">{p.baselineDigest}</dd></div><div><dt>Master</dt><dd className="break-all">{p.masterDigest}</dd></div></dl>
      </details>
    </Panel>
  </section>;
}
