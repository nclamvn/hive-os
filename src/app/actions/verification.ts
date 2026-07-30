"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { MissionError, transitionMission } from "@/modules/mission-kernel";
import {
  authorizeGovernedRelease,
  beginVerificationRun,
  completeVerificationRun,
  createVerificationScenario,
  recordGovernanceSignoff,
  VerificationGovernanceError,
  VerificationGovernanceErrorCode,
  type CompleteVerificationInput,
} from "@/modules/verification-governance";

export interface VerificationActionResult {
  ok: boolean;
  error?: string;
  errorCode?: string;
}

function text(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}

function lines(data: FormData, key: string) {
  return text(data, key)
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);
}

function failure(error: unknown): VerificationActionResult {
  if (
    error instanceof VerificationGovernanceError ||
    error instanceof MissionError
  ) {
    return { ok: false, errorCode: error.code, error: error.message };
  }
  if (error instanceof Error && "code" in error) {
    return {
      ok: false,
      errorCode: String(error.code),
      error: error.message,
    };
  }
  throw error;
}

function parseReport(data: FormData): CompleteVerificationInput {
  try {
    return JSON.parse(text(data, "report")) as CompleteVerificationInput;
  } catch {
    throw new VerificationGovernanceError(
      VerificationGovernanceErrorCode.InvalidReport,
      "Verify Report must be valid JSON",
    );
  }
}

async function run(
  slug: string,
  operation: (
    ctx: Awaited<ReturnType<typeof resolveWorkspaceContext>>,
  ) => Promise<unknown>,
): Promise<VerificationActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await operation(ctx);
    for (const path of [
      `/w/${slug}/verification`,
      `/w/${slug}/missions`,
      `/w/${slug}/reports`,
      `/w/${slug}/observatory`,
      `/w/${slug}`,
    ]) {
      revalidatePath(path);
    }
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function createVerificationScenarioAction(
  slug: string,
  data: FormData,
): Promise<VerificationActionResult> {
  const requirementId = text(data, "requirementId");
  return run(slug, (ctx) =>
    createVerificationScenario(ctx, text(data, "missionId"), {
      code: text(data, "code"),
      title: text(data, "title"),
      kind: text(data, "kind") as
        | "REQUIREMENT"
        | "FUNCTIONAL"
        | "SECURITY"
        | "ACCESSIBILITY"
        | "PERFORMANCE"
        | "OTHER",
      method: text(data, "method"),
      expectedOutcome: text(data, "expectedOutcome"),
      required: data.get("required") === "on",
      ...(requirementId ? { requirementId } : {}),
    }),
  );
}

export async function beginVerificationRunAction(
  slug: string,
  data: FormData,
): Promise<VerificationActionResult> {
  return run(slug, (ctx) =>
    beginVerificationRun(
      ctx,
      text(data, "missionId"),
      text(data, "verifierAgentRunId"),
    ),
  );
}

export async function completeVerificationRunAction(
  slug: string,
  data: FormData,
): Promise<VerificationActionResult> {
  return run(slug, (ctx) =>
    completeVerificationRun(
      ctx,
      text(data, "verificationRunId"),
      parseReport(data),
    ),
  );
}

export async function recordGovernanceSignoffAction(
  slug: string,
  data: FormData,
): Promise<VerificationActionResult> {
  const signoffType = text(data, "signoffType");
  const decision = text(data, "decision");
  return run(slug, (ctx) =>
    ["VERIFICATION", "RELEASE"].includes(signoffType) &&
    ["APPROVED", "REJECTED"].includes(decision)
      ? recordGovernanceSignoff(ctx, text(data, "verificationReportId"), {
          signoffType: signoffType as "VERIFICATION" | "RELEASE",
          decision: decision as "APPROVED" | "REJECTED",
          rationale: text(data, "rationale"),
        })
      : Promise.reject(
          new VerificationGovernanceError(
            VerificationGovernanceErrorCode.InvalidInput,
            "Governance sign-off type or decision is invalid",
          ),
        ),
  );
}

export async function moveMissionToReviewAction(
  slug: string,
  data: FormData,
): Promise<VerificationActionResult> {
  return run(slug, (ctx) =>
    transitionMission(ctx, text(data, "missionId"), "REVIEW", {
      reason: text(data, "reason"),
    }),
  );
}

export async function authorizeGovernedReleaseAction(
  slug: string,
  data: FormData,
): Promise<VerificationActionResult> {
  return run(slug, (ctx) =>
    authorizeGovernedRelease(ctx, text(data, "missionId"), {
      verificationReportId: text(data, "verificationReportId"),
      visibility: text(data, "visibility") as "INTERNAL" | "PUBLIC",
      claimVersionIds: lines(data, "claimVersionIds"),
      methods: lines(data, "methods"),
      limitations: lines(data, "limitations"),
    }),
  );
}

export async function releaseMissionAction(
  slug: string,
  data: FormData,
): Promise<VerificationActionResult> {
  return run(slug, (ctx) =>
    transitionMission(ctx, text(data, "missionId"), "RELEASED", {
      reason: text(data, "reason"),
    }),
  );
}
