import { MathText } from "@/components/research/math-text";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { admitLrcProofUnitPacket } from "@/modules/research-sandbox/math-lrc-proof-unit";

// Visual explanations only. The canonical English packet below remains unchanged.
const definitionEquations: Record<string, string> = {
  domain: String.raw`$D_\ell=\left(\mathbb Z/(83\ell)\mathbb Z\setminus\{83a:0\le a<\ell\}\right)^{13}$.`,
  properness: String.raw`$P_\ell(v)\iff\bigl(\exists j:\gcd(\ell,(v_i)_{i\ne j})>1\bigr)\lor\bigl(\exists s\in\mathbb Z:\forall i,\|s v_i/(83\ell)\|\ge1/14\bigr)$.`,
  improper: String.raw`$I(13,83,\ell)=\{v\in D_\ell:\neg P_\ell(v)\}$.`,
  eventual: String.raw`$E(r)\iff\exists\ell\ge1:\forall w\in D_\ell,\ (w\bmod83=r\Rightarrow P_\ell(w))$.`,
  J: String.raw`$J(13,83)=\{r\in D_1:\forall\ell\ge1,\ \exists w\in I(13,83,\ell):w\bmod83=r\}$.`,
  fiber: String.raw`$F_\ell(r)=\{w\in I(13,83,\ell):w\bmod83=r\}$. $w_i=u_i+83m a_i\pmod{83mc},\quad a\in\{0,\ldots,c-1\}^{13}$.`,
  boundary: String.raw`$M=83\ell,\quad d_M(x)=\min(r,M-r),\ r=x\bmod M$. $\mathrm{BAD}\iff14d_M(sv_i)<M;\quad\mathrm{GOOD}\iff14d_M(sv_i)\ge M$.`,
  conventions: String.raw`$v\mapsto(\varepsilon_i v_{\sigma(i)})_{i=1}^{13},\quad\varepsilon_i\in\{-1,1\},\quad\sigma\in S_{13}$.`,
};
const stepEquations: Record<string, string> = {
  GRID_TRANSPORT: String.raw`$L=cm,\quad w_i=v_i+83m a_i,\quad\frac{s w_i}{83m}=\frac{s v_i}{83m}+s a_i,\quad\frac{s}{83m}=\frac{cs}{83L}$.`,
  GCD_TRANSPORT: String.raw`$d>1,\ d\mid m,\ d\mid v_j\ (j\ne i)\ \Longrightarrow\ d\mid L,\ d\mid w_j\ (j\ne i)$.`,
  MONOTONICITY: String.raw`$m\mid L,\quad w\in I(13,83,L)\ \Longrightarrow\ w\bmod83m\in I(13,83,m)$.`,
  SIGN_PERMUTATION: String.raw`$\|-x\|=\|x\|,\quad v\mapsto(\varepsilon_i v_{\sigma(i)})_{i=1}^{13}$.`,
  CRT_UNIT: String.raw`$b\equiv a\pmod{83},\quad b\equiv1\pmod{224},\quad\gcd(b,83\cdot224)=1;\quad t\mapsto b^{-1}t$.`,
  EXACT_FIBER_INDUCTION: String.raw`$F_{2m}(r)=\{w\in I(13,83,2m):w\bmod83m\in F_m(r)\}$.`,
  COMMON_LEVEL: String.raw`\(32\mid224,\quad14\mid224,\quad w_{14}\bmod166=w_{32}\bmod166,\quad I(13,83,224)=\varnothing\).`,
  EVENTUAL: String.raw`$I(13,83,224)=\varnothing\ \Longrightarrow\ (\forall r\in D_1,\ E(r))\ \Longrightarrow\ J(13,83)=\varnothing$.`,
};
const definitionLabels: Record<string, [string, string]> = {
  domain: ["Miền tọa độ có nhãn", "Labelled coordinate domain"], properness: ["Properness: GCD hoặc cùng thời điểm", "Properness: GCD or one common time"],
  improper: ["Tập chưa proper", "Improper set"], eventual: ["Properness về sau: mọi lift", "Eventual properness: every lift"],
  J: ["J: mọi mức còn ít nhất một lift xấu", "J: every level retains at least one improper lift"], fiber: ["Fiber đầy đủ, không lấy mẫu", "Complete fiber, not a sample"],
  boundary: ["Biên nghiêm ngặt: bằng ngưỡng là GOOD", "Strict boundary: equality is GOOD"], conventions: ["Dấu, hoán vị và tọa độ lặp", "Signs, permutations and repetitions"],
  globalPremises: ["Giả thiết riêng cho ứng dụng toàn cục", "Separate global-application premises"],
};

/** Fixed packet presentation only: no checker, audit callback or campaign dispatch. */
export function MathLrcProofUnitPanel({ raw, locale }: { raw: unknown; locale: string }) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const packet = (() => { try { return admitLrcProofUnitPacket(raw); } catch { return null; } })();
  const disclosureClass = "border-line mt-5 min-w-0 border-t pt-4";
  const summaryClass = "text-body text-ink min-h-10 cursor-pointer break-words font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  if (!packet) return <Panel id="allikvere-proof-unit" role="alert" className="min-w-0 p-5 sm:p-6">
    <h2 className="text-section-title text-ink-strong">{t("Proof unit chưa có hoặc không hợp lệ", "Proof unit unavailable or invalid")}</h2>
    <p className="text-body text-ink-muted mt-3 max-w-[76ch]">{t("Không hiển thị lập luận từ packet không khớp. Chưa chạy checker hay review; hồ sơ TIP-062 không bị sửa và mọi nghĩa vụ toàn cục vẫn OPEN.",
      "No argument from a mismatched packet is displayed. No checker or review was dispatched; the TIP-062 record is unchanged and all global obligations remain OPEN.")}</p>
  </Panel>;
  return <Panel id="allikvere-proof-unit" role="region" aria-labelledby="lrc-proof-unit-title" className="min-w-0 scroll-mt-24 p-5 sm:p-6">
    <header className="max-w-[76ch]">
      <h2 id="lrc-proof-unit-title" className="text-section-title text-ink-strong">{t("Proof unit · cầu nối mức chung p83", "Proof unit · p83 common-level bridge")}</h2>
      <p className="text-body text-ink-muted mt-3">{t("Đơn vị lập luận có điều kiện mới, không phải một lượt giải hay kết quả toàn cục. Chấp nhận đúng nội dung packet chỉ xác nhận đầu vào đủ cấu trúc để phản biện; không xác nhận định lý đúng.",
        "A new conditional argument unit, not an executed solving run or global result. Exact packet admission establishes a structured input for criticism, not theorem truth.")}</p>
    </header>
    <p className="text-meta text-ink mt-4 break-words font-semibold">NOT_USED_IN_HISTORICAL_062_CASE</p>
    <p className="text-meta text-ink-muted mt-1 max-w-[76ch]">{t("Được chuẩn bị riêng sau phiên TIP-062. Không thêm ngược vào prompt, attempt hoặc ledger v5 của hồ sơ đã lưu.",
      "Prepared separately after TIP-062. Not retroactively added to the retained case's prompt, attempt or ledger v5.")}</p>
    <div className="mt-4 flex min-w-0 flex-wrap gap-2">
      <StatusBadge tone="neutral">PROOF_UNIT_AUDIT v1</StatusBadge>
      <StatusBadge tone="neutral">{t("Checker trên GET", "GET checker")}: NOT_RUN_ON_GET</StatusBadge>
      <StatusBadge tone="neutral">{t("Review mới", "New role audit")}: UNEXECUTED</StatusBadge>
    </div>
    <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Trang này chỉ đọc packet cố định; không chuẩn bị đầu vào cho agent, không gọi callback, chạy số học, đọc tệp chứng chỉ hay gọi mô hình. Không suy diễn trạng thái của checker chạy riêng hoặc bịa báo cáo, context, token.",
      "This page reads the fixed packet only: no agent preparation, callback, arithmetic checker, certificate-file read or model call. It infers no separately executed checker status and invents no report, context or tokens.")}</p>
    <section aria-labelledby="lrc-proof-unit-claim" className="border-line mt-5 min-w-0 border-y py-4">
      <h3 id="lrc-proof-unit-claim" className="text-body text-ink font-medium">{t("Đích có điều kiện, không phải nghiệm thu mới", "Conditional target, not new acceptance")}</h3>
      <MathText className="mt-3 block" text={String.raw`$\operatorname{lcm}(14,32)=224,\quad I(13,83,224)=\varnothing\ \Longrightarrow\ J(13,83)=\varnothing$.`} />
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("13 vận tốc tương đối khác 0, 14 người chạy; chỉ p83. Suy luận phụ thuộc toàn bộ các tiền đề được nêu bên dưới. Các tầng chứng chỉ trước đó là tham chiếu local không ký, NOT_FRESH; không phát lại tại đây.",
        "13 nonzero relative velocities, 14 runners; p83 only. The inference depends on every named premise below. Earlier certificate stages are unsigned local NOT_FRESH references, not replayed here.")}</p>
      <p className="text-body text-ink mt-3 max-w-[76ch] break-words whitespace-pre-wrap">{packet.scope.statement}</p>
    </section>
    <p className="text-meta text-ink-muted mt-4 max-w-[76ch]">{t("Định nghĩa và chứng minh bên dưới là nguyên văn packet tiếng Anh đã đóng digest. Các tiêu đề tiếng Việt là chú giải giao diện, không thay thế nội dung chuẩn.",
      "Definitions and proof below are the original digest-bound English packet. Interface headings are explanations, not replacements for the canonical content.")}</p>
    <details open className={disclosureClass}>
      <summary className={summaryClass}>{t("Định nghĩa, miền và lượng từ", "Definitions, domain and quantifiers")}</summary>
      <dl className="mt-3 space-y-4 max-w-[76ch]">{Object.entries(packet.definitions).map(([name, text]) => <div key={name} className="min-w-0">
        <dt className="text-meta text-ink font-medium break-words">{definitionLabels[name] ? t(...definitionLabels[name]) : name} · {name}</dt>
        {definitionEquations[name] ? <dd className="text-body text-ink mt-2"><MathText text={definitionEquations[name]} /></dd> : null}
        <dd className="text-body text-ink-muted mt-1 break-words whitespace-pre-wrap">{text}</dd>
      </div>)}</dl>
      <p className="text-meta text-ink-muted mt-3 max-w-[76ch]">{t("Các công thức hiển thị là chú giải toán học; đoạn tiếng Anh giữ nguyên là nội dung chuẩn được chấp nhận. Ký hiệu khoảng cách dùng", "Displayed equations are mathematical explanations; unchanged English prose is the admitted canonical content. Distance notation uses")}
        {" "}<MathText text={String.raw`$\|x\|=\min_{n\in\mathbb Z}|x-n|$.`} /></p>
    </details>
    <details className={disclosureClass}>
      <summary className={summaryClass}>{t("Tiền đề được gọi tên", "Named premises")}</summary>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Nhãn tiền đề cho biết loại chứng cứ, không có nghĩa vừa được kiểm lại hay đã chứng minh độc lập.",
        "Premise labels identify evidence type; they do not mean fresh checking or independent proof.")}</p>
      <ol className="mt-3 space-y-4 max-w-[76ch]">{packet.premises.map(premise => <li key={premise.id} className="min-w-0">
        <p className="text-meta text-ink break-words font-medium">{premise.id} · {premise.status}</p>
        <p className="text-body text-ink-muted mt-1 break-words whitespace-pre-wrap">{premise.statement}</p>
        <p className="text-meta text-ink-muted mt-1 break-words">{t("Tham chiếu", "References")}: {premise.references.join(", ")}</p>
      </li>)}</ol>
    </details>
    <details className={disclosureClass}>
      <summary className={summaryClass}>{t("Chứng minh viết và phụ thuộc từng bước", "Written proof and step dependencies")}</summary>
      <ol className="mt-3 space-y-5 max-w-[76ch]">{packet.steps.map(step => <li key={step.id} className="border-line min-w-0 border-l pl-3">
        <h3 className="text-meta text-ink break-words font-semibold">{step.id} · {step.kind}</h3>
        <p className="text-body text-ink mt-2 break-words whitespace-pre-wrap">{step.statement}</p>
        {stepEquations[step.id] ? <p className="text-body text-ink mt-2"><MathText text={stepEquations[step.id]} /></p> : null}
        <p className="text-body text-ink-muted mt-2 break-words whitespace-pre-wrap">{step.proof}</p>
        <p className="text-meta text-ink-muted mt-2 break-words">{t("Phụ thuộc được khai báo", "Declared dependencies")}: {step.premises.join(", ")}</p>
      </li>)}</ol>
    </details>
    <details open className={disclosureClass}>
      <summary className={summaryClass}>{t("Nợ kiểm chứng và giới hạn còn OPEN", "OPEN verification debts and limitations")}</summary>
      <ul className="text-body text-ink-muted mt-3 space-y-3 max-w-[76ch]">{packet.debts.map(debt => <li key={debt} className="min-w-0 break-words whitespace-pre-wrap">{debt}</li>)}</ul>
      <p className="text-meta text-ink mt-4 max-w-[76ch]">{t("Chưa đóng 60 prime P13 còn lại, 23 nghĩa vụ APPLICATION, tái lập độc lập các trường hợp thấp, LRC toàn cục 14/15, nghiệm thu hình thức/học thuật hoặc tính mới. Chuyển sang 15 người chạy cần chứng minh lại các giả thiết đổi chiều, không chỉ thay số trong packet.",
        "The other 60 P13 primes, 23 APPLICATION obligations, independent lower-case reproduction, global14/15 LRC, formal/external acceptance and novelty remain open. Reuse for 15 runners needs proof of changed dimensional premises, not numerical substitution.")}</p>
    </details>
    <details className={disclosureClass}>
      <summary className={summaryClass}>{t("Nguồn, danh tính packet và ràng buộc lịch sử", "Sources, packet identity and historical bindings")}</summary>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Cầu nối 224 là suy dẫn local, không phải câu trích nguyên văn của bản arXiv hiện tại. Nguồn hiện tại có 61 prime; không trộn với bản lưu trữ 111 prime. Digest không thay thế chứng minh hay xác nhận bên ngoài.",
        "The 224 bridge is a local derivation, not a quotation from the current arXiv version. Its 61-prime statement is not the archived111-prime version. Digests do not replace proof or external attestation.")}</p>
      <dl className="text-meta mt-3 space-y-3">
        <div className="min-w-0"><dt className="text-ink-muted">{packet.unitId} · packet SHA-256</dt><dd className="text-ink mt-1 break-all">{packet.packetDigest}</dd></div>
        {packet.references.map(reference => <div key={reference.id} className="border-line min-w-0 border-t pt-3">
          <dt className="text-ink break-words font-medium">{reference.id} · {reference.kind}</dt>
          <dd className="text-ink-muted mt-1 break-all">{reference.location}</dd>
          <dd className="text-ink mt-1 break-all">SHA-256: {reference.sha256}</dd>
          <dd className="text-ink-muted mt-1 break-words whitespace-pre-wrap">{reference.note}</dd>
        </div>)}
      </dl>
      <pre className="text-meta text-ink-muted mt-4 min-w-0 whitespace-pre-wrap break-all">{JSON.stringify(packet.campaignBinding, null, 2)}</pre>
      <p className="text-meta text-ink-muted mt-3 max-w-[76ch] whitespace-pre-wrap">{packet.limitations.statement}</p>
    </details>
  </Panel>;
}
