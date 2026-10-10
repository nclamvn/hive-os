import {describe,it,expect} from "vitest";
import {readFileSync} from "node:fs";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import retained from "../../docs/research/LRC_METHOD_VALIDATION_084.json";
import {approximate,arcEndpoints,fractionLabel,rational,readLrcDemo,shiftDistances} from "@/components/research/lrc-demo-data";
import {LrcDemo} from "@/components/research/lrc-demo";

describe("TIP085 retained LRC presentation",()=>{
  it("preserves auth/capability and the existingdev/test gate before display render (source regression)",()=>{
    const source=readFileSync(new URL("../../src/app/w/[workspaceSlug]/research/lrc-demo/page.tsx",import.meta.url),"utf8");
    const auth=source.indexOf("await loadWorkspacePage(workspaceSlug)"),capability=source.indexOf('hasCapability(data.ctx.membership.role,"research.read")');
    const gate=source.indexOf("const env=getEnv()"),render=source.indexOf("<LrcDemo raw=");
    expect(auth).toBeGreaterThan(0);expect(capability).toBeGreaterThan(auth);
    expect(gate).toBeGreaterThan(capability);expect(render).toBeGreaterThan(gate);
    expect(source).toContain('!["development","test"].includes(env.NODE_ENV)');
    expect(source).toContain('(env.DEPLOYMENT_ENV&&!["development","test"].includes(env.DEPLOYMENT_ENV)))notFound()');
  });
  it("loads only both accepted fixed cases and the actual59 interval facts",()=>{
    const data=readLrcDemo(retained)!;
    expect(data.gw.speeds).toEqual(["1","2","3","4","5","6","7","8","9","10","11","13","24"]);
    expect(data.gw.cover).toEqual(retained.certificate.cases[0].cover);
    expect(data.gw.cover).toHaveLength(59);
    expect(data.shift.speeds).toHaveLength(14);
  });
  it.each([null,{}, {...retained,independentReplay:{...retained.independentReplay,accepted:false}}])("never presents a missing/unaccepted record as PASS",raw=>{
    expect(readLrcDemo(raw)).toBeNull();
    const html=renderToStaticMarkup(createElement(LrcDemo,{raw,locale:"en"}));
    expect(html).toContain("Accepted record unavailable");
    expect(html).not.toContain("Retained OFFLINE independent replay");
  });
  it("refuses shifted scope or incomplete arc facts",()=>{
    const changed=structuredClone(retained);
    changed.certificate.globalLrcProved=true;
    expect(readLrcDemo(changed)).toBeNull();
    const deleted=structuredClone(retained);
    deleted.certificate.cases[0].cover!.pop();
    expect(readLrcDemo(deleted)).toBeNull();
    const tuple=structuredClone(retained);
    tuple.certificate.cases[1].speeds[0]="2";
    expect(readLrcDemo(tuple)).toBeNull();
  });
  it("reconstructs closed exact endpoints, includingclippedperiodboundaries",()=>{
    const start=arcEndpoints("1",0),end=arcEndpoints("1",1),second=arcEndpoints("13",1);
    expect([fractionLabel(start.lower),fractionLabel(start.upper)]).toEqual(["0/1","1/14"]);
    expect([fractionLabel(end.lower),fractionLabel(end.upper)]).toEqual(["13/14","1/1"]);
    expect([fractionLabel(second.lower),fractionLabel(second.upper)]).toEqual(["1/14","15/182"]);
  });
  it("keeps the59 displayed intervals consistent with the retained full closed cover",()=>{
    const data=readLrcDemo(retained)!;
    let reached=rational(BigInt(0),BigInt(1));
    for(const arc of data.gw.cover){
      const {lower,upper}=arcEndpoints(data.gw.speeds[arc.speedIndex],arc.center);
      expect(lower.n*reached.d<=reached.n*lower.d).toBe(true);
      if(upper.n*reached.d>reached.n*upper.d)reached=upper;
    }
    expect(fractionLabel(reached)).toBe("1/1");
  });
  it.each([0,1,2,3,4])("computes the original14 physical products exactly at j=%s",j=>{
    const data=readLrcDemo(retained)!,q=BigInt(data.shift.Q);
    const selected=shiftDistances(data.shift,j);
    expect(selected.runners).toHaveLength(14);
    selected.runners.slice(0,10).forEach(r=>expect(fractionLabel(r.distance)).toBe("1/2"));
    expect(selected.runners.every(r=>r.good)).toBe(j===4);
    if(j<4){expect(selected.runners.filter(r=>!r.good).map(r=>r.index)).toEqual([10+j]);
      expect(selected.runners[10+j].distance).toEqual(rational(BigInt(1),BigInt(10)*q));
    }else{
      expect(selected.time).toEqual(rational(BigInt(8)*q+BigInt(1),BigInt(10)*q));
      expect(selected.runners[10].distance).toEqual(rational(BigInt(2)*q-BigInt(1),BigInt(10)*q));
    }
  });
  it("demonstrates why rounded SVG positions cannot decide acceptance",()=>{
    const data=readLrcDemo(retained)!;
    const bad=shiftDistances(data.shift,0).runners[10];
    expect(approximate(bad.distance)).toBe(0);
    expect(bad.distance.n>BigInt(0)).toBe(true);
    expect(bad.good).toBe(false);
    expect(()=>shiftDistances(data.shift,5)).toThrow();
  });
  it("renders honest offline labels,59 keyboard-nativechoices and readable TeX",()=>{
    const html=renderToStaticMarkup(createElement(LrcDemo,{raw:retained,locale:"en"}));
    expect(html).toContain("Retained OFFLINE independent replay");
    expect(html.match(/<option /g)).toHaveLength(59);
    expect(html).toContain('aria-label="Previous interval"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toMatch(/role="region" tabindex="0" aria-label="Exact interval equation, horizontally scrollable by keyboard"/);
    expect(html).toMatch(/role="region" tabindex="0" aria-label="Exact interval equation, horizontally scrollable by keyboard"><span[^>]*><span class="math-tex-block"/);
    expect(html).toContain("katex");
    expect(html).toContain("no official score or global LRC");
  });
  it("renders Vietnamese text, not anotherlanguage's fallback",()=>{
    const html=renderToStaticMarkup(createElement(LrcDemo,{raw:retained,locale:"vi"}));
    expect(html).toContain("Xem một khoảng");
    expect(html).toContain("14 người chạy");
    expect(html).not.toContain("Inspecter");
  });
});
