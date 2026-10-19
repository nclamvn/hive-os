import { z } from "zod";
import { getDb } from "../../src/server/db";
import { withOrganizationTenant } from "../../src/server/tenant-context";
import { assertShowcaseEnvironment, loadShowcaseBundle } from "../../src/modules/research-showcase/source";
import { runPoly19ShowcaseWorkerCycle } from "../../src/server/workers/research-showcase-cycle";
import { showcaseJobType } from "../../src/modules/research-showcase/contracts";

/** Fixed engineering worker entry. It never selects a CLI, model or provider
 * from arguments; native containment is unestablished and live is disabled. */
async function main() {
  // This entry owns a separate CLI process, never the HTTP server singleton.
  // Do not acquire a client on environmental/source/argument refusal.
  let db:ReturnType<typeof getDb>|null=null;
  try {
  assertShowcaseEnvironment();await loadShowcaseBundle();
  const options=new Map(process.argv.slice(2).map<[string,string]>(arg=>{const match=/^--(organization-id|actor-user-id|run-id)=([A-Za-z0-9-]+)$/.exec(arg);if(!match)throw new Error("WORKER_INPUT_REFUSED");return [match[1],match[2]];}));
  if(options.size!==3 || process.argv.length!==5)throw new Error("EXACT_WORKER_ARGUMENTS_REQUIRED");
  const organizationId=z.string().uuid().parse(options.get("organization-id")),actorUserId=z.string().min(1).max(200).parse(options.get("actor-user-id")),runId=z.string().uuid().parse(options.get("run-id"));
  db=getDb();
  const references=await withOrganizationTenant(organizationId,actorUserId,async tx=>{
    const row=await tx.researchShowcaseRun.findFirst({where:{id:runId,organizationId,actorUserId,provenance:"ENGINEERING_ONLY"}});if(!row)throw new Error("ENGINEERING_RUN_BINDING_REFUSED");
    const outbox=await tx.outboxEvent.findMany({where:{organizationId,workspaceId:row.workspaceId,aggregateType:"ResearchShowcaseRun",aggregateId:runId,topic:showcaseJobType},select:{id:true},take:2});
    if(outbox.length!==1)throw new Error("EXACT_OUTBOX_REFUSED");
    const jobs=await tx.durableJob.findMany({where:{organizationId,workspaceId:row.workspaceId,jobType:showcaseJobType,outboxEventId:{in:outbox.map(o=>o.id)}},select:{id:true},take:2});
    return {outboxIds:outbox.map(o=>o.id),jobIds:jobs.map(j=>j.id)};
  });
  const result=await runPoly19ShowcaseWorkerCycle({organizationId,actorUserId,workerId:"poly19-engineering-local",...references});
  process.stdout.write(JSON.stringify({purpose:"ENGINEERING_ONLY",claimed:result.claimed,results:result.results})+"\n");
  } finally {
    // Prisma owns disposal of its external pool; await it on success/failure.
    // A shutdown error propagates to the nonzero sanitized handler below.
    if(db)await db.$disconnect();
  }
}
void main().catch(()=>{process.stderr.write("SHOWCASE_WORKER_REFUSED\n");process.exitCode=2;});
