import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { sha256 } from "./integrity";
import type { MathPilotContract } from "./math-pilot";
import { knownScopeForTask, mathPriorArtFor } from "./math-prior-art";

const bounded = (max: number) => z.string().trim().min(1).max(max);

/** A captured passage, not a digest or certification of the entire publication. */
export const frontierSourceSchema = z.object({
  id: bounded(160), canonicalUri: z.url(), title: bounded(300), authors: bounded(300),
  publicationYear: z.number().int().min(1500).max(2100), version: bounded(100),
  captureMethod: z.literal("CURATED_PRIMARY_EXCERPT"),
  scope: z.enum(["ROOT_DOMAIN", "ALL_INTEGERS", "ODD_PRIMES"]),
  content: bounded(2_000), contentDigest: z.string().regex(/^[a-f0-9]{64}$/),
  exactQuote: bounded(400), startOffset: z.number().int().nonnegative(), endOffset: z.number().int().positive(),
}).strict();
export type FrontierSource = z.infer<typeof frontierSourceSchema>;

export const frontierDiscoverySchema = z.object({
  provider: z.literal("CROSSREF"), query: bounded(300), status: z.enum(["COMPLETE", "UNAVAILABLE"]),
  candidates: z.array(z.object({ doi: bounded(200), title: bounded(300), year: z.number().int().min(1500).max(2100).nullable(),
    canonicalUri: z.url() }).strict()).max(5),
}).strict();
export const frontierDossierSchema = z.object({
  coverage: z.literal("PARTIAL_NOT_NOVELTY_CERTIFICATE"),
  sources: z.array(frontierSourceSchema).max(8), discovery: frontierDiscoverySchema,
  dossierDigest: z.string().regex(/^[a-f0-9]{64}$/),
}).strict();
export type FrontierDossier = z.infer<typeof frontierDossierSchema>;

export const frontierAssessmentSchema = z.object({
  sourceIds: z.array(bounded(160)).min(1).max(8),
  relevance: z.enum(["RELEVANT", "UNCERTAIN", "IRRELEVANT"]),
  quantifiers: z.enum(["MATCH", "NARROWER", "UNCERTAIN"]),
  overlap: z.enum(["KNOWN", "NOT_SHOWN_IN_CAPTURED_SOURCES", "UNCERTAIN"]),
  explanation: bounded(1_000),
}).strict();
export type FrontierAssessment = z.infer<typeof frontierAssessmentSchema>;

function capturedSource(input: Omit<FrontierSource, "contentDigest" | "startOffset" | "endOffset">): FrontierSource {
  const startOffset = input.content.indexOf(input.exactQuote);
  if (startOffset < 0) throw new Error("Curated frontier quote is not present in its captured passage");
  return frontierSourceSchema.parse({ ...input, contentDigest: sha256(input.content),
    startOffset, endOffset: startOffset + input.exactQuote.length });
}

const ERDOS_SOURCES: readonly FrontierSource[] = [
  capturedSource({
    id: "erdos-straus-n-2-mod-3", canonicalUri: "https://scialert.net/fulltext/?doi=aja.2011.31.37",
    title: "The Diophantine Equations of Second and Higher Degree", authors: "Kishan, Rani and Agarwal",
    publicationYear: 2011, version: "journal-2011", captureMethod: "CURATED_PRIMARY_EXCERPT", scope: "ALL_INTEGERS",
    content: "For instance, whenever n = 2 (mod 3), 4/n has the expansion:",
    exactQuote: "whenever n = 2 (mod 3), 4/n has the expansion",
  }),
  capturedSource({
    id: "erdos-straus-n-3-mod-4", canonicalUri: "https://terrytao.wordpress.com/2011/07/07/on-the-number-of-solutions-to-4p-1n_1-1n_2-1n_3/",
    title: "On the number of solutions to 4/p = 1/n_1 + 1/n_2 + 1/n_3", authors: "Terence Tao",
    publicationYear: 2011, version: "author-post-2011-07-07", captureMethod: "CURATED_PRIMARY_EXCERPT", scope: "ODD_PRIMES",
    content: "Taking (a,b,c)=(1,1,1), we see that the conjecture holds whenever p=3 mod 4.",
    exactQuote: "the conjecture holds whenever p=3 mod 4",
  }),
  capturedSource({
    id: "erdos-straus-n-5-mod-8", canonicalUri: "https://terrytao.wordpress.com/2011/07/07/on-the-number-of-solutions-to-4p-1n_1-1n_2-1n_3/",
    title: "On the number of solutions to 4/p = 1/n_1 + 1/n_2 + 1/n_3", authors: "Terence Tao",
    publicationYear: 2011, version: "author-post-2011-07-07", captureMethod: "CURATED_PRIMARY_EXCERPT", scope: "ODD_PRIMES",
    content: "Taking (a,b,c)=(1,2,3), we see that the conjecture holds whenever p=5 mod 8.",
    exactQuote: "the conjecture holds whenever p=5 mod 8",
  }),
];

export function verifyFrontierSource(source: FrontierSource): boolean {
  return sha256(source.content) === source.contentDigest &&
    source.content.slice(source.startOffset, source.endOffset) === source.exactQuote;
}

export function frontierSourcesFor(contract: MathPilotContract): FrontierSource[] {
  const ids = new Set(mathPriorArtFor(contract).map((fact) => fact.id));
  return ERDOS_SOURCES.filter((source) => ids.has(source.id));
}

function discoveryQuery(contract: MathPilotContract): string {
  return frontierSourcesFor(contract).length ? "Erdos Straus Egyptian fractions congruence" : contract.statement.slice(0, 240);
}

/** Crossref is discovery metadata only. Its hits never establish a theorem or novelty. */
export async function discoverFrontier(contract: MathPilotContract,
  fetcher: typeof fetch = fetch): Promise<z.infer<typeof frontierDiscoverySchema>> {
  const query = discoveryQuery(contract);
  try {
    const url = new URL("https://api.crossref.org/works");
    url.searchParams.set("query.bibliographic", query);
    url.searchParams.set("rows", "5");
    url.searchParams.set("select", "DOI,title,published,issued");
    const response = await fetcher(url, { signal: AbortSignal.timeout(7_000), redirect: "error",
      headers: { Accept: "application/json" } });
    if (!response.ok || Number(response.headers.get("content-length") ?? 0) > 256_000) throw new Error("Discovery unavailable");
    const body = await response.text();
    if (Buffer.byteLength(body, "utf8") > 256_000) throw new Error("Discovery response too large");
    const raw = JSON.parse(body) as { message?: { items?: Array<{ DOI?: unknown; title?: unknown;
      published?: { "date-parts"?: unknown }; issued?: { "date-parts"?: unknown } }> } };
    const candidates = (raw.message?.items ?? []).slice(0, 5).flatMap((item) => {
      const doi = typeof item.DOI === "string" ? item.DOI.slice(0, 200) : "";
      const title = Array.isArray(item.title) && typeof item.title[0] === "string" ? item.title[0].slice(0, 300) : "";
      const parts = item.published?.["date-parts"] ?? item.issued?.["date-parts"];
      const year = Array.isArray(parts) && Array.isArray(parts[0]) && Number.isInteger(parts[0][0]) ? parts[0][0] as number : null;
      if (!doi || !title || !/^10\.\d{4,9}\//.test(doi)) return [];
      return [{ doi, title, year: year && year >= 1500 && year <= 2100 ? year : null,
        canonicalUri: `https://doi.org/${encodeURIComponent(doi)}` }];
    });
    return frontierDiscoverySchema.parse({ provider: "CROSSREF", query, status: "COMPLETE", candidates });
  } catch {
    return { provider: "CROSSREF", query, status: "UNAVAILABLE", candidates: [] };
  }
}

export async function buildFrontierDossier(contract: MathPilotContract,
  fetcher: typeof fetch = fetch): Promise<FrontierDossier> {
  const content = { coverage: "PARTIAL_NOT_NOVELTY_CERTIFICATE" as const,
    sources: frontierSourcesFor(contract), discovery: await discoverFrontier(contract, fetcher) };
  return frontierDossierSchema.parse({ ...content, dossierDigest: sha256(canonicalJson(content)) });
}

export function verifyFrontierDossier(dossier: FrontierDossier): boolean {
  const parsed = frontierDossierSchema.safeParse(dossier);
  if (!parsed.success || parsed.data.sources.some((source) => !verifyFrontierSource(source))) return false;
  return sha256(canonicalJson({ coverage: parsed.data.coverage, sources: parsed.data.sources,
    discovery: parsed.data.discovery })) === dossier.dossierDigest;
}

export function frontierGate(input: { root: MathPilotContract; task: string; dossier: FrontierDossier;
  analyst?: FrontierAssessment; challenger?: FrontierAssessment }): {
    decision: "KNOWN" | "RESEARCH_ONLY" | "HOLD"; reason: string;
  } {
  if (!verifyFrontierDossier(input.dossier)) return { decision: "HOLD", reason: "Source dossier integrity failed" };
  const known = knownScopeForTask(input.root, input.task);
  if (known) return input.dossier.sources.some((source) => source.id === known.id)
    ? { decision: "KNOWN", reason: `Covered by ${known.id}; ${known.sourceUrl}` }
    : { decision: "HOLD", reason: "A known-scope source is missing from the retained dossier" };
  if (input.dossier.discovery.status !== "COMPLETE" || !input.dossier.sources.length) {
    return { decision: "HOLD", reason: "Source discovery or primary passage is unavailable" };
  }
  if (!input.analyst || !input.challenger) return { decision: "HOLD", reason: "Independent source assessments are missing" };
  if (!frontierAssessmentSchema.safeParse(input.analyst).success ||
    !frontierAssessmentSchema.safeParse(input.challenger).success) {
    return { decision: "HOLD", reason: "Source assessments failed contract validation" };
  }
  const ids = new Set(input.dossier.sources.map((source) => source.id));
  if (input.analyst.quantifiers !== input.challenger.quantifiers ||
    input.analyst.quantifiers === "UNCERTAIN") {
    return { decision: "HOLD", reason: "Independent source agents disagree on theorem quantifiers" };
  }
  for (const assessment of [input.analyst, input.challenger]) {
    if (assessment.sourceIds.some((id) => !ids.has(id)) || assessment.relevance !== "RELEVANT" ||
      assessment.overlap !== "NOT_SHOWN_IN_CAPTURED_SOURCES") {
      return { decision: "HOLD", reason: "Independent source and quantifier assessments did not agree" };
    }
  }
  return { decision: "RESEARCH_ONLY", reason: "Bounded exploration permitted; novelty and theorem status remain unverified" };
}
