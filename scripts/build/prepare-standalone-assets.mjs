// Next standalone intentionally omits public and static assets. Copy them into
// the self-contained artifact so the same entrypoint serves production, E2E
// and local release rehearsals without falling back to unsupported `next start`.
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const standaloneRoot = path.resolve(".next/standalone");
if (!existsSync(path.join(standaloneRoot, "server.js"))) {
  throw new Error("standalone server artifact is missing; run next build first");
}

function replaceDirectory(source, destination) {
  rmSync(destination, { force: true, recursive: true });
  mkdirSync(path.dirname(destination), { recursive: true });
  cpSync(source, destination, { force: true, recursive: true });
}

const publicSource = path.resolve("public");
if (existsSync(publicSource)) {
  replaceDirectory(publicSource, path.join(standaloneRoot, "public"));
}

replaceDirectory(
  path.resolve(".next/static"),
  path.join(standaloneRoot, ".next/static"),
);

console.log("standalone-assets: prepared");
