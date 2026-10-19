import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { beforeAll, describe, expect, it } from "vitest";
import { inertCanonicalJson, inertDigest, inertDirectionPacket } from "../../scripts/operations/inert-direction";

const path = resolve("scripts/operations/inert-direction-replay.py");
const source = readFileSync(path, "utf8");
const sourceDigest = createHash("sha256").update(source).digest("hex");
type Packet = ReturnType<typeof inertDirectionPacket>;

// Trusted test-only snippets; no arbitrary caller code/model/receipt authority.
function python(snippet: string, input = "") {
  const program = `ns={"__name__":"independent_test"}\nexec(compile(${JSON.stringify(source)},"verified-local-source","exec"),ns)\n${snippet}`;
  const child = spawnSync("python3", ["-I", "-S", "-B", "-c", program], {
    input, encoding: "utf8", timeout: 60_000, maxBuffer: 8_388_608,
    env: { PATH: process.env.PATH ?? "/usr/bin:/bin", NODE_ENV: "test" },
  });
  if (child.error) throw child.error;
  return { code: child.status, value: child.stdout.trim() ? JSON.parse(child.stdout) : null, stderr: child.stderr };
}
const dump = "import json;print(json.dumps(result,separators=(',',':')))";
let replay: Packet;
let primary: Packet;

describe("TIP043 independent root-coupled inert direction", () => {
  beforeAll(() => {
    primary = inertDirectionPacket();
    const child = python(`result=ns['packet']()\n${dump}`);
    expect(child.code, child.stderr).toBe(0);
    replay = child.value;
  }, 30_000);

  it("completes all180 method rows and compares exact fresh semantics, not just summaries", () => {
    expect(sourceDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(replay.status).toBe("COMPLETE");
    expect(replay.rows).toHaveLength(180);
    for (const key of ["method", "inputs", "policy", "scope", "rows", "summary", "rowsDigest", "contentDigest"] as const) {
      expect(inertCanonicalJson(replay[key]), key).toBe(inertCanonicalJson(primary[key]));
    }
    expect(Number(replay.runtime.work)).toBeLessThanOrEqual(replay.limits.maxWork);
    expect(Number(replay.runtime.stateInsertions)).toBeLessThanOrEqual(replay.limits.maxStateInsertions);
    expect(replay.runtime.elapsedMs).toBeLessThan(replay.limits.seconds * 1000);
    expect(Number(replay.runtime.outputBytes)).toBe(Buffer.byteLength(inertCanonicalJson(replay)));
  });

  it("keeps fixed inputs inert and rejects fabricated or nonfinite input authority", () => {
    for (const input of ['{"roots":["17"]}', '{"limits":{"seconds":NaN}}', '{"limits":{"maxWork":50000001}}', '{"limits":{"maxRows":0}}', '{"limits":{"maxOutputBytes":4095}}']) {
      const child = python("ns['main']()", input);
      expect(child.code).toBe(1);
      expect(child.value.status).toBe("UNAVAILABLE");
    }
  });

  it("abstract controls include no inert, inverse directions, order2 tie and d below index", () => {
    const child = python(`cases=[(7,[(2,1)]),(7,[(3,1),(5,2)]),(7,[(2,1),(13,1)]),(31,[(2,2),(29,1)])]\nresult=[]\nfor h,fs in cases:\n g=ns['analyze_group'](h,fs,ns['Budget']());result.append({k:g[k] for k in ['decision','directions','d','E','L','splitPaid']})\n${dump}`);
    expect(child.value[0].decision).toBe("NO_INERT_LOCAL_MISS");
    expect(child.value[1].directions).toEqual([[0, 1], [1, -1]]);
    expect(child.value[1].decision).toBe("COHERENT_PAID_SPLIT_HIT");
    expect(child.value[2].d).toBe(2);
    expect(child.value[2].directions).toEqual([[1, 1]]);
    expect(child.value[3].d).toBe(2);
    expect((31 - 1) / child.value[3].L.length).toBe(6);
  });

  it("abstract short threshold and positive-character hit do not confuse span or preference", () => {
    const child = python(`result=[]\nfor fs in [[(17,1)],[(3,3)],[(3,4)]]:\n g=ns['analyze_group'](7,fs,ns['Budget']());result.append({k:g[k] for k in ['decision','d','E','rawVector']})\n${dump}`);
    expect(child.value[0]).toMatchObject({ decision: "COHERENT_SHORT_LOCAL_MISS", d: 6, E: 1 });
    expect(child.value[1]).toMatchObject({ decision: "COHERENT_PAID_SPLIT_HIT", d: 6, E: 3 });
    expect(child.value[2]).toMatchObject({ decision: "COHERENT_PAID_SPLIT_HIT", E: 4 });
    // E even gives positive total character, yet the legal signed exponent3 hits.
    expect(child.value[2].rawVector).toEqual([3]);
  });

  it("abstract unpaid span is unknown, can miss OR hit, paid coverage repairs the lift", () => {
    const child = python(`result=[]\nfor fs in [[(2,1),(3,3)],[(2,2),(3,3)],[(2,1),(3,9)]]:\n g=ns['analyze_group'](31,fs,ns['Budget']())\n # Abstract-only truth is permitted before campaign chronology checkpoint.\n ds=ns['divisors'](fs,ns['Budget']());T=1\n for q,e in fs:T*=q**e\n hit=any(__import__('math').gcd(u,v)==1 and T%(u*v)==0 and (u+v)%31==0 for u,_ in ds for v,_ in ds)\n result.append({'decision':g['decision'],'paid':g['splitPaid'],'hit':hit})\n${dump}`);
    expect(child.value).toEqual([
      { decision: "COHERENT_UNPAID_UNDETERMINED", paid: false, hit: false },
      { decision: "COHERENT_PAID_SPLIT_HIT", paid: true, hit: true },
      { decision: "COHERENT_UNPAID_UNDETERMINED", paid: false, hit: true },
    ]);
  });

  it("guards before exceeding positive state/work caps at every direct entrypoint", () => {
    const child = python(`result=[]\nfor key in ['maxStateInsertions','maxWork']:\n p=ns['packet']({key:1});result.append(p)\nfor method in ['state','step']:\n b=ns['Budget']({'maxStateInsertions':1,'maxWork':1});getattr(b,method)()\n try:getattr(b,method)()\n except ns['Stop']:pass\n assert b.states<=1 and b.work<=1\n for bad in [0,-1,1.5,float('nan'),True]:\n  try:getattr(b,method)(bad);raise AssertionError('accepted invalid count')\n  except ValueError:pass\n${dump}`);
    expect(child.value[0]).toMatchObject({ status: "PARTIAL", reason: "STATE_LIMIT", rows: [], pending: { phase: "ROW", index: "0" } });
    expect(child.value[1]).toMatchObject({ status: "PARTIAL", reason: "WORK_LIMIT", rows: [], pending: { phase: "ROW", index: "0" } });
  });

  it("row/output tightening preserves atomic prefix and all original declarations", () => {
    const child = python(`result=[ns['packet']({'maxRows':1}),ns['packet']({'maxRows':4,'maxOutputBytes':4096})]\n${dump}`);
    expect(child.value[0]).toMatchObject({ status: "PARTIAL", reason: "ROW_LIMIT", pending: { phase: "ROW", index: "1" }, limits: { maxRows: 1 } });
    expect(child.value[0].rows).toHaveLength(1);
    expect(child.value[1].status).toBe("PARTIAL");
    expect(child.value[1].reason).toBe("OUTPUT_LIMIT");
    expect(child.value[1].limits).toMatchObject({ maxRows: 4, maxOutputBytes: 4096 });
    expect(child.value[1].rows.length).toBeLessThan(4);
    expect(Number(child.value[1].runtime.outputBytes)).toBeLessThanOrEqual(4096);
    expect(Number(child.value[1].runtime.outputBytes)).toBe(Buffer.byteLength(inertCanonicalJson(child.value[1])));
    expect(child.value[1].pending.index).toBe(String(child.value[1].rows.length));
    expect(child.value[1].rowsDigest).toBe(inertDigest(child.value[1].rows));
    expect(child.value[1].contentDigest).toBe(inertDigest(Object.fromEntries(
      ["method", "inputs", "policy", "scope", "rows", "summary"].map((key) => [key, child.value[1][key]]),
    )));
  });

  it("first/internal/midpoint/last/finalization timeouts retain exact prefix and pending", () => {
    const child = python(`result=[]\nfor at in [0,70,179,180]:\n class Inject(ns['Budget']):\n  def check(self):\n   index=int(self.pending.get('index',180))\n   if index==at:raise ns['Stop']('TIME_LIMIT',self.pending)\n   super().check()\n result.append(ns['packet'](budget_factory=Inject))\n${dump}`);
    for (const [i, prefix] of [0, 70, 179, 180].entries()) {
      expect(child.value[i]).toMatchObject({ status: "PARTIAL", reason: "TIME_LIMIT" });
      expect(child.value[i].rows).toHaveLength(prefix);
      if (prefix === 180) expect(child.value[i].pending).toEqual({ phase: "FINALIZE" });
      else expect(child.value[i].pending.index).toBe(String(prefix));
    }
  }, 30_000);

  it("serialization late expiry respects actual tighter deadline, not default60seconds", () => {
    const child = python(`clock=[0.0];original=ns['canonical'];expired=[False]\ndef late(value):\n text=original(value)\n if isinstance(value,dict) and value.get('status')=='COMPLETE' and len(value.get('rows',[]))==180 and value.get('runtime'):\n  clock[0]=0.1;expired[0]=True\n return text\nns['canonical']=late\nresult=ns['packet']({'seconds':0.1},clock=lambda:clock[0])\nassert expired[0]\n${dump}`);
    expect(child.value.status).toBe("PARTIAL");
    expect(child.value.reason).toBe("TIME_LIMIT");
    expect(child.value.pending).toEqual({ phase: "FINALIZE" });
    expect(child.value.rows).toHaveLength(180);
    expect(child.value.runtime.elapsedMs).toBeGreaterThanOrEqual(100);
  }, 30_000);

  it("CLI final elapsed and bounded synthetic investigation retain fail-closed provenance", () => {
    const child = python(`original=ns['canonical'];clock=[0.0]\nns['time'].monotonic=lambda:clock[0]\ndef late(value):\n text=original(value)\n if isinstance(value,dict) and value.get('status')=='COMPLETE' and value.get('runtime'):\n  clock[0]=31.0\n return text\nns['canonical']=late\nns['main']()`, '{"limits":{"seconds":30}}');
    expect(child.code, child.stderr).toBe(0);
    expect(child.value.status).toBe("PARTIAL");
    expect(child.value.reason).toBe("TIME_LIMIT");
    const diagnostic = python(`original=ns['assert_candidate']\ndef bad(row):\n before=ns['canonical'](row)\n row['decision']='COHERENT_PAID_SPLIT_HIT';row['witness']=None\n assert ns['canonical'](row)!=before\n row['rowDigest']=ns['digest']({k:v for k,v in row.items() if k!='rowDigest'})\n original(row)\nns['assert_candidate']=bad\nns['main']()`);
    expect(diagnostic.code).toBe(1);
    expect(diagnostic.value.status).toBe("INVESTIGATION");
    expect(diagnostic.value.row.id).toBe("P0_h3");
  }, 30_000);

  it("fresh semantic equality detects effective scientific forgeries, no scoped-only PASS", () => {
    const mutations = [
      (p: Packet) => { p.rows[0].characters[0].rootCharacter = p.rows[0].characters[0].rootCharacter === "+1" ? "-1" : "+1"; },
      (p: Packet) => { p.rows[0].L = [...p.rows[0].L, "999"]; },
      (p: Packet) => { p.rows[0].splitImage[0].u = "2"; },
      (p: Packet) => { p.rows[0].splitPaid = !p.rows[0].splitPaid; },
      (p: Packet) => { p.rows[0].E = String(Number(p.rows[0].E) + 1); },
    ];
    for (const mutate of mutations) {
      const copy = structuredClone(primary);
      const before = inertCanonicalJson(copy.rows);
      mutate(copy);
      expect(inertCanonicalJson(copy.rows)).not.toBe(before);
      expect(inertCanonicalJson(copy.rows)).not.toBe(inertCanonicalJson(replay.rows));
    }
  });

  it("retrospective truth is checkpoint gated and independently checks ALL180 diagnoses and40 strict witnesses", () => {
    // Main opened all-row A/B agreement at2026-10-02T02:58:19.974Z.
    const child = python(`p=ns['packet']()\ntry:ns['retrospective_truth'](p);raise AssertionError('missing gate accepted')\nexcept ValueError as e:assert str(e)=='MAIN_CHRONOLOGY_CHECKPOINT_REQUIRED'\nresult=ns['retrospective_truth'](p,True)\n${dump}`);
    expect(child.value.status).toBe("COMPLETE");
    expect(child.value.rows).toHaveLength(180);
    expect(child.value.counts).toEqual({
      NO_INERT_LOCAL_MISS: { hit: "0", miss: "61" },
      COHERENT_SHORT_LOCAL_MISS: { hit: "0", miss: "8" },
      COHERENT_PAID_SPLIT_HIT: { hit: "40", miss: "0" },
      COHERENT_UNPAID_UNDETERMINED: { hit: "33", miss: "35" },
      INCOHERENT_UNDETERMINED: { hit: "1", miss: "2" },
    });
    expect(child.value.rows.filter((r: { witnessChecked: boolean }) => r.witnessChecked)).toHaveLength(40);
    expect(Number(child.value.runtime.outputBytes)).toBe(Buffer.byteLength(JSON.stringify(child.value)));
  }, 30_000);

  it("retrospective row/work/late-output resource faults preserve actual lower envelope without PASS", () => {
    const child = python(`p=ns['packet']();result=[]\nfor caps in [{'maxRows':1},{'maxWork':1},{'maxOutputBytes':4096}]:result.append(ns['retrospective_truth'](p,True,tighter=caps))\nclock=[0.0];original=ns['canonical']\ndef late(value):\n text=original(value)\n if isinstance(value,dict) and value.get('phase')=='RETROSPECTIVE_AFTER_MAIN_AGREEMENT' and value.get('status')=='COMPLETE':clock[0]=0.1\n return text\nns['canonical']=late\nresult.append(ns['retrospective_truth'](p,True,clock=lambda:clock[0],tighter={'seconds':0.1}))\n${dump}`);
    expect(child.value[0]).toMatchObject({ status: "PARTIAL", reason: "ROW_LIMIT", limits: { maxRows: 1 }, pending: { index: "1" } });
    expect(child.value[0].rows).toHaveLength(1);
    expect(child.value[1]).toMatchObject({ status: "PARTIAL", reason: "WORK_LIMIT", limits: { maxWork: 1 }, rows: [] });
    expect(child.value[2]).toMatchObject({ status: "PARTIAL", reason: "OUTPUT_LIMIT", limits: { maxOutputBytes: 4096 } });
    expect(Number(child.value[2].runtime.outputBytes)).toBeLessThanOrEqual(4096);
    expect(child.value[3]).toMatchObject({ status: "PARTIAL", reason: "TIME_LIMIT", pending: { phase: "FINALIZE" }, limits: { seconds: 0.1 } });
    expect(child.value[3].rows).toHaveLength(180);
    expect(child.value[3].runtime.elapsedMs).toBeGreaterThanOrEqual(100);
  }, 30_000);
});
