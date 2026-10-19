import { beforeEach, describe, expect, it } from "vitest";

import type { AssuranceProfile } from "@prisma/client";

import type { WorkspaceContext } from "@/modules/identity-workspace";
import {
  acceptInvitation,
  createInvitation,
} from "@/modules/identity-workspace";
import {
  addObligation,
  addRequirement,
  approveContract,
  createMission,
  evaluateGate,
  getMissionDetail,
  getMissionProgress,
  requestAssuranceChange,
  requestCancellation,
  requestObligationWaiver,
  resolveDecision,
  submitContract,
  transitionMission,
  updateObligationStatus,
} from "@/modules/mission-kernel";
import { getDb } from "@/server/db";

import { asOwner, contextForMembership, createUser, ownerQuery, truncateAll } from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

async function memberCtx(ownerCtx: WorkspaceContext, role: "ADMIN" | "MEMBER" | "VIEWER") {
  const user = await createUser(role.toLowerCase());
  const invite = await createInvitation(ownerCtx, { email: user.email, role });
  await acceptInvitation(user, invite.rawToken);
  return contextForMembership(user, ownerCtx.workspace.id);
}

async function scaffoldToScoped(ctx: WorkspaceContext, profile: AssuranceProfile = "PROFESSIONAL", weight = 5) {
  const mission = await createMission(ctx, {
    title: "Assess claim", assuranceProfile: profile, objective: "o", scope: "s", successDefinition: "d",
  });
  await addRequirement(ctx, mission.currentContractId!, {
    code: "REQ-1", title: "Requirement", description: "r", acceptanceCriteria: "criteria",
  });
  await addObligation(ctx, mission.currentContractId!, {
    code: "OBL-1", title: "Obligation", description: "o", weight, closureRule: "manual",
  });
  await transitionMission(ctx, mission.id, "INTAKE", { reason: "intake" });
  await transitionMission(ctx, mission.id, "SCOPED", { reason: "scoped" });
  return mission;
}

async function scaffoldApproved(ctx: WorkspaceContext, profile: AssuranceProfile = "PROFESSIONAL") {
  const mission = await scaffoldToScoped(ctx, profile);
  await submitContract(ctx, mission.id);
  await approveContract(ctx, mission.id);
  return mission;
}

describe("mission creation & isolation", () => {
  it("MK-01 creation is workspace-scoped and idempotent", async () => {
    const ctx = await asOwner(await createUser("o"));
    const a = await createMission(ctx, { title: "M", idempotencyKey: "k1" });
    const b = await createMission(ctx, { title: "M again", idempotencyKey: "k1" });
    expect(b.id).toBe(a.id);
    expect(await getDb().mission.count({ where: { workspaceId: ctx.workspace.id } })).toBe(1);
    expect(a.referenceCode).toMatch(/^M-\d{4}$/);
  });

  it("MK-02 cross-workspace mission lookup is non-disclosing", async () => {
    const ctxA = await asOwner(await createUser("a"));
    const ctxB = await asOwner(await createUser("b"));
    const m = await createMission(ctxA, { title: "secret" });
    await expect(getMissionDetail(ctxB, m.id)).rejects.toMatchObject({ code: "MISSION_NOT_FOUND" });
  });

  it("MK-03 member can create and edit a draft contract", async () => {
    const owner = await asOwner(await createUser("o"));
    const member = await memberCtx(owner, "MEMBER");
    const m = await createMission(member, { title: "member mission" });
    await expect(
      addRequirement(member, m.currentContractId!, { code: "R1", title: "t", description: "d", acceptanceCriteria: "c" }),
    ).resolves.toBeTruthy();
  });

  it("MK-04 viewer cannot create missions", async () => {
    const owner = await asOwner(await createUser("o"));
    const viewer = await memberCtx(owner, "VIEWER");
    await expect(createMission(viewer, { title: "x" })).rejects.toMatchObject({ code: "MISSION_FORBIDDEN" });
  });
});

describe("contract lifecycle", () => {
  it("MK-05 submission rejects incomplete contracts", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await createMission(ctx, { title: "M", objective: "o", scope: "s", successDefinition: "d" });
    await transitionMission(ctx, m.id, "INTAKE", { reason: "i" });
    await transitionMission(ctx, m.id, "SCOPED", { reason: "s" });
    await expect(submitContract(ctx, m.id)).rejects.toMatchObject({ code: "CONTRACT_INCOMPLETE" });
  });

  it("MK-06 approval creates version, obligations, gates and audits atomically", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx, "RESEARCH");
    const detail = await getMissionDetail(ctx, m.id);
    expect(detail.mission.status).toBe("APPROVED");
    expect(detail.mission.approvedContractId).toBeTruthy();
    expect(detail.obligations.length).toBe(1);
    // RESEARCH seeds an independent-verification gate (open, never passed).
    expect(detail.gates.length).toBe(1);
    expect(detail.gates[0].status).toBe("OPEN");
    const audits = await getDb().auditEvent.findMany({ where: { workspaceId: ctx.workspace.id, eventType: "contract.approved" } });
    expect(audits.length).toBe(1);
  });

  it("MK-07 approval is restricted to authorized roles", async () => {
    const owner = await asOwner(await createUser("o"));
    const member = await memberCtx(owner, "MEMBER");
    const m = await scaffoldToScoped(owner);
    await submitContract(owner, m.id);
    await expect(approveContract(member, m.id)).rejects.toMatchObject({ code: "MISSION_FORBIDDEN" });
  });

  it("MK-08 approved contract definitions cannot be edited or deleted", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx);
    const contractId = m.currentContractId!;
    // Service-level: adding to a non-draft contract is rejected.
    await expect(
      addRequirement(ctx, contractId, { code: "R2", title: "t", description: "d", acceptanceCriteria: "c" }),
    ).rejects.toMatchObject({ code: "MISSION_INVARIANT" });
    // Database-level: raw update of a frozen definition is blocked by trigger.
    await expect(
      ownerQuery(`UPDATE requirement SET title='x' WHERE contract_id='${contractId}'`),
    ).rejects.toThrow(/frozen/);
  });

  it("MK-14 duplicate approval creates no duplicate obligations or gates", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx, "RESEARCH");
    await expect(approveContract(ctx, m.id)).rejects.toMatchObject({ code: "CONTRACT_ALREADY_APPROVED" });
    expect(await getDb().runtimeObligation.count({ where: { missionId: m.id } })).toBe(1);
    expect(await getDb().runtimeGate.count({ where: { missionId: m.id } })).toBe(1);
  });

  it("MK-09 amendment creates a new version and a required Decision", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx);
    const decision = await requestAssuranceChange(ctx, m.id, "RESEARCH", "add rigor");
    expect(decision.status).toBe("REQUIRED");
    await resolveDecision(ctx, decision.id, true, "ok");
    const versions = await getDb().missionContract.count({ where: { missionId: m.id } });
    expect(versions).toBe(2);
  });

  it("MK-10 assurance downgrade requires an approved material Decision", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx, "RESEARCH");
    const decision = await requestAssuranceChange(ctx, m.id, "QUICK", "downgrade");
    expect(decision.decisionType).toBe("ASSURANCE_DOWNGRADE");
    await resolveDecision(ctx, decision.id, true, "approved");
    const draft = await getDb().missionContract.findFirst({ where: { missionId: m.id, status: "DRAFT" } });
    expect(draft?.assuranceProfile).toBe("QUICK");
  });
});

describe("transitions", () => {
  it("MK-11 primary transitions succeed only from the exact source", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await createMission(ctx, { title: "M" });
    // INTAKE→SCOPED before DRAFT→INTAKE is invalid.
    await expect(transitionMission(ctx, m.id, "SCOPED", { reason: "x" })).rejects.toMatchObject({ code: "INVALID_MISSION_TRANSITION" });
    await transitionMission(ctx, m.id, "INTAKE", { reason: "i" });
    await expect(transitionMission(ctx, m.id, "SCOPED", { reason: "s" })).resolves.toBeUndefined();
  });

  it("MK-16 Truth exploration is enabled while execution still fails closed", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx);
    await transitionMission(ctx, m.id, "EXPLORING", { reason: "begin truth loop" });
    await expect(transitionMission(ctx, m.id, "BUILDING", { reason: "go" })).rejects.toMatchObject({ code: "EXECUTION_FABRIC_REQUIRED" });
    // Failed later-kernel transition causes no partial mutation.
    const after = await getDb().mission.findUniqueOrThrow({ where: { id: m.id } });
    expect(after.status).toBe("EXPLORING");
  });

  it("MK-24 direct decision-gated transitions require a material decision", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx);
    await expect(transitionMission(ctx, m.id, "CANCELLED", { reason: "stop" })).rejects.toMatchObject({ code: "MATERIAL_DECISION_REQUIRED" });
    const decision = await requestCancellation(ctx, m.id, "no longer needed");
    await resolveDecision(ctx, decision.id, true, "ok");
    const after = await getDb().mission.findUniqueOrThrow({ where: { id: m.id } });
    expect(after.status).toBe("CANCELLED");
  });

  it("MK-22/23 BLOCKED preserves prior state + escalation; resume restores it", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx);
    await transitionMission(ctx, m.id, "BLOCKED", { reason: "waiting on input" });
    const blocked = await getDb().mission.findUniqueOrThrow({ where: { id: m.id } });
    expect(blocked.status).toBe("BLOCKED");
    expect(blocked.blockedFromStatus).toBe("APPROVED");
    expect(await getDb().escalation.count({ where: { missionId: m.id, status: "OPEN" } })).toBe(1);

    // Resume must return to the recorded prior state.
    await expect(transitionMission(ctx, m.id, "INTAKE", { reason: "wrong" })).rejects.toMatchObject({ code: "INVALID_MISSION_TRANSITION" });
    await transitionMission(ctx, m.id, "APPROVED", { reason: "input received" });
    const resumed = await getDb().mission.findUniqueOrThrow({ where: { id: m.id } });
    expect(resumed.status).toBe("APPROVED");
    expect(resumed.blockedFromStatus).toBeNull();
  });
});

describe("obligations, gates, progress", () => {
  it("MK-17 progress is unavailable before approval", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldToScoped(ctx);
    expect(await getMissionProgress(ctx, m.id)).toBeNull();
  });

  it("MK-18/19 progress derives from closed and total weights", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx);
    const obl = await getDb().runtimeObligation.findFirstOrThrow({ where: { missionId: m.id } });
    let progress = await getMissionProgress(ctx, m.id);
    expect(progress).toMatchObject({ closedWeight: 0, totalWeight: 5, basisPoints: 0 });
    await updateObligationStatus(ctx, obl.id, "SATISFIED", "done");
    progress = await getMissionProgress(ctx, m.id);
    expect(progress).toMatchObject({ closedWeight: 5, totalWeight: 5, basisPoints: 10000 });
  });

  it("MK-18A exposes the latest accountable obligation activity", async () => {
    const ctx = await asOwner(await createUser("obligation-operator"));
    const m = await scaffoldApproved(ctx);
    const obligation = await getDb().runtimeObligation.findFirstOrThrow({
      where: { missionId: m.id },
    });

    await updateObligationStatus(ctx, obligation.id, "IN_PROGRESS", "started");
    const detail = await getMissionDetail(ctx, m.id);

    expect(detail.obligationActivity).toHaveLength(1);
    expect(detail.obligationActivity[0]).toMatchObject({
      obligationId: obligation.id,
      latest: {
        eventType: "obligation.started",
      },
    });
    expect(detail.obligationActivity[0]?.latest?.actorName).toBeTruthy();
    expect(detail.obligationActivity[0]?.latest?.occurredAt).toBeInstanceOf(Date);
  });

  it("MK-20 required-obligation waiver requires an approved Decision", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx);
    const obl = await getDb().runtimeObligation.findFirstOrThrow({ where: { missionId: m.id } });
    // No direct WAIVED path via ordinary update.
    // @ts-expect-error WAIVED is not an accepted ordinary status
    await expect(updateObligationStatus(ctx, obl.id, "WAIVED", "x")).rejects.toBeTruthy();
    const decision = await requestObligationWaiver(ctx, m.id, obl.id, "not applicable");
    await resolveDecision(ctx, decision.id, true, "approved");
    const after = await getDb().runtimeObligation.findUniqueOrThrow({ where: { id: obl.id } });
    expect(after.status).toBe("WAIVED");
  });

  it("MK-21 obligation weight cannot change after approval", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx);
    const contract = await getDb().missionContract.findFirstOrThrow({ where: { missionId: m.id, status: "APPROVED" } });
    await expect(
      ownerQuery(`UPDATE contract_obligation SET weight=999 WHERE contract_id='${contract.id}'`),
    ).rejects.toThrow(/frozen/);
  });

  it("MK-25/26 gate PASS/FAIL/INCOMPLETE are distinct; INCOMPLETE never passes", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx, "RESEARCH");
    const gate = await getDb().runtimeGate.findFirstOrThrow({ where: { missionId: m.id } });
    await evaluateGate(ctx, gate.id, "INCOMPLETE", "not enough evidence");
    let g = await getDb().runtimeGate.findUniqueOrThrow({ where: { id: gate.id } });
    expect(g.status).toBe("OPEN"); // INCOMPLETE never satisfies
    await evaluateGate(ctx, gate.id, "FAIL", "failed");
    g = await getDb().runtimeGate.findUniqueOrThrow({ where: { id: gate.id } });
    expect(g.status).toBe("FAILED");
    await evaluateGate(ctx, gate.id, "PASS", "passed");
    g = await getDb().runtimeGate.findUniqueOrThrow({ where: { id: gate.id } });
    expect(g.status).toBe("PASSED");
    const runs = await getDb().gateRun.findMany({ where: { runtimeGateId: gate.id } });
    expect(runs.map((r) => r.result).sort()).toEqual(["FAIL", "INCOMPLETE", "PASS"]);
    // GateRun is append-only for the runtime role.
    await expect(getDb().$executeRawUnsafe(`UPDATE gate_run SET result='PASS' WHERE id='${runs[0].id}'`)).rejects.toThrow(/append-only|permission denied/i);
  });
});

describe("audit & authority", () => {
  it("MK-15 gate evaluations are recorded as HUMAN_COMMAND (no provider authority)", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx, "RESEARCH");
    const gate = await getDb().runtimeGate.findFirstOrThrow({ where: { missionId: m.id } });
    await evaluateGate(ctx, gate.id, "PASS", "ok");
    const run = await getDb().gateRun.findFirstOrThrow({ where: { runtimeGateId: gate.id } });
    expect(run.actorType).toBe("HUMAN_COMMAND");
  });

  it("MK-28 governed mutations record actor, reason, before/after and correlation", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await scaffoldApproved(ctx);
    await transitionMission(ctx, m.id, "BLOCKED", { reason: "waiting" });
    const event = await getDb().auditEvent.findFirstOrThrow({
      where: { workspaceId: ctx.workspace.id, eventType: "mission.blocked" },
    });
    expect(event.actorMembershipId).toBe(ctx.membership.id);
    expect(event.correlationId).toBeTruthy();
    const payload = event.payload as Record<string, unknown>;
    expect(payload.from).toBe("APPROVED");
    expect(payload.reason).toBe("waiting");
  });
});
