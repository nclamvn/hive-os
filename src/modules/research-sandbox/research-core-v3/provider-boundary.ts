import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { frozen, refuse } from "./bounded-json";
import { applicableDomainMethods, getObligation } from "./contract";
import { resolveDomainAdapter } from "./registry";
import { admitCandidate, assertAdmittedCandidate } from "./verification";
import type { AdmittedCandidate, Json, PreparedProblem } from "./types";

export interface GenericResearchRequest {
  version: 3;
  role: "SOLVER" | "REVIEWER";
  adapterId: string;
  adapterVersion: number;
  contractDigest: string;
  obligationId: string;
  prompt: string;
  responseSchema: Json;
  maxResponseBytes: number;
  selectedMethodId: string;
  discriminatingExperiment: string;
}
export interface ProviderUsage { inputTokens: number | null; outputTokens: number | null; calls: number | null; actualModel: string | null; actualModelVersion: string | null }
export interface ProviderResponse { originalBytes: string; usage: ProviderUsage }
/** Transport and usage only; no predicate/verdict/host authority belongs here. */
export interface ResearchProviderPort { invoke(request: GenericResearchRequest): Promise<ProviderResponse> }
export type RetainProviderOutput = (originalBytes: string, request: GenericResearchRequest) => void | Promise<void>;
const requests = new WeakMap<object, PreparedProblem>();
export function prepareSolverRequest(prepared: PreparedProblem, obligationId: string, role: "SOLVER" | "REVIEWER" = "SOLVER", selectedMethodId?: string): GenericResearchRequest {
  const obligation = getObligation(prepared,obligationId);
  if (role !== "SOLVER" && role !== "REVIEWER") refuse("SCHEMA_REFUSED", "Unsupported research role");
  const adapter = resolveDomainAdapter(prepared.contract.domain.adapterId,prepared.contract.domain.adapterVersion);
  const methods = applicableDomainMethods(prepared,obligationId);
  const method = selectedMethodId === undefined ? methods[0] : methods.find(m => m.id === selectedMethodId);
  if (!method) refuse("UNSUPPORTED", "Selected method is not applicable to the exact sealed obligation");
  const publicProblem = { target: prepared.contract.target, mode: prepared.contract.mode, definitions: prepared.contract.definitions, quantifiers: prepared.contract.quantifiers, assumptions: prepared.contract.assumptions, domainInput: prepared.contract.domain.input, obligation, exclusions: prepared.contract.exclusions };
  const request = frozen({ version: 3 as const, role, adapterId: adapter.id, adapterVersion: adapter.version, contractDigest: prepared.contractDigest, obligationId, selectedMethodId: method.id, discriminatingExperiment: method.discriminatingExperiment, prompt: `${role}: propose a candidate for the exact sealed obligation. Do not author host receipts, claim novelty, or substitute samples for exact scope.\n${adapter.methodMaterial}\nReviewed method ${method.id}: ${method.material}\nDiscriminating experiment: ${method.discriminatingExperiment}\nSealed problem data: ${canonicalJson(publicProblem)}`, responseSchema: adapter.candidateSchema, maxResponseBytes: adapter.limits.maxCandidateBytes });
  requests.set(request,prepared);
  return request;
}
export function prepareReviewerRequest(prepared: PreparedProblem, obligationId: string, candidate: AdmittedCandidate, selectedMethodId?: string): GenericResearchRequest {
  const request = prepareSolverRequest(prepared,obligationId,"REVIEWER",selectedMethodId);
  // Refuse forged objects before any property access, getter or canonical hash.
  assertAdmittedCandidate(prepared,obligationId,candidate);
  const review = frozen({ ...request, prompt: `${request.prompt}\nUntrusted candidate to independently review: ${candidate.originalBytes}` });
  requests.set(review,prepared);
  return review;
}
export async function invokeResearchProvider(provider: ResearchProviderPort, request: GenericResearchRequest, prepared: PreparedProblem, retainOriginal: RetainProviderOutput): Promise<{ candidate: AdmittedCandidate; usage: ProviderUsage }> {
  // Only frozen public requests minted for this exact prepared contract may
  // dispatch; reviewer extensions have the same host-bound provenance as solvers.
  if (!request || requests.get(request) !== prepared) refuse("INTEGRITY_REFUSED", "Provider request differs from sealed public projection");
  getObligation(prepared,request.obligationId);
  if (typeof retainOriginal !== "function") refuse("AUTHORITY_REFUSED", "Host output retention is required before dispatch");
  const response = await provider.invoke(request);
  if (typeof response.originalBytes !== "string" || response.originalBytes.length > request.maxResponseBytes || Buffer.byteLength(response.originalBytes,"utf8") > request.maxResponseBytes) refuse("RESOURCE_REFUSED", "Transport returned oversized output; streaming transport must cap before allocation");
  // Retain even malformed candidate text BEFORE admission; storage failure must
  // prevent adoption rather than losing a provider effect behind a schema error.
  await retainOriginal(response.originalBytes,request);
  const candidate = admitCandidate(prepared,request.obligationId,response.originalBytes);
  const usage = response.usage;
  for (const n of [usage.inputTokens,usage.outputTokens,usage.calls]) if (n !== null && (!Number.isSafeInteger(n) || n < 0)) refuse("SCHEMA_REFUSED", "Invalid transport usage; unknown must be null");
  for (const identity of [usage.actualModel,usage.actualModelVersion]) if (identity !== null && (typeof identity !== "string" || identity.length > 200)) refuse("SCHEMA_REFUSED", "Invalid model identity");
  return frozen({ candidate, usage: { inputTokens: usage.inputTokens, outputTokens: usage.outputTokens, calls: usage.calls, actualModel: usage.actualModel, actualModelVersion: usage.actualModelVersion } });
}
