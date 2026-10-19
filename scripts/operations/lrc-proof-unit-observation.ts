/** Explicit one-shot CLI; never import this from the web or continuous worker. */
import { open, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import { ObservationBudget, ObservationStop, assertObservationLocalEnvironment,
  writeCompleteObservationReceipt } from "../../src/server/operations/lrc-controlled-observation";
import { LRC_PROOF_UNIT_OBSERVATION_TARGET, observeLrcProofUnitOnce } from "../../src/server/operations/lrc-proof-unit-observation";

async function main() {
  const budget = new ObservationBudget(performance.now());
  const args = process.argv.slice(2);
  const mode = args.shift();
  if (mode !== "preflight" && mode !== "run") throw new ObservationStop("EXPLICIT_PREFLIGHT_OR_RUN_REQUIRED");
  const values = new Map<string, string>();
  let activate = false, confirm = false;
  while (args.length) {
    const key = args.shift()!;
    if (key === "--activate-local" && !activate) { activate = true; continue; }
    if (key === "--confirm-one-run" && !confirm) { confirm = true; continue; }
    if (!["--actor-user-id", "--actor-email", "--receipt"].includes(key) || values.has(key)) throw new ObservationStop("INVALID_CLI_ARGUMENT");
    const value = args.shift();
    if (!value || value.startsWith("--")) throw new ObservationStop("INVALID_CLI_ARGUMENT");
    values.set(key, value);
  }
  if ((values.has("--actor-user-id") ? 1 : 0) + (values.has("--actor-email") ? 1 : 0) !== 1) throw new ObservationStop("ONE_EXPLICIT_ACTOR_REQUIRED");
  if (mode === "run" && (!activate || !confirm)) throw new ObservationStop("EXPLICIT_ONE_RUN_ACTIVATION_REQUIRED");
  if (mode === "preflight" && (activate || confirm)) throw new ObservationStop("PREFLIGHT_MUST_KEEP_DISPATCH_CLOSED");
  const receiptPath = values.get("--receipt");
  if (!receiptPath || !receiptPath.startsWith("/") || dirname(resolve(receiptPath)) === "/") throw new ObservationStop("ABSOLUTE_NEW_RECEIPT_PATH_REQUIRED");
  // Never load, print or write environment files. Caller supplies existing runtime env.
  if (activate) {
    process.env.MATH_PILOT_QUEUE_ENABLED = "true";
    process.env.RESEARCH_CODEX_LOCAL_ENABLED = "true";
    process.env.LRC_CAMPAIGN_LOCAL_ENABLED = "true";
  }
  const handle = await open(receiptPath, "wx", 0o600);
  await handle.chmod(0o600);
  const receipt = { async append(record: Record<string, unknown>) {
    await writeCompleteObservationReceipt(`${JSON.stringify({ timestamp: new Date().toISOString(), ...record })}\n`, {
      write: (buffer, offset, length) => handle.write(buffer, offset, length, null),
      sync: () => handle.sync(),
    });
  } };
  const stop = () => budget.controller.abort();
  process.on("SIGINT", stop); process.on("SIGTERM", stop);
  let runtimeLoaded = false;
  let observationStarted = false;
  try {
    await receipt.append({ event: "CLI_BEGIN", mode, target: LRC_PROOF_UNIT_OBSERVATION_TARGET, elapsedMs: budget.now() - budget.started });
    assertObservationLocalEnvironment(process.env);
    // Fixed non-secret product sources, not environment or arbitrary operator paths.
    const root=resolve(dirname(fileURLToPath(import.meta.url)),"../..");
    const sources=["src/modules/research-sandbox/math-lrc-proof-unit.ts","src/modules/research-sandbox/math-lrc-proof-unit-live.ts",
      "src/modules/research-sandbox/math-lrc-proof-unit-identity.ts","src/modules/research-sandbox/math-pilot.ts",
      "src/modules/research-sandbox/contracts.ts","src/modules/research-sandbox/agent-review.ts",
      "src/modules/research-sandbox/worker.ts","src/modules/research-sandbox/agent-review-kernel.ts",
      "src/modules/research-sandbox/kernel.ts","src/modules/research-sandbox/math-cycle-kernel.ts",
      "src/modules/research-sandbox/adapters/codex-local-math.ts","src/modules/research-sandbox/adapters/codex-local-review.ts",
      "src/server/operations/lrc-controlled-observation.ts","src/server/operations/lrc-proof-unit-observation.ts",
      "src/server/operations/lrc-proof-unit-observation-runtime.ts","scripts/operations/lrc-proof-unit-observation.ts"];
    const pins:Record<string,string>={};
    for(const source of sources) {
      budget.require(1);const bytes=await readFile(resolve(root,source));
      if(bytes.byteLength>262144) throw new ObservationStop("SOURCE_PIN_SIZE_LIMIT");
      pins[source]=createHash("sha256").update(bytes).digest("hex");
    }
    await receipt.append({event:"SOURCE_PINS",pins});budget.require(1);
    const { createProofUnitObservationRuntime } = await import("../../src/server/operations/lrc-proof-unit-observation-runtime");
    const actor = values.has("--actor-user-id") ? { userId: values.get("--actor-user-id")! } : { email: values.get("--actor-email")! };
    const runtime = createProofUnitObservationRuntime({ actor, receipt, budget, mode });
    runtimeLoaded = true;
    observationStarted = true;
    const result = await observeLrcProofUnitOnce({ mode, runtime, receipt, budget });
    process.stdout.write(`${JSON.stringify({ ...result, receiptPath, target: LRC_PROOF_UNIT_OBSERVATION_TARGET })}\n`);
    if (result.status === "NOT_RUN" || result.status === "PARTIAL_OR_FAILED") process.exitCode = 1;
  } catch (error) {
    const status = observationStarted && mode === "run" ? "EXECUTION_UNKNOWN" : "NOT_RUN";
    const code = error instanceof ObservationStop ? error.code : observationStarted ? "RECEIPT_OR_OBSERVATION_FAILED" : "LOCAL_RUNTIME_INITIALIZATION_FAILED";
    await receipt.append({ event: "FINAL", status, code }).catch(() => {
      process.stderr.write("TIP-064 operator receipt retention failed; execution state may be unknown. Do not retry.\n");
    });
    process.exitCode = 1;
  } finally {
    process.off("SIGINT", stop); process.off("SIGTERM", stop);
    await handle.close();
    // Prisma pool is local to this one-shot process; explicit disconnect prevents idle linger.
    // getDb is lazy; do not instantiate a client on a rejected environment.
    if (runtimeLoaded) {
      const { getDb } = await import("../../src/server/db");
      await getDb().$disconnect();
    }
  }
}

void main().catch(() => { process.stderr.write("TIP-064 refused CLI invocation; no secret diagnostics emitted.\n"); process.exitCode = 1; });
