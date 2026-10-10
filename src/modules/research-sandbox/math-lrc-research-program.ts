import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";

/** Pure fixed registry: no IO, provider, historical checker or arbitrary graph authoring. */
export function freezeLrcData<T>(value:T):T {
  if(value && typeof value==="object") { for(const child of Object.values(value)) freezeLrcData(child); Object.freeze(value); }
  return value;
}
export const LRC_RESEARCH_PROGRAM_BASELINE = freezeLrcData({
  "id": "ALLIKVERE_V2_INTEGER_SPEED_PROGRAM_V1",
  "defaultMode": "REPRODUCTION",
  "modes": [
    "REPRODUCTION",
    "DISCOVERY"
  ],
  "convention": "LRC(m) denotes m positive integer moving speeds and m+1 total runners, including the stationary runner",
  "distance": "norm(x) = min_{z in Z}|x-z|",
  "lowerStatement": "For each m in {1,...,12}, for every u in Z_{>0}^m, there exists t in R such that for every i in {1,...,m}, norm(t*u_i) >= 1/(m+1).",
  "targets": [
    {
      "id": "ROOT_LRC_13_MOVING_14_TOTAL",
      "movingSpeeds": 13,
      "totalRunners": 14,
      "statement": "For every u in Z_{>0}^{13}, there exists t in R such that for every i in {1,...,13}, norm(t*u_i) >= 1/14.",
      "primeCount": 61,
      "primes": [
        83,
        139,
        167,
        181,
        191,
        199,
        211,
        223,
        227,
        229,
        233,
        239,
        241,
        251,
        257,
        263,
        269,
        271,
        277,
        281,
        283,
        293,
        307,
        311,
        313,
        317,
        331,
        337,
        347,
        349,
        353,
        359,
        367,
        373,
        379,
        383,
        389,
        397,
        401,
        409,
        419,
        421,
        431,
        433,
        439,
        443,
        449,
        457,
        461,
        463,
        467,
        479,
        487,
        491,
        499,
        503,
        509,
        521,
        523,
        541,
        547
      ]
    },
    {
      "id": "ROOT_LRC_14_MOVING_15_TOTAL",
      "movingSpeeds": 14,
      "totalRunners": 15,
      "statement": "For every u in Z_{>0}^{14}, there exists t in R such that for every i in {1,...,14}, norm(t*u_i) >= 1/15.",
      "primeCount": 71,
      "primes": [
        89,
        131,
        149,
        157,
        163,
        167,
        173,
        179,
        181,
        191,
        193,
        197,
        199,
        211,
        223,
        227,
        229,
        233,
        239,
        241,
        251,
        257,
        263,
        269,
        271,
        277,
        281,
        283,
        293,
        307,
        311,
        313,
        317,
        331,
        337,
        347,
        349,
        353,
        359,
        367,
        373,
        379,
        383,
        389,
        397,
        401,
        409,
        419,
        421,
        431,
        433,
        439,
        443,
        449,
        457,
        461,
        463,
        467,
        479,
        487,
        491,
        499,
        503,
        509,
        521,
        523,
        541,
        547,
        557,
        563,
        569
      ]
    }
  ],
  "trustPolicies": [
    "NO_SOURCE_ADOPTION",
    "EXPLICIT_PINNED_SOURCE_ASSUMPTIONS"
  ],
  "defaultTrustPolicy": "NO_SOURCE_ADOPTION",
  "sourceAdoption": "Only exact premise or implication statements with immutable source/statement/scope pins may be explicitly adopted. Adoption retains source debt and never establishes independent reproduction. Adopting the target theorem itself is not mathematical advance or independent reproduction.",
  "discovery": "A separately bound candidate states source differences, potential gain, falsification predicate, strongest objection, targeted obligation and novelty pending. No discovery success is predeclared.",
  "realSpeedExtension": "NOT_ESTABLISHED_BY_THIS_INTEGER_BASELINE",
  "freshCoverage": "NOT_ESTABLISHED",
  "globalVerdict": "NOT_ESTABLISHED"
} as const);
export const LRC_RESEARCH_PROGRAM_BASELINE_DIGEST = sha256(canonicalJson(LRC_RESEARCH_PROGRAM_BASELINE));
export const LRC_RESEARCH_SOURCE = freezeLrcData({author:"Jaan Allikvere",title:"Fourteen and fifteen lonely runners",id:"arXiv:2609.02604v2",url:"https://arxiv.org/html/2609.02604v2",version:2,primaryBytes:"NOT_RETAINED_LOCALLY",statementAlignment:"MAIN_REVIEWED_LEMMA_4_6"} as const);
export const LRC_MASTER_LIMITS = freezeLrcData({nodes:512,edges:4096,artifactRefs:1024,bytes:524288} as const);
const aggregateIds = ["LOWER_LRC_THROUGH_12","PRIMITIVE_DISTINCT_REDUCTION_13","ELLIPSOID_COVOLUME_13","SEPARATED_POINTS_PREFIX_13","KZ_PRODUCT_MINIMIZATION_13","LATTICE_FLAG_BOUND_13","SHAPE_INEQUALITY_13","PRIME_DIVISIBILITY_CRITERION_13","LEVEL_ONE_COMPLETENESS_61_PRIMES","BINARY_LIFT_COMPLETENESS_61_PRIMES","TERMINAL_PROPERNESS_61_PRIMES","ESTABLISHED_LRC_13","PRIMITIVE_DISTINCT_REDUCTION_14","ELLIPSOID_COVOLUME_14","SEPARATED_POINTS_PREFIX_14","KZ_PRODUCT_MINIMIZATION_14","LATTICE_FLAG_BOUND_14","SHAPE_INEQUALITY_14","FORCED_DIVISOR_LEMMA_14","PRIME_DIVISIBILITY_CRITERION_14","LEVEL_ONE_COMPLETENESS_71_PRIMES","BINARY_LIFT_COMPLETENESS_71_PRIMES","CRT_SHIFT_TERMINAL_PROPERNESS_71_PRIMES"] as const;
const dependencies:Record<string,string[]> = {
 PRIMITIVE_DISTINCT_REDUCTION_13:["LOWER_LRC_THROUGH_12"],SEPARATED_POINTS_PREFIX_13:["LOWER_LRC_THROUGH_12"],
 KZ_PRODUCT_MINIMIZATION_13:["SEPARATED_POINTS_PREFIX_13"],LATTICE_FLAG_BOUND_13:["ELLIPSOID_COVOLUME_13","KZ_PRODUCT_MINIMIZATION_13","SHAPE_INEQUALITY_13"],
 PRIME_DIVISIBILITY_CRITERION_13:["LOWER_LRC_THROUGH_12"],BINARY_LIFT_COMPLETENESS_61_PRIMES:["LEVEL_ONE_COMPLETENESS_61_PRIMES"],
 TERMINAL_PROPERNESS_61_PRIMES:["BINARY_LIFT_COMPLETENESS_61_PRIMES","PRIME_DIVISIBILITY_CRITERION_13"],
 ESTABLISHED_LRC_13:["PRIMITIVE_DISTINCT_REDUCTION_13","LATTICE_FLAG_BOUND_13","TERMINAL_PROPERNESS_61_PRIMES","ROOT_LRC_13_MOVING_14_TOTAL"],
 PRIMITIVE_DISTINCT_REDUCTION_14:["ESTABLISHED_LRC_13"],SEPARATED_POINTS_PREFIX_14:["ESTABLISHED_LRC_13"],
 KZ_PRODUCT_MINIMIZATION_14:["SEPARATED_POINTS_PREFIX_14"],LATTICE_FLAG_BOUND_14:["ELLIPSOID_COVOLUME_14","KZ_PRODUCT_MINIMIZATION_14","SHAPE_INEQUALITY_14"],
 PRIME_DIVISIBILITY_CRITERION_14:["ESTABLISHED_LRC_13"],BINARY_LIFT_COMPLETENESS_71_PRIMES:["LEVEL_ONE_COMPLETENESS_71_PRIMES"],
 CRT_SHIFT_TERMINAL_PROPERNESS_71_PRIMES:["BINARY_LIFT_COMPLETENESS_71_PRIMES","PRIME_DIVISIBILITY_CRITERION_14","LOWER_LRC_THROUGH_12"]
};
export type LrcMasterNode = {id:string;category:"AGGREGATE"|"LOWER"|"GENERATION"|"LIFT"|"TERMINAL"|"LOG_CLOSURE"|"ROOT"|"METHOD";statement:string;statementDigest:string;domainDigest:string;quantifiers:readonly string[];assumptionIds:readonly string[];movingSpeeds:number|null;prime:number|null;terminalMethod:"SOURCE_MATCH_REQUIRED"|null;semanticAlignment:"SOURCE_MATCH_REQUIRED"|"PINNED_EXACT_STATEMENT"};
export type LrcMasterEdge = {id:string;antecedentIds:string[];consequentId:string;statementDigest:string};
export type LrcMaster = {version:1;baselineDigest:string;nodes:LrcMasterNode[];edges:LrcMasterEdge[];digest:string};
let fixedMaster:LrcMaster|undefined;
export function buildLrcMasterObligations():LrcMaster {
 if(fixedMaster)return fixedMaster;
 const nodes:LrcMasterNode[]=[],edges:LrcMasterEdge[]=[];
 const add=(id:string,category:LrcMasterNode["category"],movingSpeeds:number|null=null,prime:number|null=null,statement=id)=>{
   const aligned=category==="LOWER"||category==="ROOT";
   nodes.push({id,category,statement,statementDigest:sha256(statement),domainDigest:sha256(canonicalJson({baseline:LRC_RESEARCH_PROGRAM_BASELINE_DIGEST,movingSpeeds,prime,category})),quantifiers:aligned?["FORALL_POSITIVE_INTEGER_SPEED_TUPLE","EXISTS_REAL_TIME","FORALL_COORDINATES"]:["UNRESOLVED_SOURCE_QUANTIFIERS"],assumptionIds:[],movingSpeeds,prime,terminalMethod:category==="TERMINAL"?"SOURCE_MATCH_REQUIRED":null,semanticAlignment:aligned?"PINNED_EXACT_STATEMENT":"SOURCE_MATCH_REQUIRED"});
 };
 const edge=(antecedentIds:string[],consequentId:string)=>{ if(!antecedentIds.length)return; const body={antecedentIds,consequentId};edges.push({id:"EDGE_"+sha256(canonicalJson(body)),...body,statementDigest:sha256(canonicalJson(body))});};
 for(const id of aggregateIds)add(id,"AGGREGATE");
 for(let m=1;m<=12;m++) {add("LOWER_LRC_"+m,"LOWER",m,null,"For every positive integer "+m+"-tuple, exists real t with every norm(t*u_i)>=1/"+(m+1));edge(["LOWER_LRC_"+m],"LOWER_LRC_THROUGH_12");}
 for(const target of LRC_RESEARCH_PROGRAM_BASELINE.targets) {
   const n=target.movingSpeeds,c=target.primeCount;
   const gen="LEVEL_ONE_COMPLETENESS_"+c+"_PRIMES",lift="BINARY_LIFT_COMPLETENESS_"+c+"_PRIMES",term=n===13?"TERMINAL_PROPERNESS_61_PRIMES":"CRT_SHIFT_TERMINAL_PROPERNESS_71_PRIMES";
   for(const p of target.primes) {
     const base="N"+n+"_P"+p, g=base+"_GENERATION", l=base+"_LIFT", t=base+"_TERMINAL";
     add(g,"GENERATION",n,p,"Complete level-one improper domain for n="+n+", p="+p+" under the matching source convention");
     add(l,"LIFT",n,p,"Complete source-required lift chain for n="+n+", p="+p+" bound to complete predecessor output");
     add(t,"TERMINAL",n,p,"Source-matched terminal properness for n="+n+", p="+p+"; exact terminal method and domain require admitted source alignment");
     edge([g],l);edge([l,"PRIME_DIVISIBILITY_CRITERION_"+n],t);edge([g],gen);edge([l],lift);edge([t],term);
   }
   const log="GLOBAL_LOG_CLOSURE_"+n;add(log,"LOG_CLOSURE",n,null,"Exact global log contradiction under complete source-aligned analytic/divisibility/prime coverage premises");
   const root=target.id;add(root,"ROOT",n,null,target.statement);
   edge(["LATTICE_FLAG_BOUND_"+n,"PRIME_DIVISIBILITY_CRITERION_"+n,term,...(n===14?["FORCED_DIVISOR_LEMMA_14"]:[])],log);
   edge(["PRIMITIVE_DISTINCT_REDUCTION_"+n,"LATTICE_FLAG_BOUND_"+n,"PRIME_DIVISIBILITY_CRITERION_"+n,term,log],root);
 }
 add("FEW_EXCEPTION_SHIFT_14","METHOD",14,null,"Conditional source Lemma4.6; no automatic prime-terminal or root discharge");
 for(const [to,from] of Object.entries(dependencies)) edge(from,to);
 if(nodes.length!==436||nodes.length>LRC_MASTER_LIMITS.nodes||edges.length>LRC_MASTER_LIMITS.edges)throw new Error("Fixed master quota drift");
 const ids=new Set(nodes.map(n=>n.id)); if(ids.size!==nodes.length||edges.some(e=>!ids.has(e.consequentId)||e.antecedentIds.some(a=>!ids.has(a))))throw new Error("Master references differ");
 const visiting=new Set<string>(),done=new Set<string>();
 const visit=(id:string)=>{if(visiting.has(id))throw new Error("Master cycle");if(done.has(id))return;visiting.add(id);for(const e of edges.filter(e=>e.consequentId===id))for(const a of e.antecedentIds)visit(a);visiting.delete(id);done.add(id);};for(const id of ids)visit(id);
 const body={version:1 as const,baselineDigest:LRC_RESEARCH_PROGRAM_BASELINE_DIGEST,nodes,edges};
 if(Buffer.byteLength(canonicalJson(body))>LRC_MASTER_LIMITS.bytes)throw new Error("Master bytes");
 fixedMaster=freezeLrcData({...body,digest:sha256(canonicalJson(body))});return fixedMaster;
}
export function validateLrcResearchProgramBaseline(raw:unknown):boolean {try{return canonicalJson(raw)===canonicalJson(LRC_RESEARCH_PROGRAM_BASELINE);}catch{return false;}}
const hash=z.string().regex(/^[a-f0-9]{64}$/);
export const lrcProgramArtifactSchema=z.object({id:z.string().min(1).max(160),digest:hash,nodeId:z.string().min(1).max(160).nullable(),edgeId:z.string().min(1).max(160).nullable(),statementDigest:hash,consequentStatementDigest:hash.nullable(),domainDigest:hash,antecedentStatementDigests:z.array(hash).max(512),quantifiers:z.array(z.string().max(160)).max(32),orderedQuantifiers:z.array(z.string().max(160)).max(32),assumptionIds:z.array(z.string().max(160)).max(32),kind:z.enum(["SOURCE_ADOPTED","REVIEWED_CONDITIONAL","FINITE_CHECKED"]),status:z.enum(["ADMITTED","REFUTED","REFUSED"]),sourceVersion:z.literal(2),sourceCheckerVersion:z.string().min(1).max(160),targetTheoremAdoption:z.boolean()}).strict();
export type LrcProgramArtifact=z.infer<typeof lrcProgramArtifactSchema>;
export type LrcResearchProgramProjection=ReturnType<typeof buildLrcResearchProgramProjection>;
/** Registry is a separate host trust anchor, not a model payload. Default empty: nothing closes. */
export function buildLrcResearchProgramProjection(input:{artifacts?:readonly unknown[];trustedRegistry?:readonly LrcProgramArtifact[];mode?:"REPRODUCTION"|"DISCOVERY";trustPolicy?:"NO_SOURCE_ADOPTION"|"EXPLICIT_PINNED_SOURCE_ASSUMPTIONS"}={}) {
 z.enum(["REPRODUCTION","DISCOVERY"]).parse(input.mode===undefined?"REPRODUCTION":input.mode);z.enum(["NO_SOURCE_ADOPTION","EXPLICIT_PINNED_SOURCE_ASSUMPTIONS"]).parse(input.trustPolicy===undefined?"NO_SOURCE_ADOPTION":input.trustPolicy);
 const master=buildLrcMasterObligations(),raw=input.artifacts??[],registry=input.trustedRegistry??[];
 if(raw.length>1024||registry.length>1024||Buffer.byteLength(canonicalJson({raw,registry}))>524288)throw new Error("Artifact quota");
 const registryKeys=new Set(registry.map(r=>canonicalJson(lrcProgramArtifactSchema.parse(r))));
 const registered=raw.map(v=>lrcProgramArtifactSchema.parse(v)).filter(a=>registryKeys.has(canonicalJson(a))&&a.status==="ADMITTED"&&(a.kind!=="SOURCE_ADOPTED"||input.trustPolicy==="EXPLICIT_PINNED_SOURCE_ASSUMPTIONS"));
 const valid=registered.filter(a=>!a.targetTheoremAdoption),nodeMap=new Map(master.nodes.map(n=>[n.id,n]));
 const incoming=new Map<string,LrcMasterEdge[]>();for(const edge of master.edges){const list=incoming.get(edge.consequentId)??[];list.push(edge);incoming.set(edge.consequentId,list);}
 const nodeEvidence=(n:LrcMasterNode)=>n.semanticAlignment!=="PINNED_EXACT_STATEMENT"?undefined:valid.find(a=>a.nodeId===n.id&&a.edgeId===null&&a.consequentStatementDigest===null&&a.statementDigest===n.statementDigest&&a.domainDigest===n.domainDigest&&canonicalJson(a.quantifiers)===canonicalJson(n.quantifiers)&&canonicalJson(a.orderedQuantifiers)===canonicalJson(n.quantifiers)&&a.antecedentStatementDigests.length===0&&a.sourceCheckerVersion==="arXiv:2609.02604v2");
 const edgeEvidence=(e:LrcMasterEdge)=>{const target=nodeMap.get(e.consequentId)!;return target.semanticAlignment!=="PINNED_EXACT_STATEMENT"||e.antecedentIds.some(id=>nodeMap.get(id)!.semanticAlignment!=="PINNED_EXACT_STATEMENT")?undefined:valid.find(a=>a.edgeId===e.id&&a.nodeId===null&&a.statementDigest===e.statementDigest&&a.consequentStatementDigest===target.statementDigest&&a.domainDigest===target.domainDigest&&canonicalJson(a.orderedQuantifiers)===canonicalJson(target.quantifiers)&&canonicalJson(a.quantifiers)===canonicalJson(target.quantifiers)&&a.sourceCheckerVersion==="arXiv:2609.02604v2"&&canonicalJson(a.antecedentStatementDigests)===canonicalJson(e.antecedentIds.map(id=>nodeMap.get(id)!.statementDigest)));};
 const nodeProofs=new Map(master.nodes.map(n=>[n.id,nodeEvidence(n)])),edgeProofs=new Map(master.edges.map(e=>[e.id,edgeEvidence(e)])),memo=new Map<string,boolean>();
 const canClose=(id:string,seen=new Set<string>()):boolean=>{if(memo.has(id))return memo.get(id)!;if(seen.has(id))return false;const n=nodeMap.get(id)!;const a=nodeProofs.get(id);if(!a||a.kind==="FINITE_CHECKED"&&(n.category==="ROOT"||n.category==="LOWER"||n.category==="LOG_CLOSURE")){memo.set(id,false);return false;}seen.add(id);const required=incoming.get(id)??[];const okay=required.every(e=>{const proof=edgeProofs.get(e.id),children=e.antecedentIds.map(p=>nodeProofs.get(p));if(!proof||proof.kind==="FINITE_CHECKED"||children.some(c=>!c))return false;const closure=[...new Set([...proof.assumptionIds,...children.flatMap(c=>c!.assumptionIds)])].sort();return canonicalJson(closure)===canonicalJson([...new Set(a.assumptionIds)].sort())&&e.antecedentIds.every(p=>canClose(p,new Set(seen)));});memo.set(id,okay);return okay;};
 const sourceAssumptions=registered.filter(a=>a.targetTheoremAdoption&&a.kind==="SOURCE_ADOPTED"&&a.nodeId&&a.edgeId===null&&a.consequentStatementDigest===null&&a.antecedentStatementDigests.length===0&&nodeMap.get(a.nodeId)?.semanticAlignment==="PINNED_EXACT_STATEMENT"&&a.statementDigest===nodeMap.get(a.nodeId)!.statementDigest&&a.domainDigest===nodeMap.get(a.nodeId)!.domainDigest&&a.sourceCheckerVersion==="arXiv:2609.02604v2"&&canonicalJson(a.quantifiers)===canonicalJson(nodeMap.get(a.nodeId)!.quantifiers)&&canonicalJson(a.orderedQuantifiers)===canonicalJson(nodeMap.get(a.nodeId)!.quantifiers)).map(a=>({nodeId:a.nodeId!,artifactId:a.id,status:"ASSUMED_SOURCE" as const,statementDigest:a.statementDigest,independentReproduction:false,mathematicalAdvance:false}));
 const nodes=master.nodes.map(n=>({...n,state:canClose(n.id)?"REVIEWED_CONDITIONAL" as const:"OPEN" as const,evidenceRefs:valid.filter(a=>a.nodeId===n.id).map(a=>a.id)}));
 return freezeLrcData({version:1 as const,baseline:LRC_RESEARCH_PROGRAM_BASELINE,baselineDigest:LRC_RESEARCH_PROGRAM_BASELINE_DIGEST,mode:input.mode??"REPRODUCTION",trustPolicy:input.trustPolicy??"NO_SOURCE_ADOPTION",sourceAssumptions,masterDigest:master.digest,nodes,edges:master.edges.map(e=>({...e,admitted:Boolean(edgeProofs.get(e.id))})),roots:LRC_RESEARCH_PROGRAM_BASELINE.targets.map(t=>({id:t.id,movingSpeeds:t.movingSpeeds,totalRunners:t.totalRunners,primeCount:t.primeCount,conditionalClosure:canClose(t.id),independentReproduction:"NOT_ESTABLISHED" as const})),globalLrc:"NOT_ESTABLISHED" as const,formalProof:"NOT_ESTABLISHED" as const,externalAcceptance:"NOT_ESTABLISHED" as const,novelty:"NOT_ESTABLISHED" as const,criticalPath:nodes.filter(n=>n.state==="OPEN").map(n=>n.id)});
}
export const LRC_METHOD_CARDS=freezeLrcData(["ANALYTIC_BOUND_REDUCTION","COMPLETE_COVERING","MONOTONE_LIFTING","COMMON_LEVEL_CRT","FEW_EXCEPTION_SHIFT"].map((family,index)=>({id:family,family,source:LRC_RESEARCH_SOURCE,sourceLocator:index===4?"S4.SS4 Lemma4.6":index===0?"S3":index===1?"S4.SS1":index===2?"S4.SS2":"S4.SS4",premiseIds:index===4?["LOWER_LRC_1_TO_12","POSITIVE_INTEGER_14_SPEED_DOMAIN","PRIME_UNIT_EXCEPTION_PERMUTATION","STRICT_UNION_BOUND","LOWER_CONTINUOUS_WITNESS","PHASE_CELL_SYMBOLIC_ALIGNMENT"]:["EXACT_SOURCE_SCOPE_ALIGNMENT"],toolCapabilityIds:index===4?["LRC_SHIFT_FINITE_CHECKER_V1"]:["UNAVAILABLE_FULL_SOURCE_DOMAIN_COLLECTOR"],semanticAlignment:index===4?"MAIN_SOURCE_STATEMENT_REVIEWED":"SOURCE_MATCH_REQUIRED",expectedOutput:"Statement-aligned conditional argument or complete finite certificate",evidenceCeiling:"CONDITIONAL_OR_EXACT_FINITE_ONLY",costEstimate:{lower:1,upper:100,unit:"HEURISTIC_NOT_PROBABILITY"},discrimination:"Exact target predicate must be stated before dispatch",noveltyCeiling:"KNOWN_SOURCE_METHOD_NOT_NOVELTY",stopPivot:"Stop on integrity/operational failure or two completed no-information experiments",rejectedPredicateIds:[] as string[]})));
export const LRC_SHIFT_METHOD_PREMISES=freezeLrcData([
 {id:"LOWER_LRC_1_TO_12",status:"SOURCE_ADOPTED_CONDITIONAL",statement:"Assume: for every integer m in1..12, every v in positive integers^m admits a real tau such that every norm(tau*v_i)>=1/(m+1). Not independently established here."},
 {id:"POSITIVE_INTEGER_14_SPEED_DOMAIN",status:"DOMAIN_ASSUMPTION",statement:"For every u in positive integers^14, retain all14 coordinates, including repetitions or nonprimitive tuples. d is prime; E={i:d does not divide u_i}, e=|E|."},
 {id:"PRIME_UNIT_EXCEPTION_PERMUTATION",status:"SYMBOLIC_ALIGNMENT_REQUIRED",statement:"For every i in E, gcd(u_i,d)=1. For every j in0..d-1, j->u_i*j modulo d is a bijection of all d residues, even when different coordinates repeat."},
 {id:"STRICT_UNION_BOUND",status:"EXACT_HYPOTHESIS",statement:"Require e>=2 and e*ceil(2d/15)<d. For all bad sets B_i each size<=ceil(2d/15), their union has size<=e*ceil(2d/15)<d without an independence/disjointness assumption."},
 {id:"LOWER_CONTINUOUS_WITNESS",status:"CONDITIONAL_OPEN",statement:"With k=14-e in1..12, the assumed LRC(k) supplies a common REAL tau for every divisible speed u_i/d. t0=tau/d is the same time for all coordinates; rational offsets do not establish its existence."},
 {id:"PHASE_CELL_SYMBOLIC_ALIGNMENT",status:"REVIEWED_CONDITIONAL_NOT_FORMAL",statement:"For every real alpha and unit a modulo d, the strict bad predicate norm(alpha+a*j/d)<1/15 changes only at all +/-1/15-a*j/d modulo1. Between consecutive roots each predicate is constant; equality is GOOD. Finite representatives validate exact cells, not this universal analytic implication by sampling."}
] as const);
export const LRC_SHIFT_METHOD_DOMAIN_DIGEST=sha256(canonicalJson({movingSpeeds:14,totalRunners:15,positiveIntegers:true,repeatsAllowed:true,primeD:true,eAtLeast:2,strictBound:"e*ceil(2d/15)<d",lowerAssumed:"LRC1..12",finiteDomain:"d3/e2,d5/e2..4"}));
export const lrcMethodPremiseArtifactSchema=z.object({id:z.string().min(1).max(160),premiseId:z.string().min(1).max(160),statementDigest:hash,domainDigest:z.literal(LRC_SHIFT_METHOD_DOMAIN_DIGEST),sourceVersion:z.literal(2),sourceCheckerVersion:z.literal("arXiv:2609.02604v2#S4.SS4:Lemma4.6"),kind:z.enum(["INDEPENDENT_HOST_ADMISSION","SOURCE_ADOPTED_CONDITIONAL"]),status:z.literal("ADMITTED"),assumptionIds:z.array(z.string().min(1).max(160)).max(32)}).strict();
export type LrcMethodPremiseArtifact=z.infer<typeof lrcMethodPremiseArtifactSchema>;
/** Applicability consumes a separate trusted host admission registry. It never admits model badges. */
export function evaluateLrcMethodApplicability(input:{methodId:string;premises:readonly {id:string;state:"SATISFIED"|"OPEN"|"REFUTED";artifactId:string|null;sourceAdopted?:boolean}[];trustedPremiseRegistry?:readonly LrcMethodPremiseArtifact[];availableCapabilities:readonly string[];conditionalAllowed:boolean;conventionMatches:boolean;trustPolicy?:"NO_SOURCE_ADOPTION"|"EXPLICIT_PINNED_SOURCE_ASSUMPTIONS";targetedPredicateId?:string;refutedPredicateIds?:readonly string[]}) {
 const card=LRC_METHOD_CARDS.find(c=>c.id===input.methodId);if(!card)throw new Error("Unknown fixed method");
 const rawRegistry=input.trustedPremiseRegistry??[];if(rawRegistry.length>32||Buffer.byteLength(canonicalJson(rawRegistry))>32768)throw new Error("Method premise registry cap");
 const registry=rawRegistry.map(v=>lrcMethodPremiseArtifactSchema.parse(v));if(new Set(registry.map(v=>v.id)).size!==registry.length||new Set(input.premises.map(v=>v.id)).size!==input.premises.length)throw new Error("Duplicate premise/registry IDs");
 const admitted=(p:typeof input.premises[number])=>registry.find(a=>a.id===p.artifactId&&a.premiseId===p.id&&LRC_SHIFT_METHOD_PREMISES.some(s=>s.id===p.id&&sha256(s.statement)===a.statementDigest)&&a.assumptionIds.length===0&&a.kind==="INDEPENDENT_HOST_ADMISSION"||a.id===p.artifactId&&a.premiseId===p.id&&LRC_SHIFT_METHOD_PREMISES.some(s=>s.id===p.id&&sha256(s.statement)===a.statementDigest)&&a.kind==="SOURCE_ADOPTED_CONDITIONAL"&&input.trustPolicy==="EXPLICIT_PINNED_SOURCE_ASSUMPTIONS");
 const missing=card.premiseIds.filter(id=>!input.premises.some(p=>p.id===id&&p.state==="SATISFIED"&&p.artifactId&&admitted(p)&&(!p.sourceAdopted||input.trustPolicy==="EXPLICIT_PINNED_SOURCE_ASSUMPTIONS")));
 const refuted=card.premiseIds.some(id=>input.premises.some(p=>p.id===id&&p.state==="REFUTED"));
 const tools=card.toolCapabilityIds.filter(id=>!input.availableCapabilities.includes(id));
 const sourceDebt=input.premises.some(p=>card.premiseIds.includes(p.id)&&(p.sourceAdopted||registry.some(a=>a.id===p.artifactId&&a.kind==="SOURCE_ADOPTED_CONDITIONAL"))),sourceRefused=sourceDebt&&input.trustPolicy!=="EXPLICIT_PINNED_SOURCE_ASSUMPTIONS";
 const target=input.targetedPredicateId??(card.id==="FEW_EXCEPTION_SHIFT"?"SHIFT_PHASE_PARTITION_AND_COMMON_SHIFT_FINITE_V1":null),predicateRefuted=target!==null&&Boolean(input.refutedPredicateIds?.includes(target));
 return {method:card,status:!input.conventionMatches||refuted||sourceRefused||predicateRefuted?"REFUSED" as const:card.semanticAlignment==="SOURCE_MATCH_REQUIRED"||tools.length?"DEFERRED" as const:(missing.length||sourceDebt)&&!input.conditionalAllowed?"DEFERRED" as const:missing.length||sourceDebt?"CONDITIONAL" as const:"APPLICABLE" as const,openPremiseIds:missing,sourceDebt,missingCapabilities:tools,rankingExplanation:"Root contribution and discrimination require the sealed experiment; source publication alone does not satisfy a premise",truthProbability:null};
}
