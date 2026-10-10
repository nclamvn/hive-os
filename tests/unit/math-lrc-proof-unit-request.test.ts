import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { proofContract, proofRequest } from "../fixtures/lrc-proof-unit-live";
import { MATH_LRC_CAMPAIGN_CONTRACT, mathPilotScope } from "@/modules/research-sandbox/math-pilot";
const f=vi.hoisted(()=>({command:vi.fn(),cases:vi.fn(),terminal:vi.fn(),create:vi.fn()}));
vi.mock("@/modules/authorization",()=>({requireWorkspaceAuthorization:vi.fn(),organizationIdForWorkspace:vi.fn(async()=>"org")}));
vi.mock("@/modules/command-runtime",()=>({executeDurableCommand:f.command}));
vi.mock("@/modules/identity-workspace",()=>({AuditEventType:{},writeAuditEvent:vi.fn()}));
vi.mock("@/server/env",()=>({getEnv:()=>({RESEARCH_CODEX_LOCAL_ENABLED:true,MATH_PILOT_QUEUE_ENABLED:true,LRC_CAMPAIGN_LOCAL_ENABLED:true})}));
import { requestResearchRun } from "@/modules/research-sandbox/kernel";
const ctx={workspace:{id:"workspace"},user:{id:"actor"},membership:{id:"membership"}} as WorkspaceContext;
beforeEach(()=>{
  vi.stubEnv("NODE_ENV","test");f.command.mockImplementation(async(_ctx:unknown,_command:unknown,work:(tx:unknown,command:unknown)=>unknown)=>work({
    mission:{findFirst:vi.fn(async()=>({id:"mission"}))},$queryRaw:vi.fn(async()=>[]),mathPilotCase:{findMany:f.cases,create:f.create},durableJob:{findFirst:f.terminal},researchRun:{create:f.create},
  },{organizationId:"org",workspaceId:"workspace"}));
  f.terminal.mockResolvedValue({id:"old-dead-letter"});
});
afterEach(()=>{vi.clearAllMocks();vi.unstubAllEnvs();});
function request(){return {missionId:"mission",documentId:null,question:proofContract.statement,scope:mathPilotScope(proofContract),providerName:"codex-local",modelName:"gpt-6-sol",
  sourcePolicy:{allowedDomains:[],primaryDomains:[],requirePrimary:false,maxSources:1},queryPlan:{queries:[proofContract.statement],languages:["en"]},mathPilot:proofRequest,idempotencyKey:"offline-prospective-request"};}
describe("TIP-064 actual authorized request handler with command transaction injected",()=>{
  it("wrong model is rejected before a command/run/case is created",async()=>{
    await expect(requestResearchRun(ctx,{...request(),modelName:"other-model"})).rejects.toThrow("fixed local Codex lane");expect(f.command).not.toHaveBeenCalled();expect(f.create).not.toHaveBeenCalled();
  });
  it.each(["QUEUED","RUNNING"])("active %s cycle racing preflight blocks before terminal old-review exemption",async status=>{
    f.cases.mockResolvedValue([{id:"old-case",researchRun:{status:"AWAITING_REVIEW"},agentReview:null,researchCycles:[{id:`active-${status}`}]}]);
    await expect(requestResearchRun(ctx,request())).rejects.toThrow("active controlled cycle");expect(f.terminal).not.toHaveBeenCalled();expect(f.create).not.toHaveBeenCalled();
    expect(f.cases).toHaveBeenCalledWith(expect.objectContaining({select:expect.objectContaining({researchCycles:{where:{status:{in:["QUEUED","RUNNING"]}},select:{id:true},take:1}})}));
  });
  it("FAILED root with active cycle is included in v3 atomic predicate independent of root status",async()=>{
    f.cases.mockResolvedValue([{id:"failed-old-root",researchRun:{status:"FAILED"},agentReview:null,researchCycles:[{id:"running-cycle"}]}]);
    await expect(requestResearchRun(ctx,request())).rejects.toThrow("active controlled cycle");
    const query=f.cases.mock.calls[0][0];expect(query.where.AND[1].OR).toEqual(expect.arrayContaining([{researchCycles:{some:{status:{in:["QUEUED","RUNNING"]}}}}]));
    expect(f.terminal).not.toHaveBeenCalled();expect(f.create).not.toHaveBeenCalled();
  });
  it("historical v2 query shape/exemption stays unchanged",async()=>{
    f.cases.mockResolvedValueOnce([{id:"old-case",researchRun:{status:"AWAITING_REVIEW"},agentReview:null}]).mockResolvedValue([]);
    await expect(requestResearchRun(ctx,{...request(),mathPilot:{caseType:"LRC_CAMPAIGN",preset:"ALLIKVERE_P83_14_V1"},question:MATH_LRC_CAMPAIGN_CONTRACT.statement,
      scope:mathPilotScope(MATH_LRC_CAMPAIGN_CONTRACT),queryPlan:{queries:[MATH_LRC_CAMPAIGN_CONTRACT.statement],languages:["en"]}})).rejects.toThrow();
    expect(f.cases.mock.calls[0][0].select).not.toHaveProperty("researchCycles");expect(f.terminal).toHaveBeenCalledOnce();expect(f.create).not.toHaveBeenCalled();
  });
});
