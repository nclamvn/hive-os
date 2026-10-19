// Fixed isolated app server only. Never launches the model worker or a provider.
import { spawn } from "node:child_process";
import { constants,existsSync,lstatSync,realpathSync,openSync,fstatSync,readSync,closeSync,writeFileSync,unlinkSync } from "node:fs";
import path from "node:path";

if(process.env.NODE_ENV!=="test") throw new Error("TIP079 exact test environment required");
const qaUrl="http://127.0.0.1:3002";
if(process.env.PORT && process.env.PORT!=="3002") throw new Error("Fixed TIP079 QA port3002 required");
for(const key of ["BETTER_AUTH_URL","MAIL_BASE_URL"]) if(process.env[key] && process.env[key]!==qaUrl) throw new Error("Fixed loopback TIP079 QA origin required");
const db=new URL(process.env.DATABASE_URL??"");
if(!["localhost","127.0.0.1"].includes(db.hostname)||db.port!=="5433"||db.pathname!=="/hiveos_test") throw new Error("TIP079 isolated QA database required");
if(process.env.STORAGE_DRIVER!=="local") throw new Error("TIP079 local QA storage required");
const storage=process.env.HIVE_TIP079_STORAGE_ROOT;
if(!storage || !/^\/private\/tmp\/hiveos-tip079-[A-Za-z0-9_-]+$/.test(storage)) throw new Error("Explicit owned absolute QA storage required");
const st=lstatSync(storage);
if(!st.isDirectory()||st.isSymbolicLink()||(st.mode&0o077)!==0||(process.getuid&&st.uid!==process.getuid())||realpathSync(storage)!==storage) throw new Error("Owned mode0700 nonsymlink QA storage required");
const root=path.resolve(".next-build/standalone"),sourcePath=path.join(root,"server.js"),testPath=path.join(root,"server.tip079.e2e.cjs");
const markerFd=openSync(path.join(root,"hive-build-profile.txt"),constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
try {
  const info=fstatSync(markerFd);if(!info.isFile()||info.size>64)throw new Error("Shared build profile mismatch");
  const marker=Buffer.alloc(info.size);
  if(readSync(markerFd,marker,0,marker.length,0)!==marker.length||readSync(markerFd,Buffer.alloc(1),0,1,marker.length)||marker.toString("utf8")!=="TIP079_QA\n")throw new Error("Shared build profile mismatch");
} finally {closeSync(markerFd);}
if(lstatSync(root).isSymbolicLink()||existsSync(testPath)) throw new Error("Create-only generated standalone entry required");
const fd=openSync(sourcePath,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);let source;
try {const info=fstatSync(fd);if(!info.isFile()||info.size>65536) throw new Error("Bounded generated entry required");const b=Buffer.alloc(info.size);let at=0;while(at<b.length){const n=readSync(fd,b,at,b.length-at,at);if(!n)throw new Error("Changed generated entry");at+=n;}if(readSync(fd,Buffer.alloc(1),0,1,at)||fstatSync(fd).size!==info.size)throw new Error("Changed generated entry");source=b.toString("utf8");} finally {closeSync(fd);}
const assignment="process.env.NODE_ENV = 'production'";
if(source.split(assignment).length!==2) throw new Error("Fixed generated test-mode contract required");
writeFileSync(testPath,source.replace(assignment,"process.env.NODE_ENV = 'test'"),{flag:"wx",mode:0o600});
const child=spawn(process.execPath,[testPath],{cwd:root,env:{...process.env,HIVE_BUILD_PROFILE:"TIP079_QA",STORAGE_LOCAL_ROOT:storage,PORT:"3002",HOSTNAME:"127.0.0.1",BETTER_AUTH_URL:qaUrl,MAIL_BASE_URL:qaUrl},stdio:"inherit"});
console.log(`TIP079 shared QA storage: ${storage}`);
let stopping=false;
for(const s of ["SIGINT","SIGTERM"])process.on(s,()=>{if(!stopping){stopping=true;child.kill(s);}});
child.on("exit",(code,s)=>{if(existsSync(testPath))unlinkSync(testPath);if(s)process.kill(process.pid,s);else process.exit(code??1);});
