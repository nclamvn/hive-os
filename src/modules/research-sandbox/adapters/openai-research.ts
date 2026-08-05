import { resolve4, resolve6 } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";

import { z } from "zod";

import type {
  ResearchProvider,
  ResearchProviderResult,
  ResearchRequest,
} from "../contracts";
import { ResearchSandboxError } from "../errors";
import { sha256 } from "../integrity";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const SOURCE_BYTES_MAX = 1_048_576;
const SOURCE_TIMEOUT_MS = 15_000;
const REDIRECTS_MAX = 3;

const researchPlanSchema = z
  .object({
    sources: z
      .array(
        z
          .object({
            url: z.string().url(),
            title: z.string().trim().min(1).max(500),
            publisher: z.string().trim().min(1).max(240),
            sourceClass: z.enum(["PRIMARY", "SECONDARY", "UNKNOWN"]),
          })
          .strict(),
      )
      .max(50),
    findings: z
      .array(
        z
          .object({
            key: z.string().trim().min(1).max(80),
            kind: z.enum(["SUPPORTING", "CONFLICTING", "CONTEXT", "HONEST_NULL"]),
            claim: z.string().trim().min(1).max(8_000),
            sourceUrl: z.string().url().nullable(),
            exactExcerpt: z.string().max(20_000),
            confidence: z.number().min(0).max(1),
          })
          .strict(),
      )
      .min(1)
      .max(500),
  })
  .strict();

type ResearchPlan = z.infer<typeof researchPlanSchema>;

interface OpenAIResponse {
  id?: string;
  status?: string;
  error?: { message?: string } | null;
  output?: unknown[];
}

export interface OpenAIResearchProviderOptions {
  apiKey: string;
  modelName: string;
  providerName?: string;
  projectId?: string;
  apiFetch?: typeof fetch;
  sourceLoader?: (url: URL) => Promise<{ body: string; mediaType: string; finalUrl: URL }>;
}

/**
 * Credential-safe Responses API adapter. The model discovers and proposes
 * evidence; this adapter independently retrieves every accepted source and
 * rebinds each finding to an exact span before returning it to the SOT kernel.
 */
export class OpenAIResearchProvider implements ResearchProvider {
  readonly providerName: string;
  readonly modelName: string;
  private readonly apiKey: string;
  private readonly projectId?: string;
  private readonly apiFetch: typeof fetch;
  private readonly sourceLoader: NonNullable<OpenAIResearchProviderOptions["sourceLoader"]>;

  constructor(options: OpenAIResearchProviderOptions) {
    if (!options.apiKey.trim()) {
      throw new ResearchSandboxError("INVALID_INPUT", "OpenAI adapter credential is not configured");
    }
    this.apiKey = options.apiKey;
    this.modelName = options.modelName;
    this.providerName = options.providerName ?? "openai";
    this.projectId = options.projectId;
    this.apiFetch = options.apiFetch ?? fetch;
    this.sourceLoader = options.sourceLoader ?? loadPublicTextSource;
  }

  async execute(input: Omit<ResearchRequest, "idempotencyKey">): Promise<ResearchProviderResult> {
    if (input.providerName !== this.providerName || input.modelName !== this.modelName) {
      throw new ResearchSandboxError("PROVIDER_MISMATCH", "OpenAI adapter identity does not match the request");
    }
    const response = await this.callResponsesApi(input);
    const consultedUrls = collectConsultedUrls(response.output ?? []);
    const plan = parseResearchPlan(response.output ?? []);
    const boundedSources = plan.sources.slice(0, input.sourcePolicy.maxSources);
    const sources: ResearchProviderResult["sources"] = [];
    const sourceByCanonicalUrl = new Map<string, ResearchProviderResult["sources"][number]>();

    for (const proposed of boundedSources) {
      const proposedUrl = canonicalizeUrl(new URL(proposed.url));
      if (!consultedUrls.has(proposedUrl.href)) {
        continue;
      }
      if (!domainAllowed(proposedUrl.hostname, input.sourcePolicy.allowedDomains)) {
        continue;
      }
      const loaded = await this.sourceLoader(proposedUrl);
      const finalUrl = canonicalizeUrl(loaded.finalUrl);
      if (!consultedUrls.has(proposedUrl.href) || !domainAllowed(finalUrl.hostname, input.sourcePolicy.allowedDomains)) {
        continue;
      }
      const content = normalizeSourceText(loaded.body);
      if (!content) continue;
      const key = `source-${sources.length + 1}`;
      const source = {
        key,
        canonicalUri: finalUrl.href,
        title: proposed.title,
        publisher: proposed.publisher,
        mediaType: loaded.mediaType,
        content,
        contentDigest: sha256(content),
        sourceClass: proposed.sourceClass,
        capturedAt: new Date(),
      } satisfies ResearchProviderResult["sources"][number];
      sources.push(source);
      sourceByCanonicalUrl.set(proposedUrl.href, source);
      sourceByCanonicalUrl.set(finalUrl.href, source);
    }

    const findings: ResearchProviderResult["findings"] = [];
    for (const proposed of plan.findings) {
      if (proposed.kind === "HONEST_NULL") {
        findings.push({
          key: proposed.key,
          kind: "HONEST_NULL",
          claim: proposed.claim,
          sourceKey: null,
          exactExcerpt: "",
          startOffset: null,
          endOffset: null,
          confidence: proposed.confidence,
        });
        continue;
      }
      if (!proposed.sourceUrl || !proposed.exactExcerpt.trim()) continue;
      const source = sourceByCanonicalUrl.get(canonicalizeUrl(new URL(proposed.sourceUrl)).href);
      if (!source) continue;
      const excerpt = normalizeSourceText(proposed.exactExcerpt);
      const startOffset = source.content.indexOf(excerpt);
      if (startOffset < 0) continue;
      findings.push({
        key: proposed.key,
        kind: proposed.kind,
        claim: proposed.claim,
        sourceKey: source.key,
        exactExcerpt: excerpt,
        startOffset,
        endOffset: startOffset + excerpt.length,
        confidence: proposed.confidence,
      });
    }
    if (!findings.length) {
      findings.push({
        key: "honest-null-no-verifiable-span",
        kind: "HONEST_NULL",
        claim: "The research adapter found no finding that could be rebound to an exact retained source span.",
        sourceKey: null,
        exactExcerpt: "",
        startOffset: null,
        endOffset: null,
        confidence: 0,
      });
    }
    return { providerName: this.providerName, modelName: this.modelName, sources, findings };
  }

  private async callResponsesApi(input: Omit<ResearchRequest, "idempotencyKey">): Promise<OpenAIResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180_000);
    try {
      const allowedDomains = input.sourcePolicy.allowedDomains.map((domain) => domain.replace(/^\*\./, ""));
      const response = await this.apiFetch(OPENAI_RESPONSES_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          authorization: `Bearer ${this.apiKey}`,
          "content-type": "application/json",
          ...(this.projectId ? { "openai-project": this.projectId } : {}),
        },
        body: JSON.stringify({
          model: this.modelName,
          store: false,
          include: ["web_search_call.action.sources"],
          reasoning: { effort: "high" },
          tools: [
            {
              type: "web_search",
              search_context_size: "high",
              ...(allowedDomains.length ? { filters: { allowed_domains: allowedDomains } } : {}),
            },
          ],
          input: [
            {
              role: "system",
              content:
                "You are a bounded research collector, never an approver. Use web search. Return only claims supported by verbatim excerpts from consulted sources. Preserve disagreement and use HONEST_NULL when evidence is absent. Do not invent URLs, quotations, publishers, or certainty.",
            },
            {
              role: "user",
              content: JSON.stringify({
                question: input.question,
                scope: input.scope,
                queries: input.queryPlan.queries,
                languages: input.queryPlan.languages,
                sourcePolicy: input.sourcePolicy,
              }),
            },
          ],
          text: { format: researchJsonFormat() },
        }),
      });
      if (!response.ok) {
        throw new ResearchSandboxError("INVALID_INPUT", `OpenAI Responses API failed with HTTP ${response.status}`);
      }
      const body = (await response.json()) as OpenAIResponse;
      if (body.error || body.status === "failed" || !Array.isArray(body.output)) {
        throw new ResearchSandboxError("INVALID_INPUT", "OpenAI Responses API returned an incomplete result");
      }
      return body;
    } catch (error) {
      if (error instanceof ResearchSandboxError) throw error;
      throw new ResearchSandboxError("INVALID_INPUT", "OpenAI research request failed before a governed result was produced");
    } finally {
      clearTimeout(timeout);
    }
  }
}

function researchJsonFormat() {
  const findingProperties = {
    key: { type: "string" },
    kind: { type: "string", enum: ["SUPPORTING", "CONFLICTING", "CONTEXT", "HONEST_NULL"] },
    claim: { type: "string" },
    sourceUrl: { type: ["string", "null"] },
    exactExcerpt: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  };
  return {
    type: "json_schema",
    name: "governed_research_collection",
    strict: true,
    schema: {
      type: "object",
      properties: {
        sources: {
          type: "array",
          items: {
            type: "object",
            properties: {
              url: { type: "string" },
              title: { type: "string" },
              publisher: { type: "string" },
              sourceClass: { type: "string", enum: ["PRIMARY", "SECONDARY", "UNKNOWN"] },
            },
            required: ["url", "title", "publisher", "sourceClass"],
            additionalProperties: false,
          },
        },
        findings: {
          type: "array",
          items: {
            type: "object",
            properties: findingProperties,
            required: Object.keys(findingProperties),
            additionalProperties: false,
          },
        },
      },
      required: ["sources", "findings"],
      additionalProperties: false,
    },
  };
}

function parseResearchPlan(output: unknown[]): ResearchPlan {
  for (const item of output) {
    if (!item || typeof item !== "object" || (item as { type?: string }).type !== "message") continue;
    const content = (item as { content?: unknown[] }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (!part || typeof part !== "object" || (part as { type?: string }).type !== "output_text") continue;
      const text = (part as { text?: unknown }).text;
      if (typeof text !== "string") continue;
      const parsed = researchPlanSchema.safeParse(JSON.parse(text));
      if (parsed.success) return parsed.data;
    }
  }
  throw new ResearchSandboxError("INVALID_INPUT", "OpenAI response did not contain the governed research schema");
}

function collectConsultedUrls(output: unknown[]): Set<string> {
  const urls = new Set<string>();
  const visit = (value: unknown) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    const record = value as Record<string, unknown>;
    if (typeof record.url === "string") {
      try {
        urls.add(canonicalizeUrl(new URL(record.url)).href);
      } catch {
        // Invalid tool metadata is ignored and can never authorize retrieval.
      }
    }
    Object.values(record).forEach(visit);
  };
  visit(output);
  return urls;
}

function canonicalizeUrl(url: URL): URL {
  if (url.protocol !== "https:") throw new ResearchSandboxError("INVALID_INPUT", "Research sources must use HTTPS");
  if (url.username || url.password) throw new ResearchSandboxError("INVALID_INPUT", "Research source URLs cannot contain credentials");
  const copy = new URL(url.href);
  copy.hash = "";
  return copy;
}

function domainAllowed(hostname: string, rules: string[]) {
  if (!rules.length) return true;
  const host = hostname.toLowerCase();
  return rules.some((rule) => {
    const normalized = rule.toLowerCase().replace(/^\*\./, "");
    return host === normalized || host.endsWith(`.${normalized}`);
  });
}

function normalizeSourceText(value: string): string {
  return decodeHtmlEntities(
    value
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(script|style|template|noscript)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, SOURCE_BYTES_MAX);
}

function decodeHtmlEntities(value: string) {
  const named: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith("#x")) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    if (entity.startsWith("#")) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    return named[entity.toLowerCase()] ?? match;
  });
}

export async function loadPublicTextSource(
  url: URL,
  redirects = 0,
): Promise<{ body: string; mediaType: string; finalUrl: URL }> {
  const safeUrl = canonicalizeUrl(url);
  const addresses = await resolvePublicAddresses(safeUrl.hostname);
  const address = addresses[0]!;
  return new Promise((resolve, reject) => {
    const request = httpsRequest(
      safeUrl,
      {
        method: "GET",
        headers: { accept: "text/html, text/plain;q=0.9", "accept-encoding": "identity", "user-agent": "HIVE-OS-Research-Collector/1.0" },
        lookup: (_hostname, _options, callback) => callback(null, address.address, address.family),
      },
      (response) => {
        const status = response.statusCode ?? 0;
        if ([301, 302, 303, 307, 308].includes(status) && response.headers.location) {
          response.resume();
          if (redirects >= REDIRECTS_MAX) return reject(new ResearchSandboxError("INVALID_INPUT", "Research source exceeded the redirect ceiling"));
          const redirected = new URL(response.headers.location, safeUrl);
          return void loadPublicTextSource(redirected, redirects + 1).then(resolve, reject);
        }
        if (status < 200 || status >= 300) {
          response.resume();
          return reject(new ResearchSandboxError("INVALID_INPUT", `Research source failed with HTTP ${status}`));
        }
        const mediaType = String(response.headers["content-type"] ?? "").split(";", 1)[0]!.toLowerCase();
        if (!new Set(["text/html", "text/plain", "application/xhtml+xml"]).has(mediaType)) {
          response.resume();
          return reject(new ResearchSandboxError("INVALID_INPUT", "Research source media type is not supported for exact-span capture"));
        }
        const chunks: Buffer[] = [];
        let bytes = 0;
        response.on("data", (chunk: Buffer) => {
          bytes += chunk.byteLength;
          if (bytes > SOURCE_BYTES_MAX) request.destroy(new ResearchSandboxError("INVALID_INPUT", "Research source exceeded the capture ceiling"));
          else chunks.push(chunk);
        });
        response.on("end", () => resolve({ body: Buffer.concat(chunks).toString("utf8"), mediaType, finalUrl: safeUrl }));
      },
    );
    request.setTimeout(SOURCE_TIMEOUT_MS, () => request.destroy(new ResearchSandboxError("INVALID_INPUT", "Research source timed out")));
    request.on("error", reject);
    request.end();
  });
}

async function resolvePublicAddresses(hostname: string): Promise<Array<{ address: string; family: 4 | 6 }>> {
  if (isIP(hostname)) {
    if (!isPublicIp(hostname)) throw new ResearchSandboxError("INVALID_INPUT", "Research source resolved to a private or reserved address");
    return [{ address: hostname, family: isIP(hostname) as 4 | 6 }];
  }
  const [v4, v6] = await Promise.all([resolve4(hostname).catch(() => []), resolve6(hostname).catch(() => [])]);
  const addresses = [
    ...v4.map((address) => ({ address, family: 4 as const })),
    ...v6.map((address) => ({ address, family: 6 as const })),
  ];
  if (!addresses.length || addresses.some(({ address }) => !isPublicIp(address))) {
    throw new ResearchSandboxError("INVALID_INPUT", "Research source DNS did not resolve exclusively to public addresses");
  }
  return addresses;
}

function isPublicIp(address: string): boolean {
  if (isIP(address) === 4) {
    const [a, b] = address.split(".").map(Number);
    return !(
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b! >= 64 && b! <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b! >= 16 && b! <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  if (isIP(address) === 6) {
    const value = address.toLowerCase();
    return !(value === "::" || value === "::1" || value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe8") || value.startsWith("fe9") || value.startsWith("fea") || value.startsWith("feb"));
  }
  return false;
}
