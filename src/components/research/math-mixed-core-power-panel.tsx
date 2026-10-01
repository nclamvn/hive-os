import { MathText } from "./math-text";
import type { MixedCorePowerEvidence } from "@/modules/research-sandbox/math-mixed-core-power";

/** Retained ledger data only; no standalone producer, filesystem or replay. */
export function MathMixedCorePowerPanel({ evidence, vi }: { evidence: MixedCorePowerEvidence; vi: boolean }) {
  const packet = evidence.replay.status === "PASS" ? evidence.packet : null;
  return <section className="border-line mt-3 border-t pt-3" aria-label={vi ? "Power-core được lưu V3" : "Retained power-core V3"}>
    <p className="text-ink font-medium">{vi ? "Bổ sung prime-power V3" : "V3 prime-power supplement"} · {evidence.replay.status}</p>
    {!packet ? <p className="mt-2">{vi ? "Phát lại chưa đạt PASS; vòng agent phải dừng tại INTEGRITY_FAILURE. Không có chứng cứ hoàn tất được nghiệm thu." : "Replay is not PASS; the agent cycle must stop at INTEGRITY_FAILURE. No completed evidence is accepted."} · {evidence.failure}</p> : <>
      <p className="mt-2"><MathText text={vi ? "Đúng 4 mục tiêu cố định; toàn bộ họ chuẩn hóa $m=2^a\\ell^b$, $a\\ge1$, $b\\ge2$, $\\ell$ là nguyên tố lẻ; không đặt trần $s$ tùy ý." : "Exactly four fixed targets; the full normalized family $m=2^a\\ell^b$, $a\\ge1$, $b\\ge2$, with odd prime $\\ell$; no arbitrary $s$ ceiling."} /></p>
      <p className="mt-2"><MathText text={vi ? "Cận đuôi viết tay với $B=2^a$, $q=\\ell^b$: $\\min R\\ge\\max(3B-1,\\lceil4Bq/(B+1)\\rceil-1)$; do đó $B\\le(p+1)/3$ và $q\\le\\lfloor(p+1)(B+1)/(4B)\\rfloor$. Không áp dụng cho $q$ có nhiều thừa số nguyên tố lẻ." : "Written tail bound for $B=2^a$, $q=\\ell^b$: $\\min R\\ge\\max(3B-1,\\lceil4Bq/(B+1)\\rceil-1)$; hence $B\\le(p+1)/3$ and $q\\le\\lfloor(p+1)(B+1)/(4B)\\rfloor$. Not valid for arbitrary odd composite split support."} /></p>
      <p className="mt-2">{packet.targets.reduce((sum, t) => sum + t.checkedCores, 0).toLocaleString()} {vi ? "core đã kiểm" : "cores checked"} · {packet.targets.reduce((sum, t) => sum + t.signedPairSlots, 0).toLocaleString()} {vi ? "vị trí cặp có dấu" : "signed-pair slots"} · 5 {vi ? "core đánh trúng / đại diện chuẩn, không phải mọi nghiệm" : "hit cores / canonical representatives, not all solutions"}</p>
      <ul className="mt-2 space-y-3">{packet.targets.map((target) => <li key={target.p}>
        <MathText text={`$p=${target.p}$: $a\\le${target.maxA}$, $q\\le${target.globalOddPowerBound}$; ${target.checkedCores}/${target.plannedCores} ${vi ? "core" : "cores"}; ${target.coreWitnessCount} ${vi ? "đánh trúng" : "hits"}, ${target.translatedOnlyCoreCount} ${vi ? "chỉ khối dịch" : "translated-only"}.`} />
        {target.coreWitnesses.map((core) => <div key={core.m} className="mt-1 min-w-0 break-words">
          <MathText text={`$m=${core.m}$, $s=${core.s}$, $(a,b,\\ell)=(${core.a},${core.b},${core.ell})$${core.translatedOnly ? ` · ${vi ? "chỉ khối dịch" : "translated-only"}` : ""}: $(x,y,z)=(${core.witness.x},${core.witness.y},${core.witness.z})$.`} />
          <p className="mt-1 break-all">Strict SHA-256: {core.strictDigest}</p>
        </div>)}
      </li>)}</ul>
      <p className="mt-2"><MathText text={vi ? "Không đánh trúng $p=159727681$ trong họ $b\\ge2$ KHÔNG loại trừ bài toán gốc: baseline V1 được phát lại có nghiệm $m=284$, $s=1135$, $A=4$, $U=71$ ($b=1$)." : "No hit for $p=159727681$ in the $b\\ge2$ family does NOT exclude the root: the replayed V1 baseline retains the $m=284$, $s=1135$, $A=4$, $U=71$ rescue ($b=1$)."} /></p>
      <p className="mt-2"><MathText text={vi ? "Tham chiếu nghiên cứu trước: $q=99$, $m=198$, $s=791$, $A=3$, $U=11$ KHÔNG được phát lại/lưu như witness power V3; cần kiểm scoped mới trước khi sử dụng. $q=15$, $p=19$ là phản kiểm phạm vi, không phải hàng của packet G." : "Separate prior-research reference: $q=99$, $m=198$, $s=791$, $A=3$, $U=11$ is NOT replayed/retained as a V3 power witness; a fresh scoped check is required before use. $q=15$, $p=19$ is a scope countercontrol, not a G packet row."} /></p>
      <p className="mt-2">{vi ? "Hai core chỉ khối dịch có b=3. Không tuyên bố phủ mục tiêu gốc mới, chứng minh hình thức hoặc tính mới. Chứng cứ này đã được lưu trước planner; file G độc lập không tự nâng cấp lịch sử V1/V2." : "Two translated-only cores have b=3. No claim of new root coverage, formal proof or novelty. This evidence was retained before planning; standalone G files do not upgrade V1/V2 history."}</p>
    </>}
    <dl className="mt-2 space-y-1 break-all">
      <div><dt className="inline">Expected G packet SHA-256: </dt><dd className="inline">{evidence.expectedPacketDigest}</dd></div>
      <div><dt className="inline">Actual G packet SHA-256: </dt><dd className="inline">{evidence.replay.primaryDigest ?? "n/a"}</dd></div>
      <div><dt className="inline">Actual checker SHA-256: </dt><dd className="inline">{evidence.checkerDigest ?? "n/a"}</dd></div>
      <div><dt className="inline">Expected Python SHA-256: </dt><dd className="inline">{evidence.replay.expectedScriptDigest}</dd></div>
      <div><dt className="inline">Actual Python SHA-256: </dt><dd className="inline">{evidence.replay.scriptDigest ?? "n/a"}</dd></div>
      <div><dt className="inline">Actual output SHA-256: </dt><dd className="inline">{evidence.replay.outputDigest ?? "n/a"}</dd></div>
    </dl>
  </section>;
}
