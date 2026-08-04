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
  fullHigh: 0,
  knownAdvisoryIds: [],
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

// TIP-023S approved baseline: zero findings in both dependency graphs.
const FULL_OK = audit({ total: 0 });
const OMIT_DEV_OK = audit({ total: 0 });
const NOW = "2026-08-04";

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
      fullAudit: audit({ critical: 1, total: 1 }),
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
        { high: 1, total: 1 },
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
      fullAudit: audit({ high: 1, total: 1 }),
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
      fullAudit: audit({ moderate: 2, total: 2 }),
      omitDevAudit: audit({ moderate: 1, total: 1 }),
      now: NOW,
    });
    expect(r.summary.moderate).toBe(2);
  });
});
