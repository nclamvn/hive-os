# K6 joint B+E — no global certificate; separate B floor is false

**PARTIAL. K6 OPEN. No new lower bound for G.** The approved joint
nonnegative certificate at degree<=4 was not found. An exact actual
placement now disproves the previously unproved separate bound B>=40/31.
Its positive E compensates the deficit, so it is NOT a counterexample to
K6 or a rejection of the joint direction. No solver was qualified or run.

Scope JOINT_BE_SCOPE_20261013.md; same TIP116 R116-1/2/3, PUBLIC_DISCOVERY,
all-real G>=40/31 (F6>=20/93), all orders/ties/faces. Activation2026-10-13
11:51:45UTC/cap12:21:45UTC. Main NEW DERIVATION STOP12:02:19UTC on
early hand exhaustion of joint payment; Builder11:57:49, critic11:54:03.
Subsequent literal checks of supplied formulas/text are not new search.

## 1. The joint target, without two false requirements

Use the predecessor's exact central mask34 decomposition G=B34+E34,
where E34>=0. The required certificate is for the WHOLE

    P=B34+E34-40/31=53/31-Q >=0.

The separate B34 floor is not required, and in fact is false below. Nor
does the degree6 Boolean expression for E34 reject joint graph D4: the
existing490-variable graph already represents the full G quadratically.
Indicator degree and graph-certificate degree must not be conflated.

The hand attempt retained cross-intersections of the central pair with
the actual outer union and considered their simultaneous payment. It
did not derive a quantitative inequality for the whole P, an explicit
allowed nonnegative coefficient identity, or a qualified sparse support
with exact recovery cost. Restoring G exactly does not prove its sign.

## 2. Exact placement that requires the error payment

Let c=2/3 and take the translated apices

    A=(c,2c,2c,3c,5c,6c)=(2,4,4,6,10,12)/3,
    I_j(t)=[A_j-j*t,A_j-(j-1)*t], 0<=t<=1.

This leaves outer labels1,2,5,6 at A_j=j*c and shifts the central labels
3,4 left by c from that uniform arrangement. A common translation by-4
restores A6=0. After the x+3t shear its projection hull is[-10/3,0], so
this is also a genuine placement in the existing compact domain D.
No false clip assignment or numerical search is involved.

### 2.1 True area, with all unions retained

Put r=c-t. For0<=t<=1/3 the left endpoints have order1,3,2,4,5,6.
Their consecutive gaps are c-2t,t,c-2t,2c-t,c-t. For equal-length
intervals the union width is t plus the sum of gaps capped at t, hence
here it is4t+2*min(t,c-2t).

For1/3<=t<=1 each adjacent pair12,34,56 is connected. These three
intervals have common length L=t+|r| and centers, after a common shift,

    -2r, -c, 2r.

Since2|r|<=c, the shifted central pair is leftmost and the two consecutive
center gaps are c-2|r| and4|r|. Their exact union width is

    W=L+min(L,c-2|r|)+min(L,4|r|).

Together these formulas give all heights and their shared boundaries:

| Height t | Exact W(t) |
| --- | --- |
| [0,2/9] | 6t |
| [2/9,1/3] | 4/3 |
| [1/3,1/2] | 2/3+2t |
| [1/2,2/3] | 8/3-2t |
| [2/3,1] | 4t-4/3 |

Integrating these five linear pieces yields

    G=8/27+1/4+1/4+2/3=79/54.

### 2.2 The exact full error E34

For the four outer intervals, the triple-minus-quadruple error has
horizontal integral

    H(t)=2*(t-4|r|)_+ +(t-5|r|)_+.

Indeed two of their four triples span4|r|, two span5|r|, and the
quadruple spans5|r|. No central coverage removes any positive-area part
of this error in the displayed placement:

- For t<c, its earliest possible left endpoint is5r. Where error is
  nonzero the central pair is connected, with right endpoint4r-c+t<=5r.
- For t>c, write s=t-c. The central pair's right endpoint is
  3r-c+t=-2s, exactly the earliest possible outer-triple left endpoint.
- Before those overlaps exist, and at the isolated equality heights,
  there is no omitted positive-area contribution.

Thus E34 is the integral of H itself, with all intersections preserved:

    E34=4/45+1/27+4/27+1/18=89/270,
    B34=G-E34=17/15.

Consequently

    40/31-B34=73/465>0,
    B34+E34-40/31=79/54-40/31=289/1674>0.

This decisively rejects the SEPARATE B34 floor. The joint area target
survives on this placement. The example is a diagnostic proof of a
failed stronger claim, not a universal area theorem or new K6 milestone.

## 3. A contextual averaging repair also cannot drop its error

Define B25,E25 by the same construction with central labels2,5. Still
G=B25+E25. Because masks34 and25 are disjoint, their pointwise errors
cannot both be positive: outside both only labels1,6 remain. Therefore
OR=max(p34,p25), but integrating this exact maximum does not itself give
a quantitative floor, or a legal graph degree<=4 coefficient identity.

On the SAME placement above, the entire triple134 is outside sources2,5.
Sources2 and3 have disjoint interiors because A2=A3; on the triple's
lifetime, L5-R3=2-3t>=0. Its width is

    2t-2/3 on[1/3,4/9],
    2/3-t  on[4/9,2/3],
    zero otherwise.

Its area is1/27. The mask25 error is at least1 wherever that triple
occurs outside2,5, even if source6 is also present. Thus E25>=1/27 and

    (B34+B25)/2 = G-(E34+E25)/2
                <=691/540 <40/31,
    40/31-691/540=179/16740>0.

This rules out discarding the averaged error as a shortcut. It does not
reject paying that error jointly, other weights, or the full graph D4
class. Builder's separate six-mask sharpness diagnostic is retained in
its note; it too is only a rejection of dropping an error, not root closure.

## 4. Feasibility and honest outcome / Kết quả

**NO SOLVER RUN.** No complete joint nonnegative assembly, qualified
coefficient system or exact PSD recovery was obtained. Low degree of
the target is not feasibility of a certificate. Neither the preceding
Boolean-degree guard nor the new physical examples prove impossibility
of the original graph's whole degree-four class.

**Chưa khép K6 và chưa có cận dưới mới.** Kết quả kiểm được lần này là:
chặn riêng B>=40/31 thực sự SAI, không chỉ chưa chứng minh được. Cấu hình
nêu trên có B=17/15, E=89/270 và diện tích thật G=79/54>40/31. Vì vậy
phải giữ phần bù giao E; bỏ nó hoặc bỏ sai số của trung bình hai mặt nạ
đều làm hỏng mục tiêu sắc.

Tuy nhiên, chưa có chứng minh rằng phần bù luôn trả đủ thiếu hụt trên
toàn miền. Không coi phép phân rã, phản ví dụ cho chặn phụ, hay xác nhận
một cấu hình là đột phá K6. Việc cần làm vẫn là tìm hệ số cụ thể cho
chứng chỉ không âm của toàn P trên hệ hiện có; lượt này chưa làm được.
Không đề nghị chạy solver chỉ dựa vào cách viết lại G hoặc tiếp tục
tăng độ phức tạp của các mặt nạ.

## 5. Review and resources

Main fully read the current Builder and initial critic notes. Critic
literal check of section2's supplied derivation at12:00:43UTC accepted
the exact width, error and arithmetic, including the compact-domain
placement. Additional supplied averaging check accepted12:03:05UTC.
Critic FULL saved-report read/check, sections1-5, at12:03:44UTC: ACCEPT,
no blocking correction. This accepts the exact diagnostics and scoped
incomplete outcome, not K6 closure. Independent STOP remains unchanged.
Repository git diff --check passed12:04:08UTC; whitespace checks are not
mathematical verification. Build/type/lint/runtime tests were not run.

R116-1 OPEN; R116-2 scoped hand challenge and R116-3 EN/VI recording do
not establish a closure percentage. Existing Vibecode Builder/critic
only, no added product process or infrastructure. Predecessors unchanged.
No formal kernel, external referee, novelty or general Kakeya claim.

Mathematical subprocesses/solver/numerical search/enumeration/product code/
build/UI/API/DB/Git writes/install/new agents/variables/generators/gates/
infrastructure/scratch/deletions:0. Ordinary reads/hand work/Markdown only.
No automatic next attempt, degree increase or resource escalation.
