import AxeBuilder from "@axe-core/playwright";
import {createHash} from "node:crypto";
import {spawn} from "node:child_process";
import {lstat,realpath} from "node:fs/promises";
import pg from "pg";
import {expect,test,type Page,type APIResponse,type APIRequestContext} from "@playwright/test";
import {setLocale,signUpToDashboard} from "./auth-helpers";
import {E2E_ENV} from "./env";

// Worker-scoped privacy options belong at file scope in installed Playwright.
// Protect all cases from automatic traces/screenshots; explicit safe layout
// screenshots below remain intentional and contain only owned QA presentation.
test.use({trace:"off",screenshot:"off"});

// Main executes only after isolated source/build admission. The final case uses
// the reviewed fixed ENGINEERING_ONLY worker; native/model invocation is absent.
async function ownMission(page:Page,dashboardUrl:string) {
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByLabel("Mission title").fill("TIP079 owned engineering UI observation");
  await page.getByLabel("Objective").fill("Observe a queued and revoked engineering control, not model capability.");
  await page.getByLabel("Scope").fill("Known public Poly19 software demonstration in isolated QA.");
  await page.getByLabel("Success definition").fill("Owned durable queue/revoke with native execution visibly blocked.");
  await page.getByTestId("mission-contract-details").locator("summary").click();
  await page.getByLabel("Requirement title").fill("Honest no-live-effect presentation");
  await page.getByLabel("Acceptance criteria").fill("Native disabled; queued originals never fabricated.");
  await page.getByLabel("Obligation title").fill("Preserve retained state and exact run selection");
  await page.getByRole("button",{name:"Create draft mission"}).click();
  await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
  const missionId=new URL(page.url()).pathname.split("/").at(-1)!;
  await page.goto(`${dashboardUrl}/research/poly19?missionId=${missionId}#poly19-showcase`);
  return missionId;
}

test("TIP079C owned queued/revoked engineering control persists, never a native effect",async({page})=>{
  const {dashboardUrl,email}=await signUpToDashboard(page,"TIP079 Engineering Queue");
  const missionId=await ownMission(page,dashboardUrl),region=page.locator("#poly19-showcase");
  await expect(region.getByRole("button",{name:"Request native demonstration",exact:true})).toBeDisabled();
  await expect(region.getByText("Native execution blocked",{exact:false})).toBeVisible();
  await region.getByRole("checkbox").check();
  await Promise.all([
    page.waitForURL(url=>url.pathname.endsWith("/research/poly19")&&url.searchParams.get("missionId")===missionId&&Boolean(url.searchParams.get("runId"))),
    region.getByRole("button",{name:"Request engineering control",exact:true}).click(),
  ]);
  const runId=new URL(page.url()).searchParams.get("runId")!;
  test.info().annotations.push({type:"owned-engineering-QA-only",description:JSON.stringify({email,dashboardUrl,missionId,runId})});
  const retained=page.locator(`[data-poly19-run-id="${runId}"]`);
  await expect(retained.getByText("QUEUED",{exact:true})).toBeVisible();
  await expect(retained.locator("[data-stage]")).toHaveCount(5);
  await expect(retained.locator('[data-original-role="NONE"]')).toBeVisible();
  await expect(retained.locator('[data-exact-status="NOT_RETAINED"]')).toBeVisible();
  await page.reload();
  await expect(retained.getByText("QUEUED",{exact:true})).toBeVisible();
  await retained.getByRole("button",{name:"Revoke future effects",exact:true}).click();
  await expect(retained.getByText("REVOKED",{exact:true})).toBeVisible();
  await page.reload();
  expect(new URL(page.url()).searchParams.get("runId")).toBe(runId);
  await expect(retained.getByText("REVOKED",{exact:true})).toBeVisible();
  await expect(retained.getByRole("button",{name:"Revoke future effects",exact:true})).toHaveCount(0);
  await expect(retained.locator('[data-original-role="NONE"]')).toBeVisible();
});

test("TIP079C empty proof view is bilingual, themed, keyboard and 320px accessible",async({page})=>{
  const {dashboardUrl}=await signUpToDashboard(page,"TIP079 Engineering Layout");
  await ownMission(page,dashboardUrl);
  const region=page.locator("#poly19-showcase");
  for(const locale of ["en","vi"] as const) {
    await setLocale(page,locale);
    for(const theme of ["light","dark"] as const) {
      await page.evaluate(value=>localStorage.setItem("hive-appearance",value),theme);
      for(const width of [1280,390,320]) {
        await page.setViewportSize({width,height:844});await page.reload();
        await expect(page.locator("html")).toHaveAttribute("lang",locale);
        await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
        await expect(region.getByRole("button",{name:locale==="vi"?"Yêu cầu trình diễn bản địa":"Request native demonstration",exact:true})).toBeDisabled();
        await expect(region.getByText(locale==="vi"?"Chặn thực thi bản địa":"Native execution blocked",{exact:false})).toBeVisible();
        expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
        await page.screenshot({path:`artifacts/tip079/empty-${locale}-${theme}-${width}.png`,fullPage:false});
      }
    }
  }
  await setLocale(page,"en");await page.reload();
  await region.getByText("Public task and source",{exact:true}).click();
  await expect(region.locator(".katex").first()).toBeVisible();
  const control=region.getByRole("button",{name:"Request engineering control",exact:true});
  await control.focus();await expect(control).toBeFocused();
  const scan=await new AxeBuilder({page}).include("#poly19-showcase").withTags(["wcag2a","wcag2aa"]).analyze();
  expect(scan.violations.filter(v=>v.impact==="serious"||v.impact==="critical")).toEqual([]);
});

test.describe("TIP079 fresh authenticated engineering full flow",()=>{
  // A privately captured server-action request contains session material. Never
  // put it in a failure trace, attachment, screenshot or diagnostic output.
  test("UI enqueue, exact worker, sealed HTTP exports and actual CSRF/tenant refusal",async({page,browser})=>{
    const started=performance.now();
    const origin="http://127.0.0.1:3002",storage="/private/tmp/hiveos-tip079-storage-90pH8Y";
    if(process.env.NODE_ENV!=="test" || process.env.HIVE_E2E_BASE_URL!==origin || process.env.STORAGE_LOCAL_ROOT!==storage) throw new Error("TIP079_FULL_FLOW_ENV_REFUSED");
    for(const key of ["DATABASE_URL","DATABASE_MIGRATION_URL"] as const) {
      const url=new URL(process.env[key]??"");
      if(!["localhost","127.0.0.1"].includes(url.hostname) || url.port!=="5433" || url.pathname!=="/hiveos_test") throw new Error("TIP079_FULL_FLOW_DATABASE_REFUSED");
    }
    const stat=await lstat(storage);
    if(!stat.isDirectory() || stat.isSymbolicLink() || stat.uid!==process.getuid?.() || (stat.mode&0o777)!==0o700 || await realpath(storage)!==storage) throw new Error("TIP079_FULL_FLOW_STORAGE_REFUSED");
    const {dashboardUrl,email}=await signUpToDashboard(page,"TIP079 Fresh Full Flow");
    const slug=new URL(dashboardUrl).pathname.split("/")[2];
    const missionId=await ownMission(page,dashboardUrl),region=page.locator("#poly19-showcase");
    await expect(region.getByRole("button",{name:"Request native demonstration",exact:true})).toBeDisabled();
    await region.getByRole("checkbox").check();
    const approvalRequest=page.waitForRequest(request=>request.method()==="POST" && new URL(request.url()).origin===origin && new URL(request.url()).pathname===`/w/${slug}/research/poly19` && Boolean(request.headers()["next-action"]));
    await Promise.all([
      page.waitForURL(url=>url.searchParams.get("missionId")===missionId && Boolean(url.searchParams.get("runId"))),
      region.getByRole("button",{name:"Request engineering control",exact:true}).click(),
    ]);
    const request=await approvalRequest,body=request.postDataBuffer(),headers=await request.allHeaders();
    const runId=new URL(page.url()).searchParams.get("runId");
    if(!runId || !/^[0-9a-f-]{36}$/.test(runId) || !body || body.length>65536) throw new Error("TIP079_APPROVAL_CAPTURE_REFUSED");
    // First prove this exact private action request is a valid idempotent replay.
    let validReplay:APIResponse;
    try {validReplay=await page.request.post(request.url(),{headers:{...headers,origin},data:body,maxRedirects:0,failOnStatusCode:false});}
    catch {throw new Error("TIP079_PRIVATE_VALID_REPLAY_TRANSPORT_REFUSED");}
    expect(validReplay.status()===200 || validReplay.status()>=300 && validReplay.status()<400).toBe(true);
    const redirect=validReplay.headers()["x-action-redirect"]??validReplay.headers().location;
    if(!redirect) throw new Error("TIP079_VALID_REPLAY_REDIRECT_MISSING");
    const selected=new URL(redirect.split(";")[0],origin);
    expect(selected.origin).toBe(origin);expect(selected.searchParams.get("runId")).toBe(runId);expect(selected.searchParams.get("action")).toBeNull();
    await validReplay.dispose();
    // Sole change is foreign Origin: installed Next16.2.11 action-handler.js
    // 445–488 refuses BEFORE execution with framework-specific HTTP500, not403.
    // This paired control does not accept unrelated/generic server failures.
    // The target URL remains loopback and captured secrets are never logged.
    let csrf:APIResponse;
    try {csrf=await page.request.post(request.url(),{headers:{...headers,origin:"https://cross-site.invalid"},data:body,maxRedirects:0,failOnStatusCode:false});}
    catch {throw new Error("TIP079_PRIVATE_CSRF_TRANSPORT_REFUSED");}
    expect(csrf.status()).toBe(500);
    await csrf.dispose();

    const client=new pg.Client({connectionString:E2E_ENV.DATABASE_MIGRATION_URL,connectionTimeoutMillis:3000,statement_timeout:3000});
    let actor:{actorId:string;organizationId:string;workspaceId:string};
    await client.connect();
    try {
      // Exact newly UI-created identity/workspace only; never enumerate studies
      // or use truncate, migration, cleanup, seed or a product-auth bypass.
      const owned=await client.query<{actorId:string;organizationId:string;workspaceId:string}>(
        'SELECT u.id AS "actorId",w.organization_id AS "organizationId",w.id AS "workspaceId" FROM "user" u JOIN workspace w ON w.created_by_id=u.id WHERE u.email=$1 AND w.slug=$2 LIMIT 2',[email,slug]);
      if(owned.rows.length!==1) throw new Error("TIP079_OWNED_FIXTURE_REFUSED");
      actor=owned.rows[0];
      if(!/^[0-9a-f-]{36}$/.test(actor.organizationId) || !/^[A-Za-z0-9-]{1,200}$/.test(actor.actorId)) throw new Error("TIP079_WORKER_IDENTITIES_REFUSED");
      const runs=await client.query<{id:string}>(
        'SELECT id FROM research_showcase_run WHERE organization_id=$1 AND workspace_id=$2 AND actor_user_id=$3 AND mission_id=$4 AND provenance=$5 LIMIT 2',
        [actor.organizationId,actor.workspaceId,actor.actorId,missionId,"ENGINEERING_ONLY"]);
      if(runs.rows.length!==1 || runs.rows[0].id!==runId) throw new Error("TIP079_CSRF_CREATED_EXTRA_RUN");
      const lineage=await client.query<{outboxCount:string;startCount:string}>(
        'SELECT (SELECT count(*) FROM outbox_event WHERE organization_id=$1 AND workspace_id=$2 AND aggregate_type=$3 AND aggregate_id=$4 AND topic=$5) AS "outboxCount",(SELECT count(*) FROM research_showcase_event WHERE organization_id=$1 AND workspace_id=$2 AND run_id=$4 AND event_type=$6) AS "startCount"',
        [actor.organizationId,actor.workspaceId,"ResearchShowcaseRun",runId,"research.showcase.poly19.stage","ROLE_STARTED"]);
      expect(Number(lineage.rows[0].outboxCount)).toBe(1);expect(Number(lineage.rows[0].startCount)).toBe(0);
    } finally {await client.end();}

    const remaining=Math.min(30000,test.info().timeout-(performance.now()-started)-3000);
    if(remaining<1000) throw new Error("TIP079_WORKER_TIME_NOT_ADMITTED");
    await new Promise<void>((resolve,reject)=>{
      const workerStarted=performance.now();
      const child=spawn(process.execPath,["--import","tsx","scripts/workers/research-showcase-worker.ts",
        `--organization-id=${actor.organizationId}`,`--actor-user-id=${actor.actorId}`,`--run-id=${runId}`],
        {cwd:process.cwd(),env:{...process.env,NODE_ENV:"test",STORAGE_LOCAL_ROOT:storage},stdio:["ignore","pipe","pipe"],detached:true});
      let bytes=0,stopReason:"TIMEOUT"|"OUTPUT_LIMIT"|null=null,spawnError=false;
      const diagnostic=(code:number|null,signal:string|null)=>JSON.stringify({diagnostic:"TIP079_ENGINEERING_CHILD_V1",purpose:"ENGINEERING_ONLY",
        durationMilliseconds:Number((performance.now()-workerStarted).toFixed(3)),limitMilliseconds:remaining,
        status:spawnError?"SPAWN_ERROR":stopReason??(code===0&&!signal?"CHILD_SUCCEEDED":"CHILD_FAILED"),
        code:Number.isInteger(code)&&code!==null&&code>=0&&code<=255?code:null,signal:signal&&/^SIG[A-Z0-9]{1,16}$/.test(signal)?signal:null,observedOutputBytes:bytes});
      const stop=(reason:"TIMEOUT"|"OUTPUT_LIMIT")=>{stopReason??=reason;if(child.pid) {try {process.kill(-child.pid,"SIGKILL");} catch {/* only this owned child group */}}};
      const timer=setTimeout(()=>stop("TIMEOUT"),remaining);
      for(const stream of [child.stdout,child.stderr]) stream.on("data",chunk=>{bytes+=chunk.length;if(bytes>8192)stop("OUTPUT_LIMIT");});
      child.once("error",()=>{clearTimeout(timer);spawnError=true;reject(new Error(`TIP079_ENGINEERING_WORKER_SPAWN_REFUSED ${diagnostic(null,null)}`));});
      child.once("close",(code,signal)=>{clearTimeout(timer);const detail=diagnostic(code,signal);
        test.info().annotations.push({type:"engineering-child-diagnostic",description:detail});
        if(stopReason || spawnError || code!==0 || signal)reject(new Error(`TIP079_ENGINEERING_WORKER_NOT_COMPLETED ${detail}`));else resolve();});
    });
    await page.reload();
    const retained=page.locator(`[data-poly19-run-id="${runId}"]`);
    await expect(retained.getByText("COMPLETED",{exact:true}).first()).toBeVisible();
    const endpoint=`${origin}/api/w/${slug}/research/poly19/${runId}/export`;
    const privateGet=async(context:APIRequestContext,url:string)=>{
      try {return await context.get(url);} catch {throw new Error("TIP079_PRIVATE_EXPORT_TRANSPORT_REFUSED");}
    };
    const jsonResponse=await privateGet(page.request,`${endpoint}?format=json`);
    expect(jsonResponse.status()).toBe(200);
    expect(jsonResponse.headers()["cache-control"]).toBe("private, no-store");
    expect(jsonResponse.headers()["x-hive-provenance"]).toBe("ENGINEERING_ONLY");
    expect(jsonResponse.headers()["content-disposition"]).toBe(`attachment; filename="poly19-ENGINEERING_ONLY-${runId}.json"`);
    expect(Boolean(jsonResponse.headers()["set-cookie"])).toBe(false);
    const jsonBytes=await jsonResponse.body();
    if(jsonBytes.length>4194304) throw new Error("TIP079_DOSSIER_BYTE_LIMIT");
    const dossier=JSON.parse(jsonBytes.toString("utf8"));
    expect(dossier.runId).toBe(runId);expect(dossier.provenance).toBe("ENGINEERING_ONLY");expect(dossier.status).toBe("COMPLETED");
    expect(dossier.modelInvocation).toBe("NOT_INVOKED_ENGINEERING_ONLY");
    expect(dossier.roles.map((role:{role:string})=>role.role)).toEqual(["ATTEMPT","CRITIC","FINAL","POSTREVIEW"]);
    const hash=(bytes:string|Buffer)=>createHash("sha256").update(bytes).digest("hex");
    for(const role of dossier.roles) {
      expect(role.validated).toBe(true);expect(role.originalComplete).toBe(true);expect(role.traceComplete).toBe(true);
      expect(role.outcome).toBe("COMPLETED");expect(role.remoteEffect).toBe("NONE");
      // Compare seals/byte lengths only: assertion diagnostics never echo an original.
      expect(hash(role.originalText)).toBe(role.originalDigest);expect(Buffer.byteLength(role.originalText,"utf8")).toBe(role.originalBytes);
    }
    const final=dossier.roles.find((role:{role:string})=>role.role==="FINAL");
    expect(hash(dossier.originalFinal)).toBe(final.originalDigest);
    const decodedFinal=JSON.parse(dossier.originalFinal);
    expect(hash(decodedFinal.certificateJson)).toBe(dossier.certificateDigest);
    expect(hash(dossier.certificateJson)).toBe(dossier.certificateDigest);
    expect(hash(dossier.faultCertificateJson)).toBe(dossier.faultCertificateDigest);
    expect(dossier.exactResult.status).toBe("VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION");
    expect(dossier.exactResult.candidateSha256).toBe(dossier.certificateDigest);
    expect(dossier.faultResult.status).toBe("INCONCLUSIVE");expect(dossier.faultResult.candidateSha256).toBe(dossier.faultCertificateDigest);
    for(const trace of dossier.traces) {const bytes=Buffer.from(trace.base64,"base64");expect(hash(bytes)).toBe(trace.digest);expect(bytes.length).toBe(trace.bytes);}
    expect(dossier.eventPayloads.length).toBe(dossier.eventCut.sequence);
    // Independent canonical seal replay over the exported complete event cut;
    // this is integrity evidence, not adoption of serialized checker authority.
    const canonical=(value:unknown):string=>{
      if(Array.isArray(value))return `[${value.map(canonical).join(",")}]`;
      if(value!==null && typeof value==="object")return `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical((value as Record<string,unknown>)[key])}`).join(",")}}`;
      return JSON.stringify(value);
    };
    const approval=dossier.eventPayloads[0].payload.detail;
    expect(hash(canonical(approval.sourceBundle))).toBe(dossier.sourceBundleDigest);
    expect(hash(canonical(approval.sourceBundle.sourcePins))).toBe(hash(canonical(dossier.sourceBundle.sourcePins)));
    expect(approval.sourceBundle.reviewReportDigest).toBe(dossier.sourceBundle.reviewReportDigest);
    let previous:string|null=null;
    for(let index=0;index<dossier.events.length;index++) {
      const event=dossier.events[index],payload=dossier.eventPayloads[index];
      expect(event.sequence).toBe(index+1);expect(payload.sequence).toBe(index+1);expect(event.previousDigest).toBe(previous);
      const seal={organizationId:dossier.organizationId,workspaceId:dossier.workspaceId,missionId:dossier.missionId,actorUserId:dossier.actorUserId,commandId:dossier.commandId,
        provenance:dossier.provenance,sourceBundleDigest:dossier.sourceBundleDigest,taskDigest:dossier.taskDigest,authorityEpoch:dossier.authorityEpoch,
        runId:dossier.runId,sequence:event.sequence,eventType:event.eventType,actionKey:event.actionKey,previousDigest:event.previousDigest,payload:payload.payload,jobId:event.jobId,createdAt:event.createdAt};
      expect(hash(canonical(seal))).toBe(event.digest);previous=event.digest;
    }
    expect(previous).toBe(dossier.eventCut.digest);
    const textResponse=await privateGet(page.request,`${endpoint}?format=text`);
    expect(textResponse.status()).toBe(200);expect(textResponse.headers()["cache-control"]).toBe("private, no-store");
    expect(textResponse.headers()["x-hive-provenance"]).toBe("ENGINEERING_ONLY");
    expect(textResponse.headers()["content-disposition"]).toBe(`attachment; filename="poly19-ENGINEERING_ONLY-${runId}.txt"`);
    expect(Boolean(textResponse.headers()["set-cookie"])).toBe(false);
    const textBytes=await textResponse.body();expect(hash(textBytes)).toBe(final.originalDigest);expect(textBytes.length).toBe(final.originalBytes);
    await jsonResponse.dispose();await textResponse.dispose();
    const anonymous=await browser.newContext();
    const other=await browser.newContext({baseURL:origin});
    try {
      const denied=await privateGet(anonymous.request,`${endpoint}?format=json`);expect(denied.status()).toBe(401);await denied.dispose();
      await signUpToDashboard(await other.newPage(),"TIP079 Separate Export Denial");
      const crossTenant=await privateGet(other.request,`${endpoint}?format=json`);expect([403,404].includes(crossTenant.status())).toBe(true);await crossTenant.dispose();
    } finally {await anonymous.close();await other.close();}
    // No dossier, captured request, credential or raw model/provider text is
    // attached or persisted by this test. All owned application fixtures remain.
    test.info().annotations.push({type:"owned-engineering-full-flow",description:JSON.stringify({email,missionId,runId})});
  });
});
