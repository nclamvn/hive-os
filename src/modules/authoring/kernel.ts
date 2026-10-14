import { randomUUID } from "node:crypto";

import type { Prisma } from "@prisma/client";

import {
  AuditEventType,
  NotFoundError,
  requireCapability,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import { getApprovedResearchBundle } from "@/modules/research-sandbox/kernel";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";

import {
  authoringContentSchema,
  createAuthoringDocumentSchema,
  importApprovedResearchSchema,
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
  researchImports: Prisma.JsonValue;
}): AuthoringContent {
  const result = authoringContentSchema.safeParse({
    title: row.title,
    abstract: row.abstract,
    sections: row.sections,
    citations: row.citations,
    computationalArtifacts: row.computationalArtifacts,
    researchImports: row.researchImports,
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

function assertRetainedResearchProvenance(
  previous: AuthoringContent,
  next: AuthoringContent,
) {
  for (const retained of previous.researchImports) {
    const candidate = next.researchImports.find(
      (item) => item.runId === retained.runId,
    );
    if (!candidate || JSON.stringify(candidate) !== JSON.stringify(retained)) {
      throw new AuthoringError(
        "AUTHORING_CONFLICT",
        "Approved research provenance cannot be removed or rewritten",
      );
    }
  }
  for (const retained of previous.citations.filter(
    (citation) => citation.researchRunId,
  )) {
    const candidate = next.citations.find(
      (citation) =>
        citation.researchRunId === retained.researchRunId &&
        citation.researchSourceId === retained.researchSourceId,
    );
    if (
      !candidate ||
      candidate.key !== retained.key ||
      candidate.canonicalUri !== retained.canonicalUri ||
      candidate.sourceDigest !== retained.sourceDigest
    ) {
      throw new AuthoringError(
        "AUTHORING_CONFLICT",
        "Approved research source identity cannot be removed or rewritten",
      );
    }
  }
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
        ? assessAuthoringQuality(row.documentType, parseContent(row.revisions[0]))
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
      researchImports: [],
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
        researchImports: content.researchImports as Prisma.InputJsonValue,
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
      researchImports: input.data.researchImports,
    };
    const retainedRevision = await tx.authoringRevision.findFirst({
      where: {
        documentId: document.id,
        revisionNumber: document.currentRevisionNumber,
      },
    });
    if (!retainedRevision) {
      throw new AuthoringError(
        "AUTHORING_NOT_FOUND",
        "Current retained revision not found",
      );
    }
    assertRetainedResearchProvenance(parseContent(retainedRevision), content);
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
        researchImports: content.researchImports as Prisma.InputJsonValue,
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

function researchCitationKey(
  runId: string,
  sourceId: string,
  occupied: Set<string>,
) {
  const base = `research-${runId.replace(/-/g, "").slice(0, 8)}-${sourceId.replace(/-/g, "").slice(0, 8)}`;
  let key = base;
  let suffix = 2;
  while (occupied.has(key.toLowerCase())) {
    key = `${base}-${suffix}`;
    suffix += 1;
  }
  occupied.add(key.toLowerCase());
  return key;
}

function researchSections(
  runId: string,
  question: string,
  locale: "vi" | "en",
  paragraphs: string[],
  mathAssessment?: { reviewMethod?: "HUMAN" | "AI"; conclusion: string; rationale: string; verificationNotes: string; reviewChecklistDigest: string } | null,
) {
  const chunks: string[] = [];
  let current = locale === "vi"
    ? `Câu hỏi nghiên cứu: ${question}`
    : `Research question: ${question}`;
  if (mathAssessment) {
    const caution = ["PARTIAL", "INCONCLUSIVE"].includes(mathAssessment.conclusion)
      ? locale === "vi" ? "Chưa nghiệm thu định lý; chỉ ghi nhận tiến triển/giới hạn." : "No theorem accepted; only progress and limits are recorded."
      : locale === "vi" ? "Đánh giá có dấu vết, không phải chứng chỉ chứng minh hình thức." : "Auditable assessment, not a formal proof certificate.";
    current += locale === "vi"
      ? `\n\nPhản biện toán học: ${mathAssessment.conclusion}. ${mathAssessment.reviewMethod === "AI" ? "Đánh giá AI, chưa phải chứng minh được chứng nhận. " : ""}${caution}\nLý do: ${mathAssessment.rationale}\nKiểm tra/giới hạn: ${mathAssessment.verificationNotes}\nMã sổ kiểm: ${mathAssessment.reviewChecklistDigest}`
      : `\n\nMathematical review: ${mathAssessment.conclusion}. ${mathAssessment.reviewMethod === "AI" ? "AI assessment, not a certified proof. " : ""}${caution}\nRationale: ${mathAssessment.rationale}\nChecks/limits: ${mathAssessment.verificationNotes}\nReview ledger digest: ${mathAssessment.reviewChecklistDigest}`;
  }
  for (const paragraph of paragraphs) {
    const candidate = `${current}\n\n${paragraph}`;
    if (candidate.length > 90_000 && current.trim()) {
      chunks.push(current);
      current = paragraph;
    } else {
      current = candidate;
    }
  }
  if (current.trim()) chunks.push(current);
  const prefix = `research-${runId.replace(/-/g, "").slice(0, 12)}`;
  return chunks.map((body, index) => ({
    key: `${prefix}-${index + 1}`,
    heading:
      mathAssessment && locale === "vi"
        ? `Phản biện toán học và bằng chứng${chunks.length > 1 ? `, phần ${index + 1}` : ""}`
        : mathAssessment
        ? `Mathematical review and evidence${chunks.length > 1 ? `, part ${index + 1}` : ""}`
        : locale === "vi"
        ? `Bằng chứng nghiên cứu đã duyệt${chunks.length > 1 ? `, phần ${index + 1}` : ""}`
        : `Approved research evidence${chunks.length > 1 ? `, part ${index + 1}` : ""}`,
    kind: "EVIDENCE" as const,
    body,
  }));
}

/**
 * TIP-024E: materialize an independently approved research bundle into one
 * immutable authoring revision. The bundle digest and retained IDs travel
 * with the revision; repeated imports of the same run are a no-op.
 */
export async function importApprovedResearchBundle(
  ctx: WorkspaceContext,
  rawInput: unknown,
) {
  requireCapability(ctx, "authoring.write");
  const input = importApprovedResearchSchema.safeParse(rawInput);
  if (!input.success) {
    throw new AuthoringError(
      "INVALID_AUTHORING_INPUT",
      "Research import violates the authoring bridge contract",
    );
  }
  const bundle = await getApprovedResearchBundle(ctx, input.data.runId);
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
    if (!document) {
      throw new AuthoringError("AUTHORING_NOT_FOUND", "Target document not found");
    }
    if (document.missionId !== bundle.missionId) {
      throw new AuthoringError(
        "AUTHORING_CONFLICT",
        "Approved research and target document belong to different Missions",
      );
    }
    if (bundle.documentId && bundle.documentId !== document.id) {
      throw new AuthoringError(
        "AUTHORING_CONFLICT",
        "Approved research is bound to a different target document",
      );
    }
    const revision = await tx.authoringRevision.findFirst({
      where: { documentId: document.id },
      orderBy: { revisionNumber: "desc" },
    });
    if (!revision) {
      throw new AuthoringError("AUTHORING_NOT_FOUND", "Target document has no retained revision");
    }
    const current = parseContent(revision);
    const priorImport = current.researchImports.find(
      (item) => item.runId === bundle.runId,
    );
    if (priorImport) {
      if (priorImport.approvedDigest !== bundle.digest) {
        throw new AuthoringError(
          "AUTHORING_CONFLICT",
          "The retained research import digest no longer matches the approved bundle",
        );
      }
      return {
        documentId: document.id,
        revisionNumber: revision.revisionNumber,
        alreadyImported: true,
        sectionKeys: priorImport.sectionKeys,
      };
    }

    const sourceById = new Map(bundle.sources.map((source) => [source.id, source]));
    const referencedSourceIds = [
      ...new Set(
        bundle.findings.flatMap((finding) =>
          finding.sourceId ? [finding.sourceId] : [],
        ),
      ),
    ].sort();
    const occupiedKeys = new Set(current.citations.map((citation) => citation.key.toLowerCase()));
    const citationKeyBySourceId = new Map<string, string>();
    const importedCitations = referencedSourceIds.map((sourceId) => {
      const source = sourceById.get(sourceId);
      if (!source) {
        throw new AuthoringError(
          "AUTHORING_CONFLICT",
          "An accepted finding references a source outside the approved bundle",
        );
      }
      const key = researchCitationKey(bundle.runId, source.id, occupiedKeys);
      citationKeyBySourceId.set(source.id, key);
      return {
        key,
        title: source.title,
        authors: "",
        year: String(source.capturedAt.getUTCFullYear()),
        publisher: source.publisher,
        canonicalUri: source.canonicalUri,
        locator: `Research snapshot SHA-256 ${source.contentDigest}`,
        evidenceSourceId: null,
        researchRunId: bundle.runId,
        researchSourceId: source.id,
        sourceDigest: source.contentDigest,
      };
    });
    const paragraphs = bundle.findings.map((finding, index) => {
      const citationKey = finding.sourceId
        ? citationKeyBySourceId.get(finding.sourceId)
        : null;
      const marker = citationKey ? ` [@${citationKey}]` : "";
      const honestNull = finding.kind === "HONEST_NULL"
        ? input.data.locale === "vi" ? "Khoảng trống bằng chứng: " : "Evidence gap: "
        : "";
      return `${index + 1}. ${honestNull}${finding.claim}${marker}`;
    });
    const importedSections = researchSections(
      bundle.runId,
      bundle.question,
      input.data.locale,
      paragraphs,
      bundle.mathAssessment,
    );
    if (current.sections.length + importedSections.length > 64) {
      throw new AuthoringError(
        "INVALID_AUTHORING_INPUT",
        "Research import would exceed the document section ceiling",
      );
    }
    if (current.citations.length + importedCitations.length > 512) {
      throw new AuthoringError(
        "INVALID_AUTHORING_INPUT",
        "Research import would exceed the document citation ceiling",
      );
    }
    if (current.researchImports.length >= 64) {
      throw new AuthoringError(
        "INVALID_AUTHORING_INPUT",
        "Research import would exceed the retained bundle ceiling",
      );
    }
    const content: AuthoringContent = {
      ...current,
      sections: [...current.sections, ...importedSections],
      citations: [...current.citations, ...importedCitations],
      researchImports: [
        ...current.researchImports,
        {
          runId: bundle.runId,
          approvedDigest: bundle.digest,
          sectionKeys: importedSections.map((section) => section.key),
          sourceIds: referencedSourceIds,
          findingIds: bundle.findings.map((finding) => finding.id).sort(),
          ...(bundle.mathAssessment ? { reviewMethod: bundle.mathAssessment.reviewMethod } : {}),
        },
      ],
    };
    const parsedContent = authoringContentSchema.parse(content);
    const quality = assessAuthoringQuality(
      document.documentType as AuthoringDocumentType,
      parsedContent,
    );
    const contentHash = hashAuthoringContent(parsedContent);
    const revisionNumber = revision.revisionNumber + 1;
    const created = await tx.authoringRevision.create({
      data: {
        organizationId,
        workspaceId: ctx.workspace.id,
        missionId: document.missionId,
        documentId: document.id,
        revisionNumber,
        title: parsedContent.title,
        abstract: parsedContent.abstract,
        sections: parsedContent.sections as Prisma.InputJsonValue,
        citations: parsedContent.citations as Prisma.InputJsonValue,
        computationalArtifacts: parsedContent.computationalArtifacts as Prisma.InputJsonValue,
        researchImports: parsedContent.researchImports as Prisma.InputJsonValue,
        qualityReport: quality as Prisma.InputJsonValue,
        contentHash,
        changeSummary:
          input.data.locale === "vi"
            ? "Nhập hồ sơ nghiên cứu đã duyệt"
            : "Imported approved research dossier",
        createdByMembershipId: ctx.membership.id,
      },
    });
    await tx.authoringDocument.update({
      where: { id: document.id },
      data: { currentRevisionNumber: revisionNumber, version: { increment: 1 } },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.AuthoringRevisionCreated,
      entityType: "AuthoringRevision",
      entityId: created.id,
      correlationId: ctx.correlationId,
      payload: {
        revisionNumber,
        digest: contentHash,
        qualityStatus: quality.status,
        blockerCount: quality.blockerCount,
        warningCount: quality.warningCount,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.AuthoringResearchImported,
      entityType: "AuthoringDocument",
      entityId: document.id,
      correlationId: ctx.correlationId,
      payload: {
        documentId: document.id,
        runId: bundle.runId,
        revisionNumber,
        approvedDigest: bundle.digest,
        sourceCount: referencedSourceIds.length,
        findingCount: bundle.findings.length,
        ...(bundle.mathAssessment ? { reviewMethod: bundle.mathAssessment.reviewMethod } : {}),
      },
    });
    return {
      documentId: document.id,
      revisionNumber,
      alreadyImported: false,
      sectionKeys: importedSections.map((section) => section.key),
    };
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
