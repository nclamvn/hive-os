import { MathText } from "@/components/research/math-text";
import { validateRetainedP83CoveringNumberReport } from "@/modules/research-sandbox/math-lrc-p83-covering-number";

/** One complete covering-number stage, not a whole-prime or LRC certificate. */
export function MathLrcP83CoveringNumberPanel({ raw, locale }: { raw: unknown; locale: string }) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const report = validateRetainedP83CoveringNumberReport(raw);
  const linkClass = "inline-flex min-h-10 max-w-full items-center break-words text-ink-muted underline hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return <section id="allikvere-p83-covering-number" aria-labelledby="allikvere-p83-covering-number-title" className="border-line mt-5 min-w-0 scroll-mt-24 border-y py-4">
    <h3 id="allikvere-p83-covering-number-title" className="text-body text-ink-strong font-medium">{report
      ? t("Prime 83: hoàn tất tầng covering-number", "Prime 83: covering-number stage complete")
      : t("Prime 83: kiểm chứng tầng covering-number", "Prime 83: covering-number stage audit")}</h3>
    {!report ? <div role="alert" className="text-body text-ink-muted mt-2 max-w-[76ch]">
      <p>{t("Báo cáo phủ p83 chưa có hoặc không hợp lệ. Không hiển thị kết luận, số đếm hay receipt chưa nghiệm thu; toàn prime và LRC vẫn chưa thiết lập.", "The p83 covering report is unavailable or invalid. Unadmitted conclusions, counts and receipts are hidden; the full prime and LRC remain NOT ESTABLISHED.")}</p>
      <p className="text-meta mt-2">{t("Trang chỉ đọc không chạy Python, lấy nguồn ngoài hay gọi agent.", "This read page does not run Python, fetch external sources or call an agent.")}</p>
    </div> : <>
      <MathText className="mt-2 block min-w-0" text={`$\\tau(${report.target.prime})=${report.result.tau}$`} />
      <p className="text-body text-ink mt-2 max-w-[76ch]">{t("Không có phủ bằng tối đa 11 lớp; nhân chứng phủ 12 lớp", "No cover uses at most 11 classes; a 12-class covering witness")}: <span className="break-words">({report.result.cover12.join(", ")})</span>. {t("Phủ mọi", "Covers all")} {report.certificate.maskTable.length} {t("lớp thời gian gấp đối xứng, không phải nhân chứng thời điểm LRC.", "folded time classes, not an LRC-time witness.")}</p>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">p = {report.target.prime} ∈ {report.target.primeSet}, {report.target.primeSetSize} {t("prime nguồn §5", "source §5 primes")}; k = {report.target.movingSpeeds} {t("vận tốc chuyển động", "moving speeds")}, {report.target.totalRunners} {t("người chạy tổng cộng", "total runners")}. {t("Tầng này độc lập với LRC dưới và bộ sinh của tác giả; không tuyên bố tính mới.", "This stage is independent of lower LRC and the author's generator; no novelty is claimed.")}</p>
      <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Sinh mọi lớp, cascade và terminal vẫn MỞ. Chưa nghiệm thu toàn prime 83, cả tập 61 prime hay LRC 14/15; tất cả 23 nghĩa vụ áp dụng toàn cục giữ MỞ.", "Full generation, cascade and terminal remain OPEN. The full prime83, all 61 primes and LRC14/15 are not admitted; all 23 global application obligations remain OPEN.")}</p>
      <details className="text-meta text-ink-muted mt-3">
        <summary className="min-h-10 cursor-pointer">{t("Cây quyết định đầy đủ và ranh giới phương pháp", "Complete decision trees and method boundary")}</summary>
        <MathText className="mt-2 block min-w-0" text={"$B_v=\\{t:14\\min(tv\\bmod83,83-tv\\bmod83)<83\\},\\quad |B_v|=5$"} />
        <p className="mt-2 max-w-[76ch]">{t("Một phủ s≤11 có ít nhất 82−5s lần xuất hiện riêng, nên có thành viên chứa ít nhất ba thời gian riêng. Nhân đơn vị đưa thành viên đó về 1; ba thời gian nằm trong B₁={1,…,5}. Mọi bộ ba được xét, phần còn lại tránh bộ ba đó.", "An s≤11 cover has at least 82−5s private incidences, so a member has at least three private times. Unit normalization sends that member to 1; the triple lies in B₁={1,…,5}. Every triple is considered and the remaining members avoid it.")}</p>
        <p className="mt-2 max-w-[76ch]">{report.certificate.roots.length} {t("gốc đầy đủ", "complete roots")}; {report.certificate.totalNodes} {t("node đã tái dựng độc lập", "independently reconstructed nodes")}. {t("Bộ kiểm dựng lại mọi trạng thái, pivot, phép loại và tất cả nhánh con; số đếm/hash riêng lẻ không đủ để nghiệm thu.", "The consumer reconstructs every state, pivot, pruning rule and all child branches; counts or hashes alone do not admit completeness.")}</p>
        <ul className="mt-3 space-y-2">{report.certificate.roots.map((root) => <li key={root.triple.join(",")} className="min-w-0 [overflow-wrap:anywhere]">
          ({root.triple.join(", ")}): {root.nodeCount} {t("node", "nodes")}; <span className="font-mono">{root.traceSha256}</span>
        </li>)}</ul>
        <p className="mt-3 max-w-[76ch]">{t("Bỏ lớp không tăng độ phủ chỉ hợp lệ cho quyết định tồn tại phủ ≤11, không dùng lại làm phép liệt kê mọi hỗ trợ 13 lớp. Nhân chứng phủ 12 và cây bác bỏ phủ ≤11 xác định τ(83)=12, không đóng các tầng sau.", "Dropping zero-gain classes is valid only for the decision whether a ≤11 cover exists, not enumeration of every 13-class support. The 12-cover witness and complete no-≤11 trees establish τ(83)=12, not the downstream stages.")}</p>
      </details>
      <details className="text-meta text-ink-muted mt-2">
        <summary className="min-h-10 cursor-pointer">{t("Nguồn và receipt phát lại tầng p83", "Sources and p83-stage replay receipt")}</summary>
        <p className="mt-2 max-w-[76ch]">{t("Checksum toàn ZIP chỉ nhận diện nguồn, không nghiệm thu chứng minh. 63.986 node trong TAU_MANIFEST là tác giả báo cáo, khác các cây độc lập ở đây. Metadata lưu trữ cũ không bị sửa hay nâng trạng thái.", "The whole-ZIP checksum identifies the source, not proof acceptance. TAU_MANIFEST's 63,986 nodes are author-reported, distinct from the independent trees here. Earlier archive metadata is not changed or promoted.")}</p>
        <a className={linkClass} href={report.source.primary.url} target="_blank" rel="noreferrer">{t("Bản tiền ấn phẩm đúng phiên bản", "Exact preprint revision")}</a>
        <a className={linkClass + " ml-3"} href={report.source.archive.url} target="_blank" rel="noreferrer">{t("Bản ghi Zenodo đúng phiên bản", "Versioned Zenodo record")}</a>
        <p className="mt-2 max-w-[76ch]">{t("LRC dưới vẫn là nguồn đã rà soát, chưa tái lập độc lập; tham chiếu TIP-055 không là receipt phát lại mới. Nghiệm thu hình thức và toàn cục vẫn mở.", "Lower LRC remains source-reviewed, not independently reproduced; the TIP-055 reference is not a fresh replay receipt. Formal and global acceptance remain open.")}</p>
        <dl className="mt-2 grid min-w-0 gap-2 [overflow-wrap:anywhere]">
          <div><dt>{t("Phạm vi đã hoàn tất", "Completed scope")}</dt><dd>{report.status}: {report.stageVerdict}</dd></div>
          <div><dt>{t("Toàn prime / toàn cục", "Full prime / global")}</dt><dd>{report.fullPrimeVerdict} / {report.globalVerdict}</dd></div>
          <div><dt>{t("Nhận diện ZIP", "ZIP identity")}</dt><dd>{report.source.archive.status}</dd></div>
          <div><dt>ZIP SHA-256</dt><dd className="font-mono">{report.source.archive.sha256}</dd></div>
          <div><dt>{t("Thời điểm lưu báo cáo", "Report retention time")}</dt><dd>{report.generatedAt}</dd></div>
          <div><dt>{t("Báo cáo", "Report")}</dt><dd className="font-mono">{report.reportDigest}</dd></div>
          <div><dt>Python source</dt><dd className="font-mono">{report.receipt.sourceSha256}</dd></div>
          <div><dt>Python output</dt><dd className="font-mono">{report.receipt.stdoutSha256}</dd></div>
          <div><dt>{t("Thời gian phát lại", "Replay duration")}</dt><dd>{report.receipt.elapsedMs} ms</dd></div>
        </dl>
        <p className="mt-3 max-w-[76ch]">{t("Receipt local không ký, không là xác nhận bên ngoài hay chứng minh hình thức. GET không chạy bộ thu, Python, nguồn nghiên cứu ngoài hoặc mô hình; đây không phải chiến dịch agent mới.", "The local receipt is unsigned, not external attestation or formal proof. GET runs no collector, Python, external research fetch or model; this is not a new agent campaign.")}</p>
      </details>
    </>}
  </section>;
}
