import { describe, expect, it } from "vitest";
import { isLrcResearchProgramRecord } from "@/components/research/math-lrc-research-cockpit-family";
describe("method-family classification is wider than admission", () => {
  it.each([4, "4"])("classifies malformed contract version %s", version => expect(isLrcResearchProgramRecord({ version })).toBe(true));
  it.each([7, "7"])("classifies malformed ledger version %s", version => expect(isLrcResearchProgramRecord({}, null, { version })).toBe(true));
  it.each(["lrcMethodUnitScope", "lrcMethodUnitEvidence", "lrcMethodUnitFeedback", "lrcMethodUnitInput", "lrcMethodUnitAuditSummary",
    "lrcMethodUnitFiniteSeed", "lrcMethodUnitFiniteEvidence", "methodUnitEvidenceValid", "methodUnitInputBindingsValid", "methodUnitFindingsComplete", "methodInputBindingsValid", "finiteEvidenceValid"])("classifies null marker %s in every read surface", key => {
    expect(isLrcResearchProgramRecord({ [key]: null })).toBe(true);
    expect(isLrcResearchProgramRecord({}, { [key]: null })).toBe(true);
    expect(isLrcResearchProgramRecord({}, null, { [key]: null })).toBe(true);
    expect(isLrcResearchProgramRecord({}, null, { reports: [{ [key]: null }] })).toBe(true);
    expect(isLrcResearchProgramRecord({}, null, { oracle: { [key]: null } })).toBe(true);
  });
  it("does not reinterpret legacy contracts/ledgers or empty records", () => {
    for (const version of [1, 2, 3]) expect(isLrcResearchProgramRecord({ version })).toBe(false);
    for (const version of [1, 2, 3, 4, 5, 6]) expect(isLrcResearchProgramRecord({}, null, { version })).toBe(false);
    expect(isLrcResearchProgramRecord(null, null, null)).toBe(false);
  });
});
