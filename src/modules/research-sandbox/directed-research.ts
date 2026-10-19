import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { z } from "zod";
import { executeLeanResearch, unknownLeanUsage, type LeanCall, type LeanProblem, type LeanProvider, type LeanResult } from "./lean-execution";
import { createDomainProblemContract, listDomainAdapters } from "./research-core-v3";
import { frozen } from "./research-core-v3/bounded-json";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { researchSteeringRequestSchema, type ResearchSteeringRequest } from "./research-steering";

export interface DirectedHistory {
  mode: "HUMAN" | "AUTO"; guidance: string; prompt: string; result: LeanResult;
  disposition: "CANDIDATE_REJECTED" | "EXACT_PREDICATE_REFUTED" | "EXACT_SCOPE_CHECKED" | "UNVERIFIED" | "DECLARED_REFUTED" | "NO_PROGRESS" | "INVALID_OUTPUT";
  evidenceFingerprint: string | null;
}
export interface DirectedResearchState {
  goal: string; constraints: string; history: DirectedHistory[];
  budget: { maxCalls: number; maxMilliseconds: number; maxBytes: number };
  used: { calls: number; milliseconds: number; bytes: number };
  status: "FORK" | "STOPPED"; stopReason: string | null;
  nextDecision: "CONTINUE" | "WAIT_FOR_HUMAN" | "STOP";
  exactBinding: string | null;
  wholeProblemSolved: false; semanticAlignmentVerified: false;
}

/** The trusted host owns state/exact tools. This function grants no transport. */
export function startDirectedResearch(input: { goal: string; constraints: string; maxCalls?: number; maxMilliseconds?: number; maxBytes?: number }): DirectedResearchState {
  const parsed = z.object({ goal: z.string().trim().min(12).max(12000), constraints: z.string().trim().min(1).max(4000),
    maxCalls: z.number().int().min(1).max(6).default(3), maxMilliseconds: z.number().int().min(1).max(600000).default(10000),
    maxBytes: z.number().int().min(1).max(262144).default(65536) }).strict().parse(input);
  return frozen({ goal: parsed.goal, constraints: parsed.constraints, history: [],
    budget: { maxCalls: parsed.maxCalls, maxMilliseconds: parsed.maxMilliseconds, maxBytes: parsed.maxBytes },
    used: { calls: 0, milliseconds: 0, bytes: 0 }, status: "FORK", stopReason: null, nextDecision: "WAIT_FOR_HUMAN", exactBinding: null,
    wholeProblemSolved: false, semanticAlignmentVerified: false });
}

/** One solver request by default. All receipt authority comes from the same
 * existing lean host verifier, not direction labels or model agreement. */
export async function executeDirectedResearchStep(input: {
  state: DirectedResearchState; goal: string; constraints: string;
  direction: ResearchSteeringRequest; provider: LeanProvider; exact?: LeanProblem["exact"];
  control?: "CONTINUE";
  retain: (call: Readonly<LeanCall>) => void | Promise<void>;
}): Promise<DirectedResearchState> {
  const { state } = input;
  if (input.goal !== state.goal || input.constraints !== state.constraints) throw new Error("UNCHANGED_GOAL_AND_CONSTRAINTS_REQUIRED");
  const direction = researchSteeringRequestSchema.parse(input.direction);
  if (state.status === "STOPPED") return state;
  if (state.history.length && state.nextDecision === "WAIT_FOR_HUMAN" && input.control !== "CONTINUE") return state;
  const exactBinding = input.exact ? createHash("sha256").update(JSON.stringify([
    input.exact.prepared.contractDigest, input.exact.prepared.inputDigest, input.exact.obligationId,
  ])).digest("hex") : "NONE";
  if (state.exactBinding !== null && state.exactBinding !== exactBinding) throw new Error("EXACT_SCOPE_CHANGE_REQUIRES_NEW_SESSION");
  const remaining = { calls: state.budget.maxCalls - state.used.calls,
    milliseconds: Math.floor(state.budget.maxMilliseconds - state.used.milliseconds), bytes: state.budget.maxBytes - state.used.bytes };
  if (remaining.calls < 1 || remaining.milliseconds < 1 || remaining.bytes < 1) {
    return frozen({ ...state, status: "STOPPED", nextDecision: "STOP", stopReason: "CUMULATIVE_BUDGET" });
  }
  function excerpt(text: string, maximumJsonCharacters: number) {
    let value = text.slice(0, maximumJsonCharacters);
    while (JSON.stringify(value).length > maximumJsonCharacters && value.length) value = value.slice(0, Math.floor(value.length * 0.8));
    return { text: value, truncated: value !== text };
  }
  const context = JSON.stringify({ unchangedGoal: "See the exact question above; no replacement permitted", constraints: excerpt(state.constraints, 6000), mode: direction.mode, guidance: excerpt(direction.guidance, 6000),
    remainingBudget: remaining, omittedFullAttempts: Math.max(0, state.history.length - 3),
    olderAttemptSummary: state.history.slice(0, -3).map((entry) => ({ approachId: entry.result.selected?.draft.direction?.approachId ?? null, disposition: entry.disposition })),
    previousAttempts: state.history.slice(-3).map((entry) => ({
      direction: entry.result.selected?.draft.direction ? {
        approachId: entry.result.selected.draft.direction.approachId,
        hypothesis: excerpt(entry.result.selected.draft.direction.hypothesis, 600),
        method: excerpt(entry.result.selected.draft.direction.method, 600),
        premise: entry.result.selected.draft.direction.premise,
        premiseReason: excerpt(entry.result.selected.draft.direction.premiseReason, 600),
        alternative: entry.result.selected.draft.direction.alternative ? excerpt(entry.result.selected.draft.direction.alternative, 600) : null,
      } : null, argument: entry.result.selected?.draft.argument ? excerpt(entry.result.selected.draft.argument, 1500) : null,
      candidateDigest: entry.result.selected?.draft.certificate ? createHash("sha256").update(entry.result.selected.draft.certificate).digest("hex") : null,
      disposition: entry.disposition,
      receipt: entry.result.selected?.receipt ? {
        result: entry.result.selected.receipt.result, scientificDisposition: entry.result.selected.receipt.scientificDisposition,
        reason: excerpt(entry.result.selected.receipt.reason, 500),
        inputDigest: entry.result.selected.receipt.inputDigest,
        receiptDigest: entry.result.selected.receipt.receiptDigest,
      } : null, failures: entry.result.failures.slice(0, 4).map((failure) => excerpt(failure, 300)),
    })) });
  let prompt = "";
  const before = performance.now();
  let invocations = 0, executionFailure = false;
  const observedCalls: LeanCall[] = [];
  let result: LeanResult;
  try {
    result = await executeLeanResearch({
      problem: { statement: state.goal, directionContext: context, ...(input.exact ? { exact: input.exact } : {}) },
      provider: { invoke: (request) => { invocations++; prompt = request.prompt; return input.provider.invoke(request); } },
      limits: { overallMilliseconds: remaining.milliseconds, perCallMilliseconds: remaining.milliseconds, maxOutputBytes: remaining.bytes, optionalCalls: 0 },
      retain: (call) => { observedCalls.push(call); return input.retain(call); },
    });
  } catch {
    executionFailure = true;
    result = { status: "PRIMARY_FAILED", primary: null, selected: null, revisions: [], calls: observedCalls,
      failures: ["RETENTION_OR_EXECUTION_FAILURE"], remainingGaps: [], checks: 0,
      wholeProblemSolved: false, noveltyEstablished: false, authorityGranted: false };
  }
  const used = { calls: state.used.calls + Math.max(invocations, result.calls.length), milliseconds: state.used.milliseconds + performance.now() - before,
    bytes: state.used.bytes + result.calls.reduce((sum, call) => sum + (call.originalBytes === null ? 0 : Buffer.byteLength(call.originalBytes, "utf8")), 0) };
  const draft = result.selected?.draft;
  const strategy = draft?.direction;
  let fingerprint: string | null = null;
  if (draft) {
    let candidate = draft.certificate;
    if (candidate !== null) { try { candidate = canonicalJson(JSON.parse(candidate)); } catch { /* malformed candidate remains exact original text */ } }
    fingerprint = createHash("sha256").update(JSON.stringify(candidate === null ?
      ["TEXT_ONLY", draft.argument.trim().replace(/\s+/g, " ")] :
      ["CANDIDATE", input.exact?.prepared.inputDigest ?? null, input.exact?.obligationId ?? null, candidate])).digest("hex");
  }
  const repeated = strategy && state.history.some((entry) => {
    const previous = entry.result.selected?.draft.direction;
    return (previous?.approachId === strategy.approachId && entry.disposition === "DECLARED_REFUTED") ||
      (fingerprint !== null && fingerprint === entry.evidenceFingerprint);
  });
  const disposition: DirectedHistory["disposition"] = !strategy ? "INVALID_OUTPUT" : repeated ? "NO_PROGRESS" :
    result.status === "EXACT_PREDICATE_REFUTED" ? "EXACT_PREDICATE_REFUTED" :
    result.status === "EXACT_SCOPE_VERIFIED" ? "EXACT_SCOPE_CHECKED" :
    result.selected?.receipt?.result === "REJECTED" ? "CANDIDATE_REJECTED" :
    strategy.premise === "REFUTED" ? "DECLARED_REFUTED" : "UNVERIFIED";
  const budgetEnded = used.calls >= state.budget.maxCalls || used.milliseconds >= state.budget.maxMilliseconds || used.bytes >= state.budget.maxBytes;
  const stopReason = executionFailure ? "RETENTION_OR_EXECUTION_FAILURE" :
    result.failures.some((failure) => /TIMEOUT|OVERALL_LIMIT|OUTPUT_LIMIT|HOST_BOUNDARY/.test(failure)) ? "EXECUTION_BOUNDARY" :
    repeated ? "NO_PROGRESS_OR_DECLARED_REFUTED_REUSE" : !strategy ? "INVALID_STRATEGY_OUTPUT" :
    disposition === "EXACT_PREDICATE_REFUTED" ? "EXACT_PREDICATE_REFUTED_REQUIRES_ROUTING" :
    disposition === "EXACT_SCOPE_CHECKED" ? "EXACT_SCOPE_ONLY_REQUIRES_ROUTING" : budgetEnded ? "CUMULATIVE_BUDGET" : null;
  return frozen({ ...state, exactBinding, used, history: [...state.history, { mode: direction.mode, guidance: direction.guidance, prompt, result, disposition, evidenceFingerprint: fingerprint }],
    status: stopReason ? "STOPPED" : "FORK", stopReason,
    nextDecision: stopReason ? "STOP" : direction.mode === "HUMAN" || strategy?.needsHuman ? "WAIT_FOR_HUMAN" : "CONTINUE",
    wholeProblemSolved: false, semanticAlignmentVerified: false });
}

export const DIRECTED_SIMULATION_GOAL = "Find positive integers x and y satisfying 2x + 3y = 7; test each candidate exactly.";
export const DIRECTED_SIMULATION_CONSTRAINTS = "Fixed synthetic engineering case. Positive integers only. No web, paid API, real model, research campaign, proof or novelty claim. At most three scripted solver calls and no critic.";
export const directedSimulationInputSchema = z.object({ steps: z.array(z.object({
  mode: z.enum(["HUMAN", "AUTO"]), guidance: z.string().trim().max(4000),
  output: z.enum(["SCENARIO", "BAD_CANDIDATE", "VALID_CANDIDATE", "UNSUPPORTED", "REPEAT", "DECLARED_REFUTATION"]),
}).strict()).min(1).max(4) }).strict();

/** Scripted, assistant-authored API replacement. Replays the submitted bounded
 * transcript from a fresh trusted state, never trusts client receipts/history. */
export async function replayDirectedResearchSimulation(raw: unknown) {
  const input = directedSimulationInputSchema.parse(raw);
  for (const step of input.steps) researchSteeringRequestSchema.parse({ mode: step.mode, guidance: step.guidance });
  const prepared = createDomainProblemContract({ id: "directed-synthetic-equation", rootId: "DIRECTED_LOCAL_ENGINEERING_REPLAY",
    target: DIRECTED_SIMULATION_GOAL, mode: "ENGINEERING", adapterId: "INTEGER_WITNESS",
    input: { kind: "LINEAR_WITNESS", coefficients: ["2", "3"], rhs: "7" }, obligationId: "exact" });
  const pin = createHash("sha256").update("SCRIPTED_LOCAL_ENGINEERING_NOT_REVIEWED_SOURCE_AUTHORITY").digest("hex");
  const exact: NonNullable<LeanProblem["exact"]> = { prepared, obligationId: "exact", host: {
    runtimeSourceDigest: pin, sourceBundleDigest: pin, authorityEpoch: "scripted-local-engineering-only",
    checkerSourceDigests: Object.fromEntries(listDomainAdapters().map((adapter) => [adapter.id, pin])), reserveCheck: () => {},
  } };
  let state = startDirectedResearch({ goal: DIRECTED_SIMULATION_GOAL, constraints: DIRECTED_SIMULATION_CONSTRAINTS });
  const retained: LeanCall[] = [];
  for (const step of input.steps) {
    const unsupported = step.output === "UNSUPPORTED";
    const provider: LeanProvider = {
      invoke: async (request) => {
        // A declared scripted branch, not language understanding: only actual
        // prior host rejection in the next prompt selects the alternative.
        const good = step.output === "VALID_CANDIDATE" || (step.output === "SCENARIO" && request.prompt.includes('"scientificDisposition":"INVALID_CANDIDATE"'));
        const last = state.history.at(-1)?.result.selected?.draft;
        return {
          originalBytes: step.output === "REPEAT" && last ? JSON.stringify(last) : JSON.stringify({
            argument: good ? "Scripted proposal: substitute x=2 and y=1. The host must check the exact equation, not trust this statement." :
              unsupported ? "Scripted proposal claims a universal theory from an unproved intuition. No tool evidence is supplied." :
              "Scripted proposal assumes the symmetric pair x=1 and y=1 works. This is a deliberately false candidate for testing feedback.",
            certificate: unsupported || step.output === "DECLARED_REFUTATION" ? null : JSON.stringify({ kind: "INTEGER_WITNESS", values: good ? ["2", "1"] : ["1", "1"] }),
            gaps: [], direction: {
              approachId: good ? "solve-one-variable" : unsupported ? "unsupported-generalization" : "symmetric-pair",
              hypothesis: good ? "A nonsymmetric positive pair may satisfy the same equation." : "The symmetric candidate (1,1) satisfies the equation.",
              method: good ? "Fix y=1 and solve the remaining linear equation; use the exact host checker." : "Try equal coordinates before assuming a general solution.",
              premise: step.output === "DECLARED_REFUTATION" ? "REFUTED" : "SUPPORTED",
              premiseReason: "Scripted model self-report only; factual status comes from the host check, if present.",
              alternative: good ? null : "Keep the same goal and try unequal coordinates, retaining the rejected candidate and its receipt.", needsHuman: unsupported,
            },
          }),
          usage: unknownLeanUsage,
        };
      },
    };
    do {
      state = await executeDirectedResearchStep({ state, goal: DIRECTED_SIMULATION_GOAL, constraints: DIRECTED_SIMULATION_CONSTRAINTS,
        direction: { mode: step.mode, guidance: step.guidance, parentRunId: null }, control: "CONTINUE",
        provider, exact, retain: (call) => { retained.push(call); } });
    } while (step.output === "SCENARIO" && state.nextDecision === "CONTINUE");
  }
  return frozen({ origin: "SCRIPTED_ASSISTANT_AUTHORED_API_REPLAY" as const, liveModelRequests: 0 as const, databaseWrites: 0 as const,
    sourceAuthority: "NOT_ESTABLISHED_LOCAL_ENGINEERING_ONLY" as const, wholeProblemSolved: false as const, state, retained });
}
export type DirectedSimulationObservation = Awaited<ReturnType<typeof replayDirectedResearchSimulation>>;
export type DirectedSimulationStep = z.infer<typeof directedSimulationInputSchema>["steps"][number];
