import { beforeEach,describe,expect,it,vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { CampaignView } from "@/modules/research-sandbox/research-campaign/contracts";
import { createDomainProblemContract } from "@/modules/research-sandbox/research-core-v3";
import { projectResearchCampaign } from "@/components/research/research-campaign-presentation";

const mocks=vi.hoisted(()=>({qa:vi.fn(),list:vi.fn(),observe:vi.fn()}));
vi.mock("@/server/operations/research-campaign-ui-control",()=>({isCampaignUiQaAvailable:mocks.qa}));
vi.mock("@/modules/research-sandbox/research-campaign",()=>({listResearchCampaigns:mocks.list}));
vi.mock("@/modules/research-sandbox/research-evaluation-v3/kernel",()=>({getCampaignEvidenceObservation:mocks.observe}));
vi.mock("@/app/actions/research-campaign",()=>({runControlledResearchCampaignAction:async()=>{},revokeResearchCampaignAction:async()=>{}}));
import { ResearchCampaignRegion } from "@/components/research/research-campaign-region";

function fixture():CampaignView {
  const p=createDomainProblemContract({id:"synthetic-ui",rootId:"SYNTHETIC_SOFTWARE_CONTROL",target:"Exact UI observation control",mode:"ENGINEERING",adapterId:"INTEGER_WITNESS",input:{kind:"LINEAR_WITNESS",coefficients:["1","1"],rhs:"5"},obligationId:"exact-scope"});
  return {
    id:"campaign-control",organizationId:"org-control",workspaceId:"workspace-control",missionId:"mission-control",version:5,contract:p.contract,contractDigest:p.contractDigest,
    envelope:{total:{calls:2,tokens:2000,checkerOperations:1200000,computeMilliseconds:150000,readBytes:16777216,writeBytes:4194304},postgrade:{total:{calls:0,tokens:0,checkerOperations:1200000,computeMilliseconds:120000,readBytes:16777216,writeBytes:4194304}}},
    sourceBundleDigest:"a".repeat(64),authorityEpoch:"synthetic",status:"PAUSED_FOR_DECISION",complete:true,eventCut:{sequence:5,digest:"b".repeat(64)},revokedAt:null,
    state:{nextAction:"DECIDE_UNKNOWN_EFFECT",spent:{calls:1,tokens:1000,checkerOperations:600000,computeMilliseconds:5000,readBytes:1048576,writeBytes:8192},
      observedTokens:null,attestedModel:null,accountingComplete:false,rounds:1,retiredCandidateDigests:["c".repeat(64)],closure:null,
      stage:{fence:"STARTED",receipt:null},stopReason:"UNKNOWN_EXTERNAL_EFFECT",failure:"TRANSPORT",executionFailure:null,replacements:0,verifierReplays:0,diagnosticSpent:{incidents:1,readBytes:256,milliseconds:2},postgradeSpent:{calls:0,tokens:0,checkerOperations:600000,computeMilliseconds:25000,readBytes:1024,writeBytes:2048}},
    events:[{sequence:5,eventType:"UNKNOWN_EXTERNAL_EFFECT"}],
  } as unknown as CampaignView;
}
const props={ctx:{} as never,locale:"en" as const,workspaceSlug:"qa-control",missionId:"mission-control",canRequest:true,canReview:true};
async function html(extra:Partial<Parameters<typeof ResearchCampaignRegion>[0]>={}) {return renderToStaticMarkup(await ResearchCampaignRegion({...props,...extra}));}
beforeEach(()=>{vi.clearAllMocks();mocks.qa.mockReturnValue(true);mocks.list.mockResolvedValue([fixture()]);mocks.observe.mockResolvedValue({campaign:fixture(),grade:null});});
describe("TIP076D campaign operator presentation (synthetic render controls)",()=>{
  it("refuses new table reads outside exact isolated QA",async()=>{mocks.qa.mockReturnValue(false);const h=await html();expect(h).toContain("Engineering lane inactive");expect(mocks.list).not.toHaveBeenCalled();expect(mocks.observe).not.toHaveBeenCalled();expect(h).not.toContain("name=\"profileId\"");});
  it("renders null measured usage UNKNOWN while separating reserved TOTAL",async()=>{const h=await html();expect(h).toContain("Permanently reserved / charged TOTAL");expect(h).toContain("Observed actual usage");expect(h).toContain("UNKNOWN");expect(h).toContain("1,000 / 2,000");});
  it("renders exact goal and open obligation before next action",async()=>{const h=await html();expect(h.indexOf("Exact UI observation control")).toBeLessThan(h.indexOf("Open obligations"));expect(h.indexOf("Open obligations")).toBeLessThan(h.indexOf("DECIDE_UNKNOWN_EFFECT"));});
  it("preserves unknown external effects without a blind retry control",async()=>{const h=await html();expect(h).toContain("External boundary crossed");expect(h).toContain("UNKNOWN_EXTERNAL_EFFECT");expect(h).not.toContain(">Retry</button>");expect(h).not.toContain(">Reset</button>");});
  it("shows only consequential revocation and one explicit engineering action",async()=>{const h=await html();expect(h).toContain("Revoke campaign authority");expect(h).toContain("Run controlled campaign");expect(h).toContain("CONTROLLED_LOCAL");expect(h).not.toContain("name=\"provider\"");expect(h).not.toContain("name=\"candidateBytes\"");});
  it("honors request/review permissions in visible actions",async()=>{const h=await html({canRequest:false,canReview:false});expect(h).not.toContain("Run controlled campaign");expect(h).not.toContain("Revoke campaign authority");});
  it("invalid retained chain displays no accepted result",async()=>{mocks.list.mockRejectedValue(new Error("sensitive private path"));const h=await html();expect(h).toContain("Retained campaign could not be validated");expect(h).not.toContain("sensitive private path");expect(h).not.toContain("data-postgrade-status");});
  it("rejects unavailable selected campaign without adopting latest record",async()=>{const h=await html({campaignId:"not-in-mission"});expect(h).toContain("selected campaign is unavailable");expect(mocks.observe).not.toHaveBeenCalled();expect(h).not.toContain("data-campaign-id");});
  it("scopes observations to selected mission before reading evidence",async()=>{const h=await html({missionId:"other-mission"});expect(h).toContain("No retained campaign in this mission");expect(mocks.observe).not.toHaveBeenCalled();});
  it("uses one authenticated evidence cut rather than stale listed state",async()=>{const current=fixture();current.state.nextAction="CURRENT_VALIDATED_CUT";mocks.observe.mockResolvedValue({campaign:current,grade:null});const h=await html();expect(h).toContain("CURRENT_VALIDATED_CUT");expect(h).not.toContain("DECIDE_UNKNOWN_EFFECT");});
  it("does not equate scoped completion with global or empirical acceptance",async()=>{const current=fixture();current.status="COMPLETED";current.state.closure={status:"CLOSED_EXACT_SCOPE",obligationId:"exact-scope"} as never;mocks.observe.mockResolvedValue({campaign:current,grade:{status:"ACCEPTED_EXACT_SCOPE"}});const h=await html();expect(h).toContain("Exact obligation checked");expect(h).toContain("ACCEPTED_EXACT_SCOPE");expect(h).toContain("COMPLETED means this engineering control only");expect(h).toContain("NOT_RUN");expect(h).toContain("UNDEFINED");expect(h).not.toContain("Revoke campaign authority");});
  it("preserves VN copy and semantic theme/focus/MathText classes",async()=>{const h=await html({locale:"vi"});expect(h).toContain("Nghĩa vụ còn mở");expect(h).toContain("Chạy chiến dịch đối chứng");expect(h).toContain("bg-surface");expect(h).toContain("focus-visible:outline");expect(h).toContain("scroll-mt-24");expect(h).toContain("math-rich-text");});
  it("records permanent charge values verbatim, never as measured token usage",()=>{const view=projectResearchCampaign(fixture(),null);expect(view.reserved.tokens).toBe(1000);expect(view.observedTokens).toBeNull();expect(view.widerResearchStatus).toBe("NOT_ESTABLISHED");});
  it("counts successful retained candidates rather than only retired candidates",()=>{const current=fixture();current.state.retiredCandidateDigests=[];current.events=[{sequence:5,eventType:"RESULT_RETAINED"}] as never;expect(projectResearchCampaign(current,null).retainedCandidateCount).toBe(1);});
  it("shows a source execution failure even after scoped mathematical completion",async()=>{const current=fixture();current.status="COMPLETED";current.state.executionFailure="INTEGRITY";current.events=[{sequence:6,eventType:"EXECUTION_REFUSED",payload:{detail:{failure:"INTEGRITY"},state:{stopReason:"SOURCE_INTEGRITY_REFUSED"}}}] as never;mocks.observe.mockResolvedValue({campaign:current,grade:null});const h=await html();expect(h).toContain("Execution / source failure: INTEGRITY");expect(h).toContain("EXECUTION_REFUSED · INTEGRITY · SOURCE_INTEGRITY_REFUSED");});
  it("shows independent postgrade reservations as a separate charged pool",async()=>{const h=await html();expect(h).toContain("Separate post-run reservations");expect(h).toContain("600,000 / 1,200,000");expect(h).toContain("SIMULATED test accounting");});
});
