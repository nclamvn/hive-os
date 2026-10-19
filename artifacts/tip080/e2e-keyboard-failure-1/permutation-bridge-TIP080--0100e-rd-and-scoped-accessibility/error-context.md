# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: permutation-bridge.spec.ts >> TIP080 empty DRAFT bilingual/theme/mobile formula keyboard and scoped accessibility
- Location: tests/e2e/permutation-bridge.spec.ts:58:5

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
+         "html": "<span class=\"math-tex-inline\" title=\"\\(X=\\mathbb E\\!\\left[\\sum_{i=1}^{n-1}\\mathbf 1\\{\\operatorname{pos}_{F(\\sigma)}(i+1)<\\operatorname{pos}_{F(\\sigma)}(i)\\}\\right]\\)\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".math-rich-text.whitespace-pre-wrap.break-words:nth-child(5) > .math-tex-inline",
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
          - heading "A recursive construction on large permutations" [level=1] [ref=e9]
          - paragraph [ref=e10]: A public task, exact originals, arithmetic support and non-formal argument review.
        - generic [ref=e11]:
          - link "Find governed objects" [ref=e12] [cursor=pointer]:
            - /url: /w/tip080-draft-layout-435c3e/control-room?find=1
            - img [ref=e13]
          - generic [ref=e16]:
            - 'button "Language: EN" [ref=e17]':
              - generic [ref=e18]: EN
            - 'button "Appearance: Dark" [ref=e19]':
              - img [ref=e20]
      - main [ref=e22]:
        - generic [ref=e25]:
          - link "Back to research" [ref=e26] [cursor=pointer]:
            - /url: /w/tip080-draft-layout-435c3e/research
          - region "A recursive construction on large permutations" [ref=e28]:
            - generic [ref=e29]:
              - generic [ref=e30]:
                - heading "A recursive construction on large permutations" [level=2] [ref=e31]
                - generic [ref=e32]: CODEX_ASSISTED
              - paragraph [ref=e34]: CODEX_ASSISTED · human-operated imports, not native execution. Known public FrontierMath Tier 2 sample; Main saw the statement and technique hint. Training exposure, upstream tools, tokens, costs and hidden calls are UNKNOWN. Not a blind benchmark, official score or discovery.
              - region "Fixed permutation formula" [active] [ref=e35]:
                - 'generic "\\(n=10^{12},\\quad F(\\varnothing)=\\varnothing\\)" [ref=e37]':
                  - generic [ref=e38]:
                    - math [ref=e40]:
                      - generic [ref=e42]:
                        - generic [ref=e43]: "n"
                        - generic [ref=e44]: =
                        - generic [ref=e45]:
                          - generic [ref=e46]: "10"
                          - generic [ref=e47]: "12"
                        - generic [ref=e48]: ","
                        - generic [ref=e49]: F
                        - generic [ref=e50]: (
                        - generic [ref=e51]: ∅
                        - generic [ref=e52]: )
                        - generic [ref=e53]: =
                        - generic [ref=e54]: ∅
                    - generic [ref=e55]:
                      - generic [ref=e56]: n =
                      - generic [ref=e57]:
                        - text: "1"
                        - generic [ref=e58]:
                          - text: "0"
                          - generic [ref=e64]: "12"
                        - text: ", F(∅) ="
                      - generic [ref=e65]: ∅
                - generic "\\(F(LmR)=F(L)F(R)m\\)" [ref=e67]:
                  - generic [ref=e68]:
                    - math [ref=e70]:
                      - generic [ref=e72]:
                        - generic [ref=e73]: F
                        - generic [ref=e74]: (
                        - generic [ref=e75]: L
                        - generic [ref=e76]: m
                        - generic [ref=e77]: R
                        - generic [ref=e78]: )
                        - generic [ref=e79]: =
                        - generic [ref=e80]: F
                        - generic [ref=e81]: (
                        - generic [ref=e82]: L
                        - generic [ref=e83]: )
                        - generic [ref=e84]: F
                        - generic [ref=e85]: (
                        - generic [ref=e86]: R
                        - generic [ref=e87]: )
                        - generic [ref=e88]: m
                    - generic [ref=e89]:
                      - generic [ref=e90]: F(LmR) =
                      - generic [ref=e91]: F(L)F(R)m
                - 'generic "\\(X=\\mathbb E\\!\\left[\\sum_{i=1}^{n-1}\\mathbf 1\\{\\operatorname{pos}_{F(\\sigma)}(i+1)<\\operatorname{pos}_{F(\\sigma)}(i)\\}\\right]\\)" [ref=e93]':
                  - generic [ref=e94]:
                    - math [ref=e96]:
                      - generic [ref=e98]:
                        - generic [ref=e99]: X
                        - generic [ref=e100]: =
                        - generic [ref=e101]: E
                        - generic: ⁣
                        - generic [ref=e102]:
                          - generic [ref=e103]: "["
                          - generic [ref=e104]:
                            - generic [ref=e105]: ∑
                            - generic [ref=e106]:
                              - generic [ref=e107]: i
                              - generic [ref=e108]: =
                              - generic [ref=e109]: "1"
                            - generic [ref=e110]:
                              - generic [ref=e111]: "n"
                              - generic [ref=e112]: −
                              - generic [ref=e113]: "1"
                          - generic [ref=e114]: "1"
                          - generic [ref=e115]: "{"
                          - generic [ref=e116]:
                            - generic [ref=e117]:
                              - generic [ref=e118]: pos
                              - generic: ⁡
                            - generic [ref=e119]:
                              - generic [ref=e120]: F
                              - generic [ref=e121]: (
                              - generic [ref=e122]: σ
                              - generic [ref=e123]: )
                          - generic [ref=e124]: (
                          - generic [ref=e125]: i
                          - generic [ref=e126]: +
                          - generic [ref=e127]: "1"
                          - generic [ref=e128]: )
                          - generic [ref=e129]: <
                          - generic [ref=e130]:
                            - generic [ref=e131]:
                              - generic [ref=e132]: pos
                              - generic: ⁡
                            - generic [ref=e133]:
                              - generic [ref=e134]: F
                              - generic [ref=e135]: (
                              - generic [ref=e136]: σ
                              - generic [ref=e137]: )
                          - generic [ref=e138]: (
                          - generic [ref=e139]: i
                          - generic [ref=e140]: )
                          - generic [ref=e141]: "}"
                          - generic [ref=e142]: "]"
                    - generic [ref=e143]:
                      - generic [ref=e144]: X =
                      - generic [ref=e145]:
                        - text: E
                        - generic [ref=e146]:
                          - generic [ref=e147]: "["
                          - generic [ref=e148]:
                            - text: ∑
                            - generic [ref=e152]:
                              - generic [ref=e154]: i=1
                              - generic [ref=e156]: n−1
                          - text: "1{"
                          - generic [ref=e160]:
                            - generic [ref=e161]: pos
                            - generic [ref=e167]: F(σ)
                          - text: (i + 1) <
                          - generic [ref=e171]:
                            - generic [ref=e172]: pos
                            - generic [ref=e178]: F(σ)
                          - text: "(i)}"
                          - generic [ref=e182]: "]"
              - paragraph [ref=e183]: Remove the maximum, recursively process its left and right words, then append the maximum. For a uniformly random permutation on n letters, find the floor of the expected number of adjacent values in reversed order in the result.
              - link "Epoch AI · FrontierMath Tier 2" [ref=e184] [cursor=pointer]:
                - /url: https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems#tier-2
              - status [ref=e185]: DRAFT — unstarted. No model request or result has been recorded.
              - generic [ref=e186]:
                - navigation "Unstarted and retained runs" [ref=e187]:
                  - link "bf2de409 · DRAFT" [ref=e188] [cursor=pointer]:
                    - /url: /w/tip080-draft-layout-435c3e/research/permutations?missionId=7198efc5-7f62-4e83-bf7f-dde21de0e1d4&runId=bf2de409-01c5-4909-966d-f426bb790379#permutation-bridge
                - button "Create unstarted draft" [ref=e190]
                - generic [ref=e191]:
                  - button "Start recorded run" [disabled] [ref=e192]
                  - paragraph [ref=e193]: Start remains disabled until authenticated recording readiness is admitted. Start begins the fixed 900-second allowance; at most four fresh roles, no retries or paid API.
                - button "Revoke future admissions" [ref=e195]
            - generic [ref=e196]:
              - generic [ref=e197]:
                - heading "Durable stage timeline" [level=3] [ref=e198]
                - generic [ref=e199]: DRAFT
              - list "Durable stage timeline" [ref=e201]:
                - listitem [ref=e202]:
                  - paragraph [ref=e203]: Attempt
                  - paragraph [ref=e204]: NOT_RESERVED
                - listitem [ref=e205]:
                  - paragraph [ref=e206]: Critique
                  - paragraph [ref=e207]: NOT_RESERVED
                - listitem [ref=e208]:
                  - paragraph [ref=e209]: Final argument
                  - paragraph [ref=e210]: NOT_RESERVED
                - listitem [ref=e211]:
                  - paragraph [ref=e212]: Arithmetic checker
                  - paragraph [ref=e213]: NOT_RUN
                - listitem [ref=e214]:
                  - paragraph [ref=e215]: Non-formal postreview
                  - paragraph [ref=e216]: NOT_RESERVED
            - generic [ref=e217]:
              - generic [ref=e218]:
                - heading "Exact retained originals" [level=3] [ref=e219]
                - paragraph [ref=e220]: No original retained. This is an empty observation, not model progress.
              - complementary "Arithmetic evidence" [ref=e221]:
                - heading "Arithmetic evidence" [level=3] [ref=e222]
                - paragraph [ref=e223]: NOT_RUN
                - paragraph [ref=e224]: Arithmetic support under written lemmas is separate from reviewing the argument. Process COMPLETED does not mean the problem is solved. No formal proof, official score or capability gain is established by a hash or stage label.
                - paragraph [ref=e225]: "Tokens / costs / upstream tools: UNKNOWN"
                - paragraph [ref=e226]: Operator declarations are not cryptographic authentication of upstream output.
            - group [ref=e227]:
              - generic "Private audit and export" [ref=e228] [cursor=pointer]
  - alert [ref=e229]
```

# Test source

```ts
  1  | import AxeBuilder from "@axe-core/playwright";
  2  | import {createHash} from "node:crypto";
  3  | import pg from "pg";
  4  | import {expect,test,type Page,type APIRequestContext,type APIResponse} from "@playwright/test";
  5  | import {signUpToDashboard,setLocale} from "./auth-helpers";
  6  | import {E2E_ENV} from "./env";
  7  | test.use({trace:"off",screenshot:"off"});
  8  | const origin="http://127.0.0.1:3003",hash=(b:string|Buffer)=>createHash("sha256").update(b).digest("hex");
  9  | async function ownMission(page:Page,dashboardUrl:string) {
  10 |   await page.goto(`${dashboardUrl}/missions/new`);
  11 |   await page.getByLabel("Mission title").fill("TIP080 preparation-only UI fixture");
  12 |   await page.getByLabel("Objective").fill("Observe an unstarted draft and exact export; never start scientific roles.");
  13 |   await page.getByLabel("Scope").fill("Own isolated test workspace and public fixed permutation task.");
  14 |   await page.getByLabel("Success definition").fill("DRAFT/disabled Start/revoke persist with no model result.");
  15 |   await page.getByLabel("Requirement title").fill("Honest draft preparation");
  16 |   await page.getByLabel("Acceptance criteria").fill("No scientific role or live authority installed.");
  17 |   await page.getByLabel("Obligation title").fill("Preserve exact ledger cut");
  18 |   await page.getByRole("button",{name:"Create mission"}).click();await page.waitForURL(/\/missions\/[a-f0-9-]{36}/);
  19 |   const missionId=new URL(page.url()).pathname.split("/").at(-1)!;
  20 |   await page.goto(`${dashboardUrl}/research/permutations?missionId=${missionId}#permutation-bridge`);return missionId;
  21 | }
  22 | async function privateGet(ctx:APIRequestContext,url:string) {try{return await ctx.get(url);}catch{throw new Error("TIP080_PRIVATE_GET_TRANSPORT_REFUSED");}}
  23 | const canonical=(v:unknown):string=>Array.isArray(v)?`[${v.map(canonical).join(",")}]`:v!==null&&typeof v==="object"?`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canonical((v as Record<string,unknown>)[k])}`).join(",")}}`:JSON.stringify(v);
  24 | async function readDraft(page:Page,url:string,runId:string) {
  25 |   const r=await privateGet(page.request,url);expect(r.status()).toBe(200);expect(r.headers()["cache-control"]).toBe("private, no-store");expect(r.headers()["x-content-type-options"]).toBe("nosniff");
  26 |   const bytes=await r.body();if(bytes.length>1048576)throw new Error("TIP080_PRIVATE_EXPORT_OVERSIZE");expect(hash(bytes)).toBe(r.headers()["x-content-sha256"]);
  27 |   const v=JSON.parse(bytes.toString("utf8"));expect(v.binding.runId).toBe(runId);expect(v.originals).toHaveLength(0);expect(v.state.startedAt).toBeNull();expect(v.checker).toBeNull();expect(v.liveReady).toBe(false);
  28 |   let previous:string|null=null;for(let i=0;i<v.events.length;i++){const {eventDigest,...body}=v.events[i];expect(body.sequence).toBe(i+1);expect(body.previousDigest).toBe(previous);expect(hash(canonical(body))).toBe(eventDigest);previous=eventDigest;}
  29 |   await r.dispose();return v;
  30 | }
  31 | test("TIP080 owned DRAFT Origin/idempotency/private exports/revoke; zero START",async({page,browser})=>{
  32 |   const {dashboardUrl,email}=await signUpToDashboard(page,"TIP080 Draft Boundary"),slug=new URL(dashboardUrl).pathname.split("/")[2],missionId=await ownMission(page,dashboardUrl),region=page.locator("#permutation-bridge");
  33 |   const capture=page.waitForRequest(r=>r.method()==="POST"&&new URL(r.url()).origin===origin&&new URL(r.url()).pathname===`/w/${slug}/research/permutations`&&Boolean(r.headers()["next-action"]));
  34 |   await Promise.all([page.waitForURL(u=>u.searchParams.get("missionId")===missionId&&Boolean(u.searchParams.get("runId"))),region.getByRole("button",{name:"Create unstarted draft",exact:true}).click()]);
  35 |   const runId=new URL(page.url()).searchParams.get("runId")!,request=await capture,body=request.postDataBuffer(),headers=await request.allHeaders();
  36 |   if(!/^[a-f0-9-]{36}$/.test(runId)||!body||body.length>65536)throw new Error("TIP080_PRIVATE_DRAFT_CAPTURE_REFUSED");
  37 |   // Session material stays memory-only, never output/attachments/failure traces.
  38 |   let replay:APIResponse,foreign:APIResponse;
  39 |   try{replay=await page.request.post(request.url(),{headers:{...headers,origin},data:body,maxRedirects:0,failOnStatusCode:false});}catch{throw new Error("TIP080_PRIVATE_REPLAY_TRANSPORT_REFUSED");}
  40 |   expect(replay.status()===200||replay.status()>=300&&replay.status()<400).toBe(true);
  41 |   const redirect=replay.headers()["x-action-redirect"]??replay.headers().location;if(!redirect)throw new Error("TIP080_DRAFT_REPLAY_REDIRECT_MISSING");const selected=new URL(redirect.split(";")[0],origin);expect(selected.searchParams.get("runId")).toBe(runId);expect(selected.searchParams.get("action")).toBeNull();await replay.dispose();
  42 |   try{foreign=await page.request.post(request.url(),{headers:{...headers,origin:"https://cross-site.invalid"},data:body,maxRedirects:0,failOnStatusCode:false});}catch{throw new Error("TIP080_PRIVATE_ORIGIN_TRANSPORT_REFUSED");}
  43 |   // Installed Next16.2.11 action-handler refuses a foreign Origin with500;
  44 |   // paired legitimate replay above separates CSRF refusal from unrelated failures.
  45 |   expect(foreign.status()).toBe(500);await foreign.dispose();
  46 |   const client=new pg.Client({connectionString:E2E_ENV.DATABASE_MIGRATION_URL,connectionTimeoutMillis:3000,statement_timeout:3000});await client.connect();try{
  47 |     const own=await client.query<{actor:string;workspace:string;organization:string}>('SELECT u.id AS actor,w.id AS workspace,w.organization_id AS organization FROM "user" u JOIN workspace w ON w.created_by_id=u.id WHERE u.email=$1 AND w.slug=$2 LIMIT 2',[email,slug]);if(own.rows.length!==1)throw new Error("TIP080_OWN_FIXTURE_BINDING_REFUSED");const o=own.rows[0];
  48 |     const roots=await client.query<{id:string}>('SELECT id FROM command_record WHERE organization_id=$1 AND workspace_id=$2 AND actor_user_id=$3 AND command_type=$4 AND status=$5 AND payload->>\'missionId\'=$6 LIMIT 2',[o.organization,o.workspace,o.actor,"permutation.bridge.080.DRAFT","SUCCEEDED",missionId]);expect(roots.rows.length).toBe(1);expect(roots.rows[0].id).toBe(runId);
  49 |     const counts=await client.query<{outbox:string;starts:string}>('SELECT (SELECT count(*) FROM outbox_event WHERE organization_id=$1 AND workspace_id=$2 AND aggregate_id=$3 AND topic=$4) AS outbox,(SELECT count(*) FROM command_record WHERE organization_id=$1 AND workspace_id=$2 AND actor_user_id=$5 AND command_type=$6 AND status=$7) AS starts',[o.organization,o.workspace,runId,"permutation.bridge.080.observed",o.actor,"permutation.bridge.080.START","SUCCEEDED"]);expect(Number(counts.rows[0].outbox)).toBe(1);expect(Number(counts.rows[0].starts)).toBe(0);
  50 |   }finally{await client.end();}
  51 |   const retained=page.locator(`[data-permutation-run-id="${runId}"]`);await expect(retained.getByRole("button",{name:"Start recorded run",exact:true})).toBeDisabled();await expect(retained.getByText("DRAFT — unstarted",{exact:false})).toBeVisible();
  52 |   const endpoint=`${origin}/api/w/${slug}/research/permutations/${runId}/export`;
  53 |   expect((await readDraft(page,endpoint,runId)).state.status).toBe("DRAFT");
  54 |   const anon=await browser.newContext(),other=await browser.newContext({baseURL:origin});try{const denied=await privateGet(anon.request,endpoint);expect(denied.status()).toBe(401);await denied.dispose();await signUpToDashboard(await other.newPage(),"TIP080 Separate Tenant");const cross=await privateGet(other.request,endpoint);expect([403,404].includes(cross.status())).toBe(true);await cross.dispose();}finally{await anon.close();await other.close();}
  55 |   await retained.getByRole("button",{name:"Revoke future admissions",exact:true}).click();await expect(retained.getByText("REVOKED",{exact:true})).toBeVisible();await page.reload();expect(new URL(page.url()).searchParams.get("runId")).toBe(runId);expect((await readDraft(page,endpoint,runId)).state.status).toBe("REVOKED");
  56 |   test.info().annotations.push({type:"owned-preparation-only",description:JSON.stringify({email,missionId,runId})});
  57 | });
  58 | test("TIP080 empty DRAFT bilingual/theme/mobile formula keyboard and scoped accessibility",async({page})=>{
  59 |   const {dashboardUrl}=await signUpToDashboard(page,"TIP080 Draft Layout");await ownMission(page,dashboardUrl);const region=page.locator("#permutation-bridge");await Promise.all([page.waitForURL(u=>Boolean(u.searchParams.get("runId"))),region.getByRole("button",{name:"Create unstarted draft",exact:true}).click()]);
  60 |   for(const locale of ["en","vi"] as const){await setLocale(page,locale);for(const theme of ["light","dark"] as const){await page.evaluate(v=>localStorage.setItem("hive-appearance",v),theme);for(const width of [1280,390,320]){await page.setViewportSize({width,height:844});await page.reload();await expect(page.locator("html")).toHaveAttribute("lang",locale);await expect(page.locator("html")).toHaveAttribute("data-theme",theme);await expect(region.getByRole("button",{name:locale==="vi"?"Bắt đầu lượt ghi hình":"Start recorded run",exact:true})).toBeDisabled();await expect(region.locator("[data-bridge-stage]")).toHaveCount(5);expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);}}}
  61 |   await setLocale(page,"en");await page.reload();const formula=region.getByRole("region",{name:"Fixed permutation formula",exact:true});await formula.focus();await expect(formula).toBeFocused();await expect(formula.locator(".katex").first()).toBeVisible();
> 62 |   const scan=await new AxeBuilder({page}).include("#permutation-bridge").withTags(["wcag2a","wcag2aa"]).analyze();expect(scan.violations.filter(v=>v.impact==="serious"||v.impact==="critical")).toEqual([]);
     |                                                                                                                                                                                                  ^ Error: expect(received).toEqual(expected) // deep equality
  63 | });
  64 | 
```