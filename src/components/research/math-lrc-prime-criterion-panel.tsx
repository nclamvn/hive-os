import { MathText } from "@/components/research/math-text";
import { validateRetainedPrimeCriterionReport } from "@/modules/research-sandbox/math-lrc-prime-criterion";

/** Pure retained projection, not a model campaign or whole author-archive replay. */
export function MathLrcPrimeCriterionPanel({ raw, locale }: { raw: unknown; locale: string }) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const report = validateRetainedPrimeCriterionReport(raw);
  const linkClass = "inline-flex min-h-10 max-w-full items-center break-words text-meta text-ink-muted underline hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return <section id="allikvere-prime-criterion" aria-labelledby="allikvere-prime-criterion-title" className="border-line mt-6 min-w-0 scroll-mt-24 border-t pt-5">
    <h3 id="allikvere-prime-criterion-title" className="text-section-title text-ink-strong">{t("LRC dưới và tiêu chuẩn prime: nguồn, kiểm chứng, điều kiện", "Lower LRC and prime criterion: sources, checks and premises")}</h3>
    <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Định vị chính xác tiền đề trong bản tiền ấn phẩm, rà soát cầu nối phổ quát rồi kiểm các đối chứng có miền đầy đủ riêng. Đọc một chứng minh nguồn và kiểm một miền nhỏ không đồng nghĩa đã tái lập toàn bộ kết quả của tác giả.", "Locate the preprint premise precisely, review the universal bridge, then check controls with their own complete domains. Reading a source proof and checking a small domain does not reproduce the author's entire result.")}</p>
    {!report ? <div role="alert" className="bg-surface-subtle mt-4 rounded-md p-4">
      <p className="text-body text-ink">{t("Báo cáo tiền đề/prime chưa có hoặc không hợp lệ", "Lower-premise/prime report unavailable or invalid")}</p>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Không hiện số đếm, chứng cứ hay kết luận chưa nghiệm thu. LRC 14/15 vẫn chưa thiết lập; GET không tạo chứng chỉ, phát lại Python, truy nguồn ngoài hoặc gọi mô hình.", "Unadmitted counts, evidence and conclusions are not displayed. LRC 14/15 remains NOT ESTABLISHED; GET does not generate certificates, replay Python, fetch external sources or call a model.")}</p>
    </div> : <>
      <div className="mt-4 space-y-5">
        <section aria-labelledby="allikvere-lower-sources">
          <h4 id="allikvere-lower-sources" className="text-body text-ink-strong font-medium">{t("Tiền đề dưới: nguồn đã định vị, chưa tái lập độc lập", "Lower premise: source located, not independently reproduced")}</h4>
          <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Bản v2 của Sungkawichai–Trakulthongchai, Theorem 1.3, phát biểu mọi k≤12 vận tốc chuyển động, tức tối đa 13 người chạy. Không suy ra miền nhỏ hơn chỉ bằng xóa một tọa độ khỏi phát biểu k=12. Nguồn được rà soát, không có receipt phát lại chứng minh hay kho tác giả tại đây.", "Sungkawichai–Trakulthongchai v2, Theorem 1.3, states every k≤12 moving speeds, hence at most 13 runners. Smaller cases are not inferred merely by deleting a coordinate from the k=12 statement. The source is reviewed; no proof or author-archive replay receipt is established here.")}</p>
          <details className="text-meta text-ink-muted mt-3"><summary className="min-h-10 cursor-pointer">{t("Phiên bản nguồn và phạm vi phát biểu", "Source revisions and statement scope")}</summary>
            <div className="mt-3 space-y-3">{report.sourceLedger.map((entry) => {
              const source = report.sources.find((item) => item.id === entry.sourceId)!;
              return <article key={entry.sourceId} className="border-line min-w-0 border-l-2 pl-3">
              <h5 className="text-body text-ink font-medium [overflow-wrap:anywhere]">{entry.sourceId}</h5>
              <p className="mt-1 break-words">{t("Định lý", "Theorem")} {entry.theorem} · {source.revisionDate}</p>
              <p className="mt-2 break-words">k = {entry.movingSpeedRange.join("…")}; {t("tổng người chạy", "total runners")} = {entry.totalRunnerRange.join("…")}.</p>
              <p className="mt-2 [overflow-wrap:anywhere]">{entry.status}</p>
              <a href={source.url} target="_blank" rel="noreferrer" className={linkClass}>{t("Đọc nguồn đúng phiên bản", "Read the exact source revision")}</a>
            </article>;})}</div>
            <p className="mt-3 max-w-[76ch]">{t("Thống kê 1.092 tuple còn lại và 91 prime trong §6 là tác giả báo cáo, không là kiểm đếm độc lập của HIVE; các snapshot liên kết chưa được tải và phát lại local. Điều kiện terminal Prop. 4.4 của nguồn dưới cần k+1 và p>k(k+1) là prime lẻ, không tự chuyển sang tổng 14/15 hợp số.", "The §6 counts of 1,092 residual tuples and 91 primes are author-reported, not HIVE's independent counts; linked snapshots have not been retrieved and replayed locally. Lower-source terminal Prop. 4.4 requires k+1 and p>k(k+1) to be odd primes, not an automatic transfer to composite totals 14/15.")}</p>
          </details>
        </section>
        <section aria-labelledby="allikvere-prime-reviewed" className="border-line border-t pt-4">
          <h4 id="allikvere-prime-reviewed" className="text-body text-ink-strong font-medium">{t("Tiêu chuẩn phổ quát: đủ mọi lớp là tiền đề", "Universal criterion: every class is a premise")}</h4>
          <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Xét k≥3, vận tốc dương, nguyên thủy và phân biệt, giả sử LRC dưới cho mọi m<k. Nếu p không chia vận tốc nào và mọi lớp cơ sở đều đạt properness hoặc toàn bộ disjunction của Lemma 2.2(ii), nhân chứng grid chuyển về vận tốc thật; nhánh GCD dùng một thời điểm chung của bài toán ít vận tốc hơn.", "Take k≥3, positive primitive distinct speeds, assuming lower LRC for every m<k. If p divides no speed and every base class attains properness or the full disjunction of Lemma 2.2(ii), a grid witness transfers to the actual speeds; the GCD branch uses one common time from the lower-speed problem.")}</p>
          <MathText className="mt-3 block min-w-0" text={"$t_q=t_0+\\frac qg,\\quad h=\\frac g{\\gcd(g,e)}\\ge2,\\quad \\frac2{k+1}\\le\\frac12$"} />
          <p className="text-body text-ink-muted mt-2 max-w-[76ch]">{t("Các tọa độ chia hết cho g giữ khoảng cách tốt. Quỹ đạo h điểm của ngoại lệ không thể nằm hết trong cung xấu mở; đúng bằng 1/(k+1) vẫn tốt. Với vận tốc nguyên thủy, gcd(g,e)=1. Bổ đề shift tổng quát chỉ cần g không chia ngoại lệ e; điều kiện đơn vị đủ nhưng không bắt buộc cho bổ đề rộng hơn này.", "Coordinates divisible by g retain their good distance. The exception's h-point orbit cannot all lie in the open bad arc; equality at 1/(k+1) is still good. Primitive speeds imply gcd(g,e)=1. The generalized shift lemma only needs g not to divide exception e; a unit is sufficient but not necessary for this broader lemma.")}</p>
          <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("h=1 không áp dụng bổ đề shift, nhưng không làm lá GCD modular bị từ chối: nếu g chia mọi phần dư trong lớp thì không có phản ví dụ nguyên thủy trong lớp đó, nên lớp proper một cách hiển nhiên.", "h=1 is inapplicable to the shift lemma, but does not reject a modular GCD leaf: if g divides every residue in the class, no primitive counterexample occurs there, so that class is vacuously proper.")}</p>
          <details className="text-meta text-ink-muted mt-3"><summary className="min-h-10 cursor-pointer">{t("Từ terminal hữu hạn đến tiêu chuẩn chia hết", "From finite terminals to divisibility criterion")}</summary>
            <p className="mt-2 max-w-[76ch]">{t("Monotonicity chỉ chuyển tới level là bội nguyên. Lift phải phủ đủ cᵏ lớp con; LCM phải gồm các level terminal của mọi lớp cơ sở. Nhánh thứ ba cần mọi tuple nguyên dương phân biệt trong cả lớp, không chỉ mẫu bị chặn hay tuple primitive. Đối xứng cho nhánh này cần chứng minh riêng.", "Monotonicity transfers only to integer-multiple levels. Lifts must cover all cᵏ subclasses; the LCM must include terminal levels for every base class. The third branch requires every positive distinct integer tuple in the entire class, not bounded samples or primitive-only tuples. Its symmetry needs a separate proof.")}</p>
            <p className="mt-2 max-w-[76ch]">{t("Đây là lập luận phổ quát được rà soát dưới các tiền đề đầy đủ, không phải suy diễn phổ quát từ lấy mẫu pha. Chưa có chứng chỉ đầy đủ kho tác giả, nên chưa nghiệm thu kết luận p chia tích vận tốc cho mọi prime yêu cầu.", "This is a universal argument reviewed under complete premises, not a universal inference from phase sampling. No complete author-archive certificate is retained, so p dividing the speed product is not admitted for every required prime.")}</p>
          </details>
        </section>
        <section aria-labelledby="allikvere-prime-controls" className="border-line border-t pt-4">
          <h4 id="allikvere-prime-controls" className="text-body text-ink-strong font-medium">{t("Đối chứng phát lại độc lập: miền nhỏ được ghi rõ", "Independently replayed controls: explicit small domains")}</h4>
          <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{report.shiftAudits.length} {t("phân hoạch pha", "phase partitions")}, {report.shiftCellCount} {t("ô pha đầy đủ trong các miền đối chứng", "complete phase cells in the control domains")}. {t("Mỗi phân hoạch kiểm mọi biên tới hạn và mọi ô mở; không chỉ tin tổng số khai báo.", "Each partition checks every critical boundary and open cell rather than trusting declared totals.")}</p>
          <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Giữ cả phần dư lặp: vận tốc nguyên phân biệt không có nghĩa các phần dư phải phân biệt. Không bỏ lớp khó để làm đẹp số phủ.", "Repeated residues are preserved: distinct integer speeds do not require distinct residues. Difficult classes are not dropped to improve coverage counts.")}</p>
          <div className="mt-3 space-y-3">{report.toyDomains.map((domain) => <article key={domain.prime} className="border-line min-w-0 border-l-2 pl-3">
            <h5 className="text-body text-ink font-medium">k = {domain.movingSpeeds}, p = {domain.prime}, {t("level", "level")} = {domain.level}</h5>
            <p className="text-meta text-ink mt-2 break-words">{domain.bases} {t("lớp cơ sở", "bases")} × {domain.liftsPerBase} {t("lift mỗi lớp", "lifts per base")} = {domain.rows} {t("dòng đầy đủ", "complete rows")}; grid = {domain.gridGood}, GCD = {domain.gcdOnly}, {t("improper", "improper")} = {domain.improper}.</p>
            <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{domain.improper === 0
              ? t("Đầy đủ miền đồ chơi này, không phải mọi lớp của các prime trong chứng minh 14/15.", "Complete for this toy domain, not every class of the primes in the 14/15 proof.")
              : t("Miền đối chứng vẫn INCOMPLETE: các dòng improper không được xóa hoặc nâng thành proper. Chúng không phải phản ví dụ LRC liên tục.", "This control domain remains INCOMPLETE: improper rows are not deleted or promoted to proper. They are not continuous-time LRC counterexamples.")}</p>
            <details className="text-meta text-ink-muted mt-2"><summary className="min-h-10 cursor-pointer">{t("Phạm vi và dòng phát lại", "Scope and replay stream")}</summary>
              <dl className="mt-2 grid min-w-0 gap-2 [overflow-wrap:anywhere]">
                <div><dt>{t("Phân loại có phạm vi", "Scoped classification")}</dt><dd>{domain.coverage}</dd></div>
                <div><dt>{t("Dòng phát lại có thứ tự", "Ordered replay stream")}</dt><dd className="font-mono">{domain.streamSha256}</dd></div>
              </dl>
            </details>
          </article>)}</div>
          <details className="text-meta text-ink-muted mt-3"><summary className="min-h-10 cursor-pointer">{t("Chuyển grid, GCD và đối chứng âm", "Grid transfer, GCD and negative controls")}</summary>
            <ul className="mt-2 space-y-2">{report.transferControls.map((control) => <li key={control.kind} className="min-w-0 [overflow-wrap:anywhere]">
              {control.kind}: {control.rows} {t("lift đã kiểm", "checked lifts")}; <span className="font-mono">{control.streamSha256}</span>
            </li>)}</ul>
            <p className="mt-3 max-w-[76ch]">{t("Grid (1,3,7) ở p=5, level2 chuyển đủ 8 lift level4. GCD (2,4,1) không có grid tốt tại level2 nhưng t₀=1/6 chuyển thành t=2/3, mọi khoảng cách bằng 1/3; không gán cùng thời điểm đó cho mọi lift. k=3, h=2, pha1/4 là biên GOOD; k=2 hoặc h=1 là đối chứng không đủ điều kiện. g=6, e=2 có quỹ đạo h=3 hợp lệ cho bổ đề tổng quát, không phải áp dụng cho vận tốc nguyên thủy.", "Grid (1,3,7) at p=5, level2 transfers through all 8 level4 lifts. GCD (2,4,1) has no good level2 grid but t₀=1/6 shifts to t=2/3, with every distance 1/3; that same time is not assigned to every lift. k=3, h=2, phase1/4 is a GOOD boundary; k=2 or h=1 is an inapplicable control. g=6, e=2 has a valid h=3 orbit for the generalized lemma, not a primitive-speed application.")}</p>
          </details>
        </section>
        <details className="border-line text-meta text-ink-muted border-t pt-3"><summary className="min-h-10 cursor-pointer">{t("Chuẩn hóa đơn vị: chiều chuyển nhân chứng và sửa CRT cục bộ", "Unit reduction: witness direction and localized CRT repair")}</summary>
          <MathText className="mt-3 block min-w-0" text={"$v'\\equiv bv\\pmod M,\\quad \\left\\|\\frac{jv'_i}{M}\\right\\|=\\left\\|\\frac{bjv_i}{M}\\right\\|$"} />
          <p className="mt-2 max-w-[76ch]">{t("Đối chứng M=28, b=5, b⁻¹=17, v=(1,2,4), j=2: chuyển đúng j=10 là tốt; dùng nghịch đảo cho j=6 bị thất bại. Không đổi chiều phép chuyển chỉ vì dùng inverse trong bước chuẩn hóa vận tốc.", "For M=28, b=5, b⁻¹=17, v=(1,2,4), j=2: the correct transfer j=10 is good; using the inverse gives failing j=6. Witness transport does not reverse direction merely because speed normalization uses an inverse.")}</p>
          <p className="mt-2 max-w-[76ch]">{t("CRT b≡a⁻¹ mod p và b≡1 mod level cần gcd(level,p)=1. Đối chứng p=3, level3, a=2 từ chối cấu trúc hạn chế này. Sửa tổng quát level=pᵉm, gcd(m,p)=1, rồi chỉ yêu cầu b≡1 mod m: vẫn là đơn vị modulo level·p và giữ predicate GCD. Đây là sửa cục bộ cách trình bày Prop. 5.1, không phủ định định lý của bài nguồn hay tái chạy nó.", "The restricted CRT b≡a⁻¹ mod p and b≡1 mod level needs gcd(level,p)=1. The control p=3, level3, a=2 rejects that construction. The general repair writes level=pᵉm, gcd(m,p)=1, then only requires b≡1 mod m: it remains a unit modulo level·p and preserves GCD predicates. This is a localized exposition repair to Prop. 5.1, not a refutation or rerun of the source theorem.")}</p>
          <p className="mt-2 max-w-[76ch]">{t("Nhân đơn vị có thể phá tính nguyên thủy của đại diện nguyên. Không dùng chứng chỉ chỉ đúng cho tuple primitive để nghiệm thu cả lớp nguyên của nhánh thứ ba.", "Unit scaling can destroy primitivity of integer representatives. A primitive-only tuple certificate cannot admit the third branch's entire integer class.")}</p>
        </details>
        <section aria-labelledby="allikvere-prime-application" className="border-line border-t pt-4">
          <h4 id="allikvere-prime-application" className="text-body text-ink-strong font-medium">{t("Áp dụng 13 rồi 14 vận tốc: không lập luận vòng", "Apply 13 then 14 speeds: no circular argument")}</h4>
          <div className="mt-3 space-y-3">{report.applications.map((application) => <article key={application.movingSpeeds} className="border-line min-w-0 border-l-2 pl-3">
            <h5 className="text-body text-ink font-medium">{application.movingSpeeds} {t("vận tốc chuyển động", "moving speeds")} · {application.totalRunners} {t("người chạy tổng cộng", "total runners")}</h5>
            <p className="text-meta text-ink-muted mt-2 break-words">{t("LRC dưới tới", "Lower LRC through")} {application.lowerThrough}: {application.lowerStatus}.</p>
            <p className="text-meta text-ink-muted mt-2 [overflow-wrap:anywhere]">{application.primeCriterion}; {t("phủ tác giả", "author coverage")}: {application.authorCoverage}.</p>
          </article>)}</div>
          <p className="text-body text-ink-muted mt-3 max-w-[76ch]">{t("14 vận tốc/15 người cần chứng minh đầy đủ trường hợp 13 vận tốc/14 người trước, không dùng tuyên bố cùng bài báo để tự đóng tiền đề. Tất cả 23 nghĩa vụ áp dụng toàn cục vẫn mở; LRC 14/15 chưa thiết lập. Chưa có chứng minh Lean, nghiệm thu bên ngoài, kho tác giả phát lại đầy đủ hoặc chiến dịch agent HIVE mới.", "14 speeds/15 runners requires establishing the full 13-speed/14-runner case first, not using the same paper's claim to close its own premise. All 23 global application obligations remain open; LRC 14/15 is NOT ESTABLISHED. No Lean proof, external acceptance, complete author-archive replay or new HIVE agent campaign has occurred.")}</p>
          <details className="text-meta text-ink-muted mt-3"><summary className="min-h-10 cursor-pointer">{t("Đối chiếu ký hiệu của phần hình học trước", "Notation aliases in the earlier geometry section")}</summary>
            <MathText className="mt-2 block min-w-0" text={"$S_{\\rm source}=\\sum_i v_i,\\quad G=\\left(\\prod_i v_i\\right)^{1/k},\\quad \\widehat F=\\sqrt{H},\\quad G\\widehat F=S_{\\rm source}F_{\\rm source}$"} />
            <p className="mt-2 max-w-[76ch]">{t("S trong bài nguồn là tổng vận tốc. Phần TIP-054 dùng alias trung bình nhân G và F̂ nhưng gọi chúng là S/Fₙ. Tích và chặn tương đương qua đồng nhất thức trên; đây là làm rõ ký hiệu, không thay đổi chứng cứ hoặc sửa công thức nguồn.", "S in the source is the sum of speeds. TIP-054 used geometric-mean G and F̂ aliases but called them S/Fₙ. Their product and bound are equivalent by the identity above; this clarifies notation without changing evidence or the source formula.")}</p>
          </details>
        </section>
      </div>
      <details className="text-meta text-ink-muted mt-4"><summary className="min-h-10 cursor-pointer">{t("Dấu vết kiểm tiền đề/prime local", "Local lower-premise/prime audit provenance")}</summary>
        <p className="mt-2 max-w-[76ch]">{t("Receipt không ký dựa vào collector, interpreter và lưu trữ local tin cậy, không là chứng nhận thực thi bên ngoài. Chỉ đối chứng mới được phát lại; tham chiếu nguồn và TIP-053/054 không tạo receipt phát lại mới cho các chứng minh đó. GET không gọi validator cũ, Python, nguồn ngoài hoặc mô hình.", "Unsigned receipts rely on the trusted local collector, interpreter and storage, not external execution attestation. Only the new controls are replayed; source and TIP-053/054 references do not create fresh proof-replay receipts. GET invokes no old validator, Python, external source or model.")}</p>
        <dl className="mt-2 grid min-w-0 gap-3 [overflow-wrap:anywhere]">
          <div><dt>{t("Phân loại toàn cục", "Global classification")}</dt><dd>{report.globalVerdict}</dd></div>
          <div><dt>{t("Thời điểm lưu báo cáo", "Report retention time")}</dt><dd>{report.generatedAt}</dd></div>
          <div><dt>{t("Báo cáo tiền đề/prime", "Lower-premise/prime report")}</dt><dd className="font-mono">{report.reportDigest}</dd></div>
          <div><dt>Python source</dt><dd className="font-mono">{report.receipt.sourceSha256}</dd></div>
          <div><dt>Python output</dt><dd className="font-mono">{report.receipt.stdoutSha256}</dd></div>
          <div><dt>{t("Thời gian phát lại quan sát", "Observed replay duration")}</dt><dd>{report.receipt.elapsedMs} ms</dd></div>
        </dl>
      </details>
    </>}
  </section>;
}
