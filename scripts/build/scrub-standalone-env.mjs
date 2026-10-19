// Next.js copies loaded .env files into standalone output. Deployment
// configuration must be injected at runtime, never baked into the artifact.
import {readdirSync,unlinkSync} from "node:fs";
import path from "node:path";
import {resolveStandalonePaths} from "./standalone-paths.mjs";

const {standaloneRoot}=resolveStandalonePaths();
const files=[];
let entries=0;
function collect(directory) {
  for(const entry of readdirSync(directory,{withFileTypes:true})){
    if(++entries>200000)throw new Error("Standalone env traversal refused");
    const file=path.join(directory,entry.name);
    if(entry.name===".env"||entry.name.startsWith(".env.")){
      if(!entry.isFile()&&!entry.isSymbolicLink())throw new Error("Standalone env entry refused");
      files.push(file);
    }else if(entry.isDirectory()){
      collect(file); // Dirent symlinks are never followed outside the artifact.
    }
  }
}
collect(standaloneRoot);
for(const file of files)unlinkSync(file);
console.log(`standalone-env: scrubbed ${files.length} retained env files`);
