import { describe,it,expect,vi,afterEach } from "vitest";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { revokePoly19Showcase } from "@/modules/research-showcase/kernel";

const ports=vi.hoisted(()=>({command:vi.fn(),lock:vi.fn(),append:vi.fn(),authorize:vi.fn()}));
vi.mock("@/modules/command-runtime",()=>({executeDurableCommand:ports.command}));
vi.mock("@/modules/authorization",()=>({requireWorkspaceAuthorization:ports.authorize,organizationIdForWorkspace:vi.fn()}));
vi.mock("@/server/tenant-context",()=>({withOrganizationTenant:vi.fn()}));
vi.mock("@/modules/research-showcase/source",()=>({assertShowcaseEnvironment:vi.fn(),isShowcaseAvailable:vi.fn(),loadShowcaseBundle:vi.fn()}));
vi.mock("@/modules/research-showcase/store",()=>({lockShowcase:ports.lock,appendShowcaseEvent:ports.append,loadShowcaseCut:vi.fn(),projectShowcaseView:vi.fn(),readShowcaseBytes:vi.fn()}));

const runId="00000000-0000-4000-8000-000000000001",otherId="00000000-0000-4000-8000-000000000002";
const ctx={user:{id:"actor"},workspace:{id:"workspace"}} as WorkspaceContext;
const request={runId,expectedVersion:7,idempotencyKey:"TIP079-unit-revoke"};
const stable=(outcome:unknown)=>({status:"SUCCEEDED",outcome,outboxEventIds:["observation"]});
afterEach(()=>vi.resetAllMocks());
describe("TIP079A pure revocation command admission, no DB or provider",()=>{
  it("rejects returned FAILED instead of falsely reporting revocation",async()=>{
    ports.command.mockResolvedValue({status:"FAILED",outcome:{},outboxEventIds:["command-failed"],errorCode:"INVALID_EFFECT"});
    await expect(revokePoly19Showcase(ctx,request)).rejects.toThrow("Authenticated showcase revocation refused");
  });
  it.each([{runId:otherId,version:8},{runId,version:9},{runId,version:"8"},null])("rejects wrong/unnormalized successful outcome %j",async outcome=>{
    ports.command.mockResolvedValue(stable(outcome));await expect(revokePoly19Showcase(ctx,request)).rejects.toThrow();
  });
  it("emits exactly one observational outbox and returns exact success",async()=>{
    ports.lock.mockResolvedValue({id:runId,workspaceId:"workspace",version:7,revokedAt:null});ports.append.mockResolvedValue({version:8});
    const effects:unknown[]=[];
    type Handler=(tx:unknown,command:{organizationId:string;workspaceId:string})=>Promise<{outcome:unknown;outbox:unknown[]}>;
    ports.command.mockImplementation(async(_ctx:unknown,_envelope:unknown,handler:Handler)=>{const effect=await handler({}, {organizationId:"org",workspaceId:"workspace"});effects.push(effect);return stable(effect.outcome);});
    const result=await revokePoly19Showcase(ctx,request);expect(result).toEqual(stable({runId,version:8}));
    expect(effects).toEqual([{outcome:{runId,version:8},outbox:[{topic:"research.showcase.poly19.revoked",aggregateType:"ResearchShowcaseRun",aggregateId:runId,payload:{runId,version:8}}]}]);
    expect(ports.append.mock.calls[0][2]).toBe("REVOKED");
  });
});
