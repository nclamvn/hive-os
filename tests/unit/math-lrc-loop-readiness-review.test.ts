import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { digestResearchResult, researchDossierDigest } from "@/modules/research-sandbox/integrity";
import { mathPilotScope, MATH_LRC_METHOD_UNIT_CONTRACT } from "@/modules/research-sandbox/math-pilot";
import { syntheticReadinessRows } from "./math-lrc-loop-readiness-fixture";

const mock = vi.hoisted(() => ({
  resolve: vi.fn(), authorize: vi.fn(), workspace: vi.fn(), mission: vi.fn(),
  cases: vi.fn(), jobs: vi.fn(), sources: vi.fn(), tenant: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/modules/identity-workspace/context", () => ({ resolveWorkspaceContext: mock.resolve }));
vi.mock("@/modules/authorization", () => ({ authorize: mock.authorize }));
vi.mock("@/server/db", () => ({ getDb: () => ({ workspace: { findFirst: mock.workspace } }) }));
vi.mock("@/server/tenant-context", () => ({ withOrganizationTenant: mock.tenant }));
vi.mock("@/server/operations/math-method-unit-source-loader", () => ({ verifyInstalledMethodUnitSources: mock.sources }));
import { loadLrcLoopReadiness } from "@/server/operations/math-lrc-loop-readiness";

const organizationId = "review-org", workspaceId = "review-workspace", missionId = "d0789176-4e38-4a67-8a45-d7a798fc8901";
const session = { user: { id: "current-viewer", name: "Viewer", email: "viewer@example.invalid" },
  workspace: { id: workspaceId, slug: "review-space", name: "Review", status: "ACTIVE" },
  membership: { id: "current-membership", role: "VIEWER", status: "ACTIVE" }, correlationId: "synthetic" };
type Control = ReturnType<typeof makeControl>;
let base: Control, control: Control;
function makeControl() {
  // New synthetic case/run/jobs, built from the frozen 069 fixture read-only.
  // The production source verifier is mocked; no real DB/scientific result is created.
  // The shared new fixture only supplies a fully rebound synthetic ledger. This
  // independent control reconstructs command/outbox/dossier/result rows itself.
  const seed = syntheticReadinessRows(901), r = seed.row.researchRun, review = seed.row.agentReview;
  const f = { caseId: seed.row.id, runId: r.id, solverJobId: r.jobId, reviewJobId: review.jobId,
    contract: seed.row.contract, contractDigest: seed.row.contractDigest, attempt: r.mathModelAttempt,
    attemptDigest: r.mathModelAttemptDigest, finiteSourcePins: seed.pins.finiteSourcePins,
    review: { disposition: review.disposition, conclusion: review.conclusion, contractDigest: review.contractDigest,
      attemptDigest: review.attemptDigest, researchDigest: review.researchDigest, ledger: review.ledger, ledgerDigest: review.ledgerDigest } };
  const commandId = "review-command", requestedByMembershipId = "original-membership";
  const finding = { findingKey: "no-external-source", kind: "HONEST_NULL",
    claim: "Conditional method feedback only; no independently captured external source span.",
    sourceId: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0, decision: null };
  const dossier = { sources: [], findings: [finding] };
  const researchDigest = researchDossierDigest(dossier);
  const resultDigest = digestResearchResult({ provider: "codex-local", model: "gpt-6-sol", sources: [],
    findings: [{ key: finding.findingKey, kind: finding.kind, claim: finding.claim, sourceKey: null,
      exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0 }] });
  const row = { id: f.caseId, organizationId, workspaceId, missionId, researchRunId: f.runId, caseType: "OPEN",
    contract: f.contract, contractDigest: f.contractDigest,
    researchRun: { id: f.runId, organizationId, workspaceId, missionId, jobId: f.solverJobId, commandId,
      requestedByMembershipId, requestedBy: { id: requestedByMembershipId, userId: "original-actor", workspaceId },
      providerName: "codex-local", modelName: "gpt-6-sol", status: "AWAITING_REVIEW", question: MATH_LRC_METHOD_UNIT_CONTRACT.statement,
      scope: mathPilotScope(MATH_LRC_METHOD_UNIT_CONTRACT), mathModelAttempt: f.attempt, mathModelAttemptDigest: f.attemptDigest, ...dossier },
    agentReview: { organizationId, workspaceId, missionId, caseId: f.caseId, jobId: f.reviewJobId,
      ...f.review, researchDigest } };
  const command = { id: commandId, organizationId, workspaceId, commandType: "research.run.request",
    actorUserId: "original-actor", status: "SUCCEEDED", outcome: { runId: f.runId, status: "QUEUED" } };
  const jobs = [true, false].map(solver => {
    const id = solver ? f.solverJobId : f.reviewJobId, outboxEventId = id + "-outbox";
    const jobType = solver ? "math-pilot.codex-local.execute" : "math-pilot.codex-local.review";
    const payload = solver ? { runId: f.runId } : { caseId: f.caseId };
    return { id, organizationId, workspaceId, status: "SUCCEEDED", attempts: 1, maxAttempts: 1,
      jobType, payload, outboxEventId,
      result: solver ? { runId: f.runId, resultDigest, mathModelAttemptDigest: f.attemptDigest }
        : { caseId: f.caseId, ledgerDigest: f.review.ledgerDigest, disposition: f.review.disposition },
      outboxEvent: { id: outboxEventId, organizationId, workspaceId, commandId, topic: jobType,
        aggregateType: solver ? "ResearchRun" : "MathPilotCase", aggregateId: solver ? f.runId : f.caseId,
        payload: { ...payload }, status: "DISPATCHED", command: { ...command } } };
  });
  return { f, row, jobs };
}
const request = (ids = [control.row.id]) => ({ headers: new Headers({ cookie: "original-request-cookie" }),
  workspaceSlug: "review-space", missionId, caseIds: ids });
function mutate(target: unknown, path: string, value: unknown) {
  const keys = path.split("."); let current = target as Record<string, unknown>;
  for (const key of keys.slice(0, -1)) current = current[key] as Record<string, unknown>;
  current[keys.at(-1)!] = value;
}
function closed(value: Awaited<ReturnType<typeof loadLrcLoopReadiness>>) {
  expect(value.dispatchAllowed).toBe(false); expect(value.proofClosure).toBe(false);
  expect(value.decision).toBe("PLANNING_ONLY"); expect(value.freshFiniteReplay).toBe("NOT_RUN");
  expect(value.batch).toBe("NOT_BOUND"); expect(value.independentInformation).toBe("NOT_BOUND");
  expect(value.executionGate).toBe("G2_NOT_AUTHORIZED");
}
function refused(value: Awaited<ReturnType<typeof loadLrcLoopReadiness>>) {
  closed(value); expect(value.admittedCount).toBe(0); expect(value.tasks).toEqual([]);
}
beforeAll(() => { base = makeControl(); });
beforeEach(() => {
  vi.resetAllMocks(); control = structuredClone(base);
  mock.resolve.mockImplementation(async () => structuredClone(session));
  mock.workspace.mockResolvedValue({ organizationId }); mock.authorize.mockResolvedValue({ allowed: true });
  mock.sources.mockImplementation(async () => ({ sourcePins: {}, finiteSourcePins: control.f.finiteSourcePins }));
  mock.mission.mockResolvedValue({ id: missionId }); mock.cases.mockImplementation(async () => [control.row]);
  mock.jobs.mockImplementation(async () => control.jobs);
  mock.tenant.mockImplementation(async (_org: string, _actor: string, operation: (tx: unknown) => Promise<unknown>) =>
    operation({ mission: { findFirst: mock.mission }, mathPilotCase: { findMany: mock.cases }, durableJob: { findMany: mock.jobs } }));
});

describe("TIP070 independent authenticated passive readiness controls", () => {
  it("admits exact synthetic records for a viewer who is not the original actor, without execution", async () => {
    const value = await loadLrcLoopReadiness(request()); closed(value);
    expect(value.admittedCount).toBe(1); expect(value.tasks).toHaveLength(13);
    expect(value.tasks.every(t => t.route === "UNROUTABLE" && t.sources.length === 3)).toBe(true);
    expect(mock.resolve).toHaveBeenCalledTimes(2);
    expect(mock.authorize).toHaveBeenNthCalledWith(1, session.user.id, "research.read", { organizationId, workspaceId, missionId });
    expect(mock.tenant).toHaveBeenCalledWith(organizationId, session.user.id, expect.any(Function));
    const wire = canonicalJson(value);
    for (const secret of ["original-actor", "current-viewer", "original-request-cookie", control.f.attempt.threadId!, "solverInput", "schemaText", "stdin", "registryDigest", "mathModelAttempt"]) expect(wire).not.toContain(secret);
    expect(Object.isFrozen(value)).toBe(true); expect(Object.isFrozen(value.tasks[0].sources[0])).toBe(true);
  });
  it("mission query uses valid Prisma workspace/nested organization scope, never unsupported Mission.organizationId", async () => {
    await loadLrcLoopReadiness(request());
    expect(mock.mission).toHaveBeenCalledWith({ where: { id: missionId, workspaceId,
      workspace: { organizationId } }, select: { id: true } });
  });
  it.each(["user.id", "workspace.id", "membership.id", "membership.status", "workspace.status"])("refuses fresh principal drift %s", async path => {
    const changed = structuredClone(session); mutate(changed, path, "changed");
    mock.resolve.mockResolvedValueOnce(structuredClone(session)).mockResolvedValueOnce(changed);
    const value = await loadLrcLoopReadiness(request()); refused(value);
    expect(value.session).toBe("UNAVAILABLE"); expect(value.cases).toEqual([]);
  });
  it.each(["initial", "return"])("refuses a revoked session at %s resolution", async at => {
    if (at === "return") mock.resolve.mockResolvedValueOnce(structuredClone(session));
    mock.resolve.mockRejectedValueOnce(new Error("postgres://private-credential/raw-session"));
    const value = await loadLrcLoopReadiness(request()); refused(value);
    expect(value.cases).toEqual([]); expect(canonicalJson(value)).not.toContain("private-credential");
    if (at === "initial") { expect(mock.sources).not.toHaveBeenCalled(); expect(mock.cases).not.toHaveBeenCalled(); }
  });
  it("refuses capability revocation before returning any case identifiers", async () => {
    mock.authorize.mockResolvedValueOnce({ allowed: true }).mockResolvedValueOnce({ allowed: false });
    const value = await loadLrcLoopReadiness(request()); refused(value); expect(value.cases).toEqual([]);
  });
  it("uses immutable original Headers after caller and resolver mutate their own copies", async () => {
    const input = request(), seen: string[] = [];
    mock.resolve.mockImplementation(async (headers: Headers) => {
      seen.push(headers.get("cookie")!); headers.set("cookie", "resolver-mutation");
      input.headers.set("cookie", "caller-mutation"); return structuredClone(session);
    });
    const value = await loadLrcLoopReadiness(input);
    expect(value.admittedCount).toBe(1); expect(seen).toEqual(["original-request-cookie", "original-request-cookie"]);
  });
  it.each([
    ["case-tenant", "organizationId", "foreign"], ["run-tenant", "researchRun.workspaceId", "foreign"],
    ["run-mission", "researchRun.missionId", "foreign"], ["run-id", "researchRunId", "foreign"],
    ["review-case", "agentReview.caseId", "foreign"], ["review-tenant", "agentReview.organizationId", "foreign"],
    ["question-family", "researchRun.question", "Unrelated Erdős question"], ["scope-family", "researchRun.scope", "wrong scope"],
    ["requester-id", "researchRun.requestedBy.id", "foreign"], ["requester-workspace", "researchRun.requestedBy.workspaceId", "foreign"],
    ["attempt-anchor", "researchRun.mathModelAttemptDigest", "a".repeat(64)], ["ledger-anchor", "agentReview.ledgerDigest", "a".repeat(64)],
    ["dossier-anchor", "agentReview.researchDigest", "a".repeat(64)],
    ["honest-null-content", "researchRun.findings.0.claim", "tampered"],
  ])("refuses independently altered %s", async (_name, path, value) => {
    mutate(control.row, path, value); refused(await loadLrcLoopReadiness(request()));
  });
  it.each([
    ["solver-type", "0.jobType", "math-pilot.codex-local.review"], ["review-type", "1.jobType", "math-pilot.codex-local.execute"],
    ["attempt-count", "0.attempts", 2], ["retry-count", "1.maxAttempts", 2], ["job-status", "1.status", "RUNNING"],
    ["job-workspace", "0.workspaceId", "foreign"], ["outbox-id", "0.outboxEvent.id", "foreign"],
    ["aggregate-type", "1.outboxEvent.aggregateType", "ResearchRun"], ["aggregate-id", "0.outboxEvent.aggregateId", "foreign"],
    ["outbox-command", "1.outboxEvent.commandId", "foreign"], ["outbox-topic", "1.outboxEvent.topic", "research.run.execute"],
    ["command-actor", "1.outboxEvent.command.actorUserId", "current-viewer"],
    ["command-type", "0.outboxEvent.command.commandType", "math-pilot.agent-review.request"],
    ["command-outcome", "1.outboxEvent.command.outcome.runId", "foreign"],
    ["result-run", "0.result.runId", "foreign"], ["result-digest", "0.result.resultDigest", "a".repeat(64)],
    ["result-case", "1.result.caseId", "foreign"], ["result-ledger", "1.result.ledgerDigest", "a".repeat(64)],
    ["result-disposition", "1.result.disposition", "fabricated"],
  ])("refuses independently altered %s", async (_name, path, value) => {
    mutate(control.jobs, path, value); refused(await loadLrcLoopReadiness(request()));
  });
  it("rejects extra job payload keys even with exact runId", async () => {
    mutate(control.jobs, "0.payload.extra", "grant"); refused(await loadLrcLoopReadiness(request()));
  });
  it("legacy064 contract never becomes v4 even alongside exact fixture metadata", async () => {
    mutate(control.row, "contract.version", 3); const value = await loadLrcLoopReadiness(request()); refused(value);
    expect(value.cases[0].reason).toBe("LEGACY_NOT_ADMISSIBLE");
  });
  it("missing requested case makes the complete cohort non-admitted", async () => {
    const value = await loadLrcLoopReadiness(request([control.row.id, "00000000-0000-4000-8000-000000008888"])); refused(value);
    expect(value.cases.map(c => c.reason)).toContain("COHORT_REFUSED");
    expect(value.cases.map(c => c.reason)).toContain("CASE_UNAVAILABLE");
  });
  it("foreign review is indistinguishable from absent and its job ID is never queried", async () => {
    mutate(control.row, "agentReview.organizationId", "foreign-review-organization");
    const foreign = await loadLrcLoopReadiness(request()); refused(foreign);
    expect(mock.jobs).not.toHaveBeenCalled();
    mock.cases.mockResolvedValueOnce([]);
    expect(await loadLrcLoopReadiness(request())).toEqual(foreign);
    expect(canonicalJson(foreign)).not.toContain("foreign-review-organization");
  });
  it("equivalent shuffled requested IDs produce deterministic refusal DTO", async () => {
    const ids = [control.row.id, "00000000-0000-4000-8000-000000008888"];
    expect(await loadLrcLoopReadiness(request(ids))).toEqual(await loadLrcLoopReadiness(request([...ids].reverse())));
  });
  it.each(["duplicate", "seventeen", "path", "caller-grant"])("refuses %s input before authentication", async kind => {
    const input = request();
    if (kind === "duplicate") input.caseIds.push(input.caseIds[0]);
    if (kind === "seventeen") input.caseIds = Array.from({ length: 17 }, (_, n) => "case-" + n);
    if (kind === "path") input.caseIds = ["../../private"];
    if (kind === "caller-grant") Object.assign(input, { grant: { ADMITTED: true }, resolver: mock.resolve });
    const value = await loadLrcLoopReadiness(input); refused(value);
    expect(value.status).toBe("INVALID_INPUT"); expect(mock.resolve).not.toHaveBeenCalled();
  });
  it.each(["deep", "oversize", "accessor"])("refuses raw %s before recursive admission", async kind => {
    if (kind === "deep") { let raw: unknown = {}; for (let n = 0; n < 35; n++) raw = { nested: raw }; mutate(control.row, "researchRun.mathModelAttempt", raw); }
    if (kind === "oversize") mutate(control.row, "researchRun.mathModelAttempt.argument", "x".repeat(2097153));
    const getter = vi.fn(() => "private"), raw = {};
    if (kind === "accessor") { Object.defineProperty(raw, "argument", { enumerable: true, get: getter }); mutate(control.row, "researchRun.mathModelAttempt", raw); }
    refused(await loadLrcLoopReadiness(request())); expect(getter).not.toHaveBeenCalled();
  });
  it("source-pin errors are safe and cause no retained database lookup", async () => {
    mock.sources.mockRejectedValue(new Error("/private/root SOURCE_PIN_DRIFT credentials"));
    const value = await loadLrcLoopReadiness(request()); refused(value);
    expect(value.status).toBe("SOURCE_REFUSED"); expect(mock.cases).not.toHaveBeenCalled();
    expect(canonicalJson(value)).not.toContain("/private/root"); expect(mock.resolve).toHaveBeenCalledTimes(2);
  });
  it("database operational errors do not leak raw error/stack/path", async () => {
    mock.jobs.mockRejectedValue(new Error("postgres://secret /private/diagnostics raw-job"));
    const value = await loadLrcLoopReadiness(request()); refused(value);
    expect(value.status).toBe("OPERATIONAL_REFUSED"); expect(canonicalJson(value)).not.toMatch(/postgres|secret|diagnostics|raw-job/);
  });
  it("server module has one production ingress and no live dispatch/write/private replay seam", () => {
    const source = readFileSync("src/server/operations/math-lrc-loop-readiness.ts", "utf8");
    expect(source).toMatch(/^import "server-only";/);
    expect(source.match(/export async function /g)).toHaveLength(1);
    expect(source).not.toMatch(/(?:tx|db|getDb\(\))\.[\w.]+\.(?:create|update|delete|upsert)\(|authorizeMathDiagnostic|requireDiagnosticGrant|observeLrc|runMethodUnitOrderedReview|spawn\(|exec\(|fetch\(/);
  });
});
