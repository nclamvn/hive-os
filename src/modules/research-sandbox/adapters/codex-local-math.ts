import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { z } from "zod";

import {
  mathModelAttemptSchema,
  type ResearchProvider,
  type ResearchProviderResult,
  type ResearchRequest,
} from "../contracts";
import { ResearchSandboxError } from "../errors";

const CODEX_MODEL = "gpt-6-sol";
const OUTPUT_LIMIT = 1_048_576;
const DEADLINE_MS = 240_000;

const modelOutputSchema = mathModelAttemptSchema.omit({
  providerName: true, modelName: true, threadId: true, usage: true,
});

const outputJsonSchema = {
  type: "object",
  properties: {
    attemptType: { type: "string", enum: ["PROOF_ATTEMPT", "COUNTEREXAMPLE_ATTEMPT", "PARTIAL", "INCONCLUSIVE"] },
    argument: { type: "string" },
    candidateCounterexample: { type: ["string", "null"] },
    selfChecks: { type: "array", items: { type: "string" } },
    limitations: { type: "array", items: { type: "string" } },
    erdosStrausWitnesses: { type: "array", maxItems: 4, items: { type: "object", properties: {
      n: { type: "string" }, x: { type: "string" }, y: { type: "string" }, z: { type: "string" },
    }, required: ["n", "x", "y", "z"], additionalProperties: false } },
  },
  required: ["attemptType", "argument", "candidateCounterexample", "selfChecks", "limitations", "erdosStrausWitnesses"],
  additionalProperties: false,
} as const;

interface CodexEvent {
  type?: string;
  thread_id?: string;
  item?: { type?: string; text?: string };
  usage?: {
    input_tokens?: number;
    cached_input_tokens?: number;
    output_tokens?: number;
    reasoning_output_tokens?: number;
  };
}

function childEnv(): NodeJS.ProcessEnv {
  // The worker DB URL and all application secrets must not enter the Codex
  // process. Authentication is reused from the user's local Codex sign-in.
  return { NODE_ENV: process.env.NODE_ENV, ...Object.fromEntries(
    ["PATH", "HOME", "CODEX_HOME", "TMPDIR", "LANG", "LC_ALL", "SSL_CERT_FILE"]
      .filter((key) => process.env[key] !== undefined)
      .map((key) => [key, process.env[key]]),
  ) };
}

export async function runCodex(
  cliPath: string,
  args: string[],
  cwd: string,
  stdin: string,
  captureStatusStderr = false,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(cliPath, args, {
      cwd,
      env: childEnv(),
      stdio: ["pipe", "pipe", "pipe"],
      shell: false,
    });
    let stdout = "";
    let statusStderr = "";
    let stderrBytes = 0;
    let exceeded = false;
    const timer = setTimeout(() => child.kill("SIGKILL"), DEADLINE_MS);
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
      if (Buffer.byteLength(stdout, "utf8") > OUTPUT_LIMIT) {
        exceeded = true;
        child.kill("SIGKILL");
      }
    });
    child.stderr.on("data", (chunk: Buffer) => {
      // Diagnostics may contain prompts, paths or auth context. Never log them.
      stderrBytes += chunk.byteLength;
      if (captureStatusStderr && stderrBytes <= OUTPUT_LIMIT) statusStderr += chunk.toString("utf8");
      if (stderrBytes > OUTPUT_LIMIT) {
        exceeded = true;
        child.kill("SIGKILL");
      }
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0 || exceeded) {
        reject(new ResearchSandboxError("INVALID_INPUT", "Local Codex process did not complete a bounded result"));
      } else resolve(captureStatusStderr ? `${stdout}\n${statusStderr}` : stdout);
    });
    child.stdin.end(stdin);
  });
}

export function parseCodexEvents(stdout: string) {
  let threadId: string | undefined;
  let finalText: string | undefined;
  let usage: CodexEvent["usage"];
  for (const line of stdout.split(/\r?\n/)) {
    if (!line.trim()) continue;
    let event: CodexEvent;
    try {
      event = JSON.parse(line) as CodexEvent;
    } catch {
      throw new ResearchSandboxError("INVALID_INPUT", "Local Codex output was not valid JSONL");
    }
    if (event.type === "thread.started") threadId = event.thread_id;
    if (event.type === "item.completed" && event.item?.type === "agent_message") finalText = event.item.text;
    if (event.type === "turn.completed") usage = event.usage;
    if (event.type === "turn.failed") throw new ResearchSandboxError("INVALID_INPUT", "Local Codex turn failed");
  }
  if (!threadId || !finalText || !usage) {
    throw new ResearchSandboxError("PROVIDER_ACCOUNTING_UNVERIFIED", "Local Codex output lacked a completed response or usage");
  }
  let finalObject: unknown;
  try {
    finalObject = JSON.parse(finalText);
  } catch {
    throw new ResearchSandboxError("INVALID_INPUT", "Local Codex final response was not valid JSON");
  }
  const parsed = modelOutputSchema.safeParse(finalObject);
  const counts = z.object({
    input_tokens: z.number().int().nonnegative(),
    cached_input_tokens: z.number().int().nonnegative(),
    output_tokens: z.number().int().nonnegative(),
    reasoning_output_tokens: z.number().int().nonnegative(),
  }).safeParse(usage);
  if (!parsed.success || !counts.success || counts.data.cached_input_tokens > counts.data.input_tokens || counts.data.reasoning_output_tokens > counts.data.output_tokens) {
    throw new ResearchSandboxError("PROVIDER_ACCOUNTING_UNVERIFIED", "Local Codex result or usage failed validation");
  }
  return { threadId, output: parsed.data, usage: counts.data };
}

/** Operator-started, local-only bridge. Never launched by a web request. */
export class CodexLocalMathProvider implements ResearchProvider {
  readonly providerName = "codex-local";
  readonly modelName = CODEX_MODEL;

  constructor(private readonly cliPath = "codex") {}

  async execute(input: Omit<ResearchRequest, "idempotencyKey">): Promise<ResearchProviderResult> {
    if (input.providerName !== this.providerName || input.modelName !== this.modelName) {
      throw new ResearchSandboxError("PROVIDER_MISMATCH", "Local Codex identity differs from the sealed math request");
    }
    const directory = await mkdtemp(join(tmpdir(), "hiveos-codex-math-"));
    try {
      const status = await runCodex(this.cliPath, ["login", "status"], directory, "", true);
      if (!/Logged in using ChatGPT/i.test(status)) {
        throw new ResearchSandboxError("INVALID_TRANSITION", "Local Codex must use ChatGPT subscription sign-in, not an API key");
      }
      const schemaPath = join(directory, "result.schema.json");
      await writeFile(schemaPath, JSON.stringify(outputJsonSchema), { mode: 0o600 });
      const prompt = [
        "You are testing a local mathematics-research workflow, not certifying a theorem.",
        "Do not use tools, shell commands, web search, local files or external sources.",
        "Work only from the following exact statement and definitions. Do not silently alter the quantifiers or domain.",
        "Return a proof attempt, a concrete counterexample attempt, partial progress, or an explicit inconclusive result.",
        "Check every algebraic step or candidate against the stated definitions. List remaining limitations.",
        "If scope contains a bounded exact-computation record, use only its declared finite domain. A failure within a bounded A-family refutes that auxiliary bound, not the general Erdős–Straus conjecture; a zero-failure finite scan never proves an infinite statement.",
        "For an Erdős–Straus task, place up to four concrete (n,x,y,z) positive-integer decompositions in erdosStrausWitnesses as decimal strings. Use [] if none; never invent a tuple. These are checked independently by exact integer arithmetic after your response.",
        "Do not claim independent verification or formal proof. Return only the required JSON object.",
        JSON.stringify({ statement: input.question, scope: input.scope }),
      ].join("\n\n");
      const output = await runCodex(this.cliPath, [
        "exec", "--json", "--ephemeral", "--ignore-user-config", "--skip-git-repo-check",
        "--sandbox", "read-only", "--model", this.modelName,
        "--output-schema", schemaPath, "-C", directory, "-",
      ], directory, prompt);
      const parsed = parseCodexEvents(output);
      const mathAttempt = mathModelAttemptSchema.parse({
        providerName: this.providerName,
        modelName: this.modelName,
        threadId: parsed.threadId,
        ...parsed.output,
        usage: {
          inputTokens: parsed.usage.input_tokens,
          cachedInputTokens: parsed.usage.cached_input_tokens,
          outputTokens: parsed.usage.output_tokens,
          reasoningOutputTokens: parsed.usage.reasoning_output_tokens,
        },
      });
      return {
        providerName: this.providerName,
        modelName: this.modelName,
        mathAttempt,
        sources: [],
        findings: [{
          key: "no-external-source",
          kind: "HONEST_NULL",
          claim: "A mathematical model attempt is retained separately; no independently captured external source span supports it.",
          sourceKey: null,
          exactExcerpt: "",
          startOffset: null,
          endOffset: null,
          confidence: 0,
        }],
      };
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  }
}
