// Next.js copies loaded .env files into standalone output. Deployment
// configuration must be injected at runtime, never baked into the artifact.
import { existsSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

const root = path.resolve(".next/standalone");
if (existsSync(root)) {
  for (const name of readdirSync(root)) {
    if (name === ".env" || name.startsWith(".env.")) {
      rmSync(path.join(root, name), { force: true });
    }
  }
}
console.log("standalone-env: scrubbed");
