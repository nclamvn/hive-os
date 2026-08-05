import { beforeEach, describe, expect, it } from "vitest";

import {
  createAuthoringDocument,
  getAuthoringDocument,
  listAuthoringDocuments,
  saveAuthoringRevision,
} from "@/modules/authoring/kernel";
import { createMission } from "@/modules/mission-kernel";
import { getDb } from "@/server/db";

import { asOwner, createUser, ownerQuery, truncateAll } from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

describe("governed authoring persistence", () => {
  it("creates a scoped document and appends an immutable revision", async () => {
    const ctx = await asOwner(await createUser("author"));
    const mission = await createMission(ctx, { title: "Forest survey" });
    const created = await createAuthoringDocument(ctx, {
      missionId: mission.id,
      title: "Đề án khảo sát rừng",
      documentType: "RESEARCH_PROPOSAL",
      locale: "vi",
    });
    const source = await getDb().evidenceSource.create({
      data: {
        workspaceId: ctx.workspace.id,
        missionId: mission.id,
        title: "UAV field protocol",
        canonicalUri: "https://example.com/uav-field-protocol",
        publisher: "Technical council",
        sourceType: "PROTOCOL",
        independenceKey: "technical-council",
        createdByMembershipId: ctx.membership.id,
      },
    });
    await getDb().snapshot.create({
      data: {
        workspaceId: ctx.workspace.id,
        missionId: mission.id,
        evidenceSourceId: source.id,
        content: "Retained field protocol",
        contentHash: "b".repeat(64),
        capturedAt: new Date("2026-08-05T00:00:00.000Z"),
        createdByMembershipId: ctx.membership.id,
      },
    });

    const initial = await getAuthoringDocument(ctx, created.id);
    expect(initial.currentRevisionNumber).toBe(1);
    expect(initial.current?.content.sections.map((section) => section.key)).toEqual(
      expect.arrayContaining(["methodology", "risk-limitations", "references"]),
    );
    expect(initial.evidenceSources[0]).toMatchObject({
      id: source.id,
      title: "UAV field protocol",
    });
    expect(initial.evidenceSources[0].snapshots[0].contentHash).toMatch(
      /^[a-f0-9]{64}$/,
    );

    const content = structuredClone(initial.current!.content);
    content.abstract = "Phạm vi, phương pháp và trách nhiệm được xác định trước khi khảo sát.";
    content.sections = content.sections.map((section) => ({
      ...section,
      body: `Nội dung có trách nhiệm cho mục ${section.heading}.`,
    }));
    const saved = await saveAuthoringRevision(ctx, {
      ...content,
      documentId: created.id,
      expectedRevisionNumber: 1,
      changeSummary: "Bổ sung nội dung kiểm soát",
    });
    expect(saved.revisionNumber).toBe(2);

    const retained = await getAuthoringDocument(ctx, created.id);
    expect(retained.revisions.map((revision) => revision.revisionNumber)).toEqual([
      2,
      1,
    ]);
    expect(retained.diff?.changedSectionCount).toBe(content.sections.length);
    await expect(
      ownerQuery(
        `UPDATE authoring_revision SET change_summary = 'tampered' WHERE document_id = '${created.id}'`,
      ),
    ).rejects.toThrow(/append-only/i);
  });

  it("rejects stale saves and does not disclose cross-workspace documents", async () => {
    const ctxA = await asOwner(await createUser("workspace-a"));
    const ctxB = await asOwner(await createUser("workspace-b"));
    const mission = await createMission(ctxA, { title: "Private proposal" });
    const created = await createAuthoringDocument(ctxA, {
      missionId: mission.id,
      title: "Private proposal",
      documentType: "CLIENT_PROPOSAL",
      locale: "en",
    });
    const document = await getAuthoringDocument(ctxA, created.id);
    const content = structuredClone(document.current!.content);
    content.abstract = "Bounded delivery record.";

    await saveAuthoringRevision(ctxA, {
      ...content,
      documentId: created.id,
      expectedRevisionNumber: 1,
      changeSummary: "First update",
    });
    await expect(
      saveAuthoringRevision(ctxA, {
        ...content,
        abstract: "Stale concurrent update.",
        documentId: created.id,
        expectedRevisionNumber: 1,
        changeSummary: "Stale update",
      }),
    ).rejects.toMatchObject({ code: "AUTHORING_CONFLICT" });

    await expect(getAuthoringDocument(ctxB, created.id)).rejects.toMatchObject({
      code: "AUTHORING_NOT_FOUND",
    });
    expect(await listAuthoringDocuments(ctxB)).toEqual([]);
  });
});
