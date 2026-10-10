import {describe,it,expect,vi,beforeEach,afterEach} from "vitest";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import * as fs from "node:fs/promises";
import {readFileSync} from "node:fs";

vi.mock("server-only",()=>({}));
vi.mock("node:fs/promises",async importOriginal=>{
  const actual=await importOriginal<typeof import("node:fs/promises")>();
  return {...actual,readFile:vi.fn(actual.readFile)};
});
const controls=vi.hoisted(()=>({roleAllowed:true,policyAllowed:true,environment:"development",deployment:"development",failure:"",locale:"vi"}));
vi.mock("@/components/preferences/preferences-provider",()=>({usePreferences:()=>({locale:controls.locale,setLocale:(locale:string)=>{controls.locale=locale;}})}));
vi.mock("next/headers",()=>({headers:async()=>new Headers()}));
vi.mock("@/server/env",()=>({getEnv:()=>({NODE_ENV:controls.environment,DEPLOYMENT_ENV:controls.deployment})}));
vi.mock("@/modules/identity-workspace",()=>{
  class UnauthenticatedError extends Error {}
  class NotFoundError extends Error {}
  return {UnauthenticatedError,NotFoundError,hasCapability:()=>controls.roleAllowed,resolveWorkspaceContext:async()=>{
    if(controls.failure==="unauthenticated")throw new UnauthenticatedError();
    if(controls.failure==="nonmember")throw new NotFoundError();
    return {user:{id:"test-user"},workspace:{id:"test-workspace"},membership:{role:"OWNER"}};
  }};
});
vi.mock("@/modules/authorization",()=>({organizationIdForWorkspace:async()=>"test-org",authorize:async()=>({allowed:controls.policyAllowed})}));

import {loadKakeyaPackage,readKakeyaFile,kakeyaFiles,parseKakeyaSummary} from "@/server/kakeya-dossier";
import {KakeyaDossier} from "@/components/research/kakeya-dossier";
import {GET} from "@/app/api/w/[workspaceSlug]/research/kakeya/files/[fileId]/route";

const request=(fileId:string)=>GET(new Request("http://localhost/api/test"),{params:Promise.resolve({workspaceSlug:"test-workspace",fileId})});
beforeEach(()=>{vi.clearAllMocks();Object.assign(controls,{roleAllowed:true,policyAllowed:true,environment:"development",deployment:"development",failure:""});});
afterEach(()=>vi.restoreAllMocks());

describe("retained K5 bilingual dossier (presentation, not mathematical replay)",()=>{
  it("loads the actual frozen package and all 94 singular records",async()=>{
    const pkg=await loadKakeyaPackage();
    expect(pkg.available).toBe(true);expect(pkg.files).toHaveLength(14);expect(pkg.singular).toHaveLength(94);
    expect(pkg.singular.filter(r=>r.kind==="closed"&&r.constant==="-2")).toHaveLength(80);
    expect(pkg.singular.filter(r=>r.kind==="strict"&&r.constant==="0")).toHaveLength(14);
    expect(pkg.singular[0]).toMatchObject({cell:57,pair:[1,4],constant:"-2"});
  });
  it.each(["../.env",".env","MAIN_FULL_SHAPE_COVER.json","unknown"])("rejects non-allowlisted selector %s",async id=>{
    const spy=vi.spyOn(fs,"readFile");
    await expect(readKakeyaFile(id)).rejects.toThrow("K5_FILE_UNAVAILABLE");expect(spy).not.toHaveBeenCalled();
  });
  it("refuses a changed retained file rather than relabelling it",async()=>{
    vi.spyOn(fs,"readFile").mockResolvedValueOnce(Buffer.from("changed"));
    await expect(readKakeyaFile("review")).rejects.toThrow("K5_FILE_CHANGED");
  });
  it("fails closed on missing files without changing originals",async()=>{
    vi.spyOn(fs,"readFile").mockRejectedValueOnce(new Error("ENOENT"));
    expect(await loadKakeyaPackage()).toEqual({available:false,files:[],singular:[]});
  });
  it("projects validated records without checker-only metadata",()=>{
    const json=(id:string):unknown=>JSON.parse(readFileSync(kakeyaFiles.find(f=>f.id===id)!.path,"utf8"));
    const rows=parseKakeyaSummary(json("cover"),json("volume"),json("stationary"),json("acceptance"));
    expect(Object.keys(rows[0]).sort()).toEqual(["cell","constant","inequality_index","kind","pair"]);
    expect(rows).toHaveLength(94);
  });
  it.each([null,[],"record",42])("refuses a malformed summary root %j",value=>{
    expect(()=>parseKakeyaSummary(value,{}, {},{})).toThrow("K5_SUMMARY_MISMATCH");
  });
  it.each([
    {cell:-1}, {cell:2632}, {cell:1.5}, {pair:[4,1]}, {pair:[1,6]},
    {pair:[1,4,5]}, {inequality_index:-1}, {kind:"strict",constant:"-2"},
  ])("refuses malformed displayed singular fields %j",invalid=>{
    const json=(id:string)=>JSON.parse(readFileSync(kakeyaFiles.find(f=>f.id===id)!.path,"utf8"));
    const acceptance=json("acceptance");Object.assign(acceptance.singular_constant_exclusions[0],invalid);
    expect(()=>parseKakeyaSummary(json("cover"),json("volume"),json("stationary"),acceptance)).toThrow("K5_SUMMARY_MISMATCH");
  });
  it.each(["vi","en"])("renders complete mathematical scope, corrections and materials in %s",async locale=>{
    controls.locale=locale;
    const pkg=await loadKakeyaPackage();
    const html=renderToStaticMarkup(createElement(KakeyaDossier,{workspaceSlug:"lab",evidence:pkg}));
    expect(html).toContain(`lang="${locale}"`);
    for(const id of ["statement","proof-route","evidence","corrections","value","materials"])expect(html).toContain(`id="k5-${id}"`);
    expect(html).toContain("3998");expect(html).toContain("4436");expect(html).toContain("8658");
    expect(html).toContain("667");expect(html).toContain("C1");expect(html).toContain("C2");
    expect(html).toContain(locale==="vi"?"chờ phản biện toán học bên ngoài":"external mathematical review pending");
    expect(html).toContain(locale==="vi"?"không chạy lại phép phát lại":"runs no replay");
    expect(html).toContain(locale==="vi"?"Tính mới chưa được xác nhận":"Novelty is not established");
    expect(html.match(/class="katex"/g)!.length).toBeGreaterThan(10);
    expect(html).not.toContain("Invalid or unsupported TeX");
    for(const f of kakeyaFiles)expect(html).toContain(`/files/${f.id}`);
    expect(html).not.toContain("<form");
  });
  it.each(["vi","en"])("shows no result or downloads when unavailable (%s)",locale=>{
    controls.locale=locale;
    const html=renderToStaticMarkup(createElement(KakeyaDossier,{workspaceSlug:"lab",evidence:{available:false,files:[],singular:[]}}));
    expect(html).toContain('role="alert"');expect(html).not.toContain("k5-proof-route");expect(html).not.toContain("14/61");
  });
  it("provides only GET downloads after workspace/policy authorization",async()=>{
    const response=await request("review");
    expect(response.status).toBe(200);expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("x-hive-sha256")).toBe(kakeyaFiles[0].sha);
    expect(await response.text()).toBe(readFileSync(kakeyaFiles[0].path,"utf8"));
  });
  it.each(["role","policy","production","deployment","unauthenticated","nonmember"])("refuses %s before reading evidence",async kind=>{
    if(kind==="role")controls.roleAllowed=false;
    if(kind==="policy")controls.policyAllowed=false;
    if(kind==="production")controls.environment="production";
    if(kind==="deployment")controls.deployment="staging";
    if(kind==="unauthenticated"||kind==="nonmember")controls.failure=kind;
    const spy=vi.spyOn(fs,"readFile"),response=await request("review");
    expect(response.status).toBe(kind==="unauthenticated"?401:404);expect(spy).not.toHaveBeenCalled();
  });
  it("refuses invalid download selectors without exposing file paths",async()=>{
    const r=await request("../.env");expect(r.status).toBe(404);expect(await r.text()).not.toContain(".env");
  });
  it("returns unavailable on evidence integrity mismatch",async()=>{
    vi.spyOn(fs,"readFile").mockResolvedValueOnce(Buffer.from("changed"));
    const r=await request("review");expect(r.status).toBe(503);
  });
  it("keeps authenticated page access before package loading",()=>{
    const p=readFileSync("src/app/w/[workspaceSlug]/research/kakeya/page.tsx","utf8");
    expect(p.indexOf("await loadWorkspacePage")).toBeLessThan(p.indexOf("await loadKakeyaPackage"));
    expect(p.indexOf("await authorize")).toBeLessThan(p.indexOf("await loadKakeyaPackage"));
    expect(p).toContain('hasCapability(data.ctx.membership.role,"research.read")');
  });
});
