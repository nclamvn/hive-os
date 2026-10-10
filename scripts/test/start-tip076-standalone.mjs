// Reuse existing E2E strategy on fixed alternate distDir; no production mutation.
import { spawn } from "node:child_process";
import { constants,existsSync,lstatSync,mkdtempSync,readFileSync,writeFileSync,unlinkSync,openSync,fstatSync,readSync,closeSync } from "node:fs";
import path from "node:path";
import os from "node:os";

if(process.env.NODE_ENV!=="test") throw new Error("TIP076 launcher requires NODE_ENV=test");
const db=new URL(process.env.DATABASE_URL??"");
if(!["localhost","127.0.0.1"].includes(db.hostname) || db.port!=="5433" || db.pathname!=="/hiveos_test") throw new Error("TIP076 isolated QA database required");
const root=path.resolve(".next-build/standalone"),sourcePath=path.join(root,"server.js"),testPath=path.join(root,"server.tip076.e2e.cjs");
const markerFd=openSync(path.join(root,"hive-build-profile.txt"),constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
try {
  const info=fstatSync(markerFd);if(!info.isFile()||info.size>64)throw new Error("Shared build profile mismatch");
  const marker=Buffer.alloc(info.size);
  if(readSync(markerFd,marker,0,marker.length,0)!==marker.length||readSync(markerFd,Buffer.alloc(1),0,1,marker.length)||marker.toString("utf8")!=="TIP076_QA\n")throw new Error("Shared build profile mismatch");
} finally {closeSync(markerFd);}
const assignment="process.env.NODE_ENV = 'production'",source=readFileSync(sourcePath,"utf8");
if(source.split(assignment).length!==2 || existsSync(testPath)) throw new Error("TIP076 standalone contract/temporary entrypoint refused");
if(process.env.STORAGE_DRIVER!=="local") throw new Error("TIP076 requires local QA storage");
const taskStorage=process.env.HIVE_TIP076_STORAGE_ROOT??mkdtempSync(path.join(os.tmpdir(),"hiveos-tip076-ui-"));
if(!path.isAbsolute(taskStorage) || !/^\/(private\/)?(tmp|var\/folders)\//.test(taskStorage) || !taskStorage.includes("hiveos-tip076")) throw new Error("TIP076 task-owned absolute temporary storage required");
const storageStat=lstatSync(taskStorage);
if(!storageStat.isDirectory() || storageStat.isSymbolicLink() || (process.getuid && storageStat.uid!==process.getuid()) || (storageStat.mode&0o077)!==0) throw new Error("TIP076 owned mode0700 temporary storage required");
writeFileSync(testPath,source.replace(assignment,"process.env.NODE_ENV = 'test'"),{flag:"wx",mode:0o600});
const child=spawn(process.execPath,[testPath],{cwd:root,env:{...process.env,HIVE_BUILD_PROFILE:"TIP076_QA",STORAGE_LOCAL_ROOT:taskStorage},stdio:"inherit"});
console.log(`TIP076 QA storage: ${taskStorage}`);
let stopping=false;
for(const signal of ["SIGINT","SIGTERM"]) process.on(signal,()=>{if(!stopping){stopping=true;child.kill(signal);}});
child.on("exit",(code,signal)=>{unlinkSync(testPath);if(signal)process.kill(process.pid,signal);else process.exit(code??1);});
