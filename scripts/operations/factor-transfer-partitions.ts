import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";

/** Fixed, inert-import development experiment. No caller-selected graph inputs. */
export const FACTOR_TRANSFER_INPUTS = Object.freeze({
  seeds: Object.freeze([[200023321,31],[200023321,71],[200023321,79],[200602081,23],[200602081,43],[200602081,67],[200602081,83],[200656681,43],[200656681,71],[200656681,103],[131433121,11],[131433121,19],[131433121,31]].map(([p,h]) => Object.freeze({p:String(p),h:String(h)}))),
  maxDepth: "2", seedContentDigest: "a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c",
});
export const FACTOR_TRANSFER_LIMITS = Object.freeze({ seconds:60,maxNodes:256,maxRecords:1000,maxStateInsertions:2000000,maxWorkSteps:50000000,maxOutputBytes:2097152 });
export const FACTOR_TRANSFER_SCOPE = "Thirteen selected exposed negative-character miss seeds; all QNR factors, canonical first-discovery BFS through depth2. Exact finite node images, transfers, blockers, revisits, frontier and progress refutations are development evidence, not an unbounded termination proof, held-out benchmark, root solution or novelty certificate. No agent-cycle authority.";
const B=BigInt,one=B(1),four=B(4);
export type TransferFactors=Array<[string,string]>;
export type TransferCanonical={u:string;v:string;k:string;A:string;x:string;y:string;z:string};
export type TransferTerm={residue:number;exponent:number};
export type TransferDefect={stabilizer:string[];size:string;index:string;visibleMass:string;nonresidue:boolean;
  visibleFactors:Array<{prime:string;exponent:string;residue:string;quotientOrder:string}>;
  conditions:{indexEven:boolean;indexTwoModFour:boolean;nonresidueIndexAtLeastSix:boolean;visibleMassBound:boolean;ordersBeyondIntervals:boolean}};
export type TransferFactor={q:string;exponent:string;residue:string;legendre:"-1";eligible:boolean;blocker:"NONINTEGRAL_SHIFT"|null};
export type TransferNode={id:string;depth:string;p:string;h:string;T:string;factors:TransferFactors;image:string[];count:string;hit:boolean;canonical:TransferCanonical|null;
  character:{legendre:"-1"|"+1";preferred:boolean};defect:TransferDefect|null;qnrFactors:TransferFactor[];imageDigest:string;witnessDigest:string|null;defectDigest:string|null;nodeDigest:string};
export type TransferEdge={id:string;kind:"EDGE";from:string;to:string;q:string;exponent:string;requestedDepth:string;disposition:"DISCOVERED"|"REVISIT"|"DEPTH_LIMIT";targetComputed:boolean;toDepth:string|null;recordDigest:string};
export type TransferBlocker={id:string;kind:"BLOCKER";from:string;q:string;exponent:string;residue:string;reason:"NONINTEGRAL_SHIFT";recordDigest:string};
export type TransferRecord=TransferEdge|TransferBlocker;
type RawRecord=(Omit<TransferEdge,"recordDigest">|Omit<TransferBlocker,"recordDigest">);
export function transferCanonicalJson(value:unknown):string {
  if(Array.isArray(value))return `[${value.map(transferCanonicalJson).join(",")}]`;
  if(value!==null&&typeof value==="object")return `{${Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>`${JSON.stringify(k)}:${transferCanonicalJson(v)}`).join(",")}}`;
  return JSON.stringify(value);
}
export const transferDigest=(value:unknown)=>createHash("sha256").update(transferCanonicalJson(value)).digest("hex");
const gcd = (a: bigint, b: bigint): bigint => { while (b) [a, b] = [b, a % b]; return a; };
const cmp = (a: bigint, b: bigint) => a < b ? -1 : a > b ? 1 : 0;
function bounded(n: unknown, max: number): n is number { return typeof n === "number" && Number.isSafeInteger(n) && n >= 1 && n <= max; }
function prime(n: number, tick: () => void = () => {}) {
  if (!bounded(n, 201_000_000) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) { if (d % 255 === 0) tick(); if (n % d === 0) return false; }
  return true;
}
function groupPrime(h: number) { if (!bounded(h, 201_000_000) || !prime(h) || h % 4 !== 3) throw new RangeError("Requires bounded prime h=3 mod4"); }
function mul(a: number, b: number, h: number, run?: Budget) { run?.work(); return Number(B(a) * B(b) % B(h)); }
function pow(a: number, e: number, h: number, run?: Budget) { let r = 1; for (; e; e = Math.floor(e / 2), a = mul(a, a, h, run)) if (e % 2) r = mul(r, a, h, run); return r; }
type StopReason = "TIME_LIMIT" | "NODE_LIMIT" | "RECORD_LIMIT" | "STATE_LIMIT" | "WORK_LIMIT" | "OUTPUT_LIMIT";
class RunStop extends Error { constructor(readonly reason: StopReason) { super(reason); } }
export type TransferRunOptions = { now?: () => number; seconds?: number; maxNodes?: number; maxRecords?: number; maxStateInsertions?: number; maxWorkSteps?: number; maxOutputBytes?: number };
function budget(options: TransferRunOptions = {}) {
  const { now = () => performance.now(), ...lowered } = options, limits = { ...FACTOR_TRANSFER_LIMITS, ...lowered };
  for (const key of Object.keys(FACTOR_TRANSFER_LIMITS) as Array<keyof typeof FACTOR_TRANSFER_LIMITS>) {
    if (!Number.isFinite(limits[key]) || limits[key] <= 0 || limits[key] > FACTOR_TRANSFER_LIMITS[key] || (key !== "seconds" && !Number.isSafeInteger(limits[key]))) throw new RangeError("Only tighter frozen resource caps");
  }
  if (limits.maxOutputBytes < 8192) throw new RangeError("Output cap must fit bounded partial provenance");
  const start = now(); let states = 0, steps = 0;
  const tick = () => { if (now() - start >= limits.seconds * 1000) throw new RunStop("TIME_LIMIT"); };
  const insert = () => { tick(); if (states >= limits.maxStateInsertions) throw new RunStop("STATE_LIMIT"); states++; };
  const work = () => { tick(); if (steps >= limits.maxWorkSteps) throw new RunStop("WORK_LIMIT"); steps++; };
  return { limits, tick, insert, work, stateCount: () => states, workCount: () => steps, elapsed: () => Math.max(0, Math.round(now() - start)) };
}
type Budget = ReturnType<typeof budget>;
export function validateTransferFactors(raw: unknown, expected: bigint): asserts raw is TransferFactors {
  if (!Array.isArray(raw) || raw.length > 16 || typeof expected !== "bigint" || expected < one || expected > B(100_500_000)) throw new RangeError("Bounded exact factor packet");
  let product = one, previous = 1;
  for (const entry of raw) {
    if (!Array.isArray(entry) || entry.length !== 2 || !entry.every((v) => typeof v === "string" && /^[1-9][0-9]{0,8}$/.test(v))) throw new RangeError("Decimal factor records");
    const [q, e] = entry.map(Number);
    if (!prime(q) || q <= previous || !bounded(e, 26)) throw new RangeError("Distinct sorted primes and bounded valuations");
    previous = q; product *= B(q) ** B(e); if (product > expected) throw new RangeError("Factor product exceeds target");
  }
  if (product !== expected) throw new RangeError("Factor product mismatch");
}
function factor(n: number, run: Budget): TransferFactors {
  if (!bounded(n, 100_500_000)) throw new RangeError("Frozen factor domain");
  let left = n; const factors: TransferFactors = [];
  for (let q = 2; q * q <= left; q += q === 2 ? 1 : 2) {
    run.work(); if (left % q) continue;
    let e = 0; while (left % q === 0) { left /= q; e++; } factors.push([String(q), String(e)]);
  }
  if (left > 1) factors.push([String(left), "1"]); validateTransferFactors(factors, B(n)); return factors;
}
function validateTerms(h: number, terms: readonly TransferTerm[]) {
  groupPrime(h);
  if (!Array.isArray(terms) || terms.length > 32 || terms.some((t) => !bounded(t.residue, h - 1) || !bounded(t.exponent, 64))) throw new RangeError("Bounded nonzero residue/valuation terms");
}
function imageTerms(h: number, terms: readonly TransferTerm[], run: Budget) {
  validateTerms(h, terms); let states = new Set([1]); run.insert();
  for (const { residue: r, exponent: e } of terms) {
    const choices = Array.from({ length: 2 * e + 1 }, (_, i) => pow(i < e ? pow(r, h - 2, h, run) : r, Math.abs(i - e), h, run)), next = new Set<number>();
    for (const s of states) for (const c of choices) { run.tick(); const value = mul(s, c, h, run); if (!next.has(value)) { run.insert(); next.add(value); } }
    states = next;
  }
  return [...states].sort((a, b) => a - b);
}
export function transferSignedImage(h: number, terms: readonly TransferTerm[]) { return imageTerms(h, terms, budget()); }
function quotientOrder(residue: number, h: number, subgroup: ReadonlySet<number>, divisors: readonly number[], run: Budget) {
  let order = h - 1;
  for (const q of divisors) while (order % q === 0 && subgroup.has(pow(residue, order / q, h, run))) order /= q;
  return order;
}
function distinctPrimeDivisors(n: number, run: Budget) { const result: number[] = []; let left = n;
  for (let q = 2; q * q <= left; q += q === 2 ? 1 : 2) { run.work(); if (left % q) continue; result.push(q); while (left % q === 0) left /= q; }
  if (left > 1) result.push(left); return result;
}
function defect(h: number, terms: readonly TransferTerm[], image: readonly number[], primes: readonly string[], run: Budget): TransferDefect | null {
  if (image.includes(h - 1)) return null;
  const set = new Set(image), H: number[] = [];
  // 1 in S implies Stab(S) is contained in S: never scan all h residues.
  for (const r of image) { run.work(); if (image.every((s) => set.has(mul(s, r, h, run)))) H.push(r); }
  const index = (h - 1) / H.length, subgroup = new Set(H), divisors = distinctPrimeDivisors(h - 1, run);
  const visibleFactors = terms.flatMap(({ residue, exponent }, i) => subgroup.has(residue) ? [] :
    [{ prime: primes[i], exponent: String(exponent), residue: String(residue), quotientOrder: String(quotientOrder(residue, h, subgroup, divisors, run)) }]);
  const V = visibleFactors.reduce((sum, f) => sum + Number(f.exponent), 0), nonresidue = terms.some((t) => pow(t.residue, (h - 1) / 2, h, run) === h - 1);
  return { stabilizer: H.map(String), size: String(H.length), index: String(index), visibleMass: String(V), nonresidue, visibleFactors,
    conditions: { indexEven: index % 2 === 0, indexTwoModFour: index % 4 === 2, nonresidueIndexAtLeastSix: !nonresidue || index >= 6,
      visibleMassBound: 2 * V <= index - 2, ordersBeyondIntervals: visibleFactors.every((f) => Number(f.quotientOrder) > 2 * Number(f.exponent) + 1) } };
}
/** Abstract group helper: validates the supplied complete image, not just a subgroup. */
export function transferGroupDefect(h: number, terms: readonly TransferTerm[], image?: readonly number[]) {
  const run = budget(), expected = imageTerms(h, terms, run);
  if (image && (!Array.isArray(image) || image.length > h - 1 || transferCanonicalJson(image) !== transferCanonicalJson(expected))) throw new RangeError("Exact complete signed image binding");
  return defect(h, terms, expected, terms.map((t) => String(t.residue)), run);
}
/** Ordered numeric-lex DP: never sort an intermediate pair and invert its ratio. */
function factorImage(h: number, factors: TransferFactors, run: Budget) {
  let states = new Map<number, { u: bigint; v: bigint }>([[1, { u: one, v: one }]]); run.insert();
  for (const [qText, eText] of factors) {
    const q = B(qText), r = Number(q % B(h)), e = Number(eText), next = new Map<number, { u: bigint; v: bigint }>();
    if (!r) throw new RangeError("Factored integer not coprime to shift");
    const choices = Array.from({ length: 2 * e + 1 }, (_, i) => { const z = i - e, power = q ** B(Math.abs(z));
      return { residue: pow(z < 0 ? pow(r, h - 2, h, run) : r, Math.abs(z), h, run), u: z > 0 ? power : one, v: z < 0 ? power : one }; });
    for (const [residue, pair] of states) for (const choice of choices) {
      run.tick(); const target = mul(residue, choice.residue, h, run), candidate = { u: pair.u * choice.u, v: pair.v * choice.v }, previous = next.get(target);
      if (!previous) { run.insert(); next.set(target, candidate); }
      else if (candidate.u < previous.u || candidate.u === previous.u && candidate.v < previous.v) next.set(target, candidate);
    }
    states = next;
  }
  return { image: [...states.keys()].sort((a, b) => a - b), pair: states.get(h - 1) ?? null };
}
export function reconstructTransferWitness(p: bigint, h: bigint, T: bigint, u: bigint, v: bigint): TransferCanonical {
  if (![p, h, T, u, v].every((n) => typeof n === "bigint" && n > B(0) && n.toString().length <= 10) || p > B(201_000_000) ||
    !prime(Number(p)) || p % B(840) !== one || p <= h || !FACTOR_TRANSFER_INPUTS.seeds.some((s) => s.p === String(p)) || !prime(Number(h)) || h % B(4) !== B(3) ||
    (p + h) % four || four * T !== p + h || gcd(T, h) !== one || u > v || gcd(u, v) !== one || T % (u * v) || (u + v) % h) throw new RangeError("Exact residual shifted Type-II witness binding");
  const A = (u + v) / h, k = T / (u * v), ds = [T, A * p * u * k, A * p * v * k].sort(cmp);
  if (!(ds[0] < ds[1] && ds[1] < ds[2]) || ds.filter((d) => d % p === B(0)).length !== 2 ||
    four * ds[0] * ds[1] * ds[2] !== p * (ds[0] * ds[1] + ds[1] * ds[2] + ds[2] * ds[0])) throw new Error("Strict Type-II identity failure");
  return { u: String(u), v: String(v), k: String(k), A: String(A), x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) };
}

export function factorTransferCandidates(p:number,h:number,factors:TransferFactors):TransferFactor[] {
  groupPrime(h);
  if(!FACTOR_TRANSFER_INPUTS.seeds.some(s=>s.p===String(p))||!prime(p)||h>=p||(p+h)%4)throw new RangeError("Fixed-target transfer arithmetic");
  validateTransferFactors(factors,B((p+h)/4));
  return factors.flatMap(([q,e])=>{const residue=Number(B(q)%B(h));
    if(pow(residue,(h-1)/2,h)!==h-1)return [];
    const eligible=Number(q)%4===3;
    return [{q,exponent:e,residue:String(residue),legendre:"-1" as const,eligible,blocker:eligible?null:"NONINTEGRAL_SHIFT" as const}];
  });
}
export class TransferCandidateContradictionError extends Error {
  readonly node:TransferNode;
  constructor(node:TransferNode){super("Transfer/defect candidate disagrees with exact node");
    if(Buffer.byteLength(JSON.stringify(node),"utf8")>65536)throw new RangeError("Bounded contradiction diagnostic");this.node=structuredClone(node);}
}
export function assertTransferCandidate(node:TransferNode){
  if(!node.character.preferred||(!node.hit&&(!node.defect||Object.values(node.defect.conditions).some(v=>!v)))||node.hit&&node.defect!==null)throw new TransferCandidateContradictionError(node);
}
function node(p:number,h:number,depth:number,run:Budget):TransferNode{
  if(!FACTOR_TRANSFER_INPUTS.seeds.some(s=>s.p===String(p))||!prime(p,run.tick)||h>=p||h<3||!prime(h,run.tick)||h%4!==3||(p+h)%4||!Number.isInteger(depth)||depth<0||depth>2)throw new RangeError("Admitted fixed-target node domain");
  const T=(p+h)/4,factors=factor(T,run),result=factorImage(h,factors,run),terms=factors.map(([q,e])=>({residue:Number(B(q)%B(h)),exponent:Number(e)}));
  const canonical=result.pair?reconstructTransferWitness(B(p),B(h),B(T),result.pair.u,result.pair.v):null;
  const certificate=defect(h,terms,result.image,factors.map(([q])=>q),run),preferred=pow(p%h,(h-1)/2,h,run)===h-1;
  const qnrFactors=factors.flatMap(([q,e])=>{const residue=Number(B(q)%B(h));if(pow(residue,(h-1)/2,h,run)!==h-1)return [];
    const eligible=Number(q)%4===3;return [{q,exponent:e,residue:String(residue),legendre:"-1" as const,eligible,blocker:eligible?null:"NONINTEGRAL_SHIFT" as const}];});
  const image=result.image.map(String),body={id:`${p}:${h}`,depth:String(depth),p:String(p),h:String(h),T:String(T),factors,image,count:String(image.length),hit:canonical!==null,canonical,
    character:{legendre:preferred?"-1" as const:"+1" as const,preferred},defect:certificate,qnrFactors,imageDigest:transferDigest(image),witnessDigest:canonical?transferDigest(canonical):null,defectDigest:certificate?transferDigest(certificate):null};
  const n={...body,nodeDigest:transferDigest(body)};assertTransferCandidate(n);return n;
}
export function deriveTransferGraph(nodes:readonly TransferNode[],records:readonly TransferRecord[],complete:boolean){
  const byId=new Map(nodes.map(n=>[n.id,n])),adj=new Map(nodes.map(n=>[n.id,[] as TransferEdge[]]));
  for(const r of records)if(r.kind==="EDGE"&&r.targetComputed&&byId.has(r.from)&&byId.has(r.to))adj.get(r.from)!.push(r);
  const frontier=records.flatMap(r=>r.kind==="EDGE"&&r.disposition==="DEPTH_LIMIT"?[{recordId:r.id,from:r.from,to:r.to,reason:"DEPTH_LIMIT" as const}]:[]);
  const reachability=FACTOR_TRANSFER_INPUTS.seeds.map(s=>{
    const seed=`${s.p}:${s.h}`,queue=byId.has(seed)?[[seed]]:[],seen=new Set(queue.length?[seed]:[]),reachableHitIds:string[]=[];
    let firstHitPath:string[]|null=null;
    for(let i=0;i<queue.length;i++){const path=queue[i],id=path[path.length-1];if(byId.get(id)!.hit){reachableHitIds.push(id);firstHitPath??=path;}
      if(path.length<3)for(const e of adj.get(id)??[])if(!seen.has(e.to)){seen.add(e.to);queue.push([...path,e.to]);}}
    return {seed,complete,reachableHitIds,firstHitPath,frontierRecordIds:frontier.filter(f=>seen.has(f.from)).map(f=>f.recordId),status:reachableHitIds.length?"HIT_REACHABLE" as const:"NO_HIT_IN_COMPUTED_GRAPH" as const};
  });
  const cycles:Array<{nodeIds:string[];recordIds:string[];cycleDigest:string}>=[],color=new Map<string,number>(),stack:string[]=[],incoming:string[]=[];
  const visit=(id:string)=>{color.set(id,1);stack.push(id);
    for(const e of adj.get(id)??[]){const c=color.get(e.to)??0;if(c===0){incoming.push(e.id);visit(e.to);incoming.pop();}
      else if(c===1){const at=stack.indexOf(e.to),body={nodeIds:[...stack.slice(at),e.to],recordIds:[...incoming.slice(at),e.id]};cycles.push({...body,cycleDigest:transferDigest(body)});}}
    stack.pop();color.set(id,2);};
  for(const n of nodes)if(!color.has(n.id))visit(n.id);
  type Refutation={recordId:string;from:string;to:string;parentNodeDigest:string;childNodeDigest:string};
  const progress={C1:{status:"NO_REFUTATION_IN_COMPUTED_EDGES" as "REFUTED"|"NO_REFUTATION_IN_COMPUTED_EDGES",firstRefutation:null as Refutation|null},
    C2:{status:"NO_REFUTATION_IN_COMPUTED_EDGES" as "REFUTED"|"NO_REFUTATION_IN_COMPUTED_EDGES",firstRefutation:null as Refutation|null},
    C3:{status:"NO_REFUTATION_IN_COMPUTED_EDGES" as "REFUTED"|"NO_REFUTATION_IN_COMPUTED_EDGES",firstRefutation:null as Refutation|null}};
  for(const r of records)if(r.kind==="EDGE"&&r.targetComputed){
    const a=byId.get(r.from)!,b=byId.get(r.to)!;if(b.hit)continue;
    const ref={recordId:r.id,from:r.from,to:r.to,parentNodeDigest:a.nodeDigest,childNodeDigest:b.nodeDigest};
    for(const [name,failed] of [["C1",true],["C2",Number(b.defect!.visibleMass)<=Number(a.defect!.visibleMass)],["C3",Number(b.defect!.size)!==1]] as const)
      if(failed&&progress[name].firstRefutation===null)progress[name]={status:"REFUTED",firstRefutation:ref};
  }
  return {frontier,reachability,cycles,progress};
}
export type TransferPending={phase:"NODE"|"FACTOR"|"FINALIZE";id?:string;q?:string};
export function factorTransferPacket(options:TransferRunOptions={}){
  const run=budget(options),nodes:TransferNode[]=[],raw:RawRecord[]=[],queue=FACTOR_TRANSFER_INPUTS.seeds.map(s=>({...s,depth:0})),seen=new Map(queue.map(s=>[`${s.p}:${s.h}`,s.depth]));
  let pending:TransferPending|null={phase:"NODE",id:`${queue[0].p}:${queue[0].h}`},reason:StopReason|null=null,retainedBytes=0;
  const retain=(entry:unknown)=>{const bytes=Buffer.byteLength(transferCanonicalJson(entry),"utf8");if(retainedBytes+bytes+32768>run.limits.maxOutputBytes)throw new RunStop("OUTPUT_LIMIT");retainedBytes+=bytes;};
  try{
    for(let i=0;i<queue.length;i++){const s=queue[i],id=`${s.p}:${s.h}`;pending={phase:"NODE",id};run.tick();
      if(nodes.length>=run.limits.maxNodes)throw new RunStop("NODE_LIMIT");
      const n=node(Number(s.p),Number(s.h),s.depth,run);retain(n);nodes.push(n);if(n.hit)continue;
      for(const f of n.qnrFactors){pending={phase:"FACTOR",id,q:f.q};run.tick();if(raw.length>=run.limits.maxRecords)throw new RunStop("RECORD_LIMIT");
        const rid=`r${raw.length}`;
        if(!f.eligible){const r={id:rid,kind:"BLOCKER" as const,from:id,q:f.q,exponent:f.exponent,residue:f.residue,reason:"NONINTEGRAL_SHIFT" as const};retain(r);raw.push(r);continue;}
        const to=`${s.p}:${f.q}`,exists=seen.has(to),disposition=exists?"REVISIT" as const:s.depth===2?"DEPTH_LIMIT" as const:"DISCOVERED" as const;
        const r={id:rid,kind:"EDGE" as const,from:id,to,q:f.q,exponent:f.exponent,requestedDepth:String(s.depth+1),disposition,targetComputed:false,toDepth:null};
        retain(r);raw.push(r);if(disposition==="DISCOVERED"){seen.set(to,s.depth+1);queue.push({p:s.p,h:f.q,depth:s.depth+1});}
      }
    }
    pending={phase:"FINALIZE"};run.tick();pending=null;
  }catch(error){if(!(error instanceof RunStop))throw error;reason=error.reason;}
  const byId=new Map(nodes.map(n=>[n.id,n])),records:TransferRecord[]=raw.map(r=>{
    const body=r.kind==="EDGE"?{...r,targetComputed:byId.has(r.to),toDepth:byId.get(r.to)?.depth??null}:r;
    return {...body,recordDigest:transferDigest(body)};
  });
  const graph=deriveTransferGraph(nodes,records,reason===null),graphDigest=transferDigest({nodes,records,...graph}),invariant={inputs:FACTOR_TRANSFER_INPUTS,nodes,records,...graph,graphDigest};
  const body={method:"ERDOS_STRAUS_FACTOR_DIRECTED_TRANSFER_V1" as const,status:reason?"PARTIAL" as const:"COMPLETE" as const,...invariant,limits:run.limits,pending,reason,
    scope:FACTOR_TRANSFER_SCOPE,contentDigest:transferDigest(invariant),runtime:{stateInsertions:String(run.stateCount()),workSteps:String(run.workCount()),elapsedMs:String(run.elapsed()),outputBytes:"0"}};
  const seal=()=>{let packet={...body,packetDigest:transferDigest(body)};for(let i=0;i<8;i++){const bytes=String(Buffer.byteLength(JSON.stringify(packet),"utf8"));if(bytes===body.runtime.outputBytes)break;body.runtime.outputBytes=bytes;packet={...body,packetDigest:transferDigest(body)};}return packet;};
  let packet=seal();body.runtime.elapsedMs=String(run.elapsed());packet=seal();
  try{if(body.status==="COMPLETE")run.tick();}catch(error){if(!(error instanceof RunStop))throw error;body.status="PARTIAL";body.reason=error.reason;body.pending={phase:"FINALIZE"};
    const failedGraph=deriveTransferGraph(nodes,records,false);Object.assign(body,failedGraph);body.graphDigest=transferDigest({nodes,records,...failedGraph});
    body.contentDigest=transferDigest({inputs:FACTOR_TRANSFER_INPUTS,nodes,records,...failedGraph,graphDigest:body.graphDigest});body.runtime.elapsedMs=String(run.elapsed());packet=seal();}
  if(Number(packet.runtime.outputBytes)>run.limits.maxOutputBytes)throw new Error("No oversized graph diagnostic emitted");return packet;
}
export type FactorTransferPacket=ReturnType<typeof factorTransferPacket>;

/** Trusted fixed CLI checkpoint after serialization; never resumes discovery. */
export function finalizeTransferForOutput(packet:FactorTransferPacket,observedMs:number):FactorTransferPacket{
  if(!Number.isFinite(observedMs)||observedMs<0)throw new RangeError("Monotonic output checkpoint");
  const {packetDigest,...original}=packet;void packetDigest;
  const body={...original,runtime:{...original.runtime,elapsedMs:String(Math.round(observedMs))}};
  if(body.status==="COMPLETE"&&observedMs>=body.limits.seconds*1000){
    body.status="PARTIAL";body.reason="TIME_LIMIT";body.pending={phase:"FINALIZE"};
    const graph=deriveTransferGraph(body.nodes,body.records,false);Object.assign(body,graph);
    body.graphDigest=transferDigest({nodes:body.nodes,records:body.records,...graph});
    body.contentDigest=transferDigest({inputs:body.inputs,nodes:body.nodes,records:body.records,...graph,graphDigest:body.graphDigest});
  }
  let sealed={...body,packetDigest:transferDigest(body)};
  for(let i=0;i<8;i++){const bytes=String(Buffer.byteLength(JSON.stringify(sealed),"utf8"));if(bytes===body.runtime.outputBytes)break;
    body.runtime.outputBytes=bytes;sealed={...body,packetDigest:transferDigest(body)};}
  if(Number(sealed.runtime.outputBytes)>body.limits.maxOutputBytes)throw new RangeError("Bounded CLI output");return sealed;
}
