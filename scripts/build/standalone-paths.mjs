import {lstatSync,readFileSync,realpathSync} from "node:fs";
import path from "node:path";

// Only live build profiles, never arbitrary paths or historical snapshot roots.
export function resolveStandalonePaths(projectRoot=process.cwd(),profile=process.env.HIVE_BUILD_PROFILE) {
  const root=path.resolve(projectRoot);
  const distDir=["LOCAL_QA","TIP076_QA","TIP079_QA","TIP080_QA"].includes(profile)?".next-build":".next";
  const buildRoot=path.join(root,distDir),standaloneRoot=path.join(buildRoot,"standalone");
  for(const directory of [buildRoot,standaloneRoot]){
    const info=lstatSync(directory);
    if(!info.isDirectory()||info.isSymbolicLink()||realpathSync(directory)!==directory)throw new Error("Standalone output directory refused");
  }
  const manifestPath=path.join(buildRoot,"required-server-files.json"),manifestInfo=lstatSync(manifestPath);
  if(!manifestInfo.isFile()||manifestInfo.isSymbolicLink()||manifestInfo.size>1048576)throw new Error("Standalone build manifest refused");
  const manifest=JSON.parse(readFileSync(manifestPath,"utf8"));
  if(manifest?.config?.distDir!==distDir||manifest.config.output!=="standalone")throw new Error("Standalone build profile mismatch");
  const server=lstatSync(path.join(standaloneRoot,"server.js"));
  if(!server.isFile()||server.isSymbolicLink())throw new Error("Standalone server artifact refused");
  return {root,distDir,buildRoot,standaloneRoot};
}
