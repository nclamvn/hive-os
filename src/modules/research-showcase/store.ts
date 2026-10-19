import { Prisma, type ResearchShowcaseRun } from "@prisma/client";
import type { TenantTransaction } from "@/server/tenant-context";
import { getObjectStorage } from "@/server/storage";
import { createHash } from "node:crypto";
import { showcaseManifestSchema } from "./source";
import { initialShowcaseState, showcaseDigest, showcaseLimits, showcaseRoles, poly19Task, ShowcaseRefusal,
  type ShowcaseState, type ShowcaseRoleRecord, type ShowcaseArtifact, type Poly19ShowcaseView, parseShowcaseRole } from "./contracts";

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const terminal = ["COMPLETED", "FAILED", "RESOURCE_STOP", "REVOKED", "PAUSED_FOR_DECISION"];
function fail(message: string): never { throw new ShowcaseRefusal("INTEGRITY", message); }
function artifact(value: unknown, max: number): ShowcaseArtifact {
  const a = value as ShowcaseArtifact;
  if (!a || typeof a.key !== "string" || !/^[a-f0-9]{64}$/.test(a.digest) || !Number.isSafeInteger(a.bytes) || a.bytes < 0 || a.bytes > max) fail("Invalid artifact seal");
  return copy(a);
}
export function reduceShowcaseEvent(previous: ShowcaseState, kind: string, detail: Record<string, unknown>): ShowcaseState {
  const state = copy(previous), last = state.roles.at(-1);
  if (terminal.includes(state.status) && !["SOURCE_RESERVED", "OBSERVATION", "REVOKED"].includes(kind)) fail("Stopped showcase cannot reopen");
  if (kind === "APPROVED") { if (state.roles.length || state.spent.sourceScans) fail("Duplicate approval"); state.spent.sourceScans = 1; }
  else if (kind === "SOURCE_RESERVED") { if (++state.spent.sourceScans > 24) throw new ShowcaseRefusal("RESOURCE", "Source validation allowance exhausted"); }
  else if (kind === "ROLE_RESERVED") {
    const role = detail.role as ShowcaseRoleRecord["role"];
    if (role !== state.nextAction || role !== showcaseRoles[state.roles.length] || state.spent.requests >= 4 || last && (!last.validated || last.fence !== "RETAINED")) fail("Role order/reservation changed");
    if (typeof detail.actionId !== "string" || !/^[a-f0-9]{64}$/.test(String(detail.promptDigest))) fail("Role binding missing");
    state.spent.requests++; state.status = "RUNNING";
    if (role === "POSTREVIEW") { if (state.replayFence !== "RETAINED" || state.faultFence !== "RETAINED") fail("Postreview lacks both retained replays"); state.reviewDeadlineAt = String(detail.reviewDeadlineAt); }
    state.roles.push({ role, actionId: String(detail.actionId), fence: "RESERVED", promptDigest: String(detail.promptDigest), original: null, trace: null, threadId: null,
      usage: null, actualModelVersion: null, startedAt: null, returnedAt: null, elapsedMilliseconds: null, outcome: null, remoteEffect: "NONE", originalComplete:false,traceComplete:false,validated:false });
  } else if (kind === "ROLE_STARTED") {
    if (!last || last.fence !== "RESERVED" || detail.actionId !== last.actionId) fail("Role START fence changed");
    last.fence = "STARTED"; last.startedAt = String(detail.startedAt); last.remoteEffect = "UNKNOWN";
  } else if (kind === "ROLE_RETAINED") {
    if (!last || last.fence !== "STARTED" || detail.actionId !== last.actionId) fail("Role result lacks START");
    last.original = artifact(detail.original, showcaseLimits.originalBytes); last.trace = artifact(detail.trace, showcaseLimits.traceBytes);
    const bytes = last.original.bytes + last.trace.bytes;
    if (state.spent.retainedBytes + bytes > showcaseLimits.retainedBytes) throw new ShowcaseRefusal("RESOURCE", "Retention TOTAL exhausted");
    state.spent.retainedBytes += bytes; last.fence = "RETAINED"; last.threadId = detail.threadId as string | null;
    if (last.threadId && state.roles.slice(0, -1).some(r => r.threadId === last.threadId)) fail("Fresh role thread reused");
    last.usage = copy(detail.usage as ShowcaseRoleRecord["usage"]); last.actualModelVersion = detail.actualModelVersion as string | null;
    last.returnedAt = String(detail.returnedAt); last.elapsedMilliseconds = Number(detail.elapsedMilliseconds);
    if (!Number.isFinite(last.elapsedMilliseconds) || last.elapsedMilliseconds < 0) fail("Invalid observed duration");
    last.outcome = detail.outcome as ShowcaseRoleRecord["outcome"]; last.remoteEffect = detail.remoteEffect as ShowcaseRoleRecord["remoteEffect"];
    last.originalComplete=detail.originalComplete===true;last.traceComplete=detail.traceComplete===true;
    // Retention is not admission. A crash here must freshly revalidate the
    // original completed, bounded schema before any subsequent role effect.
    state.nextAction = last.role; state.status="RUNNING";
  } else if(kind==="ROLE_VALIDATED") {
    if(!last || last.fence!=="RETAINED" || last.validated || !last.originalComplete || !last.traceComplete || last.outcome!=="COMPLETED" || last.remoteEffect==="UNKNOWN" || detail.actionId!==last.actionId || detail.originalDigest!==last.original?.digest)fail("Role admission does not bind completed known-effect original");
    last.validated=true;state.nextAction=last.role==="ATTEMPT"?"CRITIC":last.role==="CRITIC"?"FINAL":last.role==="FINAL"?"CHECK":"DONE";
    state.status=last.role==="FINAL"?"VERIFYING":"QUEUED";
  } else if (kind === "REPLAY_RESERVED" || kind === "FAULT_RESERVED") {
    const field = kind === "REPLAY_RESERVED" ? "replayFence" : "faultFence";
    if (state.nextAction !== "CHECK" || state[field] !== "NONE" || state.spent.replayChecks >= 2 || !state.roles.find(r => r.role === "FINAL" && r.fence === "RETAINED")) fail("Replay reservation changed");
    if (field === "faultFence" && state.replayFence !== "RETAINED") fail("Fault preceded final replay");
    state[field] = "RESERVED"; state.spent.replayChecks++;
    if(field==="replayFence") {const a=artifact(detail.certificate,showcaseLimits.certificateBytes);
      if(state.spent.retainedBytes+a.bytes>showcaseLimits.retainedBytes)throw new ShowcaseRefusal("RESOURCE","Certificate retention ceiling");
      state.spent.retainedBytes+=a.bytes;state.certificate=a;}
  } else if(kind==="FAULT_CANDIDATE_RESERVED") {
    if(state.faultFence!=="STARTED" || state.faultCertificate)fail("Fault candidate has no unique admitted transform");
    const a=artifact(detail.certificate,showcaseLimits.certificateBytes);if(state.spent.retainedBytes+a.bytes>showcaseLimits.retainedBytes)throw new ShowcaseRefusal("RESOURCE","Fault retention ceiling");
    state.spent.retainedBytes+=a.bytes;state.faultCertificate=a;
  } else if (kind === "REPLAY_STARTED" || kind === "FAULT_STARTED") {
    const field = kind === "REPLAY_STARTED" ? "replayFence" : "faultFence";
    if (state[field] !== "RESERVED") fail("Replay START repeated"); state[field] = "STARTED";
  } else if (kind === "REPLAY_RETAINED" || kind === "FAULT_RETAINED") {
    const field = kind === "REPLAY_RETAINED" ? "replayFence" : "faultFence";
    if (state[field] !== "STARTED") fail("Replay result lacks START");
    const result = detail.result as ShowcaseState["exactResult"], reference = field === "replayFence" ? state.certificate : state.faultCertificate;
    if (!result || result.candidateSha256 !== reference?.digest || !["VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION", "REJECTED", "INCONCLUSIVE"].includes(result.status)) fail("Replay witness binding changed");
    state[field] = "RETAINED"; if (field === "replayFence") state.exactResult = copy(result); else { state.faultResult = copy(result); state.nextAction = "POSTREVIEW"; state.status = "QUEUED"; }
  } else if (kind === "POSTREVIEW_RETAINED") {
    if (last?.role !== "POSTREVIEW" || last.fence !== "RETAINED" || !last.validated || state.nextAction !== "DONE") fail("Postreview original missing");
    state.postreview = copy(detail.review as ShowcaseState["postreview"]); state.status = "COMPLETED";
  } else if (["PAUSED", "FAILED", "RESOURCE_STOP", "REVOKED"].includes(kind)) {
    state.status = kind === "REVOKED" && terminal.includes(state.status) ? state.status : kind === "PAUSED" ? "PAUSED_FOR_DECISION" : kind as ShowcaseState["status"]; state.reason = String(detail.reason); state.nextAction = "DONE";
  } else if (kind !== "OBSERVATION") fail("Unknown showcase event");
  return state;
}
export async function lockShowcase(tx: TenantTransaction, organizationId: string, id: string, shared = false) {
  if (shared) await tx.$queryRaw`SELECT id FROM research_showcase_run WHERE organization_id=${organizationId} AND id=${id} FOR SHARE`;
  else await tx.$queryRaw`SELECT id FROM research_showcase_run WHERE organization_id=${organizationId} AND id=${id} FOR UPDATE`;
  const row = await tx.researchShowcaseRun.findFirst({ where: { id, organizationId } });
  if (!row) throw new ShowcaseRefusal("AUTHORITY", "Run unavailable in this tenant"); return row;
}
export function showcaseEventBody(row: ResearchShowcaseRun, event: { sequence: number; eventType: string; actionKey: string; previousDigest: string | null; payload: unknown; jobId: string | null; createdAt: Date }) {
  return { organizationId: row.organizationId, workspaceId: row.workspaceId,missionId:row.missionId,actorUserId:row.actorUserId,commandId:row.commandId,
    provenance:row.provenance,sourceBundleDigest:row.sourceBundleDigest,taskDigest:row.taskDigest,authorityEpoch:row.authorityEpoch,
    runId: row.id, sequence: event.sequence, eventType: event.eventType, actionKey: event.actionKey,
    previousDigest: event.previousDigest, payload: event.payload, jobId: event.jobId, createdAt: event.createdAt.toISOString() };
}
export async function appendShowcaseEvent(tx: TenantTransaction, row: ResearchShowcaseRun, kind: string, actionKey: string, detail: Record<string, unknown>, jobId: string | null = null) {
  const state = reduceShowcaseEvent(row.state as unknown as ShowcaseState, kind, detail), createdAt = new Date();
  const payload = { detail, state }, body = showcaseEventBody(row, { sequence: row.sequence + 1, eventType: kind, actionKey, previousDigest: row.tailDigest, payload, jobId, createdAt });
  const digest = showcaseDigest(body);
  await tx.researchShowcaseEvent.create({ data: { organizationId: row.organizationId, workspaceId: row.workspaceId, runId: row.id,
    sequence: body.sequence, eventType: kind, actionKey, previousDigest: row.tailDigest, digest, payload: payload as unknown as Prisma.InputJsonObject, jobId, createdAt } });
  return tx.researchShowcaseRun.update({ where: { id: row.id }, data: { version: { increment: 1 }, sequence: body.sequence, tailDigest: digest,
    state: state as unknown as Prisma.InputJsonObject, stateDigest: showcaseDigest(state), status: state.status, ...(kind === "REVOKED" ? { revokedAt: createdAt } : {}) } });
}
export async function loadShowcaseCut(tx: TenantTransaction, row: ResearchShowcaseRun) {
  const events = await tx.researchShowcaseEvent.findMany({ where: { runId: row.id, organizationId: row.organizationId, workspaceId: row.workspaceId }, orderBy: { sequence: "asc" }, take: 129 });
  if (events.length > 128 || events.length !== row.sequence || row.taskDigest !== showcaseDigest(poly19Task) || !["ENGINEERING_ONLY", "LIVE_NATIVE"].includes(row.provenance)) fail("Run identity/cut bound changed");
  const first=events[0],approval=(first?.payload as unknown as {detail:Record<string,unknown>})?.detail;
  const manifest=showcaseManifestSchema.safeParse(approval?.sourceBundle);
  if(first?.eventType!=="APPROVED" || !approval || !manifest.success || row.provenance!=="ENGINEERING_ONLY" ||
    approval.actorUserId!==row.actorUserId || approval.organizationId!==row.organizationId || approval.workspaceId!==row.workspaceId || approval.missionId!==row.missionId || approval.commandId!==row.commandId ||
    approval.taskDigest!==row.taskDigest || approval.sourceBundleDigest!==row.sourceBundleDigest || approval.authorityEpoch!==row.authorityEpoch || approval.provenance!==row.provenance ||
    approval.confirmed!==true || showcaseDigest(approval.limits)!==showcaseDigest(showcaseLimits) || showcaseDigest(manifest.data)!==row.sourceBundleDigest)fail("Approved authority/provenance binding changed");
  const command=await tx.commandRecord.findFirst({where:{id:row.commandId,organizationId:row.organizationId,workspaceId:row.workspaceId,actorUserId:row.actorUserId,commandType:"research.showcase.poly19.approve",status:"SUCCEEDED"}});
  const expected={missionId:row.missionId,taskDigest:row.taskDigest,sourceBundleDigest:row.sourceBundleDigest,provenance:row.provenance,limitsDigest:showcaseDigest(showcaseLimits),confirmed:true};
  if(!command || command.payloadHash!==showcaseDigest(command.payload) || showcaseDigest(command.payload)!==showcaseDigest(expected) || (command.outcome as {runId?:unknown})?.runId!==row.id)fail("Authenticated approval command changed");
  let state = initialShowcaseState(row.authorityEpoch, row.createdAt), previous: string | null = null;
  for (let i = 0; i < events.length; i++) {
    const event = events[i], payload = event.payload as unknown as { state: ShowcaseState; detail: Record<string, unknown> };
    if (event.sequence !== i + 1 || event.previousDigest !== previous || showcaseDigest(showcaseEventBody(row, event)) !== event.digest) fail("Event chain changed");
    state = reduceShowcaseEvent(state, event.eventType, payload.detail);
    if (showcaseDigest(state) !== showcaseDigest(payload.state)) fail("Event projection changed"); previous = event.digest;
  }
  if (previous !== row.tailDigest || showcaseDigest(state) !== row.stateDigest || showcaseDigest(state) !== showcaseDigest(row.state) || state.status !== row.status) fail("Aggregate projection changed");
  return { row, state, events };
}
export async function readShowcaseArtifact(row: ResearchShowcaseRun, a: ShowcaseArtifact, suffix: string, maxBytes: number) {
  return new TextDecoder("utf8", { fatal: true }).decode(await readShowcaseBytes(row,a,suffix,maxBytes));
}
export async function readShowcaseBytes(row:ResearchShowcaseRun,a:ShowcaseArtifact,suffix:string,maxBytes:number) {
  const expected = `${row.workspaceId}/research-showcase/${row.id}/${suffix}`;
  if (a.key !== expected || a.bytes > maxBytes) fail("Artifact reference changed");
  const storage = getObjectStorage(), head = await storage.head(expected);
  if (!head || head.size !== a.bytes) fail("Original length changed");
  const bytes = await storage.get(expected, { maxBytes });
  if (!bytes || bytes.byteLength !== a.bytes || createHash("sha256").update(bytes).digest("hex") !== a.digest) fail("Original seal changed");
  return bytes;
}
export async function putShowcaseArtifact(row: ResearchShowcaseRun, suffix: string, text: string, maxBytes: number): Promise<ShowcaseArtifact> {
  return putShowcaseBytes(row,suffix,new TextEncoder().encode(text),maxBytes);
}
export async function putShowcaseBytes(row:ResearchShowcaseRun,suffix:string,bytes:Uint8Array,maxBytes:number):Promise<ShowcaseArtifact> {
  if (bytes.length > maxBytes) throw new ShowcaseRefusal("RESOURCE", "Original artifact ceiling");
  const key = `${row.workspaceId}/research-showcase/${row.id}/${suffix}`;
  await getObjectStorage().put(key, bytes, { contentType: "application/octet-stream" }); return { key, digest: createHash("sha256").update(bytes).digest("hex"), bytes: bytes.length };
}
export async function projectShowcaseView(cut: Awaited<ReturnType<typeof loadShowcaseCut>>): Promise<Poly19ShowcaseView> {
  const { row, state, events } = cut, roles: Poly19ShowcaseView["roles"] = [];
  for (const record of state.roles) { let originalText:string|null=null;
    if(record.original) {const bytes=await readShowcaseBytes(row,record.original,`${record.role}.original.txt`,showcaseLimits.originalBytes);
      if(record.originalComplete) {try{originalText=new TextDecoder("utf8",{fatal:true}).decode(bytes);}catch{fail("Completed original UTF8 changed");}}}
    if(record.trace)await readShowcaseBytes(row,record.trace,`${record.role}.trace.jsonl`,showcaseLimits.traceBytes);
    roles.push({ ...record, originalText }); }
  const final = roles.find(r => r.role === "FINAL"); let parsed:ReturnType<typeof parseShowcaseRole>|null=null;
  if(final?.originalText && final.outcome==="COMPLETED" && final.originalComplete) { try {parsed=parseShowcaseRole("FINAL",final.originalText);}catch(e){if(state.certificate)throw e;} }
  const certificateJson = state.certificate ? await readShowcaseArtifact(row, state.certificate, "FINAL.certificate.json", showcaseLimits.certificateBytes) : null;
  if (certificateJson !== null && (!parsed || !("certificateJson" in parsed) || parsed.certificateJson !== certificateJson)) fail("Decoded certificate differs from original FINAL");
  return { runId: row.id, organizationId: row.organizationId, workspaceId: row.workspaceId, missionId: row.missionId,actorUserId:row.actorUserId,commandId:row.commandId, version: row.version,
    provenance: row.provenance as Poly19ShowcaseView["provenance"], status: state.status, task: poly19Task, taskDigest: row.taskDigest,
    sourceBundleDigest: row.sourceBundleDigest, authorityEpoch: row.authorityEpoch, requestedModel: "gpt-6.1-sol", createdAt: row.createdAt.toISOString(), revokedAt: row.revokedAt?.toISOString() ?? null,
    state, roles, events: events.map(e => ({ id: e.id, sequence: e.sequence, eventType: e.eventType, actionKey: e.actionKey, digest: e.digest, previousDigest: e.previousDigest, createdAt: e.createdAt.toISOString(), jobId: e.jobId, detail: (e.payload as unknown as {detail: Record<string, unknown>}).detail })),
    proof: parsed && "proof" in parsed && typeof parsed.proof==="string" ? parsed.proof : null, originalFinal: final?.originalText ?? null, certificateJson, certificateDigest: state.certificate?.digest ?? null,
    exactResult: state.exactResult, faultResult: state.faultResult, postreview: state.postreview,
    faultCertificateJson:state.faultCertificate?await readShowcaseArtifact(row,state.faultCertificate,"FAULT.certificate.json",showcaseLimits.certificateBytes):null,
    limits: showcaseLimits, complete: true, eventCut: { sequence: row.sequence, digest: row.tailDigest! } };
}
