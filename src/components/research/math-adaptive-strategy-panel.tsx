import type { MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";
import { MathText } from "./math-text";

/** Receives only an already validated retained trace: no fetch, clock grading or tool execution. */
export function MathAdaptiveStrategyPanel({ trace, vi }: { trace: readonly MathCycleEventPayload[]; vi: boolean }) {
  const label = (value: string) => {
    const labels: Record<string, string> = { ACTIVE: "Đang công bố", SUPERSEDED: "Có phiên bản mới", WITHDRAWN: "Đã rút",
      UNAVAILABLE: "Chưa truy xuất được", STALE: "Quá hạn", FUTURE: "Thời điểm không hợp lệ", CURRENT: "Trong thời hạn",
      CURRENT_BACKGROUND: "Tài liệu nền hiện hành", HISTORICAL_OR_UNAVAILABLE_BACKGROUND: "Tài liệu nền lịch sử hoặc chưa truy xuất",
      QUARANTINED_LEAD: "Hướng bị cách ly", READY: "Có runtime", DEFERRED: "Trì hoãn", EXCLUDED: "Loại khỏi vòng này" };
    return vi && labels[value] ? `${labels[value]} (${value})` : value;
  };
  const map = trace.find((event) => event.phase === "RESEARCH_METHOD_MAP");
  if (!map) return <p className="text-meta text-ink-muted mt-3">{vi
    ? "Lịch sử này chưa lưu bản đồ phương pháp thích ứng; không bổ sung chính sách mới vào kết quả cũ."
    : "This history has no retained adaptive method packet; newer policy is not applied to old results."}</p>;
  const portfolio = trace.find((event) => event.phase === "PORTFOLIO_PLANNED")?.portfolio;
  const selections = trace.flatMap((event) => event.phase === "BRANCH_SELECTED" && event.adaptiveSelection ? [event.adaptiveSelection]
    : event.phase === "METHOD_DEFERRED" ? [event.selection] : []);
  return <section className="border-line text-meta mt-4 min-w-0 border-t pt-4 [overflow-wrap:anywhere]"
    aria-label={vi ? "Chiến lược nghiên cứu thích ứng" : "Adaptive research strategy"}>
    <h6 className="text-ink font-semibold">{vi ? "Phương pháp · trở ngại · cầu nối còn thiếu" : "Methods · obstructions · missing bridges"}</h6>
    <p className="text-ink-muted mt-2 max-w-[76ch]">{vi
      ? "Bản đồ tài liệu có chọn lọc, chưa đầy đủ. Trạng thái xuất bản không xác nhận tính đúng của toán học. Đóng góp và thứ tự ưu tiên do AI đề xuất chỉ là định tuyến; không phải điểm xác suất hoặc chứng minh. Bốn mục tiêu cố định cũ là development/warmup, chưa phải kiểm định held-out."
      : "This curated literature map is partial. Publication status does not certify mathematics. AI-proposed contributions and priorities are routing, not probabilities or proofs. The four old fixed targets are development/warmup, not held-out validation."}</p>
    <p className="text-ink-muted mt-2 break-all">{vi ? "Lưu trước planner" : "Retained before planning"}: {map.admittedAt} · SHA-256: {map.packet.packetDigest}</p>
    <div className="border-line mt-3 divide-y">{map.packet.sources.map((source) => <div key={source.publicationId} className="grid gap-1 py-2 sm:grid-cols-[12rem_1fr]">
      <a className="text-ink underline underline-offset-2" href={source.canonicalUri} target="_blank" rel="noreferrer">arXiv:{source.publicationId}</a>
      <div className="text-ink-muted min-w-0 break-words">{label(source.status)} · {label(source.freshness)} · v{source.selectedVersion} / {vi ? "mới nhất" : "latest"} {source.latestVersion ?? "?"}<p>{source.notice}</p></div>
    </div>)}</div>
    <div className="border-line mt-3 divide-y">{map.packet.methods.map((method) => <details key={method.id} className="min-w-0 py-3">
      <summary className="text-ink cursor-pointer font-medium">{method.title} · {label(method.applicability)}</summary>
      <dl className="mt-3 space-y-3 break-words">{[
        [vi ? "Đã biết (không tự là tiền đề)" : "Known background (not automatically a premise)", method.knownResults],
        [vi ? "Giả thiết" : "Assumptions", method.assumptions],
        [vi ? "Trở ngại" : "Obstruction", method.obstruction],
        [vi ? "Cầu nối đến gốc còn thiếu" : "Missing bridge to the root", method.missingBridgeToRoot],
      ].map(([label, content]) => <div key={label} className="grid gap-1 sm:grid-cols-[12rem_1fr]"><dt className="text-ink-muted">{label}</dt><dd className="min-w-0 max-w-[76ch]"><MathText text={content} /></dd></div>)}</dl>
      <p className="text-ink-muted mt-3">{method.evidenceCeiling} · {method.capturedVersion}</p>
      <ul className="mt-2 space-y-1">{method.toolNeeds.map((tool) => <li key={tool.id}>{tool.status} · {tool.id}: {tool.description}</li>)}</ul>
    </details>)}</div>
    {portfolio && portfolio.version !== 1 ? <div className="border-line mt-3 divide-y">{portfolio.branches.map((branch) => <details key={branch.branchId} className="min-w-0 py-3">
      <summary className="text-ink cursor-pointer font-medium">{branch.methodFamily} · {branch.rootContribution.kind} · {branch.evaluationScope}</summary>
      <dl className="mt-3 space-y-3 break-words">{[
        [vi ? "Đóng góp đề xuất" : "Proposed contribution", branch.rootContribution.statement],
        [vi ? "Điều kiện áp dụng" : "Applicability assumptions", branch.applicabilityAssumptions],
        [vi ? "Câu hỏi phân biệt" : "Discriminating question", branch.discriminatingExperiment.question],
        [vi ? "Nếu hỗ trợ" : "On support", branch.discriminatingExperiment.supportOutcome],
        [vi ? "Nếu bác bỏ" : "On refutation", branch.discriminatingExperiment.refutationOutcome],
        [vi ? "Nếu chưa kết luận" : "On inconclusive", branch.discriminatingExperiment.inconclusiveOutcome],
      ].map(([label, content]) => <div key={label} className="grid gap-1 sm:grid-cols-[12rem_1fr]"><dt className="text-ink-muted">{label}</dt><dd className="min-w-0 max-w-[76ch]"><MathText text={content} /></dd></div>)}</dl>
      <p className="text-ink-muted mt-2">{vi ? "Runtime bắt buộc" : "Required runtimes"}: {branch.requiredTools.join(" · ")}</p>
    </details>)}</div> : null}
    {selections.map((selection, index) => <div key={selection.selectionDigest} className="border-line mt-3 border-t pt-3">
      <p className="text-ink font-medium">{vi ? "Vì sao định tuyến" : "Why this routing"} · {index + 1}</p>
      <ul className="mt-2 space-y-2">{selection.ranking.map((row) => <li key={row.branchId} className="break-words">
        <span className="text-ink">{row.branchId === selection.selectedBranchId ? vi ? "Được chọn · " : "Selected · " : ""}{label(row.state)} · {vi ? "Ưu tiên đề xuất" : "Proposed priority"} {row.priority}</span>
        <p className="text-ink-muted" title={row.reason}>{vi ? row.state === "DEFERRED"
          ? "Giữ lại hướng khoa học đề xuất nhưng không chạy vì runtime bắt buộc chưa có."
          : row.state === "EXCLUDED" ? "Đã chọn/lặp, thuộc kết quả đã biết, chỉ warmup hoặc bị cách ly; không phải thí nghiệm gốc mới."
          : row.reason.includes("inconclusive") ? "Có thể chạy; ưu tiên đa dạng hóa sau kết quả chưa kết luận của cùng họ phương pháp."
          : "Có thể chạy; xếp theo đóng góp đề xuất vào bài toán, không cộng điểm vì có công cụ." : row.reason}</p>
        {row.missingTools.length ? <p>{vi ? "Nhu cầu phát triển còn thiếu (chưa tự thực thi)" : "Deferred development needs (not automatically executed)"}: {row.missingTools.join(" · ")}</p> : null}
      </li>)}</ul>
      <p className="text-ink-muted mt-2 break-all">Selection SHA-256: {selection.selectionDigest}</p>
    </div>)}
    <details className="border-line mt-3 border-t pt-3"><summary className="text-ink cursor-pointer">{vi ? "Bộ nhớ kết quả được lưu" : "Retained outcome memory"} · {map.priorOutcomes.length}</summary>
      <ul className="mt-2 space-y-2">{map.priorOutcomes.map((record, index) => <li key={index}>{record.outcome} · {record.methodFamily ?? "historical"}<div className="min-w-0"><MathText text={record.hypothesis} /></div>
        {record.refutation ? <p className="text-ink-muted mt-1">{vi ? "Chỉ vị từ được đăng ký đã bị bác bỏ; chưa xác nhận tương đương với văn bản giả thuyết." : "Only the registered predicate is refuted; equivalence to the prose hypothesis is not certified."} · {JSON.stringify(record.refutation)}</p> : null}
      </li>)}</ul>
      <p className="text-ink-muted mt-2">{vi ? "Chỉ phản ánh sự kiện phản ví dụ có ràng buộc, thử và review thực tế; không nâng ROUND_CLOSED hay đồng thuận AI thành chứng minh." : "Uses bound refutations and actual attempts/reviews only; ROUND_CLOSED or AI agreement is not promoted to a proof."}</p>
    </details>
  </section>;
}
