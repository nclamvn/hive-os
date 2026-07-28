// TIP-021A-C RC-02: prove the BUILT production server fails closed at startup.
// Launches `next start` as a child process under each environment and asserts a
// misconfigured process exits before accepting traffic, while a valid one
// reaches a healthy /api/health. No real SMTP/network is needed for startup.
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
};

function launch(env) {
  const child = spawn("node_modules/.bin/next", ["start", "-p", String(PORT)], {
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let out = "";
  child.stdout.on("data", (d) => (out += d.toString()));
  child.stderr.on("data", (d) => (out += d.toString()));
  return { child, output: () => out };
}

/** Expect the process to exit (non-zero) before serving. */
async function expectFailClosed(name, overrides) {
  const { child, output } = launch({ ...base, ...overrides });
  const exited = await Promise.race([
    new Promise((res) => child.once("exit", (code) => res({ code }))),
    sleep(20000).then(() => ({ code: null })),
  ]);
  if (exited.code === null) {
    child.kill("SIGKILL");
    return { name, pass: false, detail: "did not exit within 20s (served?)", output: output() };
  }
  return {
    name,
    pass: exited.code !== 0,
    detail: `exited code=${exited.code}`,
    output: output(),
  };
}

/** Expect the process to reach a healthy /api/health. */
async function expectHealthy(name, overrides) {
  const { child, output } = launch({ ...base, ...overrides });
  let healthy = false;
  for (let i = 0; i < 60; i += 1) {
    await sleep(1000);
    try {
      const r = await fetch(`http://localhost:${PORT}/api/health`);
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
