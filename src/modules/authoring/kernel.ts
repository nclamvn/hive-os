import { randomUUID } from "node:crypto";

import type { Prisma } from "@prisma/client";

import {
  AuditEventType,
  NotFoundError,
  requireCapability,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";

import {
  authoringContentSchema,
  createAuthoringDocumentSchema,
  qualityReportSchema,
  saveAuthoringRevisionSchema,
  type AuthoringContent,
  type AuthoringDocumentType,
} from "./contracts";
import { diffAuthoringContent } from "./diff";
import { AuthoringError } from "./errors";
import { assessAuthoringQuality } from "./quality";
import { initialAuthoringSections } from "./templates";
import { hashAuthoringContent } from "./content-hash";

const MAX_DOCUMENTS = 100;
const MAX_REVISIONS = 100;

async function scope(ctx: WorkspaceContext) {
  const workspace = await getDb().workspace.findFirst({
    where: { id: ctx.workspace.id },
    select: { organizationId: true },
  });
  if (!workspace) throw new NotFoundError();
  return workspace.organizationId;
}

function parseContent(row: {
  title: string;
  abstract: string;
  sections: Prisma.JsonValue;
  citations: Prisma.JsonValue;
  computationalArtifacts: Prisma.JsonValue;
}): AuthoringContent {
  const result = authoringContentSchema.safeParse({
    title: row.title,
    abstract: row.abstract,
    sections: row.sections,
    citations: row.citations,
    computationalArtifacts: row.computationalArtifacts,
  });
  if (!result.success) {
    throw new AuthoringError(
      "INVALID_AUTHORING_INPUT",
      "Retained authoring revision violates its strict schema",
    );
  }
  return result.data;
}

function parseQuality(value: Prisma.JsonValue) {
  const result = qualityReportSchema.safeParse(value);
  if (!result.success) {
    throw new AuthoringError(
      "INVALID_AUTHORING_INPUT",
      "Retained quality report violates its strict schema",
    );
  }
  return result.data;
}

export async function listAuthoringMissions(ctx: WorkspaceContext) {
  requireCapability(ctx, "authoring.read");
  return getDb().mission.findMany({
    where: { workspaceId: ctx.workspace.id },
    select: { id: true, referenceCode: true, title: true, status: true },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    take: 100,
  });
}

export async function listAuthoringDocuments(ctx: WorkspaceContext) {
  requireCapability(ctx, "authoring.read");
  const organizationId = await scope(ctx);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const rows = await tx.authoringDocument.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id },
      include: {
        mission: { select: { referenceCode: true, title: true } },
        revisions: { orderBy: { revisionNumber: "desc" }, take: 1 },
      },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      take: MAX_DOCUMENTS,
    });
    return rows.map((row) => ({
      id: row.id,
      documentKey: row.documentKey,
      title: row.title,
      documentType: row.documentType,
      status: row.status,
      currentRevisionNumber: row.currentRevisionNumber,
      updatedAt: row.updatedAt,
      mission: row.mission,
      quality: row.revisions[0]
        ? parseQuality(row.revisions[0].qualityReport)
        : null,
    }));
  });
}

export async function createAuthoringDocument(
  ctx: WorkspaceContext,
  rawInput: unknown,
) {
  requireCapability(ctx, "authoring.write");
  const input = createAuthoringDocumentSchema.safeParse(rawInput);
  if (!input.success) {
    throw new AuthoringError(
      "INVALID_AUTHORING_INPUT",
      "Document title, type and Mission are required",
    );
  }
  const organizationId = await scope(ctx);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const mission = await tx.mission.findFirst({
      where: { id: input.data.missionId, workspaceId: ctx.workspace.id },
      select: { id: true },
    });
    if (!mission) throw new AuthoringError("AUTHORING_NOT_FOUND", "Mission not found");

    const documentKey = `DOC-${randomUUID().slice(0, 8).toUpperCase()}`;
    const content: AuthoringContent = {
      title: input.data.title,
      abstract: "",
      sections: initialAuthoringSections(
        input.data.documentType,
        input.data.locale,
      ),
      citations: [],
      computationalArtifacts: [],
    };
    const quality = assessAuthoringQuality(input.data.documentType, content);
    const contentHash = hashAuthoringContent(content);
    const document = await tx.authoringDocument.create({
      data: {
        organizationId,
        workspaceId: ctx.workspace.id,
        missionId: mission.id,
        documentKey,
        title: content.title,
        documentType: input.data.documentType,
        createdByMembershipId: ctx.membership.id,
      },
    });
    await tx.authoringRevision.create({
      data: {
        organizationId,
        workspaceId: ctx.workspace.id,
        missionId: mission.id,
        documentId: document.id,
        revisionNumber: 1,
        title: content.title,
        abstract: content.abstract,
        sections: content.sections as Prisma.InputJsonValue,
        citations: content.citations as Prisma.InputJsonValue,
        computationalArtifacts:
          content.computationalArtifacts as Prisma.InputJsonValue,
        qualityReport: quality as Prisma.InputJsonValue,
        contentHash,
        changeSummary:
          input.data.locale === "vi" ? "Khởi tạo tài liệu" : "Document created",
        createdByMembershipId: ctx.membership.id,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.AuthoringDocumentCreated,
      entityType: "AuthoringDocument",
      entityId: document.id,
      correlationId: ctx.correlationId,
      payload: {
        documentKey,
        documentType: input.data.documentType,
        missionId: mission.id,
        revisionNumber: 1,
      },
    });
    return document;
  });
}

export async function getAuthoringDocument(
  ctx: WorkspaceContext,
  documentId: string,
) {
  requireCapability(ctx, "authoring.read");
  const organizationId = await scope(ctx);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const document = await tx.authoringDocument.findFirst({
      where: { id: documentId, organizationId, workspaceId: ctx.workspace.id },
      include: {
        mission: { select: { id: true, referenceCode: true, title: true } },
        revisions: {
          orderBy: { revisionNumber: "desc" },
          take: MAX_REVISIONS,
        },
      },
    });
    if (!document) throw new AuthoringError("AUTHORING_NOT_FOUND", "Document not found");
    const evidenceSources = await tx.evidenceSource.findMany({
      where: {
        workspaceId: ctx.workspace.id,
        missionId: document.missionId,
      },
      select: {
        id: true,
        title: true,
        canonicalUri: true,
        publisher: true,
        sourceType: true,
        snapshots: {
          select: { contentHash: true, capturedAt: true },
          orderBy: { capturedAt: "desc" },
          take: 1,
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: 100,
    });
    const revisions = document.revisions.map((revision) => ({
      id: revision.id,
      revisionNumber: revision.revisionNumber,
      content: parseContent(revision),
      quality: parseQuality(revision.qualityReport),
      contentHash: revision.contentHash,
      changeSummary: revision.changeSummary,
      createdByMembershipId: revision.createdByMembershipId,
      createdAt: revision.createdAt,
    }));
    return {
      id: document.id,
      documentKey: document.documentKey,
      documentType: document.documentType,
      status: document.status,
      currentRevisionNumber: document.currentRevisionNumber,
      mission: document.mission,
      evidenceSources,
      revisions,
      current: revisions[0],
      diff: revisions[0]
        ? diffAuthoringContent(revisions[1]?.content ?? null, revisions[0].content)
        : null,
    };
  });
}

export async function saveAuthoringRevision(
  ctx: WorkspaceContext,
  rawInput: unknown,
) {
  requireCapability(ctx, "authoring.write");
  const input = saveAuthoringRevisionSchema.safeParse(rawInput);
  if (!input.success) {
    throw new AuthoringError(
      "INVALID_AUTHORING_INPUT",
      "Revision content violates the authoring contract",
    );
  }
  const organizationId = await scope(ctx);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await tx.$queryRaw`SELECT id FROM "authoring_document" WHERE id = ${input.data.documentId} AND organization_id = ${organizationId} FOR UPDATE`;
    const document = await tx.authoringDocument.findFirst({
      where: {
        id: input.data.documentId,
        organizationId,
        workspaceId: ctx.workspace.id,
      },
    });
    if (!document) throw new AuthoringError("AUTHORING_NOT_FOUND", "Document not found");
    if (document.currentRevisionNumber !== input.data.expectedRevisionNumber) {
      throw new AuthoringError(
        "AUTHORING_CONFLICT",
        "A newer revision exists. Reload before saving",
      );
    }

    const content: AuthoringContent = {
      title: input.data.title,
      abstract: input.data.abstract,
      sections: input.data.sections,
      citations: input.data.citations,
      computationalArtifacts: input.data.computationalArtifacts,
    };
    const contentHash = hashAuthoringContent(content);
    const duplicate = await tx.authoringRevision.findFirst({
      where: { documentId: document.id, contentHash },
      select: { revisionNumber: true },
    });
    if (duplicate) {
      throw new AuthoringError(
        "AUTHORING_CONFLICT",
        `Revision ${duplicate.revisionNumber} already contains this content`,
      );
    }
    const quality = assessAuthoringQuality(
      document.documentType as AuthoringDocumentType,
      content,
    );
    const revisionNumber = document.currentRevisionNumber + 1;
    const revision = await tx.authoringRevision.create({
      data: {
        organizationId,
        workspaceId: ctx.workspace.id,
        missionId: document.missionId,
        documentId: document.id,
        revisionNumber,
        title: content.title,
        abstract: content.abstract,
        sections: content.sections as Prisma.InputJsonValue,
        citations: content.citations as Prisma.InputJsonValue,
        computationalArtifacts:
          content.computationalArtifacts as Prisma.InputJsonValue,
        qualityReport: quality as Prisma.InputJsonValue,
        contentHash,
        changeSummary: input.data.changeSummary,
        createdByMembershipId: ctx.membership.id,
      },
    });
    await tx.authoringDocument.update({
      where: { id: document.id },
      data: {
        title: content.title,
        currentRevisionNumber: revisionNumber,
        version: { increment: 1 },
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.AuthoringRevisionCreated,
      entityType: "AuthoringRevision",
      entityId: revision.id,
      correlationId: ctx.correlationId,
      payload: {
        revisionNumber,
        digest: contentHash,
        qualityStatus: quality.status,
        blockerCount: quality.blockerCount,
        warningCount: quality.warningCount,
      },
    });
    return { revisionNumber, quality };
  });
}

export async function recordAuthoringExport(
  ctx: WorkspaceContext,
  documentId: string,
  revisionNumber: number,
  format: "DOCX" | "PDF",
  contentHash: string,
) {
  requireCapability(ctx, "authoring.export");
  const organizationId = await scope(ctx);
  await withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const document = await tx.authoringDocument.findFirst({
      where: { id: documentId, organizationId, workspaceId: ctx.workspace.id },
      select: { id: true },
    });
    if (!document) throw new AuthoringError("AUTHORING_NOT_FOUND", "Document not found");
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.AuthoringExported,
      entityType: "AuthoringDocument",
      entityId: document.id,
      correlationId: ctx.correlationId,
      payload: { revisionNumber, format, digest: contentHash },
    });
  });
}
