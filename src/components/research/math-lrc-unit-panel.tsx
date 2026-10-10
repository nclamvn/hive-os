import { Panel } from "@/components/ui/panel";
import { MathText } from "@/components/research/math-text";
import { ALLIKVERE_PROVENANCE } from "@/modules/research-sandbox/math-lrc-allikvere-report";
import { validateRetainedAllikvereUnitReport } from "@/modules/research-sandbox/math-lrc-unit-report";

/** Server-side retained projection; admission never launches the collector. */
export function MathLrcUnitPanel({ raw, base, frontier, locale }: {
  raw: unknown; base: unknown; frontier: unknown; locale: string;
}) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const report = validateRetainedAllikvereUnitReport(raw, base, frontier);
  if (!report) return <Panel id="allikvere-unit" role="alert" className="min-w-0 scroll-mt-24 p-5 sm:p-6">
    <h2 className="text-section-title text-ink-strong">{t("Chứng cứ hợp phép nhân đơn vị chưa có hoặc không hợp lệ", "Unit-action union evidence unavailable or invalid")}</h2>
    <p className="text-body text-ink-muted mt-3">{t("Báo cáo TIP-048/049 giữ nguyên. Kiểm đọc thất bại hoặc hết thời gian không tự tạo cây, chạy Python, truy nguồn nghiên cứu ngoài hay gọi mô hình.", "TIP-048/049 reports remain unchanged. Failed or expired retained admission never generates trees, launches Python, fetches external research sources or calls a model.")}</p>
  </Panel>;
  const summary = report.evidence.primary;
  const format = (value: string | number) => new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(BigInt(value));
  const interval = (value: { start: string; end: string }) => `[${value.start}, ${value.end})`;
  return <Panel id="allikvere-unit" className="min-w-0 scroll-mt-24 overflow-hidden p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="text-meta text-ink-muted">{t("TIP-050 · tái dùng chứng minh · chỉ đọc", "TIP-050 · proof reuse · retained only")}</p>
        <h2 className="text-section-title text-ink-strong mt-2">{t("Hợp chính xác dưới phép nhân đơn vị · p=199", "Exact unit-action union · p=199")}</h2></div>
      <span role="status" className="border-line text-meta text-ink rounded-md border px-3 py-2">{t("Toàn cục: chưa thiết lập", "Global: NOT ESTABLISHED")}</span>
    </div>
    <p className="text-body text-ink-muted mt-4">{t("Tái dùng đúng các miền COVER_BOUND đã kiểm trong bốn miền FULL của TIP-048 và cây con TIP-049. Sáu phép nhân đơn vị chuyển cùng lúc mọi tọa độ bằng một hoán vị thời gian chung; hợp và phần bù được dựng lại chính xác, không nhân số đếm với 6.", "Reuse only checked COVER_BOUND regions in the four TIP-048 FULL domains and TIP-049 child trees. Six unit actions transport all coordinates with one common time permutation; the union and complement are reconstructed exactly, not counted by multiplying by 6.")}</p>
    <p className="text-body text-ink-muted mt-3">{t("Phân loại nghiên cứu vẫn PARTIAL. Đây là bước công cụ tính toán đã dừng, không phải chiến dịch LLM, kết quả benchmark mù, tính mới hay chứng minh toàn cục. Miền neo, GCD có điều kiện và survivor không được nâng thành miền có nhân chứng bằng phép chuyển này.", "Research classification remains PARTIAL. This stopped computational step is not an LLM campaign, blind benchmark result, novelty claim or global proof. Anchored domains, conditional GCD and survivor labels are not promoted into witness regions by this transport.")}</p>
    <MathText className="mt-4" text={"$H=398,\\quad M=2786,\\quad s=1+Ht,\\quad d'=(1-t)d+tr\\pmod 7$"} />
    <p className="text-meta text-ink-muted mt-2 break-words">t = 0, 2, 3, 4, 5, 6 · s = 1, 797, 1195, 1593, 1991, 2389</p>
    <p className="text-meta text-ink-muted mt-2">{t("r là phần dư cha đã khóa của cùng tọa độ modulo 398; d là chữ số nâng từ 0 đến 6. Không đổi nhãn hoặc ghép các tọa độ.", "r is the sealed parent residue of the same coordinate modulo 398; d is its lift digit from 0 to 6. Coordinate labels are neither reordered nor combined.")}</p>
    <MathText className="mt-4" text={"$I(d_0,\\ldots,d_{k-1})=\\left[\\sum_{i<k}d_i7^{12-i},\\;\\sum_{i<k}d_i7^{12-i}+7^{13-k}\\right)$"} />
    <p className="text-meta text-ink-muted mt-3">{t("Prefix được mã hóa bằng khoảng nửa mở theo thứ tự cơ số 7. Các khoảng giao nhau và kề nhau được hợp; điểm cố định và vùng trùng chỉ đếm một lần. Mỗi hàng là miền tọa độ có thứ tự riêng, không phải số cấu hình duy nhất trên cả bốn hàng hoặc số quỹ đạo lấy thương.", "Prefixes encode half-open base-7 ordinal intervals. Overlapping and adjacent intervals merge; fixed points and overlapping regions count only once. Each row is its own ordered-coordinate domain, not globally unique configurations across four rows or quotient-orbit counts.")}</p>
    <div className="mt-5 grid gap-4">{summary.rows.map((row) => <article key={row.parentId} className="border-line min-w-0 border-t pt-4">
      <div className="flex flex-wrap items-start justify-between gap-2"><h3 className="text-body text-ink-strong break-words font-medium">{row.parentId}</h3><span className="text-meta text-ink-muted">{row.status}</span></div>
      <p className="text-meta text-ink-muted mt-2">{t("Toàn miền", "Whole domain")}: {format(row.totalTuples)}</p>
      <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div><dt className="text-ink-muted">{t("Nhân chứng trước chuyển", "Original witness coverage")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(row.originalWitnessTuples)}</dd></div>
        <div><dt className="text-ink-muted">{t("Hợp chính xác đã kiểm", "Verified exact union")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(row.unionWitnessTuples)}</dd></div>
        <div><dt className="text-ink-muted">{t("Tăng thêm không trùng", "Additional non-duplicated coverage")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(row.deltaWitnessTuples)}</dd></div>
        <div><dt className="text-ink-muted">{t("Còn lại chính xác", "Exact remaining coverage")}</dt><dd className="text-ink-strong mt-1 break-words font-medium">{format(row.remainingTuples)}</dd></div>
      </dl>
      <details className="text-meta text-ink-muted mt-3"><summary className="min-h-8 cursor-pointer">{t("Trùng lặp, khoảng mẫu và digest đầy đủ", "Overlap, interval examples and complete digests")}</summary>
        <dl className="mt-2 grid gap-3 break-words">
          <div><dt>{t("Khối lượng chuyển có lặp", "Raw transported multiplicity")}</dt><dd>{format(row.rawTransportTuples)}</dd></div>
          <div><dt>{t("Phần đếm trùng đã bỏ", "Repeated multiplicity removed")}</dt><dd>{format(row.overlapTuples)}</dd></div>
          <div><dt>{t("Lá nguồn / khoảng ứng viên", "Source leaves / candidate intervals")}</dt><dd>{format(row.sourceLeafCount)} / {format(row.candidateIntervals)}</dd></div>
          <div><dt>{t("Khoảng hợp / phần bù", "Union / complement intervals")}</dt><dd>{format(row.unionIntervals)} / {format(row.complementIntervals)}</dd></div>
          <div><dt>{t("Ví dụ hợp · tối đa 8", "Union examples · at most 8")}</dt><dd className="mt-1 space-y-1 font-mono">{row.unionExamples.map((item, i) => <span className="block" key={i}>{interval(item)}</span>)}</dd></div>
          <div><dt>{t("Ví dụ phần bù · tối đa 8", "Complement examples · at most 8")}</dt><dd className="mt-1 space-y-1 font-mono">{row.complementExamples.map((item, i) => <span className="block" key={i}>{interval(item)}</span>)}</dd></div>
          <div><dt>{t("Digest toàn bộ hợp", "Complete union digest")}</dt><dd className="font-mono break-all">{row.unionDigest}</dd></div>
          <div><dt>{t("Digest toàn bộ phần bù", "Complete complement digest")}</dt><dd className="font-mono break-all">{row.complementDigest}</dd></div>
        </dl>
        <p className="mt-3">{t("Các ví dụ không thay cho toàn bộ phần bù. Kiểm đọc dựng lại mọi khoảng từ chứng chỉ nguồn đã khóa; digest và số đếm không được tin độc lập.", "Examples do not replace the complete complement. Retained admission reconstructs every interval from sealed source certificates; digests and counts are not trusted independently.")}</p>
      </details>
    </article>)}</div>
    <div className="border-line mt-5 border-t pt-4">
      <h3 className="text-body text-ink-strong font-medium">{t("Năm nghĩa vụ toàn cục vẫn mở", "Five global obligations remain open")}</h3>
      <p className="text-body text-ink-muted mt-3">{t("Chưa thiết lập toàn bộ quỹ đạo mức 1, các prime khác, mọi miền terminal, LRC(12), và chặn giải tích/tích prime. ZIP toàn bộ chưa được xác minh; LRC(12) chỉ là giả thiết khai báo chưa phát lại. Không dùng hợp hữu hạn này để tự động nghiệm thu định lý 14/15 hoặc agent thành công.", "Full level-1 orbits, other primes, all terminal domains, LRC(12), and the analytic/prime-product bound remain unestablished. The whole ZIP is unverified; LRC(12) is only a declared, unreplayed premise. This finite union does not automatically accept a 14/15 theorem or agent success.")}</p>
      <p className="text-meta text-ink-muted mt-3">{t("Khảo sát đã thấy số đếm chuyển trước BUILD: không phải đánh giá mù. Tái dùng quỹ đạo đơn vị đã có trong Remark 2.3 của Allikvere; không khẳng định tính mới. Kiểm thuần trên GET có ngân sách quan sát 60 giây, không sinh chứng chỉ, chạy Python, truy nguồn nghiên cứu ngoài hay gọi mô hình; tải và xác thực workspace bình thường vẫn áp dụng.", "The pre-BUILD scan exposed transport counts: this is not blind evaluation. Allikvere's Remark 2.3 already discusses unit orbits; no novelty is asserted. Pure GET admission has a sixty-second observed budget and does not generate certificates, launch Python, fetch external research sources or call models; normal workspace loading/authentication still applies.")}</p>
      <p className="text-meta text-ink-muted mt-3">Jaan Allikvere · CC BY 4.0 · <a href={ALLIKVERE_PROVENANCE.record} className="underline" target="_blank" rel="noreferrer">Zenodo · 10.5281/zenodo.22066772</a></p>
      <details className="text-meta text-ink-muted mt-3"><summary className="min-h-8 cursor-pointer">{t("Nguồn và chốt chưa nghiệm thu", "Provenance and unestablished gates")}</summary>
        <dl className="mt-2 grid gap-2 break-all">
          <div><dt>TIP-050</dt><dd className="font-mono">{report.contractDigest}</dd></div>
          <div><dt>{t("Bytes TIP-048", "TIP-048 bytes")}</dt><dd className="font-mono">{report.baseReportRawSha256}</dd></div>
          <div><dt>{t("Báo cáo TIP-048", "TIP-048 report")}</dt><dd className="font-mono">{report.baseReportDigest}</dd></div>
          <div><dt>{t("Bytes TIP-049", "TIP-049 bytes")}</dt><dd className="font-mono">{report.frontierReportRawSha256}</dd></div>
          <div><dt>{t("Báo cáo TIP-049", "TIP-049 report")}</dt><dd className="font-mono">{report.frontierReportDigest}</dd></div>
          <div><dt>{t("Manifest tác giả", "Author manifest")}</dt><dd className="font-mono">{report.sourceManifestDigest}</dd></div>
          <div><dt>Evidence</dt><dd className="font-mono">{report.evidence.evidenceDigest}</dd></div>
          <div><dt>Python 048</dt><dd className="font-mono">{report.evidence.independent.coverScriptDigest}</dd></div>
          <div><dt>Python 049</dt><dd className="font-mono">{report.evidence.independent.frontierScriptDigest}</dd></div>
          <div><dt>{t("Python chuyển/hợp", "Python transport/union")}</dt><dd className="font-mono">{report.evidence.independent.scriptDigest}</dd></div>
          <div><dt>{t("Chương trình đã ghép", "Composed program")}</dt><dd className="font-mono">{report.evidence.independent.programDigest}</dd></div>
          <div><dt>{t("Kết quả phát lại", "Independent output")}</dt><dd className="font-mono">{report.evidence.independent.outputDigest}</dd></div>
          <div><dt>{t("Báo cáo mới", "New report")}</dt><dd className="font-mono">{report.reportDigest}</dd></div>
          {report.uncoveredObligations.map((gap) => <div key={gap}><dt>{t("Chốt mở", "Open gate")}</dt><dd className="font-mono">{gap}</dd></div>)}
        </dl>
      </details>
      <p className="text-meta text-ink-muted mt-3">{t("Hash/receipt local không là chữ ký thực thi hay kiểm chứng hình thức. Không có cache nghiệm thu giữa các yêu cầu.", "Local hashes/receipts are not execution signatures or formal verification. There is no cross-request admission cache.")}</p>
    </div>
  </Panel>;
}
