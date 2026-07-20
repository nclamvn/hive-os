import { getEnv } from "../env";

/**
 * Demo fixture boundary.
 *
 * Demo fixtures are explicitly labelled sample content for demonstration
 * environments. They are NEVER loaded implicitly:
 *  - `DEMO_FIXTURES_ENABLED` must be exactly "true";
 *  - `NODE_ENV=production` forbids them regardless of the flag (the env
 *    schema also rejects that combination at startup).
 *
 * TIP-001 ships the boundary only. Actual demo content arrives with the
 * domain models of later TIPs and must route through `loadDemoFixtures`.
 */
export function demoFixturesAllowed(): boolean {
  const env = getEnv();
  return env.DEMO_FIXTURES_ENABLED && env.NODE_ENV !== "production";
}

export async function loadDemoFixtures(): Promise<{ loaded: boolean }> {
  if (!demoFixturesAllowed()) {
    return { loaded: false };
  }
  // No domain models exist in TIP-001, so there is nothing to load yet.
  // Later TIPs register their labelled demo datasets here.
  return { loaded: true };
}
