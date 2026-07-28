import { createHmac } from "node:crypto";

import { getEnv } from "@/server/env";

/**
 * Keyed digests for abuse controls and audit context. Plaintext email, IP, and
 * user-agent are never stored; only an HMAC-SHA256 digest keyed by
 * AUTH_THROTTLE_SECRET. A fixed fallback key is used only under NODE_ENV=test
 * (where the secret is optional) to keep digests deterministic.
 */

function throttleKey(): string {
  const env = getEnv();
  if (env.AUTH_THROTTLE_SECRET) return env.AUTH_THROTTLE_SECRET;
  if (env.NODE_ENV === "test") return "test-only-throttle-key-deterministic";
  // Unreachable: env.superRefine requires the secret outside tests.
  throw new Error("AUTH_THROTTLE_SECRET is required");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hmac(input: string): string {
  return createHmac("sha256", throttleKey()).update(input).digest("hex");
}

/** Digest of a normalized destination email scoped to a purpose. */
export function destinationDigest(email: string, purpose: string): string {
  return hmac(`dest:${purpose}:${normalizeEmail(email)}`);
}

export function ipDigest(ip: string | null | undefined): string | null {
  const trimmed = ip?.trim();
  return trimmed ? hmac(`ip:${trimmed}`) : null;
}

export function userAgentDigest(ua: string | null | undefined): string | null {
  const trimmed = ua?.trim();
  return trimmed ? hmac(`ua:${trimmed}`) : null;
}
