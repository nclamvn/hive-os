import { z } from "zod";
import type { ExactClosure, HostVerifierReceipt, ProblemContract } from "../research-core-v3/types";

const count = (max: number) => z.number().int().nonnegative().max(max);
const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const campaignEnvelopeSchema = z.object({
  version: z.literal(3),
  provider: z.literal("CONTROLLED_LOCAL"),
  requestedModel: z.string().min(1).max(120),
  requestedModelVersion:z.string().min(1).max(120).optional(),
  methods: z.array(z.string().regex(/^[A-Z][A-Z0-9_]{0,63}$/)).min(1).max(8),
  total: z.object({
    calls: count(32), tokens: count(1_000_000), checkerOperations: count(20_000_000),
    computeMilliseconds: count(600_000), readBytes: count(64 * 1024 * 1024),
    writeBytes: count(64 * 1024 * 1024),
  }).strict(),
  perCall: z.object({ tokens: count(120_000), milliseconds: count(120_000) }).strict(),
  stop: z.object({ maxRounds: z.number().int().min(1).max(8), maxNoInformation: z.number().int().min(1).max(8), deadlineAt: z.string().datetime() }).strict(),
  recovery: z.object({ replacementDeliveries: count(1), verifierReplays: count(1),
    diagnosticIncidents: count(8), diagnosticReadBytes: count(8 * 1024 * 1024), diagnosticMilliseconds: count(60_000) }).strict(),
  evaluation: z.object({ preregistrationDigest: digest, pairId: z.string().min(1).max(120), taskId: z.string().min(1).max(120),
    studyCommandId:z.string().uuid().optional(),
    arm: z.enum(["DIRECT_WITH_TOOLS", "METHOD_ASSISTED"]), exposureDigest: digest, toolsetDigest: digest,
    resourceCeilingDigest: digest, seed: count(2_147_483_647), order: count(10000) }).strict().optional(),
  postgrade: z.object({actions:z.number().int().min(1).max(16),total:z.object({calls:z.literal(0),tokens:z.literal(0),
    checkerOperations:count(20_000_000),computeMilliseconds:count(120000),readBytes:count(16*1024*1024),writeBytes:count(16*1024*1024)}).strict()}).strict().optional(),
}).strict();
export type CampaignEnvelope = z.infer<typeof campaignEnvelopeSchema>;
export type CampaignStatus = "QUEUED" | "RUNNING" | "VERIFYING" | "PAUSED_FOR_DECISION" | "RESOURCE_STOP" | "FAILED" | "COMPLETED";
export type Resources = CampaignEnvelope["total"];
export type FailureKind = "TRANSPORT" | "SCHEMA" | "CHECKER" | "RESOURCE" | "INTEGRITY" | "SCIENTIFIC" | "AUTHORITY";
export interface CampaignStage {
  contractDigest:string;rootId:string;obligationId:string;adapterId:string;adapterVersion:number;
  actionId: string; attemptId: string; round: number; methodId: string; delivery: number;
  fence: "NOT_CROSSED" | "STARTED" | "RESULT_RETAINED" | "VERIFIED";
  candidateKey: string | null; candidateDigest: string | null; candidateBytes: number | null;
  sourceBundleDigest: string; inputDigest: string; predicateDigest: string;
  checkerSourceDigest: string; authorityEpoch: string; runtimeSourceDigest: string;
  checkerReservations: number; startedAt: string | null; returnedAt: string | null;
  receipt: HostVerifierReceipt | null; closure: ExactClosure | null;
}
export interface CampaignState {
  status: CampaignStatus; nextAction: string; stopReason: string | null;
  spent: Resources; diagnosticSpent: { incidents: number; readBytes: number; milliseconds: number };
  rounds: number; noInformation: number; replacements: number; verifierReplays: number;
  retiredCandidateDigests: string[]; stage: CampaignStage | null;
  retiredPredicateDigests:string[];
  requestedModel: string; attestedModel: string | null;
  attestedModelVersion:string|null;
  observedTokens: number | null; accountingComplete: boolean;
  observedKnownTokens:number;unknownUsageActions:number;
  queueLatencyMilliseconds:number|null;
  routinePrompts: number; consequentialPrompts: number;
  closure: ExactClosure | null; failure: FailureKind | null;
  executionFailure:FailureKind|null;
  postgradeSpent: Resources; postgradeActions: number;
  postgradePending: {actionId:string;kind:string;cutDigest:string;started:boolean} | null;
}
export interface CampaignEventView {
  id: string; campaignId: string; sequence: number; eventType: string; actionKey: string;
  previousDigest: string | null; digest: string; jobId: string | null; createdAt: string;
  payload: { state: CampaignState; detail: Record<string, unknown> };
}
export interface CampaignView {
  id: string; organizationId: string; workspaceId: string; missionId: string;
  version: number; contract: ProblemContract; contractDigest: string; envelope: CampaignEnvelope;
  envelopeDigest: string; sourceBundleDigest: string; authorityEpoch: string;
  status: CampaignStatus; state: CampaignState; events: CampaignEventView[];
  complete: true; eventCut: { sequence: number; digest: string }; revokedAt: string | null;
}
export interface ControlledCampaignProvider {
  readonly kind: "CONTROLLED_LOCAL";
  readonly requestedModel: string;
  execute(input: { actionId: string; deliveryId: string; attemptId: string; methodId: string;
    request: unknown; maxTokens: number; signal: AbortSignal }): Promise<{
      originalBytes: string; attestedModel: string | null;
      attestedModelVersion?:string|null;
      usage: { tokens: number | null; provenance: "CONTROLLED_PROVIDER_LOG" | "UNKNOWN" };
  }>;
}
export interface CampaignWorkerInput {
  organizationId: string; actorUserId: string; workerId: string; jobId: string; expectedVersion: number;
  provider: ControlledCampaignProvider;
  /** Trusted QA process seam, never exposed through a request or model schema. */
  onBoundary?: (stage: "BEFORE_START" | "AFTER_START" | "AFTER_RESULT" | "AFTER_VERIFIED") => Promise<void>;
}
export class CampaignRefusal extends Error {
  constructor(readonly code: FailureKind, message: string) { super(message); this.name = "CampaignRefusal"; }
}
export const campaignJobType = "research.campaign.v3.round";
export const zeroResources = (): Resources => ({ calls: 0, tokens: 0, checkerOperations: 0, computeMilliseconds: 0, readBytes: 0, writeBytes: 0 });
