import { getDb } from "@/server/db";

import { destinationDigest } from "./digest";

/**
 * Destination-level throttle layered on top of Better Auth's IP rate limiting.
 * Keyed by an HMAC digest of the normalized destination (never plaintext
 * email), with separate counters per purpose. Increments are atomic
 * (INSERT ... ON CONFLICT DO UPDATE ... RETURNING), so concurrent resend
 * requests cannot bypass the limit. Counters expire and are prunable.
 */

export type ThrottlePurpose = "email-verification" | "password-reset";

interface WindowSpec {
  seconds: number;
  max: number;
  label: string;
}

// Policy (per destination): 3 / 15 min and 10 / 24 h, for both purposes.
const WINDOWS: readonly WindowSpec[] = [
  { seconds: 15 * 60, max: 3, label: "15m" },
  { seconds: 24 * 60 * 60, max: 10, label: "24h" },
];

/**
 * Atomically record one attempt against a destination and report whether it is
 * still within policy. Returns `allowed: false` once any window is exceeded.
 */
export async function consumeDestinationThrottle(
  email: string,
  purpose: ThrottlePurpose,
  now: number = Date.now(),
): Promise<{ allowed: boolean }> {
  const digest = destinationDigest(email, purpose);
  const db = getDb();
  let allowed = true;

  for (const window of WINDOWS) {
    const windowMs = window.seconds * 1000;
    const bucket = Math.floor(now / windowMs);
    const windowKey = `${window.label}:${bucket}`;
    const expiresAt = new Date((bucket + 1) * windowMs);

    const rows = await db.$queryRaw<{ count: number }[]>`
      INSERT INTO auth_throttle_counter
        (id, digest, purpose, window_key, count, expires_at, created_at, updated_at)
      VALUES
        (gen_random_uuid(), ${digest}, ${purpose}, ${windowKey}, 1, ${expiresAt}, now(), now())
      ON CONFLICT (digest, purpose, window_key)
      DO UPDATE SET count = auth_throttle_counter.count + 1, updated_at = now()
      RETURNING count
    `;
    const count = Number(rows[0]?.count ?? 0);
    if (count > window.max) allowed = false;
  }

  return { allowed };
}

/** Remove expired throttle counters. Safe to call opportunistically. */
export async function pruneExpiredThrottleCounters(
  now: Date = new Date(),
): Promise<number> {
  const result = await getDb().authThrottleCounter.deleteMany({
    where: { expiresAt: { lt: now } },
  });
  return result.count;
}
