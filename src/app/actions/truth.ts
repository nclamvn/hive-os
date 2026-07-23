"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import type { AccessLevel, EvidenceRelation } from "@prisma/client";

import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import {
  addClaimVersion,
  assertHonestNull,
  captureSnapshot,
  createClaim,
  createEvidenceSource,
  createEvidenceSpanFromQuote,
  reviewClaim,
  TruthError,
} from "@/modules/truth-kernel";

export interface TruthActionResult {
  ok: boolean;
  error?: string;
}

const ACCESS_LEVELS: readonly AccessLevel[] = [
  "PUBLIC",
  "WORKSPACE",
  "RESTRICTED",
];

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function accessLevel(formData: FormData): AccessLevel {
  const value = text(formData, "accessLevel") as AccessLevel;
  return ACCESS_LEVELS.includes(value) ? value : "WORKSPACE";
}

function message(error: unknown): string {
  if (error instanceof TruthError) return `${error.code}: ${error.message}`;
  if (error instanceof Error && "code" in error) return error.message;
  throw error;
}

function refresh(slug: string) {
  revalidatePath(`/w/${slug}/evidence`);
  revalidatePath(`/w/${slug}/claims`);
}

async function run(
  slug: string,
  operation: (
    ctx: Awaited<ReturnType<typeof resolveWorkspaceContext>>,
  ) => Promise<unknown>,
): Promise<TruthActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await operation(ctx);
    refresh(slug);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

export async function createEvidenceSourceAction(
  slug: string,
  formData: FormData,
): Promise<TruthActionResult> {
  return run(slug, (ctx) =>
    createEvidenceSource(ctx, text(formData, "missionId"), {
      title: text(formData, "title"),
      canonicalUri: text(formData, "canonicalUri"),
      publisher: text(formData, "publisher") || undefined,
      sourceType: text(formData, "sourceType") || "document",
      independenceKey: text(formData, "independenceKey"),
      qualifiesForCorroboration:
        formData.get("qualifiesForCorroboration") === "on",
      accessLevel: accessLevel(formData),
    }),
  );
}

export async function captureSnapshotAction(
  slug: string,
  formData: FormData,
): Promise<TruthActionResult> {
  return run(slug, (ctx) =>
    captureSnapshot(ctx, text(formData, "sourceId"), {
      content: String(formData.get("content") ?? ""),
      capturedAt: new Date(),
      mediaType: text(formData, "mediaType") || "text/plain",
    }),
  );
}

export async function createEvidenceSpanAction(
  slug: string,
  formData: FormData,
): Promise<TruthActionResult> {
  return run(slug, async (ctx) => {
    const snapshotId = text(formData, "snapshotId");
    const exactText = String(formData.get("exactText") ?? "");
    return createEvidenceSpanFromQuote(ctx, snapshotId, {
      exactText,
      extractionLabel: text(formData, "extractionLabel") || undefined,
    });
  });
}

function evidence(formData: FormData) {
  const spanId = text(formData, "spanId");
  if (!spanId) return undefined;
  const relationInput = text(formData, "relation") as EvidenceRelation;
  const relation: EvidenceRelation = ["SUPPORTS", "CONTRADICTS"].includes(
    relationInput,
  )
    ? relationInput
    : "SUPPORTS";
  return [{ spanId, relation }];
}

export async function createClaimAction(
  slug: string,
  formData: FormData,
): Promise<TruthActionResult> {
  return run(slug, (ctx) =>
    createClaim(ctx, text(formData, "missionId"), {
      claimKey: text(formData, "claimKey"),
      statement: text(formData, "statement"),
      normalizedValue: text(formData, "normalizedValue") || undefined,
      falsificationCriterion:
        text(formData, "falsificationCriterion") || undefined,
      hypothesis: formData.get("hypothesis") === "on",
      internalOwnerMembershipId: ctx.membership.id,
      reviewCadenceDays:
        Number.parseInt(text(formData, "reviewCadenceDays"), 10) || undefined,
      accessLevel: accessLevel(formData),
      evidence: evidence(formData),
    }),
  );
}

export async function addClaimVersionAction(
  slug: string,
  claimId: string,
  formData: FormData,
): Promise<TruthActionResult> {
  return run(slug, (ctx) =>
    addClaimVersion(ctx, claimId, {
      statement: text(formData, "statement"),
      normalizedValue: text(formData, "normalizedValue") || undefined,
      falsificationCriterion:
        text(formData, "falsificationCriterion") || undefined,
      accessLevel: accessLevel(formData),
      evidence: evidence(formData),
    }),
  );
}

export async function reviewClaimAction(
  slug: string,
  claimId: string,
  formData: FormData,
): Promise<TruthActionResult> {
  return run(slug, (ctx) =>
    reviewClaim(ctx, claimId, {
      reason: text(formData, "reason"),
      accessLevel: accessLevel(formData),
      reviewCadenceDays:
        Number.parseInt(text(formData, "reviewCadenceDays"), 10) || null,
      nextReviewAt: text(formData, "nextReviewAt")
        ? new Date(text(formData, "nextReviewAt"))
        : null,
    }),
  );
}

export async function assertHonestNullAction(
  slug: string,
  claimId: string,
  formData: FormData,
): Promise<TruthActionResult> {
  return run(slug, (ctx) =>
    assertHonestNull(ctx, claimId, {
      rationale: text(formData, "rationale"),
      searchCompleteness: "OPEN_INCOMPLETE",
    }),
  );
}
