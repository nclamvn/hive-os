import * as childProcess from "node:child_process";
import * as fs from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { buildLrcFiveExceptionReport, validateLrcFiveExceptionReport, type FiveExceptionEvidence, type FiveExceptionFraction } from "@/modules/research-sandbox/math-lrc-five-exception";
import { auditLrcFiveException, LRC_FIVE_EXCEPTION_PYTHON, LRC_FIVE_EXCEPTION_PYTHON_SHA256, LRC_FIVE_EXCEPTION_CORE_SHA256 } from "../../scripts/operations/lrc-five-exception-audit";

vi.mock("node:child_process", async importOriginal => {
  const original = await importOriginal<typeof import("node:child_process")>();
  return { ...original, spawnSync: vi.fn(original.spawnSync) };
});
vi.mock("node:fs", async importOriginal => {
  const original = await importOriginal<typeof import("node:fs")>();
  return { ...original, readFileSync: vi.fn(original.readFileSync) };
});
const actualProcess = await vi.importActual<typeof import("node:child_process")>("node:child_process");
const actualFs = await vi.importActual<typeof import("node:fs")>("node:fs");

const flags = ["RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED", "LRC_CAMPAIGN_LOCAL_ENABLED", "RESEARCH_OPENAI_ENABLED", "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED"];
const oldFlags = flags.map(flag => process.env[flag]);
const budget = () => ({ remainingMs: 5000, remainingOperations: 2000000 });
beforeEach(() => {
  vi.mocked(childProcess.spawnSync).mockReset().mockImplementation(actualProcess.spawnSync);
  vi.mocked(fs.readFileSync).mockReset().mockImplementation(actualFs.readFileSync);
  for (const flag of flags) process.env[flag] = "false";
});
afterEach(() => {
  vi.restoreAllMocks();
  flags.forEach((flag, index) => { if (oldFlags[index] === undefined) delete process.env[flag]; else process.env[flag] = oldFlags[index]; });
});
const freshCore = (): FiveExceptionEvidence => {
  const report = buildLrcFiveExceptionReport(budget());
  expect(report.status).toBe("ACCEPTED");
  return JSON.parse(JSON.stringify(report.evidence)) as FiveExceptionEvidence;
};
const rehash = (value: FiveExceptionEvidence) => { value.reportDigest = sha256(canonicalJson(value.report)); return value; };
function mockProcess(evidence: unknown, metrics: Record<string, unknown> = {}) {
  return vi.spyOn(childProcess, "spawnSync").mockReturnValue({
    pid: 123, status: 0, signal: null, output: [], stderr: "",
    stdout: JSON.stringify({ status: "ACCEPTED", evidence, chargedOperations: 200, elapsedMs: 1, ...metrics }),
  } as ReturnType<typeof childProcess.spawnSync>);
}
function rawPython(input: string, source?: string) {
  return childProcess.spawnSync(LRC_FIVE_EXCEPTION_PYTHON, ["-I", "-S", "-B", "-c", source ?? fs.readFileSync("scripts/research/lrc-five-exception-replay.py", "utf8")], {
    input, encoding: "utf8", env: { NODE_ENV: "test" }, shell: false, timeout: 5000, maxBuffer: 32768,
  });
}
const ratio = (value: FiveExceptionFraction) => value.map(BigInt) as [bigint, bigint];
function compare(a: FiveExceptionFraction, b: FiveExceptionFraction) {
  const [an, ad] = ratio(a), [bn, bd] = ratio(b);
  return an * bd - bn * ad;
}
function distanceAt(speed: number, time: FiveExceptionFraction): FiveExceptionFraction {
  const [n, d] = ratio(time);
  const rem = (BigInt(speed) * n % d + d) % d;
  let a = rem < d - rem ? rem : d - rem, b = d;
  let g = a, h = b;
  while (h) { const next = g % h; g = h; h = next; }
  a /= g; b /= g;
  return [String(a), String(b)];
}

describe("TIP-072O independent exact five-exception pair replay", () => {
  it("runs fresh isolated Python and compares every semantic field", () => {
    const run = auditLrcFiveException(budget());
    expect(run.status).toBe("MATCH"); expect(run.evidence).toEqual(freshCore());
    expect(run.evidence?.reportDigest).toBe("86731a54c988e4f22d3a793101f4faddaeb60e6a6ab8f4047db88df0e14d0255");
    expect(run.sourcePins).toEqual({ python: LRC_FIVE_EXCEPTION_PYTHON_SHA256, core: LRC_FIVE_EXCEPTION_CORE_SHA256 });
    expect(Buffer.byteLength(JSON.stringify(run))).toBeLessThanOrEqual(32768);
    expect(run.metrics.chargedOperations).toBeGreaterThan(run.metrics.core!.chargedOperations + run.metrics.python!.chargedOperations);
    expect(run.metrics.elapsedMs).toBeLessThanOrEqual(5000);
    expect(run.metrics.chargedOperations).toBeLessThanOrEqual(2000000);
    expect(run.agentLoop).toBe("NOT_RUN"); expect(run.executionAuthority).toBe(false);
    expect(run.assurance).toContain("NOT_SIGNED_ATTESTATION");
  });
  it("retains all6 roots,11 cells,18 fixtures/252 coordinates and full14 sharpness", () => {
    const run = rawPython(JSON.stringify({ version: "LRC_FIVE_EXCEPTION_REPLAY_V1", ...budget() }));
    expect(run.status).toBe(0); expect(run.stderr).toBe("");
    expect(Buffer.byteLength(run.stdout)).toBeLessThanOrEqual(32768);
    const parsed = JSON.parse(run.stdout);
    expect(parsed.status).toBe("ACCEPTED"); expect(parsed.evidence).toEqual(freshCore());
    const r = parsed.evidence.report as FiveExceptionEvidence["report"];
    expect(r.partition.boundaries).toEqual([["0","1"],["1","30"],["1","15"],["2","15"],["1","6"],["1","5"]]);
    expect(r.partition.cells).toHaveLength(11);
    expect(r.partition.cells.filter(c => c.kind === "BOUNDARY")).toHaveLength(6);
    expect(r.partition.cells.filter(c => c.kind === "OPEN")).toHaveLength(5);
    for (const c of r.partition.cells) {
      expect(c.distances).toHaveLength(5); expect(c.distances.every(row => row.length === 2)).toBe(true);
      const bad = [0,1].map(i => c.distances.flatMap((row,j) => compare(row[i],r.threshold) < BigInt(0) ? [j] : []));
      expect(c.badShiftIndicesByCoordinate).toEqual(bad);
      expect(c.pairBadUnionIndices).toEqual([...new Set(bad.flat())].sort((a,b)=>a-b));
      expect(c.pairBadUnionIndices.length).toBeLessThanOrEqual(1);
      expect(c.pairGoodShiftIndices).toEqual([0,1,2,3,4].filter(j => !c.pairBadUnionIndices.includes(j)));
      if(c.kind === "BOUNDARY") expect(c.left).toEqual(c.right);
    }
    expect(r.partition.cells.at(-1)?.left).toEqual(["1","5"]);
    expect(r.positiveFixtures).toHaveLength(18);
    expect(r.positiveFixtures.filter(f => f.kind === "SCALED")).toHaveLength(12);
    expect(r.positiveFixtures.filter(f => f.kind === "ARBITRARY_EXTRAS")).toHaveLength(6);
    expect(r.positiveFixtures.flatMap(f => f.coordinateDistances)).toHaveLength(252);
    for (const f of r.positiveFixtures) {
      expect(f.speeds).toHaveLength(14); expect(new Set(f.speeds).size).toBe(14);
      expect(f.movingRunners).toBe(14); expect(f.totalRunners).toBe(15);
      expect(f.exceptionSpeeds).toEqual([f.q,2*f.q,...f.extraSpeeds]);
      expect(f.coordinateDistances).toEqual(f.speeds.map(s=>distanceAt(s,f.time)));
      expect(f.coordinateDistances.every(v=>compare(v,f.gamma)>=BigInt(0))).toBe(true);
      expect(compare(f.minimumDistance,f.gamma)).toBeGreaterThanOrEqual(BigInt(0));
      expect(f.gamma).toEqual(["1","15"]); expect(f.lowerMargin).toEqual(["1","10"]);
      expect(f.lowerLrcAssumption).toBe("LRC(9)"); expect(f.lowerWitnessVerified).toBe(true);
      expect(f.selectionRule).toBe("LOWEST_PHYSICAL_GOOD_SHIFT");
      expect(f.physicalShift).toBe(f.exceptionDistancesByShift.findIndex(row=>row.every(v=>compare(v,["1","15"])>=BigInt(0))));
      expect(f.normalizedShift).toBe((f.carry+f.q*f.physicalShift)%5);
      expect(f.physicalShift).toBe(((f.qInverse*(f.normalizedShift-f.carry))%5+5)%5);
    }
    expect(r.sharpness.fullDistancesByShift).toHaveLength(5);
    expect(r.sharpness.fullDistancesByShift.every(row=>row.length===14)).toBe(true);
    expect(r.sharpness.fullMinimumByShift).toEqual([["1","15"],["1","15"],["1","15"],["0","1"],["1","15"]]);
    expect(r.sharpness.maximumFullMinimum).toEqual(["1","15"]);
    expect(r.sharpness.maximumExceptionMinimum).toEqual(["1","15"]);
    expect(r.sharpness.lowerMinimum).toEqual(["1","3"]);
    expect(r.independentObstruction.minima).toEqual(Array.from({length:5},()=>["0","1"]));
    expect(r.residueAlias.fullMinimumByShift).toEqual([["0","1"],["1","30"],["1","30"],["1","30"],["1","30"]]);
    expect(r.residueAlias.lowerMinimum).toEqual(["1","6"]);
    expect(r.residueAlias.requiredPairPresent).toBe(false);
    expect(r.failedThirdUpgrade.minimumByShift).toEqual([["1","10"],["1","10"],["0","1"],["1","10"],["1","10"]]);
    expect(r.routes.map(x=>x.selected)).toEqual(["INDEPENDENT","PAIR","INDEPENDENT","INDEPENDENT","INDEPENDENT","PAIR"]);
    expect(r.scope).toMatchObject({globalLrc:"NOT_ESTABLISHED",strictSlackGuaranteed:false,target14TotalMet:false,target15TotalMet:true,conditionalLowerWitnessRequired:true,runtimeRoutingChanged:false});
  });
  it("carry omission is an actual failed coordinate, not just altered metadata", () => {
    const r = freshCore().report, f=r.positiveFixtures[8], failure=r.carryFailure;
    expect(f.q).toBe(11); expect(f.carry).toBe(1); expect(f.qInverse).toBe(1);
    expect(f.physicalShift).toBe(0); expect(f.normalizedShift).toBe(1);
    expect(failure).toMatchObject({fixtureIndex:8,correctPhysicalShift:0,wrongPhysicalShift:1,wrongTime:["11","50"],wrongMinimum:["3","50"]});
    expect(distanceAt(77,failure.wrongTime)).toEqual(["3","50"]);
    expect(compare(failure.wrongMinimum,r.threshold)).toBeLessThan(BigInt(0));
  });
  it("independently recomputes every full14 sharp and alias coordinate on all5 physical shifts", () => {
    const report = freshCore().report;
    for (const witness of [report.sharpness, report.residueAlias]) {
      const [n,d] = ratio(witness.baseTime);
      for (let j=0;j<5;j++) {
        const time: FiveExceptionFraction = [String(n*BigInt(5)+BigInt(j)*d),String(d*BigInt(5))];
        expect(witness.fullDistancesByShift[j]).toEqual(witness.speeds.map(s=>distanceAt(s,time)));
        expect(witness.exceptionDistancesByShift[j]).toEqual(witness.exceptionSpeeds.map(s=>distanceAt(s,time)));
      }
      expect(witness.lowerCoordinateDistances).toEqual(witness.divisibleReducedSpeeds.map(s=>distanceAt(s,witness.tau)));
      expect(witness.lowerCoordinateDistances.every(x=>compare(x,witness.lowerMargin)>=BigInt(0))).toBe(true);
    }
    expect(report.routes.map(x=>x.independentMargin)).toEqual([["1","6"],["0","1"],["1","5"],["1","10"],["1","10"],["0","1"]]);
    expect(report.routes.map(x=>x.pairMargin)).toEqual([["1","9"],["1","9"],["1","15"],["1","15"],["1","15"],["1","15"]]);
    expect(report.routes.filter(x=>x.e===x.d).every(x=>x.independentStatus==="NO_POSITIVE_GUARANTEE")).toBe(true);
  });
  const corruptions: [string,(x:FiveExceptionEvidence)=>void][] = [
    ["root",x=>{x.report.partition.boundaries[1]=["1","29"];}],
    ["missingcell",x=>{x.report.partition.cells.pop();}],
    ["cellorder",x=>{x.report.partition.cells.reverse();}],
    ["closedendpoint",x=>{x.report.partition.cells[0].right=["1","30"];}],
    ["equalitybad",x=>{x.report.partition.cells[4].pairBadUnionIndices.push(0);}],
    ["coordinatebad",x=>{x.report.partition.cells[0].badShiftIndicesByCoordinate[0]=[];}],
    ["missingmatrixcoordinate",x=>{x.report.partition.cells[0].distances[0].pop();}],
    ["goodcomplement",x=>{x.report.partition.cells[0].pairGoodShiftIndices=[];}],
    ["sharpfull",x=>{x.report.sharpness.fullDistancesByShift[0][0]=["0","1"];}],
    ["sharpmargin",x=>{x.report.sharpness.maximumFullMinimum=["1","14"];}],
    ["sharplower",x=>{x.report.sharpness.lowerMinimum=["1","9"];}],
    ["independentphase",x=>{x.report.independentObstruction.phases[0]=["1","5"];}],
    ["missingfixture",x=>{x.report.positiveFixtures.pop();}],
    ["nonunit",x=>{x.report.positiveFixtures[0].q=5;}],
    ["notactualpair",x=>{x.report.positiveFixtures[0].exceptionSpeeds[1]=7;}],
    ["missingcoordinate",x=>{x.report.positiveFixtures[0].coordinateDistances.pop();}],
    ["carry",x=>{x.report.positiveFixtures[8].carry=0;}],
    ["physicalshift",x=>{x.report.positiveFixtures[8].physicalShift=1;}],
    ["lowerwitness",x=>{(x.report.positiveFixtures[0] as unknown as Record<string,unknown>).lowerWitnessVerified=false;}],
    ["lowerassumption",x=>{(x.report.positiveFixtures[0] as unknown as Record<string,unknown>).lowerLrcAssumption="NONE";}],
    ["selectionrule",x=>{(x.report.positiveFixtures[0] as unknown as Record<string,unknown>).selectionRule="ANY";}],
    ["wrongcarryfailure",x=>{x.report.carryFailure.wrongMinimum=["1","10"];}],
    ["aliaspromotion",x=>{(x.report.residueAlias as unknown as Record<string,unknown>).requiredPairPresent=true;}],
    ["aliasmatrix",x=>{x.report.residueAlias.fullDistancesByShift[0][9]=["1","15"];}],
    ["thirdpromotion",x=>{x.report.failedThirdUpgrade.maximumMinimumDistance=["1","5"];}],
    ["routepromotion",x=>{x.report.routes[2].selected="PAIR";}],
    ["routebound",x=>{x.report.routes[3].independentMargin=["1","5"];}],
    ["unsupportedzero",x=>{x.report.routes[1].independentStatus="POSITIVE";}],
    ["globalpromotion",x=>{(x.report.scope as unknown as Record<string,unknown>).globalLrc="PROVED";}],
    ["slackpromotion",x=>{(x.report.scope as unknown as Record<string,unknown>).strictSlackGuaranteed=true;}],
    ["target14promotion",x=>{(x.report.scope as unknown as Record<string,unknown>).target14TotalMet=true;}],
    ["agentpromotion",x=>{(x.report.scope as unknown as Record<string,unknown>).agentLoop="COMPLETE";}],
    ["extraauthority",x=>{(x.report.scope as unknown as Record<string,unknown>).authority=true;}],
    ["componentoverflow",x=>{x.report.threshold[0]=(BigInt(1)<<BigInt(257)).toString();}],
  ];
  it.each(corruptions)("rejects coherent rehashed %s corruption",(_,corrupt)=>{
    const evidence=freshCore(); corrupt(evidence); rehash(evidence);
    const process=mockProcess(evidence), run=auditLrcFiveException(budget());
    expect(process).toHaveBeenCalledOnce(); expect(run.status).toBe("MISMATCH"); expect(run.evidence).toBeNull();
  });
  it.each(["getter", "prototype", "sparse", "symbol", "hidden", "cycle"])("passive admission refuses hostile %s data", mode => {
    const evidence = freshCore(); let getters = 0;
    if (mode === "getter") Object.defineProperty(evidence, "reportDigest", { enumerable: true, get() { getters++; return "a".repeat(64); } });
    if (mode === "prototype") Object.setPrototypeOf(evidence, { promotion: true });
    if (mode === "sparse") delete (evidence.report.partition.cells as unknown[])[0];
    if (mode === "symbol") Object.defineProperty(evidence, Symbol("secret"), { value: 1 });
    if (mode === "hidden") Object.defineProperty(evidence, "hidden", { value: 1 });
    if (mode === "cycle") (evidence as unknown as Record<string, unknown>).cycle = evidence;
    const run = validateLrcFiveExceptionReport(evidence, budget());
    expect(run.status).not.toBe("ACCEPTED"); expect(run.evidence).toBeNull(); expect(getters).toBe(0);
  });
  it("does not reset child time or operation limits after Core and IO", () => {
    const process = mockProcess(freshCore());
    const run = auditLrcFiveException(budget());
    expect(run.status).toBe("MATCH");
    const [binary, args, options] = process.mock.calls[0];
    expect(binary).toBe("/opt/homebrew/bin/python3");
    expect(args?.slice(0, 4)).toEqual(["-I", "-S", "-B", "-c"]);
    const opts = options as childProcess.SpawnSyncOptionsWithStringEncoding;
    expect(opts.env).toEqual({ NODE_ENV: "test" }); expect(opts.shell).toBe(false);
    expect(opts.maxBuffer).toBe(32768);
    const input = JSON.parse(String(opts.input));
    expect(input.remainingMs).toBeLessThan(5000);
    expect(input.remainingOperations).toBeLessThan(2000000 - run.metrics.core!.chargedOperations);
    expect(opts.timeout).toBe(input.remainingMs);
  });
  it.each([0, -1, 0.5, 5000.5, 5001, NaN, Infinity])("refuses invalid milliseconds %s before process", remainingMs => {
    const process = vi.spyOn(childProcess, "spawnSync");
    expect(auditLrcFiveException({ ...budget(), remainingMs }).status).toBe("RESOURCE_REFUSED");
    expect(process).not.toHaveBeenCalled();
  });
  it.each([0, -1, 0.5, 2000000.5, 2000001, NaN, Infinity])("refuses invalid operation allowance %s before process", remainingOperations => {
    const process = vi.spyOn(childProcess, "spawnSync");
    expect(auditLrcFiveException({ ...budget(), remainingOperations }).status).toBe("RESOURCE_REFUSED");
    expect(process).not.toHaveBeenCalled();
  });
  it("bounded operations are shared even before Core", () => {
    const process = vi.spyOn(childProcess, "spawnSync");
    const run = auditLrcFiveException({ remainingMs: 5000, remainingOperations: 1 });
    expect(run.status).toBe("RESOURCE_REFUSED"); expect(run.evidence).toBeNull();
    expect(process).not.toHaveBeenCalled();
  });
  it("a successful actual child cannot escape the shared comparison and IO allowance", () => {
    const run = auditLrcFiveException({ remainingMs: 5000, remainingOperations: 75000 });
    expect(run.status).toBe("RESOURCE_REFUSED"); expect(run.evidence).toBeNull();
    expect(run.metrics.core?.chargedOperations).toBeGreaterThan(0);
    expect(run.metrics.python?.chargedOperations).toBeGreaterThan(0);
    expect(run.metrics.chargedOperations).toBeLessThanOrEqual(75000);
  });
  it("a process returning after the shared outer deadline cannot produce a positive", () => {
    const evidence = freshCore();
    vi.spyOn(performance, "now").mockReturnValue(100);
    mockProcess(evidence).mockImplementation(() => {
      vi.mocked(performance.now).mockReturnValue(5101);
      return { pid: 123, status: 0, signal: null, output: [], stderr: "", stdout: JSON.stringify({ status: "ACCEPTED", evidence, chargedOperations: 200, elapsedMs: 1 }) } as ReturnType<typeof childProcess.spawnSync>;
    });
    const run = auditLrcFiveException(budget());
    expect(run.status).toBe("RESOURCE_REFUSED"); expect(run.evidence).toBeNull();
  });
  it.each(flags)("requires exactfalse flag %s", flag => {
    process.env[flag] = "true";
    const processSpy = vi.spyOn(childProcess, "spawnSync");
    expect(auditLrcFiveException(budget()).status).toBe("FLAGS_REFUSED");
    expect(processSpy).not.toHaveBeenCalled();
  });
  it("undefined execution flag is also refused", () => {
    delete process.env.RESEARCH_WORKER_ENABLED;
    expect(auditLrcFiveException(budget()).status).toBe("FLAGS_REFUSED");
  });
  it("does not invoke an untrusted budget getter", () => {
    let calls = 0;
    const hostile = { get remainingMs() { calls++; return 5000; }, remainingOperations: 2000000 };
    expect(auditLrcFiveException(hostile).status).toBe("RESOURCE_REFUSED");
    expect(calls).toBe(0);
  });
  it("rejects a nonenumerable budget instead of silently admitting hidden controls", () => {
    const controls = budget();
    Object.defineProperty(controls, "remainingMs", { enumerable: false, value: 5000 });
    expect(auditLrcFiveException(controls).status).toBe("RESOURCE_REFUSED");
  });
  it("refuses an inherited serialization getter installed after the process boundary without invoking it", () => {
    const evidence = freshCore(); const stdout = JSON.stringify({ status: "ACCEPTED", evidence, chargedOperations: 200, elapsedMs: 1 });
    let invocations = 0;
    mockProcess(evidence).mockImplementation(() => {
      Object.defineProperty(Object.prototype, "toJSON", { configurable: true, get() { invocations++; return undefined; } });
      return { pid: 123, status: 0, signal: null, output: [], stderr: "", stdout } as ReturnType<typeof childProcess.spawnSync>;
    });
    let run: ReturnType<typeof auditLrcFiveException>;
    try { run = auditLrcFiveException(budget()); }
    finally { delete (Object.prototype as { toJSON?: unknown }).toJSON; }
    expect(run!.status).toBe("MISMATCH"); expect(run!.evidence).toBeNull(); expect(invocations).toBe(0);
  });
  it("refuses pre-process source drift", () => {
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(Buffer.from("changed"));
    const process = vi.spyOn(childProcess, "spawnSync");
    expect(auditLrcFiveException(budget()).status).toBe("SOURCE_REFUSED");
    expect(process).not.toHaveBeenCalled();
  });
  it("refuses source drift after exact process success", () => {
    mockProcess(freshCore());
    const python = fs.readFileSync("scripts/research/lrc-five-exception-replay.py");
    const core = fs.readFileSync("src/modules/research-sandbox/math-lrc-five-exception.ts");
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(python).mockReturnValueOnce(core).mockReturnValueOnce(Buffer.from("changed"));
    const run = auditLrcFiveException(budget());
    expect(run.status).toBe("SOURCE_REFUSED"); expect(run.evidence).toBeNull();
  });
  it.each(["exitfailure", "timeout", "signal", "stderr", "malformed", "oversize"])("no partial positive for process %s", mode => {
    const process = mockProcess(freshCore());
    const response = process.mock.results[0];
    expect(response).toBeUndefined();
    const fake = { pid: 123, status: 0, signal: null, output: [], stderr: "", stdout: "{}" } as unknown as ReturnType<typeof childProcess.spawnSync>;
    if (mode === "exitfailure") fake.status = 1;
    if (mode === "timeout") fake.error = Object.assign(new Error("timeout"), { code: "ETIMEDOUT" });
    if (mode === "signal") fake.signal = "SIGKILL";
    if (mode === "stderr") fake.stderr = "unexpected diagnostics";
    if (mode === "malformed") fake.stdout = "{";
    if (mode === "oversize") fake.stdout = " ".repeat(32769);
    process.mockReturnValue(fake);
    const run = auditLrcFiveException(budget());
    expect(run.status).not.toBe("MATCH"); expect(run.evidence).toBeNull();
  });
  it.each([{ chargedOperations: 2000001 }, { chargedOperations: 0 }, { chargedOperations: 0.5 }, { elapsedMs: 5001 }, { elapsedMs: -1 }])("refuses inconsistent processmetrics %j", metrics => {
    mockProcess(freshCore(), metrics);
    const run = auditLrcFiveException(budget());
    expect(run.status).toBe("RESOURCE_REFUSED"); expect(run.evidence).toBeNull();
  });
  it.each([
    { remainingMs: 0, remainingOperations: 2000000 }, { remainingMs: 0.5, remainingOperations: 2000000 },
    { remainingMs: 5001, remainingOperations: 2000000 }, { remainingMs: 5000, remainingOperations: 0 },
    { remainingMs: 5000, remainingOperations: 0.5 }, { remainingMs: 5000, remainingOperations: 2000001 },
    { remainingMs: 5000, remainingOperations: 1 },
  ])("actual Python refuses resource control %j", input => {
    const run = rawPython(JSON.stringify({ version: "LRC_FIVE_EXCEPTION_REPLAY_V1", ...input }));
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toMatchObject({ status: "RESOURCE_REFUSED", evidence: null });
  });
  it.each(["{" + '"version":"LRC_FIVE_EXCEPTION_REPLAY_V1","version":"LRC_FIVE_EXCEPTION_REPLAY_V1","remainingMs":5000,"remainingOperations":2000000}',
    '{"version":"LRC_FIVE_EXCEPTION_REPLAY_V1","remainingMs":NaN,"remainingOperations":2000000}',
    '{"version":"WRONG","remainingMs":5000,"remainingOperations":2000000}',
    '{"version":"LRC_FIVE_EXCEPTION_REPLAY_V1","remainingMs":5000,"remainingOperations":2000000,"class":[7,2]}',
    "{", "[]"])("actual Python refuses invalid fixed request %#", input => {
    const run = rawPython(input);
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toMatchObject({ status: "REPORT_REFUSED", evidence: null });
  });
  it("actual Python refuses oversized stdin before parsing", () => {
    const run = rawPython(" ".repeat(32769));
    expect(JSON.parse(run.stdout)).toMatchObject({ status: "RESOURCE_REFUSED", evidence: null });
  });
  it("isolated Python imports no peer mathematics or file/network/process libraries",()=>{
    const source=fs.readFileSync("scripts/research/lrc-five-exception-replay.py","utf8");
    expect(source).toContain("from fractions import Fraction");
    expect(source).not.toMatch(/import (os|pathlib|subprocess|socket|requests)|open\(|write_text|math-lrc-/);
    expect(source).toContain("math.ceil(low - sign * ETA)");
    expect(source).toContain("inverse * (h - carry) % 5");
    expect(source).toContain("min(coordinates) < ETA");
  });
});
