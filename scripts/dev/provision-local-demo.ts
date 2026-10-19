/** Idempotent, explicit local-only pilot login. Never run against shared data. */
import "dotenv/config";

import pg from "pg";

import { provisionWorkspace } from "../../src/modules/identity-workspace/onboarding";
import { auth } from "../../src/server/auth";
import { getDb } from "../../src/server/db";
import { getEnv } from "../../src/server/env";
import {
  LOCAL_DEMO_LOGIN,
  localDemoLoginAllowed,
} from "../../src/server/fixtures/local-demo-login";

async function main() {
  const env = getEnv();
  if (!localDemoLoginAllowed(env, "localhost")) {
    throw new Error("Local demo requires development mode, DEMO_FIXTURES_ENABLED=true and hiveos_dev on loopback");
  }
  if (!env.DATABASE_MIGRATION_URL) {
    throw new Error("DATABASE_MIGRATION_URL is required for local email verification");
  }

  let user = await getDb().user.findUnique({ where: { email: LOCAL_DEMO_LOGIN.email } });
  const existingUser = Boolean(user);
  if (user) {
    // Check ownership before touching verification state or workspace authority.
    const signedIn = await auth.api.signInEmail({
      body: { email: LOCAL_DEMO_LOGIN.email, password: LOCAL_DEMO_LOGIN.password },
    });
    if (signedIn.user.id !== user.id) throw new Error("The local demo address belongs to another account");
  }
  if (!user) {
    await auth.api.signUpEmail({
      body: {
        name: LOCAL_DEMO_LOGIN.name,
        email: LOCAL_DEMO_LOGIN.email,
        password: LOCAL_DEMO_LOGIN.password,
      },
    });
    user = await getDb().user.findUnique({ where: { email: LOCAL_DEMO_LOGIN.email } });
  }
  if (!user || user.principalType !== "HUMAN") {
    throw new Error("Local demo human account could not be created");
  }

  const owner = new pg.Client({ connectionString: env.DATABASE_MIGRATION_URL });
  await owner.connect();
  try {
    await owner.query('UPDATE "user" SET email_verified = true WHERE id = $1', [user.id]);
  } finally {
    await owner.end();
  }

  if (!existingUser) {
    const signedIn = await auth.api.signInEmail({
      body: { email: LOCAL_DEMO_LOGIN.email, password: LOCAL_DEMO_LOGIN.password },
    });
    if (signedIn.user.id !== user.id) throw new Error("Local demo sign-in check failed");
  }
  const workspace = await provisionWorkspace(
    { id: user.id, name: user.name, email: user.email },
    "Mathematics Pilot Lab",
  );
  console.log(`Local demo ready at /w/${workspace.slug} (credentials prefilled on /sign-in).`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Local demo setup failed");
    process.exitCode = 1;
  })
  .finally(() => getDb().$disconnect());
