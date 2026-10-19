import { appendFile } from "node:fs/promises";
import { config } from "dotenv";
import { z } from "zod";
import { runResearchSandboxWorkerCycle } from "@/server/workers/research-sandbox-cycle";
import { getDb } from "@/server/db";
import { resetEnvCache } from "@/server/env";
import { assertControlledCampaignEnvironment } from "@/modules/research-sandbox/research-campaign/source-bundle";

const schema=z.object({organizationId:z.string().uuid(),actorUserId:z.string().uuid(),jobIds:z.array(z.string()).min(1).max(2),
  workerId:z.string(),logPath:z.string(),storageRoot:z.string(),responses:z.array(z.string()).min(1).max(8),
  boundary:z.enum(["NONE","BEFORE_START","AFTER_START","AFTER_RESULT","AFTER_VERIFIED"]).default("NONE")}).strict();
async function main() {
  config({path:".env.test",override:true,quiet:true});
  Object.assign(process.env,{NODE_ENV:"test"});
  const input=schema.parse(JSON.parse(process.argv[2]));
  process.env.STORAGE_LOCAL_ROOT=input.storageRoot;resetEnvCache();
  assertControlledCampaignEnvironment();
  const wait=async(boundary:string)=>{
    process.send?.({boundary});
    const timer=setInterval(()=>{},1000);timer.ref();
    await new Promise<void>(()=>{});
  };
  let call=0;
  const result=await runResearchSandboxWorkerCycle({organizationId:input.organizationId,actorUserId:input.actorUserId,
    workerId:input.workerId,correlationId:"TIP076B_QA_CHILD",campaign:{jobIds:input.jobIds,outboxIds:[],leaseSeconds:5,
      provider:{kind:"CONTROLLED_LOCAL",requestedModel:"controlled-campaign-v3",async execute(request){
        await appendFile(input.logPath,JSON.stringify({actionId:request.actionId,deliveryId:request.deliveryId,attemptId:request.attemptId,
          requestedModel:"controlled-campaign-v3",startedAt:new Date().toISOString()})+"\n");
        if(input.boundary==="AFTER_START") await wait("AFTER_START");
        return {originalBytes:input.responses[Math.min(call++,input.responses.length-1)],attestedModel:null,usage:{tokens:10,provenance:"CONTROLLED_PROVIDER_LOG"}};
      }},onBoundary:async boundary=>{if(boundary===input.boundary && boundary!=="AFTER_START") await wait(boundary);}}});
  process.send?.({done:result});
  await getDb().$disconnect();
}
void main().then(()=>process.exit(0)).catch((error:unknown)=>{
  process.send?.({failed:true,errorType:error instanceof Error?error.name:"UnknownError",code:(error as {code?:string})?.code??"UNKNOWN"});process.exit(1);
});
