# TIP109 — Whole structural-region theorem; global K6 still open

STATUS: PARTIAL. Scientific STOP: 2026-10-11 13:26:40 UTC, before the
13:33:50 UTC hard stop, on the named whole-domain calibration/coverage gap.
The interrupted stream resumed saved work; it did not reset the grant.

## Kết quả thực sự / Actual result

Đã chứng minh một định lý trên **toàn miền đa diện đóng C**, không chỉ tại
cấu hình tối ưu hay một ô sắp xếp cục bộ. Định lý giữ cả các mặt biên và
hai hướng bất đối xứng. Main đã đọc toàn chứng minh và hai phản biện bằng
tay; Builder cũng kiểm độc lập phép khai triển và năm bình phương.

A whole CLOSED polyhedral regional theorem, including every face and both
antisymmetric directions, is established. Main accepted the complete source
and gap-specific independent AI hand reviews. This is a stronger result than
the predecessor's local Hessian/chamber certificate, not an all-real theorem.

Put p_j=6x_j, A_j=p_j+j, D_i=A_(i+1)-A_i, G=6F6. Region C is D_i>=0
and ALL twelve inequalities:

    D5<=1;          2D5>=D3+D4;
    D3+D4>=D1+D2;   D1+D2<=2;
    D1<=1;          2D1>=D2+D3;
    D2+D3>=D4+D5;   D4+D5<=2;
    D1>=2D2;        D5>=2D4;
    D3+D2>=3D4;     D3+D4>=3D2.

Every real offset vector with D in C satisfies F6>=20/93. Equality is
unique up to horizontal translation:

    D*=(25,11,34,11,25)/31,
    p*=(49,43,23,26,6,0)/31,
    x*=(49,43,23,26,6,0)/186.

For a=(D1+D5)/2, b=(D2+D4)/2, c=D3, d=(D1-D5)/2,
e=(D2-D4)/2, and u=a-25/31, v=b-11/31, w=c-34/31, the proof gives

    G >= Q = 40/31
             +7/6*(u+v/7)^2
             +23/14*(v+7w/46)^2
             +31/92*w^2
             +7/6*(d+e/7)^2
             +15/7*e^2.

The polynomial identity is global algebra; the geometric comparison G>=Q
is licensed ONLY on C. Feasible selected hull envelopes and correctly clipped
nearest-neighbor gap restoration justify it. Integrating nonnegative residual
gaps beyond height1 weakens the bound; it does not invent triangle coverage.
Equality attainment also checks by hand: hull3765/1922 minus holes1285/1922
equals40/31 at the retained construction.

Miền C chứa điểm nghiêm ngặt ở hai phía vách p3=p4 của ô cũ. Vì vậy đây
là mở rộng cấu trúc thực, không phải đổi tên kiểm tra cục bộ; không có tỷ lệ
phần trăm bao phủ được chứng minh.

C contains strict points on both sides of the old bottom-clipping wall
p3=p4. The explicit inclusion point D=(9/10,2/5,19/20,2/5,9/10) is not
claimed stationary and its actual area was not computed. No coverage fraction
or containment of the entire old arrangement chamber is asserted.

## Auxiliary results and evidence

- Exact actual-hull identity for arbitrary real offsets, retaining BOTH
  envelopes and the signed baseline.
- Valid fixed-label forward/reverse-gap relaxation for every order, with
  correct uncovered-gap multiplicity.
- Exact natural-order cut-hole identity. Natural-chain closed components
  merge monotonically with top-height; no common-bottom-overlap clique is
  assumed. This is NOT extended to inverted words.
- Whole C inequality and unique equality classification, independently
  challenged by hand, including support feasibility, clipping, signs and SOS.

Accepted source: `artifacts/research/tip109/MAIN_CHAIN_IDENTITY.md` and
`MAIN_STRUCTURAL_SOS.md`. Scoped reviews: `INDEPENDENT_CHAIN_REVIEW.md` and
`INDEPENDENT_SOS_REVIEW.md` in the same directory. Builder sources/completion
remain there, including failed approaches and provisional leads.

Builder's newest farther-restoration partial-minimization and stationary
timing/flow sections were read but were NOT independently accepted in this
campaign. They are provisional leads, not dependencies of the accepted regional
theorem. In particular M_total<=8*range(p)/49 is UNPROVED and does not address
the twelve inverted words by itself.

## Nghĩa vụ còn mở / Exact missing implication

R1 OPEN: no proof that every competing necessary natural-order minimum belongs
to C or is otherwise excluded; no whole treatment of the twelve inverted-apex
continua. The retained range, radial, full-gradient and one-sided-slope conditions
cannot be replaced by membership in C. The thirteen order words are not thirteen
polynomial cells and are not coverage evidence.

R2 PASS only for the accepted auxiliary lemmas and WHOLE regional theorem;
global acceptance cannot be issued while R1 is open. R3 COMPLETE: bilingual
outcome, preserved corrections, ledger and terminal checkpoint. This is not
global finite C_T(6), general Kakeya, formal Lean/kernel acceptance, external
referee acceptance, publication novelty or measured A/B method advantage.

Chưa chứng minh mọi cực tiểu cạnh tranh thuộc C hay bị loại; 12 miền đảo
nhãn vẫn chưa được khép. K6 toàn cục vẫn MỞ. Hai-thành-phần đã được khép
ở TIP108F và được giữ nguyên, không dùng kết quả đó để lấp thiếu sót này.

## Failed shortcuts retained, not silently reused

1. Sorted-apex extension of the unique-hole argument was withdrawn: positive
   label jumps2/3 can create reverse gaps. The hand counter refutes the premise,
   not the root area inequality.
2. Unconditional signed nearest-neighbor GEN calibration is too weak: its
   hand value21/32 at the named point refutes that proxy floor. The point fails
   necessary bottom slopes; no actual-area/root counterexample was claimed.
3. Unconstrained hull-support energies, globally convex actual area and frozen
   dual support are not admitted as global lower certificates.
4. Bottom-contact extra-height tails are O(h^2); first derivatives transfer,
   unrestricted second-variation claims require correction. The earlier wording
   was withdrawn and no exclusion used it.
5. Range/slope/connectedness alone do not give the proposed timing floor;
   the hand family counter fails full stationary balance. No actual smaller
   area was computed or asserted.

## Resource / technical / hygiene ledger

Main0 + Builder0 + critic0 mathematical processes; aggregate0s/120s; zero
failed mathematical starts, no running mathematical process. There were no
fresh exact-area runs: equality uses the retained certificate and symbolic
hand consistency checks. Ordinary read-only source requests included one Main
missing-path rg failure and four Builder failed source reads; these were not
scientific executions and changed no sources. Ordinary patch failures0.

No build, syntax/type/lint/test suite or UI E2E was run or claimed; this scope
changes proof/documentation only. No implementation, database/auth/config,
Git commit/push, API fee, new infrastructure, optimizer, samples, box/chamber
generation, install, Docker, scratch copy or distDir. Nothing was deleted.
All predecessor bytes and dirty repository history are preserved. The process
was reduced under Vibecode Kit to charter, proof, focused challenge and report.

Created: TIP109 charter, six proof/review/completion artifacts and this report.
Modified: append-only activation/terminal sections in active commitment and
handoff. Source hashes are integrity records, not mathematical evidence.

## Routing recommendation, NOT automatic execution

If directly approved next, retain the SAME all-real finite K6 goal. Attempt a
complete necessary-stationary exclusion/value argument outside C, keeping all
projection/clipping and farther-coverage terms, and a valid signed/multiplicity
argument for the twelve inverted continua. No new platform, random search,
detached sample collection or relabeling a regional theorem as global closure.
Cost/feasibility of that complete next step is not yet established. STOP here;
no automatic successor or reissue of unused time is authorized.
