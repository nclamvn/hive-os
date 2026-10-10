import { beforeAll, describe, expect, it } from "vitest";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import {
  admitLrcLoopInformation,
  admitLrcLoopRecord,
  admitLrcLoopRelation,
  createLrcLoopHostRegistry,
  digestLrcLoopPredicate,
  planLrcResearchLoop,
} from "@/modules/research-sandbox/math-lrc-research-loop";
import {
  binding, equivalence, fixture, info, policy, predicateA, predicateB, refutation,
  type Fixture,
} from "./math-lrc-research-loop-fixture";

// Independent assertions; shared fixture generation is synthetic, not actual execution.
const clone = <T>(value: T): T => structuredClone(value);
let first: Fixture, second: Fixture;
beforeAll(() => { first = fixture(101); second = fixture(102); });
type Policy = ReturnType<typeof policy>;
function setup(p: Policy = policy(first, second), rawSecond: Fixture = second) {
  const registry = createLrcLoopHostRegistry(p);
  return { registry, records: [admitLrcLoopRecord(registry, "r1", first), admitLrcLoopRecord(registry, "r2", rawSecond)] };
}

describe("TIP069 independent trust and input-refusal controls", () => {
  it.each(["solverJobId", "runStatus", "reviewJobStatus", "caseId", "runId"])("refuses unpinned wrapper mutation: %s", field => {
    const registry = createLrcLoopHostRegistry(policy(first, second)), raw = clone(first);
    Object.assign(raw, { [field]: "forged-wrapper" });
    expect(() => admitLrcLoopRecord(registry, "r1", raw)).toThrow("EXTERNAL_BINDING");
  });
  it("refuses fabricated attempt number despite unchanged retained digests", () => {
    const registry = createLrcLoopHostRegistry(policy(first, second));
    expect(() => admitLrcLoopRecord(registry, "r1", { ...first, attemptNumber: 2 })).toThrow();
  });
  it("refuses distinct tokens admitting the same actual binding twice", () => {
    const s = setup(), again = admitLrcLoopRecord(s.registry, "r1", first);
    expect(() => planLrcResearchLoop({ registry: s.registry, records: [s.records[0], again] })).toThrow("DUPLICATE_ADMISSION");
  });
  it("refuses copied registry, record, information and relation brands", () => {
    const p = policy(first, second), receipt = info(first, second), relation = refutation();
    p.information.push(receipt); p.relations.push(relation);
    const s = setup(p), acceptedInfo = admitLrcLoopInformation(s.registry, s.records[1], receipt), acceptedRelation = admitLrcLoopRelation(s.registry, relation);
    expect(() => planLrcResearchLoop({ ...s, registry: clone(s.registry) })).toThrow("UNTRUSTED_REGISTRY");
    expect(() => planLrcResearchLoop({ ...s, records: [clone(s.records[0])] })).toThrow("FORGED_ADMISSION");
    expect(() => planLrcResearchLoop({ ...s, information: [clone(acceptedInfo)] })).toThrow("FORGED_INFORMATION");
    expect(() => planLrcResearchLoop({ ...s, relations: [clone(acceptedRelation)] })).toThrow("FORGED_RELATION");
  });
  it("refuses sparse huge arrays without executing an inherited map", () => {
    const sparse = new Array(2 ** 30);
    expect(() => createLrcLoopHostRegistry(sparse)).toThrow("MALFORMED_ARRAY");
    let invoked = false;
    const modified = [1]; Object.setPrototypeOf(modified, { map() { invoked = true; throw new Error("HOOK_RAN"); } });
    expect(() => createLrcLoopHostRegistry(modified)).toThrow("MALFORMED_ARRAY");
    expect(invoked).toBe(false);
  });
  it("refuses accessor values before invoking getters", () => {
    let invoked = false;
    const raw: Record<string, unknown> = {};
    Object.defineProperty(raw, "data", { enumerable: true, get() { invoked = true; throw new Error("HOOK_RAN"); } });
    expect(() => createLrcLoopHostRegistry(raw)).toThrow("MALFORMED"); expect(invoked).toBe(false);
  });
  it("refuses cycle, excessive depth, nonfinite and aggregate over-cap input", () => {
    const cycle: Record<string, unknown> = {}; cycle.cycle = cycle;
    let deep: unknown = null; for (let i = 0; i < 34; i++) deep = [deep];
    for (const raw of [cycle, deep, Infinity, { oversized: "界".repeat(699051) }]) expect(() => createLrcLoopHostRegistry(raw)).toThrow(/LRC_LOOP_/);
  });
  it("refuses 17 record tokens before trying any forged admission", () => {
    expect(() => planLrcResearchLoop({ records: Array.from({ length: 17 }, () => ({ version: 1 as const, bindingId: "fake", ledgerDigest: sha256("fake") })) })).toThrow("INPUT_CAP");
  });
});

describe("TIP069 independent ordered execution and complete accounting", () => {
  it("hard-stops duplicate COMPLETED lineage after charging both entries", () => {
    const p = policy(first, second); p.batch.experiments[1].recordBindingId = "r1";
    const out = planLrcResearchLoop(setup(p));
    expect(out.decision).toBe("STOP_HARD"); expect(out.reason).toBe("DUPLICATE_COMPLETED_LINEAGE");
    expect(out.noInformationStreak).toBe(1); expect(out.chargedExperiments).toBe(2); expect(out.consumed.roleCalls).toBe(6);
  });
  it("renaming binding and solver job cannot duplicate the same case/run/review lineage", () => {
    const raw = { ...clone(first), solverJobId: "renamed-solver-job" }, p = policy(first, second);
    p.bindings[1] = binding(raw, "r2");
    const out = planLrcResearchLoop(setup(p, raw));
    expect(out.reason).toBe("DUPLICATE_COMPLETED_LINEAGE"); expect(out.noInformationStreak).toBe(1); expect(out.consumed.roleCalls).toBe(6);
  });
  it("shared actual solver job under otherwise distinct records does not create a second experiment", () => {
    const raw = { ...clone(second), solverJobId: first.solverJobId }, p = policy(first, raw);
    const out = planLrcResearchLoop(setup(p, raw));
    expect(out.reason).toBe("DUPLICATE_COMPLETED_LINEAGE"); expect(out.noInformationStreak).toBe(1);
  });
  it.each(["OPERATIONAL_FAILED", "INTEGRITY_FAILED", "ACCOUNTING_FAILED", "RESOURCE_FAILED"])("charges later in-flight consumption after %s", state => {
    const p = policy(first, second); p.batch.experiments[0].state = state; p.batch.experiments[1].state = "IN_FLIGHT";
    const out = planLrcResearchLoop(setup(p));
    expect(out.decision).toBe("STOP_HARD"); expect(out.accountingComplete).toBe(true);
    expect(out.chargedExperiments).toBe(2); expect(out.consumed.inputTokens).toBe(7404); expect(out.consumed.wallMs).toBe(20000);
  });
  it("unknown early consumption is flagged incomplete and later known work still charged", () => {
    const p = policy(first, second); Object.assign(p.batch.experiments[0], { usage: null }); p.batch.experiments[1].state = "IN_FLIGHT";
    const out = planLrcResearchLoop(setup(p));
    expect(out.decision).toBe("STOP_HARD"); expect(out.accountingComplete).toBe(false);
    expect(out.chargedExperiments).toBe(2); expect(out.consumed.roleCalls).toBe(3); expect(out.nextCandidateId).toBeNull();
  });
  it("an earlier incomplete ordered experiment cannot be skipped to accumulate two completions", () => {
    const p = policy(first, second); p.batch.experiments[0].state = "IN_FLIGHT";
    const out = planLrcResearchLoop(setup(p));
    expect(out.decision).toBe("PLANNING_ONLY"); expect(out.noInformationStreak).toBe(0); expect(out.nextCandidateId).toBeNull();
  });
  it("current candidate must agree with declared actual execution context", () => {
    const p = policy(first, second); p.batch.currentCandidateId = "b";
    expect(() => createLrcLoopHostRegistry(p)).toThrow("CURRENT_CANDIDATE_DRIFT");
  });
  it("fixed reproduction records cannot become completed discovery by assignment", () => {
    const p = policy(first, second); p.batch.currentCandidateId = "b";
    for (const e of p.batch.experiments) e.candidateId = "b";
    const out = planLrcResearchLoop(setup(p));
    expect(out.decision).toBe("STOP_HARD"); expect(out.reason).toBe("RECORD_CANDIDATE_ALIGNMENT"); expect(out.noInformationStreak).toBe(0);
  });
  it("a replacement REPRODUCTION label cannot hide unrelated predicate text", () => {
    const p = policy(first, second); p.batch.candidates[0].predicate = clone(predicateB);
    const out = planLrcResearchLoop(setup(p)); expect(out.reason).toBe("RECORD_CANDIDATE_ALIGNMENT");
  });
});

describe("TIP069 independent semantic information and diversity", () => {
  it("the known lemma hypothesis does not conflate proof obligations with assumptions", () => {
    expect(predicateA.assumptions).toHaveLength(1);
    expect(predicateA.assumptions[0]).toContain("1");
    expect(predicateA.statement).toContain("LRC(m) for every m in {1,...,12}");
    expect(predicateA.domain).toContain("e*m_d<d");
  });
  it("assumption permutation is the same predicate, quantifier permutation is not", () => {
    expect(digestLrcLoopPredicate({ ...predicateB, assumptions: [...predicateB.assumptions].reverse() })).toBe(digestLrcLoopPredicate(predicateB));
    expect(digestLrcLoopPredicate({ ...predicateA, orderedQuantifiers: [...predicateA.orderedQuantifiers].reverse() })).not.toBe(digestLrcLoopPredicate(predicateA));
    expect(() => digestLrcLoopPredicate({ ...predicateA, assumptions: [...predicateA.assumptions, predicateA.assumptions[0]] })).toThrow();
  });
  it("renaming candidate and permuting identical assumptions is not a pivot", () => {
    const p = policy(first, second); p.batch.candidates[1].predicate = { ...clone(predicateA), assumptions: [...predicateA.assumptions].reverse() };
    const out = planLrcResearchLoop(setup(p)); expect(out.decision).toBe("STOP_NO_INFORMATION"); expect(out.nextCandidateId).toBeNull();
  });
  it("separate evidence excludes an equivalent pivot; absent receipts cannot bypass missing commitment", () => {
    const p = policy(first, second), rel = equivalence(); p.relations.push(rel);
    const s = setup(p);
    const absent = planLrcResearchLoop(s);
    expect(absent).toMatchObject({ decision: "STOP_HARD", nextCandidateId: null, commitmentStatus: "COMMITMENT_REQUIRED" });
    expect(absent.excludedCandidateIds).toEqual([]);
    const equivalent = planLrcResearchLoop({ ...s, relations: [admitLrcLoopRelation(s.registry, rel)] });
    expect(equivalent.decision).toBe("STOP_NO_INFORMATION"); expect(equivalent.nextCandidateId).toBeNull();
  });
  it("changed assumptions remain distinct from exact refutation scope", () => {
    const p = policy(first, second), rel = refutation(); p.relations.push(rel); const s = setup(p);
    const out = planLrcResearchLoop({ ...s, relations: [admitLrcLoopRelation(s.registry, rel)] });
    expect(out.excludedCandidateIds).toEqual(["a"]); expect(out.nextCandidateId).toBeNull(); expect(out.commitmentStatus).toBe("COMMITMENT_REQUIRED");
  });
  it("reused evidence under changed receipt IDs cannot reset twice", () => {
    const p = policy(first, second), one = info(first, second, "NEW_ALIGNED_OBLIGATION", "e1"), two = { ...info(first, second), id: "renamed-receipt", evidenceDigest: one.evidenceDigest };
    p.information.push(one, two); const s = setup(p);
    const out = planLrcResearchLoop({ ...s, information: [admitLrcLoopInformation(s.registry, s.records[1], two), admitLrcLoopInformation(s.registry, s.records[0], one)] });
    expect(out.noInformationStreak).toBe(1);
  });
  it("new evidence hashes cannot repeatedly reset the same predefined uncertainty delta", () => {
    const p = policy(first, second), delta = { id: "overlap-width", before: 10, after: 7 };
    const one = { ...info(first, second, "PREDEFINED_UNCERTAINTY_DELTA", "e1"), previousStatus: null, resultStatus: null, uncertainty: delta };
    const two = { ...info(first, second, "PREDEFINED_UNCERTAINTY_DELTA"), previousStatus: null, resultStatus: null, uncertainty: delta };
    p.information.push(one, two); const s = setup(p);
    expect(planLrcResearchLoop({ ...s, information: [admitLrcLoopInformation(s.registry, s.records[0], one), admitLrcLoopInformation(s.registry, s.records[1], two)] }).noInformationStreak).toBe(1);
  });
  it.each([[6, 1], [5, 0], [8, 1]])("after accepted10-to7, receipt10-to%s has final streak%s", (after, expectedStreak) => {
    const p = policy(first, second);
    const one = { ...info(first, second, "PREDEFINED_UNCERTAINTY_DELTA", "e1"), previousStatus: null, resultStatus: null, uncertainty: { id: "overlap-width", before: 10, after: 7 } };
    const two = { ...info(first, second, "PREDEFINED_UNCERTAINTY_DELTA"), id: "different-later-receipt", previousStatus: null, resultStatus: null, uncertainty: { id: "overlap-width", before: 10, after } };
    p.information.push(one, two); const s = setup(p);
    const out = planLrcResearchLoop({ ...s, information: [admitLrcLoopInformation(s.registry, s.records[1], two), admitLrcLoopInformation(s.registry, s.records[0], one)] });
    expect(out.noInformationStreak).toBe(expectedStreak);
  });
  it("multiple receipts in one experiment have the same frontier after input shuffling", () => {
    const p = policy(first, second);
    const receipt = (experimentId: string, after: number) => ({ ...info(first, second, "PREDEFINED_UNCERTAINTY_DELTA", experimentId), id: `${experimentId}-after-${after}`, evidenceDigest: sha256(`${experimentId}-after-${after}`), previousStatus: null, resultStatus: null, uncertainty: { id: "overlap-width", before: 10, after } });
    const one = receipt("e1", 7), better = receipt("e1", 6), later = receipt("e2", 5);
    p.information.push(one, better, later); const s = setup(p);
    const admitted = [admitLrcLoopInformation(s.registry, s.records[0], one), admitLrcLoopInformation(s.registry, s.records[0], better), admitLrcLoopInformation(s.registry, s.records[1], later)];
    const forward = planLrcResearchLoop({ ...s, information: admitted }), reversed = planLrcResearchLoop({ ...s, information: [...admitted].reverse() });
    expect(sha256(canonicalJson(forward))).toBe(sha256(canonicalJson(reversed)));
    expect(forward.noInformationStreak).toBe(1); // e1 best6, then e2 adds only1 under minimumDelta2.
  });
  it("a finite result cannot align the complete real-time conditional lemma", () => {
    const p = policy(first, second), receipt = { ...info(first, second), resultStatus: "FINITE_CHECKED" };
    p.information.push(receipt); const s = setup(p);
    expect(() => admitLrcLoopInformation(s.registry, s.records[1], receipt)).toThrow("ALIGNMENT");
  });
  it("uncertainty subtraction must remain finite as well as its endpoints", () => {
    const p = policy(first, second);
    for (const e of p.batch.experiments) e.criterion.uncertainty.baseline = Number.MAX_VALUE;
    const receipt = { ...info(first, second, "PREDEFINED_UNCERTAINTY_DELTA"), previousStatus: null, resultStatus: null, uncertainty: { id: "overlap-width", before: Number.MAX_VALUE, after: -Number.MAX_VALUE } };
    p.information.push(receipt); const s = setup(p);
    expect(() => admitLrcLoopInformation(s.registry, s.records[1], receipt)).toThrow("ALIGNMENT");
  });
  it("a criterion ID pins one predeclared definition throughout the batch", () => {
    const p = policy(first, second); p.batch.experiments[1].criterion.uncertainty.baseline = 20;
    expect(() => createLrcLoopHostRegistry(p)).toThrow();
  });
  it.each(["KNOWN_FINITE_PASS", "REVIEWER_VOTE", "PROSE_CHANGE", "SOURCE_ADOPTION"])("independently admitted %s still is not mathematical information", kind => {
    const p = policy(first, second), receipt = info(first, second, kind); p.information.push(receipt); const s = setup(p);
    expect(planLrcResearchLoop({ ...s, information: [admitLrcLoopInformation(s.registry, s.records[1], receipt)] }).noInformationStreak).toBe(2);
  });
  it("keeps all78 exact findings and deterministic frozen output without proof promotion", () => {
    const s = setup(), forward = planLrcResearchLoop(s), reversed = planLrcResearchLoop({ ...s, records: [...s.records].reverse() });
    expect(canonicalJson(forward)).toBe(canonicalJson(reversed)); expect(forward.tasks).toHaveLength(13);
    expect(forward.tasks.reduce((n, t) => n + t.sources.length, 0)).toBe(78);
    expect(forward.tasks.every(t => t.sources.every(source => source.findingDigest.length === 64 && source.reason.length > 0))).toBe(true);
    expect(Object.isFrozen(forward.tasks[0].sources[0])).toBe(true); expect(Buffer.byteLength(canonicalJson(forward))).toBeLessThanOrEqual(262144);
    expect(forward.dispatchAllowed).toBe(false); expect(forward.proofClosure).toBe(false); expect(forward.globalLrc).toBe("NOT_ESTABLISHED");
  });
});
