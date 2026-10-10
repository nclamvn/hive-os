/** Pure public boundary vocabulary. Raw transport and exception messages are never summaries. */
import { createHash } from "node:crypto";
import { z } from "zod";

export const MATH_DIAGNOSTIC_LIMITS = Object.freeze({ captures: 100, rootBytes: 134217728,
  preparedBytes: 49152, stdoutBytes: 1048576, manifestBytes: 16384, finiteBytes: 32768,
  reserveBytes: 1146880, replayAgeMs: 86400000, purgeIds: 10, purgeBytes: 16777216, operationMs: 5000 });
export const MATH_DIAGNOSTIC_ROOT = "/Users/os/Library/Application Support/HIVE OS/ResearchDiagnostics";
export const diagnosticReasonSchema = z.enum([
  "AUTHENTICATION_REQUIRED", "ORIGINAL_ACTOR_MISMATCH", "TENANT_BINDING_MISMATCH", "MEMBERSHIP_INACTIVE", "CAPABILITY_DENIED", "LOCAL_PERMISSION_REQUIRED", "AUTH_GRANT_INVALID",
  "ROOT_PERMISSION_UNAVAILABLE", "PATH_IDENTITY_REFUSED", "CAPTURE_ALREADY_EXISTS", "QUOTA_EXHAUSTED", "QUOTA_LOCK_UNAVAILABLE", "INPUT_SIZE_LIMIT", "INPUT_BINDING_MISMATCH", "SOURCE_PIN_DRIFT", "CAPTURE_WRITE_FAILED", "CAPTURE_SYNC_FAILED",
  "SPAWN_FAILED", "CHILD_DEADLINE", "CANCELLED", "NONZERO_EXIT", "STDOUT_LIMIT", "STDERR_LIMIT", "STDIN_WRITE_FAILED",
  "UTF8_INVALID", "JSONL_INVALID", "PROTOCOL_UNSUPPORTED", "TOOL_ACTIVITY_OBSERVED", "TURN_FAILED", "CONTEXT_INVALID", "USAGE_INVALID", "FINAL_JSON_INVALID",
  "HOST_FIELD_FORBIDDEN", "OUTPUT_SIZE_LIMIT", "MATH_SCHEMA_INVALID", "FEEDBACK_INCOMPLETE", "OUTPUT_BINDING_MISMATCH",
  "CAPTURE_EXPIRED", "CAPTURE_INCOMPLETE", "CAPTURE_INTEGRITY_REFUSED", "PARSER_VERSION_UNAVAILABLE", "MAINTENANCE_PARTIAL", "OPERATION_DEADLINE",
]);
export type DiagnosticReason = z.infer<typeof diagnosticReasonSchema>;
export class MathDiagnosticError extends Error {
  constructor(readonly code: DiagnosticReason) { super(code); this.name = "MathDiagnosticError"; }
}
const id = z.string().min(1).max(200).regex(/^[A-Za-z0-9:_-]+$/);
export const diagnosticBindingSchema = z.object({ organizationId:id,workspaceId:id,missionId:id,actorUserId:id,
  caseId:id,runId:id,commandId:id,outboxId:id,jobId:id,dispatchId:z.uuid(),attemptNumber:z.literal(1),claimedVersion:z.number().int().positive(),
  role:z.enum(["SOLVER","ADVERSARY","CRITIC"]) }).strict();
export type DiagnosticBinding = z.infer<typeof diagnosticBindingSchema>;
export function sameDiagnosticBinding(a:DiagnosticBinding,b:DiagnosticBinding){return JSON.stringify(diagnosticBindingSchema.parse(a))===JSON.stringify(diagnosticBindingSchema.parse(b));}
export const diagnosticStageSchema = z.enum(["RESERVED","INPUT_CAPTURED","DISPATCH_ATTEMPTED","TRANSPORT_CLOSED","ADMISSION_ACCEPTED","ADMISSION_REJECTED","CAPTURE_FAILED"]);
const hash = z.string().regex(/^[a-f0-9]{64}$/);
export const diagnosticAccountingSchema = z.discriminatedUnion("status",[
  z.object({status:z.literal("UNAVAILABLE"),threadId:z.null(),usage:z.null()}).strict(),
  z.object({status:z.literal("TRANSPORT_OBSERVED_UNACCEPTED"),threadId:z.string().trim().min(1).max(200),usage:z.object({inputTokens:z.number().int().positive(),cachedInputTokens:z.number().int().nonnegative(),outputTokens:z.number().int().positive(),reasoningOutputTokens:z.number().int().nonnegative()}).strict().refine(v=>v.cachedInputTokens<=v.inputTokens&&v.reasoningOutputTokens<=v.outputTokens)}).strict(),
]);
export const diagnosticManifestSchema = z.object({ version:z.literal("MATH_TRANSPORT_DIAGNOSTIC_V1"),captureId:z.uuid(),binding:diagnosticBindingSchema,
  createdAt:z.number().int().nonnegative(),expiresAt:z.number().int().nonnegative(),stage:diagnosticStageSchema,
  completeness:z.enum(["COMPLETE","INCOMPLETE","TRUNCATED","NOT_DISPATCHED"]),reason:diagnosticReasonSchema.nullable(),
  parserVersion:z.string().min(1).max(100),rendererVersion:z.string().min(1).max(100),sourcePins:z.record(z.string().min(1).max(200),hash).refine(v=>Object.keys(v).length>0&&Object.keys(v).length<=42&&Buffer.byteLength(JSON.stringify(v))<=4096),
  preparedDigest:hash,stdinDigest:hash,schemaDigest:hash,stdoutDigest:hash,finiteDigest:hash.nullable(),
  preparedBytes:z.number().int().min(0).max(MATH_DIAGNOSTIC_LIMITS.preparedBytes),stdoutBytes:z.number().int().min(0).max(MATH_DIAGNOSTIC_LIMITS.stdoutBytes),
  observedBytes:z.number().int().nonnegative(),finiteBytes:z.number().int().min(0).max(MATH_DIAGNOSTIC_LIMITS.finiteBytes),
  accounting:diagnosticAccountingSchema,
}).strict();
export type DiagnosticManifest = z.infer<typeof diagnosticManifestSchema>;
export const diagnosticDigest = (value: Uint8Array|string) => createHash("sha256").update(value).digest("hex");
export function safeDiagnosticSummary(raw: unknown, now = Date.now()) {
  const m = diagnosticManifestSchema.parse(raw);
  return {version:m.version,captureId:m.captureId,caseId:m.binding.caseId,runId:m.binding.runId,jobId:m.binding.jobId,role:m.binding.role,
    stage:m.stage,reason:m.reason,completeness:m.completeness,preparedBytes:m.preparedBytes,stdoutBytes:m.stdoutBytes,
    observedBytes:m.observedBytes,stdinDigest:m.stdinDigest,schemaDigest:m.schemaDigest,stdoutDigest:m.stdoutDigest,
    overdueRetention:now>=m.expiresAt,accounting:m.accounting};
}
