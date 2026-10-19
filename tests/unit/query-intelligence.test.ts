import goldenDataset from "../fixtures/query-trust/golden-cases.v1.json";
import { describe, expect, it } from "vitest";

import {
  compileQueryPlan,
  evaluateQueryTrust,
  QueryTrustContractError,
  validateQueryGoldenDataset,
} from "@/modules/query-intelligence";

const scope = {
  organizationId: "10000000-0000-4000-8000-000000000001",
  workspaceId: "20000000-0000-4000-8000-000000000001",
  missionIds: [],
  asOf: null,
};

const policy = {
  minimumInterpretationConfidence: 0.6,
  autoRetrieveMinimum: 0.85,
  clarificationMinimum: 0.6,
  minimumCandidateSeparation: 0.15,
};

const analysis = {
  normalizedQuestion: "OmniSight hoạt động được bao lâu?",
  language: "vi",
  intent: "LOOKUP",
  requestedAttributes: ["endurance"],
  entityMentions: ["omni"],
  ambiguitySignals: [],
  interpretationConfidence: 0.91,
};

function candidate(
  entityId: string,
  confidence: number,
  lifecycle: "ACTIVE" | "DEPRECATED" = "ACTIVE",
) {
  return {
    entityId,
    entityKind: "PRODUCT",
    canonicalName: entityId,
    confidence,
    matchBasis: "NORMALIZED_ALIAS",
    lifecycle,
    registryRevision: 1,
  };
}

describe("enterprise query trust contracts (TIP-024A)", () => {
  it("QTRUST-01 compiles a confident registry match as read-only retrieval", () => {
    const plan = compileQueryPlan({
      rawQuestion: "con omni bay dc bao lau",
      analysis,
      trustedScope: scope,
      entityRequirement: "REQUIRED",
      registryCandidates: [candidate("PRODUCT.OMNISIGHT", 0.91)],
      policy,
    });

    expect(plan).toMatchObject({
      version: 1,
      disposition: "RETRIEVE",
      dispositionReasons: ["CONFIDENT_ENTITY"],
      policy,
      authorizationState: "REQUIRED_AT_RETRIEVAL",
      authority: "READ_ONLY_NON_AUTHORITATIVE",
    });
  });

  it("QTRUST-02 fails closed for ambiguity, close candidates and unknown entities", () => {
    const ambiguous = compileQueryPlan({
      rawQuestion: "Omni là gì?",
      analysis: { ...analysis, ambiguitySignals: ["multiple matches"] },
      trustedScope: scope,
      entityRequirement: "REQUIRED",
      registryCandidates: [
        candidate("PRODUCT.OMNISIGHT", 0.74),
        candidate("MODULE.OMNICORE", 0.72),
      ],
      policy,
    });
    expect(ambiguous.disposition).toBe("CLARIFY");
    expect(ambiguous.dispositionReasons).toContain("ANALYZER_AMBIGUITY");

    const closeCandidates = compileQueryPlan({
      rawQuestion: "Omni là gì?",
      analysis,
      trustedScope: scope,
      entityRequirement: "REQUIRED",
      registryCandidates: [
        candidate("PRODUCT.OMNISIGHT", 0.92),
        candidate("MODULE.OMNICORE", 0.82),
      ],
      policy,
    });
    expect(closeCandidates.dispositionReasons).toEqual([
      "CANDIDATES_TOO_CLOSE",
    ]);

    const unknown = compileQueryPlan({
      rawQuestion: "Phoenix Mk9 là gì?",
      analysis,
      trustedScope: scope,
      entityRequirement: "REQUIRED",
      registryCandidates: [],
      policy,
    });
    expect(unknown).toMatchObject({
      disposition: "KNOWLEDGE_GAP",
      dispositionReasons: ["NO_REGISTRY_CANDIDATE"],
    });
  });

  it("QTRUST-03 requires clarification for medium confidence and deprecated entities", () => {
    const medium = compileQueryPlan({
      rawQuestion: "OmniSight là gì?",
      analysis,
      trustedScope: scope,
      entityRequirement: "REQUIRED",
      registryCandidates: [candidate("PRODUCT.OMNISIGHT", 0.75)],
      policy,
    });
    expect(medium.dispositionReasons).toEqual(["MEDIUM_ENTITY_CONFIDENCE"]);

    const deprecated = compileQueryPlan({
      rawQuestion: "Omni legacy là gì?",
      analysis,
      trustedScope: scope,
      entityRequirement: "REQUIRED",
      registryCandidates: [candidate("PRODUCT.OMNI-LEGACY", 0.99, "DEPRECATED")],
      policy,
    });
    expect(deprecated.dispositionReasons).toEqual(["DEPRECATED_ENTITY"]);

    const lowInterpretation = compileQueryPlan({
      rawQuestion: "cái này thì sao?",
      analysis: { ...analysis, interpretationConfidence: 0.2 },
      trustedScope: scope,
      entityRequirement: "NONE",
      registryCandidates: [],
      policy,
    });
    expect(lowInterpretation.dispositionReasons).toEqual([
      "LOW_INTERPRETATION_CONFIDENCE",
    ]);
  });

  it("QTRUST-04 never accepts analyzer-selected authorization scope", () => {
    expect(() =>
      compileQueryPlan({
        rawQuestion: "OmniSight là gì?",
        analysis: { ...analysis, workspaceId: scope.workspaceId },
        trustedScope: scope,
        entityRequirement: "REQUIRED",
        registryCandidates: [candidate("PRODUCT.OMNISIGHT", 0.91)],
        policy,
      }),
    ).toThrow(QueryTrustContractError);
  });

  it("QTRUST-05 validates the seed golden dataset and reproduces its plans", () => {
    const dataset = validateQueryGoldenDataset(goldenDataset);
    expect(dataset.cases).toHaveLength(4);
    for (const goldenCase of dataset.cases) {
      const plan = compileQueryPlan({
        rawQuestion: goldenCase.question,
        analysis: goldenCase.analyzerOutput,
        trustedScope: goldenCase.scope,
        entityRequirement: goldenCase.entityRequirement,
        registryCandidates: goldenCase.registryCandidates,
        policy: dataset.policy,
      });
      expect(plan.disposition).toBe(goldenCase.expected.disposition);
      expect(plan.candidates[0]?.entityId ?? null).toBe(
        goldenCase.expected.topEntityId,
      );
    }
  });

  it("QTRUST-06 evaluation fails on unsafe retrieval or forbidden evidence", () => {
    const dataset = validateQueryGoldenDataset(goldenDataset);
    const observations = dataset.cases.map((goldenCase) => ({
      caseId: goldenCase.caseId,
      disposition: goldenCase.expected.disposition,
      topEntityId: goldenCase.expected.topEntityId,
      answerState: goldenCase.expected.answerState,
      retrievedEvidenceIds: goldenCase.expected.requiredEvidenceIds,
    }));
    expect(evaluateQueryTrust(dataset, observations)).toMatchObject({
      pass: true,
      unsafeAutoRetrievals: 0,
      forbiddenEvidenceDisclosures: 0,
      dispositionAccuracy: 1,
    });

    observations[1] = {
      ...observations[1]!,
      disposition: "RETRIEVE",
      retrievedEvidenceIds: ["EVIDENCE.OMNISIGHT.ENDURANCE.CURRENT"],
    };
    expect(evaluateQueryTrust(dataset, observations)).toMatchObject({
      pass: false,
      unsafeAutoRetrievals: 1,
      forbiddenEvidenceDisclosures: 1,
    });
  });
});
