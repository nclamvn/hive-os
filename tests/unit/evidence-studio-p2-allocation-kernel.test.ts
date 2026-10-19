import {afterEach, describe, expect, it, vi} from "vitest";
import {performance as trustedPerformance} from "node:perf_hooks";
import {createAllocationFixtureP2, runAllocationFixtureP2, readAllocationFixtureP2,
  retireAllocationFixtureP2, parserEntryAllocationFixtureP2,
  P2_KERNEL_STATUS} from "../../scripts/test/allocations-tip081-p2.mjs";

type Handle = ReturnType<typeof createAllocationFixtureP2>;
const handles: Handle[] = [];
function fixture(text = "", profile = "SCRIPT", cap = 1048576, ttl = 120000) {
  const handle = createAllocationFixtureP2(text, profile, cap, ttl);
  handles.push(handle);
  return handle;
}
function refused(action: () => unknown, code: string) {
  let caught: unknown;
  try { action(); } catch (error) { caught = error; }
  expect(caught).toMatchObject({code, parserDisabled: true});
}
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  for (const handle of handles.splice(0)) {
    try { retireAllocationFixtureP2(handle); } catch { /* Owned refusal already retired it. */ }
  }
});

describe("P2 private actual-allocation prerequisite, NOT grammar acceptance", () => {
  it("P201 actual node defaults, shallow copy and schema attempts retain charges", () => {
    const result = runAllocationFixtureP2(fixture(), "NODE_COPY_SCHEMA", 1);
    // root160+retain16 + copied-default160+five-overwrite80+three-shape48+link16.
    expect(result.producerBytes).toBe(480);
    expect(result.totalBytes).toBe(83424); // base81920 +480 +output1024.
    expect(result.nodes).toBe(2);
    expect(result.schemaMutations).toBe(10);
    expect(result.grammarImplemented).toBe(false);
  });
  it("P202 multiple shallow copies never refund overwritten defaults/aliases", () => {
    const result = runAllocationFixtureP2(fixture(), "NODE_COPY_SCHEMA", 2);
    expect(result.producerBytes).toBe(784);
    expect(result.totalBytes).toBe(83728);
    expect(result.nodes).toBe(3);
    expect(result.schemaMutations).toBe(19);
  });
  it("P203 complete output exact cap and minus one refuse without salvaging root", () => {
    const handle = fixture("", "SCRIPT", 83120);
    expect(runAllocationFixtureP2(handle, "NODE_COPY_SCHEMA", 0).totalBytes).toBe(83120);
    retireAllocationFixtureP2(handle);
    const short = fixture("", "SCRIPT", 83119);
    refused(() => runAllocationFixtureP2(short, "NODE_COPY_SCHEMA", 0), "CAP_REFUSED");
    refused(() => readAllocationFixtureP2(short), "AUTHORITY_REFUSED");
    expect(fixture()).toHaveProperty("parserDisabled", true);
  });
  it("P204 one-byte-short Node reserve refuses before construction", () => {
    const handle = fixture("", "SCRIPT", 82079); //81920+159, first Node needs160.
    refused(() => runAllocationFixtureP2(handle, "NODE_COPY_SCHEMA", 0), "CAP_REFUSED");
    refused(() => readAllocationFixtureP2(handle), "AUTHORITY_REFUSED");
  });
  it("P205 growing real arrays retain old/new backings and occupied-slot entries", () => {
    const result = runAllocationFixtureP2(fixture(), "ARRAY_RESIZE", 3);
    expect(result.producerBytes).toBe(1248); //list216+retain16+nodes480+resizes344+proto48+controller144.
    expect(result.totalBytes).toBe(84192);
    expect(result.arrays).toBe(4); //actual backing allocations0,1,2,4.
    expect(result.nodes).toBe(3);
    expect(result.entries).toBe(3);
    expect(result.schemaMutations).toBe(14);
  });
  it("P206 occupied capacity does not allocate another backing", () => {
    const result = runAllocationFixtureP2(fixture(), "ARRAY_RESIZE", 4);
    expect(result.producerBytes).toBe(1424); //1248+one Node160+length mutation16.
    expect(result.arrays).toBe(4);
    expect(result.entries).toBe(4);
    expect(result.schemaMutations).toBe(15);
  });
  it("P207 real scope/map fanout charges each enclosing name reference", () => {
    const result = runAllocationFixtureP2(fixture("x"), "SCOPE_MAP_FANOUT", 2);
    expect(result.producerBytes).toBe(2390); //2262+8 backing prototype mutations*16.
    expect(result.totalBytes).toBe(85338); //81924+2390+1024.
    expect(result.dictionaryRows).toBe(2);
    expect(result.entries).toBe(6); //dictionary row+value plus var slot per scope.
    expect(result.scopeDepth).toBe(2);
    expect(result.arrays).toBe(8); //3 binding arrays+one grown var backing per scope.
    expect(result.schemaMutations).toBe(15);
  });
  it("P208 null-prototype dictionary keys cannot invoke inherited setters", () => {
    const result = runAllocationFixtureP2(fixture("__proto__"), "SCOPE_MAP_FANOUT", 1);
    expect(result.dictionaryRows).toBe(1);
    expect(result.entries).toBe(3);
    expect(result.producerBytes).toBe(1268); //two key payload reservations add32 to1236.
  });
  it("P209 structural scope boundary128 is allowed and129 refuses before scope work", () => {
    const handle = fixture("x");
    const result = runAllocationFixtureP2(handle, "SCOPE_MAP_FANOUT", 128);
    expect(result.scopeDepth).toBe(128);
    expect(result.entries).toBe(384);
    retireAllocationFixtureP2(handle);
    const tooDeep = fixture("x");
    refused(() => runAllocationFixtureP2(tooDeep, "SCOPE_MAP_FANOUT", 129), "DEPTH_REFUSED");
    refused(() => readAllocationFixtureP2(tooDeep), "AUTHORITY_REFUSED");
  });
  it("P210 real raw/cooked strings charge slices, pieces and concat overlap", () => {
    const result = runAllocationFixtureP2(fixture("a\\nb"), "RAW_COOKED", 4);
    expect(result.producerBytes).toBe(496); //slice72 +pieces/concat312 +pair96+retain16.
    expect(result.totalBytes).toBe(83456);
    expect(result.stringOperations).toBe(7);
    expect(result.nodes).toBe(0);
    expect(result.schemaMutations).toBe(1);
  });
  it("P211 abandoned raw/cooked attempt remains charged before replacement", () => {
    const result = runAllocationFixtureP2(fixture("a\\nb"), "RAW_COOKED_TENTATIVE", 4);
    expect(result.producerBytes).toBe(992);
    expect(result.totalBytes).toBe(83952);
    expect(result.stringOperations).toBe(14);
    expect(result.schemaMutations).toBe(2);
    expect(result.fixtures).toBe(1);
  });
  it("P212 repeated exercise/observation preserves original monotone reservation", () => {
    const handle = fixture("a");
    const first = runAllocationFixtureP2(handle, "RAW_COOKED", 1);
    const second = runAllocationFixtureP2(handle, "RAW_COOKED", 1);
    expect(first.producerBytes).toBe(278); //slice66 +piece34+concat66 +pair96+retain16.
    expect(second.producerBytes).toBe(556);
    expect(second.totalBytes - first.totalBytes).toBe(1302); //278+output1024.
    expect(second.fixtures).toBe(2);
  });
  it("P213 unsupported cooked spelling/Unicode refuse and retire owner", () => {
    for (const text of ["\\u0061", "\\x61", "\\1", "\\", "é", "😀"]) {
      const handle = fixture(text);
      refused(() => runAllocationFixtureP2(handle, "RAW_COOKED", text.length), "UNSUPPORTED_BOUNDED_SYNTAX");
      refused(() => readAllocationFixtureP2(handle), "AUTHORITY_REFUSED");
    }
  });
  it("P214 slice out-of-range refusal invalidates partial owner", () => {
    const handle = fixture("x");
    refused(() => runAllocationFixtureP2(handle, "RAW_COOKED", 2), "SCHEMA_REFUSED");
    refused(() => readAllocationFixtureP2(handle), "AUTHORITY_REFUSED");
  });
  it("P215 exact primitive admission never reflects/coerces caller objects", () => {
    let traps = 0;
    const hostile = new Proxy({}, {get() { traps++; throw new Error("not called"); },
      ownKeys() { traps++; throw new Error("not called"); }});
    // Invalid source/profile/cap cannot call methods, getters or JSON adoption.
    refused(() => Reflect.apply(createAllocationFixtureP2, undefined, [hostile, "SCRIPT", 1048576, 120000]), "SCHEMA_REFUSED");
    refused(() => Reflect.apply(createAllocationFixtureP2, undefined, ["", hostile, 1048576, 120000]), "SCHEMA_REFUSED");
    refused(() => Reflect.apply(createAllocationFixtureP2, undefined, ["", "SCRIPT", hostile, 120000]), "SCHEMA_REFUSED");
    expect(traps).toBe(0);
  });
  it("P216 wrong arity and invalid metadata cannot revoke another owner", () => {
    const handle = fixture();
    refused(() => Reflect.apply(runAllocationFixtureP2, undefined, [handle, "NODE_COPY_SCHEMA", 0, {enable: true}]), "SCHEMA_REFUSED");
    refused(() => runAllocationFixtureP2(handle, "GRAMMAR", 0), "SCHEMA_REFUSED");
    for (const count of [-0, -1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      refused(() => runAllocationFixtureP2(handle, "NODE_COPY_SCHEMA", count), "SCHEMA_REFUSED");
    }
    expect(readAllocationFixtureP2(handle).phase).toBe("ALLOCATIONS_ONLY");
  });
  it("P217 unknown mode never retries Script/Module", () => {
    refused(() => createAllocationFixtureP2("", "AUTO", 1048576, 120000), "MODE_OPEN");
    refused(() => createAllocationFixtureP2("", "MODULE+FALLBACK", 1048576, 120000), "MODE_OPEN");
    expect(fixture("", "MODULE")).toHaveProperty("parserDisabled", true);
  });
  it("P218 forged/retired handles cannot observe or revive retained state", () => {
    const handle = fixture("secret");
    refused(() => readAllocationFixtureP2({purpose: "TIP081_P2_SYNTHETIC_KERNEL_ONLY", parserDisabled: true}), "AUTHORITY_REFUSED");
    retireAllocationFixtureP2(handle);
    refused(() => runAllocationFixtureP2(handle, "NODE_COPY_SCHEMA", 0), "AUTHORITY_REFUSED");
    refused(() => readAllocationFixtureP2(handle), "AUTHORITY_REFUSED");
  });
  it("P219 live owner prevents implicit second allocation envelope", () => {
    const handle = fixture();
    refused(() => createAllocationFixtureP2("", "MODULE", 1048576, 120000), "BUSY_REFUSED");
    expect(readAllocationFixtureP2(handle).profile).toBe("SCRIPT");
  });
  it("P220 metadata output exposes no actual object/array/map/source string", () => {
    const handle = fixture("HIDDEN_SOURCE_SENTINEL");
    const result = runAllocationFixtureP2(handle, "RAW_COOKED", 6);
    expect(Object.values(result).every(value => typeof value !== "object")).toBe(true);
    expect(JSON.stringify(result)).not.toContain("HIDDEN_SOURCE_SENTINEL");
    expect(Object.keys(result)).not.toContain("root");
    expect(Object.keys(result)).not.toContain("text");
    expect(Object.keys(handle)).toEqual(["purpose", "parserDisabled"]);
    expect(Object.isFrozen(result)).toBe(true);
  });
  it("P221 grammar entry is always disabled even after successful allocations", () => {
    const handle = fixture("class X {}", "MODULE");
    runAllocationFixtureP2(handle, "NODE_COPY_SCHEMA", 1);
    refused(() => parserEntryAllocationFixtureP2(handle), "ALLOCATION_COVERAGE_OPEN");
    refused(() => readAllocationFixtureP2(handle), "AUTHORITY_REFUSED");
    expect(P2_KERNEL_STATUS.grammarImplemented).toBe(false);
    expect(P2_KERNEL_STATUS.occurrenceCoverageComplete).toBe(false);
    expect(P2_KERNEL_STATUS.adapterPin).toBe("NOT_ISSUED");
  });
  it("P222 caller completeness/profile/missing-guard metadata cannot authorize grammar", () => {
    const handle = fixture();
    const removedGuard = {coverageComplete: true, missingGuard: "A02", adapterPin: "claimed", enable: true};
    refused(() => Reflect.apply(parserEntryAllocationFixtureP2, undefined, [handle, removedGuard]), "AUTHORITY_REFUSED");
    expect(readAllocationFixtureP2(handle).phase).toBe("ALLOCATIONS_ONLY");
    refused(() => parserEntryAllocationFixtureP2(removedGuard), "AUTHORITY_REFUSED");
    refused(() => parserEntryAllocationFixtureP2(handle), "ALLOCATION_COVERAGE_OPEN");
    // This is rejection of forged metadata, NOT removal/review of a grammar guard.
  });
  it("P223 post-import array constructor replacement cannot capture private backing", () => {
    const handle = fixture();
    const trap = vi.fn(() => { throw new Error("not called"); });
    vi.stubGlobal("Array", trap);
    const result = runAllocationFixtureP2(handle, "ARRAY_RESIZE", 2);
    vi.unstubAllGlobals();
    expect(result.entries).toBe(2);
    expect(trap).not.toHaveBeenCalled();
  });
  it("P224 huge scalar request hits actual before-growth cap, never preallocates vector", () => {
    const handle = fixture("", "SCRIPT", 83120);
    refused(() => runAllocationFixtureP2(handle, "ARRAY_RESIZE", Number.MAX_SAFE_INTEGER), "CAP_REFUSED");
    refused(() => readAllocationFixtureP2(handle), "AUTHORITY_REFUSED");
  });
  it("P225 rejected native syntax is not reported invalid by this nonparser", () => {
    const handle = fixture("/x/u; 123n");
    // No lexer/RegExp/BigInt converter exists; grammar dispatch refuses before reads.
    refused(() => parserEntryAllocationFixtureP2(handle), "ALLOCATION_COVERAGE_OPEN");
    expect(P2_KERNEL_STATUS.parserDisabled).toBe(true);
  });
  it("P226 inherited object operator setter cannot observe private copy", () => {
    const handle = fixture();
    let traps = 0;
    Object.defineProperty(Object.prototype, "operator", {configurable: true,
      set() { traps++; throw new Error("not called"); }});
    let result: ReturnType<typeof runAllocationFixtureP2>;
    try { result = runAllocationFixtureP2(handle, "NODE_COPY_SCHEMA", 1); }
    finally { delete (Object.prototype as {operator?: unknown}).operator; }
    expect(result!.nodes).toBe(2);
    expect(traps).toBe(0);
  });
  it("P227 inherited array numeric setter cannot receive private node/key", () => {
    const handle = fixture();
    let traps = 0;
    Object.defineProperty(Array.prototype, "0", {configurable: true,
      set() { traps++; throw new Error("not called"); }});
    let result: ReturnType<typeof runAllocationFixtureP2>;
    try { result = runAllocationFixtureP2(handle, "ARRAY_RESIZE", 1); }
    finally { delete (Array.prototype as unknown as {0?: unknown})[0]; }
    expect(result!.entries).toBe(1);
    expect(traps).toBe(0);
  });
  it("P228 actual allocated-node attempts200000 and+1 refuse conjunctively", () => {
    const handle = fixture("", "SCRIPT", 67108864);
    const result = runAllocationFixtureP2(handle, "NODE_COPY_SCHEMA", 199999);
    expect(result.nodes).toBe(200000);
    expect(result.producerBytes).toBe(60799872); //176+199999*304, all copy/schema attempts.
    expect(result.totalBytes).toBe(60882816);
    refused(() => runAllocationFixtureP2(handle, "NODE_COPY_SCHEMA", 0), "NODE_REFUSED");
    refused(() => readAllocationFixtureP2(handle), "AUTHORITY_REFUSED");
    // This linked-copy exercise is NOT a complete AST or AST-depth128 certificate.
  });
  it("P229 actual occupied-slot entries20000 and+1 refuse conjunctively", () => {
    const handle = fixture("", "SCRIPT", 67108864);
    const result = runAllocationFixtureP2(handle, "ARRAY_RESIZE", 20000);
    expect(result.entries).toBe(20000);
    expect(result.nodes).toBe(20000);
    refused(() => runAllocationFixtureP2(handle, "ARRAY_RESIZE", 1), "ENTRY_REFUSED");
    refused(() => readAllocationFixtureP2(handle), "AUTHORITY_REFUSED");
  });
  it("P230 captured actual clock enforces original deadline, not observation renewal", async () => {
    const started = trustedPerformance.now();
    const handle = fixture("", "SCRIPT", 1048576, 1000);
    const originalNow = trustedPerformance.now.bind(trustedPerformance);
    vi.spyOn(trustedPerformance, "now").mockImplementation(() => 0);
    await new Promise(resolve => setTimeout(resolve, 600));
    const firstElapsed = originalNow() - started;
    const first = readAllocationFixtureP2(handle);
    await new Promise(resolve => setTimeout(resolve, 600));
    const finalElapsed = originalNow() - started;
    console.log("P230 bounded actual elapsed milliseconds", firstElapsed, finalElapsed);
    expect(first.phase).toBe("ALLOCATIONS_ONLY");
    expect(firstElapsed).toBeGreaterThanOrEqual(500);
    expect(firstElapsed).toBeLessThan(1000);
    expect(finalElapsed).toBeGreaterThanOrEqual(1000);
    expect(finalElapsed - firstElapsed).toBeLessThan(1000);
    refused(() => readAllocationFixtureP2(handle), "TIME_REFUSED");
    refused(() => readAllocationFixtureP2(handle), "AUTHORITY_REFUSED");
  });
  it("P231 expired lost owner retires before fresh fixture admission", async () => {
    const expired = fixture("", "SCRIPT", 1048576, 10);
    await new Promise(resolve => setTimeout(resolve, 30));
    const fresh = fixture("x", "MODULE");
    refused(() => readAllocationFixtureP2(expired), "AUTHORITY_REFUSED");
    expect(readAllocationFixtureP2(fresh).profile).toBe("MODULE");
  });
});
