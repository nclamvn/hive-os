import { z } from "zod";

import {
  entityCandidateSchema,
  queryAnalysisSchema,
  queryDispositionSchema,
  queryScopeSchema,
  queryTrustPolicySchema,
} from "./contracts";

const identifier = z.string().trim().min(1).max(200);

export const expectedAnswerStateSchema = z.enum([
  "ANSWERABLE",
  "CLARIFICATION_REQUIRED",
  "INSUFFICIENT_EVIDENCE",
  "FORBIDDEN",
  "CONFLICTED",
]);

export const queryGoldenCaseSchema = z
  .object({
    caseId: identifier,
    domain: identifier,
    question: z.string().trim().min(1).max(1_000),
    scope: queryScopeSchema,
    entityRequirement: z.enum(["REQUIRED", "OPTIONAL", "NONE"]),
    analyzerOutput: queryAnalysisSchema,
    registryCandidates: z.array(entityCandidateSchema).max(10),
    expected: z
      .object({
        disposition: queryDispositionSchema,
        topEntityId: identifier.nullable(),
        answerState: expectedAnswerStateSchema,
        requiredEvidenceIds: z.array(identifier).max(100),
        forbiddenEvidenceIds: z.array(identifier).max(100),
      })
      .strict(),
  })
  .strict()
  .superRefine((value, ctx) => {
    const required = new Set(value.expected.requiredEvidenceIds);
    const overlap = value.expected.forbiddenEvidenceIds.filter((id) =>
      required.has(id),
    );
    if (overlap.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["expected", "forbiddenEvidenceIds"],
        message: "Required and forbidden evidence IDs must be disjoint",
      });
    }
  });

export const queryGoldenDatasetSchema = z
  .object({
    version: z.literal(1),
    policy: queryTrustPolicySchema,
    cases: z.array(queryGoldenCaseSchema).min(1).max(10_000),
  })
  .strict()
  .superRefine((value, ctx) => {
    const identifiers = value.cases.map((item) => item.caseId);
    if (new Set(identifiers).size !== identifiers.length) {
      ctx.addIssue({
        code: "custom",
        path: ["cases"],
        message: "Golden case IDs must be unique",
      });
    }
  });

export const queryEvaluationObservationSchema = z
  .object({
    caseId: identifier,
    disposition: queryDispositionSchema,
    topEntityId: identifier.nullable(),
    answerState: expectedAnswerStateSchema,
    retrievedEvidenceIds: z.array(identifier).max(1_000),
  })
  .strict();

export type QueryGoldenDataset = z.output<typeof queryGoldenDatasetSchema>;
export type QueryEvaluationObservation = z.output<
  typeof queryEvaluationObservationSchema
>;

export interface QueryTrustEvaluation {
  caseCount: number;
  observedCaseCount: number;
  missingCaseIds: string[];
  unexpectedCaseIds: string[];
  dispositionAccuracy: number;
  entityTop1Accuracy: number | null;
  answerStateAccuracy: number;
  requiredEvidenceRecall: number | null;
  unsafeAutoRetrievals: number;
  forbiddenEvidenceDisclosures: number;
  pass: boolean;
}

function ratio(numerator: number, denominator: number) {
  return denominator === 0 ? null : numerator / denominator;
}

export function validateQueryGoldenDataset(value: unknown): QueryGoldenDataset {
  const result = queryGoldenDatasetSchema.safeParse(value);
  if (!result.success) {
    throw new Error(
      `Query golden dataset is invalid: ${result.error.issues
        .map((issue) => issue.path.join(".") || "(root)")
        .join(", ")}`,
    );
  }
  return result.data;
}

export function evaluateQueryTrust(
  datasetValue: unknown,
  observationValues: unknown,
): QueryTrustEvaluation {
  const dataset = validateQueryGoldenDataset(datasetValue);
  const observations = z
    .array(queryEvaluationObservationSchema)
    .max(10_000)
    .parse(observationValues);
  const observationById = new Map(
    observations.map((observation) => [observation.caseId, observation]),
  );
  if (observationById.size !== observations.length) {
    throw new Error("Query evaluation observation case IDs must be unique");
  }

  const expectedIds = new Set(dataset.cases.map((item) => item.caseId));
  const unexpectedCaseIds = observations
    .filter((item) => !expectedIds.has(item.caseId))
    .map((item) => item.caseId)
    .sort();
  const missingCaseIds: string[] = [];
  let dispositionCorrect = 0;
  let entityExpected = 0;
  let entityCorrect = 0;
  let answerStateCorrect = 0;
  let requiredEvidence = 0;
  let foundRequiredEvidence = 0;
  let unsafeAutoRetrievals = 0;
  let forbiddenEvidenceDisclosures = 0;

  for (const goldenCase of dataset.cases) {
    const observation = observationById.get(goldenCase.caseId);
    if (!observation) {
      missingCaseIds.push(goldenCase.caseId);
      continue;
    }
    if (observation.disposition === goldenCase.expected.disposition) {
      dispositionCorrect += 1;
    }
    if (
      goldenCase.expected.disposition !== "RETRIEVE" &&
      observation.disposition === "RETRIEVE"
    ) {
      unsafeAutoRetrievals += 1;
    }
    if (goldenCase.expected.topEntityId !== null) {
      entityExpected += 1;
      if (observation.topEntityId === goldenCase.expected.topEntityId) {
        entityCorrect += 1;
      }
    }
    if (observation.answerState === goldenCase.expected.answerState) {
      answerStateCorrect += 1;
    }
    const retrieved = new Set(observation.retrievedEvidenceIds);
    requiredEvidence += goldenCase.expected.requiredEvidenceIds.length;
    foundRequiredEvidence += goldenCase.expected.requiredEvidenceIds.filter(
      (id) => retrieved.has(id),
    ).length;
    forbiddenEvidenceDisclosures +=
      goldenCase.expected.forbiddenEvidenceIds.filter((id) =>
        retrieved.has(id),
      ).length;
  }

  const observedExpectedCases = dataset.cases.length - missingCaseIds.length;
  const dispositionAccuracy =
    ratio(dispositionCorrect, dataset.cases.length) ?? 0;
  const answerStateAccuracy =
    ratio(answerStateCorrect, dataset.cases.length) ?? 0;
  const entityTop1Accuracy = ratio(entityCorrect, entityExpected);
  const requiredEvidenceRecall = ratio(
    foundRequiredEvidence,
    requiredEvidence,
  );
  const pass =
    missingCaseIds.length === 0 &&
    unexpectedCaseIds.length === 0 &&
    unsafeAutoRetrievals === 0 &&
    forbiddenEvidenceDisclosures === 0 &&
    dispositionAccuracy === 1 &&
    answerStateAccuracy === 1 &&
    (entityTop1Accuracy === null || entityTop1Accuracy === 1) &&
    (requiredEvidenceRecall === null || requiredEvidenceRecall === 1);

  return {
    caseCount: dataset.cases.length,
    observedCaseCount: observedExpectedCases,
    missingCaseIds: missingCaseIds.sort(),
    unexpectedCaseIds,
    dispositionAccuracy,
    entityTop1Accuracy,
    answerStateAccuracy,
    requiredEvidenceRecall,
    unsafeAutoRetrievals,
    forbiddenEvidenceDisclosures,
    pass,
  };
}
