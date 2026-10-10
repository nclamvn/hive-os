import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { assertShowcaseEnvironment,readShowcaseSource,showcaseBundlePath,showcaseSourcePaths,showcaseManifestSchema } from "../../src/modules/research-showcase/source";
import { showcaseDigest } from "../../src/modules/research-showcase/contracts";

/** Run by Main only AFTER independent review. This does not create a live
 * authority or certify containment. Fixed create-only engineering installation. */
async function main() {
  assertShowcaseEnvironment();if(process.argv.length!==2)throw new Error("FIXED_INSTALLER_NO_ARGUMENTS");
  const reviewReport="docs/verification/TIP-079_ENGINEERING_SOURCE_REVIEW.md",report=await readShowcaseSource(reviewReport,262144);
  const sourcePins:Record<string,string>={};let total=report.length;
  for(const file of showcaseSourcePaths){const bytes=await readShowcaseSource(file,Math.min(262144,2097152-total));total+=bytes.length;sourcePins[file]=createHash("sha256").update(bytes).digest("hex");}
  const manifest=showcaseManifestSchema.parse({version:1,purpose:"ENGINEERING_ONLY_POLY19_SHOWCASE",reviewerId:"MAIN_INDEPENDENT_ENGINEERING_REVIEW",reviewReport,
    reviewReportDigest:createHash("sha256").update(report).digest("hex"),sourcePins,allowedProvenance:["ENGINEERING_ONLY"]});
  await writeFile(showcaseBundlePath,JSON.stringify(manifest,null,2)+"\n",{flag:"wx",mode:0o600});
  process.stdout.write(JSON.stringify({purpose:manifest.purpose,files:showcaseSourcePaths.length,readBytes:total,sourceBundleDigest:showcaseDigest(manifest),liveAuthority:"NOT_INSTALLED"})+"\n");
}
void main().catch(()=>{process.stderr.write("SHOWCASE_SOURCE_INSTALLATION_REFUSED\n");process.exitCode=2;});
