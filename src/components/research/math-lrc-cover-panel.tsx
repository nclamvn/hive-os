import { Panel } from "@/components/ui/panel";
import { MathText } from "@/components/research/math-text";
import { ALLIKVERE_PROVENANCE } from "@/modules/research-sandbox/math-lrc-allikvere-report";
import { validateRetainedAllikvereCoverReport } from "@/modules/research-sandbox/math-lrc-cover-report";

/** Separate from the immutable TIP047 view; no producer or replay on GET. */
export function MathLrcCoverPanel({ raw, locale }: { raw: unknown; locale: string }) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const report = validateRetainedAllikvereCoverReport(raw);
  if (!report) return <Panel id="allikvere-cover" role="alert" className="min-w-0 scroll-mt-24 p-5 sm:p-6">
    <h2 className="text-section-title text-ink-strong">{t("Chứng chỉ chặn phủ chưa hợp lệ hoặc chưa có", "Compact cover evidence unavailable or invalid")}</h2>
    <p className="text-body text-ink-muted mt-3">{t("Không tự sinh cây, chạy Python hoặc tải nguồn khi mở trang. Báo cáo cần khớp đủ tám miền và kiểm lại trong ngân sách đọc đã khóa.", "Opening this page does not generate a tree, run Python or fetch research sources. The report must match all eight frozen domains and pass the bounded retained check.")}</p>
  </Panel>;
  const format = (value: string) => new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(BigInt(value));
  return <Panel id="allikvere-cover" className="min-w-0 scroll-mt-24 overflow-hidden p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="text-meta text-ink-muted">{t("TIP-048 · chứng chỉ mới · chỉ đọc", "TIP-048 · separate certificate · retained only")}</p>
        <h2 className="text-section-title text-ink-strong mt-2">{t("Cây chặn phủ gọn · p=199", "Compact cover-bound trees · p=199")}</h2></div>
      <span role="status" className="border-line text-meta text-ink rounded-md border px-3 py-2">{t("Toàn cục: chưa thiết lập", "Global: NOT ESTABLISHED")}</span>
    </div>
    <p className="text-body text-ink-muted mt-4">{report.status === "PARTIAL"
      ? t("Báo cáo PARTIAL đã được kiểm độc lập: phân hoạch cây hợp lệ nhưng còn miền chưa được phân loại toán học. Đây không phải một cây đã khép hoàn toàn và không được đưa vào agent như bằng chứng thành công.", "This independently checked report is PARTIAL: tree partitions are valid, but mathematical classification still has unresolved regions. This is not complete closure and is not agent-success evidence.")
      : t("Cả tám miền khai báo đã được phân loại trong chứng chỉ lưu trữ. Kết quả vẫn có phụ thuộc gcd chưa được nghiệm thu và không thiết lập định lý toàn cục hay tự kích hoạt agent.", "All eight declared domains are classified in the retained certificates. The result still has an unverified gcd dependency and establishes neither a global theorem nor automatic agent authority.")}</p>
    <MathText className="mt-4" text={"$\\text{ANCHORED}:7^8=5{,}764{,}801;\\qquad\\text{FULL}:7^{13}=96{,}889{,}010{,}407$"} />
    <p className="text-meta text-ink-muted mt-3">{t("Bốn miền neo cố định đúng năm chữ số đầu từ log tác giả; tám trục còn lại đầy đủ 0..6. Bốn miền FULL dùng đủ 13 trục 0..6. Mỗi miền neo là tập con của miền FULL tương ứng: không cộng hai nhóm như số điểm duy nhất.", "Four anchored domains fix exactly the first five archived digits; their remaining eight axes exhaust 0..6. Four FULL domains exhaust all thirteen axes. Each anchored domain is a subset of its corresponding FULL domain: do not add the two groups as unique points.")}</p>
    <MathText className="mt-4" text={"$|U|>\\sum_i b_i\\quad\\Longrightarrow\\quad\\forall\\text{ completion }\\exists\\text{ grid witness}$"} />
    <p className="text-meta text-ink-muted mt-3">{t("Dùng chặn hợp đã biết trong Lemma 4.3 của Allikvere, không phải tính mới toán học. Một lá chặn phủ cho phép mỗi bộ hoàn thành có nhân chứng khác nhau; không khẳng định một thời điểm chung cho cả nhánh. Bằng nhau không đủ để cắt nhánh.", "This uses the known union-bound prune in Allikvere's Lemma 4.3, not mathematical novelty. A cover-bound leaf allows different completions to have different witnesses; it does not claim one common time for the whole branch. Equality cannot prune.")}</p>
    <div className="mt-5 grid gap-4">{report.rows.map((row) => {
      const s = row.evidence.primary;
      return <article key={row.id} className="border-line min-w-0 border-t pt-4">
        <div className="flex flex-wrap items-start justify-between gap-2"><h3 className="text-body text-ink-strong break-words font-medium">{row.id}</h3>
          <span className="text-meta text-ink-muted">{row.kind} · {s.status}</span></div>
        <p className="text-meta text-ink-muted mt-2">{t("Mức 2 → 14 · tọa độ có thứ tự, không lấy thương quỹ đạo", "Level 2 → 14 · ordered coordinates, no orbit quotient")}</p>
        <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-ink-muted">{t("Toàn miền", "Whole domain")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(s.totalTuples)}</dd></div>
          <div><dt className="text-ink-muted">{t("Đã phân loại", "Classified")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(s.classifiedTuples)}</dd></div>
          <div><dt className="text-ink-muted">{t("Chặn phủ · nhân chứng lưới tồn tại", "Cover bound · grid witness exists")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(s.witnessTuples)}</dd></div>
          <div><dt className="text-ink-muted">{t("Giảm gcd · có điều kiện", "Conditional gcd reduction")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(s.gcdTuples)}</dd></div>
          <div><dt className="text-ink-muted">{t("Đã kiểm và còn lại", "Checked survivors")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(s.survivorTuples)}</dd></div>
          <div><dt className="text-ink-muted">{t("Chưa giải quyết", "Unresolved")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(s.unresolvedTuples)}</dd></div>
        </dl>
        <p className="text-meta text-ink-muted mt-3">{s.nodeCount} {t("node", "nodes")} · {s.leafCount} {t("lá", "leaves")}. {t("Số đếm là loại lá đã chọn, không phải các điều kiện vốn loại trừ nhau.", "Counts describe chosen leaf labels, not intrinsically exclusive conditions.")}</p>
        <details className="text-meta text-ink-muted mt-3"><summary className="min-h-8 cursor-pointer">{t("Miền chính xác và dấu vết", "Exact domain and provenance")}</summary>
          <dl className="mt-2 grid gap-2 break-all"><div><dt>{t("Tọa độ cha", "Parent coordinates")}</dt><dd className="font-mono">{row.scope.parentResidues.join(", ")}</dd></div>
            <div><dt>{t("Các trục chữ số đã khóa", "Sealed digit axes")}</dt><dd className="font-mono">{row.scope.digitAxes.map((axis) => `[${axis.join(",")}]`).join(" ")}</dd></div>
            <div><dt>{t("Chữ số gốc của tác giả", "Archived author digits")}</dt><dd className="font-mono">{row.authorTerminalDigits.join(", ")}</dd></div>
            <div><dt>Source</dt><dd className="font-mono">{row.scope.sourceDigest}</dd></div><div><dt>Root</dt><dd className="font-mono">{row.rootContractDigest}</dd></div>
            <div><dt>Scope</dt><dd className="font-mono">{row.evidence.scopeDigest}</dd></div><div><dt>Certificate</dt><dd className="font-mono">{row.evidence.certificate.certificateDigest}</dd></div>
            <div><dt>Evidence</dt><dd className="font-mono">{row.evidence.evidenceDigest}</dd></div><div><dt>Python source</dt><dd className="font-mono">{row.evidence.independent.scriptDigest}</dd></div>
            <div><dt>Python output</dt><dd className="font-mono">{row.evidence.independent.outputDigest}</dd></div></dl>
        </details>
      </article>;
    })}</div>
    <div className="border-line mt-5 border-t pt-4"><h3 className="text-body text-ink-strong font-medium">{t("Phạm vi chưa được nghiệm thu", "Unestablished global obligations")}</h3>
      <p className="text-body text-ink-muted mt-3">{t("Vẫn giữ đủ năm chốt mở: toàn bộ quỹ đạo mức 1, các prime khác, mọi nhánh đầu cuối cần cho chứng minh toàn cục, giả thiết LRC(12), và chặn giải tích/tích prime. Gcd chỉ là điều kiện số học; phụ thuộc LRC(12) chưa được phát lại. Không dùng log tổng node của tác giả để thay cây kiểm chứng.", "All five global obligations remain: full level-1 orbits, other primes, all terminal branches required by the global proof, lower LRC(12), and the analytic/prime-product bound. Gcd is an arithmetic condition; lower LRC(12) has not been replayed. Author aggregate node counters never replace a checked tree.")}</p>
      <p className="text-meta text-ink-muted mt-3">{t("TIP-047 và các lát cắt 49 điểm được giữ nguyên; bằng chứng mới này là artifact riêng, không sửa kết quả hay điểm nghiên cứu cũ. Không tự gửi cho agent hoặc gọi mô hình. Đường dẫn này chỉ đọc chứng chỉ và kiểm thuần trong ngân sách 10 giây; xác thực/tải workspace bình thường vẫn áp dụng.", "TIP-047 and its 49-point shards remain unchanged; this is a separate artifact, not a historical regrade. No automatic agent dispatch or model calls. This view only reads certificates and runs bounded pure checks within ten observed seconds; normal workspace authentication/loading still applies.")}</p>
      <p className="text-meta text-ink-muted mt-3">Jaan Allikvere · CC BY 4.0 · <a href={ALLIKVERE_PROVENANCE.record} className="underline" target="_blank" rel="noreferrer">Zenodo · 10.5281/zenodo.22066772</a>. {t("ZIP toàn bộ chưa được xác minh. Hash và receipt local không phải chữ ký thực thi hay kiểm chứng hình thức.", "The whole ZIP is unverified. Local hashes and receipts are not execution signatures or formal verification.")}</p>
      <dl className="text-meta text-ink-muted mt-3 grid gap-2 break-all"><div><dt>{t("Báo cáo", "Report")}</dt><dd className="font-mono">{report.reportDigest}</dd></div>
        <div><dt>TIP-048</dt><dd className="font-mono">{report.contractDigest}</dd></div><div><dt>{t("Manifest nguồn", "Source manifest")}</dt><dd className="font-mono">{report.sourceManifestDigest}</dd></div></dl>
    </div>
  </Panel>;
}
