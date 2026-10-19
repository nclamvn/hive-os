import { describe, expect, it, vi } from "vitest";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import {
  admitCandidate, applicableDomainMethods, createDomainProblemContract, createHostVerifier, invokeResearchProvider,
  listDomainAdapters, prepareProblemContract, prepareReviewerRequest, prepareSolverRequest,
  ResearchCoreRefusal, resolveDomainAdapter, type HostVerifierConfig, type PreparedProblem,
} from "@/modules/research-sandbox/research-core-v3";

const pin = sha256("SYNTHETIC_ENGINEERING_PIN_NOT_RELEASE_AUTHORITY");
const pins = Object.fromEntries(listDomainAdapters().map(a => [a.id,pin]));
const make = (adapterId: string, input: unknown, suffix = "1") => createDomainProblemContract({ id: `contract-${suffix}`, rootId: "RESEARCH_CORE_V3_076", target: "Exact finite engineering control, not a global theorem", mode: "ENGINEERING", adapterId, input, obligationId: "exact" });
const integer = () => make("INTEGER_WITNESS",{ kind: "LINEAR_WITNESS", coefficients: ["2","3"], rhs: "7" });
const graph = () => make("FINITE_GRAPH",{ kind: "COLORING", vertexCount: 4, edges: [[0,1],[1,2]], colorCount: 2 });
const r = (numerator: string, denominator = "1") => ({ numerator,denominator });
const polynomial = () => make("POLYNOMIAL_IDENTITY",{ kind: "RATIONAL_IDENTITY", left: { factors: [[r("1"),r("1")],[r("1"),r("1")]] }, right: { factors: [[r("1"),r("2"),r("1")]] } });
const expanded = () => ({ kind: "IDENTITY_CERTIFICATE", leftCoefficients: [r("1"),r("2"),r("1")], rightCoefficients: [r("1"),r("2"),r("1")] });
function host(overrides: Partial<HostVerifierConfig> = {}) {
  const reserveCheck = vi.fn();
  return { reserveCheck, verifier: createHostVerifier({ runtimeSourceDigest: pin,sourceBundleDigest: pin,authorityEpoch: "test-epoch",checkerSourceDigests: pins,reserveCheck,...overrides }) };
}
function check(prepared: PreparedProblem, value: unknown, overrides: Partial<HostVerifierConfig> = {}) {
  const candidate = admitCandidate(prepared,"exact",JSON.stringify(value));
  const { verifier,reserveCheck } = host(overrides);
  const receipt = verifier.verify({ prepared,obligationId: "exact",candidate,attemptId: "attempt-1",inputDigest: prepared.inputDigest });
  return { receipt,closure: verifier.projectClosure(prepared,"exact",receipt),verifier,reserveCheck,candidate };
}
function code(fn: () => unknown, expected: string) {
  try { fn(); throw new Error("Expected refusal"); } catch (error) { expect(error).toBeInstanceOf(ResearchCoreRefusal); expect((error as ResearchCoreRefusal).code).toBe(expected); }
}

describe("Research Core v3 generic domain and source boundary",() => {
  it("lists three reviewed static adapters and bounds",() => {
    expect(listDomainAdapters().map(a => a.id).slice(0,3)).toEqual(["INTEGER_WITNESS","FINITE_GRAPH","POLYNOMIAL_IDENTITY"]);
    expect(resolveDomainAdapter("INTEGER_WITNESS").capabilities).toEqual(["INTEGER_WITNESS","FINITE_EXHAUSTION"]);
    expect(resolveDomainAdapter("FINITE_GRAPH").capabilities).toEqual(["FINITE_GRAPH_CERTIFICATE"]);
    expect(resolveDomainAdapter("POLYNOMIAL_IDENTITY").capabilities).toEqual(["EXACT_IDENTITY"]);
    for (const a of listDomainAdapters()) { expect(a.limits.maxOperations).toBeGreaterThan(0); expect(Object.isFrozen(a.limits)).toBe(true); }
  });
  it("refuses unknown adapter rather than routing a fallback",() => code(() => make("UNKNOWN",{}),"UNSUPPORTED"));
  it("refuses unknown adapter version",() => code(() => resolveDomainAdapter("FINITE_GRAPH",2),"UNSUPPORTED"));
  it("produces immutable canonical prepared contract",() => {
    const p = integer(); expect(p.contractDigest).toBe(sha256(canonicalJson(p.contract)));
    expect(Object.isFrozen(p.contract.obligations[0].predicate)).toBe(true);
  });
  it("restores a prepared contract from exact persisted bytes",() => {
    const p = integer(), restored = prepareProblemContract(canonicalJson(p.contract));
    expect(restored.contractDigest).toBe(p.contractDigest); expect(check(restored,{ kind: "INTEGER_WITNESS",values: ["2","1"] }).closure.status).toBe("CLOSED_EXACT_SCOPE");
  });
  it("does not retain mutable input references",() => {
    const input = { kind: "LINEAR_WITNESS",coefficients: ["2","3"],rhs: "7" };
    const p = make("INTEGER_WITNESS",input); input.coefficients[0] = "100";
    expect((p.contract.domain.input as { coefficients: string[] }).coefficients[0]).toBe("2");
  });
  it("refuses getters without executing them",() => {
    let calls = 0; const object = { get target() { calls++; return "forged"; } };
    code(() => prepareProblemContract(object),"SCHEMA_REFUSED"); expect(calls).toBe(0);
  });
  it("refuses Proxy traps without executing them",() => {
    let traps = 0; const proxy = new Proxy({}, { ownKeys() { traps++; return []; } });
    code(() => prepareProblemContract(proxy),"SCHEMA_REFUSED"); expect(traps).toBe(0);
  });
  it("refuses cycles before stringify",() => { const o: { self?: unknown } = {}; o.self = o; code(() => prepareProblemContract(o),"SCHEMA_REFUSED"); });
  it("refuses prototype-bearing classes",() => { class Forged {} code(() => prepareProblemContract(new Forged()),"SCHEMA_REFUSED"); });
  it("refuses sparse or decorated arrays",() => {
    const a = [1,,3]; code(() => make("FINITE_GRAPH",a),"SCHEMA_REFUSED");
    const b = [1] as number[] & { extra?: number }; b.extra = 2; code(() => make("FINITE_GRAPH",b),"SCHEMA_REFUSED");
  });
  it("bounds original bytes before JSON parse or hashing",() => code(() => prepareProblemContract(" ".repeat(262145)),"RESOURCE_REFUSED"));
  it("refuses duplicate or escaped-equivalent JSON keys",() => {
    const p = integer();
    code(() => admitCandidate(p,"exact",'{"kind":"INTEGER_WITNESS","values":["1","1"],"values":["2","1"]}'),"SCHEMA_REFUSED");
    code(() => admitCandidate(p,"exact",'{"kind":"INTEGER_WITNESS","values":["1","1"],"\\u0076alues":["2","1"]}'),"SCHEMA_REFUSED");
  });
  it("bounds raw JSON nesting before parse materialization",() => code(() => prepareProblemContract("[".repeat(21)+"0"+"]".repeat(21)),"RESOURCE_REFUSED"));
  it("bounds object arrays before canonicalization",() => code(() => make("FINITE_GRAPH",{ edges: Array(257).fill([0,1]) }),"RESOURCE_REFUSED"));
  it("refuses unsafe and non-finite numeric input",() => {
    for (const vertexCount of [Infinity,NaN,Number.MAX_SAFE_INTEGER + 1,1.5,-0]) code(() => make("FINITE_GRAPH",{ kind: "COLORING",vertexCount,edges: [],colorCount: 1 }),"SCHEMA_REFUSED");
  });
  it("rejects unsupported top-level fields",() => code(() => prepareProblemContract({ ...integer().contract,legacyPrime: 139 }),"SCHEMA_REFUSED"));
  it("rejects equation definitions drift",() => {
    const c = JSON.parse(canonicalJson(integer().contract)); c.definitions[0].statement = "Trust AI majority";
    code(() => prepareProblemContract(c),"ALIGNMENT_REFUSED");
  });
  it("rejects quantifier/domain substitution",() => {
    const c = JSON.parse(canonicalJson(integer().contract)); c.quantifiers[0] = { kind: "FOR_ALL",variable: "x",domain: "R" };
    code(() => prepareProblemContract(c),"ALIGNMENT_REFUSED");
  });
  it("rejects invented established assumptions or source debt laundering",() => {
    const c = JSON.parse(canonicalJson(polynomial().contract)); c.assumptions[0].status = "SOURCE_DEBT";
    code(() => prepareProblemContract(c),"ALIGNMENT_REFUSED");
  });
  it("rejects coherent rehash of an unrelated predicate",() => {
    const c = JSON.parse(canonicalJson(integer().contract)); c.obligations[0].predicate = { kind: "ALL_POSITIVE_INTEGER_THEOREM",input: c.domain.input };
    code(() => prepareProblemContract(c),"ALIGNMENT_REFUSED");
  });
  it("refuses formal theorem or reviewed argument without capability",() => {
    for (const type of ["FORMAL_THEOREM","REVIEWED_ARGUMENT","INTERVAL_ENCLOSURE"]) {
      const c = JSON.parse(canonicalJson(integer().contract)); c.obligations[0].acceptanceType = type;
      code(() => prepareProblemContract(c),"UNSUPPORTED");
    }
  });
  it("rejects missing evidence ceilings",() => { const c = { ...integer().contract,exclusions: ["OTHER"] }; code(() => prepareProblemContract(c),"ALIGNMENT_REFUSED"); });
  it("rejects duplicate obligation identifiers",() => {
    const p = integer(); code(() => prepareProblemContract({ ...p.contract,obligations: [p.contract.obligations[0],p.contract.obligations[0]] }),"SCHEMA_REFUSED");
  });
  it("requires host-prepared capabilities, not copied digests",() => {
    const p = integer(); code(() => prepareSolverRequest({ ...p },"exact"),"AUTHORITY_REFUSED");
  });
  it("retains exact candidate text rather than normalized replacement",() => {
    const bytes = ' { "values": ["2", "1"], "kind": "INTEGER_WITNESS" }\n';
    const candidate = admitCandidate(integer(),"exact",bytes);
    expect(candidate.originalBytes).toBe(bytes); expect(candidate.candidateDigest).toBe(sha256(bytes));
  });
  it("rejects AI-forged receipt fields in candidate schema",() => code(() => admitCandidate(integer(),"exact",JSON.stringify({ kind: "INTEGER_WITNESS",values: ["2","1"],status: "PASS",receiptDigest: pin })),"SCHEMA_REFUSED"));
  it("requires actual host-reviewed checker source map",() => {
    const p = integer(), candidate = admitCandidate(p,"exact",JSON.stringify({ kind: "INTEGER_WITNESS",values: ["2","1"] }));
    const { verifier,reserveCheck } = host({ checkerSourceDigests: {} });
    code(() => verifier.verify({ prepared: p,obligationId: "exact",candidate,attemptId: "a",inputDigest: p.inputDigest }),"AUTHORITY_REFUSED"); expect(reserveCheck).not.toHaveBeenCalled();
  });
  it("refuses malformed source/runtime digest",() => code(() => host({ runtimeSourceDigest: "approved" }),"AUTHORITY_REFUSED"));
  it("rejects candidate from another prepared input",() => {
    const a = integer(), b = integer(); const candidate = admitCandidate(a,"exact",JSON.stringify({ kind: "INTEGER_WITNESS",values: ["2","1"] }));
    code(() => host().verifier.verify({ prepared: b,obligationId: "exact",candidate,attemptId: "a",inputDigest: b.inputDigest }),"INTEGRITY_REFUSED");
  });
  it("rejects copied candidate objects even with matching hash",() => {
    const p = integer(), candidate = admitCandidate(p,"exact",JSON.stringify({ kind: "INTEGER_WITNESS",values: ["2","1"] }));
    code(() => host().verifier.verify({ prepared: p,obligationId: "exact",candidate: { ...candidate },attemptId: "a",inputDigest: p.inputDigest }),"INTEGRITY_REFUSED");
  });
  it("rejects wrong input digest before reservation",() => {
    const p = integer(), candidate = admitCandidate(p,"exact",JSON.stringify({ kind: "INTEGER_WITNESS",values: ["2","1"] })); const h = host();
    code(() => h.verifier.verify({ prepared: p,obligationId: "exact",candidate,attemptId: "a",inputDigest: sha256("wrong") }),"INTEGRITY_REFUSED"); expect(h.reserveCheck).not.toHaveBeenCalled();
  });
  it("reserves exact checker limits before checker clock/effects",() => {
    const order: string[] = []; const p = integer();
    const result = check(p,{ kind: "INTEGER_WITNESS",values: ["2","1"] },{ reserveCheck: binding => { order.push("reserve"); expect(binding.contractDigest).toBe(p.contractDigest); expect(binding.checkerSourceDigest).toBe(pin); },now: () => { order.push("clock"); return 0; } });
    expect(order[0]).toBe("reserve"); expect(result.receipt.result).toBe("VERIFIED");
  });
  it("refuses exhausted reservation before checker invocation",() => {
    const clock = vi.fn(); expect(() => check(integer(),{ kind: "INTEGER_WITNESS",values: ["2","1"] },{ reserveCheck: () => { throw new ResearchCoreRefusal("RESOURCE_REFUSED","TOTAL exhausted"); },now: clock })).toThrow("TOTAL exhausted"); expect(clock).not.toHaveBeenCalled();
  });
  it("never admits serialized receipts as closure authority",() => {
    const p = integer(), result = check(p,{ kind: "INTEGER_WITNESS",values: ["2","1"] });
    code(() => result.verifier.projectClosure(p,"exact",JSON.parse(canonicalJson(result.receipt))),"AUTHORITY_REFUSED");
  });
  it("never admits another host factory's receipt",() => {
    const p = integer(), result = check(p,{ kind: "INTEGER_WITNESS",values: ["2","1"] });
    code(() => host().verifier.projectClosure(p,"exact",result.receipt),"AUTHORITY_REFUSED");
  });
  it("rejects closure against another contract or obligation",() => {
    const p = integer(), result = check(p,{ kind: "INTEGER_WITNESS",values: ["2","1"] });
    code(() => result.verifier.projectClosure(make("INTEGER_WITNESS",{ kind: "LINEAR_WITNESS",coefficients: ["2","3"],rhs: "7" },"2"),"exact",result.receipt),"AUTHORITY_REFUSED");
    code(() => result.verifier.projectClosure(p,"unrelated",result.receipt),"ALIGNMENT_REFUSED");
  });
  it("restores only via charged fresh exact verification",() => {
    const p = integer(), result = check(p,{ kind: "INTEGER_WITNESS",values: ["2","1"] }); const restored = prepareProblemContract(canonicalJson(p.contract));
    const again = check(restored,JSON.parse(result.candidate.originalBytes));
    expect(again.reserveCheck).toHaveBeenCalledOnce(); expect(again.receipt.predicateDigest).toBe(result.receipt.predicateDigest); expect(again.closure.status).toBe("CLOSED_EXACT_SCOPE");
  });
  it("records resource timeout as inconclusive with no closure",() => {
    let clock = 0; const result = check(integer(),{ kind: "INTEGER_WITNESS",values: ["2","1"] },{ now: () => clock++ === 0 ? 0 : 1001 });
    expect(result.receipt.result).toBe("INCONCLUSIVE"); expect(result.closure.status).toBe("OPEN");
    expect(result.receipt.elapsedMilliseconds).toBe(1001);
  });
  it("snapshots source authority configuration",() => {
    const mutable = { ...pins }; const h = host({ checkerSourceDigests: mutable }); mutable.INTEGER_WITNESS = sha256("changed");
    const p = integer(), c = admitCandidate(p,"exact",JSON.stringify({ kind: "INTEGER_WITNESS",values: ["2","1"] }));
    expect(h.verifier.verify({ prepared: p,obligationId: "exact",candidate: c,attemptId: "a",inputDigest: p.inputDigest }).checkerSourceDigest).toBe(pin);
  });
  it("projects reviewed applicable method cards from sealed input without runtime scientific switches",() => {
    expect(applicableDomainMethods(integer(),"exact").map(m=>m.id)).toEqual(["LINEAR_SUBSTITUTION","LINEAR_MODULAR_FILTER","LINEAR_COEFFICIENT_BOUND"]);
    expect(applicableDomainMethods(graph(),"exact").map(m=>m.id)).toEqual(["COLOR_GREEDY","COLOR_COMPONENTS","COLOR_BACKTRACK"]);
    expect(applicableDomainMethods(polynomial(),"exact").map(m=>m.id)).toEqual(["COEFFICIENT_CONVOLUTION","COEFFICIENT_DIFFERENCE","COEFFICIENT_FACTORIZATION"]);
    for(const p of [integer(),graph(),polynomial()]) for(const card of applicableDomainMethods(p,"exact")) { expect(Object.isFrozen(card)).toBe(true); expect(card.discriminatingExperiment.length).toBeGreaterThan(20); }
  });
  it("filters method applicability by exact domain kind not acceptance type alone",() => {
    const p=make("FINITE_GRAPH",{kind:"ODD_CYCLE",vertexCount:3,edges:[[0,1],[0,2],[1,2]]});
    expect(applicableDomainMethods(p,"exact").map(m=>m.id)).toEqual(["ODD_CYCLE_BFS","ODD_CYCLE_COMPONENTS","ODD_CYCLE_EDGE_SEARCH"]);
    code(()=>prepareSolverRequest(p,"exact","SOLVER","COLOR_GREEDY"),"UNSUPPORTED");
  });
  it("binds selected applicable method and discriminating experiment into provider projection",() => {
    const p=integer(),request=prepareSolverRequest(p,"exact","SOLVER","LINEAR_MODULAR_FILTER");
    expect(request.selectedMethodId).toBe("LINEAR_MODULAR_FILTER"); expect(request.prompt).toContain(request.discriminatingExperiment);
    code(()=>prepareSolverRequest(p,"exact","SOLVER","MODEL_INSTALLED_METHOD"),"UNSUPPORTED");
  });
});

describe("Research Core v3 exact domain semantics",() => {
  it("checks exact positive integer witness and explicit claim ceiling",() => {
    const result = check(integer(),{ kind: "INTEGER_WITNESS",values: ["2","1"] });
    expect(result.receipt.result).toBe("VERIFIED"); expect(result.receipt.coverage).toEqual({ variables: 2,equations: 1 }); expect(result.closure).toMatchObject({ wholeProblemSolved: false,noveltyEstablished: false,externalAcceptance: "NOT_RUN" });
  });
  it("rejects plausible invalid integer equation witness without refuting existence",() => { const result=check(integer(),{ kind: "INTEGER_WITNESS",values: ["1","1"] }); expect(result.receipt.result).toBe("REJECTED");expect(result.receipt.scientificDisposition).toBe("INVALID_CANDIDATE");expect(result.receipt.refutation).toBeNull(); });
  it("rejects nonpositive, fractional or missing witness values",() => {
    for (const values of [["0","1"],["-1","1"],["1.5","1"],["1"],[]]) code(() => admitCandidate(integer(),"exact",JSON.stringify({ kind: "INTEGER_WITNESS",values })),"SCHEMA_REFUSED");
  });
  it("rejects noncanonical integer formatting",() => {
    for (const rhs of ["01","+1","-0","1e3"," 1"]) code(() => make("INTEGER_WITNESS",{ kind: "LINEAR_WITNESS",coefficients: ["1"],rhs }),"SCHEMA_REFUSED");
  });
  it("bounds integer bits before arithmetic",() => {
    code(() => make("INTEGER_WITNESS",{ kind: "LINEAR_WITNESS",coefficients: ["18446744073709551616"],rhs: "1" }),"RESOURCE_REFUSED");
  });
  it("independently exhausts exact finite box, without universal claim",() => {
    const p = make("INTEGER_WITNESS",{ kind: "FINITE_LINEAR_REFUTATION",coefficients: ["2"],rhs: "3",maxValue: 4 });
    const result = check(p,{ kind: "FINITE_EXHAUSTION",checkedAssignments: 4 }); expect(result.receipt.result).toBe("VERIFIED"); expect(result.receipt.coverage).toEqual({ checkedAssignments: 4,totalAssignments: 4 });
  });
  it("rejects finite refutation when a solution exists",() => {
    const p = make("INTEGER_WITNESS",{ kind: "FINITE_LINEAR_REFUTATION",coefficients: ["2"],rhs: "4",maxValue: 4 }); const result=check(p,{ kind: "FINITE_EXHAUSTION",checkedAssignments: 4 });expect(result.receipt.result).toBe("REJECTED");expect(result.receipt.scientificDisposition).toBe("REFUTED_EXACT_PREDICATE");expect(result.receipt.refutation?.predicate).toEqual(p.contract.obligations[0].predicate);
  });
  it("rejects incomplete claimed finite coverage",() => {
    const p = make("INTEGER_WITNESS",{ kind: "FINITE_LINEAR_REFUTATION",coefficients: ["2"],rhs: "3",maxValue: 4 }); expect(check(p,{ kind: "FINITE_EXHAUSTION",checkedAssignments: 3 }).receipt.result).toBe("REJECTED");
  });
  it("requires explicit finite bound and rejects witness narrowing",() => {
    code(() => make("INTEGER_WITNESS",{ kind: "FINITE_LINEAR_REFUTATION",coefficients: ["2"],rhs: "3" }),"SCHEMA_REFUSED");
    code(() => make("INTEGER_WITNESS",{ kind: "LINEAR_WITNESS",coefficients: ["2"],rhs: "3",maxValue: 4 }),"SCHEMA_REFUSED");
  });
  it("checks graph coloring including isolated vertices and every edge",() => {
    const result = check(graph(),{ kind: "COLORING",colors: [0,1,0,1] }); expect(result.receipt.result).toBe("VERIFIED"); expect(result.receipt.coverage).toEqual({ inputVertices: 4,coveredVertices: 4,checkedEdges: 2 });
  });
  it("rejects coloring with an invalid sealed edge",() => expect(check(graph(),{ kind: "COLORING",colors: [0,0,1,1] }).receipt.result).toBe("REJECTED"));
  it("rejects partial vertex coverage or out-of-bound colors",() => {
    for (const colors of [[0,1,0],[0,1,0,2]]) code(() => admitCandidate(graph(),"exact",JSON.stringify({ kind: "COLORING",colors })),"SCHEMA_REFUSED");
  });
  it("validates all graph input before checking a witness",() => {
    for (const edges of [[[0,4]],[[1,1]],[[1,0]],[[0,1],[0,1]]]) code(() => make("FINITE_GRAPH",{ kind: "ODD_CYCLE",vertexCount: 4,edges }),"SCHEMA_REFUSED");
  });
  it("bounds graph dimensions before checker effects",() => code(() => make("FINITE_GRAPH",{ kind: "COLORING",vertexCount: 65,edges: [],colorCount: 2 }),"SCHEMA_REFUSED"));
  it("checks exact odd-cycle witness and full graph-input coverage",() => {
    const p = make("FINITE_GRAPH",{ kind: "ODD_CYCLE",vertexCount: 5,edges: [[0,1],[0,2],[1,2],[3,4]] });
    const result = check(p,{ kind: "ODD_CYCLE",cycle: [0,1,2] }); expect(result.receipt.result).toBe("VERIFIED"); expect(result.receipt.coverage).toEqual({ inputVertices: 5,validatedEdges: 4,witnessVertices: 3,checkedCycleEdges: 3 });
  });
  it("rejects odd-cycle witness containing a missing edge",() => {
    const p = make("FINITE_GRAPH",{ kind: "ODD_CYCLE",vertexCount: 3,edges: [[0,1],[1,2]] }); expect(check(p,{ kind: "ODD_CYCLE",cycle: [0,1,2] }).receipt.result).toBe("REJECTED");
  });
  it("rejects even or repeated-vertex cycles",() => {
    const p = make("FINITE_GRAPH",{ kind: "ODD_CYCLE",vertexCount: 4,edges: [[0,1],[0,2],[1,2]] });
    for (const cycle of [[0,1,2,3],[0,1,0]]) code(() => admitCandidate(p,"exact",JSON.stringify({ kind: "ODD_CYCLE",cycle })),"SCHEMA_REFUSED");
  });
  it("checks polynomial identities by independent rational convolution",() => {
    const result = check(polynomial(),expanded()); expect(result.receipt.result).toBe("VERIFIED"); expect(result.receipt.coverage).toMatchObject({ checkedDegrees: 3,sampledPoints: 0 });
  });
  it("accepts exact unreduced rational representations losslessly",() => {
    const p = make("POLYNOMIAL_IDENTITY",{ kind: "RATIONAL_IDENTITY",left: { factors: [[r("1","2"),r("1","3")]] },right: { factors: [[r("3","6"),r("2","6")]] } });
    const value = { kind: "IDENTITY_CERTIFICATE",leftCoefficients: [r("2","4"),r("2","6")],rightCoefficients: [r("1","2"),r("1","3")] };
    const result = check(p,value); expect(result.receipt.result).toBe("VERIFIED"); expect(result.candidate.normalized).toEqual(value);
  });
  it("rejects a plausible wrong coefficient despite matching at a sample",() => {
    const value = expanded(); value.rightCoefficients[1] = r("3");const result=check(polynomial(),value);expect(result.receipt.result).toBe("REJECTED");expect(result.receipt.scientificDisposition).toBe("INVALID_CANDIDATE");expect(result.receipt.refutation).toBeNull();
  });
  it("rejects exact coefficient identity claim for unequal sealed sides",() => {
    const p = make("POLYNOMIAL_IDENTITY",{ kind: "RATIONAL_IDENTITY",left: { factors: [[r("0"),r("1")]] },right: { factors: [[r("0")]] } });
    const result=check(p,{ kind: "IDENTITY_CERTIFICATE",leftCoefficients: [r("0"),r("1")],rightCoefficients: [r("0")] });expect(result.receipt.result).toBe("REJECTED");expect(result.receipt.scientificDisposition).toBe("REFUTED_EXACT_PREDICATE");expect(result.receipt.refutation?.predicate).toEqual(p.contract.obligations[0].predicate);
  });
  it("rejects samples instead of coefficient certificate",() => code(() => admitCandidate(polynomial(),"exact",JSON.stringify({ kind: "IDENTITY_CERTIFICATE",samples: [{ x: 0,left: 1,right: 1 }] })),"SCHEMA_REFUSED"));
  it("rejects omitted polynomial side instead of inventing evidence",() => code(() => admitCandidate(polynomial(),"exact",JSON.stringify({ kind: "IDENTITY_CERTIFICATE",leftCoefficients: [r("1")] })),"SCHEMA_REFUSED"));
  it("requires explicit nonzero positive rational denominators",() => {
    for (const denominator of ["0","-1"]) code(() => make("POLYNOMIAL_IDENTITY",{ kind: "RATIONAL_IDENTITY",left: { factors: [[r("1",denominator)]] },right: { factors: [[r("1")]] } }),"SCHEMA_REFUSED");
  });
  it("caps total polynomial degree before convolution allocation",() => {
    const factor = Array.from({ length: 17 },() => r("1")); code(() => make("POLYNOMIAL_IDENTITY",{ kind: "RATIONAL_IDENTITY",left: { factors: [factor,factor,factor] },right: { factors: [[r("1")]] } }),"RESOURCE_REFUSED");
  });
  it("retains intermediate arithmetic exhaustion as inconclusive",() => {
    // Distinct pairwise coprime denominators cause the exact polynomial sum to
    // exceed supported 512-bit intermediates; no numeric sampling fallback.
    const denominators = ["18446744073709551557","18446744073709551533","18446744073709551521","18446744073709551437","18446744073709551427","18446744073709551359","18446744073709551337","18446744073709551293","18446744073709551263","18446744073709551253","18446744073709551191","18446744073709551163"];
    const factors = [denominators.slice(0,4).map(d => r("1",d)),denominators.slice(4,8).map(d => r("1",d)),denominators.slice(8).map(d => r("1",d))];
    const p = make("POLYNOMIAL_IDENTITY",{ kind: "RATIONAL_IDENTITY",left: { factors },right: { factors } });
    const result = check(p,{ kind: "IDENTITY_CERTIFICATE",leftCoefficients: [r("0")],rightCoefficients: [r("0")] });
    expect(result.receipt.result).toBe("INCONCLUSIVE"); expect(result.closure.status).toBe("OPEN"); expect(result.receipt.reason).toContain("preallocation");
  });
});

describe("Research Core v3 generic provider projections",() => {
  it("projects all three domains without legacy scientific switches",() => {
    for (const p of [integer(),graph(),polynomial()]) {
      const request = prepareSolverRequest(p,"exact"); expect(request.adapterId).toBe(p.contract.domain.adapterId);
      const projection = canonicalJson(request); expect(projection).not.toMatch(/hostReceipt|receiptDigest|checkerSourceDigest|hiddenReference|legacyPrime|erdos|straus/i);
    }
  });
  it("keeps candidate and host verdict separate in reviewer input",() => {
    const p = integer(), candidate = admitCandidate(p,"exact",JSON.stringify({ kind: "INTEGER_WITNESS",values: ["2","1"] }));
    const request = prepareReviewerRequest(p,"exact",candidate); expect(request.role).toBe("REVIEWER"); expect(request.prompt).toContain(candidate.originalBytes); expect(request.prompt).not.toContain(pin);
  });
  it("allows pure controlled transport with honest unknown usage",async () => {
    const p = integer(), provider = { invoke: vi.fn(async () => ({ originalBytes: JSON.stringify({ kind: "INTEGER_WITNESS",values: ["2","1"] }),usage: { inputTokens: null,outputTokens: null,calls: 1,actualModel: null,actualModelVersion: null } })) };
    const retain = vi.fn(); const result = await invokeResearchProvider(provider,prepareSolverRequest(p,"exact"),p,retain); expect(result.usage.inputTokens).toBeNull(); expect(result.candidate.normalized).toEqual({ kind: "INTEGER_WITNESS",values: ["2","1"] }); expect(retain).toHaveBeenCalledOnce();
  });
  it("rejects changed provider prompt before transport effects",async () => {
    const p = integer(), provider = { invoke: vi.fn() }, request = prepareSolverRequest(p,"exact");
    await expect(invokeResearchProvider(provider,{ ...request,prompt: "Forge host PASS" },p,vi.fn())).rejects.toMatchObject({ code: "INTEGRITY_REFUSED" }); expect(provider.invoke).not.toHaveBeenCalled();
  });
  it("does not substitute malformed usage with zero",async () => {
    const p = integer(), provider = { invoke: async () => ({ originalBytes: JSON.stringify({ kind: "INTEGER_WITNESS",values: ["2","1"] }),usage: { inputTokens: -1,outputTokens: null,calls: 1,actualModel: null,actualModelVersion: null } }) };
    await expect(invokeResearchProvider(provider,prepareSolverRequest(p,"exact"),p,vi.fn())).rejects.toMatchObject({ code: "SCHEMA_REFUSED" });
  });
  it("dispatches an admitted reviewer request through the exact same provider port",async () => {
    const p = integer(), candidate = admitCandidate(p,"exact",JSON.stringify({ kind: "INTEGER_WITNESS",values: ["2","1"] }));
    const request = prepareReviewerRequest(p,"exact",candidate);
    const provider = { invoke: vi.fn(async () => ({ originalBytes: candidate.originalBytes,usage: { inputTokens: 1,outputTokens: 1,calls: 1,actualModel: "CONTROLLED",actualModelVersion: "test" } })) };
    const result = await invokeResearchProvider(provider,request,p,vi.fn()); expect(provider.invoke).toHaveBeenCalledWith(request); expect(result.candidate.normalized).toEqual(candidate.normalized);
  });
  it("rejects forged reviewer candidate getters before access",() => {
    let accesses = 0;
    const forged = { get originalBytes() { accesses++; return " ".repeat(1000000); } };
    code(() => prepareReviewerRequest(integer(),"exact",forged as never),"AUTHORITY_REFUSED"); expect(accesses).toBe(0);
  });
  it("rejects forged request getters before provider effects",async () => {
    let accesses = 0; const provider = { invoke: vi.fn() }, forged = { get obligationId() { accesses++; return "exact"; } };
    await expect(invokeResearchProvider(provider,forged as never,integer(),vi.fn())).rejects.toMatchObject({ code: "INTEGRITY_REFUSED" }); expect(accesses).toBe(0); expect(provider.invoke).not.toHaveBeenCalled();
  });
  it("retains malformed bounded provider candidate before admission failure",async () => {
    const p = integer(), bytes = '{"kind":"INTEGER_WITNESS","status":"PASS"}';
    const provider = { invoke: async () => ({ originalBytes: bytes,usage: { inputTokens: null,outputTokens: null,calls: 1,actualModel: null,actualModelVersion: null } }) }, retain = vi.fn();
    await expect(invokeResearchProvider(provider,prepareSolverRequest(p,"exact"),p,retain)).rejects.toMatchObject({ code: "SCHEMA_REFUSED" }); expect(retain.mock.calls[0][0]).toBe(bytes);
  });
  it("requires retention before dispatch",async () => {
    const p = integer(), provider = { invoke: vi.fn() };
    await expect(invokeResearchProvider(provider,prepareSolverRequest(p,"exact"),p,undefined as never)).rejects.toMatchObject({ code: "AUTHORITY_REFUSED" }); expect(provider.invoke).not.toHaveBeenCalled();
  });
});
