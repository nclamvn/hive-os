import { z } from "zod";
import type { Prisma } from "@prisma/client";

export const MATH_CASE_SUMMARY_LIMIT = 20;
export const MATH_CYCLE_DETAIL_LIMIT = 3;
export const MATH_CALIBRATION_SCAN_LIMIT = 200;
export const dossierIdSchema = z.string().uuid();
const cursorSchema = z.object({ version: z.literal(1), missionId: dossierIdSchema,
  scopeId: z.string().max(36), createdAt: z.string().datetime(), id: dossierIdSchema }).strict();
export type DossierCursor = z.infer<typeof cursorSchema>;

export function encodeDossierCursor(value: Omit<DossierCursor, "version">): string {
  return Buffer.from(JSON.stringify(cursorSchema.parse({ version: 1, ...value }))).toString("base64url");
}

export function decodeDossierCursor(raw: unknown, missionId: string, scopeId = ""): DossierCursor | null {
  if (raw === undefined || raw === "") return null;
  if (typeof raw !== "string" || raw.length > 512 || !/^[A-Za-z0-9_-]+$/.test(raw)) throw new Error("Invalid dossier query");
  let cursor: DossierCursor;
  try { cursor = cursorSchema.parse(JSON.parse(Buffer.from(raw, "base64url").toString("utf8"))); }
  catch { throw new Error("Invalid dossier query"); }
  if (cursor.missionId !== missionId || cursor.scopeId !== scopeId ||
    encodeDossierCursor(cursor) !== raw) throw new Error("Invalid dossier query");
  return cursor;
}

export function parseDossierQuery(query: { caseId?: unknown; cycleId?: unknown; casesAfter?: unknown; cyclesAfter?: unknown }, missionId: string) {
  const caseId = query.caseId === undefined || query.caseId === "" ? null : dossierIdSchema.parse(query.caseId);
  const cycleId = query.cycleId === undefined || query.cycleId === "" ? null : dossierIdSchema.parse(query.cycleId);
  if (cycleId && (!caseId || query.cyclesAfter !== undefined)) throw new Error("Invalid dossier query");
  return { caseId, cycleId, casesAfter: decodeDossierCursor(query.casesAfter, missionId),
    cyclesAfter: decodeDossierCursor(query.cyclesAfter, missionId, caseId ?? "") };
}

export function olderThanCursor(cursor: DossierCursor | null) {
  return cursor ? { OR: [{ createdAt: { lt: new Date(cursor.createdAt) } },
    { createdAt: new Date(cursor.createdAt), id: { lt: cursor.id } }] } : {};
}

export function calibrationCandidateFilter(providerName: string, modelName: string, cursor: DossierCursor | null): Prisma.MathPilotCaseWhereInput {
  return { caseType: { in: ["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE"] },
    researchRun: { providerName, modelName, status: { in: ["APPROVED", "AWAITING_REVIEW"] } },
    OR: [{ assessment: { conclusion: { in: ["SUPPORTED_ARGUMENT", "VALID_COUNTEREXAMPLE"] } } },
      { agentReview: { disposition: "AI_REVIEWED", conclusion: { in: ["SUPPORTED_ARGUMENT", "VALID_COUNTEREXAMPLE"] } } }],
    AND: [olderThanCursor(cursor)] };
}
