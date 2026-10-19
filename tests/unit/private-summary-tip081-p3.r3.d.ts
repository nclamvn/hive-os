// Internal TOOL contracts only. No ambient module, parser globals or authority.
export type Mode = 'SCRIPT' | 'MODULE';
export type Phase = 'SOURCE_READY' | 'PRODUCER_SUMMARY' | 'PRODUCER_AST_RETIRED' | 'VERIFIED';
export type JsonScalar = string | number | boolean | null;
export type JsonValue = JsonScalar | JsonValue[] | { [key: string]: JsonValue };
export type DataRecord = Record<string, unknown>;
export type AssertCondition = (condition: unknown, message?: string) => asserts condition;
// Handle identity is never reflected by baseline storage; foreign inputs remain unknown.
export type Handle = unknown;
export interface SyntheticAPI {
  createSyntheticSummaryP3(source: string, mode: Mode, cap: number, ttl: number): Handle;
  analyzeSyntheticSummaryP3(handle: Handle): string;
  retireProducerSummaryP3(handle: Handle): string;
  verifySyntheticSummaryP3(handle: Handle, wire: string): string;
  observeSyntheticSummaryP3(handle: Handle): string;
  retireSyntheticSummaryP3(handle: Handle): 'SYNTHETIC_P3_OWNER_RETIRED';
}
export interface KernelAPI { runFixedBoundaryCasesP3(): string }
export interface Pin { readonly path: string; readonly bytes: number; readonly sha256: string }
export interface ArtifactTuple {
  readonly status: 'NOT_ISSUED' | 'SOURCE_REVIEWED_SYNTHETIC_ONLY';
  readonly domain: 'TIP081_P3_SYNTHETIC_ONLY' | 'TIP081_P3_ALIAS_FAULT_TEST_ONLY' | 'TIP081_P3_BOUNDARY_KERNEL_UNIT_ONLY';
  readonly candidate: Pin; readonly inventory: Pin; readonly profile: Pin;
}
export interface DomainCensus { readonly toolBytes: number; readonly sourceCensusHash: string }
export interface TuplePins {
  readonly candidateBytes: number; readonly candidateHash: string;
  readonly inventoryBytes: number; readonly inventoryHash: string;
  readonly profileBytes: number; readonly profileHash: string;
}
export interface FixtureProof {
  readonly fixtureId: 'P321.A_NORMAL'; readonly sourceUnits: 21;
  readonly Qp: 1387262; readonly Pp: 2165; // source upper, not observed count
  readonly nodeSchema: 27680; readonly arrayBacking: 75344;
  readonly derivedString: 185070; readonly callFrame: 172592;
  readonly bookkeeping: 926576; readonly privateCallDepth: 25;
  readonly maxToolBytes: 33262238; readonly proofHash: string;
}
export interface CounterProof {
  readonly fixtureId: 'P322.A_MONOTONE'; readonly producerGrammarEntries: 715;
  readonly replayGrammarEntries: 715; readonly producerConstant: 525;
  readonly finalConstant: 1091; readonly proofHash: string;
}
export type CompositionId = 'P319.C_SOURCE' | 'P321.C_P2_LINK' | 'P321.C_P3_CALLS' | 'P322.C_COUNTER_CALLS';
export interface CompositionReceipt {
  readonly caseId: CompositionId; readonly handSourceHash: string;
  readonly emittedSourceHash: string; readonly status: 'SOURCE_REVIEWED';
}
export interface ReviewedContext {
  readonly version: 1; readonly purpose: 'TIP081_P3_R3_REVIEWED_TOOL_CONTEXT';
  readonly scope: 'TOOL_DATA_ONLY'; readonly status: 'REVIEWED_CONTEXT_BOUND';
  readonly normal: DomainCensus; readonly alias: DomainCensus; readonly kernel: DomainCensus;
  readonly fixtureProof: FixtureProof; readonly counterProof: CounterProof;
  readonly composition: readonly [CompositionReceipt, CompositionReceipt, CompositionReceipt, CompositionReceipt];
  readonly tuples: Readonly<{ normal: TuplePins; alias: TuplePins; kernel: TuplePins }>;
}
export interface Metadata {
  version: number; purpose: string; mode: Mode; phase: Phase;
  totalBytes: number; peakBytes: number; producerParseBytes: number; producerWorkBytes: number;
  summaryBytes: number; replayReservedBytes: number; replayLiveBytes: number; scratchBytes: number;
  unreclaimedProducerBytes: number; unreclaimedReplayBytes: number; attemptedNodes: number;
  internalEntries: number; siteCount: number; grammarPasses: number; metadataEmissions: number;
  semanticCoverage: string; allocatorCoverage: string; graphStatus: string; predecessorOpen: number;
  fullRuntimeClosure: string; execution: boolean; materialization: boolean; realParserDisabled: boolean;
}
export type MetadataKey = keyof Metadata;
export interface BaselineWitness {
  readonly initialBase: number; readonly initialTotalBytes: number;
  readonly sourceUnits: number; readonly mode: Mode; readonly cap: number; readonly ttl: number;
  readonly provenance: 'COMMON_MODE_INITIAL_OBSERVATION_NOT_INDEPENDENT_T';
}
export interface BaselineReconciliation {
  readonly expectedToolBytes: number; readonly expectedInitialBase: number; readonly sourceUnits: number;
  readonly provenance: 'SOURCE_CENSUS_COMPARISON_NOT_AUTHORITY';
}
export interface BaselineContext {
  domain: object | null; sourceUnits: number; mode: Mode; cap: number; ttl: number;
  witness: BaselineWitness | null; lastPhase: number; lastEmissions: number;
  reconciliation: BaselineReconciliation | null;
}
export interface MetadataBaseline {
  register(handle: unknown, domain: unknown, sourceUnits: unknown, mode: unknown, cap: unknown, ttl: unknown): void;
  read(handle: unknown, domain: unknown, text: unknown): Readonly<Metadata>;
  witness(handle: unknown, domain: unknown): BaselineWitness;
  reconcile(handle: unknown, domain: unknown, expectedToolBytes: unknown): BaselineReconciliation;
  forget(handle: unknown, domain: unknown): boolean;
}
export type SiteKind = 'IMPORT' | 'EXPORT' | 'DYNAMIC_IMPORT' | 'CALL' | 'MEMBER' | 'NEW';
export type BindingKind = 'NONE' | 'NO_LOCAL_BINDING' | 'LOCAL_BINDING' | 'AMBIGUOUS';
export type LoaderKind = 'NONE' | 'STATIC_LITERAL' | 'DYNAMIC' | 'OTHER' | 'BARE_REQUIRE' | 'FUNCTION' | 'EVAL' | 'COMPUTED';
export type ConditionKind = 'CERTAIN' | 'CONTROL_OR_DEFERRED' | 'OPTIONAL';
export interface Site {
  kind: SiteKind; start: number; end: number; binding: BindingKind; loader: LoaderKind;
  conditional: ConditionKind; optional: boolean; computed: boolean; status: 'OPEN';
}
// Decoder's existing guards validate strings; enum membership belongs to the
// actual producer/replay comparisons, not a fictitious new TOOL decoder guard.
export interface ScalarSite extends Omit<Site, 'kind' | 'binding' | 'loader' | 'conditional'> {
  kind: string; binding: string; loader: string; conditional: string;
}
export interface Ledger {
  baseBytes: number; producerParseBytes: number; producerWorkBytes: number; summaryBytes: number;
  replayReservedBytes: number; replayLiveBytes: number; scratchBytes: number;
  unreclaimedProducerBytes: number; unreclaimedReplayBytes: number; totalBytes: number; peakBytes: number;
  producerEntries: number; producerAttempts: number; siteCount: number;
}
export type LedgerKey = keyof Ledger;
export interface SummaryBody {
  version: number; purpose: string; mode: Mode; profile: string; syntheticUtf16Hash: string;
  utf16Units: number; astOccurrences: number; grammarAttempts: number; sites: ScalarSite[]; ledger: Ledger;
}
export interface Summary extends SummaryBody { summaryHash: string }
export interface ModelBody extends Omit<SummaryBody, 'sites' | 'ledger'> {
  readonly sites: readonly Readonly<Site>[]; readonly ledger: Readonly<Ledger>;
}
export interface ModelWire { readonly wire: string; readonly bytes: number; readonly summaryHash: string; readonly wireSha256: string }
export interface BoundaryExpectations { wire(variant: unknown): string; check(actualText: unknown): true }
export interface BoundaryVector {
  readonly caseId: string; readonly kind: 'CODEC' | 'PRODUCER_DEPTH' | 'VERIFIER_DEPTH' | 'ENTRY';
  readonly outcome: 'EMITTED' | 'SUMMARY_REFUSED' | 'ADMIT' | 'REFUSE' | 'INVALID_ARGUMENT_REFUSED';
  readonly encodedBytes: number | null; readonly attemptedByteOffset: number | null;
  readonly parentIndex: number | null; readonly modelUsed: number | null; readonly modelDelta: number | null;
  readonly guardAdmitted: boolean | null; readonly bytesBeforeOffset: number; readonly entriesBefore: number;
}
export interface Slot { handle: Handle | null; registered: boolean; lastMetadata: Readonly<Metadata> | null; witnessValue: BaselineWitness | null }
// Deliberate bad arities/foreign values only cross the existing Reflect.apply seam.
export type DynamicCallable = (...args: never[]) => unknown;
export interface CheckedDescriptor {
  configurable?: boolean; enumerable?: boolean; writable?: boolean; value?: unknown;
  get?: (() => unknown) | undefined; set?: ((value: unknown) => void) | undefined;
}
export interface Operation { fn: DynamicCallable | null; args: unknown[] | null }
export type EvidenceStatus = 'UNRUN' | 'RUNNING' | 'PASS' | 'SOURCE_REVIEWED' | 'FAILED' | 'UNFINISHED';
export type Lane = 'NORMAL_INTEGRATION' | 'BOUNDARY_COMPONENT' | 'COMPOSITION_SOURCE';
export interface Group { id: string; status: 'UNRUN' | 'RUNNING' | 'COMPLETE' | 'INCOMPLETE'; firstRow: number; rowCount: number }
export interface EvidenceSuffixMap {
  P301: 'SEQUENCE';
  P302: 'FORGED' | 'PROXY' | 'OBJECT' | 'NULL' | 'STRING' | 'NUMBER' | 'FOREIGN_ALIAS_HANDLE';
  P303: 'RETIRED' | 'EXPIRY';
  P304: 'CREATE_EXTRA' | 'CREATE_GETTER' | 'CREATE_FUNCTION' | 'ANALYZE_EXTRA' | 'ANALYZE_EMPTY' | 'OBSERVE_EXTRA' | 'OBSERVE_EMPTY' | 'RETIRE_PRODUCER_EXTRA' | 'RETIRE_PRODUCER_EMPTY' | 'RETIRE_EXTRA' | 'RETIRE_EMPTY' | 'VERIFY_EXTRA';
  P305: 'IMPORT' | 'EXPORT_NAMED' | 'EXPORT_DEFAULT' | 'EXPORT_ALL' | 'DYNAMIC_LITERAL' | 'REQUIRE' | 'MEMBER_CALL' | 'NEW_FUNCTION' | 'EVAL' | 'SHORTHAND';
  P306: 'DYNAMIC' | 'PARAMETER' | 'VAR' | 'LET' | 'CONST' | 'FUNCTION_BINDING' | 'IMPORT_BINDING' | 'DESTRUCTURING' | 'PARAM_PATTERN' | 'CATCH' | 'IF' | 'LOGICAL' | 'TERNARY' | 'WHILE' | 'CLASS_METHOD' | 'CLASS_FUNCTION' | 'OPTIONAL' | 'COMPUTED';
  P307: 'EMOJI' | 'LONE_SURROGATE' | 'REPLACEMENT';
  P308: 'DUPLICATE' | 'EXTRA' | 'WHITESPACE' | 'BOM' | 'KEY_ORDER' | 'UNSAFE_INTEGER' | 'NEGATIVE_ZERO' | 'FRACTION' | 'DEPTH' | 'ESCAPE' | 'WRONG_PURPOSE';
  P309: 'ADDITIVE' | 'BASELINE_WITNESS'; P310: 'PREMATURE'; P311: 'ALIAS'; P312: 'RETIRE_TRANSFER'; P313: 'REPLAY_RETIRE';
  P314: 'OMITTED'; P315: 'DUPLICATE'; P316: 'START' | 'END' | 'OUT_OF_SOURCE';
  P317: 'BINDING' | 'LOADER' | 'CONDITIONAL' | 'OPTIONAL' | 'COMPUTED';
  P318: 'SOURCE' | 'MODE' | 'LENGTH' | 'OCCURRENCES' | 'ATTEMPTS' | 'GROSS_SEAL';
  P319: 'A_NORMAL' | 'B_INPUT_16384' | 'B_INPUT_16385' | 'C16384' | 'C16385' | 'C_SOURCE';
  P320: 'CAP_REFERENCE' | 'CAP_EXACT' | 'CAP_MINUS_ONE' | 'META01' | 'META02' | 'META03' | 'META04' | 'META05' | 'META06' | 'META07' | 'META08' | 'META09' | 'META10' | 'META11' | 'META12' | 'META13' | 'META14' | 'META15' | 'META16' | 'META17' | 'META18' | 'META19' | 'META20' | 'META21' | 'META22' | 'META23' | 'META24' | 'META25' | 'META26' | 'META27' | 'META28' | 'META29' | 'META30' | 'META31' | 'META32' | 'META33_REFUSED';
  P321: 'A_NORMAL' | 'B.P126' | 'B.P127' | 'B.PNEG' | 'B.P128' | 'B.V126' | 'B.V127' | 'B.VNEG' | 'B.V128' | 'C_P2_LINK' | 'C_P3_CALLS';
  P322: 'A_MONOTONE' | 'B.E19999_1' | 'B.E20000_1' | 'B.E20000_0' | 'B.E0_MAX' | 'B.EMAX_1' | 'B.ENEGZERO_1' | 'B.E0_NEG' | 'B.E19999_FRACTION' | 'B.EUNSAFE_1' | 'B.E0_INFINITY' | 'C_COUNTER_CALLS';
  P323: 'TOTAL' | 'PEAK' | 'CATEGORY_SHIFT' | 'RETIREMENT' | 'REPLAY_ESCROW' | 'COUNTERS';
  P324: 'ORIGINAL_TTL'; P325: 'NO_REPLAY_RENEWAL'; P326: 'CAPTURED_CLOCK'; P327: 'SYNTAX' | 'META_EXHAUSTION' | 'REPLAY_ERROR' | 'FRESH';
  P328: 'EXACT_TUPLE' | 'CANDIDATE_SUFFIX' | 'LOADER_EXTRA_PROMISE' | 'SIX_EXPORTS';
  P329: 'REAL_GUARD_REMOVAL' | 'NORMAL_NO_KERNEL_SWITCH';
  P330: 'INVENTORY_SUFFIX' | 'PROFILE_SUFFIX' | 'PROFILE_FLAGS' | 'CANDIDATE_OBJECT' | 'ARITY_TWO' | 'ARITY_FOUR' | 'GETTER_OBJECT' | 'FUNCTION' | 'BOXED_STRING';
  P331: 'ALIAS_CANDIDATE_MIXED' | 'P2_CANDIDATE_MIXED' | 'REAL_RECEIPT_PURPOSE' | 'FULL_R3_ALIAS' | 'FULL_R3_KERNEL' | 'KERNEL_CANDIDATE_MIXED' | 'KERNEL_INVENTORY_MIXED' | 'KERNEL_PROFILE_MIXED' | 'FULL_R2_NORMAL' | 'FULL_R2_ALIAS' | 'FULL_P2';
  P332: 'NORMAL_CAPTURE_FLAGS' | 'NORMAL_FORGED_FLAGS' | 'KERNEL_FORGED_FLAGS' | 'ALIAS_FORGED_FLAGS' | 'KERNEL_OBSERVATION_OBJECT' | 'BODY_HASH_OBJECT' | 'SEED_OBJECT';
  P333: 'PRIVATE_METADATA'; P334: 'OPEN_LABELS'; P335: 'UNKNOWN_MODE' | 'REGEXP' | 'BIGINT' | 'NONASCII_ID' | 'SCRIPT_IMPORT'; P336: 'NO_SALVAGE';
}
export type GroupId = keyof EvidenceSuffixMap;
export type EvidenceId = { [G in GroupId]: `${G}.${EvidenceSuffixMap[G]}` }[GroupId];
export interface EvidenceRow { id: EvidenceId; lane: Lane; status: EvidenceStatus; group: string; dependency: number }
export interface UnitResult {
  version: number; purpose: string; status: 'INCOMPLETE' | 'COMPLETE'; requirementIds: number;
  requiredRows: number; normalRequired: number; componentRequired: number; compositionRequired: number;
  completedRows: number; unitPassedRows: number; sourceReviewedRows: number; failedRows: number;
  unfinishedRows: number; groups: Group[]; rows: EvidenceRow[];
}
export type ContextScratch = ReviewedContext | DomainCensus | TuplePins | CompositionReceipt | string[] | null;
