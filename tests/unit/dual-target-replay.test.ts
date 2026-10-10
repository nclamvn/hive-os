import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { beforeAll, describe, expect, it } from "vitest";
import { dualCanonicalJson, dualDigest, dualTargetPacket, type DualPacket } from "../../scripts/operations/dual-target";

const source = readFileSync(resolve("scripts/operations/dual-target-replay.py"), "utf8");
const sourceDigest = createHash("sha256").update(source).digest("hex");

// Only trusted local tests supply snippets; CLI accepts inert tighter limits,
// never model code, arbitrary roots, receipts, paths or provider inputs.
function python(snippet: string, input = "") {
  const program = `ns={"__name__":"independent_test"}\nexec(compile(${JSON.stringify(source)},"verified-local-source","exec"),ns)\n${snippet}`;
  const child = spawnSync("python3", ["-I", "-S", "-B", "-c", program], {
    input, encoding: "utf8", timeout: 30_000, maxBuffer: 1_048_576,
    env: { PATH: process.env.PATH ?? "/usr/bin:/bin", NODE_ENV: "test" },
  });
  if (child.error) throw child.error;
  return { code: child.status, value: child.stdout.trim() ? JSON.parse(child.stdout) : null, stderr: child.stderr };
}
const dump = "import json;print(json.dumps(result,separators=(',',':')))";
let replay: DualPacket;
let primary: DualPacket;

function reseal(packet: DualPacket) {
  for (const row of packet.rows) {
    const { rowDigest: ignored, ...body } = row;
    void ignored;
    row.rowDigest = dualDigest(body);
  }
  packet.rowsDigest = dualDigest(packet.rows);
  packet.contentDigest = dualDigest(Object.fromEntries(
    ["method", "inputs", "policy", "scope", "rows", "summary"].map((key) => [key, packet[key as keyof DualPacket]]),
  ));
  packet.runtime.outputBytes = "0";
  for (let i = 0; i < 12; i++) {
    const bytes = String(Buffer.byteLength(dualCanonicalJson(packet)));
    if (packet.runtime.outputBytes === bytes) return;
    packet.runtime.outputBytes = bytes;
  }
  throw new Error("test reseal failed");
}

describe("TIP045 independent paired-target replay", () => {
  beforeAll(() => {
    primary = dualTargetPacket();
    const child = python(`result=ns['packet']()\n${dump}`);
    expect(child.code, child.stderr).toBe(0);
    replay = child.value;
  }, 30_000);

  it("actual isolated fixed CLI completes all6 exact scientific rows", () => {
    const actual = python("ns['main']()");
    expect(actual.code, actual.stderr).toBe(0);
    expect(actual.value.status).toBe("COMPLETE");
    expect(sourceDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(replay.rows).toHaveLength(6);
    for (const key of ["method", "inputs", "policy", "scope", "rows", "summary", "rowsDigest", "contentDigest"] as const) {
      expect(dualCanonicalJson(replay[key]), key).toBe(dualCanonicalJson(primary[key]));
      expect(dualCanonicalJson(actual.value[key]), `CLI ${key}`).toBe(dualCanonicalJson(primary[key]));
    }
    expect(replay.runtime.elapsedMs).toBeLessThan(30_000);
    expect(Number(replay.runtime.work)).toBeLessThanOrEqual(5_000_000);
    expect(Number(replay.runtime.stateInsertions)).toBeLessThanOrEqual(100_000);
    expect(Number(replay.runtime.outputBytes)).toBe(Buffer.byteLength(dualCanonicalJson(replay)));
    expect(Number(actual.value.runtime.outputBytes)).toBe(Buffer.byteLength(dualCanonicalJson(actual.value)));
  });

  it("normalizes actual quarter-order TypeI support without TypeII inversion", () => {
    const r = replay.rows[5];
    expect(r.typeI.target).toBe("17");
    expect(r.typeI.inverseTarget).toBe("11");
    expect(r.typeI.correction).toMatchObject({ coordinate: "UNSIGNED_NORM", residue: "2" });
    expect(r.typeI.witness).toMatchObject({ m: "54", a: "3", d: "6", c: "2", v: "7", b: "11",
      normExponents: ["1", "3"], signedExponents: ["-1", "1"], alpha: ["0", "1"], delta: ["1", "1"],
      x: "36", y: "132", z: "22374" });
    expect(r.typeII.verdict).toBe("LOCAL_MISS");
    expect(replay.rows[4].typeI.verdict).toBe("UNKNOWN");
    expect(replay.rows[4].typeII.verdict).toBe("UNKNOWN");
  });

  it("abstract balanced mass and outside4 distinguish projection from quarter total mass", () => {
    const child = python(`result=[]\nfor h,fs in [(31,[(2,2),(3,1),(21,1)]),(7,[(6,1)]),(7,[(2,1)])]:\n r=ns['analyze_group'](h,fs,ns['Budget']());result.append(r)\n${dump}`);
    const balanced = child.value[0];
    expect(balanced).toMatchObject({ coherent: true, d: "6", Eplus: "1", Eminus: "1" });
    expect(balanced.typeI).toMatchObject({ verdict: "LOCAL_MISS", reason: "PROJECTION_MISS" });
    expect(child.value[1].typeI).toMatchObject({ verdict: "LOCAL_MISS", reason: "FOUR_OUTSIDE" });
    expect(child.value[1].typeII.verdict).toBe("HIT");
    expect(child.value[2].typeI.reason).toBe("NO_INERT");
  });

  it("actual state/work/row/output/time stops retain honest declared limits and atomic prefix", () => {
    const child = python(`result=[]\nfor caps in [{'maxStateInsertions':1},{'maxWork':1},{'maxRows':1},{'maxRows':4,'maxOutputBytes':4096},{'seconds':1e-12}]:result.append(ns['packet'](caps))\n${dump}`);
    const reasons = ["STATE_LIMIT", "WORK_LIMIT", "ROW_LIMIT", "OUTPUT_LIMIT", "TIME_LIMIT"];
    for (const [i, reason] of reasons.entries()) {
      expect(child.value[i].status).toBe("PARTIAL");
      expect(child.value[i].reason).toBe(reason);
      expect(child.value[i].pending.phase).toBe("ROW");
      expect(child.value[i].pending.index).toBe(String(child.value[i].rows.length));
      expect(Number(child.value[i].runtime.outputBytes)).toBeLessThanOrEqual(child.value[i].limits.maxOutputBytes);
      expect(Number(child.value[i].runtime.outputBytes)).toBe(Buffer.byteLength(dualCanonicalJson(child.value[i])));
      expect(child.value[i].rowsDigest).toBe(dualDigest(child.value[i].rows));
    }
    expect(child.value[2].rows).toHaveLength(1);
    expect(child.value[3].rows.length).toBeLessThan(4);
  }, 30_000);

  it("rejects nonfinite/widened limits, fabricated inputs and invalid actual root domains", () => {
    for (const input of ['{"roots":["17"]}', '{"limits":{"seconds":NaN}}', '{"limits":{"maxWork":5000001}}', '{"limits":{"maxRows":0}}', '{"limits":{"maxOutputBytes":4095}}']) {
      const child = python("ns['main']()", input);
      expect(child.code).toBe(1);
      expect(child.value.status).toBe("UNAVAILABLE");
    }
    const child = python(`result=[]\nfor p,h in [(15,7),(13,5),(13,19),(201000001,7)]:\n try:ns['row'](p,h,0,ns['Budget']());result.append(False)\n except ValueError:result.append(True)\n${dump}`);
    expect(child.value).toEqual([true, true, true, true]);
  });

  it("all5 tighter real CLI stops exit1 with bounded PARTIAL JSON, never exit0 COMPLETE", () => {
    const caps = [{ maxStateInsertions: 1 }, { maxWork: 1 }, { maxRows: 1 }, { maxRows: 4, maxOutputBytes: 4096 }, { seconds: 1e-12 }];
    for (const [i, cap] of caps.entries()) {
      const child = python("ns['main']()", JSON.stringify({ limits: cap }));
      expect(child.code, child.stderr).toBe(1);
      expect(child.value.status).toBe("PARTIAL");
      expect(child.value.reason).toBe(["STATE_LIMIT", "WORK_LIMIT", "ROW_LIMIT", "OUTPUT_LIMIT", "TIME_LIMIT"][i]);
      expect(child.value.limits).toMatchObject(cap);
      expect(Number(child.value.runtime.outputBytes)).toBeLessThanOrEqual(child.value.limits.maxOutputBytes);
      if (child.value.reason === "TIME_LIMIT") expect(child.value.runtime.elapsedMs).toBeGreaterThanOrEqual(child.value.limits.seconds * 1000);
    }
  });

  it("finite monotonic clocks and positive per-operation counters cannot bypass limits", () => {
    const child = python(`result=[]\nfor clock in [lambda:float('nan'),lambda:float('inf')]:\n try:ns['packet'](clock=clock);result.append(False)\n except ValueError:result.append(True)\nclock=iter([1.0,0.0]);\ntry:ns['packet'](clock=lambda:next(clock));result.append(False)\nexcept ValueError:result.append(True)\nfor method in ['step','state']:\n b=ns['Budget']({'maxWork':1,'maxStateInsertions':1});getattr(b,method)()\n try:getattr(b,method)();raise AssertionError('cap exceeded')\n except ns['Stop']:pass\n assert b.work<=1 and b.states<=1\n for bad in [0,-1,True,float('nan'),1.5]:\n  try:getattr(b,method)(bad);raise AssertionError('bad count')\n  except ValueError:pass\n${dump}`);
    expect(child.value).toEqual([true, true, true]);
  });

  it("first/internal/finalrow/finalize timeout keeps exact pending input and completed prefix", () => {
    const child = python(`result=[]\nfor at in [0,3,5,6]:\n class Inject(ns['Budget']):\n  def check(self):\n   if int(self.pending.get('index','6'))==at:raise ns['Stop']('TIME_LIMIT',self.pending)\n   super().check()\n result.append(ns['packet'](budget_factory=Inject))\n${dump}`);
    for (const [i, prefix] of [0, 3, 5, 6].entries()) {
      expect(child.value[i]).toMatchObject({ status: "PARTIAL", reason: "TIME_LIMIT" });
      expect(child.value[i].rows).toHaveLength(prefix);
      if (prefix === 6) expect(child.value[i].pending).toEqual({ phase: "FINALIZE" });
      else expect(child.value[i].pending).toEqual({ phase: "ROW", index: String(prefix), p: primary.inputs.controls[prefix].p, h: primary.inputs.controls[prefix].h });
    }
  });

  it("late serialization honors tighter deadline and final byte count, not default30s", () => {
    const child = python(`clock=[0.0];original=ns['canonical'];expired=[False]\ndef late(value):\n text=original(value)\n if isinstance(value,dict) and value.get('status')=='COMPLETE' and value.get('runtime'):clock[0]=0.1;expired[0]=True\n return text\nns['canonical']=late\nresult=ns['packet']({'seconds':0.1},clock=lambda:clock[0])\nassert expired[0]\n${dump}`);
    expect(child.value).toMatchObject({ status: "PARTIAL", reason: "TIME_LIMIT", pending: { phase: "FINALIZE" }, limits: { seconds: 0.1 } });
    expect(child.value.rows).toHaveLength(6);
    expect(child.value.runtime.elapsedMs).toBeGreaterThanOrEqual(100);
    expect(Number(child.value.runtime.outputBytes)).toBe(Buffer.byteLength(dualCanonicalJson(child.value)));
  });

  it("actual CLI late serialization downgrades COMPLETE and exits1 under its applied deadline", () => {
    const child = python(`clock=[0.0];original=ns['canonical'];ns['time'].monotonic=lambda:clock[0]\ndef late(value):\n text=original(value)\n if isinstance(value,dict) and value.get('status')=='COMPLETE' and value.get('runtime'):clock[0]=0.1\n return text\nns['canonical']=late\nns['main']()`, '{"limits":{"seconds":0.1}}');
    expect(child.code).toBe(1);
    expect(child.value).toMatchObject({ status: "PARTIAL", reason: "TIME_LIMIT", pending: { phase: "FINALIZE" }, limits: { seconds: 0.1 } });
    expect(Number(child.value.runtime.outputBytes)).toBe(Buffer.byteLength(dualCanonicalJson(child.value)));
  });

  it("post-row contradiction retains bounded synthetic investigation, never normal COMPLETE", () => {
    const child = python(`original=ns['assert_candidate']\ndef bad(row):\n row['typeI']['verdict']='HIT';row['typeI']['witness']=None\n row['rowDigest']=ns['digest']({k:v for k,v in row.items() if k!='rowDigest'})\n original(row)\nns['assert_candidate']=bad\nns['main']()`);
    expect(child.code).toBe(1);
    expect(child.value.status).toBe("INVESTIGATION");
    expect(child.value.row.id).toBe("C0");
  });

  it("atleast10 EFFECTIVE fully rehashed semantic forgeries fail freshly executed source comparison", () => {
    const mutations: Array<(p: DualPacket) => void> = [
      p => { p.rows[0].p = "17"; },
      p => { p.rows[0].h = "11"; },
      p => { p.rows[0].factors[0][1] = "2"; },
      p => { p.rows[0].characters[0].rootCharacter = "+1"; },
      p => { p.rows[3].splitNormImage[1].m = "4"; },
      p => { p.rows[3].splitRatioImage[1].u = "4"; },
      p => { p.rows[5].typeI.target = p.rows[5].typeI.inverseTarget; },
      p => { p.rows[5].typeI.projected = false; },
      p => { p.rows[5].typeI.correction!.residue = "16"; },
      p => { p.rows[5].typeI.witness!.normExponents[1] = "4"; },
      p => { p.rows[5].typeI.witness!.alpha[1] = "2"; },
      p => { p.rows[5].typeI.witness!.x = "37"; },
      p => { p.rows[4].coherent = true; },
      p => { p.rows.pop(); },
      p => { p.summary.typeI.HIT = "4"; },
    ];
    for (const mutation of mutations) {
      const forged = structuredClone(primary);
      const before = dualCanonicalJson(forged);
      mutation(forged);
      expect(dualCanonicalJson(forged)).not.toBe(before);
      reseal(forged);
      const fresh = python(`result=ns['packet']()\n${dump}`);
      expect(fresh.code).toBe(0);
      expect(forged.contentDigest).not.toBe(fresh.value.contentDigest);
      expect(dualCanonicalJson(Object.fromEntries(["method", "inputs", "policy", "scope", "rows", "summary"].map(k => [k, forged[k as keyof DualPacket]]))))
        .not.toBe(dualCanonicalJson(Object.fromEntries(["method", "inputs", "policy", "scope", "rows", "summary"].map(k => [k, fresh.value[k]]))));
    }
  }, 30_000);

  it("post-Main agreement truth independently checks six norm branches and coprime pairs", () => {
    // Main opened actual all-six scientific agreement 2026-10-03T02:12:16.413Z.
    // The bool is a local trusted chronology assertion, not sealed authorization.
    const child = python(`p=ns['packet']()\ntry:ns['retrospective_truth'](p);raise AssertionError('gate bypass')\nexcept ValueError as e:assert str(e)=='MAIN_CHRONOLOGY_CHECKPOINT_REQUIRED'\nresult=ns['retrospective_truth'](p,True)\n${dump}`);
    expect(child.value.status).toBe("COMPLETE");
    expect(child.value.rows).toHaveLength(6);
    expect(child.value.rows.map((r: { typeI: { hits: unknown[] }; typeII: { hits: unknown[] } }) => [r.typeI.hits.length, r.typeII.hits.length]))
      .toEqual([[1, 0], [0, 0], [0, 1], [1, 1], [1, 1], [1, 0]]);
    expect(child.value.rows[4].typeI).toMatchObject({ verdict: "UNKNOWN", hit: true });
    expect(child.value.rows[4].typeII).toMatchObject({ verdict: "UNKNOWN", hit: true });
    expect(child.value.rows.filter((r: { typeI: { witnessChecked: boolean } }) => r.typeI.witnessChecked)).toHaveLength(3);
    expect(child.value.rows.filter((r: { typeII: { witnessChecked: boolean } }) => r.typeII.witnessChecked)).toHaveLength(2);
  });

  it("post-gate ALL16896 fixed abstract profiles keep every HIT/MISS assertion correct", () => {
    const child = python(`try:ns['abstract_profiles']();raise AssertionError('gate bypass')\nexcept ValueError as e:assert str(e)=='MAIN_CHRONOLOGY_CHECKPOINT_REQUIRED'\nresult=ns['abstract_profiles'](True)\n${dump}`);
    expect(child.value.status).toBe("COMPLETE");
    expect(child.value.profiles).toBe("16896");
    for (const branch of ["typeI", "typeII"]) {
      expect(child.value.counts[branch].HIT.miss).toBe(0);
      expect(child.value.counts[branch].LOCAL_MISS.hit).toBe(0);
      const count = Object.values(child.value.counts[branch]).reduce((sum: number, value) => {
        const row = value as { hit: number; miss: number };
        return sum + row.hit + row.miss;
      }, 0);
      expect(count).toBe(16896);
    }
    expect(child.value.counts.typeI.UNKNOWN.hit).toBeGreaterThan(0);
    expect(child.value.counts.typeI.UNKNOWN.miss).toBeGreaterThan(0);
    expect(Number(child.value.runtime.stateInsertions)).toBeLessThanOrEqual(2_000_000);
    expect(Number(child.value.runtime.work)).toBeLessThanOrEqual(50_000_000);
    expect(child.value.runtime.elapsedMs).toBeLessThan(60_000);
    expect(Number(child.value.runtime.outputBytes)).toBeLessThanOrEqual(65_536);
  }, 30_000);

  it("truth/profile resource faults retain actual lower envelopes and atomic prefix without COMPLETE", () => {
    const child = python(`p=ns['packet']();result=[]\nfor caps in [{'maxRows':1},{'maxWork':1}]:result.append(ns['retrospective_truth'](p,True,tighter=caps))\nfor caps in [{'maxRows':1},{'maxWork':1},{'maxStateInsertions':1}]:result.append(ns['abstract_profiles'](True,tighter=caps))\nclock=[0.0];original=ns['canonical']\ndef late(value):\n text=original(value)\n if isinstance(value,dict) and value.get('phase')=='RETROSPECTIVE_AFTER_MAIN_AGREEMENT' and value.get('status')=='COMPLETE':clock[0]=0.1\n return text\nns['canonical']=late\nresult.append(ns['retrospective_truth'](p,True,tighter={'seconds':0.1},clock=lambda:clock[0]))\nclock[0]=0.0\ndef lateprofile(value):\n text=original(value)\n if isinstance(value,dict) and 'normImage' in value:clock[0]=0.1\n return text\nns['canonical']=lateprofile\nresult.append(ns['abstract_profiles'](True,tighter={'seconds':0.1},clock=lambda:clock[0]))\n${dump}`);
    expect(child.value[0]).toMatchObject({ status: "PARTIAL", reason: "ROW_LIMIT", limits: { maxRows: 1 }, pending: { index: "1" } });
    expect(child.value[0].rows).toHaveLength(1);
    expect(child.value[1]).toMatchObject({ status: "PARTIAL", reason: "WORK_LIMIT", rows: [], limits: { maxWork: 1 } });
    expect(child.value[2]).toMatchObject({ status: "PARTIAL", reason: "ROW_LIMIT", profiles: "1", pending: { index: "1" }, limits: { maxRows: 1 } });
    expect(child.value[3]).toMatchObject({ status: "PARTIAL", reason: "WORK_LIMIT", profiles: "0", limits: { maxWork: 1 } });
    expect(child.value[4]).toMatchObject({ status: "PARTIAL", reason: "STATE_LIMIT", profiles: "0", limits: { maxStateInsertions: 1 } });
    expect(child.value[5]).toMatchObject({ status: "PARTIAL", reason: "TIME_LIMIT", limits: { seconds: 0.1 }, pending: { phase: "FINALIZE" } });
    expect(child.value[6]).toMatchObject({ status: "PARTIAL", reason: "TIME_LIMIT", profiles: "0", pending: { phase: "PROFILE", index: "0" } });
    for (const branch of ["typeI", "typeII"]) for (const count of Object.values(child.value[6].counts[branch])) expect(count).toEqual({ hit: 0, miss: 0 });
  });
});
