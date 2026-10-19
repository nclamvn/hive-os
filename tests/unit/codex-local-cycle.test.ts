import { describe, expect, it } from "vitest";
import { z } from "zod";

import { mathPortfolioOutputJsonSchema, parseCodexCycleEvents } from "@/modules/research-sandbox/adapters/codex-local-cycle";

const schema = z.object({ branches: z.array(z.object({ lowerExclusive: z.number().int().min(840) }).strict()) }).strict();

function events(output: unknown, usage: unknown = {
  input_tokens: 100, cached_input_tokens: 20, output_tokens: 30, reasoning_output_tokens: 10,
}) {
  return [
    { type: "thread.started", thread_id: "local-cycle-test" },
    { type: "item.completed", item: { type: "agent_message", text: JSON.stringify(output) } },
    { type: "turn.completed", usage },
  ].map((event) => JSON.stringify(event)).join("\n");
}

describe("Codex local cycle result validation", () => {
  it("adaptive production JSON keeps every new field and nullable tool plan required without changing legacy output", () => {
    const adaptive = mathPortfolioOutputJsonSchema(true) as { required: string[]; properties: { branches: {
      items: { required: string[]; properties: { proposal: { required: string[] } } } } } };
    expect(adaptive.required).toEqual(["version", "branches"]);
    expect(adaptive.properties.branches.items.required).toEqual(expect.arrayContaining(["methodId", "methodFamily",
      "rootContribution", "applicabilityAssumptions", "discriminatingExperiment", "requiredTools", "evaluationScope"]));
    expect(adaptive.properties.branches.items.properties.proposal.required).toEqual(expect.arrayContaining([
      "exactSurveyPlan", "structuralProbePlan", "mixedCoreClaim"]));
    expect(mathPortfolioOutputJsonSchema(false)).toMatchObject({ required: ["branches"] });
  });
  it("retains a valid result with measured usage", () => {
    expect(parseCodexCycleEvents(events({ branches: [{ lowerExclusive: 840 }] }), schema))
      .toMatchObject({ threadId: "local-cycle-test", usage: { inputTokens: 100, outputTokens: 30 } });
  });

  it("identifies schema paths without exposing model content", () => {
    const response = events({ branches: [{ lowerExclusive: 0, privateNote: "PRIVATE_MODEL_TEXT" }] });
    expect(() => parseCodexCycleEvents(response, schema)).toThrow(/branches\.0\.lowerExclusive:too_small/);
    try { parseCodexCycleEvents(response, schema); }
    catch (error) { expect(String(error)).not.toContain("PRIVATE_MODEL_TEXT"); }
  });

  it("keeps accounting errors distinct from a model schema mismatch", () => {
    expect(() => parseCodexCycleEvents(events({ branches: [{ lowerExclusive: 840 }] }, {
      input_tokens: 10, cached_input_tokens: 11, output_tokens: 1, reasoning_output_tokens: 0,
    }), schema)).toThrow(/identity or usage failed validation/);
  });
});
