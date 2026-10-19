import { z } from "zod";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "./integrity";
import { digestMathPilotContract, type MathPilotContract } from "./math-pilot";
import { fetchFixedPublicationStatus, STATUS_PUBLICATIONS, type StatusPublicationId } from "./adapters/math-source-status-fetch";
import { observeSourceStatus, sourceStatusObservationSchema, verifySourceStatusObservation, SOURCE_STATUS_TTL_MS } from "./math-source-status";

const text = (max: number) => z.string().trim().min(1).max(max);
const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const methodFamilySchema = z.enum(["TYPE_II_DIVISOR_RAYS", "MODULAR_SIEVE", "LOCAL_OBSTRUCTION", "AVERAGE_COUNTS", "GLOBAL_BRIDGE", "QUARANTINED_LEAD"]);
export const methodIdSchema = z.enum(["TAO_TYPE_II_DIVISOR", "SALEZ_MODULAR_SIEVE", "TAO_LOCAL_OBSTRUCTION", "ELSHOLTZ_TAO_AVERAGE", "SUPPORT_UNIFORM_BRIDGE", "JIANG_WITHDRAWN_LEAD"]);
export const researchMethodCardSchema = z.object({
  id: methodIdSchema, family: methodFamilySchema, title: text(160),
  knownResults: text(700), assumptions: text(700), obstruction: text(700), missingBridgeToRoot: text(700),
  sourceIds: z.array(z.enum(STATUS_PUBLICATIONS)).min(1).max(3),
  capturedVersion: text(60), sourceLocator: text(200),
  evidenceCeiling: z.enum(["SOURCE_BACKGROUND_NOT_PROOF", "UNVERIFIED_LEAD_NOT_PREMISE"]),
  premiseAuthority: z.literal(false),
  applicability: z.enum(["CURRENT_BACKGROUND", "HISTORICAL_OR_UNAVAILABLE_BACKGROUND", "QUARANTINED_LEAD"]),
  toolNeeds: z.array(z.object({ id: text(80), status: z.enum(["READY", "MISSING"]), description: text(300) }).strict()).min(1).max(4),
  methodContentDigest: digest,
}).strict();
export type ResearchMethodCard = z.infer<typeof researchMethodCardSchema>;
export const researchMethodPacketSchema = z.object({
  schemaVersion: z.literal("MATH_METHOD_MAP_V1"), rootDigest: digest, frontierDossierDigest: digest,
  corpusCoverage: z.literal("PARTIAL_CURATED_NOT_EXHAUSTIVE"), observedAt: z.iso.datetime(),
  sourceHealthMeaning: z.literal("PUBLICATION_STATUS_NOT_MATHEMATICAL_CERTIFICATION"),
  sources: z.array(sourceStatusObservationSchema).length(3), methods: z.array(researchMethodCardSchema).length(6),
  packetDigest: digest,
}).strict();
export type ResearchMethodPacket = z.infer<typeof researchMethodPacketSchema>;

type Seed = Omit<ResearchMethodCard, "applicability" | "methodContentDigest" | "premiseAuthority">;
// Server-reviewed, version-bound, PARTIAL background map. No model may rewrite
// these premises/ceilings merely by calculating a new content digest.
const SEEDS: readonly Seed[] = [
  { id: "TAO_TYPE_II_DIVISOR", family: "TYPE_II_DIVISOR_RAYS", title: "Type II coprime divisor construction",
    knownResults: "Positive coprime a,b with c dividing a+b and 4ab dividing p+c give the Type II representation for prime p.",
    assumptions: "p is prime; a,b,c are positive integers; gcd(a,b)=1; all divisibility conditions hold. The source counts positive denominators, not necessarily distinct or ordered.",
    obstruction: "Deciding a fixed divisor ray does not force a successful partition at every prime.",
    missingBridgeToRoot: "Control all residual support partitions or force one successful partition; check strict root identity and ordering separately.",
    sourceIds: ["1107.1010"], capturedVersion: "v2 (historical baseline)", sourceLocator: "Proposition 1.2 and Remark 1.3",
    evidenceCeiling: "SOURCE_BACKGROUND_NOT_PROOF",
    toolNeeds: [{ id: "PROOF_ATTEMPT", status: "READY", description: "Governed proof attempt; mathematical output still independently reviewed." },
      { id: "SPLIT_RAY_REPLAY", status: "MISSING", description: "Standalone ray replay exists but is not an admitted cycle tool; do not fabricate dispatch." }] },
  { id: "SALEZ_MODULAR_SIEVE", family: "MODULAR_SIEVE", title: "Modular filters and residual classes",
    knownResults: "Seven reference equations yield integer constructions with their stated coprimality conditions; filters reduce bounded verification to residual progressions.",
    assumptions: "Odd prime integer domain for Corollary 1; positive parameters and the coprimality conditions of Proposition 3. Polynomial completeness is a distinct statement.",
    obstruction: "A finite sieve leaves a residual set; a bounded successful check is not universal existence.",
    missingBridgeToRoot: "Prove residual coverage for arbitrary primes, rather than expand a finite computational range.",
    sourceIds: ["1406.6307"], capturedVersion: "v1", sourceLocator: "Proposition 3; Corollary 1; sections 3 and 4.1",
    evidenceCeiling: "SOURCE_BACKGROUND_NOT_PROOF", toolNeeds: [{ id: "SOURCE_REVIEW", status: "READY", description: "Review assumptions and selected equations before any new executable sieve is admitted." },
      { id: "SEVEN_EQUATION_SIEVE", status: "MISSING", description: "No governed complete Salez sieve is registered in the cycle." }] },
  { id: "TAO_LOCAL_OBSTRUCTION", family: "LOCAL_OBSTRUCTION", title: "Local character obstruction",
    knownResults: "For n=1 mod 8 and the Proposition 1.4 coprime divisor assumptions, the Jacobi symbol against the odd part of 4ab is -1.",
    assumptions: "Positive a,b,c,n; gcd(a,b)=1; c divides a+b; 4ab divides nc+1 or n+c. This is a scoped obstruction, not a claim that all global approaches fail.",
    obstruction: "Pure fixed local congruence coverage cannot distinguish all primes from square-like residual classes.",
    missingBridgeToRoot: "Introduce prime-sensitive global information and prove its pointwise effect.",
    sourceIds: ["1107.1010"], capturedVersion: "v2 (historical baseline)", sourceLocator: "Proposition 1.4 and following paragraph",
    evidenceCeiling: "SOURCE_BACKGROUND_NOT_PROOF", toolNeeds: [{ id: "PROOF_ATTEMPT", status: "READY", description: "Test a genuinely global bridge while keeping the obstruction hypotheses explicit." }] },
  { id: "ELSHOLTZ_TAO_AVERAGE", family: "AVERAGE_COUNTS", title: "Average divisor counts versus pointwise existence",
    knownResults: "The current v6 develops average Type I/II counts and explains why typical-count estimates are different from pointwise solvability.",
    assumptions: "Asymptotic estimates concern sums and typical primes; implied constants and sufficiently-large ranges apply. Poisson reasoning is labeled heuristic.",
    obstruction: "Average positivity permits exceptional primes; a heuristic intensity is not a probability certificate for this root.",
    missingBridgeToRoot: "Control exceptional primes pointwise, or supply a separate exact construction for them.",
    sourceIds: ["1107.1010"], capturedVersion: "v6", sourceLocator: "Theorem 1.1; Remark 1.2; introduction discussion of typical counts",
    evidenceCeiling: "SOURCE_BACKGROUND_NOT_PROOF", toolNeeds: [{ id: "SOURCE_REVIEW", status: "READY", description: "Distinguish counting estimates from an all-prime existence premise." },
      { id: "POINTWISE_ANALYTIC_BOUND", status: "MISSING", description: "No verified pointwise exceptional-set bridge is available." }] },
  { id: "SUPPORT_UNIFORM_BRIDGE", family: "GLOBAL_BRIDGE", title: "Support-uniform bridge research hypothesis",
    knownResults: "No universal support-uniform success theorem is retained here. This card is a research direction inferred from the gap, not a literature theorem.",
    assumptions: "Any candidate must preserve original coprime partitions, unused mass and repeated prime valuations, and survive known low-quotient countercontrols.",
    obstruction: "Single-prime-power lower-residue bounds do not extend to arbitrary odd support; successful fixed rays do not cover all partitions.",
    missingBridgeToRoot: "A quantified all-support statement with an independent proof or exact refutation and explicit remaining exceptional cases.",
    sourceIds: ["1107.1010", "1406.6307"], capturedVersion: "inference from v2/v6 and v1 background", sourceLocator: "Project research gap; not a statement attributed to the cited authors",
    evidenceCeiling: "UNVERIFIED_LEAD_NOT_PREMISE", toolNeeds: [{ id: "PROOF_ATTEMPT", status: "READY", description: "Generate a falsifiable structural candidate, not a claimed theorem." },
      { id: "GLOBAL_SUPPORT_CERTIFICATE", status: "MISSING", description: "No full mixed-support certificate or formal proof bridge is retained." }] },
  { id: "JIANG_WITHDRAWN_LEAD", family: "QUARANTINED_LEAD", title: "Withdrawn Jiang lead: no accepted premises",
    knownResults: "No result from this withdrawn publication is adopted as an accepted premise.",
    assumptions: "Publication identity is arXiv 2609.09204 across older version, HTML, PDF and DOI aliases.",
    obstruction: "Latest v2 was withdrawn on 2026-09-13; author comments report errors. Older v1 remains historical suspect material.",
    missingBridgeToRoot: "A new independent proof or separately verified healthy source is required before any claimed result can be used.",
    sourceIds: ["2609.09204"], capturedVersion: "v1 lead; v2 withdrawal", sourceLocator: "Current abstract record and submission history",
    evidenceCeiling: "UNVERIFIED_LEAD_NOT_PREMISE", toolNeeds: [{ id: "SOURCE_REVIEW", status: "READY", description: "Historical audit only; quarantine cannot be lifted by model agreement." }] },
];

function cardsFor(sources: ResearchMethodPacket["sources"]): ResearchMethodCard[] {
  return SEEDS.map((seed) => {
    const statuses = seed.sourceIds.map((id) => sources.find((source) => source.publicationId === id)?.status);
    const applicability: ResearchMethodCard["applicability"] = statuses.includes("WITHDRAWN") ? "QUARANTINED_LEAD" :
      statuses.every((status) => status === "ACTIVE") && !seed.capturedVersion.startsWith("v2") ? "CURRENT_BACKGROUND" : "HISTORICAL_OR_UNAVAILABLE_BACKGROUND";
    const body = { ...seed, applicability, premiseAuthority: false as const };
    return { ...body, methodContentDigest: sha256(canonicalJson(body)) };
  });
}

export async function buildResearchMethodPacket(root: MathPilotContract, frontierDossierDigest: string,
  options: { now?: Date; statusLoader?: (id: StatusPublicationId) => Promise<{ body: string; observedAt?: string }> } = {}): Promise<ResearchMethodPacket> {
  const observedAt = (options.now ?? new Date()).toISOString();
  const loader: (id: StatusPublicationId) => Promise<{ body: string; observedAt?: string }> =
    options.statusLoader ?? fetchFixedPublicationStatus;
  const sources = await Promise.all(STATUS_PUBLICATIONS.map(async (publicationId) => {
    try {
      const loaded = await loader(publicationId);
      return observeSourceStatus({ publicationId, body: loaded.body, observedAt: loaded.observedAt ?? observedAt, evaluatedAt: observedAt });
    } catch { return observeSourceStatus({ publicationId, observedAt, evaluatedAt: observedAt }); }
  }));
  const body = { schemaVersion: "MATH_METHOD_MAP_V1" as const, rootDigest: digestMathPilotContract(root), frontierDossierDigest,
    corpusCoverage: "PARTIAL_CURATED_NOT_EXHAUSTIVE" as const, observedAt,
    sourceHealthMeaning: "PUBLICATION_STATUS_NOT_MATHEMATICAL_CERTIFICATION" as const, sources, methods: cardsFor(sources) };
  return researchMethodPacketSchema.parse({ ...body, packetDigest: sha256(canonicalJson(body)) });
}

/** Historical integrity: no clock/network check and no silent regrading of old ledgers. */
export function verifyResearchMethodPacketIntegrity(raw: unknown, rootContractDigest: string, frontierDossierDigest: string): raw is ResearchMethodPacket {
  const parsed = researchMethodPacketSchema.safeParse(raw);
  if (!parsed.success) return false;
  const { packetDigest, ...body } = parsed.data;
  if (body.rootDigest !== rootContractDigest || body.frontierDossierDigest !== frontierDossierDigest ||
    packetDigest !== sha256(canonicalJson(body))) return false;
  if (STATUS_PUBLICATIONS.some((id) => body.sources.filter((source) => source.publicationId === id).length !== 1)) return false;
  if (body.sources.some((source) => source.evaluatedAt !== body.observedAt || !verifySourceStatusObservation(source))) return false;
  if (body.sources.some((source) => source.selectedVersion !== ({ "1107.1010": 6, "1406.6307": 1, "2609.09204": 1 })[source.publicationId])) return false;
  return canonicalJson(body.methods) === canonicalJson(cardsFor(body.sources));
}

/** New dispatch admission; unavailability stays explicit and cannot authorize a premise. */
export function admitResearchMethodPacket(raw: unknown, rootContractDigest: string, frontierDossierDigest: string, now = new Date()): raw is ResearchMethodPacket {
  if (!verifyResearchMethodPacketIntegrity(raw, rootContractDigest, frontierDossierDigest)) return false;
  const age = now.getTime() - Date.parse(raw.observedAt);
  return age >= 0 && age <= SOURCE_STATUS_TTL_MS && !raw.sources.some((source) => source.freshness === "FUTURE");
}
