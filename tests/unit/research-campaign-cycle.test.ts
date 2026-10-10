import { beforeEach,describe,expect,it,vi } from "vitest";
import type { ControlledCampaignProvider } from "@/modules/research-sandbox/research-campaign/contracts";

const ports=vi.hoisted(()=>({guard:vi.fn(),dispatch:vi.fn(),claim:vi.fn(),execute:vi.fn(),fail:vi.fn()}));
vi.mock("@/modules/command-runtime/jobs",()=>({claimJobs:ports.claim,failJob:ports.fail}));
vi.mock("@/modules/command-runtime/kernel",()=>({dispatchOutboxBatch:ports.dispatch}));
vi.mock("@/modules/research-sandbox/research-campaign/worker",()=>({executeResearchCampaignJob:ports.execute}));
vi.mock("@/modules/research-sandbox/research-campaign/source-bundle",()=>({assertControlledCampaignEnvironment:ports.guard}));

import { runResearchCampaignWorkerCycle,type ResearchCampaignWorkerConfig } from "@/server/workers/research-campaign-cycle";
const provider:ControlledCampaignProvider={kind:"CONTROLLED_LOCAL",requestedModel:"unit-control",execute:vi.fn()};
const config=():ResearchCampaignWorkerConfig=>({organizationId:"org",actorUserId:"actor",workerId:"worker",correlationId:"correlation",
  campaign:{provider,jobIds:["owned-job"],outboxIds:["owned-outbox"],leaseSeconds:30}});
beforeEach(()=>{
  vi.resetAllMocks();ports.dispatch.mockResolvedValue({dispatched:1,jobIds:["owned-job"]});
  ports.claim.mockResolvedValue([{id:"owned-job",version:7,jobType:"research.campaign.v3.round"}]);
  ports.execute.mockResolvedValue({status:"COMPLETED"});ports.fail.mockResolvedValue(undefined);
});
describe("campaign-only import facade (mocked port unit controls, not DB evidence)",()=>{
  it("delegates exact selectors and current lease/version to the same existing runtime",async()=>{
    const input=config(),onBoundary=vi.fn();input.campaign.onBoundary=onBoundary;
    expect(await runResearchCampaignWorkerCycle(input)).toEqual({dispatched:1,claimed:1,succeeded:1,failed:0});
    expect(ports.dispatch).toHaveBeenCalledExactlyOnceWith({organizationId:"org",actorUserId:"actor",workerId:"worker:dispatcher",first:50,outboxIds:["owned-outbox"]});
    expect(ports.claim).toHaveBeenCalledExactlyOnceWith({organizationId:"org",actorUserId:"actor",workerId:"worker",jobTypes:["research.campaign.v3.round"],first:4,leaseSeconds:30,jobIds:["owned-job"]});
    expect(ports.execute).toHaveBeenCalledExactlyOnceWith({organizationId:"org",actorUserId:"actor",workerId:"worker",jobId:"owned-job",expectedVersion:7,provider,onBoundary});
  });
  it("refuses a missing exact selector before any queue mutation",async()=>{
    const input=config();input.campaign.jobIds=undefined as unknown as string[];
    await expect(runResearchCampaignWorkerCycle(input)).rejects.toThrow("exact approved");
    expect(ports.dispatch).not.toHaveBeenCalled();expect(ports.claim).not.toHaveBeenCalled();
  });
  it("enforces controlled environment before queue ports",async()=>{
    ports.guard.mockImplementation(()=>{throw new Error("QA guard");});
    await expect(runResearchCampaignWorkerCycle(config())).rejects.toThrow("QA guard");
    expect(ports.dispatch).not.toHaveBeenCalled();
  });
  it("never widens explicit empty selectors and preserves default lease semantics",async()=>{
    const input=config();input.campaign.jobIds=[];input.campaign.outboxIds=[];delete input.campaign.leaseSeconds;
    ports.dispatch.mockResolvedValue({dispatched:0,jobIds:[]});ports.claim.mockResolvedValue([]);
    expect(await runResearchCampaignWorkerCycle(input)).toEqual({dispatched:0,claimed:0,succeeded:0,failed:0});
    expect(ports.claim.mock.calls[0][0]).toMatchObject({jobIds:[],leaseSeconds:1800});expect(ports.dispatch.mock.calls[0][0].outboxIds).toEqual([]);
    expect(ports.execute).not.toHaveBeenCalled();
  });
  it("sanitizes failure without exposing provider text or inventing retries",async()=>{
    ports.execute.mockRejectedValue(new Error("untrusted sensitive provider body"));
    expect(await runResearchCampaignWorkerCycle(config())).toMatchObject({failed:1,succeeded:0});
    expect(ports.fail).toHaveBeenCalledExactlyOnceWith({organizationId:"org",actorUserId:"actor",workerId:"worker",jobId:"owned-job",expectedVersion:7,
      errorCode:"ADAPTER_EXECUTION_FAILED",errorMessage:"The governed adapter could not execute this job",retryable:false});
    expect(ports.execute).toHaveBeenCalledTimes(1);
  });
  it("retained worker pause/failure counts as failed without a second worker call",async()=>{
    ports.execute.mockResolvedValue({status:"PAUSED_FOR_DECISION"});
    expect(await runResearchCampaignWorkerCycle(config())).toMatchObject({failed:1,succeeded:0});
    expect(ports.execute).toHaveBeenCalledTimes(1);expect(ports.fail).not.toHaveBeenCalled();
  });
});
