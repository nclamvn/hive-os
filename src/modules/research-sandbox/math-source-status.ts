import { z } from "zod";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "./integrity";
import { STATUS_PUBLICATIONS, type StatusPublicationId } from "./adapters/math-source-status-fetch";

export const SOURCE_STATUS_TTL_MS = 86_400_000;
const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const publicationIdSchema = z.enum(STATUS_PUBLICATIONS);
export const sourceHealthSchema = z.enum(["ACTIVE", "SUPERSEDED", "WITHDRAWN", "UNAVAILABLE", "STALE", "FUTURE"]);
export const sourceStatusObservationSchema = z.object({
  publicationId: publicationIdSchema, canonicalUri: z.url(), selectedVersion: z.number().int().positive(),
  latestVersion: z.number().int().positive().nullable(), status: sourceHealthSchema,
  freshness: z.enum(["CURRENT", "STALE", "FUTURE"]),
  observedAt: z.iso.datetime(), evaluatedAt: z.iso.datetime(),
  provenance: z.enum(["AUTHORITATIVE_ARXIV_ABS", "UNAVAILABLE_NO_CURRENT_OBSERVATION"]),
  evidenceContent: z.string().max(32_768), contentDigest: digest,
  notice: z.string().max(400), observationDigest: digest,
}).strict();
export type SourceStatusObservation = z.infer<typeof sourceStatusObservationSchema>;

export const SELECTED_SOURCE_VERSIONS: Record<StatusPublicationId, number> = {
  "1107.1010": 6, "1406.6307": 1, "2609.09204": 1,
};

/** Identity normalization is for quarantine checks, NEVER a fetch target. */
export function normalizePublicationIdentity(alias: string): StatusPublicationId | null {
  let value = alias.trim();
  if (/^arxiv:/i.test(value)) value = value.slice(6);
  if (/^10\.48550\/arxiv\./i.test(value)) value = value.replace(/^10\.48550\/arxiv\./i, "");
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (url.username || url.password || url.port) return null;
      const pathname = decodeURIComponent(url.pathname);
      if (["arxiv.org", "www.arxiv.org", "export.arxiv.org"].includes(url.hostname)) {
        value = pathname.replace(/^\/(abs|html|pdf)\//, "").replace(/\.pdf$/i, "");
      } else if (["doi.org", "dx.doi.org"].includes(url.hostname)) {
        value = pathname.slice(1).replace(/^10\.48550\/arxiv\./i, "");
      } else return null;
    } catch { return null; }
  }
  const match = /^(\d{4}\.\d{4,5})(?:v\d+)?$/i.exec(value);
  return match && STATUS_PUBLICATIONS.includes(match[1] as StatusPublicationId) ? match[1] as StatusPublicationId : null;
}

function plainStatusPage(html: string): string {
  return html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ").replace(/&(?:nbsp|amp|lt|gt|quot|apos);/g, (entity) =>
      ({ "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'" }[entity]!))
    .replace(/\s+/g, " ").trim();
}

function pageFacts(id: StatusPublicationId, text: string): { latestVersion: number; withdrawn: boolean } | null {
  const escaped = id.replace(".", "\\.");
  if (!new RegExp(`(?:\\[${escaped}\\]|arXiv:${escaped}(?:v\\d+)?)`, "i").test(text)) return null;
  const history = /Submission history([\s\S]*?)(?:Full-text links:|Access Paper:|$)/i.exec(text)?.[1];
  const versions = history ? [...history.matchAll(/\[v(\d+)\]/g)].map((match) => Number(match[1])) : [];
  if (!versions.length || !/Title\s*:/i.test(text) || !/Subjects\s*:/i.test(text) || !/Cite as\s*:/i.test(text) ||
    versions.some((version) => !Number.isSafeInteger(version) || version < 1 || version > 100)) return null;
  // A citation-version disagreement is a malformed capture, not permission to guess.
  const latestVersion = Math.max(...versions);
  const cite = new RegExp(`arXiv:${escaped}v(\\d+)`, "i").exec(text);
  if (cite && Number(cite[1]) !== latestVersion) return null;
  if (new Set(versions).size !== latestVersion || versions.length !== latestVersion ||
    !new RegExp(`Cite as\\s*:\\s*arXiv:${escaped}(?:v\\d+)?(?:\\s|$)`, "i").test(text)) return null;
  const latestRow = new RegExp(`\\[v${latestVersion}\\]([^[]*)`, "i").exec(history!)?.[1] ?? "";
  return { latestVersion, withdrawn: /This paper has been withdrawn|This paper has been retracted/i.test(text) ||
    /\bwithdrawn\b|\bretracted\b/i.test(latestRow) };
}

export function observeSourceStatus(input: { publicationId: StatusPublicationId; body?: string;
  observedAt: string; evaluatedAt: string; selectedVersion?: number }): SourceStatusObservation {
  const selectedVersion = input.selectedVersion ?? SELECTED_SOURCE_VERSIONS[input.publicationId];
  const text = input.body === undefined ? "" : plainStatusPage(input.body);
  const evidenceContent = Buffer.byteLength(text, "utf8") <= 32_768 ? text : "";
  const facts = pageFacts(input.publicationId, evidenceContent);
  const age = Date.parse(input.evaluatedAt) - Date.parse(input.observedAt);
  // This retained primary withdrawal is an immutable quarantine floor. A fresh or
  // rehashed older alias cannot erase it. Reinstatement requires a new reviewed policy.
  const knownWithdrawn = input.publicationId === "2609.09204";
  let status: SourceStatusObservation["status"] = "UNAVAILABLE";
  if (knownWithdrawn || facts?.withdrawn) status = "WITHDRAWN";
  else if (age < 0) status = "FUTURE";
  else if (age > SOURCE_STATUS_TTL_MS) status = "STALE";
  else if (facts) status = selectedVersion < facts.latestVersion ? "SUPERSEDED" :
    selectedVersion === facts.latestVersion ? "ACTIVE" : "UNAVAILABLE";
  const body = { publicationId: input.publicationId, canonicalUri: `https://arxiv.org/abs/${input.publicationId}`,
    selectedVersion, latestVersion: facts?.latestVersion ?? null, status,
    freshness: age < 0 ? "FUTURE" as const : age > SOURCE_STATUS_TTL_MS ? "STALE" as const : "CURRENT" as const,
    observedAt: input.observedAt, evaluatedAt: input.evaluatedAt,
    provenance: facts ? "AUTHORITATIVE_ARXIV_ABS" as const : "UNAVAILABLE_NO_CURRENT_OBSERVATION" as const,
    evidenceContent, contentDigest: sha256(evidenceContent),
    notice: knownWithdrawn ? "Publication-wide quarantine: latest v2 withdrawn 2026-09-13; author comments report errors. Current fetch availability does not erase that retained notice." :
      status === "ACTIVE" ? "No withdrawal observed in this captured publication record. This is not mathematical certification." :
        `Publication status ${status}; no accepted mathematical premise is certified by this metadata.`,
  };
  return sourceStatusObservationSchema.parse({ ...body, observationDigest: sha256(canonicalJson(body)) });
}

export function verifySourceStatusObservation(raw: unknown): raw is SourceStatusObservation {
  const parsed = sourceStatusObservationSchema.safeParse(raw);
  if (!parsed.success) return false;
  const observation = parsed.data;
  const rebuilt = observeSourceStatus({ publicationId: observation.publicationId,
    body: observation.evidenceContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), selectedVersion: observation.selectedVersion,
    observedAt: observation.observedAt, evaluatedAt: observation.evaluatedAt });
  return canonicalJson(rebuilt) === canonicalJson(observation);
}
