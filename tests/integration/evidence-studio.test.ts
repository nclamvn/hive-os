import {describe,it,expect,afterAll,vi} from "vitest";
import {createUser,asOwner,contextForMembership} from "./helpers";
import {getDb} from "@/server/db";
import {assertEnvironment,assertPrivateStorage,loadBundle} from "@/modules/permutation-bridge/source";
import {getBridgeView,exportBridge} from "@/modules/permutation-bridge";
import {loadStudio} from "@/modules/research-evidence-studio/reader";
import {parseStudioQuery} from "@/modules/research-evidence-studio/presentation";
import {studioAnchor} from "@/modules/research-evidence-studio/annotations";
import type {WorkspaceContext} from "@/modules/identity-workspace";
import {withOrganizationTenant} from "@/server/tenant-context";
import {organizationIdForWorkspace} from "@/modules/authorization";
vi.mock("server-only",()=>({}));
const selected=()=>parseStudioQuery({missionId:studioAnchor.missionId,runId:studioAnchor.runId});
let used=false;
async function owner(){assertEnvironment();await assertPrivateStorage();await loadBundle();used=true;const db=getDb();const workspace=await db.workspace.findUniqueOrThrow({where:{slug:"tip079-poly19-engineering-9ac5dd"}});const user=await db.user.findUniqueOrThrow({where:{id:workspace.createdById}});return contextForMembership({id:user.id,name:user.name,email:user.email},workspace.id);}
async function counts(ctx:WorkspaceContext){const organizationId=await organizationIdForWorkspace(ctx.workspace.id);return withOrganizationTenant(organizationId,ctx.user.id,tx=>tx.commandRecord.groupBy({by:["commandType"],where:{organizationId,workspaceId:ctx.workspace.id,commandType:{startsWith:"permutation.bridge.080."},OR:[{id:studioAnchor.runId},{payload:{path:["runId"],equals:studioAnchor.runId}}]},_count:{_all:true},orderBy:{commandType:"asc"}}));}
afterAll(async()=>{if(used)await getDb().$disconnect();});
describe("TIP081 actual isolated original080 dossier reads; no study writes",()=>{
  it("reads completed original with all scientific state unchanged after view replay",async()=>{const ctx=await owner(),before=await getBridgeView(ctx,studioAnchor.runId),initial=await counts(ctx);expect(before.state.status).toBe("COMPLETED");const result=await loadStudio(ctx,selected());expect(result.status).toBe("ready");if(result.status!=="ready")throw new Error("TIP081_ACTUAL_DOSSIER_NOT_READY");expect(result.model.provenance).toBe("CODEX_ASSISTED");expect(result.model.proofStatus).toBe("NON_FORMAL");expect(result.model.originals).toHaveLength(4);expect(result.model.events).toHaveLength(11);expect(result.model.lineage.archivedDigest).toBe(studioAnchor.archivedDigest);
    for(const event of [1,5,11]){const q=parseStudioQuery({missionId:studioAnchor.missionId,runId:studioAnchor.runId,view:"audit",event:String(event)});expect((await loadStudio(ctx,q)).status).toBe("ready");}
    const after=await getBridgeView(ctx,studioAnchor.runId);expect(after.originals).toEqual(before.originals);expect(after.events).toEqual(before.events);expect(after.checker).toEqual(before.checker);expect(after.binding).toEqual(before.binding);expect(after.state).toEqual(before.state);expect(await counts(ctx)).toEqual(initial);});
  it("matches exact current export originals/prompts/retained events, independent of expired flags",async()=>{const ctx=await owner(),a=JSON.parse(await exportBridge(ctx,studioAnchor.runId)),result=await loadStudio(ctx,selected());if(result.status!=="ready")throw new Error("TIP081_ACTUAL_DOSSIER_NOT_READY");const b=JSON.parse(await exportBridge(ctx,studioAnchor.runId));for(const k of ["binding","events","state","originals","prompts","checker","task","sourceBundle"])expect(b[k]).toEqual(a[k]);expect(result.model.observations.expired).toBe(a.expired);expect(result.model.observations.liveReady).toBe(a.liveReady);expect(result.model.originals.map(v=>v.digest)).toEqual(a.originals.map((v:{digest:string})=>v.digest));});
  it("refuses fresh owned cross-tenant identity without disclosing originals",async()=>{await owner();const other=await asOwner(await createUser("TIP081-ENGINEERING-ONLY"));expect(await loadStudio(other,selected())).toEqual({status:"out-of-scope"});});
  it("refuses another actor in current workspace and mission mismatch",async()=>{const ctx=await owner(),foreign=await createUser("TIP081-FOREIGN-ACTOR-ENGINEERING-ONLY");const otherActor={...ctx,user:foreign} as WorkspaceContext;const refusal=await loadStudio(otherActor,selected());expect(["out-of-scope","corrupt"]).toContain(refusal.status);expect(Object.keys(refusal)).toEqual(["status"]);const q=selected();if(q.status!=="selected")throw new Error("TIP081_QUERY_REFUSED");expect(await loadStudio(ctx,{...q,missionId:"00000000-0000-4000-8000-000000000001"})).toEqual({status:"out-of-scope"});});
  it("rejects empty/malformed selectors before any reader call",async()=>{const ctx=await owner(),before=await counts(ctx);expect(await loadStudio(ctx,parseStudioQuery({}))).toEqual({status:"empty"});expect(await loadStudio(ctx,parseStudioQuery({missionId:studioAnchor.missionId,runId:studioAnchor.runId,event:"12"}))).toEqual({status:"out-of-scope"});expect(await counts(ctx)).toEqual(before);});
});
