import { createHash } from "node:crypto";

import type {
  AccessLevel,
  ClaimState,
  EvidenceRelation,
  Prisma,
  SearchCompleteness,
} from "@prisma/client";

import {
  AuditEventType,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { loadTruthMission, requireTruthCapability } from "./context";
import { TruthError, TruthErrorCode } from "./errors";
import {
  assertExactSpan,
  evaluateTruth,
  type AssertionEvidence,
} from "./rules";

function hash(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

const CLOSED_CLAIM_STATES: ReadonlySet<ClaimState> = new Set([
  "FALSIFIED",
  "RETRACTED",
  "HONEST_NULL",
]);

function assertClaimOpenForTruthChange(
  state: ClaimState,
  operation: string,
): void {
  if (CLOSED_CLAIM_STATES.has(state)) {
    throw new TruthError(
      TruthErrorCode.Invariant,
      `Cannot ${operation} a ${state} claim`,
    );
  }
}

async function loadClaim(ctx: WorkspaceContext, claimId: string) {
  const claim = await getDb().claim.findFirst({
    where: { id: claimId, workspaceId: ctx.workspace.id },
  });
  if (!claim) throw new TruthError(TruthErrorCode.NotFound, "Claim not found");
  return claim;
}

export async function createEvidenceSource(
  ctx: WorkspaceContext,
  missionId: string,
  input: {
    title: string;
    canonicalUri: string;
    publisher?: string;
    sourceType: string;
    independenceKey: string;
    qualifiesForCorroboration?: boolean;
    accessLevel?: AccessLevel;
  },
) {
  requireTruthCapability(ctx, "truth.write");
  await loadTruthMission(ctx, missionId);
  if (!input.independenceKey.trim()) {
    throw new TruthError(TruthErrorCode.Invariant, "Independence key is required");
  }
  return getDb().$transaction(async (tx) => {
    const source = await tx.evidenceSource.create({
      data: {
        workspaceId: ctx.workspace.id,
        missionId,
        title: input.title,
        canonicalUri: input.canonicalUri,
        publisher: input.publisher ?? null,
        sourceType: input.sourceType,
        independenceKey: input.independenceKey,
        qualifiesForCorroboration: input.qualifiesForCorroboration ?? false,
        accessLevel: input.accessLevel ?? "WORKSPACE",
        createdByMembershipId: ctx.membership.id,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.EvidenceSourceCreated,
      entityType: "EvidenceSource",
      entityId: source.id,
      correlationId: ctx.correlationId,
      payload: { title: source.title, sourceType: source.sourceType },
    });
    return source;
  });
}

export async function captureSnapshot(
  ctx: WorkspaceContext,
  sourceId: string,
  input: {
    content: string;
    capturedAt: Date;
    mediaType?: string;
    storageReference?: string;
  },
) {
  requireTruthCapability(ctx, "truth.write");
  const source = await getDb().evidenceSource.findFirst({
    where: { id: sourceId, workspaceId: ctx.workspace.id },
  });
  if (!source) throw new TruthError(TruthErrorCode.NotFound, "Evidence source not found");
  if (!input.content.length) {
    throw new TruthError(TruthErrorCode.Invariant, "Snapshot content is required");
  }
  const contentHash = hash(input.content);
  return getDb().$transaction(async (tx) => {
    const snapshot = await tx.snapshot.create({
      data: {
        workspaceId: ctx.workspace.id,
        missionId: source.missionId,
        evidenceSourceId: source.id,
        content: input.content,
        contentHash,
        mediaType: input.mediaType ?? "text/plain",
        storageReference: input.storageReference ?? null,
        capturedAt: input.capturedAt,
        createdByMembershipId: ctx.membership.id,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.EvidenceSnapshotCaptured,
      entityType: "Snapshot",
      entityId: snapshot.id,
      correlationId: ctx.correlationId,
      payload: { sourceId: source.id, digest: contentHash },
    });
    return snapshot;
  });
}

export async function createEvidenceSpan(
  ctx: WorkspaceContext,
  snapshotId: string,
  input: {
    startOffset: number;
    endOffset: number;
    exactText: string;
    extractionLabel?: string;
  },
) {
  requireTruthCapability(ctx, "truth.write");
  const snapshot = await getDb().snapshot.findFirst({
    where: { id: snapshotId, workspaceId: ctx.workspace.id },
  });
  if (!snapshot) throw new TruthError(TruthErrorCode.NotFound, "Snapshot not found");
  if (
    !assertExactSpan(
      snapshot.content,
      input.startOffset,
      input.endOffset,
      input.exactText,
    )
  ) {
    throw new TruthError(
      TruthErrorCode.SpanMismatch,
      "Evidence span does not exactly match immutable snapshot content",
    );
  }
  return getDb().$transaction(async (tx) => {
    const span = await tx.evidenceSpan.create({
      data: {
        workspaceId: ctx.workspace.id,
        missionId: snapshot.missionId,
        snapshotId,
        startOffset: input.startOffset,
        endOffset: input.endOffset,
        exactText: input.exactText,
        extractionLabel: input.extractionLabel ?? null,
        createdByMembershipId: ctx.membership.id,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.EvidenceSpanCreated,
      entityType: "EvidenceSpan",
      entityId: span.id,
      correlationId: ctx.correlationId,
      payload: {
        snapshotId,
        startOffset: span.startOffset,
        endOffset: span.endOffset,
      },
    });
    return span;
  });
}

interface VersionInput {
  statement: string;
  normalizedValue?: string;
  falsificationCriterion?: string;
  accessLevel?: AccessLevel;
  evidence?: Array<{ spanId: string; relation?: EvidenceRelation }>;
}

async function recomputeClaim(
  tx: Prisma.TransactionClient,
  ctx: WorkspaceContext,
  claimId: string,
  reason: string,
) {
  const claim = await tx.claim.findUniqueOrThrow({ where: { id: claimId } });
  if (["FALSIFIED", "RETRACTED", "HONEST_NULL"].includes(claim.state)) return claim;
  const versions = await tx.claimVersion.findMany({
    where: { claimId },
    include: {
      evidence: {
        include: {
          evidenceSpan: {
            include: { snapshot: { include: { evidenceSource: true } } },
          },
        },
      },
    },
  });
  const evaluation = evaluateTruth(
    versions.flatMap((version): AssertionEvidence[] =>
      version.evidence.length
        ? version.evidence.map((link) => ({
            normalizedValue: version.normalizedValue,
            relation: link.relation,
            independenceKey:
              link.evidenceSpan.snapshot.evidenceSource.independenceKey,
            qualifiesForCorroboration:
              link.evidenceSpan.snapshot.evidenceSource
                .qualifiesForCorroboration,
          }))
        : [{
            normalizedValue: version.normalizedValue,
            relation: null,
            independenceKey: null,
            qualifiesForCorroboration: false,
          }],
    ),
    versions.some((version) => Boolean(version.falsificationCriterion)),
  );
  if (evaluation.state === "DISPUTED") {
    const fingerprint = hash(
      versions
        .map((version) => version.normalizedValue ?? "")
        .sort()
        .join("\u0000"),
    );
    await tx.dispute.upsert({
      where: { claimId_fingerprint: { claimId, fingerprint } },
      update: {},
      create: {
        workspaceId: claim.workspaceId,
        missionId: claim.missionId,
        claimId,
        fingerprint,
        reason: "Conflicting retained values or contradictory evidence",
        createdByMembershipId: ctx.membership.id,
      },
    });
  }
  if (claim.state === evaluation.state) return claim;
  const updated = await tx.claim.update({
    where: { id: claimId },
    data: { state: evaluation.state, version: { increment: 1 } },
  });
  await writeAuditEvent(tx, {
    workspaceId: ctx.workspace.id,
    actorUserId: ctx.user.id,
    actorMembershipId: ctx.membership.id,
    eventType: AuditEventType.ClaimStateChanged,
    entityType: "Claim",
    entityId: claimId,
    correlationId: ctx.correlationId,
    payload: { from: claim.state, to: evaluation.state, reason },
  });
  return updated;
}

async function addVersionInTransaction(
  tx: Prisma.TransactionClient,
  ctx: WorkspaceContext,
  claim: { id: string; missionId: string },
  input: VersionInput,
) {
  const count = await tx.claimVersion.count({ where: { claimId: claim.id } });
  const links = input.evidence ?? [];
  const spans = links.length
    ? await tx.evidenceSpan.findMany({
        where: {
          id: { in: links.map((link) => link.spanId) },
          workspaceId: ctx.workspace.id,
          missionId: claim.missionId,
        },
      })
    : [];
  if (spans.length !== new Set(links.map((link) => link.spanId)).size) {
    throw new TruthError(
      TruthErrorCode.NotFound,
      "One or more evidence spans were not found in this mission",
    );
  }
  const version = await tx.claimVersion.create({
    data: {
      workspaceId: ctx.workspace.id,
      missionId: claim.missionId,
      claimId: claim.id,
      versionNumber: count + 1,
      statement: input.statement,
      normalizedValue: input.normalizedValue ?? null,
      falsificationCriterion: input.falsificationCriterion ?? null,
      accessLevel: input.accessLevel ?? "WORKSPACE",
      createdByMembershipId: ctx.membership.id,
    },
  });
  for (const link of links) {
    await tx.claimEvidence.create({
      data: {
        workspaceId: ctx.workspace.id,
        claimVersionId: version.id,
        evidenceSpanId: link.spanId,
        relation: link.relation ?? "SUPPORTS",
      },
    });
    await tx.provenanceEdge.create({
      data: {
        workspaceId: ctx.workspace.id,
        missionId: claim.missionId,
        fromKind: "EvidenceSpan",
        fromId: link.spanId,
        toKind: "ClaimVersion",
        toId: version.id,
        relation: link.relation ?? "SUPPORTS",
        createdByMembershipId: ctx.membership.id,
      },
    });
  }
  return version;
}

export async function createClaim(
  ctx: WorkspaceContext,
  missionId: string,
  input: VersionInput & {
    claimKey: string;
    hypothesis?: boolean;
    internalOwnerMembershipId?: string;
    reviewCadenceDays?: number;
    nextReviewAt?: Date;
  },
) {
  requireTruthCapability(ctx, "truth.write");
  await loadTruthMission(ctx, missionId);
  if (
    !(input.evidence?.length) &&
    !input.hypothesis &&
    !input.internalOwnerMembershipId
  ) {
    throw new TruthError(
      TruthErrorCode.Invariant,
      "A claim requires evidence, an internal owner, or explicit hypothesis status",
    );
  }
  if (input.hypothesis && !input.falsificationCriterion?.trim()) {
    throw new TruthError(
      TruthErrorCode.Invariant,
      "A hypothesis requires a falsification criterion",
    );
  }
  if (
    input.reviewCadenceDays !== undefined &&
    (!Number.isInteger(input.reviewCadenceDays) || input.reviewCadenceDays <= 0)
  ) {
    throw new TruthError(
      TruthErrorCode.Invariant,
      "Review cadence must be a positive integer",
    );
  }
  return getDb().$transaction(async (tx) => {
    if (input.internalOwnerMembershipId) {
      const internalOwner = await tx.membership.findFirst({
        where: {
          id: input.internalOwnerMembershipId,
          workspaceId: ctx.workspace.id,
          status: "ACTIVE",
        },
        select: { id: true },
      });
      if (!internalOwner) {
        throw new TruthError(
          TruthErrorCode.NotFound,
          "Internal claim owner not found",
        );
      }
    }
    const claim = await tx.claim.create({
      data: {
        workspaceId: ctx.workspace.id,
        missionId,
        claimKey: input.claimKey,
        state: input.hypothesis ? "HYPOTHESIS" : "DRAFT",
        accessLevel: input.accessLevel ?? "WORKSPACE",
        internalOwnerMembershipId: input.internalOwnerMembershipId ?? null,
        reviewCadenceDays: input.reviewCadenceDays ?? null,
        nextReviewAt: input.nextReviewAt ?? null,
        createdByMembershipId: ctx.membership.id,
      },
    });
    const version = await addVersionInTransaction(tx, ctx, claim, input);
    const projected = await recomputeClaim(tx, ctx, claim.id, "assertion ledger changed");
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.ClaimCreated,
      entityType: "Claim",
      entityId: claim.id,
      correlationId: ctx.correlationId,
      payload: { claimKey: claim.claimKey, state: projected.state },
    });
    return { claim: projected, version };
  });
}

export async function addClaimVersion(
  ctx: WorkspaceContext,
  claimId: string,
  input: VersionInput,
) {
  requireTruthCapability(ctx, "truth.write");
  const claim = await loadClaim(ctx, claimId);
  return getDb().$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "claim" WHERE id = ${claim.id} FOR UPDATE`;
    const lockedClaim = await tx.claim.findUniqueOrThrow({
      where: { id: claim.id },
    });
    assertClaimOpenForTruthChange(lockedClaim.state, "append assertions to");
    const version = await addVersionInTransaction(tx, ctx, lockedClaim, input);
    const projected = await recomputeClaim(
      tx,
      ctx,
      lockedClaim.id,
      "assertion ledger changed",
    );
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.ClaimVersionAdded,
      entityType: "ClaimVersion",
      entityId: version.id,
      correlationId: ctx.correlationId,
      payload: { versionNumber: version.versionNumber, state: projected.state },
    });
    return { claim: projected, version };
  });
}

export async function assertHonestNull(
  ctx: WorkspaceContext,
  claimId: string,
  input: {
    rationale: string;
    searchCompleteness: SearchCompleteness;
    certificateReference?: string;
  },
) {
  requireTruthCapability(ctx, "truth.write");
  const claim = await loadClaim(ctx, claimId);
  if (!input.rationale.trim()) {
    throw new TruthError(TruthErrorCode.Invariant, "Honest-null rationale is required");
  }
  if (
    input.searchCompleteness === "EMPTY_CERTIFIED" &&
    !input.certificateReference?.trim()
  ) {
    throw new TruthError(
      TruthErrorCode.Invariant,
      "EMPTY_CERTIFIED requires a replayable certificate reference",
    );
  }
  return getDb().$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "claim" WHERE id = ${claim.id} FOR UPDATE`;
    const lockedClaim = await tx.claim.findUniqueOrThrow({
      where: { id: claim.id },
    });
    assertClaimOpenForTruthChange(lockedClaim.state, "assert honest-null for");
    const record = await tx.honestNullRecord.create({
      data: {
        workspaceId: ctx.workspace.id,
        missionId: lockedClaim.missionId,
        claimId,
        rationale: input.rationale,
        searchCompleteness: input.searchCompleteness,
        certificateReference: input.certificateReference ?? null,
        assertedByMembershipId: ctx.membership.id,
      },
    });
    await tx.claim.update({
      where: { id: claimId },
      data: { state: "HONEST_NULL", version: { increment: 1 } },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.ClaimHonestNullAsserted,
      entityType: "HonestNullRecord",
      entityId: record.id,
      correlationId: ctx.correlationId,
      payload: { searchCompleteness: input.searchCompleteness },
    });
    return record;
  });
}

export async function setTerminalClaimState(
  ctx: WorkspaceContext,
  claimId: string,
  state: "FALSIFIED" | "RETRACTED",
  reason: string,
) {
  requireTruthCapability(ctx, "truth.review");
  const claim = await loadClaim(ctx, claimId);
  if (!reason.trim()) {
    throw new TruthError(TruthErrorCode.Invariant, "A reason is required");
  }
  return getDb().$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "claim" WHERE id = ${claim.id} FOR UPDATE`;
    const lockedClaim = await tx.claim.findUniqueOrThrow({
      where: { id: claim.id },
    });
    assertClaimOpenForTruthChange(
      lockedClaim.state,
      `set terminal state ${state} on`,
    );
    const updated = await tx.claim.update({
      where: { id: claimId },
      data: { state, version: { increment: 1 } },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.ClaimStateChanged,
      entityType: "Claim",
      entityId: claimId,
      correlationId: ctx.correlationId,
      payload: { from: lockedClaim.state, to: state, reason },
    });
    return updated;
  });
}

export async function reviewClaim(
  ctx: WorkspaceContext,
  claimId: string,
  input: {
    reason: string;
    accessLevel?: AccessLevel;
    reviewCadenceDays?: number | null;
    nextReviewAt?: Date | null;
  },
) {
  requireTruthCapability(ctx, "truth.review");
  await loadClaim(ctx, claimId);
  if (!input.reason.trim()) {
    throw new TruthError(TruthErrorCode.Invariant, "A review reason is required");
  }
  if (
    input.reviewCadenceDays !== undefined &&
    input.reviewCadenceDays !== null &&
    (!Number.isInteger(input.reviewCadenceDays) || input.reviewCadenceDays <= 0)
  ) {
    throw new TruthError(
      TruthErrorCode.Invariant,
      "Review cadence must be a positive integer",
    );
  }
  return getDb().$transaction(async (tx) => {
    const reviewed = await tx.claim.update({
      where: { id: claimId },
      data: {
        accessLevel: input.accessLevel,
        reviewCadenceDays: input.reviewCadenceDays,
        nextReviewAt: input.nextReviewAt,
        reviewedAt: new Date(),
        version: { increment: 1 },
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.ClaimReviewed,
      entityType: "Claim",
      entityId: claimId,
      correlationId: ctx.correlationId,
      payload: {
        accessLevel: reviewed.accessLevel,
        reason: input.reason,
      },
    });
    return reviewed;
  });
}

export async function getClaimLedger(
  ctx: WorkspaceContext,
  claimId: string,
) {
  requireTruthCapability(ctx, "truth.read");
  await loadClaim(ctx, claimId);
  return getDb().claim.findUniqueOrThrow({
    where: { id: claimId },
    include: {
      versions: {
        orderBy: { versionNumber: "asc" },
        include: {
          evidence: {
            include: {
              evidenceSpan: {
                include: { snapshot: { include: { evidenceSource: true } } },
              },
            },
          },
        },
      },
      disputes: { orderBy: { createdAt: "asc" } },
      honestNulls: { orderBy: { createdAt: "asc" } },
    },
  });
}
