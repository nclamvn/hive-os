import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { ComparativeBudgetBroker, ComparativeOperationFailure, comparativeFixtureDrivers,
  comparativeFixtureExecutor, comparativePlanBody, comparativeReviewerProjection, comparativeSolverProjection,
  defaultComparativeFixturePlan, runComparativeExperiment, scoreComparativeFixture,
  sealComparativePlan, verifyComparativePlan, verifyComparativeResult,
  type ComparativeExecutor, type ComparativeLaneDriver, type ComparativePlan,
  type ComparativeResult } from "@/modules/research-sandbox/math-comparative-experiment";

function fixture(options: Partial<ComparativePlan["envelope"]> = {}) {
  const f = defaultComparativeFixturePlan();
  const body = comparativePlanBody(f.plan);
  return { ...f, plan: sealComparativePlan({ ...body, envelope: { ...body.envelope, ...options } }) };
}
const rehashResult = (r: ComparativeResult) => {
  const { resultDigest, ...body } = r; void resultDigest;
  r.resultDigest = sha256(canonicalJson(body)); return r;
};
const rehashPlan = (p: ComparativePlan) => {
  const { planDigest, ...body } = p; void planDigest;
  p.planDigest = sha256(canonicalJson(body)); return p;
};
async function run(executor = comparativeFixtureExecutor, limits: Partial<ComparativePlan["envelope"]> = {},
  drivers = comparativeFixtureDrivers(), signal?: AbortSignal) {
  const f = fixture(limits);
  return runComparativeExperiment({ ...f, executor, drivers, signal });
}
const body = (inputTokens = 10, outputTokens = 2) => ({ sessionId: "test-fresh-session", body: "attempt",
  usage: { inputTokens, outputTokens, cachedInputTokens: 2, reasoningOutputTokens: 1 } });

describe("offline equal-budget comparative framework", () => {
  it("seals equal three-lane envelopes and rejects rehashed case/source/tool/model/budget/order drift", () => {
    const { plan } = fixture(); expect(verifyComparativePlan(plan)).toBe(true);
    const mutations: ((p: ComparativePlan) => void)[] = [
      p => { p.cases[0].contract.statement += " altered"; },
      p => { p.sources[0].content += " altered"; },
      p => { p.tools[0].sourceDigest = "a".repeat(64); },
      p => { p.envelope.maxObservedTokens++; },
      p => { p.lanes[0].envelopeDigest = "a".repeat(64); },
      p => { p.laneOrder[1] = p.laneOrder[0]; },
      p => { p.lanes[1].lane = p.lanes[0].lane; },
      p => { p.cases[1].id = p.cases[0].id; },
    ];
    for (const mutate of mutations) {
      const p = structuredClone(plan); mutate(p); rehashPlan(p); expect(verifyComparativePlan(p)).toBe(false);
    }
    expect(verifyComparativePlan({ ...plan, settings: { ...plan.settings, requestedProvider: "codex-local" } })).toBe(false);
    expect(verifyComparativePlan({ ...plan, cases: [{ ...plan.cases[0], exposure: "HELD_OUT" }] })).toBe(false);
  });

  it("runs all six lane/case slots with real framework timing but simulated tokens and no invented win", async () => {
    const r = await run(); expect(verifyComparativeResult(r)).toBe(true);
    expect(r).toMatchObject({ comparison: "FIXTURE_WORKFLOW_ONLY", tokenProvenance: "SIMULATED", scientificYield: "NOT_MEASURED" });
    expect(r.runs).toHaveLength(6);
    expect(r.runs.map(x => [x.modelCalls, x.toolCalls])).toEqual([[2, 0], [2, 1], [3, 1], [2, 0], [2, 1], [3, 1]]);
    expect(r.runs.every(x => x.score && x.state === "COMPLETE" && x.decision === "ACCEPT")).toBe(true);
    expect(r.runs.every(x => x.elapsedMs > 0)).toBe(true);
    expect(r.runs.map(x => x.observedTokens)).toEqual([320, 320, 480, 320, 320, 480]);
    const repeated = fixture(); const p = comparativePlanBody(repeated.plan);
    const repeatResult = await runComparativeExperiment({ ...repeated, plan: sealComparativePlan({ ...p, repetitions: 2 }),
      drivers: comparativeFixtureDrivers(), executor: comparativeFixtureExecutor });
    expect(repeatResult.runs).toHaveLength(12); expect(verifyComparativeResult(repeatResult)).toBe(true);
  });

  it("never supplies rubric/reference/labels to lane or structural reviewer projection", async () => {
    const f = fixture();
    const projection = comparativeSolverProjection(f.plan, "even-square");
    projection.envelope.maxObservedTokens = 1;
    projection.contract.statement = "Mutated projection";
    expect(verifyComparativePlan(f.plan)).toBe(true);
    expect(JSON.stringify(projection)).not.toContain(f.references[0].rubric);
    expect(projection).not.toHaveProperty("referenceDigest");
    const review = comparativeReviewerProjection(f.plan, "even-square", "A sealed mathematical attempt.");
    for (const key of ["lane", "policy", "usage", "sessionId", "settings", "envelope", "references"]) expect(review).not.toHaveProperty(key);
    expect(review.blinding).toContain("PROSE_MAY_REVEAL_METHOD");
    let observed = 0;
    const driver: ComparativeLaneDriver = async context => {
      expect(context).not.toHaveProperty("references");
      expect(JSON.stringify(context.solver)).not.toContain(f.references[0].rubric);
      observed++; return { attempt: "Unverified fixture attempt", decision: "ABSTAIN" };
    };
    const r = await run(comparativeFixtureExecutor, {}, { SINGLE_LLM: driver, TOOL_FIRST: driver, ADAPTIVE: driver });
    expect(observed).toBe(6); expect(r.scientificYield).toBe("NOT_MEASURED");
  });

  it("distinguishes accept/reject/abstain, keeping all proof/formal/root/novelty authority separate", () => {
    const ref = fixture().references[0];
    expect(scoreComparativeFixture(ref, "ABSTAIN")).toMatchObject({ falseReject: false, falseAccept: false, abstention: true });
    expect(scoreComparativeFixture(ref, "REJECT").falseReject).toBe(true);
    expect(scoreComparativeFixture({ ...ref, expectedDecision: "REJECT" }, "ACCEPT").falseAccept).toBe(true);
    expect(scoreComparativeFixture(ref, "ACCEPT")).toMatchObject({ informalProofValidity: "NOT_ASSESSED", formalKernel: "NOT_RUN",
      semanticAlignment: "NOT_ATTESTED", rootContribution: "NOT_ESTABLISHED", novelty: "NOT_ESTABLISHED" });
  });

  it("retains pending before invocation and complete accounting for a known-usage failure", async () => {
    const f = fixture(); const broker = new ComparativeBudgetBroker(f.plan, async () => {
      expect(broker.events).toHaveLength(1); expect(broker.events[0].phase).toBe("PENDING");
      throw new ComparativeOperationFailure({ inputTokens: 100, outputTokens: 20, cachedInputTokens: 10, reasoningOutputTokens: 5 });
    });
    await expect(broker.model("SOLVE", { statement: "public" })).rejects.toThrow();
    expect(broker.observedTokens).toBe(120); expect(broker.unknownUsage).toBe(false);
    expect(broker.events[1]).toMatchObject({ phase: "SETTLED", record: { state: "FAILED", usageState: "KNOWN" } });
    await expect(broker.model("REVIEW", {})).rejects.toThrow(); expect(broker.events).toHaveLength(2);
  });

  it("unknown failed/invalid usage is never zero, stops lane and makes comparison incomplete", async () => {
    for (const executor of [async () => { throw new Error("private error"); },
      async () => ({ ...body(), usage: { ...body().usage, cachedInputTokens: 999 } }),
      async () => ({ ...body(), usage: { ...body().usage, inputTokens: 1_000_000_000 } })]) {
      const r = await run(executor);
      expect(r.accounting).toBe("INCOMPLETE"); expect(verifyComparativeResult(r)).toBe(true);
      expect(r.runs[0]).toMatchObject({ state: "STOPPED", accounting: "INCOMPLETE", modelCalls: 1 });
      expect(r.runs[0].events[1]).toMatchObject({ record: { usage: null, usageState: "UNKNOWN", tokenProvenance: "UNKNOWN" } });
      expect(JSON.stringify(r)).not.toContain("private error");
    }
  });

  it("retains in-flight threshold overshoot without double-counting cached/reasoning subsets", async () => {
    const r = await run(comparativeFixtureExecutor, { maxObservedTokens: 100 });
    expect(r.runs.every(x => x.observedTokens === 160 && x.thresholdOvershoot === 60 && x.modelCalls === 1)).toBe(true);
    expect(r.runs.every(x => x.state === "STOPPED")).toBe(true); expect(verifyComparativeResult(r)).toBe(true);
  });

  it("enforces model/tool caps, missing capability and output cap with retained usage", async () => {
    const capped = await run(comparativeFixtureExecutor, { maxModelCalls: 1, maxToolCalls: 0 });
    expect(capped.runs.every(x => x.state === "STOPPED")).toBe(true);
    expect(capped.runs[0].reason).toBe("MODEL_CALL_LIMIT"); expect(capped.runs[1].reason).toBe("TOOL_CALL_LIMIT");
    const r = await run(async req => req.kind === "MODEL" ? { ...body(), body: "x".repeat(500) } : { body: "x".repeat(500) }, { maxOutputBytes: 64 });
    expect(r.runs[0]).toMatchObject({ observedTokens: 12, accounting: "COMPLETE_SIMULATED", reason: "OUTPUT_LIMIT" });
    expect(r.runs[0].events[1]).toMatchObject({ record: { observedOutputBytes: 500, output: null } });
    const f = fixture(); const p = comparativePlanBody(f.plan);
    const noTool = await runComparativeExperiment({ ...f, plan: sealComparativePlan({ ...p, tools: [] }),
      drivers: comparativeFixtureDrivers(), executor: comparativeFixtureExecutor });
    expect(noTool.runs[1].reason).toBe("TOOL_NOT_ADMITTED");
  });

  it("an uncooperative operation is terminal ambiguous, subsequent slots not-run, never clean timeout", async () => {
    const r = await run(async () => new Promise(() => {}), { maxOperationMs: 2 });
    expect(r.runs[0]).toMatchObject({ state: "AMBIGUOUS", accounting: "INCOMPLETE", modelCalls: 1 });
    expect(r.runs[0].events[1]).toMatchObject({ record: { executorSettled: false, cancelRequested: true, state: "AMBIGUOUS" } });
    expect(r.runs.slice(1).every(x => x.state === "NOT_RUN")).toBe(true);
    expect(verifyComparativeResult(r)).toBe(true);
  });

  it("cooperative timeout/cancellation still records unknown accounting, and pre-cancel dispatches nothing", async () => {
    const executor: ComparativeExecutor = request => new Promise((_, reject) => {
      request.signal.addEventListener("abort", () => reject(new Error("ack")), { once: true });
    });
    const r = await run(executor, { maxOperationMs: 2 });
    expect(r.runs[0].events[1]).toMatchObject({ record: { state: "CANCELLED", executorSettled: true, cancelRequested: true } });
    expect(r.runs[0].accounting).toBe("INCOMPLETE"); expect(verifyComparativeResult(r)).toBe(true);
    const controller = new AbortController(); controller.abort();
    const cancelled = await run(executor, {}, comparativeFixtureDrivers(), controller.signal);
    expect(cancelled.runs.every(x => x.state === "NOT_RUN" && x.events.length === 0)).toBe(true);
  });

  it("driver never settles or dispatches unawaited/concurrent work cannot become complete", async () => {
    const driver: ComparativeLaneDriver = async () => new Promise(() => {});
    const never = await run(comparativeFixtureExecutor, { maxWallMs: 10, maxOperationMs: 5 },
      { SINGLE_LLM: driver, TOOL_FIRST: driver, ADAPTIVE: driver });
    expect(never.runs[0]).toMatchObject({ state: "AMBIGUOUS", reason: "DRIVER_UNSETTLED" });
    const unawaited: ComparativeLaneDriver = async c => {
      void c.broker.model("SOLVE", {}).catch(() => {});
      return { attempt: "Fixture attempt returned while executor still pending", decision: "ACCEPT" };
    };
    const r = await run(async () => new Promise(() => {}), {}, { SINGLE_LLM: unawaited, TOOL_FIRST: unawaited, ADAPTIVE: unawaited });
    expect(r.runs[0].state).toBe("AMBIGUOUS"); expect(verifyComparativeResult(r)).toBe(true);
    const concurrent: ComparativeLaneDriver = async c => {
      await Promise.all([c.broker.model("PLAN", {}), c.broker.model("SOLVE", {})]);
      return { attempt: "Bad concurrent fixture", decision: "ACCEPT" };
    };
    const conflict = await run(async () => new Promise(() => {}), {}, { SINGLE_LLM: concurrent, TOOL_FIRST: concurrent, ADAPTIVE: concurrent });
    expect(conflict.runs[0].state).toBe("AMBIGUOUS"); expect(verifyComparativeResult(conflict)).toBe(true);
  });

  it("rejects repeated session across role/lane/case boundaries", async () => {
    const r = await run(async req => req.kind === "MODEL" ? body() : { body: "fixed tool" });
    expect(r.runs[0].reason).toBe("REPEATED_SESSION"); expect(r.runs[1].reason).toBe("REPEATED_SESSION");
    expect(r.accounting).toBe("INCOMPLETE"); expect(verifyComparativeResult(r)).toBe(true);
  });

  it("rehashed omissions, repeated identities, totals, decisions, authority promotion and semantic output corruption fail", async () => {
    const good = await run();
    const mutations: ((r: ComparativeResult) => void)[] = [
      r => { r.runs.pop(); }, r => { r.runs[1] = structuredClone(r.runs[0]); },
      r => { r.runs[0].observedTokens++; }, r => { r.runs[0].thresholdOvershoot++; },
      r => { r.runs[0].attempt += " altered"; }, r => { r.runs[0].decision = "REJECT"; },
      r => { r.references[0].rubric += " altered"; },
      r => { r.runs[0].elapsedMs = 0; },
      r => { const e = r.runs[0].events[1]; if (e.phase === "SETTLED") e.record.output += " altered"; },
      r => { const e = r.runs[0].events[1]; if (e.phase === "SETTLED") e.record.usageState = "UNKNOWN"; },
      r => { r.runs[0].events.splice(0, 1); },
      r => { const run = r.runs[0]; run.events = []; run.modelCalls = 0; run.observedTokens = 0; },
    ];
    for (const mutation of mutations) {
      const changed = structuredClone(good); mutation(changed); rehashResult(changed); expect(verifyComparativeResult(changed)).toBe(false);
    }
    expect(verifyComparativeResult({ ...good, scientificYield: "BREAKTHROUGH" })).toBe(false);
    expect(verifyComparativeResult({ ...good, executionProvenance: "VERIFIED_LIVE_MODEL" })).toBe(false);
  });

  it("finalization validates sealed attempt and review decision instead of accepting arbitrary driver output", async () => {
    const fake: ComparativeLaneDriver = async c => {
      const attempt = await c.broker.model("SOLVE", c.solver);
      await c.broker.model("REVIEW", c.reviewer(attempt));
      return { attempt: `${attempt} changed after sealing`, decision: "REJECT" };
    };
    const r = await run(comparativeFixtureExecutor, {}, { SINGLE_LLM: fake, TOOL_FIRST: fake, ADAPTIVE: fake });
    expect(r.runs.every(x => x.reason === "REQUIRED_OPERATION_BINDING_MISSING" && x.score === null)).toBe(true);
    const noop: ComparativeLaneDriver = async () => ({ attempt: "Not model-authored", decision: "ACCEPT" });
    const empty = await run(comparativeFixtureExecutor, {}, { SINGLE_LLM: noop, TOOL_FIRST: noop, ADAPTIVE: noop });
    expect(empty.runs.every(x => x.state === "STOPPED")).toBe(true);
  });

  it("fully rehashed successful receipts cannot exceed operation deadline or remaining wall boundary", async () => {
    const good = await run();
    for (const duration of [1_000, 1_500]) {
      const r = structuredClone(good), lane = r.runs[0];
      const start = lane.events[0], finish = lane.events[1], reviewStart = lane.events[2], reviewFinish = lane.events[3];
      if (start.phase !== "PENDING" || finish.phase !== "SETTLED" || reviewStart.phase !== "PENDING" || reviewFinish.phase !== "SETTLED") throw new Error("Fixture shape");
      start.startedMs = 0; finish.record.startedMs = 0; finish.record.finishedMs = duration; finish.record.elapsedMs = duration;
      reviewStart.startedMs = duration + 1; reviewFinish.record.startedMs = duration + 1;
      reviewFinish.record.finishedMs = duration + 2; reviewFinish.record.elapsedMs = 1; lane.elapsedMs = duration + 3;
      expect(verifyComparativeResult(rehashResult(r))).toBe(false);
    }
    const r = structuredClone(good), lane = r.runs[0];
    const first = lane.events[0], finish = lane.events[1];
    if (first.phase !== "PENDING" || finish.phase !== "SETTLED") throw new Error("Fixture shape");
    first.startedMs = 4_999; finish.record.startedMs = 4_999; finish.record.finishedMs = 5_000;
    finish.record.elapsedMs = 1;
    lane.events.splice(2); lane.modelCalls = 1; lane.observedTokens = 160;
    lane.elapsedMs = 5_003; lane.state = "STOPPED"; lane.reason = "WALL_LIMIT";
    lane.decision = "ABSTAIN"; lane.score = null; r.accounting = "INCOMPLETE"; r.comparison = "INCOMPLETE";
    expect(verifyComparativeResult(rehashResult(r))).toBe(false);
  });

  it("rehashed tool-as-planner and illegal tool SOURCE/SOLVE/REVIEW roles reject with complete accounting", async () => {
    const good = await run();
    for (const role of ["PLAN", "SOURCE", "SOLVE", "REVIEW"] as const) {
      const r = structuredClone(good), lane = r.runs[2];
      const plannerFinish = lane.events[1];
      if (plannerFinish.phase !== "SETTLED" || !plannerFinish.record.usage) throw new Error("Fixture shape");
      lane.observedTokens -= plannerFinish.record.usage.inputTokens + plannerFinish.record.usage.outputTokens;
      lane.modelCalls--; lane.events.splice(0, 2);
      const toolStart = lane.events[0], toolFinish = lane.events[1];
      if (toolStart.phase !== "PENDING" || toolFinish.phase !== "SETTLED") throw new Error("Fixture shape");
      toolStart.role = role; toolFinish.record.role = role;
      expect(verifyComparativeResult(rehashResult(r))).toBe(false);
    }
  });

  it("rehashed planner/tool-first sequence drift rejects even with consistent serial chronology", async () => {
    const good = await run();
    for (const laneIndex of [1, 2]) {
      const r = structuredClone(good), lane = r.runs[laneIndex];
      const pairs = [];
      for (let i = 0; i < lane.events.length; i += 2) pairs.push(lane.events.slice(i, i + 2));
      // TOOL_FIRST: solve then tool then review. ADAPTIVE: tool then planner then solve then review.
      const reordered = laneIndex === 1 ? [pairs[1], pairs[0], pairs[2]] : [pairs[1], pairs[0], pairs[2], pairs[3]];
      lane.events = reordered.flat();
      for (let i = 0; i < lane.events.length; i += 2) {
        const start = lane.events[i], finish = lane.events[i + 1];
        if (start.phase !== "PENDING" || finish.phase !== "SETTLED") throw new Error("Fixture shape");
        start.startedMs = i + 1; finish.record.startedMs = i + 1; finish.record.finishedMs = i + 2; finish.record.elapsedMs = 1;
      }
      lane.elapsedMs = lane.events.length + 2;
      expect(verifyComparativeResult(rehashResult(r))).toBe(false);
    }
  });

  it("real synchronous elapsed deadline and external mid-call cancellation do not accept a returned receipt", async () => {
    const blocking: ComparativeExecutor = async request => {
      const start = performance.now(); while (performance.now() - start < 4) { /* fixed bounded synchronous fixture */ }
      return comparativeFixtureExecutor(request);
    };
    const r = await run(blocking, { maxOperationMs: 1 });
    expect(r.runs[0]).toMatchObject({ state: "STOPPED", reason: "OPERATION_DEADLINE_EXCEEDED", observedTokens: 160 });
    const controller = new AbortController();
    const cooperative: ComparativeExecutor = request => new Promise((_, reject) => {
      request.signal.addEventListener("abort", () => reject(new ComparativeOperationFailure({
        inputTokens: 8, outputTokens: 0, cachedInputTokens: 0, reasoningOutputTokens: 0 })), { once: true });
      queueMicrotask(() => controller.abort());
    });
    const cancelled = await run(cooperative, {}, comparativeFixtureDrivers(), controller.signal);
    expect(cancelled.runs[0]).toMatchObject({ state: "STOPPED", reason: "EXTERNAL_CANCEL", observedTokens: 8 });
    expect(cancelled.runs.slice(1).every(x => x.state === "NOT_RUN")).toBe(true);
  });

  it("shipped fixed CLI executes complete/unknown/overshoot/timeout without a provider, rejecting dynamic scenario flags", () => {
    for (const scenario of ["complete", "unknown-usage", "overshoot", "uncooperative-timeout"]) {
      const child = spawnSync(process.execPath, ["--import", "tsx",
        "scripts/operations/math-comparative-experiment.ts", `--scenario=${scenario}`],
      { encoding: "utf8", timeout: 10_000, maxBuffer: 2_097_152, env: { PATH: process.env.PATH, NODE_ENV: "test" } });
      expect(child.status).toBe(0);
      const retained: unknown = JSON.parse(child.stdout);
      expect(verifyComparativeResult(retained)).toBe(true);
      expect(retained).toMatchObject({ scientificYield: "NOT_MEASURED", mode: "OFFLINE_FIXTURE" });
    }
    const refused = spawnSync(process.execPath, ["--import", "tsx",
      "scripts/operations/math-comparative-experiment.ts", "--provider=codex"],
    { encoding: "utf8", timeout: 10_000, env: { PATH: process.env.PATH, NODE_ENV: "test" } });
    expect(refused.status).toBe(1); expect(refused.stdout).toBe("");
  }, 30_000);

  it("inert JSON CLI verification cannot authenticate imported receipts and bounds input bytes", async () => {
    const directory = await mkdtemp(join(tmpdir(), "hive-comparator-cli-test-"));
    const file = join(directory, "retained.json");
    try {
      await writeFile(file, JSON.stringify(await run()));
      const child = spawnSync(process.execPath, ["--import", "tsx", "scripts/operations/math-comparative-experiment.ts", `--verify=${file}`],
        { encoding: "utf8", timeout: 10_000, env: { PATH: process.env.PATH, NODE_ENV: "test" } });
      expect(child.status).toBe(0);
      expect(JSON.parse(child.stdout)).toEqual({ mode: "INERT_RETAINED_JSON_VERIFICATION", integrity: "PASS",
        executionAuthenticity: "UNATTESTED", scientificYield: "NOT_MEASURED" });
      await writeFile(file, "x".repeat(2_097_153));
      const large = spawnSync(process.execPath, ["--import", "tsx", "scripts/operations/math-comparative-experiment.ts", `--verify=${file}`],
        { encoding: "utf8", timeout: 10_000, env: { PATH: process.env.PATH, NODE_ENV: "test" } });
      expect(large.status).toBe(1); expect(large.stdout).toBe("");
      await writeFile(file, '{"retained":"malformed"}');
      const malformed = spawnSync(process.execPath, ["--import", "tsx", "scripts/operations/math-comparative-experiment.ts", `--verify=${file}`],
        { encoding: "utf8", timeout: 10_000, env: { PATH: process.env.PATH, NODE_ENV: "test" } });
      expect(malformed.status).toBe(1); expect(JSON.parse(malformed.stdout).integrity).toBe("FAIL");
    } finally { await rm(directory, { recursive: true, force: true }); }
  }, 30_000);
});
