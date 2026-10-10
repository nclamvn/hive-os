import {beforeEach,describe,expect,it,vi} from "vitest";

const mocks=vi.hoisted(()=>({guard:vi.fn(),headers:vi.fn(),context:vi.fn(),run:vi.fn(),revoke:vi.fn(),redirect:vi.fn(),revalidate:vi.fn()}));
vi.mock("next/headers",()=>({headers:mocks.headers}));
vi.mock("next/navigation",()=>({redirect:mocks.redirect}));
vi.mock("next/cache",()=>({revalidatePath:mocks.revalidate}));
vi.mock("@/modules/identity-workspace",()=>({resolveWorkspaceContext:mocks.context}));
vi.mock("@/modules/research-sandbox/research-campaign/source-bundle",()=>({assertControlledCampaignEnvironment:mocks.guard}));
vi.mock("@/modules/research-sandbox/research-campaign",()=>({revokeResearchCampaign:mocks.revoke}));
vi.mock("@/server/operations/research-campaign-ui-control",()=>({runControlledUiCampaign:mocks.run}));
import {runControlledResearchCampaignAction,revokeResearchCampaignAction} from "@/app/actions/research-campaign";

const ctx={authenticated:"synthetic-session-only"};
function form(extra:Record<string,string>={}){const data=new FormData();for(const [key,value] of Object.entries({slug:"workspace-ui",missionId:"mission-ui",profileId:"catalog-ui",idempotencyKey:"own-ui-nonce",campaignId:"campaign-ui",expectedVersion:"4",...extra}))data.set(key,value);return data;}
beforeEach(()=>{vi.resetAllMocks();mocks.headers.mockResolvedValue(new Headers());mocks.context.mockResolvedValue(ctx);mocks.run.mockResolvedValue({campaignId:"campaign-ui"});mocks.revoke.mockResolvedValue({});});
describe("TIP076D authenticated server ingress (synthetic request controls)",()=>{
  it("guards each run action before resolving context or dispatch",async()=>{mocks.guard.mockImplementation(()=>{throw new Error("QA_ONLY");});await runControlledResearchCampaignAction(form());expect(mocks.context).not.toHaveBeenCalled();expect(mocks.run).not.toHaveBeenCalled();expect(mocks.redirect.mock.calls[0][0]).toContain("campaignAction=refused");});
  it("guards each revocation action independently",async()=>{mocks.guard.mockImplementation(()=>{throw new Error("QA_ONLY");});await revokeResearchCampaignAction(form());expect(mocks.context).not.toHaveBeenCalled();expect(mocks.revoke).not.toHaveBeenCalled();});
  it("passes only session-derived context and bounded public profile identity",async()=>{await runControlledResearchCampaignAction(form({provider:"LIVE_UNTRUSTED",candidateBytes:"arbitrary"}));expect(mocks.context).toHaveBeenCalledWith(expect.any(Headers),"workspace-ui");expect(mocks.run).toHaveBeenCalledWith(ctx,{missionId:"mission-ui",profileId:"catalog-ui",idempotencyKey:"own-ui-nonce"});expect(mocks.redirect.mock.calls[0][0]).toContain("campaignId=campaign-ui");});
  it("permission/context refusal does not dispatch and exposes no sensitive message",async()=>{mocks.context.mockRejectedValue(new Error("private sensitive source path"));await runControlledResearchCampaignAction(form());expect(mocks.run).not.toHaveBeenCalled();expect(mocks.redirect.mock.calls[0][0]).toContain("campaignAction=refused");expect(mocks.redirect.mock.calls[0][0]).not.toContain("sensitive");});
  it("rejects path-like client fields before any action",async()=>{await expect(runControlledResearchCampaignAction(form({slug:"../other-workspace"}))).rejects.toThrow("CONTROL_INPUT_REFUSED");expect(mocks.context).not.toHaveBeenCalled();expect(mocks.run).not.toHaveBeenCalled();});
  it("rejects overlong command identity before any effect",async()=>{await expect(runControlledResearchCampaignAction(form({idempotencyKey:"a".repeat(201)}))).rejects.toThrow("CONTROL_INPUT_REFUSED");expect(mocks.run).not.toHaveBeenCalled();});
  it("requires safe retained version for revoke rather than a blind reset",async()=>{await revokeResearchCampaignAction(form({expectedVersion:"0"}));expect(mocks.revoke).not.toHaveBeenCalled();expect(mocks.redirect.mock.calls[0][0]).toContain("campaignAction=refused");});
  it("preserves exact version/idempotency fences when revoking own campaign",async()=>{await revokeResearchCampaignAction(form());expect(mocks.revoke).toHaveBeenCalledWith(ctx,{id:"campaign-ui",expectedVersion:4,idempotencyKey:"own-ui-nonce"});expect(mocks.redirect.mock.calls[0][0]).not.toContain("campaignAction=refused");});
});
