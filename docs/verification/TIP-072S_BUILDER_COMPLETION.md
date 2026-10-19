# TIP-072S Builder completion — full preserved-period replay

Date: 2026-10-05. Status: BUILDER_READY_FOR_INDEPENDENT_REVIEW, offline only.
Frozen contract: TIP-072S_FULL_PRESERVED_PERIOD.md SHA-256
48646058ef6adc30cb0829774f8c89d5e66fcfe4a122237e17de696cf1d0e599.
Main clarified the actual speed threshold as r*U/[d*(L-eta)] and resealed the
contract before acceptance. The original a4334ad... contract is superseded;
the executable's named actualSpeedThreshold is absolute, not v/U.

## Delivered scope

Only three new owned files were created; no existing source/test/configuration,
manifest, handoff, archive, admission predicate or runtime authority was edited.
The two product/test pins are:

- scripts/research/lrc-full-period-replay.py:
  557181c0788421f9553cb8810b8debb1ec08372c9779aa28f87bb4ce8fb9dae7.
- tests/research/test_lrc_full_period.py:
  afd70b98e8dbb36d8e286fc1b4c5430569af12b929e0211ba1f2c91229331b56.

The diagnostic computes the actual minimum of every reduced-lower witness
distance. L=eta and radius0 are legal. Every one of the five candidates is
retained, with the complete named18-column table; selection is min(D,index).
No caller witness/verdict/certificate admission exists. Failed gates remain
UNKNOWN, and original observations are not transformed into accepted witnesses.

Seven frozen CLI cases produce six accepted sufficient gates and one UNKNOWN.
All880 original/successful matrix coordinates and all60 lower distances remain
in output, with all35 candidate records and complete deterministic contexts.
The first five cases defeat every old primary-only sufficient gate, even using
the actual lower margin. Two original grids have BAD masks covering all indices.
Case6 handles q=1,000,000,007 without enumerating its orbit; the largest exception
fails while the smallest-index zero-distance candidate succeeds.

Whole-report deterministic body digest:
4afb7cf0818eb41f6a2d3d085b1290483c97177e909cebdc1b9f47a050804548.

## Output and resource design

First full-report attempt refused with OUTPUT_REFUSED and no positive JSON.
Its repeated case definitions alone occupied33,540B. Main approved only
definition deduplication: fixed report has top-level scope and candidateColumns;
all cases use exact scopeRef=body.scope and
context.candidateColumnsRef=body.candidateColumns. Standalone derived certificates
retain their full definitions. All arithmetic data remain untouched; the whole
body digest binds definitions and references. These references are fixed program
output, not an external schema/certificate admission facility.

Caps remain5s /2,000,000 charged steps /32,768 complete JSON bytes /256-bit
rationals, actual positive integer speeds<=10^12. One budget covers all cases,
input validation, geometry, matrices, size preflight, digest and serialization;
it is never reset. Exact JSON size/work is preflighted before whole-tree encoding.
The final metrics serialization is conservatively prepaid by36,864 steps, then
its size and deadline are checked before stdout. Oversized values fail loudly.

Native gcd work is conservatively charged by bounded operand-bit squares before
execution; modular inverse is charged twice the squared maximum operand bit size
before pow. Speed-cap operands have<=40 bits. Canonical rational gcd reserves
256^2 steps before execution. No range/loop scales with q,g or a speed value:
matrix loops are exactly five shifts and validated13/14 coordinates, candidate
loops exactly five. Charged steps are diagnostic accounting, not a runtime or
cryptographic CPU attestation. Interpreter/host signatures are not supplied.

## Fresh Builder verification

Command: python3 -I -S -B tests/research/test_lrc_full_period.py.
Final frozen test run:33/33 unittest methods PASS,1.398s. Thirty flag-fault
subtests and three option-fault subtests are not inflated into the method count.
Tests reconstruct the complete seven-case canonical body independently of product
functions; small-q nearest distances are independently obtained from closed
safe-arc endpoints, not product's gap-distance helper. Arithmetic reconstruction
is separate from the written theorem and external novelty/peer review.

An earlier test-development run had one error and one failure: the negative-ceil
fixture was itself an unsafe precondition, and the AST control wrongly rejected
range(n) where n is the validated13/14 coordinate count. Corrected the test-only
fixture to9/50 and admitted only literal ranges or the validated name n; no
mathematical product failure was concealed. Final source/test pins above are
the exact accepted-test inputs.

Before independent freeze, Main caught the named beta field storing ||z|| rather
than the proof's phase-scaled beta=||z||/q. Corrected source and independent
oracle to retain beta=||z||/q and D=max(0,r-beta)/(dv). All mathematical distances,
selected candidates and witnesses were unchanged; digest and pins changed as
expected. The final run below uses only the corrected declared field semantics.

Separate fresh inspected-byte child:
- Python -I -S -B -c executes inspected pinned source bytes, with minimal six
  OFF flags, empty stdin, shell=False, timeout5s, pre/post source bytes unchanged.
- Exit0, stderr0B, stdout30,406B including newline.
- Arithmetic elapsed13.447125ms; charged operations829,460.
- Process elapsed48.966833ms; all counts/digest as above.
- AST parse2/2 PASS. CLI has no options, paths or custom input; all six flags
  must be exactly the string false. Nonempty stdin is never read and cannot
  alter fixed cases; no filesystem/network/process/DB/provider capability exists.

Zero-slack, q1 special case, even/odd center lower ties, endpoints/equality GOOD,
negative ceil/inverse, standard threshold table, input/canonical/resource/output
refusal, normalized whole-tuple gcd and misleading raw-g controls are covered.
No cached Python files are generated by -B. Next build/type/lint not run:
Python/docs-only additive scope, no Next/TS/UI/dependencies changed.

## Requirement accounting and limits

S1 mathematical derivation supplied to Main; exact constructive code ready.
S2 normalization data and imprimitive control ready; written proof/novelty review
owned by Main/reviewer, not claimed accepted by Builder.
S3 complete bounded diagnostic delivered. S4 fresh33/33 Builder methods PASS.
S5 independent reviewer acceptance PENDING. S6 Main final acceptance/inventory
PENDING. Existing seven unlisted contractor artifacts are outside Builder scope;
no unrelated resealing/deletion performed. No project100%/green claim.

Unsigned local diagnostic only: agentLoop NOT_RUN, executionAuthority false.
No browser/UIE2E, native agent job, M1/campaign, scientific-case write, provider
API, DB/session, private capture, Git write/commit/push, billing or deployment.
Global LRC, whole archived branch, formal verification, external adjudication,
literature novelty and mathematical breakthrough remain NOT_ESTABLISHED.
