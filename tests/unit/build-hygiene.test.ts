import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import {afterEach,describe,expect,it,vi} from "vitest";

afterEach(()=>{vi.unstubAllEnvs();vi.resetModules();});

describe("reusable local build output (engineering metadata only)",()=>{
  it.each(["LOCAL_QA","TIP076_QA","TIP079_QA","TIP080_QA"])("routes %s into the same reusable isolated output",async profile=>{
    vi.stubEnv("HIVE_BUILD_PROFILE",profile);
    const config=(await import("../../next.config")).default;
    expect(config.distDir).toBe(".next-build");
    expect(config.outputFileTracingExcludes?.["/*"]).toHaveLength(13);
  });
  it.each(["", "unapproved"])("does not grant a QA profile to %s",async profile=>{
    vi.stubEnv("HIVE_BUILD_PROFILE",profile);
    const config=(await import("../../next.config")).default;
    expect(config.distDir).toBe(".next");
    expect(config.outputFileTracingExcludes).toBeUndefined();
  });
  it.each(["076","079","080"])("keeps TIP%s active helpers aligned without weakening source authority",tip=>{
    const build=readFileSync(`scripts/test/build-tip${tip}.mjs`,"utf8");
    const start=readFileSync(`scripts/test/start-tip${tip}-standalone.mjs`,"utf8");
    expect(build).toContain('.next-build/standalone');
    expect(start).toContain('.next-build/standalone');
    expect(build).not.toMatch(/\.next-tip\d+/);
    expect(start).not.toMatch(/\.next-tip\d+/);
    expect(build).toContain(tip==="076"?'createHash("sha256").update(bytes).digest("hex")!==pin':'digest(b)!==pin');
    expect(start).toContain('NODE_ENV!=="test"');
    expect(build).toContain(`"TIP${tip}_QA\\n"`);
    expect(start).toContain(`"TIP${tip}_QA\\n"`);
    expect(start).toContain("Shared build profile mismatch");
  });
  it("ignores build/store outputs while retaining mathematical evidence",()=>{
    const ignore=readFileSync(".gitignore","utf8");
    expect(ignore).toContain('/.next-*/');expect(ignore).toContain('/.pnpm-store/');
    expect(ignore).not.toContain('/artifacts/');
    const config=JSON.parse(readFileSync("tsconfig.json","utf8"));
    expect(config.include).toContain('.next-build/types/**/*.ts');
    expect(config.include.some((s:string)=>s.includes('.next-tip'))).toBe(false);
    expect(config.exclude).toContain('.next-tip*');
  });
  it.each(["076","079","080"])("TIP%s launcher refuses wrong, malformed and unsafe profile markers before evaluation",tip=>{
    const source=readFileSync(`scripts/test/start-tip${tip}-standalone.mjs`,"utf8");
    const snippet=source.match(/const markerFd=openSync[\s\S]*?\} finally \{closeSync\(markerFd\);\}/)![0];
    for(const [tag,size,isFile,accepted] of [
      [`TIP${tip}_QA\n`,10,true,true], ["LOCAL_QA\n",9,true,false],
      ["TIP999_QA\n",10,true,false], [`TIP${tip}_QA\n`,100,true,false],
      [`TIP${tip}_QA\n`,10,false,false],
    ] as const){
      const bytes=Buffer.from(tag),close=vi.fn();
      const check=()=>runInNewContext(snippet,{
        path:{join:()=>"profile-marker"},root:"reusable-root",Buffer,
        constants:{O_RDONLY:1,O_NOFOLLOW:2,O_NONBLOCK:4},openSync:()=>1,
        fstatSync:()=>({isFile:()=>isFile,size}),closeSync:close,
        readSync:(_fd:number,out:Buffer,offset:number,length:number,position:number)=>bytes.copy(out,offset,position,Math.min(bytes.length,position+length)),
      });
      if(accepted)expect(check).not.toThrow();else expect(check).toThrow("Shared build profile mismatch");
      expect(close).toHaveBeenCalledOnce();
    }
    expect(source.indexOf("const markerFd=")).toBeLessThan(source.indexOf(tip==="076"?'source=readFileSync(sourcePath':'const fd=openSync(sourcePath'));
  });
});
