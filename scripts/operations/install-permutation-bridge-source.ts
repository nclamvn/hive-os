import {open} from "node:fs/promises";
import {constants} from "node:fs";
import {sourcePaths,readFixed,bundlePath,manifestSchema} from "../../src/modules/permutation-bridge/source";
import {hashBytes} from "../../src/modules/permutation-bridge/contracts";

/** Main runs only after independently writing/reviewing the fixed report.
 * Create-only source cut, no live approval, model effect or arbitrary argument. */
async function main(){
  if(process.argv.length!==2)throw new Error("FIXED080INSTALLER_REQUIRED");
  const reviewReport="docs/verification/TIP-080_SOURCE_REVIEW.md",report=await readFixed(reviewReport,262144);
  if(!report.toString("utf8").includes("APPROVED_DRAFT_TESTING_CODEX_ASSISTED"))throw new Error("INDEPENDENT_REVIEW_REQUIRED");
  let total=report.length;const sourcePins:Record<string,string>={};
  for(const file of sourcePaths){const bytes=await readFixed(file,Math.min(262144,2097152-total));total+=bytes.length;sourcePins[file]=hashBytes(bytes);}
  const manifest=manifestSchema.parse({version:1,purpose:"CODEX_ASSISTED_PERMUTATIONS",reviewer:"MAIN_INDEPENDENT_SOURCE_REVIEW",reviewReport,reviewDigest:hashBytes(report),sourcePins});
  const handle=await open(bundlePath,constants.O_WRONLY|constants.O_CREAT|constants.O_EXCL|constants.O_NOFOLLOW,0o600);
  try{await handle.writeFile(JSON.stringify(manifest,null,2)+"\n");await handle.sync();}finally{await handle.close();}
  process.stdout.write(JSON.stringify({purpose:"DRAFT_SOURCE_ADMISSION_ONLY",files:sourcePaths.length,readBytes:total,liveApproval:"NOT_INSTALLED"})+"\n");
}
void main().catch(()=>{process.stderr.write("TIP080_SOURCE_INSTALL_REFUSED\n");process.exitCode=2;});
