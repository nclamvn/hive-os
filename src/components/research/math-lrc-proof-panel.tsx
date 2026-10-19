import { Panel } from "@/components/ui/panel";
import { MathText } from "@/components/research/math-text";
import { MathLrcPropernessPanel } from "@/components/research/math-lrc-properness-panel";
import retainedProperness from "../../../docs/research/lrc-allikvere-v2/retained-properness-bridge.json";
import { MathLrcPrefixKzPanel } from "@/components/research/math-lrc-prefix-kz-panel";
import retainedPrefixKz from "../../../docs/research/lrc-allikvere-v2/retained-prefix-kz-audit.json";
import { MathLrcShapeGeometryPanel } from "@/components/research/math-lrc-shape-geometry-panel";
import retainedShapeGeometry from "../../../docs/research/lrc-allikvere-v2/retained-shape-geometry-audit.json";
import { MathLrcPrimeCriterionPanel } from "@/components/research/math-lrc-prime-criterion-panel";
import retainedPrimeCriterion from "../../../docs/research/lrc-allikvere-v2/retained-prime-criterion-audit.json";
import { MathLrcP83CoveringNumberPanel } from "@/components/research/math-lrc-p83-covering-number-panel";
import retainedP83CoveringNumber from "../../../docs/research/lrc-allikvere-v2/retained-p83-covering-number.json";
import { MathLrcP83GenerationPanel } from "@/components/research/math-lrc-p83-generation-panel";
import retainedP83Generation from "../../../docs/research/lrc-allikvere-v2/retained-p83-generation.json";
import { MathLrcP83CascadePanel } from "@/components/research/math-lrc-p83-cascade-panel";
import retainedP83Cascade from "../../../docs/research/lrc-allikvere-v2/retained-p83-cascade.json";
import { MathLrcP83TerminalPanel } from "@/components/research/math-lrc-p83-terminal-panel";
import retainedP83Terminal from "../../../docs/research/lrc-allikvere-v2/retained-p83-terminal.json";
import { buildAllikvereProofPlan, validateRetainedProofArithmetic } from "@/modules/research-sandbox/math-lrc-proof-plan";

const dependencyCopy: Record<string, readonly [string, string]> = {
  LOWER_LRC_THROUGH_12: ["Các trường hợp dưới tới LRC(12)", "Lower cases through LRC(12)"],
  PRIMITIVE_DISTINCT_REDUCTION_13: ["Quy giản về vận tốc nguyên thủy, phân biệt, k=13", "Primitive, distinct-speed reduction, k=13"],
  LATTICE_FLAG_BOUND_13: ["Chặn lattice/flag, k=13", "Lattice/flag bound, k=13"],
  SHAPE_INEQUALITY_13: ["Bất đẳng thức hình dạng, k=13", "Shape inequality, k=13"],
  PRIME_DIVISIBILITY_CRITERION_13: ["Tiêu chuẩn chia hết bởi prime, k=13", "Prime-divisibility criterion, k=13"],
  ESTABLISHED_LRC_13: ["Kết quả LRC(13), tức 14 người chạy, đã được thiết lập", "Established LRC(13), the 14-runner result"],
  PRIMITIVE_DISTINCT_REDUCTION_14: ["Quy giản về vận tốc nguyên thủy, phân biệt, k=14", "Primitive, distinct-speed reduction, k=14"],
  LATTICE_FLAG_BOUND_14: ["Chặn lattice/flag, k=14", "Lattice/flag bound, k=14"],
  SHAPE_INEQUALITY_14: ["Bất đẳng thức hình dạng, k=14", "Shape inequality, k=14"],
  FORCED_DIVISOR_LEMMA_14: ["Bổ đề ước bắt buộc, k=14", "Forced-divisor lemma, k=14"],
  PRIME_DIVISIBILITY_CRITERION_14: ["Tiêu chuẩn chia hết bởi prime, k=14", "Prime-divisibility criterion, k=14"],
  ELLIPSOID_COVOLUME_13: ["Ellipsoid và covolume, k=13", "Ellipsoid and covolume, k=13"],
  ELLIPSOID_COVOLUME_14: ["Ellipsoid và covolume, k=14", "Ellipsoid and covolume, k=14"],
  SEPARATED_POINTS_PREFIX_13: ["Các điểm tách biệt và chặn prefix, k=13", "Separated points and prefix bounds, k=13"],
  SEPARATED_POINTS_PREFIX_14: ["Các điểm tách biệt và chặn prefix, k=14", "Separated points and prefix bounds, k=14"],
  KZ_PRODUCT_MINIMIZATION_13: ["Tối thiểu hóa tích KZ, k=13", "KZ product minimization, k=13"],
  KZ_PRODUCT_MINIMIZATION_14: ["Tối thiểu hóa tích KZ, k=14", "KZ product minimization, k=14"],
  LEVEL_ONE_COMPLETENESS_61_PRIMES: ["Đầy đủ mọi quỹ đạo mức 1 của 61 prime", "Complete level-1 orbits for 61 primes"],
  LEVEL_ONE_COMPLETENESS_71_PRIMES: ["Đầy đủ mọi quỹ đạo mức 1 của 71 prime", "Complete level-1 orbits for 71 primes"],
  BINARY_LIFT_COMPLETENESS_61_PRIMES: ["Đầy đủ mọi lift nhị phân của 61 prime", "Complete binary lifts for 61 primes"],
  BINARY_LIFT_COMPLETENESS_71_PRIMES: ["Đầy đủ mọi lift nhị phân của 71 prime", "Complete binary lifts for 71 primes"],
  TERMINAL_PROPERNESS_61_PRIMES: ["Properness và đầy đủ mọi nhánh terminal của 61 prime", "Properness and complete terminal branches for 61 primes"],
  CRT_SHIFT_TERMINAL_PROPERNESS_71_PRIMES: ["Properness và đầy đủ CRT/shift/terminal của 71 prime", "Properness and complete CRT/shift/terminal cases for 71 primes"],
};
const sectionLabels: Record<string, string> = { S2: "2", S5: "5", S6: "6", "S3.SS1": "3.1", "S3.SS3": "3.3", "S3.SS4": "3.4", "S3.SS5": "3.5", "S3.SS6": "3.6", "S3.SS7": "3.7", "S4.SS1": "4.1", "S4.SS2": "4.2", "S4.SS3": "4.3", "S4.SS4": "4.4" };

/** A retained proof dossier, not an agent campaign or a theorem verifier. */
export function MathLrcProofPanel({ raw, base, locale }: {
  raw: unknown; base: string; locale: string;
}) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const plan = buildAllikvereProofPlan();
  const report = validateRetainedProofArithmetic(raw);
  const linkClass = "text-meta text-ink-muted hover:text-ink inline-flex min-h-10 max-w-full items-center break-words underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return <Panel id="allikvere-proof" className="min-w-0 scroll-mt-24 p-5 sm:p-6">
    <header className="max-w-[76ch]">
      <h2 className="text-section-title text-ink-strong">{t("Đổi chiến thuật: tái lập định lý trước", "Tactic pivot: reproduce the theorem first")}</h2>
      <p className="text-body text-ink mt-3">{t("Dừng mở rộng phủ cục bộ làm hướng mặc định. Xác định chuỗi phụ thuộc của kết quả 14/15 người chạy, rồi chọn phương pháp có thể đóng một nghĩa vụ toàn cục.", "Stop expanding partial local coverage as the default direction. Identify the 14/15-runner dependency chain, then choose a method that can discharge a global obligation.")}</p>
      <p className="text-body text-ink-muted mt-3">{t("Thêm số đếm cục bộ không phải thước đo tiến bộ chứng minh. Mỗi phép tính tiếp theo phải nêu nghĩa vụ toàn cục cụ thể và vì sao nó có thể đóng nghĩa vụ đó.", "More local counts are not a proof-progress metric. Each further computation must name a specific global obligation and explain why it can close it.")}</p>
    </header>
    <dl className="border-line mt-5 grid gap-4 border-y py-4 text-body sm:grid-cols-3">
      <div className="min-w-0"><dt className="text-ink-muted">{t("Kết quả trong nguồn", "Source result")}</dt><dd className="text-ink-strong mt-1">{t("Bản tiền ấn phẩm tuyên bố 14 và 15 người chạy", "Preprint claims 14 and 15 runners")}</dd></div>
      <div className="min-w-0"><dt className="text-ink-muted">{t("Tái lập độc lập tại đây", "Local independent reproduction")}</dt><dd className="text-ink-strong mt-1">{t("Chưa thiết lập", "NOT ESTABLISHED")}</dd></div>
      <div className="min-w-0"><dt className="text-ink-muted">{t("Kết quả mới", "Novel result")}</dt><dd className="text-ink-strong mt-1">{t("Không có tuyên bố tính mới; hướng này tạm dừng", "No novelty claim; novelty track paused")}</dd></div>
    </dl>
    <section aria-labelledby="allikvere-next-obligation" className="mt-5 max-w-[76ch]">
      <h3 id="allikvere-next-obligation" className="text-body text-ink-strong font-medium">{t("Nghĩa vụ tiếp theo đã chọn", "Selected next obligation")}</h3>
      <p className="text-body text-ink mt-2">{t("Rà soát phép quy giản giải tích và tính properness", "Audit the analytic reduction and properness")}</p>
      <p className="text-body text-ink-muted mt-2">{t("Ưu tiên kiểm cầu nối vận tốc nguyên thủy, GCD và phép shift có ít ngoại lệ; sau đó rà soát lập luận hình dạng và tích prime. Các lift của vector cố định chia hết cho 7 bị loại khỏi phản ví dụ nguyên thủy; nhãn NO_GRID cũ không phải thất bại của LRC liên tục.", "First audit the primitive-speed, GCD and few-exception shift bridge; then audit the shape and prime-product arguments. Fixed-vector lifts divisible by 7 are excluded as primitive counterexamples; old NO_GRID labels are not continuous-time LRC failures.")}</p>
      <p className="text-body text-ink-muted mt-2">{t("Đây là kế hoạch nghiên cứu local đã chọn, chờ rà soát đầy đủ; không phải agent đã chạy. Giả thiết và phạm vi áp dụng phải được rà soát trước khi dùng chặn để quy về kiểm hữu hạn.", "This is a selected local research plan pending full review, not an executed agent campaign. Hypotheses and applicability must be audited before using the bound to reduce to finite checking.")}</p>
      <p className="text-meta text-ink-muted mt-2 [overflow-wrap:anywhere]">{plan.nextObligation.id} · {plan.nextObligation.status}</p>
    </section>
    <MathLrcP83CoveringNumberPanel raw={retainedP83CoveringNumber} locale={locale} />
    <MathLrcP83GenerationPanel raw={retainedP83Generation} locale={locale} />
    <MathLrcP83CascadePanel raw={retainedP83Cascade} locale={locale} />
    <MathLrcP83TerminalPanel raw={retainedP83Terminal} locale={locale} />
    <MathLrcPropernessPanel raw={retainedProperness} locale={locale} />
    <MathLrcPrefixKzPanel raw={retainedPrefixKz} locale={locale} />
    <MathLrcShapeGeometryPanel raw={retainedShapeGeometry} locale={locale} />
    <MathLrcPrimeCriterionPanel raw={retainedPrimeCriterion} locale={locale} />
    <section aria-labelledby="allikvere-proof-dependencies" className="border-line mt-6 border-t pt-5">
      <h3 id="allikvere-proof-dependencies" className="text-section-title text-ink-strong">{t("Phụ thuộc chứng minh, tách riêng từng đích", "Proof dependencies, separate for each target")}</h3>
      <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Mọi giả thiết toàn cục chưa rà soát hoặc phát lại đều còn mở. Số đếm, hash và kiểm thử phần mềm không đóng chúng. k là số vận tốc chuyển động; tổng số người chạy là k+1.", "Every unreviewed or unreplayed global premise remains open. Counts, hashes and software tests do not close them. k counts moving speeds; total runners are k+1.")}</p>
      <div className="mt-5 space-y-6">{plan.targets.map((target) => <article key={target.totalRunners} className="min-w-0">
        <h4 className="text-body text-ink-strong font-medium">{target.totalRunners} {t("người chạy", "runners")} · k = {target.movingSpeeds} · {t("chưa thiết lập", "NOT ESTABLISHED")}</h4>
        {target.totalRunners === 15 && <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Đích 15 phụ thuộc kết quả 14 đã được thiết lập, không phải một đối chứng local của đích 14.", "The 15-runner target depends on an established 14-runner result, not a local 14-runner control.")}</p>}
        <ol className="mt-3 space-y-3">{target.dependencies.map((dependency) => {
          const copy = dependencyCopy[dependency.id];
          return <li key={dependency.id} className="border-line min-w-0 border-l-2 pl-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-body text-ink break-words">{copy ? t(copy[0], copy[1]) : dependency.id.replaceAll("_", " ")}</span>
              <span className="text-meta text-ink-muted">{t("Mở", "OPEN")}</span>
            </div>
            <a href={dependency.sourceUrl} target="_blank" rel="noreferrer" className={linkClass}>{t("Nguồn", "Source")} §{sectionLabels[dependency.sourceSection] ?? dependency.sourceSection}</a>
            {dependency.dependsOn.length > 0 && <p className="text-meta text-ink-muted [overflow-wrap:anywhere]">{t("Phụ thuộc", "Depends on")}: {dependency.dependsOn.map((id) => dependencyCopy[id] ? t(dependencyCopy[id][0], dependencyCopy[id][1]) : id).join("; ")}</p>}
          </li>;
        })}</ol>
      </article>)}</div>
    </section>
    <section aria-labelledby="allikvere-conditional-arithmetic" className="border-line mt-6 border-t pt-5">
      <h3 id="allikvere-conditional-arithmetic" className="text-section-title text-ink-strong">{t("Số học có điều kiện, không phải chứng minh định lý", "Conditional arithmetic, not a theorem proof")}</h3>
      <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Tái dựng khoảng hữu tỉ chính xác cho chặn log và tích prime, với r₁₃=101/200 và r₁₄=1/2. Các hằng số hình dạng và định lý quy giản vẫn là giả thiết bên ngoài chưa được chứng minh độc lập tại đây.", "Reconstruct exact rational intervals for the logarithmic bound and prime product, with r₁₃=101/200 and r₁₄=1/2. Shape constants and the reduction theorem remain external assumptions not independently proved here.")}</p>
      <div className="mt-3 min-w-0"><MathText text={"$B_i=\\left(\\frac{2i}{(n+1)(n+1-i)}\\right)^2,\\quad c_i=B_i-B_{i-1},\\quad K_n=\\prod_{i=1}^{n-1}c_i$"} /></div>
      <div className="mt-2 min-w-0"><MathText text={"$\\log\\operatorname{bound}=n\\log(r_n/n)-\\frac n2\\log K_n,\\quad c_{i+1}/c_i>4/3$"} /></div>
      {!report ? <div role="alert" className="bg-surface-subtle mt-4 rounded-md p-4">
        <p className="text-body text-ink">{t("Báo cáo số học chưa có hoặc không hợp lệ", "Arithmetic report unavailable or invalid")}</p>
        <p className="text-meta text-ink-muted mt-2">{t("Không hiện số liệu chưa nghiệm thu. Chuỗi phụ thuộc và trạng thái chưa thiết lập giữ nguyên; không sinh báo cáo, chạy Python, truy nguồn ngoài hay gọi mô hình trên GET.", "Unadmitted numbers are not displayed. The dependency plan and unestablished status remain; GET does not generate a report, launch Python, fetch external sources or call a model.")}</p>
      </div> : <>
        <p className="text-body text-ink mt-4">{t("Số học có điều kiện đã tái lập; định lý toàn cục vẫn chưa thiết lập.", "Conditional arithmetic reproduced; the global theorem remains NOT ESTABLISHED.")}</p>
        <div className="mt-4 space-y-4">{report.targets.map((target) => <article key={target.totalRunners} className="border-line min-w-0 border-t pt-3">
          <h4 className="text-body text-ink-strong font-medium">{target.totalRunners} {t("người chạy", "runners")} · {target.primes.length} {t("prime trong danh sách nguồn §5", "primes in source §5")}</h4>
          <dl className="text-meta mt-3 grid gap-3 sm:grid-cols-3">
            <div className="min-w-0"><dt className="text-ink-muted">{t("Khoảng chặn log", "Log-bound interval")}</dt><dd className="text-ink mt-1 break-words">{target.display.logBound}</dd></div>
            <div className="min-w-0"><dt className="text-ink-muted">{t("Khoảng log tích bắt buộc", "Required log-product interval")}</dt><dd className="text-ink mt-1 break-words">{target.display.logRequiredProduct}</dd></div>
            <div className="min-w-0"><dt className="text-ink-muted">{t("Biên dương nghiêm ngặt", "Strict positive margin")}</dt><dd className="text-ink mt-1 break-words">{target.display.margin}</dd></div>
          </dl>
          <details className="text-meta text-ink-muted mt-3"><summary className="min-h-10 cursor-pointer">{t("Danh sách prime chính xác", "Exact prime list")}</summary><p className="mt-2 break-words">{target.primes.join(", ")}</p></details>
        </article>)}</div>
        <p className="text-meta text-ink-muted mt-4 max-w-[76ch]">{t("Danh sách 61/71 prime thuộc bản v2; kho 111 prime cũ là phép tính lớn hơn trước đó, không mâu thuẫn với tập con 61 prime. lcm(2,…,15)=360360 và điều kiện nguyên tố cùng nhau thuộc kiểm số học, không đóng nghĩa vụ giải tích hay hữu hạn toàn cục.", "The 61/71-prime lists belong to v2; the old 111-prime archive is a larger prior computation, not a contradiction to the 61-prime subset. lcm(2,…,15)=360360 and coprimality are arithmetic checks, not closure of analytic or global finite obligations.")}</p>
      </>}
      <p className="text-meta text-ink-muted mt-4 max-w-[76ch]">{t("Khoảng hiển thị là bao ngoài thập phân; phép nghiệm thu dùng khoảng hữu tỉ chính xác. Receipt/hash không ký chỉ là độ tin cậy local, không phải xác nhận thực thi bên ngoài, chứng minh hình thức hay xác nhận tính mới.", "Displayed intervals are decimal enclosures; admission uses exact rational intervals. Unsigned receipts/hashes provide local trust only, not external execution attestation, formal proof or novelty certification.")}</p>
      {report && <details className="text-meta text-ink-muted mt-3">
        <summary className="min-h-10 cursor-pointer">{t("Dấu vết phát lại số học local", "Local arithmetic replay provenance")}</summary>
        <dl className="mt-2 grid min-w-0 gap-3 break-all">
          <div><dt>{t("Thời điểm lưu báo cáo", "Report retention time")}</dt><dd>{report.generatedAt}</dd></div>
          <div><dt>{t("Báo cáo mới", "New report")}</dt><dd className="font-mono">{report.reportDigest}</dd></div>
          <div><dt>{t("Kế hoạch phụ thuộc", "Dependency plan")}</dt><dd className="font-mono">{report.planDigest}</dd></div>
          <div><dt>Python source</dt><dd className="font-mono">{report.receipt.sourceSha256}</dd></div>
          <div><dt>Python output</dt><dd className="font-mono">{report.receipt.stdoutSha256}</dd></div>
        </dl>
      </details>}
    </section>
    <footer className="border-line mt-6 border-t pt-5">
      <h3 className="text-body text-ink-strong font-medium">{t("Nguồn và chứng cứ cũ được bảo toàn", "Source and preserved evidence")}</h3>
      <p className="text-meta text-ink-muted mt-2">Jaan Allikvere · arXiv:2609.02604v2 · {plan.source.date}</p>
      <a href={plan.source.url} target="_blank" rel="noreferrer" className={linkClass}>{t("Đọc bản tiền ấn phẩm nguồn", "Read the source preprint")}</a>
      <p className="text-meta text-ink-muted break-all">{plan.source.url}</p>
      <nav aria-label={t("Chứng cứ lưu trữ", "Archived evidence")} className="mt-3 flex min-w-0 flex-col items-start gap-1">
        <a href={base + "?view=allikvere#allikvere"} className={linkClass}>{t("TIP-047: các fiber p199 đã giữ lại", "TIP-047: retained p199 fibers")}</a>
        <a href={base + "?view=allikvere#allikvere-cover"} className={linkClass}>{t("TIP-048: chặn phủ cục bộ", "TIP-048: partial cover bounds")}</a>
        <a href={base + "?view=allikvere#allikvere-frontier"} className={linkClass}>{t("TIP-049: checkpoint frontier", "TIP-049: frontier checkpoint")}</a>
        <a href={base + "?view=allikvere-unit#allikvere-unit"} className={linkClass}>{t("TIP-050: hợp qua phép nhân đơn vị", "TIP-050: unit-action union")}</a>
      </nav>
      <p className="text-body text-ink-muted mt-3 max-w-[76ch]">{t("Chứng cứ PARTIAL cũ giữ nguyên giá trị trong phạm vi đã kiểm, nhưng không là tiền đề nghiệm thu toàn bộ định lý 14/15. Hướng tìm tính mới chỉ tiếp tục khi ranh giới tái lập đã rõ.", "Existing PARTIAL evidence retains its checked local value, but is not a premise accepting the complete 14/15 theorem. The novelty track resumes only after the reproduction boundary is explicit.")}</p>
    </footer>
  </Panel>;
}
