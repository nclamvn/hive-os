# COMPLETION REPORT — TIP116 continuation R2, 2026-10-12

**PARTIAL / GLOBAL K6 OPEN. R116-1 is NOT CLOSED.**

## Kết quả chính / Vietnamese result

Mục tiêu không đổi: chứng minh trên mọi tịnh tiến thực của mô hình sáu
tam giác hữu hạn, `F6>=20/93`, tương đương `G=6F6>=40/31`. Chứng chỉ cấu
hình đạt cận trên đã có không thay thế cho cận dưới toàn cục. Đây không
phải chứng minh giả thuyết Kakeya tổng quát hay xác nhận tính mới.

Lượt này đã loại trừ trọn lớp cực tiểu ứng viên thứ tự tự nhiên có hai
đầu cùng đạt cực đại thời điểm đóng khe. Các trường hợp bằng nhau, luồng
giao xa, hull gộp và hull bằng 0 được xét trực tiếp. Phản biện độc lập
bằng tay đã kiểm nội dung chứng minh, không chỉ đọc báo cáo kết quả.

Đối với lớp chỉ một đầu cực đại, đã chứng minh luồng giao của đầu đó
không thể đi xa quá hai khe kế tiếp. Nếu nó đi tới khe thứ hai thì cả
hai hull đầy đủ phải dương. Các lớp cực đại phía trong chứa khe3, chứa
khe4 nhưng không khe5, chứa khe5 nhưng không khe4, và hòa khe4/5 đã
được loại trừ và phản biện chấp nhận. Lớp cực đại phía trong chứa khe2
cũng đã được kiểm toàn văn và chấp nhận lúc03:14:34UTC. Như vậy đã
loại trừ trọn chế độ một đầu cực đại giao tới hai khe kế tiếp trong
miền cực tiểu ứng viên đang xét, kể cả các trường hợp bằng nhau.

**K6 chưa khép:** chế độ đầu cực đại chỉ giao với khe gần nhất, cả 12
miền đảo thứ tự và phần ghép
đầy đủ các tiền đề biên/đạt cực tiểu vẫn chưa được chứng minh. Không có
phần trăm hoàn thành toán học; không gọi
các rút gọn này là kết quả K6 toàn cục hoặc đột phá đã xác nhận.

## 1. Scope and exact model

Owner routing: “Tốt bám sát mục tiêu lớn này để đạt mốc K6 trọn vẹn”.
The later stream-disconnection/retry message resumes saved work only;
it does not restart the campaign or extend its grant. Same PUBLIC_DISCOVERY,
R116-1..3; no new TIP, target, runtime lane or infrastructure.

Hand-only envelope: 02:16:07–03:16:07 UTC (09:16:07–10:16:07 ICT).
Mathematical subprocess grant zero. Original TIP116 and its first
continuation notes/report are frozen; new R2 Markdown records only.

For natural apices, `D_i=A_(i+1)-A_i>0`, `delta_i=1-D_i`, with the
actual decreasing/increasing nonnegative projections `alpha,beta`:

    D_i=2T_i+C_i; 1=alpha_i+beta_i+T_i+M_i;
    C_i=sum_j F_ij; M_i=sum_j F_ji; r=sum_i T_i;
    2G=1+r; 79/61<=r<=49/31.

These are retained necessary conditions of ACTUAL competing minima,
not constraints imposed on arbitrary translations or a proxy objective.
Every accepted exclusion is conditional on the predecessor attainment,
positive-cut, connected-bottom, full-stationarity and range reductions.
The full-cone polars and genuine positive block means remain essential;
zero pooled blocks never receive an individual input equality.

## 2. Independently accepted whole-scope reductions

| Scope in retained actual minimum domain | Accepted evidence |
| --- | --- |
| Global maximum-time set exactly `{1,5}` | Main R2 §9 assembles all farther-flow exclusions and every original interior order/tie; Builder §§5–8; Critic §4A |
| Any endpoint global maximum | Main §8: last-positive prefix of length3/4 forces `r>=19/11` or `25/11`; hence `F14=F15=0`, with reflection |
| Endpoint with zero incoming flow and time `tau<=5/11` | Main §10: safe clipped SOURCE extension; opposite hull is strictly positive. Both-hull positivity is needed separately for `S+r=5` |
| Unique endpoint1, `F13>0`, terminal alpha45 zero | Main §§11–12 retain the failed individual-D5 shortcut, then repair the no-flow phase using actual zero restoration tails and positive beta34 pooling |
| Unique endpoint1, `F13>0`, alpha4 positive/alpha5 zero | Main §13: tight genuine boundary gives `D5>=1`; all incoming5 vanish, contradicting the reviewed SOURCE extension |
| Entire unique endpoint1 `F13>0` regime | Main §§12–13 consequently give both full hulls strictly positive and `S+r=5`; necessary reduction, not an area floor |
| Same regime, right-subtree maximum set containing3 | Builder §10: barrier3 gives `D4+D5<=4psi`; `5=S+r<=5theta+8psi<9theta<=45/11<5` |
| Same regime, right maximum containing4 but not5 | Builder §12 WITH explicit §12.3 repair; all actual beta blocks, original ties, terminal prefix lengths and q clamps retained |
| Same regime, right maximum containing5 but not4 | Builder §13: asymmetric both-far exclusion, genuine full-hull alternatives and strictly higher range floors |
| Same regime, original right maximum tie4/5 | Builder §14: actual one-sided hull-stable variation, strict row inactivity and sole R4 metric-dual increment bound give negative actual-area curvature |
| Same regime, right maximum containing2 | Builder §15: full actual flow reduction and every original order/tie of4/5; Critic FULL literal check accepted03:14:34UTC |
| ENTIRE unique-endpoint1 positive-two-edge row | §§10,12.3,13,14,15 exhaust all nonempty right-subtree maximum sets, including every original tie; reflection covers endpoint5 |

Endpoint-tie equality audit: the frozen nearest-odd calibration permits
equality only at `D*=(25,11,34,11,25)/31`. Its actual closure times
`(12/31,11/62,14/31,11/62,12/31)` do not have endpoint maxima. Thus
that equality cannot escape the declared tie exclusion. This uses the
full-cone calibration, not a nearest-only assertion about arbitrary minima.

## 3. Terminal whole-regime coverage audit

Critic FULL literal independent review ACCEPTED Builder §§13/14 at03:13UTC
and §15 at03:14:34UTC. The full-functional second variations retain actual
row inactivity and metric-dual curvature bounds; they do not use the
withdrawn generic curvature shortcut. Main read their complete saved texts.

Every nonempty right-subtree maximum set is covered: any set containing3
by10; containing4 but not5 by repaired12; containing5 but not4 by13;
containing4/5 by14; and containing2 by15. Every original tie is retained.
Consequently the ENTIRE unique-endpoint positive-two-edge regime is
noncompeting in the retained actual minimum domain. Together with Main8,
only nearest-only unique-endpoint regimes remain in the natural branch.
This is not an all-natural pointwise bound or a whole-K6 theorem. No
coverage percentage or generic limiting inference is used.

## 4. Failed shortcuts and preserved corrections

* A zero pooled alpha45 block does not imply `D5>=1`. Main §11 records
  this failure; §12 repairs the missing phase without that assertion.
* Builder §12 initially omitted `q=F45` from both actual beta means.
  Critic rejected the whole claim. Correct means are
  `P+L+q=psi+3a` and `D3+L+q=2a`; §12.3 preserves the withdrawal and
  rederives every affected q-positive phase. Only that repair is accepted.
* A generic common-hull negative-curvature shortcut is unproved:
  convex restoration curvature cannot be dropped. Builder §11 explicitly
  withholds it. Scoped later curvature proofs retain row inactivity and
  an explicit metric-dual increment bound.
* The proposed pointwise fan lower envelope for inverted configurations
  is false on an exact connected-bottom example: actual value349/600
  versus proposed403/600. It is not a stationary K6 counterexample.
* A fixed-tree replacement of the actual kinetic-neighbor tree is false.
  Each fixed five-edge tree has integrated overlap at most5/3, whereas
  the accepted sharp configuration has actual overlap53/31>5/3 by4/93.
  The tree really changes with height; integral and maximum cannot swap.

All twelve inverted continua remain OPEN. The exact whole-union identities
and early-height finite-swap correction are retained, not replaced by a
single source bridge, fixed tree or individual-maximizer assumption.

## 5. Exact next closure debt, not an automatic new campaign

1. Exclude or bound every retained unique-endpoint minimum in the
   nearest-only regime, with all hull faces, original time ties and
   interior farther donor rows retained. The endpoint flow itself may
   be zero; nearest-only does not discard interior farther rows.
2. Prove the actual whole-union gain/value/exclusion for all twelve
   inverted continua and their faces; no fixed-tree/fan shortcut survives.
3. Assemble and verify the full predecessor boundary, collision and
   minimum-attainment reductions before claiming `C_T(6)=20/93`.

No automatic additional target, resource ceiling, mathematical subprocess,
API or optimization grant follows from this partial result. Independent
AI hand criticism is not Lean formalization or external expert review.

## 6. Execution / hygiene

Ordinary source/status/clock reads and apply_patch only. Mathematical
processes0, seconds0, failed mathematical starts0. No samples, optimizer,
enumeration, LP, replay, code/tests, UI/app/DB/auth changes, paid API,
Git writes, build/install/copy/Docker/deletion/new infrastructure.
One existing Builder and one existing critic were reused under the skill;
no new agents or scratch/distDir were created. Nothing was removed.

Ordinary read/patch errors are recorded in the chronological notes;
wrong source paths, a failed context patch, and a too-broad rg output are
not mathematical execution. Existing dirty predecessor changes preserved.
Terminal disposition: STOP/PARTIAL, mathematical derivation stopped before
the hardstop; last independent proof review completed03:14:34UTC. Main
handoff recorded03:14:45UTC. Tracked diff/new-note whitespace checks clean.
One late review request reached an idle critic via send_message; explicit
followup_task reactivated that same critic, without a new agent or grant.
Acceptance was withheld until its full literal review completed. Frozen
predecessors remain untouched. No automatic followup or ceiling extension.
