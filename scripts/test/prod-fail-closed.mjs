// TIP-021A-C RC-02: prove the BUILT production server fails closed at startup.
// Launches the standalone artifact under each environment and asserts a
// misconfigured process never reaches liveness, while a valid one does. Next
// may keep its failed bootstrap process alive to render 500 responses, so the
// governed condition is "never live/ready", not a specific exit behavior.
//
// Usage: node scripts/test/prod-fail-closed.mjs  (run after `npm run build`)
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = 3999;
const SECRET_SENTINEL = "s3cr3t-smtp-password-sentinel";
const CONN_SENTINEL = "postgresql://sentinel:sentinel@db/x";

const base = {
  ...process.env,
  NODE_ENV: "production",
  DEPLOYMENT_ENV: "production",
  NEXT_PHASE: "phase-production-server",
  PORT: String(PORT),
  DATABASE_URL: "postgresql://hiveos_app:hiveos_app@localhost:5433/hiveos_test",
  BETTER_AUTH_SECRET: "prod-secret-at-least-16-chars",
  BETTER_AUTH_URL: "https://app.example.test",
  AUTH_THROTTLE_SECRET: "prod-throttle-secret-16-chars",
  MAIL_DRIVER: "smtp",
  SMTP_HOST: "smtp.example.test",
  SMTP_PASSWORD: SECRET_SENTINEL,
  MAIL_FROM: "HIVE OS <noreply@example.test>",
  MAIL_BASE_URL: "https://app.example.test",
  STORAGE_DRIVER: "s3",
  S3_REGION: "us-east-1",
  S3_BUCKET: "hiveos-production",
  S3_ACCESS_KEY_ID: "key",
  S3_SECRET_ACCESS_KEY: "secret",
  S3_SERVER_SIDE_ENCRYPTION: "AES256",
};

function launch(env) {
  const child = spawn("node", [".next/standalone/server.js"], {
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let out = "";
  child.stdout.on("data", (d) => (out += d.toString()));
  child.stderr.on("data", (d) => (out += d.toString()));
  return { child, output: () => out };
}

/** Expect the process never to return a successful liveness response. */
async function expectFailClosed(name, overrides) {
  const { child, output } = launch({ ...base, ...overrides });
  let becameLive = false;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await sleep(250);
    try {
      const response = await fetch(`http://localhost:${PORT}/api/health/live`);
      if (response.ok) {
        becameLive = true;
        break;
      }
    } catch {
      // A refused connection is also fail-closed.
    }
    if (child.exitCode !== null) break;
  }
  child.kill("SIGKILL");
  await sleep(100);
  const validationFailed = output().includes(
    "environment validation failed; refusing to serve",
  );
  return {
    name,
    pass: !becameLive && validationFailed,
    detail: becameLive
      ? "unexpectedly reached liveness"
      : "never live; validation failure observed",
    output: output(),
  };
}

/** Expect the process to reach a healthy /api/health. */
async function expectHealthy(name, overrides) {
  const { child, output } = launch({ ...base, ...overrides });
  let healthy = false;
  for (let i = 0; i < 60; i += 1) {
    await sleep(250);
    try {
      const r = await fetch(`http://localhost:${PORT}/api/health/live`);
      if (r.ok) {
        healthy = true;
        break;
      }
    } catch {
      // not up yet
    }
    if (child.exitCode !== null) break;
  }
  child.kill("SIGKILL");
  await sleep(500);
  return { name, pass: healthy, detail: healthy ? "healthy" : "never healthy", output: output() };
}

const results = [];
results.push(await expectFailClosed("RC-PROD-01 missing SMTP config", { SMTP_HOST: "" }));
results.push(await expectFailClosed("RC-PROD-02 MAIL_DRIVER=local", { MAIL_DRIVER: "local" }));
results.push(await expectFailClosed("RC-PROD-03 http MAIL_BASE_URL", { MAIL_BASE_URL: "http://app.example.test" }));
results.push(await expectFailClosed("RC-PROD-04 off-origin MAIL_BASE_URL", { MAIL_BASE_URL: "https://evil.example.test" }));
results.push(await expectHealthy("RC-PROD-05 valid config", {}));
results.push(await expectFailClosed("PRC-PROD-07 missing DEPLOYMENT_ENV", { DEPLOYMENT_ENV: "" }));
results.push(await expectFailClosed("PRC-PROD-08 local storage forbidden", { STORAGE_DRIVER: "local" }));

// RC-PROD-06: no secret/connection string leaks in failure output.
const leakCase = await expectFailClosed("RC-PROD-06 secret-in-output check", {
  SMTP_HOST: "",
  DATABASE_URL: CONN_SENTINEL,
});
const leaked =
  leakCase.output.includes(SECRET_SENTINEL) || leakCase.output.includes(CONN_SENTINEL);
results.push({
  name: "RC-PROD-06 no secret/conn-string in output",
  pass: leakCase.pass && !leaked,
  detail: leaked ? "LEAK DETECTED" : "no secret/conn-string in stdout/stderr",
  output: "",
});

let allPass = true;
for (const r of results) {
  allPass = allPass && r.pass;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name} — ${r.detail}`);
}
process.exit(allPass ? 0 : 1);
