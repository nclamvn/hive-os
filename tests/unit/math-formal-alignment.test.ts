import { describe, expect, it } from "vitest";

import { deriveFormalAlignmentReport, FORMAL_ALIGNMENT_CHECKS,
  formalAlignmentInputSchema } from "@/modules/research-sandbox/math-formal-alignment";

const base = {
  formalAttemptId: "f7e66e97-75a8-42b3-8bee-33b29111a51e",
  checks: FORMAL_ALIGNMENT_CHECKS.map((criterion) => ({ criterion, verdict: "ALIGNED" as const,
    note: `The ${criterion} mapping matches the fixed problem statement.` })),
  rationale: "Each checked clause was compared against the original quantified problem; this is only a local operator review.",
  confirmed: true,
};

describe("formal semantic-alignment gate", () => {
  it("requires every mapping criterion and derives the local evidence ceiling", () => {
    expect(deriveFormalAlignmentReport(base)).toMatchObject({ status: "OPERATOR_ALIGNED",
      evidenceCeiling: "LOCAL_SEMANTIC_ATTESTATION_NOT_PUBLICATION_CERTIFICATE" });
    expect(formalAlignmentInputSchema.safeParse({ ...base, checks: base.checks.slice(1) }).success).toBe(false);
    expect(formalAlignmentInputSchema.safeParse({ ...base, checks: [...base.checks.slice(1), base.checks[1]] }).success).toBe(false);
  });

  it("does not turn an issue or an unchecked confirmation into alignment", () => {
    expect(deriveFormalAlignmentReport({ ...base, confirmed: false }).status).toBe("UNRESOLVED");
    expect(deriveFormalAlignmentReport({ ...base,
      checks: [{ ...base.checks[0]!, verdict: "ISSUE" }, ...base.checks.slice(1)] }).status).toBe("ISSUE_FOUND");
  });
});
