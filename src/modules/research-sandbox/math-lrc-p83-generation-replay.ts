import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { validateRetainedP83CoveringNumberReport } from "./math-lrc-p83-covering-number";
import { P83_GENERATION_DEPENDENCY,P83_GENERATION_LIMITS,P83_GENERATION_PATHS,P83_GENERATION_PYTHON_SHA256,p83GenerationBinarySha256,p83GenerationReportDigest,p83GenerationRequest,reconstructP83GenerationEvidence,validateP83GenerationEvidence,type P83GenerationReport } from "./math-lrc-p83-generation";

/** Explicit long offline collector only; never called by GET. Complete new
 * trees/rows, no author executable, DB/worker/model/API or hidden campaigns. */
export async function runFreshP83GenerationReport(availableMs:number=P83_GENERATION_LIMITS.collectorMs){
  const started=performance.now();
  if(!["development","test"].includes(process.env.NODE_ENV??"")||(process.env.DEPLOYMENT_ENV&&!["development","test"].includes(process.env.DEPLOYMENT_ENV)))throw new Error("p83 generation restricted to local development/test");
  if(!Number.isSafeInteger(availableMs)||availableMs<=0)throw new Error("p83 generation deadline unavailable");
  const budget=Math.min(availableMs,P83_GENERATION_LIMITS.collectorMs),remaining=()=>Math.floor(budget-(performance.now()-started));
  const dep=await readFile(join(process.cwd(),P83_GENERATION_DEPENDENCY.path),"utf8");
  if(Buffer.byteLength(dep)>262144||sha256(dep)!==P83_GENERATION_DEPENDENCY.sha256||!validateRetainedP83CoveringNumberReport(JSON.parse(dep)))throw new Error("p83 generation immutable dependency drift");
  const source=await readFile(join(process.cwd(),"scripts/operations/replay-lrc-p83-generation.py"),"utf8");
  if(Buffer.byteLength(source)>P83_GENERATION_LIMITS.pythonBytes||sha256(source)!==P83_GENERATION_PYTHON_SHA256)throw new Error("p83 generation source drift");
  const evidence=reconstructP83GenerationEvidence(remaining()),metadata=validateP83GenerationEvidence(evidence,remaining());
  if(!metadata||canonicalJson(metadata)!==canonicalJson(evidence.metadata))throw new Error("p83 full TS semantic admission failed");
  const datasetInfo={tree:{bytes:evidence.tree.length,sha256:p83GenerationBinarySha256(evidence.tree)},cover12:{bytes:evidence.cover12.length,sha256:p83GenerationBinarySha256(evidence.cover12)},cover13:{bytes:evidence.cover13.length,sha256:p83GenerationBinarySha256(evidence.cover13)}};
  const input=canonicalJson(p83GenerationRequest(evidence)),timeout=Math.min(P83_GENERATION_LIMITS.replayMs,remaining());
  if(Buffer.byteLength(input)>P83_GENERATION_LIMITS.childBytes||timeout<=0)throw new Error("p83 generation input/deadline exhausted");
  const replayStart=performance.now();
  const stdout=await new Promise<string>((resolve,reject)=>{
    const child=execFile("python3",["-I","-S","-B","-c",source],{shell:false,timeout,killSignal:"SIGKILL",maxBuffer:P83_GENERATION_LIMITS.childBytes,encoding:"utf8",env:{NODE_ENV:process.env.NODE_ENV,PATH:"/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin",LANG:"C.UTF-8",PYTHONDONTWRITEBYTECODE:"1"}},(error,output,stderr)=>{if(error||stderr.length||Buffer.byteLength(output)>P83_GENERATION_LIMITS.childBytes)reject(new Error("p83 generation independent replay failed closed"));else resolve(output);});
    child.stdin?.on("error",()=>reject(new Error("p83 generation stdin unavailable")));if(!child.stdin){child.kill("SIGKILL");reject(new Error("p83 generation stdin unavailable"));}else child.stdin.end(input);
  });
  const elapsedMs=Math.max(1,Math.ceil(performance.now()-replayStart));
  if(elapsedMs>timeout||stdout!==`${canonicalJson({metadata,datasets:datasetInfo,comparedEveryTreeByte:true,comparedEveryRow:true})}\n`)throw new Error("p83 generation full independent disagreement");
  const body:Omit<P83GenerationReport,"reportDigest">={version:1,status:"COMPLETE_LEVEL_ONE_GENERATION_STAGE",target:{prime:83,movingSpeeds:13,totalRunners:14,primeSet:"P13",primeSetSize:61},counts:metadata.counts,roots:metadata.roots,encoding:metadata.encoding,dependency:P83_GENERATION_DEPENDENCY,
    datasets:{tree:{path:P83_GENERATION_PATHS.tree,...datasetInfo.tree},cover12:{path:P83_GENERATION_PATHS.cover12,...datasetInfo.cover12,rows:metadata.counts.canonical12},cover13:{path:P83_GENERATION_PATHS.cover13,...datasetInfo.cover13,rows:metadata.counts.canonical13}},
    trust:{get:"PASSIVE_PINNED_SUMMARY_NOT_FRESH_REPLAY",semanticAdmission:"EXPLICIT_OFFLINE_FULL_TREE_AND_EVERY_ROW",localUnsigned:true,externalAttestation:false},source:{primaryUrl:"https://arxiv.org/html/2609.02604v2",authorCodeExecuted:false,noveltyClaimed:false},remaining:{cascade:"OPEN",terminal:"OPEN",fullPrime:"NOT_ESTABLISHED",global:"NOT_ESTABLISHED",applicationObligationsOpen:23,all61PrimesAccepted:false,formalProof:false},generatedAt:new Date().toISOString(),receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY",sourceSha256:P83_GENERATION_PYTHON_SHA256,inputSha256:sha256(input),stdoutSha256:sha256(stdout),stdoutBytes:Buffer.byteLength(stdout),elapsedMs,externalAttestation:false}};
  const report:P83GenerationReport={...body,reportDigest:p83GenerationReportDigest(body)};
  if(Buffer.byteLength(canonicalJson(report))>P83_GENERATION_LIMITS.summaryBytes||remaining()<=0)throw new Error("p83 generation final deadline/report limit");
  return {report,evidence};
}
