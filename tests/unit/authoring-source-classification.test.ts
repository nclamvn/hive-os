import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assessAuthoringQuality } from "@/modules/authoring/quality";
import { applyAuthoringUpdate, checkUpdatePack, prepareAuthoringUpdate, type UpdatePack } from "@/modules/authoring/update-pack";
import type { AuthoringContent } from "@/modules/authoring/contracts";
import { getAuthoringCopy } from "@/i18n/authoring-copy";

function contentFor(body: string): AuthoringContent {
  return { title: "Review", abstract: "", sections: [
    { key: "statement", heading: "TEST", kind: "NARRATIVE", body },
    { key: "risk-limitations", heading: "Limitations", kind: "RISK", body: "Inputs remain unverified." },
  ], citations: [], researchImports: [], computationalArtifacts: [] };
}
const review = (body: string) => assessAuthoringQuality("OTHER", contentFor(body));
const sourceWarnings = (body: string) => review(body).issues.filter((issue) => issue.code === "QUANTITATIVE_CLAIM_UNSOURCED");
function pack(): UpdatePack {
  return { schema: "hive-os.authoring-update.v1", documentId: "test-doc", baseRevision: 1,
    request: "Apply synthetic quote: 2 ha at 100 USD/ha.", sourceContext: "Synthetic quote, not a verified purchase or measurement.", unknowns: ["Actual site unknown"],
    patches: [{ sectionKey: "statement", oldBody: "Old content", newBody: "New content" }],
    cost: { currency: "USD", lines: [{ label: "Acquisition", quantity: 2, quantityUnit: "ha", unitPrice: 100, priceUnit: "ha", excludedReason: null }], claimedTotal: 200 }, comparisons: [] };
}
function updated(p = pack(), locale: "en" | "vi" = "en") {
  return prepareAuthoringUpdate(p, contentFor("Old content"), p.documentId, 1, locale, true).next;
}
function modifyEvidence(content: AuthoringContent, update: (raw: Record<string, unknown>, parts: string[]) => void) {
  const appendix = content.sections.at(-1)!;
  const parts = appendix.body.split("\n\n");
  const raw = JSON.parse(parts[1]); update(raw, parts); parts[1] = JSON.stringify(raw, null, 2); appendix.body = parts.join("\n\n");
}

describe("local declarations versus source claims", () => {
  it.each([
    "Diện tích đầu vào vẫn là 1.000 ha.", "Yêu cầu thật ban đầu chỉ nêu 1.000 ha.",
    "Input area remains 1000 ha.", "Original user request stated 1000 ha.",
    "Áp dụng giả lập QUOTE-X: 2 ha × 100 VND/ha thu nhận; QA độc lập một hạng mục 50 VND.",
    "Synthetic quote B: 2 ha at 100 USD/ha; QA price 50 USD.",
    "Chỉ xác định được tổng các dòng báo giá thử trước thuế là 105.000.000 VND.",
    "The synthetic quote pre-tax total is 200 USD.",
  ])("classifies explicit local declarations: %s", (body) => { expect(sourceWarnings(body)).toHaveLength(0); });

  it.each([
    "TEST. Độ chính xác đạt 99%.", "TEST. Accuracy achieved 99%.",
    "Dự toán giả lập: 2 ha × 100 VND/ha = 200 VND; khảo sát thực tế đã hoàn thành 2 ha.",
    "Synthetic quote: 2 ha × 100 USD/ha = 200 USD; the actual survey covered 2 ha.",
    "Synthetic quote: price is 200 USD but actual cost is 200 USD.",
    "Dự toán giả lập: 200 VND; đã thanh toán 900 VND.",
    "The synthetic quote total is 200 VND, supplier invoiced 900 VND.",
    "Synthetic quote: 200 USD; supplier invoiced one item 900 USD.",
    "Diện tích đầu vào là 2 ha, độ chính xác thực tế đạt 99%.",
    "Input area is 2 ha and measured accuracy is 99%.",
    "Synthetic quote: 2 ha at 100 USD/ha. The measured error is 32 cm.",
    "Dự toán giả lập: 200 VND; độ lệch đo được 0,32 m.",
    "MATCH | 200 USD. MATCH | Accuracy is 99%.",
  ])("does not grant synthetic/test/MATCH immunity: %s", (body) => { expect(sourceWarnings(body).length).toBeGreaterThan(0); });

  it.each([
    "Dự toán giả lập: 2 ha × 100 VND/ha = 200 VND; 1 hạng mục × 50 VND/hạng mục = 50 VND.",
    "Declared costs: 2 ha × 100 USD/ha = 200 USD; 200 + 50 = 250 USD.",
    "Dự toán: 1.000 ha × 100.000 VND/ha = 100.000.000 VND.",
    "Calculated costs: 1,000 ha × 100,000 USD/ha = 100,000,000 USD.",
    "Calculated cost: 1.5 ha × 100 USD/ha = 150 USD.",
  ])("replays only supported bounded cost expressions: %s", (body) => { expect(review(body).warningCount).toBe(0); });

  it.each([
    "Declared cost: 2 ha × 100 USD/ha = 201 USD.",
    "Dự toán giả lập: 100 + 50 = 140 VND.",
    "MATCH | 2 ha × 100 VND/item = 200 VND.",
    "Declared cost: 1.005 item × 2 USD/item = 2.01 USD.",
  ])("reports wrong/unsupported arithmetic separately from source review: %s", (body) => {
    const report = review(body); expect(report.issues.some((issue) => issue.code === "DECLARED_CALCULATION_REVIEW")).toBe(true);
    expect(report.issues.some((issue) => issue.code === "QUANTITATIVE_CLAIM_UNSOURCED")).toBe(false);
  });

  it("keeps unknown and future issue classifications conservative", () => {
    expect(sourceWarnings("A budget of 200 USD.")).toHaveLength(1);
    expect(sourceWarnings("APPENDIX: Measured error 32 cm.")).toHaveLength(1);
  });

  it("keeps citation and tool-trace blockers inside synthetic/calculation spans", () => {
    const report = review("Synthetic quote: 2 ha × 100 USD/ha = 200 USD [@MISSING]. turn7search2");
    expect(report.issues.map((i) => i.code)).toEqual(expect.arrayContaining(["UNRESOLVED_CITATION", "TOOL_TRACE_LEAK"]));
    expect(report.blockerCount).toBe(2);
  });
});

describe("declared evidence replay without source attestation", () => {
  it.each(["en", "vi"] as const)("recognizes exact generated evidence in %s without touching content", (locale) => {
    const content = updated(pack(), locale), before = JSON.stringify(content);
    expect(assessAuthoringQuality("OTHER", content).warningCount).toBe(0);
    expect(JSON.stringify(content)).toBe(before);
    const copy = getAuthoringCopy(locale);
    expect(copy.issue.DECLARED_EVIDENCE_REVIEW).toBeTruthy();
    expect(copy.issue.DECLARED_CALCULATION_REVIEW).toBeTruthy();
  });

  it.each(["request", "sourceContext", "unknowns", "label", "excludedReason", "comparison"])("scans empirical prose in valid %s fields", (field) => {
    const p = pack(); const claim = "Measured accuracy is 99%.";
    if (field === "request") p.request += ` ${claim}`;
    if (field === "sourceContext") p.sourceContext += ` ${claim}`;
    if (field === "unknowns") p.unknowns.push(claim);
    if (field === "label") p.cost!.lines[0].label = claim;
    if (field === "excludedReason") { p.cost!.lines[0].excludedReason = claim; p.cost!.claimedTotal = 0; }
    if (field === "comparison") p.comparisons.push({ label: claim, measured: 1, unit: "m", threshold: 2, thresholdUnit: "m", operator: "AT_MOST" });
    expect(assessAuthoringQuality("OTHER", updated(p)).issues.some((i) => i.code === "QUANTITATIVE_CLAIM_UNSOURCED")).toBe(true);
  });

  it.each(["total", "transcript", "unknown-target", "duplicate-target", "extra-field", "malformed", "appended-claim"])("fails closed on %s evidence", (change) => {
    const content = updated();
    modifyEvidence(content, (raw, parts) => {
      if (change === "total") (raw.cost as { claimedTotal: number }).claimedTotal = 201;
      if (change === "transcript") parts[2] = parts[2].replace("200 USD", "999 USD");
      if (change === "unknown-target") raw.updatedSections = ["missing"];
      if (change === "duplicate-target") raw.updatedSections = ["statement", "statement"];
      if (change === "extra-field") raw.verified = true;
      if (change === "appended-claim") parts[2] += "\nMeasured accuracy is 99%.";
    });
    if (change === "malformed") content.sections.at(-1)!.body = content.sections.at(-1)!.body.replace('"cost":', 'cost:');
    const report = assessAuthoringQuality("OTHER", content);
    expect(report.issues.some((i) => i.code === "DECLARED_EVIDENCE_REVIEW")).toBe(true);
    expect(report.status).toBe("REVIEW");
  });

  it("does not trust a recomputed MISMATCH transcript or any free-text citation/trace", () => {
    const p = pack(); p.cost!.claimedTotal = 201; p.unknowns.push("Missing source [@MISSING]. Raw turn7search2.");
    const report = assessAuthoringQuality("OTHER", updated(p));
    expect(report.issues.map((i) => i.code)).toEqual(expect.arrayContaining(["DECLARED_CALCULATION_REVIEW", "UNRESOLVED_CITATION", "TOOL_TRACE_LEAK"]));
  });

  it("keeps the frozen S3 content intact while eliminating its ten false source warnings", () => {
    const base = JSON.parse(readFileSync("artifacts/qa/button-ab-20261014/B_FINAL.json", "utf8"));
    const p = JSON.parse(readFileSync("artifacts/qa/uav-update-ab-20261014/B/S3.json", "utf8")) as UpdatePack;
    const before = JSON.stringify({ base, p });
    const content: AuthoringContent = { title: base.title, abstract: "Synthetic test", sections: base.sections.map((section: { key: string; body: string }) => ({ ...section, heading: section.key, kind: "NARRATIVE" })), citations: ["S1", "S2", "S3"].map((key) => ({ key, title: key, canonicalUri: "https://example.com", authors: "", year: "", publisher: "", locator: "", evidenceSourceId: null, researchRunId: null, researchSourceId: null, sourceDigest: null })), researchImports: [], computationalArtifacts: [] };
    const next = applyAuthoringUpdate(p, content, p.documentId, p.baseRevision, "vi", true).next;
    expect(assessAuthoringQuality("TECHNICAL_PROPOSAL", next)).toMatchObject({ score: 100, warningCount: 0, blockerCount: 0, noteCount: 4 });
    expect(JSON.stringify({ base, p })).toBe(before);
    // Same cost value in an empirical claim cannot inherit arithmetic status.
    next.sections.find((s) => s.key === "plan")!.body += "\nChi phí thực tế đã xác minh là 105.000.000 VND.";
    expect(assessAuthoringQuality("TECHNICAL_PROPOSAL", next).issues.some((i) => i.code === "QUANTITATIVE_CLAIM_UNSOURCED")).toBe(true);
  });

  it("unchanged exact helper output remains independently available", () => {
    expect(checkUpdatePack(pack()).at(-1)?.status).toBe("MATCH");
  });
});
