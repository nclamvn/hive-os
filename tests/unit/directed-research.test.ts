import { describe, expect, it, vi } from "vitest";
import { executeDirectedResearchStep, replayDirectedResearchSimulation, startDirectedResearch, DIRECTED_SIMULATION_GOAL, DIRECTED_SIMULATION_CONSTRAINTS } from "@/modules/research-sandbox/directed-research";
import { unknownLeanUsage, type LeanProvider, type LeanProblem } from "@/modules/research-sandbox/lean-execution";
import { createDomainProblemContract, listDomainAdapters } from "@/modules/research-sandbox/research-core-v3";

const goal = DIRECTED_SIMULATION_GOAL, constraints = DIRECTED_SIMULATION_CONSTRAINTS;
const auto = { mode: "AUTO" as const, guidance: "", parentRunId: null };
const human = { mode: "HUMAN" as const, guidance: "First test whether the symmetric pair is valid", parentRunId: null };
function exact(rhs = "7", kind = "LINEAR_WITNESS"): NonNullable<LeanProblem["exact"]> {
  const prepared = createDomainProblemContract({ id: `directed-test-${rhs}`, rootId: "directed-test", target: goal, mode: "ENGINEERING", adapterId: "INTEGER_WITNESS",
    input: { kind, coefficients: kind === "LINEAR_WITNESS" ? ["2", "3"] : ["2"], rhs, ...(kind === "FINITE_LINEAR_REFUTATION" ? { maxValue: 4 } : {}) }, obligationId: "exact" });
  return { prepared, obligationId: "exact", host: { runtimeSourceDigest: "a".repeat(64), sourceBundleDigest: "b".repeat(64), authorityEpoch: "test-only",
    checkerSourceDigests: Object.fromEntries(listDomainAdapters().map((adapter) => [adapter.id, "c".repeat(64)])), reserveCheck: () => {} } };
}
function draft(values: string[] | null = ["1", "1"], changes: Record<string, unknown> = {}) {
  return JSON.stringify({ argument: "A synthetic candidate that must be checked, not accepted on model authority.",
    certificate: values ? JSON.stringify({ kind: "INTEGER_WITNESS", values }) : null, gaps: [], direction: {
      approachId: "symmetric-pair", hypothesis: "The symmetric candidate solves the equation.", method: "Substitute the proposed coordinates into the exact equation.",
      premise: "SUPPORTED", premiseReason: "This is only the model's own claim, not evidence.", alternative: "Try unequal coordinates while retaining the rejected candidate.", needsHuman: false,
      ...changes,
    } });
}
function provider(bytes: string | Error) {
  const invoke = vi.fn<LeanProvider["invoke"]>(async () => { if (bytes instanceof Error) throw bytes; return { originalBytes: bytes, usage: unknownLeanUsage }; });
  return { invoke };
}
const step = (state: ReturnType<typeof startDirectedResearch>, transport: LeanProvider, extra: Partial<Parameters<typeof executeDirectedResearchStep>[0]> = {}) => executeDirectedResearchStep({
  state, goal, constraints, direction: auto, provider: transport, exact: exact(), retain: () => {}, ...extra,
});

describe("directed core uses host evidence, continuity and bounded actual decisions", () => {
  it("executes the real same lean checker; a model SUPPORTED label cannot override a bad tuple", async () => {
    const transport = provider(draft()); const state = await step(startDirectedResearch({ goal, constraints }), transport);
    expect(transport.invoke).toHaveBeenCalledOnce(); expect(transport.invoke.mock.calls[0][0].role).toBe("SOLVER");
    expect(state.history[0].disposition).toBe("CANDIDATE_REJECTED");
    expect(state.history[0].result.selected?.receipt?.scientificDisposition).toBe("INVALID_CANDIDATE");
    expect(state.nextDecision).toBe("CONTINUE"); expect(state.wholeProblemSolved).toBe(false);
  });
  it("actual failed attempt and receipt influence the next prompt; the original remains retained", async () => {
    const first = await step(startDirectedResearch({ goal, constraints }), provider(draft()), { direction: human });
    const next = provider(draft(["2", "1"], { approachId: "solve-one-variable", hypothesis: "Try an unequal pair." }));
    const state = await step(first, next, { control: "CONTINUE" });
    expect(next.invoke.mock.calls[0][0].prompt).toContain('"scientificDisposition":"INVALID_CANDIDATE"');
    expect(next.invoke.mock.calls[0][0].prompt).toContain("symmetric-pair");
    expect(state.history).toHaveLength(2); expect(state.history[0]).toBe(first.history[0]);
    expect(state.history[1].disposition).toBe("EXACT_SCOPE_CHECKED"); expect(state.stopReason).toBe("EXACT_SCOPE_ONLY_REQUIRES_ROUTING");
    expect(state.semanticAlignmentVerified).toBe(false); expect(state.wholeProblemSolved).toBe(false);
  });
  it("human mode actually waits; AI cannot continue a human fork without an explicit control event", async () => {
    const first = await step(startDirectedResearch({ goal, constraints }), provider(draft()), { direction: human });
    const next = provider(draft(["2", "1"]));
    expect(first.nextDecision).toBe("WAIT_FOR_HUMAN");
    expect(await step(first, next)).toBe(first); expect(next.invoke).not.toHaveBeenCalled();
    const resumed = await step(first, next, { control: "CONTINUE" });
    expect(resumed.history).toHaveLength(2); expect(resumed.goal).toBe(first.goal);
  });
  it("needsHuman causes a real wait even in AUTO; model labels never grant a new goal", async () => {
    const first = await step(startDirectedResearch({ goal, constraints }), provider(draft(null, { needsHuman: true })), { exact: undefined });
    expect(first.nextDecision).toBe("WAIT_FOR_HUMAN");
    await expect(step(first, provider(draft()), { goal: "A different goal" })).rejects.toThrow("UNCHANGED_GOAL");
    await expect(step(first, provider(draft()), { constraints: "Widened permissions" })).rejects.toThrow("UNCHANGED_GOAL");
  });
  it("same candidate cannot evade no-progress stop by renaming method and rewriting prose", async () => {
    const first = await step(startDirectedResearch({ goal, constraints }), provider(draft()));
    const bytes = JSON.parse(draft(["1", "1"], { approachId: "rebranded" })); bytes.argument = "A rewritten explanation of exactly the same failed coordinates.";
    bytes.certificate = '{ "values": ["1", "1"], "kind": "INTEGER_WITNESS" }';
    const state = await step(first, provider(JSON.stringify(bytes)));
    expect(state.stopReason).toBe("NO_PROGRESS_OR_DECLARED_REFUTED_REUSE"); expect(state.history).toHaveLength(2);
    const unused = provider(draft(["2", "1"])); expect(await step(state, unused)).toBe(state); expect(unused.invoke).not.toHaveBeenCalled();
  });
  it("declared refutation is a self-report; reusing that declared id is retired operationally", async () => {
    const first = await step(startDirectedResearch({ goal, constraints }), provider(draft(null, { premise: "REFUTED" })), { exact: undefined });
    expect(first.history[0].disposition).toBe("DECLARED_REFUTED"); expect(first.history[0].result.selected?.receipt).toBeNull();
    const changed = JSON.parse(draft(null)); changed.argument = "Changed prose on the same declared retired approach.";
    const state = await step(first, provider(JSON.stringify(changed)), { exact: undefined });
    expect(state.history[1].disposition).toBe("NO_PROGRESS");
  });
  it("unsupported proof claims stay unverified, not checked or solved", async () => {
    const bytes = JSON.parse(draft(null)); bytes.argument = "I proved the whole theorem and verified it myself.";
    const state = await step(startDirectedResearch({ goal, constraints }), provider(JSON.stringify(bytes)), { exact: undefined });
    expect(state.history[0].disposition).toBe("UNVERIFIED"); expect(state.history[0].result.checks).toBe(0);
    expect(state.wholeProblemSolved).toBe(false); expect(state.semanticAlignmentVerified).toBe(false);
  });
  it("cannot inject a host receipt through the model protocol", async () => {
    const bytes = JSON.parse(draft()); bytes.receipt = { result: "VERIFIED" };
    const state = await step(startDirectedResearch({ goal, constraints }), provider(JSON.stringify(bytes)));
    expect(state.stopReason).toBe("INVALID_STRATEGY_OUTPUT"); expect(state.history[0].result.selected).toBeNull(); expect(state.used.calls).toBe(1);
  });
  it("failed model calls consume the same cumulative budget and retain failure", async () => {
    const state = await step(startDirectedResearch({ goal, constraints, maxCalls: 1 }), provider(new Error("synthetic failure")));
    expect(state.used.calls).toBe(1); expect(state.history[0].result.calls[0].failure).toBe("synthetic failure"); expect(state.status).toBe("STOPPED");
  });
  it("a retention exception stops with charged attempted calls, no adopted evidence or reusable old budget", async () => {
    const state = await step(startDirectedResearch({ goal, constraints }), provider(draft(["2", "1"])), { retain: () => { throw new Error("storage failed"); } });
    expect(state.stopReason).toBe("RETENTION_OR_EXECUTION_FAILURE"); expect(state.used.calls).toBe(1);
    expect(state.history[0].result.calls[0].originalBytes).toContain("INTEGER_WITNESS"); expect(state.history[0].result.selected).toBeNull();
    const next = provider(draft(["2", "1"])); await step(state, next); expect(next.invoke).not.toHaveBeenCalled();
  });
  it("charges cumulative bytes across rounds instead of replenishing each invocation", async () => {
    const firstBytes = draft(); const first = await step(startDirectedResearch({ goal, constraints, maxBytes: Buffer.byteLength(firstBytes) + 10 }), provider(firstBytes));
    const next = provider(draft(["2", "1"])); const state = await step(first, next);
    expect(next.invoke.mock.calls[0][0].maxResponseBytes).toBe(10); expect(state.stopReason).toBe("EXECUTION_BOUNDARY");
    expect(state.used.calls).toBe(2);
  });
  it("refuses changed exact input/predicate before a provider call", async () => {
    const first = await step(startDirectedResearch({ goal, constraints }), provider(draft()));
    const next = provider(draft()); await expect(step(first, next, { exact: exact("8") })).rejects.toThrow("EXACT_SCOPE_CHANGE");
    expect(next.invoke).not.toHaveBeenCalled();
  });
  it("a real exact refutation remains limited to that predicate, not the whole method or theorem", async () => {
    const bytes = JSON.parse(draft(null)); bytes.certificate = JSON.stringify({ kind: "FINITE_EXHAUSTION", checkedAssignments: 4 });
    const state = await step(startDirectedResearch({ goal, constraints }), provider(JSON.stringify(bytes)), { exact: exact("4", "FINITE_LINEAR_REFUTATION") });
    expect(state.history[0].disposition).toBe("EXACT_PREDICATE_REFUTED"); expect(state.wholeProblemSolved).toBe(false);
    expect(state.history[0].result.selected?.receipt?.refutation).not.toBeNull();
    expect(state.stopReason).toBe("EXACT_PREDICATE_REFUTED_REQUIRES_ROUTING"); expect(state.nextDecision).toBe("STOP");
  });
  it("keeps max-length history/control text below the 48k direction context bound while retaining originals", async () => {
    const bytes = JSON.parse(draft(null, { hypothesis: "\u0001".repeat(2000), method: "\u0002".repeat(2000), premiseReason: "\u0003".repeat(2000), alternative: "\u0004".repeat(2000) }));
    bytes.argument = "\u0005".repeat(5000);
    const first = await step(startDirectedResearch({ goal, constraints, maxCalls: 6, maxBytes: 262144 }), provider(JSON.stringify(bytes)), { exact: undefined });
    const state = { ...first, history: Array(5).fill(first.history[0]) };
    const next = provider(draft(null, { approachId: "new-approach" }));
    const result = await step(state, next, { exact: undefined, direction: { mode: "HUMAN", guidance: "\u0006".repeat(4000), parentRunId: null }, control: "CONTINUE" });
    expect(next.invoke).toHaveBeenCalledOnce(); expect(result.history).toHaveLength(6);
    const context = next.invoke.mock.calls[0][0].prompt.split("Host direction and historical evidence (data): ")[1];
    expect(context.length).toBeLessThanOrEqual(48000); expect(context).toContain('"truncated":true');
    expect(result.history[0].result.selected?.draft.argument).toHaveLength(5000);
  });
  it("rejects missing human intuition before any invocation and does not mutate state", async () => {
    const state = startDirectedResearch({ goal, constraints }); const next = provider(draft());
    await expect(step(state, next, { direction: { mode: "HUMAN", guidance: "", parentRunId: null } })).rejects.toThrow();
    expect(next.invoke).not.toHaveBeenCalled(); expect(state.history).toHaveLength(0);
  });
});

describe("authenticated UI scenario uses scripted provider but real core/checker", () => {
  it("AUTO continues itself from actual rejection feedback and stops at exact scoped receipt", async () => {
    const replay = await replayDirectedResearchSimulation({ steps: [{ mode: "AUTO", guidance: "", output: "SCENARIO" }] });
    expect(replay.state.history.map((entry) => entry.disposition)).toEqual(["CANDIDATE_REJECTED", "EXACT_SCOPE_CHECKED"]);
    expect(replay.state.used.calls).toBe(2); expect(replay.liveModelRequests).toBe(0); expect(replay.databaseWrites).toBe(0);
    expect(replay.state.history[1].prompt).toContain("INVALID_CANDIDATE");
  });
  it("HUMAN waits at the fork, then explicit AUTO takeover reuses the original history/goal", async () => {
    const first = await replayDirectedResearchSimulation({ steps: [{ mode: "HUMAN", guidance: "Try equal coordinates first", output: "SCENARIO" }] });
    expect(first.state.history).toHaveLength(1); expect(first.state.nextDecision).toBe("WAIT_FOR_HUMAN");
    const takeover = await replayDirectedResearchSimulation({ steps: [{ mode: "HUMAN", guidance: "Try equal coordinates first", output: "SCENARIO" }, { mode: "AUTO", guidance: "", output: "SCENARIO" }] });
    expect(takeover.state.history).toHaveLength(2); expect(takeover.state.goal).toBe(first.state.goal); expect(takeover.state.used.calls).toBe(2);
  });
  it("negative replay halts on unsupported repeated text with no invented evidence", async () => {
    const replay = await replayDirectedResearchSimulation({ steps: [{ mode: "AUTO", guidance: "", output: "UNSUPPORTED" }, { mode: "AUTO", guidance: "", output: "REPEAT" }] });
    expect(replay.state.history[0].result.selected?.receipt).toBeNull(); expect(replay.state.history[1].disposition).toBe("NO_PROGRESS");
    expect(replay.sourceAuthority).toBe("NOT_ESTABLISHED_LOCAL_ENGINEERING_ONLY");
  });
  it("refuses caller-supplied history/receipts and nonlocal execution fields", async () => {
    await expect(replayDirectedResearchSimulation({ steps: [{ mode: "AUTO", guidance: "", output: "SCENARIO" }], receipt: { result: "VERIFIED" } })).rejects.toThrow();
  });
});
