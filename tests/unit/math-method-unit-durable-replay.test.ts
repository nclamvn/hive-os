import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { readdir, readFile, writeFile, unlink, rm } from "node:fs/promises";
import { join } from "node:path";
import { MethodUnitDurableReplayFixtureHost, authorizeMethodUnitDurableReplay } from "@/server/operations/math-method-unit-durable-replay";
import { durableDigest } from "@/modules/research-sandbox/math-lrc-durable-replay";
import { durableReplayFixture, H } from "./math-method-unit-durable-replay-fixture";
type Fixture = Awaited<ReturnType<typeof durableReplayFixture>>;
const roots: string[] = [];
async function fixture(options?: Parameters<typeof durableReplayFixture>[0]) { const value = await durableReplayFixture(options); roots.push(value.root); return value; }
afterEach(async () => { for (const root of roots.splice(0)) { if (!root.includes("/hive-tip071-bridge-")) throw new Error("BAD_TEST_ROOT"); await rm(root, { recursive: true, force: true }); } vi.unstubAllEnvs(); });
async function critic(f: Fixture) { const result = await f.host.replayBeforeCritic(); if (result.status !== "ACCEPTED") throw new Error("EXPECTED_FIXTURE_PASS"); await f.host.claimCriticStage(result.permit); return result; }
async function seal(f: Fixture) { const result = await critic(f); await f.captureRoles(); f.terminal(); return { result, token: await f.host.sealPostLedger() }; }
async function criticDir(f: Fixture) { for (const name of await readdir(f.root)) { if (name === "quota.lock") continue; const dir = join(f.root, name); if ((await readdir(dir)).includes("finite.json")) return dir; } throw new Error("NO_FINITE"); }
function rehashFinite(raw: unknown) { const r = raw as Record<string, unknown>; const { recordDigest: _, ...body } = r; void _; r.recordDigest = H(body); return r; }

describe("TIP071 fixture-only durable finite bridge, not live M1", () => {
  it("fresh read-back checker + precritic fsync + ledger7 seal + opaque STOP admission", async () => {
    const f = await fixture(), { result, token } = await seal(f), out = await f.host.consumeAdmission(token);
    expect(result.status).toBe("ACCEPTED"); expect(result.receipt.originalResultDigest).toBe(result.receipt.replayResultDigest);
    expect(out).toMatchObject({ status: "KNOWN_FINITE_PASS", checkerCalls: 2, dispatchAllowed: false, proofClosure: false, stop: true, independentInformation: "NOT_BOUND", batch: "NOT_BOUND", novelty: "NOT_ESTABLISHED" });
    expect(out.metrics.originalOperations).toBeGreaterThan(0); expect(out.metrics.replayOperations).toBeGreaterThan(0);
    expect(out.metrics.originalOperations + out.metrics.replayOperations).toBeLessThanOrEqual(2000000);
    expect(out.metrics.aggregateElapsedMs).toBeLessThan(5000); expect(out.metrics.aggregateElapsedMs).toBeGreaterThanOrEqual(result.receipt.metrics.aggregateElapsedMs);
    expect(out.relations).toEqual([]); expect(out.associations).toEqual([]); expect(Object.isFrozen(out.metrics)).toBe(true);
    expect(f.originalCalls).toBe(1); expect(f.hostCalls).toBeGreaterThan(20);
    const dir = await criticDir(f); expect(await readdir(dir)).toEqual(expect.arrayContaining(["finite.json", "replay.json", "admission.json", "commit.json", "prepared.json", "stdout.bin", "transport.json"]));
  });
  it("precritic receipt cannot circularly include later ledger or mutable final fsync timestamp", async () => {
    const f = await fixture(), result = await f.host.replayBeforeCritic(); expect(result.status).toBe("ACCEPTED");
    if (result.status !== "ACCEPTED") return;
    expect(result.receipt).not.toHaveProperty("ledgerDigest"); expect(result.receipt).not.toHaveProperty("finalFiniteMetrics");
    expect(result.finalFiniteMetrics.aggregateElapsedMs).toBeGreaterThanOrEqual(result.receipt.metrics.aggregateElapsedMs);
  });
  it("MISSING invokes no replay, creates no permit or counterfeit checker metrics", async () => {
    const f = await fixture({ missing: true }); expect(await f.host.replayBeforeCritic()).toEqual({ status: "MISSING", permit: null, checkerCalls: 0 });
    await expect(f.host.sealPostLedger()).rejects.toThrow("CRITIC_STAGE_REQUIRED"); expect(f.originalCalls).toBe(1);
  });
  it("production mint stays authentication-required even with model flags", () => { expect(() => authorizeMethodUnitDurableReplay()).toThrow("AUTHENTICATION_REQUIRED"); });
  it("fixture constructor refuses outside actual Vitest/test environment", async () => { const f = await fixture(); vi.stubEnv("NODE_ENV", "development"); expect(() => new MethodUnitDurableReplayFixtureHost({ store: f.store, handle: f.handle, fence: async () => {}, originalFiniteCheck: () => null, readOriginalArtifacts: async () => null, readRetainedLedger: async () => null })).toThrow("AUTHENTICATION_REQUIRED"); });
  it("JSON clone of opaque Store handle refuses before original mathematical work", async () => {
    const f = await fixture(); let called = false;
    const forged = new MethodUnitDurableReplayFixtureHost({ store: f.store, handle: structuredClone(f.handle), fence: async () => {}, originalFiniteCheck: () => { called = true; return null; }, readOriginalArtifacts: async () => null, readRetainedLedger: async () => null });
    await expect(forged.replayBeforeCritic()).rejects.toThrow("OPAQUE_PURPOSE_REFUSED"); expect(called).toBe(false);
  });
  it("copied/deserialized critic permit refuses", async () => { const f = await fixture(), result = await f.host.replayBeforeCritic(); if (result.status !== "ACCEPTED") throw new Error("FIXTURE"); await expect(f.host.claimCriticStage({ ...result.permit })).rejects.toThrow("FORGED_OR_SPENT"); });
  it("duplicate/concurrent original requests cannot create another call", async () => { const f = await fixture(), one = f.host.replayBeforeCritic(); await expect(f.host.replayBeforeCritic()).rejects.toThrow("ATTEMPT_ALREADY_SPENT"); await one; expect(f.originalCalls).toBe(1); });
  it("critic permit is one-use even for concurrent callers", async () => { const f = await fixture(), result = await f.host.replayBeforeCritic(); if (result.status !== "ACCEPTED") throw new Error("FIXTURE"); const one = f.host.claimCriticStage(result.permit); await expect(f.host.claimCriticStage(result.permit)).rejects.toThrow("FORGED_OR_SPENT"); await one; });
  it("no postledger admission before precritic claim", async () => { const f = await fixture(); await f.host.replayBeforeCritic(); await expect(f.host.sealPostLedger()).rejects.toThrow("CRITIC_STAGE_REQUIRED"); });
  it("copied opaque admission refuses", async () => { const f = await fixture(), { token } = await seal(f); await expect(f.host.consumeAdmission(structuredClone(token))).rejects.toThrow("FORGED_OR_SPENT"); });
  it("admission belongs exact registry, cannot migrate to new fixture host", async () => { const a = await fixture(), { token } = await seal(a), b = await fixture(); await seal(b); await expect(b.host.consumeAdmission(token)).rejects.toThrow("FORGED_OR_SPENT"); });
  it("admission consumed once then STOP without task dispatch", async () => { const f = await fixture(), { token } = await seal(f); await f.host.consumeAdmission(token); await expect(f.host.consumeAdmission(token)).rejects.toThrow("FORGED_OR_SPENT"); });
  it("no restart hydration can deserialize execution/admission authority", async () => { const f = await fixture(), { token } = await seal(f); const restarted = new MethodUnitDurableReplayFixtureHost({ store: f.store, handle: f.handle, fence: async () => {}, originalFiniteCheck: () => null, readOriginalArtifacts: async () => null, readRetainedLedger: async () => null }); await expect(restarted.consumeAdmission(JSON.parse(JSON.stringify(token)))).rejects.toThrow("FORGED_OR_SPENT"); });
  for (const field of ["caseId", "runId", "reviewJobId", "contractDigest", "solverAttemptDigest", "adversaryReportDigest"] as const) it(`original finite ${field} binding drift refuses`, async () => {
    const f = await fixture({ original: raw => { const r = raw as { binding: Record<string, unknown> }; r.binding[field] = field.includes("Digest") ? "f".repeat(64) : "foreign-fixture"; return rehashFinite(r); } });
    await expect(f.host.replayBeforeCritic()).rejects.toThrow();
  });
  it("unknown original operation metrics refuse, never defaults to zero", async () => { const f = await fixture({ original: raw => { (raw as { checker: { chargedOperations: unknown } }).checker.chargedOperations = null; return rehashFinite(raw); } }); await expect(f.host.replayBeforeCritic()).rejects.toThrow(); });
  it("declared original elapsed cannot exceed actual host invocation measurement", async () => { const f = await fixture({ original: raw => { (raw as { checker: { elapsedMs: number } }).checker.elapsedMs = 4999; return rehashFinite(raw); } }); await expect(f.host.replayBeforeCritic()).rejects.toThrow("ACCOUNTING_REFUSED"); });
  it("original operation cap is subtracted, not reset for fresh checker", async () => { const f = await fixture({ original: raw => { (raw as { checker: { chargedOperations: number } }).checker.chargedOperations = 1999999; return rehashFinite(raw); } }); await expect(f.host.replayBeforeCritic()).rejects.toThrow("RESOURCE_REFUSED"); });
  it("original host work starts inside shared clock, cannot reset before replay", async () => { let offset = 0; const f = await fixture({ clock: () => performance.now() + offset, original: raw => { offset = 5001; return raw; } }); await expect(f.host.replayBeforeCritic()).rejects.toThrow("RESOURCE_REFUSED"); });
  it("finite file fsync delay is included under SAME outer ceiling", async () => { let offset = 0; const f = await fixture({ clock: () => performance.now() + offset, fault: async stage => { if (stage === "file-sync:finite.json") offset = 5001; } }); await expect(f.host.replayBeforeCritic()).rejects.toThrow("RESOURCE_REFUSED"); });
  it("precritic receipt fsync delay cannot mint critic permission", async () => { let offset = 0; const f = await fixture({ clock: () => performance.now() + offset, fault: async stage => { if (stage === "file-sync:replay.json") offset = 5001; } }); await expect(f.host.replayBeforeCritic()).rejects.toThrow("RESOURCE_REFUSED"); });
  it("receipt write fault hardstops with no retry", async () => { const f = await fixture({ fault: async stage => { if (stage === "write:replay.json") throw new Error("INJECTED_SYNC_FAULT"); } }); await expect(f.host.replayBeforeCritic()).rejects.toThrow("INJECTED_SYNC_FAULT"); await expect(f.host.replayBeforeCritic()).rejects.toThrow("ATTEMPT_ALREADY_SPENT"); });
  for (const file of ["finite.json", "replay.json"]) for (const mutation of ["tamper", "delete"]) it(`${mutation} ${file} between replay and critic cannot cross gate`, async () => {
    const f = await fixture(), result = await f.host.replayBeforeCritic(); if (result.status !== "ACCEPTED") throw new Error("FIXTURE");
    const path = join(await criticDir(f), file); if (mutation === "delete") await unlink(path); else await writeFile(path, Buffer.from("{}"), { mode: 0o600 });
    await expect(f.host.claimCriticStage(result.permit)).rejects.toThrow();
  });
  it("source/auth drift before original check prevents callback", async () => { const f = await fixture(); f.revoke(); await expect(f.host.replayBeforeCritic()).rejects.toThrow("FIXTURE_AUTH_REVOKED"); expect(f.originalCalls).toBe(0); });
  it("auth revocation after fsync before use refuses without critic", async () => { const f = await fixture(), result = await f.host.replayBeforeCritic(); if (result.status !== "ACCEPTED") throw new Error("FIXTURE"); f.revoke(); await expect(f.host.claimCriticStage(result.permit)).rejects.toThrow("FIXTURE_AUTH_REVOKED"); });
  it("expired source capture cannot gain later receipt lease", async () => { let now = Date.now(); const f = await fixture({ now: () => now }), result = await f.host.replayBeforeCritic(); if (result.status !== "ACCEPTED") throw new Error("FIXTURE"); now += 60001; await expect(f.host.claimCriticStage(result.permit)).rejects.toThrow("CAPTURE_EXPIRED"); });
  for (const field of ["ledgerDigest", "reviewDigest", "dossierDigest", "workerResultDigest", "solverStatus", "reviewStatus", "contractDigest", "roleInputDigests", "transportManifestDigests"] as const) it(`retained ${field} mismatch refuses final admission`, async () => {
    const f = await fixture(); await critic(f); await f.captureRoles(); f.terminal(); f.mutateRetained(raw => { raw[field] = field.endsWith("Digests") ? ["f".repeat(64), "f".repeat(64), "f".repeat(64)] : field.endsWith("Status") ? "FAILED" : "f".repeat(64); }); await expect(f.host.sealPostLedger()).rejects.toThrow();
  });
  it("coherently rehashed foreign worker result cannot replace exact jobs", async () => { const f = await fixture(); await critic(f); await f.captureRoles(); f.terminal(); f.mutateRetained(raw => { const r = raw.workerResult as Record<string, unknown>; r.reviewJobId = "foreign-job"; raw.workerResultDigest = H(r); }); await expect(f.host.sealPostLedger()).rejects.toThrow("TERMINAL_RESULT_REFUSED"); });
  it("coherently rehashed transport from another binding refuses", async () => { const f = await fixture(); await critic(f); await f.captureRoles(); f.terminal(); f.mutateRetained(raw => { const manifests = raw.transportManifests as Record<string, unknown>[]; manifests[0].bindingDigest = "f".repeat(64); (raw.transportManifestDigests as string[])[0] = durableDigest(JSON.stringify(manifests[0])); }); await expect(f.host.sealPostLedger()).rejects.toThrow("TRANSPORT_BINDING_REFUSED"); });
  it("missing final commit fsync cannot mint admission", async () => { const f = await fixture({ fault: async stage => { if (stage === "file-sync:commit.json") throw new Error("INJECTED_COMMIT_SYNC"); } }); await critic(f); await f.captureRoles(); f.terminal(); await expect(f.host.sealPostLedger()).rejects.toThrow("INJECTED_COMMIT_SYNC"); });
  it("missing actual 3role transport files refuses even valid hashes", async () => { const f = await fixture(); await critic(f); f.terminal(); await expect(f.host.sealPostLedger()).rejects.toThrow(); });
  it("postseal retained ledger drift is freshly checked before consumption", async () => { const f = await fixture(), { token } = await seal(f); f.mutateRetained(raw => { raw.ledger = null; }); await expect(f.host.consumeAdmission(token)).rejects.toThrow("RETAINED_LEDGER_DRIFT"); });
  it("postseal coherent rehash still cannot replace recorded terminal snapshot", async () => { const f = await fixture(), { token } = await seal(f); f.mutateRetained(raw => { const ledger = raw.ledger as Record<string, unknown>; ledger.oracle = { changed: true }; raw.ledgerDigest = H(ledger); }); await expect(f.host.consumeAdmission(token)).rejects.toThrow("RETAINED_LEDGER_DRIFT"); });
  it("postseal durable marker drift refuses before consumption", async () => { const f = await fixture(), { token } = await seal(f); await writeFile(join(await criticDir(f), "commit.json"), "{}", { mode: 0o600 }); await expect(f.host.consumeAdmission(token)).rejects.toThrow(); });
  it("public fixture outcome contains no private path/session/authority", async () => { const f = await fixture(), { token } = await seal(f), out = await f.host.consumeAdmission(token); const json = JSON.stringify(out); expect(json).not.toContain(f.root); expect(json).not.toContain("actorUserId"); expect(json).not.toContain("permit"); });
  it("successful finite certificate is bytes on disk, not manufactured ADMITTED literal", async () => { const f = await fixture(), result = await f.host.replayBeforeCritic(); if (result.status !== "ACCEPTED") throw new Error("FIXTURE"); const bytes = await readFile(join(await criticDir(f), "finite.json")); expect(durableDigest(bytes)).toBe(result.receipt.finiteByteDigest); await expect(f.host.consumeAdmission({ version: 2, admissionReceiptDigest: result.receipt.finiteRecordDigest })).rejects.toThrow("FORGED_OR_SPENT"); });
});
