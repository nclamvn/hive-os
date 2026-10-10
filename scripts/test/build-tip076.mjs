// Fixed isolated QA profile only. Default .next/start/deployment remain untouched.
import { spawnSync } from "node:child_process";
import { constants,existsSync,mkdirSync,writeFileSync,cpSync,readdirSync,unlinkSync,openSync,fstatSync,readSync,closeSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const root=path.resolve(".next-build/standalone"),mode=process.argv[2]??"--all";
const profileMarker=path.join(root,"hive-build-profile.txt");
function boundedDescriptorRead(fd,maxBytes) {
  const initial=fstatSync(fd);
  if(!initial.isFile() || initial.size>maxBytes) throw new Error("Bounded packaging descriptor refused");
  const bytes=Buffer.alloc(initial.size);
  let offset=0;
  while(offset<bytes.byteLength) {
    const count=readSync(fd,bytes,offset,bytes.byteLength-offset,offset);
    if(!count) throw new Error("Packaging file changed during bounded read");
    offset+=count;
  }
  if(readSync(fd,Buffer.alloc(1),0,1,offset) || fstatSync(fd).size!==initial.size) throw new Error("Packaging file changed during bounded read");
  return bytes;
}
if(!["--all","--build-only","--package-only"].includes(mode) || process.argv.length>3) throw new Error("Fixed TIP076 build mode required");
if(mode!=="--package-only") {
  // Invalidate a prior profile before building into the reused output.
  if(existsSync(profileMarker))unlinkSync(profileMarker);
  const result=spawnSync(process.execPath,["node_modules/next/dist/bin/next","build"],{
    env:{...process.env,HIVE_BUILD_PROFILE:"TIP076_QA",NODE_ENV:"production"},stdio:"inherit",timeout:240000});
  if(result.error || result.status!==0) process.exit(result.status??1);
}
if(!existsSync(path.join(root,"server.js"))) throw new Error("TIP076 standalone build missing");
// Same generated-artifact scrub contract as ordinary build, exact task root only.
for(const name of readdirSync(root)) if(name===".env" || name.startsWith(".env.")) unlinkSync(path.join(root,name));
// Dynamic source review reads must not make Next trace historical evidence.
// Audit ONLY generated inventories; never follow or stat their original targets.
const inventories=[".next-build/next-server.js.nft.json"],directories=[".next-build/server"];
let generatedEntries=0;
while(directories.length) {
  const directory=directories.pop();
  for(const entry of readdirSync(directory,{withFileTypes:true})) {
    if(++generatedEntries>4096 || entry.isSymbolicLink()) throw new Error("Generated inventory traversal bound");
    const file=path.join(directory,entry.name);
    if(entry.isDirectory()) directories.push(file);
    else if(entry.isFile() && entry.name.endsWith(".nft.json")) inventories.push(file);
  }
}
let traceBytes=0,traceReferences=0;
for(const inventory of inventories) {
  const fd=openSync(inventory,constants.O_RDONLY|constants.O_NOFOLLOW);
  let refs;
  try {
    const bytes=boundedDescriptorRead(fd,Math.min(1048576,16777216-traceBytes));traceBytes+=bytes.byteLength;
    refs=JSON.parse(bytes.toString("utf8")).files;
  } finally {closeSync(fd);}
  if(!Array.isArray(refs) || refs.length>4096 || refs.some(file=>typeof file!=="string" || /p139|attempt[-_ ]?5|oldsource|\.storage|(^|\/)artifacts\/|TIP-075|tip075/i.test(file))) throw new Error("Generated trace includes out-of-scope historical material; quarantine exact QA output and fix tracing before browser QA");
  traceReferences+=refs.length;
}
console.log(`TIP076 generated trace admission: ${inventories.length} inventories, ${traceReferences} references, ${traceBytes} bytes; no forbidden historical/storage name flags`);
const markerFd=openSync(profileMarker,mode==="--package-only"?constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK:constants.O_WRONLY|constants.O_CREAT|constants.O_EXCL|constants.O_NOFOLLOW,0o600);
try {
  if(mode==="--package-only") {if(boundedDescriptorRead(markerFd,64).toString("utf8")!=="TIP076_QA\n")throw new Error("Shared build profile mismatch");}
  else writeFileSync(markerFd,"TIP076_QA\n");
} finally {closeSync(markerFd);}
if(mode==="--build-only") process.exit(0);
if(existsSync("public")) cpSync("public",path.join(root,"public"),{recursive:true});
mkdirSync(path.join(root,".next-build"),{recursive:true});
cpSync(".next-build/static",path.join(root,".next-build/static"),{recursive:true});
const manifestPath="docs/verification/TIP-076B_RUNTIME_SOURCE_BUNDLE.json";
function safeRead(file,maxBytes=262144) {
  if(path.isAbsolute(file) || file.includes("..") || file.includes("\\") || !/^(src\/(modules|server|app|components|i18n)\/|prisma\/|scripts\/(db|test)\/|docs\/verification\/TIP-076)/.test(file) || (!/\.(ts|tsx|json|sql|md|mjs)$/.test(file) && file!=="prisma/schema.prisma")) throw new Error("Reviewed packaging path refused");
  const fd=openSync(file,constants.O_RDONLY|constants.O_NOFOLLOW);
  try {return boundedDescriptorRead(fd,maxBytes);} finally {closeSync(fd);}
}
const manifestBytes=safeRead(manifestPath,65536),bundle=JSON.parse(manifestBytes.toString("utf8"));
if(bundle.version!==3 || bundle.purpose!=="LOCAL_ENGINEERING_ONLY" || !bundle.sourcePins || !/^docs\/verification\/TIP-076[A-Z_0-9-]+\.md$/.test(bundle.reviewReport)) throw new Error("Reviewed TIP076 bundle required");
const inventory=Object.entries({...bundle.sourcePins,[bundle.reviewReport]:bundle.reviewReportDigest});
if(inventory.length>128) throw new Error("Reviewed packaging inventory ceiling");
let total=manifestBytes.byteLength;
const copies=[];
for(const [file,pin] of inventory) {
  if(typeof pin!=="string" || !/^[a-f0-9]{64}$/.test(pin)) throw new Error("Reviewed packaging pin refused");
  const bytes=safeRead(file,Math.min(262144,1048576-total));total+=bytes.byteLength;
  if(total>1048576 || createHash("sha256").update(bytes).digest("hex")!==pin) throw new Error("Reviewed packaging source drift or budget refusal");
  copies.push([file,bytes]);
}
// Complete admission before copying ANY reviewed source; no arbitrary root override.
for(const [file,bytes] of [...copies,[manifestPath,manifestBytes]]) {
  const destination=path.join(root,file);mkdirSync(path.dirname(destination),{recursive:true});writeFileSync(destination,bytes,{mode:0o600});
}
console.log(`TIP076 packaging: ${inventory.length} pinned files plus manifest, ${total} bytes; no historical evidence or env files`);
