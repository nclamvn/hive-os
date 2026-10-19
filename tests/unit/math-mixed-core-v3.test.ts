import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { validateMathCycleTrace } from "@/modules/research-sandbox/math-cycle-kernel";
import { mixedCoreAgentEvidenceSchema, mixedCoreAgentMandate, mixedCoreEvidenceMatchesMethod,
  mixedCoreEvidencePassed, mixedCoreRefutation, runMixedCoreAgentEvidence,
  validateMixedCoreAgentEvidence, type MixedCoreAgentEvidence } from "@/modules/research-sandbox/math-mixed-core-agent";
import { MIXED_CORE_POWER_PACKET_SHA256, MIXED_CORE_POWER_PYTHON_SHA256,
  mixedCorePowerEvidenceSchema } from "@/modules/research-sandbox/math-mixed-core-power";
import { runMixedCorePowerEvidence } from "@/server/research/mixed-core-power-evidence";
import { MathMixedCorePowerPanel } from "@/components/research/math-mixed-core-power-panel";
import * as checker from "../../scripts/operations/higherpower-core-check";
import * as replay from "../../scripts/operations/higherpower-core-replay";

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return { ...actual, readFileSync: vi.fn(actual.readFileSync) };
});

type V3 = Extract<MixedCoreAgentEvidence, { method: "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V3" }>;
const root = "a".repeat(64);
const attemptedPartialDigest = sha256("TEST_ONLY_ATTEMPTED_PARTIAL_G_PREFIX_NOT_COMPLETE");
let v3: V3, v2: MixedCoreAgentEvidence;
const marker = { phase: "PRIOR_ART", round: 1, facts: [], coverage: "CURATED_PARTIAL", researchMethod: "MIXED_CORE_REPLAY_V3" };
const call = { phase: "CALL_STARTED", round: 1, role: "PLANNER" };
function reseal(value: Record<string, unknown>) {
  const { evidenceDigest: _ignored, ...body } = value; void _ignored;
  return { ...body, evidenceDigest: sha256(canonicalJson(body)) };
}
function chain(evidence: unknown, rest: Record<string, unknown>[] = [call], method = "MIXED_CORE_REPLAY_V3") {
  let previousDigest: string | null = null;
  return [{ ...marker, researchMethod: method }, { phase: "MIXED_CORE_EVIDENCE", round: 1, evidence }, ...rest]
    .map((payload, index) => {
      const digest = sha256(canonicalJson({ previousDigest, payload }));
      const event = { sequence: index + 1, round: payload.round as number, phase: payload.phase as string, payload, previousDigest, digest };
      previousDigest = digest; return event;
    });
}
function failed(status: "PARTIAL" | "UNAVAILABLE" | "MISMATCH") {
  return mixedCoreAgentEvidenceSchema.parse(reseal({ ...v3, power: { ...v3.power,
    packet: status === "PARTIAL" ? null : v3.power.packet,
    failure: status === "PARTIAL" ? "CHECKER_PARTIAL" : "REPLAY_FAILED",
    replay: { ...v3.power.replay, status, scriptDigest: status === "MISMATCH" ? MIXED_CORE_POWER_PYTHON_SHA256 : null,
      primaryDigest: status === "PARTIAL" ? attemptedPartialDigest : v3.power.replay.primaryDigest,
      outputDigest: status === "MISMATCH" ? "b".repeat(64) : null } } }));
}

describe("root-bound retained V3 power evidence", () => {
  beforeAll(async () => {
    v3 = await runMixedCoreAgentEvidence(root, "MIXED_CORE_REPLAY_V3") as V3;
    v2 = await runMixedCoreAgentEvidence(root, "MIXED_CORE_REPLAY_V2");
  }, 45_000);
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

  it("freshly replays all three components with exact G packet and four targets", () => {
    expect(mixedCoreEvidencePassed(v3)).toBe(true);
    expect(v3.power.replay).toMatchObject({ status: "PASS", primaryDigest: MIXED_CORE_POWER_PACKET_SHA256,
      outputDigest: MIXED_CORE_POWER_PACKET_SHA256, scriptDigest: MIXED_CORE_POWER_PYTHON_SHA256 });
    expect(v3.packet).toEqual(v2.packet); expect(v3.replay).toEqual(v2.replay);
    if (v2.method !== "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V2") throw new Error("V2 fixture");
    expect(v3.kernel).toEqual(v2.kernel);
    const packet = v3.power.packet!;
    expect(packet.status).toBe("COMPLETE");
    expect(packet.targets.map((t) => t.p)).toEqual(["131433121", "159727681", "351121", "171348241"]);
    expect(packet.targets.reduce((n, t) => n + t.checkedCores, 0)).toBe(71951);
    expect(packet.targets.reduce((n, t) => n + t.signedPairSlots, 0)).toBe(10738865);
    expect(packet.targets.reduce((n, t) => n + t.coreWitnessCount, 0)).toBe(5);
    expect(packet.targets.reduce((n, t) => n + t.translatedOnlyCoreCount, 0)).toBe(2);
  });
  it("validates retained reordered JSON without invoking G or Python", () => {
    const produce = vi.spyOn(checker, "higherpowerCorePacket"), python = vi.spyOn(replay, "replayHigherpowerCore");
    const reordered = JSON.parse(JSON.stringify(v3), (_key, value) => value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).reverse()) : value);
    expect(validateMixedCoreAgentEvidence(reordered, root)).toBe(true);
    expect(validateMathCycleTrace(chain(reordered), root)).not.toBeNull();
    expect(produce).not.toHaveBeenCalled(); expect(python).not.toHaveBeenCalled();
  });
  it("rejects rehashed packet mutations including scope, limits, completion, target set and witness", () => {
    const packet = v3.power.packet!;
    for (const changed of [
      { ...packet, scope: "All targets/all supports" }, { ...packet, limits: { ...packet.limits, secondsPerTarget: 31 } },
      { ...packet, status: "PARTIAL" }, { ...packet, targets: packet.targets.slice(1) },
      { ...packet, targets: [...packet.targets].reverse() },
      { ...packet, targets: [{ ...packet.targets[0], coreWitnessCount: 3 }, ...packet.targets.slice(1)] },
      { ...packet, targets: [{ ...packet.targets[0], checkedCores: 1 }, ...packet.targets.slice(1)] },
    ]) expect(validateMixedCoreAgentEvidence(reseal({ ...v3, power: { ...v3.power, packet: changed } }), root)).toBe(false);
  });
  it("rejects source/output/primary/envelope hashes, wrong root and stripping or downgrading V3", () => {
    for (const changed of [
      { ...v3, rootContractDigest: "b".repeat(64) },
      ...["scriptDigest", "primaryDigest", "outputDigest"].map((key) => ({ ...v3,
        power: { ...v3.power, replay: { ...v3.power.replay, [key]: "b".repeat(64) } } })),
      { ...v3, power: { ...v3.power, checkerDigest: "b".repeat(64) } },
      { ...v3, method: "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V2" },
      { ...v3, power: undefined },
    ]) expect(validateMathCycleTrace(chain(reseal(changed)), root)).toBeNull();
    expect(validateMixedCoreAgentEvidence({ ...v3, evidenceDigest: "b".repeat(64) }, root)).toBe(false);
    expect(validateMathCycleTrace(chain(v2), root)).toBeNull();
    expect(validateMathCycleTrace(chain(v3, [], "MIXED_CORE_REPLAY_V2"), root)).toBeNull();
    expect(mixedCoreEvidenceMatchesMethod(v3, "MIXED_CORE_REPLAY_V3")).toBe(true);
    expect(mixedCoreEvidenceMatchesMethod(v3, "MIXED_CORE_REPLAY_V2")).toBe(false);
  });
  it.each(["PARTIAL", "UNAVAILABLE", "MISMATCH"] as const)("retains typed %s then stops before any call", (status) => {
    const evidence = failed(status);
    expect(mixedCoreEvidencePassed(evidence)).toBe(false);
    expect(validateMixedCoreAgentEvidence(evidence, root)).toBe(true);
    expect(validateMathCycleTrace(chain(evidence), root)).toBeNull();
    expect(validateMathCycleTrace(chain(evidence, [{ phase: "STOPPED", round: 1, reason: "INTEGRITY_FAILURE" }]), root)).not.toBeNull();
    expect(validateMathCycleTrace(chain(evidence, [{ phase: "STOPPED", round: 1, reason: "NO_GAP" }]), root)).toBeNull();
    expect(mixedCoreRefutation("KNOWN_RELATION_BOUND_IS_EXACT_FOR_EVERY_PRIME_MODULUS", evidence)).toBeNull();
  });
  it("preserves historical V2 version, mandate and absence of power payload", () => {
    expect(mixedCoreAgentMandate(v2)).not.toContain("q99");
    expect(mixedCoreAgentMandate(v2)).not.toContain("71951");
    expect(v2).not.toHaveProperty("power");
    expect(validateMathCycleTrace(chain(v2, [call], "MIXED_CORE_REPLAY_V2"), root)).not.toBeNull();
    expect(mixedCoreRefutation("KNOWN_RELATION_BOUND_IS_EXACT_FOR_EVERY_PRIME_MODULUS", v3)).not.toBeNull();
    expect(mixedCoreAgentMandate(v3)).toContain("NOT replayed or retained as a V3 power witness");
    expect(mixedCoreAgentMandate(v3)).toContain("retained V1 baseline");
    expect(mixedCoreAgentMandate(v3)).toContain("does NOT exclude that root");
  });
  it("renders retained V3 math/counts/provenance, never executes tools or promotes PARTIAL", () => {
    const produce = vi.spyOn(checker, "higherpowerCorePacket"), python = vi.spyOn(replay, "replayHigherpowerCore");
    const html = renderToStaticMarkup(createElement(MathMixedCorePowerPanel, { evidence: v3.power, vi: false }));
    expect(html).toContain("71,951"); expect(html).toContain("katex");
    expect(html).toContain("345579733707720"); expect(html).toContain("92679090192");
    expect(html).toContain("NOT replayed/retained"); expect(html).toContain("does NOT exclude the root");
    const partial = failed("PARTIAL") as V3;
    const failedHtml = renderToStaticMarkup(createElement(MathMixedCorePowerPanel, { evidence: partial.power, vi: true }));
    expect(failedHtml).toContain("INTEGRITY_FAILURE"); expect(failedHtml).not.toContain("71,951");
    expect(failedHtml).not.toContain("345579733707720");
    expect(produce).not.toHaveBeenCalled(); expect(python).not.toHaveBeenCalled();
  });
  it("rejects fabricated actual provenance on UNAVAILABLE", () => {
    const power = (failed("UNAVAILABLE") as V3).power;
    expect(mixedCorePowerEvidenceSchema.safeParse({ ...power, replay: { ...power.replay,
      scriptDigest: MIXED_CORE_POWER_PYTHON_SHA256 } }).success).toBe(false);
    for (const failure of ["CHECKER_PARTIAL", "CHECKER_UNAVAILABLE", "PACKET_DRIFT"])
      expect(mixedCorePowerEvidenceSchema.safeParse({ ...power, failure }).success).toBe(false);
    const partial = (failed("PARTIAL") as V3).power;
    expect(mixedCorePowerEvidenceSchema.safeParse({ ...partial, replay: { ...partial.replay,
      primaryDigest: MIXED_CORE_POWER_PACKET_SHA256 } }).success).toBe(false);
  });
  it("adapts real checker PARTIAL/drift without calling replay or passing completion", () => {
    const produce = vi.spyOn(checker, "higherpowerCorePacket");
    const python = vi.spyOn(replay, "replayHigherpowerCore");
    const partial = { ...v3.power.packet!, status: "PARTIAL" as const };
    produce.mockReturnValue(partial);
    const result = runMixedCorePowerEvidence();
    expect(result).toMatchObject({ packet: null, failure: "CHECKER_PARTIAL", replay: { status: "PARTIAL", outputDigest: null, scriptDigest: null } });
    expect(result.replay.primaryDigest).not.toBe(MIXED_CORE_POWER_PACKET_SHA256);
    produce.mockReturnValue({ ...v3.power.packet!, scope: "Mutated" });
    expect(runMixedCorePowerEvidence()).toMatchObject({ packet: null, failure: "PACKET_DRIFT", replay: { status: "MISMATCH" } });
    expect(python).not.toHaveBeenCalled();
  });
  it("retains actual-null unavailable Python provenance and fixed producer failure", () => {
    const produce = vi.spyOn(checker, "higherpowerCorePacket").mockReturnValue(v3.power.packet!);
    vi.spyOn(replay, "replayHigherpowerCore").mockReturnValue({ status: "UNAVAILABLE", scriptDigest: null,
      expectedScriptDigest: MIXED_CORE_POWER_PYTHON_SHA256, primaryDigest: MIXED_CORE_POWER_PACKET_SHA256, outputDigest: null });
    expect(runMixedCorePowerEvidence()).toMatchObject({ failure: "REPLAY_FAILED",
      replay: { status: "UNAVAILABLE", scriptDigest: null, outputDigest: null } });
    produce.mockImplementation(() => { throw new Error("Unavailable checker"); });
    expect(runMixedCorePowerEvidence()).toMatchObject({ packet: null, failure: "CHECKER_UNAVAILABLE",
      replay: { status: "UNAVAILABLE", scriptDigest: null, outputDigest: null } });
  });
  it("rejects missing/drifted actual checker source before computation or Python", () => {
    const produce = vi.spyOn(checker, "higherpowerCorePacket"), python = vi.spyOn(replay, "replayHigherpowerCore");
    vi.mocked(readFileSync).mockImplementationOnce(() => { throw new Error("Missing fixed source"); });
    expect(runMixedCorePowerEvidence()).toMatchObject({ checkerDigest: null, packet: null,
      failure: "CHECKER_UNAVAILABLE", replay: { status: "UNAVAILABLE", primaryDigest: null, scriptDigest: null } });
    vi.mocked(readFileSync).mockReturnValueOnce(Buffer.from("drifted checker"));
    const result = runMixedCorePowerEvidence();
    expect(result).toMatchObject({ packet: null, failure: "CHECKER_UNAVAILABLE",
      replay: { status: "UNAVAILABLE", primaryDigest: null, scriptDigest: null } });
    expect(result.checkerDigest).toBe(sha256("drifted checker"));
    expect(produce).not.toHaveBeenCalled(); expect(python).not.toHaveBeenCalled();
  });
  it("fails closed with actual-null provenance when Python is absent from PATH", () => {
    vi.spyOn(checker, "higherpowerCorePacket").mockReturnValue(v3.power.packet!);
    vi.stubEnv("PATH", "/private/tmp/hiveos-no-python");
    expect(runMixedCorePowerEvidence()).toMatchObject({ failure: "REPLAY_FAILED", packet: v3.power.packet,
      replay: { status: "UNAVAILABLE", primaryDigest: MIXED_CORE_POWER_PACKET_SHA256,
        scriptDigest: null, outputDigest: null, expectedScriptDigest: MIXED_CORE_POWER_PYTHON_SHA256 } });
  });
});
