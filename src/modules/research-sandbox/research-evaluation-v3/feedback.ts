import { z } from "zod";
import { evaluationDigest, digestSchema, identifierSchema, parseEvaluation, EvaluationRefusal } from "./contracts";
import { verifyBlindedDossier, type BlindedDossier } from "./dossier";

const feedbackSchema = z.object({ version: z.literal(3), dossierDigest: digestSchema, dossierToken: digestSchema,
  participantId: identifierSchema, participantKind: z.enum(["SYNTHETIC_ENGINEERING", "REAL_SELF_REPORTED"]),
  consent: z.object({ granted: z.literal(true), purpose: z.literal("SCOPED_RESEARCH_PRODUCT_EVALUATION"),
    recordedAt: z.string().datetime(), scope: z.literal("THIS_DOSSIER_ONLY"), externalSharing: z.literal(false) }).strict(),
  independentFromResearchRequester: z.boolean(), taskCompleted: z.boolean(), errorsEncountered: z.number().int().nonnegative().max(10000),
  interventionMinutes: z.number().finite().nonnegative().max(10000).nullable(), willingnessToReuse: z.enum(["YES", "NO", "UNSURE"]),
  comment: z.string().max(4096) }).strict();
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export function validateFeedback(raw: unknown, dossierRaw: BlindedDossier, authenticatedParticipantId: string) {
  const dossier = verifyBlindedDossier(dossierRaw);
  const feedback = parseEvaluation(feedbackSchema, raw, 16384);
  if (feedback.participantId !== authenticatedParticipantId || feedback.dossierToken !== dossier.token || feedback.dossierDigest !== dossier.dossierDigest)
    throw new EvaluationRefusal("AUTHORITY", "Feedback must bind authenticated participant and exact exported dossier");
  // Self-report does not establish mathematical expertise or actual independence.
  // Engineering fixtures never count toward R12b even with distinct accounts.
  const body = { ...feedback, minuteProvenance: feedback.interventionMinutes === null ? "UNKNOWN" : "SELF_REPORT",
    eligibleForEmpiricalAcceptance: false, realParticipantValidation: feedback.participantKind === "SYNTHETIC_ENGINEERING" ? "EXCLUDED_SYNTHETIC" : "PENDING_INDEPENDENT_HUMAN_VALIDATION",
    externalValue: "NOT_ESTABLISHED" };
  return { ...body, feedbackDigest: evaluationDigest(body) };
}
