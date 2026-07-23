import { beforeEach, describe, expect, it } from "vitest";

import type { AccessLevel } from "@prisma/client";

import {
  acceptInvitation,
  createInvitation,
} from "@/modules/identity-workspace";
import {
  addObligation,
  addRequirement,
  approveContract,
  createMission,
  submitContract,
  transitionMission,
} from "@/modules/mission-kernel";
import {
  addClaimVersion,
  assertHonestNull,
  captureSnapshot,
  createClaim,
  createEvidenceSource,
  createEvidenceSpan,
  getClaimLedger,
  listClaimProjection,
  reviewClaim,
  setTerminalClaimState,
} from "@/modules/truth-kernel";
import { getDb } from "@/server/db";

import {
  asOwner,
  contextForMembership,
  createUser,
  ownerQuery,
  truncateAll,
} from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

async function approvedMission() {
  const ctx = await asOwner(await createUser("truth"));
  const mission = await createMission(ctx, {
    title: "Truth mission",
    objective: "Assess a value",
    scope: "Bounded",
    successDefinition: "Evidence ledger",
  });
  await addRequirement(ctx, mission.currentContractId!, {
    code: "R1", title: "Truth", description: "Assess", acceptanceCriteria: "Ledger exists",
  });
  await addObligation(ctx, mission.currentContractId!, {
    code: "O1", title: "Assess", description: "Assess", weight: 1, closureRule: "truth reviewed",
  });
  await transitionMission(ctx, mission.id, "INTAKE", { reason: "intake" });
  await transitionMission(ctx, mission.id, "SCOPED", { reason: "scoped" });
  await submitContract(ctx, mission.id);
  await approveContract(ctx, mission.id);
  return { ctx, mission };
}

async function spanFor(
  ctx: Awaited<ReturnType<typeof approvedMission>>["ctx"],
  missionId: string,
  key: string,
  value: string,
  accessLevel: AccessLevel = "WORKSPACE",
) {
  const source = await createEvidenceSource(ctx, missionId, {
    title: key,
    canonicalUri: `https://example.test/${key}`,
    sourceType: "WEB",
    independenceKey: key,
    qualifiesForCorroboration: true,
    accessLevel,
  });
  const content = `Measured value: ${value}.`;
  const snapshot = await captureSnapshot(ctx, source.id, {
    content,
    capturedAt: new Date("2026-07-23T00:00:00Z"),
  });
  const start = content.indexOf(value);
  const span = await createEvidenceSpan(ctx, snapshot.id, {
    startOffset: start,
    endOffset: start + value.length,
    exactText: value,
  });
  return { source, snapshot, span };
}

describe("truth kernel", () => {
  it("TK-01 rejects a span that is not an exact snapshot match", async () => {
    const { ctx, mission } = await approvedMission();
    const source = await createEvidenceSource(ctx, mission.id, {
      title: "Source", canonicalUri: "https://example.test/source", sourceType: "WEB", independenceKey: "a",
    });
    const snapshot = await captureSnapshot(ctx, source.id, {
      content: "immutable content", capturedAt: new Date(),
    });
    await expect(
      createEvidenceSpan(ctx, snapshot.id, { startOffset: 0, endOffset: 9, exactText: "different" }),
    ).rejects.toMatchObject({ code: "EVIDENCE_SPAN_MISMATCH" });
  });

  it("TK-02 corroborates only with two independent qualifying sources", async () => {
    const { ctx, mission } = await approvedMission();
    const a = await spanFor(ctx, mission.id, "publisher-a", "42");
    const created = await createClaim(ctx, mission.id, {
      claimKey: "answer", statement: "The answer is 42", normalizedValue: "42",
      evidence: [{ spanId: a.span.id }],
    });
    expect(created.claim.state).toBe("SOURCED");
    const b = await spanFor(ctx, mission.id, "publisher-b", "42");
    const updated = await addClaimVersion(ctx, created.claim.id, {
      statement: "The answer is 42", normalizedValue: "42", evidence: [{ spanId: b.span.id }],
    });
    expect(updated.claim.state).toBe("CORROBORATED");
  });

  it("TK-03 retains conflicting assertions and creates a dispute", async () => {
    const { ctx, mission } = await approvedMission();
    const a = await spanFor(ctx, mission.id, "a", "42");
    const b = await spanFor(ctx, mission.id, "b", "43");
    const created = await createClaim(ctx, mission.id, {
      claimKey: "value", statement: "Value is 42", normalizedValue: "42", evidence: [{ spanId: a.span.id }],
    });
    await addClaimVersion(ctx, created.claim.id, {
      statement: "Value is 43", normalizedValue: "43", evidence: [{ spanId: b.span.id }],
    });
    const ledger = await getClaimLedger(ctx, created.claim.id);
    expect(ledger.state).toBe("DISPUTED");
    expect(ledger.versions.map((version) => version.normalizedValue)).toEqual(["42", "43"]);
    expect(ledger.disputes).toHaveLength(1);
  });

  it("TK-04 honest-null is explicit and EMPTY_CERTIFIED requires a certificate", async () => {
    const { ctx, mission } = await approvedMission();
    const created = await createClaim(ctx, mission.id, {
      claimKey: "missing", statement: "A bounded value exists", hypothesis: true,
      falsificationCriterion: "A complete enumeration returns no value",
    });
    expect(created.claim.state).toBe("HYPOTHESIS");
    await expect(
      assertHonestNull(ctx, created.claim.id, { rationale: "No result", searchCompleteness: "EMPTY_CERTIFIED" }),
    ).rejects.toMatchObject({ code: "TRUTH_INVARIANT" });
    await assertHonestNull(ctx, created.claim.id, {
      rationale: "Complete enumeration returned no value",
      searchCompleteness: "EMPTY_CERTIFIED",
      certificateReference: "artifact://search-001",
    });
    expect((await getClaimLedger(ctx, created.claim.id)).state).toBe("HONEST_NULL");
  });

  it("TK-05 falsified records and their evidence remain queryable", async () => {
    const { ctx, mission } = await approvedMission();
    const a = await spanFor(ctx, mission.id, "a", "42");
    const created = await createClaim(ctx, mission.id, {
      claimKey: "falsifiable", statement: "Value is 42", normalizedValue: "42",
      falsificationCriterion: "A calibrated reading differs", evidence: [{ spanId: a.span.id }],
    });
    await setTerminalClaimState(ctx, created.claim.id, "FALSIFIED", "Calibrated reading differed");
    const ledger = await getClaimLedger(ctx, created.claim.id);
    expect(ledger.state).toBe("FALSIFIED");
    expect(ledger.versions).toHaveLength(1);
    expect(ledger.versions[0].evidence).toHaveLength(1);
  });

  it("TK-06 public/export projections omit forbidden claims and fields", async () => {
    const { ctx, mission } = await approvedMission();
    await createClaim(ctx, mission.id, {
      claimKey: "public", statement: "Public statement", normalizedValue: "yes",
      internalOwnerMembershipId: ctx.membership.id, accessLevel: "PUBLIC",
      falsificationCriterion: "A counterexample exists",
    });
    await createClaim(ctx, mission.id, {
      claimKey: "restricted", statement: "Secret statement", normalizedValue: "secret",
      internalOwnerMembershipId: ctx.membership.id, accessLevel: "RESTRICTED",
      falsificationCriterion: "Internal test fails",
    });
    const publicView = await listClaimProjection(ctx, mission.id, "PUBLIC");
    expect(publicView.map((claim) => claim.claimKey)).toEqual(["public"]);
    expect(publicView[0].versions[0].falsificationCriterion).toBeUndefined();
    const exportView = await listClaimProjection(ctx, mission.id, "EXPORT");
    expect(exportView.map((claim) => claim.claimKey)).toEqual(["public"]);
  });

  it("TK-07 database rejects mutation of immutable truth ledgers", async () => {
    const { ctx, mission } = await approvedMission();
    const a = await spanFor(ctx, mission.id, "immutable", "42");
    await expect(
      ownerQuery(`UPDATE snapshot SET content='changed' WHERE id='${a.snapshot.id}'`),
    ).rejects.toThrow(/append-only/i);
    await expect(
      getDb().evidenceSpan.delete({ where: { id: a.span.id } }),
    ).rejects.toThrow(/append-only|permission denied/i);
  });

  it("TK-08 review metadata is governed and audit-linked", async () => {
    const { ctx, mission } = await approvedMission();
    const created = await createClaim(ctx, mission.id, {
      claimKey: "reviewed", statement: "Internal assertion",
      normalizedValue: "42", internalOwnerMembershipId: ctx.membership.id,
    });
    const reviewed = await reviewClaim(ctx, created.claim.id, {
      reason: "Quarterly governance review",
      accessLevel: "RESTRICTED",
      reviewCadenceDays: 90,
      nextReviewAt: new Date("2026-10-21T00:00:00Z"),
    });
    expect(reviewed.reviewedAt).toBeTruthy();
    expect(reviewed.accessLevel).toBe("RESTRICTED");
    expect(reviewed.reviewCadenceDays).toBe(90);
    expect(
      await getDb().auditEvent.count({
        where: { entityId: created.claim.id, eventType: "claim.reviewed" },
      }),
    ).toBe(1);
  });

  it("TK-09 closes the governed truth loop with retained lineage and audit", async () => {
    const { ctx, mission } = await approvedMission();
    const first = await spanFor(ctx, mission.id, "loop-a", "42", "PUBLIC");
    const created = await createClaim(ctx, mission.id, {
      claimKey: "governed-loop",
      statement: "The governed value is 42",
      normalizedValue: "42",
      accessLevel: "PUBLIC",
      evidence: [{ spanId: first.span.id }],
    });
    expect(created.claim.state).toBe("SOURCED");

    const second = await spanFor(ctx, mission.id, "loop-b", "42", "PUBLIC");
    const corroborated = await addClaimVersion(ctx, created.claim.id, {
      statement: "An independent source also reports 42",
      normalizedValue: "42",
      accessLevel: "PUBLIC",
      evidence: [{ spanId: second.span.id }],
    });
    expect(corroborated.claim.state).toBe("CORROBORATED");

    const conflicting = await spanFor(ctx, mission.id, "loop-c", "43", "PUBLIC");
    const disputed = await addClaimVersion(ctx, created.claim.id, {
      statement: "A retained source reports 43",
      normalizedValue: "43",
      accessLevel: "PUBLIC",
      evidence: [{ spanId: conflicting.span.id }],
    });
    expect(disputed.claim.state).toBe("DISPUTED");

    const ledger = await getClaimLedger(ctx, created.claim.id);
    expect(ledger.versions).toHaveLength(3);
    expect(ledger.disputes).toHaveLength(1);
    expect(
      await getDb().provenanceEdge.count({
        where: { workspaceId: ctx.workspace.id, missionId: mission.id },
      }),
    ).toBe(3);

    const projection = await listClaimProjection(ctx, mission.id, "PUBLIC");
    expect(projection).toEqual([
      expect.objectContaining({
        claimKey: "governed-loop",
        state: "DISPUTED",
        versions: expect.arrayContaining([
          expect.objectContaining({ normalizedValue: "42" }),
          expect.objectContaining({ normalizedValue: "43" }),
        ]),
      }),
    ]);

    const eventTypes = (
      await getDb().auditEvent.findMany({
        where: { workspaceId: ctx.workspace.id },
        select: { eventType: true },
      })
    ).map((event) => event.eventType);
    expect(eventTypes).toEqual(
      expect.arrayContaining([
        "evidence.source_created",
        "evidence.snapshot_captured",
        "evidence.span_created",
        "claim.created",
        "claim.version_added",
        "claim.state_changed",
      ]),
    );
  });

  it("TK-10 fail-closes cross-workspace ownership and object access", async () => {
    const { ctx, mission } = await approvedMission();
    const foreignCtx = await asOwner(await createUser("foreign-owner"));
    const evidence = await spanFor(ctx, mission.id, "tenant-a", "42");
    const created = await createClaim(ctx, mission.id, {
      claimKey: "tenant-bound",
      statement: "Tenant A value is 42",
      normalizedValue: "42",
      evidence: [{ spanId: evidence.span.id }],
    });

    await expect(
      createClaim(ctx, mission.id, {
        claimKey: "foreign-owner",
        statement: "Invalid ownership",
        normalizedValue: "42",
        internalOwnerMembershipId: foreignCtx.membership.id,
      }),
    ).rejects.toMatchObject({ code: "TRUTH_NOT_FOUND" });
    await expect(
      getClaimLedger(foreignCtx, created.claim.id),
    ).rejects.toMatchObject({ code: "TRUTH_NOT_FOUND" });
    await expect(
      createEvidenceSource(foreignCtx, mission.id, {
        title: "Foreign source",
        canonicalUri: "https://example.test/foreign",
        sourceType: "WEB",
        independenceKey: "foreign",
      }),
    ).rejects.toMatchObject({ code: "TRUTH_NOT_FOUND" });
  });

  it("TK-11 serializes competing terminal truth changes", async () => {
    const { ctx, mission } = await approvedMission();
    const created = await createClaim(ctx, mission.id, {
      claimKey: "terminal-race",
      statement: "A bounded value may exist",
      hypothesis: true,
      falsificationCriterion: "A complete search or counterexample closes it",
    });

    const outcomes = await Promise.allSettled([
      assertHonestNull(ctx, created.claim.id, {
        rationale: "Search ended without a value",
        searchCompleteness: "OPEN_INCOMPLETE",
      }),
      setTerminalClaimState(
        ctx,
        created.claim.id,
        "FALSIFIED",
        "A counterexample was retained",
      ),
    ]);
    expect(outcomes.filter((outcome) => outcome.status === "fulfilled")).toHaveLength(1);
    expect(outcomes.filter((outcome) => outcome.status === "rejected")).toHaveLength(1);

    const ledger = await getClaimLedger(ctx, created.claim.id);
    expect(["HONEST_NULL", "FALSIFIED"]).toContain(ledger.state);
    await expect(
      addClaimVersion(ctx, created.claim.id, {
        statement: "Late assertion",
        normalizedValue: "late",
      }),
    ).rejects.toMatchObject({ code: "TRUTH_INVARIANT" });
  });

  it("TK-12 allows viewers to read truth but rejects governed writes", async () => {
    const { ctx, mission } = await approvedMission();
    const viewer = await createUser("truth-viewer");
    const invitation = await createInvitation(ctx, {
      email: viewer.email,
      role: "VIEWER",
    });
    await acceptInvitation(viewer, invitation.rawToken);
    const viewerCtx = await contextForMembership(viewer, ctx.workspace.id);

    await expect(
      listClaimProjection(viewerCtx, mission.id, "INTERNAL"),
    ).resolves.toEqual([]);
    await expect(
      createEvidenceSource(viewerCtx, mission.id, {
        title: "Viewer source",
        canonicalUri: "https://example.test/viewer",
        sourceType: "WEB",
        independenceKey: "viewer",
      }),
    ).rejects.toMatchObject({ code: "TRUTH_FORBIDDEN" });
  });
});
