# Exact rejection of the saved coupled SOS template

**Result: the saved 409-PSD mixed template is algebraically infeasible.
K6 itself remains OPEN. No SDP run is warranted for this template.**

Scope: `COUPLED_IDENTITY_SCOPE_20261013.md`. The predecessor is frozen
`BUILDER_SPARSE_SOS_20261012.md`, section10, as summarized in
`SPARSE_SOS_COMPLETION_20261012.md`. This result does not alter the exact
578-variable area representation. It rejects the specified certificate
grammar on that representation, not the geometry or every degree-four SOS.

## 1. Kết quả và ý nghĩa

Đã bác bỏ **đúng mẫu SOS ghép đã lưu**, bằng suy luận hệ số chính xác,
không phải vì bộ giải không tìm thấy nghiệm. Kết luận áp dụng ngay cả
cho hệ số thực, nên cũng loại mọi nghiệm hữu tỉ trong mẫu đó.

Điểm nghẽn là sự mất cân đối trong mẫu: các khối phép cắt được phép có
bậc bốn, nhưng mọi phần khác — kể cả bội của phương trình cờ nhị phân
và phương trình nối các khối — chỉ có tổng bậc hai. So sánh hệ số buộc
sự phụ thuộc vào cờ dấu của các hệ số SOS quan trọng phải biến mất.
Mẫu vì thế rơi trở lại lớp độc lập đã bị bác bỏ ở lượt trước.

Điều này giải thích vì sao hệ số `b²` tuy loại được một chướng ngại
đối ngẫu riêng lẻ nhưng không thể hoàn thiện thành đồng nhất thức trong
mẫu hiện hành. Không phải mọi thành phần có vẻ hữu ích đều ghép được
thành một chứng minh toàn cục.

**Quyết định:** không lập/chạy bài SDP155.709 hệ số này. Không tăng bậc,
cài bộ giải hay xây thêm công cụ. Giá trị của lượt này là kết luận
khả thi dứt khoát và tránh một lượt tìm kiếm vô ích; chưa tạo cận dưới
mới, chưa chứng minh `G6>=40/31`, chưa khép K6.

## 2. The exact grammar being rejected

Let `A=(A1,...,A5)`, `A6=0`, let `b` be the five shared binary-flag
indeterminates, `tau_e` the forty clipped-time indeterminates, and `w`
the other gate wires. The objective polynomial `P=G-40/31` has total
degree at most two. For each nonzero homogeneous linear form `c_e(A)`,
the four clip generators are

    g_e,0=tau_e,                 g_e,1=1-tau_e,
    g_e,+=(c_e-tau_e)*tau_e,     g_e,-=(tau_e-c_e)*(1-tau_e).

The saved template asks for a FORMAL polynomial identity

    P = sum_e [ S_e(A,b,tau_e)
                + sum_k g_e,k(A,tau_e)*sigma_e,k(A,b,tau_e) ] + R.

Here each `S_e` is SOS of total degree<=4, each `sigma_e,k` is SOS
of total degree<=2, and **every summand of R has total degree<=2**.
R is the saved combination of other free SOS, nonnegative generator/
pair-product coefficients and allowed equality multiples. In particular,
Boolean/sign/routing equations have no unlisted higher-degree multipliers.
All symbols are shared. An identity modulo extra Boolean-ideal multiples
would be a DIFFERENT template and is not silently admitted here.

On the actual complete graph every non-equation summand is nonnegative
and equations vanish. On the actual clip graph alone, all four `g_e,k`
are nonnegative for every A. These are separate uses of the two graphs.

## 3. Coefficient collapse eliminates the apparent flag coupling

Suppose an identity of the displayed form exists. Factor its PSD matrices
over the reals, so `S_e=sum_l r_e,l^2` with `deg r_e,l<=2`, and
`sigma_e,k=sum_l s_e,k,l^2` with every s affine. This requires no
rational factorization or numerical calculation.

### Step A: pure flag quadratics cannot occur in free SOS rows

For any fixed real direction `v in R^5`, substitute `b=t*v` while
holding A, all tau and all w as independent formal variables. The
coefficient of `t^4` is

    0 = sum_(e,l) [ r_e,l^(bb)(v) ]^2,

where `r^(bb)` is the homogeneous quadratic part in the b variables.
P and R have degree<=2, and each clip generator is independent of b,
so none can supply another t^4 term. Hence every `r^(bb)(v)=0` for
every real v. Each row therefore has the form

    r_e,l(A,b,tau_e) = a_e,l(A,tau_e)
                      + sum_i b_i L_e,l,i(A,tau_e),

with each L affine in `(A,tau_e)`. Also write each multiplier row as

    s_e,k,l(A,b,tau_e) = d_e,k,l(A,tau_e) + beta_e,k,l dot b,

with constant real vector beta.

### Step B: the flag-quadratic coefficient is a bounded positive sum

The coefficient of `t^2` now gives a formal identity

    C_v(A,tau) := sum_(e,l) [sum_i v_i L_e,l,i(A,tau_e)]^2
       + sum_(e,k) g_e,k(A,tau_e) sum_l(beta_e,k,l dot v)^2
       = K_v.

`K_v` is a real constant independent of A, tau and w: it is the
coefficient of t^2 in `P-R`, a polynomial of total degree<=2.
Products of b² with A, tau or a wire would have degree>=3 and are
therefore absent from P-R. This is precisely where the saved multiplier
degree restrictions matter.

Set ALL `tau_e=clip(c_e(A),0,1)`. Every term in C_v is then
nonnegative for every real A, and their sum is the same finite K_v.
For any fixed e, choose a ray A=r*u with `c_e(u)<0` and r tending to
infinity. Then `tau_e=0` and `g_e,-=-r*c_e(u)` tends to infinity.
Boundedness forces

    sum_l(beta_e,-,l dot v)^2 = 0.

The positive-c ray similarly has `tau_e=1` and `g_e,+=r*c_e(u)-1`,
giving the same conclusion for beta_e,+,l. Since this holds for all v,
every vector beta in a QUADRATIC-clip multiplier is zero.

Thus every `sigma_e,+` and `sigma_e,-` is independent of every flag b.
No restriction to binary b was used during coefficient comparison:
the identity is formal, and its Boolean equation terms are already in R.
The clip-bound multipliers may still depend on b; that causes no problem
in the next step because their generators are nonnegative at the diagnostic.

## 4. Flagless negative-tail terms vanish in the exact diagnostic

For completeness, reproduce the previous tail argument rather than relying
on a numerical certificate. On the genuine full graph, `G<=3`, so the
assumed identity is a sum of nonnegative terms equal to `P<=53/31`.
For a negative-tail multiplier, now flagless, write an affine SOS row as

    s(A,tau_e)=u dot A + a*tau_e + d.

For every direction v in the open halfspace `c_e(v)<0`, put A=r*v.
There `tau_e=0` and `g_e,-=-r*c_e(v)`. Boundedness of the nonnegative
term `g_e,-*s^2` first forces `u dot v=0` for all such v, hence u=0,
and then d=0. Thus

    sigma_e,- = kappa_e*tau_e^2,  kappa_e>=0.

Now use two real assignments with weights3/4 and1/4:

    Z=1 or -3,       Aj=(j-6)*Z,
    all tau_e=0,     all b_j=1 or0 respectively.

Assign all paired sorting and maximum wires their actual values for
these diagnostic inputs. Every equation vanishes pointwise. All nonclip
inequalities and their permitted pair products are nonnegative pointwise,
as are the two clip bounds. All free SOS are nonnegative pointwise.
All `g_e,+` vanish because tau_e=0, and all weighted negative-tail
terms vanish because sigma_e,-=kappa_e*tau_e²=0.

The formal boundary-area polynomial equals `G=3-5Zb`, hence equals
-2 and3 respectively, and

    E[P] = (3/4)*(-2-40/31) + (1/4)*(3-40/31)
         = -253/124 < 0.

But every remaining non-equation term of the supposed identity has
nonnegative expectation and every equation term is zero. Contradiction.

After the multiplier collapse, averaging is in fact unnecessary: the
first diagnostic assignment alone has every remaining RHS term>=0 and
every equation zero, while `P=-2-40/31=-102/31<0`. The two-atom version
above retains the connection to the previous obstruction; this single-point
ending is a shorter equivalent contradiction, noted by the critic.

**Theorem (scope-limited): no real-coefficient exact SOS identity exists
in the frozen section10 mixed template.** This rules out every rational
certificate in that template too. The diagnostic points are NOT feasible
clipped geometries and are NOT counterexamples to the K6 area conjecture.

## 5. What is and is not settled

- Exact-identity feasibility of the saved409PSD template: REJECTED by proof.
- Full K6 lower bound: OPEN; no new numerical or symbolic global floor.
- Exact578-variable global representation: unchanged, not refuted.
- All degree-four or all structured SOS: NOT ruled out.
- Whole mathematical novelty or external/Lean acceptance: NOT established.

The mechanism tells us what a future alternative would have to change:
the asymmetry in allowed equation/constraint products or some other premise
of this no-go theorem, not merely PSD size or numerical solver settings.
For example, higher-degree Boolean-ideal multiples within a fixed total
degree can change the coefficient argument. That observation supplies
neither a certificate nor feasibility for such a revised grammar, and
no revision/search is executed in this scope. No automatic degree increase.

## 6. Minimal completion and verification record

Acceptance: exact identity OR rigorous rejection of the fixed template;
retain true root status and review the argument. Initial proof derived by
Main; independent Builder/critic challenge is recorded below when complete.
Mathematical subprocesses0, SDP searches0, numerical outputs0; no build,
install, product/UI/API/DB/Git change, new infrastructure, scratch or deletion.
No code altered; routine code tests are N/A, not claimed PASS.
Vibecode is used only for the existing Builder/critic verification and this
scoped report, not as mathematical evidence. Predecessor files remain frozen.

Main new derivation STOP observed2026-10-12 23:41:40UTC, before the unchanged
00:09:19UTC hardstop. Early stop on the proved rejection, not resource exhaustion.
Only literal verification and completion recording after that point.

Final review: Builder read the FULL Main proof at observed23:42:04UTC;
critic at observed23:41:53UTC. Both accepted the argument and exact scope
without a blocking correction, including the single-point ending. Main
read both complete saved notes and accepted their reasoning. Critic observed
own new-derivation STOP23:42:38UTC; these are distinct team timestamps.
Supporting records: `BUILDER_COUPLED_IDENTITY_20261013.md` and
`CRITIC_COUPLED_IDENTITY_20261013.md`. Independent here means separate AI
review within this team, not a third-party mathematician or proof assistant.

Acceptance results: fixed-template feasibility resolved by exact rejection;
scope/review record complete. Root requirement R116-1 remains UNMET.
No failed numerical solve or approximate-feasibility claim is substituted
for the coefficient proof. `git diff --check` found no tracked whitespace
errors; no source-code build/type/lint/test claim is made.
