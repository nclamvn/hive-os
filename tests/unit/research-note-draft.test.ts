import { describe, expect, it } from "vitest";
import { deleteResearchNoteDraft, parseResearchNoteDraft, readResearchNoteDraft, RESEARCH_NOTE_DRAFT_LIFETIME_MS, researchDraftMessageText, researchDraftNeedsConfirmation, researchDraftReferencesAvailable, researchNoteDraftKey, saveResearchNoteDraft, type ResearchDraftMessage, type ResearchNoteInputs } from "@/components/research/research-note-draft";

const input: ResearchNoteInputs = { goal: "Prove $a^2+b^2=k(ab+1)$ under the stated assumptions.", guidance: "Try a descent without assuming positivity.", mode: "HUMAN", missionId: "m", documentId: "d", parentId: "", allowedDomains: "arxiv.org", primaryDomains: "arxiv.org", requirePrimary: true, queries: "a bounded literature question", maxSources: "12" };
const now = 100000000;
const encode = (change: Record<string, unknown> = {}) => JSON.stringify({ version: 1, savedAt: now, input, ...change });
function memory() { const values = new Map<string, string>(); return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } }; }
describe("explicit research-note tab draft, inputs only", () => {
  it.each(["READ_UNAVAILABLE", "SAVE_FAILED", "SAVED", "MISSING", "REFERENCES_CHANGED", "RESTORED", "DELETE_FAILED", "DELETED"] as ResearchDraftMessage[])("system status %s translates from its code at render time", (code) => {
    expect(researchDraftMessageText(code, "en")).not.toBe(researchDraftMessageText(code, "vi"));
    expect(researchDraftMessageText(code, "en")).toMatch(/draft|inputs/i);
  });
  it("round-trips exact prose/TeX, modes and source/reference inputs without generated notes", () => {
    expect(parseResearchNoteDraft(encode(), now)).toEqual({ version: 1, savedAt: now, input });
    expect(parseResearchNoteDraft(encode({ input: { ...input, mode: "AUTO", guidance: "" } }), now)?.input.mode).toBe("AUTO");
  });
  it.each([{ receipt: { result: "VERIFIED" } }, { result: "proved" }, { status: "QUEUED" }, { note: "AI-generated proof" }])("rejects extra non-input storage fields %j", (extra) => {
    expect(parseResearchNoteDraft(encode(extra), now)).toBeNull();
    expect(parseResearchNoteDraft(encode({ input: { ...input, ...extra } }), now)).toBeNull();
  });
  it.each(["{", "[]", "null", encode({ version: 2 }), encode({ savedAt: now + 1 }), encode({ savedAt: now - RESEARCH_NOTE_DRAFT_LIFETIME_MS }), encode({ input: { ...input, mode: "SWARM" } }), encode({ input: { ...input, goal: "x".repeat(8001) } }), " ".repeat(100001)])("rejects malformed, future, expired and unbounded data %#", (raw) => {
    expect(parseResearchNoteDraft(raw, now)).toBeNull();
  });
  it("separates accounts/workspaces and cannot collide through separators", () => {
    expect(new Set([researchNoteDraftKey("a", "b"), researchNoteDraftKey("other", "b"), researchNoteDraftKey("a", "other"), researchNoteDraftKey("a:b", "c"), researchNoteDraftKey("a", "b:c")]).size).toBe(5);
  });
  it("reads do not save; only explicit save changes the selected key", () => {
    const storage = memory(), key = researchNoteDraftKey("user", "workspace");
    expect(readResearchNoteDraft(() => storage, key, now)).toEqual({ draft: null, error: false });
    expect(storage.getItem(key)).toBeNull();
    expect(saveResearchNoteDraft(() => storage, key, input, now)).toBe(true);
    expect(readResearchNoteDraft(() => storage, key, now).draft?.input).toEqual(input);
    storage.setItem("other-key", "untouched"); expect(deleteResearchNoteDraft(() => storage, key)).toBe(true);
    expect(storage.getItem(key)).toBeNull(); expect(storage.getItem("other-key")).toBe("untouched");
  });
  it("clears expired/corrupt local data only at its own scoped key", () => {
    const storage = memory(); storage.setItem("ours", encode({ savedAt: 0 })); storage.setItem("other", encode());
    expect(readResearchNoteDraft(() => storage, "ours", now)).toEqual({ draft: null, error: true });
    expect(storage.getItem("ours")).toBeNull(); expect(storage.getItem("other")).not.toBeNull();
  });
  it("blocked browser storage and quota failures do not throw or claim success", () => {
    const blocked = () => { throw new Error("blocked"); };
    expect(readResearchNoteDraft(blocked, "key", now)).toEqual({ draft: null, error: true });
    expect(saveResearchNoteDraft(blocked, "key", input, now)).toBe(false); expect(deleteResearchNoteDraft(blocked, "key")).toBe(false);
    const storage = memory(); storage.setItem("key", encode()); storage.setItem = () => { throw new Error("quota"); };
    expect(saveResearchNoteDraft(() => storage, "key", { ...input, guidance: "Changed" }, now)).toBe(false);
    expect(storage.getItem("key")).toBe(encode());
  });
  it("requires confirmation before overwriting edited inputs, not for empty/identical input", () => {
    const initial = { ...input, goal: "", guidance: "", documentId: "", mode: "AUTO" as const };
    expect(researchDraftNeedsConfirmation(initial, input, initial)).toBe(false);
    expect(researchDraftNeedsConfirmation(input, input, initial)).toBe(false);
    expect(researchDraftNeedsConfirmation({ ...input, guidance: "Unsaved idea" }, input, initial)).toBe(true);
  });
  it("rejects unavailable/mismatched references and forged inherited goal without restoring source snapshots", () => {
    const available = { missions: [{ id: "m" }], documents: [{ id: "d", missionId: "m" }], parents: [{ id: "p", missionId: "m", documentId: "d", question: input.goal }] };
    expect(researchDraftReferencesAvailable(input, available)).toBe(true);
    expect(researchDraftReferencesAvailable({ ...input, parentId: "p" }, available)).toBe(true);
    expect(researchDraftReferencesAvailable({ ...input, missionId: "other" }, available)).toBe(false);
    expect(researchDraftReferencesAvailable({ ...input, documentId: "missing" }, available)).toBe(false);
    expect(researchDraftReferencesAvailable({ ...input, parentId: "missing" }, available)).toBe(false);
    expect(researchDraftReferencesAvailable({ ...input, parentId: "p", goal: "Forged inherited goal" }, available)).toBe(false);
    expect(researchDraftReferencesAvailable({ ...input, missionId: "", documentId: "", parentId: "" }, { missions: [], documents: [], parents: [] })).toBe(true);
  });
});
