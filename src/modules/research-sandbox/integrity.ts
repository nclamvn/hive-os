import { createHash } from "node:crypto";

import { canonicalJson } from "@/modules/execution-fabric/contracts";

import {
  researchProviderResultSchema,
  resourceLimitsSchema,
  sandboxExecutorResultSchema,
  sourcePolicySchema,
  type ResearchProviderResult,
  type SandboxExecutorResult,
} from "./contracts";
import { ResearchSandboxError } from "./errors";

export function sha256(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

function hostMatches(host: string, rule: string) {
  const normalized = rule.toLowerCase().replace(/^\*\./, "");
  return host === normalized || host.endsWith(`.${normalized}`);
}

export function validateResearchProviderResult(
  raw: unknown,
  expected: { providerName: string; modelName: string; sourcePolicy: unknown },
): ResearchProviderResult & { provenances: Array<"VERIFIED_PRIMARY" | "CLAIM" | "FLAGGED"> } {
  const parsed = researchProviderResultSchema.safeParse(raw);
  if (!parsed.success) throw new ResearchSandboxError("INVALID_INPUT", "Research provider returned an invalid contract");
  if (parsed.data.providerName !== expected.providerName || parsed.data.modelName !== expected.modelName) {
    throw new ResearchSandboxError("PROVIDER_MISMATCH", "Research provider identity does not match the governed request");
  }
  const policy = sourcePolicySchema.parse(expected.sourcePolicy);
  if (parsed.data.sources.length > policy.maxSources) {
    throw new ResearchSandboxError("INVALID_INPUT", "Research provider exceeded the source ceiling");
  }
  const sourceKeys = new Set<string>();
  const provenances: Array<"VERIFIED_PRIMARY" | "CLAIM" | "FLAGGED"> = [];
  for (const source of parsed.data.sources) {
    if (sourceKeys.has(source.key)) throw new ResearchSandboxError("INVALID_INPUT", "Research source keys must be unique");
    sourceKeys.add(source.key);
    if (sha256(source.content) !== source.contentDigest) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Captured source digest does not match its content");
    }
    const host = new URL(source.canonicalUri).hostname.toLowerCase();
    const allowed = !policy.allowedDomains.length || policy.allowedDomains.some((rule) => hostMatches(host, rule));
    if (!allowed) throw new ResearchSandboxError("INVALID_INPUT", "Captured source is outside the allowed domain boundary");
    const deterministicPrimary =
      source.sourceClass === "PRIMARY" && policy.primaryDomains.some((rule) => hostMatches(host, rule));
    provenances.push(deterministicPrimary ? "VERIFIED_PRIMARY" : source.sourceClass === "UNKNOWN" ? "FLAGGED" : "CLAIM");
  }
  if (policy.requirePrimary && !provenances.includes("VERIFIED_PRIMARY")) {
    throw new ResearchSandboxError("INVALID_INPUT", "Source policy requires at least one deterministic primary source");
  }
  const findingKeys = new Set<string>();
  const byKey = new Map(parsed.data.sources.map((source) => [source.key, source]));
  for (const finding of parsed.data.findings) {
    if (findingKeys.has(finding.key)) throw new ResearchSandboxError("INVALID_INPUT", "Research finding keys must be unique");
    findingKeys.add(finding.key);
    if (finding.kind === "HONEST_NULL") {
      if (finding.sourceKey !== null || finding.startOffset !== null || finding.endOffset !== null || finding.exactExcerpt !== "") {
        throw new ResearchSandboxError("INTEGRITY_FAILURE", "Honest-null findings cannot fabricate a source span");
      }
      continue;
    }
    const source = finding.sourceKey ? byKey.get(finding.sourceKey) : undefined;
    if (!source || finding.startOffset === null || finding.endOffset === null) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Evidence findings require a captured source and exact offsets");
    }
    if (source.content.slice(finding.startOffset, finding.endOffset) !== finding.exactExcerpt) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Finding excerpt does not match the captured source span");
    }
  }
  return { ...parsed.data, provenances };
}

export function validateSandboxExecutorResult(
  raw: unknown,
  expected: {
    runtimeId: string;
    runtimeVersion: string;
    networkPolicy: "DENY_ALL" | "ALLOWLIST";
    networkAllowlist: string[];
    resourceLimits: unknown;
  },
): SandboxExecutorResult {
  const parsed = sandboxExecutorResultSchema.safeParse(raw);
  if (!parsed.success) throw new ResearchSandboxError("INVALID_INPUT", "Sandbox returned an invalid output manifest");
  if (parsed.data.runtimeId !== expected.runtimeId || parsed.data.runtimeVersion !== expected.runtimeVersion) {
    throw new ResearchSandboxError("PROVIDER_MISMATCH", "Sandbox runtime identity does not match the governed request");
  }
  const limits = resourceLimitsSchema.parse(expected.resourceLimits);
  if (parsed.data.outputBody.byteLength !== parsed.data.outputBytes || sha256(parsed.data.outputBody) !== parsed.data.outputDigest) {
    throw new ResearchSandboxError("INTEGRITY_FAILURE", "Sandbox output digest or byte count does not match the returned body");
  }
  if (
    parsed.data.outputBytes > limits.maxOutputBytes ||
    parsed.data.cpuMillis > limits.maxCpuMillis ||
    parsed.data.wallSeconds > limits.maxWallSeconds ||
    parsed.data.peakMemoryMb > limits.maxMemoryMb
  ) {
    throw new ResearchSandboxError("SANDBOX_LIMIT_EXCEEDED", "Sandbox output exceeded a governed resource ceiling");
  }
  if (expected.networkPolicy === "DENY_ALL" && parsed.data.observedNetworkHosts.length) {
    throw new ResearchSandboxError("INTEGRITY_FAILURE", "Sandbox observed network access under DENY_ALL policy");
  }
  if (
    expected.networkPolicy === "DENY_ALL" &&
    (parsed.data.isolationAttestation.networkMode !== "none" ||
      !parsed.data.isolationAttestation.readOnlyRootfs ||
      !parsed.data.isolationAttestation.noNewPrivileges ||
      !parsed.data.isolationAttestation.capDropAll)
  ) {
    throw new ResearchSandboxError("INTEGRITY_FAILURE", "Sandbox isolation attestation does not satisfy DENY_ALL policy");
  }
  if (expected.networkPolicy === "ALLOWLIST") {
    const allowed = new Set(expected.networkAllowlist.map((host) => host.toLowerCase()));
    if (parsed.data.observedNetworkHosts.some((host) => !allowed.has(host.toLowerCase()))) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Sandbox contacted a host outside its network allowlist");
    }
  }
  return parsed.data;
}

export function digestResearchResult(value: unknown): string {
  return sha256(canonicalJson(value));
}
