import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { validateRetainedP83GenerationReport } from "./math-lrc-p83-generation";
import { P83_CASCADE_DEPENDENCY,P83_CASCADE_KEYS,P83_CASCADE_LIMITS,P83_CASCADE_PATHS,P83_CASCADE_PYTHON_SHA256,p83CascadeBinarySha256,p83CascadeReportDigest,p83CascadeRequest,reconstructP83CascadeEvidence,validateP83CascadeEvidence,type P83CascadeReport,type CascadeKey } from "./math-lrc-p83-cascade";

/** Explicit whole offline collector only. GET never calls this helper. */
export async function runFreshP83CascadeReport(availableMs:number=P83_CASCADE_LIMITS.collectorMs){
  const started=performance.now();
  if(!["development","test"].includes(process.env.NODE_ENV??"")||(process.env.DEPLOYMENT_ENV&&!["development","test"].includes(process.env.DEPLOYMENT_ENV)))throw new Error("p83 cascade restricted to local development/test");
  if(!Number.isSafeInteger(availableMs)||availableMs<=0)throw new Error("p83 cascade deadline unavailable");
  const budget=Math.min(availableMs,P83_CASCADE_LIMITS.collectorMs),remaining=()=>Math.floor(budget-(performance.now()-started));
  const dep=await readFile(join(process.cwd(),P83_CASCADE_DEPENDENCY.path),"utf8");
  if(Buffer.byteLength(dep)>262144||sha256(dep)!==P83_CASCADE_DEPENDENCY.sha256||!validateRetainedP83GenerationReport(JSON.parse(dep)))throw new Error("p83 cascade immutable summary dependency drift");
  const predecessor=await readFile(join(process.cwd(),P83_CASCADE_DEPENDENCY.datasetPath));
  if(predecessor.length!==P83_CASCADE_DEPENDENCY.datasetBytes||p83CascadeBinarySha256(predecessor)!==P83_CASCADE_DEPENDENCY.datasetSha256)throw new Error("p83 cascade predecessor drift");
  const source=await readFile(join(process.cwd(),"scripts/operations/replay-lrc-p83-cascade.py"),"utf8");
  if(Buffer.byteLength(source)>P83_CASCADE_LIMITS.pythonBytes||sha256(source)!==P83_CASCADE_PYTHON_SHA256)throw new Error("p83 cascade source drift");
  const evidence=reconstructP83CascadeEvidence(predecessor,remaining()),metadata=validateP83CascadeEvidence(evidence,predecessor,remaining());
  if(!metadata||canonicalJson(metadata)!==canonicalJson(evidence.metadata))throw new Error("p83 cascade full TS semantic admission failed");
  const datasetInfo=Object.fromEntries(P83_CASCADE_KEYS.map(k=>[k,{bytes:evidence[k].length,sha256:p83CascadeBinarySha256(evidence[k])}])) as Record<CascadeKey,{bytes:number;sha256:string}>;
  const input=canonicalJson(p83CascadeRequest(evidence,predecessor)),timeout=Math.min(P83_CASCADE_LIMITS.replayMs,remaining());
  if(Buffer.byteLength(input)>P83_CASCADE_LIMITS.requestBytes||timeout<=0)throw new Error("p83 cascade input/deadline exhausted");
  const replayStart=performance.now();
  const stdout=await new Promise<string>((resolve,reject)=>{
    const child=execFile("python3",["-I","-S","-B","-c",source],{shell:false,timeout,killSignal:"SIGKILL",maxBuffer:P83_CASCADE_LIMITS.stdoutBytes,encoding:"utf8",env:{NODE_ENV:process.env.NODE_ENV,PATH:"/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin",LANG:"C.UTF-8",PYTHONDONTWRITEBYTECODE:"1"}},(error,output,stderr)=>{if(error||stderr.length||Buffer.byteLength(output)>P83_CASCADE_LIMITS.stdoutBytes)reject(new Error("p83 cascade independent replay failed closed"));else resolve(output);});
    child.stdin?.on("error",()=>{child.kill("SIGKILL");reject(new Error("p83 cascade stdin unavailable"));});if(!child.stdin){child.kill("SIGKILL");reject(new Error("p83 cascade stdin unavailable"));}else try{child.stdin.end(input);}catch{child.kill("SIGKILL");reject(new Error("p83 cascade stdin unavailable"));}
  });
  const elapsedMs=Math.max(1,Math.ceil(performance.now()-replayStart));
  if(elapsedMs>timeout||stdout!==`${canonicalJson({metadata,datasets:datasetInfo,comparedEveryTreeByte:true,comparedEveryRow:true,checkedEverySatOriginalGridAndGcd:true})}\n`)throw new Error("p83 cascade full independent disagreement");
  const datasets=Object.fromEntries(P83_CASCADE_KEYS.map(k=>[k,{path:P83_CASCADE_PATHS[k],...datasetInfo[k],...(k==="tree"?{}:{rows:evidence[k].length/26})}])) as P83CascadeReport["datasets"];
  const body:Omit<P83CascadeReport,"reportDigest">={...metadata,version:1,status:"COMPLETE_BINARY_CASCADE_STAGE",target:{prime:83,movingSpeeds:13,totalRunners:14,primeSet:"P13",primeSetSize:61},dependency:P83_CASCADE_DEPENDENCY,datasets,
    trust:{get:"PASSIVE_PINNED_SUMMARY_NOT_FRESH_REPLAY",semanticAdmission:"EXPLICIT_OFFLINE_FULL_TREE_AND_EVERY_ROW",localUnsigned:true,externalAttestation:false},source:{primaryUrl:"https://arxiv.org/html/2609.02604v2",authorCodeExecuted:false,noveltyClaimed:false},remaining:{terminal:"OPEN",fullPrime:"NOT_ESTABLISHED",global:"NOT_ESTABLISHED",applicationObligationsOpen:23,all61PrimesAccepted:false,formalProof:false},generatedAt:new Date().toISOString(),receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY",sourceSha256:P83_CASCADE_PYTHON_SHA256,inputSha256:sha256(input),stdoutSha256:sha256(stdout),stdoutBytes:Buffer.byteLength(stdout),elapsedMs,externalAttestation:false}};
  const report:P83CascadeReport={...body,reportDigest:p83CascadeReportDigest(body)};
  if(Buffer.byteLength(canonicalJson(report))>P83_CASCADE_LIMITS.summaryBytes||remaining()<=0)throw new Error("p83 cascade final deadline/report limit");
  return {report,evidence};
}
