// Next standalone intentionally omits public and static assets. Copy them into
// the self-contained artifact so the same entrypoint serves production, E2E
// and local release rehearsals without falling back to unsupported `next start`.
import {cpSync,existsSync,lstatSync,mkdirSync,rmSync} from "node:fs";
import path from "node:path";
import {resolveStandalonePaths} from "./standalone-paths.mjs";

const {root,distDir,buildRoot,standaloneRoot}=resolveStandalonePaths();

function replaceDirectory(source, destination) {
  if(!lstatSync(source).isDirectory()||lstatSync(source).isSymbolicLink())throw new Error("Standalone asset source refused");
  const parent=path.dirname(destination);
  if(parent!==standaloneRoot&&existsSync(parent)&&(!lstatSync(parent).isDirectory()||lstatSync(parent).isSymbolicLink()))throw new Error("Standalone asset destination refused");
  if(existsSync(destination)&&lstatSync(destination).isSymbolicLink())throw new Error("Standalone asset destination refused");
  rmSync(destination, { force: true, recursive: true });
  mkdirSync(path.dirname(destination), { recursive: true });
  cpSync(source, destination, { force: true, recursive: true });
}

const publicSource = path.join(root,"public");
if (existsSync(publicSource)) {
  replaceDirectory(publicSource, path.join(standaloneRoot, "public"));
}

replaceDirectory(
  path.join(buildRoot,"static"),
  path.join(standaloneRoot,distDir,"static"),
);

console.log("standalone-assets: prepared");
