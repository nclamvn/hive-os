# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: poly19-showcase.spec.ts >> TIP079 fresh authenticated engineering full flow >> UI enqueue, exact worker, sealed HTTP exports and actual CSRF/tenant refusal
- Location: tests/e2e/poly19-showcase.spec.ts:92:7

# Error details

```
Error: TIP079_ENGINEERING_WORKER_NOT_COMPLETED
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e3]:
    - link "Skip to content" [ref=e4] [cursor=pointer]:
      - /url: "#main-content"
    - complementary "Sidebar" [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - img [ref=e8]
          - generic [ref=e10]: HIVE OS
          - button "Collapse sidebar" [ref=e11]:
            - img [ref=e12]
        - generic [ref=e15]:
          - link "New mission" [ref=e16] [cursor=pointer]:
            - /url: /w/tip079-fresh-full-flow-aea059
            - img [ref=e17]
            - generic [ref=e18]: New mission
          - navigation "Primary navigation" [ref=e19]:
            - generic [ref=e20]:
              - generic [ref=e21]:
                - paragraph [ref=e22]: Command
                - list [ref=e23]:
                  - listitem [ref=e24]:
                    - link "Dashboard" [ref=e25] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059
                      - img [ref=e26]
                      - generic [ref=e31]: Dashboard
                  - listitem [ref=e32]:
                    - link "Missions" [ref=e33] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059/missions
                      - img [ref=e34]
                      - generic [ref=e38]: Missions
                  - listitem [ref=e39]:
                    - link "Governed authoring" [ref=e40] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059/authoring
                      - img [ref=e41]
                      - generic [ref=e45]: Governed authoring
                  - listitem [ref=e46]:
                    - link "Control Room" [ref=e47] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059/control-room
                      - img [ref=e48]
                      - generic [ref=e53]: Control Room
              - generic [ref=e54]:
                - paragraph [ref=e55]: Truth
                - list [ref=e56]:
                  - listitem [ref=e57]:
                    - link "Research" [ref=e58] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059/research
                      - img [ref=e59]
                      - generic [ref=e63]: Research
                  - listitem [ref=e64]:
                    - link "Evidence Hub" [ref=e65] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059/evidence
                      - img [ref=e66]
                      - generic [ref=e68]: Evidence Hub
                  - listitem [ref=e69]:
                    - link "Claims & Insights" [ref=e70] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059/claims
                      - img [ref=e71]
                      - generic [ref=e74]: Claims & Insights
                  - listitem [ref=e75]:
                    - link "Observatory" [ref=e76] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059/observatory
                      - img [ref=e77]
                      - generic [ref=e84]: Observatory
              - generic [ref=e85]:
                - paragraph [ref=e86]: Assurance
                - list [ref=e87]:
                  - listitem [ref=e88]:
                    - link "Execution" [ref=e89] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059/execution
                      - img [ref=e90]
                      - generic [ref=e93]: Execution
                  - listitem [ref=e94]:
                    - link "Verification" [ref=e95] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059/verification
                      - img [ref=e96]
                      - generic [ref=e99]: Verification
                  - listitem [ref=e100]:
                    - link "Reports" [ref=e101] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059/reports
                      - img [ref=e102]
                      - generic [ref=e105]: Reports
              - generic [ref=e106]:
                - paragraph [ref=e107]: System
                - list [ref=e108]:
                  - listitem [ref=e109]:
                    - link "Templates" [ref=e110] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059/templates
                      - img [ref=e111]
                      - generic [ref=e114]: Templates
                  - listitem [ref=e115]:
                    - link "Skill Library" [ref=e116] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059/skills
                      - img [ref=e117]
                      - generic [ref=e127]: Skill Library
                  - listitem [ref=e128]:
                    - link "Settings" [ref=e129] [cursor=pointer]:
                      - /url: /w/tip079-fresh-full-flow-aea059/settings
                      - img [ref=e130]
                      - generic [ref=e133]: Settings
        - group [ref=e135]:
          - generic "E2E User e2e-d17ab6da-f667-41cf-b593-39070401d142@test.local" [ref=e136] [cursor=pointer]:
            - img [ref=e138]
            - generic [ref=e141]:
              - generic [ref=e142]: E2E User
              - generic [ref=e143]: e2e-d17ab6da-f667-41cf-b593-39070401d142@test.local
            - img [ref=e144]
    - generic [ref=e146]:
      - banner [ref=e147]:
        - generic [ref=e148]:
          - heading "Native Poly19 demonstration" [level=1] [ref=e149]
          - paragraph [ref=e150]: Follow the retained argument from first attempt to independent exact replay.
        - generic [ref=e151]:
          - search [ref=e152]:
            - button "Search" [ref=e153]:
              - img [ref=e154]
            - generic [ref=e157]: Find governed objects
            - searchbox "Find governed objects" [ref=e158]
          - generic [ref=e160]:
            - 'button "Language: EN" [ref=e161]':
              - generic [ref=e162]: EN
            - 'button "Appearance: System" [ref=e163]':
              - img [ref=e164]
      - main [ref=e166]:
        - generic [ref=e169]:
          - link "Back to research" [ref=e170] [cursor=pointer]:
            - /url: /w/tip079-fresh-full-flow-aea059/research?missionId=d81f346c-9a1e-4b63-98f3-8443104c5713
          - region "Native Poly19 demonstration" [ref=e172]:
            - generic [ref=e173]:
              - generic [ref=e174]:
                - heading "A polynomial, a proof, and its evidence" [level=2] [ref=e175]
                - generic [ref=e176]: ENGINEERING_ONLY
              - paragraph [ref=e178]: Follow the retained argument from first attempt to independent exact replay.
              - paragraph [ref=e179]: Known public Epoch AI sample, not a private or training-unseen benchmark. This demonstration additionally requires integer coefficients. Reference exposure in preparation is disclosed; training exposure is UNKNOWN.
              - group [ref=e180]:
                - generic "Public task and source" [ref=e181] [cursor=pointer]
              - status [ref=e182]: "Native execution blocked: a complete supported no-tools containment boundary has not been established. No fresh native model request is available in this release."
              - paragraph [ref=e183]: Deterministic software-only control; cannot satisfy live-model acceptance.
              - generic [ref=e184]:
                - navigation "Retained runs" [ref=e185]:
                  - link "1f4424a7 · ENGINEERING_ONLY" [ref=e186] [cursor=pointer]:
                    - /url: /w/tip079-fresh-full-flow-aea059/research/poly19?missionId=d81f346c-9a1e-4b63-98f3-8443104c5713&runId=1f4424a7-4ac2-4b2e-b308-59757e1d026f#poly19-showcase
                - paragraph [ref=e187]: "Fixed allowance: Four fresh sessions; first three share 600 seconds, postreview 180 seconds, entire run 900 seconds. No model tools, no retries. Source and containment admission precede any dispatch."
                - generic [ref=e188]:
                  - button "Request native demonstration" [disabled] [ref=e190]
                  - generic [ref=e191]:
                    - generic [ref=e192]:
                      - checkbox "I understand this is one bounded public-task demonstration, not a new benchmark or theorem." [ref=e193]
                      - text: I understand this is one bounded public-task demonstration, not a new benchmark or theorem.
                    - button "Request engineering control" [ref=e194]
                    - paragraph [ref=e195]: Deterministic software-only control; cannot satisfy live-model acceptance.
                - paragraph [ref=e196]: A queued request is not a model effect. A reviewed host worker and exact authority binding are still required.
                - generic [ref=e197]:
                  - paragraph [ref=e198]: Retained run
                  - button "Open proof view" [ref=e199]:
                    - img [ref=e200]
                    - text: Open proof view
            - generic [ref=e205]:
              - generic [ref=e206]:
                - heading "Retained stage timeline" [level=3] [ref=e207]
                - generic [ref=e208]: COMPLETED
              - list "Retained stage timeline" [ref=e210]:
                - listitem [ref=e211]:
                  - paragraph [ref=e212]: First attempt
                  - paragraph [ref=e213]: COMPLETED
                - listitem [ref=e214]:
                  - paragraph [ref=e215]: Criticism
                  - paragraph [ref=e216]: COMPLETED
                - listitem [ref=e217]:
                  - paragraph [ref=e218]: Final argument
                  - paragraph [ref=e219]: COMPLETED
                - listitem [ref=e220]:
                  - paragraph [ref=e221]: Exact replay
                  - paragraph [ref=e222]: VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION
                - listitem [ref=e223]:
                  - paragraph [ref=e224]: Postreview
                  - paragraph [ref=e225]: COMPLETED
              - paragraph [ref=e226]: DONE
            - generic [ref=e227]:
              - article [ref=e228]:
                - heading "Original argument" [level=3] [ref=e229]
                - paragraph [ref=e230]: Final argument
                - generic [ref=e232]: ENGINEERING_ONLY deterministic control, not an AI proof attempt. Exact construction replay is reported under the separately reviewed written cyclotomic irreducibility/projective-closure lemma; no formal or official acceptance.
                - paragraph [ref=e233]: "Original SHA-256: f78e18c984ba291a8b1789b3f78065ca0816ef819b3ec86660da5eac61487d2f"
                - group [ref=e234]:
                  - 'generic "View this exact original: First attempt" [ref=e235] [cursor=pointer]'
                - group [ref=e236]:
                  - 'generic "View this exact original: Criticism" [ref=e237] [cursor=pointer]'
                - group [ref=e238]:
                  - 'generic "View this exact original: Final argument" [ref=e239] [cursor=pointer]'
                - group [ref=e240]:
                  - 'generic "View this exact original: Postreview" [ref=e241] [cursor=pointer]'
              - complementary "Machine certificate" [ref=e242]:
                - generic [ref=e243]:
                  - heading "Machine certificate" [level=3] [ref=e244]
                  - paragraph [ref=e245]: VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION
                  - paragraph [ref=e246]: Exact replay checks this integer construction under written cyclotomic, discriminant, Gauss and projective-closure lemmas. It is not a Lean proof, official Epoch score, novelty or method-superiority result.
                  - group [ref=e247]:
                    - generic "Written mathematical bridge" [ref=e248] [cursor=pointer]
                - generic [ref=e249]:
                  - heading "Independent model review" [level=3] [ref=e250]
                  - paragraph [ref=e251]: INCONCLUSIVE
                - generic [ref=e252]:
                  - heading "Observed CLI usage" [level=3] [ref=e253]
                  - paragraph [ref=e254]: "Permanent reservations: 4"
                  - generic [ref=e255]:
                    - generic [ref=e256]:
                      - term [ref=e257]: First attempt
                      - definition [ref=e258]:
                        - text: "Input tokens: UNKNOWN"
                        - text: "Output tokens: UNKNOWN"
                        - text: "Observed seconds: 0.05841212500000006"
                        - text: "Requested model: NOT_INVOKED_ENGINEERING_ONLY"
                        - text: "Served model / version: UNKNOWN"
                    - generic [ref=e259]:
                      - term [ref=e260]: Criticism
                      - definition [ref=e261]:
                        - text: "Input tokens: UNKNOWN"
                        - text: "Output tokens: UNKNOWN"
                        - text: "Observed seconds: 0.05891133400000013"
                        - text: "Requested model: NOT_INVOKED_ENGINEERING_ONLY"
                        - text: "Served model / version: UNKNOWN"
                    - generic [ref=e262]:
                      - term [ref=e263]: Final argument
                      - definition [ref=e264]:
                        - text: "Input tokens: UNKNOWN"
                        - text: "Output tokens: UNKNOWN"
                        - text: "Observed seconds: 0.060299125"
                        - text: "Requested model: NOT_INVOKED_ENGINEERING_ONLY"
                        - text: "Served model / version: UNKNOWN"
                    - generic [ref=e265]:
                      - term [ref=e266]: Postreview
                      - definition [ref=e267]:
                        - text: "Input tokens: UNKNOWN"
                        - text: "Output tokens: UNKNOWN"
                        - text: "Observed seconds: 0.06342070899999999"
                        - text: "Requested model: NOT_INVOKED_ENGINEERING_ONLY"
                        - text: "Served model / version: UNKNOWN"
                  - paragraph [ref=e268]:
                    - text: "Currency: UNKNOWN"
                    - text: "Hidden calls: UNKNOWN"
            - region "Separate engineering negative control" [ref=e269]:
              - generic [ref=e270]:
                - heading "Separate engineering negative control" [level=3] [ref=e271]
                - generic [ref=e272]: ENGINEERING_ONLY
              - paragraph [ref=e274]: Changed coefficients preserve p(19) but fail the supported factor identity. INCONCLUSIVE does not refute every possible real-coefficient construction. The original is never replaced.
              - paragraph [ref=e275]: INCONCLUSIVE
              - group [ref=e276]:
                - generic "Evidence and original exports" [ref=e277] [cursor=pointer]
            - group [ref=e278]:
              - generic "Evidence and original exports" [ref=e279] [cursor=pointer]
```

# Test source

```ts
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
  86  |   expect(scan.violations.filter(v=>v.impact==="serious"||v.impact==="critical")).toEqual([]);
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
> 167 |       child.once("close",(code,signal)=>{clearTimeout(timer);if(refused || code!==0 || signal)reject(new Error("TIP079_ENGINEERING_WORKER_NOT_COMPLETED"));else resolve();});
      |                                                                                                      ^ Error: TIP079_ENGINEERING_WORKER_NOT_COMPLETED
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
  187 |     expect(dossier.roles.map((role:{role:string})=>role.role)).toEqual(["ATTEMPT","CRITIC","FINAL","POSTREVIEW"]);
  188 |     const hash=(bytes:string|Buffer)=>createHash("sha256").update(bytes).digest("hex");
  189 |     for(const role of dossier.roles) {
  190 |       expect(role.validated).toBe(true);expect(role.originalComplete).toBe(true);expect(role.traceComplete).toBe(true);
  191 |       expect(role.outcome).toBe("COMPLETED");expect(role.remoteEffect).toBe("NONE");
  192 |       // Compare seals/byte lengths only: assertion diagnostics never echo an original.
  193 |       expect(hash(role.originalText)).toBe(role.originalDigest);expect(Buffer.byteLength(role.originalText,"utf8")).toBe(role.originalBytes);
  194 |     }
  195 |     const final=dossier.roles.find((role:{role:string})=>role.role==="FINAL");
  196 |     expect(hash(dossier.originalFinal)).toBe(final.originalDigest);
  197 |     const decodedFinal=JSON.parse(dossier.originalFinal);
  198 |     expect(hash(decodedFinal.certificateJson)).toBe(dossier.certificateDigest);
  199 |     expect(hash(dossier.certificateJson)).toBe(dossier.certificateDigest);
  200 |     expect(hash(dossier.faultCertificateJson)).toBe(dossier.faultCertificateDigest);
  201 |     expect(dossier.exactResult.status).toBe("VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION");
  202 |     expect(dossier.exactResult.candidateSha256).toBe(dossier.certificateDigest);
  203 |     expect(dossier.faultResult.status).toBe("INCONCLUSIVE");expect(dossier.faultResult.candidateSha256).toBe(dossier.faultCertificateDigest);
  204 |     for(const trace of dossier.traces) {const bytes=Buffer.from(trace.base64,"base64");expect(hash(bytes)).toBe(trace.digest);expect(bytes.length).toBe(trace.bytes);}
  205 |     expect(dossier.eventPayloads.length).toBe(dossier.eventCut.sequence);
  206 |     // Independent canonical seal replay over the exported complete event cut;
  207 |     // this is integrity evidence, not adoption of serialized checker authority.
  208 |     const canonical=(value:unknown):string=>{
  209 |       if(Array.isArray(value))return `[${value.map(canonical).join(",")}]`;
  210 |       if(value!==null && typeof value==="object")return `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical((value as Record<string,unknown>)[key])}`).join(",")}}`;
  211 |       return JSON.stringify(value);
  212 |     };
  213 |     const approval=dossier.eventPayloads[0].payload.detail;
  214 |     expect(hash(canonical(approval.sourceBundle))).toBe(dossier.sourceBundleDigest);
  215 |     expect(hash(canonical(approval.sourceBundle.sourcePins))).toBe(hash(canonical(dossier.sourceBundle.sourcePins)));
  216 |     expect(approval.sourceBundle.reviewReportDigest).toBe(dossier.sourceBundle.reviewReportDigest);
  217 |     let previous:string|null=null;
  218 |     for(let index=0;index<dossier.events.length;index++) {
  219 |       const event=dossier.events[index],payload=dossier.eventPayloads[index];
  220 |       expect(event.sequence).toBe(index+1);expect(payload.sequence).toBe(index+1);expect(event.previousDigest).toBe(previous);
  221 |       const seal={organizationId:dossier.organizationId,workspaceId:dossier.workspaceId,missionId:dossier.missionId,actorUserId:dossier.actorUserId,commandId:dossier.commandId,
  222 |         provenance:dossier.provenance,sourceBundleDigest:dossier.sourceBundleDigest,taskDigest:dossier.taskDigest,authorityEpoch:dossier.authorityEpoch,
  223 |         runId:dossier.runId,sequence:event.sequence,eventType:event.eventType,actionKey:event.actionKey,previousDigest:event.previousDigest,payload:payload.payload,jobId:event.jobId,createdAt:event.createdAt};
  224 |       expect(hash(canonical(seal))).toBe(event.digest);previous=event.digest;
  225 |     }
  226 |     expect(previous).toBe(dossier.eventCut.digest);
  227 |     const textResponse=await privateGet(page.request,`${endpoint}?format=text`);
  228 |     expect(textResponse.status()).toBe(200);expect(textResponse.headers()["cache-control"]).toBe("private, no-store");
  229 |     expect(textResponse.headers()["x-hive-provenance"]).toBe("ENGINEERING_ONLY");
  230 |     expect(textResponse.headers()["content-disposition"]).toBe(`attachment; filename="poly19-ENGINEERING_ONLY-${runId}.txt"`);
  231 |     expect(Boolean(textResponse.headers()["set-cookie"])).toBe(false);
  232 |     const textBytes=await textResponse.body();expect(hash(textBytes)).toBe(final.originalDigest);expect(textBytes.length).toBe(final.originalBytes);
  233 |     await jsonResponse.dispose();await textResponse.dispose();
  234 |     const anonymous=await browser.newContext();
  235 |     const other=await browser.newContext({baseURL:origin});
  236 |     try {
  237 |       const denied=await privateGet(anonymous.request,`${endpoint}?format=json`);expect(denied.status()).toBe(401);await denied.dispose();
  238 |       await signUpToDashboard(await other.newPage(),"TIP079 Separate Export Denial");
  239 |       const crossTenant=await privateGet(other.request,`${endpoint}?format=json`);expect([403,404].includes(crossTenant.status())).toBe(true);await crossTenant.dispose();
  240 |     } finally {await anonymous.close();await other.close();}
  241 |     // No dossier, captured request, credential or raw model/provider text is
  242 |     // attached or persisted by this test. All owned application fixtures remain.
  243 |     test.info().annotations.push({type:"owned-engineering-full-flow",description:JSON.stringify({email,missionId,runId})});
  244 |   });
  245 | });
  246 | 
```