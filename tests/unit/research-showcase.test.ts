import { describe,it,expect,vi,afterEach } from "vitest";
import { createHash } from "node:crypto";
import type { ResearchShowcaseRun } from "@prisma/client";
import type { TenantTransaction } from "@/server/tenant-context";
import { initialShowcaseState,parseShowcaseRole,buildShowcasePrompt,poly19Task,showcaseDigest,showcaseLimits } from "@/modules/research-showcase/contracts";
import { reduceShowcaseEvent,showcaseEventBody,loadShowcaseCut,readShowcaseBytes,projectShowcaseView } from "@/modules/research-showcase/store";
import { issueShowcaseTransportPermit,requireShowcaseTransportPermit,requireNativeShowcaseAuthority } from "@/modules/research-showcase/authority";
import { showcaseSourcePaths,showcaseManifestSchema } from "@/modules/research-showcase/source";
import { parsePoly19Replay } from "@/modules/research-showcase/checker";

const storage=vi.hoisted(()=>({head:vi.fn(),get:vi.fn()}));
vi.mock("@/server/storage",()=>({getObjectStorage:()=>storage}));
const hash="a".repeat(64),now=new Date("2026-10-06T04:00:00.000Z");
const state=()=>initialShowcaseState("epoch",now);
const seal=(key="original",bytes=10)=>({key,digest:hash,bytes});
function retained() {
  let s=reduceShowcaseEvent(state(),"ROLE_RESERVED",{role:"ATTEMPT",actionId:"run:ATTEMPT",promptDigest:hash});
  s=reduceShowcaseEvent(s,"ROLE_STARTED",{actionId:"run:ATTEMPT",startedAt:now.toISOString()});
  return reduceShowcaseEvent(s,"ROLE_RETAINED",{actionId:"run:ATTEMPT",original:seal(),trace:seal("trace"),threadId:"thread1",usage:null,actualModelVersion:null,
    returnedAt:now.toISOString(),elapsedMilliseconds:0.2,outcome:"COMPLETED",remoteEffect:"NONE",originalComplete:true,traceComplete:true});
}
function validCut() {
  const manifest={version:1,purpose:"ENGINEERING_ONLY_POLY19_SHOWCASE",reviewerId:"MAIN",reviewReport:"docs/verification/TIP-079_ENGINEERING_SOURCE_REVIEW.md",reviewReportDigest:hash,
    sourcePins:Object.fromEntries(showcaseSourcePaths.map(p=>[p,hash])),allowedProvenance:["ENGINEERING_ONLY"]};
  const row={id:"run",organizationId:"org",workspaceId:"workspace",missionId:"mission",actorUserId:"actor",commandId:"command",provenance:"ENGINEERING_ONLY",taskDigest:showcaseDigest(poly19Task),
    sourceBundleDigest:showcaseDigest(manifest),authorityEpoch:"epoch",createdAt:now,updatedAt:now,revokedAt:null,version:2,sequence:1,status:"QUEUED"} as ResearchShowcaseRun;
  const detail={actorUserId:row.actorUserId,organizationId:row.organizationId,workspaceId:row.workspaceId,missionId:row.missionId,commandId:row.commandId,taskDigest:row.taskDigest,
    sourceBundleDigest:row.sourceBundleDigest,authorityEpoch:row.authorityEpoch,provenance:row.provenance,confirmed:true,limits:showcaseLimits,sourceBundle:manifest};
  const s=reduceShowcaseEvent(state(),"APPROVED",detail),event={id:"event",sequence:1,eventType:"APPROVED",actionKey:"run:approved",previousDigest:null,payload:{state:s,detail},jobId:null,createdAt:now,digest:""};
  event.digest=showcaseDigest(showcaseEventBody(row,event));row.state=s as unknown as ResearchShowcaseRun["state"];row.stateDigest=showcaseDigest(s);row.tailDigest=event.digest;
  const payload={missionId:row.missionId,taskDigest:row.taskDigest,sourceBundleDigest:row.sourceBundleDigest,provenance:row.provenance,limitsDigest:showcaseDigest(showcaseLimits),confirmed:true};
  const command={payload,payloadHash:showcaseDigest(payload),outcome:{runId:row.id}};
  const tx={researchShowcaseEvent:{findMany:vi.fn(async()=>[event])},commandRecord:{findFirst:vi.fn(async()=>command)}} as unknown as TenantTransaction;
  return {row,event,tx,command};
}
afterEach(()=>{vi.useRealTimers();vi.clearAllMocks();});
describe("079 durable fixed engineering contracts and original admission",()=>{
  it("does not advance a merely retained original after the crash boundary",()=>{const s=retained();expect(s.nextAction).toBe("ATTEMPT");expect(s.roles[0].validated).toBe(false);expect(()=>reduceShowcaseEvent(s,"ROLE_RESERVED",{role:"CRITIC",actionId:"r",promptDigest:hash})).toThrow();});
  it("advances only a completed bounded original with exact admission binding",()=>{const s=reduceShowcaseEvent(retained(),"ROLE_VALIDATED",{actionId:"run:ATTEMPT",originalDigest:hash});expect(s.nextAction).toBe("CRITIC");expect(s.spent.requests).toBe(1);expect(()=>reduceShowcaseEvent(s,"ROLE_VALIDATED",{actionId:"run:ATTEMPT",originalDigest:hash})).toThrow();});
  it.each(["FAILED","TIMEOUT","OVERSIZE","UNEXPECTED_TOOL"])("refuses admission of retained %s outcome",outcome=>{const s=retained();s.roles[0].outcome=outcome as typeof s.roles[0]["outcome"];expect(()=>reduceShowcaseEvent(s,"ROLE_VALIDATED",{actionId:"run:ATTEMPT",originalDigest:hash})).toThrow();});
  it("refuses incomplete original and trace despite complete provider label",()=>{for(const key of ["originalComplete","traceComplete"] as const){const s=retained();s.roles[0][key]=false;expect(()=>reduceShowcaseEvent(s,"ROLE_VALIDATED",{actionId:"run:ATTEMPT",originalDigest:hash})).toThrow();}});
  it("refuses completed valid bytes when the retained effect is UNKNOWN",()=>{const s=retained();s.roles[0].remoteEffect="UNKNOWN";expect(()=>reduceShowcaseEvent(s,"ROLE_VALIDATED",{actionId:"run:ATTEMPT",originalDigest:hash})).toThrow();expect(s.nextAction).toBe("ATTEMPT");expect(s.roles[0].validated).toBe(false);});
  it("does not refund reservations on pause/revoke and never reopens",()=>{let s=reduceShowcaseEvent(retained(),"PAUSED",{reason:"UNKNOWN"});s=reduceShowcaseEvent(s,"REVOKED",{reason:"REVOKED"});expect(s.status).toBe("PAUSED_FOR_DECISION");expect(s.spent.requests).toBe(1);expect(()=>reduceShowcaseEvent(s,"ROLE_RESERVED",{role:"ATTEMPT"})).toThrow();});
  it("rejects repeated START and wrong role/action binding",()=>{const s=retained();expect(()=>reduceShowcaseEvent(s,"ROLE_STARTED",{actionId:"run:ATTEMPT"})).toThrow();expect(()=>reduceShowcaseEvent(state(),"ROLE_RESERVED",{role:"FINAL",actionId:"r",promptDigest:hash})).toThrow();});
  it("rejects unreserved verifier and misplaced fault phases",()=>{expect(()=>reduceShowcaseEvent(state(),"REPLAY_STARTED",{})).toThrow();expect(()=>reduceShowcaseEvent(state(),"FAULT_RESERVED",{})).toThrow();});
  it("strictly rejects duplicate outer FINAL fields without repair",()=>{expect(()=>parseShowcaseRole("FINAL",'{"proof":"a","proof":"b","certificateJson":"{}"}')).toThrow();});
  it("preserves exact decoded certificate integer digits without JS number roundtrip",()=>{const certificateJson='{"coefficients":[90071992547409931234567890123456789],"claimed_value":123456789012345678901234567890}';const original=JSON.stringify({proof:"argument",certificateJson});expect(parseShowcaseRole("FINAL",original)).toEqual({proof:"argument",certificateJson});});
  it("refuses model-authored host authority and malformed proof structure",()=>{expect(()=>parseShowcaseRole("ATTEMPT",JSON.stringify({proof:"x",sourceBundleDigest:hash}))).toThrow();expect(()=>parseShowcaseRole("FINAL",JSON.stringify({proof:"x",coefficients:[1]}))).toThrow();});
  it("keeps checker/reference evidence out of solving contexts",()=>{const exact={secretReference:"UNIQUE_REFERENCE"} as never;expect(buildShowcasePrompt("FINAL",[],exact)).not.toContain("UNIQUE_REFERENCE");expect(buildShowcasePrompt("FINAL",[])).toContain(poly19Task.extraConstraint);});
  it("grades POSTREVIEW only from final same-run bytes and explicit replay data",()=>{const prompt=buildShowcasePrompt("POSTREVIEW",[{role:"FINAL",original:"ORIGINAL"}],null);expect(prompt).toContain("ORIGINAL");expect(prompt).toContain("graderOnlyExactReplay");});
  it("never mints native authority from model/client metadata",()=>{expect(()=>requireNativeShowcaseAuthority()).toThrow("CONTAINMENT_UNESTABLISHED");});
});
describe("079 capability shape and source status",()=>{
  it.each(["not-a-date","",new Date(0).toISOString()])("rejects malformed/expired deadline %s",deadlineAt=>expect(()=>issueShowcaseTransportPermit({runId:"run",role:"ATTEMPT",authorityEpoch:"epoch",deadlineAt})).toThrow());
  it("consumes capability once with exact run/role/deadline",()=>{const deadlineAt=new Date(Date.now()+10000).toISOString(),binding={runId:"run",role:"ATTEMPT" as const,deadlineAt,authorityEpoch:"epoch"},p=issueShowcaseTransportPermit(binding);expect(()=>requireShowcaseTransportPermit(p,{...binding,runId:"other"})).toThrow();requireShowcaseTransportPermit(p,binding);expect(()=>requireShowcaseTransportPermit(p,binding)).toThrow();});
  it("refuses forged/deserialized and subsequently expired capabilities",()=>{const deadlineAt=new Date(Date.now()+10000).toISOString(),binding={runId:"run",role:"FINAL" as const,deadlineAt,authorityEpoch:"epoch"},p=issueShowcaseTransportPermit(binding);expect(()=>requireShowcaseTransportPermit({...p},binding)).toThrow();vi.useFakeTimers();vi.setSystemTime(Date.now()+20000);expect(()=>requireShowcaseTransportPermit(p,binding)).toThrow();});
  it("does not accept a source manifest as live containment attestation",()=>{const f=validCut(),manifest=(f.event.payload.detail.sourceBundle);expect(showcaseManifestSchema.safeParse({...manifest,allowedProvenance:["LIVE_NATIVE"]}).success).toBe(false);});
  it("retains Python computedValue exactly as a decimal string",()=>{const raw=JSON.stringify({status:"INCONCLUSIVE",reason:"family unsupported",scope:"integer subset",assumptions:[],candidateSha256:hash,measurements:{elapsedSeconds:0.1,exactArithmeticOperations:2},officialScore:"NOT_ESTABLISHED",formalProof:"NOT_ESTABLISHED"}).replace(/}$/,',"computedValue":90071992547409931234567890123456789}');expect(parsePoly19Replay(raw).computedValue).toBe("90071992547409931234567890123456789");});
});
describe("079 complete-cut authority/provenance bindings",()=>{
  it("accepts one synthetic complete engineering chain under the exact command",async()=>{const f=validCut();expect((await loadShowcaseCut(f.tx,f.row)).state.spent.sourceScans).toBe(1);});
  it.each(["provenance","sourceBundleDigest","actorUserId","missionId","commandId","workspaceId"] as const)("rejects row %s flip despite unchanged chain/state",async key=>{const f=validCut();f.row[key]=key==="provenance"?"LIVE_NATIVE":"changed";await expect(loadShowcaseCut(f.tx,f.row)).rejects.toThrow();});
  it("rejects altered command outcome with intact event/state hashes",async()=>{const f=validCut();f.command.outcome.runId="other";await expect(loadShowcaseCut(f.tx,f.row)).rejects.toThrow();});
  it("rejects omitted events and coherent snapshot mismatch",async()=>{const f=validCut();f.event.payload.state.spent.requests=4;await expect(loadShowcaseCut(f.tx,f.row)).rejects.toThrow();});
  it("retains raw binary trace bytes without UTF8 replacement",async()=>{const bytes=Uint8Array.from([255,128,0,195]),digest=createHash("sha256").update(bytes).digest("hex"),row={id:"run",workspaceId:"workspace"} as ResearchShowcaseRun;storage.head.mockResolvedValue({size:bytes.length});storage.get.mockResolvedValue(bytes);expect(await readShowcaseBytes(row,{key:"workspace/research-showcase/run/ATTEMPT.trace.jsonl",digest,bytes:bytes.length},"ATTEMPT.trace.jsonl",512000)).toEqual(bytes);});
  it("projects incomplete invalidUTF8 original bytes without repairing or fatal text decoding",async()=>{const f=validCut(),s=retained(),bytes=Uint8Array.from([88,226]),digest=createHash("sha256").update(bytes).digest("hex");
    s.roles[0].original={key:"workspace/research-showcase/run/ATTEMPT.original.txt",digest,bytes:bytes.length};s.roles[0].originalComplete=false;s.roles[0].trace=null;s.roles[0].outcome="OVERSIZE";s.status="FAILED";
    storage.head.mockResolvedValue({size:bytes.length});storage.get.mockResolvedValue(bytes);
    const view=await projectShowcaseView({row:f.row,state:s,events:[]} as unknown as Awaited<ReturnType<typeof loadShowcaseCut>>);expect(view.roles[0].originalText).toBeNull();expect(view.roles[0].original?.digest).toBe(digest);expect(view.status).toBe("FAILED");});
});
