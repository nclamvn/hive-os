import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { isLrcProofUnitRunRecord, projectLrcProofUnitRunPresentation, type LrcProofUnitRunPresentationInput } from "@/components/research/math-lrc-proof-unit-run-presentation";
import { MathLrcProofUnitRunPanel } from "@/components/research/math-lrc-proof-unit-run-panel";
import { MATH_LRC_PROOF_UNIT_CONTRACT, MATH_LRC_CAMPAIGN_CONTRACT, digestMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";
import { LRC_PROOF_UNIT_PACKET } from "@/modules/research-sandbox/math-lrc-proof-unit";
import { digestResearchResult } from "@/modules/research-sandbox/integrity";
import { mathAgentLedgerSchema, digestMathAgentLedger, evaluateMathAgentReview, type MathAgentReport } from "@/modules/research-sandbox/agent-review";
import * as live from "@/modules/research-sandbox/math-lrc-proof-unit-live";

// Offline synthetic host records; no importer, DB, model, CLI or checker.
function fixture(caseId = "case-064", runId = "run-064", extraChecks = "Model-stated scoped check", rejectAdversary = false, ungroundedCritic = false) : LrcProofUnitRunPresentationInput {
  const contract = MATH_LRC_PROOF_UNIT_CONTRACT, contractDigest = digestMathPilotContract(contract);
  const feedback: live.LrcProofUnitFeedback = { version: 1, auditStatus: "CONDITIONAL_REVIEWED", summary: "Conditional feedback, not theorem acceptance.",
    premiseFindings: LRC_PROOF_UNIT_PACKET.premises.map(p => ({ id: p.id, status: "CONDITIONAL", reason: "Retained premise remains conditional." })),
    stepFindings: LRC_PROOF_UNIT_PACKET.steps.map(s => ({ id: s.id, status: "CONDITIONAL", reason: "Scoped implication considered conditionally." })) };
  const binding = { caseId, runId, contractDigest, requestedModelName: "gpt-6-sol" };
  const evidence = live.createLrcProofUnitLiveEvidence({ solverInput: live.prepareLrcProofUnitSolverInput(binding),
    identityAdmission: { mode: "RETAINED_IDENTITY_ONLY_NOT_FRESH", method: "FIXED_42_FILE_IDENTITY_IMPORT", checkedAt: "2026-10-04T00:00:00.000Z",
      filesVerified: 42, bytesVerified: 53211840, manifestDigest: live.LRC_PROOF_UNIT_LOCAL_MANIFEST_DIGEST, semanticReplayExecuted: false, externalAttestation: false } });
  const usage = { inputTokens: 1234, cachedInputTokens: 256, outputTokens: 987, reasoningOutputTokens: 789 };
  const attempt = mathModelAttemptSchema.parse({ providerName: "codex-local", modelName: "gpt-6-sol", threadId: "solver-context",
    attemptType: "PARTIAL", argument: "A conditional common-level bridge does not establish global LRC. Original prose b^-1*t and date2026-10-04 remain literal.",
    candidateCounterexample: null, selfChecks: [extraChecks], limitations: ["No fresh forest or formal proof."], usage,
    lrcProofUnitEvidence: evidence, lrcProofUnitFeedback: feedback });
  const attemptDigest = digestResearchResult(attempt);
  const reports = (["CRITIC", "ADVERSARY"] as const).map(role => ({ role, verdict: "SUPPORTS", candidateConclusion: "PARTIAL",
    exactQuote: "A conditional common-level bridge", reasoning: "The original conditional argument is retained as feedback, not independent truth or global acceptance.",
    checks: [extraChecks], unresolvedGap: null, threadId: `${role}-context`, usage, lrcProofUnitFeedback: feedback,
    lrcProofUnitInput: live.prepareLrcProofUnitReviewInput({ ...binding, role, solverAttempt: attempt, solverAttemptDigest: attemptDigest }) })) as [MathAgentReport, MathAgentReport];
  if (rejectAdversary) {
    reports[1].lrcProofUnitFeedback = { ...feedback, auditStatus: "REJECTED", stepFindings: feedback.stepFindings.map((finding, index) =>
      index === 0 ? { ...finding, status: "DISPUTED", reason: "A disputed step remains visible, not repaired into agreement." } : finding) };
    reports[1].verdict = "CHALLENGES"; reports[1].candidateConclusion = "INCONCLUSIVE";
    reports[1].unresolvedGap = "Adversarial objection retained without a retry.";
  }
  if (ungroundedCritic) reports[0].exactQuote = "UNMATCHED_RETAINED_QUOTE";
  const outcome = evaluateMathAgentReview({ contract, contractDigest, attempt, reports, caseId, runId });
  const ledger = mathAgentLedgerSchema.parse({ version: 6, reports, reviewerModels: reports.map(report => ({ role: report.role,
    providerName: "codex-local", identityEvidence: "REQUESTED_CLI_MODEL", requestedModelName: "gpt-6-sol", threadId: report.threadId })),
    lrcProofUnitEvidence: live.lrcProofUnitLedgerReference(evidence), ...outcome });
  const researchDigest = "a".repeat(64);
  return structuredClone({ contract, contractDigest, caseId, runId, runStatus: "AWAITING_REVIEW", attempt, attemptDigest, researchDigest,
    reviewJobStatus: "SUCCEEDED", review: { disposition: ledger.disposition, conclusion: ledger.conclusion,
      contractDigest, attemptDigest, researchDigest, ledger, ledgerDigest: digestMathAgentLedger(ledger) } });
}
const render = (record = fixture(), locale: "vi" | "en" = "en", toolsBase?: string) => renderToStaticMarkup(createElement(MathLrcProofUnitRunPanel, { record, locale, toolsBase }));

describe("TIP064 new-family classification before passive admission", () => {
  it.each([
    { contract: { version: 3 } }, { contract: { version: "3" } }, { contract: { lrcProofUnitScope: null } },
    { attempt: { lrcProofUnitEvidence: null } }, { attempt: { lrcProofUnitFeedback: null } },
    { attempt: { lrcProofUnitInput: null } }, { ledger: { version: 6 } }, { ledger: { version: "6" } },
    { attempt: { lrcProofUnitFindings: null } }, { ledger: { proofUnitAuditStatus: null } },
    { ledger: { proofUnitAuditSummary: null } },
    { ledger: { oracle: { proofUnitEvidenceValid: null } } },
    { ledger: { proofUnitScope: null } }, { ledger: { proofUnitEvidence: null } },
    { ledger: { proofUnitSummary: null } }, { ledger: { proofUnitBindings: null } },
    { ledger: { lrcProofUnitEvidence: null } }, { ledger: { reports: [{ lrcProofUnitInput: null }] } },
    { ledger: { reports: [{ lrcProofUnitFeedback: null }] } }, { ledger: { reports: { lrcProofUnitInput: null } } },
    { ledger: { reports: [{ lrcProofUnitFindings: null }] } },
  ])("malformed marker $contract $attempt $ledger stays in guarded family", record => {
    expect(isLrcProofUnitRunRecord("contract" in record ? record.contract : null,
      "attempt" in record ? record.attempt : null, "ledger" in record ? record.ledger : null)).toBe(true);
  });
  it.each([
    { contract: { version: 1 } }, { contract: { version: 2, lrcCampaignScope: null } },
    { attempt: { lrcCampaignEvidence: null } }, { ledger: { version: 5 } }, { ledger: { version: 3 } },
    { contract: null },
  ])("legacy or absent record is not relabelled new proof-unit family", record => {
    expect(isLrcProofUnitRunRecord("contract" in record ? record.contract : null,
      "attempt" in record ? record.attempt : null, "ledger" in record ? record.ledger : null)).toBe(false);
  });
});

describe("TIP064 passive persisted proof-unit-run presentation (offline fixtures)", () => {
  it.each(["vi", "en"] as const)("R5 %s valid6 shows input consumption distinct from static063 and old062", locale => {
    const record = fixture(), view = projectLrcProofUnitRunPresentation(record)!;
    expect(view.state).toBe("ADMITTED"); expect(view.reviewState).toBe("VALID"); expect(view.ledger?.conclusion).toBe("PARTIAL");
    const html = render(record, locale, "/w/another-lab/research/math-tools");
    for (const value of ["Ledger6: VALID", "CONDITIONAL_REVIEWED", "PARTIAL", "RETAINED_IDENTITY_ONLY_NOT_FRESH", "UNEXECUTED", "TIP-062", "60", "23", "OPEN", "14/15", "NOT_ESTABLISHED"])
      expect(html).toContain(value);
    expect(html).toContain('href="/w/another-lab/research/math-tools?view=allikvere-proof-unit#allikvere-proof-unit"');
    expect(html).not.toContain("mathematics-pilot-lab"); expect(html).toContain("∅"); expect(html).not.toMatch(/katex-error|Invalid or unsupported TeX|<form|<button|<input|<script/);
    expect(html).toContain(locale === "vi" ? "thời điểm chuẩn bị" : "publication-time UNEXECUTED snapshot");
    expect(html).toContain(locale === "vi" ? "Không cộng bốn chỉ số thành tổng token" : "Do not add all four figures into a token total");
  });
  it("displays all3 original roles, complete findings, checks, actual retained inputs/accounting/digests", () => {
    const record = fixture(), view = projectLrcProofUnitRunPresentation(record)!, html = render(record);
    expect(view.roles.map(role => role.role)).toEqual(["SOLVER", "CRITIC", "ADVERSARY"]);
    expect(view.roles.map(role => role.threadId)).toEqual(["solver-context", "CRITIC-context", "ADVERSARY-context"]);
    for (const role of view.roles) {
      expect(html).toContain(role.input.inputDigest); expect(html).toContain(role.input.promptDigest); expect(html).toContain(role.input.outputSchemaDigest);
      const escaped = renderToStaticMarkup(createElement("span", null, role.input.stdin)).slice(6, -7); expect(html).toContain(escaped);
      for (const finding of [...role.feedback.premiseFindings, ...role.feedback.stepFindings]) expect(html).toContain(finding.id);
    }
    for (const value of [record.attemptDigest!, record.review!.ledgerDigest, "gpt-6-sol", "1,234", "256", "987", "789", "Model-stated scoped check", "not independent verification", "b^-1*t", "date2026-10-04"])
      expect(html).toContain(value);
    expect((html.match(/class="katex"/g) ?? []).length).toBe(1);
  });
  it("escapes model checks/HTML/TeX as original prose without heuristic or instruction execution", () => {
    const literal = String.raw`<img src=x onerror=alert(1)> $\href{javascript:bad}{x}$ date2026-10-04 b^-1*t`;
    const html = render(fixture("case-064", "run-064", literal));
    expect(html).toContain("&lt;img"); expect(html).toContain(String.raw`$\href{javascript:bad}{x}$`);
    expect(html).not.toContain("<img src=x"); expect(html).not.toContain('href="javascript:bad"');
    expect((html.match(/class="katex"/g) ?? []).length).toBe(1);
  });
  it.each(["attempt", "contract", "packet", "input", "feedback", "usage", "mixed"])("%s corruption cannot show valid input or roles", field => {
    const record = fixture(), attempt = record.attempt as ReturnType<typeof mathModelAttemptSchema.parse>;
    if (field === "attempt") attempt.argument += " MUTATION";
    if (field === "contract") record.contractDigest = "b".repeat(64);
    if (field === "packet") Reflect.set(attempt.lrcProofUnitEvidence!, "packetDigest", "b".repeat(64));
    if (field === "input") Reflect.set(attempt.lrcProofUnitEvidence!.solverInput, "stdin", "REPLACED_STDIN");
    if (field === "feedback") attempt.lrcProofUnitFeedback!.stepFindings.pop();
    if (field === "usage") attempt.usage.cachedInputTokens = 9999;
    if (field === "mixed") Reflect.set(attempt, "lrcCampaignEvidence", null);
    if (field !== "attempt") record.attemptDigest = digestResearchResult(attempt);
    const view = projectLrcProofUnitRunPresentation(record)!, html = render(record);
    expect(view.state).toBe("INVALID"); expect(view.roles).toHaveLength(0); expect(html).not.toContain("SOLVER ·"); expect(html).not.toContain("katex");
    expect(html).toContain('role="alert"'); expect(html).not.toContain("Input bindings: ADMITTED");
  });
  it.each(["case", "run"])("coherent valid record swapped to foreign external %s ID refuses", field => {
    const record = fixture("other-case", "other-run");
    if (field === "case") record.caseId = "case-064"; else record.runId = "run-064";
    expect(projectLrcProofUnitRunPresentation(record)!.state).toBe("INVALID"); expect(render(record)).not.toContain("SOLVER ·");
  });
  it.each(["downgrade", "digest", "research", "context", "usage", "reviewInput", "summary"])("coherent %s review fault hides reviewer content/accounting", field => {
    const record = fixture(), ledger = record.review!.ledger as ReturnType<typeof mathAgentLedgerSchema.parse>;
    if (field === "downgrade") Reflect.set(ledger, "version", 5);
    if (field === "digest") record.review!.ledgerDigest = "b".repeat(64);
    if (field === "research") record.researchDigest = "b".repeat(64);
    if (field === "context") ledger.reports[1].threadId = ledger.reports[0].threadId;
    if (field === "usage") ledger.reports[0].usage.reasoningOutputTokens = 9999;
    if (field === "reviewInput") Reflect.set(ledger.reports[0].lrcProofUnitInput!, "solverAttemptDigest", "b".repeat(64));
    if (field === "summary" && ledger.version === 6) Reflect.set(ledger.proofUnitAuditSummary, "globalLrc", "PROVED");
    ledger.reports[0].reasoning = "INVALID_REVIEWER_TEXT_MUST_NOT_APPEAR more than40 characters";
    if (field !== "digest") record.review!.ledgerDigest = digestResearchResult(ledger);
    const view = projectLrcProofUnitRunPresentation(record)!, html = render(record);
    expect(view.reviewState).toBe("INVALID"); expect(view.roles.map(role => role.role)).toEqual(["SOLVER"]);
    expect(html).not.toContain("INVALID_REVIEWER_TEXT_MUST_NOT_APPEAR"); expect(html).not.toContain("CRITIC-context"); expect(html).not.toContain("9,999");
  });
  it("missing output or DEAD_LETTER review does not manufacture consumption, completion or zeros", () => {
    const missing = { ...fixture(), attempt: null, attemptDigest: null, review: null };
    expect(projectLrcProofUnitRunPresentation(missing)!.state).toBe("MISSING"); expect(render(missing)).not.toContain("katex");
    expect(render(missing)).not.toContain("SOLVER ·"); expect(render(missing)).toContain("zero token usage is not inferred");
    const partial = { ...fixture(), review: null, reviewJobStatus: "DEAD_LETTER" };
    expect(projectLrcProofUnitRunPresentation(partial)!.roles).toHaveLength(1); expect(render(partial)).not.toContain("CRITIC-context");
    expect(render(partial)).toContain("DEAD_LETTER"); expect(render(partial)).not.toContain("Ledger6: VALID");
  });
  it("old campaignv2 is not relabelled as a proof-unit run", () => {
    const record = { ...fixture(), contract: MATH_LRC_CAMPAIGN_CONTRACT, attempt: null, review: null };
    expect(projectLrcProofUnitRunPresentation(record)).toBeNull(); expect(render(record)).toBe("");
  });
  it("legitimate rejected criticism stays valid retained feedback with INCONCLUSIVE root, not repaired agreement", () => {
    const record = fixture("case-064", "run-064", "Model-stated scoped check", true), view = projectLrcProofUnitRunPresentation(record)!;
    expect(view.reviewState).toBe("VALID"); expect(view.ledger?.proofUnitAuditStatus).toBe("REJECTED"); expect(view.ledger?.conclusion).toBe("INCONCLUSIVE");
    const html = render(record); expect(html).toContain("DISPUTED"); expect(html).toContain("Adversarial objection retained without a retry.");
    expect(html).not.toContain("Root conclusion: PARTIAL"); expect(html).toContain("CHALLENGES");
  });
  it.each(["vi", "en"] as const)("%s valid ungrounded review stays INCONCLUSIVE with explicit per-role quote warning", locale => {
    const record = fixture("case-064", "run-064", "Model-stated scoped check", false, true), view = projectLrcProofUnitRunPresentation(record)!;
    expect(view.reviewState).toBe("VALID"); expect(view.ledger?.oracle.groundedQuotes).toBe(false); expect(view.ledger?.conclusion).toBe("INCONCLUSIVE");
    expect(view.roles.map(role => role.quoteMatches)).toEqual([null, false, true]);
    const html = render(record, locale); expect(html).toContain("UNMATCHED_RETAINED_QUOTE"); expect(html).not.toContain("Root conclusion: PARTIAL");
    expect(html).toContain(locale === "vi" ? "Có trích dẫn không khớp nguyên văn" : "Some quotes do not match the original SOLVER argument");
    expect(html).toContain(locale === "vi" ? "Trích dẫn của vai này không khớp" : "This role&#x27;s quote does not match SOLVER verbatim");
  });
  it.each([320, 390, 768, 1366])("%spx semantic SSR retains disclosure/wrapping, not a geometric browser claim", width => {
    const html = renderToStaticMarkup(createElement("div", { style: { width } }, createElement(MathLrcProofUnitRunPanel, { record: fixture(), locale: "vi" })));
    expect(html).toContain(`width:${width}px`); for (const token of ["min-w-0", "break-all", "break-words", "flex-wrap", "max-w-[76ch]", "focus-visible:outline", "sm:grid-cols-4"]) expect(html).toContain(token);
    expect(html).toContain('role="region"'); expect(html).toContain("<summary"); expect(html).not.toMatch(/<form|<button|<input|<script/);
  });
  it("unsafe/absent bases cannot fabricate a tenant link", () => {
    const record = fixture();
    for (const toolsBase of [undefined, "javascript:bad", "https://other.invalid", "/w/a/research/math-tools?view=wrong"]) expect(render(record, "en", toolsBase)).not.toContain("Read the unchanged TIP-063");
  });
  it("passive render performs no exported preparation dispatch or IO/checker/provider seam", () => {
    const record = fixture(); const prepare = vi.spyOn(live, "prepareLrcProofUnitLiveInput").mockImplementation(() => { throw new Error("No preparation on render"); });
    try { render(record); expect(prepare).not.toHaveBeenCalled(); } finally { prepare.mockRestore(); }
    const source = readFileSync("src/components/research/math-lrc-proof-unit-run-panel.tsx", "utf8") + readFileSync("src/components/research/math-lrc-proof-unit-run-presentation.ts", "utf8");
    expect(source).not.toMatch(/node:fs|campaign-reference|proof-unit-audit|runLrcProofUnitScalarChecks|prepareLrcProofUnitLiveInput|useEffect|setInterval|fetch\(|use client|dangerouslySetInnerHTML/);
  });
});
