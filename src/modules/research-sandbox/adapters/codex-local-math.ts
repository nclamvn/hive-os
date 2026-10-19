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
import { splitExactBenchmarkArgument } from "../math-tex";
import { digestMathPilotContract, mathPilotScope, resolveMathPilotContract } from "../math-pilot";
import { lrcEvidencePrompt, validateRetainedLrcEvidence, type LrcCertificateEvidence } from "../math-lrc-replay";
import { getEnv } from "@/server/env";
import { lrcCampaignFactsPrompt, type LrcCampaignEvidence } from "../math-lrc-campaign";
import { assertLrcCampaignBinding, assertNoProviderCampaignEvidence, guardedLrcCampaignCall, requireLrcCampaignCapability } from "../math-lrc-campaign-integration";
import { assertNoProviderProofUnitHostFields, validateLrcProofUnitSolverOutput, validateLrcProofUnitReviewOutput,
  validatePreparedLrcProofUnitLiveInput, type PreparedLrcProofUnitLiveInput } from "../math-lrc-proof-unit-live";
import {MathDiagnosticError,type DiagnosticReason} from "../math-transport-diagnostics";
import type {CodexRawTransportObserver,MethodUnitTransportCapture} from "@/server/operations/math-method-unit-transport";
import {validatePreparedLrcMethodUnitInput, type PreparedLrcMethodUnitLiveInput} from "../math-lrc-method-unit-live";

const CODEX_MODEL = "gpt-6-sol";
const OUTPUT_LIMIT = 1_048_576;
const DEADLINE_MS = 240_000;

const modelOutputSchema = mathModelAttemptSchema.omit({
  providerName: true, modelName: true, threadId: true, usage: true, lrcEvidence: true, lrcCampaignEvidence: true,
  lrcProofUnitEvidence: true, lrcProofUnitFeedback: true,
  lrcMethodUnitEvidence:true,lrcMethodUnitFeedback:true,lrcMethodUnitFiniteSeed:true,
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
    erdosStrausPolynomialFamilies: { type: "array", maxItems: 2, items: { type: "object", properties: {
      method: { type: "string", enum: ["ERDOS_STRAUS_POLYNOMIAL_FAMILY_V1"] },
      parameter: { type: "string", enum: ["t>=0"] },
      n: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2 },
      x: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
      y: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
      z: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
    }, required: ["method", "parameter", "n", "x", "y", "z"], additionalProperties: false } },
    erdosStrausGateCounterexample: { anyOf: [
      { type: "object", properties: { prime: { type: "integer" }, failedThroughA: { type: "integer" } },
        required: ["prime", "failedThroughA"], additionalProperties: false },
      { type: "null" },
    ] },
  },
  required: ["attemptType", "argument", "candidateCounterexample", "selfChecks", "limitations", "erdosStrausWitnesses", "erdosStrausPolynomialFamilies", "erdosStrausGateCounterexample"],
  additionalProperties: false,
} as const;

const benchmarkOutputJsonSchema = {
  type: "object",
  properties: {
    attemptType: outputJsonSchema.properties.attemptType,
    argument: outputJsonSchema.properties.argument,
    candidateCounterexample: outputJsonSchema.properties.candidateCounterexample,
    selfChecks: outputJsonSchema.properties.selfChecks,
    limitations: outputJsonSchema.properties.limitations,
  },
  required: ["attemptType", "argument", "candidateCounterexample", "selfChecks", "limitations"],
  additionalProperties: false,
} as const;

const exactBenchmarkOutputJsonSchema = {
  type: "object",
  properties: {
    ...benchmarkOutputJsonSchema.properties,
    exactAnswer: { type: ["string", "null"] },
    computationPython: { type: ["string", "null"] },
  },
  required: [...benchmarkOutputJsonSchema.required, "exactAnswer", "computationPython"],
  additionalProperties: false,
} as const;

/** Preserve the model's original argument while recovering code it put there
 * despite the structured field. The origin is sealed alongside the code. */
export function normalizeExactBenchmarkOutput(output: z.infer<typeof modelOutputSchema>) {
  if (output.computationPython) {
    return { ...output, computationOrigin: "MODEL_FIELD" as const };
  }
  const embeddedCode = splitExactBenchmarkArgument(output.argument).embeddedCode;
  if (!embeddedCode || embeddedCode.length > 12_000) return output;
  return { ...output, computationPython: embeddedCode,
    computationOrigin: "EXTRACTED_FROM_ARGUMENT" as const };
}

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
  signal?: AbortSignal,
  observer?:CodexRawTransportObserver,
): Promise<string> {
  if(observer) {
    if(captureStatusStderr)throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
    if(signal?.aborted) {await observer.closed({complete:false,reason:"CANCELLED"});throw new MathDiagnosticError("CANCELLED");}
    await observer.beforeDispatch();
    if(signal?.aborted){await observer.closed({complete:false,reason:"CANCELLED"});throw new MathDiagnosticError("CANCELLED");}
    return new Promise((resolve,reject)=>{
      let child:ReturnType<typeof spawn>;
      try{child=spawn(cliPath,args,{cwd,env:childEnv(),stdio:["pipe","pipe","pipe"],shell:false});}
      catch {void observer.closed({complete:false,reason:"SPAWN_FAILED"}).then(()=>reject(new MathDiagnosticError("SPAWN_FAILED")),()=>reject(new MathDiagnosticError("CAPTURE_WRITE_FAILED")));return;}
      let reason:DiagnosticReason|null=null,stdoutBytes=0,stderrBytes=0,queue=Promise.resolve();
      const cancel=(code:DiagnosticReason)=>{reason??=code;child.kill("SIGKILL");};
      const onAbort=()=>cancel("CANCELLED");signal?.addEventListener("abort",onAbort,{once:true});if(signal?.aborted)onAbort();
      const timer=setTimeout(()=>cancel("CHILD_DEADLINE"),DEADLINE_MS);
      const cleanup=()=>{clearTimeout(timer);signal?.removeEventListener("abort",onAbort);};
      child.stdout!.on("data",(bytes:Buffer)=>{const prior=stdoutBytes;stdoutBytes+=bytes.length;
        if(prior<=OUTPUT_LIMIT){const retained=Buffer.from(bytes.subarray(0,Math.max(0,OUTPUT_LIMIT+1-prior)));queue=queue.then(()=>observer.stdout(retained)).catch(e=>{cancel(e instanceof MathDiagnosticError?e.code:"CAPTURE_WRITE_FAILED");});}
        if(stdoutBytes>OUTPUT_LIMIT)cancel("STDOUT_LIMIT");});
      child.stderr!.on("data",(bytes:Buffer)=>{stderrBytes+=bytes.length;if(stderrBytes>OUTPUT_LIMIT)cancel("STDERR_LIMIT");});
      child.stdin!.on("error",()=>cancel("STDIN_WRITE_FAILED"));
      child.on("error",()=>{reason??="SPAWN_FAILED";});
      child.on("close",code=>{cleanup();queue.then(async()=>{
        if(code!==0)reason??="NONZERO_EXIT";
        await observer.closed({complete:reason===null,reason,observedStdoutBytes:stdoutBytes});
        if(reason)throw new MathDiagnosticError(reason);
        // Captured exact bytes are parsed separately after durable retention.
        resolve("");
      }).catch(e=>reject(e instanceof MathDiagnosticError?e:new MathDiagnosticError("CAPTURE_WRITE_FAILED")));});
      child.stdin!.end(stdin);
    });
  }
  if (signal?.aborted) throw new ResearchSandboxError("INVALID_TRANSITION", "Local Codex operation cancelled before dispatch");
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
    let cancelled = false;
    const onAbort = () => { cancelled = true; child.kill("SIGKILL"); };
    signal?.addEventListener("abort", onAbort, { once: true });
    if (signal?.aborted) onAbort();
    const timer = setTimeout(() => child.kill("SIGKILL"), DEADLINE_MS);
    const cleanup = () => { clearTimeout(timer); signal?.removeEventListener("abort", onAbort); };
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
      cleanup();
      reject(error);
    });
    child.on("close", (code) => {
      cleanup();
      if (code !== 0 || exceeded || cancelled) {
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

/** New-lane model feedback plus actual CLI provenance. Never accepts model-authored host fields. */
export function parseCodexProofUnitEvents(stdout: string, role: "SOLVER" | "CRITIC" | "ADVERSARY") {
  let threadId: string | undefined, finalText: string | undefined;
  let usage: CodexEvent["usage"];
  let threads=0,turns=0;
  for (const line of stdout.split(/\r?\n/)) {
    if (!line.trim()) continue;
    let event: CodexEvent;
    try { event = JSON.parse(line) as CodexEvent; } catch { throw new ResearchSandboxError("INVALID_INPUT", "Proof-unit output is not JSONL"); }
    if(!event || typeof event!=="object" || !["thread.started","turn.started","item.started","item.updated","item.completed","turn.completed","turn.failed","error"].includes(event.type ?? "") ||
      event.item && !["agent_message","reasoning"].includes(event.item.type ?? ""))
      throw new ResearchSandboxError("INVALID_INPUT","Proof-unit observed tool activity or unsupported protocol item");
    if(event.type==="error") throw new ResearchSandboxError("INVALID_INPUT","Proof-unit protocol error");
    if (event.type === "thread.started") {threads++;threadId = event.thread_id;}
    if (event.type === "item.completed" && event.item?.type === "agent_message") finalText = event.item.text;
    if (event.type === "turn.completed") {turns++;usage = event.usage;}
    if (event.type === "turn.failed") throw new ResearchSandboxError("INVALID_INPUT", "Proof-unit turn failed");
  }
  const counts = z.object({ input_tokens: z.number().int().positive(), cached_input_tokens: z.number().int().nonnegative(),
    output_tokens: z.number().int().positive(), reasoning_output_tokens: z.number().int().nonnegative() }).safeParse(usage);
  if (threads!==1 || turns!==1 || !threadId?.trim() || !finalText || !counts.success || counts.data.cached_input_tokens > counts.data.input_tokens ||
    counts.data.reasoning_output_tokens > counts.data.output_tokens) throw new ResearchSandboxError("PROVIDER_ACCOUNTING_UNVERIFIED", "Proof-unit completed context/usage missing or invalid");
  let raw: unknown;
  try { raw = JSON.parse(finalText); } catch { throw new ResearchSandboxError("INVALID_INPUT", "Proof-unit mathematical output is not JSON"); }
  assertNoProviderProofUnitHostFields(raw);
  const output = role === "SOLVER" ? validateLrcProofUnitSolverOutput(raw) : validateLrcProofUnitReviewOutput(raw, role);
  return { threadId, output, usage: { inputTokens: counts.data.input_tokens, cachedInputTokens: counts.data.cached_input_tokens,
    outputTokens: counts.data.output_tokens, reasoningOutputTokens: counts.data.reasoning_output_tokens } };
}

/** Operator-started, local-only bridge. Never launched by a web request. */
export class CodexLocalMathProvider implements ResearchProvider {
  readonly providerName = "codex-local";
  readonly modelName = CODEX_MODEL;

  constructor(private readonly cliPath = "codex", private readonly signal?: AbortSignal,private readonly methodCapture?:MethodUnitTransportCapture) {}

  async execute(input: Omit<ResearchRequest, "idempotencyKey"> & { lrcEvidence?: LrcCertificateEvidence; lrcCampaignEvidence?: LrcCampaignEvidence; lrcProofUnitInput?: PreparedLrcProofUnitLiveInput;lrcMethodUnitInput?:PreparedLrcMethodUnitLiveInput }): Promise<ResearchProviderResult> {
    if(input.mathPilot?.caseType==="LRC_METHOD_UNIT"){
      const prepared=input.lrcMethodUnitInput,contract=resolveMathPilotContract(input.mathPilot);
      if(!this.methodCapture||!prepared||input.lrcEvidence!==undefined||input.lrcCampaignEvidence!==undefined||input.lrcProofUnitInput!==undefined||
        !validatePreparedLrcMethodUnitInput(prepared,{...prepared,role:"SOLVER",contractDigest:digestMathPilotContract(contract)})||
        this.methodCapture.binding.caseId!==prepared.caseId||this.methodCapture.binding.runId!==prepared.runId||this.methodCapture.binding.role!=="SOLVER"||
        input.question!==contract.statement||input.scope!==mathPilotScope(contract)||input.providerName!==this.providerName||input.modelName!==this.modelName)
        throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
      return this.executeMethodUnit(prepared);
    }
    if(input.lrcMethodUnitInput!==undefined)throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
    if (input.mathPilot?.caseType === "LRC_PROOF_UNIT") {
      requireLrcCampaignCapability(getEnv().LRC_CAMPAIGN_LOCAL_ENABLED);
      const contract = resolveMathPilotContract(input.mathPilot), prepared = input.lrcProofUnitInput;
      if (!prepared || input.lrcEvidence !== undefined || input.lrcCampaignEvidence !== undefined ||
        !validatePreparedLrcProofUnitLiveInput(prepared, { ...prepared, role: "SOLVER", contractDigest: digestMathPilotContract(contract) }) ||
        input.question !== contract.statement || input.scope !== mathPilotScope(contract) || input.queryPlan.queries[0] !== contract.statement ||
        input.providerName !== this.providerName || input.modelName !== this.modelName || prepared.requestedModelName !== this.modelName) {
        throw new ResearchSandboxError("INTEGRITY_FAILURE", "Proof-unit solver prepared binding differs");
      }
      return guardedLrcCampaignCall(prepared, view => this.executeProofUnit(view));
    }
    if (input.lrcProofUnitInput !== undefined) throw new ResearchSandboxError("INTEGRITY_FAILURE", "Proof-unit input cannot enter a legacy solver lane");
    if(input.mathPilot?.caseType === "LRC_CAMPAIGN") {
      requireLrcCampaignCapability(getEnv().LRC_CAMPAIGN_LOCAL_ENABLED);
      const contract=resolveMathPilotContract(input.mathPilot);
      assertLrcCampaignBinding(contract,input.lrcCampaignEvidence);
      if(input.question!==contract.statement || input.scope!==mathPilotScope(contract) || input.queryPlan.queries[0]!==contract.statement)
        throw new ResearchSandboxError("INTEGRITY_FAILURE","Campaign solver brief differs from fixed contract");
      return guardedLrcCampaignCall(input,view=>this.executeSealed(view));
    }
    if(input.lrcCampaignEvidence !== undefined) throw new ResearchSandboxError("INTEGRITY_FAILURE","Unexpected campaign evidence");
    return this.executeSealed(input);
  }

  private async executeMethodUnit(prepared:PreparedLrcMethodUnitLiveInput):Promise<ResearchProviderResult>{
    this.methodCapture!.requireInput(prepared);
    const directory=await mkdtemp(join(tmpdir(),"hiveos-codex-method-unit-"));
    try{const status=await runCodex(this.cliPath,["login","status"],directory,"",true,this.signal);
      if(!/Logged in using ChatGPT/i.test(status))throw new ResearchSandboxError("INVALID_TRANSITION","Method unit requires subscription sign-in");
      const path=join(directory,"result.schema.json");await writeFile(path,prepared.schemaText,{mode:0o600});
      await runCodex(this.cliPath,["exec","--json","--ephemeral","--ignore-user-config","--skip-git-repo-check","--sandbox","read-only","--model",this.modelName,"--output-schema",path,"-C",directory,"-"],directory,prepared.stdin,false,this.signal,this.methodCapture!.observer());
      const parsed=await this.methodCapture!.admit();
      const mathAttempt=mathModelAttemptSchema.parse({...parsed.output as object,providerName:this.providerName,modelName:this.modelName,threadId:parsed.threadId,usage:parsed.usage});
      return {providerName:this.providerName,modelName:this.modelName,mathAttempt,sources:[],findings:[{key:"no-external-source",kind:"HONEST_NULL",claim:"Conditional method feedback only; no independently captured external source span.",sourceKey:null,exactExcerpt:"",startOffset:null,endOffset:null,confidence:0}]};
    }catch(e){const code=e instanceof MathDiagnosticError?e.code:e instanceof ResearchSandboxError?"AUTHENTICATION_REQUIRED":"CAPTURE_WRITE_FAILED";await this.methodCapture!.rejectBeforeAdmission(code);throw new MathDiagnosticError(code);}
    finally{await rm(directory,{recursive:true,force:true});}
  }

  private async executeProofUnit(prepared: PreparedLrcProofUnitLiveInput): Promise<ResearchProviderResult> {
    const directory = await mkdtemp(join(tmpdir(), "hiveos-codex-proof-unit-"));
    try {
      const status = await runCodex(this.cliPath, ["login", "status"], directory, "", true, this.signal);
      if (!/Logged in using ChatGPT/i.test(status)) throw new ResearchSandboxError("INVALID_TRANSITION", "Proof-unit requires subscription sign-in");
      const path = join(directory, "result.schema.json");
      await writeFile(path, prepared.schemaText, { mode: 0o600 });
      const stdout = await runCodex(this.cliPath, ["exec", "--json", "--ephemeral", "--ignore-user-config", "--skip-git-repo-check",
        "--sandbox", "read-only", "--model", this.modelName, "--output-schema", path, "-C", directory, "-"], directory, prepared.stdin, false, this.signal);
      const parsed = parseCodexProofUnitEvents(stdout, "SOLVER");
      const mathAttempt = mathModelAttemptSchema.parse({ ...parsed.output, providerName: this.providerName, modelName: this.modelName,
        threadId: parsed.threadId, usage: parsed.usage });
      return { providerName: this.providerName, modelName: this.modelName, mathAttempt, sources: [], findings: [{ key: "no-external-source",
        kind: "HONEST_NULL", claim: "Conditional mathematical feedback is retained separately; no independently captured external source span.",
        sourceKey: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0 }] };
    } finally { await rm(directory, { recursive: true, force: true }); }
  }

  private async executeSealed(input: Omit<ResearchRequest, "idempotencyKey"> & { lrcEvidence?: LrcCertificateEvidence; lrcCampaignEvidence?: LrcCampaignEvidence }): Promise<ResearchProviderResult> {
    if (input.providerName !== this.providerName || input.modelName !== this.modelName) {
      throw new ResearchSandboxError("PROVIDER_MISMATCH", "Local Codex identity differs from the sealed math request");
    }
    const contract = input.mathPilot ? resolveMathPilotContract(input.mathPilot) : null;
    if (contract?.lrcFiniteScope && !["development", "test"].includes(process.env.NODE_ENV ?? "")) {
      throw new ResearchSandboxError("INVALID_TRANSITION", "Finite LRC solver is local development/test only");
    }
    if (contract?.lrcFiniteScope ? !validateRetainedLrcEvidence(input.lrcEvidence, contract.lrcFiniteScope, digestMathPilotContract(contract))
      : input.lrcEvidence !== undefined) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Trusted LRC evidence must match the sealed solver scope");
    }
    const directory = await mkdtemp(join(tmpdir(), "hiveos-codex-math-"));
    try {
      const status = await runCodex(this.cliPath, ["login", "status"], directory, "", true, this.signal);
      if (!/Logged in using ChatGPT/i.test(status)) {
        throw new ResearchSandboxError("INVALID_TRANSITION", "Local Codex must use ChatGPT subscription sign-in, not an API key");
      }
      const schemaPath = join(directory, "result.schema.json");
      await writeFile(schemaPath, JSON.stringify(input.mathPilot?.caseType === "BENCHMARK_EXACT"
        ? exactBenchmarkOutputJsonSchema : input.mathPilot?.caseType === "BENCHMARK_PROOF" || input.lrcEvidence || input.lrcCampaignEvidence
        ? benchmarkOutputJsonSchema : outputJsonSchema), { mode: 0o600 });
      const prompt = [
        "You are testing a local mathematics-research workflow, not certifying a theorem.",
        input.mathPilot?.caseType === "BENCHMARK_EXACT"
          ? "You may use only local Python arithmetic through a shell tool in this empty read-only sandbox. Do not browse, read files, inspect the host, or use external sources. Keep computation bounded and stdlib-only."
          : "Do not use tools, shell commands, web search, local files or external sources.",
        "Work only from the following exact statement and definitions. Do not silently alter the quantifiers or domain.",
        "Return a proof attempt, a concrete counterexample attempt, partial progress, or an explicit inconclusive result.",
        "Check every algebraic step or candidate against the stated definitions. List remaining limitations.",
        ...(input.lrcEvidence ? [lrcEvidencePrompt(input.lrcEvidence)] : []),
        ...(input.lrcCampaignEvidence ? [lrcCampaignFactsPrompt(input.lrcCampaignEvidence),
          "Use this host-retained unsigned reference, not fresh tool execution. Root OPEN remains PARTIAL/INCONCLUSIVE. Do not author host evidence or import an Erdős/exact-answer task."] : []),
        ...(input.mathPilot?.caseType === "BENCHMARK_EXACT" ? [
          "For this exact-answer public sample, set exactAnswer to the computed nonnegative decimal integer, or null if unresolved. Set computationPython to a self-contained Python 3 stdlib-only program defining answer() that returns the integer, or null if unresolved. The worker separately replays the code in a networkless resource-capped container. Include your mathematical derivation and numerical error control in argument; do not hard-code a published answer.",
          "If you develop any executable code, put its complete source in computationPython even when you cannot execute it yourself or exactAnswer remains null. Never leave code only inside argument. Try running answer() with the local shell before responding; if execution is unavailable, say so accurately and submit the code for independent replay.",
          "Do not confuse a matching integer with a verified derivation or a blind benchmark score.",
        ] : input.mathPilot?.caseType === "BENCHMARK_PROOF" || input.lrcEvidence || input.lrcCampaignEvidence ? [] : [
          "If scope contains a bounded exact-computation record, use only its declared finite domain. A failure within a bounded A-family refutes that auxiliary bound, not the general Erdős–Straus conjecture; a zero-failure finite scan never proves an infinite statement.",
          "For an Erdős–Straus task, place up to four concrete (n,x,y,z) positive-integer decompositions in erdosStrausWitnesses as decimal strings. Use [] if none; never invent a tuple. These are checked independently by exact integer arithmetic after your response.",
          "For a genuine infinite-family task, you may supply up to two erdosStrausPolynomialFamilies. Each array lists coefficients from constant to highest power of t for n(t),x(t),y(t),z(t), with nonnegative decimal-integer coefficients, n(t) affine, t>=0. Supply [] unless you can show n(t) is a primitive progression 1 mod 840, denominators stay positive, and 4xyz=n(xy+xz+yz) is a polynomial identity. A checked family covers only that progression; it is not a proof of the full conjecture or novelty.",
          "For a prime-residual structural counterexample to a fixed-A gate, set erdosStrausGateCounterexample to {prime,failedThroughA}, with 841<=prime<=200000000 and failedThroughA in 3,7,...,107. The tool will exhaust A=3,7,...,failedThroughA and independently replay primality and every factor-pair exclusion before reviewers see it. A human-steered structural COUNTEREXAMPLE_ATTEMPT without this typed candidate is rejected before peer review. Use null unless you assert failure of every gate through that A. This never certifies arbitrary extra premises or refutes the unrestricted Erdős–Straus conjecture.",
        ]),
        "Do not claim independent verification or formal proof. Return only the required JSON object.",
        JSON.stringify({ statement: input.question, scope: input.scope }),
      ].join("\n\n");
      const output = await runCodex(this.cliPath, [
        "exec", "--json", "--ephemeral", "--ignore-user-config", "--skip-git-repo-check",
        "--sandbox", "read-only", "--model", this.modelName,
        "--output-schema", schemaPath, "-C", directory, "-",
      ], directory, prompt, false, this.signal);
      const parsed = parseCodexEvents(output);
      assertNoProviderCampaignEvidence(parsed.output);
      const normalizedOutput = input.mathPilot?.caseType === "BENCHMARK_EXACT"
        ? normalizeExactBenchmarkOutput(parsed.output) : parsed.output;
      const mathAttempt = mathModelAttemptSchema.parse({
        providerName: this.providerName,
        modelName: this.modelName,
        threadId: parsed.threadId,
        ...normalizedOutput,
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
