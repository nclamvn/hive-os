import {afterEach,describe,expect,it,vi} from "vitest";

afterEach(()=>{vi.unstubAllEnvs();vi.resetModules();});
describe("TIP076D fixed QA trace configuration (metadata only)",()=>{
  it("does not change ordinary default output or tracing exclusions",async()=>{vi.stubEnv("HIVE_BUILD_PROFILE","");vi.resetModules();const {default:config}=await import("../../next.config");expect(config.distDir).toBe(".next");expect(config.output).toBe("standalone");expect(config.outputFileTracingExcludes).toBeUndefined();});
  it("excludes exactly the13 observed historical script references only for QA",async()=>{vi.stubEnv("HIVE_BUILD_PROFILE","TIP076_QA");vi.resetModules();const {default:config}=await import("../../next.config");expect(config.distDir).toBe(".next-build");expect(Object.keys(config.outputFileTracingExcludes??{})).toEqual(["/*"]);const names=config.outputFileTracingExcludes?.["/*"]??[];expect(names).toHaveLength(13);expect(new Set(names).size).toBe(13);expect(names.every(name=>/^\.\/scripts\/operations\/(attempt-lrc-p139-generation(?:-v[2-5])?|capture-lrc-p139-generation-v[2-6]|verify-lrc-p139-g-(?:release|segments|stream))\.py$/.test(name))).toBe(true);expect(names.some(name=>name.includes("*"))).toBe(false);});
});
