import type { Locale } from "@/i18n/config";
import { MathText } from "@/components/research/math-text";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { projectLrcCampaignPresentation, type LrcCampaignPresentationInput } from "./math-lrc-campaign-presentation";

/** Server-rendered observation only; no polling, action, importer or model. */
export function MathLrcCampaignPanel({record,locale,toolsBase}: {record:LrcCampaignPresentationInput;locale:Locale;toolsBase?:string}) {
  const view = projectLrcCampaignPresentation(record);
  if (!view) return null;
  const vi = locale === "vi";
  const invalid = view.state === "INVALID" || view.reviewState === "INVALID";
  const evidenceLabel = view.state === "ADMITTED" ? vi?"Bằng chứng đã lưu hợp lệ":"Retained evidence valid"
    : view.state === "INVALID" ? vi?"Bằng chứng không hợp lệ":"Invalid evidence" : vi?"Chưa lưu bằng chứng":"Evidence not retained";
  const reviewLabel = view.reviewState === "VALID" ? vi?"Ledger v5 hợp lệ":"Ledger v5 valid"
    : view.reviewState === "INVALID" ? vi?"Ledger không hợp lệ":"Invalid ledger" : vi?"Chưa lưu review":"Review not retained";
  return <Panel id="lrc-campaign-observation" role="region" aria-label={vi?"Quan sát chiến dịch LRC":"LRC campaign observation"}
    className="mt-4 min-w-0 p-4 sm:p-5">
    <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
      <h4 className="text-body text-ink font-semibold">{vi?"Chiến dịch p83 · quan sát đã lưu":"p83 campaign · retained observation"}</h4>
      <div className="flex min-w-0 flex-wrap gap-2"><StatusBadge tone={invalid?"danger":"neutral"}>{evidenceLabel}</StatusBadge>
        <StatusBadge tone={view.reviewState==="INVALID"?"danger":"neutral"}>{reviewLabel}</StatusBadge></div>
    </div>
    <p className="text-meta text-ink-muted mt-2 max-w-3xl break-words">
      {vi?"RETAINED_REFERENCE_NOT_FRESH: tham chiếu lưu sẵn, không phát lại toàn chiến dịch mới. Dữ liệu được kiểm tra khi đọc; không chạy công cụ hoặc AI từ trang này."
        :"RETAINED_REFERENCE_NOT_FRESH: retained reference, not a fresh whole-campaign replay. Record bindings are checked on read; this page starts no tool or AI work."}
    </p>
    {view.state === "ADMITTED" ? <>
      <p className="text-body text-ink mt-3"><MathText text={String.raw`$I(13,83,224)=\varnothing$; $J(13,83)=\varnothing$.`} /></p>
      <p className="text-meta text-ink-muted mt-2 max-w-3xl">
        {vi?"Kết luận hữu hạn đã ghi nhận cho một nguyên tố: 13 vận tốc tương đối khác 0, 14 người; bất đẳng thức xấu nghiêm ngặt, bằng ngưỡng là GOOD, giữ bội số tọa độ. Dựa trên chứng cứ local không ký và cầu nối đã rà soát, không phải chứng minh hình thức."
          :"Recorded finite conclusion for one prime: 13 nonzero relative velocities, 14 runners; strict bad inequality, equality is GOOD, coordinate multiplicity retained. Based on unsigned local evidence and reviewed bridges, not formal proof."}
      </p>
      <p className="text-meta text-ink-muted mt-2 break-words">{vi?"Nhập tham chiếu đã ghi nhận lúc":"Recorded reference import at"} {view.evidence!.admission.importedAt}
        {vi?" · kiểm danh tính 42 tệp, không thực thi lại cây chứng chỉ.":" · identity check of 42 files, no certificate-forest re-execution."}</p>
    </> : <p role={view.state==="INVALID"?"alert":"status"} className={`text-meta mt-3 ${invalid?"text-danger-700":"text-ink-muted"}`}>
      {view.state==="INVALID" ? vi?"Phạm vi, đầu vào, bằng chứng hoặc digest không khớp. Không hiển thị kết quả như đã nghiệm thu. Hồ sơ chỉ được quan sát, không tự chạy lại."
        :"Scope, inputs, evidence or digest does not match. No admitted result is displayed. This record is observation-only and is not retried."
        :vi?"Hồ sơ đã chọn chưa có bằng chứng gắn với attempt hợp lệ. Không suy diễn tiến độ hay token bằng 0. Làm mới trang thủ công để xem dữ liệu đã lưu sau đó."
          :"The selected case has no evidence bound to a valid retained attempt yet. No progress or zero token usage is inferred. Reload manually to view later retained data."}
    </p>}
    {view.reviewState==="INVALID" ? <p role="alert" className="text-meta text-danger-700 mt-3">
      {vi?"Review đã lưu không vượt qua kiểm tra v5. Không hiển thị vai phản biện hoặc kết luận của ledger này như hợp lệ."
        :"The retained review failed v5 validation. Its reviewer roles and conclusions are not shown as valid."}
    </p> : view.reviewState==="VALID" ? <p className="text-meta text-ink mt-3 font-medium">
      {vi?"Kết luận gốc":"Root conclusion"}: {view.ledger!.conclusion} · {view.ledger!.disposition}
    </p> : <p role="status" className="text-meta text-ink-muted mt-3">{reviewLabel}{view.jobStatus?` · ${view.jobStatus}`:""}.
      {vi?" Không yêu cầu review mới từ trang này.":" No new review is requested from this page."}</p>}
    <p className="text-meta text-ink mt-3 max-w-3xl">
      {vi?"OPEN: 60 nguyên tố P13 còn lại; tái lập độc lập các trường hợp thấp; 23 nghĩa vụ APPLICATION; LRC toàn cục cho 14/15 người; nghiệm thu hình thức và học thuật bên ngoài. Không tuyên bố tính mới."
        :"OPEN: the other 60 P13 primes; independent reproduction of lower cases; 23 APPLICATION obligations; global LRC for 14/15 runners; formal and external academic acceptance. No novelty claim."}
    </p>
    {typeof toolsBase === "string" && /^\/w\/[^/?#]+\/research\/math-tools$/.test(toolsBase) ? <p className="text-meta text-ink-muted mt-3 max-w-3xl">
      <a href={`${toolsBase}?view=allikvere-proof-unit#allikvere-proof-unit`}
        className="text-ink inline-flex min-h-10 max-w-full items-center break-words underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
        {vi?"Đọc proof unit mới: cầu nối 14/32 tới 224":"Read the new proof unit: 14/32 to 224 bridge"}
      </a>
      <span className="block">{vi?"Chuẩn bị riêng sau TIP-062; không được dùng trong đầu vào của hồ sơ lịch sử này."
        :"Prepared separately after TIP-062; not used in this historical case's input."}</span>
    </p> : null}
    {view.roles.length ? <section aria-label={vi?"Vai trò và mức sử dụng thực tế":"Roles and actual usage"} className="border-line mt-4 border-t pt-3">
      <h5 className="text-meta text-ink font-semibold">{vi?"Context riêng và token đã ghi nhận":"Separate contexts and recorded token usage"}</h5>
      <p className="text-meta text-ink-muted mt-1">{vi?"Tên mô hình là tham số CLI được yêu cầu; context riêng không có nghĩa là mô hình, tổ chức hay người đánh giá độc lập."
        :"Model names are requested CLI parameters; separate contexts do not imply independent models, institutions or human reviewers."}</p>
      <ol className="mt-3 space-y-3">{view.roles.map(role=><li key={role.role} className="min-w-0">
        <p className="text-meta text-ink break-words font-medium">{role.role} · {role.result} · {vi?"Mô hình yêu cầu":"Requested model"}: {role.requestedModel}</p>
        <p className="text-meta text-ink-muted mt-1 break-all">Context: {role.threadId}</p>
        <dl className="text-meta mt-2 grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-4">
          {([[vi?"Đầu vào":"Input",role.usage.inputTokens],[vi?"Cache đầu vào":"Cached input",role.usage.cachedInputTokens],
            [vi?"Đầu ra":"Output",role.usage.outputTokens],[vi?"Suy luận đầu ra":"Reasoning output",role.usage.reasoningOutputTokens]] as const).map(([label,value])=><div key={label} className="min-w-0">
              <dt className="text-ink-muted break-words">{label}</dt><dd className="text-ink mt-1 break-all">{value.toLocaleString(locale)}</dd>
            </div>)}
        </dl>
        <details className="text-meta mt-2 min-w-0">
          <summary className="text-ink cursor-pointer">{vi?"Nội dung vai trò đã lưu":"Retained role content"}</summary>
          <p className="text-ink-muted mt-2 whitespace-pre-wrap break-words"><MathText text={role.text} /></p>
          {role.gap ? <p className="text-ink-muted mt-2 whitespace-pre-wrap break-words"><MathText text={role.gap} /></p> : null}
        </details>
      </li>)}</ol>
    </section> : null}
    {view.digests ? <details className="border-line text-meta mt-4 min-w-0 border-t pt-3">
      <summary className="text-ink cursor-pointer font-medium">{vi?"Liên kết digest của hồ sơ":"Record digest bindings"}</summary>
      <dl className="mt-3 space-y-2">{Object.entries(view.digests).filter(([,value])=>value).map(([label,value])=><div key={label} className="min-w-0">
        <dt className="text-ink-muted">{label} SHA-256</dt><dd className="text-ink mt-1 break-all">{value}</dd>
      </div>)}</dl>
      <p className="text-ink-muted mt-3">{vi?"Digest kiểm tra liên kết hồ sơ, không xác nhận thực thi mới, chữ ký bên ngoài hoặc nội dung phiên AI."
        :"Digests check record bindings, not fresh execution, external signatures or AI transcript attestation."}</p>
    </details> : null}
  </Panel>;
}
