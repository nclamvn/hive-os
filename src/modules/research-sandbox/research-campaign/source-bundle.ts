import { open, lstat } from "node:fs/promises";
import { constants } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { CampaignRefusal } from "./contracts";
import { listDomainAdapters } from "../research-core-v3";
import { getEnv } from "@/server/env";

// Installed by Main following independent source review; no caller-selected file.
export const installedCampaignBundlePath = "docs/verification/TIP-076B_RUNTIME_SOURCE_BUNDLE.json";
export const genericCampaignSourcePaths = [
  "src/modules/research-sandbox/research-core-v3/types.ts",
  "src/modules/research-sandbox/research-core-v3/bounded-json.ts",
  "src/modules/research-sandbox/research-core-v3/check-budget.ts",
  "src/modules/research-sandbox/research-core-v3/contract.ts",
  "src/modules/research-sandbox/research-core-v3/provider-boundary.ts",
  "src/modules/research-sandbox/research-core-v3/verification.ts",
  "src/modules/research-sandbox/research-core-v3/index.ts",
  "src/modules/research-sandbox/research-campaign/contracts.ts",
  "src/modules/research-sandbox/research-campaign/source-bundle.ts",
  "src/modules/research-sandbox/research-campaign/ledger.ts",
  "src/modules/research-sandbox/research-campaign/commands.ts",
  "src/modules/research-sandbox/research-campaign/worker.ts",
  "src/modules/research-sandbox/research-campaign/index.ts",
  "src/server/workers/research-sandbox-cycle.ts",
  "src/server/workers/research-campaign-cycle.ts",
  "prisma/schema.prisma",
  "prisma/migrations/20261005170000_research_core_v3_campaign/migration.sql",
  "scripts/db/app-role.sql",
  "src/server/storage/types.ts",
  "src/server/storage/local.ts",
  "src/server/storage/s3.ts",
  "src/server/storage/index.ts",
  "src/modules/command-runtime/contracts.ts",
  "src/modules/command-runtime/errors.ts",
  "src/modules/command-runtime/index.ts",
  "src/modules/command-runtime/kernel.ts",
  "src/modules/command-runtime/jobs.ts",
  "src/modules/authorization/errors.ts",
  "src/modules/authorization/index.ts",
  "src/modules/authorization/kernel.ts",
  "src/modules/authorization/roles.ts",
  "src/server/db.ts",
  "src/server/env.ts",
  "src/server/tenant-context.ts",
  "src/modules/execution-fabric/contracts.ts",
] as const;
export const evaluationCampaignSourcePaths=["contracts.ts","plan.ts","fixed-pilot.ts","event-projection.ts","evaluator.ts","report.ts","dossier.ts","feedback.ts","kernel.ts","index.ts"]
  .map(file=>`src/modules/research-sandbox/research-evaluation-v3/${file}`);
export const campaignControlSourcePaths=["src/server/operations/research-campaign-ui-control.ts","src/app/actions/research-campaign.ts"];
export const campaignControlCatalogPath="src/modules/research-sandbox/research-evaluation-v3/fixed-campaign-catalog.ts";
const sha = z.string().regex(/^[a-f0-9]{64}$/);
const bundleSchema = z.object({
  version: z.literal(3), purpose: z.literal("LOCAL_ENGINEERING_ONLY"),
  reviewerId: z.string().min(3).max(120),
  reviewReport: z.string().regex(/^docs\/verification\/TIP-076[A-Z_0-9-]+\.md$/), reviewReportDigest: sha,
  sourcePins: z.record(z.string(), sha),
  adapterSources: z.record(z.string().regex(/^[A-Z_]{1,64}$/), z.string().regex(/^src\/modules\/research-sandbox\/research-core-v3\/domains\/[a-z-]+\.ts$/)),
}).strict();
export interface InstalledCampaignBundle {
  sourceBundleDigest: string; runtimeSourceDigest: string;
  checkerSourceDigests: Record<string, string>;
  sourcePreflight:{readBytes:number;elapsedMilliseconds:number;accounting:"BOUNDED_INTAKE_PREFLIGHT"};
}
export const campaignSourceScanReservation = { readBytes: 1048576, computeMilliseconds: 10000 };
async function boundedSource(file: string, maxBytes: number) {
  if (file.includes("..") || path.isAbsolute(file) || file.includes("\\")) throw new CampaignRefusal("INTEGRITY", "Invalid installed source reference");
  // The installed Next runtime uses this annotation for runtime-only fs paths.
  // The separately reviewed standalone packager copies this exact inventory;
  // tracing a dynamic cwd suffix must not collect the whole repository/history.
  const full = path.resolve(/* turbopackIgnore: true */ process.cwd(), file);
  const handle=await open(/* turbopackIgnore: true */ full,constants.O_RDONLY|constants.O_NOFOLLOW);
  try {
    const st=await handle.stat();
    if(!st.isFile() || st.size>maxBytes) throw new CampaignRefusal("INTEGRITY","Installed source file invalid");
    const bytes=Buffer.alloc(st.size);
    let offset=0;
    while(offset<bytes.byteLength) {
      const read=await handle.read(bytes,offset,bytes.byteLength-offset,offset);
      if(!read.bytesRead) throw new CampaignRefusal("INTEGRITY","Installed source changed during bounded read");
      offset+=read.bytesRead;
    }
    const extra=await handle.read(Buffer.alloc(1),0,1,offset);
    if(extra.bytesRead || (await handle.stat()).size!==st.size) throw new CampaignRefusal("INTEGRITY","Installed source changed during bounded read");
    return bytes;
  } finally {await handle.close();}
}
export async function loadInstalledCampaignBundle(): Promise<InstalledCampaignBundle> {
  try {
    const started = performance.now();
    const raw = await boundedSource(installedCampaignBundlePath, 65536);
    const bundle = bundleSchema.parse(JSON.parse(raw.toString("utf8")));
    const reviewBytes = await boundedSource(bundle.reviewReport, 262144);
    if (createHash("sha256").update(reviewBytes).digest("hex") !== bundle.reviewReportDigest) throw new CampaignRefusal("INTEGRITY", "Installed independent review changed");
    const required = new Set<string>([...genericCampaignSourcePaths,...evaluationCampaignSourcePaths,...campaignControlSourcePaths,
      "src/modules/research-sandbox/research-core-v3/registry.ts",
      "src/modules/research-sandbox/research-core-v3/domains/installed-adapters.ts",campaignControlCatalogPath, ...Object.values(bundle.adapterSources)]);
    if(canonicalJson(listDomainAdapters().map(a=>a.id).sort())!==canonicalJson(Object.keys(bundle.adapterSources).sort())) throw new CampaignRefusal("INTEGRITY","Reviewed adapter catalog differs from actual installation");
    if (required.size !== Object.keys(bundle.sourcePins).length || [...required].some(file => !(file in bundle.sourcePins))) throw new CampaignRefusal("INTEGRITY", "Installed source inventory mismatch");
    let readBytes = raw.byteLength + reviewBytes.byteLength;
    for (const file of required) {
      const size = (await lstat(/* turbopackIgnore: true */ path.resolve(/* turbopackIgnore: true */ process.cwd(),file))).size;
      if (readBytes + size > campaignSourceScanReservation.readBytes) throw new CampaignRefusal("RESOURCE", "Installed source scan bound");
      const bytes = await boundedSource(file, size);
      readBytes += bytes.byteLength;
      if (performance.now() - started > campaignSourceScanReservation.computeMilliseconds) throw new CampaignRefusal("RESOURCE", "Installed source scan deadline");
      if (createHash("sha256").update(bytes).digest("hex") !== bundle.sourcePins[file]) throw new CampaignRefusal("INTEGRITY", "Reviewed campaign source changed");
    }
    const checkerSourceDigests = Object.fromEntries(Object.entries(bundle.adapterSources).map(([id,file]) => [id, bundle.sourcePins[file]]));
    if(performance.now()-started>campaignSourceScanReservation.computeMilliseconds) throw new CampaignRefusal("RESOURCE","Installed source scan deadline");
    return { sourceBundleDigest: sha256(canonicalJson(bundle)),sourcePreflight:{readBytes,elapsedMilliseconds:performance.now()-started,accounting:"BOUNDED_INTAKE_PREFLIGHT"},
      runtimeSourceDigest: sha256(canonicalJson(Object.fromEntries([...genericCampaignSourcePaths,...evaluationCampaignSourcePaths,
        ...campaignControlSourcePaths].map(file => [file,bundle.sourcePins[file]])))), checkerSourceDigests };
  } catch (error) {
    if (error instanceof CampaignRefusal) throw error;
    throw new CampaignRefusal("INTEGRITY", "Reviewed installed campaign bundle unavailable");
  }
}

/** BUILD has no live transport: authenticate local isolated QA before dispatch. */
export function assertControlledCampaignEnvironment() {
  let target: URL,env:ReturnType<typeof getEnv>;
  // Use the shared validated runtime snapshot, just like the database/auth
  // services. Next folds direct process.env.NODE_ENV reads at production build.
  try { env=getEnv();target = new URL(env.DATABASE_URL); } catch { throw new CampaignRefusal("AUTHORITY", "Local QA database required"); }
  if (env.NODE_ENV !== "test" || !["localhost", "127.0.0.1"].includes(target.hostname) || target.port!=="5433" || target.pathname !== "/hiveos_test") throw new CampaignRefusal("AUTHORITY", "Campaign BUILD cannot dispatch outside isolated QA");
}
