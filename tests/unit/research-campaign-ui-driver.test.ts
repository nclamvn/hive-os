import {beforeEach,describe,expect,it,vi} from "vitest";
import {canonicalJson,sha256} from "@/modules/execution-fabric/contracts";
import {createDomainProblemContract,resolveDomainAdapter} from "@/modules/research-sandbox/research-core-v3";

const mocks=vi.hoisted(()=>({guard:vi.fn(),authorize:vi.fn(),organization:vi.fn(),tenant:vi.fn(),request:vi.fn(),get:vi.fn(),dispatch:vi.fn(),worker:vi.fn(),grade:vi.fn(),profile:vi.fn()}));
vi.mock("@/modules/authorization",()=>({requireWorkspaceAuthorization:mocks.authorize,organizationIdForWorkspace:mocks.organization}));
vi.mock("@/modules/research-sandbox/research-campaign/source-bundle",()=>({assertControlledCampaignEnvironment:mocks.guard}));
vi.mock("@/server/tenant-context",()=>({withOrganizationTenant:mocks.tenant}));
vi.mock("@/modules/research-sandbox/research-campaign",()=>({requestResearchCampaign:mocks.request,getResearchCampaign:mocks.get}));
vi.mock("@/modules/command-runtime/kernel",()=>({dispatchOutboxBatch:mocks.dispatch}));
vi.mock("@/server/workers/research-campaign-cycle",()=>({runResearchCampaignWorkerCycle:mocks.worker}));
vi.mock("@/modules/research-sandbox/research-evaluation-v3/kernel",()=>({evaluateRetainedPair:mocks.grade}));
vi.mock("@/modules/research-sandbox/research-evaluation-v3/fixed-campaign-catalog",()=>({controlledCampaignProfile:mocks.profile}));
import {runControlledUiCampaign,isCampaignUiQaAvailable} from "@/server/operations/research-campaign-ui-control";

const ctx={workspace:{id:"workspace-ui"},user:{id:"user-ui"}} as never;
const input={missionId:"mission-ui",profileId:"catalog-ui",idempotencyKey:"owned-ui-nonce"};
const prepared=createDomainProblemContract({id:"ui-driver-control",rootId:"SYNTHETIC_DRIVER_CONTROL",target:"Exact driver control",mode:"ENGINEERING",adapterId:"INTEGER_WITNESS",input:{kind:"LINEAR_WITNESS",coefficients:["1","1"],rhs:"5"},obligationId:"driver-exact"});
const profile={id:"catalog-ui",contract:prepared.contract,envelopeMethods:["LINEAR_SUBSTITUTION"],candidateBytes:'{"values":["2","3"]}'};
beforeEach(()=>{
  vi.resetAllMocks();mocks.organization.mockResolvedValue("org-ui");mocks.profile.mockReturnValue(profile);mocks.tenant.mockResolvedValue(null);
  mocks.request.mockResolvedValue({status:"SUCCEEDED",outcome:{campaignId:"campaign-ui"},outboxEventIds:["exact-outbox-ui"]});
  mocks.get.mockResolvedValueOnce({status:"QUEUED",state:{stage:null}}).mockResolvedValue({status:"COMPLETED",state:{stage:{candidateKey:"retained-own-candidate"}}});
  mocks.dispatch.mockResolvedValue({jobIds:["exact-job-ui"]});mocks.worker.mockResolvedValue({});mocks.grade.mockResolvedValue({});
});

describe("TIP076D generic UI driver (synthetic authority controls)",()=>{
  it("environment refusal precedes any authorization or database read",async()=>{mocks.guard.mockImplementation(()=>{throw new Error("QA_ONLY");});expect(isCampaignUiQaAvailable()).toBe(false);await expect(runControlledUiCampaign(ctx,input)).rejects.toThrow("QA_ONLY");expect(mocks.authorize).not.toHaveBeenCalled();expect(mocks.tenant).not.toHaveBeenCalled();});
  it("requires mission request and review before effect",async()=>{await runControlledUiCampaign(ctx,input);expect(mocks.authorize.mock.calls.map(c=>c.slice(1))).toEqual([["research.request","mission-ui"],["research.review","mission-ui"]]);});
  it("dispatches and claims only exact returned own outbox/job identities",async()=>{await runControlledUiCampaign(ctx,input);expect(mocks.dispatch.mock.calls[0][0].outboxIds).toEqual(["exact-outbox-ui"]);const call=mocks.worker.mock.calls[0][0];expect(call.campaign.jobIds).toEqual(["exact-job-ui"]);expect(call.campaign.outboxIds).toEqual([]);expect(call.claimFirst).toBe(1);});
  it("predeclares bounded compute and separate charged postgrade pool",async()=>{await runControlledUiCampaign(ctx,input);const envelope=mocks.request.mock.calls[0][1].envelope;expect(envelope.total.computeMilliseconds).toBe(150000);expect(envelope.total.readBytes).toBe(16777216);expect(envelope.postgrade.total.computeMilliseconds).toBe(120000);expect(envelope.total.checkerOperations).toBe(2*resolveDomainAdapter("INTEGER_WITNESS").limits.maxOperations);});
  it("controlled transport returns catalog bytes with no attested live model",async()=>{await runControlledUiCampaign(ctx,input);const provider=mocks.worker.mock.calls[0][0].campaign.provider;const result=await provider.execute({signal:new AbortController().signal});expect(result).toEqual({originalBytes:profile.candidateBytes,attestedModel:null,usage:{tokens:100,provenance:"CONTROLLED_PROVIDER_LOG"}});const abort=new AbortController();abort.abort();await expect(provider.execute({signal:abort.signal})).rejects.toThrow("CONTROL_ABORTED");});
  it("postgrades retained own candidate via an exact separate idempotency identity",async()=>{expect(await runControlledUiCampaign(ctx,input)).toEqual({campaignId:"campaign-ui"});expect(mocks.grade).toHaveBeenCalledWith(ctx,{campaignId:"campaign-ui",idempotencyKey:"owned-ui-nonce:postgrade"});});
  it("refuses unavailable exact job rather than claiming another",async()=>{mocks.dispatch.mockResolvedValue({jobIds:[]});await expect(runControlledUiCampaign(ctx,input)).rejects.toThrow("CONTROL_EXACT_JOB_UNAVAILABLE");expect(mocks.worker).not.toHaveBeenCalled();});
  it("refuses unfinished nonfresh stage without crossing provider boundary",async()=>{mocks.get.mockReset().mockResolvedValue({status:"PAUSED_FOR_DECISION",state:{stage:{fence:"STARTED"}}});await expect(runControlledUiCampaign(ctx,input)).rejects.toThrow("CONTROL_NOT_FRESH_QUEUED");expect(mocks.worker).not.toHaveBeenCalled();});
  it("repeated exact owned command reads retained original envelope without a new effect",async()=>{
    await runControlledUiCampaign(ctx,input);const original=mocks.request.mock.calls[0][1].envelope;
    const old={...original,stop:{...original.stop,deadlineAt:"2020-01-01T00:00:00.000Z"}};
    const digest=sha256(canonicalJson(old)),payload={missionId:"mission-ui",contractDigest:prepared.contractDigest,envelopeDigest:digest,sourceBundleDigest:"a".repeat(64)};
    mocks.tenant.mockResolvedValue({commandType:"research.campaign.v3.approve",workspaceId:"workspace-ui",actorUserId:"user-ui",status:"SUCCEEDED",payload,payloadHash:sha256(canonicalJson(payload)),outcome:{campaignId:"campaign-ui"}});
    mocks.get.mockReset().mockResolvedValue({id:"campaign-ui",missionId:"mission-ui",contract:prepared.contract,contractDigest:prepared.contractDigest,envelope:old,envelopeDigest:digest,sourceBundleDigest:"a".repeat(64)});
    mocks.request.mockClear();mocks.dispatch.mockClear();mocks.worker.mockClear();mocks.grade.mockClear();
    expect(await runControlledUiCampaign(ctx,input)).toEqual({campaignId:"campaign-ui"});expect(mocks.request).not.toHaveBeenCalled();expect(mocks.dispatch).not.toHaveBeenCalled();expect(mocks.worker).not.toHaveBeenCalled();expect(mocks.grade).not.toHaveBeenCalled();
  });
  it("same idempotency key cannot adopt another actor command",async()=>{mocks.tenant.mockResolvedValue({commandType:"research.campaign.v3.approve",workspaceId:"workspace-ui",actorUserId:"other-user",status:"SUCCEEDED"});await expect(runControlledUiCampaign(ctx,input)).rejects.toThrow("CONTROL_EXISTING_IDENTITY_REFUSED");expect(mocks.worker).not.toHaveBeenCalled();});
});
