"use client";

import {useState} from "react";
import {MathText} from "./math-text";
import {approximate,arcEndpoints,fractionLabel,readLrcDemo,shiftDistances} from "./lrc-demo-data";
import styles from "./lrc-demo.module.css";

const texFraction=(value:{n:bigint;d:bigint})=>`\\frac{${value.n}}{${value.d}}`;
export function LrcDemo({raw,locale}:{raw:unknown;locale:string}) {
  const [which,setWhich]=useState<14|15>(14);
  const [selected,setSelected]=useState(0);
  const [shift,setShift]=useState(0);
  const data=readLrcDemo(raw);
  const t=(vi:string,en:string)=>locale==="vi"?vi:en;
  if(!data)return <section role="alert" className={styles.unavailable}><h1>{t("Chưa có kết quả được chấp nhận","Accepted record unavailable")}</h1><p>{t("Hồ sơ lưu trữ bị thiếu, sai phạm vi hoặc chưa được phát lại độc lập. Không hiển thị trạng thái đạt.","The retained record is missing, outside scope or lacks accepted independent replay. No PASS is displayed.")}</p></section>;
  const arc=data.gw.cover[selected],speed=data.gw.speeds[arc.speedIndex];
  const endpoints=arcEndpoints(speed,arc.center);
  const shifted=shiftDistances(data.shift,shift);
  const good=shifted.runners.every(r=>r.good);
  const blocking=shifted.runners.find(r=>!r.good);
  const x=(value:number)=>70+value*790;
  return <article className={styles.atlas}>
    <header className={styles.header}>
      <p className={styles.retained}>{t("Phát lại độc lập OFFLINE · kết quả đã lưu","Retained OFFLINE independent replay")}</p>
      <h1>{t("Một chứng chỉ, hai hình học","One certificate, two geometries")}</h1>
      <p>{t("Xem khoảng thời gian phủ toàn chu kỳ, rồi xem bốn ngoại lệ chặn các phép dịch. Mọi điều khiển chỉ đổi cách trình bày.","Explore intervals that cover a whole period, then four exceptions that block the shifts. Every control changes the presentation only.")}</p>
    </header>
    <div className={styles.caseSwitch} role="group" aria-label={t("Chọn kết quả","Choose result")}>
      <button type="button" aria-pressed={which===14} onClick={()=>setWhich(14)}>{t("14 người chạy · phủ liên tục","14 runners · continuous cover")}</button>
      <button type="button" aria-pressed={which===15} onClick={()=>setWhich(15)}>{t("15 người chạy · năm phép dịch","15 runners · five shifts")}</button>
    </div>
    {which===14?<section aria-labelledby="gw-heading">
      <div className={styles.figureHeading}><div><h2 id="gw-heading">{t("Atlas khoảng đóng","Closed-interval atlas")}</h2><p>{t("13 vận tốc chuyển động: 1,…,11,13,24. Người chạy còn lại đứng yên.","13 moving speeds: 1,…,11,13,24. The remaining runner is stationary.")}</p></div><MathText text={"$\\max_t\\min_v\\|vt\\|=\\frac1{14}$"}/></div>
      <figure className={styles.figure}>
        <div className={styles.scrollFigure} tabIndex={0} aria-label={t("Đồ thị khoảng, cuộn ngang trên màn hình nhỏ","Interval diagram, horizontally scrollable on small screens")}>
          <svg viewBox="0 0 900 430" role="img" aria-labelledby="gw-title gw-description">
            <title id="gw-title">{t("59 khoảng chứng chỉ trên 13 hàng vận tốc","59 certificate intervals on 13 speed rows")}</title>
            <desc id="gw-description">{t("Mỗi thanh là khoảng đóng có khoảng cách không vượt quá 1/14. Đường đứt đánh dấu t=1/14. Tọa độ hình vẽ được làm tròn; xem đầu mút chính xác bên dưới.","Each bar is a closed interval with distance at most1/14. A dashed line marks t=1/14. Drawing coordinates are rounded; exact endpoints appear below.")}</desc>
            {Array.from({length:11},(_,i)=><g key={i}><line x1={x(i/10)} x2={x(i/10)} y1="28" y2="386" className={styles.grid}/><text x={x(i/10)} y="411" textAnchor="middle" className={styles.svgText}>{i===0?"0":i===10?"1":`${i}/10`}</text></g>)}
            {data.gw.speeds.map((v,row)=><g key={v}><text x="50" y={50+row*26} textAnchor="end" className={styles.svgText}>{v}</text><line x1="70" x2="860" y1={46+row*26} y2={46+row*26} className={styles.row}/></g>)}
            <text x="15" y="20" className={styles.svgText}>v</text>
            {data.gw.cover.map((item,index)=>{const bound=arcEndpoints(data.gw.speeds[item.speedIndex],item.center);return <rect key={`${item.speedIndex}:${item.center}`} x={x(approximate(bound.lower))} y={42+item.speedIndex*26} width={(approximate(bound.upper)-approximate(bound.lower))*790} height="8" className={index===selected?styles.selectedArc:styles.arc}><title>{`${index+1}: v=${data.gw.speeds[item.speedIndex]}, k=${item.center}, [${fractionLabel(bound.lower)}, ${fractionLabel(bound.upper)}]`}</title></rect>;})}
            <line x1={x(1/14)} x2={x(1/14)} y1="24" y2="386" className={styles.witness}/><text x={x(1/14)+7} y="21" className={styles.svgText}>t = 1/14</text>
          </svg>
        </div>
        <figcaption>{t("59 khoảng từ chứng chỉ đã lưu. Hình vẽ chỉ minh họa; phép hợp khoảng chính xác độc lập phủ [0,1].","59 retained interval facts. The drawing is illustrative; the independent exact union covers [0,1].")}</figcaption>
      </figure>
      <div className={styles.controls}>
        <label htmlFor="lrc-arc">{t("Xem một khoảng","Inspect an interval")}</label>
        <div className={styles.arcControls}><button type="button" disabled={selected===0} onClick={()=>setSelected(selected-1)} aria-label={t("Khoảng trước","Previous interval")}>←</button><select id="lrc-arc" value={selected} onChange={e=>setSelected(Number(e.target.value))}>{data.gw.cover.map((item,index)=><option key={index} value={index}>{`${index+1} / 59 · v=${data.gw.speeds[item.speedIndex]}, k=${item.center}`}</option>)}</select><button type="button" disabled={selected===58} onClick={()=>setSelected(selected+1)} aria-label={t("Khoảng tiếp","Next interval")}>→</button></div>
      </div>
      <div className={styles.exact} aria-live="polite"><div className={styles.mathScroll} role="region" tabIndex={0} aria-label={t("Công thức khoảng chính xác, cuộn ngang bằng bàn phím","Exact interval equation, horizontally scrollable by keyboard")}><MathText text={`$$t\\in\\left[${texFraction(endpoints.lower)},${texFraction(endpoints.upper)}\\right]\\quad\\Longrightarrow\\quad|${speed}t-${arc.center}|\\le\\frac1{14}$$`}/></div><p>{t("Các đầu mút được lấy: trường hợp bằng ngưỡng vẫn hợp lệ. Tại t=1/14, khoảng cách nhỏ nhất của cả 13 người chạy bằng đúng 1/14. Nhân chứng và chứng chỉ phủ toàn chu kỳ cùng xác lập giá trị tối ưu.","Endpoints are closed: equality is allowed. At t=1/14 the minimum of all13 distances is exactly1/14. The witness and whole-period cover together establish the optimal value.")}</p></div>
    </section>:<section aria-labelledby="shift-heading">
      <div className={styles.figureHeading}><div><h2 id="shift-heading">{t("Bốn trở ngại, một cửa sổ chung","Four obstacles, one common window")}</h2><p><MathText text={"$Q=10^{30},\\quad t_j=\\frac1{10Q}+\\frac j5$"}/></p></div><span className={good?styles.good:styles.bad} role="status">{good?t("j=4 · mọi khoảng cách đều đạt","j=4 · all distances are good"):t(`j=${shift} · bị chặn bởi ngoại lệ ${blocking!.index-10}`,`j=${shift} · blocked by exception ${blocking!.index-10}`)}</span></div>
      <div className={styles.shiftButtons} role="group" aria-label={t("Chọn phép dịch thời gian thực","Choose the physical shift")}>{[0,1,2,3,4].map(j=><button type="button" key={j} aria-pressed={shift===j} onClick={()=>setShift(j)}>j={j}<span className={j===4?styles.good:styles.bad}>{j===4?t("đạt","good"):t("bị chặn","blocked")}</span></button>)}</div>
      <figure className={styles.figure}><div className={styles.scrollFigure} tabIndex={0} aria-label={t("Khoảng cách của 14 người chạy, đồ thị cuộn ngang","Distances of all14 runners, scrollable diagram")}><svg viewBox="0 0 900 470" role="img" aria-labelledby="shift-title shift-desc">
        <title id="shift-title">{t("Khoảng cách chính xác của vận tốc gốc, tọa độ minh họa","Original exact distances, illustrative coordinates")}</title><desc id="shift-desc">{t("Mười khoảng cách đầu luôn bằng 1/2. Vùng tô màu nằm dưới ngưỡng 1/15. Độ lệch epsilon quá nhỏ để nhìn thấy ở tỉ lệ này.","The first ten distances stay at1/2. The shaded region lies below threshold1/15. Tiny epsilon offsets are not visible at this scale.")}</desc>
        <rect x="110" y="28" width={720*2/15} height="408" className={styles.badRegion}/><line x1={110+720*2/15} x2={110+720*2/15} y1="28" y2="436" className={styles.threshold}/>
        {shifted.runners.map(r=><g key={r.index}><text x="95" y={49+r.index*28} textAnchor="end" className={styles.svgText}>{r.index<10?`${5*(2*r.index+1)}Q`:`${[10,8,6,4][r.index-10]}Q+1`}</text><line x1="110" x2="830" y1={45+r.index*28} y2={45+r.index*28} className={styles.row}/><line x1="110" x2={110+approximate(r.distance)*1440} y1={45+r.index*28} y2={45+r.index*28} className={r.good?styles.distanceGood:styles.distanceBad}/><circle cx={110+approximate(r.distance)*1440} cy={45+r.index*28} r="4" className={r.good?styles.pointGood:styles.pointBad}/></g>)}
        <text x="110" y="458" className={styles.svgText}>0</text><text x={110+720*2/15} y="458" className={styles.svgText}>1/15</text><text x="830" y="458" textAnchor="end" className={styles.svgText}>1/2</text>
      </svg></div><figcaption>{t("Trạng thái được tính từ tích vận tốc gốc bằng BigInt trước khi lấy modulo 1. Tọa độ SVG làm tròn không phải bằng chứng kiểm chứng; ε=1/(10Q) được ghi bằng ký hiệu vì quá nhỏ để thấy trên hình.","Decisions use BigInt physical products before reduction modulo1. Rounded SVG coordinates verify nothing; ε=1/(10Q) remains symbolic on screen.")}</figcaption></figure>
      <div className={styles.exact} aria-live="polite"><div className={styles.mathScroll} role="region" tabIndex={0} aria-label={t("Thời điểm chính xác đang chọn, cuộn ngang bằng bàn phím","Exact selected time, horizontally scrollable by keyboard")}><MathText text={`$$t_${shift}=${texFraction(shifted.time)}$$`}/></div>{good?<MathText text={"$\\min_v\\|vt_4\\|=\\frac15-\\frac1{10Q}>\\frac1{15}$"}/>:<MathText text={`$u_${shift}=(${10-2*shift})Q+1,\\quad\\|u_${shift}t_${shift}\\|=\\varepsilon<\\frac1{15}$`}/>}</div>
      <details className={styles.details}><summary>{t("Xem 14 vận tốc gốc, pha và khoảng cách chính xác","Read all14 physical speeds, phases and exact distances")}</summary><div className={styles.tableWrap}><table><caption>{t("Phân số tối giản; trạng thái không dùng số thực dấu phẩy động","Reduced fractions; no floating conversion for status")}</caption><thead><tr><th>v</th><th>{t("Pha modulo 1","Phase modulo 1")}</th><th>{t("Khoảng cách / trạng thái","Distance / status")}</th></tr></thead><tbody>{shifted.runners.map(r=><tr key={r.index}><td>{r.speed}</td><td>{fractionLabel(r.phase)}</td><td>{fractionLabel(r.distance)} <span className={r.good?styles.good:styles.bad}>{r.good?"≥ 1/15":"< 1/15"}</span></td></tr>)}</tbody></table></div></details>
      <div className={styles.proof}><h3>{t("Vì sao cả họ đã nêu đều đúng","Why the entire stated family works")}</h3><p>{t("Với mọi Q dương chia hết cho 5, mười vận tốc 5Q(1,3,…,19) có pha 1/2 sau mỗi phép dịch. Ngoại lệ uᵣ=(10−2r)Q+1 có pha (j−r)/5+ε modulo 1: mỗi ngoại lệ chặn đúng j=r của nó, với r=0,…,3.","For every positive Q divisible by5, the ten speeds5Q(1,3,…,19) have phase1/2 after every shift. Exception uᵣ=(10−2r)Q+1 has phase(j−r)/5+ε modulo1: each blocks its own j=r, for r=0,…,3.")}</p><MathText text={"$j=4:\\quad\\min_v\\|vt_4\\|=\\frac15-\\varepsilon\\ge\\frac9{50}>\\frac1{15}$"}/><p>{t("Không giả định một kết quả LRC bậc thấp hơn. Đây là họ đã nêu, không phải định lý LRC tổng quát cho 15 người chạy.","No lower-rank LRC premise. This is the stated family, not the global15-runner theorem.")}</p></div>
    </section>}
    <footer className={styles.limits}><h3>{t("Bạn đang xem điều gì","What you are viewing")}</h3><p>{t("Chứng chỉ công khai TIP-084 đã được phép phát lại Python độc lập ngoại tuyến chấp nhận. Trang này không chạy lại bộ phát lại Python, trình giải hay vòng tự động. Đã biết nguồn và gợi ý: không phải thử mù, kết quả mới hoặc chứng minh hình thức; không có điểm chính thức hay kết luận LRC tổng quát cho 14/15 người chạy.","Retained public TIP-084 certificate, accepted by independent offline Python replay. This page runs no replay, solver or autonomous loop. Known sources and hints: not a blind test, novelty or formal proof; no official score or global LRC14/15 conclusion.")}</p><a href="https://arxiv.org/abs/2609.02604v2" target="_blank" rel="noreferrer">{t("Nguồn công khai · Allikvere, §§4.2 và 4.4","Public source · Allikvere, §§4.2 and4.4")}</a></footer>
  </article>;
}
