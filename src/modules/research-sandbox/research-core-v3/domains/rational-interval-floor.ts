import { performance } from "node:perf_hooks";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { boundedJson, exactInteger, frozen, refuse } from "../bounded-json";
import { createCheckBudget } from "../check-budget";
import type { CheckBudget, DomainAdapter, DomainLimits, Json } from "../types";

type Encoded = { numerator: string; denominator: string };
type Rational = { n: bigint; d: bigint };
type Expression = ({ op: "Q" } & Encoded) | { op: "ADD" | "SUB" | "MUL" | "DIV"; left: Expression; right: Expression };
type Input = { kind: "RATIONAL_EXPRESSION"; expression: Expression };
type Candidate = { kind: "INTERVAL_FLOOR_CERTIFICATE"; inputDigest: string; lower: Encoded; upper: Encoded; floor: string };
const limits: DomainLimits = frozen({ maxInputBytes: 16384, maxCandidateBytes: 4096, maxArrayLength: 32,
  maxIntegerBits: 64, maxIntermediateBits: 256, maxOperations: 32768, maxCheckMilliseconds: 1000,
  maxDimensions: { expressionNodes: 31, expressionDepth: 6, rationalOperands: 32 } });
const bits = (v: bigint) => (v < BigInt(0) ? -v : v).toString(2).length;
function object(v: Json, keys: readonly string[]): Record<string, Json> {
  if (!v || typeof v !== "object" || Array.isArray(v) || Object.keys(v).length !== keys.length || keys.some(k => !Object.hasOwn(v,k))) refuse("SCHEMA_REFUSED", "Exact rational schema keys required");
  return v as Record<string, Json>;
}
function integer(v: Json): bigint {
  if (typeof v !== "string") refuse("SCHEMA_REFUSED", "Exact integer text required");
  return exactInteger(v,limits.maxIntegerBits);
}
function gcd(n: bigint, d: bigint, budget?: CheckBudget): bigint {
  let a = n < BigInt(0) ? -n : n, b = d;
  // Intake operands are already at most64bits; checking at most128 Euclidean
  // steps is a finite intake-work cap, separate from charged host verification.
  let steps = 0;
  while (b !== BigInt(0)) {
    if (++steps > (budget ? 512 : 128)) refuse("RESOURCE_REFUSED", "Rational reduction work bound");
    budget?.tick(); const next = a % b; a = b; b = next;
  }
  return a;
}
function rational(raw: Json): Rational {
  const v = object(raw,["numerator","denominator"]), n = integer(v.numerator), d = integer(v.denominator);
  if (d <= BigInt(0) || gcd(n,d) !== BigInt(1)) refuse("SCHEMA_REFUSED", "Canonical reduced rational with positive denominator required");
  return { n,d };
}
function multiply(a: bigint, b: bigint, budget: CheckBudget): bigint {
  budget.tick();
  if (a !== BigInt(0) && b !== BigInt(0) && bits(a)+bits(b) > limits.maxIntermediateBits) refuse("RESOURCE_REFUSED", "Rational product preallocation bound");
  return budget.integer(a*b);
}
function add(a: bigint, b: bigint, budget: CheckBudget): bigint {
  budget.tick();
  if (Math.max(bits(a),bits(b))+1 > limits.maxIntermediateBits) refuse("RESOURCE_REFUSED", "Rational sum preallocation bound");
  return budget.integer(a+b);
}
function reduce(n: bigint,d: bigint,budget: CheckBudget): Rational {
  budget.integer(n); budget.integer(d);
  if (d === BigInt(0)) refuse("SCHEMA_REFUSED", "Division by zero in sealed expression");
  if (d < BigInt(0)) { n = -n; d = -d; }
  const divisor = gcd(n,d,budget);
  return { n: budget.integer(n/divisor),d: budget.integer(d/divisor) };
}
function compare(a: Rational,b: Rational,budget: CheckBudget): number {
  const left = multiply(a.n,b.d,budget), right = multiply(b.n,a.d,budget);
  return left < right ? -1 : left > right ? 1 : 0;
}
function floor(a: Rational,budget: CheckBudget): bigint {
  budget.tick(); const q = a.n/a.d, r = a.n%a.d;
  return budget.integer(r < BigInt(0) ? q-BigInt(1) : q);
}
function shape(raw: Json): { expression: Expression; nodes: number } {
  const input = object(raw,["kind","expression"]);
  if (input.kind !== "RATIONAL_EXPRESSION") refuse("SCHEMA_REFUSED", "Unsupported rational expression kind");
  const pending = [{ raw: input.expression,depth: 1 }]; let nodes = 0;
  while (pending.length) {
    const item = pending.pop()!;
    if (++nodes > limits.maxDimensions.expressionNodes || item.depth > limits.maxDimensions.expressionDepth) refuse("RESOURCE_REFUSED", "Expression node/depth bound");
    if (!item.raw || typeof item.raw !== "object" || Array.isArray(item.raw)) refuse("SCHEMA_REFUSED", "Expression node object required");
    const node = item.raw as Record<string, Json>;
    if (node.op === "Q") { const v = object(node,["op","numerator","denominator"]); rational({ numerator: v.numerator,denominator: v.denominator }); }
    else {
      const v = object(node,["op","left","right"]);
      if (typeof v.op !== "string" || !["ADD","SUB","MUL","DIV"].includes(v.op)) refuse("SCHEMA_REFUSED", "Unsupported rational operator");
      pending.push({raw:v.right,depth:item.depth+1},{raw:v.left,depth:item.depth+1});
    }
  }
  return { expression: input.expression as unknown as Expression,nodes };
}
function evaluate(e: Expression,budget: CheckBudget): Rational {
  budget.tick();
  if (e.op === "Q") { const r = rational({numerator:e.numerator,denominator:e.denominator}); budget.integer(r.n); budget.integer(r.d); return r; }
  const a = evaluate(e.left,budget), b = evaluate(e.right,budget);
  if (e.op === "MUL") return reduce(multiply(a.n,b.n,budget),multiply(a.d,b.d,budget),budget);
  if (e.op === "DIV") {
    if (b.n === BigInt(0)) refuse("SCHEMA_REFUSED", "Division by zero in sealed expression");
    return reduce(multiply(a.n,b.d,budget),multiply(a.d,b.n,budget),budget);
  }
  const left = multiply(a.n,b.d,budget), right = multiply(b.n,a.d,budget);
  return reduce(add(left,e.op === "SUB" ? -right : right,budget),multiply(a.d,b.d,budget),budget);
}
const encodedSchema: Json = { type:"object",additionalProperties:false,required:["numerator","denominator"],properties:{numerator:{type:"string",maxLength:22},denominator:{type:"string",maxLength:22}} };
const methodCards = frozen([
  { id:"EXACT_RATIONAL_ENCLOSURE",acceptanceTypes:["INTERVAL_ENCLOSURE" as const],discriminatingExperiment:"Derive the sealed AST exactly; test both enclosure inequalities and integer floor bounds.",material:"Return a reduced enclosure within one integer cell plus a floor certificate; endpoint agreement alone is not evidence." },
  { id:"RATIONAL_BOUNDARY_REFINEMENT",acceptanceTypes:["INTERVAL_ENCLOSURE" as const],discriminatingExperiment:"Find whether the retained enclosure crosses an integer boundary; submit a new explicit narrower certificate if needed.",material:"A straddling certificate remains inconclusive. Do not silently alter its endpoints or replace the sealed AST." },
]);
export const rationalIntervalFloorAdapter: DomainAdapter = frozen<DomainAdapter>({
  id:"RATIONAL_INTERVAL_FLOOR",version:1,checkerSourceDigest:sha256("RESEARCH_CORE_V3:SEALED_RATIONAL_AST_INTERVAL_FLOOR:1"),limits,
  capabilities:["INTERVAL_ENCLOSURE"],methodCards,applicableMethods(){return methodCards;},
  methodMaterial:"For the exact sealed rational AST return inputDigest, canonical reduced lower/upper endpoints and integer floor. The host independently evaluates the AST and checks enclosure and floor inequalities. No decimals, executable code, samples or global theorem claims. A boundary-straddling enclosure cannot close the floor obligation.",
  inputSchema:{type:"object",additionalProperties:false,required:["kind","expression"],properties:{kind:{const:"RATIONAL_EXPRESSION"},expression:{$ref:"#/$defs/expression"}},$defs:{expression:{oneOf:[{type:"object",additionalProperties:false,required:["op","numerator","denominator"],properties:{op:{const:"Q"},numerator:{type:"string",maxLength:22},denominator:{type:"string",maxLength:22}}},{type:"object",additionalProperties:false,required:["op","left","right"],properties:{op:{enum:["ADD","SUB","MUL","DIV"]},left:{$ref:"#/$defs/expression"},right:{$ref:"#/$defs/expression"}}}]}}},
  candidateSchema:{type:"object",additionalProperties:false,required:["kind","inputDigest","lower","upper","floor"],properties:{kind:{const:"INTERVAL_FLOOR_CERTIFICATE"},inputDigest:{type:"string",pattern:"^[a-f0-9]{64}$"},lower:encodedSchema,upper:encodedSchema,floor:{type:"string",maxLength:22}}},
  parseInput(raw) {
    const input = boundedJson(raw,limits.maxInputBytes,limits.maxArrayLength), {expression} = shape(input);
    // This bounded admission derives well-definedness (including composite
    // division-by-zero), not a candidate or a closure authority.
    evaluate(expression,createCheckBudget(limits,()=>performance.now()).budget);
    return input;
  },
  alignment(input) { return {definitions:[{id:"sealed-rational-expression",statement:`Evaluate only the sealed rational AST with exact arithmetic: ${canonicalJson(input)}`},{id:"floor-certificate",statement:"A submitted enclosure must contain the exact sealed value, lie within one floor cell, and certify f <= value < f+1."}],quantifiers:[{kind:"EXISTS",variable:"f",domain:"Z"}],assumptions:[{id:"well-defined-rationals",statement:"All constants are canonical reduced rationals with positive denominators; every sealed division has nonzero divisor, checked at bounded intake.",status:"ESTABLISHED"}],predicate:{kind:"SEALED_RATIONAL_INTERVAL_FLOOR",input},acceptanceType:"INTERVAL_ENCLOSURE"}; },
  parseCandidate(raw) {
    const candidate = boundedJson(raw,limits.maxCandidateBytes,limits.maxArrayLength), v = object(candidate,["kind","inputDigest","lower","upper","floor"]);
    if (v.kind !== "INTERVAL_FLOOR_CERTIFICATE" || typeof v.inputDigest !== "string" || !/^[a-f0-9]{64}$/.test(v.inputDigest)) refuse("SCHEMA_REFUSED", "Exact certificate kind/input digest required");
    const lower = rational(v.lower), upper = rational(v.upper); integer(v.floor);
    if (compare(lower,upper,createCheckBudget(limits,()=>performance.now()).budget) > 0) refuse("SCHEMA_REFUSED", "Reversed enclosure endpoints");
    return candidate;
  },
  check(raw,candidate,budget) {
    const input = raw as unknown as Input, claim = candidate as unknown as Candidate;
    const {expression,nodes} = shape(raw), value = evaluate(expression,budget), lower = rational(claim.lower), upper = rational(claim.upper), f = exactInteger(claim.floor,limits.maxIntegerBits);
    const inputMatches = claim.inputDigest === sha256(canonicalJson(input));
    const enclosed = compare(lower,value,budget) <= 0 && compare(value,upper,budget) <= 0;
    // Check the claimed integer cell against the independently derived value,
    // not against two model-authored endpoints alone.
    const validFloor = multiply(f,value.d,budget) <= value.n && value.n < multiply(add(f,BigInt(1),budget),value.d,budget);
    const sameCell = floor(lower,budget) === f && floor(upper,budget) === f;
    const invalid = !inputMatches || !enclosed || !validFloor;
    return {result:invalid?"REJECTED":sameCell?"VERIFIED":"INCONCLUSIVE",scientificDisposition:invalid?"INVALID_CANDIDATE":sameCell?"VERIFIED_EXACT_SCOPE":"INCONCLUSIVE",refutation:null,
      reason:invalid?"Input binding, independently derived enclosure, or floor inequality failed":sameCell?"Independent sealed rational derivation, enclosure and floor certificate verified":"Valid enclosure crosses a floor boundary; missing narrower submitted certificate",
      checkedScope:{predicate:rationalIntervalFloorAdapter.alignment(raw).predicate,expressionDigest:sha256(canonicalJson(input.expression)),arithmetic:"EXACT_Q",certificate:"SUBMITTED_INTERVAL_AND_FLOOR_ONLY"},
      coverage:{expressionNodes:nodes,sampledPoints:0,enclosureChecked:true,floorInequalitiesChecked:true,submittedSingleCell:sameCell}};
  },
});
