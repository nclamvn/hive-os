import { MathText } from "@/components/research/math-text";
import { validateRetainedPropernessReport } from "@/modules/research-sandbox/math-lrc-properness";

/** Retained, pure projection. Never imports the independent replay runner. */
export function MathLrcPropernessPanel({ raw, locale }: { raw: unknown; locale: string }) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const report = validateRetainedPropernessReport(raw);
  const linkClass = "inline-flex min-h-10 max-w-full items-center break-words text-meta text-ink-muted underline hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return <section id="allikvere-properness" aria-labelledby="allikvere-properness-title" className="border-line mt-6 min-w-0 scroll-mt-24 border-t pt-5">
    <h3 id="allikvere-properness-title" className="text-section-title text-ink-strong">{t("Cầu nối properness: tiền đề trước, kết luận sau", "Properness bridge: premises before conclusions")}</h3>
    <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Tách loại lớp không nguyên thủy khỏi phép shift phụ thuộc nhân chứng của bài toán ít người chạy hơn. Một cơ chế đúng chưa có nghĩa là đã áp dụng đầy đủ cho mọi nhánh của chứng minh.", "Separate nonprimitive-class exclusion from shifts that depend on a lower-runner witness. A checked mechanism does not mean it has been applied to every required proof branch.")}</p>
    {!report ? <div role="alert" className="bg-surface-subtle mt-4 rounded-md p-4">
      <p className="text-body text-ink">{t("Báo cáo cầu nối chưa có hoặc không hợp lệ", "Properness report unavailable or invalid")}</p>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Không hiển thị số liệu hay kết luận chưa nghiệm thu. Các nghĩa vụ toàn cục vẫn mở; đọc trang không tự sinh chứng chỉ, phát lại Python, truy nguồn ngoài hoặc gọi mô hình.", "Unadmitted numbers and conclusions are not displayed. Global obligations remain open; reading this page does not generate certificates, replay Python, fetch external sources or call a model.")}</p>
    </div> : <>
      <div className="mt-4 space-y-5">
        <section aria-labelledby="allikvere-phase-partition">
          <h4 id="allikvere-phase-partition" className="text-body text-ink-strong font-medium">{t("Cơ chế đã kiểm: toàn bộ pha, không chỉ lấy mẫu", "Checked mechanism: every phase, not just samples")}</h4>
          <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("N là tổng số người chạy; d là số shift đều trên đường tròn. ‖x‖ là khoảng cách tới số nguyên gần nhất.", "N is the total number of runners; d counts equally spaced shifts on the circle. ‖x‖ is the distance to the nearest integer.")}</p>
          <MathText className="mt-3 block min-w-0" text={"$\\left\\|\\theta+\\frac qd\\right\\|<\\frac1N,\\quad q=0,\\ldots,d-1;\\qquad \\theta=\\pm\\frac1N-\\frac qd\\pmod1$"} />
          <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Các điểm tới hạn chia đường tròn thành điểm biên và khoảng mở kề nhau, gồm cả khoảng nối qua 1. Trong mỗi khoảng mở, không điểm nào đi qua biên của cung xấu nên tập shift xấu là hằng. Kiểm nghiệm thu dựng lại mọi biên, ô, mặt nạ và cực đại; không chỉ tin số đếm trong báo cáo.", "Critical points partition the circle into boundary points and adjacent open intervals, including the wrap through 1. Inside each open interval no point crosses a bad-arc boundary, so the bad-shift set is constant. Admission reconstructs every boundary, cell, mask and maximum rather than trusting report counts.")}</p>
          <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Cung xấu là mở: đúng bằng 1/N là tốt. Chặn ⌈2d/N⌉ được kiểm bằng số hữu tỉ chính xác. Đây là lập luận phân hoạch hữu hạn kèm phát lại số học, không phải chứng minh hình thức Lean.", "The bad arc is open: equality at 1/N is good. The ⌈2d/N⌉ bound is checked with exact rationals. This is a finite-partition argument with arithmetic replay, not a Lean formal proof.")}</p>
          <ul className="text-meta text-ink mt-3 space-y-2">{report.phaseCertificates.map((certificate) => <li key={certificate.certificateDigest} className="min-w-0 break-words">
            N = {certificate.totalRunners}, d = {certificate.shiftModulus}: {certificate.boundaries.length} {t("biên", "boundaries")}, {certificate.cells.length} {t("ô pha đầy đủ", "complete phase cells")}; {t("cực đại shift xấu", "maximum bad shifts")} {certificate.maximumBadShifts} ≤ {certificate.ceilBound}.
          </li>)}</ul>
        </section>
        <section aria-labelledby="allikvere-class-applicability" className="border-line border-t pt-4">
          <h4 id="allikvere-class-applicability" className="text-body text-ink-strong font-medium">{t("Phạm vi áp dụng: lớp thực và đối chứng tách riêng", "Applicability: actual classes and controls stay separate")}</h4>
          <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Các lớp cố định từ TIP-048 được ràng buộc với nguồn đã khóa. Nếu g>1 chia cả modulus và mọi phần dư, toàn bộ lift nguyên thuộc lớp đó đều có ước chung; chỉ lớp đó bị loại khỏi phản ví dụ nguyên thủy, không phải toàn bộ fiber cha.", "The fixed classes from TIP-048 are bound to their sealed source. If g>1 divides both the modulus and every residue, every integer lift in that class has a common divisor; only that class is excluded as a primitive counterexample, not its whole parent fiber.")}</p>
          <MathText className="mt-3 block min-w-0" text={"$g\\mid M,\\quad g\\mid r_i\\ (\\forall i)\\quad\\Longrightarrow\\quad g\\mid(r_i+Mz_i)\\ (\\forall z_i\\in\\mathbb Z)$"} />
          <div className="mt-3 space-y-3">{report.applications.map((application) => <article key={application.id} className="border-line min-w-0 border-l-2 pl-3">
            <h5 className="text-body text-ink font-medium [overflow-wrap:anywhere]">{application.id}</h5>
            <p className="text-meta text-ink-muted mt-1">{application.mechanism === "NONPRIMITIVE"
              ? t("Lớp cố định thực · loại lớp không nguyên thủy", "Actual fixed class · nonprimitive class excluded")
              : t("Đối chứng cơ chế tổng hợp · chỉ có điều kiện theo LRC dưới", "Synthetic mechanism control · conditional on lower LRC only")}</p>
            <p className="text-meta text-ink mt-2 break-words">N = {application.totalRunners}, M = {application.modulus}, {application.mechanism === "FEW_EXCEPTIONS" ? "d" : "g"} = {application.divisor}{application.mechanism !== "NONPRIMITIVE" && <>; {t("ngoại lệ", "exceptions")} = {application.exceptionIndices.length}</>}.</p>
            {application.mechanism !== "NONPRIMITIVE" && <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Chưa có nhân chứng của trường hợp dưới; không phát sinh nhân chứng toàn cục. Đối chứng không phải terminal của tác giả.", "No lower-case witness has been established; no global witness follows. This control is not an author terminal.")}</p>}
            <details className="text-meta text-ink-muted mt-2"><summary className="min-h-10 cursor-pointer">{t("Chứng chỉ và điều kiện áp dụng", "Certificate and applicability conditions")}</summary>
              <dl className="mt-2 grid gap-2 [overflow-wrap:anywhere]">
                <div><dt>{t("Phân loại có phạm vi", "Scoped classification")}</dt><dd className="font-mono">{application.status}</dd></div>
                <div><dt>{t("Phần dư có nhãn, không đổi thứ tự", "Labelled residues, unchanged order")}</dt><dd>{application.residues.join(", ")}</dd></div>
                <div><dt>{t("Tọa độ ngoại lệ, chỉ số từ 0", "Exception coordinates, zero-based")}</dt><dd>{application.exceptionIndices.length ? application.exceptionIndices.join(", ") : t("Không có", "None")}</dd></div>
                {application.phaseCertificateDigest && <div><dt>{t("Chứng chỉ phân hoạch pha", "Phase-partition certificate")}</dt><dd className="font-mono">{application.phaseCertificateDigest}</dd></div>}
              </dl>
            </details>
          </article>)}</div>
        </section>
        <section aria-labelledby="allikvere-bridge-boundary" className="border-line border-t pt-4">
          <h4 id="allikvere-bridge-boundary" className="text-body text-ink-strong font-medium">{t("Tiền đề chưa đóng và giới hạn kết luận", "Outstanding premises and conclusion boundary")}</h4>
          <MathText className="mt-3 block min-w-0" text={"$e\\left\\lceil\\frac{2d}{15}\\right\\rceil<d,\\quad d\\text{ prime},\\quad e\\ge2$"} />
          <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Với ít ngoại lệ, các tọa độ cố định phải chia hết cho d và mọi ngoại lệ phải là đơn vị modulo d. Bất đẳng thức nghiêm ngặt bảo đảm còn một shift chung tốt. Trường hợp bỏ một vận tốc cũng phải kiểm quỹ đạo ngoại lệ, không thay bằng các thời điểm riêng cho từng người chạy.", "For few exceptions, fixed coordinates must be divisible by d and every exception must be a unit modulo d. The strict inequality guarantees a remaining common good shift. The omit-one case must also check the exception orbit, not use separate times for individual runners.")}</p>
          <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Vận tốc dương, phân biệt, tính nguyên thủy và nhân chứng LRC của trường hợp dưới vẫn là tiền đề áp dụng. Không nâng NO_GRID thành phản ví dụ liên tục. Chưa ràng buộc cơ chế này với mọi terminal; các nghĩa vụ toàn cục ở dưới vẫn mở, và kết quả 14/15 chưa thiết lập.", "Positive, distinct speeds, primitivity and a lower-case LRC witness remain applicability premises. NO_GRID is not promoted into a continuous-time counterexample. This mechanism is not bound to every terminal; the global obligations below remain open and the 14/15 result is NOT ESTABLISHED.")}</p>
          <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Trong đường chuẩn bị host mới, chứng cứ bổ sung chỉ đi vào prompt sau kiểm host và phát lại độc lập. Hồ sơ cũ thiếu trường bổ sung vẫn giữ nguyên cách diễn giải; không được gán receipt phát lại mới. Kiểm thử vận chuyển mô hình được mock; chưa có chiến dịch LLM mới được chạy.", "In new host preparation, supplemental evidence reaches prompts only after host admission and independent replay. Historical envelopes without the supplement retain their original interpretation; they are not assigned a new replay receipt. Model transport is mocked in tests; no new LLM campaign has run.")}</p>
        </section>
      </div>
      <details className="text-meta text-ink-muted mt-4"><summary className="min-h-10 cursor-pointer">{t("Nguồn và dấu vết phát lại cầu nối local", "Source and local bridge replay provenance")}</summary>
        <p className="mt-2 max-w-[76ch]">{t("Receipt và hash không ký dựa vào bộ thu thập, interpreter và lưu trữ local tin cậy; không là chữ ký thực thi bên ngoài hoặc chứng minh toàn cục.", "Unsigned receipts and hashes rely on the trusted local collector, interpreter and storage; they are not external execution signatures or a global proof.")}</p>
        <a href={report.source.url} target="_blank" rel="noreferrer" className={linkClass}>{t("Nguồn v2: Lemma 2.2, Lemma 4.6 và giới hạn §6", "Source v2: Lemma 2.2, Lemma 4.6 and §6 limitations")}</a>
        <dl className="mt-2 grid min-w-0 gap-3 [overflow-wrap:anywhere]">
          <div><dt>{t("Phân loại toàn cục", "Global classification")}</dt><dd>{report.globalVerdict}</dd></div>
          <div><dt>{t("Bytes nguồn TIP-048", "TIP-048 source bytes")}</dt><dd className="font-mono">{report.scopeBinding.sourceReportSha256}</dd></div>
          <div><dt>{t("Phạm vi nguồn đã khóa", "Sealed source scope")}</dt><dd className="font-mono">{report.scopeBinding.sourceScopeDigest}</dd></div>
          <div><dt>{t("Báo cáo cầu nối", "Bridge report")}</dt><dd className="font-mono">{report.reportDigest}</dd></div>
          <div><dt>Python source</dt><dd className="font-mono">{report.receipt.sourceSha256}</dd></div>
          <div><dt>Python output</dt><dd className="font-mono">{report.receipt.stdoutSha256}</dd></div>
          <div><dt>{t("Thời gian phát lại quan sát", "Observed replay duration")}</dt><dd>{report.receipt.elapsedMs} ms</dd></div>
        </dl>
      </details>
    </>}
  </section>;
}
