import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { MATH_LRC_PROOF_UNIT_CONTRACT, MATH_LRC_CAMPAIGN_CONTRACT, MATH_PILOT_CALIBRATIONS, MATH_PILOT_BENCHMARK, digestMathPilotContract, mathPilotContractSchema, resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";
import { mathAgentLedgerSchema, mathAgentReportSchema, digestMathAgentLedger, evaluateMathAgentReview, validateRecordedMathAgentReview, type MathAgentReport } from "@/modules/research-sandbox/agent-review";
import { LRC_PROOF_UNIT_PACKET } from "@/modules/research-sandbox/math-lrc-proof-unit";
import { LRC_CAMPAIGN_MANIFEST_DIGEST } from "@/modules/research-sandbox/math-lrc-campaign";
import { LRC_PROOF_UNIT_LIVE_SCOPE, LRC_PROOF_UNIT_LIVE_SOURCE_DIGEST, LRC_PROOF_UNIT_LIVE_LIMITS, prepareLrcProofUnitSolverInput, prepareLrcProofUnitReviewInput, validatePreparedLrcProofUnitLiveInput, createLrcProofUnitLiveEvidence, assertLrcProofUnitLiveEvidence, assertLrcProofUnitAttemptBinding, assertNoProviderProofUnitHostFields, lrcProofUnitLedgerReference, lrcProofUnitFeedbackSchema, validateLrcProofUnitSolverOutput, validLrcProofUnitUsage, type LrcProofUnitFeedback } from "@/modules/research-sandbox/math-lrc-proof-unit-live";

const clone = <T>(value: T): T => JSON.parse(canonicalJson(value));
const binding = { contractDigest: digestMathPilotContract(MATH_LRC_PROOF_UNIT_CONTRACT), caseId: "case-064", runId: "run-064", requestedModelName: "gpt-6-sol" };
const usage = { inputTokens: 1200, cachedInputTokens: 10, outputTokens: 900, reasoningOutputTokens: 40 };
const feedback = (): LrcProofUnitFeedback => ({ version: 1, auditStatus: "CONDITIONAL_REVIEWED", summary: "Conditional analysis only; retained completeness remains unverified here.", premiseFindings: LRC_PROOF_UNIT_PACKET.premises.map(row => ({ id: row.id, status: "CONDITIONAL", reason: "Named retained premise, not newly proved." })), stepFindings: LRC_PROOF_UNIT_PACKET.steps.map(row => ({ id: row.id, status: "CONDITIONAL", reason: "Conditional inference, not formal certification." })) });
const output = () => ({ attemptType: "PARTIAL" as const, argument: "The conditional bridge uses the same grid time for all coordinates; omitted gcd divisors persist. Completeness is retained, not freshly checked.", candidateCounterexample: null, selfChecks: ["Checked the quantifier direction under stated premises."], limitations: ["No fresh forest or global proof."], lrcProofUnitFeedback: feedback() });
const identity = { mode: "RETAINED_IDENTITY_ONLY_NOT_FRESH" as const, method: "FIXED_42_FILE_IDENTITY_IMPORT" as const, checkedAt: "2026-10-04T04:00:00.000Z", filesVerified: 42 as const, bytesVerified: 53211840 as const, manifestDigest: LRC_CAMPAIGN_MANIFEST_DIGEST, semanticReplayExecuted: false as const, externalAttestation: false as const };
function attempt() { return mathModelAttemptSchema.parse({ providerName: "codex-local", modelName: "gpt-6-sol", threadId: "solver-real-jsonl", ...output(), usage, lrcProofUnitEvidence: createLrcProofUnitLiveEvidence({ identityAdmission: identity, solverInput: prepareLrcProofUnitSolverInput(binding) }) }); }
function fixture(changeAttempt?: (value: ReturnType<typeof attempt>) => void, changeReports?: (reports: [MathAgentReport, MathAgentReport]) => void) {
  const candidate = clone(attempt()); changeAttempt?.(candidate); const retained = mathModelAttemptSchema.parse(candidate), attemptDigest = sha256(canonicalJson(retained));
  const reports = ["CRITIC", "ADVERSARY"].map(role => mathAgentReportSchema.parse({ role, verdict: "SUPPORTS", candidateConclusion: "PARTIAL", exactQuote: "same grid time", reasoning: "The quoted argument uses one common grid and does not infer global proof; completeness remains a conditional retained premise.", checks: ["Every named premise and inference was structurally addressed."], unresolvedGap: null, threadId: `jsonl-${role}`, usage, lrcProofUnitFeedback: feedback(), lrcProofUnitInput: prepareLrcProofUnitReviewInput({ ...binding, role: role as "CRITIC" | "ADVERSARY", solverAttempt: retained, solverAttemptDigest: attemptDigest }) })) as [MathAgentReport, MathAgentReport];
  changeReports?.(reports);
  const verdict = evaluateMathAgentReview({ contract: MATH_LRC_PROOF_UNIT_CONTRACT, contractDigest: binding.contractDigest, attempt: retained, reports, caseId: binding.caseId, runId: binding.runId });
  const ledger = mathAgentLedgerSchema.parse({ version: 6, reviewerModels: reports.map(report => ({ role: report.role, providerName: "codex-local", identityEvidence: "REQUESTED_CLI_MODEL", requestedModelName: "gpt-6-sol", threadId: report.threadId })), reports, lrcProofUnitEvidence: lrcProofUnitLedgerReference(retained.lrcProofUnitEvidence!), ...verdict });
  return { contract: MATH_LRC_PROOF_UNIT_CONTRACT, contractDigest: binding.contractDigest, attempt: retained, attemptDigest, caseId: binding.caseId, runId: binding.runId, researchDigest: "d".repeat(64), review: { contractDigest: binding.contractDigest, attemptDigest, researchDigest: "d".repeat(64), disposition: ledger.disposition, conclusion: ledger.conclusion, ledger, ledgerDigest: digestMathAgentLedger(ledger) } };
}
function rehashEvidence(value: ReturnType<typeof attempt>["lrcProofUnitEvidence"]) { const { evidenceDigest: old, ...body } = value!; void old; return { ...body, evidenceDigest: sha256(canonicalJson(body)) }; }

describe("TIP064 additive live proof schemas and retained exact inputs", () => {
  for (const version of [1, 2, 3, 4, 5] as const) it(`legacy ledger${version} canonical bytes/digest preserve absent new fields`, () => {
    const reports = (["CRITIC", "ADVERSARY"] as const).map(role => ({ role, verdict: "SUPPORTS", candidateConclusion: "PARTIAL", exactQuote: "same grid time", reasoning: "Historical retained review text has no prospective proof-unit input or model feedback fields.", checks: ["Historical review boundaries remain unchanged."], unresolvedGap: null, threadId: `old-${role}`, usage }));
    const hash = "a".repeat(64);
    const raw = { version, reports, disposition: "AI_REVIEWED", conclusion: "PARTIAL", ...(version < 3 ? { reviewerModelName: "gpt-6-sol" } : { reviewerModels: reports.map(report => ({ role: report.role, providerName: "codex-local", identityEvidence: "REQUESTED_CLI_MODEL", requestedModelName: "gpt-6-sol", threadId: report.threadId })) }),
      ...(version === 2 ? { exactInterval: { method: "INTERVAL_101GON_V1", status: "UNAVAILABLE", reason: "IMAGE_NOT_CONFIGURED", programDigest: hash, image: null, outputDigest: null, scaleDigits: null, lowerScaled: null, upperScaled: null, floor: null, eventCount: null, crossingWidthScaled: null } } : {}),
      ...(version === 4 ? { lrcEvidence: { scopeDigest: hash, certificateDigest: hash, evidenceDigest: hash } } : {}),
      ...(version === 5 ? { lrcCampaignEvidence: { scopeDigest: hash, evidenceDigest: hash, factsDigest: hash, claimId: "FINITE_I13_P83_224_EMPTY_AND_J13_P83_EMPTY" } } : {}),
      oracle: { contractValid: true, attemptValid: true, groundedQuotes: true, calibrationWitnessValid: null, note: "Historical ledger bytes remain exact; this is a serialization control.", ...(version === 2 ? { exactIntervalValid: false } : {}), ...(version === 4 ? { lrcEvidenceValid: true } : {}), ...(version === 5 ? { lrcCampaignEvidenceValid: true } : {}) } };
    const parsed = mathAgentLedgerSchema.parse(raw); expect(canonicalJson(parsed)).toBe(canonicalJson(raw)); expect(digestMathAgentLedger(parsed)).toBe(sha256(canonicalJson(raw)));
    expect(parsed).not.toHaveProperty("proofUnitAuditSummary"); expect(parsed).not.toHaveProperty("lrcProofUnitEvidence"); for (const report of parsed.reports) { expect(report).not.toHaveProperty("lrcProofUnitInput"); expect(report).not.toHaveProperty("lrcProofUnitFeedback"); }
  });
  it("resolves fixedv3 separate scope and keeps legacy contract/attempt goldens absent", () => {
    expect(resolveMathPilotContract({ caseType: "LRC_PROOF_UNIT", preset: "ALLIKVERE_P83_PROOF_UNIT_V1" })).toEqual(MATH_LRC_PROOF_UNIT_CONTRACT);
    expect(MATH_LRC_PROOF_UNIT_CONTRACT.lrcProofUnitScope).toEqual(LRC_PROOF_UNIT_LIVE_SCOPE);
    expect(MATH_LRC_PROOF_UNIT_CONTRACT).not.toHaveProperty("lrcCampaignScope");
    expect([MATH_PILOT_CALIBRATIONS.CALIBRATION_PROOF, MATH_PILOT_CALIBRATIONS.CALIBRATION_COUNTEREXAMPLE, MATH_PILOT_BENCHMARK, MATH_LRC_CAMPAIGN_CONTRACT].map(digestMathPilotContract)).toEqual(["709e00b6b05d31f307a887031052f95eec664f4d50950429c317052a053aa57c", "c76365161d12ece2ed7652d49397b2d227853df7eee3fbafa459775968bc9157", "69054bf10ddb450f0bf7f6ea46575d2bd34929fdf5b279965fee8dc6b77a2a21", "94b678f4bb862c4c46db5f2a754df86fd3a1486fa05c8bc31509aa177c105b1e"]);
    const old = mathModelAttemptSchema.parse({ providerName: "codex-local", modelName: "gpt-6-sol", threadId: "old", attemptType: "PARTIAL", argument: "Historical argument.", candidateCounterexample: null, selfChecks: [], limitations: [], usage: { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1, reasoningOutputTokens: 0 } });
    expect(sha256(canonicalJson(old))).toBe("47f8c8230d7943e95568e30936a9df26886b60618de6606f666fe87740f6c92d"); expect(old).not.toHaveProperty("lrcProofUnitEvidence"); expect(old).not.toHaveProperty("lrcProofUnitFeedback");
  });
  it("refuses cross-lane proofscope/undefined marker presence and wrong fixed scope", () => {
    for (const legacy of [MATH_PILOT_CALIBRATIONS.CALIBRATION_PROOF, MATH_LRC_CAMPAIGN_CONTRACT]) for (const field of [undefined, LRC_PROOF_UNIT_LIVE_SCOPE]) expect(mathPilotContractSchema.safeParse({ ...legacy, lrcProofUnitScope: field }).success).toBe(false);
    expect(mathPilotContractSchema.safeParse({ ...MATH_LRC_PROOF_UNIT_CONTRACT, lrcCampaignScope: undefined }).success).toBe(false);
    expect(mathPilotContractSchema.safeParse({ ...MATH_LRC_PROOF_UNIT_CONTRACT, lrcProofUnitScope: { ...LRC_PROOF_UNIT_LIVE_SCOPE, prime: 89 } }).success).toBe(false);
  });
  it("retains recomputable fullstdin/schema, common source and distinct inputhashes under combined caps", () => {
    const a = attempt(), digest = sha256(canonicalJson(a));
    const inputs = [prepareLrcProofUnitSolverInput(binding), ...(["CRITIC", "ADVERSARY"] as const).map(role => prepareLrcProofUnitReviewInput({ ...binding, role, solverAttempt: a, solverAttemptDigest: digest }))];
    expect(new Set(inputs.map(input => input.sourceDataDigest))).toEqual(new Set([LRC_PROOF_UNIT_LIVE_SOURCE_DIGEST])); expect(new Set(inputs.map(input => input.inputDigest)).size).toBe(3);
    for (const input of inputs) { expect(input.promptDigest).toBe(sha256(input.stdin)); expect(input.outputSchemaDigest).toBe(sha256(input.schemaText)); expect(input.promptBytes).toBe(Buffer.byteLength(input.stdin, "utf8")); expect(Buffer.byteLength(canonicalJson(input), "utf8")).toBeLessThanOrEqual(49152); expect(validatePreparedLrcProofUnitLiveInput(input, { ...binding, role: input.role, ...(input.role === "SOLVER" ? {} : { solverAttempt: a, solverAttemptDigest: digest }) })).toBe(true); expect(Object.isFrozen(input)).toBe(true); }
    expect(inputs[1].stdin).toContain("premise/dependency chain line by line"); expect(inputs[2].stdin).toContain("hostile quantifier and boundary attacker");
    expect(inputs[1].stdin).not.toContain('\\"identityAdmission\\"'); expect(inputs[1].stdin).not.toContain("solver-real-jsonl");
    expect(inputs[0].stdin).toContain("publication-time preparation snapshot");
    expect(inputs[0].stdin).toContain("GENERATION,CASCADE,ANCESTORS,TERMINAL,GLOBAL_LOWER");
    expect(inputs[0].stdin).toContain("16384UTF8");
  });
  it("host envelope retains immutable063 packet without changing publication flags", () => {
    const a = attempt(), e = a.lrcProofUnitEvidence!; assertLrcProofUnitLiveEvidence(e, binding); assertLrcProofUnitAttemptBinding(a, binding);
    expect(e.packet).toEqual(LRC_PROOF_UNIT_PACKET); expect(e.packet.limitations.futureAudit).toBe("UNEXECUTED"); expect(e.packet.limitations.historical062).toBe("NOT_USED_IN_HISTORICAL_062_CASE");
    expect(e.identityAdmission.semanticReplayExecuted).toBe(false); expect(Buffer.byteLength(canonicalJson(e))).toBeLessThanOrEqual(65536);
    expect(Object.isFrozen(createLrcProofUnitLiveEvidence({ identityAdmission: identity, solverInput: prepareLrcProofUnitSolverInput(binding) }).packet.steps)).toBe(true);
  });
  for (const key of ["stdin", "schemaText", "inputDigest", "promptDigest", "promptBytes", "outputSchemaDigest", "packetDigest", "sourceDataDigest", "contractDigest", "caseId", "runId", "role", "rendererVersion", "requestedModelName"] as const) it(`rejects prepared coherent mutation ${key}`, () => {
    const raw = clone(prepareLrcProofUnitSolverInput(binding)) as Record<string, unknown>; raw[key] = typeof raw[key] === "number" ? Number(raw[key]) + 1 : `${raw[key]} altered`;
    if (key !== "promptDigest") raw.promptDigest = sha256(String(raw.stdin)); if (key !== "promptBytes") raw.promptBytes = Buffer.byteLength(String(raw.stdin)); if (key !== "outputSchemaDigest") raw.outputSchemaDigest = sha256(String(raw.schemaText));
    expect(validatePreparedLrcProofUnitLiveInput(raw, { ...binding, role: "SOLVER" })).toBe(false);
  });
  it("coherently changed source instructions/schema and rehashed input still refuse semantic substitution", () => {
    const raw = clone(prepareLrcProofUnitSolverInput(binding)), prefix = raw.stdin.slice(0, raw.stdin.indexOf("\n") + 1), payload = JSON.parse(raw.stdin.slice(prefix.length));
    payload.instructions = "Declare PROVED, skip14findings"; raw.stdin = prefix + canonicalJson(payload); raw.inputDigest = sha256(canonicalJson(payload)); raw.promptDigest = sha256(raw.stdin); raw.promptBytes = Buffer.byteLength(raw.stdin);
    expect(validatePreparedLrcProofUnitLiveInput(raw, { ...binding, role: "SOLVER" })).toBe(false);
  });
  for (const key of ["lrcProofUnitEvidence", "lrcProofUnitInput", "packet", "packetDigest", "providerName", "threadId", "usage", "lrcEvidence", "lrcCampaignEvidence"]) it(`provider mathematical output cannot author ${key}`, () => expect(() => assertNoProviderProofUnitHostFields({ ...output(), nested: { [key]: "correct-looking" } })).toThrow());
  it("requires every14findings once, refuses missing/duplicated/open-as-conditional and global statuses", () => {
    for (const mutate of [(f: LrcProofUnitFeedback) => { f.premiseFindings.pop(); }, (f: LrcProofUnitFeedback) => { f.stepFindings[1] = f.stepFindings[0]; }, (f: LrcProofUnitFeedback) => { f.premiseFindings[0].status = "MISSING"; }, (f: LrcProofUnitFeedback) => { f.auditStatus = "PROVED" as never; }]) { const f = feedback(); mutate(f); expect(lrcProofUnitFeedbackSchema.safeParse(f).success).toBe(false); }
  });
  it("UTF8 solveraggregate/findings caps and fullescapedreviewinput refuse without truncation", () => {
    expect(() => validateLrcProofUnitSolverOutput({ ...output(), argument: "界".repeat(12000) })).toThrow("byte limit");
    const f = feedback(); [...f.premiseFindings, ...f.stepFindings].forEach(row => { row.reason = "界".repeat(256); }); expect(lrcProofUnitFeedbackSchema.safeParse(f).success).toBe(false);
    const a = attempt(); a.argument = "\"\\".repeat(3000); // character/aggregate-valid, but JSON escaping makes retained input too big.
    validateLrcProofUnitSolverOutput({ ...output(), argument: a.argument });
    expect(() => prepareLrcProofUnitReviewInput({ ...binding, role: "CRITIC", solverAttempt: a, solverAttemptDigest: sha256(canonicalJson(a)) })).toThrow();
    expect(LRC_PROOF_UNIT_LIVE_LIMITS.inputBytes).toBe(49152);
  });
  it("refuses false accounting, mixed lanes, packet changes, identityfalse and externalaliases", () => {
    for (const bad of [{ ...usage, cachedInputTokens: 1201 }, { ...usage, reasoningOutputTokens: 901 }, { ...usage, inputTokens: 0 }, undefined]) expect(validLrcProofUnitUsage(bad)).toBe(false);
    const a = attempt(); expect(() => assertLrcProofUnitAttemptBinding({ ...a, erdosStrausWitnesses: [] }, binding)).toThrow();
    expect(() => assertLrcProofUnitLiveEvidence(a.lrcProofUnitEvidence, { ...binding, caseId: "other" })).toThrow();
    const e = clone(a.lrcProofUnitEvidence!); e.packet.definitions.J = "Exists one bad lift"; expect(() => assertLrcProofUnitLiveEvidence(rehashEvidence(e), binding)).toThrow();
    expect(() => createLrcProofUnitLiveEvidence({ identityAdmission: { ...identity, semanticReplayExecuted: true } as never, solverInput: prepareLrcProofUnitSolverInput(binding) })).toThrow();
  });
  it("dependency-safe module has no IO/oldbindings/offlinecallback/checker imports", () => { const source = readFileSync("src/modules/research-sandbox/math-lrc-proof-unit-live.ts", "utf8"); expect(source).not.toMatch(/from\s+["']node:(fs|child_process)|from\s+["']\.\/(contracts|math-pilot|agent-review|math-lrc-proof-unit-audit|math-lrc-campaign-integration)/); expect(source).not.toContain("runLrcProofUnitScalarChecks("); });
});

describe("TIP064 ledger6 conservative evaluation/passive external-ID admission", () => {
  it("valid fullinput/actualaccounting gives onlyPARTIAL conditional state with unchanged debts", () => {
    const f = fixture(), ledger = validateRecordedMathAgentReview(f);
    expect(ledger?.version).toBe(6); expect(ledger?.conclusion).toBe("PARTIAL"); expect(ledger?.disposition).toBe("AI_REVIEWED");
    if (!ledger || ledger.version !== 6) throw new Error("expected6");
    expect(ledger.proofUnitAuditStatus).toBe("CONDITIONAL_REVIEWED"); expect(ledger.proofUnitAuditSummary.debts).toEqual(LRC_PROOF_UNIT_PACKET.debts); expect(ledger.proofUnitAuditSummary.globalLower).toEqual({ id: "GLOBAL_LOWER", use: "NOT_USED_IN_FINITE_BRIDGE", status: "OPEN" });
  });
  it("solver uncertainty, ungroundedquote, reviewerchallenge and unresolvedgap cannot promote", () => {
    for (const f of [fixture(a => { a.attemptType = "INCONCLUSIVE"; }), fixture(undefined, r => { r[0].exactQuote = "not in argument"; }), fixture(undefined, r => { r[1].verdict = "CHALLENGES"; }), fixture(undefined, r => { r[0].unresolvedGap = "Coverage is not freshly established."; })]) { const ledger = validateRecordedMathAgentReview(f); expect(ledger?.conclusion).toBe("INCONCLUSIVE"); expect(ledger?.disposition).toBe("INCONCLUSIVE"); if (ledger?.version === 6) expect(ledger.proofUnitAuditStatus).toBe("INCONCLUSIVE"); }
  });
  it("retains rejection and honest missing/open debt despite other conditional support", () => {
    for (const status of ["INCONCLUSIVE", "REJECTED"] as const) { const f = fixture(undefined, r => { r[1].lrcProofUnitFeedback!.auditStatus = status; r[1].lrcProofUnitFeedback!.stepFindings[0].status = status === "REJECTED" ? "DISPUTED" : "OPEN"; }); const ledger = validateRecordedMathAgentReview(f); expect(ledger?.conclusion).toBe("INCONCLUSIVE"); if (ledger?.version === 6) expect(ledger.proofUnitAuditStatus).toBe(status); }
  });
  it("requires externally trusted actual case/run IDs and refuses rehashed aliases", () => { const f = fixture(); expect(validateRecordedMathAgentReview({ ...f, caseId: undefined })).toBeNull(); expect(validateRecordedMathAgentReview({ ...f, runId: undefined })).toBeNull(); expect(validateRecordedMathAgentReview({ ...f, caseId: "other" })).toBeNull(); expect(validateRecordedMathAgentReview({ ...f, runId: "other" })).toBeNull(); });
  for (const key of ["conclusion", "version", "lrcProofUnitEvidence", "proofUnitAuditStatus", "proofUnitAuditSummary", "oracle", "reviewerModels"]) it(`coherent ledger rehash can't substitute ${key}`, () => {
    const f = fixture(), ledger = clone(f.review.ledger) as Record<string, unknown>;
    ledger[key] = key === "version" ? 5 : key === "conclusion" ? "SUPPORTED_ARGUMENT" : key === "proofUnitAuditStatus" ? "REJECTED" : {};
    expect(validateRecordedMathAgentReview({ ...f, review: { ...f.review, ledger, ledgerDigest: sha256(canonicalJson(ledger)), ...(key === "conclusion" ? { conclusion: "SUPPORTED_ARGUMENT" } : {}) } })).toBeNull();
  });
  it("invalid3contexts/usage/missingfeedback/input/version downgrade or foreignmodel refuse", () => {
    for (const change of [(r: [MathAgentReport, MathAgentReport]) => { r[1].threadId = r[0].threadId; }, (r: [MathAgentReport, MathAgentReport]) => { r[0].threadId = "solver-real-jsonl"; }, (r: [MathAgentReport, MathAgentReport]) => { r[0].usage.cachedInputTokens = 999999; }, (r: [MathAgentReport, MathAgentReport]) => { delete r[0].lrcProofUnitFeedback; }, (r: [MathAgentReport, MathAgentReport]) => { delete r[0].lrcProofUnitInput; }, (r: [MathAgentReport, MathAgentReport]) => { r[0].candidateConclusion = "SUPPORTED_ARGUMENT"; }]) expect(() => fixture(undefined, change)).toThrow();
    const f = fixture(); expect(validateRecordedMathAgentReview({ ...f, contract: MATH_LRC_CAMPAIGN_CONTRACT })).toBeNull();
    const raw = clone(f.review.ledger); raw.reviewerModels![0].requestedModelName = "another-model"; expect(mathAgentLedgerSchema.safeParse(raw).success).toBe(false);
  });
  it("old review lanes refuse newhostfields even when transient attempt schema acceptsfeedback", () => {
    const a = attempt(); expect(() => evaluateMathAgentReview({ contract: MATH_LRC_CAMPAIGN_CONTRACT, contractDigest: digestMathPilotContract(MATH_LRC_CAMPAIGN_CONTRACT), attempt: a, reports: fixture().review.ledger.reports })).toThrow("historical");
    const raw = clone(fixture().review.ledger); expect(mathAgentLedgerSchema.safeParse({ ...raw, version: 5 }).success).toBe(false);
  });
});
