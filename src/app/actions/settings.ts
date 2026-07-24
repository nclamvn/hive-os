"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import type {
  AssuranceProfile,
  ProviderPolicyMode,
  PublicReleasePolicy,
} from "@prisma/client";

import {
  ForbiddenError,
  InvariantError,
  NotFoundError,
  resolveWorkspaceContext,
  UnauthenticatedError,
  updateWorkspacePolicy,
} from "@/modules/identity-workspace";

export interface SettingsActionResult {
  ok: boolean;
  error?: string;
}

const ASSURANCE: readonly AssuranceProfile[] = [
  "QUICK",
  "PROFESSIONAL",
  "RESEARCH",
  "REGULATED",
];
const PROVIDER_MODES: readonly ProviderPolicyMode[] = [
  "OPEN_MANUAL",
  "ALLOWLIST_MANUAL",
];
const RELEASE_POLICIES: readonly PublicReleasePolicy[] = [
  "INTERNAL_ONLY",
  "GOVERNED_PUBLIC",
];

function text(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}

function integer(data: FormData, key: string) {
  return Number.parseInt(text(data, key), 10);
}

function providers(data: FormData) {
  return text(data, "allowedProviders")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [providerName, models = ""] = line.split("|", 2);
      return {
        providerName: providerName.trim(),
        modelNames: models
          .split(",")
          .map((model) => model.trim())
          .filter(Boolean),
      };
    });
}

function message(error: unknown) {
  if (
    error instanceof ForbiddenError ||
    error instanceof InvariantError ||
    error instanceof NotFoundError ||
    error instanceof UnauthenticatedError
  ) {
    return `${error.code}: ${error.message}`;
  }
  throw error;
}

export async function updateWorkspacePolicyAction(
  slug: string,
  data: FormData,
): Promise<SettingsActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    const assurance = text(data, "defaultAssuranceProfile") as AssuranceProfile;
    const providerMode = text(data, "providerPolicyMode") as ProviderPolicyMode;
    const releasePolicy = text(
      data,
      "publicReleasePolicy",
    ) as PublicReleasePolicy;
    if (
      !ASSURANCE.includes(assurance) ||
      !PROVIDER_MODES.includes(providerMode) ||
      !RELEASE_POLICIES.includes(releasePolicy)
    ) {
      throw new InvariantError(
        "Workspace policy selection is invalid",
        "WORKSPACE_POLICY_INVALID",
      );
    }

    await updateWorkspacePolicy(ctx, {
      defaultAssuranceProfile: assurance,
      providerPolicyMode: providerMode,
      allowedProviders: providers(data),
      artifactRetentionDays: integer(data, "artifactRetentionDays"),
      evidenceRetentionDays: integer(data, "evidenceRetentionDays"),
      auditRetentionDays: integer(data, "auditRetentionDays"),
      publicReleasePolicy: releasePolicy,
    });
    revalidatePath(`/w/${slug}/settings`);
    revalidatePath(`/w/${slug}/missions/new`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}
