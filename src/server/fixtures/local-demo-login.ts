import type { Env } from "@/server/env";

/** Public, disposable credentials for the explicitly enabled local demo only. */
export const LOCAL_DEMO_LOGIN = {
  email: "pilot.demo@hiveos.invalid",
  password: "HiveOS-Local-Pilot-2026!",
  name: "Local Pilot",
} as const;

export function localDemoLoginAllowed(env: Env, requestHost: string | null): boolean {
  if (env.NODE_ENV !== "development" || !env.DEMO_FIXTURES_ENABLED) return false;
  if (env.DEPLOYMENT_ENV && env.DEPLOYMENT_ENV !== "development") return false;
  const host = requestHost?.split(":")[0];
  const authHost = new URL(env.BETTER_AUTH_URL).hostname;
  const databaseName = new URL(env.DATABASE_URL).pathname.slice(1);
  return (
    (host === "localhost" || host === "127.0.0.1") &&
    (authHost === "localhost" || authHost === "127.0.0.1") &&
    databaseName === "hiveos_dev"
  );
}
