"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { importApprovedResearchBundle } from "@/modules/authoring";
import {
  assessMathPilotCase,
  requestMathPilotAgentReview,
  requestMathResearchCycle,
  MATH_REVIEW_CRITERIA,
  mathPilotRequestSchema,
  mathPilotScope,
  resolveMathPilotContract,
  requestComputationRun,
  requestResearchRun,
  reviewComputationRun,
  reviewResearchRun,
} from "@/modules/research-sandbox";
import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { getEnv } from "@/server/env";

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function requestResearchRunAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const language = formData.get("language") === "en" ? "en" : "vi";
  const question = String(
    formData.get("intent") ?? formData.get("question") ?? "",
  ).trim();
  const explicitScope = String(formData.get("scope") ?? "").trim();
  const requestedQueries = lines(formData.get("queries"));
  const ctx = await resolveWorkspaceContext(await headers(), slug);
  await requestResearchRun(ctx, {
    missionId: String(formData.get("missionId") ?? ""),
    documentId: String(formData.get("documentId") ?? "") || null,
    question,
    scope:
      explicitScope ||
      (language === "en"
        ? "Find, compare, and synthesize the evidence needed to complete the request. Prefer original sources and state uncertainty, conflicts, and missing evidence explicitly."
        : "Tìm, đối chiếu và tổng hợp bằng chứng cần thiết để hoàn thành yêu cầu. Ưu tiên nguồn gốc; nêu rõ điểm chưa chắc chắn, mâu thuẫn và bằng chứng còn thiếu."),
    providerName: String(formData.get("providerName") ?? "openai") || "openai",
    modelName: String(formData.get("modelName") ?? "gpt-5.6-sol") || "gpt-5.6-sol",
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
      languages: language === "en" ? ["en"] : ["vi", "en"],
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
  revalidatePath(`/w/${slug}/research/math-pilot`);
}

export async function reviewMathPilotResearchAction(formData: FormData) {
  return reviewResearchRunAction(formData);
}

export async function requestMathPilotCaseAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const caseType = String(formData.get("caseType") ?? "");
  const request = mathPilotRequestSchema.parse(caseType === "OPEN" ? {
    caseType,
    statement: String(formData.get("statement") ?? ""),
    definitions: String(formData.get("definitions") ?? ""),
    assumptions: String(formData.get("assumptions") ?? ""),
    falsificationCriterion: String(formData.get("falsificationCriterion") ?? ""),
    successCriterion: String(formData.get("successCriterion") ?? ""),
    exclusions: String(formData.get("exclusions") ?? ""),
  } : { caseType });
  const contract = resolveMathPilotContract(request);
  const ctx = await resolveWorkspaceContext(await headers(), slug);
  const useLocalCodex = getEnv().RESEARCH_CODEX_LOCAL_ENABLED;
  const outcome = await requestResearchRun(ctx, {
    missionId: String(formData.get("missionId") ?? ""),
    documentId: null,
    question: contract.statement,
    scope: mathPilotScope(contract),
    providerName: useLocalCodex ? "codex-local" : "openai",
    modelName: useLocalCodex ? "gpt-6-sol" : "gpt-5.6-sol",
    sourcePolicy: { allowedDomains: [], primaryDomains: [], requirePrimary: false, maxSources: 12 },
    queryPlan: { queries: [contract.statement], languages: ["en"] },
    mathPilot: request,
    idempotencyKey: String(formData.get("idempotencyKey") ?? ""),
  });
  revalidatePath(`/w/${slug}/research/math-pilot`);
  revalidatePath(`/w/${slug}/research`);
  if (outcome.status !== "SUCCEEDED") {
    redirect(`/w/${slug}/research/math-pilot?${new URLSearchParams({
      missionId: String(formData.get("missionId") ?? ""),
      request: "failed",
    }).toString()}`);
  }
}

export async function assessMathPilotCaseAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const ctx = await resolveWorkspaceContext(await headers(), slug);
  await assessMathPilotCase(ctx, {
    caseId: String(formData.get("caseId") ?? ""),
    conclusion: String(formData.get("conclusion") ?? ""),
    rationale: String(formData.get("rationale") ?? ""),
    verificationNotes: String(formData.get("verificationNotes") ?? ""),
    reviewChecklist: {
      version: 1,
      independentVerification: formData.get("independentVerification") === "on",
      checks: MATH_REVIEW_CRITERIA.map((criterion) => ({
        criterion,
        verdict: String(formData.get(`verdict:${criterion}`) ?? ""),
        note: String(formData.get(`note:${criterion}`) ?? ""),
      })),
    },
  });
  revalidatePath(`/w/${slug}/research/math-pilot`);
  revalidatePath(`/w/${slug}/research`);
}

export async function requestMathPilotAgentReviewAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const ctx = await resolveWorkspaceContext(await headers(), slug);
  await requestMathPilotAgentReview(ctx, String(formData.get("caseId") ?? ""));
  revalidatePath(`/w/${slug}/research/math-pilot`);
}

export async function requestMathResearchCycleAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const ctx = await resolveWorkspaceContext(await headers(), slug);
  await requestMathResearchCycle(ctx, {
    caseId: String(formData.get("caseId") ?? ""),
    maxRounds: Number(formData.get("maxRounds") ?? 1),
    maxObservedTokens: Number(formData.get("maxObservedTokens") ?? 60_000),
    ...(formData.has("steeringFocus") ? { steering: {
      focus: String(formData.get("steeringFocus")) as "STRUCTURAL_LEMMA" | "FINITE_FALSIFICATION",
      targetA: Number(formData.get("targetA")),
      note: String(formData.get("steeringNote") ?? ""),
      confirmed: formData.get("confirmSteering") === "on",
      ...(String(formData.get("replayPrime") ?? "").trim() || String(formData.get("replayFailedThroughA") ?? "").trim()
        ? { replayCandidate: { prime: Number(formData.get("replayPrime")),
          failedThroughA: Number(formData.get("replayFailedThroughA")) } } : {}),
    } } : {}),
  });
  revalidatePath(`/w/${slug}/research/math-pilot`);
}

export async function importApprovedResearchBundleAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const ctx = await resolveWorkspaceContext(await headers(), slug);
  const result = await importApprovedResearchBundle(ctx, {
    runId: String(formData.get("runId") ?? ""),
    documentId: String(formData.get("documentId") ?? ""),
    locale: String(formData.get("locale") ?? "vi"),
  });
  revalidatePath(`/w/${slug}/research`);
  revalidatePath(`/w/${slug}/authoring/${result.documentId}`);
  redirect(
    `/w/${slug}/authoring/${result.documentId}?researchImport=${result.alreadyImported ? "existing" : "created"}`,
  );
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
