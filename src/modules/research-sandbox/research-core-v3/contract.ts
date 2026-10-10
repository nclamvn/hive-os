import { z } from "zod";
import { boundedJson, digest, frozen, parseSchema, refuse } from "./bounded-json";
import { resolveDomainAdapter } from "./registry";
import type { Json, PreparedProblem, ProblemContract, ResearchMode } from "./types";

const identifier = z.string().min(1).max(120).regex(/^[A-Za-z0-9][A-Za-z0-9._:-]*$/);
const text = z.string().min(1).max(16384);
const acceptance = z.enum(["INTEGER_WITNESS", "FINITE_EXHAUSTION", "FINITE_GRAPH_CERTIFICATE", "EXACT_IDENTITY", "INTERVAL_ENCLOSURE", "REVIEWED_ARGUMENT", "FORMAL_THEOREM"]);
const contractSchema = z.object({
  version: z.literal(3), id: identifier, rootId: identifier, target: text,
  mode: z.enum(["ENGINEERING", "REPRODUCTION", "DISCOVERY"]),
  domain: z.object({ adapterId: identifier, adapterVersion: z.number().int().min(1).max(100), input: z.unknown() }).strict(),
  definitions: z.array(z.object({ id: identifier, statement: text }).strict()).min(1).max(16),
  quantifiers: z.array(z.object({ kind: z.enum(["EXISTS", "FOR_ALL"]), variable: identifier, domain: text }).strict()).min(1).max(16),
  assumptions: z.array(z.object({ id: identifier, statement: text, status: z.enum(["ESTABLISHED", "SOURCE_DEBT"]) }).strict()).max(16),
  obligations: z.array(z.object({ id: identifier, predicate: z.unknown(), acceptanceType: acceptance }).strict()).min(1).max(16),
  exclusions: z.array(text).min(1).max(16),
}).strict();
export const REQUIRED_EXCLUSIONS = Object.freeze(["NO_GLOBAL_THEOREM_FROM_FINITE_EVIDENCE", "NO_NOVELTY_FROM_AI", "NO_EXTERNAL_ACCEPTANCE_FROM_SYNTHETIC_CONTROLS"]);
const preparedObjects = new WeakSet<object>();
export function assertPreparedProblem(prepared: PreparedProblem): void {
  if (!prepared || !preparedObjects.has(prepared)) refuse("AUTHORITY_REFUSED", "Prepared contract must come from host intake");
}
export function prepareProblemContract(raw: unknown): PreparedProblem {
  const bounded = boundedJson(raw, 262144, 256);
  const contract = parseSchema(contractSchema, bounded) as ProblemContract;
  const adapter = resolveDomainAdapter(contract.domain.adapterId, contract.domain.adapterVersion);
  const domainInput = boundedJson(contract.domain.input, adapter.limits.maxInputBytes, adapter.limits.maxArrayLength);
  contract.domain.input = adapter.parseInput(domainInput);
  const alignment = adapter.alignment(contract.domain.input);
  if (digest(contract.definitions) !== digest(alignment.definitions) || digest(contract.quantifiers) !== digest(alignment.quantifiers) || digest(contract.assumptions) !== digest(alignment.assumptions)) refuse("ALIGNMENT_REFUSED", "Definitions, ordered quantifiers and assumptions must exactly align with the installed domain predicate");
  const names = new Set<string>();
  for (const obligation of contract.obligations) {
    if (names.has(obligation.id)) refuse("SCHEMA_REFUSED", "Duplicate obligation identifier"); names.add(obligation.id);
    if (!adapter.capabilities.includes(obligation.acceptanceType)) refuse("UNSUPPORTED", "Checker does not support requested acceptance type");
    if (obligation.acceptanceType !== alignment.acceptanceType || digest(obligation.predicate) !== digest(alignment.predicate)) refuse("ALIGNMENT_REFUSED", "Obligation predicate/acceptance type must match exact sealed input");
  }
  if (REQUIRED_EXCLUSIONS.some(e => !contract.exclusions.includes(e))) refuse("ALIGNMENT_REFUSED", "Mandatory evidence ceiling exclusions missing");
  const prepared = frozen({ contract, contractDigest: digest(contract), inputDigest: digest(contract.domain.input) });
  preparedObjects.add(prepared);
  return prepared;
}
export function createDomainProblemContract(options: {
  id: string; rootId: string; target: string; mode: ResearchMode;
  adapterId: string; adapterVersion?: number; input: unknown; obligationId: string;
}): PreparedProblem {
  // Bound the entire host-authored request, not only its domain payload.
  const bounded = boundedJson(options, 65536, 256) as unknown as typeof options;
  const keys = Object.keys(bounded);
  if (keys.some(k => !["id", "rootId", "target", "mode", "adapterId", "adapterVersion", "input", "obligationId"].includes(k))) refuse("SCHEMA_REFUSED", "Unsupported contract builder key");
  const adapter = resolveDomainAdapter(bounded.adapterId, bounded.adapterVersion ?? 1);
  const input = adapter.parseInput(boundedJson(bounded.input, adapter.limits.maxInputBytes, adapter.limits.maxArrayLength));
  const alignment = adapter.alignment(input);
  return prepareProblemContract({ version: 3, id: bounded.id, rootId: bounded.rootId, target: bounded.target, mode: bounded.mode, domain: { adapterId: adapter.id, adapterVersion: adapter.version, input }, definitions: alignment.definitions, quantifiers: alignment.quantifiers, assumptions: alignment.assumptions, obligations: [{ id: bounded.obligationId, predicate: alignment.predicate, acceptanceType: alignment.acceptanceType }], exclusions: [...REQUIRED_EXCLUSIONS] });
}
export function getObligation(prepared: PreparedProblem, obligationId: string) {
  assertPreparedProblem(prepared);
  const obligation = prepared.contract.obligations.find(o => o.id === obligationId);
  if (!obligation) refuse("ALIGNMENT_REFUSED", "Unknown contract obligation");
  return obligation;
}
export function applicableDomainMethods(prepared: PreparedProblem, obligationId: string) {
  const obligation = getObligation(prepared,obligationId);
  const adapter = resolveDomainAdapter(prepared.contract.domain.adapterId,prepared.contract.domain.adapterVersion);
  const methods = adapter.applicableMethods(prepared.contract.domain.input).filter(c => c.acceptanceTypes.includes(obligation.acceptanceType));
  if (methods.some(c => !adapter.methodCards.includes(c)) || new Set(methods.map(c => c.id)).size !== methods.length) refuse("INTEGRITY_REFUSED", "Applicable method cards must come from reviewed static adapter");
  return frozen([...methods]);
}
export function contractProjection(prepared: PreparedProblem): Json {
  assertPreparedProblem(prepared);
  return prepared.contract as unknown as Json;
}
