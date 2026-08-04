// Test-only launcher for the exact standalone build. Next's generated server
// unconditionally overwrites NODE_ENV with `production`, while HIVE OS E2E
// intentionally needs NODE_ENV=test for its isolated database, local mail sink
// and deterministic throttle contract. Patch a temporary generated entrypoint;
// the production server.js and package start command remain untouched.
import { spawn } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const standaloneRoot = path.resolve(".next/standalone");
const sourcePath = path.join(standaloneRoot, "server.js");
const testPath = path.join(standaloneRoot, "server.e2e.cjs");
const productionAssignment = "process.env.NODE_ENV = 'production'";
const source = readFileSync(sourcePath, "utf8");

if (source.split(productionAssignment).length !== 2) {
  throw new Error(
    "unexpected standalone server contract: NODE_ENV assignment not found exactly once",
  );
}

writeFileSync(
  testPath,
  source.replace(
    productionAssignment,
    "process.env.NODE_ENV = process.env.NODE_ENV || 'production'",
  ),
  { mode: 0o600 },
);

const child = spawn(process.execPath, [testPath], {
  cwd: standaloneRoot,
  env: process.env,
  stdio: "inherit",
});

let stopping = false;
function stop(signal) {
  if (stopping) return;
  stopping = true;
  child.kill(signal);
}

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));

child.on("exit", (code, signal) => {
  rmSync(testPath, { force: true });
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
