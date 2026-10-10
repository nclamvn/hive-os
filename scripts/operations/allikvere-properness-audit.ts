import { readFile,writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { canonicalJson,sha256 } from "../../src/modules/execution-fabric/contracts";
import { PROPERNESS_RETAINED_PATH,TIP048_REPORT_SHA256,TIP048_FIXED_SCOPE_DIGEST,retainedPropernessCases } from "../../src/modules/research-sandbox/math-lrc-properness";
import { runFreshPropernessReport } from "../../src/modules/research-sandbox/math-lrc-properness-replay";

async function main() {
  const args=process.argv.slice(2); if(args.length>1||(args.length===1&&args[0]!=="--write")) throw new Error("Usage: allikvere-properness-audit.ts [--write]");
  if(!["development","test"].includes(process.env.NODE_ENV??"")||(process.env.DEPLOYMENT_ENV&&!["development","test"].includes(process.env.DEPLOYMENT_ENV))) throw new Error("Local development/test only");
  // Bind the four vectors to immutable old source scope WITHOUT invoking any old
  // certificate validator, enumerator, archive code or altering its coverage.
  const bytes=await readFile(join(process.cwd(),"docs/research/lrc-allikvere-p199/retained-cover-report.json"),"utf8");
  if(sha256(bytes)!==TIP048_REPORT_SHA256) throw new Error("Immutable TIP048 source drift");
  const old=JSON.parse(bytes) as {rows:{scope:{prime:number;parentLevel:number;targetLevel:number;parentResidues:number[]}}[]};
  const scopes=old.rows.slice(0,4).map(row=>row.scope);
  if(sha256(canonicalJson(scopes))!==TIP048_FIXED_SCOPE_DIGEST) throw new Error("Immutable fixed source scope mismatch");
  const actual=scopes.map(scope=>scope.parentResidues.map(r=>r+scope.prime*scope.parentLevel*(r%7)));
  if(scopes.some(s=>s.prime!==199||s.parentLevel!==2||s.targetLevel!==14)||canonicalJson(actual)!==canonicalJson(retainedPropernessCases().slice(0,4).map(c=>c.residues))) throw new Error("Fixed class derivation mismatch");
  const report=await runFreshPropernessReport();
  if(args[0]==="--write") await writeFile(join(process.cwd(),PROPERNESS_RETAINED_PATH),`${canonicalJson(report)}\n`,{encoding:"utf8",flag:"wx",mode:0o600});
  process.stdout.write(`${JSON.stringify({status:report.status,globalVerdict:report.globalVerdict,receipt:report.receipt,reportDigest:report.reportDigest,
    certificates:report.phaseCertificates.map(c=>({N:c.totalRunners,d:c.shiftModulus,cells:c.cells.length,maximum:c.maximumBadShifts,bound:c.ceilBound})),applications:report.applications.map(c=>({id:c.id,status:c.status})),retained:args[0]==="--write"})}\n`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) main().catch((error:unknown)=>{process.stderr.write(`${error instanceof Error?error.message:"Properness collector failed closed"}\n`);process.exitCode=1;});
