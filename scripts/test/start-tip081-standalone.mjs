// Phase-A fixed read-only server pending Main review; no workers or old grants.
import {spawn} from "node:child_process";
import {lstatSync,realpathSync,writeFileSync,unlinkSync} from "node:fs";
import path from "node:path";
import {readDescriptor,reviewedSources,traceAdmission,safeRead,fixedEnvironment,preflightEnvironment,assertPackagedDependencies,requireBuild4Success,STORAGE} from "./build-tip081.mjs";
const root=process.argv[2];if(process.argv.length!==3)throw new Error("TIP081_SHADOW_ARGUMENT_REQUIRED");
const d=readDescriptor(root);requireBuild4Success(root,d,process.env.HIVE_TIP081_BUILD_ACK);const env=fixedEnvironment(process.env);await preflightEnvironment(env);traceAdmission(root);safeRead(root,".next-tip080/standalone/server.js",65536);assertPackagedDependencies(root,d.packagedRoot);reviewedSources(d.packagedRoot);
const st=lstatSync(STORAGE);if(!st.isDirectory()||st.isSymbolicLink()||(st.mode&0o777)!==0o700||st.uid!==process.getuid?.()||realpathSync(STORAGE)!==STORAGE)throw new Error("TIP081_PRIVATE_STORAGE_REFUSED");
const source=safeRead(d.packagedRoot,"server.js",65536).toString("utf8"),assignment="process.env.NODE_ENV = 'production'";
if(source.split(assignment).length!==2)throw new Error("TIP081_TEST_ENTRY_REFUSED");
const entry=path.join(d.packagedRoot,"server.tip081.e2e.cjs");writeFileSync(entry,source.replace(assignment,"process.env.NODE_ENV = 'test'"),{flag:"wx",mode:0o600});
const child=spawn(process.execPath,[entry],{cwd:d.packagedRoot,env,stdio:"inherit"});
console.log(JSON.stringify({purpose:"READ_ONLY_EVIDENCE_STUDIO",port:3004,scientificEffects:"NONE",shadowRoot:root}));
for(const signal of ["SIGINT","SIGTERM"])process.on(signal,()=>child.kill(signal));
child.on("error",()=>{unlinkSync(entry);process.exitCode=1;});child.on("exit",(code,signal)=>{unlinkSync(entry);process.exit(signal?128+(signal==="SIGINT"?2:15):code??1);});
