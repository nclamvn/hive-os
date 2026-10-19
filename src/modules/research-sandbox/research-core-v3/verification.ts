import { performance } from "node:perf_hooks";
import { sha256 } from "@/modules/execution-fabric/contracts";
import { boundedJson, digest, frozen, refuse } from "./bounded-json";
import { createCheckBudget } from "./check-budget";
import { assertPreparedProblem, getObligation } from "./contract";
import { resolveDomainAdapter } from "./registry";
import { ResearchCoreRefusal, type AdmittedCandidate, type DomainCheck, type DomainLimits, type ExactClosure, type HostVerifierReceipt, type PreparedProblem, type VerifierBinding } from "./types";

const candidates = new WeakMap<object, PreparedProblem>();
const SHA = /^[a-f0-9]{64}$/;
export function assertAdmittedCandidate(prepared: PreparedProblem, obligationId: string, candidate: AdmittedCandidate): void {
  if (!candidate || candidates.get(candidate) !== prepared) refuse("AUTHORITY_REFUSED", "Candidate must come from exact host intake");
  if (candidate.obligationId !== obligationId) refuse("INTEGRITY_REFUSED", "Candidate obligation binding mismatch");
}
export function admitCandidate(prepared: PreparedProblem, obligationId: string, originalBytes: string): AdmittedCandidate {
  getObligation(prepared,obligationId);
  const adapter = resolveDomainAdapter(prepared.contract.domain.adapterId,prepared.contract.domain.adapterVersion);
  if (typeof originalBytes !== "string") refuse("SCHEMA_REFUSED", "Original candidate bytes must be retained as UTF-8 JSON text");
  // Parse before hash only after raw-byte/structural admission; normalization is
  // a lossless parsed projection, never a replacement for retained source text.
  const bounded = boundedJson(originalBytes,adapter.limits.maxCandidateBytes,adapter.limits.maxArrayLength);
  const normalized = adapter.parseCandidate(bounded,prepared.contract.domain.input);
  if (digest(normalized) !== digest(bounded)) refuse("INTEGRITY_REFUSED", "Domain normalization must retain every candidate field");
  const candidate = frozen({ originalBytes, candidateDigest: sha256(originalBytes), normalized, contractDigest: prepared.contractDigest, obligationId });
  candidates.set(candidate,prepared);
  return candidate;
}
export interface HostVerifierConfig {
  runtimeSourceDigest: string;
  sourceBundleDigest: string;
  authorityEpoch: string;
  /** Actual reviewed checker byte digests, authenticated by the runtime host. */
  checkerSourceDigests: Readonly<Record<string,string>>;
  /** Must durably reserve first or consume one matching host pre-reservation. */
  reserveCheck(binding: Readonly<VerifierBinding> & { limits: Readonly<DomainLimits> }): void;
  now?: () => number;
}
export interface VerifyCandidateInput { prepared: PreparedProblem; obligationId: string; candidate: AdmittedCandidate; attemptId: string; inputDigest: string }
/** Privileged host factory, never exposed as an LLM/client callable endpoint.
 * Trust is reviewed host namespace and authenticated source bundle, not a
 * cryptographic claim against hostile arbitrary same-process JavaScript.
 */
export function createHostVerifier(config: HostVerifierConfig) {
  if (!SHA.test(config.runtimeSourceDigest) || !SHA.test(config.sourceBundleDigest) || typeof config.authorityEpoch !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$/.test(config.authorityEpoch) || typeof config.reserveCheck !== "function") refuse("AUTHORITY_REFUSED", "Verifier requires host source/runtime/authority bindings");
  const pins = boundedJson(config.checkerSourceDigests,32768,32) as Record<string,string>;
  for (const [id,pin] of Object.entries(pins)) { resolveDomainAdapter(id); if (!SHA.test(pin)) refuse("AUTHORITY_REFUSED", "Invalid reviewed checker source digest"); }
  // Snapshot config values; caller mutation cannot change minted receipt identity.
  const authority = { runtimeSourceDigest: config.runtimeSourceDigest, sourceBundleDigest: config.sourceBundleDigest, authorityEpoch: config.authorityEpoch };
  const reserveCheck = config.reserveCheck, now = config.now ?? (() => performance.now());
  const admitted = new WeakSet<object>();
  function verify(args: VerifyCandidateInput): HostVerifierReceipt {
    const { prepared, obligationId, candidate, attemptId, inputDigest } = args;
    assertPreparedProblem(prepared);
    const obligation = getObligation(prepared,obligationId);
    if (!candidate || candidates.get(candidate) !== prepared || candidate.obligationId !== obligationId || inputDigest !== prepared.inputDigest || typeof attemptId !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$/.test(attemptId)) refuse("INTEGRITY_REFUSED", "Candidate/attempt/input binding mismatch");
    const adapter = resolveDomainAdapter(prepared.contract.domain.adapterId,prepared.contract.domain.adapterVersion);
    if (!pins[adapter.id]) refuse("AUTHORITY_REFUSED", "Checker source is not in reviewed host bundle");
    const binding: VerifierBinding = { contractDigest: prepared.contractDigest, rootId: prepared.contract.rootId, obligationId, predicateDigest: digest(obligation.predicate), inputDigest, candidateDigest: candidate.candidateDigest, attemptId, adapterId: adapter.id, adapterVersion: adapter.version, checkerSourceDigest: pins[adapter.id], ...authority };
    reserveCheck(frozen({ ...binding, limits: { ...adapter.limits } }));
    const { budget, elapsed } = createCheckBudget(adapter.limits,now);
    let result: DomainCheck;
    try { result = adapter.check(prepared.contract.domain.input,candidate.normalized,budget); }
    catch (error) {
      if (!(error instanceof ResearchCoreRefusal) || error.code !== "RESOURCE_REFUSED") throw error;
      // A bounded checker refusal is retained as inconclusive, never closure.
      result = { result: "INCONCLUSIVE", scientificDisposition: "INCONCLUSIVE", refutation: null, reason: error.message, checkedScope: { predicate: obligation.predicate }, coverage: { incomplete: true } };
    }
    try { budget.tick(); }
    catch (error) {
      if (!(error instanceof ResearchCoreRefusal) || error.code !== "RESOURCE_REFUSED") throw error;
      result = { result: "INCONCLUSIVE", scientificDisposition: "INCONCLUSIVE", refutation: null, reason: error.message, checkedScope: { predicate: obligation.predicate }, coverage: { incomplete: true } };
    }
    // Report the actual cooperative clock, including overrun, never clamp it to
    // a declared ceiling or treat quota reservation as measured elapsed time.
    const elapsedMilliseconds = elapsed();
    const expectedResult = result.scientificDisposition === "VERIFIED_EXACT_SCOPE" ? "VERIFIED" : result.scientificDisposition === "INCONCLUSIVE" ? "INCONCLUSIVE" : "REJECTED";
    if (result.result !== expectedResult || (result.scientificDisposition === "REFUTED_EXACT_PREDICATE"
      ? !result.refutation || digest(result.refutation.predicate) !== digest(obligation.predicate) || digest(result.refutation.checkedScope) !== digest(result.checkedScope)
      : result.refutation !== null)) refuse("INTEGRITY_REFUSED", "Domain scientific disposition/refutation is not aligned with exact obligation");
    const body = { version: 3 as const, ...binding, ...result, acceptanceType: obligation.acceptanceType, assumptions: prepared.contract.assumptions, limits: { ...adapter.limits }, operations: budget.operations, elapsedMilliseconds };
    const receipt = frozen({ ...body, receiptDigest: digest(body) });
    admitted.add(receipt);
    return receipt;
  }
  function projectClosure(prepared: PreparedProblem, obligationId: string, receipt: HostVerifierReceipt): ExactClosure {
    const obligation = getObligation(prepared,obligationId);
    if (!receipt || !admitted.has(receipt) || receipt.contractDigest !== prepared.contractDigest || receipt.rootId !== prepared.contract.rootId || receipt.obligationId !== obligationId || receipt.predicateDigest !== digest(obligation.predicate) || receipt.inputDigest !== prepared.inputDigest || receipt.acceptanceType !== obligation.acceptanceType) refuse("AUTHORITY_REFUSED", "Closure requires this host's exact scoped verifier receipt, not serialized hashes/votes");
    return frozen({ status: receipt.result === "VERIFIED" && receipt.scientificDisposition === "VERIFIED_EXACT_SCOPE" && !receipt.assumptions.some(a => a.status === "SOURCE_DEBT") ? "CLOSED_EXACT_SCOPE" : "OPEN", obligationId, acceptanceType: receipt.acceptanceType, checkedScope: receipt.checkedScope, receiptDigest: receipt.receiptDigest, wholeProblemSolved: false, noveltyEstablished: false, externalAcceptance: "NOT_RUN" });
  }
  return Object.freeze({ verify, projectClosure });
}
