import { describe, expect, it } from "vitest";

import {
  hashSkillContract,
  isSkillCompatible,
  type SkillContractInput,
  validateSkillContract,
  validateSkillIdentity,
} from "@/modules/skill-runtime/contracts";

function contract(
  overrides: Partial<SkillContractInput> = {},
): SkillContractInput {
  return {
    semanticVersion: "1.2.0",
    capabilities: [
      "web_evidence_ingestion",
      "deterministic_registry",
    ],
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
    },
    outputSchema: {
      type: "object",
      properties: { registry: { type: "array" } },
    },
    requiredEvidence: ["source_snapshot", "exact_span"],
    failureStates: ["OPEN_INCOMPLETE", "BLOCKED"],
    verifierBinding: {
      kind: "DETERMINISTIC",
      verifierKey: "registry-hygiene",
    },
    resourceEstimate: {
      maxDurationSeconds: 900,
      maxMemoryMb: 1024,
    },
    assuranceCompatibility: ["RESEARCH", "REGULATED"],
    ...overrides,
  };
}

describe("skill contract rules", () => {
  it("SKL-U01 normalizes set-like fields and hashes object keys deterministically", () => {
    const first = validateSkillContract(contract());
    const second = validateSkillContract(
      contract({
        capabilities: [
          "deterministic_registry",
          "web_evidence_ingestion",
        ],
        inputSchema: {
          properties: { query: { type: "string" } },
          type: "object",
        },
      }),
    );

    expect(first.capabilities).toEqual([
      "deterministic_registry",
      "web_evidence_ingestion",
    ]);
    expect(hashSkillContract("refinery", first)).toBe(
      hashSkillContract("refinery", second),
    );
  });

  it("SKL-U02 rejects malformed identities and semantic versions", () => {
    expect(() =>
      validateSkillIdentity({
        skillKey: "Refinery",
        displayName: "Refinery",
        description: "Evidence ingestion",
      }),
    ).toThrow(/invalid/i);
    expect(() =>
      validateSkillContract(contract({ semanticVersion: "1.2" })),
    ).toThrow(/invalid/i);
  });

  it("SKL-U03 rejects duplicated declarations and unbounded contracts", () => {
    expect(() =>
      validateSkillContract(
        contract({
          capabilities: [
            "deterministic_registry",
            "deterministic_registry",
          ],
        }),
      ),
    ).toThrow(/duplicates/i);
    expect(() =>
      validateSkillContract(
        contract({
          resourceEstimate: {
            maxDurationSeconds: 0,
            maxMemoryMb: 1024,
          },
        }),
      ),
    ).toThrow(/invalid/i);
  });

  it("SKL-U04 requires explicit object input and output schemas", () => {
    expect(() =>
      validateSkillContract(contract({ inputSchema: { type: "string" } })),
    ).toThrow(/inputSchema\.type/i);
    expect(() =>
      validateSkillContract(contract({ outputSchema: [] })),
    ).toThrow(/outputSchema/i);
  });

  it("SKL-U05 selects only complete capability and assurance matches", () => {
    const validated = validateSkillContract(contract());
    expect(
      isSkillCompatible(
        validated,
        ["web_evidence_ingestion"],
        "RESEARCH",
      ),
    ).toBe(true);
    expect(
      isSkillCompatible(
        validated,
        ["web_evidence_ingestion", "unknown_capability"],
        "RESEARCH",
      ),
    ).toBe(false);
    expect(
      isSkillCompatible(
        validated,
        ["web_evidence_ingestion"],
        "QUICK",
      ),
    ).toBe(false);
  });
});
