import { config } from "dotenv";
import { z } from "zod";
import { getDb } from "@/server/db";
import { resetEnvCache } from "@/server/env";
import { assertShowcaseEnvironment } from "@/modules/research-showcase/source";
import { claimJobs } from "@/modules/command-runtime/jobs";
import { showcaseJobType } from "@/modules/research-showcase/contracts";
import { executePoly19ShowcaseJob } from "@/server/workers/research-showcase-cycle";

// HOST_ONLY actual-process engineering crash fixture. No model, provider,
// prompt, candidate bytes, filesystem paths or native grant in its arguments.
const schema=z.object({organizationId:z.string().uuid(),actorUserId:z.string().uuid(),jobId:z.string().uuid(),workerId:z.string().min(1).max(120),
  boundary:z.enum(["BEFORE_START","AFTER_START","AFTER_RESULT","AFTER_CHECK"]),role:z.enum(["ATTEMPT","CRITIC","FINAL","POSTREVIEW"]).optional(),
  engineeringFault:z.enum(["UNKNOWN","MALFORMED","OVERSIZE","OVERSIZE_UTF8","FAILED"]).optional()}).strict();
async function main() {
  const inheritedStorage=process.env.STORAGE_LOCAL_ROOT;
  config({path:".env.test",override:true,quiet:true});
  Object.assign(process.env,{NODE_ENV:"test"});
  if(inheritedStorage)process.env.STORAGE_LOCAL_ROOT=inheritedStorage;
  resetEnvCache();assertShowcaseEnvironment();
  if(process.env.VITEST!=="true" || process.argv.length!==3)throw new Error("HOST_ONLY_VITEST_FIXTURE");
  const input=schema.parse(JSON.parse(process.argv[2]));
  const jobs=await claimJobs({organizationId:input.organizationId,actorUserId:input.actorUserId,workerId:input.workerId,
    jobTypes:[showcaseJobType],jobIds:[input.jobId],first:1,leaseSeconds:30});
  if(jobs.length!==1)throw new Error("EXACT_OWN_JOB_NOT_CLAIMED");
  await executePoly19ShowcaseJob({...input,expectedVersion:jobs[0].version,onBoundary:async(boundary,role)=>{
    if(boundary!==input.boundary || input.role && role!==input.role)return;
    process.send?.({boundary,role:role??null,jobId:input.jobId});
    const hold=setInterval(()=>{},1000);hold.ref();await new Promise<never>(()=>{});
  }});
  process.send?.({unexpectedCompletion:true});await getDb().$disconnect();
}
void main().then(()=>process.exit(0)).catch((e:unknown)=>{process.send?.({failed:true,errorType:e instanceof Error?e.name:"UnknownError",code:(e as {code?:string})?.code??"UNKNOWN"});process.exit(1);});
