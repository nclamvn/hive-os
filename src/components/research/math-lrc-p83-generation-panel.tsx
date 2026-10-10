import { MathText } from "@/components/research/math-text";
import { validateRetainedP83GenerationReport } from "@/modules/research-sandbox/math-lrc-p83-generation";

/** Passive small-summary projection; no full tree or dataset admission on GET. */
export function MathLrcP83GenerationPanel({ raw, locale }: { raw: unknown; locale: string }) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const report = validateRetainedP83GenerationReport(raw);
  const linkClass = "inline-flex min-h-10 max-w-full items-center break-words text-ink-muted underline hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return <section id="allikvere-p83-generation" aria-labelledby="allikvere-p83-generation-title" className="border-line mt-4 min-w-0 scroll-mt-24 border-b pb-4">
    <h3 id="allikvere-p83-generation-title" className="text-body text-ink-strong font-medium">{report
      ? t("Prime 83: hoàn tất sinh miền level 1", "Prime 83: level-one generation complete")
      : t("Prime 83: kiểm chứng sinh miền level 1", "Prime 83: level-one generation audit")}</h3>
    {!report ? <div role="alert" className="text-body text-ink-muted mt-2 max-w-[76ch]">
      <p>{t("Summary sinh miền p83 chưa có hoặc không khớp pin. Không hiện kết quả, số đếm hay receipt chưa nghiệm thu; cascade, terminal và kết luận toàn cục vẫn chưa khép.", "The p83 generation summary is unavailable or does not match its pin. Unadmitted results, counts and receipts are hidden; cascade, terminal and the global conclusion remain open.")}</p>
      <p className="text-meta mt-2">{t("Trang đọc không sinh miền hay chạy bộ kiểm cây/dataset đầy đủ.", "This read page does not generate the domain or run full tree/dataset checking.")}</p>
    </div> : <>
      <MathText className="mt-2 block min-w-0" text={`$|\\mathcal C_{13}|=${report.counts.irredundant13}+${report.counts.reducible13}=${report.counts.canonical13}$`} />
      <p className="text-body text-ink mt-2 max-w-[76ch]">{report.counts.canonical13} {t("đại diện chuẩn 13 phần tử", "canonical 13-entry representatives")}: {report.counts.irredundant13} {t("phủ irredundant13 và", "irredundant13 covers and")} {report.counts.reducible13} {t("mở rộng reducible13", "reducible13 extensions")}. {report.counts.canonical12} {t("seed phủ12 là tập riêng, không cộng vào tổng13.", "12-cover seeds form a separate family, not another summand in the 13-entry total.")}</p>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">p = {report.target.prime} ∈ {report.target.primeSet}, {report.target.primeSetSize} {t("prime", "primes")}; k = {report.target.movingSpeeds}, {report.target.totalRunners} {t("người chạy tổng cộng", "total runners")}. {t("Checkpoint τ phía trên giữ mốc trước khi sinh miền; tầng sinh này đã được kiểm riêng. Cascade và terminal vẫn MỞ. Toàn prime, cả tập 61 prime và LRC14/15 chưa được nghiệm thu; tất cả 23 nghĩa vụ áp dụng toàn cục giữ MỞ.", "The τ checkpoint above retains its pre-generation snapshot; this generation stage has now been checked separately. Cascade and terminal remain OPEN. The full prime, all 61 primes and LRC14/15 are not admitted; all 23 global application obligations remain OPEN.")}</p>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("GET chỉ đối chiếu summary local đã pin, không phải phát lại toán mới. Kiểm cây đầy đủ và từng dòng dữ liệu đã diễn ra trong tác vụ offline riêng, không chạy khi mở trang.", "GET checks only the pinned local summary, not a fresh mathematical replay. Full-tree and every-row admission occurred in a separate offline run, not when this page opens.")}</p>
      <details className="text-meta text-ink-muted mt-3">
        <summary className="min-h-10 cursor-pointer">{t("Miền đầy đủ và 20 cây sinh", "Complete domain and 20 generation trees")}</summary>
        <p className="mt-2 max-w-[76ch]">{t("Miền đầu ra gồm mọi multiset 13 phần tử của 41 lớp khác 0 gấp theo dấu modulo83 mà các mask xấu phủ mọi lớp thời gian, chuẩn hóa qua hoán vị và mọi 41 đơn vị gấp. Giữ đủ bội số tọa độ: các vận tốc nguyên phân biệt vẫn có thể có phần dư trùng. Không có nhân chứng trên lưới level1 không phải phản ví dụ LRC liên tục.", "The output includes every 13-entry multiset of 41 nonzero sign-folded classes modulo83 whose bad masks cover all time classes, canonicalized under permutations and all 41 folded units. Coordinate multiplicities are preserved: distinct integer speeds can have repeated residues. No level-one grid witness is not a continuous-time LRC counterexample.")}</p>
        <p className="mt-2 max-w-[76ch]">{t("τ83=12 tách miền thành phủ chứa một phủ12 hoặc phủ13 irredundant. Mọi seed12 được mở rộng bằng cả 41 lớp, kể cả lớp đã có và lớp không tăng độ phủ. Mỗi thành viên của phủ irredundant có thời gian riêng; mất mọi thời gian riêng không thể được khôi phục bằng thêm lớp. Đây là bổ đề tối thiểu riêng, không tái dùng phép loại chỉ đúng cho quyết định ≤11.", "τ83=12 partitions the domain into covers containing a 12-cover or irredundant13 covers. Every 12-seed is extended by all 41 classes, including existing and zero-gain classes. Every irredundant member has private times; losing all private times cannot be reversed by adding classes. This is a separate minimality lemma, not reuse of decision-only ≤11 pruning.")}</p>
        <p className="mt-2 max-w-[76ch]">{report.roots.length} {t("gốc đầy đủ", "complete roots")}; {report.counts.totalNodes} {t("node đã kiểm offline", "nodes checked offline")}. {report.counts.repeated13} {t("đại diện13 có tọa độ lặp được giữ lại", "13-entry representatives with repeats retained")}. {t("Mọi cặp riêng, pivot, nhánh con và phép chuẩn hóa được tái dựng, rồi so từng byte/dòng của dataset; số đếm/hash riêng không chứng minh tính đầy đủ.", "Every private pair, pivot, child branch and canonicalization is reconstructed, then every dataset byte/row compared; counts or hashes alone do not prove completeness.")}</p>
        <ul className="mt-3 space-y-2">{report.roots.map((root) => <li key={`${root.targetSize}:${root.pair.join(",")}`} className="min-w-0 [overflow-wrap:anywhere]">
          s = {root.targetSize}, ({root.pair.join(", ")}): {root.nodes} {t("node", "nodes")}, {root.leafOccurrences} {t("lần xuất hiện lá", "leaf occurrences")}; {root.traceBytes} {t("byte cây", "tree bytes")}.
        </li>)}</ul>
      </details>
      <details className="text-meta text-ink-muted mt-2">
        <summary className="min-h-10 cursor-pointer">{t("Dataset, pin và ranh giới tin cậy", "Datasets, pins and trust boundary")}</summary>
        <a href={report.source.primaryUrl} target="_blank" rel="noreferrer" className={linkClass}>{t("Nguồn phương pháp đúng phiên bản", "Exact method-source revision")}</a>
        <dl className="mt-2 grid min-w-0 gap-2 [overflow-wrap:anywhere]">
          <div><dt>{t("Tầng đã hoàn tất", "Completed stage")}</dt><dd>{report.status}</dd></div>
          <div><dt>{t("Nghiệm thu trên trang đọc", "Read-page admission")}</dt><dd>{report.trust.get}</dd></div>
          <div><dt>{t("Nghiệm thu toán offline", "Offline mathematical admission")}</dt><dd>{report.trust.semanticAdmission}</dd></div>
          {Object.entries(report.datasets).map(([name, dataset]) => <div key={name}><dt>{name}: {dataset.path}</dt><dd>{dataset.bytes} bytes; <span className="font-mono">{dataset.sha256}</span></dd></div>)}
          <div><dt>{t("Toàn prime / toàn cục", "Full prime / global")}</dt><dd>{report.remaining.fullPrime} / {report.remaining.global}</dd></div>
          <div><dt>{t("Thời điểm lưu summary", "Summary retention time")}</dt><dd>{report.generatedAt}</dd></div>
          <div><dt>{t("Summary", "Summary")}</dt><dd className="font-mono">{report.reportDigest}</dd></div>
          <div><dt>Python source</dt><dd className="font-mono">{report.receipt.sourceSha256}</dd></div>
          <div><dt>Python input / output</dt><dd className="font-mono">{report.receipt.inputSha256} / {report.receipt.stdoutSha256}</dd></div>
          <div><dt>{t("Thời gian phát lại offline", "Offline replay duration")}</dt><dd>{report.receipt.elapsedMs} ms</dd></div>
        </dl>
        <p className="mt-3 max-w-[76ch]">{t("Không tải cây/dataset lớn hoặc dựng lại hàng triệu node trên GET. Tầng sau phải dùng đúng dataset13 đã nghiệm thu, không thay bằng một lát cắt hay số tổng. Receipt không ký dựa vào bộ thu/lưu trữ local tin cậy; không là xác nhận bên ngoài, chứng minh hình thức hoặc phát lại mới TIP-056.", "GET neither imports large trees/datasets nor reconstructs millions of nodes. The next stage must consume the exact admitted 13-dataset, not a shard or aggregate count. The unsigned receipt relies on the trusted local collector/storage; it is not external attestation, formal proof or a fresh TIP-056 replay.")}</p>
        <p className="mt-2 max-w-[76ch]">{t("Không chạy code tác giả, mô hình hay chiến dịch agent mới; không tuyên bố tính mới. LRC dưới chỉ là nguồn đã rà soát chưa tái lập độc lập; nghiệm thu hình thức và toàn cục còn mở.", "No author code, model or new agent campaign is executed; no novelty is claimed. Lower LRC is source-reviewed, not independently reproduced; formal and global acceptance remain open.")}</p>
      </details>
    </>}
  </section>;
}
