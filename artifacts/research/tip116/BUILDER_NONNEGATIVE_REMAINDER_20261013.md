# TIP116 — whole-remainder candidate rejected

STATUS: PARTIAL; K6 OPEN. No nonnegative identity for
`P=53/31-Q=53/31-sum15J+R` was obtained. A concrete globally valid
geometric majorant of Q was tested and its requested uniform bound failed.
This does NOT reject the whole new-objective degree-four certificate class.

Scope `NONNEGATIVE_REMAINDER_SCOPE_20261013.md`: activation2026-10-13
11:26:54UTC, cap11:56:54UTC. Builder new derivation STOP observed11:32:01UTC
on the exact named-candidate failure, not cap exhaustion. Subsequent work is
literal review/recording only. All predecessors unchanged; no mixing repair
or further independent proof search after STOP.

## 1. The whole-source candidate

Main proposed Qhat using f(t)=t-t^2/2 and the actual five source bands on
each retained ray. HULL means the full interval from smallest lower to
largest upper endpoint, including any gaps; these are analytical extrema,
NOT new graph variables or an already-proved degree4 encoding.

For positive rays R1,R3,L4,L6, replace D by the moment of its whole hull.
For R2 replace D by the SUM of source3's individual band, source1's parallel
band, and the hull of source4,5,6. Use the reflected replacement on L5.
For negative rays use only source4's band on R5, source4's second band on
R6, source3's second band on L1, and source3's parallel band on L2.

Each positive replacement is an upper bound on actual union moment;
each negative replacement is a lower bound multiplied by a negative
coefficient. Hence Q<=Qhat genuinely on the whole domain, retaining all
source bands and ties with their consistent shared flags. The candidate
inequality would be Qhat<=53/31, implying the desired P>=0.

It touches the retained sharp arrangement: R1/L6 have connected coverage
[12/31,25/31], R3/L4 have [11/31,1]; R2 has the three disjoint components
[11/62,11/31], [14/31,45/62], [25/31,1], exactly its three chosen groups.
L5 is its reflection. The selected negative bands equal their whole
coverage: R5/L2=[11/31,1], R6/L1=[18/31,1]. These contact facts do not
establish the uniform majorant bound.

## 2. Exact analytic rejection

Take the FAMILY Aj=(j-6)c, 1/2<=c<=1, A6=0. No process, enumeration or
sampling is used. Every interval below follows symbolically from its
original clipped crossing times. Write fc=f(c), fh=f(c/2), ft=f(2c/3).
The replacements are:

    R1,L6 hull moment =fc-fh;
    R3,L4 hull moment =f(1)-fh;
    R2,L5 grouped moment =f(1)+fc-fh-ft;
    all four selected negative bands =f(1)-fc.

Their coefficients give exactly

    Qhat=6(fc-fh)+2(f(1)-fh)
          +4(f(1)+fc-fh-ft)-6(f(1)-fc)
         =16fc-12fh-4ft
         =(22/3)c-(101/18)c^2.                     (1)

At c=2/3, (1) is194/81>53/31 (difference1721/2511).
This placement lies inside compact D: its sheared projection hull is
[-10/3,0], width10/3<12. It has distinct apices and positive adjacent
differences; no ambiguity of parallel sign flags affects the example.

The ACTUAL coverage is

    R1,L6: [c/2,c];
    R2,R3,L4,L5,R5,L2: [c/2,1];
    R6,L1: [c,1].

Consequently

    Q=10(fc-fh)=5c-(15/4)c^2.

At c=2/3 this is5/3, giving actual G=4/3>40/31. Thus there is NO K6
counterexample. The exact lost context in the candidate is

    Qhat-Q=2(fc-fh)+4(fc-ft).

The first term omits R5/L2's extra [c/2,c] coverage under negative weights.
The second double-counts the source4,5,6 group within source3's band on
R2/L5. At c=2/3 their losses are27/81 and32/81, total59/81.
Even keeping ALL negative actual unions, while retaining the positive
group replacement, leaves Qhat=167/81>53/31. The error is therefore not
repaired by strengthening those negative selections alone.

## 3. Feasibility disposition and review limits

The named majorant is globally valid and sharp at A*, but its uniform
53/31 bound is FALSE. No solver run can prove that false candidate.
There is no degree4 translation/certificate claimed for its grouped extrema.
The failure does not reject alternatives retaining the complete source
context, adaptive simultaneous cancellation, or the full allowed D4 class.
No new moment invariant or necessary condition is counted as root progress.

Builder independently hand-checked Main's full family calculation, contact
directions, exact59/81 loss, and compact-domain placement before STOP.
No FULL saved-note critic acceptance is claimed at creation; actual later
literal reviews must record their scopes and observed times.

**Tiếng Việt:** Chưa khép K6. Ứng viên giữ các nhóm phủ và đúng tại cấu hình
đạt cận sắc, nhưng chặn trên của nó quá lớn trên một họ cấu hình thật.
Diện tích thật tại ví dụ vẫn4/3; lỗi nằm ở bỏ phần phủ của cạnh mang dấu
âm và đếm lặp các nhóm trên cạnh dương. Không chạy bộ giải cho ứng viên
đã bị loại, không tuyên bố toàn bộ chứng chỉ bậc4 bất khả thi.

Minimal Vibecode: existing Main/Builder/critic hand review only. Mathematical
subprocess/solver/sample/enumeration/code/build/UI/API/DB/Git writes/install/
new agents/variables/gates/infrastructure/scratch/deletion:0. Only reads,
hand mathematics and this one new Markdown record. No automatic successor.
