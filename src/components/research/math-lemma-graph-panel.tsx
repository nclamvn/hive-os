import type { MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";
import { projectMathLemmaGraphEvidence } from "@/modules/research-sandbox/math-lemma-graph";
import { MathText } from "./math-text";

/** Retained-only view. Caller supplies a command-validated full trace. No tool/fetch. */
export function MathLemmaGraphPanel({ trace, locale }: { trace: readonly MathCycleEventPayload[]; locale: "vi" | "en" }) {
  const vi = locale === "vi";
  const portfolio = trace.find((event) => event.phase === "PORTFOLIO_PLANNED")?.portfolio;
  if (portfolio?.version !== 3) return <p className="text-meta text-ink-muted mt-3">{vi
    ? "Hồ sơ lịch sử hoặc hướng do con người định tuyến chưa lưu đồ thị bổ đề mới; không dựng lại chứng minh từ trạng thái quy trình."
    : "This historical or human-steered dossier has no new retained lemma graph; workflow states are not reconstructed as proofs."}</p>;
  return <section className="border-line text-meta mt-4 min-w-0 border-t pt-4 [overflow-wrap:anywhere]"
    aria-label={vi ? "Đồ thị bổ đề đề xuất" : "Proposed lemma dependency graph"}>
    <h6 className="text-ink font-semibold">{vi ? "Bài toán gốc · bổ đề · suy luận còn thiếu" : "Root problem · lemmas · missing implications"}</h6>
    <p className="text-ink-muted mt-2 max-w-[76ch]">{vi
      ? "Mọi cạnh là đề xuất, chưa căn chỉnh ngữ nghĩa. Đồ thị hợp lệ không xác nhận chứng minh, giả định hoặc bước suy ra. Chứng cứ hữu hạn, phản chứng predicate đã đăng ký, phản biện AI và kiểm kernel là những chiều khác nhau; không tự khép bài toán gốc."
      : "Every edge is claimed and semantic alignment is unresolved. A valid graph does not verify assumptions or implications. Finite evidence, registered-predicate refutation, AI review and kernel checks are separate dimensions; none automatically closes the root."}</p>
    <div className="border-line mt-3 divide-y">{portfolio.branches.map((branch) => {
      const graph = branch.lemmaGraph;
      const evidence = projectMathLemmaGraphEvidence(graph, trace);
      const rootDirected = graph.edges.some((edge) => edge.conclusionNodeId === "ROOT" && edge.relation === "CLAIMED_IMPLICATION");
      return <details key={branch.branchId} className="min-w-0 py-3">
        <summary className="text-ink cursor-pointer font-medium">{branch.methodFamily} · {graph.nodes.length} {vi ? "bổ đề đề xuất" : "proposed lemmas"}</summary>
        <p className="text-ink-muted mt-2 max-w-[76ch]">{rootDirected
          ? vi ? "Có cạnh hướng tới gốc được đề xuất, chưa kiểm chứng tất cả tiền đề hoặc suy luận." : "A root-directed implication is proposed; all premises and inference remain unverified."
          : vi ? "Chưa đề xuất cầu nối đủ để suy ra gốc. Hướng gốc đến bổ đề chỉ là định hướng cần nghiên cứu, không xác nhận điều kiện cần bằng máy." : "No proposed sufficient bridge to the root. Root-to-lemma orientation is a research direction, not machine-certified necessity."}</p>
        <div className="border-line mt-3 border-l pl-3"><p className="text-ink font-medium">ROOT · {vi ? "Hợp đồng gốc do server niêm phong" : "Server-sealed root contract"}</p>
          <p className="mt-1 max-w-[76ch]"><MathText text={graph.root.contract.statement} /></p>
          <p className="text-ink-muted mt-1"><MathText text={graph.root.contract.definitions} /></p>
          <p className="text-ink-muted mt-1"><MathText text={graph.root.contract.assumptions} /></p>
          <p className="text-ink-muted mt-1">{vi ? "Lượng từ và phạm vi gốc giữ trong nguyên văn hợp đồng, không được đoán hoặc thay bởi AI." : "Root quantifiers and scope stay in the exact contract text, not guessed or replaced by AI."}</p>
        </div>
        <ol className="mt-3 space-y-3">{graph.nodes.map((node) => <li key={node.id} className="border-line min-w-0 border-l pl-3">
          <p className="text-ink font-medium">{node.id} · v{node.statementVersion} · {node.scope.kind === "FINITE" ? vi ? "Hữu hạn" : "Finite" : vi ? "Phổ quát đề xuất" : "Proposed universal"}</p>
          <p className="mt-1 max-w-[76ch]"><MathText text={node.statement} /></p>
          <p className="text-ink-muted mt-1">{vi ? "Biến và miền" : "Variables and domains"}: {node.variables.map((item) => `${item.symbol}: ${item.domain}`).join("; ")}</p>
          <p className="text-ink-muted mt-1">{vi ? "Thứ tự lượng từ" : "Quantifier order"}: {node.quantifiers.map((item) => `${item.kind === "FOR_ALL" ? "∀" : "∃"}${item.variable}`).join(" ")}</p>
          <p className="text-ink-muted mt-1">{vi ? "Giả định chưa xác nhận" : "Unverified assumptions"}: <MathText text={node.assumptions.join("; ")} /></p>
          {node.scope.kind === "FINITE" ? <p className="text-ink-muted mt-1">{node.scope.finiteBounds.map((bound) => `${bound.variable}: ${bound.lower} .. ${bound.upper} (${bound.boundaryConvention})`).join("; ")}</p> : null}
          <p className="text-ink-muted mt-1 break-all">SHA-256: {node.statementDigest}</p>
        </li>)}</ol>
        <ul className="mt-3 space-y-2">{graph.edges.map((edge) => <li key={edge.id} className="min-w-0">
          <p className="text-ink font-medium">{edge.premiseNodeIds.join(" ∧ ")} → {edge.conclusionNodeId} · {edge.relation === "RESEARCH_DEPENDENCY" ? vi ? "Phụ thuộc nghiên cứu" : "Research dependency" : vi ? "Suy ra được đề xuất" : "Claimed implication"}</p>
          <p className="text-ink-muted max-w-[76ch]"><MathText text={edge.claimedJustification} /></p>
          <p className="text-ink-muted">{vi ? "Chưa kiểm chứng cạnh; căn chỉnh ngữ nghĩa chưa giải quyết." : "Edge unverified; semantic alignment unresolved."}</p>
        </li>)}</ul>
        <p className="text-ink-muted mt-3">{vi ? "Số cạnh suy luận đã kiểm chứng: 0. Bài toán gốc chưa được khép." : "Verified implications: 0. Root closure not established."}</p>
        {evidence?.observations.length ? <ul className="text-ink-muted mt-2 space-y-1">{evidence.observations.map((item, index) => <li key={index}>{vi ? "Vòng" : "Round"} {item.round} · {item.kind}: {item.detail}</li>)}</ul> : null}
        <p className="text-ink-muted mt-2 max-w-[76ch]">{vi ? "Các quan sát thuộc vòng chạy, chưa chứng minh tương đương với phát biểu node/edge. Chưa lưu kiểm kernel cho graph này." : "Observations belong to the round, without certified equivalence to graph nodes/edges. No kernel check is retained for this graph."}</p>
        <p className="text-ink-muted mt-2 break-all">SHA-256: {graph.graphDigest}</p>
        <details className="mt-2"><summary className="text-ink cursor-pointer underline">{vi ? "Xem nguồn niêm phong" : "Inspect sealed source"}</summary>
          <pre className="bg-canvas text-ink-muted mt-2 max-h-96 overflow-auto whitespace-pre-wrap break-all p-3">{JSON.stringify(graph, null, 2)}</pre></details>
      </details>;
    })}</div>
  </section>;
}
