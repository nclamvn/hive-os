import { MathText } from "@/components/research/math-text";
import { validateRetainedPrefixKzReport } from "@/modules/research-sandbox/math-lrc-prefix-kz";

/** Pure retained admission only. No independent runner or model dispatch on GET. */
export function MathLrcPrefixKzPanel({ raw, locale }: { raw: unknown; locale: string }) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const report = validateRetainedPrefixKzReport(raw);
  const fraction = (q: { numerator: string; denominator: string }) => `${q.numerator}/${q.denominator}`;
  const linkClass = "inline-flex min-h-10 max-w-full items-center break-words text-meta text-ink-muted underline hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return <section id="allikvere-prefix-kz" aria-labelledby="allikvere-prefix-kz-title" className="border-line mt-6 min-w-0 scroll-mt-24 border-t pt-5">
    <h3 id="allikvere-prefix-kz-title" className="text-section-title text-ink-strong">{t("Chặn prefix và cực tiểu KZ: kiểm hết miền đã quy giản", "Prefix bounds and KZ minimum: check the complete reduced domain")}</h3>
    <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Phân biệt cực tiểu trên các biến thực thỏa ràng buộc với việc chứng minh các vận tốc của LRC thực sự thỏa ràng buộc đó. Kiểm hữu hạn chỉ có ý nghĩa sau một cầu nối đầy đủ từ miền liên tục.", "Distinguish the minimum over real variables satisfying constraints from proving that LRC speeds actually satisfy those constraints. Finite checking matters only after a complete bridge from the continuous domain.")}</p>
    {!report ? <div role="alert" className="bg-surface-subtle mt-4 rounded-md p-4">
      <p className="text-body text-ink">{t("Báo cáo prefix/KZ chưa có hoặc không hợp lệ", "Prefix/KZ report unavailable or invalid")}</p>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Không hiện số đếm hay kết luận chưa nghiệm thu. Kết quả LRC 14/15 vẫn chưa thiết lập; đọc trang không tạo chứng chỉ, chạy Python, truy nguồn ngoài hoặc gọi mô hình.", "Unadmitted counts and conclusions are not displayed. LRC 14/15 remains NOT ESTABLISHED; reading this page does not generate certificates, run Python, fetch external sources or call a model.")}</p>
    </div> : <>
      <div className="mt-4 space-y-5">
        <section aria-labelledby="allikvere-prefix-kz-abstract">
          <h4 id="allikvere-prefix-kz-abstract" className="text-body text-ink-strong font-medium">{t("Kết quả trừu tượng: cực tiểu đã kiểm, không phải lấy mẫu", "Abstract result: checked minimum, not sampling")}</h4>
          <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("n là số vận tốc chuyển động, tổng người chạy là n+1, chiều lattice d=n−1. Các tᵢ là biến thực dương; đây không phải phép liệt kê mọi vận tốc hay mọi nhánh modular của tác giả.", "n counts moving speeds, total runners are n+1, and lattice dimension d=n−1. The tᵢ are positive real variables; this is not enumeration of every speed or every author modular branch.")}</p>
          <MathText className="mt-3 block min-w-0" text={"$B_r=\\left(\\frac{2r}{(n+1)(n+1-r)}\\right)^2,\\quad B_0=0,\\quad c_i=B_i-B_{i-1}$"} />
          <MathText className="mt-2 block min-w-0" text={"$t_{i+1}\\ge\\frac34t_i,\\quad \\sum_{i=1}^{r}t_i\\ge B_r\\quad\\Longrightarrow\\quad \\prod_{i=1}^{d}t_i\\ge K_n=\\prod_{i=1}^{d}c_i$"} />
          <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Với các Bᵣ đã khóa cho n=13 và n=14, kiểm lại mọi khối liên tiếp và mọi cách cắt thành khối. Nghiệm thu tự dựng lại toàn bộ miền, tính khả thi, tích, cực tiểu và trường hợp bằng; không tin số đếm hoặc hash do bộ sinh khai báo.", "For the sealed Bᵣ at n=13 and n=14, every contiguous block and every block composition is rechecked. Admission reconstructs the entire domain, feasibility, products, minimum and equality case rather than trusting producer counts or hashes.")}</p>
          <div className="mt-4 space-y-4">{report.targets.map((target) => <article key={target.movingSpeeds} className="border-line min-w-0 border-l-2 pl-3">
            <h5 className="text-body text-ink font-medium">n = {target.movingSpeeds}, d = {target.dimension} · {target.totalRunners} {t("người chạy", "runners")}</h5>
            <p className="text-body text-ink mt-2">{target.blocks.length} {t("khối liên tiếp", "contiguous blocks")} · {target.vertexAudit.maskCount} {t("đỉnh đầy đủ", "complete vertices")}</p>
            <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Cực tiểu chính xác Kₙ; đúng một đỉnh đạt bằng, khi mọi khối đều là singleton và tᵢ=cᵢ. Đây là miền đỉnh của đa diện trừu tượng, không phải độ phủ LRC.", "Exact minimum Kₙ; exactly one vertex attains equality, with every block a singleton and tᵢ=cᵢ. These are the vertices of the abstract polyhedron, not LRC coverage.")}</p>
            <details className="text-meta text-ink-muted mt-2"><summary className="min-h-10 cursor-pointer">{t("Chặn prefix và miền đỉnh đã kiểm", "Checked prefix bounds and vertex domain")}</summary>
              <p className="mt-2 max-w-[76ch]">{t("Ở mỗi dòng: s là khoảng tách biệt, ε là dung lượng sai số; s−ε=1/(n+1). LRC dưới là tiền đề, chưa được thiết lập bởi bảng này.", "In each row: s is the separation and ε is the error capacity; s−ε=1/(n+1). Lower LRC is a premise, not established by this table.")}</p>
              <ul className="mt-3 space-y-2">{target.prefixes.map((prefix) => <li key={prefix.r} className="min-w-0 break-words">
                r = {prefix.r}: Bᵣ = {fraction(prefix.B)}; s = {fraction(prefix.separation)}; ε = {fraction(prefix.errorCapacity)}; {t("LRC dưới tới", "lower LRC through")} {prefix.lowerLrcMax}.
              </li>)}</ul>
              <dl className="mt-3 grid min-w-0 gap-2 [overflow-wrap:anywhere]">
                <div><dt>{t("Mặt nạ cắt, miền đầy đủ", "Cut masks, complete domain")}</dt><dd>{target.vertexAudit.firstMask}…{target.vertexAudit.lastMask}</dd></div>
                <div><dt>{t("Số đỉnh đạt bằng", "Equality vertex count")}</dt><dd>{target.vertexAudit.equalityCount}</dd></div>
                <div><dt>{t("Mặt nạ duy nhất đạt bằng", "Unique equality mask")}</dt><dd>{target.vertexAudit.equalityMask}</dd></div>
                <div><dt>{t("Dòng phát lại có thứ tự", "Ordered replay stream")}</dt><dd className="font-mono">{target.vertexAudit.streamSha256}</dd></div>
              </dl>
            </details>
          </article>)}</div>
        </section>
        <details className="border-line text-meta text-ink-muted border-t pt-3"><summary className="min-h-10 cursor-pointer">{t("Vì sao kiểm hữu hạn bao phủ miền biến thực?", "Why does finite checking cover the real-variable domain?")}</summary>
          <MathText className="mt-3 block min-w-0" text={"$w_i=(3/4)^{i-1},\\quad z_i=t_i/w_i,\\quad z_1\\le\\cdots\\le z_d$"} />
          <p className="mt-2 max-w-[76ch]">{t("Tại một đỉnh, các zᵢ bằng nhau tạo thành khối liên tiếp. cᵢ/wᵢ tăng nghiêm ngặt nên một prefix không thể đạt bằng ở giữa khối. Đếm các ràng buộc độc lập buộc mọi cuối khối đạt bằng. Ngược lại, trung bình có trọng số của cᵢ/wᵢ trên từng khối tạo một đỉnh khả thi cho mỗi cách cắt, không bỏ sót đỉnh.", "At a vertex, equal zᵢ form contiguous blocks. Strictly increasing cᵢ/wᵢ prevents an active prefix inside a block. Counting independent constraints forces every block end to be active. Conversely, each block's weighted average of cᵢ/wᵢ gives a feasible vertex for every composition, leaving no vertex omitted.")}</p>
          <p className="mt-2 max-w-[76ch]">{t("Đa diện dương là pointed. Theo phân rã Minkowski–Weyl, mỗi điểm là tổ hợp lồi các đỉnh cộng hướng recession không âm. Tổng log(tᵢ) vừa lõm vừa tăng theo từng tọa độ, nên không nhỏ hơn cực tiểu tại đỉnh. Lập luận này cộng kiểm hữu tỉ toàn bộ đỉnh mới dẫn tới chặn tích cho biến thực.", "The positive polyhedron is pointed. By Minkowski–Weyl decomposition, every point is a convex combination of vertices plus a nonnegative recession direction. The sum of log(tᵢ) is concave and coordinate-increasing, so it is no smaller than the vertex minimum. This argument together with exact checking of all vertices gives the real-variable product bound.")}</p>
          <p className="mt-2 max-w-[76ch]">{t("Đây là lập luận toán học được rà soát kèm kiểm số học độc lập, không phải chứng minh hình thức Lean. Kiểm đỉnh đơn thuần không thay thế cầu nối đa diện này.", "This is a reviewed mathematical argument with independent arithmetic checking, not a Lean formal proof. Vertex checking alone does not replace this polyhedral bridge.")}</p>
        </details>
        <section aria-labelledby="allikvere-prefix-kz-conditional" className="border-line border-t pt-4">
          <h4 id="allikvere-prefix-kz-conditional" className="text-body text-ink-strong font-medium">{t("Áp dụng vào LRC: vẫn có điều kiện", "Application to LRC: still conditional")}</h4>
          <MathText className="mt-3 block min-w-0" text={"$\\frac1{n+1-r}-\\frac{r}{(n+1)(n+1-r)}=\\frac1{n+1}$"} />
          <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Bổ đề điểm tách biệt cần các trường hợp LRC dưới; nearest-plane và E⊂D chuyển sai số lattice thành một thời điểm chung. Sai số đúng bằng ngưỡng vẫn tạo nhân chứng, nên phản ví dụ phải thỏa tổng prefix >Bᵣ, không chỉ ≥Bᵣ. Bảng số học không tạo nhân chứng LRC dưới hay cơ sở KZ của một lattice cụ thể.", "The separated-points lemma needs lower LRC cases; nearest-plane and E⊂D turn lattice error into one common time. Equality at the error threshold still yields a witness, so a counterexample requires prefix sum >Bᵣ, not merely ≥Bᵣ. The arithmetic table does not create a lower-LRC witness or a KZ basis for a particular lattice.")}</p>
          <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Các trường hợp dưới, cầu nối ellipsoid/hình học, bất đẳng thức hình dạng và đầy đủ terminal của tác giả vẫn mở. Tất cả 23 nghĩa vụ toàn cục ở dưới giữ nguyên; LRC 14/15 chưa thiết lập. Chưa chạy chiến dịch mô hình HIVE mới hoặc đưa kiểm giải tích này vào vòng agent.", "Lower cases, the ellipsoid/geometric bridge, shape inequalities and complete author terminals remain open. All 23 global obligations below stay unchanged; LRC 14/15 is NOT ESTABLISHED. No new HIVE model campaign has run and this analytic audit is not yet integrated into the agent loop.")}</p>
        </section>
      </div>
      <details className="text-meta text-ink-muted mt-4"><summary className="min-h-10 cursor-pointer">{t("Nguồn và dấu vết kiểm prefix/KZ", "Prefix/KZ source and audit provenance")}</summary>
        <p className="mt-2 max-w-[76ch]">{t("Receipt không ký dựa vào collector, interpreter và lưu trữ local tin cậy; không là chứng nhận thực thi bên ngoài, nghiệm thu học thuật hoặc xác nhận tính mới. GET chỉ nghiệm thu báo cáo đã lưu, không phát lại Python.", "Unsigned receipts rely on the trusted local collector, interpreter and storage; they are not external execution attestation, academic acceptance or novelty certification. GET only admits the retained report, without Python replay.")}</p>
        <a href={report.source.url} target="_blank" rel="noreferrer" className={linkClass}>{t("Nguồn v2: §§3.2–3.4", "Source v2: §§3.2–3.4")}</a>
        <dl className="mt-2 grid min-w-0 gap-3 [overflow-wrap:anywhere]">
          <div><dt>{t("Kết quả có phạm vi", "Scoped result")}</dt><dd>{report.status}</dd></div>
          <div><dt>{t("Phân loại toàn cục", "Global classification")}</dt><dd>{report.globalVerdict}</dd></div>
          <div><dt>{t("Thời điểm lưu báo cáo", "Report retention time")}</dt><dd>{report.generatedAt}</dd></div>
          <div><dt>{t("Báo cáo prefix/KZ", "Prefix/KZ report")}</dt><dd className="font-mono">{report.reportDigest}</dd></div>
          <div><dt>Python source</dt><dd className="font-mono">{report.receipt.sourceSha256}</dd></div>
          <div><dt>Python output</dt><dd className="font-mono">{report.receipt.stdoutSha256}</dd></div>
          <div><dt>{t("Thời gian phát lại quan sát", "Observed replay duration")}</dt><dd>{report.receipt.elapsedMs} ms</dd></div>
        </dl>
      </details>
    </>}
  </section>;
}
