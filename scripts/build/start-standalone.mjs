// Start the same standalone artifact selected during packaging. Importing in
// this process preserves the server's normal SIGTERM/shutdown behavior.
import path from "node:path";
import { pathToFileURL } from "node:url";
import { resolveStandalonePaths } from "./standalone-paths.mjs";

const profile = process.env.HIVE_BUILD_PROFILE;
if (profile && profile !== "LOCAL_QA") {
  throw new Error("Use the dedicated test launcher for historical QA profiles");
}
const { standaloneRoot } = resolveStandalonePaths();
await import(pathToFileURL(path.join(standaloneRoot, "server.js")).href);
