import { MathText } from "@/components/research/math-text";
import { validateRetainedShapeGeometryReport, type ShapeGeometryRational } from "@/modules/research-sandbox/math-lrc-shape-geometry";

/** Retained pure projection. Independent replay runs only in the collector. */
export function MathLrcShapeGeometryPanel({ raw, locale }: { raw: unknown; locale: string }) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const report = validateRetainedShapeGeometryReport(raw);
  const fraction = (q: ShapeGeometryRational) => q.denominator === "1" ? q.numerator : `${q.numerator}/${q.denominator}`;
  const texFraction = (q: ShapeGeometryRational) => q.denominator === "1" ? q.numerator : `\\frac{${q.numerator}}{${q.denominator}}`;
  const linkClass = "inline-flex min-h-10 max-w-full items-center break-words text-meta text-ink-muted underline hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return <section id="allikvere-shape-geometry" aria-labelledby="allikvere-shape-geometry-title" className="border-line mt-6 min-w-0 scroll-mt-24 border-t pt-5">
    <h3 id="allikvere-shape-geometry-title" className="text-section-title text-ink-strong">{t("Hình dạng và hình học: chặn phổ quát, áp dụng có điều kiện", "Shape and geometry: universal bounds, conditional application")}</h3>
    <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Các phần cũ giữ dấu mốc rà soát và trạng thái áp dụng toàn cục. Phần này bổ sung kiểm chứng các bổ đề hình dạng/hình học có phạm vi rõ ràng; tiến bộ đó không tự đóng các gate áp dụng của toàn bộ LRC.", "Earlier sections retain their review snapshots and global application status. This section adds a scoped shape/geometry sublemma audit; that progress does not automatically close whole-LRC application gates.")}</p>
    {!report ? <div role="alert" className="bg-surface-subtle mt-4 rounded-md p-4">
      <p className="text-body text-ink">{t("Báo cáo hình dạng/hình học chưa có hoặc không hợp lệ", "Shape/geometry report unavailable or invalid")}</p>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Không hiện chặn, số đếm hay kết luận chưa nghiệm thu. LRC 14/15 vẫn chưa thiết lập; GET không tạo chứng chỉ, chạy Python, truy nguồn ngoài hoặc gọi mô hình.", "Unadmitted bounds, counts and conclusions are not displayed. LRC 14/15 remains NOT ESTABLISHED; GET does not generate certificates, run Python, fetch external sources or call a model.")}</p>
    </div> : <>
      <div className="mt-4 space-y-5">
        <section aria-labelledby="allikvere-shape-universal">
          <h4 id="allikvere-shape-universal" className="text-body text-ink-strong font-medium">{t("Hình dạng phổ quát: đủ mọi nhánh của minimizer", "Universal shape bound: every minimizer branch covered")}</h4>
          <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("n là số vận tốc chuyển động; tổng người chạy là n+1. Chuẩn hóa uᵢ=vᵢ/max(v), với 0<uᵢ≤1 và max(u)=1. Chặn này áp dụng cho mọi u trong miền đó, không chỉ một grid số hay vài vector thử.", "n counts moving speeds; total runners are n+1. Normalize uᵢ=vᵢ/max(v), with 0<uᵢ≤1 and max(u)=1. This bound applies to every u in that domain, not just a numerical grid or a few test vectors.")}</p>
          <MathText className="mt-3 block min-w-0" text={"$q(u)=1+2u-u^2,\\quad H(u)=\\left(\\sum_{i=1}^{n}\\frac{u_i^2}{q(u_i)}\\right)\\prod_{i=1}^{n}\\frac{q(u_i)}{u_i^{2/n}},\\quad R_n=\\frac n{\\sqrt{H(u)}}$"} />
          <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Lập luận biên bảo đảm cực tiểu tồn tại. Phân loại đầy đủ phương trình tới hạn và tính đơn ánh buộc mọi tọa độ nội tại cực tiểu bằng cùng một t. Tách theo k, số tọa độ bằng 1: kiểm tất cả k≥2 bằng chặn 8/5, còn k=1 quy về đúng một nghiệm cubic. Bảng hữu tỉ hỗ trợ lập luận phổ quát này, không thay thế nó.", "A boundary argument guarantees a minimum exists. Complete critical-point classification and injectivity force every interior coordinate at a minimum to equal one t. Split by k, the number of coordinates equal to 1: check every k≥2 using the 8/5 bound, while k=1 reduces to one cubic root. Rational checks support this universal argument rather than replace it.")}</p>
          <div className="mt-4 space-y-4">{report.targets.map((target) => <article key={target.movingSpeeds} className="border-line min-w-0 border-l-2 pl-3">
            <h5 className="text-body text-ink font-medium">n = {target.movingSpeeds} · {target.totalRunners} {t("người chạy", "runners")}</h5>
            <MathText className="mt-2 block min-w-0" text={`$R_{${target.movingSpeeds}}<${texFraction(target.shape.rBound)}$`} />
            <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Đã rà soát cầu nối phổ quát và kiểm các bước số học chính xác; không phải chứng minh hình thức Lean hay kết quả toán học mới.", "The universal bridge is reviewed and its exact arithmetic substeps checked; this is not a Lean formal proof or a novel mathematical result.")}</p>
            <details className="text-meta text-ink-muted mt-2"><summary className="min-h-10 cursor-pointer">{t("Nghiệm cubic, so sánh lũy thừa và mọi nhánh k", "Cubic root, powered comparison and every k branch")}</summary>
              <p className="mt-2 break-words">{t("Khoảng nghiệm tới hạn", "Critical-root interval")}: L = {fraction(target.shape.criticalBracket.lower)}, U = {fraction(target.shape.criticalBracket.upper)}.</p>
              <p className="mt-2 break-words">{t("Khoảng nghiệm nhỏ của D", "Small D-root interval")}: {fraction(target.shape.alphaBracket.lower)} &lt; α &lt; {fraction(target.shape.alphaBracket.upper)}; U &lt; α.</p>
              <MathText className="mt-3 block min-w-0" text={"$A_n(t)=1+2t+(2n-3)t^2,\\quad H_*=(n/r_n)^2$"} />
              <MathText className="mt-2 block min-w-0" text={`$\\frac{[A_n(L)q(L)^{${target.movingSpeeds - 2}}]^{${target.shape.k1Comparison.power}}}{U^{${target.movingSpeeds === 13 ? 24 : 13}}}>H_*^{${target.shape.k1Comparison.power}}$`} />
              <p className="mt-2 max-w-[76ch]">{t("Biên của so sánh hữu tỉ là dương nghiêm ngặt. Nghiệm và mọi lũy thừa được kiểm chính xác, không dùng log hoặc số thực dấu phẩy động để nghiệm thu.", "The rational comparison margin is strictly positive. Roots and every power are checked exactly; admission does not use logarithms or floating-point arithmetic.")}</p>
              <p className="mt-3">{target.shape.kBranches.length} {t("nhánh k≥2 đã kiểm đầy đủ", "k≥2 branches checked completely")}:</p>
              <ul className="mt-2 space-y-2">{target.shape.kBranches.map((branch) => <li key={branch.k} className="min-w-0 break-words">
                k = {branch.k}: {fraction(branch.lowerBound)} &gt; {fraction(branch.target)}; {t("biên dương nghiêm ngặt", "strict positive margin")}.
              </li>)}</ul>
              <details className="mt-3"><summary className="min-h-10 cursor-pointer">{t("Các đa thức đã nghiệm thu", "Admitted polynomial coefficients")}</summary>
                <p className="mt-2 max-w-[76ch]">{t("Hệ số theo thứ tự lũy thừa tăng dần; D định vị miền, P kiểm dấu đạo hàm, cubic định vị cực tiểu k=1.", "Coefficients are in ascending-power order; D locates the domain, P checks the derivative sign, and the cubic locates the k=1 minimum.")}</p>
                <dl className="mt-2 grid min-w-0 gap-2 [overflow-wrap:anywhere]">
                  <div><dt>D</dt><dd>{target.shape.D.join(", ")}</dd></div>
                  <div><dt>P</dt><dd>{target.shape.P.join(", ")}</dd></div>
                  <div><dt>Cubic</dt><dd>{target.shape.cubic.join(", ")}</dd></div>
                </dl>
              </details>
            </details>
          </article>)}</div>
        </section>
        <section aria-labelledby="allikvere-geometry-reviewed" className="border-line border-t pt-4">
          <h4 id="allikvere-geometry-reviewed" className="text-body text-ink-strong font-medium">{t("Hình học: lập luận phổ quát khác với đối chứng ma trận", "Geometry: universal argument versus matrix controls")}</h4>
          <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Rà soát support function dùng đầy đủ các đỉnh của tiết diện crosspolytope để suy ra E⊂D. Đồng nhất thức hai biến có dấu không âm trên toàn miền chuẩn hóa, không chỉ tại các vector đối chứng. Đối ngẫu lattice chiếu cần vận tốc nguyên thủy; Schur complement cho công thức covolume.", "The support-function review uses every crosspolytope-section vertex to obtain E⊂D. The bivariate identity is nonnegative on the whole normalized domain, not merely at control vectors. Projected-lattice duality requires primitive speeds; the Schur complement gives the covolume formula.")}</p>
          <MathText className="mt-3 block min-w-0" text={"$(u+v)^2-q(u)v^2-q(v)u^2=2uv(1-u)(1-v)\\ge0$"} />
          <MathText className="mt-2 block min-w-0" text={"$\\operatorname{covol}_E^2=\\frac1{\\left(\\prod_i q(u_i)\\right)\\left(\\sum_i v_i^2/q(u_i)\\right)}=\\frac1{S^2F_n^2}$"} />
          <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("S là trung bình nhân các vận tốc; Fₙ=√H(u). Kiểm Gaussian hữu tỉ dưới đây chỉ là đối chứng công thức ma trận, không chứng minh phổ quát, không là nhân chứng LRC và không bao phủ kho terminal.", "S is the geometric mean of the speeds; Fₙ=√H(u). The rational Gaussian checks below are matrix-formula controls only, not a universal proof, an LRC witness or complete terminal coverage.")}</p>
          <details className="text-meta text-ink-muted mt-3"><summary className="min-h-10 cursor-pointer">{t("Đối chứng primitive và trường hợp bị từ chối", "Primitive controls and rejected application")}</summary>
            <div className="mt-3 space-y-3">{report.targets.flatMap((target) => target.geometryControls.map((control) => <article key={control.id} className="border-line min-w-0 border-l-2 pl-3">
              <h5 className="text-body text-ink font-medium [overflow-wrap:anywhere]">{control.id}</h5>
              <p className="mt-1 break-words">v = ({control.speeds.join(", ")}); gcd = 1.</p>
              <p className="mt-2 max-w-[76ch]">{t("det(G) và det(C) khớp công thức bằng số hữu tỉ chính xác. Các tọa độ bằng nhau của đối chứng ones không được diễn giải thành một bài LRC admissible mới.", "det(G) and det(C) match the formulas by exact rational arithmetic. Repeated coordinates in the ones control are not interpreted as a new admissible LRC problem.")}</p>
            </article>))}</div>
            <p className="mt-3 max-w-[76ch]">{t("Đối chứng 2·(1,…,n) có gcd=2 bị từ chối khi áp dụng công thức primitive. Phép chiếu không đổi nhưng 1/(SFₙ) bị đổi hệ số 1/2; bỏ điều kiện nguyên thủy sẽ cho công thức sai.", "The control 2·(1,…,n) has gcd=2 and is rejected from the primitive formula. Its projection is unchanged but 1/(SFₙ) scales by 1/2; dropping primitivity gives the wrong formula.")}</p>
          </details>
        </section>
        <section aria-labelledby="allikvere-flag-conditional" className="border-line border-t pt-4">
          <h4 id="allikvere-flag-conditional" className="text-body text-ink-strong font-medium">{t("Ghép chặn flag: LRC dưới vẫn là tiền đề", "Flag composition: lower LRC remains a premise")}</h4>
          <MathText className="mt-3 block min-w-0" text={"$SF_n\\le K_n^{-1/2},\\quad \\prod_i v_i<\\left(\\frac{r_n}{n\\sqrt{K_n}}\\right)^n$"} />
          <MathText className="mt-2 block min-w-0" text={"$\\left(\\prod_i v_i\\right)^2<\\frac{(r_n/n)^{2n}}{K_n^n}$"} />
          <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Ghép với K của báo cáo prefix/KZ đã khóa, dưới các tiền đề LRC dưới và tồn tại cơ sở KZ được viết rõ. Báo cáo này dẫn chiếu chứng cứ TIP-053 đã lưu, không phải phát lại TIP-053 hoặc chạy mô hình mới. Chặn tích vận tốc có điều kiện; chưa tạo nhân chứng hay nghiệm thu toàn bộ định lý.", "Compose with K from the sealed prefix/KZ report under explicit lower-LRC and written KZ-basis-existence premises. This report references retained TIP-053 evidence, not a fresh TIP-053 replay or model run. The speed-product bound is conditional; no witness or whole-theorem acceptance follows.")}</p>
          <ul className="text-meta text-ink-muted mt-3 space-y-2">{report.targets.map((target) => <li key={target.movingSpeeds} className="min-w-0 break-words">
            n = {target.movingSpeeds}: {t("cần LRC dưới tới", "requires lower LRC through")} {target.flag.lowerLrcThrough}; {target.flag.lowerPremise}; {target.flag.status}.
          </li>)}</ul>
          <p className="text-body text-ink-muted mt-3 max-w-[76ch]">{t("Đích 15 người chạy cần kết quả 14 người chạy đã được thiết lập, không chỉ thay chỉ số. Tất cả 23 nghĩa vụ áp dụng toàn cục ở dưới vẫn mở; LRC 14/15 chưa thiết lập. Đầy đủ level-1, lift và terminal của tác giả cần kiểm riêng. Chưa có chiến dịch agent HIVE mới, chứng minh Lean, nghiệm thu bên ngoài hoặc xác nhận tính mới.", "The 15-runner target needs an established 14-runner result, not just an index substitution. All 23 global application obligations below remain open; LRC 14/15 is NOT ESTABLISHED. Complete author level-1, lifts and terminals require separate checking. No new HIVE agent campaign, Lean proof, external acceptance or novelty certification has occurred.")}</p>
        </section>
      </div>
      <details className="text-meta text-ink-muted mt-4"><summary className="min-h-10 cursor-pointer">{t("Nguồn và dấu vết kiểm hình dạng/hình học", "Shape/geometry source and audit provenance")}</summary>
        <p className="mt-2 max-w-[76ch]">{t("Receipt không ký dựa vào collector, interpreter và lưu trữ local tin cậy; không là chứng nhận thực thi bên ngoài. GET nghiệm thu đại số mới đã cố định, không chạy Python, gọi mô hình hoặc các validator cũ.", "Unsigned receipts rely on the trusted local collector, interpreter and storage, not external execution attestation. GET admits fixed new algebra without running Python, calling a model or invoking old validators.")}</p>
        <a href={report.source.url} target="_blank" rel="noreferrer" className={linkClass}>{t("Nguồn v2: §§3.1, 3.5, 3.6", "Source v2: §§3.1, 3.5, 3.6")}</a>
        <dl className="mt-2 grid min-w-0 gap-3 [overflow-wrap:anywhere]">
          <div><dt>{t("Kết quả có phạm vi", "Scoped result")}</dt><dd>{report.status}</dd></div>
          <div><dt>{t("Phân loại toàn cục", "Global classification")}</dt><dd>{report.globalVerdict}</dd></div>
          <div><dt>{t("Thời điểm lưu báo cáo", "Report retention time")}</dt><dd>{report.generatedAt}</dd></div>
          <div><dt>{t("Dẫn chiếu TIP-053 đã khóa", "Sealed TIP-053 reference")}</dt><dd className="font-mono">{report.dependency.reportSha256}</dd></div>
          <div><dt>{t("Loại dẫn chiếu", "Reference kind")}</dt><dd>{report.dependency.receiptKind}</dd></div>
          <div><dt>{t("Báo cáo hình dạng/hình học", "Shape/geometry report")}</dt><dd className="font-mono">{report.reportDigest}</dd></div>
          <div><dt>Python source</dt><dd className="font-mono">{report.receipt.sourceSha256}</dd></div>
          <div><dt>Python output</dt><dd className="font-mono">{report.receipt.stdoutSha256}</dd></div>
          <div><dt>{t("Thời gian phát lại quan sát", "Observed replay duration")}</dt><dd>{report.receipt.elapsedMs} ms</dd></div>
        </dl>
      </details>
    </>}
  </section>;
}
