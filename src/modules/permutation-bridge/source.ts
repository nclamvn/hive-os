import {open,lstat,realpath} from "node:fs/promises";
import {constants} from "node:fs";
import path from "node:path";
import {z} from "zod";
import {getEnv} from "@/server/env";
import {BridgeRefusal,digest,hashBytes,id,sha,type Binding} from "./contracts";

export const bundlePath="docs/verification/TIP-080_SOURCE_BUNDLE.json";
export const approvalPath="docs/verification/TIP-080_LIVE_APPROVAL.json";
export const storageRoot="/private/tmp/hiveos-tip080-storage-cMSZcj";
export const sourcePaths=[
  "src/modules/permutation-bridge/contracts.ts","src/modules/permutation-bridge/source.ts","src/modules/permutation-bridge/ledger.ts","src/modules/permutation-bridge/kernel.ts","src/modules/permutation-bridge/index.ts",
  "src/modules/permutation-bridge/checker.ts","docs/research/PERMUTATION_CHECKER_LEMMA.md","src/modules/research-sandbox/research-core-v3/bounded-json.ts","src/modules/research-sandbox/research-core-v3/types.ts",
  "src/app/actions/permutation-bridge.ts","src/components/research/permutation-bridge-panel.tsx","src/app/w/[workspaceSlug]/research/permutations/page.tsx",
  "src/app/api/w/[workspaceSlug]/research/permutations/[runId]/export/route.ts",
  "scripts/operations/install-permutation-bridge-source.ts","scripts/test/build-tip080.mjs","scripts/test/start-tip080-standalone.mjs",
  "vitest-tip080.config.ts","tests/unit/permutation-checker.test.ts","tests/unit/permutation-bridge.test.ts","tests/unit/permutation-bridge-ui.test.ts","tests/integration/permutation-bridge.test.ts","tests/e2e/permutation-bridge.spec.ts","src/i18n/permutation-bridge-copy.ts","scripts/test/playwright-tip080.config.ts",
  "docs/contractor/tips/TIP-080_CODEX_ASSISTED_PERMUTATIONS.md",
  "src/modules/command-runtime/contracts.ts","src/modules/command-runtime/kernel.ts","src/modules/command-runtime/jobs.ts","src/modules/command-runtime/index.ts","src/modules/command-runtime/errors.ts",
  "src/modules/authorization/index.ts","src/modules/authorization/kernel.ts","src/modules/authorization/errors.ts","src/modules/authorization/roles.ts",
  "src/modules/identity-workspace/context.ts","src/modules/identity-workspace/index.ts","src/modules/identity-workspace/permissions.ts","src/modules/identity-workspace/errors.ts","src/modules/identity-workspace/audit.ts",
  "src/server/auth/index.ts","src/server/auth/session.ts","src/server/auth/workspace-page.ts","src/server/db.ts","src/server/env.ts","src/server/tenant-context.ts",
  "src/modules/execution-fabric/contracts.ts","src/modules/execution-fabric/errors.ts",
  "src/server/storage/index.ts","src/server/storage/types.ts","src/server/storage/local.ts","src/server/storage/s3.ts",
  "src/components/research/math-text.tsx","src/modules/research-sandbox/math-tex.ts","src/components/shell/workspace-shell.tsx",
  "src/components/ui/panel.tsx","src/components/ui/button.tsx","src/components/ui/status-badge.tsx",
  "src/components/shell/app-shell.tsx","src/components/shell/account-menu-actions.tsx","src/components/shell/sign-out-button.tsx","src/components/shell/mobile-nav.tsx","src/components/shell/sidebar-content.tsx","src/components/shell/navigation.ts","src/components/shell/nav-item-link.tsx","src/components/shell/top-header.tsx",
  "src/components/preferences/preferences-provider.tsx","src/components/preferences/preferences-controls.tsx","src/components/focus-modality.tsx","src/app/layout.tsx","src/lib/auth-client.ts","src/i18n/config.ts","src/i18n/server.ts",
  "tests/e2e/auth-helpers.ts","tests/e2e/env.ts","tests/integration/helpers.ts",
  "next.config.ts","postcss.config.mjs","src/app/globals.css",
] as const;
export const manifestSchema=z.object({version:z.literal(1),purpose:z.literal("CODEX_ASSISTED_PERMUTATIONS"),reviewer:z.string().min(3).max(120),reviewReport:z.literal("docs/verification/TIP-080_SOURCE_REVIEW.md"),reviewDigest:sha,sourcePins:z.record(z.string(),sha)}).strict();
export type Bundle={manifest:z.infer<typeof manifestSchema>;digest:string;readBytes:number};
export function assertEnvironment() {
  try {const env=getEnv(),url=new URL(env.DATABASE_URL);if(env.NODE_ENV!=="test"||!["localhost","127.0.0.1"].includes(url.hostname)||url.port!=="5433"||url.pathname!=="/hiveos_test"||env.STORAGE_DRIVER!=="local")throw new Error();}
  catch {throw new BridgeRefusal("AUTHORITY");}
}
export function available(){try{assertEnvironment();return true;}catch{return false;}}
export async function assertPrivateStorage() {
  assertEnvironment();const root=getEnv().STORAGE_LOCAL_ROOT;
  if(!/^\/private\/tmp\/hiveos-tip080-storage-[A-Za-z0-9]+$/.test(root)||root!==storageRoot)throw new BridgeRefusal("AUTHORITY");
  const st=await lstat(root);if(!st.isDirectory()||st.isSymbolicLink()||st.uid!==process.getuid?.()||(st.mode&0o777)!==0o700||await realpath(root)!==root)throw new BridgeRefusal("AUTHORITY");
}
export async function readFixed(file:string,max:number,privateApproval=false):Promise<Buffer> {
  if(path.isAbsolute(file)||file.includes("..")||file.includes("\\"))throw new BridgeRefusal("SOURCE");
  const handle=await open(/* turbopackIgnore: true */path.resolve(/* turbopackIgnore: true */process.cwd(),file),constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
  try {const st=await handle.stat();if(!st.isFile()||st.size>max||privateApproval&&(st.uid!==process.getuid?.()||(st.mode&0o777)!==0o600))throw new BridgeRefusal("RESOURCE");
    const bytes=Buffer.alloc(st.size);let offset=0;while(offset<bytes.length){const r=await handle.read(bytes,offset,bytes.length-offset,offset);if(!r.bytesRead)throw new BridgeRefusal("SOURCE");offset+=r.bytesRead;}
    if((await handle.read(Buffer.alloc(1),0,1,offset)).bytesRead||(await handle.stat()).size!==st.size)throw new BridgeRefusal("SOURCE");return bytes;
  }finally{await handle.close();}
}
export async function loadBundle():Promise<Bundle> {
  assertEnvironment();const started=performance.now();
  try {const raw=await readFixed(bundlePath,65536),manifest=manifestSchema.parse(JSON.parse(raw.toString("utf8")));let readBytes=raw.length;
    if(Object.keys(manifest.sourcePins).length!==sourcePaths.length||sourcePaths.some(p=>!manifest.sourcePins[p]))throw new BridgeRefusal("SOURCE");
    const report=await readFixed(manifest.reviewReport,262144);readBytes+=report.length;if(hashBytes(report)!==manifest.reviewDigest)throw new BridgeRefusal("SOURCE");
    for(const file of sourcePaths){const bytes=await readFixed(file,Math.min(262144,2097152-readBytes));readBytes+=bytes.length;if(hashBytes(bytes)!==manifest.sourcePins[file]||performance.now()-started>10000)throw new BridgeRefusal("SOURCE");}
    if(performance.now()-started>10000)throw new BridgeRefusal("RESOURCE");return {manifest,digest:digest(manifest),readBytes};
  }catch(error){if(error instanceof BridgeRefusal)throw error;throw new BridgeRefusal("SOURCE");}
}
export const approvalSchema=z.object({version:z.literal(1),purpose:z.literal("OWNER_RECORDING_READY_ONE_RUN_080"),runId:id,organizationId:id,workspaceId:id,missionId:z.string().min(1).max(200),actorUserId:z.string().min(1).max(200),sourceDigest:sha,taskDigest:sha,provenance:z.literal("CODEX_ASSISTED"),wallSeconds:z.literal(900),maximumRuns:z.literal(1),freshRoles:z.literal(4),noPaidApi:z.literal(true),recordingReady:z.literal(true),expiresAt:z.string().max(40)}).strict();
export function validateApproval(raw:unknown,binding:Binding,now=Date.now()) {
  const approval=approvalSchema.parse(raw),expiry=Date.parse(approval.expiresAt);
  if(!Number.isFinite(expiry)||new Date(expiry).toISOString()!==approval.expiresAt||expiry<=now||expiry-now>86400000||Object.keys(binding).some(k=>approval[k as keyof Binding]!==binding[k as keyof Binding]))throw new BridgeRefusal("AUTHORITY");return approval;
}
export async function requireLiveApproval(binding:Binding) {
  assertEnvironment();try{return validateApproval(JSON.parse((await readFixed(approvalPath,16384,true)).toString("utf8")),binding);}catch{throw new BridgeRefusal("AUTHORITY");}
}
