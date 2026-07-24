import "dotenv/config";

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const ownerUrl = process.env.DATABASE_MIGRATION_URL;
if (!ownerUrl) throw new Error("backup-local: DATABASE_MIGRATION_URL is required");

const outputArg = process.argv.find((arg) => arg.startsWith("--output="));
if (!outputArg) throw new Error("backup-local: pass --output=/absolute/backup/directory");
const output = path.resolve(outputArg.slice("--output=".length));
if (existsSync(output) && readdirSync(output).length > 0) {
  throw new Error("backup-local: output directory must be new or empty");
}
mkdirSync(output, { recursive: true });

const dumpPath = path.join(output, "database.dump");
execFileSync("pg_dump", ["--format=custom", "--file", dumpPath, ownerUrl], {
  stdio: "pipe",
});

const storageRoot = path.resolve(process.env.STORAGE_LOCAL_ROOT || ".storage");
if (existsSync(storageRoot)) cpSync(storageRoot, path.join(output, "storage"), { recursive: true });

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function inventory(root, relative = "") {
  if (!existsSync(root)) return [];
  return readdirSync(root).flatMap((name) => {
    const absolute = path.join(root, name);
    const item = path.join(relative, name);
    return statSync(absolute).isDirectory()
      ? inventory(absolute, item)
      : [{ path: item, sizeBytes: statSync(absolute).size, sha256: sha256(absolute) }];
  });
}

const manifest = {
  schema: "hive-os.local-backup.v1",
  createdAt: new Date().toISOString(),
  database: {
    file: "database.dump",
    sizeBytes: statSync(dumpPath).size,
    sha256: sha256(dumpPath),
  },
  storage: inventory(path.join(output, "storage")),
};
writeFileSync(
  path.join(output, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  { flag: "wx" },
);
console.log(`backup-local: PASS (${output})`);
