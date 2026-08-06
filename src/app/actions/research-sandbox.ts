"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import {
  requestComputationRun,
  requestResearchRun,
  reviewComputationRun,
  reviewResearchRun,
} from "@/modules/research-sandbox";
import { resolveWorkspaceContext } from "@/modules/identity-workspace";

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function requestResearchRunAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const question = String(formData.get("question") ?? "").trim();
  const requestedQueries = lines(formData.get("queries"));
  const ctx = await resolveWorkspaceContext(await headers(), slug);
  await requestResearchRun(ctx, {
    missionId: String(formData.get("missionId") ?? ""),
    documentId: String(formData.get("documentId") ?? "") || null,
    question,
    scope: String(formData.get("scope") ?? ""),
    providerName: String(formData.get("providerName") ?? ""),
    modelName: String(formData.get("modelName") ?? ""),
    sourcePolicy: {
      allowedDomains: lines(formData.get("allowedDomains")),
      primaryDomains: lines(formData.get("primaryDomains")),
      requirePrimary: formData.get("requirePrimary") === "on",
      maxSources: Number(formData.get("maxSources") ?? 20),
    },
    queryPlan: {
      // The guided path uses the bounded research question as its first query.
      // Operators can still supply an explicit plan in advanced controls.
      queries: requestedQueries.length ? requestedQueries : [question],
      languages: formData.get("language") === "en" ? ["en"] : ["vi", "en"],
    },
    idempotencyKey: String(formData.get("idempotencyKey") ?? ""),
  });
  revalidatePath(`/w/${slug}/research`);
}

export async function reviewResearchRunAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const runId = String(formData.get("runId") ?? "");
  const findingIds = formData.getAll("findingId").map(String);
  const ctx = await resolveWorkspaceContext(await headers(), slug);
  await reviewResearchRun(ctx, {
    runId,
    decision: String(formData.get("runDecision") ?? "REJECTED"),
    rationale: String(formData.get("runRationale") ?? ""),
    findings: findingIds.map((findingId) => ({
      findingId,
      decision: String(formData.get(`decision:${findingId}`) ?? "FLAGGED"),
      rationale: String(formData.get(`rationale:${findingId}`) ?? ""),
    })),
  });
  revalidatePath(`/w/${slug}/research`);
}

export async function requestComputationRunAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const ctx = await resolveWorkspaceContext(await headers(), slug);
  await requestComputationRun(ctx, {
    missionId: String(formData.get("missionId") ?? ""),
    documentId: String(formData.get("documentId") ?? "") || null,
    researchRunId: String(formData.get("researchRunId") ?? "") || null,
    kind: String(formData.get("kind") ?? "JUPYTER"),
    runtimeId: String(formData.get("runtimeId") ?? ""),
    runtimeVersion: String(formData.get("runtimeVersion") ?? ""),
    entrypoint: String(formData.get("entrypoint") ?? ""),
    networkPolicy: "DENY_ALL",
    networkAllowlist: [],
    resourceLimits: {
      maxCpuMillis: Number(formData.get("maxCpuMillis") ?? 120000),
      maxWallSeconds: Number(formData.get("maxWallSeconds") ?? 300),
      maxMemoryMb: Number(formData.get("maxMemoryMb") ?? 1024),
      maxOutputBytes: Number(formData.get("maxOutputBytes") ?? 10000000),
    },
    inputReference: String(formData.get("inputReference") ?? ""),
    inputDigest: String(formData.get("inputDigest") ?? ""),
    idempotencyKey: String(formData.get("idempotencyKey") ?? ""),
  });
  revalidatePath(`/w/${slug}/research`);
}

export async function reviewComputationRunAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const ctx = await resolveWorkspaceContext(await headers(), slug);
  await reviewComputationRun(ctx, {
    runId: String(formData.get("runId") ?? ""),
    decision: String(formData.get("decision") ?? "REJECTED"),
    rationale: String(formData.get("rationale") ?? ""),
  });
  revalidatePath(`/w/${slug}/research`);
}
