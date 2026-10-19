import { Panel } from "@/components/ui/panel";
import { MathText } from "@/components/research/math-text";
import { ALLIKVERE_PROVENANCE } from "@/modules/research-sandbox/math-lrc-allikvere-report";
import { validateRetainedAllikvereFrontierReport } from "@/modules/research-sandbox/math-lrc-frontier-report";

/** Separate checkpoint projection; retained reads never start the coordinator. */
export function MathLrcFrontierPanel({ raw, base, locale }: { raw: unknown; base: unknown; locale: string }) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const report = validateRetainedAllikvereFrontierReport(raw, base);
  if (!report) return <Panel id="allikvere-frontier" role="alert" className="min-w-0 scroll-mt-24 p-5 sm:p-6">
    <h2 className="text-section-title text-ink-strong">{t("Checkpoint tiếp tục chưa có hoặc không hợp lệ", "Continuation checkpoint unavailable or invalid")}</h2>
    <p className="text-body text-ink-muted mt-3">{t("Giữ nguyên báo cáo TIP-048. Trang không tự chọn job, tạo cây, chạy Python, truy nguồn nghiên cứu hay gọi mô hình khi kiểm checkpoint thất bại hoặc hết ngân sách đọc.", "TIP-048 remains unchanged. A failed or expired retained check never selects jobs, generates trees, launches Python, fetches research sources or calls a model.")}</p>
  </Panel>;
  const summary = report.evidence.primary;
  const plan = report.evidence.packet.plan;
  const format = (value: string | bigint) => new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(BigInt(value));
  const classified = (counts: { witnessTuples: string; gcdTuples: string; survivorTuples: string }) =>
    BigInt(counts.witnessTuples) + BigInt(counts.gcdTuples) + BigInt(counts.survivorTuples);
  return <Panel id="allikvere-frontier" className="min-w-0 scroll-mt-24 overflow-hidden p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="text-meta text-ink-muted">{t("TIP-049 · checkpoint riêng · chỉ đọc", "TIP-049 · separate checkpoint · retained only")}</p>
        <h2 className="text-section-title text-ink-strong mt-2">{t("Tiếp tục frontier đã khóa · p=199", "Sealed frontier continuation · p=199")}</h2></div>
      <span role="status" className="border-line text-meta text-ink rounded-md border px-3 py-2">{t("Toàn cục: chưa thiết lập", "Global: NOT ESTABLISHED")}</span>
    </div>
    <p className="text-body text-ink-muted mt-4">{t("Vòng agent công cụ tính toán local đã dừng sau tám job: chọn miền đã khóa → chạy công cụ → phát lại độc lập → ghép chứng chỉ → dừng. Đây không phải chiến dịch LLM hay worker HIVE; hoàn tất vòng công cụ không đồng nghĩa chứng minh bài toán.", "The local computational tool-agent loop stopped after eight jobs: choose sealed domains → execute tools → independently replay → compose certificates → stop. This is not an LLM campaign or HIVE worker; tool-loop completion is not a proof of the problem.")}</p>
    <p className="text-body text-ink-muted mt-3">{report.status === "PARTIAL"
      ? t("Phân loại nghiên cứu vẫn PARTIAL: các nhánh còn lại được giữ đúng số điểm và nguồn. Không dùng checkpoint này như bằng chứng agent thành công hoặc kết luận toàn cục.", "Research classification remains PARTIAL: remaining branches retain exact cardinalities and provenance. This checkpoint is not agent-success evidence or a global conclusion.")
      : t("Các miền terminal trong checkpoint đã được phân loại; phụ thuộc số học còn có điều kiện và năm nghĩa vụ toàn cục vẫn mở. COMPLETE cục bộ không là định lý toàn cục.", "The checkpoint's terminal domains are classified; arithmetic dependencies remain conditional and five global obligations stay open. Local COMPLETE is not a global theorem.")}</p>
    <MathText className="mt-4" text={"$C_{\\mathrm{new}}=C_{\\mathrm{old}}+\\sum_j C_j,\\qquad U_{\\mathrm{new}}=U_{\\mathrm{old}}-\\sum_j C_j$"} />
    <p className="text-meta text-ink-muted mt-3">{t("Chỉ thay tám lá UNRESOLVED rời nhau. Mọi lá đã chứng minh và bốn miền neo TIP-048 giữ nguyên; cây con không bị ghép phẳng vào cây cũ hay cộng trùng. Những số đếm dưới đây là loại lá được chọn, không phải các điều kiện số học vốn loại trừ nhau.", "Only eight disjoint UNRESOLVED leaves are replaced. All established leaves and four TIP-048 anchored domains stay unchanged; children are not flattened into old trees or double-counted. Counts below are chosen proof labels, not intrinsically exclusive arithmetic conditions.")}</p>
    <p className="text-meta text-ink-muted mt-2">{t("Mỗi hàng là miền tọa độ có thứ tự riêng, không phải số bộ vận tốc duy nhất hay quỹ đạo lấy thương. Không cộng các hàng thành tỷ lệ hoàn thành bài toán toàn cục.", "Each row is its own ordered-coordinate domain, not unique velocity configurations or quotient orbits. Do not sum rows into a global problem-completion percentage.")}</p>
    <div className="mt-5 grid gap-4">{summary.rows.map((row) => <article key={row.parentId} className="border-line min-w-0 border-t pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-body text-ink-strong break-words font-medium">{row.parentId}</h3><span className="text-meta text-ink-muted">{row.status}</span></div>
      <p className="text-meta text-ink-muted mt-2">{t("Toàn miền", "Whole domain")}: {format(row.totalTuples)} · {t("Miền còn lại", "Remaining domains")}: {row.remainingFrontier.length}</p>
      <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div><dt className="text-ink-muted">{t("Đã phân loại trước", "Previously classified")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(classified(row.previous))}</dd></div>
        <div><dt className="text-ink-muted">{t("Đã phân loại hiện tại", "Currently classified")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(classified(row.current))}</dd></div>
        <div><dt className="text-ink-muted">{t("Tăng thêm đã kiểm chứng", "Verified classified delta")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(row.delta.classifiedTuples)}</dd></div>
        <div><dt className="text-ink-muted">{t("Chưa giải quyết", "Unresolved")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(row.current.unresolvedTuples)}</dd></div>
        <div><dt className="text-ink-muted">{t("Giảm gcd có điều kiện", "Conditional gcd reduction")}</dt><dd className="text-ink-strong mt-1 break-words">{format(row.current.gcdTuples)}</dd></div>
        <div><dt className="text-ink-muted">{t("Survivor đã kiểm", "Checked survivors")}</dt><dd className="text-ink-strong mt-1 break-words">{format(row.current.survivorTuples)}</dd></div>
      </dl>
      <details className="text-meta text-ink-muted mt-3"><summary className="min-h-8 cursor-pointer">{t("Frontier còn lại · miền chính xác", "Remaining frontier · exact domains")}</summary>
        <ul className="mt-2 max-h-80 min-w-0 space-y-3 overflow-y-auto">{row.remainingFrontier.map((leaf) => <li key={`${leaf.certificateDigest}:${leaf.nodeId}`} className="min-w-0 break-words">
          <span>{leaf.origin === "BASE" ? t("Giữ từ cha", "Retained from base") : t("Còn lại từ con", "Unresolved child")} · {leaf.nodeId} · {format(leaf.totalTuples)}</span>
          <span className="mt-1 block font-mono">[{leaf.prefix.join(", ")}]</span>
        </li>)}</ul>
      </details>
    </article>)}</div>
    <div className="border-line mt-5 border-t pt-4"><h3 className="text-body text-ink-strong font-medium">{t("Tám nhiệm vụ đã khóa trước", "Eight preregistered jobs")}</h3>
      <p className="text-meta text-ink-muted mt-2">{t("Bốn kiểm soát khép nhánh: lá sâu nhất, hòa thì prefix nhỏ nhất. Bốn nhiệm vụ khối lượng: lá lớn nhất khác lá kiểm soát, hòa thì prefix nhỏ nhất. Khảo sát khả thi trước BUILD đã được công bố; đây không phải benchmark mù hay tính mới toán học.", "Four closure controls select the deepest leaf, lex-smallest on ties. Four strategic-mass jobs select the largest other leaf, lex-smallest on ties. Pre-BUILD feasibility scanning is disclosed; this is not a blind benchmark or mathematical novelty.")}</p>
      <div className="mt-4 grid gap-4">{plan.jobs.map((job, index) => {
        const child = report.evidence.packet.children[index].evidence;
        return <article key={job.jobDigest} className="border-line min-w-0 border-t pt-3">
          <div className="flex flex-wrap items-start justify-between gap-2"><h4 className="text-meta text-ink-strong break-words font-medium">{job.parentId} · {job.role === "closure-control" ? t("Kiểm soát khép nhánh", "Closure control") : t("Khối lượng chiến lược", "Strategic mass")}</h4><span className="text-meta text-ink-muted">{child.primary.status}</span></div>
          <p className="text-meta text-ink-muted mt-2 break-words">{job.nodeId} · [{job.prefix.join(", ")}] · {t("Miền job", "Job domain")}: {format(job.totalTuples)}</p>
          <p className="text-meta text-ink-muted mt-2">{t("Đã phân loại", "Classified")}: {format(child.primary.classifiedTuples)} · {t("Còn lại", "Remaining")}: {format(child.primary.unresolvedTuples)}</p>
          <details className="text-meta text-ink-muted mt-2"><summary className="min-h-8 cursor-pointer">{t("Nguồn cha và chứng chỉ con", "Parent binding and child evidence")}</summary><dl className="mt-2 grid gap-2 break-all">
            <div><dt>Job</dt><dd className="font-mono">{job.jobDigest}</dd></div><div><dt>{t("Lá gốc", "Original leaf")}</dt><dd className="font-mono">{job.targetNodeDigest}</dd></div>
            <div><dt>{t("Chứng chỉ cha", "Parent certificate")}</dt><dd className="font-mono">{job.parentCertificateDigest}</dd></div><div><dt>{t("Root con", "Child root")}</dt><dd className="font-mono">{job.childRootContractDigest}</dd></div>
            <div><dt>{t("Nguồn tác giả", "Author source")}</dt><dd className="font-mono">{job.childScope.sourceDigest}</dd></div><div><dt>{t("Miền con", "Child scope")}</dt><dd className="font-mono">{child.scopeDigest}</dd></div>
            <div><dt>{t("Chứng chỉ con", "Child certificate")}</dt><dd className="font-mono">{child.certificate.certificateDigest}</dd></div><div><dt>Evidence</dt><dd className="font-mono">{child.evidenceDigest}</dd></div>
          </dl></details>
        </article>;
      })}</div>
    </div>
    <div className="border-line mt-5 border-t pt-4"><h3 className="text-body text-ink-strong font-medium">{t("Năm nghĩa vụ toàn cục vẫn mở", "Five global obligations remain open")}</h3>
      <p className="text-body text-ink-muted mt-3">{t("Chưa nghiệm thu toàn bộ quỹ đạo mức 1, các prime khác, mọi miền terminal, LRC(12), và chặn giải tích/tích prime. ZIP toàn bộ chưa được xác minh. Gcd chỉ có ý nghĩa giảm bài toán dưới giả thiết LRC(12) khai báo nhưng chưa phát lại.", "Full level-1 orbits, other primes, all terminal domains, lower LRC(12), and the analytic/prime-product bound are unestablished. The whole ZIP is unverified. Gcd only reduces the problem under the declared but unreplayed LRC(12) premise.")}</p>
      <p className="text-meta text-ink-muted mt-3">{t("Chỉ đọc và kiểm thuần checkpoint trong ngân sách 30 giây; không gọi Python, sinh cây, truy nguồn ngoài hay gọi mô hình trên GET. Xác thực và tải workspace bình thường vẫn áp dụng. Hash/receipt local không phải chữ ký thực thi hay kiểm chứng hình thức.", "Retained pure admission has a thirty-second observed budget; GET does not call Python, generate trees, fetch research sources or call models. Normal workspace authentication/loading still applies. Local hashes/receipts are not execution signatures or formal verification.")}</p>
      <p className="text-meta text-ink-muted mt-3">Jaan Allikvere · CC BY 4.0 · <a href={ALLIKVERE_PROVENANCE.record} className="underline" target="_blank" rel="noreferrer">Zenodo · 10.5281/zenodo.22066772</a></p>
      <details className="text-meta text-ink-muted mt-3"><summary className="min-h-8 cursor-pointer">{t("Checkpoint, nguồn và các chốt chưa nghiệm thu", "Checkpoint, sources and unestablished gates")}</summary><dl className="mt-2 grid gap-2 break-all">
        <div><dt>TIP-049</dt><dd className="font-mono">{report.contractDigest}</dd></div><div><dt>{t("Báo cáo cha", "Parent report")}</dt><dd className="font-mono">{report.baseReportDigest}</dd></div>
        <div><dt>{t("Bytes cha", "Parent bytes")}</dt><dd className="font-mono">{report.baseReportRawSha256}</dd></div><div><dt>Plan</dt><dd className="font-mono">{plan.planDigest}</dd></div>
        <div><dt>Packet</dt><dd className="font-mono">{report.evidence.packet.packetDigest}</dd></div><div><dt>Evidence</dt><dd className="font-mono">{report.evidence.evidenceDigest}</dd></div>
        <div><dt>{t("Python kiểm cây", "Python tree checker")}</dt><dd className="font-mono">{report.evidence.independent.coverScriptDigest}</dd></div><div><dt>{t("Python ghép checkpoint", "Python composition driver")}</dt><dd className="font-mono">{report.evidence.independent.scriptDigest}</dd></div>
        <div><dt>{t("Chương trình đã ghép", "Verified composed program")}</dt><dd className="font-mono">{report.evidence.independent.programDigest}</dd></div><div><dt>{t("Kết quả phát lại", "Independent output")}</dt><dd className="font-mono">{report.evidence.independent.outputDigest}</dd></div>
        <div><dt>{t("Manifest nguồn", "Source manifest")}</dt><dd className="font-mono">{report.sourceManifestDigest}</dd></div>
        <div><dt>{t("Báo cáo mới", "New report")}</dt><dd className="font-mono">{report.reportDigest}</dd></div>
        {report.uncoveredObligations.map((gap) => <div key={gap}><dt>{t("Chốt mở", "Open gate")}</dt><dd className="font-mono">{gap}</dd></div>)}
      </dl></details>
    </div>
  </Panel>;
}
