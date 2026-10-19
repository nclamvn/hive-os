# TIP116 — joint B+E payment attempt

STATUS: PARTIAL; K6 OPEN. No new quantitative inequality or area floor,
no degree-four impossibility theorem and no qualified solver run.

Owner scope JOINT_BE_SCOPE_20261013.md, activation2026-10-13 11:51:45UTC,
cap12:21:45UTC. Builder independent new derivation STOP observed11:57:49UTC:
early hand exhaustion of the simultaneous payment, not cap exhaustion or
failure of the whole allowed certificate class. Subsequent activity is literal
review/recording only. All predecessor files remain unchanged.

## Joint obligation and attempted payment

The retained central-mask decomposition is G=B+E. This scope does NOT
require a separate B>=40/31 proof: E must remain available where B is deficient.
The actual obligation is the whole

    P=B+E-40/31=53/31-Q >=0

on the original490-wire graph, with all intersections and clipping retained.
The earlier indicator-degree-six observation about E alone is NOT an
obstruction to this joint graph certificate: the exact G objective is already
quadratic. Neither B, E nor an analytical intersection area was added as a
new generator.

The hand attempt considered central/outer coverage compensation and a
simultaneous mask payment rather than dropping E. No quantitative estimate
of the actual cross-intersection, and no legal coefficient identity with
nonnegative summands paying the constant40/31, was obtained. Merely keeping
the whole error restores the original target; it does not establish its sign.

For two disjoint central masks34 and25, their exact nonnegative Boolean
errors cannot both be positive at a point: outside both masks at most
sources1,6 remain. Thus the exact integrated-max reformulation would require
an actual quantitative bound on its oscillation/payment. The attempt did
not derive that bound or a degree-preserving graph certificate. This exact
observation is not counted as a new root result.

## A tested averaging shortcut, not a substitute target

An average of the six masks M contained in I={2,3,4,5}, |M|=2, cannot be
a sharp replacement without compensating its errors. At a point with a
active internal sources and b active endpoints, m=a+b, its deficit is

    C(4-a,2)/6 * q_m,
    q_3=1, q_4=3, and q_m=0 otherwise.

At the translated sharp A*=(0,25,36,70,81,106)/31, take t=17/25 and
x=-3/5. In units1/775 the six intervals are

    [-527,0], [-429,98], [-681,-154],
    [-358,169], [-610,-83], [-512,15],

and x=-465/775. All comparisons are strict, so exactly sources1,3,5,6
cover an open neighborhood. Here a=2,b=2 and the averaged error is1/2;
specifically mask24 has error3. Since every mask error is nonnegative,
the averaged integral is strictly below G(A*)=40/31. Dropping that error
therefore cannot supply a sharp floor. This rejects ONLY this averaging
shortcut; retaining and paying the error remains the unproved joint task.

## Outcome and boundaries

No complete coefficient assembly, quantitative global payment, exact PSD
recovery or execution-cost qualification is supplied. No assumption of
natural order, general position, pair separability or a K5-minimizing core
was used to claim a result. The full degree-four class is neither certified
nor rejected. Decision: NO SOLVER RUN; no automatic successor.

**Tiếng Việt:** Chưa chứng minh được toàn bộ B+E-40/31 không âm. E không
bị bỏ và không buộc B phải có cận riêng. Trung bình các mặt nạ được thử
không giữ dấu bằng tại cấu hình chuẩn nếu bỏ sai số; đây chỉ là lỗi của
đường tắt đó, không phải phản ví dụ K6 hay bác bỏ toàn bộ bậc4. Chưa có
hệ số/chứng chỉ định lượng để đủ điều kiện thực thi.

Minimal Vibecode used the existing Main/Builder/critic only. Mathematical
processes/solver/code/sampling/enumeration/build/UI/API/DB/Git writes/install/
new agents/variables/gates/generators/infra/scratch/deletions:0. Reads,
hand mathematics and this one new Markdown record only. No saved-text
independent acceptance is claimed at creation.
