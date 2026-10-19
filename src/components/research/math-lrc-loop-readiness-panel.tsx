import { Panel, SectionHeader } from "@/components/ui/panel";
import type { LrcLoopReadinessDto } from "@/server/operations/math-lrc-loop-readiness";

const reasons: Record<string, readonly [string, string]> = {
  RETAINED_ADMITTED: ["Hồ sơ method-unit đã lưu vượt qua kiểm liên kết và ledger7 đầy đủ.", "The retained method-unit passed exact bindings and full ledger7 admission."],
  CASE_UNAVAILABLE: ["Lựa chọn không khả dụng trong phạm vi được phép.", "The selection is unavailable in the permitted scope."],
  LEGACY_NOT_ADMISSIBLE: ["Hồ sơ proof-unit cũ không phải bằng chứng method-unit v4/ledger7. Không chuyển đổi lịch sử.", "The legacy proof-unit is not v4/ledger7 method evidence. History is not converted."],
  RETAINED_INCOMPLETE: ["Thiếu đầu ra hoặc phản biện đã lưu; không dựng thêm bằng chứng.", "Retained output or review is incomplete; no evidence is synthesized."],
  INPUT_BINDING_REFUSED: ["Liên kết đầu vào đã lưu không đáp ứng hợp đồng cố định.", "Retained input bindings do not meet the fixed contract."],
  JOB_BINDING_REFUSED: ["Job, outbox hoặc dòng lệnh chính xác chưa vượt qua kiểm liên kết.", "Exact job, outbox or command lineage did not pass binding checks."],
  RESULT_ANCHOR_REFUSED: ["Digest đầu ra job không khớp bằng chứng đã lưu.", "Job result anchors do not match the retained evidence."],
  RETAINED_EVIDENCE_REFUSED: ["Bằng chứng đã lưu không vượt qua admission đầy đủ.", "Retained evidence did not pass full admission."],
  SOURCE_PINS_REFUSED: ["Source pins cố định chưa được xác minh; không nhận tác vụ.", "Fixed source pins could not be verified; no tasks are admitted."],
  INPUT_CAP_REFUSED: ["Lựa chọn vượt giới hạn đầu vào cố định.", "The selection exceeds the fixed input bounds."],
  OPERATIONAL_REFUSED: ["Không thể hoàn tất lượt đọc an toàn. Có thể tải lại thủ công.", "The safe read could not complete. A manual reload may retry the read."],
  COHORT_REFUSED: ["Nhóm hồ sơ không đáp ứng giới hạn admission; không nhận một phần tác vụ.", "The record cohort failed admission bounds; no partial tasks are admitted."],
};

const blockers: Record<string, readonly [string, string]> = {
  NO_SEALED_BATCH: ["Chưa có batch độc lập được niêm phong.", "No independently sealed batch is bound."],
  INDEPENDENT_INFORMATION_NOT_BOUND: ["Chưa có thông tin mới được neo độc lập.", "Independent new information is not bound."],
  INDEPENDENT_RELATIONS_NOT_BOUND: ["Chưa có quan hệ ngữ nghĩa được neo độc lập.", "Independent semantic relations are not bound."],
  ROOT_ASSOCIATIONS_NOT_BOUND: ["Chưa có liên kết được nhận với nghĩa vụ gốc.", "Admitted root-obligation associations are not bound."],
  FRESH_FINITE_REPLAY_NOT_RUN: ["Chưa chạy kiểm lại hữu hạn độc lập mới.", "Fresh independent finite replay has not run."],
  G2_NOT_AUTHORIZED: ["G2 chưa được cho phép; không điều phối thực thi.", "G2 is not authorized; execution cannot be dispatched."],
  NO_ADMITTED_METHOD_RECORD: ["Chưa có hồ sơ method-unit được nhận.", "No method-unit record has been admitted."],
  INPUT_REFUSED: ["Lựa chọn đầu vào bị từ chối an toàn.", "The input selection was safely refused."],
  ACCESS_UNAVAILABLE: ["Không có quyền đọc khả dụng cho lựa chọn này.", "Authorized read access is unavailable for this selection."],
  SOURCE_PINS_REFUSED: reasons.SOURCE_PINS_REFUSED,
  OPERATIONAL_REFUSED: reasons.OPERATIONAL_REFUSED,
};

/** Passive presentation of the authenticated server DTO, never an admission authority. */
export function MathLrcLoopReadinessPanel({ locale, readiness, reloadHref }: {
  locale: string;
  readiness: LrcLoopReadinessDto;
  reloadHref: string;
}) {
  const vi = locale === "vi", language = vi ? 0 : 1;
  const label = (entries: typeof reasons, code: string) => entries[code]?.[language] ??
    (vi ? "Lượt kiểm an toàn chưa được thiết lập." : "The safe check is not established.");
  return <section id="math-lrc-loop-readiness" aria-labelledby="math-lrc-loop-readiness-title" className="min-w-0 scroll-mt-24">
    <Panel className="min-w-0 p-5 sm:p-6">
      <SectionHeader id="math-lrc-loop-readiness-title" title={vi ? "Khả năng tiếp nối từ hồ sơ đã lưu" : "Retained-loop readiness"} />
      <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">
        {vi ? "Quan sát chỉ đọc có xác thực. Đọc job và kiểm hash thụ động không chạy model, checker hay nhận tác vụ thực thi." : "Authenticated read-only observation. Retained job reads and passive hashes run no model or checker and do not consume tasks."}
      </p>
      <dl className="text-meta text-ink-muted mt-4 min-w-0 divide-y divide-line">
        <div className="grid min-w-0 gap-1 py-3 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
          <dt>{vi ? "Phiên và quyền đọc" : "Session and read access"}</dt>
          <dd className="text-ink min-w-0 [overflow-wrap:anywhere]">{readiness.session} / {readiness.status}
            <p className="text-ink-muted mt-1 max-w-[76ch]">{readiness.session === "AUTHORIZED"
              ? vi ? "Quyền research.read được kiểm lại trong phạm vi mission/workspace hiện tại." : "Current mission/workspace research.read authorization is rechecked by the server boundary."
              : vi ? "Không tiết lộ hồ sơ ngoài phạm vi được phép." : "No record outside the permitted scope is disclosed."}</p>
          </dd>
        </div>
        <div className="grid min-w-0 gap-1 py-3 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
          <dt>{vi ? "Job đã lưu đúng phạm vi" : "Scoped retained jobs"}</dt>
          <dd className="text-ink min-w-0 [overflow-wrap:anywhere]">{readiness.cases.length
            ? readiness.cases.map(item => <p key={item.caseId}>{item.retainedJobs}</p>)
            : vi ? "Không khả dụng" : "Unavailable"}
            <p className="text-ink-muted mt-1 max-w-[76ch]">{vi ? "VERIFIED chỉ có sau khi kiểm chính xác solver/review job, outbox, dòng lệnh và digest kết quả. NOT_ADMITTED không tự xác định trạng thái job lịch sử." : "VERIFIED requires exact solver/review jobs, outboxes, command lineage and result anchors. NOT_ADMITTED does not infer a historical job status."}</p>
          </dd>
        </div>
        <div className="grid min-w-0 gap-1 py-3 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
          <dt>{vi ? "Admission bằng chứng" : "Evidence admission"}</dt>
          <dd className="text-ink min-w-0 [overflow-wrap:anywhere]">
            <p>{readiness.admittedCount} {vi ? "hồ sơ method-unit được nhận" : "admitted method-unit records"}</p>
            {readiness.cases.map(item => <div key={item.caseId} className="mt-2 max-w-[76ch]">
              <p>{item.status}</p><p className="text-ink-muted mt-1">{label(reasons, item.reason)}</p>
            </div>)}
            <p className="text-ink-muted mt-2 max-w-[76ch]">{readiness.sources}: {vi ? "hash của 37 nguồn cố định, không phải kiểm thực thi mới hay bao phủ runtime của mã 069/070." : "passive hashes of 37 fixed sources, not fresh execution or runtime coverage of 069/070 code."}</p>
          </dd>
        </div>
        <div className="grid min-w-0 gap-1 py-3 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
          <dt>{vi ? "Kiểm lại và thông tin mới" : "Replay and new information"}</dt>
          <dd className="text-ink min-w-0 [overflow-wrap:anywhere]">
            <p>{vi ? "Kiểm hữu hạn mới" : "Fresh finite replay"}: {readiness.freshFiniteReplay}</p>
            <p className="mt-1">{vi ? "Thông tin độc lập" : "Independent information"}: {readiness.independentInformation}; batch: {readiness.batch}</p>
          </dd>
        </div>
        <div className="grid min-w-0 gap-1 py-3 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
          <dt>{vi ? "Cổng thực thi" : "Execution gate"}</dt>
          <dd className="text-ink min-w-0 [overflow-wrap:anywhere]">{readiness.decision} / {readiness.executionGate}
            <p className="text-ink-muted mt-1">dispatchAllowed: {String(readiness.dispatchAllowed)}; proofClosure: {String(readiness.proofClosure)}</p>
          </dd>
        </div>
      </dl>
      <div className="border-warning-600 mt-3 min-w-0 border-l-2 pl-3">
        <p className="text-meta text-ink max-w-[76ch]">{vi ? "Bước cần tiếp: thiết kế và neo metadata độc lập bền vững, kiểm lại mới, rồi ràng buộc manifest thực nghiệm chính xác trước khi xin G2. Không chạy lại hồ sơ 064." : "Next required: design and bind durable independent metadata, run fresh replay, then bind an exact experiment manifest before requesting G2. Do not retry the 064 record."}</p>
        <ul className="text-meta text-ink-muted mt-2 max-w-[76ch] space-y-1">
          {readiness.blockers.map(code => <li key={code} className="[overflow-wrap:anywhere]">{label(blockers, code)}</li>)}
        </ul>
      </div>
      <details className="border-line text-meta text-ink-muted mt-4 min-w-0 border-t pt-3">
        <summary className="text-ink min-h-10 cursor-pointer py-2 font-medium">{vi ? "Tham chiếu tác vụ đề xuất" : "Proposed task references"} ({readiness.tasks.length})</summary>
        <p className="mt-2 max-w-[76ch]">{vi ? "PROPOSED / UNROUTABLE. Không được xếp hàng, chạy hoặc đóng nghĩa vụ chứng minh." : "PROPOSED / UNROUTABLE. Not queued, executed or proof-obligation closure."}</p>
        {readiness.tasks.length ? <ul className="mt-3 min-w-0 space-y-4">{readiness.tasks.map(task => <li key={task.id} className="border-line min-w-0 border-t pt-3">
          <p className="text-ink [overflow-wrap:anywhere]">{task.findingKind}: {task.findingId} / {task.route}</p>
          <p className="mt-1 [overflow-wrap:anywhere]">{vi ? "Digest tác vụ" : "Task digest"}: {task.id}</p>
          <ul className="mt-2 min-w-0 space-y-3">{task.sources.map(source => <li key={`${source.bindingId}:${source.role}:${source.findingDigest}`} className="min-w-0">
            <dl className="min-w-0 space-y-1">
              <div><dt>{vi ? "Hồ sơ / vai trò / trạng thái" : "Case / role / finding state"}</dt><dd className="text-ink [overflow-wrap:anywhere]">{source.bindingId} / {source.role} / {source.status}</dd></div>
              <div><dt>{vi ? "Lý do đã lưu" : "Retained reason"}</dt><dd className="max-w-[76ch] whitespace-pre-wrap [overflow-wrap:anywhere]">{source.reason}</dd></div>
              <div><dt>Ledger digest</dt><dd className="[overflow-wrap:anywhere]">{source.ledgerDigest}</dd></div>
              <div><dt>Finding digest</dt><dd className="[overflow-wrap:anywhere]">{source.findingDigest}</dd></div>
            </dl>
          </li>)}</ul>
        </li>)}</ul> : <p className="mt-2 max-w-[76ch]">{vi ? "Không có tham chiếu tác vụ được nhận từ lựa chọn này." : "No admitted task references are available from this selection."}</p>}
      </details>
      <p className="text-meta text-ink-muted mt-3 max-w-[76ch] [overflow-wrap:anywhere]">Global LRC: {readiness.globalLrc}; {vi ? "chứng minh hình thức" : "formal proof"}: {readiness.formalProof}; {vi ? "nghiệm thu bên ngoài" : "external acceptance"}: {readiness.externalAcceptance}; {vi ? "tính mới" : "novelty"}: {readiness.novelty}.</p>
      <a href={reloadHref} className="text-meta text-ink mt-2 inline-flex min-h-10 items-center py-2 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2">
        {vi ? "Tải lại lựa chọn hiện tại" : "Reload current selection"}
      </a>
    </Panel>
  </section>;
}
