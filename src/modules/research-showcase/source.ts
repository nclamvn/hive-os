import { open } from "node:fs/promises";
import { constants } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { z } from "zod";
import { getEnv } from "@/server/env";
import { ShowcaseRefusal, showcaseDigest } from "./contracts";

export const showcaseBundlePath = "docs/verification/TIP-079_SOURCE_BUNDLE.json";
export const showcaseSourcePaths = [
  "src/modules/research-showcase/contracts.ts", "src/modules/research-showcase/store.ts", "src/modules/research-showcase/kernel.ts",
  "src/modules/research-showcase/source.ts", "src/modules/research-showcase/authority.ts", "src/modules/research-showcase/checker.ts", "src/modules/research-showcase/index.ts",
  "src/modules/research-showcase/transport.ts", "src/modules/research-showcase/containment.ts", "src/modules/research-showcase/profile.ts",
  "src/modules/research-showcase/transport-capture.ts", "src/server/research-showcase-response.ts",
  "src/modules/research-showcase/engineering.ts",
  "src/server/workers/research-showcase-cycle.ts", "scripts/workers/research-showcase-worker.ts",
  "scripts/research/frontiermath_poly19_verifier.py", "scripts/research/poly19_showcase_fault.py",
  "docs/research/FRONTIERMATH_POLY19_CERTIFICATE.md", "prisma/schema.prisma", "prisma/migrations/20261006040000_native_poly19_showcase/migration.sql", "scripts/db/app-role.sql",
  "src/modules/command-runtime/contracts.ts", "src/modules/command-runtime/kernel.ts", "src/modules/command-runtime/jobs.ts", "src/modules/command-runtime/index.ts", "src/modules/command-runtime/errors.ts",
  "src/modules/authorization/index.ts", "src/modules/authorization/kernel.ts", "src/modules/authorization/roles.ts", "src/modules/authorization/errors.ts",
  "src/server/db.ts", "src/server/env.ts", "src/server/tenant-context.ts", "src/modules/execution-fabric/contracts.ts",
  "src/modules/research-sandbox/research-core-v3/bounded-json.ts", "src/server/storage/types.ts", "src/server/storage/local.ts", "src/server/storage/s3.ts", "src/server/storage/index.ts",
  "src/modules/research-sandbox/research-core-v3/types.ts", "src/modules/identity-workspace/context.ts", "src/modules/identity-workspace/permissions.ts",
  "src/modules/identity-workspace/index.ts", "scripts/operations/install-poly19-showcase-source.ts",
  "src/modules/identity-workspace/errors.ts", "src/modules/identity-workspace/audit.ts",
  "src/server/auth/index.ts", "src/server/auth/session.ts", "src/server/auth/workspace-page.ts",
  "scripts/operations/provision-poly19-showcase-qa.ts",
  "scripts/test/build-tip079.mjs", "scripts/test/start-tip079-standalone.mjs", "scripts/test/playwright-tip079.config.ts", "next.config.ts", "postcss.config.mjs", "src/app/globals.css",
  "src/i18n/poly19-showcase-copy.ts", "src/components/research/poly19-proof-panel.tsx", "src/components/research/poly19-showcase-presentation.ts", "src/components/research/poly19-showcase-region.tsx",
  "src/app/actions/research-showcase.ts", "src/app/api/w/[workspaceSlug]/research/poly19/[runId]/status/route.ts", "src/app/api/w/[workspaceSlug]/research/poly19/[runId]/export/route.ts",
  "src/app/w/[workspaceSlug]/research/poly19/page.tsx", "src/app/w/[workspaceSlug]/research/math-pilot/page.tsx", "src/app/w/[workspaceSlug]/research/page.tsx",
] as const;
const hash = z.string().regex(/^[a-f0-9]{64}$/);
export const showcaseManifestSchema = z.object({ version: z.literal(1), purpose: z.literal("ENGINEERING_ONLY_POLY19_SHOWCASE"),
  reviewerId: z.string().min(3).max(120), reviewReport: z.string().regex(/^docs\/verification\/TIP-079[A-Z_0-9-]+\.md$/),
  reviewReportDigest: hash, sourcePins: z.record(z.string(), hash), allowedProvenance: z.tuple([z.literal("ENGINEERING_ONLY")]) }).strict();
export type ShowcaseBundle = { digest: string; sourcePins: Record<string, string>; allowedProvenance: ("ENGINEERING_ONLY" | "LIVE_NATIVE")[]; readBytes: number; manifest:z.infer<typeof showcaseManifestSchema> };
export function assertShowcaseEnvironment() {
  try {
    const env = getEnv(), db = new URL(env.DATABASE_URL);
    if (env.NODE_ENV !== "test" || !["localhost", "127.0.0.1"].includes(db.hostname) || db.port !== "5433" || db.pathname !== "/hiveos_test") throw new Error();
  } catch { throw new ShowcaseRefusal("AUTHORITY", "Isolated local showcase environment required"); }
}
export function isShowcaseAvailable() { try { assertShowcaseEnvironment(); return true; } catch { return false; } }
export async function readShowcaseSource(file: string, maxBytes: number): Promise<Buffer> {
  if (path.isAbsolute(file) || file.includes("..") || file.includes("\\")) throw new ShowcaseRefusal("SOURCE", "Invalid reviewed reference");
  const handle = await open(/* turbopackIgnore: true */ path.resolve(/* turbopackIgnore: true */ process.cwd(), file), constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const st = await handle.stat();
    if (!st.isFile() || st.size > maxBytes) throw new ShowcaseRefusal("SOURCE", "Reviewed regular source required");
    const bytes = Buffer.alloc(st.size); let position = 0;
    while (position < bytes.length) { const r = await handle.read(bytes, position, bytes.length - position, position); if (!r.bytesRead) throw new ShowcaseRefusal("SOURCE", "Source read changed"); position += r.bytesRead; }
    if ((await handle.read(Buffer.alloc(1), 0, 1, position)).bytesRead || (await handle.stat()).size !== st.size) throw new ShowcaseRefusal("SOURCE", "Source grew during read");
    return bytes;
  } finally { await handle.close(); }
}
export async function loadShowcaseBundle(): Promise<ShowcaseBundle> {
  assertShowcaseEnvironment(); const started = performance.now();
  try {
    const raw = await readShowcaseSource(showcaseBundlePath, 65536), manifest = showcaseManifestSchema.parse(JSON.parse(raw.toString("utf8")));
    if (Object.keys(manifest.sourcePins).length !== showcaseSourcePaths.length || showcaseSourcePaths.some(file => !manifest.sourcePins[file])) throw new ShowcaseRefusal("SOURCE", "Reviewed inventory mismatch");
    const report = await readShowcaseSource(manifest.reviewReport, 262144); let readBytes = raw.length + report.length;
    if (createHash("sha256").update(report).digest("hex") !== manifest.reviewReportDigest) throw new ShowcaseRefusal("SOURCE", "Independent source review changed");
    for (const file of showcaseSourcePaths) {
      const bytes = await readShowcaseSource(file, Math.min(262144, 2097152 - readBytes)); readBytes += bytes.length;
      if (performance.now() - started > 10000 || createHash("sha256").update(bytes).digest("hex") !== manifest.sourcePins[file]) throw new ShowcaseRefusal("SOURCE", "Reviewed source changed or scan exhausted");
    }
    if (performance.now() - started > 10000) throw new ShowcaseRefusal("RESOURCE", "Source scan deadline");
    return { digest: showcaseDigest(manifest), sourcePins: manifest.sourcePins, allowedProvenance: manifest.allowedProvenance, readBytes,manifest };
  } catch (e) { if (e instanceof ShowcaseRefusal) throw e; throw new ShowcaseRefusal("SOURCE", "Reviewed showcase source unavailable"); }
}
