# TIP-075E — local release authority and streamed worker contract

2026-10-05. Standalone trusted-local OWN code only, not live source/auth/lease/G2.
Resource contract SHA256
3da8f104d04bbfecb4e2a62d034a3c48802b032d1a59e0b84f91fc0c2db3864a.
Predecessor Main SHA1b9fe5424e499ac0dcb7c7f8b4d40240755a739379044027aab9f9e23a181e1f.
No numerical ceilings or mathematical event/cursor semantics changed from075D.

## Namespace-bound pure cores

NEW producer Engine and checker Verifier retain tiny APIs, add
profile='P139_RELEASE', release=None to the existing constructor. Full admission
requires a private identity and a trusted pinned-host gate injected at module
execution under `_PINNED_HOST_RELEASE_GATE`; normal import has NO gate. Capture
the injected function once, remove bootstrap namespace key, never accept a public
boolean/dict/profile/header/declared caps/flags as that identity. Before Budget,
clock/masks/core, gate receives `(release, request)` and returns an exact binding.
No exported enable setter or capability minting method in either mathematical
module. Arbitrary Python namespace/private-name mutation is outside this profile.

request exact keys: profile,domain,action,limits. Domain exact{prime139,divisor14,
target13}; action GENERATE for producer or VERIFY for checker; limits fixed FULL
engine ceiling or exact lower-only complete schema. Gate checks private identity
and coherence with its captured authenticated phase; core independently checks
returned binding shape/types/fixed domain/root/mode/G/action/attempt5/prior4/
resource contract digest before effects. Binding exact keys:
root,mode,obligation,domain,attempt,priorWholeAttempts,grantSha256,
resourceContractSha256,releaseReviewSha256,sourcePins,headerSha256,
reservationSha256,startSha256,phaseId,action. Digests lowercase64hex; sourcePins
exact producer/checker/host. Strings/mapping alone do not install a gate. Do not
embed a source's own final digest into that source. HOST owns source authentication;
cores own independently derived mathematical truth and fixed resource ceilings.
Bound labels copied into owned immutable/defensive state for final verdict, not
re-read from caller metadata. Tiny cannot receive/use a release identity/fullcaps.

Full constructor derives and checks n69,m9,lower8,sizes8..13 and409root schedule;
checker independently counts every completed root per size and verifies derived
schedule at finish, never trusts a declared or author expected rowcount.
finish_verified full result preserves keys status,semanticVerified,wholeGrant,
wholeAttempts,rows but status WHOLE_G_VERIFIED_CTB_OPEN, grant1, admittedattempt5.
Terminal and same-cut independently derived TABLE/UNION equality through BOTH
EOFs mandatory. Empty full G is neither expected nor rejected by premise.
Tiny remains TINY_G_VERIFIED_CTB_OPEN/4/0. Prefix never full; C/T/B/J/LRC stay open.

## Trusted operator grant (not an automatic issuer)

Default CLI and public tiny APIs never open full execution. Separate host APIs
`create_release_session(expected_grant_sha256)` and
`advance_release(expected_grant_sha256,max_events=40000000)`;
`inspect_release_session(expected_grant_sha256)` is deliberately fail-closed:
it validates digest shape, then refuses BEFORE clock/files/authority reads. A
positive durable full inspection is DEFERRED because the four-phase ledger has
no honest separate inspection debit. Only already charged `advance_release`
results observe a full session; tiny metadata inspection is unchanged. No caller
directory, cap override, second attempt or migration argument. Fixed authority file
`artifacts/research/lrc-p139-attempt5-grant.json`; fixed evidence directory
`artifacts/research/lrc-p139-attempt5`, resolved relative to THIS repository root.
Require exact canonical absolute evidence path in grant; no follow/symlink/alias.
All source/authority paths owner-checked regular single-link bounded files.

Grant canonical ASCII JSON <=65536 bytes, exact schema:
format='LRC_P139_LOCAL_GRANT_V1', status='EXECUTION_GRANTED',
root='LRC_P139_REPRODUCTION_075', mode='REPRODUCTION', obligation='G',
domain={prime:139,divisor:14,target:13}, priorWholeAttempts:4, attempt:5,
maxWholeAttempts:1, grantId (32 lowercasehex),
approval={channel:'human-user-message',reference:boundednonemptystring},
releaseReviewSha256, resourceContractSha256 (fixed above), sourcePins
(exact current producer/checker/host SHA256), engineLimits (exact FULL engine),
limits (exact FULL host), evidenceDirectory (fixed absolute path).
No unknown keys/type aliases/noncanonical/duplicate JSON, pending approval,
replacement/grant mismatch, cap decrease/raise, stale source/review/resource pin
or wrong fixed path is admitted. Trusted expected_grant_sha256 is mandatory from
the explicit operator command; grant JSON cannot authenticate its own digest.
Contractor only creates the real authority file after actual direct numeric human
approval AND independent frozen release review. No auto-issuer/`approved=True`
fixture-to-real promotion. Pin binds integrity/command, not a cryptographic human
signature; same-UID privileged alteration/deletion is outside threat profile.

Actual source bundle, fixed resource document and fixed Main release review
`docs/verification/TIP-075E_MAIN_COMPLETION.md` must match grant before session
claim/child startup. Review/resource reads bounded65536, source131072 each,
charged before effects under shared limits. Conservative creation read charge at
first AUDIT includes all three fixedsource units plus three authority metadata
units (3*131072+3*65536), including EOF probes as needed; implementation may
conservatively charge more inside SAME phase read cap, never skip these costs.
Each advance reconciles fresh authority reads with bootstrap charges. Full
inspection cannot read even metadata, blobs/hash complete prefix or reuse an old
semantic result. Never introduce an unlimited outside-TOTAL observation budget.

Creation has a conservative10s cooperative deadline, checked before and after
durable genesis publication. Every full advance debits fixed10s from its bootstrap
scan deadline BEFORE authority reads (at most110s remain), including later advances
as a conservative lower-only restriction. Thus the first permanent132s AUDIT
reservation covers creation10+scan110+terminal12; caps/schema stay unchanged.
No persisted wall-clock timestamp or restart-based refund. Blocking fsync is not
a hard wall-clock guarantee; late acceptance is refused on return. A fully durable,
canonical, source-bound genesis after abrupt process interruption still consumes
admitted attempt5, not an actual engine start. Incomplete/noncanonical genesis is
STOP. Neither case permits creating another claim or automatic retry; continuation
requires the explicit bound operator command, never self-repair.

The fixed evidence directory's create-only/fsynced header is the durable attempt5
claim. If directory exists with anything, header exists, creation fails or old
claim is incomplete, STOP and preserve it; never reinitialize/newpath/copy/repair/
retry/refund. The claim consumes the one grant BEFORE whole semantic effects;
admission counter5 is distinguished from observed engine starts/completion.
This reuses genesis file1/65536 allowance, not an unbudgeted registry. Directory
creation itself must use safe owner/no-follow components; refuse nonempty foreign
paths and retain failed claim. Empty owned creation may be admitted only once a
grant is valid; no cleanup of durable research evidence by tests or runtime.

## Session / phase / child authority

NEW sessionformat WHOLE_G_P139_RELEASE_STREAM_V3; magic LRC139S3/O3 with same
framing/tags/rows. No075Dsession migration or sharing. Header exact075Dkeys plus
authorization, which is None for tiny and the exact full grant binding
{grantSha256,resourceContractSha256,releaseReviewSha256,evidenceDirectory,attempt}.
Tiny history wholeAttempts4/grant0, full admittedattempt5/grant1; both predecessor
075D Main digest above. Context-selected engine/host caps NEVER chosen from raw
header numbers alone. Every header, rowcount, eventcount, blob, quota, reservation,
stream allowance and snapshot check uses the authenticated profile's fixed caps.
No mutation of global tiny ENGINE/DEFAULTS to run full, no sticky authority across
sessions. Normal pattern remains four phases; captured successfulGEN recovery
requires a new reserved VERIFY, otherwise partial/orphan/error ledger stops.

Parent validates grant/header/ledger and permanently reserves/fsyncs quota and
START before spawn. Popen -I-S-B-c runs SAMEcheckedOWNhost bytes then a fixed
owned entry factory with safe repr of bounded canonical startup context bytes.
No auth-FD/new FD budget, source frompath-after-hash, interpolated executable user
strings, full-prefix raw inputbuffer or arbitrary callback serialized in stream.
Private factory validates/captures immutable startup context; public/default
worker has NO full context. Bound context exact keys binding,profile,headerSha256,
reservationSha256,startSha256,phaseId,action,tail,maxEvents,cursor,sourcePins.
binding is the core binding above; every duplicate field must agree exactly.
It binds action, prior tail, expected cursor/maxEvents, current reservation/START,
approved grant/resource/review/source hashes and full header. Full child consumes
mandatory bounded CONTROL then rejects any mismatch BEFORE prefix/source/core.
Untrusted CONTROL/header never installs/mints the startup gate. Parent command
is trusted in this local OS profile; an arbitrary actor executing modified Python
startup code is not contained. Six existing flags exactfalse; live lanes stay off.

After bound startup/control match, child checks current OWN source bytes against
authenticated pins, compiles only OWN role bytes in fresh namespace with gate
closure+fresh opaque identity, and invokes full constructor with that identity.
Closure checks `release is privateIdentity` and exact request then returns captured
binding. No shared semantic helper imported into checker. Child prefix reconstruction
always starts from genesis and compares every event/cursor/streamed row through
EOF. Parent checked quota/header/source/status—not a proof engine or row oracle.
GEN guard full76B/tiny46B before next_event; exact hash/byte/event progression,
commit-LAST and independent subsequent VERIFY unchanged. Positive full terminal
only WHOLE_G_VERIFIED_CTB_OPEN; receipts/inspector never invent J/C/T/B closure.

## Bounded acceptance and remaining authority

Only tiny actual cores/processes in implementation QA. Synthetic valid full
authority paths may exercise bounded file/command admission and mocked fatal
core sequencing in temporary fixtures, never consume the real fixed attempt5
directory or run actual139 masks/search/replay. These are synthetic grant tests,
not an actual granted campaign. Full source/core effects stay absent during QA.
Every temporary authority override is test-owned, not a runtime user option.
All old075D/source37/pins/evidence preserved. Real execution remains conditional
on separate direct numeric human response plus Main acceptance, not this wire doc.
