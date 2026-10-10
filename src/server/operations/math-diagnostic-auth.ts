/** Authority is minted from session resolution, never a caller's IDs or copied context. */
import { diagnosticBindingSchema,sameDiagnosticBinding, MathDiagnosticError, type DiagnosticBinding } from "@/modules/research-sandbox/math-transport-diagnostics";
export type DiagnosticAction = "capture"|"replay"|"purge";
export interface DiagnosticGrant {readonly opaque:true}
interface Principal {actorUserId:string;organizationId:string;workspaceId:string;active:boolean;capabilities:readonly string[]}
const grants=new WeakMap<DiagnosticGrant,{binding:DiagnosticBinding;action:DiagnosticAction;check:()=>Promise<Principal>;permission:()=>boolean}>();
async function mint(binding:DiagnosticBinding,action:DiagnosticAction,check:()=>Promise<Principal>,permission:()=>boolean) {
  binding=diagnosticBindingSchema.parse(binding);
  const grant=Object.freeze({opaque:true as const});grants.set(grant,{binding:Object.freeze({...binding}),action,check,permission});
  await requireDiagnosticGrant(grant,binding,action);return grant;
}
export async function requireDiagnosticGrant(grant:DiagnosticGrant,binding:DiagnosticBinding,action:DiagnosticAction) {
  const state=grants.get(grant);
  if(!state || state.action!==action || !sameDiagnosticBinding(state.binding,binding))throw new MathDiagnosticError("AUTH_GRANT_INVALID");
  if(!state.permission())throw new MathDiagnosticError("LOCAL_PERMISSION_REQUIRED");
  const p=await state.check();
  if(p.actorUserId!==binding.actorUserId)throw new MathDiagnosticError("ORIGINAL_ACTOR_MISMATCH");
  if(p.organizationId!==binding.organizationId || p.workspaceId!==binding.workspaceId)throw new MathDiagnosticError("TENANT_BINDING_MISMATCH");
  if(!p.active)throw new MathDiagnosticError("MEMBERSHIP_INACTIVE");
  if(["research.read","jobs.manage",...(action==="capture"?["research.request"]:[])].some(c=>!p.capabilities.includes(c)))throw new MathDiagnosticError("CAPABILITY_DENIED");
}
/** Explicit fixture authority is never available outside Vitest/test process. */
export function createDiagnosticFixtureAuthority(check:()=>Promise<Principal>,permission:()=>boolean) {
  if(process.env.NODE_ENV!=="test" || !process.env.VITEST)throw new MathDiagnosticError("AUTHENTICATION_REQUIRED");
  return (binding:DiagnosticBinding,action:DiagnosticAction)=>mint(binding,action,check,permission);
}
export async function authorizeMathDiagnosticAction(headers:Headers,workspaceSlug:string,binding:DiagnosticBinding,action:DiagnosticAction,localPermission:()=>boolean):Promise<DiagnosticGrant> {
  // Refresh must remain bound to the same original request, never caller-mutated
  // IDs or a subsequently edited Headers object. The session is revalidated.
  binding=Object.freeze(diagnosticBindingSchema.parse(binding));headers=new Headers(headers);
  const check=async()=> {
    const {resolveWorkspaceContext}=await import("@/modules/identity-workspace/context");
    const {authorize}=await import("@/modules/authorization");
    const {getDb}=await import("@/server/db");
    const {withOrganizationTenant}=await import("@/server/tenant-context");
    const ctx=await resolveWorkspaceContext(headers,workspaceSlug);
    if(ctx.user.id!==binding.actorUserId)throw new MathDiagnosticError("ORIGINAL_ACTOR_MISMATCH");
    if(ctx.workspace.id!==binding.workspaceId)throw new MathDiagnosticError("TENANT_BINDING_MISMATCH");
    const workspace=await getDb().workspace.findUnique({where:{id:ctx.workspace.id},select:{organizationId:true}});
    if(!workspace)throw new MathDiagnosticError("TENANT_BINDING_MISMATCH");
    const resource={organizationId:workspace.organizationId,workspaceId:ctx.workspace.id,missionId:binding.missionId};
    const capabilities:string[]=[];
    for(const capability of ["research.read","research.request","jobs.manage"] as const)if((await authorize(ctx.user.id,capability,resource)).allowed)capabilities.push(capability);
    await withOrganizationTenant(workspace.organizationId,ctx.user.id,async tx=> {
      const job=await tx.durableJob.findFirst({where:{id:binding.jobId,organizationId:binding.organizationId,workspaceId:binding.workspaceId,outboxEventId:binding.outboxId,attempts:1},include:{outboxEvent:true}});
      const run=await tx.researchRun.findFirst({where:{id:binding.runId,organizationId:binding.organizationId,workspaceId:binding.workspaceId,missionId:binding.missionId},include:{requestedBy:true,mathPilotCase:true}});
      const key=binding.role==="SOLVER"?"runId":"caseId",expected=binding.role==="SOLVER"?binding.runId:binding.caseId;
      const payload=job?.payload as Record<string,unknown>|undefined;
      const outboxPayload=job?.outboxEvent?.payload as Record<string,unknown>|undefined;
      const contract=run?.mathPilotCase?.contract as Record<string,unknown>|undefined;
      if(!job||!run||run.mathPilotCase?.id!==binding.caseId||run.commandId!==binding.commandId||run.requestedBy.userId!==ctx.user.id||
        job.jobType!==(binding.role==="SOLVER"?"math-pilot.codex-local.execute":"math-pilot.codex-local.review")||!payload||Object.keys(payload).length!==1||payload[key]!==expected||
        contract?.version!==4||!contract.lrcMethodUnitScope||!job.outboxEvent||job.outboxEvent.organizationId!==binding.organizationId||job.outboxEvent.workspaceId!==binding.workspaceId||job.outboxEvent.topic!==job.jobType||job.outboxEvent.commandId!==binding.commandId||job.outboxEvent.aggregateId!==expected||!outboxPayload||Object.keys(outboxPayload).length!==1||outboxPayload[key]!==expected||
        action==="capture"&&(job.status!=="RUNNING"||job.version!==binding.claimedVersion||!job.leaseExpiresAt||job.leaseExpiresAt<=new Date()))throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
    });
    return {actorUserId:ctx.user.id,organizationId:workspace.organizationId,workspaceId:ctx.workspace.id,active:ctx.membership.status==="ACTIVE",capabilities};
  };
  return mint(binding,action,check,localPermission);
}
