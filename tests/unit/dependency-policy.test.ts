import { describe, expect, it } from "vitest";

import { evaluateDependencyPolicy as rawEvaluate } from "../../scripts/ci/check-dependency-policy.mjs";

type PolicyResult = {
  pass: boolean;
  failures: string[];
  summary: Record<string, number>;
};
const evaluateDependencyPolicy = rawEvaluate as (args: {
  baseline: unknown;
  fullAudit: unknown;
  omitDevAudit: unknown;
  now?: string;
}) => PolicyResult;

// --- Synthetic audit fixtures (TEST FIXTURES ONLY — not real audit output) ---
const BASELINE = {
  expiresAt: "2026-08-31",
  fullHigh: 9,
  knownAdvisoryIds: ["GHSA-mh99-v99m-4gvg", "GHSA-5qjj-4xww-7phc"],
};

function audit(v: Record<string, number>, vulnerabilities = {}) {
  return {
    metadata: {
      vulnerabilities: {
        info: 0,
        low: 0,
        moderate: 0,
        high: 0,
        critical: 0,
        total: 0,
        ...v,
      },
    },
    vulnerabilities,
  };
}

// The approved baseline: 9 dev-only high, 0 runtime high/critical, 3 moderate.
const FULL_OK = audit(
  { high: 9, moderate: 3, total: 12 },
  {
    "brace-expansion": {
      severity: "high",
      via: [{ source: 1, severity: "high", url: "https://x/GHSA-mh99-v99m-4gvg" }],
    },
  },
);
const OMIT_DEV_OK = audit({ moderate: 3, total: 3 });
const NOW = "2026-07-29";

describe("dependency policy gate (DEC-012)", () => {
  it("DEP-GATE-01 the current approved baseline passes", () => {
    const r = evaluateDependencyPolicy({
      baseline: BASELINE,
      fullAudit: FULL_OK,
      omitDevAudit: OMIT_DEV_OK,
      now: NOW,
    });
    expect(r.pass).toBe(true);
    expect(r.failures).toEqual([]);
  });

  it("DEP-GATE-02 a runtime high fails", () => {
    const r = evaluateDependencyPolicy({
      baseline: BASELINE,
      fullAudit: FULL_OK,
      omitDevAudit: audit({ high: 1, total: 1 }),
      now: NOW,
    });
    expect(r.pass).toBe(false);
    expect(r.failures.join(" ")).toMatch(/runtime high/i);
  });

  it("DEP-GATE-03 any critical fails", () => {
    const r = evaluateDependencyPolicy({
      baseline: BASELINE,
      fullAudit: audit({ high: 9, critical: 1, total: 10 }),
      omitDevAudit: OMIT_DEV_OK,
      now: NOW,
    });
    expect(r.pass).toBe(false);
    expect(r.failures.join(" ")).toMatch(/critical/i);
  });

  it("DEP-GATE-04 a new dev-only high advisory fails", () => {
    const r = evaluateDependencyPolicy({
      baseline: BASELINE,
      fullAudit: audit(
        { high: 9, moderate: 3, total: 12 },
        {
          "new-pkg": {
            severity: "high",
            via: [{ source: 2, severity: "high", url: "https://x/GHSA-newnew-0000" }],
          },
        },
      ),
      omitDevAudit: OMIT_DEV_OK,
      now: NOW,
    });
    expect(r.pass).toBe(false);
    expect(r.failures.join(" ")).toMatch(/new high advisory/i);
  });

  it("DEP-GATE-05 an increased high count fails", () => {
    const r = evaluateDependencyPolicy({
      baseline: BASELINE,
      fullAudit: audit({ high: 10, total: 10 }),
      omitDevAudit: OMIT_DEV_OK,
      now: NOW,
    });
    expect(r.pass).toBe(false);
    expect(r.failures.join(" ")).toMatch(/exceeds approved baseline/i);
  });

  it("DEP-GATE-06 an expired baseline fails", () => {
    const r = evaluateDependencyPolicy({
      baseline: BASELINE,
      fullAudit: FULL_OK,
      omitDevAudit: OMIT_DEV_OK,
      now: "2026-09-01",
    });
    expect(r.pass).toBe(false);
    expect(r.failures.join(" ")).toMatch(/expired/i);
  });

  it("DEP-GATE-07 missing or malformed audit evidence fails", () => {
    const r = evaluateDependencyPolicy({
      baseline: BASELINE,
      fullAudit: {},
      omitDevAudit: OMIT_DEV_OK,
      now: NOW,
    });
    expect(r.pass).toBe(false);
    expect(r.failures.join(" ")).toMatch(/missing or malformed/i);
  });

  it("DEP-GATE-08 moderate findings remain visible in the summary", () => {
    const r = evaluateDependencyPolicy({
      baseline: BASELINE,
      fullAudit: FULL_OK,
      omitDevAudit: OMIT_DEV_OK,
      now: NOW,
    });
    expect(r.summary.moderate).toBe(3);
  });
});
