import { readFileSync } from "node:fs";
import { beforeAll, afterEach, describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { MATH_LRC_CAMPAIGN_CONTRACT, MATH_PILOT_CALIBRATIONS, digestMathPilotContract,
  mathPilotContractSchema, mathPilotRequestSchema, mathPilotScope } from "@/modules/research-sandbox/math-pilot";
import { mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";
import { digestMathAgentLedger, mathAgentLedgerSchema, validateRecordedMathAgentReview } from "@/modules/research-sandbox/agent-review";
import { runLrcCampaignReference } from "@/modules/research-sandbox/math-lrc-campaign-reference";
import { createLrcCampaignReferenceEvidence, lrcCampaignFactsPrompt, cloneLrcCampaignValue, type LrcCampaignEvidence } from "@/modules/research-sandbox/math-lrc-campaign";
import { assertLrcCampaignBinding, assertNoProviderCampaignEvidence, guardedLrcCampaignCall,
  requireLrcCampaignCapability } from "@/modules/research-sandbox/math-lrc-campaign-integration";
import { runOfflineLrcCampaignAgents } from "@/modules/research-sandbox/math-lrc-campaign-offline";
import { parseEnv, resetEnvCache } from "@/server/env";
import { CodexLocalMathProvider } from "@/modules/research-sandbox/adapters/codex-local-math";
import { CodexLocalMathReviewer } from "@/modules/research-sandbox/adapters/codex-local-review";

const contract=MATH_LRC_CAMPAIGN_CONTRACT, root=digestMathPilotContract(contract);
const usage={inputTokens:100,cachedInputTokens:0,outputTokens:50,reasoningOutputTokens:0};
const attempt={providerName:"codex-local" as const,modelName:"stub-solver",threadId:"solver-context",
  attemptType:"PARTIAL" as const,argument:"The retained p83 finite campaign supports only this one-prime result; global LRC remains OPEN.",
  candidateCounterexample:null,selfChecks:["Checked the recorded scope."],limitations:["Not a fresh semantic replay."],usage};
let evidence:LrcCampaignEvidence;
beforeAll(async()=>{evidence=await runLrcCampaignReference(contract.lrcCampaignScope,root,{permission:true});});
afterEach(()=>{vi.unstubAllEnvs();resetEnvCache();});
function harness() {
  const facts:string[]=[];
  const fence=vi.fn(async()=>{}),retain=vi.fn(async()=>{});
  const solve=vi.fn(async(view:{facts:string})=>{facts.push(view.facts);return cloneLrcCampaignValue(attempt);});
  const reviewRole=vi.fn(async(view:{role:"CRITIC"|"ADVERSARY";facts:string})=>{
    facts.push(view.facts);return {role:view.role,verdict:"SUPPORTS" as const,candidateConclusion:"SUPPORTED_ARGUMENT" as const,
      exactQuote:"retained p83 finite campaign",reasoning:"This bounded reference is recorded and unsigned, not a fresh replay or general theorem proof.",
      checks:["Checked the one-prime boundary and remaining OPEN premises."],unresolvedGap:null,threadId:`${view.role}-context`,usage};
  });
  const input={enabled:true,caseId:"prospective-case",contract:cloneLrcCampaignValue(contract),evidence:cloneLrcCampaignValue(evidence),
    researchDigest:"a".repeat(64),modelName:attempt.modelName,roleModels:{CRITIC:"stub-critic",ADVERSARY:"stub-adversary"},fence,solve,reviewRole,retain};
  return {input,facts,fence,solve,reviewRole,retain};
}
describe("TIP061 three-role retained campaign integration",()=>{
  it("actually imports all fixed bytes, but does not execute a fresh campaign",()=>{
    expect(evidence.admission).toMatchObject({filesVerified:42,bytesVerified:53211840,semanticReplayExecuted:false,freshFullCampaign:false});
    expect(root).toBe("94b678f4bb862c4c46db5f2a754df86fd3a1486fa05c8bc31509aa177c105b1e");
    assertLrcCampaignBinding(contract,evidence);
  });
  it("runs three fresh stub roles with identical canonical facts and an exact ledger5 bounded verdict",async()=>{
    const h=harness(),result=await runOfflineLrcCampaignAgents(h.input);
    expect(h.facts).toEqual([lrcCampaignFactsPrompt(evidence),lrcCampaignFactsPrompt(evidence),lrcCampaignFactsPrompt(evidence)]);
    expect(h.fence).toHaveBeenCalledTimes(1);expect(h.retain).toHaveBeenCalledTimes(1);
    expect(result.review.ledger).toMatchObject({version:5,conclusion:"PARTIAL",oracle:{lrcCampaignEvidenceValid:true}});
    expect(new Set([result.attempt.threadId,...result.review.ledger.reports.map(r=>r.threadId)]).size).toBe(3);
    expect(result.review.ledger.reviewerModels?.map(r=>r.requestedModelName)).toEqual(["stub-critic","stub-adversary"]);
    expect(result.review.ledger).not.toHaveProperty("lrcEvidence");
  });
  it.each(["missing","wrong-root","fresh","wrong-scope","wrong-facts"])("rejects %s admission before fence and any role",async(mode)=>{
    const h=harness();
    if(mode==="missing") h.input.evidence=undefined as unknown as LrcCampaignEvidence;
    else if(mode==="wrong-root") h.input.evidence=createLrcCampaignReferenceEvidence("b".repeat(64),contract.lrcCampaignScope,evidence.admission.importedAt);
    else if(mode==="fresh") (h.input.evidence.admission as {freshFullCampaign:boolean}).freshFullCampaign=true;
    else if(mode==="wrong-scope") (h.input.evidence.scope as {prime:number}).prime=89;
    else (h.input.evidence.facts.remaining as {otherP13Primes:number}).otherP13Primes=0;
    await expect(runOfflineLrcCampaignAgents(h.input)).rejects.toThrow();
    expect(h.fence).not.toHaveBeenCalled();expect(h.solve).not.toHaveBeenCalled();expect(h.reviewRole).not.toHaveBeenCalled();expect(h.retain).not.toHaveBeenCalled();
  });
  it("rejects a missing per-role seam before fence",async()=>{
    const h=harness();await expect(runOfflineLrcCampaignAgents({...h.input,reviewRole:undefined})).rejects.toThrow();expect(h.fence).not.toHaveBeenCalled();
  });
  it("refuses provider-authored evidence even when every digest is correct",async()=>{
    const h=harness();h.input.solve=vi.fn(async()=>({...attempt,lrcCampaignEvidence:evidence}));
    await expect(runOfflineLrcCampaignAgents(h.input)).rejects.toThrow(/Provider output/);
    expect(h.reviewRole).not.toHaveBeenCalled();expect(h.retain).not.toHaveBeenCalled();
    expect(()=>assertNoProviderCampaignEvidence({mathAttempt:{lrcCampaignEvidence:undefined}})).toThrow();
  });
  it.each(["contract","scope","evidence","attempt"])("frozen defensive %s cannot mutate then restore",async(field)=>{
    const value={contract:cloneLrcCampaignValue(contract),evidence:cloneLrcCampaignValue(evidence),attempt:cloneLrcCampaignValue(attempt)};
    await expect(guardedLrcCampaignCall(value,async view=>{
      if(field==="contract") {const old=view.contract.statement;view.contract.statement="changed";view.contract.statement=old;}
      if(field==="scope") {(view.contract.lrcCampaignScope as {prime:number}).prime=89;}
      if(field==="evidence") {view.evidence.rootContractDigest="b".repeat(64);}
      if(field==="attempt") {view.attempt.argument="changed";}
      return attempt;
    })).rejects.toThrow();
    expect(value.contract).toEqual(contract);expect(value.evidence).toEqual(evidence);expect(value.attempt).toEqual(attempt);
  });
  it("detects original alias mutation during failed callback",async()=>{
    const original={evidence:cloneLrcCampaignValue(evidence)};
    await expect(guardedLrcCampaignCall(original,async()=>{original.evidence.rootContractDigest="b".repeat(64);throw new Error("transport");})).rejects.toThrow(/mutated/);
  });
  it("stops after critic mutation, without adversary or retention",async()=>{
    const h=harness();h.input.reviewRole=vi.fn(async view=>{(view as unknown as {attempt:{argument:string}}).attempt.argument="changed";return h.reviewRole(view);});
    await expect(runOfflineLrcCampaignAgents(h.input)).rejects.toThrow();
    expect(h.input.reviewRole).toHaveBeenCalledTimes(1);expect(h.retain).not.toHaveBeenCalled();
  });
  it("refuses original case replacement during solver and does not review",async()=>{
    const h=harness();h.input.solve=vi.fn(async()=>{h.input.caseId="wrong-case";return attempt;});
    await expect(runOfflineLrcCampaignAgents(h.input)).rejects.toThrow(/host inputs changed/);expect(h.reviewRole).not.toHaveBeenCalled();
  });
  it("refuses repeated solver/reviewer contexts",async()=>{
    const h=harness();h.input.reviewRole=vi.fn(async view=>({...await h.reviewRole(view),threadId:attempt.threadId}));
    await expect(runOfflineLrcCampaignAgents(h.input)).rejects.toThrow(/context reused/);expect(h.retain).not.toHaveBeenCalled();
  });
  it("fails closed on ledger downgrade, different refs and mixed evidence even coherently hashed",async()=>{
    const h=harness(),result=await runOfflineLrcCampaignAgents(h.input);
    const base={contract,contractDigest:root,attempt:result.attempt,attemptDigest:result.attemptDigest,researchDigest:h.input.researchDigest,review:result.review};
    expect(validateRecordedMathAgentReview(base)).not.toBeNull();
    expect(validateRecordedMathAgentReview({...base,researchDigest:"b".repeat(64)})).toBeNull();
    for(const version of [1,2,3,4]) expect(mathAgentLedgerSchema.safeParse({...result.review.ledger,version}).success).toBe(false);
    const wrong=mathAgentLedgerSchema.parse({...result.review.ledger,lrcCampaignEvidence:{...result.review.ledger.lrcCampaignEvidence,evidenceDigest:"b".repeat(64)}});
    expect(validateRecordedMathAgentReview({...base,review:{...result.review,ledger:wrong,ledgerDigest:digestMathAgentLedger(wrong)}})).toBeNull();
    for(const field of ["exactAnswer","computationPython","computationOrigin","lrcEvidence","erdosStrausWitnesses","erdosStrausPolynomialFamilies","erdosStrausGateCounterexample"])
      expect(()=>assertLrcCampaignBinding(contract,evidence,{...result.attempt,[field]:undefined})).toThrow();
  });
  it("public request is preset-only and old contract fields/digests remain absent",()=>{
    expect(mathPilotRequestSchema.safeParse({caseType:"LRC_CAMPAIGN",preset:"ALLIKVERE_P83_14_V1",lrcCampaignEvidence:evidence}).success).toBe(false);
    expect(mathPilotRequestSchema.safeParse({caseType:"LRC_CAMPAIGN",preset:"WRONG"}).success).toBe(false);
    const old=MATH_PILOT_CALIBRATIONS.CALIBRATION_PROOF;
    expect(canonicalJson(mathPilotContractSchema.parse(old))).toBe(canonicalJson(old));
    expect(canonicalJson(mathModelAttemptSchema.parse(attempt))).toBe(canonicalJson(attempt));
    expect(mathPilotContractSchema.safeParse({...old,lrcCampaignScope:undefined}).success).toBe(false);
    expect(mathPilotContractSchema.safeParse({...contract,lrcFiniteScope:undefined}).success).toBe(false);
  });
  it("refuses changed fixed prose even with a newly self-consistent evidence digest",()=>{
    const altered={...contract,statement:"A different mathematical claim"};
    const forged=createLrcCampaignReferenceEvidence(digestMathPilotContract(altered),altered.lrcCampaignScope,evidence.admission.importedAt);
    expect(()=>assertLrcCampaignBinding(altered,forged)).toThrow();
  });
  it("capability is default OFF and refuses production/staging",()=>{
    const base={NODE_ENV:"test",DATABASE_URL:"postgresql://dummy:dummy@localhost/test",BETTER_AUTH_SECRET:"test-secret-at-least-16-chars"};
    expect(parseEnv(base).LRC_CAMPAIGN_LOCAL_ENABLED).toBe(false);
    expect(parseEnv({...base,LRC_CAMPAIGN_LOCAL_ENABLED:"true"}).LRC_CAMPAIGN_LOCAL_ENABLED).toBe(true);
    expect(()=>parseEnv({...base,DEPLOYMENT_ENV:"staging",LRC_CAMPAIGN_LOCAL_ENABLED:"true"})).toThrow(/LRC_CAMPAIGN_LOCAL_ENABLED/);
    for(const env of ["production","staging",""]) expect(()=>requireLrcCampaignCapability(true,env)).toThrow();
    expect(()=>requireLrcCampaignCapability(false,"test")).toThrow();
  });
  it.each(["question","scope","query"])("solver refuses wrong %s before any CLI",async(field)=>{
    vi.stubEnv("DATABASE_URL","postgresql://dummy:dummy@localhost/test");vi.stubEnv("BETTER_AUTH_SECRET","test-secret-at-least-16-chars");vi.stubEnv("LRC_CAMPAIGN_LOCAL_ENABLED","true");resetEnvCache();
    const input={missionId:"mission",documentId:null,question:contract.statement,scope:mathPilotScope(contract),providerName:"codex-local",modelName:"stub-solver",
      sourcePolicy:{allowedDomains:[],primaryDomains:[],requirePrimary:false,maxSources:5},queryPlan:{queries:[contract.statement],languages:["en" as const]},
      mathPilot:{caseType:"LRC_CAMPAIGN" as const,preset:"ALLIKVERE_P83_14_V1" as const},lrcCampaignEvidence:evidence};
    if(field==="query") input.queryPlan.queries=["wrong"];
    else input[field as "question"|"scope"]="wrong";
    await expect(new CodexLocalMathProvider("never-executed").execute(input)).rejects.toThrow(/brief differs/);
  });
  it("review bundle refuses campaigns rather than bypassing per-role admission",async()=>{
    await expect(new CodexLocalMathReviewer("never-executed").review(contract,{...attempt,lrcCampaignEvidence:evidence})).rejects.toThrow(/individually guarded/);
  });
  it("worker wiring admits before fence, preserves OFF controls and rejects campaign at Erdős entry",()=>{
    const worker=readFileSync("src/modules/research-sandbox/worker.ts","utf8"),cycle=readFileSync("src/modules/research-sandbox/math-cycle-kernel.ts","utf8");
    expect(worker.indexOf("runLrcCampaignReference")).toBeLessThan(worker.indexOf("data: { providerDispatchAttemptedAt"));
    expect(worker).toContain("guardedLrcCampaignCall(providerInput");expect(worker).toContain("Campaign case changed before retention");
    expect(cycle).toContain("contract.data.lrcFiniteScope || contract.data.lrcCampaignScope");
    expect(readFileSync(".env.example","utf8")).toContain("LRC_CAMPAIGN_LOCAL_ENABLED=false");
  });
});
