"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { requestResearchStepAction } from "@/app/actions/research-sandbox";
import { simulateDirectedResearchAction } from "@/app/actions/lean-research";
import type { DirectedSimulationObservation, DirectedSimulationStep } from "@/modules/research-sandbox/directed-research";
import { Button } from "@/components/ui/button";
import { MathText } from "./math-text";
import { prepareMathematicalResearchNote } from "./research-note";
import { deleteResearchNoteDraft, readResearchNoteDraft, researchDraftMessageText, researchDraftNeedsConfirmation, researchDraftReferencesAvailable, researchNoteDraftKey, saveResearchNoteDraft, type ResearchDraftMessage, type ResearchNoteDraft, type ResearchNoteInputs } from "./research-note-draft";
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
export function ResearchDirectionForm({ slug, draftScope, locale, missionId: initialMission, missions, documents, parents, configured, simulationAvailable, operational = false, idempotencyKey }: {
  draftScope: { userId: string; workspaceId: string };
  slug: string; locale: "en" | "vi"; missionId: string;
  missions: Array<{ id: string; title: string; referenceCode: string }>;
  documents: Array<{ id: string; missionId: string; title: string; documentKey: string }>;
  parents: Parent[]; configured: boolean; simulationAvailable: boolean; operational?: boolean; idempotencyKey: string;
}) {
  const en = locale === "en";
  const replayLabel = (code: string) => replayLabels[locale][code] ?? (en ? "See technical details" : "Xem chi tiết kỹ thuật");
  const [accepted, setAccepted] = useState(false);
  const [requestKey, setRequestKey] = useState(idempotencyKey);
  const [feedbackForKey, setFeedbackForKey] = useState<string | null>(null);
  const [state, submit, pending] = useActionState(async (previous: ResearchStepActionState, form: FormData) => {
    try {
      const result = await requestResearchStepAction(previous, form);
      setFeedbackForKey(String(form.get("idempotencyKey")));
      if (result.status === "QUEUED") setAccepted(true);
      return result;
    } catch {
      // An uncertain network result must retain the same request key for retry.
      setFeedbackForKey(String(form.get("idempotencyKey")));
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
  const [formulaPreview, setFormulaPreview] = useState(false);
  const [simulation, setSimulation] = useState<DirectedSimulationObservation | null>(null);
  const [simulationSteps, setSimulationSteps] = useState<DirectedSimulationStep[]>([]);
  const [simulationPending, setSimulationPending] = useState(false);
  const [simulationError, setSimulationError] = useState(false);
  const [savedDraft, setSavedDraft] = useState<ResearchNoteDraft | null>(null);
  const [draftMessage, setDraftMessage] = useState<ResearchDraftMessage | null>(null);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const parent = parents.find((item) => item.id === parentId);
  const eligible = parents.filter((item) => item.missionId === missionId);
  const activeGoal = parent?.question ?? goal;
  const inputs: ResearchNoteInputs = { goal: activeGoal, guidance, mode, missionId, documentId: parent ? parent.documentId ?? "" : documentId,
    parentId, allowedDomains, primaryDomains, requirePrimary, queries, maxSources };
  const initialInputs = useRef(inputs);
  const draftKey = researchNoteDraftKey(draftScope.userId, draftScope.workspaceId);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const loaded = readResearchNoteDraft(() => window.sessionStorage, draftKey);
      setSavedDraft(loaded.draft);
      if (loaded.error) setDraftMessage("READ_UNAVAILABLE");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [draftKey]);
  function edit() {
    setAccepted(false);
    setRequestKey(`research-step:${crypto.randomUUID()}`);
    setBrief("");
    setBriefError(false);
    setFeedbackForKey(null);
    setConfirmRestore(false);
  }
  function saveDraft() {
    const savedAt = Date.now();
    if (!saveResearchNoteDraft(() => window.sessionStorage, draftKey, inputs, savedAt)) {
      setDraftMessage("SAVE_FAILED"); return;
    }
    setSavedDraft({ version: 1, savedAt, input: inputs }); setConfirmRestore(false);
    setDraftMessage("SAVED");
  }
  function restoreDraft(confirmed = false) {
    const loaded = readResearchNoteDraft(() => window.sessionStorage, draftKey);
    setSavedDraft(loaded.draft);
    if (!loaded.draft) { setConfirmRestore(false); setDraftMessage("MISSING"); return; }
    if (!researchDraftReferencesAvailable(loaded.draft.input, { missions, documents, parents })) {
      setConfirmRestore(false); setDraftMessage("REFERENCES_CHANGED"); return;
    }
    if (!confirmed && researchDraftNeedsConfirmation(inputs, loaded.draft.input, initialInputs.current)) { setConfirmRestore(true); return; }
    const restored = loaded.draft.input;
    edit(); setGoal(restored.goal); setGuidance(restored.guidance); setMode(restored.mode);
    setMission(restored.missionId); setDocument(restored.documentId); setParent(restored.parentId);
    setAllowed(restored.allowedDomains); setPrimary(restored.primaryDomains); setRequirePrimary(restored.requirePrimary);
    setQueries(restored.queries); setMaxSources(restored.maxSources);
    setSimulation(null); setSimulationSteps([]); setSimulationError(false);
    setDraftMessage("RESTORED");
  }
  function removeDraft() {
    if (!deleteResearchNoteDraft(() => window.sessionStorage, draftKey)) { setDraftMessage("DELETE_FAILED"); return; }
    setSavedDraft(null); setConfirmRestore(false);
    setDraftMessage("DELETED");
  }
  function handoff() {
    try {
      const lines = (value: string) => value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
      const relatedId = parent ? parent.documentId : documentId;
      const noteInput = { goal: activeGoal, mode, guidance, parentRunId: parent?.id, parent,
        sourcePolicy: { allowedDomains: lines(allowedDomains), primaryDomains: lines(primaryDomains), requirePrimary, maxSources: Number(maxSources) },
        queries: parent ? [] : lines(queries),
        ...(relatedId ? { relatedDocument: { title: documents.find((document) => document.id === relatedId)?.title ?? null } } : {}),
      };
      setBrief(operational ? researchSteeringBrief(noteInput) : prepareMathematicalResearchNote(noteInput, locale));
      setBriefError(false);
    } catch { setBrief(""); setBriefError(true); }
  }
  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = operational ? "hive-research-direction.txt" : "hive-research-note.txt"; link.click();
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
      <label className="text-body text-ink block font-semibold">{en ? "Problem and intended result" : "Bài toán và kết quả mong muốn"}
        <textarea name="intent" required rows={5} maxLength={8000} value={activeGoal} readOnly={Boolean(parent)} onChange={(event) => { edit(); setGoal(event.target.value); }}
          placeholder={en ? "State the problem, its assumptions, and what you want to prove or examine." : "Nêu phát biểu, các điều kiện và điều bạn muốn chứng minh hoặc kiểm tra."}
          className={`${field} min-h-40 resize-y font-normal leading-relaxed`} />
      </label>
      <div>
        <Button type="button" variant="secondary" aria-expanded={formulaPreview} aria-controls="research-formula-preview" onClick={() => setFormulaPreview((value) => !value)}>{formulaPreview ? (en ? "Hide formula preview" : "Ẩn xem trước công thức") : (en ? "Preview mathematical notation" : "Xem trước công thức toán")}</Button>
        <p className="text-meta text-ink-muted mt-2">{en ? "Write naturally. For formulas you may use $…$ or $$…$$. Previewing never changes your text." : "Viết tự nhiên. Với công thức, bạn có thể dùng $…$ hoặc $$…$$. Xem trước không thay đổi nội dung đã nhập."}</p>
        {formulaPreview ? <div id="research-formula-preview" className="border-line bg-surface-subtle mt-4 min-w-0 rounded-md border p-4 leading-relaxed" aria-label={en ? "Mathematical preview" : "Xem trước nội dung toán"}>
          <MathText text={activeGoal || (en ? "Your problem will appear here." : "Đề bài của bạn sẽ hiển thị tại đây.")} />
          {guidance ? <div className="border-line mt-4 border-t pt-4"><MathText text={guidance} /></div> : null}
        </div> : null}
      </div>
      {parent ? <div className="border-line bg-surface-subtle rounded-md border p-4 text-meta text-ink-muted">
        <p>{en ? "The original problem, reference boundaries and earlier work are retained. Preparing a note does not change or approve them." : "Giữ nguyên đề bài gốc, giới hạn tài liệu và công việc trước. Soạn ghi chú không sửa hay phê duyệt chúng."}</p>
        <p className="mt-2">{parent.findings} {en ? "earlier observations" : "ghi nhận trước"}, {parent.sources} {en ? "references" : "tài liệu"}.</p>
        <a href={`#research-run-${parent.id}`} className="mt-2 inline-flex min-h-10 items-center font-medium text-ink underline">{en ? "Read earlier work" : "Đọc công việc trước"}</a>
      </div> : null}
      <fieldset className="space-y-3">
        <legend className="text-body text-ink font-semibold">{en ? "How would you like to choose a direction?" : "Bạn muốn chọn hướng đi thế nào?"}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["HUMAN", "AUTO"] as const).map((value) => <label key={value} className={`border-line flex cursor-pointer items-start gap-3 rounded-md border p-4 ${mode === value ? "bg-surface-subtle" : "bg-surface"}`}>
            <input type="radio" name="steeringMode" value={value} checked={mode === value} onChange={() => { edit(); setMode(value); }} className="mt-1 size-4 shrink-0 accent-current" />
            <span className="min-w-0"><span className="text-body text-ink block font-semibold">{value === "HUMAN" ? (en ? "I suggest a direction" : "Tôi đề xuất hướng đi") : (en ? "Ask AI to suggest" : "Nhờ AI gợi ý")}</span>
              <span className="text-meta text-ink-muted mt-1 block">{value === "HUMAN" ? (en ? "Start from your intuition, even without a detailed method." : "Bắt đầu từ trực giác của bạn, chưa cần phương pháp chi tiết.") : (en ? "When connected, AI can examine a next approach within this problem." : "Khi được kết nối, AI có thể xem xét hướng tiếp theo trong bài toán này.")}</span></span>
          </label>)}
        </div>
      </fieldset>
      <label className="text-body text-ink block font-semibold">{mode === "HUMAN" ? (en ? "Your idea or intuition" : "Ý tưởng hoặc trực giác của bạn") : (en ? "What you already know (optional)" : "Điều bạn đã biết (không bắt buộc)")}
        <textarea name="guidance" rows={4} maxLength={4000} required={mode === "HUMAN"} value={guidance} onChange={(event) => { edit(); setGuidance(event.target.value); }} className={`${field} resize-y font-normal`}
          placeholder={en ? "I think a symmetry or a simpler special case may help. These are the approaches I have already tried…" : "Tôi nghĩ có thể khai thác đối xứng hoặc một trường hợp đơn giản hơn. Những hướng tôi đã thử là…"} />
        <span className="text-meta text-ink-muted mt-2 block max-w-[76ch] font-normal">{en ? "An idea is a starting point, not an established fact. Changing this choice does not start AI or erase your text." : "Ý tưởng là điểm xuất phát, không phải kết luận đã đúng. Đổi lựa chọn không khởi chạy AI hay xóa nội dung của bạn."}</span>
      </label>
      <details className="text-meta text-ink-muted">
      <summary className="min-h-10 cursor-pointer py-2 font-medium text-ink">{en ? "Related work and earlier observations (optional)" : "Công việc liên quan và ghi nhận trước (không bắt buộc)"}</summary>
      <div className="mt-2 grid gap-4 sm:grid-cols-2">
        <label className="text-meta text-ink font-medium">{en ? "Related work" : "Nhóm công việc liên quan"}
          <select name="missionId" value={missionId} onChange={(event) => { edit(); setMission(event.target.value); setParent(""); setDocument(""); }} className={field}>
            {missions.map((mission) => <option key={mission.id} value={mission.id}>{operational ? `${mission.referenceCode} · ` : ""}{mission.title}</option>)}
          </select>
        </label>
        <label className="text-meta text-ink font-medium">{en ? "Continue from" : "Tiếp tục từ"}
          <select name="parentRunId" value={parentId} onChange={(event) => { edit(); setParent(event.target.value); }} className={field}>
            <option value="">{en ? "New goal" : "Mục tiêu mới"}</option>
            {eligible.map((item) => <option key={item.id} value={item.id}>{item.question.slice(0, 80)} · {new Date(item.createdAt).toLocaleDateString(en ? "en-US" : "vi-VN")}</option>)}
          </select>
        </label>
      </div>
      </details>
      <details id="research-references" className="text-meta text-ink-muted scroll-mt-24">
        <summary className="min-h-10 cursor-pointer py-2 font-medium text-ink">{en ? "References and source boundaries" : "Tài liệu tham khảo và giới hạn nguồn"}</summary>
        <label className="mt-3 block">{en ? "Related document" : "Tài liệu liên quan"}
          <select name="documentId" value={parent ? parent.documentId ?? "" : documentId} onChange={(event) => { edit(); setDocument(event.target.value); }} disabled={Boolean(parent)} className={field}>
            <option value="">{en ? "No document" : "Không gắn tài liệu"}</option>
            {documents.filter((document) => document.missionId === missionId).map((document) => <option key={document.id} value={document.id}>{operational ? `${document.documentKey} · ` : ""}{document.title}</option>)}
          </select>
        </label>
        {parent ? <input type="hidden" name="documentId" value={parent.documentId ?? ""} /> : <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>{en ? "Only use these websites (optional)" : "Chỉ dùng tài liệu từ các trang này (không bắt buộc)"}<textarea name="allowedDomains" rows={2} placeholder="arxiv.org" value={allowedDomains} onChange={(event) => { edit(); setAllowed(event.target.value); }} className={field} /></label>
          <label>{en ? "Primary-source websites (optional)" : "Trang chứa nguồn sơ cấp (không bắt buộc)"}<textarea name="primaryDomains" rows={2} value={primaryDomains} onChange={(event) => { edit(); setPrimary(event.target.value); }} className={field} /></label>
          <label className="sm:col-span-2">{en ? "Questions for the literature search (optional, one per line)" : "Câu hỏi khi tìm tài liệu (không bắt buộc, mỗi dòng một câu)"}<textarea name="queries" rows={3} value={queries} onChange={(event) => { edit(); setQueries(event.target.value); }} className={field} /></label>
          <label>{en ? "Maximum retained sources" : "Số nguồn lưu tối đa"}<input name="maxSources" type="number" min={1} max={50} value={maxSources} onChange={(event) => { edit(); setMaxSources(event.target.value); }} className={field} /></label>
          <label className="flex min-h-10 items-center gap-2 sm:col-span-2"><input name="requirePrimary" type="checkbox" checked={requirePrimary} onChange={(event) => { edit(); setRequirePrimary(event.target.checked); }} />{en ? "Require a primary source" : "Bắt buộc có nguồn gốc"}</label>
        </div>}
      </details>
    </fieldset>
    <div className="space-y-4 p-5 min-[980px]:px-7">
      <div className="border-line border-b pb-4">
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" disabled={pending || simulationPending} onClick={saveDraft}>{en ? "Save draft in tab" : "Lưu bản nháp trong tab"}</Button>
          {savedDraft ? <><Button type="button" variant="secondary" disabled={pending || simulationPending} onClick={() => restoreDraft()}>{en ? "Restore saved draft" : "Khôi phục bản nháp"}</Button><Button type="button" variant="secondary" disabled={pending || simulationPending} onClick={removeDraft}>{en ? "Delete saved draft" : "Xóa bản nháp đã lưu"}</Button></> : null}
        </div>
        <p className="text-meta text-ink-muted mt-2 max-w-[76ch]">{en ? "Optional and local to this browser tab, for up to 24 hours. No automatic save or server backup. Download the note to keep a separate copy." : "Không bắt buộc, chỉ lưu trong tab trình duyệt này tối đa 24 giờ. Không tự động lưu hay sao lưu lên hệ thống. Tải ghi chú xuống nếu cần bản riêng."}</p>
        {savedDraft ? <p className="text-meta text-ink mt-2">{en ? "A saved input draft is available. It has not been restored automatically." : "Có bản nháp đầu vào đã lưu. Chưa tự động khôi phục."}</p> : null}
        {draftMessage ? <p role="status" className="text-meta text-ink mt-2">{researchDraftMessageText(draftMessage, locale)}</p> : null}
        {confirmRestore ? <div className="border-line mt-3 rounded-md border p-3" role="group" aria-label={en ? "Confirm replacing current inputs" : "Xác nhận thay nội dung đang nhập"}>
          <p className="text-body text-ink">{en ? "Replace your edited inputs with the saved draft? Current text will be replaced, not merged." : "Thay nội dung bạn đang sửa bằng bản nháp đã lưu? Nội dung hiện tại sẽ được thay, không gộp tự động."}</p>
          <div className="mt-3 flex flex-wrap gap-3"><Button type="button" variant="secondary" onClick={() => restoreDraft(true)}>{en ? "Replace with saved draft" : "Thay bằng bản nháp"}</Button><Button type="button" variant="secondary" onClick={() => setConfirmRestore(false)}>{en ? "Keep current text" : "Giữ nội dung hiện tại"}</Button></div>
        </div> : null}
      </div>
      {operational ? <>
      <p className="text-meta text-ink-muted max-w-[78ch]">{en ? "One evidence-collection step, not a proof or an unattended campaign. API adapter: openai / gpt-5.6-sol, not your Codex subscription. Existing limits: one model request, up to four web-tool calls and 12,000 output tokens; API may cost money. Existing source, authorization and review checks remain." : "Một bước thu thập bằng chứng, không phải chứng minh hay chiến dịch tự chạy. Adapter API: openai / gpt-5.6-sol, không dùng gói đăng ký Codex. Giới hạn hiện có: một yêu cầu model, tối đa bốn lượt công cụ web và 12.000 token đầu ra; API có thể phát sinh phí. Giữ nguyên kiểm tra nguồn, quyền và rà soát hiện có."}</p>
      {!configured ? <p role="status" className="text-meta text-ink font-medium">{en ? "Research runtime is not configured for this workspace. No request will be queued. You can take a plain-language brief to your existing agent." : "Chưa cấu hình thực thi nghiên cứu cho không gian này. Không tạo hàng đợi. Bạn có thể mang hồ sơ ngôn ngữ tự nhiên sang agent đang dùng."}</p> : <p className="text-meta text-ink-muted">{en ? "Adapter configuration is present, not a worker heartbeat. Submission queues one step; it is not yet running." : "Đã có cấu hình adapter, chưa xác nhận worker đang hoạt động. Gửi yêu cầu chỉ xếp một bước vào hàng đợi, chưa phải đang chạy."}</p>}
      </> : <p role="status" className="text-body text-ink-muted max-w-[76ch]">{!configured ? (en ? "AI is not connected here yet. You can prepare, read and download your research note. No answer or proof will be generated." : "AI chưa được kết nối tại đây. Bạn có thể chuẩn bị, đọc và tải ghi chú nghiên cứu. Chưa sinh câu trả lời hay chứng minh.") : (en ? "Literature search is configured. It can collect sources, not solve or verify your mathematical problem. Preparing a note does not start a search." : "Đã có cấu hình tìm tài liệu. Chức năng này thu thập nguồn, không giải hay kiểm chứng bài toán của bạn. Soạn ghi chú không khởi chạy tìm kiếm.")}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant={operational ? "secondary" : "primary"} onClick={handoff} disabled={pending || !activeGoal.trim() || (mode === "HUMAN" && !guidance.trim())}>{operational ? (en ? "Prepare agent brief" : "Tạo hồ sơ cho agent") : (en ? "Prepare research note" : "Chuẩn bị ghi chú nghiên cứu")}</Button>
        {configured || operational ? <Button type="submit" variant={operational ? "primary" : "secondary"} disabled={pending || !configured || !missionId || accepted}>{pending ? (en ? "Submitting…" : "Đang gửi…") : (en ? "Request literature search" : "Yêu cầu tìm tài liệu")}</Button> : null}
      </div>
      {state.status !== "IDLE" && feedbackForKey === requestKey ? <p role="status" className="text-body text-ink">{state.status === "QUEUED" ? (en ? "The literature-search request was recorded, not a solution. No next task starts automatically." : "Đã ghi nhận yêu cầu tìm tài liệu, chưa phải lời giải. Không tự khởi động nhiệm vụ tiếp theo.") : state.status === "UNKNOWN" ? (en ? "Cannot confirm whether the request was received. Check earlier records before retrying. Your text is retained; no automatic retry starts." : "Chưa xác nhận được yêu cầu đã được nhận hay chưa. Kiểm tra công việc trước trước khi thử lại. Giữ nguyên nội dung của bạn, không tự động thử lại.") : state.status === "UNAVAILABLE" ? (en ? "The search is not available for this record. Your text is retained and you can prepare a note." : "Chưa thể tìm tài liệu cho hồ sơ này. Nội dung được giữ lại và bạn vẫn có thể soạn ghi chú.") : (en ? "The request was not accepted. Check the problem, direction, related work or your access. Your text is retained." : "Yêu cầu chưa được chấp nhận. Kiểm tra đề bài, hướng đi, công việc liên quan hoặc quyền truy cập. Nội dung của bạn được giữ lại.")}</p> : null}
      {accepted ? <a href={`/w/${slug}/research?missionId=${encodeURIComponent(missionId)}`} className="text-body text-ink inline-flex min-h-10 items-center underline">{en ? "Refresh saved history to choose the next step" : "Làm mới lịch sử đã lưu để chọn bước tiếp"}</a> : null}
      {briefError ? <p role="alert" className="text-body text-ink">{en ? "The note could not be prepared. Check your problem, direction and reference limits. Your text is retained." : "Chưa chuẩn bị được ghi chú. Kiểm tra đề bài, hướng đi và giới hạn tài liệu. Giữ nguyên nội dung đã nhập."}</p> : null}
      {brief ? <div className="border-line rounded-md border p-4"><h3 className="text-body text-ink font-semibold">{operational ? (en ? "Portable agent brief, no model called" : "Hồ sơ mang sang agent, chưa gọi model") : (en ? "Your research note" : "Ghi chú nghiên cứu của bạn")}</h3>
        {operational ? <>
        <p className="text-meta text-ink-muted mt-2">{en ? "Copy this editable text into the host you already use. It is a handoff, not an authenticated run or complete evidence dossier." : "Sao chép văn bản có thể sửa này sang agent đang dùng. Đây là bàn giao, không phải lượt chạy đã xác thực hay toàn bộ hồ sơ bằng chứng."}</p>
        <textarea aria-label={en ? "Agent brief" : "Hồ sơ cho agent"} value={brief} onChange={(event) => setBrief(event.target.value)} rows={12} className={`${field} font-normal`} />
        </> : <article aria-label={en ? "Research note preview" : "Xem trước ghi chú nghiên cứu"} className="text-body text-ink mt-4 max-w-[78ch] leading-relaxed"><MathText text={brief} /></article>}
        <Button type="button" variant="secondary" onClick={downloadBrief} className="mt-4">{operational ? (en ? "Download brief" : "Tải hồ sơ") : (en ? "Download research note" : "Tải ghi chú nghiên cứu")}</Button>
        <MathText className="text-meta text-ink-muted mt-3 block" text={en ? "Previous results remain in the history below." : "Kết quả trước vẫn được giữ ở lịch sử bên dưới."} />
      </div> : null}
      {operational && simulationAvailable ? <details className="border-line rounded-md border p-4">
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
      {!operational ? <details className="border-line rounded-md border p-4 text-meta text-ink-muted">
        <summary className="text-body text-ink cursor-pointer py-1 font-semibold">{en ? "About mathematical verification" : "Về kiểm chứng toán học"}</summary>
        <div className="mt-3 max-w-[76ch] space-y-3 leading-relaxed">
          <p>{en ? "Formula preview displays notation; it does not prove a statement. An AI proposal is not an accepted proof." : "Xem trước công thức chỉ hiển thị ký hiệu, không chứng minh phát biểu. Đề xuất của AI chưa phải chứng minh đã được chấp nhận."}</p>
          <p>{en ? "An exact computation checks only its stated input and scope. A formal proof also requires the intended mathematical statement to be correctly formalized." : "Phép tính chính xác chỉ kiểm đầu vào và phạm vi đã nêu. Chứng minh hình thức còn cần diễn đạt đúng phát biểu toán học dự định kiểm."}</p>
          <p>{en ? "HIVE has a legacy Lean 4.10 pilot for fixed targets, using Std and independent replay code. This research desk is not connected to arbitrary-problem Lean checking, and preparing a note does not run Lean." : "HIVE có thử nghiệm Lean 4.10 cho các mục tiêu cố định, dùng Std và mã phát lại độc lập. Bàn nghiên cứu này chưa kết nối chức năng kiểm Lean cho bài toán tùy ý, và soạn ghi chú không chạy Lean."}</p>
        </div>
      </details> : null}
    </div>
  </form>;
}
