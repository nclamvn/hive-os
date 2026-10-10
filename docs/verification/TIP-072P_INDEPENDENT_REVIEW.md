# TIP-072P — independent mathematical and consequential review

Date2026-10-05. Status SCOPED_OFFLINE_REVIEW_PASS. Reviewer separate from
Builder and Main. No remaining P0/P1 finding was identified in the final written
proof/addendum or bounded Python scope. Only this new report was authored.
Full sealed TIP, addendum, final dossier, product/test and Builder report read.
Vibecode Kit's separate proof/product verification procedure was followed.

## P1–P3: challenged universal arguments

P1 PASS: for independent lifts v_i=w_i+Mz_i, the defect
w_j-2w_i+M(z_j-2z_i) is not an identity. In an affine family a_i+B_i*z,
identity requires a_j=2a_i and B_j=2B_i on a full-dimensional parameter cone.
Finitely many nonidentity pair polynomials cannot cover an integer orthant:
their nonzero product would vanish on the whole orthant, contradicting the
inductive infinite-roots argument. The super-increasing construction with
z_i=4^(i+1), residues0<=w_i<M, also avoids every doubled pair. This does NOT
automatically classify finite prime-digit boxes or extra coupled/canonical
constraints. The M1245 example correctly says its EXCEPTIONS lose the exact
pair; the nine divisible speeds still contain other doubled pairs.

Primary-source check: Allikvere's [§2 and §4.4](https://arxiv.org/html/2609.02604v2)
distinguish finite digit fibers from the third alternative covering every positive
distinct integer congruence lift. Divisibility persists on the relevant classes;
exact speed equality does not follow. Repository modular axes/properness/prime
criterion interfaces agree. Neither the concrete example nor this review admits
an archived improper branch or independently accepts the whole author archive.

P2 PASS: with a,b units modulo d, b congruent to r*a, Delta=b-r*a, the residual
norm beta=||Delta*t0|| is constant under every j/d shift. Each coordinate's
open BAD arc admits at most one grid point when2eta<1/d. Distinct pair BAD
indices would imply
1/d<=||b(k-j)/d||< (r+1)eta+beta<=1/d, a contradiction. Strict BAD admits
threshold equality, negative times and wrapping. This is sufficient, not
necessary; d5/r2/eta1/15 needs beta0, while the stated d3 allowances2/15 and
5/42 were independently rederived. No general density or necessity claim.

P3 PASS: lower speeds must be divisible by d, or their subsequent shift
invariance separately proved. The final dossier explicitly added that essential
premise. Their lower-only largest ACTUAL speed U gives the closed interval
radius(L-eta)/U by1-Lipschitz continuity. For nonzero Delta, distance to
||Delta*t||<=rho is exactly max(0,||Delta*tStar||-rho)/|Delta|; this treats both
signs and closed band endpoints. The worst-phase bound1/2-rho is sufficient,
not necessary. Delta0 is handled separately. U is NOT the maximum of all speeds.
The fixed d5 radius1/(30U) and speed-only condition |Delta|>=15U are correct.
Time locking is to the defect grid, not necessarily the old residue grid;
synchronizing only at h/M cannot newly eliminate a class already NO_GRID there.

## Infinite subfamily and mathematical-only addendum

With lower speeds5..45, exceptions1,2+1245z,3,7,11 and z>=0, tau1/10 is an
explicit lower witness. The z0 exact case and z>=1 dominance proof establish
the LR property for ALL z, independently of executable speed limits or samples.
Independent growth of lower coordinates is not covered: changing45 to1290
preserves the residues/lower witness but defeats both sufficient tests from
that exhibited witness. UNKNOWN here does not imply LRC failure.

The addendum was reviewed before final freeze. For z>=1,
h=floor((z+5)/10), n=25z-h gives nearest phase integer with LOWER tie.
For z1..4 error=z/10; for z>=5 error<=1/2<=z/10. Thus
|t_z-1/50|<=1/12450. At physical shift1, T_z lies in[1/5,5/22]; the five
exception norms are at least1/5 because the second phase equals2T_z, and
the other four interval inequalities are valid across their integer crossings.
Lower coordinates have minimum>=1/10-45/12450=8/83. At z1, speed45 attains
8/83, proving sharpness ONLY for this prescribed witness family. Its slack is
37/1245 above1/15, not generic adaptive slack or tuple optimality over all times.
The infinite proof uses the two parameter regions and interval inequalities,
not finite sample extrapolation. Generic guarantee remains1/15 only.

## P4–P5: independently executed exact evidence

Independent stdlib Fraction scratch code imported NO peer arithmetic/helper.
All six fixed cases were recalculated, including complete5x14 matrices:

| Delta | Nearest integer | Used final time | Full minimum | Gate |
| ---: | ---: | --- | --- | --- |
|0|0|11/50|1/10|PASS |
|50|1|11/50|1/10|PASS, below dominance |
|675|13|148/675|13/135|PASS, closed radius |
|-675|-14|149/675|1/15|PASS, closed radius/equality |
|1245|25|274/1245|8/83|PASS |
|5|0|Original11/50|1/10|UNKNOWN_GATE_NOT_APPLICABLE |

All selected physical indices are1. Signed ties use LOWER integer, not
round-to-even/toward-zero. Both boundary adjustments have absolute value1/1350.
The negative case's speed45 equals1/15 and must remain GOOD. The small-defect
case cannot align inside the interval but its original good indices1 and3 are
retained separately as observed witnesses, not certificates of the failed gate.

Seven separate subfamily calibrations z0,1,2,3,10,100,1000 reconstructed490 full
matrix coordinates/98 selected coordinates with no violations. Their minima
are1/10,8/83,8/83,8/83,1/10,1/10,1/10. These are finite checks ONLY, not the
universal proof basis. Signed tau, primitive/nonprimitive scaling and reordered
pair labels are covered by the final suite without adding a gcd1 premise.

Final frozen unittest run: **36/36 methods PASS**,1.208s, exit0, all six execution
flags OFF; no Python cache writes (-I/-S/-B). The thirty flag-fault subprocess
subtests and seven z samples are NOT added as extra unittest methods.
An early pre-freeze run overlapped Builder edits and correctly failed the stale
source pin (33 PASS/1 FAIL); this was superseded by the final36/36 run, not
treated as acceptance or suppressed.

A separate fresh fixed CLI process, with exactly six OFF flags and no inherited
environment, stdin DEVNULL, shell:false and5s timeout, produced exit0/empty
stderr. Product bytes were hashed before AND after. The reviewer independently
rebuilt EVERY mathematical body field, case context, scope and all770 retained
matrix coordinates (6 original matrices +5 aligned), not just counts/digest.
Complete canonical semantic comparison PASS:

- Full stdout20,211B including newline; canonical body20,067B.
- Arithmetic elapsed6.135417ms; observed process wall39.878083ms.
- Aggregate charged operations88,550, including serialization reservation.
- Semantic digest
  `32f7111e4059850f48d09ea122a5d6cbc4f46ca3250ce426b95055672bef3a1b`.

Metrics/whole stdout hash vary; these are observed runs, not performance promises.
The single5s/2M/32KiB budget and256-bit component guard are unchanged.

Separate independent controls: eleven direct input/resource refusals PASS
(claimed-positive field, false unit/pair/lower/count/type/distinctness/fraction,
subclass and two shared-step limits); subclass hooks invoked ZERO times.
Six additional actual flag-fault processes refused exit2 with empty stdout.
Ten coherent rehashed semantic corruptions were caught by the REVIEWER'S full
reconstruction (ties,U,matrix omission,UNKNOWN promotion,authority/global,
missing case,threshold equality,observed witness omission). This is explicitly
NOT a new product certificate-admission API: the helper accepts bounded actual
inputs and derives results; it never validates an externally supplied verdict.
These controls are not added to the36-method unittest count.

The suite additionally covers output/component/deadline exhaustion, large
metadata before traversal, plain input types/hooks, detached inputs, direct
lower-growth UNKNOWN and all30 actual flag-fault combinations. Product reads
only its six CLI flags, writes no files, runs no process/network/model/DB, and
imports no old mathematical code. Local process consistency is not signed
host/interpreter/source-closure attestation or scientific admission.

## Reviewed final identities and acceptance boundary

| Artifact | SHA-256 |
| --- | --- |
| Sealed TIP |`b3359a453810750e0a66f72b6f4201b301e3114ba3bc65abed40a7e13d764992` |
| Mathematical-only addendum |`31e421eccbdb639298d2f912427543b4be97ef536def810b0177ef1c18505f10` |
| Final written proof |`7c33eed92c999d18e1acfcda8748c5f88d2cbb6316166f68422c797b49182be6` |
| Python product |`de32c661d4d7c06fd4964c2e202f998de253ab4fe07bec50e053cd1e532ad622` |
| Python test |`f3b7953503a22928a15f373536bfc202681a4fb87c5abc61779c77139ac49c39` |
| Builder completion |`8a8855dde6e0d8cbb6073d43f001503d2e2399939c5043eb8d93e1ab3ce64db3` |

P1–P5 PASS in the sealed offline scope. P6 independent review complete;
Main owns whole historical46-suite/1917 regression, types/lint, preservation/
prefix/HEAD checks and final acceptance, not self-certified here. Main reported
those regression/types/lint checks PASS. Build SKIP is appropriate for only
Python/docs additions; the prior072O build is not a newly executed build.
No Next.js/TS/UI/assets/config/dependencies or browser E2E were changed/claimed.

No remaining P0/P1 in reviewed scope. Full072 remains PARTIAL/NOT_READY_FOR_M1.
Actual phased durable replay, CAS/current native ownership/source closure,
authorized private capture, human G2 and a fresh M1 remain deferred.
Global/formal/external/novelty/whole-branch/breakthrough NOT_ESTABLISHED;
agentLoop NOT_RUN, executionAuthority false. No old assertion/refutation or
ledger/registry/source ceiling/064 status was changed. Reviewer performed no
DB/session/provider/API/model/Codex-child/private-root/case/job/M1/campaign/
archive/envfile/schema/install/Git write/billing/deploy action.
