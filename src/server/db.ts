import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg, { type PoolClient } from "pg";

import { getEnv } from "./env";
import type { Env } from "./env";
import { writeOperationalEvent } from "./observability/operational-log";

/**
 * Prisma client singleton. Next.js dev-mode hot reload re-evaluates modules,
 * so the instance is parked on globalThis to avoid connection exhaustion.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const serializedClients = new WeakSet<PoolClient>();

/**
 * Prisma can expand one relation read into several driver calls on the same
 * checked-out pg client. pg 8 deprecates overlapping calls on one client and
 * pg 9 removes them, so enforce a per-client FIFO at the adapter boundary.
 * Pool-level concurrency is unchanged: different checked-out clients continue
 * to execute in parallel.
 */
function serializeClientQueries(client: PoolClient, slowQueryMs: number): PoolClient {
  if (serializedClients.has(client)) return client;
  serializedClients.add(client);
  const query = client.query.bind(client);
  let tail: Promise<unknown> = Promise.resolve();
  const observe = (started: number, failed = false) => {
    const durationMs = performance.now() - started;
    if (durationMs < slowQueryMs) return;
    writeOperationalEvent({
      level: failed ? "warn" : "info",
      event: "database.query.slow",
      outcome: failed ? "failure" : "success",
      component: "postgresql",
      durationMs,
    });
  };

  client.query = ((...args: unknown[]) => {
    const callback =
      typeof args.at(-1) === "function"
        ? (args.pop() as (...values: unknown[]) => void)
        : null;

    if (callback) {
      const operation = tail.then(
        () =>
          new Promise<void>((resolve) => {
            const started = performance.now();
            try {
              Reflect.apply(query, client, [
                ...args,
                (...values: unknown[]) => {
                  try {
                    observe(started, values[0] instanceof Error);
                    callback(...values);
                  } finally {
                    resolve();
                  }
                },
              ]);
            } catch (error) {
              observe(started, true);
              resolve();
              throw error;
            }
          }),
      );
      tail = operation.catch(() => undefined);
      return undefined;
    }

    const operation = tail.then(async () => {
      const started = performance.now();
      try {
        const result = await Reflect.apply(query, client, args);
        observe(started);
        return result;
      } catch (error) {
        observe(started, true);
        throw error;
      }
    });
    tail = operation.then(
      () => undefined,
      () => undefined,
    );
    return operation;
  }) as PoolClient["query"];

  return client;
}

function serializedPool(config: pg.PoolConfig, slowQueryMs: number): pg.Pool {
  const pool = new pg.Pool(config);
  const connect = pool.connect.bind(pool);
  pool.connect = ((...args: unknown[]) => {
    const callback = args[0];
    if (typeof callback === "function") {
      return connect((error, client, release) =>
        callback(
          error,
          client ? serializeClientQueries(client, slowQueryMs) : client,
          release,
        ),
      );
    }
    return connect().then((client) => serializeClientQueries(client, slowQueryMs));
  }) as typeof pool.connect;
  return pool;
}

function createClient(): PrismaClient {
  const env = getEnv();
  const adapter = new PrismaPg(serializedPool(databasePoolConfig(env), env.DB_SLOW_QUERY_MS), {
    disposeExternalPool: true,
  });
  return new PrismaClient({ adapter });
}

export function databasePoolConfig(env: Env) {
  return {
    connectionString: env.DATABASE_URL,
    max: env.DB_POOL_MAX,
    connectionTimeoutMillis: env.DB_CONNECTION_TIMEOUT_MS,
    idleTimeoutMillis: env.DB_IDLE_TIMEOUT_MS,
    statement_timeout: env.DB_STATEMENT_TIMEOUT_MS,
  };
}

export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}
