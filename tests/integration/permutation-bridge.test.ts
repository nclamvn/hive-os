import {randomUUID} from "node:crypto";
import {describe,it,expect,afterAll} from "vitest";
import {createMission} from "@/modules/mission-kernel";
import {createScopedGrant} from "@/modules/authorization";
import {getEnv} from "@/server/env";
import {getDb} from "@/server/db";
import {withOrganizationTenant} from "@/server/tenant-context";
import {createDraft,getBridgeView,startBridge,reserveBridgeRole,revokeBridge,exportBridge} from "@/modules/permutation-bridge";
import {assertEnvironment,assertPrivateStorage,loadBundle} from "@/modules/permutation-bridge/source";
import {asOwner,createUser} from "./helpers";

// PREPARATION ONLY: owns all newly created identities/missions/DRAFT rows.
// No truncate/delete/migration/host-approval write/model role or scientificStart.
function guard(){assertEnvironment();for(const key of ["DATABASE_URL","DATABASE_MIGRATION_URL"] as const){const url=new URL(getEnv()[key]??"");if(!["localhost","127.0.0.1"].includes(url.hostname)||url.port!=="5433"||url.pathname!=="/hiveos_test")throw new Error("TIP080_ISOLATED_DATABASE_REQUIRED");}}
let ownedClient:ReturnType<typeof getDb>|null=null;
async function fixture(){guard();await assertPrivateStorage();await loadBundle();ownedClient=getDb();const ctx=await asOwner(await createUser("TIP080-DRAFT-QA")),mission=await createMission(ctx,{title:"TIP080 owned preparation DRAFT; no model work"});
  const input={missionId:mission.id,idempotencyKey:`080-QA:${randomUUID()}`},draft=await createDraft(ctx,input);return {ctx,mission,input,draft};}
const cut=(draft:{runId:string;sequence:number;eventDigest:string})=>({runId:draft.runId,expectedSequence:draft.sequence,expectedDigest:draft.eventDigest});
afterAll(async()=>{if(ownedClient)await ownedClient.$disconnect();});
describe("TIP080 actual isolated preparation DRAFT controls — no live starts",()=>{
  it("creates exact authenticatedunstartedDraft and reusesapprovalkey/outbox",async()=>{const f=await fixture();expect(await createDraft(f.ctx,f.input)).toEqual(f.draft);const view=await getBridgeView(f.ctx,f.draft.runId);
    expect(view.state.status).toBe("DRAFT");expect(view.state.startedAt).toBeNull();expect(view.state.deadlineAt).toBeNull();expect(view.state.stages).toEqual([]);expect(view.originals).toEqual([]);expect(view.checker).toBeNull();expect(view.currentPrompt).toBeNull();expect(view.liveReady).toBe(false);
    const rows=await withOrganizationTenant(view.binding.organizationId,f.ctx.user.id,tx=>tx.outboxEvent.findMany({where:{aggregateType:"PermutationBridge",aggregateId:f.draft.runId,organizationId:view.binding.organizationId}}));expect(rows).toHaveLength(1);});
  it("concurrentsame-keyDrafts retainonlyone complete root and noSTART",async()=>{const f=await fixture(),input={...f.input,idempotencyKey:`080-QA-concurrent:${randomUUID()}`};const [a,b]=await Promise.all([createDraft(f.ctx,input),createDraft(f.ctx,input)]);expect(a).toEqual(b);expect((await getBridgeView(f.ctx,a.runId)).events.map(e=>e.kind)).toEqual(["DRAFT"]);});
  it("absent exacthostapproval refuses forgedStart/reservation withoutpoisoningglobalStartslot",async()=>{const f=await fixture();await expect(startBridge(f.ctx,cut(f.draft))).rejects.toThrow();await expect(reserveBridgeRole(f.ctx,{...cut(f.draft),role:"ATTEMPT"})).rejects.toThrow();const view=await getBridgeView(f.ctx,f.draft.runId);expect(view.state.status).toBe("DRAFT");expect(view.events).toHaveLength(1);
    const commands=await withOrganizationTenant(view.binding.organizationId,f.ctx.user.id,tx=>tx.commandRecord.findMany({where:{organizationId:view.binding.organizationId,workspaceId:view.binding.workspaceId,actorUserId:f.ctx.user.id,commandType:"permutation.bridge.080.START"}}));expect(commands).toHaveLength(0);});
  it("revokesDraft atomically and idempotently with no model effects",async()=>{const f=await fixture(),input=cut(f.draft),a=await revokeBridge(f.ctx,input);expect(await revokeBridge(f.ctx,input)).toEqual(a);const view=await getBridgeView(f.ctx,f.draft.runId);expect(view.state.status).toBe("REVOKED");expect(view.state.stages).toEqual([]);expect(view.events.map(e=>e.kind)).toEqual(["DRAFT","REVOKED"]);});
  it("refuses stale/tamperedcut withoutpoisoninglatercorrectrevocation",async()=>{const f=await fixture();await expect(revokeBridge(f.ctx,{...cut(f.draft),expectedDigest:"a".repeat(64)})).rejects.toThrow();const view=await getBridgeView(f.ctx,f.draft.runId);expect(view.events).toHaveLength(1);expect(view.state.status).toBe("DRAFT");expect((await revokeBridge(f.ctx,cut(f.draft))).status).toBe("SUCCEEDED");expect((await getBridgeView(f.ctx,f.draft.runId)).state.status).toBe("REVOKED");});
  it("rejects distinctfreshworkspace access to exactownedDraft",async()=>{const f=await fixture(),other=await asOwner(await createUser("TIP080-OTHER-QA"));await expect(getBridgeView(other,f.draft.runId)).rejects.toThrow();await expect(exportBridge(other,f.draft.runId)).rejects.toThrow();});
  it("currentmissionDENY refuses reads/mutations ratherthanadoptingcachedmembership",async()=>{const f=await fixture();await createScopedGrant(f.ctx,{subjectType:"USER",subjectUserId:f.ctx.user.id,role:"MISSION_OWNER",effect:"DENY",scopeType:"MISSION",missionId:f.mission.id,reason:"Owned080 preparation negative control"});
    await expect(getBridgeView(f.ctx,f.draft.runId)).rejects.toThrow();await expect(revokeBridge(f.ctx,cut(f.draft))).rejects.toThrow();});
  it("privateDraftexport containscompleteboundcut/no scientificresult on repeatedsame-processread",async()=>{const f=await fixture(),body=await exportBridge(f.ctx,f.draft.runId),dossier=JSON.parse(body);expect(dossier.binding.runId).toBe(f.draft.runId);expect(dossier.events).toHaveLength(1);expect(dossier.originals).toEqual([]);expect(dossier.prompts).toEqual([]);expect(dossier.checker).toBeNull();expect(dossier.state.startedAt).toBeNull();expect(dossier.caveats.upstream).toContain("not cryptographic");expect((await getBridgeView(f.ctx,f.draft.runId)).events[0].eventDigest).toBe(dossier.events[0].eventDigest);});
});
