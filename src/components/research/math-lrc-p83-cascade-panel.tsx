import { MathText } from "@/components/research/math-text";
import { validateRetainedP83CascadeReport } from "@/modules/research-sandbox/math-lrc-p83-cascade";

/** Only projects the small admitted summary; no forest or dataset work on GET. */
export function MathLrcP83CascadePanel({ raw, locale }: { raw: unknown; locale: string }) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const report = validateRetainedP83CascadeReport(raw);
  return <section id="allikvere-p83-cascade" aria-labelledby="allikvere-p83-cascade-title" className="border-line mt-4 min-w-0 scroll-mt-24 border-b pb-4">
    <h3 id="allikvere-p83-cascade-title" className="text-body text-ink-strong font-medium">{report
      ? t("Prime 83: hoàn tất cascade nhị phân", "Prime 83: binary cascade complete")
      : t("Prime 83: kiểm chứng cascade nhị phân", "Prime 83: binary cascade audit")}</h3>
    {!report ? <div role="alert" className="text-body text-ink-muted mt-2 max-w-[76ch]">
      <p>{t("Summary cascade p83 chưa có hoặc không khớp pin. Không hiện kết quả, số đếm hay receipt chưa nghiệm thu; terminal và kết luận toàn cục vẫn chưa khép.", "The p83 cascade summary is unavailable or does not match its pin. Unadmitted results, counts and receipts are hidden; terminal and the global conclusion remain open.")}</p>
      <p className="text-meta mt-2">{t("GET không đọc cây/dataset lớn và không phát lại toán.", "GET neither reads large trees/datasets nor replays mathematics.")}</p>
    </div> : <>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Số đại diện còn lại theo từng level, không phải phần trăm chứng minh:", "Surviving representatives at each level, not a proof-completion percentage:")}</p>
      <ol aria-label={t("Chuỗi cascade đầy đủ", "Complete cascade sequence")} className="text-body text-ink mt-2 flex min-w-0 flex-wrap gap-x-4 gap-y-2">
        <li className="min-w-0"><MathText text={`$\\ell=1$`} />: {report.stages[0].parentCount}</li>
        {report.stages.map((stage) => <li key={stage.toLevel} className="min-w-0"><span aria-hidden="true">→ </span><MathText text={`$\\ell=${stage.toLevel}$`} />: {stage.survivors}</li>)}
      </ol>
      <p className="text-body text-ink mt-2 max-w-[76ch]">{t("Cả 5 tầng đã kiểm mọi parent và đủ 8192 lựa chọn nâng có nhãn cho mỗi parent. Tập tổ tiên level2 sống còn được suy ra từ toàn bộ đầu ra level32, không chọn trước.", "All 5 stages check every parent and all 8192 labelled lift choices per parent. Live level-two ancestors are derived from the entire level32 output, not selected in advance.")}</p>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">p = {report.target.prime} ∈ {report.target.primeSet}, {report.target.primeSetSize} {t("prime", "primes")}; k = {report.target.movingSpeeds}, {report.target.totalRunners} {t("người chạy tổng cộng", "total runners")}. {t("Dòng cascade MỞ ở checkpoint sinh miền phía trên là mốc lịch sử đã đóng băng; tầng cascade nay hoàn tất riêng. Terminal vẫn MỞ. Toàn prime, cả 61 prime và LRC14/15 chưa được nghiệm thu; tất cả 23 nghĩa vụ áp dụng toàn cục giữ MỞ.", "The generation checkpoint's cascade OPEN line is a frozen historical snapshot; this cascade stage is now complete separately. Terminal remains OPEN. The full prime, all 61 primes and LRC14/15 are not admitted; all 23 global application obligations remain OPEN.")}</p>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("GET chỉ đối chiếu summary local đã pin, không phải phát lại toán mới. Receipt của tác vụ offline riêng kiểm toàn rừng và từng dòng dữ liệu; mở trang không lặp lại tác vụ đó.", "GET checks only the pinned local summary, not a fresh mathematical replay. The separate offline receipt covers the full forest and every dataset row; opening this page does not repeat that run.")}</p>
      <details className="text-meta text-ink-muted mt-3">
        <summary className="min-h-10 cursor-pointer">{t("Toàn miền, phân hoạch nhánh và tổ tiên sống còn", "Whole domain, branch partition and live ancestors")}</summary>
        <p className="mt-2 max-w-[76ch]">{t("Đúng toàn bộ dataset13 của TIP-057 làm đầu vào. Mọi parent ở mỗi tầng kế tiếp đều được dùng; mỗi root phân hoạch đủ 8192 lựa chọn, gồm hai nhánh của mỗi split, phía đối lập của force và mọi phép gán tự do tại lá SAT. Không tái dùng loại nhánh bằng tính tối thiểu hay thời gian riêng.", "The exact full TIP-057 13-dataset is the input. Every parent at every subsequent stage is consumed; each root partitions all 8192 choices, including both split branches, opposite forced branches and every free assignment at SAT leaves. No minimality or private-time pruning is reused.")}</p>
        <MathText className="mt-2 block min-w-0" text={`$14\\,\\mathrm{distance}<83\\ell$`} />
        <p className="mt-2 max-w-[76ch]">{t("Bất đẳng thức xấu là nghiêm ngặt; đẳng thức là GOOD. Python độc lập kiểm lưới đầy đủ và gcd bỏ từng tọa độ cho mọi phép gán SAT. Phân biệt SAT thô, proper do gcd và improper còn lại; không có nhân chứng trên lưới không phải phản ví dụ LRC liên tục.", "The bad inequality is strict; equality is GOOD. Independent Python checks the full grid and every omitted-coordinate gcd for every SAT assignment. Raw SAT, gcd-proper and remaining improper assignments are distinct; no grid witness is not a continuous-time LRC counterexample.")}</p>
        <p className="mt-2 max-w-[76ch]">{t("Sau level1 chỉ gấp dấu, sắp xếp và khử trùng qua hoán vị; giữ tọa độ lặp, không chuẩn hóa theo đơn vị tại level hữu hạn.", "After level1 only sign-folding, sorting and permutation deduplication apply; repeated coordinates remain, with no finite-level unit canonicalization.")}</p>
        <ul className="mt-3 space-y-2">{report.stages.map((stage) => <li key={stage.toLevel} className="min-w-0 [overflow-wrap:anywhere]">
          {stage.fromLevel} → {stage.toLevel}: {stage.parentCount} {t("parent", "parents")}; {stage.nodes} {t("node", "nodes")}, {stage.forces} force, {stage.splits} split, {stage.conflicts} conflict, {stage.satCubes} SAT cube; {stage.satAssignments} SAT, {stage.gcdProper} gcd-proper, {stage.improperRaw} improper {t("trước khử trùng", "before deduplication")}, {stage.survivors} {t("đại diện giữ lại", "retained representatives")}.
        </li>)}</ul>
        <p className="mt-3 max-w-[76ch]">{report.counts.roots} {t("root đầy đủ", "complete roots")}; {report.counts.nodes} {t("node", "nodes")}, {report.counts.forces} force. {report.ancestors.count} {t("tổ tiên level2 được suy ra bằng giảm modulo166, gấp dấu và sắp xếp mọi dòng level32:", "level-two ancestors derived by reducing modulo166, sign-folding and sorting every level32 row:")}</p>
        <ol className="mt-2 space-y-2">{report.ancestors.rows.map((row, index) => <li key={index} className="min-w-0 [overflow-wrap:anywhere]">({row.join(", ")})</li>)}</ol>
        <p className="mt-2 max-w-[76ch]">{t("Tổ tiên là frontier cần kiểm toàn bộ fiber terminal, không là vận tốc phản ví dụ. Số đếm/hash riêng không chứng minh tính đầy đủ; nghiệm thu offline đã so mọi sự kiện cây và từng dòng đầu ra.", "These ancestors are the frontier requiring whole terminal fibers, not counterexample speeds. Counts or hashes alone do not prove completeness; offline admission compared every forest event and output row.")}</p>
      </details>
      <details className="text-meta text-ink-muted mt-2">
        <summary className="min-h-10 cursor-pointer">{t("Dataset, receipt và ranh giới tin cậy", "Datasets, receipt and trust boundary")}</summary>
        <a href={report.source.primaryUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 max-w-full items-center break-words text-ink-muted underline hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{t("Nguồn phương pháp đúng phiên bản", "Exact method-source revision")}</a>
        <dl className="mt-2 grid min-w-0 gap-2 [overflow-wrap:anywhere]">
          <div><dt>{t("Tầng đã hoàn tất", "Completed stage")}</dt><dd>{report.status}</dd></div>
          <div><dt>{t("Nghiệm thu trên trang đọc", "Read-page admission")}</dt><dd>{report.trust.get}</dd></div>
          <div><dt>{t("Nghiệm thu toán offline", "Offline mathematical admission")}</dt><dd>{report.trust.semanticAdmission}</dd></div>
          <div><dt>{t("Đầu vào TIP-057 đã pin", "Pinned TIP-057 input")}: {report.dependency.path}</dt><dd className="font-mono">{report.dependency.sha256}</dd></div>
          <div><dt>{report.dependency.datasetPath}</dt><dd>{report.dependency.datasetBytes} bytes; <span className="font-mono">{report.dependency.datasetSha256}</span></dd></div>
          {Object.entries(report.datasets).map(([name, dataset]) => <div key={name}><dt>{name}: {dataset.path}</dt><dd>{dataset.bytes} bytes; <span className="font-mono">{dataset.sha256}</span></dd></div>)}
          <div><dt>{t("Toàn prime / toàn cục", "Full prime / global")}</dt><dd>{report.remaining.fullPrime} / {report.remaining.global}</dd></div>
          <div><dt>{t("Thời điểm lưu summary", "Summary retention time")}</dt><dd>{report.generatedAt}</dd></div>
          <div><dt>Summary</dt><dd className="font-mono">{report.reportDigest}</dd></div>
          <div><dt>Python source</dt><dd className="font-mono">{report.receipt.sourceSha256}</dd></div>
          <div><dt>Python input / output</dt><dd className="font-mono">{report.receipt.inputSha256} / {report.receipt.stdoutSha256}</dd></div>
          <div><dt>{t("Thời gian phát lại offline", "Offline replay duration")}</dt><dd>{report.receipt.elapsedMs} ms</dd></div>
        </dl>
        <p className="mt-3 max-w-[76ch]">{t("Receipt không ký dựa vào bộ thu, runtime và lưu trữ local tin cậy; không là xác nhận bên ngoài, chứng minh hình thức hay phát lại mới tầng057. GET không tải binary hoặc dựng lại toàn cây. Không chạy code tác giả, mô hình hay chiến dịch agent; không tuyên bố tính mới.", "The unsigned receipt relies on trusted local collector, runtime and storage; it is not external attestation, formal proof or a fresh stage057 replay. GET neither loads binaries nor reconstructs the forest. No author code, model or agent campaign is executed; no novelty is claimed.")}</p>
        <p className="mt-2 max-w-[76ch]">{t("Tiếp theo cần toàn bộ fiber level14 của cả hai tổ tiên và cầu nối level224. Level14 không chia level32, nên không chuyển kết quả trực tiếp giữa hai level. LRC dưới chỉ là nguồn đã rà soát, chưa tái lập độc lập; các nghĩa vụ hình thức và toàn cục vẫn mở.", "Next requires whole level14 fibers of both ancestors and the level224 bridge. Level14 does not divide level32, so results do not transfer directly between them. Lower LRC is source-reviewed, not independently reproduced; formal and global obligations remain open.")}</p>
      </details>
    </>}
  </section>;
}
