// Fixed reviewed engineering-only profile. No original-reference NFT traversal.
import { spawnSync } from "node:child_process";
import { constants,existsSync,mkdirSync,writeFileSync,cpSync,readdirSync,unlinkSync,openSync,fstatSync,readSync,closeSync,lstatSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const root=path.resolve(".next-build/standalone"),mode=process.argv[2]??"--all";
const profileMarker=path.join(root,"hive-build-profile.txt");
const digest=b=>createHash("sha256").update(b).digest("hex");
function buildDiagnostic(result,durationMilliseconds) {
  const errorCode=typeof result.error?.code==="string" && /^[A-Z0-9_]{1,64}$/.test(result.error.code)?result.error.code:result.error?"UNKNOWN":null;
  const signal=typeof result.signal==="string" && /^SIG[A-Z0-9]{1,16}$/.test(result.signal)?result.signal:result.signal?"UNKNOWN":null;
  const status=errorCode==="ETIMEDOUT"?"TIMED_OUT":result.error?"SPAWN_ERROR":signal?"SIGNAL_TERMINATED":result.status===0?"CHILD_SUCCEEDED":Number.isInteger(result.status)?"CHILD_FAILED":"UNKNOWN";
  return {diagnostic:"TIP079_BUILD_CHILD_V1",purpose:"ENGINEERING_ONLY",phase:"NEXT_BUILD",bundler:"WEBPACK",limitMilliseconds:600000,
    durationMilliseconds:Number.isFinite(durationMilliseconds)&&durationMilliseconds>=0?Number(durationMilliseconds.toFixed(3)):null,
    status,exitCode:Number.isInteger(result.status)&&result.status>=0&&result.status<=255?result.status:null,signal,errorCode};
}
function readBounded(fd,maxBytes) {
  const initial=fstatSync(fd);
  if(!initial.isFile() || initial.size>maxBytes) throw new Error("Reviewed descriptor refused");
  const bytes=Buffer.alloc(initial.size);let offset=0;
  while(offset<bytes.length) {const n=readSync(fd,bytes,offset,bytes.length-offset,offset);if(!n) throw new Error("Changed reviewed read");offset+=n;}
  if(readSync(fd,Buffer.alloc(1),0,1,offset) || fstatSync(fd).size!==initial.size) throw new Error("Reviewed file grew");
  return bytes;
}
if(!["--all","--build-only","--package-only"].includes(mode) || process.argv.length>3) throw new Error("Fixed TIP079 mode required");
if(mode!=="--package-only") {
  if(existsSync(profileMarker))unlinkSync(profileMarker);
  const started=performance.now();
  const r=spawnSync(process.execPath,["node_modules/next/dist/bin/next","build","--webpack"],{env:{...process.env,HIVE_BUILD_PROFILE:"TIP079_QA",NODE_ENV:"production"},stdio:"inherit",timeout:600000});
  console.log(JSON.stringify(buildDiagnostic(r,performance.now()-started)));
  if(r.error || r.signal || r.status!==0) process.exit(r.status===0?1:r.status??1);
}
if(!existsSync(path.join(root,"server.js")) || lstatSync(root).isSymbolicLink()) throw new Error("Fixed generated standalone required");
for(const name of readdirSync(root)) if(name===".env" || name.startsWith(".env.")) unlinkSync(path.join(root,name));
const inventories=[".next-build/next-server.js.nft.json"];
let entries=0,traceBytes=0,references=0;
function visit(directory) {
  for(const e of readdirSync(directory,{withFileTypes:true})) {
    if(++entries>4096 || e.isSymbolicLink()) throw new Error("Generated traversal refused");
    const file=path.join(directory,e.name);
    if(e.isDirectory()) visit(file);
    else if(e.isFile() && e.name.endsWith(".nft.json")) inventories.push(file);
  }
}
visit(".next-build/server");
for(const file of inventories) {
  const fd=openSync(file,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);let refs;
  try {const b=readBounded(fd,Math.min(1048576,16777216-traceBytes));traceBytes+=b.length;refs=JSON.parse(b.toString("utf8")).files;} finally {closeSync(fd);}
  if(!Array.isArray(refs) || refs.length>4096 || refs.some(p=>typeof p!=="string" || /p139|attempt[-_ ]?5|oldsource|\.storage|(^|\/)artifacts\/|TIP-075|tip075/i.test(p))) throw new Error("Generated trace out-of-scope; quarantine ONLY exact generated root before launch");
  references+=refs.length;
}
console.log(`TIP079 trace admission: ${inventories.length} inventories, ${references} references, ${traceBytes} bytes, forbidden flags0`);
const markerFd=openSync(profileMarker,mode==="--package-only"?constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK:constants.O_WRONLY|constants.O_CREAT|constants.O_EXCL|constants.O_NOFOLLOW,0o600);
try {
  if(mode==="--package-only") {if(readBounded(markerFd,64).toString("utf8")!=="TIP079_QA\n")throw new Error("Shared build profile mismatch");}
  else writeFileSync(markerFd,"TIP079_QA\n");
} finally {closeSync(markerFd);}
if(mode==="--build-only") process.exit(0);
function safeRead(file,max=262144) {
  if(path.isAbsolute(file) || file.includes("..") || file.includes("\\") || /p139|attempt[-_ ]?5|oldsource|artifacts\//i.test(file)) throw new Error("Reviewed path refused");
  const allowed=file==="scripts/operations/provision-poly19-showcase-qa.ts" || file==="postcss.config.mjs" || file==="src/app/globals.css" || /^src\/(modules|server|app|components|i18n)\/.+\.(ts|tsx)$/.test(file) || file==="next.config.ts" || file==="prisma/schema.prisma" || /^prisma\/migrations\/20261006040000_native_poly19_showcase\/migration\.sql$/.test(file) || file==="scripts/db/app-role.sql" || ["scripts/research/frontiermath_poly19_verifier.py","scripts/research/poly19_showcase_fault.py","scripts/workers/research-showcase-worker.ts","scripts/operations/install-poly19-showcase-source.ts","scripts/test/build-tip079.mjs","scripts/test/start-tip079-standalone.mjs","scripts/test/playwright-tip079.config.ts","docs/research/FRONTIERMATH_POLY19_CERTIFICATE.md"].includes(file) || /^docs\/verification\/TIP-079[A-Z_0-9-]*\.(json|md)$/.test(file);
  if(!allowed) throw new Error("Nonreviewed source path refused");
  const fd=openSync(file,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
  try {return readBounded(fd,max);} finally {closeSync(fd);}
}
const manifestPath="docs/verification/TIP-079_SOURCE_BUNDLE.json",manifestBytes=safeRead(manifestPath,65536),m=JSON.parse(manifestBytes.toString("utf8"));
if(m.version!==1 || m.purpose!=="ENGINEERING_ONLY_POLY19_SHOWCASE" || JSON.stringify(m.allowedProvenance)!=='["ENGINEERING_ONLY"]' || !/^docs\/verification\/TIP-079[A-Z_0-9-]+\.md$/.test(m.reviewReport)) throw new Error("Reviewed engineering-only manifest required");
const sourceFile="src/modules/research-showcase/source.ts",source=safeRead(sourceFile);
if(digest(source)!==m.sourcePins?.[sourceFile]) throw new Error("Reviewed inventory source changed");
const list=source.toString("utf8").match(/export const showcaseSourcePaths = \[([\s\S]*?)\] as const;/);
if(!list) throw new Error("Fixed reviewed source inventory unavailable");
const expected=JSON.parse(`[${list[1].replace(/,\s*$/,"")}]`);
if(!Array.isArray(expected)||expected.length>128 || new Set(expected).size!==expected.length || Object.keys(m.sourcePins).length!==expected.length || expected.some(f=>typeof f!=="string" || !m.sourcePins[f])) throw new Error("Exact reviewed inventory mismatch");
const inventory=Object.entries({...m.sourcePins,[m.reviewReport]:m.reviewReportDigest}),copies=[];let total=manifestBytes.length;
for(const [file,pin] of inventory) {
  if(typeof pin!=="string" || !/^[a-f0-9]{64}$/.test(pin)) throw new Error("Invalid reviewed pin");
  const b=safeRead(file,Math.min(262144,2097152-total));total+=b.length;
  if(total>2097152 || digest(b)!==pin) throw new Error("Reviewed source hash/budget refused");
  copies.push([file,b]);
}
// Complete all source admission before copying ANY reviewed source or assets.
for(const [file,b] of [...copies,[manifestPath,manifestBytes]]) {const dst=path.join(root,file);mkdirSync(path.dirname(dst),{recursive:true});writeFileSync(dst,b,{mode:0o600});}
if(existsSync("public")) cpSync("public",path.join(root,"public"),{recursive:true});
mkdirSync(path.join(root,".next-build"),{recursive:true});cpSync(".next-build/static",path.join(root,".next-build/static"),{recursive:true});
console.log(`TIP079 reviewed packaging: ${inventory.length} pins plus manifest, ${total} bytes; ENGINEERING_ONLY, no env or historical artifact copies`);
