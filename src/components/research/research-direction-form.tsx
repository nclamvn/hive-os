"use client";

import { useActionState, useState } from "react";
import { requestResearchStepAction } from "@/app/actions/research-sandbox";
import { simulateDirectedResearchAction } from "@/app/actions/lean-research";
import type { DirectedSimulationObservation, DirectedSimulationStep } from "@/modules/research-sandbox/directed-research";
import { Button } from "@/components/ui/button";
import { MathText } from "./math-text";
import { researchSteeringBrief, type ResearchStepActionState, type PreparedResearchSteering } from "@/modules/research-sandbox/research-steering";

const field = "text-body text-ink border-line mt-2 min-h-11 w-full rounded-md border bg-surface px-3 py-2 outline-none focus:border-line-strong";
type Parent = { id: string; missionId: string; documentId: string | null; question: string; status: string;
  findings: number; sources: number; createdAt: string; scope: string; sourcePolicy: unknown;
  snapshot: PreparedResearchSteering["prior"] };

const replayLabels: Record<"en" | "vi", Record<string, string>> = {
  en: {
    FORK: "Ready to choose the next direction", STOPPED: "This bounded replay has stopped",
    CONTINUE: "Continue within the same goal and budget", WAIT_FOR_HUMAN: "Waiting for your direction or continuation", STOP: "Stop and review before a new task",
    CANDIDATE_REJECTED: "The proposed candidate failed the exact check", EXACT_PREDICATE_REFUTED: "The selected exact claim was refuted",
    EXACT_SCOPE_CHECKED: "The candidate passed its limited exact check", UNVERIFIED: "The claim remains unverified",
    DECLARED_REFUTED: "The model proposes retiring this approach; not an independently established refutation",
    NO_PROGRESS: "No new candidate or evidence", INVALID_OUTPUT: "The response could not be adopted",
    CUMULATIVE_BUDGET: "The total execution budget was reached", NO_PROGRESS_OR_DECLARED_REFUTED_REUSE: "A failed candidate or retired approach was repeated without new evidence",
    INVALID_STRATEGY_OUTPUT: "The response did not provide a usable direction", EXECUTION_BOUNDARY: "A time, output or host-check limit stopped execution",
    RETENTION_OR_EXECUTION_FAILURE: "The result could not be safely retained or executed; no further step will run",
    EXACT_PREDICATE_REFUTED_REQUIRES_ROUTING: "The selected exact claim failed; choose a new research task before continuing",
    EXACT_SCOPE_ONLY_REQUIRES_ROUTING: "The limited exact check is complete; a broader conclusion needs separate review",
    VERIFIED: "Passed within the checked scope", REJECTED: "Candidate rejected", INCONCLUSIVE: "The tool could not decide",
    VERIFIED_EXACT_SCOPE: "Verified only for the stated exact predicate", INVALID_CANDIDATE: "The supplied candidate is invalid",
  },
  vi: {
    FORK: "Sẵn sàng chọn hướng tiếp theo", STOPPED: "Đã dừng lần phát thử có giới hạn",
    CONTINUE: "Tiếp tục trong cùng mục tiêu và ngân sách", WAIT_FOR_HUMAN: "Chờ bạn định hướng hoặc cho tiếp tục", STOP: "Dừng và xem lại trước nhiệm vụ mới",
    CANDIDATE_REJECTED: "Ứng viên không vượt qua phép kiểm chính xác", EXACT_PREDICATE_REFUTED: "Mệnh đề chính xác đã chọn bị bác bỏ",
    EXACT_SCOPE_CHECKED: "Ứng viên vượt qua phép kiểm chính xác trong phạm vi hẹp", UNVERIFIED: "Khẳng định chưa được kiểm chứng",
    DECLARED_REFUTED: "Model đề nghị bỏ hướng này, chưa phải bác bỏ đã được kiểm độc lập",
    NO_PROGRESS: "Chưa có ứng viên hay bằng chứng mới", INVALID_OUTPUT: "Chưa thể tiếp nhận đầu ra",
    CUMULATIVE_BUDGET: "Đã chạm giới hạn thực thi tổng", NO_PROGRESS_OR_DECLARED_REFUTED_REUSE: "Lặp ứng viên sai hoặc hướng đã bỏ mà chưa có bằng chứng mới",
    INVALID_STRATEGY_OUTPUT: "Đầu ra chưa có định hướng dùng được", EXECUTION_BOUNDARY: "Đã dừng do giới hạn thời gian, đầu ra hoặc phép kiểm host",
    RETENTION_OR_EXECUTION_FAILURE: "Chưa lưu giữ hoặc thực thi được kết quả an toàn, không chạy thêm bước",
    EXACT_PREDICATE_REFUTED_REQUIRES_ROUTING: "Mệnh đề chính xác đã chọn bị bác bỏ, cần chọn nhiệm vụ nghiên cứu mới trước khi tiếp tục",
    EXACT_SCOPE_ONLY_REQUIRES_ROUTING: "Đã hoàn tất phép kiểm hẹp, kết luận rộng hơn cần được xem xét riêng",
    VERIFIED: "Đạt trong phạm vi đã kiểm", REJECTED: "Ứng viên bị từ chối", INCONCLUSIVE: "Công cụ chưa kết luận được",
    VERIFIED_EXACT_SCOPE: "Chỉ xác nhận mệnh đề chính xác đã nêu", INVALID_CANDIDATE: "Ứng viên được đưa ra không hợp lệ",
  },
};

/** Existing research history remains the source of record; no parallel chat. */
export function ResearchDirectionForm({ slug, locale, missionId: initialMission, missions, documents, parents, configured, simulationAvailable, idempotencyKey }: {
  slug: string; locale: "en" | "vi"; missionId: string;
  missions: Array<{ id: string; title: string; referenceCode: string }>;
  documents: Array<{ id: string; missionId: string; title: string; documentKey: string }>;
  parents: Parent[]; configured: boolean; simulationAvailable: boolean; idempotencyKey: string;
}) {
  const en = locale === "en";
  const replayLabel = (code: string) => replayLabels[locale][code] ?? (en ? "See technical details" : "Xem chi tiết kỹ thuật");
  const [accepted, setAccepted] = useState(false);
  const [requestKey, setRequestKey] = useState(idempotencyKey);
  const [state, submit, pending] = useActionState(async (previous: ResearchStepActionState, form: FormData) => {
    try {
      const result = await requestResearchStepAction(previous, form);
      if (result.status === "QUEUED") setAccepted(true);
      return result;
    } catch {
      // An uncertain network result must retain the same request key for retry.
      return { status: "UNKNOWN" } satisfies ResearchStepActionState;
    }
  }, { status: "IDLE" } satisfies ResearchStepActionState);
  const [mode, setMode] = useState<"HUMAN" | "AUTO">("AUTO");
  const [guidance, setGuidance] = useState("");
  const [goal, setGoal] = useState("");
  const [missionId, setMission] = useState(initialMission);
  const [documentId, setDocument] = useState("");
  const [parentId, setParent] = useState("");
  const [allowedDomains, setAllowed] = useState("");
  const [primaryDomains, setPrimary] = useState("");
  const [requirePrimary, setRequirePrimary] = useState(false);
  const [queries, setQueries] = useState("");
  const [maxSources, setMaxSources] = useState("20");
  const [brief, setBrief] = useState("");
  const [briefError, setBriefError] = useState(false);
  const [simulation, setSimulation] = useState<DirectedSimulationObservation | null>(null);
  const [simulationSteps, setSimulationSteps] = useState<DirectedSimulationStep[]>([]);
  const [simulationPending, setSimulationPending] = useState(false);
  const [simulationError, setSimulationError] = useState(false);
  const parent = parents.find((item) => item.id === parentId);
  const eligible = parents.filter((item) => item.missionId === missionId);
  const activeGoal = parent?.question ?? goal;
  function edit() {
    setAccepted(false);
    setRequestKey(`research-step:${crypto.randomUUID()}`);
    setBrief("");
    setBriefError(false);
  }
  function handoff() {
    try {
      const lines = (value: string) => value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
      setBrief(researchSteeringBrief({ goal: activeGoal, mode, guidance, parentRunId: parent?.id, parent,
        sourcePolicy: { allowedDomains: lines(allowedDomains), primaryDomains: lines(primaryDomains), requirePrimary, maxSources: Number(maxSources) },
        queries: parent ? [] : lines(queries),
      }));
      setBriefError(false);
    } catch { setBrief(""); setBriefError(true); }
  }
  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "hive-research-direction.txt"; link.click();
    URL.revokeObjectURL(url);
  }
  async function simulate(output: DirectedSimulationStep["output"]) {
    if (simulationPending || pending) return;
    setSimulationPending(true); setSimulationError(false);
    const steps = [...simulationSteps, { mode, guidance, output }];
    try {
      const reply = await simulateDirectedResearchAction(slug, { steps });
      if (!reply.ok) { setSimulationError(true); return; }
      setSimulation(reply.observation); setSimulationSteps(steps);
    } catch { setSimulationError(true); }
    finally { setSimulationPending(false); }
  }
  return <form action={submit} aria-label={en ? "Research direction" : "Định hướng nghiên cứu"} className="divide-line divide-y">
    <input type="hidden" name="slug" value={slug} />
    <input type="hidden" name="language" value={locale} />
    <input type="hidden" name="idempotencyKey" value={requestKey} />
    <fieldset disabled={pending} className="min-w-0 space-y-6 p-5 min-[980px]:p-7">
      <legend className="sr-only">{en ? "Goal and direction" : "Mục tiêu và định hướng"}</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-meta text-ink font-medium">{en ? "Mission" : "Nhiệm vụ"}
          <select name="missionId" value={missionId} onChange={(event) => { edit(); setMission(event.target.value); setParent(""); setDocument(""); }} className={field}>
            {missions.map((mission) => <option key={mission.id} value={mission.id}>{mission.referenceCode} · {mission.title}</option>)}
          </select>
        </label>
        <label className="text-meta text-ink font-medium">{en ? "Continue from" : "Tiếp tục từ"}
          <select name="parentRunId" value={parentId} onChange={(event) => { edit(); setParent(event.target.value); }} className={field}>
            <option value="">{en ? "New goal" : "Mục tiêu mới"}</option>
            {eligible.map((item) => <option key={item.id} value={item.id}>{item.question.slice(0, 80)} · {new Date(item.createdAt).toLocaleDateString(en ? "en-US" : "vi-VN")}</option>)}
          </select>
        </label>
      </div>
      <label className="text-body text-ink block font-semibold">{en ? "Result you need" : "Kết quả bạn cần"}
        <textarea name="intent" required rows={4} maxLength={8000} value={activeGoal} readOnly={Boolean(parent)} onChange={(event) => { edit(); setGoal(event.target.value); }}
          placeholder={en ? "State the problem, the result you need, and what must remain true." : "Nêu đề bài, kết quả cần đạt và những điều không được thay đổi."}
          className={`${field} min-h-32 resize-y font-normal leading-relaxed`} />
      </label>
      {parent ? <div className="border-line bg-surface-subtle rounded-md border p-4 text-meta text-ink-muted">
        <p>{en ? "The original goal, source restrictions and previous results are retained. This step does not replace or approve them." : "Giữ nguyên mục tiêu gốc, giới hạn nguồn và kết quả trước. Bước mới không thay thế hay tự phê duyệt chúng."}</p>
        <p className="mt-2">{parent.findings} {en ? "retained findings" : "phát hiện được giữ"}, {parent.sources} {en ? "sources" : "nguồn"}. {en ? "Recorded status" : "Trạng thái đã lưu"}: {parent.status}.</p>
        <a href={`#research-run-${parent.id}`} className="mt-2 inline-flex min-h-10 items-center font-medium text-ink underline">{en ? "Read previous evidence" : "Đọc bằng chứng trước"}</a>
      </div> : null}
      <fieldset className="space-y-3">
        <legend className="text-body text-ink font-semibold">{en ? "Who chooses the direction?" : "Ai chọn hướng đi?"}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["HUMAN", "AUTO"] as const).map((value) => <label key={value} className={`border-line flex cursor-pointer items-start gap-3 rounded-md border p-4 ${mode === value ? "bg-surface-subtle" : "bg-surface"}`}>
            <input type="radio" name="steeringMode" value={value} checked={mode === value} onChange={() => { edit(); setMode(value); }} className="mt-1 size-4 shrink-0 accent-current" />
            <span className="min-w-0"><span className="text-body text-ink block font-semibold">{value === "HUMAN" ? (en ? "I guide" : "Tôi định hướng") : (en ? "AI guides" : "AI tự định hướng")}</span>
              <span className="text-meta text-ink-muted mt-1 block">{value === "HUMAN" ? (en ? "Share an intuition. AI investigates how to pursue it." : "Nêu ý tưởng. AI tìm cách triển khai hướng đó.") : (en ? "AI chooses one next approach within this goal." : "AI chọn một hướng tiếp theo trong mục tiêu này.")}</span></span>
          </label>)}
        </div>
      </fieldset>
      <label className="text-body text-ink block font-semibold">{mode === "HUMAN" ? (en ? "Your direction" : "Hướng bạn muốn theo") : (en ? "Background for AI (optional)" : "Gợi ý cho AI (không bắt buộc)")}
        <textarea name="guidance" rows={3} maxLength={4000} required={mode === "HUMAN"} value={guidance} onChange={(event) => { edit(); setGuidance(event.target.value); }} className={`${field} resize-y font-normal`}
          placeholder={en ? "I think we should compare the assumptions in the two sources before calculating further…" : "Tôi nghĩ nên đối chiếu giả định của hai nguồn trước khi tính tiếp…"} />
        <span className="text-meta text-ink-muted mt-2 block max-w-[76ch] font-normal">{en ? "No formulas or technical plan needed. AI must explain a false premise or proposed alternative instead of silently changing your goal. Switching modes never starts a run." : "Không cần công thức hay kế hoạch kỹ thuật. AI phải chỉ rõ tiền đề sai hoặc phương án thay thế, không âm thầm đổi mục tiêu. Đổi chế độ không khởi chạy."}</span>
      </label>
      <details className="text-meta text-ink-muted">
        <summary className="min-h-10 cursor-pointer py-2 font-medium text-ink">{en ? "Document and source boundaries" : "Tài liệu và giới hạn nguồn"}</summary>
        <label className="mt-3 block">{en ? "Related document" : "Tài liệu liên quan"}
          <select name="documentId" value={parent ? parent.documentId ?? "" : documentId} onChange={(event) => { edit(); setDocument(event.target.value); }} disabled={Boolean(parent)} className={field}>
            <option value="">{en ? "No document" : "Không gắn tài liệu"}</option>
            {documents.filter((document) => document.missionId === missionId).map((document) => <option key={document.id} value={document.id}>{document.documentKey} · {document.title}</option>)}
          </select>
        </label>
        {parent ? <input type="hidden" name="documentId" value={parent.documentId ?? ""} /> : <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>{en ? "Allowed domains (optional)" : "Tên miền được dùng (không bắt buộc)"}<textarea name="allowedDomains" rows={2} value={allowedDomains} onChange={(event) => { edit(); setAllowed(event.target.value); }} className={field} /></label>
          <label>{en ? "Primary source domains (optional)" : "Tên miền nguồn gốc (không bắt buộc)"}<textarea name="primaryDomains" rows={2} value={primaryDomains} onChange={(event) => { edit(); setPrimary(event.target.value); }} className={field} /></label>
          <label className="sm:col-span-2">{en ? "Search queries (optional, one per line)" : "Truy vấn tìm kiếm (không bắt buộc, mỗi dòng một truy vấn)"}<textarea name="queries" rows={3} value={queries} onChange={(event) => { edit(); setQueries(event.target.value); }} className={field} /></label>
          <label>{en ? "Maximum retained sources" : "Số nguồn lưu tối đa"}<input name="maxSources" type="number" min={1} max={50} value={maxSources} onChange={(event) => { edit(); setMaxSources(event.target.value); }} className={field} /></label>
          <label className="flex min-h-10 items-center gap-2 sm:col-span-2"><input name="requirePrimary" type="checkbox" checked={requirePrimary} onChange={(event) => { edit(); setRequirePrimary(event.target.checked); }} />{en ? "Require a primary source" : "Bắt buộc có nguồn gốc"}</label>
        </div>}
      </details>
    </fieldset>
    <div className="space-y-4 p-5 min-[980px]:px-7">
      <p className="text-meta text-ink-muted max-w-[78ch]">{en ? "One evidence-collection step, not a proof or an unattended campaign. API adapter: openai / gpt-5.6-sol, not your Codex subscription. Existing limits: one model request, up to four web-tool calls and 12,000 output tokens; API may cost money. Existing source, authorization and review checks remain." : "Một bước thu thập bằng chứng, không phải chứng minh hay chiến dịch tự chạy. Adapter API: openai / gpt-5.6-sol, không dùng gói đăng ký Codex. Giới hạn hiện có: một yêu cầu model, tối đa bốn lượt công cụ web và 12.000 token đầu ra; API có thể phát sinh phí. Giữ nguyên kiểm tra nguồn, quyền và rà soát hiện có."}</p>
      {!configured ? <p role="status" className="text-meta text-ink font-medium">{en ? "Research runtime is not configured for this workspace. No request will be queued. You can take a plain-language brief to your existing agent." : "Chưa cấu hình thực thi nghiên cứu cho không gian này. Không tạo hàng đợi. Bạn có thể mang hồ sơ ngôn ngữ tự nhiên sang agent đang dùng."}</p> : <p className="text-meta text-ink-muted">{en ? "Adapter configuration is present, not a worker heartbeat. Submission queues one step; it is not yet running." : "Đã có cấu hình adapter, chưa xác nhận worker đang hoạt động. Gửi yêu cầu chỉ xếp một bước vào hàng đợi, chưa phải đang chạy."}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" onClick={handoff} disabled={pending || !activeGoal.trim() || (mode === "HUMAN" && !guidance.trim())}>{en ? "Prepare agent brief" : "Tạo hồ sơ cho agent"}</Button>
        <Button type="submit" variant="primary" disabled={pending || !configured || accepted}>{pending ? (en ? "Submitting…" : "Đang gửi…") : (en ? "Start one research step" : "Chạy một bước nghiên cứu")}</Button>
      </div>
      {state.status !== "IDLE" ? <p role="status" className="text-body text-ink">{state.status === "QUEUED" ? (en ? "One step queued. Follow its evidence and status below. No further step will start automatically." : "Đã xếp một bước vào hàng đợi. Theo dõi trạng thái và bằng chứng bên dưới. Không tự khởi động bước tiếp theo.") : state.status === "UNKNOWN" ? (en ? "Cannot confirm whether this request was accepted. Check saved history before retrying or editing. An unchanged retry uses the same request key; no automatic retry has started." : "Chưa xác nhận được yêu cầu đã được nhận hay chưa. Kiểm tra lịch sử đã lưu trước khi thử lại hoặc sửa. Thử lại nguyên yêu cầu dùng cùng khóa; không tự động thử lại.") : state.status === "UNAVAILABLE" ? (en ? "This step cannot start in the current configuration or parent state. Your inputs are retained; use an agent brief or choose a completed generic record." : "Chưa thể chạy với cấu hình hoặc trạng thái hồ sơ hiện tại. Đã giữ nội dung nhập; dùng hồ sơ cho agent hoặc chọn hồ sơ nghiên cứu thường đã kết thúc.") : (en ? "Request was not accepted. Check the goal, direction and related record or your access. Your inputs are retained." : "Yêu cầu chưa được chấp nhận. Kiểm tra mục tiêu, hướng đi, hồ sơ liên quan hoặc quyền truy cập. Đã giữ nội dung nhập.")}</p> : null}
      {accepted ? <a href={`/w/${slug}/research?missionId=${encodeURIComponent(missionId)}`} className="text-body text-ink inline-flex min-h-10 items-center underline">{en ? "Refresh saved history to choose the next step" : "Làm mới lịch sử đã lưu để chọn bước tiếp"}</a> : null}
      {briefError ? <p role="alert" className="text-body text-ink">{en ? "Brief not created. Check the goal, direction and source limits (1–50 sources; up to 20 queries, 500 characters each). Your inputs are retained." : "Chưa tạo hồ sơ. Kiểm tra mục tiêu, hướng đi và giới hạn nguồn (1–50 nguồn; tối đa 20 truy vấn, mỗi truy vấn 500 ký tự). Đã giữ nội dung nhập."}</p> : null}
      {brief ? <div className="border-line rounded-md border p-4"><h3 className="text-body text-ink font-semibold">{en ? "Portable agent brief, no model called" : "Hồ sơ mang sang agent, chưa gọi model"}</h3>
        <p className="text-meta text-ink-muted mt-2">{en ? "Copy this editable text into the host you already use. It is a handoff, not an authenticated run or complete evidence dossier." : "Sao chép văn bản có thể sửa này sang agent đang dùng. Đây là bàn giao, không phải lượt chạy đã xác thực hay toàn bộ hồ sơ bằng chứng."}</p>
        <textarea aria-label={en ? "Agent brief" : "Hồ sơ cho agent"} value={brief} onChange={(event) => setBrief(event.target.value)} rows={12} className={`${field} font-normal`} />
        <Button type="button" onClick={downloadBrief} className="mt-3">{en ? "Download brief" : "Tải hồ sơ"}</Button>
        <MathText text={en ? "Previous results remain in the history below." : "Kết quả trước vẫn được giữ ở lịch sử bên dưới."} />
      </div> : null}
      {simulationAvailable ? <details className="border-line rounded-md border p-4">
        <summary className="text-body text-ink cursor-pointer py-1 font-semibold">{en ? "Exercise the lean core with a simulated API" : "Kiểm tra lõi gọn với API giả lập"}</summary>
        <p className="text-meta text-ink-muted mt-3 max-w-[78ch]">{en ? "Explicit fixed engineering scenario, not the goal above: find positive integers satisfying 2x + 3y = 7. Scripted assistant-authored responses, no real LLM, web or database writes. This replays the bounded transcript through the same lean executor and real exact checker. The current mode and guidance above are passed to its next prompt, but the scripted response does not understand arbitrary instructions." : "Kịch bản kỹ thuật cố định được chọn rõ, không phải đề bài bên trên: tìm số nguyên dương thỏa 2x + 3y = 7. Đầu ra do trợ lý soạn sẵn, không LLM thật, web hay ghi database. Phát lại lịch sử có giới hạn qua cùng bộ thực thi lõi gọn và bộ kiểm chính xác thật. Chế độ và ý tưởng bên trên đi vào prompt tiếp theo, nhưng đầu ra soạn sẵn không hiểu chỉ dẫn tùy ý."}</p>
        <p className="text-meta text-ink-muted mt-2">{en ? "At most 3 solver calls per replay, no critic. Switch human/AI at each fork without clearing history. Every click replays earlier scripted steps, not fresh model inference." : "Tối đa 3 lượt solver trong một lần phát lại, không phản biện mặc định. Đổi người/AI tại ngã rẽ mà giữ lịch sử. Mỗi lần bấm phát lại cả các bước đã soạn, không suy luận model mới."}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" disabled={simulationPending || pending || simulation?.state.status === "STOPPED"} onClick={() => simulate("SCENARIO")}>
            {simulationPending ? (en ? "Replaying…" : "Đang phát lại…") : simulationSteps.length ? (en ? "Authorize continuation in this mode" : "Cho tiếp tục trong chế độ này") : (en ? "Choose and run the fixed case" : "Chọn và chạy ca cố định")}
          </Button>
          <Button type="button" disabled={simulationPending || pending || !simulationSteps.length || simulation?.state.status === "STOPPED"} onClick={() => simulate("REPEAT")}>{en ? "Test no-progress stop" : "Thử dừng khi không tiến triển"}</Button>
          <Button type="button" disabled={simulationPending || pending || simulation?.state.status === "STOPPED"} onClick={() => simulate("UNSUPPORTED")}>{en ? "Test unsupported claim" : "Thử khẳng định chưa có chứng cứ"}</Button>
          <Button type="button" disabled={simulationPending || pending} onClick={() => { setSimulation(null); setSimulationSteps([]); setSimulationError(false); }}>{en ? "Reset technical replay" : "Đặt lại lần phát thử"}</Button>
        </div>
        {simulationError ? <p role="alert" className="text-meta text-ink mt-3">{en ? "Replay refused. HUMAN needs a direction; check the input or access. Existing history and typed input remain." : "Chưa phát lại được. Chế độ người cần có định hướng; kiểm tra nội dung hoặc quyền truy cập. Giữ nguyên lịch sử và nội dung đã nhập."}</p> : null}
        {simulation ? <div className="mt-5 space-y-4" aria-live="polite">
          <p className="text-body text-ink font-medium">{replayLabel(simulation.state.status)} · {simulation.state.used.calls}/{simulation.state.budget.maxCalls} {en ? "scripted calls in this replay" : "lượt soạn sẵn trong lần phát lại"}</p>
          <p className="text-meta text-ink">{en ? "Next" : "Tiếp theo"}: {replayLabel(simulation.state.nextDecision)}</p>
          {simulation.state.stopReason ? <p className="text-meta text-ink-muted">{en ? "Reason" : "Lý do"}: {replayLabel(simulation.state.stopReason)}</p> : null}
          {simulation.state.history.map((entry, index) => <article key={index} className="border-line rounded-md border p-4">
            <h4 className="text-body text-ink font-semibold">{en ? "Attempt" : "Lần thử"} {index + 1}: {entry.mode === "HUMAN" ? (en ? "Human-guided" : "Người định hướng") : (en ? "AI-guided" : "AI định hướng")}</h4>
            <p className="text-meta text-ink mt-2 font-medium">{replayLabel(entry.disposition)}</p>
            <p className="text-meta text-ink-muted mt-2">{en ? "Scripted model text, not evidence" : "Văn bản model giả lập, không phải bằng chứng"}</p>
            <MathText text={entry.result.selected?.draft.argument ?? entry.result.failures.join("; ")} className="mt-2" />
            <p className="text-meta text-ink-muted mt-3">{en ? "Real host checker" : "Bộ kiểm host thật"}: {entry.result.selected?.receipt ? `${replayLabel(entry.result.selected.receipt.result)}. ${replayLabel(entry.result.selected.receipt.scientificDisposition)}` : (en ? "No receipt; the claim remains unverified" : "Chưa có chứng chỉ, khẳng định chưa được kiểm chứng")}</p>
            {entry.result.selected?.receipt?.reason ? <p className="text-meta text-ink mt-1">{entry.result.selected.receipt.reason}</p> : null}
            <details className="mt-3"><summary className="text-meta text-ink cursor-pointer py-2">{en ? "Actual next prompt and check details" : "Prompt thực tế và chi tiết kiểm"}</summary>
              <pre tabIndex={0} role="region" aria-label={`${en ? "Actual prompt, attempt" : "Prompt thực tế, lần thử"} ${index + 1}`} className="text-meta text-ink-muted mt-2 max-h-80 overflow-auto whitespace-pre-wrap break-words">{entry.prompt}</pre>
              <pre tabIndex={0} role="region" aria-label={`${en ? "Receipt and technical state, attempt" : "Chứng chỉ và trạng thái kỹ thuật, lần thử"} ${index + 1}`} className="text-meta text-ink-muted mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words">{JSON.stringify({ coreState: simulation.state.status, nextDecision: simulation.state.nextDecision, stopReason: simulation.state.stopReason, disposition: entry.disposition, receipt: entry.result.selected?.receipt ?? null, checkFailure: entry.result.selected?.checkFailure }, null, 2)}</pre>
            </details>
          </article>)}
          <p className="text-meta text-ink-muted">{en ? "Exact tuple checks only. No theorem, scientific novelty, semantic alignment or autonomous research capability is certified. Renaming equivalent strategies can evade structural repeat detection." : "Chỉ kiểm chính xác bộ số. Không chứng nhận định lý, tính mới, sự khớp nghĩa hay khả năng nghiên cứu tự trị. Đổi tên các chiến lược tương đương có thể vượt kiểm lặp cấu trúc."}</p>
        </div> : null}
      </details> : null}
    </div>
  </form>;
}
