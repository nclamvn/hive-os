import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { constants, closeSync, fstatSync, openSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildLrcSharpShiftMarginReport,
  type ShiftMarginBudget,
  type ShiftMarginEvidence,
} from "../../src/modules/research-sandbox/math-lrc-shift-margin";

export const LRC_SHIFT_MARGIN_PYTHON_SHA256 = "526ea120b5254fffd1ad1571db2ec351bd264f7ebf4f2febe6e5763e4d0ce353";
export const LRC_SHIFT_MARGIN_CORE_SHA256 = "86c23ecfd0fd68d28d093dfceebe92abf83929d5c06c17881349f674779d6132";
export const LRC_SHIFT_MARGIN_PYTHON = "/opt/homebrew/bin/python3";
const REPLAY_VERSION = "LRC_SHARP_SHIFT_MARGIN_REPLAY_V1";
const MAX_BYTES = 32768, MAX_MS = 5000, MAX_OPS = 2000000;
const root = resolve(fileURLToPath(new URL("../../", import.meta.url)));
const pythonPath = resolve(root, "scripts/research/lrc-shift-margin-replay.py");
const corePath = resolve(root, "src/modules/research-sandbox/math-lrc-shift-margin.ts");
const flags = ["RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED", "LRC_CAMPAIGN_LOCAL_ENABLED",
  "RESEARCH_OPENAI_ENABLED", "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED"] as const;
type Status = "MATCH" | "MISMATCH" | "PROCESS_REFUSED" | "SOURCE_REFUSED" | "RESOURCE_REFUSED" | "FLAGS_REFUSED";
type Metrics = { elapsedMs: number; chargedOperations: number };
export interface ShiftMarginAuditResult {
  status: Status;
  evidence: ShiftMarginEvidence | null;
  sourcePins: { python: string; core: string } | null;
  metrics: { elapsedMs: number; chargedOperations: number; core: Metrics | null; python: Metrics | null; processElapsedMs: number | null };
  assurance: "LOCAL_SOURCE_BYTES_AND_PROCESS_CONSISTENCY_NOT_SIGNED_ATTESTATION";
  agentLoop: "NOT_RUN";
  executionAuthority: false;
}
class Fault extends Error { constructor(readonly status: Status) { super(status); } }
const digest = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
class OuterWork {
  operations = 0;
  readonly ms: number;
  readonly maximum: number;
  constructor(raw: ShiftMarginBudget, readonly started: number) {
    if (!raw || Object.getPrototypeOf(raw) !== Object.prototype || Object.getOwnPropertySymbols(raw).length) throw new Fault("RESOURCE_REFUSED");
    const entries = Object.getOwnPropertyDescriptors(raw);
    if (Object.keys(entries).sort().join(",") !== "remainingMs,remainingOperations" || !("value" in entries.remainingMs) || !("value" in entries.remainingOperations)) throw new Fault("RESOURCE_REFUSED");
    const ms = entries.remainingMs.value, ops = entries.remainingOperations.value;
    if (typeof ms !== "number" || !Number.isSafeInteger(ms) || ms <= 0 || ms > MAX_MS || typeof ops !== "number" || !Number.isSafeInteger(ops) || ops <= 0 || ops > MAX_OPS) throw new Fault("RESOURCE_REFUSED");
    this.ms = ms; this.maximum = ops;
  }
  charge(steps = 1): void {
    if (!Number.isSafeInteger(steps) || steps < 0 || this.operations + steps > this.maximum || performance.now() - this.started > this.ms) throw new Fault("RESOURCE_REFUSED");
    this.operations += steps;
  }
  remaining(): ShiftMarginBudget {
    this.charge();
    const remainingMs = Math.floor(this.ms - (performance.now() - this.started));
    const remainingOperations = this.maximum - this.operations;
    if (remainingMs < 1 || remainingOperations < 1) throw new Fault("RESOURCE_REFUSED");
    return { remainingMs, remainingOperations };
  }
}
function pinnedSource(path: string, pin: string, work: OuterWork): Buffer {
  work.charge(); let fd: number | undefined;
  try {
    fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
    const before = fstatSync(fd);
    if (!before.isFile() || before.size <= 0 || before.size > MAX_BYTES) throw new Fault("SOURCE_REFUSED");
    const source = readFileSync(fd), after = fstatSync(fd);
    work.charge(Math.ceil(source.byteLength / 32) + 1);
    if (source.byteLength !== before.size || before.dev !== after.dev || before.ino !== after.ino || before.size !== after.size || before.mtimeMs !== after.mtimeMs || before.ctimeMs !== after.ctimeMs || digest(source) !== pin) throw new Fault("SOURCE_REFUSED");
    return source;
  } catch (error) {
    if (error instanceof Fault) throw error;
    throw new Fault("SOURCE_REFUSED");
  } finally { if (fd !== undefined) closeSync(fd); }
}
function canonical(raw: unknown, work: OuterWork): string {
  let nodes = 0; const ancestors = new Set<object>();
  function visit(value: unknown, depth: number): unknown {
    work.charge(); if (++nodes > 12000 || depth > 32) throw new Fault("RESOURCE_REFUSED");
    if (value === null || typeof value === "boolean" || typeof value === "string") return value;
    if (typeof value === "number" && Number.isSafeInteger(value) && !Object.is(value, -0)) return value;
    if (!value || typeof value !== "object" || ancestors.has(value)) throw new Fault("MISMATCH");
    const array = Array.isArray(value);
    if (Object.getPrototypeOf(value) !== (array ? Array.prototype : Object.prototype) || Object.getOwnPropertySymbols(value).length) throw new Fault("MISMATCH");
    const descriptors = Object.getOwnPropertyDescriptors(value), keys = Reflect.ownKeys(value);
    if (keys.length > 12000) throw new Fault("RESOURCE_REFUSED");
    for (const key of keys) {
      work.charge(); const descriptor = descriptors[key as string];
      if (!descriptor || !("value" in descriptor) || (!descriptor.enumerable && key !== "length")) throw new Fault("MISMATCH");
    }
    ancestors.add(value); let detached: unknown;
    if (array) {
      const length = descriptors.length?.value;
      if (!Number.isSafeInteger(length) || length < 0 || length > 12000 || keys.length !== length + 1) throw new Fault("MISMATCH");
      const output = [];
      for (let i = 0; i < length; i++) { if (!descriptors[String(i)]) throw new Fault("MISMATCH"); output.push(visit(descriptors[String(i)].value, depth + 1)); }
      detached = output;
    } else {
      const output: Record<string, unknown> = {};
      for (const key of (keys as string[]).sort()) Object.defineProperty(output, key, { value: visit(descriptors[key].value, depth + 1), enumerable: true });
      detached = output;
    }
    ancestors.delete(value); return detached;
  }
  const text = JSON.stringify(visit(raw, 0));
  work.charge(Math.ceil(Buffer.byteLength(text) / 32) + 1);
  if (Buffer.byteLength(text) > MAX_BYTES) throw new Fault("RESOURCE_REFUSED");
  return text;
}
/** Fixed fresh process only. Passive local consistency diagnostic, never an M1
 * attestation, grant, production validator, or callable model adapter. */
export function auditLrcSharpShiftMargin(budget: ShiftMarginBudget): ShiftMarginAuditResult {
  const started = performance.now(); let work: OuterWork | undefined;
  let coreMetrics: Metrics | null = null, pythonMetrics: Metrics | null = null, processMs: number | null = null;
  let sourcePins: ShiftMarginAuditResult["sourcePins"] = null;
  const result = (status: Status, evidence: ShiftMarginEvidence | null): ShiftMarginAuditResult => {
    const report: ShiftMarginAuditResult = {
      status, evidence, sourcePins,
      metrics: { elapsedMs: performance.now() - started, chargedOperations: work?.operations ?? 0, core: coreMetrics, python: pythonMetrics, processElapsedMs: processMs },
      assurance: "LOCAL_SOURCE_BYTES_AND_PROCESS_CONSISTENCY_NOT_SIGNED_ATTESTATION", agentLoop: "NOT_RUN", executionAuthority: false,
    };
    if (status === "MATCH") {
      try {
        const bytes = Buffer.byteLength(JSON.stringify(report));
        if (bytes > MAX_BYTES) throw new Fault("RESOURCE_REFUSED");
        work!.charge(Math.ceil(bytes / 32) + 1);
        report.metrics.elapsedMs = performance.now() - started;
        report.metrics.chargedOperations = work!.operations;
        if (Buffer.byteLength(JSON.stringify(report)) > MAX_BYTES) throw new Fault("RESOURCE_REFUSED");
      } catch { return result("RESOURCE_REFUSED", null); }
    }
    return report;
  };
  try {
    work = new OuterWork(budget, started);
    if (flags.some(flag => process.env[flag] !== "false")) throw new Fault("FLAGS_REFUSED");
    const pythonSource = pinnedSource(pythonPath, LRC_SHIFT_MARGIN_PYTHON_SHA256, work);
    pinnedSource(corePath, LRC_SHIFT_MARGIN_CORE_SHA256, work);
    sourcePins = { python: LRC_SHIFT_MARGIN_PYTHON_SHA256, core: LRC_SHIFT_MARGIN_CORE_SHA256 };
    const core = buildLrcSharpShiftMarginReport(work.remaining());
    coreMetrics = { elapsedMs: core.elapsedMs, chargedOperations: core.chargedOperations };
    work.charge(core.chargedOperations);
    if (core.status !== "ACCEPTED" || !core.evidence) throw new Fault(core.status === "RESOURCE_REFUSED" ? "RESOURCE_REFUSED" : "MISMATCH");
    const coreText = canonical(core.evidence, work);
    const remaining = work.remaining();
    const request = JSON.stringify({ version: REPLAY_VERSION, ...remaining });
    work.charge(Math.ceil(Buffer.byteLength(request) / 32));
    // Recalculate after constructing input; the child receives the remaining
    // shared steps/time rather than a fresh 5s/2M allowance.
    const childBudget = work.remaining();
    const input = JSON.stringify({ version: REPLAY_VERSION, ...childBudget });
    const processStarted = performance.now();
    const child = spawnSync(LRC_SHIFT_MARGIN_PYTHON, ["-I", "-S", "-B", "-c", pythonSource.toString("utf8")], {
      input, encoding: "utf8", env: { NODE_ENV: "test" }, shell: false,
      timeout: childBudget.remainingMs, maxBuffer: MAX_BYTES, killSignal: "SIGKILL",
    });
    processMs = performance.now() - processStarted;
    work.charge();
    if (child.error || child.status !== 0 || child.signal !== null || typeof child.stdout !== "string" || typeof child.stderr !== "string") throw new Fault("PROCESS_REFUSED");
    if (Buffer.byteLength(child.stdout) > MAX_BYTES || Buffer.byteLength(child.stderr) > 2048) throw new Fault("RESOURCE_REFUSED");
    if (child.stderr.length) throw new Fault("PROCESS_REFUSED");
    work.charge(Math.ceil(Buffer.byteLength(child.stdout) / 32) + 1);
    let output: unknown;
    try { output = JSON.parse(child.stdout); } catch { throw new Fault("MISMATCH"); }
    if (!output || typeof output !== "object" || Array.isArray(output) || Object.keys(output).sort().join(",") !== "chargedOperations,elapsedMs,evidence,status") throw new Fault("MISMATCH");
    const wire = output as Record<string, unknown>;
    if (typeof wire.elapsedMs !== "number" || !Number.isFinite(wire.elapsedMs) || wire.elapsedMs < 0 || wire.elapsedMs > childBudget.remainingMs || typeof wire.chargedOperations !== "number" || !Number.isSafeInteger(wire.chargedOperations) || wire.chargedOperations < 1 || wire.chargedOperations > childBudget.remainingOperations) throw new Fault("RESOURCE_REFUSED");
    pythonMetrics = { elapsedMs: wire.elapsedMs, chargedOperations: wire.chargedOperations };
    work.charge(wire.chargedOperations);
    if (wire.status !== "ACCEPTED") throw new Fault(wire.status === "RESOURCE_REFUSED" ? "RESOURCE_REFUSED" : "MISMATCH");
    if (canonical(wire.evidence, work) !== coreText) throw new Fault("MISMATCH");
    pinnedSource(pythonPath, LRC_SHIFT_MARGIN_PYTHON_SHA256, work);
    pinnedSource(corePath, LRC_SHIFT_MARGIN_CORE_SHA256, work);
    work.charge(); return result("MATCH", core.evidence);
  } catch (error) { return result(error instanceof Fault ? error.status : "PROCESS_REFUSED", null); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = process.argv.length === 2 ? auditLrcSharpShiftMargin({ remainingMs: MAX_MS, remainingOperations: MAX_OPS }) : {
    status: "PROCESS_REFUSED", evidence: null, executionAuthority: false, agentLoop: "NOT_RUN",
  };
  process.stdout.write(`${JSON.stringify(result)}\n`);
  process.exitCode = result.status === "MATCH" ? 0 : 1;
}
