import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { AuthoringContent } from "@/modules/authoring/contracts";
import { applyAuthoringUpdate, checkUpdatePack, parseUpdatePack, prepareAuthoringUpdate, type UpdatePack } from "@/modules/authoring/update-pack";
import { AuthoringUpdatePanel } from "@/components/authoring/authoring-update-panel";

const content: AuthoringContent = { title: "Test proposal", abstract: "Scenario only", sections: [
  { key: "scope", heading: "Scope", kind: "NARRATIVE", body: "Old scope" },
  { key: "risk", heading: "Risk", kind: "RISK", body: "Unknown site" },
], citations: [{ key: "source", title: "Source", canonicalUri: "https://example.com", authors: "", year: "", publisher: "", locator: "", evidenceSourceId: null, researchRunId: null, researchSourceId: null, sourceDigest: null }], computationalArtifacts: [], researchImports: [] };
function pack(): UpdatePack { return { schema: "hive-os.authoring-update.v1", documentId: "doc", baseRevision: 1, request: "Revise area", sourceContext: "User scenario, not a verified quote", unknowns: ["Site"], patches: [{ sectionKey: "scope", oldBody: "Old scope", newBody: "New scope" }], cost: { currency: "VND", lines: [{ label: "Survey", quantity: 1.2, quantityUnit: "km2", unitPrice: 100, priceUnit: "ha", excludedReason: null }], claimedTotal: 12000 }, comparisons: [{ label: "Error", measured: 57, unit: "cm", threshold: 0.57, thresholdUnit: "m", operator: "AT_MOST" }] }; }
const apply = (p: unknown, c = content, write = true) => applyAuthoringUpdate(p, c, "doc", 1, "en", write);

describe("bounded authoring update packets", () => {
  it("applies atomically without mutating input and retains provenance / headings / kinds", () => {
    const before = JSON.stringify(content); const r = apply(pack());
    expect(JSON.stringify(content)).toBe(before);
    expect(r.next.sections[0]).toEqual({ ...content.sections[0], body: "New scope" });
    expect(r.next.sections[1]).toEqual(content.sections[1]);
    expect(r.next.citations).toEqual(content.citations);
    expect(r.next.computationalArtifacts).toEqual(content.computationalArtifacts);
    expect(r.next.researchImports).toEqual(content.researchImports);
    expect(r.appendix.body).toContain("User scenario"); expect(r.appendix.body).toContain("not independently verified");
    expect(r.summary.length).toBeLessThanOrEqual(1000);
  });
  it.each(["doc", "revision", "body", "duplicate", "unknown"])("rejects %s mismatch without partial changes", (issue) => {
    const p = pack(); const before = JSON.stringify(content);
    if (issue === "doc") p.documentId = "elsewhere";
    if (issue === "revision") p.baseRevision = 2;
    if (issue === "body") p.patches[0].oldBody += "!";
    if (issue === "duplicate") p.patches.push(p.patches[0]);
    if (issue === "unknown") p.patches.push({ sectionKey: "missing", oldBody: "", newBody: "Bad" });
    expect(() => apply(p)).toThrow(); expect(JSON.stringify(content)).toBe(before);
  });
  it("requires write permission at helper boundary", () => { expect(() => apply(pack(), content, false)).toThrow("permission"); });
  it("rejects changed body after preview", () => {
    const p = pack(); prepareAuthoringUpdate(p, content, "doc", 1, "en", true);
    expect(() => apply(p, { ...content, sections: [{ ...content.sections[0], body: "Later edit" }, content.sections[1]] })).toThrow("Stale");
  });
  it("ha and km2 agree and exact decimal threshold equality is retained", () => {
    expect(checkUpdatePack(pack()).every((c) => c.status === "MATCH")).toBe(true);
    const p = pack(); p.cost!.lines[0].quantity = 120; p.cost!.lines[0].quantityUnit = "ha";
    expect(checkUpdatePack(p).at(-2)?.status).toBe("MATCH");
  });
  it("keeps unknown cost unknown, never zero, and rejects an unsupported numeric total", () => {
    const p = pack(); p.cost!.lines[0].quantity = null; p.cost!.claimedTotal = null;
    expect(checkUpdatePack(p).slice(0, 2).map((c) => c.status)).toEqual(["UNKNOWN", "UNKNOWN"]);
    expect(apply(p).blocked).toBe(false);
    p.cost!.claimedTotal = 0; expect(() => apply(p)).toThrow("Correct");
    p.cost!.lines[0].quantity = 0; expect(checkUpdatePack(p)[1].status).toBe("MATCH");
  });
  it("excludes explicitly bundled cost only with a nonblank reason", () => {
    const p = pack(); p.cost!.lines.push({ ...p.cost!.lines[0], quantity: null, unitPrice: null, label: "Travel", excludedReason: "Included in survey package" });
    expect(checkUpdatePack(p)[1].status).toBe("EXCLUDED"); expect(apply(p).blocked).toBe(false);
    p.cost!.lines[1].excludedReason = " "; expect(() => apply(p)).toThrow();
  });
  it("rejects incorrect totals and incompatible units", () => {
    const p = pack(); p.cost!.claimedTotal = 12001; expect(() => apply(p)).toThrow("Correct");
    p.cost!.lines[0].priceUnit = "item"; expect(checkUpdatePack(p)[0].status).toBe("INVALID");
  });
  it.each([-1, NaN, Infinity, 1e9 + 1])("rejects invalid numeric input %s", (n) => {
    const p = pack(); p.cost!.lines[0].quantity = n; expect(() => checkUpdatePack(p)).toThrow();
  });
  it("caps line and summed cost and supports totals above 1e9", () => {
    const p = pack(); p.cost!.lines[0] = { ...p.cost!.lines[0], quantity: 100, quantityUnit: "ha", unitPrice: 1e9 }; p.cost!.claimedTotal = 1e11;
    expect(checkUpdatePack(p)[1].status).toBe("MATCH");
    p.cost!.lines[0].quantity = 1e9; expect(checkUpdatePack(p)[0].status).toBe("INVALID");
  });
  it("rounds each exact declared decimal cost half up, then sums", () => {
    const p = pack(); p.cost!.lines = [1.005, 0.105].map((price) => ({ label: "Decimal", quantity: 1, quantityUnit: "item", unitPrice: price, priceUnit: "item", excludedReason: null })); p.cost!.claimedTotal = 1.12;
    expect(checkUpdatePack(p).slice(0, 3).map((c) => c.status)).toEqual(["MATCH", "MATCH", "MATCH"]);
  });
  it("retains negative threshold findings while distinguishing unknown/invalid units", () => {
    const p = pack(); p.comparisons[0].measured = 58;
    expect(checkUpdatePack(p).at(-1)?.status).toBe("NOT_MET"); expect(apply(p).blocked).toBe(false);
    p.comparisons[0].operator = "AT_LEAST"; expect(checkUpdatePack(p).at(-1)?.status).toBe("MATCH");
    p.comparisons[0].measured = null; expect(checkUpdatePack(p).at(-1)?.status).toBe("UNKNOWN");
    p.comparisons[0].thresholdUnit = "ha"; expect(checkUpdatePack(p).at(-1)?.status).toBe("INVALID");
  });
  it("does not overwrite an existing appendix and respects 64-section limit", () => {
    const c = { ...content, sections: [...content.sections, { key: "update-evidence-r2", heading: "User appendix", body: "Keep", kind: "APPENDIX" as const }] };
    expect(apply(pack(), c).appendix.key).toBe("update-evidence-r2-2");
    c.sections = [...c.sections, ...Array.from({ length: 61 }, (_, i) => ({ ...content.sections[0], key: `other-${i}` }))];
    expect(() => apply(pack(), c)).toThrow();
  });
  it("rejects malformed, oversize and extra-field packets", () => {
    expect(() => parseUpdatePack("x".repeat(1_000_001))).toThrow("exceeds");
    expect(() => parseUpdatePack("{nope")).toThrow();
    expect(() => apply({ ...pack(), approved: true })).toThrow();
  });
  it.each(["en", "vi"] as const)("renders a collapsed, read-only-safe %s panel", (locale) => {
    const html = renderToStaticMarkup(createElement(AuthoringUpdatePanel, { content, documentId: "doc", revision: 1, locale, canWrite: false, onApply: () => { throw new Error("unexpected write"); } }));
    expect(html).not.toMatch(/<details[^>]*open/); expect(html).toContain('disabled=""');
    expect(html).toContain(locale === "en" ? "Manual Codex bridge" : "Cầu nối Codex thủ công");
  });
});
