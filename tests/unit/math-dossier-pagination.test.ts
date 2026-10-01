import { describe, expect, it } from "vitest";
import { decodeDossierCursor, encodeDossierCursor, olderThanCursor, parseDossierQuery } from "@/modules/research-sandbox/math-dossier-pagination";
const missionId = "00000000-0000-4000-8000-000000000001";
const caseId = "00000000-0000-4000-8000-000000000002";
const id = "00000000-0000-4000-8000-000000000003";
describe("bounded dossier query identity", () => {
  it("binds a stable tuple cursor to mission and selected case, including tied timestamps", () => {
    const raw = encodeDossierCursor({ missionId, scopeId: caseId, id, createdAt: "2026-10-01T00:00:00.000Z" });
    const query = parseDossierQuery({ caseId, cyclesAfter: raw }, missionId);
    expect(query.cyclesAfter?.id).toBe(id);
    expect(olderThanCursor(query.cyclesAfter)).toEqual({ OR: [{ createdAt: { lt: new Date("2026-10-01") } },
      { createdAt: new Date("2026-10-01"), id: { lt: id } }] });
    expect(() => decodeDossierCursor(raw, id, caseId)).toThrow();
    expect(() => decodeDossierCursor(raw, missionId, id)).toThrow();
  });
  it.each([[caseId], [caseId, id], null, 1, "not-an-id"])("rejects malformed or duplicate selected case %s", (caseId) => {
    expect(() => parseDossierQuery({ caseId }, missionId)).toThrow();
  });
  it.each([["cursor"], "{bad}", "a".repeat(513), "YWJj"])("rejects malformed or duplicate cursor %s", (casesAfter) => {
    expect(() => parseDossierQuery({ casesAfter }, missionId)).toThrow();
  });
  it("keeps default selection empty without manufacturing an identity", () => {
    expect(parseDossierQuery({}, missionId)).toEqual({ caseId: null, cycleId: null, casesAfter: null, cyclesAfter: null });
  });
  it("requires an explicit case for a historical full-cycle link and rejects conflicting navigation", () => {
    expect(() => parseDossierQuery({ cycleId: id }, missionId)).toThrow();
    expect(() => parseDossierQuery({ caseId, cycleId: [id] }, missionId)).toThrow();
    expect(() => parseDossierQuery({ caseId, cycleId: id, cyclesAfter: "" }, missionId)).toThrow();
    expect(parseDossierQuery({ caseId, cycleId: id }, missionId).cycleId).toBe(id);
  });
});
