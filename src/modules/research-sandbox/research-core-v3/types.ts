export type ResearchMode = "ENGINEERING" | "REPRODUCTION" | "DISCOVERY";
export type AcceptanceType = "INTEGER_WITNESS" | "FINITE_EXHAUSTION" | "FINITE_GRAPH_CERTIFICATE" | "EXACT_IDENTITY" | "INTERVAL_ENCLOSURE" | "REVIEWED_ARGUMENT" | "FORMAL_THEOREM";
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export type Quantifier = { kind: "EXISTS" | "FOR_ALL"; variable: string; domain: string };
export type Assumption = { id: string; statement: string; status: "ESTABLISHED" | "SOURCE_DEBT" };
export interface DomainAlignment {
  definitions: { id: string; statement: string }[];
  quantifiers: Quantifier[];
  assumptions: Assumption[];
  predicate: Json;
  acceptanceType: AcceptanceType;
}
export interface ProblemContract {
  version: 3;
  id: string;
  rootId: string;
  target: string;
  mode: ResearchMode;
  domain: { adapterId: string; adapterVersion: number; input: Json };
  definitions: DomainAlignment["definitions"];
  quantifiers: Quantifier[];
  assumptions: Assumption[];
  obligations: { id: string; predicate: Json; acceptanceType: AcceptanceType }[];
  exclusions: string[];
}
export interface DomainLimits {
  maxInputBytes: number;
  maxCandidateBytes: number;
  maxArrayLength: number;
  maxIntegerBits: number;
  maxIntermediateBits: number;
  maxOperations: number;
  maxCheckMilliseconds: number;
  /** Domain-owned dimensions, data only; generic admission never switches on keys. */
  maxDimensions: { [dimension: string]: number };
}
export interface CheckBudget { readonly operations: number; tick(amount?: number): void; integer(value: bigint): bigint }
export interface DomainCheck {
  result: "VERIFIED" | "REJECTED" | "INCONCLUSIVE";
  reason: string;
  checkedScope: Json;
  coverage: Json;
  scientificDisposition: "VERIFIED_EXACT_SCOPE" | "INVALID_CANDIDATE" | "REFUTED_EXACT_PREDICATE" | "INCONCLUSIVE";
  refutation: { predicate: Json; checkedScope: Json } | null;
}
export interface DomainMethodCard {
  id: string;
  acceptanceTypes: readonly AcceptanceType[];
  discriminatingExperiment: string;
  material: string;
}
export interface DomainAdapter {
  readonly id: string;
  readonly version: number;
  readonly checkerSourceDigest: string;
  readonly limits: DomainLimits;
  readonly capabilities: readonly AcceptanceType[];
  readonly methodMaterial: string;
  readonly candidateSchema: Json;
  readonly inputSchema: Json;
  readonly methodCards: readonly DomainMethodCard[];
  applicableMethods(input: Json): readonly DomainMethodCard[];
  parseInput(input: unknown): Json;
  alignment(input: Json): DomainAlignment;
  parseCandidate(input: unknown, domainInput: Json): Json;
  check(input: Json, candidate: Json, budget: CheckBudget): DomainCheck;
}
export interface PreparedProblem { readonly contract: ProblemContract; readonly contractDigest: string; readonly inputDigest: string }
export interface AdmittedCandidate {
  readonly originalBytes: string;
  readonly candidateDigest: string;
  readonly normalized: Json;
  readonly contractDigest: string;
  readonly obligationId: string;
}
export interface VerifierBinding {
  contractDigest: string;
  rootId: string;
  obligationId: string;
  predicateDigest: string;
  inputDigest: string;
  candidateDigest: string;
  attemptId: string;
  adapterId: string;
  adapterVersion: number;
  checkerSourceDigest: string;
  runtimeSourceDigest: string;
  sourceBundleDigest: string;
  authorityEpoch: string;
}
export interface HostVerifierReceipt extends VerifierBinding, DomainCheck {
  version: 3;
  acceptanceType: AcceptanceType;
  assumptions: Assumption[];
  limits: DomainLimits;
  operations: number;
  elapsedMilliseconds: number;
  receiptDigest: string;
}
export interface ExactClosure {
  status: "CLOSED_EXACT_SCOPE" | "OPEN";
  obligationId: string;
  acceptanceType: AcceptanceType;
  checkedScope: Json;
  receiptDigest: string;
  wholeProblemSolved: false;
  noveltyEstablished: false;
  externalAcceptance: "NOT_RUN";
}
export type RefusalCode = "SCHEMA_REFUSED" | "RESOURCE_REFUSED" | "UNSUPPORTED" | "ALIGNMENT_REFUSED" | "INTEGRITY_REFUSED" | "AUTHORITY_REFUSED";
export class ResearchCoreRefusal extends Error {
  constructor(readonly code: RefusalCode, message: string) { super(message); this.name = "ResearchCoreRefusal"; }
}
