import { MathText } from "@/components/research/math-text";
import { validateRetainedP83TerminalReport } from "@/modules/research-sandbox/math-lrc-p83-terminal";

/** Passive small retained summary only, never whole-forest replay on GET. */
export function MathLrcP83TerminalPanel({ raw, locale }: { raw: unknown; locale: string }) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const report = validateRetainedP83TerminalReport(raw);
  return <section id="allikvere-p83-terminal" aria-labelledby="allikvere-p83-terminal-title" className="border-line mt-4 min-w-0 scroll-mt-24 border-b pb-4">
    <h3 id="allikvere-p83-terminal-title" className="text-body text-ink-strong font-medium">{report
      ? t("Prime 83: hoàn tất terminal và cầu nối level224", "Prime 83: terminal and level224 bridge complete")
      : t("Prime 83: kiểm chứng terminal và cầu nối", "Prime 83: terminal and bridge audit")}</h3>
    {!report ? <div role="alert" className="text-body text-ink-muted mt-2 max-w-[76ch]">
      <p>{t("Summary terminal p83 chưa có hoặc không khớp pin. Không hiện kết luận hữu hạn, số đếm hay receipt chưa nghiệm thu; LRC toàn cục vẫn chưa thiết lập.", "The p83 terminal summary is unavailable or does not match its pin. Unadmitted finite conclusions, counts and receipts are hidden; global LRC remains unestablished.")}</p>
      <p className="text-meta mt-2">{t("GET không đọc cây/dataset lớn và không phát lại toán.", "GET neither reads large trees/datasets nor replays mathematics.")}</p>
    </div> : <>
      <div className="mt-2 min-w-0 space-y-1">
        <MathText className="block min-w-0" text={"$I(13,83,224)=\\varnothing$"} />
        <MathText className="block min-w-0" text={"$J(13,83)=\\varnothing$"} />
      </div>
      <p className="text-body text-ink mt-2 max-w-[76ch]">{t("Đã kiểm hữu hạn một prime thực tế: p83, k13 vận tốc chuyển động, 14 người chạy tổng cộng. Chứng chỉ bao phủ toàn bộ fiber terminal của cả hai tổ tiên được suy ra từ cascade, rồi áp dụng cầu nối level224.", "One actual prime is finitely verified: p83, k13 moving speeds, 14 total runners. The certificate covers the whole terminal fiber of both cascade-derived ancestors, then applies the level224 bridge.")}</p>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Các dòng OPEN ở checkpoint056/057/058 là mốc lịch sử đã đóng băng, không sửa lại. 60 prime P13 còn lại, LRC14/15 toàn cục và 23 nghĩa vụ áp dụng vẫn MỞ; chứng minh LRC dưới chỉ là nguồn đã rà soát, chưa tái lập độc lập. Không tuyên bố định lý mới hay chứng nhận hình thức.", "OPEN lines in checkpoints056/057/058 are frozen historical snapshots, not rewritten. The other 60 P13 primes, global LRC14/15 and all 23 application obligations remain OPEN; lower LRC proofs are source-reviewed, not independently reproduced. No novel theorem or formal certification is claimed.")}</p>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("GET chỉ đối chiếu summary local đã pin, không phải phát lại toán mới. Toàn cây đã được kiểm và phát lại Python độc lập trong tác vụ offline riêng.", "GET checks only the pinned local summary, not a fresh mathematical replay. The whole forest was checked and independently replayed in Python in a separate offline run.")}</p>
      <details className="text-meta text-ink-muted mt-3">
        <summary className="min-h-10 cursor-pointer">{t("Hai miền đầy đủ và suy luận level224", "Both complete domains and the level224 inference")}</summary>
        <MathText className="mt-2 block min-w-0" text={"$v_i=u_i+166a_i,\\quad a_i\\in\\{0,\\ldots,6\\}$"} />
        <p className="mt-2 max-w-[76ch]">{t("Mọi tọa độ có nhãn giữ đủ bảy lựa chọn; mỗi root có 7^13=96889010407 phép gán. Force kiểm cả khối đối lập; split phân hoạch theo literal đầu tiên được thỏa và kiểm toàn khối NONE cuối. Mọi nhánh con không rỗng là bắt buộc. Gain được tính lại trên đúng miền; không dùng loại bằng thời gian riêng hay tính tối thiểu.", "Every labelled coordinate keeps all seven choices; each root has 7^13=96889010407 assignments. Forces account for the opposite domain; splits partition by the first satisfied literal and account for the final NONE region. Every nonempty child is mandatory. Gain is recomputed on the actual domains; no private-time or minimality pruning is used.")}</p>
        <ul className="mt-3 space-y-3">{report.roots.map((root, index) => <li key={index} className="min-w-0 [overflow-wrap:anywhere]">
          <p>({root.ancestor.join(", ")}): {root.nodes} {t("node", "nodes")}, {root.forces} force, {root.splits} split, {root.conflicts} conflict, {root.gainPrunes} gain, {root.gcdLeaves} gcd {t("lá", "leaves")}; {root.noneRegions} NONE.</p>
          <p>{root.gridCertifiedMass} {t("chứng nhận bằng lưới", "grid-certified")} + {root.gcdCertifiedMass} {t("chứng nhận bằng gcd", "gcd-certified")} = {root.totalMass} / {root.domainMass}. {root.originalGcdCompletionsChecked} {t("phép gán kiểm gcd gốc trực tiếp", "completions checked by the original gcd directly")}.</p>
          <p>{root.gcdRegionGridWitnessOverlap} {t("phép gán trong khối gcd cũng có nhân chứng lưới", "assignments in gcd regions also have a grid witness")}.</p>
        </li>)}</ul>
        <p className="mt-2 max-w-[76ch]">{t("Đây là khối chứng chỉ rời nhau, không nói hai điều kiện lưới/gcd luôn loại trừ nhau. Mọi literal, force, gain, lý do lá và khối lượng đều được kiểm lại; số đếm/hash riêng không chứng minh tính đầy đủ. Không có phép gán SAT improper được bỏ qua hoặc nghiệm thu vì hết tài nguyên.", "These are disjoint certificate regions, not globally exclusive grid/gcd predicates. Every literal, force, gain, leaf reason and mass is rechecked; counts or hashes alone do not prove completeness. No improper SAT assignment is skipped or accepted because resources expire.")}</p>
        <p className="mt-2 max-w-[76ch]">{t("Biên thực tế u1,t83: hai digit0/1 có phần dư83/1079, cùng khoảng cách83 tại modulus1162, đều GOOD. Kiểm đủ bảy digit; đổi < thành ≤ tạo hai digit xấu sai và phá bổ đề literal duy nhất.", "Actual boundary u1,t83: digits0/1 have residues83/1079, both distance83 at modulus1162 and both GOOD. All seven digits are checked; replacing < by ≤ creates two erroneous bad digits and breaks the unique-literal lemma.")}</p>
        <MathText className="mt-2 block min-w-0" text={"$\\operatorname{lcm}(14,32)=224$"} />
        <p className="mt-2 max-w-[76ch]">{t("Level14 không chia level32 và ngược lại. Một improper ở224 sẽ giảm về improper32, rồi về một trong toàn bộ tổ tiên level2 đã giữ; phép giảm về14 lại proper theo toàn chứng chỉ terminal, mâu thuẫn tính đơn điệu. Bao gồm cả nhánh có nhân chứng level1 và mọi ảnh đơn vị/dấu/hoán vị của miền sinh đầy đủ.", "Neither level14 nor level32 divides the other. An improper224 lift would reduce to improper32 and one of all retained level-two ancestors; its14 reduction is proper by the whole terminal certificate, contradicting monotonicity. Level-one witness branches and every unit/sign/permutation image of the complete generated domain are included.")}</p>
        <p className="mt-2 max-w-[76ch]">{report.bridge.crtUnits.length} {t("đơn vị cơ sở modulo83 được kiểm CRT chính xác: b=a mod83, b=1 mod224, gcd(b,83·224)=1. Cầu nối là lập luận phổ quát đã rà soát, không phải chứng chỉ proof assistant.", "base units modulo83 are checked by exact CRT: b=a mod83, b=1 mod224, gcd(b,83·224)=1. The bridge is a reviewed universal argument, not a proof-assistant certificate.")}</p>
      </details>
      <details className="text-meta text-ink-muted mt-2">
        <summary className="min-h-10 cursor-pointer">{t("Receipt toàn cây và ranh giới tin cậy", "Whole-forest receipt and trust boundary")}</summary>
        <a href={report.source.primaryUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 max-w-full items-center break-words text-ink-muted underline hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{t("Nguồn phương pháp đúng phiên bản", "Exact method-source revision")}</a>
        <dl className="mt-2 grid min-w-0 gap-2 [overflow-wrap:anywhere]">
          <div><dt>{t("Tầng đã nghiệm thu", "Admitted stage")}</dt><dd>{report.status}</dd></div>
          <div><dt>{t("Nghiệm thu trên trang đọc", "Read-page admission")}</dt><dd>{report.trust.get}</dd></div>
          <div><dt>{t("Nghiệm thu toán offline", "Offline mathematical admission")}</dt><dd>{report.trust.semanticAdmission}</dd></div>
          <div><dt>{t("Đầu vào TIP-058 đã pin", "Pinned TIP-058 input")}: {report.dependency.path}</dt><dd className="font-mono">{report.dependency.sha256}</dd></div>
          <div><dt>{report.dependency.ancestorPath}</dt><dd>{report.dependency.ancestorBytes} bytes; <span className="font-mono">{report.dependency.ancestorSha256}</span></dd></div>
          <div><dt>{report.dependency.final32Path}</dt><dd>{report.dependency.final32Bytes} bytes; <span className="font-mono">{report.dependency.final32Sha256}</span></dd></div>
          <div><dt>{t("Phụ thuộc sinh miền TIP-057", "TIP-057 generation dependency")}</dt><dd className="font-mono">{report.dependency.generationSummarySha256} / {report.dependency.generationDatasetSha256}</dd></div>
          <div><dt>{report.datasets.tree.path}</dt><dd>{report.datasets.tree.bytes} bytes; <span className="font-mono">{report.datasets.tree.sha256}</span></dd></div>
          <div><dt>{t("Toàn cục", "Global")}</dt><dd>{report.remaining.global}</dd></div>
          <div><dt>{t("Thời điểm lưu summary", "Summary retention time")}</dt><dd>{report.generatedAt}</dd></div>
          <div><dt>Summary</dt><dd className="font-mono">{report.reportDigest}</dd></div>
          <div><dt>Python source</dt><dd className="font-mono">{report.receipt.sourceSha256}</dd></div>
          <div><dt>Python input / output</dt><dd className="font-mono">{report.receipt.inputSha256} / {report.receipt.stdoutSha256}</dd></div>
          <div><dt>{t("Thời gian phát lại offline", "Offline replay duration")}</dt><dd>{report.receipt.elapsedMs} ms</dd></div>
        </dl>
        <p className="mt-3 max-w-[76ch]">{t("Receipt không ký dựa vào bộ thu, code, runtime và lưu trữ local tin cậy; không là xác nhận bên ngoài, chứng minh hình thức hoặc phát lại mới057/058. GET không tải binary, dựng lại cây hay gọi validator toán cũ. Không chạy code tác giả, mô hình hoặc chiến dịch agent; không tuyên bố tính mới.", "The unsigned receipt relies on trusted local collector, code, runtime and storage; it is not external attestation, formal proof or a fresh057/058 replay. GET neither loads binaries, reconstructs trees nor calls old mathematical validators. No author code, model or agent campaign is executed; no novelty is claimed.")}</p>
      </details>
    </>}
  </section>;
}
