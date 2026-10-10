import { Panel } from "@/components/ui/panel";
import { MathText } from "@/components/research/math-text";
import { ALLIKVERE_PROVENANCE, ALLIKVERE_ROOT_README_DIGEST, validateRetainedAllikvereReport } from "@/modules/research-sandbox/math-lrc-allikvere-report";

/** Retained-only projection: pure certificate checks, never tool dispatch. */
export function MathAllikvereReportPanel({ raw, locale }: { raw: unknown; locale: string }) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const report = validateRetainedAllikvereReport(raw);
  if (!report) return <Panel id="allikvere" role="alert" className="min-w-0 scroll-mt-24 p-5 sm:p-6">
    <h2 className="text-section-title text-ink-strong">{t("Báo cáo mô-đun chưa hợp lệ", "Modular report unavailable or invalid")}</h2>
    <p className="text-body text-ink-muted mt-3">{t("Không tự chạy lại công cụ trên trang đọc. Cần thực hiện CLI local được kiểm soát trước khi lưu một báo cáo đầy đủ.", "This read page does not rerun tools. A controlled local CLI must retain a complete report first.")}</p>
  </Panel>;
  return <Panel id="allikvere" className="min-w-0 scroll-mt-24 overflow-hidden p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="text-meta text-ink-muted">{t("Nguồn nhập · chỉ đọc · không gọi agent", "Imported evidence · read only · no agent dispatch")}</p>
        <h2 className="text-section-title text-ink-strong mt-2">Allikvere · p = 199</h2></div>
      <span role="status" className="border-line text-meta text-ink rounded-md border px-3 py-2">{t("Kết luận toàn cục: chưa thiết lập", "Global verdict: NOT ESTABLISHED")}</span>
    </div>
    <p className="text-body text-ink-muted mt-4">{t("Đã phân loại đầy đủ hai miền nâng nhị phân 8.192 điểm và bốn lát cắt đầu cuối 49 điểm. Bộ kiểm TypeScript và Python độc lập khớp chứng chỉ đã lưu. Đầy đủ trong miền này không đồng nghĩa mọi điểm đều có nhân chứng, cũng không chứng minh giả thuyết Lonely Runner toàn cục.", "Two complete 8,192-point binary fibers and four 49-point terminal shards were classified. The TypeScript consumer and independent Python agree on the retained certificates. Completeness within these domains does not mean every point has a witness and does not establish the global Lonely Runner conjecture.")}</p>
    <MathText className="mt-4" text={"$N=14,\\quad k=13,\\quad p=199;\\qquad 2^{13}=8192,\\quad 7^2=49$"} />
    <p className="text-meta text-ink-muted mt-3">{t("Bốn lát cắt chỉ cố định 11 chữ số đầu từ log tác giả và duyệt đủ hai chữ số cuối; không phải duyệt 7¹³. Các tọa độ giữ nguyên thứ tự và cho phép trùng giá trị.", "Each terminal shard fixes the first 11 archived digits and exhausts the last two; it is not a 7¹³ search. Coordinate order and repeated values are preserved.")}</p>
    <p className="text-meta text-ink-muted mt-3">{t("Các số đếm phản ánh loại lá chứng chỉ đã chọn trong phân hoạch lưu trữ, không phải các tập điều kiện vốn loại trừ nhau: một điểm được ghi dưới gcd vẫn có thể có nhân chứng lưới.", "Counts reflect the chosen leaf labels in the retained partition, not intrinsically disjoint mathematical conditions: a point classified by gcd may also have a grid witness.")}</p>
    <div className="mt-5 grid gap-4">{report.rows.map((row) => <article key={row.id} className="border-line min-w-0 border-t pt-4">
      <h3 className="text-body text-ink-strong break-words font-medium">{row.id}</h3>
      <p className="text-meta text-ink-muted mt-2">{t("Mức", "Level")} {row.scope.parentLevel} → {row.scope.targetLevel} · {row.evidence.primary.classifiedTuples}/{row.evidence.primary.totalTuples} {t("điểm đã phân loại", "points classified")}</p>
      <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
        <div><dt className="text-ink-muted">{t("Nhân chứng lưới chính xác", "Exact grid witnesses")}</dt><dd className="text-ink-strong mt-1 font-medium">{row.evidence.primary.witnessTuples}</dd></div>
        <div><dt className="text-ink-muted">{t("Giảm gcd · có điều kiện", "Conditional gcd reduction")}</dt><dd className="text-ink-strong mt-1 font-medium">{row.evidence.primary.gcdTuples}</dd></div>
        <div><dt className="text-ink-muted">{t("Còn lại sau hai phép kiểm", "Survivors after both checks")}</dt><dd className="text-ink-strong mt-1 font-medium">{row.evidence.primary.survivorTuples}</dd></div>
      </dl>
      {row.authorSurvivorListMatched === true && <p className="text-meta text-ink-muted mt-3">{t("Danh sách còn lại khớp chính xác log tác giả; không dùng số node tổng của tác giả làm bằng chứng đóng miền.", "The survivor list exactly matches the author log; the author's aggregate node count is not domain-closure evidence.")}</p>}
      {row.evidence.primary.survivors.length > 0 && <details className="text-meta text-ink-muted mt-3"><summary className="min-h-8 cursor-pointer">{t("Các bộ tọa độ còn lại", "Retained survivor coordinates")}</summary>
        <ul className="mt-2 space-y-2">{row.evidence.primary.survivors.map((s) => <li key={s.digits.join(",")} className="break-words font-mono">({s.residues.join(", ")})</li>)}</ul>
      </details>}
      <details className="text-meta text-ink-muted mt-3"><summary className="min-h-8 cursor-pointer">{t("Miền và dấu vết SHA-256", "Domain and SHA-256 provenance")}</summary>
        <dl className="mt-2 grid gap-2 break-all"><div><dt>{t("Tọa độ cha có thứ tự", "Ordered parent coordinates")}</dt><dd className="font-mono">{row.scope.parentResidues.join(", ")}</dd></div>
          {row.authorTerminalPrefix && <div><dt>{t("Chữ số gốc · chỉ 11 đầu được cố định", "Archived digits · only first 11 fixed")}</dt><dd className="font-mono">{row.authorTerminalPrefix.join(", ")}</dd></div>}
          <div><dt>Source</dt><dd className="font-mono">{row.scope.sourceDigest}</dd></div><div><dt>Root contract</dt><dd className="font-mono">{row.rootContractDigest}</dd></div>
          <div><dt>Scope</dt><dd className="font-mono">{row.evidence.scopeDigest}</dd></div><div><dt>Certificate</dt><dd className="font-mono">{row.evidence.certificate.certificateDigest}</dd></div>
          <div><dt>Evidence</dt><dd className="font-mono">{row.evidence.evidenceDigest}</dd></div><div><dt>Python source</dt><dd className="font-mono">{row.evidence.independent.scriptDigest}</dd></div>
          <div><dt>Python output</dt><dd className="font-mono">{row.evidence.independent.outputDigest}</dd></div></dl>
      </details>
    </article>)}</div>
    <div className="border-line mt-5 border-t pt-4">
      <h3 className="text-body text-ink-strong font-medium">{t("Các phụ thuộc chưa khép", "Open proof dependencies")}</h3>
      <p className="text-body text-ink-muted mt-3">{t("Giả thiết quy nạp LRC(12) chỉ được khai báo, chưa phát lại. Mọi lá gcd phải giữ nhãn có điều kiện. Chưa kiểm miền/quỹ đạo mức 1 đầy đủ, các prime khác, toàn bộ miền đầu cuối, hoặc chặn tích prime giải tích.", "The lower LRC(12) premise is declared, not replayed. Every gcd leaf remains conditional. Full level-1 orbit coverage, other primes, the complete terminal domain, and the analytic prime-product bound are unverified.")}</p>
      <p className="text-meta text-ink-muted mt-3">{t("README gốc của tác giả gắn hai log với p=199; đó là xuất xứ lưu trữ, không phải nghiệm thu định lý. ZIP chỉ được đọc một phần: CRC/kích thước/SHA từng member đã đối chiếu, MD5 toàn ZIP chưa được xác minh. Archive 14-runner ghi 111 prime; manuscript v2 ghi 61 cho 14 và 71 cho 15 — không trộn các phạm vi.", "The archived author's README maps these logs to p=199; that is source provenance, not theorem acceptance. The ZIP was only partially read: member CRC/size/SHA were checked, but the whole ZIP MD5 was not verified. The 14-runner archive lists 111 primes; manuscript v2 lists 61 for 14 and 71 for 15—these scopes must not be conflated.")}</p>
      <p className="text-meta text-ink-muted mt-3">Jaan Allikvere · CC BY 4.0 · <a className="underline" href={ALLIKVERE_PROVENANCE.record} target="_blank" rel="noreferrer">Zenodo · 10.5281/zenodo.22066772</a></p>
      <p className="text-meta text-ink-muted mt-3">{t("Chỉ đọc chứng chỉ lưu trữ: không subprocess, không truy nguồn nghiên cứu bên ngoài, không gọi mô hình. Trang vẫn dùng cơ chế xác thực và tải workspace bình thường. Hash không thay thế chứng thực collector hay kiểm chứng hình thức.", "This view reads retained certificates only: no subprocess, external research fetches, or model calls. Normal workspace authentication and page loading still apply. Hashes are not collector attestation or formal verification.")}</p>
      <dl className="text-meta text-ink-muted mt-3 grid gap-2 break-all"><div><dt>{t("Báo cáo lưu trữ", "Retained report")}</dt><dd className="font-mono">{report.reportDigest}</dd></div>
        <div><dt>{t("Manifest nguồn", "Source manifest")}</dt><dd className="font-mono">{report.sourceManifestDigest}</dd></div>
        <div><dt>Archived README</dt><dd className="font-mono">{ALLIKVERE_ROOT_README_DIGEST}</dd></div></dl>
    </div>
  </Panel>;
}
