import { evaluationDigest, EvaluationRefusal, parseEvaluation, digestSchema } from "./contracts";
import { z } from "zod";
import { sha256 } from "@/modules/execution-fabric/contracts";
import type { CampaignView } from "../research-campaign/contracts";
import type { Postgrade } from "./evaluator";
import { validateHistoricalGrade } from "./evaluator";

export const DOSSIER_BYTES = 262144;
const dossierSchema = z.object({ version: z.literal(3), token: digestSchema, campaignDigest: digestSchema,
  contractDigest: digestSchema, candidateDigest: digestSchema.nullable(), sourceBundleDigest: digestSchema,
  gradeDigest: digestSchema, target: z.string().min(1).max(16384), candidate: z.string().max(65536).nullable(),
  acceptanceType: z.string().max(64).nullable(), checkedScope: z.unknown(), outcome: z.enum(["ACCEPTED_EXACT_SCOPE", "REJECTED", "INCONCLUSIVE", "UNAVAILABLE"]),
  wholeProblemSolved: z.literal(false), noveltyEstablished: z.literal(false), externalAcceptance: z.literal("NOT_RUN"),
  blinding: z.literal("ARM_PROVIDER_USAGE_IDENTITIES_REMOVED_CONTENT_CAN_REVEAL_METHOD"),
  provenance: z.literal("CONTROLLED_ENGINEERING_NOT_LIVE_MODEL_OR_REAL_USER_ACCEPTANCE"), dossierDigest: digestSchema }).strict();
export type BlindedDossier = z.infer<typeof dossierSchema>;
export function buildBlindedDossier(campaign: CampaignView, grade: Postgrade, originalBytes: string | null): BlindedDossier {
  validateHistoricalGrade(campaign, grade);
  if (grade.campaignId !== campaign.id || originalBytes !== null && (!grade.receipt || sha256(originalBytes) !== grade.candidateDigest)) throw new EvaluationRefusal("INTEGRITY", "Dossier campaign/candidate mismatch");
  const body = { version: 3 as const, token: evaluationDigest({ campaign: campaign.id, grade: evaluationDigest(grade) }),
    campaignDigest: evaluationDigest({ id: campaign.id, cutDigest: grade.cutDigest, envelopeDigest: campaign.envelopeDigest }), contractDigest: campaign.contractDigest, candidateDigest: grade.candidateDigest,
    sourceBundleDigest: campaign.sourceBundleDigest, gradeDigest: evaluationDigest(grade), target: campaign.contract.target,
    candidate: originalBytes, acceptanceType: grade.receipt?.acceptanceType ?? null, checkedScope: grade.receipt?.checkedScope ?? null,
    outcome: grade.status, wholeProblemSolved: false as const, noveltyEstablished: false as const, externalAcceptance: "NOT_RUN" as const,
    blinding: "ARM_PROVIDER_USAGE_IDENTITIES_REMOVED_CONTENT_CAN_REVEAL_METHOD" as const,
    provenance: "CONTROLLED_ENGINEERING_NOT_LIVE_MODEL_OR_REAL_USER_ACCEPTANCE" as const };
  return parseEvaluation(dossierSchema, { ...body, dossierDigest: evaluationDigest(body) }, DOSSIER_BYTES);
}
export function verifyBlindedDossier(raw: unknown) {
  const dossier = parseEvaluation(dossierSchema, raw, DOSSIER_BYTES), { dossierDigest, ...body } = dossier;
  if (evaluationDigest(body) !== dossierDigest) throw new EvaluationRefusal("INTEGRITY", "Dossier seal changed");
  return dossier;
}
