/**
 * Server startup boundary (TIP-021A-C, RC-02).
 *
 * `register()` runs once when the server process boots, before it accepts
 * traffic. Validating the environment here makes a misconfigured production
 * process fail closed at startup — it exits rather than serving with an unsafe
 * identity-recovery configuration (e.g. local mail, non-https or off-origin
 * recovery base, or a missing throttle secret).
 *
 * Build-time and runtime validation are intentionally separate: `next build`
 * evaluates modules under NODE_ENV=production but is not a deployment and must
 * not require production secrets, so the env schema skips the recovery/mail
 * checks during `phase-production-build`. This hook enforces them at real
 * runtime startup, where NEXT_PHASE is not the build phase.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const { getEnv } = await import("@/server/env");
  try {
    getEnv();
  } catch (err) {
    // getEnv() reports variable names and messages only — never values.
    console.error(
      "[startup] environment validation failed; refusing to serve.\n" +
        (err instanceof Error ? err.message : "invalid environment configuration"),
    );
    process.exit(1);
  }
}
