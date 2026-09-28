import { describe, expect, it } from "vitest";

import { parseCodexEvents } from "@/modules/research-sandbox/adapters/codex-local-math";

const output = {
  attemptType: "PROOF_ATTEMPT",
  argument: "Let n = 2k. Then n² = 4k² = 2(2k²), so n² is even.",
  candidateCounterexample: null,
  selfChecks: ["The expression 2k² is an integer."],
  limitations: ["This is not an independent human verification."],
};

function events(final = output, usage: unknown = {
  input_tokens: 100, cached_input_tokens: 20, output_tokens: 40, reasoning_output_tokens: 10,
}) {
  return [
    { type: "thread.started", thread_id: "local-test-thread" },
    { type: "item.completed", item: { type: "agent_message", text: JSON.stringify(final) } },
    { type: "turn.completed", usage },
  ].map((event) => JSON.stringify(event)).join("\n");
}

describe("Codex local math JSONL contract", () => {
  it("retains a completed structured mathematical attempt and token counts", () => {
    expect(parseCodexEvents(events())).toMatchObject({
      threadId: "local-test-thread",
      output: { attemptType: "PROOF_ATTEMPT" },
      usage: { input_tokens: 100, output_tokens: 40 },
    });
  });

  it("rejects malformed or incomplete results and inconsistent usage", () => {
    expect(() => parseCodexEvents("not-json")).toThrow();
    expect(() => parseCodexEvents(events(output, { input_tokens: 1, cached_input_tokens: 2, output_tokens: 1, reasoning_output_tokens: 0 }))).toThrow();
    expect(() => parseCodexEvents(events({ ...output, argument: "" }))).toThrow();
    expect(() => parseCodexEvents(JSON.stringify({ type: "turn.failed" }))).toThrow();
  });
});
