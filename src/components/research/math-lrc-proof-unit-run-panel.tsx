import type { Locale } from "@/i18n/config";
import { MathText } from "@/components/research/math-text";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { projectLrcProofUnitRunPresentation, type LrcProofUnitRunPresentationInput } from "./math-lrc-proof-unit-run-presentation";

/** Prospective retained run only, not the immutable063 authoring snapshot or historical062 run. */
export function MathLrcProofUnitRunPanel({ record, locale, toolsBase }: { record: LrcProofUnitRunPresentationInput; locale: Locale; toolsBase?: string }) {
  const view = projectLrcProofUnitRunPresentation(record);
  if (!view) return null;
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const summaryClass = "text-meta text-ink min-h-10 cursor-pointer break-words font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return <Panel id="lrc-proof-unit-run" role="region" aria-label={t("Quan sát lượt audit proof-unit đã lưu", "Retained proof-unit audit observation")}
    className="mt-4 min-w-0 p-4 sm:p-5">
    <header className="max-w-[76ch]">
      <h4 className="text-body text-ink font-semibold">{t("Audit proof-unit p83", "p83 proof-unit audit")}</h4>
      <p className="text-meta text-ink-muted mt-2">{t("Bản ghi của lượt chạy mới, tách biệt hồ sơ TIP-062. Kiểm tra liên kết đầu vào khi đọc không xác nhận chứng minh toán học đúng.",
        "A prospective retained run, separate from TIP-062. Read-time input binding checks do not establish mathematical truth.")}</p>
      <p className="text-meta text-ink-muted mt-2">{t("Packet TIP-063 giữ nguyên UNEXECUTED tại thời điểm chuẩn bị. Việc dùng packet của lượt này chỉ được hiển thị từ envelope/input đã lưu hợp lệ, không cập nhật ngược snapshot.",
        "The TIP-063 packet keeps its publication-time UNEXECUTED snapshot. This run's packet consumption is shown only from valid retained envelope/input bindings, not by editing that snapshot.")}</p>
    </header>
    <div className="mt-3 flex min-w-0 flex-wrap gap-2">
      <StatusBadge tone={view.state === "INVALID" ? "danger" : "neutral"}>{t("Đầu vào", "Input bindings")}: {view.state}</StatusBadge>
      <StatusBadge tone={view.reviewState === "INVALID" ? "danger" : "neutral"}>Ledger6: {view.reviewState}</StatusBadge>
    </div>
    <dl className="text-meta mt-3 space-y-2">
      <div className="min-w-0"><dt className="text-ink-muted">Case / run</dt><dd className="text-ink mt-1 break-all">{view.caseId} / {view.runId}</dd></div>
      <div className="min-w-0"><dt className="text-ink-muted">{t("Trạng thái vận hành đã lưu", "Retained operational status")}</dt><dd className="text-ink mt-1 break-words">
        {t("Run", "Run")}: {view.runStatus ?? t("chưa có", "unavailable")} · {t("Job review", "Review job")}: {view.jobStatus ?? t("chưa có", "unavailable")}</dd></div>
    </dl>
    <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("SUCCEEDED chỉ là trạng thái job, không thay thế ledger hợp lệ hay nghiệm thu của con người. Không gọi mô hình, nhập chứng cứ, checker, chuẩn bị audit, ghi hồ sơ hoặc polling từ trang này.",
      "SUCCEEDED is a job state, not a substitute for a valid ledger or human acceptance. This page starts no model, evidence import, checker, audit preparation, record write or polling.")}</p>
    {view.state === "ADMITTED" ? <>
      <p className="text-body text-ink mt-4 max-w-[76ch]">{t("Đích có điều kiện đã dùng trong đầu vào", "Conditional target in the retained input")}</p>
      <MathText className="mt-2 block" text={String.raw`\(\operatorname{lcm}(14,32)=224,\quad I(13,83,224)=\varnothing\ \Longrightarrow\ J(13,83)=\varnothing\).`} />
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Chỉ p83, 13 vận tốc / 14 người. RETAINED_IDENTITY_ONLY_NOT_FRESH: đối chiếu danh tính 42 tệp, 53.211.840 byte; không phát lại cây chứng chỉ. Tham chiếu local không ký, không phải chứng minh hình thức hay xác nhận bên ngoài.",
        "p83 only, 13 moving speeds / 14 runners. RETAINED_IDENTITY_ONLY_NOT_FRESH: identity check of 42 files and 53,211,840 bytes, not a certificate-forest replay. Unsigned local references, not formal proof or external attestation.")}</p>
      <p className="text-meta text-ink-muted mt-2">{t("Thời điểm đối chiếu được lưu", "Retained identity-check time")}: {view.evidence!.identityAdmission.checkedAt}</p>
    </> : <p role={view.state === "INVALID" ? "alert" : "status"} className="text-meta text-ink mt-4 max-w-[76ch]">
      {view.state === "INVALID" ? t("Đầu vào, packet, digest hoặc liên kết case/run không khớp. Không hiển thị vai trò hay kết luận như đã được chấp nhận; không tự chạy lại.",
        "Input, packet, digest or case/run binding does not match. No role or conclusion is displayed as admitted; no automatic retry.")
        : t("Chưa có attempt hợp lệ gắn với đầu vào được lưu. Không suy diễn packet đã được mô hình dùng, tiến độ hoàn tất hoặc token bằng 0.",
          "No valid attempt is bound to retained input yet. Packet consumption, completion or zero token usage is not inferred.")}</p>}
    {view.reviewState === "VALID" ? <p className="text-body text-ink mt-3 max-w-[76ch]">
      {t("Kết luận gốc", "Root conclusion")}: {view.ledger!.conclusion} · {view.ledger!.disposition}; {t("Audit có điều kiện", "Conditional audit")}: {view.ledger!.proofUnitAuditStatus}
    </p> : <p role={view.reviewState === "INVALID" ? "alert" : "status"} className="text-meta text-ink-muted mt-3 max-w-[76ch]">
      {view.reviewState === "INVALID" ? t("Review không vượt qua kiểm tra ledger6. Không hiển thị các vai phản biện và mức sử dụng của bản ghi đó như hợp lệ.",
        "Review failed ledger6 binding checks. Its reviewer roles and usage are not shown as valid.")
        : t("Chưa có review hợp lệ được lưu. Không bịa phản biện hoặc yêu cầu lượt review mới.", "No valid review is retained. No reviewer feedback is fabricated or requested.")}</p>}
    {view.ledger && !view.ledger.oracle.groundedQuotes ? <p role="status" className="text-meta text-ink mt-3 max-w-[76ch]">{t("Có trích dẫn không khớp nguyên văn lập luận SOLVER. Không xem các trích dẫn đó là phản biện có căn cứ; ledger giữ kết luận INCONCLUSIVE.",
      "Some quotes do not match the original SOLVER argument. Do not treat those quotes as grounded criticism; the ledger retains an INCONCLUSIVE conclusion.")}</p> : null}
    {view.roles.length ? <section aria-label={t("Vai trò và đầu vào thực được lưu", "Retained roles and actual inputs")} className="border-line mt-4 border-t pt-3">
      <p className="text-meta text-ink-muted max-w-[76ch]">{t("Tên mô hình là tham số CLI yêu cầu. Các context riêng không chứng minh độc lập mô hình, tổ chức hoặc phản biện học thuật; token chỉ được lấy từ dữ liệu đã ghi nhận.",
        "Model names are requested CLI parameters. Separate contexts do not establish independent models, institutions or academic review; token values come only from retained accounting.")}</p>
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{t("Token cache là phần của token đầu vào; token suy luận là phần của token đầu ra. Không cộng bốn chỉ số thành tổng token.",
        "Cached tokens are a subset of input tokens; reasoning tokens are a subset of output tokens. Do not add all four figures into a token total.")}</p>
      <ol className="mt-3 space-y-4">{view.roles.map(role => <li key={role.role} className="border-line min-w-0 border-t pt-3">
        <h5 className="text-body text-ink break-words font-semibold">{role.role} · {role.result} · {role.feedback.auditStatus}</h5>
        <p className="text-meta text-ink-muted mt-1 break-words">{t("Mô hình yêu cầu", "Requested model")}: {role.requestedModel}</p>
        <p className="text-meta text-ink-muted mt-1 break-all">Context: {role.threadId}</p>
        <dl className="text-meta mt-2 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4">{([
          [t("Đầu vào", "Input"), role.usage.inputTokens], [t("Cache đầu vào", "Cached input"), role.usage.cachedInputTokens],
          [t("Đầu ra", "Output"), role.usage.outputTokens], [t("Suy luận đầu ra", "Reasoning output"), role.usage.reasoningOutputTokens],
        ] as const).map(([label, count]) => <div key={label} className="min-w-0"><dt className="text-ink-muted break-words">{label}</dt><dd className="text-ink mt-1 break-all">{count.toLocaleString(locale)}</dd></div>)}</dl>
        <p className="text-body text-ink mt-3 max-w-[76ch] whitespace-pre-wrap break-words">{role.feedback.summary}</p>
        <details className="mt-2 min-w-0"><summary className={summaryClass}>{t("Phản hồi nguyên văn và từng tiền đề/bước", "Original feedback and every premise/step")}</summary>
          <p className="text-body text-ink-muted mt-2 max-w-[76ch] whitespace-pre-wrap break-words">{role.text}</p>
          {role.quote ? <blockquote className="border-line text-meta text-ink-muted mt-2 max-w-[76ch] border-l pl-3 whitespace-pre-wrap break-words">{role.quote}</blockquote> : null}
          {role.quoteMatches === false ? <p className="text-meta text-ink mt-2 max-w-[76ch]">{t("Trích dẫn của vai này không khớp nguyên văn SOLVER; chỉ là phản hồi được lưu, không phải phản biện có căn cứ.",
            "This role's quote does not match SOLVER verbatim; it is retained feedback, not grounded criticism.")}</p> : null}
          {role.gap ? <p className="text-meta text-ink-muted mt-2 max-w-[76ch] whitespace-pre-wrap break-words">{role.gap}</p> : null}
          <p className="text-meta text-ink-muted mt-3 max-w-[76ch]">{t("Các phép kiểm do mô hình tự nêu, không phải kiểm chứng độc lập", "Model-stated checks, not independent verification")}</p>
          <ul className="text-meta text-ink-muted mt-2 max-w-[76ch] space-y-2">{role.checks.map((check, index) => <li key={index} className="whitespace-pre-wrap break-words">{check}</li>)}</ul>
          <dl className="text-meta mt-3 max-w-[76ch] space-y-3">{[...role.feedback.premiseFindings, ...role.feedback.stepFindings].map(finding => <div key={finding.id} className="min-w-0">
            <dt className="text-ink break-words font-medium">{finding.id} · {finding.status}</dt><dd className="text-ink-muted mt-1 whitespace-pre-wrap break-words">{finding.reason}</dd>
          </div>)}</dl>
        </details>
        <details className="mt-2 min-w-0"><summary className={summaryClass}>{t("Liên kết đầu vào và stdin/schema đã lưu", "Input bindings and retained stdin/schema")}</summary>
          <dl className="text-meta mt-3 space-y-2">{Object.entries({ role: role.input.role, transport: role.input.transport,
            rendererVersion: role.input.rendererVersion, caseId: role.input.caseId, runId: role.input.runId,
            inputDigest: role.input.inputDigest, promptDigest: role.input.promptDigest, promptBytes: role.input.promptBytes,
            outputSchemaDigest: role.input.outputSchemaDigest, packetDigest: role.input.packetDigest,
            sourceDataDigest: role.input.sourceDataDigest, solverAttemptDigest: role.input.solverAttemptDigest,
          }).filter(([, value]) => value !== undefined).map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-ink-muted">{label}</dt><dd className="text-ink mt-1 break-all">{value}</dd></div>)}</dl>
          <details className="mt-3 min-w-0"><summary className={summaryClass}>{t("Toàn bộ stdin và output schema đã niêm phong", "Full sealed stdin and output schema")}</summary>
            <pre className="text-meta text-ink-muted mt-2 min-w-0 whitespace-pre-wrap break-all">{role.input.stdin}</pre>
            <pre className="text-meta text-ink-muted mt-3 min-w-0 whitespace-pre-wrap break-all">{role.input.schemaText}</pre>
          </details>
        </details>
      </li>)}</ol>
    </section> : null}
    <section aria-label={t("Giới hạn chưa đóng", "Unclosed obligations")} className="border-line mt-4 border-t pt-3">
      <p className="text-meta text-ink max-w-[76ch]">{t("OPEN: 60 prime P13 còn lại, 23 nghĩa vụ APPLICATION, tái lập độc lập trường hợp thấp, LRC toàn cục 14/15, chứng minh hình thức, nghiệm thu học thuật, tính mới và chuyển chiều sang 15 người. Đồng thuận có điều kiện không đóng các nợ này.",
        "OPEN: the other 60 P13 primes, 23 APPLICATION obligations, independent lower-case reproduction, global 14/15 LRC, formal proof, academic acceptance, novelty and 15-runner transfer. Conditional agreement does not close these debts.")}</p>
      {view.evidence ? <ul className="text-meta text-ink-muted mt-3 max-w-[76ch] space-y-2">{view.evidence.packet.debts.map(debt => <li key={debt} className="whitespace-pre-wrap break-words">{debt}</li>)}</ul> : null}
    </section>
    {view.digests ? <details className="border-line mt-4 min-w-0 border-t pt-3"><summary className={summaryClass}>{t("Digest của hồ sơ và tổng hợp audit", "Record digests and audit summary")}</summary>
      <dl className="text-meta mt-3 space-y-2">{Object.entries(view.digests).filter(([, value]) => value).map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-ink-muted">{label} SHA-256</dt><dd className="text-ink mt-1 break-all">{value}</dd></div>)}</dl>
      {view.ledger ? <pre className="text-meta text-ink-muted mt-3 min-w-0 whitespace-pre-wrap break-all">{JSON.stringify(view.ledger.proofUnitAuditSummary, null, 2)}</pre> : null}
      <p className="text-meta text-ink-muted mt-3 max-w-[76ch]">{t("Digest xác nhận liên kết dưới mã host/lưu trữ được tin cậy, không xác thực transcript bên ngoài hay tính đúng toán học.",
        "Digests establish bindings under trusted host code/storage, not external transcript authenticity or mathematical truth.")}</p>
    </details> : null}
    {typeof toolsBase === "string" && /^\/w\/[^/?#]+\/research\/math-tools$/.test(toolsBase) ? <a
      href={`${toolsBase}?view=allikvere-proof-unit#allikvere-proof-unit`} className="text-meta text-ink mt-3 inline-flex min-h-10 max-w-full items-center break-words underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
      {t("Đọc packet chuẩn bị TIP-063 nguyên trạng", "Read the unchanged TIP-063 authoring packet")}</a> : null}
  </Panel>;
}
