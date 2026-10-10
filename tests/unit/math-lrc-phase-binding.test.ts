import { describe, expect, it, vi } from "vitest";
import { assertLrcPhaseProgression, effectiveLrcPhaseReadExpiry, lrcPhaseReadRequestSchema, LrcPhaseBindingError,
  parseLrcPhaseReadRequest, type LrcReadPhase } from "@/modules/research-sandbox/math-lrc-phase-binding";
import { makeLrcPhaseReadFixture } from "./math-lrc-phase-binding-fixture";

const start = 2000000000000;
const phases: LrcReadPhase[] = ["PROSPECTIVE", "SOLVER_ACTIVE", "REVIEW_ACTIVE", "TERMINAL"];
const fixture = (phase: LrcReadPhase = "PROSPECTIVE") => makeLrcPhaseReadFixture(phase, start);
const raw = (phase: LrcReadPhase = "PROSPECTIVE") => fixture(phase) as unknown as Record<string, unknown>;
const object = (v: unknown) => v as Record<string, unknown>;
const invalid = (v: unknown, code = "PHASE_INPUT_REFUSED") => {
  expect(() => parseLrcPhaseReadRequest(v)).toThrow(code);
  expect(lrcPhaseReadRequestSchema.safeParse(v).success).toBe(false);
};

describe("TIP072A bounded sequential phase assertions (not authority)", () => {
  it.each(phases)("accepts and deeply freezes exact %s assertions", phase => {
    const value = parseLrcPhaseReadRequest(fixture(phase));
    expect(value.phase).toBe(phase);
    expect(Object.isFrozen(value)).toBe(true);
    expect(Object.isFrozen(value.descriptor)).toBe(true);
    expect(Object.isFrozen(value.descriptor.context)).toBe(true);
    expect(Object.isFrozen(value.descriptor.sourcePins)).toBe(true);
    expect("dispatchAllowed" in value).toBe(false);
  });
  it("detaches the frozen parsed descriptor from caller mutations", () => {
    const input = fixture(), parsed = parseLrcPhaseReadRequest(input);
    input.descriptor.context.actorUserId = "changed";
    input.descriptor.sourcePins.original = "b".repeat(64);
    expect(parsed.descriptor.context.actorUserId).toBe("fixture-actor");
    expect(parsed.descriptor.sourcePins.original).toBe("a".repeat(64));
  });
  it.each(["created", "solverClaim", "reviewClaim", "solverAttemptDigest", "ledgerDigest"])("rejects fabricated early %s in prospective phase", field => invalid({ ...fixture(), [field]: raw("TERMINAL")[field] }));
  it.each(["reviewClaim", "solverAttemptDigest", "ledgerDigest"])("rejects future %s in solver phase", field => invalid({ ...fixture("SOLVER_ACTIVE"), [field]: raw("TERMINAL")[field] }));
  it("rejects a prospective phase disguised as a solver without required IDs", () => invalid({ ...fixture(), phase: "SOLVER_ACTIVE" }));
  it("rejects premature terminal ledger in review", () => invalid({ ...fixture("REVIEW_ACTIVE"), ledgerDigest: "a".repeat(64) }));
  it.each(["descriptor", "workspaceSlug", "sourceExpiresAt", "grantExpiresAt", "created", "solverClaim", "reviewClaim", "solverAttemptDigest", "ledgerDigest"])("rejects missing required terminal %s", field => { const input = raw("TERMINAL"); delete input[field]; invalid(input); });
  it.each(["descriptor", "created", "solverClaim", "reviewClaim"])("rejects extra nested %s fields", field => { const input = raw("TERMINAL"); object(input[field]).extra = true; invalid(input); });
  it("rejects root extra authority literals", () => invalid({ ...fixture(), admitted: true, dispatchAllowed: true }));
  it.each(["ENABLED", "solver_active", "", "DONE"])("rejects unknown phase %s", phase => invalid({ ...fixture(), phase }));
  it("rejects an unknown descriptor field", () => { const input = fixture(); object(input.descriptor).approved = true; invalid(input); });
  it.each(["/foreign", "with space", "UpperCase", "trailing-", "-leading", "two--hyphens"])("rejects unsafe workspace slug %s", workspaceSlug => invalid({ ...fixture(), workspaceSlug }));
  it("does not evaluate an own getter before refusing", () => { let calls = 0; const input = raw(); Object.defineProperty(input, "descriptor", { enumerable: true, get: () => { calls++; throw new Error("secret"); } }); invalid(input); expect(calls).toBe(0); });
  it("rejects an inherited accessor without evaluating it", () => { let calls = 0; const proto = { get secret() { calls++; return "credential"; } }; invalid(Object.assign(Object.create(proto), fixture())); expect(calls).toBe(0); });
  it("rejects getter hidden inside source pins", () => { let calls = 0; const input = fixture(); Object.defineProperty(input.descriptor.sourcePins, "original", { enumerable: true, get: () => { calls++; return "a".repeat(64); } }); invalid(input); expect(calls).toBe(0); });
  it("rejects nonenumerable fields", () => { const input = raw(); Object.defineProperty(input, "hidden", { value: "secret", enumerable: false }); invalid(input); });
  it("rejects symbolic fields", () => { const input = raw(); Object.defineProperty(input, Symbol("credential"), { value: true }); invalid(input); });
  it("rejects cyclic data before schemas", () => { const input = raw(); input.cycle = input; invalid(input); });
  it("rejects arrays as request", () => invalid([fixture()]));
  it.each([null, undefined, new Date(), new Map(), 1, true])("rejects nonplain request %s", value => invalid(value));
  it("rejects size limit before unrecognized string is inspected", () => invalid({ ...fixture(), huge: "x".repeat(16385) }, "PHASE_INPUT_LIMIT"));
  it("rejects excessive depth before schema", () => { const input = raw(); let level: Record<string, unknown> = input; for (let i = 0; i < 34; i++) { level.deep = {}; level = object(level.deep); } invalid(input, "PHASE_INPUT_LIMIT"); });
  it("rejects sparse or accessor arrays before schema", () => { const input = raw(); input.extra = new Array(3); invalid(input); });
  it("does not execute accessor array indices", () => { let calls = 0; const input = raw(), values = [true]; Object.defineProperty(values, "0", { enumerable: true, get: () => { calls++; return true; } }); input.extra = values; invalid(input); expect(calls).toBe(0); });
  it("rejects arrays with hidden extra fields", () => { const input = raw(), values = [true]; Object.defineProperty(values, "secret", { value: "secret" }); input.extra = values; invalid(input); });
  it("returns only a constant error code, no supplied secret", () => { try { parseLrcPhaseReadRequest({ credential: "TOP_SECRET_VALUE" }); throw new Error("did-not-refuse"); } catch (error) { expect(error).toBeInstanceOf(LrcPhaseBindingError); expect(String(error)).not.toContain("TOP_SECRET_VALUE"); } });

  it.each(["sourceExpiresAt", "grantExpiresAt"])("rejects %s later than approved descriptor", field => invalid({ ...fixture(), [field]: start + 60001 }, "PHASE_LIFETIME_REFUSED"));
  it.each(["sourceExpiresAt", "grantExpiresAt"])("rejects expired-at-creation %s", field => invalid({ ...fixture(), [field]: start }, "PHASE_LIFETIME_REFUSED"));
  it.each([NaN, Infinity, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])("rejects invalid source lifetime %s", sourceExpiresAt => invalid({ ...fixture(), sourceExpiresAt }));
  it("chooses earliest immutable source ceiling", () => expect(effectiveLrcPhaseReadExpiry({ ...fixture(), sourceExpiresAt: start + 20000 }, start + 90000)).toBe(start + 20000));
  it("chooses earliest grant ceiling", () => expect(effectiveLrcPhaseReadExpiry({ ...fixture(), grantExpiresAt: start + 21000 }, start + 90000)).toBe(start + 21000));
  it("chooses original session lifetime even if current session extends", () => expect(effectiveLrcPhaseReadExpiry(fixture(), start + 22000)).toBe(start + 22000));
  it.each(phases)("caps %s effective lifetime", phase => expect(effectiveLrcPhaseReadExpiry(fixture(phase), start + 90000)).toBe(start + (phase === "PROSPECTIVE" ? 60000 : 45000)));
  it("new review lease may shorten but never extend solver anchored lifetime", () => { const input = raw("REVIEW_ACTIVE"); object(input.reviewClaim).leaseExpiresAt = start + 30000; expect(effectiveLrcPhaseReadExpiry(input, start + 90000)).toBe(start + 30000); object(input.reviewClaim).leaseExpiresAt = start + 1800000; expect(effectiveLrcPhaseReadExpiry(input, start + 90000)).toBe(start + 45000); });
  it.each([undefined, NaN, Infinity, -1, start, 1.5, Number.MAX_SAFE_INTEGER + 1])("requires a valid original session expiry %s", expiry => expect(() => effectiveLrcPhaseReadExpiry(fixture(), expiry as number)).toThrow("PHASE_LIFETIME_REFUSED"));
  it("rejects foreign solver role", () => { const input = raw("SOLVER_ACTIVE"); object(input.solverClaim).role = "CRITIC"; invalid(input); });
  it("rejects solver outbox inconsistent with created rows", () => { const input = raw("SOLVER_ACTIVE"); object(input.solverClaim).outboxId = "foreign-outbox"; invalid(input); });
  it.each(["jobId", "outboxId"])("rejects reused solver/review %s", field => { const input = raw("REVIEW_ACTIVE"); object(input.reviewClaim)[field] = object(input.solverClaim)[field]; invalid(input); });
  it.each(["adversaryDispatchId", "criticDispatchId"])("rejects reused solver dispatch for %s", field => { const input = raw("REVIEW_ACTIVE"); object(input.reviewClaim)[field] = object(input.solverClaim).dispatchId; invalid(input); });
  it("rejects matching adversary and critic dispatches", () => { const input = raw("REVIEW_ACTIVE"); object(input.reviewClaim).criticDispatchId = object(input.reviewClaim).adversaryDispatchId; invalid(input); });
  it.each(["solverClaim", "reviewClaim"])("rejects second attempt in %s", field => { const input = raw("TERMINAL"); object(input[field]).attemptNumber = 2; invalid(input); });
  it.each(["solverClaim", "reviewClaim"])("rejects precreation %s lease", field => { const input = raw("TERMINAL"); object(input[field]).leaseExpiresAt = start; invalid(input); });
  it.each(["solverClaim", "reviewClaim"])("rejects unsafe terminal version increment in %s", field => { const input = raw("TERMINAL"); object(input[field]).claimedVersion = Number.MAX_SAFE_INTEGER; invalid(input); });

  it.each([["PROSPECTIVE", "SOLVER_ACTIVE"], ["SOLVER_ACTIVE", "REVIEW_ACTIVE"], ["REVIEW_ACTIVE", "TERMINAL"]] as [LrcReadPhase, LrcReadPhase][])("accepts one append-only %s -> %s", (previous, next) => expect(() => assertLrcPhaseProgression(fixture(previous), fixture(next))).not.toThrow());
  it.each(phases.flatMap(previous => phases.filter(next => phases.indexOf(next) !== phases.indexOf(previous) + 1).map(next => [previous, next] as const)))("rejects illegal %s -> %s", (previous, next) => expect(() => assertLrcPhaseProgression(fixture(previous), fixture(next))).toThrow("PHASE_PROGRESSION_REFUSED"));
  it.each(["workspaceSlug", "sourceExpiresAt", "grantExpiresAt", "descriptor", "created", "solverClaim", "reviewClaim", "solverAttemptDigest"])("rejects changed previous anchor %s", field => {
    const input = raw("TERMINAL");
    if (field === "descriptor") object(input.descriptor).approvedNonce = "00000000-0000-4000-8000-000000000099";
    else if (field === "created") object(input.created).caseId = "00000000-0000-4000-8000-000000000099";
    else if (field === "solverClaim" || field === "reviewClaim") object(input[field]).workerId = "foreign-worker";
    else if (field === "sourceExpiresAt" || field === "grantExpiresAt") input[field] = start + 59000;
    else if (field === "solverAttemptDigest") input[field] = "b".repeat(64);
    else input[field] = "foreign-lab";
    expect(() => assertLrcPhaseProgression(fixture("REVIEW_ACTIVE"), input)).toThrow("PHASE_PROGRESSION_REFUSED");
  });
  it("rejects renewed solver lease even when effective lifetime would stay capped", () => { const input = raw("REVIEW_ACTIVE"); object(input.solverClaim).leaseExpiresAt = start + 50000; expect(() => assertLrcPhaseProgression(fixture("SOLVER_ACTIVE"), input)).toThrow("PHASE_PROGRESSION_REFUSED"); });
  it("allows harmless property order differences, not changed anchor content", () => { const input = raw("TERMINAL"), descriptor = object(input.descriptor); input.descriptor = Object.fromEntries(Object.entries(descriptor).reverse()); expect(() => assertLrcPhaseProgression(fixture("REVIEW_ACTIVE"), input)).not.toThrow(); });
  it("has no production fixture helper", () => { vi.stubEnv("NODE_ENV", "production"); try { expect(() => makeLrcPhaseReadFixture()).toThrow("PHASE_FIXTURE_REFUSED"); } finally { vi.unstubAllEnvs(); } });
});
