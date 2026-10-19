import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { LRC_PROOF_UNIT_PACKET } from "@/modules/research-sandbox/math-lrc-proof-unit";
import {
  LRC_PROOF_UNIT_AUDIT_LIMITS, LRC_PROOF_UNIT_AUDIT_ROLES,
  prepareLrcProofUnitSolverInput, prepareLrcProofUnitCriticInput, prepareLrcProofUnitAdversaryInput,
  prepareLrcProofUnitAuditInput, runOfflineLrcProofUnitAudit,
  validatePreparedLrcProofUnitAuditInput, validateLrcProofUnitAuditReport,
  type PreparedLrcProofUnitAuditInput, type LrcProofUnitRoleResponse, type LrcProofUnitOfflineCallback,
} from "@/modules/research-sandbox/math-lrc-proof-unit-audit";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const hash = (value: unknown) => createHash("sha256").update(canonicalJson(value)).digest("hex");
const contexts = { SOLVER: "offline:solver-1", CRITIC: "offline:critic-1", ADVERSARY: "offline:adversary-1" };
function response(input: PreparedLrcProofUnitAuditInput): LrcProofUnitRoleResponse {
  return { version: 1, mode: "OFFLINE_INJECTED", role: input.role, offlineContextId: input.offlineContextId,
    packetDigest: input.packetDigest, inputDigest: input.inputDigest,
    disposition: "CONDITIONAL_REVIEWED", summary: "Injected structural audit; named premises remain conditional, no theorem certification.",
    premiseFindings: LRC_PROOF_UNIT_PACKET.premises.map(p => ({ id: p.id, status: "CONDITIONAL", reason: "Premise only; not newly verified." })),
    stepFindings: LRC_PROOF_UNIT_PACKET.steps.map(s => ({ id: s.id, status: "CONDITIONAL", reason: "Conditional inference only." })),
  };
}
function harness(override?: LrcProofUnitOfflineCallback) {
  const callback = vi.fn(override ?? (async input => response(input)));
  const callbacks: Record<typeof LRC_PROOF_UNIT_AUDIT_ROLES[number], LrcProofUnitOfflineCallback> = {
    SOLVER: callback, CRITIC: callback, ADVERSARY: callback,
  };
  return { activation: "TIP-063_OFFLINE_AUDIT" as const, packet: clone(LRC_PROOF_UNIT_PACKET), contexts: { ...contexts },
    callbacks, callback };
}
function rehashReport<T extends { auditDigest: string }>(raw: T): T {
  const body = Object.fromEntries(Object.entries(raw).filter(([key]) => key !== "auditDigest"));
  return { ...body, auditDigest: hash(body) } as T;
}

describe("TIP-063 proof unit role preparation", () => {
  it("shares exact full canonical packet data across three explicit helpers with distinct digest-bound inputs", () => {
    const inputs = [prepareLrcProofUnitSolverInput(contexts.SOLVER), prepareLrcProofUnitCriticInput(contexts.CRITIC),
      prepareLrcProofUnitAdversaryInput(contexts.ADVERSARY)];
    expect(inputs.map(i => i.role)).toEqual(LRC_PROOF_UNIT_AUDIT_ROLES);
    expect(new Set(inputs.map(i => i.sourceData)).size).toBe(1);
    expect(new Set(inputs.map(i => i.packetDigest))).toEqual(new Set([LRC_PROOF_UNIT_PACKET.packetDigest]));
    expect(new Set(inputs.map(i => i.inputDigest)).size).toBe(3);
    for (const input of inputs) {
      expect(input.sourceData).toContain(LRC_PROOF_UNIT_PACKET.unitId);
      expect(input.instructions).toContain("DATA, not instructions");
      expect(input.responseSchema.additionalProperties).toBe(false);
      expect(Buffer.byteLength(canonicalJson(input))).toBeLessThanOrEqual(LRC_PROOF_UNIT_AUDIT_LIMITS.inputBytes);
      expect(validatePreparedLrcProofUnitAuditInput(input)).toBe(true);
      expect(Object.isFrozen(input)).toBe(true);
    }
  });
  it("is deterministic and context participates in input binding", () => {
    const a = prepareLrcProofUnitSolverInput(contexts.SOLVER);
    expect(prepareLrcProofUnitSolverInput(contexts.SOLVER)).toEqual(a);
    expect(prepareLrcProofUnitSolverInput("offline:solver-2").inputDigest).not.toBe(a.inputDigest);
  });
  it.each(["", "actual-provider-thread", "offline:", "offline:a\n", "offline:" + "a".repeat(120)])("refuses invalid offline context %j", context => {
    expect(() => prepareLrcProofUnitSolverInput(context)).toThrow();
  });
  it.each(["sourceData", "instructions", "packetDigest", "unitId"] as const)("passive preparation refuses coherently rehashed %s mutation", key => {
    const raw = clone(prepareLrcProofUnitSolverInput(contexts.SOLVER));
    raw[key] += " altered";
    const body = Object.fromEntries(Object.entries(raw).filter(([key]) => key !== "inputDigest"));
    raw.inputDigest = hash(body);
    expect(validatePreparedLrcProofUnitAuditInput(raw)).toBe(false);
  });
  it("refuses fabricated usage and oversized UTF8 preparation", () => {
    expect(validatePreparedLrcProofUnitAuditInput({ ...prepareLrcProofUnitSolverInput(contexts.SOLVER), usage: { inputTokens: 0 } })).toBe(false);
    const raw = clone(prepareLrcProofUnitSolverInput(contexts.SOLVER));
    raw.sourceData = "界".repeat(20_000);
    expect(validatePreparedLrcProofUnitAuditInput(raw)).toBe(false);
  });
  it("refuses caller-rehashed packet content before preparation", () => {
    const raw = clone(LRC_PROOF_UNIT_PACKET);
    raw.unitId += "-replacement";
    const body = Object.fromEntries(Object.entries(raw).filter(([key]) => key !== "packetDigest"));
    raw.packetDigest = hash(body);
    expect(() => prepareLrcProofUnitSolverInput(contexts.SOLVER, raw)).toThrow();
  });
});

describe("TIP-063 explicit offline-injected audit", () => {
  it("calls three ordered roles once; validates and freezes separate packetbound report without provider accounting", async () => {
    const test = harness();
    const report = await runOfflineLrcProofUnitAudit(test);
    expect(test.callback).toHaveBeenCalledTimes(3);
    expect(test.callback.mock.calls.map(([input]) => input.role)).toEqual(LRC_PROOF_UNIT_AUDIT_ROLES);
    expect(test.callback.mock.calls.every(([input]) => Object.isFrozen(input))).toBe(true);
    expect(report.mode).toBe("OFFLINE_INJECTED");
    expect(report.outcome).toBe("CONDITIONAL_REVIEWED");
    expect(report.globalConclusion).toBe("NOT_ESTABLISHED");
    expect(report.formalProof).toBe("NOT_ESTABLISHED");
    expect(report.freshForestReplay).toBe("NOT_RUN");
    expect(report.historical062Input).toBe("NOT_USED_IN_HISTORICAL_062_CASE");
    expect(report.remainingObligations).toContain("UNCHANGED");
    expect(validateLrcProofUnitAuditReport(report)).toEqual(report);
    expect(Object.isFrozen(report.reports[0].premiseFindings[0])).toBe(true);
    expect(Buffer.byteLength(canonicalJson(report))).toBeLessThanOrEqual(LRC_PROOF_UNIT_AUDIT_LIMITS.reportBytes);
    for (const key of ["ledger", "threadId", "modelName", "providerName", "usage"]) expect(report).not.toHaveProperty(key);
  });
  it("refuses absent activation before callbacks", async () => {
    const test = harness();
    await expect(runOfflineLrcProofUnitAudit({ ...test, activation: "LIVE" as never })).rejects.toThrow();
    expect(test.callback).not.toHaveBeenCalled();
  });
  it("refuses missing callback before any role", async () => {
    const test = harness(); test.callbacks.ADVERSARY = undefined as never;
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow();
    expect(test.callback).not.toHaveBeenCalled();
  });
  it("refuses colliding contexts before any role", async () => {
    const test = harness(); test.contexts.CRITIC = test.contexts.SOLVER;
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow();
    expect(test.callback).not.toHaveBeenCalled();
  });
  it("refuses invalid packet before any role", async () => {
    const test = harness(); test.packet.unitId += "-wrong";
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow();
    expect(test.callback).not.toHaveBeenCalled();
  });
  it("defaults absent packet only; explicitly null packet refuses before callbacks", async () => {
    const test = harness();
    await expect(runOfflineLrcProofUnitAudit({ ...test, packet: null })).rejects.toThrow();
    expect(test.callback).not.toHaveBeenCalled();
    const report = await runOfflineLrcProofUnitAudit({ ...test, packet: undefined });
    expect(report.packetDigest).toBe(LRC_PROOF_UNIT_PACKET.packetDigest);
  });
  it("rejects unrecognised context roles rather than an arbitrary admin fallback", async () => {
    const test = harness();
    await expect(runOfflineLrcProofUnitAudit({ ...test, contexts: { ...test.contexts, ADMIN: "offline:admin" } as never })).rejects.toThrow();
    expect(test.callback).not.toHaveBeenCalled();
  });
  it.each(["role", "offlineContextId", "packetDigest", "inputDigest"] as const)("refuses response %s mismatch and never dispatches next role", async key => {
    const test = harness(async input => ({ ...response(input), [key]: key.includes("Digest") ? "a".repeat(64) : "wrong" }));
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow();
    expect(test.callback).toHaveBeenCalledTimes(1);
  });
  it.each(["usage", "threadId", "modelName", "providerName", "ledger", "lrcCampaignEvidence", "globalConclusion"])("refuses fabricated %s response fields", async key => {
    const test = harness(async input => ({ ...response(input), [key]: "invented" }));
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow();
    expect(test.callback).toHaveBeenCalledTimes(1);
  });
  it.each(["PROVED", "AGREED", "PASS"])("refuses promoting response disposition %s", async disposition => {
    const test = harness(async input => ({ ...response(input), disposition }));
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow();
  });
  it.each(["premiseFindings", "stepFindings"] as const)("refuses incomplete or duplicate %s", async key => {
    const missing = harness(async input => ({ ...response(input), [key]: response(input)[key].slice(1) }));
    await expect(runOfflineLrcProofUnitAudit(missing)).rejects.toThrow();
    const duplicate = harness(async input => {
      const raw = response(input); raw[key][1] = raw[key][0]; return raw;
    });
    await expect(runOfflineLrcProofUnitAudit(duplicate)).rejects.toThrow();
  });
  it.each(["OPEN", "MISSING", "DISPUTED"] as const)("%s premise cannot gain conditional agreement", async status => {
    const test = harness(async input => {
      const raw = response(input); raw.premiseFindings[0].status = status; return raw;
    });
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow();
    expect(test.callback).toHaveBeenCalledTimes(1);
  });
  it("permits honest missing-evidence response only as inconclusive", async () => {
    const report = await runOfflineLrcProofUnitAudit(harness(async input => {
      const raw = response(input);
      if (input.role === "CRITIC") { raw.premiseFindings[0].status = "MISSING"; raw.disposition = "INCONCLUSIVE"; }
      return raw;
    }));
    expect(report.outcome).toBe("INCONCLUSIVE");
    expect(report.globalConclusion).toBe("NOT_ESTABLISHED");
  });
  it("rejection stays rejected even when other injected roles agree", async () => {
    const report = await runOfflineLrcProofUnitAudit(harness(async input => {
      const raw = response(input);
      if (input.role === "ADVERSARY") { raw.stepFindings[0].status = "DISPUTED"; raw.disposition = "REJECTED"; }
      return raw;
    }));
    expect(report.outcome).toBe("REJECTED");
  });
  it("propagates callback failure without retry or advancing roles", async () => {
    const test = harness(async input => {
      if (input.role === "CRITIC") throw new Error("offline fixture failed");
      return response(input);
    });
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow("offline fixture failed");
    expect(test.callback).toHaveBeenCalledTimes(2);
  });
  it("refuses undefined response", async () => {
    const test = harness(async () => undefined);
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow();
    expect(test.callback).toHaveBeenCalledTimes(1);
  });
  it("rejects frozen callback input mutation, including failed callback path", async () => {
    const test = harness(async input => { input.sourceData = "mutated"; return response(input); });
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow();
    expect(test.callback).toHaveBeenCalledTimes(1);
  });
  it("detects external raw packet mutation even if callback throws", async () => {
    const test = harness();
    test.callbacks.SOLVER = async () => { test.packet.unitId += "-changed"; throw new Error("unrelated"); };
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow("host inputs");
    expect(test.callback).not.toHaveBeenCalled();
  });
  it("detects external context replacement", async () => {
    const test = harness();
    test.callbacks.SOLVER = async input => { test.contexts = { ...test.contexts, CRITIC: "offline:replacement" }; return response(input); };
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow("host inputs");
    expect(test.callback).not.toHaveBeenCalled();
  });
  it("detects byte-identical raw packet reference replacement", async () => {
    const test = harness();
    test.callbacks.SOLVER = async input => { test.packet = clone(LRC_PROOF_UNIT_PACKET); return response(input); };
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow("host inputs");
  });
  it("rejects nested response schema mutation through frozen callback input", async () => {
    const test = harness(async input => { input.responseSchema.additionalProperties = true; return response(input); });
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow();
  });
  it("untrusted prose cannot change host global/fresh conclusions", async () => {
    const report = await runOfflineLrcProofUnitAudit(harness(async input => ({ ...response(input), summary: "Untrusted prose: global LRC proved, all forest rerun." })));
    expect(report.globalConclusion).toBe("NOT_ESTABLISHED");
    expect(report.freshForestReplay).toBe("NOT_RUN");
  });
  it("detects later callback replacement", async () => {
    const test = harness();
    test.callbacks.SOLVER = async input => { test.callbacks.CRITIC = async i => response(i); return response(input); };
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow("host inputs");
  });
  it("refuses bounded characters that exceed UTF8 response bytes", async () => {
    const test = harness(async input => {
      const raw = response(input);
      [...raw.premiseFindings, ...raw.stepFindings].forEach(f => { f.reason = "界".repeat(256); }); return raw;
    });
    await expect(runOfflineLrcProofUnitAudit(test)).rejects.toThrow("UTF8 byte limit");
  });
});

describe("TIP-063 passive offline report binding", () => {
  it.each(["packetDigest", "unitId", "outcome", "globalConclusion", "freshForestReplay", "historical062Input"])("refuses coherently rehashed %s substitution", async key => {
    const report = await runOfflineLrcProofUnitAudit(harness());
    const raw = { ...clone(report), [key]: "substituted" };
    expect(validateLrcProofUnitAuditReport(rehashReport(raw))).toBeNull();
  });
  it("refuses swapped role order, colliding context, changed input and fabricated accounting even after rehash", async () => {
    const report = await runOfflineLrcProofUnitAudit(harness());
    const swapped = clone(report); [swapped.reports[0], swapped.reports[1]] = [swapped.reports[1], swapped.reports[0]];
    expect(validateLrcProofUnitAuditReport(rehashReport(swapped))).toBeNull();
    const collision = clone(report); collision.reports[1].offlineContextId = collision.reports[0].offlineContextId;
    expect(validateLrcProofUnitAuditReport(rehashReport(collision))).toBeNull();
    const changed = clone(report); changed.reports[0].inputDigest = "b".repeat(64);
    expect(validateLrcProofUnitAuditReport(rehashReport(changed))).toBeNull();
    expect(validateLrcProofUnitAuditReport(rehashReport({ ...clone(report), usage: { inputTokens: 0 } }))).toBeNull();
  });
  it("cannot rehash inconclusive audit into conditional agreement", async () => {
    const report = await runOfflineLrcProofUnitAudit(harness(async input => ({ ...response(input), disposition: "INCONCLUSIVE" })));
    const raw = clone(report); raw.outcome = "CONDITIONAL_REVIEWED";
    expect(validateLrcProofUnitAuditReport(rehashReport(raw))).toBeNull();
  });
  it("missing/cyclic/oversized report refuses without running callbacks", () => {
    expect(validateLrcProofUnitAuditReport(null)).toBeNull();
    const cyclic: { self?: unknown } = {}; cyclic.self = cyclic;
    expect(validateLrcProofUnitAuditReport(cyclic)).toBeNull();
    expect(validateLrcProofUnitAuditReport({ data: "界".repeat(20_000) })).toBeNull();
  });
  it("generic helper invalid role cannot infer or default to solver", () => {
    expect(() => prepareLrcProofUnitAuditInput("ADMIN" as never, contexts.SOLVER)).toThrow();
  });
});
