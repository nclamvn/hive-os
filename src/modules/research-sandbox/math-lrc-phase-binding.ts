import { z } from "zod";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { durableJson, durableHashSchema, lrcDurableClaimSchema, lrcDurableDescriptorSchema } from "./math-lrc-durable-replay";

/** Assertions selecting rows, not manifests, read grants, or execution authority. */
export const LRC_PHASE_BINDING_LIMITS = Object.freeze({ bytes: 16384, phases: 4 } as const);
export type LrcPhaseBindingReason = "PHASE_INPUT_REFUSED" | "PHASE_INPUT_LIMIT" | "PHASE_LIFETIME_REFUSED" | "PHASE_PROGRESSION_REFUSED";
export class LrcPhaseBindingError extends Error {
  constructor(readonly code: LrcPhaseBindingReason) { super(code); this.name = "LrcPhaseBindingError"; }
}
const time = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const id = z.string().min(1).max(200).regex(/^[A-Za-z0-9:_-]+$/);
const created = z.object({ caseId: z.uuid(), runId: z.uuid(), commandId: z.uuid(), solverOutboxId: id }).strict();
const solver = lrcDurableClaimSchema.refine(v => v.role === "SOLVER" && Number.isSafeInteger(v.claimedVersion) && v.claimedVersion < Number.MAX_SAFE_INTEGER);
const review = z.object({ jobId: id, outboxId: id, workerId: id, claimedVersion: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1),
  leaseExpiresAt: time, attemptNumber: z.literal(1), adversaryDispatchId: z.uuid(), criticDispatchId: z.uuid() }).strict();
const common = { descriptor: lrcDurableDescriptorSchema, workspaceSlug: z.string().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sourceExpiresAt: time, grantExpiresAt: time };
const active = { ...common, created, solverClaim: solver };
const reviewed = { ...active, reviewClaim: review, solverAttemptDigest: durableHashSchema };
const phases = z.discriminatedUnion("phase", [
  z.object({ ...common, phase: z.literal("PROSPECTIVE") }).strict(),
  z.object({ ...active, phase: z.literal("SOLVER_ACTIVE") }).strict(),
  z.object({ ...reviewed, phase: z.literal("REVIEW_ACTIVE") }).strict(),
  z.object({ ...reviewed, phase: z.literal("TERMINAL"), ledgerDigest: durableHashSchema }).strict(),
]).superRefine((v, ctx) => {
  const start = v.descriptor.createdAt, end = v.descriptor.expiresAt;
  if (v.sourceExpiresAt <= start || v.grantExpiresAt <= start || v.sourceExpiresAt > end || v.grantExpiresAt > end)
    ctx.addIssue({ code: "custom", message: "PHASE_LIFETIME_REFUSED" });
  if (v.phase === "PROSPECTIVE") return;
  if (v.solverClaim.leaseExpiresAt <= start || !Number.isSafeInteger(v.solverClaim.claimedVersion) || v.solverClaim.outboxId !== v.created.solverOutboxId)
    ctx.addIssue({ code: "custom", message: "PHASE_INPUT_REFUSED" });
  if (v.phase === "SOLVER_ACTIVE") return;
  const r = v.reviewClaim;
  if (r.leaseExpiresAt <= start || r.jobId === v.solverClaim.jobId || r.outboxId === v.solverClaim.outboxId ||
    new Set([v.solverClaim.dispatchId, r.adversaryDispatchId, r.criticDispatchId]).size !== 3)
    ctx.addIssue({ code: "custom", message: "PHASE_INPUT_REFUSED" });
});

/** This public schema bounds plain JSON BEFORE Zod reads fields or traverses it. */
export const lrcPhaseReadRequestSchema = z.unknown().superRefine((raw, ctx) => {
  try { durableJson(raw, LRC_PHASE_BINDING_LIMITS.bytes); }
  catch (error) { ctx.addIssue({ code: "custom", message: error instanceof Error && error.message === "INPUT_SIZE_LIMIT" ? "PHASE_INPUT_LIMIT" : "PHASE_INPUT_REFUSED" }); }
}).pipe(phases);
export type LrcPhaseReadRequest = z.infer<typeof lrcPhaseReadRequestSchema>;
export type LrcReadPhase = LrcPhaseReadRequest["phase"];

function freeze<T>(value: T): T {
  if (value && typeof value === "object") { for (const child of Object.values(value)) freeze(child); Object.freeze(value); }
  return value;
}
export function parseLrcPhaseReadRequest(raw: unknown): LrcPhaseReadRequest {
  const parsed = lrcPhaseReadRequestSchema.safeParse(raw);
  if (!parsed.success) {
    const messages = parsed.error.issues.map(issue => issue.message);
    throw new LrcPhaseBindingError(messages.includes("PHASE_INPUT_LIMIT") ? "PHASE_INPUT_LIMIT" :
      parsed.error.issues.every(issue => issue.code === "custom" && issue.message === "PHASE_LIFETIME_REFUSED") ? "PHASE_LIFETIME_REFUSED" : "PHASE_INPUT_REFUSED");
  }
  return freeze(parsed.data);
}

/** The actual initial session lifetime must be supplied by the server DAL, never inferred. */
export function effectiveLrcPhaseReadExpiry(raw: unknown, initialSessionExpiresAt: number): number {
  const v = parseLrcPhaseReadRequest(raw);
  if (!Number.isSafeInteger(initialSessionExpiresAt) || initialSessionExpiresAt <= v.descriptor.createdAt)
    throw new LrcPhaseBindingError("PHASE_LIFETIME_REFUSED");
  const deadlines = [v.descriptor.expiresAt, v.sourceExpiresAt, v.grantExpiresAt, initialSessionExpiresAt];
  if (v.phase !== "PROSPECTIVE") deadlines.push(v.solverClaim.leaseExpiresAt);
  if (v.phase === "REVIEW_ACTIVE" || v.phase === "TERMINAL") deadlines.push(v.reviewClaim.leaseExpiresAt);
  return Math.min(...deadlines);
}

/** Exactly one legal append; unchanged historical claims remain anchors, not active authority. */
export function assertLrcPhaseProgression(previousRaw: unknown, nextRaw: unknown): void {
  const previous = parseLrcPhaseReadRequest(previousRaw), next = parseLrcPhaseReadRequest(nextRaw);
  const order: readonly LrcReadPhase[] = ["PROSPECTIVE", "SOLVER_ACTIVE", "REVIEW_ACTIVE", "TERMINAL"];
  if (order.indexOf(next.phase) !== order.indexOf(previous.phase) + 1)
    throw new LrcPhaseBindingError("PHASE_PROGRESSION_REFUSED");
  for (const field of Object.keys(previous) as Array<keyof LrcPhaseReadRequest>) {
    if (field === "phase") continue;
    if (canonicalJson((previous as Record<string, unknown>)[field]) !== canonicalJson((next as Record<string, unknown>)[field]))
      throw new LrcPhaseBindingError("PHASE_PROGRESSION_REFUSED");
  }
}
