# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: poly19-showcase.spec.ts >> TIP079C empty proof view is bilingual, themed, keyboard and 320px accessible
- Location: tests/e2e/poly19-showcase.spec.ts:61:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 52

- Array []
+ Array [
+   Object {
+     "description": "Ensure elements that have scrollable content are accessible by keyboard in Safari",
+     "help": "Scrollable region must have keyboard access",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.12/scrollable-region-focusable?application=playwright",
+     "id": "scrollable-region-focusable",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "focusable-content",
+             "impact": "serious",
+             "message": "Element should have focusable content",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "focusable-element",
+             "impact": "serious",
+             "message": "Element should be focusable",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element should have focusable content
+   Element should be focusable",
+         "html": "<span class=\"math-tex-inline\" title=\"\\(\\deg p=19,\\quad p(-x)=-p(x),\\quad [x]p=-19,\\quad [x^{19}]p=1\\)\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".math-tex-inline",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.keyboard",
+       "wcag2a",
+       "wcag211",
+       "wcag213",
+       "TTv5",
+       "TT4.a",
+       "EN-301-549",
+       "EN-9.2.1.1",
+       "EN-9.2.1.3",
+       "RGAAv4",
+       "RGAA-7.3.2",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - link "Skip to content" [ref=e3] [cursor=pointer]:
      - /url: "#main-content"
    - generic [ref=e4]:
      - banner [ref=e5]:
        - button "Open navigation" [ref=e6]:
          - img [ref=e7]
        - generic [ref=e8]:
          - heading "Native Poly19 demonstration" [level=1] [ref=e9]
          - paragraph [ref=e10]: Follow the retained argument from first attempt to independent exact replay.
        - generic [ref=e11]:
          - link "Find governed objects" [ref=e12] [cursor=pointer]:
            - /url: /w/tip079-engineering-layout-415748/control-room?find=1
            - img [ref=e13]
          - generic [ref=e16]:
            - 'button "Language: EN" [ref=e17]':
              - generic [ref=e18]: EN
            - 'button "Appearance: Dark" [ref=e19]':
              - img [ref=e20]
      - main [ref=e22]:
        - generic [ref=e25]:
          - link "Back to research" [ref=e26] [cursor=pointer]:
            - /url: /w/tip079-engineering-layout-415748/research?missionId=18f6ada8-3072-40ef-90e0-85a8c9a77189
          - region "Native Poly19 demonstration" [ref=e28]:
            - generic [ref=e29]:
              - heading "A polynomial, a proof, and its evidence" [level=2] [ref=e31]
              - paragraph [ref=e32]: Follow the retained argument from first attempt to independent exact replay.
              - paragraph [ref=e33]: Known public Epoch AI sample, not a private or training-unseen benchmark. This demonstration additionally requires integer coefficients. Reference exposure in preparation is disclosed; training exposure is UNKNOWN.
              - group [ref=e34]:
                - generic "Public task and source" [ref=e35] [cursor=pointer]
                - paragraph [ref=e36]: Construct an odd monic polynomial of degree 19 with real coefficients and linear coefficient −19, whose equality curve has at least three complex irreducible components, not all linear. Return the construction and p(19).
                - link "Epoch AI · public sample problems" [ref=e37] [cursor=pointer]:
                  - /url: https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems
                - paragraph [ref=e38]:
                  - 'generic "\\(\\deg p=19,\\quad p(-x)=-p(x),\\quad [x]p=-19,\\quad [x^{19}]p=1\\)" [ref=e40]':
                    - generic [ref=e41]:
                      - math [ref=e43]:
                        - generic [ref=e45]:
                          - generic [ref=e46]: deg
                          - generic: ⁡
                          - generic [ref=e47]: p
                          - generic [ref=e48]: =
                          - generic [ref=e49]: "19"
                          - generic [ref=e50]: ","
                          - generic [ref=e51]: p
                          - generic [ref=e52]: (
                          - generic [ref=e53]: −
                          - generic [ref=e54]: x
                          - generic [ref=e55]: )
                          - generic [ref=e56]: =
                          - generic [ref=e57]: −
                          - generic [ref=e58]: p
                          - generic [ref=e59]: (
                          - generic [ref=e60]: x
                          - generic [ref=e61]: )
                          - generic [ref=e62]: ","
                          - generic [ref=e63]: "["
                          - generic [ref=e64]: x
                          - generic [ref=e65]: "]"
                          - generic [ref=e66]: p
                          - generic [ref=e67]: =
                          - generic [ref=e68]: −
                          - generic [ref=e69]: "19"
                          - generic [ref=e70]: ","
                          - generic [ref=e71]: "["
                          - generic [ref=e72]:
                            - generic [ref=e73]: x
                            - generic [ref=e74]: "19"
                          - generic [ref=e75]: "]"
                          - generic [ref=e76]: p
                          - generic [ref=e77]: =
                          - generic [ref=e78]: "1"
                      - generic [ref=e79]:
                        - generic [ref=e80]:
                          - generic [ref=e81]: deg
                          - text: p =
                        - generic [ref=e82]: 19, p(−x) =
                        - generic [ref=e83]: −p(x), [x]p =
                        - generic [ref=e84]:
                          - text: −19, [
                          - generic [ref=e85]:
                            - text: x
                            - generic [ref=e91]: "19"
                          - text: "]p ="
                        - generic [ref=e92]: "1"
              - status [ref=e93]: "Native execution blocked: a complete supported no-tools containment boundary has not been established. No fresh native model request is available in this release."
              - generic [ref=e94]:
                - paragraph [ref=e95]: "Fixed allowance: Four fresh sessions; first three share 600 seconds, postreview 180 seconds, entire run 900 seconds. No model tools, no retries. Source and containment admission precede any dispatch."
                - generic [ref=e96]:
                  - button "Request native demonstration" [disabled] [ref=e98]
                  - generic [ref=e99]:
                    - generic [ref=e100]:
                      - checkbox "I understand this is one bounded public-task demonstration, not a new benchmark or theorem." [ref=e101]
                      - text: I understand this is one bounded public-task demonstration, not a new benchmark or theorem.
                    - button "Request engineering control" [active] [ref=e102]
                    - paragraph [ref=e103]: Deterministic software-only control; cannot satisfy live-model acceptance.
                - paragraph [ref=e104]: A queued request is not a model effect. A reviewed host worker and exact authority binding are still required.
                - generic [ref=e105]:
                  - paragraph [ref=e106]: Retained run
                  - button "Open proof view" [ref=e107]:
                    - img [ref=e108]
                    - text: Open proof view
            - generic [ref=e113]:
              - paragraph [ref=e114]: No retained native run in this mission
              - paragraph [ref=e115]: No original argument retained yet. This is an empty observation, not simulated activity.
  - alert [ref=e116]
```

# Test source

```ts
  1   | import AxeBuilder from "@axe-core/playwright";
  2   | import {createHash} from "node:crypto";
  3   | import {spawn} from "node:child_process";
  4   | import {lstat,realpath} from "node:fs/promises";
  5   | import pg from "pg";
  6   | import {expect,test,type Page,type APIResponse,type APIRequestContext} from "@playwright/test";
  7   | import {setLocale,signUpToDashboard} from "./auth-helpers";
  8   | import {E2E_ENV} from "./env";
  9   | 
  10  | // Worker-scoped privacy options belong at file scope in installed Playwright.
  11  | // Protect all cases from automatic traces/screenshots; explicit safe layout
  12  | // screenshots below remain intentional and contain only owned QA presentation.
  13  | test.use({trace:"off",screenshot:"off"});
  14  | 
  15  | // Main executes only after isolated source/build admission. The final case uses
  16  | // the reviewed fixed ENGINEERING_ONLY worker; native/model invocation is absent.
  17  | async function ownMission(page:Page,dashboardUrl:string) {
  18  |   await page.goto(`${dashboardUrl}/missions/new`);
  19  |   await page.getByLabel("Mission title").fill("TIP079 owned engineering UI observation");
  20  |   await page.getByLabel("Objective").fill("Observe a queued and revoked engineering control, not model capability.");
  21  |   await page.getByLabel("Scope").fill("Known public Poly19 software demonstration in isolated QA.");
  22  |   await page.getByLabel("Success definition").fill("Owned durable queue/revoke with native execution visibly blocked.");
  23  |   await page.getByLabel("Requirement title").fill("Honest no-live-effect presentation");
  24  |   await page.getByLabel("Acceptance criteria").fill("Native disabled; queued originals never fabricated.");
  25  |   await page.getByLabel("Obligation title").fill("Preserve retained state and exact run selection");
  26  |   await page.getByRole("button",{name:"Create mission"}).click();
  27  |   await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
  28  |   const missionId=new URL(page.url()).pathname.split("/").at(-1)!;
  29  |   await page.goto(`${dashboardUrl}/research/poly19?missionId=${missionId}#poly19-showcase`);
  30  |   return missionId;
  31  | }
  32  | 
  33  | test("TIP079C owned queued/revoked engineering control persists, never a native effect",async({page})=>{
  34  |   const {dashboardUrl,email}=await signUpToDashboard(page,"TIP079 Engineering Queue");
  35  |   const missionId=await ownMission(page,dashboardUrl),region=page.locator("#poly19-showcase");
  36  |   await expect(region.getByRole("button",{name:"Request native demonstration",exact:true})).toBeDisabled();
  37  |   await expect(region.getByText("Native execution blocked",{exact:false})).toBeVisible();
  38  |   await region.getByRole("checkbox").check();
  39  |   await Promise.all([
  40  |     page.waitForURL(url=>url.pathname.endsWith("/research/poly19")&&url.searchParams.get("missionId")===missionId&&Boolean(url.searchParams.get("runId"))),
  41  |     region.getByRole("button",{name:"Request engineering control",exact:true}).click(),
  42  |   ]);
  43  |   const runId=new URL(page.url()).searchParams.get("runId")!;
  44  |   test.info().annotations.push({type:"owned-engineering-QA-only",description:JSON.stringify({email,dashboardUrl,missionId,runId})});
  45  |   const retained=page.locator(`[data-poly19-run-id="${runId}"]`);
  46  |   await expect(retained.getByText("QUEUED",{exact:true})).toBeVisible();
  47  |   await expect(retained.locator("[data-stage]")).toHaveCount(5);
  48  |   await expect(retained.locator('[data-original-role="NONE"]')).toBeVisible();
  49  |   await expect(retained.locator('[data-exact-status="NOT_RETAINED"]')).toBeVisible();
  50  |   await page.reload();
  51  |   await expect(retained.getByText("QUEUED",{exact:true})).toBeVisible();
  52  |   await retained.getByRole("button",{name:"Revoke future effects",exact:true}).click();
  53  |   await expect(retained.getByText("REVOKED",{exact:true})).toBeVisible();
  54  |   await page.reload();
  55  |   expect(new URL(page.url()).searchParams.get("runId")).toBe(runId);
  56  |   await expect(retained.getByText("REVOKED",{exact:true})).toBeVisible();
  57  |   await expect(retained.getByRole("button",{name:"Revoke future effects",exact:true})).toHaveCount(0);
  58  |   await expect(retained.locator('[data-original-role="NONE"]')).toBeVisible();
  59  | });
  60  | 
  61  | test("TIP079C empty proof view is bilingual, themed, keyboard and 320px accessible",async({page})=>{
  62  |   const {dashboardUrl}=await signUpToDashboard(page,"TIP079 Engineering Layout");
  63  |   await ownMission(page,dashboardUrl);
  64  |   const region=page.locator("#poly19-showcase");
  65  |   for(const locale of ["en","vi"] as const) {
  66  |     await setLocale(page,locale);
  67  |     for(const theme of ["light","dark"] as const) {
  68  |       await page.evaluate(value=>localStorage.setItem("hive-appearance",value),theme);
  69  |       for(const width of [1280,390,320]) {
  70  |         await page.setViewportSize({width,height:844});await page.reload();
  71  |         await expect(page.locator("html")).toHaveAttribute("lang",locale);
  72  |         await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
  73  |         await expect(region.getByRole("button",{name:locale==="vi"?"Yêu cầu trình diễn bản địa":"Request native demonstration",exact:true})).toBeDisabled();
  74  |         await expect(region.getByText(locale==="vi"?"Chặn thực thi bản địa":"Native execution blocked",{exact:false})).toBeVisible();
  75  |         expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  76  |         await page.screenshot({path:`artifacts/tip079/empty-${locale}-${theme}-${width}.png`,fullPage:false});
  77  |       }
  78  |     }
  79  |   }
  80  |   await setLocale(page,"en");await page.reload();
  81  |   await region.getByText("Public task and source",{exact:true}).click();
  82  |   await expect(region.locator(".katex").first()).toBeVisible();
  83  |   const control=region.getByRole("button",{name:"Request engineering control",exact:true});
  84  |   await control.focus();await expect(control).toBeFocused();
  85  |   const scan=await new AxeBuilder({page}).include("#poly19-showcase").withTags(["wcag2a","wcag2aa"]).analyze();
> 86  |   expect(scan.violations.filter(v=>v.impact==="serious"||v.impact==="critical")).toEqual([]);
      |                                                                                  ^ Error: expect(received).toEqual(expected) // deep equality
  87  | });
  88  | 
  89  | test.describe("TIP079 fresh authenticated engineering full flow",()=>{
  90  |   // A privately captured server-action request contains session material. Never
  91  |   // put it in a failure trace, attachment, screenshot or diagnostic output.
  92  |   test("UI enqueue, exact worker, sealed HTTP exports and actual CSRF/tenant refusal",async({page,browser})=>{
  93  |     const started=performance.now();
  94  |     const origin="http://127.0.0.1:3002",storage="/private/tmp/hiveos-tip079-storage-90pH8Y";
  95  |     if(process.env.NODE_ENV!=="test" || process.env.HIVE_E2E_BASE_URL!==origin || process.env.STORAGE_LOCAL_ROOT!==storage) throw new Error("TIP079_FULL_FLOW_ENV_REFUSED");
  96  |     for(const key of ["DATABASE_URL","DATABASE_MIGRATION_URL"] as const) {
  97  |       const url=new URL(process.env[key]??"");
  98  |       if(!["localhost","127.0.0.1"].includes(url.hostname) || url.port!=="5433" || url.pathname!=="/hiveos_test") throw new Error("TIP079_FULL_FLOW_DATABASE_REFUSED");
  99  |     }
  100 |     const stat=await lstat(storage);
  101 |     if(!stat.isDirectory() || stat.isSymbolicLink() || stat.uid!==process.getuid?.() || (stat.mode&0o777)!==0o700 || await realpath(storage)!==storage) throw new Error("TIP079_FULL_FLOW_STORAGE_REFUSED");
  102 |     const {dashboardUrl,email}=await signUpToDashboard(page,"TIP079 Fresh Full Flow");
  103 |     const slug=new URL(dashboardUrl).pathname.split("/")[2];
  104 |     const missionId=await ownMission(page,dashboardUrl),region=page.locator("#poly19-showcase");
  105 |     await expect(region.getByRole("button",{name:"Request native demonstration",exact:true})).toBeDisabled();
  106 |     await region.getByRole("checkbox").check();
  107 |     const approvalRequest=page.waitForRequest(request=>request.method()==="POST" && new URL(request.url()).origin===origin && new URL(request.url()).pathname===`/w/${slug}/research/poly19` && Boolean(request.headers()["next-action"]));
  108 |     await Promise.all([
  109 |       page.waitForURL(url=>url.searchParams.get("missionId")===missionId && Boolean(url.searchParams.get("runId"))),
  110 |       region.getByRole("button",{name:"Request engineering control",exact:true}).click(),
  111 |     ]);
  112 |     const request=await approvalRequest,body=request.postDataBuffer(),headers=await request.allHeaders();
  113 |     const runId=new URL(page.url()).searchParams.get("runId");
  114 |     if(!runId || !/^[0-9a-f-]{36}$/.test(runId) || !body || body.length>65536) throw new Error("TIP079_APPROVAL_CAPTURE_REFUSED");
  115 |     // First prove this exact private action request is a valid idempotent replay.
  116 |     let validReplay:APIResponse;
  117 |     try {validReplay=await page.request.post(request.url(),{headers:{...headers,origin},data:body,maxRedirects:0,failOnStatusCode:false});}
  118 |     catch {throw new Error("TIP079_PRIVATE_VALID_REPLAY_TRANSPORT_REFUSED");}
  119 |     expect(validReplay.status()===200 || validReplay.status()>=300 && validReplay.status()<400).toBe(true);
  120 |     const redirect=validReplay.headers()["x-action-redirect"]??validReplay.headers().location;
  121 |     if(!redirect) throw new Error("TIP079_VALID_REPLAY_REDIRECT_MISSING");
  122 |     const selected=new URL(redirect.split(";")[0],origin);
  123 |     expect(selected.origin).toBe(origin);expect(selected.searchParams.get("runId")).toBe(runId);expect(selected.searchParams.get("action")).toBeNull();
  124 |     await validReplay.dispose();
  125 |     // Sole change is foreign Origin: installed Next16.2.11 action-handler.js
  126 |     // 445–488 refuses BEFORE execution with framework-specific HTTP500, not403.
  127 |     // This paired control does not accept unrelated/generic server failures.
  128 |     // The target URL remains loopback and captured secrets are never logged.
  129 |     let csrf:APIResponse;
  130 |     try {csrf=await page.request.post(request.url(),{headers:{...headers,origin:"https://cross-site.invalid"},data:body,maxRedirects:0,failOnStatusCode:false});}
  131 |     catch {throw new Error("TIP079_PRIVATE_CSRF_TRANSPORT_REFUSED");}
  132 |     expect(csrf.status()).toBe(500);
  133 |     await csrf.dispose();
  134 | 
  135 |     const client=new pg.Client({connectionString:E2E_ENV.DATABASE_MIGRATION_URL,connectionTimeoutMillis:3000,statement_timeout:3000});
  136 |     let actor:{actorId:string;organizationId:string;workspaceId:string};
  137 |     await client.connect();
  138 |     try {
  139 |       // Exact newly UI-created identity/workspace only; never enumerate studies
  140 |       // or use truncate, migration, cleanup, seed or a product-auth bypass.
  141 |       const owned=await client.query<{actorId:string;organizationId:string;workspaceId:string}>(
  142 |         'SELECT u.id AS "actorId",w.organization_id AS "organizationId",w.id AS "workspaceId" FROM "user" u JOIN workspace w ON w.created_by_id=u.id WHERE u.email=$1 AND w.slug=$2 LIMIT 2',[email,slug]);
  143 |       if(owned.rows.length!==1) throw new Error("TIP079_OWNED_FIXTURE_REFUSED");
  144 |       actor=owned.rows[0];
  145 |       if(!/^[0-9a-f-]{36}$/.test(actor.organizationId) || !/^[A-Za-z0-9-]{1,200}$/.test(actor.actorId)) throw new Error("TIP079_WORKER_IDENTITIES_REFUSED");
  146 |       const runs=await client.query<{id:string}>(
  147 |         'SELECT id FROM research_showcase_run WHERE organization_id=$1 AND workspace_id=$2 AND actor_user_id=$3 AND mission_id=$4 AND provenance=$5 LIMIT 2',
  148 |         [actor.organizationId,actor.workspaceId,actor.actorId,missionId,"ENGINEERING_ONLY"]);
  149 |       if(runs.rows.length!==1 || runs.rows[0].id!==runId) throw new Error("TIP079_CSRF_CREATED_EXTRA_RUN");
  150 |       const lineage=await client.query<{outboxCount:string;startCount:string}>(
  151 |         'SELECT (SELECT count(*) FROM outbox_event WHERE organization_id=$1 AND workspace_id=$2 AND aggregate_type=$3 AND aggregate_id=$4 AND topic=$5) AS "outboxCount",(SELECT count(*) FROM research_showcase_event WHERE organization_id=$1 AND workspace_id=$2 AND run_id=$4 AND event_type=$6) AS "startCount"',
  152 |         [actor.organizationId,actor.workspaceId,"ResearchShowcaseRun",runId,"research.showcase.poly19.stage","ROLE_STARTED"]);
  153 |       expect(Number(lineage.rows[0].outboxCount)).toBe(1);expect(Number(lineage.rows[0].startCount)).toBe(0);
  154 |     } finally {await client.end();}
  155 | 
  156 |     const remaining=Math.min(30000,test.info().timeout-(performance.now()-started)-3000);
  157 |     if(remaining<1000) throw new Error("TIP079_WORKER_TIME_NOT_ADMITTED");
  158 |     await new Promise<void>((resolve,reject)=>{
  159 |       const child=spawn(process.execPath,["--import","tsx","scripts/workers/research-showcase-worker.ts",
  160 |         `--organization-id=${actor.organizationId}`,`--actor-user-id=${actor.actorId}`,`--run-id=${runId}`],
  161 |         {cwd:process.cwd(),env:{...process.env,NODE_ENV:"test",STORAGE_LOCAL_ROOT:storage},stdio:["ignore","pipe","pipe"],detached:true});
  162 |       let bytes=0,refused=false;
  163 |       const stop=()=>{refused=true;if(child.pid) {try {process.kill(-child.pid,"SIGKILL");} catch {/* only this owned child group */}}};
  164 |       const timer=setTimeout(stop,remaining);
  165 |       for(const stream of [child.stdout,child.stderr]) stream.on("data",chunk=>{bytes+=chunk.length;if(bytes>8192)stop();});
  166 |       child.once("error",()=>{clearTimeout(timer);reject(new Error("TIP079_ENGINEERING_WORKER_SPAWN_REFUSED"));});
  167 |       child.once("close",(code,signal)=>{clearTimeout(timer);if(refused || code!==0 || signal)reject(new Error("TIP079_ENGINEERING_WORKER_NOT_COMPLETED"));else resolve();});
  168 |     });
  169 |     await page.reload();
  170 |     const retained=page.locator(`[data-poly19-run-id="${runId}"]`);
  171 |     await expect(retained.getByText("COMPLETED",{exact:true}).first()).toBeVisible();
  172 |     const endpoint=`${origin}/api/w/${slug}/research/poly19/${runId}/export`;
  173 |     const privateGet=async(context:APIRequestContext,url:string)=>{
  174 |       try {return await context.get(url);} catch {throw new Error("TIP079_PRIVATE_EXPORT_TRANSPORT_REFUSED");}
  175 |     };
  176 |     const jsonResponse=await privateGet(page.request,`${endpoint}?format=json`);
  177 |     expect(jsonResponse.status()).toBe(200);
  178 |     expect(jsonResponse.headers()["cache-control"]).toBe("private, no-store");
  179 |     expect(jsonResponse.headers()["x-hive-provenance"]).toBe("ENGINEERING_ONLY");
  180 |     expect(jsonResponse.headers()["content-disposition"]).toBe(`attachment; filename="poly19-ENGINEERING_ONLY-${runId}.json"`);
  181 |     expect(Boolean(jsonResponse.headers()["set-cookie"])).toBe(false);
  182 |     const jsonBytes=await jsonResponse.body();
  183 |     if(jsonBytes.length>4194304) throw new Error("TIP079_DOSSIER_BYTE_LIMIT");
  184 |     const dossier=JSON.parse(jsonBytes.toString("utf8"));
  185 |     expect(dossier.runId).toBe(runId);expect(dossier.provenance).toBe("ENGINEERING_ONLY");expect(dossier.status).toBe("COMPLETED");
  186 |     expect(dossier.modelInvocation).toBe("NOT_INVOKED_ENGINEERING_ONLY");
```