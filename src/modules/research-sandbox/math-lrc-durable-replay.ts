import { createHash } from "node:crypto";
import { z } from "zod";

/** Wire evidence only. These values never authorize capture, model execution or admission. */
export const LRC_DURABLE_V2_LIMITS = Object.freeze({ slots:100,rootBytes:134217728,slotBytes:1146880,preparedBytes:49152,stdoutBytes:1048576,finiteBytes:32768,controlBytes:16384,ageMs:86400000 });
export const durableHashSchema=z.string().regex(/^[a-f0-9]{64}$/);
const id=z.string().min(1).max(200).regex(/^[A-Za-z0-9:_-]+$/);
const time=z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
export const lrcDurableContextSchema=z.object({actorUserId:id,organizationId:id,workspaceId:id,missionId:id}).strict();
export const lrcDurableClaimSchema=z.object({role:z.enum(["SOLVER","ADVERSARY","CRITIC"]),jobId:id,outboxId:id,dispatchId:z.uuid(),workerId:id,claimedVersion:z.number().int().positive(),leaseExpiresAt:time,attemptNumber:z.literal(1)}).strict();
export const lrcDurableBindingSchema=z.object({context:lrcDurableContextSchema,caseId:z.uuid(),runId:z.uuid(),commandId:z.uuid(),solver:lrcDurableClaimSchema,adversary:lrcDurableClaimSchema,critic:lrcDurableClaimSchema}).strict().refine(v=>v.solver.role==="SOLVER"&&v.adversary.role==="ADVERSARY"&&v.critic.role==="CRITIC"&&v.solver.jobId!==v.critic.jobId&&v.adversary.jobId===v.critic.jobId&&v.adversary.outboxId===v.critic.outboxId&&new Set([v.solver.dispatchId,v.adversary.dispatchId,v.critic.dispatchId]).size===3);
export const lrcDurableDescriptorSchema=z.object({version:z.literal("LRC_DURABLE_DESCRIPTOR_V2"),context:lrcDurableContextSchema,approvedNonce:z.uuid(),executableManifestDigest:durableHashSchema,contractDigest:durableHashSchema,sourcePins:z.record(z.string().min(1).max(200),durableHashSchema).refine(v=>Object.keys(v).length>0&&Object.keys(v).length<=42&&Buffer.byteLength(JSON.stringify(v))<=4096),predicateId:z.literal("FEW_EXCEPTION_SHIFT_14_V1"),seedDigest:durableHashSchema,unitDigest:durableHashSchema,createdAt:time,expiresAt:time}).strict().refine(v=>v.expiresAt>v.createdAt&&v.expiresAt-v.createdAt<=LRC_DURABLE_V2_LIMITS.ageMs);
export const lrcDurableMetricsSchema=z.object({checkerCalls:z.literal(2),originalOperations:z.number().int().nonnegative().max(2000000),replayOperations:z.number().int().nonnegative().max(2000000),originalElapsedMs:z.number().finite().nonnegative().max(5000),replayElapsedMs:z.number().finite().nonnegative().max(5000),aggregateElapsedMs:z.number().finite().nonnegative().max(5000)}).strict().refine(v=>v.originalOperations+v.replayOperations<=2000000&&v.aggregateElapsedMs>=v.originalElapsedMs+v.replayElapsedMs);
const ceiling={scope:z.literal("FINITE_ONLY"),globalLrc:z.literal("NOT_ESTABLISHED"),realTime:z.literal("NOT_ESTABLISHED"),formal:z.literal("NOT_ESTABLISHED"),external:z.literal("NOT_ESTABLISHED"),novelty:z.literal("NOT_ESTABLISHED")};
export const lrcPreCriticReceiptSchema=z.object({version:z.literal("LRC_PRECRITIC_REPLAY_V2"),descriptorDigest:durableHashSchema,bindingDigest:durableHashSchema,finiteByteDigest:durableHashSchema,finiteRecordDigest:durableHashSchema,inputDigest:durableHashSchema,certificateDigest:durableHashSchema,seedDigest:durableHashSchema,unitDigest:durableHashSchema,replayInputDigest:durableHashSchema,originalResultDigest:durableHashSchema,replayResultDigest:durableHashSchema,replayCheckerVersion:id,replayCheckerSourceDigest:durableHashSchema,solverAttemptDigest:durableHashSchema,adversaryReportDigest:durableHashSchema,metrics:lrcDurableMetricsSchema,replayId:z.uuid(),createdAt:time,expiresAt:time,...ceiling}).strict().refine(v=>v.originalResultDigest===v.replayResultDigest&&v.createdAt<v.expiresAt);
export const lrcPostLedgerReceiptSchema=z.object({version:z.literal("LRC_POSTLEDGER_ADMISSION_V2"),descriptorDigest:durableHashSchema,bindingDigest:durableHashSchema,preCriticReceiptDigest:durableHashSchema,ledgerDigest:durableHashSchema,ledgerVersion:z.literal(7),reviewDigest:durableHashSchema,dossierDigest:durableHashSchema,workerResultDigest:durableHashSchema,solverAttemptDigest:durableHashSchema,adversaryReportDigest:durableHashSchema,preparedByteDigests:z.tuple([durableHashSchema,durableHashSchema,durableHashSchema]),roleInputDigests:z.tuple([durableHashSchema,durableHashSchema,durableHashSchema]),transportManifestDigests:z.tuple([durableHashSchema,durableHashSchema,durableHashSchema]),finalFiniteMetrics:lrcDurableMetricsSchema,createdAt:time,expiresAt:time,dispatchAllowed:z.literal(false),proofClosure:z.literal(false),...ceiling}).strict().refine(v=>v.createdAt<v.expiresAt);
export type LrcDurableDescriptor=z.infer<typeof lrcDurableDescriptorSchema>;
export type LrcDurableBinding=z.infer<typeof lrcDurableBindingSchema>;
export type LrcPreCriticReceipt=z.infer<typeof lrcPreCriticReceiptSchema>;
export type LrcPostLedgerReceipt=z.infer<typeof lrcPostLedgerReceiptSchema>;
export const durableDigest=(bytes:Uint8Array|string)=>createHash("sha256").update(bytes).digest("hex");
export function durableJson(value:unknown,cap=16384):Buffer {
  let nodes=0,charged=0;const seen=new Set<object>();
  function walk(v:unknown,depth:number):void {
    if(++nodes>20000||depth>32)throw new Error("INPUT_SIZE_LIMIT");
    if(v===null||typeof v==="boolean")return;
    if(typeof v==="number"){if(!Number.isFinite(v))throw new Error("INPUT_INVALID");return;}
    if(typeof v==="string"){charged+=Buffer.byteLength(v);if(charged>cap)throw new Error("INPUT_SIZE_LIMIT");return;}
    if(typeof v!=="object"||seen.has(v))throw new Error("INPUT_INVALID");
    seen.add(v);
    if(Array.isArray(v)){if(Object.getPrototypeOf(v)!==Array.prototype||v.length>20000||Object.getOwnPropertyNames(v).length!==v.length+1||Object.getOwnPropertySymbols(v).length)throw new Error("INPUT_INVALID");for(let i=0;i<v.length;i++){const d=Object.getOwnPropertyDescriptor(v,String(i));if(!d||!("value" in d))throw new Error("INPUT_INVALID");walk(d.value,depth+1);}}
    else {if(Object.getPrototypeOf(v)!==Object.prototype&&Object.getPrototypeOf(v)!==null)throw new Error("INPUT_INVALID");const keys=Reflect.ownKeys(v);if(keys.length>20000)throw new Error("INPUT_SIZE_LIMIT");for(const key of keys){if(typeof key!=="string")throw new Error("INPUT_INVALID");charged+=Buffer.byteLength(key);if(charged>cap)throw new Error("INPUT_SIZE_LIMIT");const d=Object.getOwnPropertyDescriptor(v,key);if(!d||!("value" in d)||!d.enumerable)throw new Error("INPUT_INVALID");walk(d.value,depth+1);}}
    seen.delete(v);
  }
  walk(value,0);const bytes=Buffer.from(JSON.stringify(value));if(bytes.length>cap)throw new Error("INPUT_SIZE_LIMIT");return bytes;
}
export function parseDurableBytes(bytes:Buffer,cap:number):unknown {if(bytes.length>cap)throw new Error("INPUT_SIZE_LIMIT");const text=new TextDecoder("utf-8",{fatal:true}).decode(bytes);const parsed:unknown=JSON.parse(text);durableJson(parsed,cap);return parsed;}
