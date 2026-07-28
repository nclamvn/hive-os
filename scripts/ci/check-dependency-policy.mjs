// TIP-020B0 dependency gate (DEC-012). Deterministic policy over npm audit
// output vs an approved baseline. Never modifies package-lock.json; never runs
// `npm audit fix`. Pure `evaluateDependencyPolicy` + a thin CLI wrapper.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

/** Collect high-severity advisory IDs (GHSA-*) from an npm audit --json object. */
function highAdvisoryIds(audit) {
  const ids = new Set();
  const vulns = audit?.vulnerabilities ?? {};
  for (const entry of Object.values(vulns)) {
    if (entry?.severity !== "high") continue;
    for (const via of entry.via ?? []) {
      if (via && typeof via === "object") {
        if (via.source && via.severity === "high" && via.url) {
          ids.add(String(via.url).split("/").pop());
        } else if (via.url) {
          ids.add(String(via.url).split("/").pop());
        }
      }
    }
  }
  return ids;
}

function meta(audit) {
  return audit?.metadata?.vulnerabilities;
}

/**
 * Evaluate the dependency policy. Pure and deterministic.
 * @returns {{ pass: boolean, failures: string[], summary: object }}
 */
export function evaluateDependencyPolicy({ baseline, fullAudit, omitDevAudit, now }) {
  const failures = [];
  const full = meta(fullAudit);
  const runtime = meta(omitDevAudit);

  if (!baseline || !full || !runtime) {
    return {
      pass: false,
      failures: ["audit evidence missing or malformed"],
      summary: {},
    };
  }

  // Runtime exposure: any high or critical shipped to production fails.
  if (runtime.high > 0 || runtime.critical > 0) {
    failures.push(
      `runtime high/critical present (high=${runtime.high}, critical=${runtime.critical})`,
    );
  }
  // Any critical anywhere fails.
  if (full.critical > 0) {
    failures.push(`critical advisory present (critical=${full.critical})`);
  }
  // Dev-only high count may not exceed the approved ceiling.
  if (full.high > baseline.fullHigh) {
    failures.push(
      `full high ${full.high} exceeds approved baseline ${baseline.fullHigh}`,
    );
  }
  // A new high advisory not represented in the baseline fails.
  const known = new Set(baseline.knownAdvisoryIds ?? []);
  for (const id of highAdvisoryIds(fullAudit)) {
    if (!known.has(id)) failures.push(`new high advisory not in baseline: ${id}`);
  }
  // An expired risk baseline fails.
  const reference = now ? new Date(now) : new Date();
  if (reference > new Date(baseline.expiresAt)) {
    failures.push(`risk baseline expired on ${baseline.expiresAt}`);
  }

  return {
    pass: failures.length === 0,
    failures,
    summary: {
      runtimeHigh: runtime.high,
      runtimeCritical: runtime.critical,
      fullHigh: full.high,
      fullCritical: full.critical,
      moderate: full.moderate,
      baselineFullHigh: baseline.fullHigh,
      expiresAt: baseline.expiresAt,
    },
  };
}

function runAudit(omitDev) {
  const args = ["audit", "--json"];
  if (omitDev) args.push("--omit=dev");
  try {
    return JSON.parse(execFileSync("npm", args, { encoding: "utf8" }));
  } catch (err) {
    // npm audit exits non-zero when advisories exist; its stdout is still valid.
    if (err.stdout) return JSON.parse(err.stdout.toString());
    throw err;
  }
}

// CLI: node scripts/ci/check-dependency-policy.mjs [fullAudit.json omitDev.json]
if (import.meta.url === `file://${process.argv[1]}`) {
  const baseline = JSON.parse(
    readFileSync("docs/verification/dependency-risk-baseline.json", "utf8"),
  );
  const fullAudit = process.argv[2]
    ? JSON.parse(readFileSync(process.argv[2], "utf8"))
    : runAudit(false);
  const omitDevAudit = process.argv[3]
    ? JSON.parse(readFileSync(process.argv[3], "utf8"))
    : runAudit(true);

  const result = evaluateDependencyPolicy({
    baseline,
    fullAudit,
    omitDevAudit,
    now: process.env.AUDIT_POLICY_NOW,
  });

  // Sanitized summary (counts only; no secrets, paths, or registry data).
  console.log("[dependency-policy]", JSON.stringify(result.summary));
  if (!result.pass) {
    console.error("[dependency-policy] FAIL:");
    for (const f of result.failures) console.error("  - " + f);
    process.exit(1);
  }
  console.log("[dependency-policy] PASS (within approved baseline)");
}
