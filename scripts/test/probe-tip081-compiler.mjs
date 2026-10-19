// Main-only tiny compatibility probe. Never creates an app bundle or server.
import {createRequire} from "node:module";
import {readFileSync,lstatSync,realpathSync,mkdtempSync,mkdirSync,writeFileSync,symlinkSync} from "node:fs";
import fs from "node:fs";
import path from "node:path";
import {isDeepStrictEqual} from "node:util";
import {fileURLToPath} from "node:url";
import {assertOverlay,assertOriginalConfigSet,writeOverlay,ORIGINAL_CONFIG_DIGEST} from "./compiler-tip081-overlay.mjs";
import {safeRead,assertDependencies,hash} from "./build-tip081.mjs";
export function normalizedConfigDiagnostic(overlay,baseline,root,baselineRoot){
 const differences=[];let nodes=0,truncated=false;const kind=v=>v===null?"null":Array.isArray(v)?"array":typeof v;
 function safeValue(key,value){
  if(["outputFileTracingRoot","turbopack.root","distDir"].includes(key)&&typeof value==="string"){if(value==="TIP081_FIXTURE_ROOT")return value;for(const [directory,label]of [[baselineRoot,"BASELINE_FIXTURE_ROOT"],[root,"FIXTURE_ROOT"]]){if(value===directory)return label;if(value.startsWith(directory+path.sep)){const suffix=value.slice(directory.length);if(/^\/[A-Za-z0-9_./-]{1,160}$/.test(suffix))return label+suffix;}}if(key==="distDir"&&value===".next-tip080")return value;}
  if(key==="output"&&value==="standalone"||key==="experimental.serverActions.bodySizeLimit"&&value==="11mb"||["basePath","assetPrefix"].includes(key)&&value==="")return value;
  if(["cacheComponents","cleanDistDir","compress","poweredByHeader","reactStrictMode","trailingSlash","skipMiddlewareUrlNormalize"].includes(key)&&typeof value==="boolean")return value;
  return "VALUE_WITHHELD";
 }
 function visit(a,b,key,depth){if(++nodes>5000||depth>20||differences.length>=32){truncated=true;return;}if(isDeepStrictEqual(a,b))return;const ka=kind(a),kb=kind(b);if(ka===kb&&(ka==="object"||ka==="array")&&a!==null&&b!==null){const keys=[...new Set([...Object.keys(a),...Object.keys(b)])];if(keys.length>512){truncated=true;return;}for(const k of keys){const safeKey=/^[A-Za-z0-9_-]{1,64}$/.test(k)?k:"UNSUPPORTED_KEY";visit(a[k],b[k],key?`${key}.${safeKey}`:safeKey,depth+1);}return;}
  differences.push({path:key.slice(0,200),overlayType:ka,baselineType:kb,overlayValue:safeValue(key,a),baselineValue:safeValue(key,b)});
 }
 visit(overlay,baseline,"",0);return {diagnostic:"TIP081_NORMALIZED_CONFIG_MISMATCH",purpose:"COMPILER_IDENTITY_REPAIR_ONLY",differences,truncated};
}
export function normalizedCompilerOptions(value,root,top=true){if(value===root)return "TIP081_FIXTURE_ROOT";if(Array.isArray(value))return value.map(v=>normalizedCompilerOptions(v,root,false));if(value&&typeof value==="object"&&Object.getPrototypeOf(value)===Object.prototype)return Object.fromEntries(Object.entries(value).filter(([k])=>!top||!["configOrigin","configFile","configFileName","webpack"].includes(k)).map(([k,v])=>[k,normalizedCompilerOptions(v,root,false)]));return value;}
export function assertNormalizedCompilerOptions(overlay,baseline,root){
 if(!/^\/private\/tmp\/hiveos-tip081-shadow-[A-Za-z0-9]+$/.test(root)||overlay.outputFileTracingRoot!==root||baseline.outputFileTracingRoot!==root||overlay.turbopack?.root!==root||baseline.turbopack?.root!==root)throw new Error("TIP081_PROBE_TRACING_ROOT_REFUSED");
 if(!isDeepStrictEqual(normalizedCompilerOptions(overlay,root),normalizedCompilerOptions(baseline,root)))throw new Error("TIP081_PROBE_NORMALIZED_CONFIG_REFUSED");
 return true;
}
export function safeProbeError(error){
 const message=typeof error?.message==="string"?error.message.slice(0,1000).replace(/[\u0000-\u001f\u007f]/g," "):"TIP081_UNKNOWN_PROBE_FAILURE";
 const nextCode=typeof error?.__NEXT_ERROR_CODE==="string"&&/^E[0-9]{1,12}$/.test(error.__NEXT_ERROR_CODE)?error.__NEXT_ERROR_CODE:null;
 const code=typeof error?.code==="string"&&/^[A-Z0-9_]{1,64}$/.test(error.code)?error.code:null;
 const frames=[];if(typeof error?.stack==="string"){for(const match of error.stack.matchAll(/(?:^|\n)[ \t]+at ([^\r\n]*)/g)){frames.push(` at ${match[1].slice(0,296)}`);if(frames.length===8)break;}}
 return {diagnostic:"TIP081_COMPILER_PROBE_FAILURE",purpose:"COMPILER_IDENTITY_REPAIR_ONLY",status:"REFUSED",message,__NEXT_ERROR_CODE:nextCode,errorCode:code,stackFrames:frames,applicationBuilds:0};
}
export function prepareProbe(){
 const sourceRoot="/Users/os/hiveos",trusted=path.join(sourceRoot,"node_modules");assertOriginalConfigSet(sourceRoot);
 const dependency=lstatSync(trusted);if(!dependency.isDirectory()||dependency.isSymbolicLink()||realpathSync(trusted)!==trusted)throw new Error("TIP081_PROBE_DEPENDENCY_ROOT_REFUSED");
 const files=["next.config.ts","package.json","package-lock.json","tsconfig.json"],inputs=files.map(file=>[file,safeRead(sourceRoot,file,file==="package-lock.json"?1048576:262144)]);
 if(hash(inputs[0][1])!==ORIGINAL_CONFIG_DIGEST||inputs.reduce((n,[,bytes])=>n+bytes.length,0)>2097152)throw new Error("TIP081_PROBE_INPUT_REFUSED");
 const root=mkdtempSync("/private/tmp/hiveos-tip081-shadow-"),info=lstatSync(root);if(!info.isDirectory()||info.isSymbolicLink()||(info.mode&0o777)!==0o700||info.uid!==process.getuid?.()||realpathSync(root)!==root)throw new Error("TIP081_PROBE_FIXTURE_ROOT_REFUSED");
 for(const [file,bytes]of inputs)writeFileSync(path.join(root,file),bytes,{flag:"wx",mode:0o600});symlinkSync(trusted,path.join(root,"node_modules"),"dir");assertDependencies(root);
 const tmp=path.join(root,"tmp");mkdirSync(tmp,{mode:0o700});const compilerOverlay=writeOverlay(root);
 assertOriginalConfigSet(sourceRoot);for(const [file,bytes]of inputs)if(!safeRead(sourceRoot,file,file==="package-lock.json"?1048576:262144).equals(bytes))throw new Error("TIP081_PROBE_INPUT_CHANGED");
 return {purpose:"COMPILER_IDENTITY_REPAIR_ONLY",fixtureRoot:root,TMPDIR:tmp,compilerOverlay,inputFiles:4,applicationBuilds:0,probesRun:0};
}
export async function probeCompiler(root){
 if(!process.execArgv.includes("--preserve-symlinks")||!process.execArgv.includes("--preserve-symlinks-main")||process.env.HIVE_BUILD_PROFILE!=="TIP080_QA"||process.env.NEXT_DISABLE_SWC_WASM!=="1"||process.env.NEXT_IGNORE_INCORRECT_LOCKFILE!=="1")throw new Error("TIP081_PROBE_PROFILE_REFUSED");
 for(const key of ["NEXT_TEST_WASM","NEXT_TEST_NATIVE_DIR","NEXT_TEST_NATIVE_IGNORE_LOCAL_INSTALL","__INTERNAL_CUSTOM_TURBOPACK_BINDINGS","NEXT_PRIVATE_LOCAL_WEBPACK","NEXT_RSPACK"])if(process.env[key])throw new Error("TIP081_PROBE_CUSTOM_BINDING_REFUSED");
 assertOverlay(root);const trusted=assertDependencies(root),req=createRequire(path.join(root,"probe.cjs")),compilerId=req.resolve("next/dist/build/swc");if(!compilerId.startsWith(root+"/node_modules/"))throw new Error("TIP081_PROBE_COMPILER_ID_REFUSED");
 const nativeTriple=process.platform==="darwin"&&["arm64","x64"].includes(process.arch)?`darwin-${process.arch}`:null;if(!nativeTriple)throw new Error("TIP081_PROBE_NATIVE_PLATFORM_REFUSED");const nativeName=`@next/swc-${nativeTriple}`,nativeBinary=req.resolve(nativeName);
 if(nativeBinary!==path.join(root,"node_modules",nativeName,`next-swc.${nativeTriple}.node`))throw new Error("TIP081_PROBE_NATIVE_PATH_REFUSED");
 let nativePath=trusted;const nativeParts=["@next",`swc-${nativeTriple}`,`next-swc.${nativeTriple}.node`];for(const [i,part]of nativeParts.entries()){nativePath=path.join(nativePath,part);const st=lstatSync(nativePath);if(st.isSymbolicLink()||i<nativeParts.length-1&&!st.isDirectory()||i===nativeParts.length-1&&!st.isFile())throw new Error("TIP081_PROBE_NATIVE_REQUIRED");}
 const lockBytes=safeRead(root,"package-lock.json",1048576),lock=JSON.parse(lockBytes),nextVersion=req("next/package.json").version;if(lock.lockfileVersion!==3||lock.packages?.["node_modules/next"]?.version!==nextVersion||lock.packages?.[`node_modules/${nativeName}`]?.version!==nextVersion||req(`${nativeName}/package.json`).version!==nextVersion)throw new Error("TIP081_PROBE_LOCK_REQUIRED");
 const swc=req("next/dist/build/swc"),before=readFileSync(path.join(root,"next.config.ts"));
 const {transpileConfig}=req("next/dist/build/next-config-ts/transpile-config");const baseModule=await transpileConfig({nextConfigPath:path.join(root,"next.config.ts"),dir:root}),original=baseModule.default??baseModule;
 await swc.loadBindings();
 const loadConfig=req("next/dist/server/config").default,bundler=req("next/dist/lib/bundler").Bundler.Webpack;const config=await loadConfig("phase-production-build",root,{silent:true,bundler});
 if(config.configFileName!=="next.config.mjs"||typeof config.webpack!=="function")throw new Error("TIP081_PROBE_CONFIG_PRECEDENCE_REFUSED");
 function sameDeclared(actual,declared){if(declared&&typeof declared==="object"&&!Array.isArray(declared))return actual&&typeof actual==="object"&&Object.entries(declared).every(([k,v])=>sameDeclared(actual[k],v));return isDeepStrictEqual(actual,declared);}if(!sameDeclared(config,original))throw new Error("TIP081_PROBE_SEMANTIC_CONFIG_REFUSED");
 const baselineRoot=path.join(root,"baseline-config");mkdirSync(baselineRoot,{mode:0o700});for(const file of ["next.config.ts","package.json","package-lock.json","tsconfig.json"])writeFileSync(path.join(baselineRoot,file),safeRead(root,file,file==="package-lock.json"?1048576:262144),{flag:"wx",mode:0o600});symlinkSync(trusted,path.join(baselineRoot,"node_modules"),"dir");
 const baselineConfig=await loadConfig("phase-production-build",baselineRoot,{silent:true,bundler});
 try{assertNormalizedCompilerOptions(config,baselineConfig,root);}catch(e){console.log(JSON.stringify(normalizedConfigDiagnostic(normalizedCompilerOptions(config,root),normalizedCompilerOptions(baselineConfig,root),root,baselineRoot)));throw e;}
 // Obtain Next's actual ResolverFactory from a resolver-only compiler holder;
 // no compiler run, compilation, entries or application bundle is generated.
 const bundled=req("next/dist/compiled/webpack/webpack"),Compiler=bundled.webpack.Compiler;if(typeof Compiler!=="function")throw new Error("TIP081_PROBE_ACTUAL_RESOLVER_REQUIRED");
 // Construct only the installed resolver holder; never invoke run/compile or
 // create entries/output. Compiler's constructor installs its ResolverFactory.
 const resolverFactory=new Compiler(root,{name:"TIP081_RESOLVER_ONLY",experiments:{backCompat:false},output:{hashFunction:"xxhash64"}}).resolverFactory;
 const alias=path.join(root,"node_modules/next/dist/build/webpack/loaders/next-swc-loader.js"),initial={resolveLoader:{alias:{"next-swc-loader":alias}},module:{rules:[]},plugins:[]};const fixed=config.webpack(initial,{});
 if(!isDeepStrictEqual({...fixed,resolveLoader:initial.resolveLoader},initial)||!isDeepStrictEqual({...fixed.resolveLoader,symlinks:undefined},{...initial.resolveLoader,symlinks:undefined})||fixed.resolveLoader.symlinks!==false)throw new Error("TIP081_PROBE_OVERLAY_DELTA_REFUSED");
 const resolve=symlinks=>resolverFactory.get("loader",{fileSystem:fs,useSyncFileSystemCalls:true,extensions:[".js"],symlinks}).resolveSync({},root,alias);
 const baselineLoader=resolve(true),fixedLoader=resolve(fixed.resolveLoader.symlinks);if(typeof baselineLoader!=="string"||typeof fixedLoader!=="string")throw new Error("TIP081_PROBE_LOADER_REFUSED");
 const baselineReq=createRequire(baselineLoader),fixedReq=createRequire(fixedLoader),baselineId=baselineReq.resolve("../../swc"),fixedId=fixedReq.resolve("../../swc"),baseline=baselineReq("../../swc"),corrected=fixedReq("../../swc");
 if(baselineId===compilerId||baseline===swc||fixedId!==compilerId||corrected!==swc)throw new Error("TIP081_PROBE_IDENTITY_REFUSED");
 let baselineRefused=false;try{baseline.getBindingsSync();}catch(e){baselineRefused=e.__NEXT_ERROR_CODE==="E907"&&String(e.message).startsWith("bindings not loaded yet.");}if(!baselineRefused||corrected.getBindingsSync()!==swc.getBindingsSync())throw new Error("TIP081_PROBE_BINDING_CACHE_REFUSED");
 const source="export const engineeringOnly = 81;",result=await corrected.transform(source,{filename:path.join(root,"tiny-only.ts"),jsc:{parser:{syntax:"typescript"},target:"es2017"},module:{type:"commonjs"}});if(!result.code.includes("engineeringOnly")||!readFileSync(path.join(root,"next.config.ts")).equals(before))throw new Error("TIP081_PROBE_TRANSFORM_OR_SOURCE_REFUSED");assertOverlay(root);
 return {purpose:"COMPILER_IDENTITY_REPAIR_ONLY",configFile:config.configFileName,originalDigest:ORIGINAL_CONFIG_DIGEST,baselineDistinct:true,baselineUninitializedRefused:true,baselineErrorCode:"E907",fixedSameInstance:true,nativeTinyTransform:true,normalizedOptionsPreserved:true,delta:"webpack.resolveLoader.symlinks=false",applicationBuilds:0};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{if(process.argv.length!==3)throw new Error("TIP081_PROBE_FIXED_ARGUMENT_REQUIRED");console.log(JSON.stringify(process.argv[2]==="--prepare-probe"?prepareProbe():await probeCompiler(process.argv[2])));}catch(error){console.error(JSON.stringify(safeProbeError(error)));process.exitCode=1;}}
