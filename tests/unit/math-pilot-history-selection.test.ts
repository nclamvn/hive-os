import { describe, expect, it } from "vitest";
import { selectMathPilotHistory } from "@/components/research/math-pilot-history-selection";

const cases = [{ id: "proof", caseType: "CALIBRATION_PROOF" }, { id: "root", caseType: "OPEN" }];
const cycles = [
  { rootCaseId: "root", id: "latest" },
  { rootCaseId: "root", id: "prior" },
  { rootCaseId: "proof", id: "proof-cycle" },
  { rootCaseId: "another-mission", id: "must-not-appear" },
];

describe("authorized mission history presentation selection", () => {
  it.each([undefined, ""])("keeps default All for missing/empty query %s", (query) => {
    const result = selectMathPilotHistory(cases, cycles, query);
    expect(result.mode).toBe("ALL");
    expect(result.selectedCaseId).toBeNull();
    expect(result.cases).toEqual(cases);
    expect(result.cycles.map((item) => item.id)).toEqual(["latest", "prior", "proof-cycle"]);
  });

  it("keeps only a selected authorized case and its complete loaded cycle history in order", () => {
    const result = selectMathPilotHistory(cases, cycles, "root");
    expect(result.mode).toBe("SELECTED");
    expect(result.selectedCaseId).toBe("root");
    expect(result.cases).toEqual([cases[1]]);
    expect(result.cycles.map((item) => item.id)).toEqual(["latest", "prior"]);
    // Presentation filtering does not mutate calibration input.
    expect(cases).toHaveLength(2);
    expect(cases[0].caseType).toBe("CALIBRATION_PROOF");
    expect(cycles).toHaveLength(4);
  });

  it.each(["unknown", "another-mission", ["root", "proof"], ["root"], null, 12])(
    "fails closed for invalid, cross-mission or repeated query %s", (query) => {
      const result = selectMathPilotHistory(cases, cycles, query);
      expect(result.mode).toBe("INVALID");
      expect(result.selectedCaseId).toBeNull();
      expect(result.cases).toEqual([]);
      expect(result.cycles).toEqual([]);
    },
  );

  it("does not expose a cycle whose root was not authorized/loaded", () => {
    expect(selectMathPilotHistory([], cycles, undefined).cycles).toEqual([]);
    expect(selectMathPilotHistory([], cycles, "root").mode).toBe("INVALID");
  });
});
