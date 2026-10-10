import AxeBuilder from "@axe-core/playwright";
import {createHash} from "node:crypto";
import pg from "pg";
import {expect,test,type Page,type APIRequestContext,type APIResponse} from "@playwright/test";
import {signUpToDashboard,setLocale} from "./auth-helpers";
import {E2E_ENV} from "./env";
test.use({trace:"off",screenshot:"off"});
const origin="http://127.0.0.1:3003",hash=(b:string|Buffer)=>createHash("sha256").update(b).digest("hex");
async function ownMission(page:Page,dashboardUrl:string) {
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByLabel("Mission title").fill("TIP080 preparation-only UI fixture");
  await page.getByLabel("Objective").fill("Observe an unstarted draft and exact export; never start scientific roles.");
  await page.getByLabel("Scope").fill("Own isolated test workspace and public fixed permutation task.");
  await page.getByLabel("Success definition").fill("DRAFT/disabled Start/revoke persist with no model result.");
  await page.getByLabel("Requirement title").fill("Honest draft preparation");
  await page.getByLabel("Acceptance criteria").fill("No scientific role or live authority installed.");
  await page.getByLabel("Obligation title").fill("Preserve exact ledger cut");
  await page.getByRole("button",{name:"Create mission"}).click();await page.waitForURL(/\/missions\/[a-f0-9-]{36}/);
  const missionId=new URL(page.url()).pathname.split("/").at(-1)!;
  await page.goto(`${dashboardUrl}/research/permutations?missionId=${missionId}#permutation-bridge`);return missionId;
}
async function privateGet(ctx:APIRequestContext,url:string) {try{return await ctx.get(url);}catch{throw new Error("TIP080_PRIVATE_GET_TRANSPORT_REFUSED");}}
const canonical=(v:unknown):string=>Array.isArray(v)?`[${v.map(canonical).join(",")}]`:v!==null&&typeof v==="object"?`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canonical((v as Record<string,unknown>)[k])}`).join(",")}}`:JSON.stringify(v);
async function readDraft(page:Page,url:string,runId:string) {
  const r=await privateGet(page.request,url);expect(r.status()).toBe(200);expect(r.headers()["cache-control"]).toBe("private, no-store");expect(r.headers()["x-content-type-options"]).toBe("nosniff");
  const bytes=await r.body();if(bytes.length>1048576)throw new Error("TIP080_PRIVATE_EXPORT_OVERSIZE");expect(hash(bytes)).toBe(r.headers()["x-content-sha256"]);
  const v=JSON.parse(bytes.toString("utf8"));expect(v.binding.runId).toBe(runId);expect(v.originals).toHaveLength(0);expect(v.state.startedAt).toBeNull();expect(v.checker).toBeNull();expect(v.liveReady).toBe(false);
  let previous:string|null=null;for(let i=0;i<v.events.length;i++){const {eventDigest,...body}=v.events[i];expect(body.sequence).toBe(i+1);expect(body.previousDigest).toBe(previous);expect(hash(canonical(body))).toBe(eventDigest);previous=eventDigest;}
  await r.dispose();return v;
}
test("TIP080 owned DRAFT Origin/idempotency/private exports/revoke; zero START",async({page,browser})=>{
  const {dashboardUrl,email}=await signUpToDashboard(page,"TIP080 Draft Boundary"),slug=new URL(dashboardUrl).pathname.split("/")[2],missionId=await ownMission(page,dashboardUrl),region=page.locator("#permutation-bridge");
  const capture=page.waitForRequest(r=>r.method()==="POST"&&new URL(r.url()).origin===origin&&new URL(r.url()).pathname===`/w/${slug}/research/permutations`&&Boolean(r.headers()["next-action"]));
  await Promise.all([page.waitForURL(u=>u.searchParams.get("missionId")===missionId&&Boolean(u.searchParams.get("runId"))),region.getByRole("button",{name:"Create unstarted draft",exact:true}).click()]);
  const runId=new URL(page.url()).searchParams.get("runId")!,request=await capture,body=request.postDataBuffer(),headers=await request.allHeaders();
  if(!/^[a-f0-9-]{36}$/.test(runId)||!body||body.length>65536)throw new Error("TIP080_PRIVATE_DRAFT_CAPTURE_REFUSED");
  // Session material stays memory-only, never output/attachments/failure traces.
  let replay:APIResponse,foreign:APIResponse;
  try{replay=await page.request.post(request.url(),{headers:{...headers,origin},data:body,maxRedirects:0,failOnStatusCode:false});}catch{throw new Error("TIP080_PRIVATE_REPLAY_TRANSPORT_REFUSED");}
  expect(replay.status()===200||replay.status()>=300&&replay.status()<400).toBe(true);
  const redirect=replay.headers()["x-action-redirect"]??replay.headers().location;if(!redirect)throw new Error("TIP080_DRAFT_REPLAY_REDIRECT_MISSING");const selected=new URL(redirect.split(";")[0],origin);expect(selected.searchParams.get("runId")).toBe(runId);expect(selected.searchParams.get("action")).toBeNull();await replay.dispose();
  try{foreign=await page.request.post(request.url(),{headers:{...headers,origin:"https://cross-site.invalid"},data:body,maxRedirects:0,failOnStatusCode:false});}catch{throw new Error("TIP080_PRIVATE_ORIGIN_TRANSPORT_REFUSED");}
  // Installed Next16.2.11 action-handler refuses a foreign Origin with500;
  // paired legitimate replay above separates CSRF refusal from unrelated failures.
  expect(foreign.status()).toBe(500);await foreign.dispose();
  const client=new pg.Client({connectionString:E2E_ENV.DATABASE_MIGRATION_URL,connectionTimeoutMillis:3000,statement_timeout:3000});await client.connect();try{
    const own=await client.query<{actor:string;workspace:string;organization:string}>('SELECT u.id AS actor,w.id AS workspace,w.organization_id AS organization FROM "user" u JOIN workspace w ON w.created_by_id=u.id WHERE u.email=$1 AND w.slug=$2 LIMIT 2',[email,slug]);if(own.rows.length!==1)throw new Error("TIP080_OWN_FIXTURE_BINDING_REFUSED");const o=own.rows[0];
    const roots=await client.query<{id:string}>('SELECT id FROM command_record WHERE organization_id=$1 AND workspace_id=$2 AND actor_user_id=$3 AND command_type=$4 AND status=$5 AND payload->>\'missionId\'=$6 LIMIT 2',[o.organization,o.workspace,o.actor,"permutation.bridge.080.DRAFT","SUCCEEDED",missionId]);expect(roots.rows.length).toBe(1);expect(roots.rows[0].id).toBe(runId);
    const counts=await client.query<{outbox:string;starts:string}>('SELECT (SELECT count(*) FROM outbox_event WHERE organization_id=$1 AND workspace_id=$2 AND aggregate_id=$3 AND topic=$4) AS outbox,(SELECT count(*) FROM command_record WHERE organization_id=$1 AND workspace_id=$2 AND actor_user_id=$5 AND command_type=$6 AND status=$7) AS starts',[o.organization,o.workspace,runId,"permutation.bridge.080.observed",o.actor,"permutation.bridge.080.START","SUCCEEDED"]);expect(Number(counts.rows[0].outbox)).toBe(1);expect(Number(counts.rows[0].starts)).toBe(0);
  }finally{await client.end();}
  const retained=page.locator(`[data-permutation-run-id="${runId}"]`);await expect(retained.getByRole("button",{name:"Start recorded run",exact:true})).toBeDisabled();await expect(retained.getByText("DRAFT — unstarted",{exact:false})).toBeVisible();
  const endpoint=`${origin}/api/w/${slug}/research/permutations/${runId}/export`;
  expect((await readDraft(page,endpoint,runId)).state.status).toBe("DRAFT");
  const anon=await browser.newContext(),other=await browser.newContext({baseURL:origin});try{const denied=await privateGet(anon.request,endpoint);expect(denied.status()).toBe(401);await denied.dispose();await signUpToDashboard(await other.newPage(),"TIP080 Separate Tenant");const cross=await privateGet(other.request,endpoint);expect([403,404].includes(cross.status())).toBe(true);await cross.dispose();}finally{await anon.close();await other.close();}
  await retained.getByRole("button",{name:"Revoke future admissions",exact:true}).click();await expect(retained.getByText("REVOKED",{exact:true})).toBeVisible();await page.reload();expect(new URL(page.url()).searchParams.get("runId")).toBe(runId);expect((await readDraft(page,endpoint,runId)).state.status).toBe("REVOKED");
  test.info().annotations.push({type:"owned-preparation-only",description:JSON.stringify({email,missionId,runId})});
});
test("TIP080 empty DRAFT bilingual/theme/mobile formula keyboard and scoped accessibility",async({page})=>{
  const {dashboardUrl}=await signUpToDashboard(page,"TIP080 Draft Layout");await ownMission(page,dashboardUrl);const region=page.locator("#permutation-bridge");await Promise.all([page.waitForURL(u=>Boolean(u.searchParams.get("runId"))),region.getByRole("button",{name:"Create unstarted draft",exact:true}).click()]);
  for(const locale of ["en","vi"] as const){await setLocale(page,locale);for(const theme of ["light","dark"] as const){await page.evaluate(v=>localStorage.setItem("hive-appearance",v),theme);for(const width of [1280,390,320]){await page.setViewportSize({width,height:844});await page.reload();await expect(page.locator("html")).toHaveAttribute("lang",locale);await expect(page.locator("html")).toHaveAttribute("data-theme",theme);await expect(region.getByRole("button",{name:locale==="vi"?"Bắt đầu lượt ghi hình":"Start recorded run",exact:true})).toBeDisabled();await expect(region.locator("[data-bridge-stage]")).toHaveCount(5);expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);}}}
  await setLocale(page,"en");await page.reload();const formula=region.getByRole("region",{name:"Fixed permutation formula",exact:true});await formula.focus();await expect(formula).toBeFocused();await expect(formula.locator(".katex").first()).toBeVisible();
  const scan=await new AxeBuilder({page}).include("#permutation-bridge").withTags(["wcag2a","wcag2aa"]).analyze();expect(scan.violations.filter(v=>v.impact==="serious"||v.impact==="critical")).toEqual([]);
});
