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
afterEach(()=>{
  for(const root of roots.splice(0)){
    if(!path.basename(root).startsWith("codex-tmp-standalone-20261010-"))throw new Error("Refuse unowned fixture cleanup");
    rmSync(root,{recursive:true,force:true});
  }
});

describe("standalone post-build packaging selects only the built artifact",()=>{
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
