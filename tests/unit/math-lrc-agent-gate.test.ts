import { EventEmitter } from "node:events";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { MathLrcEvidencePanel } from "@/components/research/math-lrc-evidence-panel";
import { CodexLocalMathProvider, parseCodexEvents } from "@/modules/research-sandbox/adapters/codex-local-math";
import { CodexLocalMathReviewer } from "@/modules/research-sandbox/adapters/codex-local-review";
import { digestMathAgentLedger, evaluateMathAgentReview, mathAgentLedgerSchema, validateRecordedMathAgentReview, type MathAgentReport } from "@/modules/research-sandbox/agent-review";
import { requestResearchRunSchema, mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";
import { digestResearchResult } from "@/modules/research-sandbox/integrity";
import { digestMathPilotContract, mathPilotRequestSchema, mathPilotScope, MATH_LRC_PRESETS, MATH_PILOT_CALIBRATIONS, resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { runLrcCertificateEvidence, validateRetainedLrcEvidence, type LrcCertificateEvidence } from "@/modules/research-sandbox/math-lrc-replay";

// Only the Codex transport is mocked; execFile remains real for pinned Python.
vi.mock("node:child_process", async (original) => ({ ...await original<typeof import("node:child_process")>(), spawn: vi.fn() }));
const request = { caseType: "LRC_FINITE" as const, preset: "GRID_6_14" as const };
const contract = resolveMathPilotContract(request);
const root = digestMathPilotContract(contract);
const usage = { inputTokens: 100, cachedInputTokens: 0, outputTokens: 40, reasoningOutputTokens: 0 };
const output = { attemptType: "PARTIAL" as const, argument: "The sealed fixed grid excludes this one tuple, not continuous time.", candidateCounterexample: null, selfChecks: ["Checked finite scope."], limitations: ["No universal theorem."] };
const attempt = { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "author", ...output, usage };
let evidence: LrcCertificateEvidence;
function events(value: unknown, thread = "author") {
  return [{ type: "thread.started", thread_id: thread }, { type: "item.completed", item: { type: "agent_message", text: JSON.stringify(value) } },
    { type: "turn.completed", usage: { input_tokens: 100, cached_input_tokens: 0, output_tokens: 40, reasoning_output_tokens: 0 } }].map((v) => JSON.stringify(v)).join("\n");
}
function pair(): [MathAgentReport, MathAgentReport] {
  return (["CRITIC", "ADVERSARY"] as const).map((role) => ({ role, verdict: "SUPPORTS" as const, candidateConclusion: "SUPPORTED_ARGUMENT" as const,
    exactQuote: "sealed fixed grid", reasoning: "Only the fixed time grid is exhaustively checked; this is not continuous-time exclusion.", checks: ["Checked the exact domain."], unresolvedGap: null, threadId: `${role}-fresh`, usage })) as [MathAgentReport, MathAgentReport];
}
function transport(prompts: string[], malicious = false) {
  vi.mocked(spawn).mockImplementation(((_path: string, args: string[]) => {
    const child = new EventEmitter();
    const stdout = Object.assign(new EventEmitter(), { setEncoding: () => undefined });
    const stderr = new EventEmitter();
    Object.assign(child, { stdout, stderr, kill: () => true, stdin: { end(prompt: string) {
      queueMicrotask(() => {
        if (args[0] === "login") stdout.emit("data", "Logged in using ChatGPT");
        else {
          prompts.push(prompt);
          const role = prompt.includes("Set role to ADVERSARY") ? "ADVERSARY" : prompt.includes("Set role to CRITIC") ? "CRITIC" : null;
          const value = role ? { ...pair().find((r) => r.role === role), threadId: undefined, usage: undefined } : { ...output, ...(malicious ? { lrcEvidence: evidence } : {}) };
          stdout.emit("data", events(value, role ? `${role}-fresh` : "author"));
        }
        child.emit("close", 0);
      });
    } } });
    return child;
  }) as typeof spawn);
}
beforeAll(async () => { evidence = await runLrcCertificateEvidence(contract.lrcFiniteScope!, root); });
afterEach(() => { vi.mocked(spawn).mockReset(); vi.unstubAllEnvs(); });

describe("LRC host evidence agent boundary", () => {
  it("seals all four finite presets as OPEN with bounded solver query and distinct domains", () => {
    expect(Object.keys(MATH_LRC_PRESETS)).toHaveLength(4);
    for (const preset of Object.keys(MATH_LRC_PRESETS) as (keyof typeof MATH_LRC_PRESETS)[]) {
      const c = resolveMathPilotContract({ caseType: "LRC_FINITE", preset });
      expect(c.caseType).toBe("OPEN"); expect(c.statement.length).toBeLessThan(500);
      expect(c.lrcFiniteScope).toEqual(MATH_LRC_PRESETS[preset]);
      expect(mathPilotScope(c)).toContain(JSON.stringify(c.lrcFiniteScope!.axes));
    }
    expect(MATH_LRC_PRESETS.LIFTS_6_42.axes.reduce((n, axis) => n * axis.length, 1)).toBe(7776);
  });
  it("does not accept a public envelope, malformed scope or LLM evidence injection", () => {
    const input = { missionId: "mission", question: contract.statement, scope: mathPilotScope(contract), providerName: "codex-local", modelName: "gpt-6-sol", sourcePolicy: { maxSources: 5 }, queryPlan: { queries: [contract.statement] }, mathPilot: request, idempotencyKey: "test" };
    expect(requestResearchRunSchema.safeParse({ ...input, lrcEvidence: evidence }).success).toBe(false);
    expect(mathPilotRequestSchema.safeParse({ ...contract, lrcFiniteScope: { ...contract.lrcFiniteScope, axes: [[1], [1], [3], [4], [5]] } }).success).toBe(false);
    expect(() => parseCodexEvents(events({ ...output, lrcEvidence: evidence }))).toThrow();
  });
  it("actually feeds identical compact evidence to solver and both fresh review-role prompts", async () => {
    const prompts: string[] = []; transport(prompts);
    const provider = new CodexLocalMathProvider("mock-codex");
    const result = await provider.execute({ missionId: "mission", documentId: null, question: contract.statement, scope: mathPilotScope(contract), providerName: "codex-local", modelName: "gpt-6-sol", sourcePolicy: { allowedDomains: [], primaryDomains: [], requirePrimary: false, maxSources: 5 }, queryPlan: { queries: [contract.statement], languages: ["en"] }, mathPilot: request, lrcEvidence: evidence });
    expect(result.mathAttempt?.lrcEvidence).toBeUndefined();
    const reviewer = new CodexLocalMathReviewer("mock-codex", "gpt-6-sol", "gpt-6-astra");
    const reviewed = await reviewer.review(contract, { ...result.mathAttempt!, lrcEvidence: evidence }, undefined, undefined, evidence);
    expect(reviewed.map((r) => r.role)).toEqual(["CRITIC", "ADVERSARY"]);
    expect(prompts).toHaveLength(3);
    for (const prompt of prompts) { expect(prompt).toContain(evidence.evidenceDigest); expect(prompt).not.toContain('"nodes"'); expect(prompt).toContain("finite"); }
    expect(prompts[1]).toContain("line by line"); expect(prompts[2]).toContain("hostile counterexample");
  });
  it("rejects missing/cross-root evidence before any Codex process; malicious provider output is strict", async () => {
    const prompts: string[] = []; transport(prompts, true);
    const provider = new CodexLocalMathProvider("mock-codex");
    const input = { missionId: "mission", documentId: null, question: contract.statement, scope: mathPilotScope(contract), providerName: "codex-local", modelName: "gpt-6-sol", sourcePolicy: { allowedDomains: [], primaryDomains: [], requirePrimary: false, maxSources: 5 }, queryPlan: { queries: [contract.statement], languages: ["en" as const] }, mathPilot: request };
    await expect(provider.execute(input)).rejects.toThrow(/LRC/); expect(spawn).not.toHaveBeenCalled();
    await expect(new CodexLocalMathReviewer().review(contract, attempt, undefined, undefined, evidence)).rejects.toThrow(/LRC/); expect(spawn).not.toHaveBeenCalled();
    await expect(provider.execute({ ...input, lrcEvidence: evidence })).rejects.toThrow();
    expect(validateRetainedLrcEvidence(evidence, contract.lrcFiniteScope!, "b".repeat(64))).toBe(false);
    vi.mocked(spawn).mockClear(); vi.stubEnv("NODE_ENV", "production");
    await expect(provider.execute({ ...input, lrcEvidence: evidence })).rejects.toThrow(/local/);
    await expect(new CodexLocalMathReviewer().review(contract, { ...attempt, lrcEvidence: evidence }, undefined, undefined, evidence)).rejects.toThrow(/local/);
    expect(spawn).not.toHaveBeenCalled();
  });
  it("requires ledger v4 references and retains PARTIAL even if both reviewers support", () => {
    const sealed = { ...attempt, lrcEvidence: evidence }; const reports = pair();
    const verdict = evaluateMathAgentReview({ contract, contractDigest: root, attempt: sealed, reports });
    expect(verdict).toMatchObject({ disposition: "AI_REVIEWED", conclusion: "PARTIAL", oracle: { lrcEvidenceValid: true } });
    const ledger = mathAgentLedgerSchema.parse({ version: 4, reports, reviewerModels: reports.map((r) => ({ role: r.role, providerName: "codex-local", identityEvidence: "REQUESTED_CLI_MODEL", requestedModelName: "gpt-6-sol", threadId: r.threadId })),
      lrcEvidence: { scopeDigest: evidence.scopeDigest, certificateDigest: evidence.primary.certificateDigest, evidenceDigest: evidence.evidenceDigest }, ...verdict });
    const review = { disposition: verdict.disposition, conclusion: verdict.conclusion, contractDigest: root, attemptDigest: digestResearchResult(sealed), researchDigest: "a".repeat(64), ledger, ledgerDigest: digestMathAgentLedger(ledger) };
    const input = { contract, contractDigest: root, attempt: sealed, attemptDigest: review.attemptDigest, researchDigest: review.researchDigest, review };
    expect(validateRecordedMathAgentReview(input)).not.toBeNull();
    for (const corrupted of [{ ...ledger, version: 3 }, { ...ledger, lrcEvidence: undefined }, { ...ledger, lrcEvidence: { ...ledger.lrcEvidence!, scopeDigest: "b".repeat(64) } }, { ...ledger, conclusion: "SUPPORTED_ARGUMENT" }]) {
      expect(validateRecordedMathAgentReview({ ...input, review: { ...review, ledger: corrupted, ledgerDigest: digestResearchResult(corrupted) } })).toBeNull();
    }
    const absent = { ...attempt }; expect(evaluateMathAgentReview({ contract, contractDigest: root, attempt: absent, reports }).disposition).toBe("INCONCLUSIVE");
  });
  it("keeps historical attempts and v1-3 absent evidence semantics without adding default fields", () => {
    expect(mathModelAttemptSchema.parse(attempt)).toEqual(attempt);
    expect(digestResearchResult(mathModelAttemptSchema.parse(attempt))).toBe(digestResearchResult(attempt));
    const c = MATH_PILOT_CALIBRATIONS.CALIBRATION_PROOF;
    expect(resolveMathPilotContract({ caseType: "CALIBRATION_PROOF" })).toEqual(c);
    expect(evaluateMathAgentReview({ contract: c, contractDigest: digestMathPilotContract(c), attempt: { ...attempt, lrcEvidence: evidence }, reports: pair() }).disposition).toBe("INCONCLUSIVE");
  });
  it("renders retained evidence bilingually without subprocess or model calls", () => {
    for (const locale of ["vi", "en"] as const) {
      const html = renderToStaticMarkup(createElement(MathLrcEvidencePanel, { scope: contract.lrcFiniteScope, contractDigest: root, evidence, locale }));
      expect(html).toContain(evidence.evidenceDigest); expect(html).toContain("PASS"); expect(html).not.toContain("INTEGRITY FAILURE");
      const old = renderToStaticMarkup(createElement(MathLrcEvidencePanel, { contractDigest: root, evidence: null, locale })); expect(old).not.toContain(evidence.evidenceDigest);
    }
    expect(spawn).not.toHaveBeenCalled();
  });
  it("keeps the retained page model-provenance branch available for v4 and legacy v3", () => {
    // Source projection guard; Contractor separately verifies the actual page.
    const page = readFileSync("src/app/w/[workspaceSlug]/research/math-pilot/page.tsx", "utf8");
    expect(page).toContain("agentLedger.version >= 3 ?");
    expect(page).not.toContain("agentLedger.version === 3 ?");
    expect(page).toContain("requestedModelName");
  });
});
