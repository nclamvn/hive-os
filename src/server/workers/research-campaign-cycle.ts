import { claimJobs, failJob } from "@/modules/command-runtime/jobs";
import { dispatchOutboxBatch } from "@/modules/command-runtime/kernel";
import { executeResearchCampaignJob } from "@/modules/research-sandbox/research-campaign/worker";
import { campaignJobType, type CampaignWorkerInput } from "@/modules/research-sandbox/research-campaign/contracts";
import { assertControlledCampaignEnvironment } from "@/modules/research-sandbox/research-campaign/source-bundle";

export interface ResearchCampaignWorkerConfig {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  correlationId: string;
  claimFirst?: number;
  campaign: Pick<CampaignWorkerInput,"provider"|"onBoundary"> & {
    jobIds: readonly string[];
    outboxIds: readonly string[];
    leaseSeconds?: number;
  };
}

/** Import isolation only: all queue/claim/lease semantics remain in the existing
 * command runtime. No legacy scientific runner or live adapter is imported. */
export async function runResearchCampaignWorkerCycle(config: ResearchCampaignWorkerConfig) {
  assertControlledCampaignEnvironment();
  if(config.campaign.provider.kind!=="CONTROLLED_LOCAL" || !Array.isArray(config.campaign.jobIds) || !Array.isArray(config.campaign.outboxIds)) {
    throw new Error("Controlled campaign requires exact approved job/outbox selection");
  }
  const dispatched=await dispatchOutboxBatch({organizationId:config.organizationId,actorUserId:config.actorUserId,
    workerId:`${config.workerId}:dispatcher`,first:50,outboxIds:config.campaign.outboxIds});
  const jobs=await claimJobs({organizationId:config.organizationId,actorUserId:config.actorUserId,workerId:config.workerId,
    jobTypes:[campaignJobType],first:config.claimFirst??4,leaseSeconds:config.campaign.leaseSeconds??1800,jobIds:config.campaign.jobIds});
  let succeeded=0,failed=0;
  for(const job of jobs) {
    try {
      if(job.jobType!==campaignJobType) throw new Error("Campaign facade received an unrelated job");
      const result=await executeResearchCampaignJob({organizationId:config.organizationId,actorUserId:config.actorUserId,
        workerId:config.workerId,jobId:job.id,expectedVersion:job.version,provider:config.campaign.provider,onBoundary:config.campaign.onBoundary});
      if(["COMPLETED","QUEUED"].includes(result.status)) succeeded++;else failed++;
    } catch {
      await failJob({organizationId:config.organizationId,actorUserId:config.actorUserId,workerId:config.workerId,
        jobId:job.id,expectedVersion:job.version,errorCode:"ADAPTER_EXECUTION_FAILED",
        errorMessage:"The governed adapter could not execute this job",retryable:false}).catch(()=>undefined);
      failed++;
    }
  }
  return {dispatched:dispatched.dispatched,claimed:jobs.length,succeeded,failed};
}
