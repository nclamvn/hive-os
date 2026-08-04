import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg, { type PoolClient } from "pg";

import { getEnv } from "./env";
import type { Env } from "./env";

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
function serializeClientQueries(client: PoolClient): PoolClient {
  if (serializedClients.has(client)) return client;
  serializedClients.add(client);
  const query = client.query.bind(client);
  let tail: Promise<unknown> = Promise.resolve();

  client.query = ((...args: unknown[]) => {
    const callback =
      typeof args.at(-1) === "function"
        ? (args.pop() as (...values: unknown[]) => void)
        : null;

    if (callback) {
      const operation = tail.then(
        () =>
          new Promise<void>((resolve) => {
            Reflect.apply(query, client, [
              ...args,
              (...values: unknown[]) => {
                try {
                  callback(...values);
                } finally {
                  resolve();
                }
              },
            ]);
          }),
      );
      tail = operation.catch(() => undefined);
      return undefined;
    }

    const operation = tail.then(() => Reflect.apply(query, client, args));
    tail = operation.then(
      () => undefined,
      () => undefined,
    );
    return operation;
  }) as PoolClient["query"];

  return client;
}

function serializedPool(config: pg.PoolConfig): pg.Pool {
  const pool = new pg.Pool(config);
  const connect = pool.connect.bind(pool);
  pool.connect = ((...args: unknown[]) => {
    const callback = args[0];
    if (typeof callback === "function") {
      return connect((error, client, release) =>
        callback(
          error,
          client ? serializeClientQueries(client) : client,
          release,
        ),
      );
    }
    return connect().then(serializeClientQueries);
  }) as typeof pool.connect;
  return pool;
}

function createClient(): PrismaClient {
  const env = getEnv();
  const adapter = new PrismaPg(serializedPool(databasePoolConfig(env)), {
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
