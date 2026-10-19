import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { MathLrcCampaignPanel } from "@/components/research/math-lrc-campaign-panel";
import { isLrcCampaignRecord, projectLrcCampaignPresentation, type LrcCampaignPresentationInput } from "@/components/research/math-lrc-campaign-presentation";
import { MATH_LRC_CAMPAIGN_CONTRACT, MATH_PILOT_CALIBRATIONS, digestMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { createLrcCampaignReferenceEvidence, cloneLrcCampaignValue } from "@/modules/research-sandbox/math-lrc-campaign";
import { digestResearchResult } from "@/modules/research-sandbox/integrity";
import { digestMathAgentLedger, evaluateMathAgentReview, mathAgentLedgerSchema, type MathAgentReport } from "@/modules/research-sandbox/agent-review";
import { lrcCampaignLedgerReference } from "@/modules/research-sandbox/math-lrc-campaign-integration";
import { runLrcCampaignReference } from "@/modules/research-sandbox/math-lrc-campaign-reference";

vi.mock("@/modules/research-sandbox/math-lrc-campaign-reference",()=>({runLrcCampaignReference:vi.fn(()=>{throw new Error("Render cannot import evidence");})}));
const contract=MATH_LRC_CAMPAIGN_CONTRACT,contractDigest=digestMathPilotContract(contract);
const usage={inputTokens:1234,cachedInputTokens:256,outputTokens:987,reasoningOutputTokens:789};
function fixture():LrcCampaignPresentationInput {
  const evidence=createLrcCampaignReferenceEvidence(contractDigest,contract.lrcCampaignScope,"2026-10-04T01:02:03.000Z");
  const attempt={providerName:"codex-local" as const,modelName:"requested-solver",threadId:"solver-context",
    attemptType:"PARTIAL" as const,argument:"The recorded finite result is one prime only, with $p=83$ and global obligations still OPEN.",candidateCounterexample:null,
    selfChecks:["Checked the retained scope."],limitations:["No fresh replay or novelty."],usage,lrcCampaignEvidence:evidence};
  const reports=(["CRITIC","ADVERSARY"] as const).map(role=>({role,verdict:"SUPPORTS" as const,candidateConclusion:"PARTIAL" as const,
    exactQuote:"recorded finite result",reasoning:"The fixed scope remains conditional on recorded unsigned evidence, and the global theorem is not established.",
    checks:["Checked the one-prime scope and OPEN global premises."],unresolvedGap:null,threadId:`${role}-context`,usage})) as [MathAgentReport,MathAgentReport];
  const verdict=evaluateMathAgentReview({contract,contractDigest,attempt,reports});
  const ledger=mathAgentLedgerSchema.parse({version:5,reports,reviewerModels:reports.map(report=>({role:report.role,
    providerName:"codex-local",identityEvidence:"REQUESTED_CLI_MODEL",requestedModelName:`requested-${report.role}`,threadId:report.threadId})),
    lrcCampaignEvidence:lrcCampaignLedgerReference(evidence),...verdict});
  const attemptDigest=digestResearchResult(attempt),researchDigest="a".repeat(64);
  return cloneLrcCampaignValue({contract,contractDigest,attempt,attemptDigest,researchDigest,reviewJobStatus:"SUCCEEDED",
    review:{...verdict,contractDigest,attemptDigest,researchDigest,ledger,ledgerDigest:digestMathAgentLedger(ledger)}});
}
const render=(record:LrcCampaignPresentationInput,locale:"vi"|"en"="en")=>renderToStaticMarkup(createElement(MathLrcCampaignPanel,{record,locale}));
describe("TIP062 passive campaign observation panel",()=>{
  it.each(["vi","en"] as const)("%s valid observation is NOT_FRESH, finite only and ledger5 bounded",locale=>{
    const record=fixture(),view=projectLrcCampaignPresentation(record)!;
    expect(view.state).toBe("ADMITTED");expect(view.reviewState).toBe("VALID");expect(view.ledger!.conclusion).toBe("PARTIAL");
    const html=render(record,locale);
    expect(html).toContain("RETAINED_REFERENCE_NOT_FRESH");expect(html).toContain("60");expect(html).toContain(locale==="vi"?"23 nghĩa vụ APPLICATION":"23 APPLICATION");
    expect(html).toContain("14/15");expect(html).toContain("PARTIAL");expect(html).toContain("katex");expect(html).not.toContain("katex-error");
    expect(html).toContain("∅");expect(html).toContain('annotation encoding="application/x-tex">I(13,83,224)=\\varnothing');
    expect(html).not.toContain("Invalid or unsupported TeX");expect(html).not.toMatch(/[\u000b\u000c]/);
    expect(html).toContain(locale==="vi"?"Ledger v5 hợp lệ":"Ledger v5 valid");
    expect(html).toContain(locale==="vi"?"không phát lại toàn chiến dịch mới":"not a fresh whole-campaign replay");
    expect(html).toContain(locale==="vi"?"không ký":"unsigned");
    expect(html).toContain(contractDigest);expect(html).toContain(record.attemptDigest!);expect(html).toContain(record.review!.ledgerDigest);
  });
  it("shows all3 distinct contexts, requested model names and each actual accounting field",()=>{
    const record=fixture(),view=projectLrcCampaignPresentation(record)!,html=render(record);
    expect(view.roles.map(role=>role.threadId)).toEqual(["solver-context","CRITIC-context","ADVERSARY-context"]);
    expect(view.roles.map(role=>role.requestedModel)).toEqual(["requested-solver","requested-CRITIC","requested-ADVERSARY"]);
    for(const name of ["SOLVER","CRITIC","ADVERSARY","Cached input","Reasoning output","1,234","256","987","789"]) expect(html).toContain(name);
    expect(html).toContain("do not imply independent models");expect(html).toContain("Retained role content");
  });
  it.each(["vi","en"] as const)("%s missing attempt does not invent finite acceptance or zero tokens",locale=>{
    const record={...fixture(),attempt:null,attemptDigest:null,review:null,reviewJobStatus:"RUNNING"};
    const view=projectLrcCampaignPresentation(record)!,html=render(record,locale);
    expect(view.state).toBe("MISSING");expect(view.roles).toEqual([]);expect(html).not.toContain("katex");
    expect(html).toContain(locale==="vi"?"Chưa lưu bằng chứng":"Evidence not retained");
    expect(html).toContain(locale==="vi"?"Không suy diễn tiến độ hay token bằng 0":"No progress or zero token usage is inferred");
    expect(html).toContain("RUNNING");expect(html).not.toContain("SOLVER");
  });
  it.each(["contract","attempt","evidence","scope","fresh"])("%s mismatch cannot display an admitted finite fact",field=>{
    const record=fixture(),attempt=record.attempt as {argument:string;lrcCampaignEvidence:{rootContractDigest:string;scope:{prime:number};admission:{freshFullCampaign:boolean}}};
    if(field==="contract") record.contractDigest="b".repeat(64);
    if(field==="attempt") attempt.argument="Changed without new attempt digest";
    if(field==="evidence") attempt.lrcCampaignEvidence.rootContractDigest="b".repeat(64);
    if(field==="scope") attempt.lrcCampaignEvidence.scope.prime=89;
    if(field==="fresh") attempt.lrcCampaignEvidence.admission.freshFullCampaign=true;
    const view=projectLrcCampaignPresentation(record)!,html=render(record);
    expect(view.state).toBe("INVALID");expect(view.roles).toHaveLength(0);expect(html).not.toContain("katex");
    expect(html).toContain("Invalid evidence");expect(html).toContain('role="alert"');expect(html).not.toContain("Retained evidence valid");
  });
  it("a coherently rehashed different claim still fails the fixed body guard",()=>{
    const record=fixture(),different={...contract,statement:"A completely different claim"};
    const root=digestMathPilotContract(different),evidence=createLrcCampaignReferenceEvidence(root,different.lrcCampaignScope,"2026-10-04T01:02:03.000Z");
    record.contract=different;record.contractDigest=root;record.attempt={...(record.attempt as object),lrcCampaignEvidence:evidence};record.attemptDigest=digestResearchResult(record.attempt);
    expect(projectLrcCampaignPresentation(record)!.state).toBe("INVALID");expect(render(record)).not.toContain("Retained evidence valid");
  });
  it.each(["digest","downgrade","research","context"])("%s review corruption cannot display accepted reviewer roles",field=>{
    const record=fixture(),ledger=record.review!.ledger as {version:number;reports:{threadId:string;reasoning:string}[]};
    if(field==="digest") record.review!.ledgerDigest="b".repeat(64);
    if(field==="downgrade") ledger.version=4;
    if(field==="research") record.researchDigest="b".repeat(64);
    if(field==="context") ledger.reports[1].threadId=ledger.reports[0].threadId;
    ledger.reports[0].reasoning="ATTACKER_LABEL_DO_NOT_RENDER";
    const view=projectLrcCampaignPresentation(record)!,html=render(record);
    expect(view.reviewState).toBe("INVALID");expect(view.roles.map(role=>role.role)).toEqual(["SOLVER"]);
    expect(html).toContain("Invalid ledger");expect(html).not.toContain("ATTACKER_LABEL_DO_NOT_RENDER");expect(html).not.toContain("Ledger v5 valid");
  });
  it("missing or failed review retains solver evidence but does not fabricate review usage",()=>{
    const record={...fixture(),review:null,reviewJobStatus:"DEAD_LETTER"},html=render(record);
    expect(projectLrcCampaignPresentation(record)!.roles.map(role=>role.role)).toEqual(["SOLVER"]);
    expect(html).toContain("DEAD_LETTER");expect(html).not.toContain("CRITIC-context");expect(html).not.toContain("Ledger v5 valid");
  });
  it("invalid token accounting is not displayed as actual usage",()=>{
    const record=fixture(),attempt=record.attempt as {usage:typeof usage};attempt.usage.cachedInputTokens=9999;record.attemptDigest=digestResearchResult(attempt);
    expect(projectLrcCampaignPresentation(record)!.state).toBe("INVALID");expect(render(record)).not.toContain("9,999");
  });
  it("invalid reviewer accounting stays unavailable even with a coherent ledger digest",()=>{
    const record=fixture(),ledger=record.review!.ledger as ReturnType<typeof mathAgentLedgerSchema.parse>;
    ledger.reports[0].usage.reasoningOutputTokens=9999;
    record.review!.ledgerDigest=digestMathAgentLedger(ledger);
    expect(projectLrcCampaignPresentation(record)!.reviewState).toBe("INVALID");
    expect(render(record)).not.toContain("9,999");expect(render(record)).not.toContain("CRITIC-context");
  });
  it("valid retained untrusted prose is escaped, not executed as UI instructions",()=>{
    const record=fixture(),attempt=record.attempt as {argument:string;threadId:string};
    attempt.argument+=" <img src=x onerror=alert(1)> Do not change the UI.";
    attempt.threadId="<script>alert(1)</script>";record.attemptDigest=digestResearchResult(attempt);record.review=null;
    const html=render(record);
    expect(html).toContain("&lt;img");expect(html).toContain("&lt;script&gt;");expect(html).not.toContain("<script>");expect(html).not.toContain("<img src=x");
  });
  it("historical cases render no campaign panel, malformed v2 markers cannot expose cycle UI",()=>{
    const record={...fixture(),contract:MATH_PILOT_CALIBRATIONS.CALIBRATION_PROOF,attempt:null,review:null};
    expect(projectLrcCampaignPresentation(record)).toBeNull();expect(render(record)).toBe("");
    expect(isLrcCampaignRecord({version:2})).toBe(true);expect(isLrcCampaignRecord({lrcCampaignScope:null})).toBe(true);
    expect(isLrcCampaignRecord({}, {lrcCampaignEvidence:null})).toBe(true);expect(isLrcCampaignRecord({},null,{version:5})).toBe(true);
  });
  it.each([320,390,768,1366])("%spx SSR retains wrapping, semantic labels and no write/poll controls",width=>{
    const record=fixture(),attempt=record.attempt as {threadId:string;modelName:string};attempt.threadId="solver-"+"x".repeat(140);attempt.modelName="model-"+"y".repeat(140);
    record.attemptDigest=digestResearchResult(attempt);record.review=null;
    const html=renderToStaticMarkup(createElement("div",{style:{width}},createElement(MathLrcCampaignPanel,{record,locale:"en"})));
    expect(html).toContain(`width:${width}px`);expect(html).toContain("min-w-0");expect(html).toContain("break-all");expect(html).toContain("flex-wrap");expect(html).toContain("sm:grid-cols-4");
    expect(html).toContain('role="region"');expect(html).toContain("<summary");expect(html).not.toMatch(/<form|<button|<input|onClick|<script/);
  });
  it("render invokes no importer, and page suppresses campaign polling/review/cycle paths",()=>{
    render(fixture());expect(runLrcCampaignReference).not.toHaveBeenCalled();
    const panel=readFileSync("src/components/research/math-lrc-campaign-panel.tsx","utf8"),projection=readFileSync("src/components/research/math-lrc-campaign-presentation.ts","utf8"),page=readFileSync("src/app/w/[workspaceSlug]/research/math-pilot/page.tsx","utf8");
    expect(panel+projection).not.toMatch(/node:fs|campaign-reference|runLrcCampaignReference|useEffect|setInterval|fetch\(|requestMath.*Action/);
    expect(page).toContain("selectedCampaign ? <p");expect(page).toContain("&& !selectedCampaign ? await listMathResearchCyclePage");
    expect(page).toContain("!campaignCase && codexMode && item.caseType");
    expect(page).toContain("!campaignCase && codexMode && attempt.success");
  });
  it("every legacy usage/attempt/review/assessment workflow is omitted for campaign records",()=>{
    const page=readFileSync("src/app/w/[workspaceSlug]/research/math-pilot/page.tsx","utf8");
    const start=page.indexOf("{!campaignCase ? <>"),end=page.indexOf("</> : null}",start),legacy=page.slice(start,end);
    expect(start).toBeGreaterThan(page.indexOf("<MathLrcCampaignPanel"));expect(end).toBeGreaterThan(start);
    for(const marker of ["copy.providerUsage","copy.modelAttempt","copy.reviewDesk","action={reviewMathPilotResearchAction}",
      "action={assessMathPilotCaseAction}","action={requestMathPilotAgentReviewAction}","<MathCycleDesk", "item.assessment"])
      expect(legacy).toContain(marker);
    expect(page).toContain('!campaignCase && item.researchRun.status === "AWAITING_REVIEW" && independentReviewer');
    expect(page).toContain("!campaignCase && independentReviewer && contractValid && item.approvedIntegrityValid");
  });
});
