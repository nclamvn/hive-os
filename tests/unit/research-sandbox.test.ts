import { describe, expect, it } from "vitest";

import {
  sha256,
  validateResearchProviderResult,
  validateSandboxExecutorResult,
} from "@/modules/research-sandbox/integrity";
import type { ResearchProviderResult } from "@/modules/research-sandbox/contracts";

const content = "Primary record confirms a bounded result.";

function researchResult(): ResearchProviderResult {
  return {
    providerName: "manual-research",
    modelName: "research-v1",
    sources: [{
      key: "s1",
      canonicalUri: "https://official.example/report",
      title: "Official report",
      publisher: "Authority",
      mediaType: "text/plain",
      content,
      contentDigest: sha256(content),
      sourceClass: "PRIMARY" as const,
      capturedAt: new Date("2026-08-05T00:00:00.000Z"),
    }],
    findings: [{
      key: "f1",
      kind: "SUPPORTING" as const,
      claim: "A bounded result is confirmed.",
      sourceKey: "s1",
      exactExcerpt: "bounded result",
      startOffset: content.indexOf("bounded result"),
      endOffset: content.indexOf("bounded result") + "bounded result".length,
      confidence: 0.9,
    }],
  };
}

const expectedResearch = {
  providerName: "manual-research",
  modelName: "research-v1",
  sourcePolicy: {
    allowedDomains: ["official.example"],
    primaryDomains: ["official.example"],
    requirePrimary: true,
    maxSources: 5,
  },
};

describe("TIP-024B adversarial bites", () => {
  it("accepts a digest-bound primary source and exact span", () => {
    const result = validateResearchProviderResult(researchResult(), expectedResearch);
    expect(result.provenances).toEqual(["VERIFIED_PRIMARY"]);
  });

  it("rejects a source whose retained digest does not match", () => {
    const result = researchResult();
    result.sources[0].contentDigest = "0".repeat(64);
    expect(() => validateResearchProviderResult(result, expectedResearch)).toThrow(/digest/i);
  });

  it("rejects a fabricated excerpt even when the URI is allowed", () => {
    const result = researchResult();
    result.findings[0].exactExcerpt = "invented result";
    expect(() => validateResearchProviderResult(result, expectedResearch)).toThrow(/excerpt/i);
  });

  it("retains honest-null only when it has no fabricated source span", () => {
    const result = researchResult();
    result.findings = [{ key: "null-1", kind: "HONEST_NULL", claim: "No reliable value was found.", sourceKey: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0 }];
    expect(validateResearchProviderResult(result, expectedResearch).findings[0].kind).toBe("HONEST_NULL");
    result.findings[0].sourceKey = "s1";
    expect(() => validateResearchProviderResult(result, expectedResearch)).toThrow(/Honest-null/i);
  });

  it("rejects sandbox output body tampering, resource overruns and forbidden network", () => {
    const outputBody = Buffer.from("computed output");
    const base = {
      runtimeId: "jupyter-python",
      runtimeVersion: "3.12",
      outputReference: "artifact://out",
      outputDigest: sha256(outputBody),
      outputMediaType: "application/json",
      outputBody,
      outputBytes: outputBody.byteLength,
      cpuMillis: 100,
      wallSeconds: 1,
      peakMemoryMb: 64,
      observedNetworkHosts: [] as string[],
      isolationAttestation: {
        engine: "docker" as const,
        imageReference: "example.invalid/runtime@sha256:" + "1".repeat(64),
        imageDigest: "sha256:" + "1".repeat(64),
        networkMode: "none" as const,
        readOnlyRootfs: true as const,
        noNewPrivileges: true as const,
        capDropAll: true as const,
        pidsLimit: 128,
        metricBasis: "ENFORCED_CEILING" as const,
      },
    };
    const expected = {
      runtimeId: "jupyter-python",
      runtimeVersion: "3.12",
      networkPolicy: "DENY_ALL" as const,
      networkAllowlist: [],
      resourceLimits: { maxCpuMillis: 1_000, maxWallSeconds: 10, maxMemoryMb: 128, maxOutputBytes: 1_024 },
    };
    expect(validateSandboxExecutorResult(base, expected).outputDigest).toBe(base.outputDigest);
    expect(() => validateSandboxExecutorResult({ ...base, outputBody: Buffer.from("tampered") }, expected)).toThrow(/digest|byte count/i);
    expect(() => validateSandboxExecutorResult({ ...base, cpuMillis: 2_000 }, expected)).toThrow(/ceiling/i);
    expect(() => validateSandboxExecutorResult({ ...base, observedNetworkHosts: ["example.com"] }, expected)).toThrow(/network/i);
  });
});
