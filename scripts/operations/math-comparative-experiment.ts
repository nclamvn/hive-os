/** Fixed offline fixture runner. Never launches a model, provider, shell, worker or database. */
import { open } from "node:fs/promises";

import { comparativeFixtureDrivers, comparativeFixtureExecutor, comparativePlanBody, defaultComparativeFixturePlan,
  runComparativeExperiment, sealComparativePlan, verifyComparativeResult } from "../../src/modules/research-sandbox/math-comparative-experiment";

const MAX_RETAINED_BYTES = 2_097_152;

async function main() {
  const args = process.argv.slice(2);
  if (args.length > 1) throw new Error("Use one fixed scenario or --verify=<retained.json>");
  const arg = args[0] ?? "--scenario=complete";
  if (arg.startsWith("--verify=")) {
    const path = arg.slice("--verify=".length);
    if (!path) throw new Error("Missing inert JSON file");
    const file = await open(path, "r");
    try {
      const buffer = Buffer.alloc(MAX_RETAINED_BYTES + 1);
      let bytes = 0;
      while (bytes <= MAX_RETAINED_BYTES) {
        const read = await file.read(buffer, bytes, buffer.length - bytes, null);
        bytes += read.bytesRead;
        if (!read.bytesRead) break;
      }
      if (bytes > MAX_RETAINED_BYTES) throw new Error("Retained input exceeds byte cap");
      const raw: unknown = JSON.parse(buffer.subarray(0, bytes).toString("utf8"));
      const valid = verifyComparativeResult(raw);
      process.stdout.write(JSON.stringify({ mode: "INERT_RETAINED_JSON_VERIFICATION", integrity: valid ? "PASS" : "FAIL",
        executionAuthenticity: "UNATTESTED", scientificYield: "NOT_MEASURED" }) + "\n");
      if (!valid) process.exitCode = 1;
    } finally { await file.close(); }
    return;
  }
  const scenario = arg.slice("--scenario=".length);
  if (!arg.startsWith("--scenario=") || !["complete", "unknown-usage", "overshoot", "uncooperative-timeout"].includes(scenario))
    throw new Error("Unknown fixed offline scenario");
  const fixture = defaultComparativeFixturePlan();
  let plan = fixture.plan;
  let executor = comparativeFixtureExecutor;
  if (scenario === "unknown-usage") executor = async request => {
    if (request.kind === "MODEL") throw new Error("Fixed failure with unavailable usage");
    return comparativeFixtureExecutor(request);
  };
  if (scenario === "overshoot" || scenario === "uncooperative-timeout") {
    const body = comparativePlanBody(plan);
    plan = sealComparativePlan({ ...body, envelope: { ...plan.envelope,
      ...(scenario === "overshoot" ? { maxObservedTokens: 100 } : { maxOperationMs: 5 }) } });
  }
  if (scenario === "uncooperative-timeout") executor = async () => new Promise(() => {});
  const result = await runComparativeExperiment({ plan, references: fixture.references,
    drivers: comparativeFixtureDrivers(), executor });
  const output = JSON.stringify({ scenario, result });
  if (Buffer.byteLength(output) > MAX_RETAINED_BYTES) throw new Error("Retained output exceeds byte cap");
  // --verify accepts the inner result, not this presentation wrapper.
  process.stdout.write(JSON.stringify(result) + "\n");
}

main().catch(() => {
  process.stderr.write("Offline comparative framework failed; no model execution was attempted.\n");
  process.exitCode = 1;
});
