import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { proofAttempt, proofContract } from "../fixtures/lrc-proof-unit-live";
import { commitmentChoice } from "../fixtures/math-research-commitment";
const f=vi.hoisted(()=>({load:vi.fn(),create:vi.fn(),execute:vi.fn()}));
vi.mock("@/modules/authorization",()=>({requireWorkspaceAuthorization:vi.fn(),organizationIdForWorkspace:vi.fn(async()=>"org")}));
vi.mock("@/modules/command-runtime",()=>({executeDurableCommand:(_ctx:unknown,_command:unknown,work:(tx:unknown)=>unknown)=>{
  f.execute();return work({mathPilotCase:{findFirst:f.load},mathResearchCycle:{create:f.create}});
}}));
vi.mock("@/server/env",()=>({getEnv:()=>({RESEARCH_CODEX_LOCAL_ENABLED:true,MATH_PILOT_QUEUE_ENABLED:true})}));
import { requestMathResearchCycle } from "@/modules/research-sandbox/math-cycle-kernel";
beforeEach(()=>{vi.stubEnv("NODE_ENV","test");});afterEach(()=>{vi.clearAllMocks();vi.unstubAllEnvs();});
describe("TIP-064 proof family refuses existing cycle/portfolio route before locks or model",()=>{
  it.each(["fixed-v3","malformed-scope","scope-key-undefined","attempt-marker","ledger6-marker"])("%s cannot fall through generic OPEN",async kind=>{
    const contract=kind==="fixed-v3"?proofContract:kind==="malformed-scope"?{...proofContract,lrcProofUnitScope:null}:kind==="scope-key-undefined"?{version:1,caseType:"OPEN",lrcProofUnitScope:undefined}:{version:1,caseType:"OPEN"};
    f.load.mockResolvedValue({contract,agentReview:{ledger:{version:kind==="ledger6-marker"?6:5}},researchRun:{mathModelAttempt:kind==="attempt-marker"?proofAttempt():null}});
    const ctx={workspace:{id:"workspace"}} as WorkspaceContext;
    await expect(requestMathResearchCycle(ctx,{caseId:"proof-case",maxRounds:1,maxObservedTokens:20000,commitment:{choice:commitmentChoice(),confirmed:true}})).rejects.toThrow("Proof-unit audits cannot enter controlled cycles or portfolios");
    expect(f.create).not.toHaveBeenCalled();expect(f.load).toHaveBeenCalledOnce();
  });
});
