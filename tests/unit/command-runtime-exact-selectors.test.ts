import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TenantTransaction } from "@/server/tenant-context";

const seam = vi.hoisted(() => ({ tenant: vi.fn() }));
vi.mock("@/server/tenant-context", () => ({ withOrganizationTenant: seam.tenant }));
vi.mock("@/modules/authorization", () => ({
  organizationIdForWorkspace: vi.fn(), requireWorkspaceAuthorization: vi.fn(),
}));
vi.mock("@/modules/identity-workspace/audit", () => ({
  AuditEventType: {}, writeAuditEvent: vi.fn(),
}));

import { claimJobs } from "@/modules/command-runtime/jobs";
import { dispatchOutboxBatch } from "@/modules/command-runtime/kernel";

const NOW = new Date("2026-10-04T00:00:00Z");
const EARLIER = new Date(NOW.getTime() - 60_000);
const LATER = new Date(NOW.getTime() + 60_000);
const BASE = { organizationId: "tenant-a", actorUserId: "actor-a", workerId: "tip062", now: NOW };

type Row = {
  id: string; organizationId: string; workspaceId: string;
  status: string; jobType: string; availableAt: Date; leaseExpiresAt: Date | null;
  attempts: number; maxAttempts: number; priority: number; version: number;
  lockedBy: string | null; payload: Record<string, unknown>; outboxEventId?: string;
};

function row(id: string, overrides: Partial<Row> = {}): Row {
  return {
    id, organizationId: "tenant-a", workspaceId: "workspace-a", status: "READY",
    jobType: "research.math.codex", availableAt: EARLIER, leaseExpiresAt: null,
    attempts: 0, maxAttempts: 3, priority: 10, version: 0, lockedBy: null,
    payload: { caseId: "case-a" }, ...overrides,
  };
}

// Interpret only the selection predicates emitted by these two production seams.
// This is not a PostgreSQL/RLS/lock simulator: SQL shape assertions below cover
// SKIP LOCKED and predicate-before-LIMIT preservation without executing a DB.
function bindings(sql: Prisma.Sql, pattern: RegExp) {
  const match = pattern.exec(sql.sql);
  if (!match) return undefined;
  const offset = (sql.sql.slice(0, match.index).match(/\?/g) ?? []).length;
  const count = (match[0].match(/\?/g) ?? []).length;
  return sql.values.slice(offset, offset + count);
}

function harness(jobs: Row[] = [], outboxes: Row[] = []) {
  const queries: Prisma.Sql[] = [];
  const mutations: Array<{ kind: string; id: string }> = [];
  const events: Record<string, unknown>[] = [];
  const update = (rows: Row[], kind: string, args: { where: { id: string; organizationId: string }; data: Record<string, unknown> }) => {
    const found = rows.find((candidate) => candidate.id === args.where.id && candidate.organizationId === args.where.organizationId);
    if (!found) throw new Error("Scoped mutation target missing");
    mutations.push({ kind, id: found.id });
    for (const [key, value] of Object.entries(args.data)) {
      const target = found as unknown as Record<string, unknown>;
      target[key] = value && typeof value === "object" && "increment" in value
        ? Number(target[key]) + Number(value.increment) : value;
    }
    return { ...found };
  };
  const tx = {
    $queryRaw: vi.fn(async (strings: TemplateStringsArray, ...values: unknown[]) => {
      const sql = Prisma.sql(strings, ...values);
      queries.push(sql);
      const tenant = bindings(sql, /organization_id = \?/u)?.[0];
      const ids = bindings(sql, /AND id IN \([^)]*\)/u);
      const types = bindings(sql, /AND job_type IN \([^)]*\)/u);
      const limit = Number(bindings(sql, /LIMIT \?/u)?.[0]);
      const source = sql.sql.includes("FROM outbox_event") ? outboxes : jobs;
      const exhausted = sql.sql.includes("attempts >= max_attempts");
      if (sql.sql.includes("AND FALSE")) return [];
      return source.filter((candidate) => {
        if (candidate.organizationId !== tenant || (ids && !ids.includes(candidate.id)) || (types && !types.includes(candidate.jobType))) return false;
        if (source === outboxes) return candidate.status === "PENDING" && candidate.availableAt <= NOW;
        const expired = candidate.status === "RUNNING" && candidate.leaseExpiresAt !== null && candidate.leaseExpiresAt <= NOW;
        return exhausted ? expired && candidate.attempts >= candidate.maxAttempts
          : candidate.attempts < candidate.maxAttempts && (expired || (candidate.status === "READY" && candidate.availableAt <= NOW));
      }).sort((a, b) => a.id.localeCompare(b.id)).slice(0, limit).map((candidate) => ({
        id: candidate.id, workspace_id: candidate.workspaceId, attempts: candidate.attempts,
      }));
    }),
    durableJob: {
      update: vi.fn(async (args) => update(jobs, "job", args)),
      upsert: vi.fn(async (args) => {
        const selector = args.where.organizationId_outboxEventId;
        const prior = jobs.find((candidate) => candidate.organizationId === selector.organizationId && candidate.outboxEventId === selector.outboxEventId);
        if (prior) return prior;
        const created = row(`job-${selector.outboxEventId}`, { ...args.create, jobType: args.create.jobType });
        jobs.push(created);
        mutations.push({ kind: "create-job", id: created.id });
        return created;
      }),
    },
    durableJobEvent: { create: vi.fn(async (args) => { events.push(args.data); return args.data; }) },
    outboxEvent: {
      findMany: vi.fn(async (args) => outboxes.filter((candidate) => candidate.organizationId === args.where.organizationId && args.where.id.in.includes(candidate.id)).slice(0, args.take).map((candidate) => ({ ...candidate, topic: candidate.jobType }))),
      update: vi.fn(async (args) => update(outboxes, "outbox", args)),
    },
  };
  seam.tenant.mockImplementation(async (tenant: string, actor: string, operation: (transaction: TenantTransaction) => Promise<unknown>) => {
    expect(tenant).toBe(BASE.organizationId);
    expect(actor).toBe(BASE.actorUserId);
    return operation(tx as unknown as TenantTransaction);
  });
  return { jobs, outboxes, queries, mutations, events, tx };
}

beforeEach(() => vi.clearAllMocks());

describe("TIP-062 exact job selection", () => {
  it("claims only target and leaves unrelated ready, expired, exhausted and foreign work unchanged", async () => {
    const jobs = [row("a-ready"), row("b-expired", { status: "RUNNING", attempts: 1, leaseExpiresAt: EARLIER }),
      row("c-exhausted", { status: "RUNNING", attempts: 3, leaseExpiresAt: EARLIER }),
      row("d-foreign", { organizationId: "tenant-b" }), row("z-target")];
    const unchanged = structuredClone(jobs.slice(0, 4));
    const h = harness(jobs);
    const result = await claimJobs({ ...BASE, first: 1, leaseSeconds: 1800, jobIds: ["z-target"] });
    expect(result.map((job) => job.id)).toEqual(["z-target"]);
    expect(jobs.slice(0, 4)).toEqual(unchanged);
    expect(h.mutations).toEqual([{ kind: "job", id: "z-target" }]);
    expect(result[0]).toMatchObject({ attempts: 1, version: 1, lockedBy: "tip062", leaseExpiresAt: new Date(NOW.getTime() + 1_800_000) });
    expect(h.events).toHaveLength(1);
    expect(h.events[0]).toMatchObject({ organizationId: "tenant-a", jobId: "z-target", eventType: "CLAIMED", attemptNumber: 1 });
  });

  it("cleans only selected exhausted lease and retains one terminal event", async () => {
    const unrelated = row("a-exhausted", { status: "RUNNING", attempts: 3, leaseExpiresAt: EARLIER });
    const target = row("z-exhausted", { status: "RUNNING", attempts: 3, leaseExpiresAt: EARLIER });
    const before = structuredClone(unrelated);
    const h = harness([unrelated, target]);
    expect(await claimJobs({ ...BASE, first: 1, jobIds: [target.id] })).toEqual([]);
    expect(unrelated).toEqual(before);
    expect(target).toMatchObject({ status: "DEAD_LETTER", version: 1, attempts: 3, leaseExpiresAt: null, lockedBy: null });
    expect(h.events).toMatchObject([{ jobId: target.id, eventType: "DEAD_LETTERED", attemptNumber: 3 }]);
  });

  it.each([{ jobIds: [] }, { jobIds: ["foreign"] }, { jobIds: ["missing"] }])("never widens empty/foreign/absent selectors $jobIds", async ({ jobIds }) => {
    const jobs = [row("ready"), row("expired", { status: "RUNNING", attempts: 3, leaseExpiresAt: EARLIER }), row("foreign", { organizationId: "tenant-b" })];
    const before = structuredClone(jobs);
    const h = harness(jobs);
    expect(await claimJobs({ ...BASE, jobIds })).toEqual([]);
    expect(jobs).toEqual(before);
    expect(h.mutations).toEqual([]);
    expect(h.events).toEqual([]);
  });

  it("intersects exact IDs with job type, readiness and lease predicates", async () => {
    const jobs = [row("wrong-type", { jobType: "other" }), row("future", { availableAt: LATER }),
      row("leased", { status: "RUNNING", leaseExpiresAt: LATER }), row("done", { status: "SUCCEEDED" }),
      row("retry", { status: "RUNNING", attempts: 1, leaseExpiresAt: EARLIER })];
    harness(jobs);
    expect((await claimJobs({ ...BASE, jobIds: jobs.map((job) => job.id), jobTypes: ["research.math.codex"] })).map((job) => job.id)).toEqual(["retry"]);
  });

  it("preserves absent-selector batch and cleanup behavior", async () => {
    const h = harness([row("ready"), row("expired", { status: "RUNNING", leaseExpiresAt: EARLIER, attempts: 1 }), row("exhausted", { status: "RUNNING", leaseExpiresAt: EARLIER, attempts: 3 })]);
    expect((await claimJobs(BASE)).map((job) => job.id)).toEqual(["expired", "ready"]);
    expect(h.jobs.find((job) => job.id === "exhausted")?.status).toBe("DEAD_LETTER");
    expect(h.queries.every((sql) => !sql.sql.includes("AND id IN") && !sql.sql.includes("AND FALSE"))).toBe(true);
  });

  it("applies job type filter to selected exhausted cleanup", async () => {
    const wrong = row("wrong", { jobType: "other", status: "RUNNING", leaseExpiresAt: EARLIER, attempts: 3 });
    const target = row("target", { status: "RUNNING", leaseExpiresAt: NOW, attempts: 3 });
    const before = structuredClone(wrong);
    const h = harness([wrong, target]);
    expect(await claimJobs({ ...BASE, jobIds: [wrong.id, target.id], jobTypes: ["research.math.codex"] })).toEqual([]);
    expect(wrong).toEqual(before);
    expect(target.status).toBe("DEAD_LETTER");
    expect(h.events).toHaveLength(1);
  });

  it("emits explicit false selection for both queries while preserving tenant wrapper", async () => {
    const h = harness();
    await claimJobs({ ...BASE, jobIds: [] });
    expect(seam.tenant).toHaveBeenCalledTimes(1);
    expect(h.queries).toHaveLength(2);
    expect(h.queries.every((sql) => sql.sql.includes("AND FALSE"))).toBe(true);
  });

  it("snapshots caller job IDs before asynchronous work", async () => {
    const h = harness();
    const jobIds = ["target"];
    const work = claimJobs({ ...BASE, jobIds });
    jobIds.push("unrelated");
    await work;
    for (const sql of h.queries) expect(bindings(sql, /AND id IN \([^)]*\)/u)).toEqual(["target"]);
  });

  it("binds ID filters before both atomic query limits", async () => {
    const h = harness();
    await claimJobs({ ...BASE, jobIds: ["id-a", "id-a", "id-b"], first: 1 });
    expect(h.queries).toHaveLength(2);
    for (const sql of h.queries) {
      expect(bindings(sql, /AND id IN \([^)]*\)/u)).toEqual(["id-a", "id-b"]);
      expect(sql.sql.indexOf("AND id IN")).toBeLessThan(sql.sql.indexOf("LIMIT"));
      expect(sql.sql).toContain("FOR UPDATE SKIP LOCKED");
      expect(sql.sql).toContain("WHERE organization_id = ?");
      expect(sql.sql).not.toContain("id-a");
    }
  });
});

describe("TIP-062 exact outbox selection", () => {
  it("dispatches only target before first limit and preserves foreign/unrelated/premature outboxes", async () => {
    const outboxes = [row("a-unrelated", { status: "PENDING" }), row("b-foreign", { status: "PENDING", organizationId: "tenant-b" }),
      row("c-future", { status: "PENDING", availableAt: LATER }), row("z-target", { status: "PENDING" })];
    const before = structuredClone(outboxes.slice(0, 3));
    const h = harness([], outboxes);
    expect(await dispatchOutboxBatch({ ...BASE, first: 1, outboxIds: ["z-target"] })).toEqual({ workerId: "tip062", dispatched: 1, jobIds: ["job-z-target"] });
    expect(outboxes.slice(0, 3)).toEqual(before);
    expect(outboxes[3]).toMatchObject({ status: "DISPATCHED", version: 1, dispatchedAt: NOW });
    expect(h.jobs).toHaveLength(1);
    expect(h.jobs[0]).toMatchObject({ organizationId: "tenant-a", workspaceId: "workspace-a", outboxEventId: "z-target" });
    expect(h.tx.outboxEvent.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { organizationId: "tenant-a", id: { in: ["z-target"] } }, take: 1 }));
  });

  it.each([{ outboxIds: [] }, { outboxIds: ["foreign"] }, { outboxIds: ["missing"] }])("never widens empty/foreign/absent outbox selectors $outboxIds", async ({ outboxIds }) => {
    const outboxes = [row("pending", { status: "PENDING" }), row("foreign", { status: "PENDING", organizationId: "tenant-b" })];
    const before = structuredClone(outboxes);
    const h = harness([], outboxes);
    expect(await dispatchOutboxBatch({ ...BASE, outboxIds })).toMatchObject({ dispatched: 0, jobIds: [] });
    expect(outboxes).toEqual(before);
    expect(h.mutations).toEqual([]);
  });

  it("does not redispatch terminal targets or duplicate their durable jobs", async () => {
    const h = harness([], [row("target", { status: "PENDING" })]);
    await dispatchOutboxBatch({ ...BASE, outboxIds: ["target", "target"] });
    expect(await dispatchOutboxBatch({ ...BASE, outboxIds: ["target"] })).toMatchObject({ dispatched: 0, jobIds: [] });
    expect(h.jobs).toHaveLength(1);
    expect(h.tx.durableJob.upsert).toHaveBeenCalledTimes(1);
  });

  it("preserves absent-selector dispatch behavior", async () => {
    const h = harness([], [row("a", { status: "PENDING" }), row("b", { status: "PENDING" })]);
    expect(await dispatchOutboxBatch(BASE)).toMatchObject({ dispatched: 2 });
    expect(h.queries[0].sql).not.toContain("AND id IN");
    expect(h.queries[0].sql).not.toContain("AND FALSE");
  });

  it("binds exact IDs before atomic limit and snapshots caller selection", async () => {
    const h = harness();
    const outboxIds = ["id-a", "id-a", "id-b"];
    const work = dispatchOutboxBatch({ ...BASE, outboxIds, first: 1 });
    outboxIds.push("unrelated");
    await work;
    const sql = h.queries[0];
    expect(bindings(sql, /AND id IN \([^)]*\)/u)).toEqual(["id-a", "id-b"]);
    expect(sql.sql.indexOf("AND id IN")).toBeLessThan(sql.sql.indexOf("LIMIT"));
    expect(sql.sql).toContain("FOR UPDATE SKIP LOCKED");
    expect(sql.sql).toContain("WHERE organization_id = ?");
    expect(sql.sql).not.toContain("id-a");
  });
});

describe("TIP-062 selector validation and unchanged bounds", () => {
  const malformed: Array<{ label: string; value: unknown }> = [
    { label: "null", value: null }, { label: "scalar", value: "id" }, { label: "object", value: {} },
    { label: "empty ID", value: [""] }, { label: "space", value: [" "] }, { label: "leading space", value: [" id"] },
    { label: "embedded whitespace", value: ["id id"] }, { label: "control", value: ["id\u0000"] },
    { label: "nonstring", value: [42] }, { label: "mixed", value: ["id", null] },
    { label: "sparse", value: new Array(1) }, { label: "long", value: ["x".repeat(201)] },
    { label: "large list", value: Array.from({ length: 101 }, (_, i) => `id-${i}`) },
  ];
  it.each(malformed)("refuses malformed job selector $label before tenant/SQL", async ({ value }) => {
    harness();
    await expect(claimJobs({ ...BASE, jobIds: value as string[] })).rejects.toMatchObject({ code: "INVALID_INPUT" });
    expect(seam.tenant).not.toHaveBeenCalled();
  });
  it.each(malformed)("refuses malformed outbox selector $label before tenant/SQL", async ({ value }) => {
    harness();
    await expect(dispatchOutboxBatch({ ...BASE, outboxIds: value as string[] })).rejects.toMatchObject({ code: "INVALID_INPUT" });
    expect(seam.tenant).not.toHaveBeenCalled();
  });
  it("admits maximum100 IDs without widening original first/lease caps", async () => {
    const h = harness();
    const ids = Array.from({ length: 100 }, (_, i) => `id-${i}`);
    await claimJobs({ ...BASE, jobIds: ids, first: 50, leaseSeconds: 3600 });
    await dispatchOutboxBatch({ ...BASE, outboxIds: ids, first: 100 });
    expect(h.queries).toHaveLength(3);
    await expect(claimJobs({ ...BASE, jobIds: ids, first: 51 })).rejects.toMatchObject({ code: "INVALID_INPUT" });
    await expect(claimJobs({ ...BASE, jobIds: ids, leaseSeconds: 3601 })).rejects.toMatchObject({ code: "INVALID_INPUT" });
    await expect(dispatchOutboxBatch({ ...BASE, outboxIds: ids, first: 101 })).rejects.toMatchObject({ code: "INVALID_INPUT" });
  });

  it("admits a 200-character exact ID and rejects repeated IDs beyond list cap", async () => {
    const h = harness();
    const id = "x".repeat(200);
    await claimJobs({ ...BASE, jobIds: [id] });
    await dispatchOutboxBatch({ ...BASE, outboxIds: [id] });
    expect(h.queries).toHaveLength(3);
    await expect(claimJobs({ ...BASE, jobIds: Array(101).fill(id) })).rejects.toMatchObject({ code: "INVALID_INPUT" });
    await expect(dispatchOutboxBatch({ ...BASE, outboxIds: Array(101).fill(id) })).rejects.toMatchObject({ code: "INVALID_INPUT" });
  });
});
