import { describe, expect, it } from "vitest";

import {
  loadPublicTextSource,
  OpenAIResearchProvider,
} from "@/modules/research-sandbox/adapters/openai-research";
import { parseDockerRuntimeRegistry } from "@/modules/research-sandbox/adapters/runtime-registry";

const consultedUrl = "https://authority.example/protocol";

function apiResponse(plan: unknown, includeSource = true) {
  return new Response(JSON.stringify({
    id: "resp_test",
    status: "completed",
    output: [
      ...(includeSource ? [{ type: "web_search_call", action: { type: "search", sources: [{ url: consultedUrl }] } }] : []),
      { type: "message", content: [{ type: "output_text", text: JSON.stringify(plan), annotations: [] }] },
    ],
  }), { status: 200, headers: { "content-type": "application/json" } });
}

const request = {
  missionId: "mission-1",
  documentId: null,
  question: "What evidence is required?",
  scope: "Official protocols.",
  providerName: "openai",
  modelName: "gpt-5.6-sol",
  sourcePolicy: { allowedDomains: ["authority.example"], primaryDomains: ["authority.example"], requirePrimary: true, maxSources: 5 },
  queryPlan: { queries: ["inspection evidence protocol"], languages: ["en" as const] },
};

describe("TIP-024C research adapter", () => {
  it("accepts only a tool-consulted URL and rebinds the quote to retained content", async () => {
    const provider = new OpenAIResearchProvider({
      apiKey: "test-only",
      modelName: request.modelName,
      apiFetch: async () => apiResponse({
        sources: [{ url: consultedUrl, title: "Protocol", publisher: "Authority", sourceClass: "PRIMARY" }],
        findings: [{ key: "f1", kind: "SUPPORTING", claim: "Logs are required.", sourceUrl: consultedUrl, exactExcerpt: "retained field log", confidence: 0.95 }],
      }),
      sourceLoader: async (url) => ({ body: "<p>The protocol requires a retained   field log.</p>", mediaType: "text/html", finalUrl: url }),
    });
    const result = await provider.execute(request);
    expect(result.sources[0]?.contentDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(result.findings[0]).toMatchObject({ exactExcerpt: "retained field log", startOffset: 24, endOffset: 42 });
  });

  it("does not retrieve a model-invented URL absent from web tool provenance", async () => {
    let retrievals = 0;
    const provider = new OpenAIResearchProvider({
      apiKey: "test-only",
      modelName: request.modelName,
      apiFetch: async () => apiResponse({
        sources: [{ url: consultedUrl, title: "Protocol", publisher: "Authority", sourceClass: "PRIMARY" }],
        findings: [{ key: "f1", kind: "SUPPORTING", claim: "Invented", sourceUrl: consultedUrl, exactExcerpt: "invented", confidence: 1 }],
      }, false),
      sourceLoader: async (url) => { retrievals += 1; return { body: "invented", mediaType: "text/plain", finalUrl: url }; },
    });
    const result = await provider.execute({ ...request, sourcePolicy: { ...request.sourcePolicy, requirePrimary: false } });
    expect(retrievals).toBe(0);
    expect(result.findings).toEqual([expect.objectContaining({ kind: "HONEST_NULL", sourceKey: null })]);
  });

  it("rejects loopback sources before an HTTP connection is attempted", async () => {
    await expect(loadPublicTextSource(new URL("https://127.0.0.1/private"))).rejects.toThrow(/private|reserved/i);
  });
});

describe("TIP-024C runtime registry", () => {
  it("accepts only unique digest-pinned runtime identities", () => {
    const image = `registry.example/sympy@sha256:${"a".repeat(64)}`;
    expect(parseDockerRuntimeRegistry(JSON.stringify([{ runtimeId: "sympy", runtimeVersion: "1.14", kind: "CAS", image }]))).toHaveLength(1);
    expect(() => parseDockerRuntimeRegistry(JSON.stringify([{ runtimeId: "sympy", runtimeVersion: "1.14", kind: "CAS", image: "sympy:latest" }]))).toThrow(/digest-pinned/i);
  });
});
