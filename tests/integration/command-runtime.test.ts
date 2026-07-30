import pg from "pg";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  claimJobs,
  CommandEffectError,
  dispatchOutboxBatch,
  disposeDeadLetter,
  executeDurableCommand,
  failJob,
} from "@/modules/command-runtime";
import {
  acceptInvitation,
  createInvitation,
} from "@/modules/identity-workspace";
import { createMission } from "@/modules/mission-kernel";
import {
  createPortfolio,
  getOrganizationHierarchy,
} from "@/modules/organization";
import {
  getPortfolioOperationalProjection,
  getWorkspaceOperationalProjection,
  executeProjectionRebuildJob,
  requestWorkspaceProjectionRebuild,
} from "@/modules/projections";
import { getControlRoomProjection } from "@/server/control-room";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";

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

async function organizationId(workspaceId: string) {
  return (
    await getDb().workspace.findUniqueOrThrow({
      where: { id: workspaceId },
      select: { organizationId: true },
    })
  ).organizationId;
}

describe("durable command, job and projection plane (TIP-023E)", () => {
  it("CMD-01/02 serializes duplicate delivery and atomically retains success", async () => {
    const owner = await asOwner(await createUser("command-owner"));
    const mission = await createMission(owner, { title: "Command target" });
    let executions = 0;
    const deliver = () =>
      executeDurableCommand(
        owner,
        {
          idempotencyKey: "decision:duplicate-delivery",
          commandType: "decision.require",
          payload: { missionId: mission.id, question: "Ship?" },
          requiredCapability: "decisions.request",
          missionId: mission.id,
        },
        async (tx, command) => {
          executions += 1;
          const decision = await tx.decision.create({
            data: {
              workspaceId: owner.workspace.id,
              missionId: mission.id,
              decisionType: "SCOPE_CHANGE",
              question: "Ship?",
              proposedAction: "Review evidence",
              requestedByMembershipId: owner.membership.id,
            },
          });
          return {
            outcome: { decisionId: decision.id },
            outbox: [
              {
                topic: "decision.required",
                aggregateType: "Decision",
                aggregateId: decision.id,
                payload: {
                  decisionId: decision.id,
                  commandId: command.commandId,
                },
              },
            ],
          };
        },
      );

    const [first, duplicate] = await Promise.all([deliver(), deliver()]);
    expect(first).toEqual(duplicate);
    expect(first.status).toBe("SUCCEEDED");
    expect(executions).toBe(1);
    expect(
      await getDb().decision.count({
        where: { workspaceId: owner.workspace.id, question: "Ship?" },
      }),
    ).toBe(1);
    expect(
      await getDb().auditEvent.count({
        where: {
          workspaceId: owner.workspace.id,
          eventType: "command.succeeded",
        },
      }),
    ).toBe(1);
    await expect(
      executeDurableCommand(
        owner,
        {
          idempotencyKey: "decision:duplicate-delivery",
          commandType: "decision.require",
          payload: { missionId: mission.id, question: "Different?" },
          requiredCapability: "decisions.request",
          missionId: mission.id,
        },
        async () => {
          throw new Error("must not execute");
        },
      ),
    ).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });
  });

  it("CMD-02 rolls back a failed effect but retains one stable failure", async () => {
    const owner = await asOwner(await createUser("failure-owner"));
    const mission = await createMission(owner, { title: "Failure target" });
    const deliver = () =>
      executeDurableCommand(
        owner,
        {
          idempotencyKey: "decision:failed-effect",
          commandType: "decision.require",
          payload: { missionId: mission.id },
          requiredCapability: "decisions.request",
          missionId: mission.id,
        },
        async (tx) => {
          await tx.decision.create({
            data: {
              workspaceId: owner.workspace.id,
              missionId: mission.id,
              decisionType: "SCOPE_CHANGE",
              question: "Must roll back",
              proposedAction: "No effect",
              requestedByMembershipId: owner.membership.id,
            },
          });
          throw new CommandEffectError(
            "POLICY_REJECTED",
            "Governed policy rejected the effect",
          );
        },
      );
    const first = await deliver();
    const duplicate = await deliver();
    expect(first).toEqual(duplicate);
    expect(first).toMatchObject({
      status: "FAILED",
      errorCode: "POLICY_REJECTED",
    });
    expect(
      await getDb().decision.count({
        where: {
          workspaceId: owner.workspace.id,
          question: "Must roll back",
        },
      }),
    ).toBe(0);
    expect(
      await getDb().auditEvent.count({
        where: {
          workspaceId: owner.workspace.id,
          eventType: "command.failed",
        },
      }),
    ).toBe(1);
  });

  it("CMD-03/JOB-01/02 recovers leases and dead-letters bounded retries", async () => {
    const owner = await asOwner(await createUser("worker-owner"));
    const orgId = await organizationId(owner.workspace.id);
    await requestWorkspaceProjectionRebuild(owner, {
      idempotencyKey: "projection:lease-test",
    });
    const firstDispatch = await dispatchOutboxBatch({
      organizationId: orgId,
      actorUserId: owner.user.id,
      workerId: "dispatcher-a",
    });
    const duplicateDispatch = await dispatchOutboxBatch({
      organizationId: orgId,
      actorUserId: owner.user.id,
      workerId: "dispatcher-b",
    });
    expect(firstDispatch.dispatched).toBe(1);
    expect(duplicateDispatch.dispatched).toBe(0);
    const now = new Date("2026-07-30T12:00:00.000Z");
    const [claimed] = await claimJobs({
      organizationId: orgId,
      actorUserId: owner.user.id,
      workerId: "worker-a",
      leaseSeconds: 30,
      now,
    });
    expect(claimed).toMatchObject({ attempts: 1, status: "RUNNING" });
    expect(
      await claimJobs({
        organizationId: orgId,
        actorUserId: owner.user.id,
        workerId: "worker-b",
        now: new Date("2026-07-30T12:00:20.000Z"),
      }),
    ).toEqual([]);

    await withOrganizationTenant(orgId, owner.user.id, (tx) =>
      tx.durableJob.update({
        where: { id: claimed!.id },
        data: { maxAttempts: 2 },
      }),
    );
    const [recovered] = await claimJobs({
      organizationId: orgId,
      actorUserId: owner.user.id,
      workerId: "worker-b",
      now: new Date("2026-07-30T12:00:31.000Z"),
    });
    expect(recovered).toMatchObject({ attempts: 2, lockedBy: "worker-b" });
    const dead = await failJob({
      organizationId: orgId,
      actorUserId: owner.user.id,
      workerId: "worker-b",
      jobId: recovered!.id,
      expectedVersion: recovered!.version,
      errorCode: "POISONED",
      errorMessage: "Deterministic handler failure",
      now: new Date("2026-07-30T12:00:32.000Z"),
    });
    expect(dead.status).toBe("DEAD_LETTER");
    const events = await ownerQuery<{ event_type: string }>(
      `SELECT event_type FROM durable_job_event
       WHERE job_id = '${dead.id}' ORDER BY created_at, id`,
    );
    expect(events.map((event) => event.event_type)).toEqual([
      "CLAIMED",
      "CLAIMED",
      "DEAD_LETTERED",
    ]);
  });

  it("JOB-02 schedules a bounded retry before exhausting the attempt budget", async () => {
    const owner = await asOwner(await createUser("retry-owner"));
    const orgId = await organizationId(owner.workspace.id);
    const job = await withOrganizationTenant(orgId, owner.user.id, (tx) =>
      tx.durableJob.create({
        data: {
          organizationId: orgId,
          workspaceId: owner.workspace.id,
          jobType: "retry.fixture",
          payload: {},
          maxAttempts: 2,
        },
      }),
    );
    const now = new Date("2026-07-30T13:00:00.000Z");
    const [claimed] = await claimJobs({
      organizationId: orgId,
      actorUserId: owner.user.id,
      workerId: "retry-worker",
      now,
    });
    expect(claimed?.id).toBe(job.id);
    const retry = await failJob({
      organizationId: orgId,
      actorUserId: owner.user.id,
      workerId: "retry-worker",
      jobId: claimed!.id,
      expectedVersion: claimed!.version,
      errorCode: "TRANSIENT",
      errorMessage: "Temporary dependency failure",
      now,
    });
    expect(retry.status).toBe("READY");
    expect(retry.availableAt.toISOString()).toBe(
      "2026-07-30T13:00:30.000Z",
    );
    expect(
      await claimJobs({
        organizationId: orgId,
        actorUserId: owner.user.id,
        workerId: "early-worker",
        now: new Date("2026-07-30T13:00:29.999Z"),
      }),
    ).toEqual([]);
    const [second] = await claimJobs({
      organizationId: orgId,
      actorUserId: owner.user.id,
      workerId: "second-worker",
      now: retry.availableAt,
    });
    expect(second).toMatchObject({ id: job.id, attempts: 2 });
  });

  it("JOB-03 requires authority and retains dead-letter disposition", async () => {
    const owner = await asOwner(await createUser("disposition-owner"));
    const viewerUser = await createUser("disposition-viewer");
    const invitation = await createInvitation(owner, {
      email: viewerUser.email,
      role: "VIEWER",
    });
    await acceptInvitation(viewerUser, invitation.rawToken);
    const viewer = await contextForMembership(
      viewerUser,
      owner.workspace.id,
    );
    const orgId = await organizationId(owner.workspace.id);
    const job = await withOrganizationTenant(orgId, owner.user.id, (tx) =>
      tx.durableJob.create({
        data: {
          organizationId: orgId,
          workspaceId: owner.workspace.id,
          jobType: "poison.fixture",
          payload: {},
          status: "DEAD_LETTER",
          attempts: 1,
          maxAttempts: 1,
        },
      }),
    );
    await expect(
      disposeDeadLetter(viewer, {
        jobId: job.id,
        expectedVersion: job.version,
        action: "REQUEUE",
        reason: "Unauthorized retry",
      }),
    ).rejects.toThrow(/jobs\.manage/i);
    const requeued = await disposeDeadLetter(owner, {
      jobId: job.id,
      expectedVersion: job.version,
      action: "REQUEUE",
      reason: "Operator corrected deterministic input",
    });
    expect(requeued).toMatchObject({ status: "READY", attempts: 0 });
    expect(
      await getDb().auditEvent.count({
        where: {
          workspaceId: owner.workspace.id,
          eventType: "job.dead_letter_disposed",
        },
      }),
    ).toBe(1);
  });

  it("PROJ-01/02 incrementally serves Control Room and rebuilds after corruption", async () => {
    const owner = await asOwner(await createUser("projection-owner"));
    const orgId = await organizationId(owner.workspace.id);
    await createMission(owner, { title: "Projected mission" });
    const root = (await getOrganizationHierarchy(owner)).units[0]!;
    const portfolio = await createPortfolio(owner, {
      orgUnitId: root.id,
      portfolioKey: "autonomy",
      name: "Autonomy Portfolio",
    });
    await withOrganizationTenant(orgId, owner.user.id, (tx) =>
      tx.workspace.update({
        where: { id: owner.workspace.id },
        data: { portfolioId: portfolio.id },
      }),
    );
    const projected = await getWorkspaceOperationalProjection(owner);
    expect(projected.counts.missions).toBe(1);
    expect(projected.freshness.status).toBe("READY");
    expect(
      (await getPortfolioOperationalProjection(owner, portfolio.id)).counts
        .missions,
    ).toBe(1);

    const missionCount = vi.spyOn(getDb().mission, "count");
    const controlRoom = await getControlRoomProjection(owner);
    expect(controlRoom.counts.missions).toBe(1);
    expect(controlRoom.freshness.status).toBe("READY");
    expect(missionCount).not.toHaveBeenCalled();
    missionCount.mockRestore();

    await requestWorkspaceProjectionRebuild(owner, {
      idempotencyKey: "projection:rebuild-after-corruption",
    });
    await dispatchOutboxBatch({
      organizationId: orgId,
      actorUserId: owner.user.id,
      workerId: "projection-dispatcher",
    });
    const [job] = await claimJobs({
      organizationId: orgId,
      actorUserId: owner.user.id,
      workerId: "projection-worker",
    });
    await withOrganizationTenant(orgId, owner.user.id, (tx) =>
      tx.workspaceOperationalProjection.update({
        where: {
          organizationId_workspaceId: {
            organizationId: orgId,
            workspaceId: owner.workspace.id,
          },
        },
        data: { counts: { missions: 999 }, status: "FAILED" },
      }),
    );
    await executeProjectionRebuildJob({
      organizationId: orgId,
      actorUserId: owner.user.id,
      workerId: "projection-worker",
      jobId: job!.id,
      expectedVersion: job!.version,
    });
    const rebuilt = await getWorkspaceOperationalProjection(owner);
    expect(rebuilt.counts.missions).toBe(1);
    expect(rebuilt.status).toBe("READY");
    expect(rebuilt.lastJobId).toBe(job!.id);
  });

  it("DATA-01 forces transaction-local tenant isolation on the durable plane", async () => {
    const ownerA = await asOwner(await createUser("durable-rls-a"));
    const ownerB = await asOwner(await createUser("durable-rls-b"));
    const orgA = await organizationId(ownerA.workspace.id);
    const orgB = await organizationId(ownerB.workspace.id);
    await requestWorkspaceProjectionRebuild(ownerA, {
      idempotencyKey: "projection:tenant-a",
    });
    await requestWorkspaceProjectionRebuild(ownerB, {
      idempotencyKey: "projection:tenant-b",
    });
    const runtime = new pg.Client({
      connectionString: process.env.DATABASE_URL,
    });
    await runtime.connect();
    try {
      await runtime.query("BEGIN");
      await runtime.query(
        "SELECT set_config('hiveos.organization_id', $1, true)",
        [orgA],
      );
      expect(
        (
          await runtime.query(
            "SELECT organization_id FROM command_record ORDER BY id",
          )
        ).rows,
      ).toEqual([{ organization_id: orgA }]);
      const foreign = await runtime.query(
        "SELECT id FROM durable_job WHERE organization_id = $1",
        [orgB],
      );
      expect(foreign.rows).toEqual([]);
      await runtime.query("ROLLBACK");
    } finally {
      await runtime.end();
    }
  });
});
