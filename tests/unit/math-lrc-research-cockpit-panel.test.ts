import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MathLrcResearchCockpitPanel } from "@/components/research/math-lrc-research-cockpit-panel";
import { projectLrcResearchCockpitPresentation } from "@/components/research/math-lrc-research-cockpit-presentation";
import type { LrcResearchCockpitRecord } from "@/components/research/math-lrc-research-cockpit-presentation";
import { cockpitFixture } from "./math-lrc-research-cockpit-fixture";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { MATH_LRC_METHOD_UNIT_CONTRACT, digestMathPilotContract } from "@/modules/research-sandbox/math-pilot";
const record = { caseId: "new-case", runId: "new-run", contract: { version: 4 }, contractDigest: "0".repeat(64),
  attempt: null, attemptDigest: null, researchDigest: "0".repeat(64), review: null };
const render = (locale: string, value: LrcResearchCockpitRecord = record) => renderToStaticMarkup(createElement(MathLrcResearchCockpitPanel,
  { locale, toolsBase: "/w/different-tenant/research/math-tools", record: value }));
describe("passive unified research cockpit baseline", () => {
  it.each(["vi", "en"])("%s renders genuine math and scoped counts without proof percentages", locale => {
    const html = render(locale); expect(html).toContain("436"); expect(html).toContain("61"); expect(html).toContain("71");
    expect(html).toContain("NOT_ESTABLISHED"); expect(html).toContain("NO_SOURCE_ADOPTION");
    expect(html.match(/encoding="application\/x-tex"/g)?.length).toBe(3);
    expect(html).not.toContain("katex-error"); expect(html).not.toMatch(/<form|<script|<textarea|setInterval/);
    expect(html).not.toMatch(/\d+%|PROVED|100%/); expect(html).toContain("max-w-[76ch]");
    expect(html).toContain("min-w-0"); expect(html).toContain("overflow-x-auto");
    expect(html).toContain('href="/w/different-tenant/research/math-tools?view=allikvere-proof#allikvere-proof"');
    expect(html).not.toContain("mathematics-pilot-lab-156de0");
    expect(html).toContain(locale === "vi" ? "hàm ý trọng yếu" : "critical implication");
  });
  it("has native archive/full-register disclosures, not a heavy historical import", () => {
    const html = render("en"); expect(html.match(/<details/g)?.length).toBe(3);
    expect(html).toContain("Retained finite p83 certificates belong to their separate history");
    expect(html).toContain("not fresh checks or automatically admitted v2 master implications");
  });
  it("does not invent an active strategy from the baseline or latest case", () => {
    const view = projectLrcResearchCockpitPresentation(record);
    expect(view.strategy).toBeNull(); expect(view.roles).toEqual([]); expect(view.program.criticalPath).toHaveLength(436);
    expect(view.program.roots.every(root => !root.conditionalClosure)).toBe(true);
    expect(render("en")).toContain("No strategy decision is retained");
  });
  it("shows precise historical UNKNOWN and unavailable data without reconstructing failed064", () => {
    const html = render("en", { ...record, caseId: "b396580a-7bc7-4a8d-a966-0ad3eaa3e246" });
    expect(html).toContain("precise cause remains UNKNOWN"); expect(html).toContain("usage is unavailable");
    expect(html).toContain("adversary and critic did not run"); expect(html).not.toContain("inputTokens: 0");
  });
  it("rejects malformed family content without displaying fabricated prose or accepted results", () => {
    const value = { ...record, attempt: { lrcMethodUnitFeedback: "<script>ACCEPTED PROOF</script>" } };
    expect(render("en", value)).not.toContain("ACCEPTED PROOF");
    expect(projectLrcResearchCockpitPresentation(value).recordState).toBe("INVALID");
  });
  it.each(["vi", "en"])("%s shows real bound roles/finite result and retained strategy without global closure", locale => {
    const value = cockpitFixture(), view = projectLrcResearchCockpitPresentation(value), html = render(locale, value);
    expect(view.recordState).toBe("ADMITTED"); expect(view.reviewState).toBe("VALID");
    expect(view.roles.map(role => role.role)).toEqual(["SOLVER", "ADVERSARY", "CRITIC"]);
    expect(view.finiteEvidence?.status).toBe("CHECKED_FINITE"); expect(view.finiteEvidence?.result?.goodShiftIndices).toEqual([1]);
    expect(view.program.roots.every(root => !root.conditionalClosure)).toBe(true);
    for (const role of view.roles) for (const text of [role.context, role.input.inputDigest, role.input.schemaDigest, role.feedback.summary]) expect(html.includes(text)).toBe(true);
    expect(html.includes("1234 / 123")).toBe(true); expect(html.includes("789 / 456")).toBe(true);
    expect(html.includes("b^-1*t date2026-10-04")).toBe(true);
    expect(html.includes("LOWER_CONTINUOUS_WITNESS")).toBe(true); expect(html.includes("PHASE_CELL_SYMBOLIC_ALIGNMENT")).toBe(true);
    expect(html).not.toContain("HOST_LRC_METHOD_UNIT_RENDERER_V1"); expect(html).not.toContain('"outputSchema"');
  });
  it("missing seed is MISSING/INCONCLUSIVE and not invented zero counters", () => {
    const value = cockpitFixture({ missingSeed: true }), view = projectLrcResearchCockpitPresentation(value), html = render("en", value);
    expect(view.reviewState).toBe("VALID"); expect(view.finiteEvidence?.status).toBe("MISSING");
    expect(view.finiteEvidence?.checker).toBeNull(); expect(view.ledger?.lrcMethodUnitAuditSummary.status).toBe("INCONCLUSIVE");
    expect(html).toContain("Missing seed means no finite checker execution"); expect(html).not.toContain("Retained checker elapsed (ms)");
  });
  it("coherently retained ungrounded quote remains inconclusive with explicit warning", () => {
    const value = cockpitFixture({ ungroundedQuote: true }), view = projectLrcResearchCockpitPresentation(value), html = render("en", value);
    expect(view.reviewState).toBe("VALID"); expect(view.ledger?.oracle.groundedQuotes).toBe(false);
    expect(view.ledger?.lrcMethodUnitAuditSummary.status).toBe("INCONCLUSIVE");
    expect(html).toContain("This quotation does not match the solver verbatim");
  });
  it("escapes original mathematical/check prose, no automatic TeX or date conversion", () => {
    const literal = String.raw`<img src=x onerror=alert(1)> $\href{javascript:bad}{x}$ date2026-10-04 b^-1*t`;
    const html = render("en", cockpitFixture({ literal })); expect(html).toContain("&lt;img");
    expect(html).toContain(literal.slice(literal.indexOf("$"))); expect(html).not.toContain("<img src=x");
    expect(html).not.toContain('href="javascript:bad"'); expect(html.match(/encoding="application\/x-tex"/g)?.length).toBe(3);
  });
  it.each(["case", "run", "sourcePins", "reviewJob", "ledger", "criticBinding", "usage"])("%s fault never presents valid ledger", fault => {
    const value = cockpitFixture();
    if (fault === "case") value.caseId = "wrong-case";
    if (fault === "run") value.runId = "wrong-run";
    if (fault === "sourcePins") value.finiteSourcePins!.checkerSourceSha256 = "e".repeat(64);
    if (fault === "reviewJob") value.reviewJobId = "different-job";
    const review = value.review as { ledger: Record<string, unknown>; ledgerDigest: string };
    if (fault === "ledger") review.ledgerDigest = "e".repeat(64);
    if (fault === "criticBinding") {
      const reports = review.ledger.reports as { lrcMethodUnitInput: { finiteEvidenceDigest: string } }[];
      reports[1].lrcMethodUnitInput.finiteEvidenceDigest = "e".repeat(64); review.ledgerDigest = sha256(canonicalJson(review.ledger));
    }
    if (fault === "usage") {
      const reports = review.ledger.reports as { usage: { cachedInputTokens: number } }[];
      reports[0].usage.cachedInputTokens = 99999; review.ledgerDigest = sha256(canonicalJson(review.ledger));
    }
    const view = projectLrcResearchCockpitPresentation(value); expect(view.reviewState).not.toBe("VALID"); expect(view.finiteEvidence).toBeNull();
    expect(view.roles.length).toBeLessThan(3);
  });
  it("absent external pins never trusts a potentially coherent ledger's own source hashes", () => {
    const value = cockpitFixture(); delete value.finiteSourcePins;
    const view = projectLrcResearchCockpitPresentation(value); expect(view.reviewState).toBe("INVALID"); expect(view.finiteEvidence).toBeNull();
    expect(render("en", value)).toContain("trusted host source pins unavailable");
  });
  it("valid retained request with no solver output is MISSING, not malformed or an invented running strategy", () => {
    const value = { ...record, contract: MATH_LRC_METHOD_UNIT_CONTRACT, contractDigest: digestMathPilotContract(MATH_LRC_METHOD_UNIT_CONTRACT), runStatus: "FAILED" };
    const view = projectLrcResearchCockpitPresentation(value); expect(view.recordState).toBe("MISSING");
    expect(view.strategy?.targetedObligationId).toBe("FEW_EXCEPTION_SHIFT_14"); expect(view.runStatus).toBe("FAILED");
    expect(view.roles).toEqual([]); expect(view.finiteEvidence).toBeNull(); expect(view.operationalCause).toBe("UNKNOWN");
    expect(render("en", value)).not.toContain("record failed binding admission");
  });
  it("missing actual review job identity refuses valid-looking ledger", () => {
    const value = cockpitFixture(); delete value.reviewJobId;
    const view = projectLrcResearchCockpitPresentation(value); expect(view.reviewState).toBe("INVALID"); expect(view.finiteEvidence).toBeNull();
  });
});
