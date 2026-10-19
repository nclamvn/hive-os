import { z } from "zod";
import { LEAN_DRAFT_LIFETIME_MS } from "./lean-workbench-draft";

/** Same explicit tab-local input-draft pattern as the legacy workbench. Never
 * restore results, prompts, source snapshots, receipts or execution status. */
export const RESEARCH_NOTE_DRAFT_LIFETIME_MS = LEAN_DRAFT_LIFETIME_MS;
const inputSchema = z.object({
  goal: z.string().max(8000), guidance: z.string().max(4000), mode: z.enum(["HUMAN", "AUTO"]),
  missionId: z.string().max(160), documentId: z.string().max(160), parentId: z.string().max(160),
  allowedDomains: z.string().max(13000), primaryDomains: z.string().max(13000),
  requirePrimary: z.boolean(), queries: z.string().max(11000), maxSources: z.string().max(3),
}).strict();
export type ResearchNoteInputs = z.infer<typeof inputSchema>;
export type ResearchNoteDraft = { version: 1; savedAt: number; input: ResearchNoteInputs };
export type ResearchDraftMessage = "READ_UNAVAILABLE" | "SAVE_FAILED" | "SAVED" | "MISSING" | "REFERENCES_CHANGED" | "RESTORED" | "DELETE_FAILED" | "DELETED";
const messageText: Record<ResearchDraftMessage, Record<"en" | "vi", string>> = {
  READ_UNAVAILABLE: { en: "The saved draft is unavailable: browser storage is blocked, invalid or expired. Your current text is unchanged.", vi: "Chưa đọc được bản nháp: bộ nhớ bị chặn, dữ liệu không hợp lệ hoặc đã hết hạn. Giữ nguyên nội dung đang nhập." },
  SAVE_FAILED: { en: "Draft not saved. Browser storage may be blocked or full; copy or download your note before leaving.", vi: "Chưa lưu được bản nháp. Bộ nhớ có thể bị chặn hoặc đầy; hãy sao chép hoặc tải ghi chú trước khi rời trang." },
  SAVED: { en: "Inputs saved in this tab for this account and workspace, for up to 24 hours. No AI result or verification is saved.", vi: "Đã lưu đầu vào trong tab cho tài khoản và không gian này, tối đa 24 giờ. Không lưu kết quả AI hay trạng thái kiểm chứng." },
  MISSING: { en: "The draft is no longer available. Current text is unchanged.", vi: "Bản nháp không còn khả dụng. Giữ nguyên nội dung đang nhập." },
  REFERENCES_CHANGED: { en: "A related record is missing or has changed. The draft was not restored; your current text and saved draft are retained.", vi: "Hồ sơ liên quan không còn có sẵn hoặc đã thay đổi. Chưa khôi phục, giữ nguyên nội dung hiện tại và bản nháp đã lưu." },
  RESTORED: { en: "Inputs restored only. No AI, search or verification has run. Prepare the note again when ready.", vi: "Chỉ khôi phục đầu vào. Chưa chạy AI, tìm tài liệu hay kiểm chứng. Bạn có thể chuẩn bị lại ghi chú khi sẵn sàng." },
  DELETE_FAILED: { en: "The browser did not allow deleting the saved draft. Current text is unchanged.", vi: "Trình duyệt chưa cho xóa bản nháp đã lưu. Nội dung đang nhập không thay đổi." },
  DELETED: { en: "Saved draft deleted. Your current text stays on this page.", vi: "Đã xóa bản nháp đã lưu. Giữ nguyên nội dung đang nhập trên trang." },
};
export function researchDraftMessageText(message: ResearchDraftMessage, locale: "en" | "vi") {
  return messageText[message][locale];
}
type StorageAccess = () => Pick<Storage, "getItem" | "setItem" | "removeItem">;
export function researchNoteDraftKey(userId: string, workspaceId: string) {
  return `hive:research-note-draft:v1:${encodeURIComponent(userId)}:${encodeURIComponent(workspaceId)}`;
}
export function parseResearchNoteDraft(raw: string, now = Date.now()): ResearchNoteDraft | null {
  if (raw.length > 100000) return null;
  try {
    const draft = z.object({ version: z.literal(1), savedAt: z.number().finite(), input: inputSchema }).strict().parse(JSON.parse(raw));
    if (draft.savedAt > now || now - draft.savedAt >= RESEARCH_NOTE_DRAFT_LIFETIME_MS) return null;
    return draft;
  } catch { return null; }
}
export function readResearchNoteDraft(storage: StorageAccess, key: string, now = Date.now()) {
  try {
    const raw = storage().getItem(key);
    if (raw === null) return { draft: null, error: false };
    const draft = parseResearchNoteDraft(raw, now);
    if (!draft) storage().removeItem(key);
    return { draft, error: !draft };
  } catch { return { draft: null, error: true }; }
}
export function saveResearchNoteDraft(storage: StorageAccess, key: string, input: ResearchNoteInputs, now = Date.now()) {
  try {
    const draft = parseResearchNoteDraft(JSON.stringify({ version: 1, savedAt: now, input }), now);
    if (!draft) return false;
    storage().setItem(key, JSON.stringify(draft)); return true;
  } catch { return false; }
}
export function deleteResearchNoteDraft(storage: StorageAccess, key: string) {
  try { storage().removeItem(key); return true; } catch { return false; }
}
/** Reference identifiers are pointers only. Their contents still come from the
 * current authenticated page; an old local draft cannot mint inherited context. */
export function researchDraftReferencesAvailable(input: ResearchNoteInputs, available: {
  missions: Array<{ id: string }>;
  documents: Array<{ id: string; missionId: string }>;
  parents: Array<{ id: string; missionId: string; documentId: string | null; question: string }>;
}) {
  if (input.missionId && !available.missions.some((item) => item.id === input.missionId)) return false;
  if (input.documentId && !available.documents.some((item) => item.id === input.documentId && item.missionId === input.missionId)) return false;
  if (input.parentId && !available.parents.some((item) => item.id === input.parentId && item.missionId === input.missionId &&
    (item.documentId ?? "") === input.documentId && item.question === input.goal)) return false;
  return true;
}
export function researchDraftNeedsConfirmation(current: ResearchNoteInputs, saved: ResearchNoteInputs, initial: ResearchNoteInputs) {
  return JSON.stringify(current) !== JSON.stringify(saved) && JSON.stringify(current) !== JSON.stringify(initial);
}
