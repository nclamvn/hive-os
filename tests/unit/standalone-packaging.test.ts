import {spawnSync} from "node:child_process";
import {existsSync,mkdtempSync,mkdirSync,readFileSync,realpathSync,rmSync,symlinkSync,writeFileSync} from "node:fs";
import os from "node:os";
import path from "node:path";
import {afterEach,describe,expect,it} from "vitest";

const scriptRoot=path.resolve("scripts/build");
const roots:string[]=[];
function fixture(){
  const root=realpathSync(mkdtempSync(path.join(os.tmpdir(),"codex-tmp-standalone-20261010-")));
  roots.push(root);
  for(const dist of [".next",".next-build"]){
    const build=path.join(root,dist),standalone=path.join(build,"standalone");
    mkdirSync(path.join(standalone,"packages/app"),{recursive:true});mkdirSync(path.join(build,"static"));
    writeFileSync(path.join(build,"required-server-files.json"),JSON.stringify({config:{distDir:dist,output:"standalone"}}));
    writeFileSync(path.join(standalone,"server.js"),"// inert fixture, never evaluated");
    writeFileSync(path.join(standalone,".env"),"TEST_FIXTURE_ONLY=not-a-secret");
    writeFileSync(path.join(standalone,"packages/app/.env.production"),"TEST_FIXTURE_ONLY=not-a-secret");
    writeFileSync(path.join(build,"static/chunk.txt"),dist);
  }
  mkdirSync(path.join(root,"public"));writeFileSync(path.join(root,"public/asset.txt"),"public fixture");
  return root;
}
function run(root:string,script:string,profile=""){
  return spawnSync(process.execPath,[path.join(scriptRoot,script)],{cwd:root,env:{...process.env,HIVE_BUILD_PROFILE:profile},encoding:"utf8",timeout:5000,maxBuffer:32768});
}
function runE2E(root:string,profile="",nodeEnv:"test"|"development"|"production"="test"){
  return spawnSync(process.execPath,[path.resolve("scripts/test/start-e2e-standalone.mjs")],{cwd:root,env:{...process.env,HIVE_BUILD_PROFILE:profile,NODE_ENV:nodeEnv},encoding:"utf8",timeout:5000,maxBuffer:32768});
}
afterEach(()=>{
  for(const root of roots.splice(0)){
    if(!path.basename(root).startsWith("codex-tmp-standalone-20261010-"))throw new Error("Refuse unowned fixture cleanup");
    rmSync(root,{recursive:true,force:true});
  }
});

describe("standalone post-build packaging selects only the built artifact",()=>{
  it.each(["", "LOCAL_QA"])("E2E starts the exact %s artifact in test mode and cleans its temporary entrypoint",profile=>{
    const root=fixture(),dist=profile?".next-build":".next";
    const source=`process.env.NODE_ENV = 'production'; console.log(${JSON.stringify(dist)} + ':' + process.env.NODE_ENV);`;
    writeFileSync(path.join(root,dist,"standalone/server.js"),source);
    const result=runE2E(root,profile);
    expect(result.status,result.stderr).toBe(0);
    expect(result.stdout.trim()).toBe(`${dist}:test`);
    expect(readFileSync(path.join(root,dist,"standalone/server.js"),"utf8")).toBe(source);
    expect(existsSync(path.join(root,dist,"standalone/server.e2e.cjs"))).toBe(false);
  });
  it.each(["TIP076_QA", "TIP079_QA", "TIP080_QA", "unknown"])("E2E refuses historical/unknown profile %s",profile=>{
    const result=runE2E(fixture(),profile);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("dedicated test launcher");
  });
  it.each(["production", "development"] as const)("E2E refuses NODE_ENV=%s",nodeEnv=>{
    expect(runE2E(fixture(),"LOCAL_QA",nodeEnv).stderr).toContain("requires NODE_ENV=test");
  });
  it("E2E refuses missing QA output instead of launching a stale default",()=>{
    const root=fixture();rmSync(path.join(root,".next-build/standalone"),{recursive:true});
    expect(runE2E(root,"LOCAL_QA").status).not.toBe(0);
    expect(existsSync(path.join(root,".next/standalone/server.e2e.cjs"))).toBe(false);
  });
  it.each(["", "LOCAL_QA"])("starts only the selected %s artifact without loading project env files",profile=>{
    const root=fixture();
    for(const dist of [".next", ".next-build"]){
      writeFileSync(path.join(root,dist,"standalone/server.js"),`console.log(${JSON.stringify(dist)});`);
    }
    const result=run(root,"start-standalone.mjs",profile);
    expect(result.status,result.stderr).toBe(0);
    expect(result.stdout.trim()).toBe(profile?".next-build":".next");
  });
  it.each(["TIP076_QA", "TIP079_QA", "TIP080_QA", "unknown"])("refuses %s rather than bypassing its dedicated launcher",profile=>{
    const result=run(fixture(),"start-standalone.mjs",profile);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("dedicated test launcher");
  });
  it("never falls back to a stale default artifact when LOCAL_QA output is missing",()=>{
    const root=fixture();rmSync(path.join(root,".next-build/standalone"),{recursive:true});
    expect(run(root,"start-standalone.mjs","LOCAL_QA").status).not.toBe(0);
  });
  it.each(["","LOCAL_QA","TIP076_QA","TIP079_QA","TIP080_QA"])("scrubs and packages the selected %s output only",profile=>{
    const root=fixture(),dist=profile?".next-build":".next",other=profile?".next":".next-build";
    const scrub=run(root,"scrub-standalone-env.mjs",profile);
    expect(scrub.status,scrub.stderr).toBe(0);
    expect(existsSync(path.join(root,dist,"standalone/.env"))).toBe(false);
    expect(existsSync(path.join(root,dist,"standalone/packages/app/.env.production"))).toBe(false);
    expect(existsSync(path.join(root,other,"standalone/.env"))).toBe(true);
    const assets=run(root,"prepare-standalone-assets.mjs",profile);
    expect(assets.status,assets.stderr).toBe(0);
    expect(readFileSync(path.join(root,dist,"standalone",dist,"static/chunk.txt"),"utf8")).toBe(dist);
    expect(readFileSync(path.join(root,dist,"standalone/public/asset.txt"),"utf8")).toBe("public fixture");
    expect(existsSync(path.join(root,other,"standalone/public"))).toBe(false);
    expect(existsSync(path.join(root,dist,"standalone",other,"static"))).toBe(false);
  });
  it("fails loudly rather than reporting a nonexistent LOCAL_QA artifact scrubbed",()=>{
    const root=fixture();rmSync(path.join(root,".next-build/standalone"),{recursive:true});
    const result=run(root,"scrub-standalone-env.mjs","LOCAL_QA");
    expect(result.status).not.toBe(0);expect(result.stdout).not.toContain("scrubbed");
    expect(existsSync(path.join(root,".next/standalone/.env"))).toBe(true);
  });
  it("refuses a generated manifest from a different profile",()=>{
    const root=fixture();writeFileSync(path.join(root,".next-build/required-server-files.json"),JSON.stringify({config:{distDir:".next",output:"standalone"}}));
    expect(run(root,"scrub-standalone-env.mjs","LOCAL_QA").status).not.toBe(0);
    expect(existsSync(path.join(root,".next-build/standalone/.env"))).toBe(true);
  });
  it("does not follow an env symlink or recursively scrub linked directories",()=>{
    const root=fixture(),outside=path.join(root,"outside");mkdirSync(outside);
    const sentinel=path.join(outside,".env");writeFileSync(sentinel,"FIXTURE_SENTINEL");
    symlinkSync(sentinel,path.join(root,".next-build/standalone/.env.link"));
    symlinkSync(outside,path.join(root,".next-build/standalone/linked-directory"));
    expect(run(root,"scrub-standalone-env.mjs","LOCAL_QA").status).toBe(0);
    expect(readFileSync(sentinel,"utf8")).toBe("FIXTURE_SENTINEL");
    expect(existsSync(path.join(root,".next-build/standalone/.env.link"))).toBe(false);
  });
  it("refuses a symlinked static destination parent before recursive replacement",()=>{
    const root=fixture(),outside=path.join(root,"outside");mkdirSync(path.join(outside,"static"),{recursive:true});
    const sentinel=path.join(outside,"static/sentinel");writeFileSync(sentinel,"KEEP");
    symlinkSync(outside,path.join(root,".next-build/standalone/.next-build"));
    expect(run(root,"prepare-standalone-assets.mjs","LOCAL_QA").status).not.toBe(0);
    expect(readFileSync(sentinel,"utf8")).toBe("KEEP");
  });
});
