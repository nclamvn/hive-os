import "dotenv/config";

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import path from "node:path";

function arg(name) {
  return process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
}

const backupArg = arg("backup");
const targetUrl = arg("database-url");
const confirmTarget = arg("confirm-target");
if (!backupArg || !targetUrl || !confirmTarget) {
  throw new Error(
    "restore-local: pass --backup=/absolute/path --database-url=... --confirm-target=database_name",
  );
}
const backup = path.resolve(backupArg);
const databaseName = new URL(targetUrl).pathname.slice(1);
if (!databaseName || databaseName !== confirmTarget) {
  throw new Error("restore-local: confirmation must exactly match the target database name");
}
if (["postgres", "template0", "template1"].includes(databaseName)) {
  throw new Error("restore-local: system databases are forbidden targets");
}

const manifest = JSON.parse(readFileSync(path.join(backup, "manifest.json"), "utf8"));
const dumpPath = path.join(backup, manifest.database.file);
const dumpHash = createHash("sha256").update(readFileSync(dumpPath)).digest("hex");
if (dumpHash !== manifest.database.sha256 || statSync(dumpPath).size !== manifest.database.sizeBytes) {
  throw new Error("restore-local: database dump integrity check failed");
}
for (const item of manifest.storage) {
  const file = path.join(backup, "storage", item.path);
  const hash = createHash("sha256").update(readFileSync(file)).digest("hex");
  if (hash !== item.sha256 || statSync(file).size !== item.sizeBytes) {
    throw new Error(`restore-local: storage integrity check failed for ${item.path}`);
  }
}

execFileSync(
  "pg_restore",
  ["--exit-on-error", "--clean", "--if-exists", "--no-owner", "--no-privileges", "--dbname", targetUrl, dumpPath],
  { stdio: "pipe" },
);

const storageTargetArg = arg("storage-target");
if (storageTargetArg) {
  const storageTarget = path.resolve(storageTargetArg);
  if (existsSync(storageTarget) && readdirSync(storageTarget).length > 0) {
    throw new Error("restore-local: storage target must be new or empty");
  }
  rmSync(storageTarget, { recursive: true, force: true });
  if (existsSync(path.join(backup, "storage"))) {
    cpSync(path.join(backup, "storage"), storageTarget, { recursive: true });
  }
}
console.log(`restore-local: PASS (${databaseName})`);
