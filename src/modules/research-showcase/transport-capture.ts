import { poly19CodexProfile } from "./profile";

export interface ReportedCliUsage {
  inputTokens: number | null;
  outputTokens: number | null;
  cachedInputTokens: number | null;
  reasoningOutputTokens: number | null;
}
export interface OfflineTraceCapture {
  outcome: "CAPTURED_ENGINEERING_OBSERVATION" | "TRACE_LIMIT" | "ORIGINAL_LIMIT" | "UNEXPECTED_TOOL_OBSERVED" | "INVALID_TRACE" | "INCOMPLETE" | "TIMED_OUT" | "NONZERO_EXIT";
  rawOriginal: string;
  rawTrace: Uint8Array;
  observedTraceBytes: number;
  traceComplete: boolean;
  threadId: string | null;
  usage: ReportedCliUsage | null;
  actualModelVersion: null;
  toolDenialEstablished: false;
  remoteEffect: "UNKNOWN";
}
const usageNumber = (n: unknown): number | null => typeof n === "number" && Number.isSafeInteger(n) && n >= 0 ? n : null;

/** Pure offline parser, not a provider or containment mechanism. Retain exact
 * bounded raw bytes before interpreting ANY event. An observed tool may already
 * have had effects; absence of tool events cannot prove pre-effect denial.
 */
export function captureOfflineCodexTrace(chunks: readonly Uint8Array[], termination: { exitCode: number | null; timedOut?: boolean }): OfflineTraceCapture {
  let retained = 0, observed = 0;
  const bounded: Buffer[] = [];
  for (const chunk of chunks) {
    observed += chunk.byteLength;
    if (!Number.isSafeInteger(observed)) throw new RangeError("Trace size accounting overflow");
    const count = Math.min(chunk.byteLength, poly19CodexProfile.traceBytes - retained);
    if (count > 0) { bounded.push(Buffer.from(chunk.subarray(0, count))); retained += count; }
  }
  const rawTrace = Buffer.concat(bounded, retained);
  const result: OfflineTraceCapture = { outcome: "INCOMPLETE", rawOriginal: "", rawTrace,
    observedTraceBytes: observed, traceComplete: observed <= poly19CodexProfile.traceBytes,
    threadId: null, usage: null, actualModelVersion: null, toolDenialEstablished: false, remoteEffect: "UNKNOWN" };
  if (!result.traceComplete) return { ...result, outcome: "TRACE_LIMIT" };
  let complete = false, message = false, threads = 0, turns = 0;
  let phase: "EXPECT_THREAD" | "EXPECT_TURN" | "TURN" | "COMPLETE" = "EXPECT_THREAD";
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(rawTrace);
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const event = JSON.parse(line);
      if (!event || typeof event !== "object" || Array.isArray(event)) return { ...result, outcome: "INVALID_TRACE" };
      if (phase === "COMPLETE") return { ...result, outcome: "INVALID_TRACE" };
      if (event.type === "thread.started") {
        threads++;
        if (phase !== "EXPECT_THREAD" || threads !== 1 || typeof event.thread_id !== "string" || !event.thread_id || event.thread_id.length > 200) return { ...result, outcome: "INVALID_TRACE" };
        result.threadId = event.thread_id;
        phase = "EXPECT_TURN";
      } else if (event.type === "turn.started") {
        if (phase !== "EXPECT_TURN") return { ...result, outcome: "INVALID_TRACE" };
        phase = "TURN";
      } else if (event.type === "turn.completed") {
        turns++;
        if (phase !== "TURN" || turns !== 1 || !message) return { ...result, outcome: "INVALID_TRACE" };
        complete = true;
        phase = "COMPLETE";
        const u = event.usage;
        if (u && typeof u === "object") {
          const inputTokens = usageNumber(u.input_tokens), outputTokens = usageNumber(u.output_tokens);
          if (inputTokens !== null && outputTokens !== null) result.usage = { inputTokens, outputTokens,
            cachedInputTokens: usageNumber(u.cached_input_tokens), reasoningOutputTokens: usageNumber(u.reasoning_output_tokens) };
        }
      } else if (event.type === "turn.failed" || event.type === "error") {
        return { ...result, outcome: "INCOMPLETE" };
      } else if (event.type === "item.started" || event.type === "item.completed") {
        if (phase !== "TURN") return { ...result, outcome: "INVALID_TRACE" };
        const item = event.item;
        if (!item || typeof item !== "object") return { ...result, outcome: "INVALID_TRACE" };
        if (!["reasoning", "agent_message"].includes(item.type)) return { ...result, outcome: "UNEXPECTED_TOOL_OBSERVED" };
        if (item.type === "agent_message" && event.type === "item.completed") {
          if (message) return { ...result, outcome: "INVALID_TRACE" };
          if (typeof item.text !== "string") return { ...result, outcome: "INVALID_TRACE" };
          if (Buffer.byteLength(item.text, "utf8") > poly19CodexProfile.originalBytes) return { ...result, outcome: "ORIGINAL_LIMIT" };
          result.rawOriginal = item.text;
          message = true;
        }
      } else return { ...result, outcome: "INVALID_TRACE" };
    }
  } catch { return { ...result, outcome: "INVALID_TRACE" }; }
  if (termination.timedOut) return { ...result, outcome: "TIMED_OUT" };
  if (termination.exitCode !== 0) return { ...result, outcome: "NONZERO_EXIT" };
  if (!complete || !message || !result.threadId) return result;
  return { ...result, outcome: "CAPTURED_ENGINEERING_OBSERVATION" };
}
