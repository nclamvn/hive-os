# TIP-075B — Whole-G certificates, not more isolated branches

Date: 2026-10-05. DESIGN_ONLY; proposed implementation, not implemented.
Root: LRC_P139_REPRODUCTION_075. Scientific mode: REPRODUCTION.
Target: J(13,139)=empty via G/C/T/B. Current G/C/T/B: OPEN (0/4).
Human approves this design/review stage only. New execution grants: ZERO.

## 1. Outcome and why this changes the method

Replace all-or-nothing in-memory trace capture with a complete deterministic
event stream, durably cut at grammar boundaries. A separate small checker
reconstructs every state from the mathematical definitions and rejects missing
work. Segments support interruption, not selective proof: only a fully checked
stream and exact final UNION can close G. C/T/B require later separate releases.

The next proposed research milestone (NOT a current execution grant) is
independently accepted WHOLE G, not another
conditional lemma, family, local candidate or percentage. This design is not
evidence that G is feasible within any particular limit, that the paper is
independently reproduced, or that the method solves global LRC14/15.

### Frozen observations; no extrapolation

Epoch1 whole attempts1/2 stopped at3493 nodes,52/409 roots under an operation cap.
Epoch2 attempts3/4 stopped at2,500,000 SEARCH_NODES,298/409 roots at size12,
rootIndex298/private[1,3,6], about37–39s; encoded trace6,284,462B.
Neither epoch exported partial trace/support/data. There is NOTHING to resume
at298, no verified prefix, no accepted empty dataset and no tau139 bound.
Cumulative attempts FOUR, preserved. Future generation must start from genesis
or a newly generated, independently verified complete prefix of this new format.

Paper/source counts (including5,265,810 source nodes) are SOURCE_ONLY, from a
different implementation. Not a lower bound, cost prediction, expected row count
or admissibility premise for our algorithm. Unknown whole trace/data sizes remain
unknown. Segmentation does not authorize larger TOTAL caps.

## 2. Mathematical contract (R1)

Universe T={1,...,69}, speed classes V={1,...,69}, p=139, divisor14, target13.
Define M(v)={t in T : 14 min(vt mod139, -vt mod139)<139}.
STRICT inequality; all9 residues1,...,9 are bad for v=1. Each M(v) has9 times.
This is the level-one nonzero residue-cover domain; zero classes and higher
prime-power lifting remain outside G and belong to later C/T/B premises.

G output is the sorted DISTINCT set of lexicographically minimum unit-orbit
representatives of ALL sorted13-entry MULTISETS over V whose masks cover T.
Multiplicity is preserved. No distinct13-support restriction, no tau assumption.
An empty or nonempty G output is allowed by specification; row count is derived.
G is exhaustive generation of this set, not a claim the set is empty or J empty.

### Why409 roots suffice, without a source theorem

Every covering multiset has an inclusion-minimal DISTINCT covering subset S.
For s=|S|,9s>=69, hence s>=8; s<=13. Let U count times covered by exactly one
member. Total incidences9s>=U+2(69-U), hence U>=138-9s. Minimality gives every
member at least one private time. Some member has at least
q(s)=max(1,ceil((138-9s)/s)) private times: q=9,7,5,4,3,2 for s=8,...,13.

Choose that member v, multiply speeds by v^{-1} mod139 and fold signs; multiply
times by v and fold signs. This bijection sends v to1 and its private times into
M(1)={1,...,9}, preserving covering/minimality. Thus one q-subset P of M(1) is
private to1. Each root searches size s, selected{1}, candidates excluding EVERY
speed whose mask meets P. Enumerate s ascending, P lexicographically, ALL
binomial(9,q) roots:1+36+126+126+84+36=409. Root families may OVERLAP; they are
not a disjoint partition. Exact canonical support dedup handles overlap.

### Tree coverage and prune soundness

State = selected ordered distinct list, remaining available classes, slots and
rootP. Recompute covered as UNION M(v); private(v)=M(v) minus UNION other masks.
Do not trust cached covered/private fields. Fixed prune priority:

1. Any empty private: impossible to extend to a minimal cover (private only shrinks).
2. slots=0: covered=T is a leaf; otherwise noncover leaf.
3. covered=T with slots>0: no minimal larger cover; or uncovered>9slots;
   or fewer available than slots: impossible completion.
4. Available-mask UNION misses an uncovered time: impossible completion.
5. Sum of largest slots individual uncovered gains is too small: even overlap-free
   upper bound cannot cover the uncovered set.
6. Otherwise choose uncovered time minimizing (number available coverers, time).
   Options = all available coverers, ascending. Child for option v removes v and
   all EARLIER options from available, not later options or nonoptions.

Every minimal completion must cover the pivot. Its least included option gives
exactly ONE child: this is the within-root partition proof. At every event the
checker rederives the first applicable prune/pivot/options; producer choice of a
weaker prune, skipped sibling or transplanted valid subtree is rejected.
Canonicalize each leaf under ALL69 folded units by direct scalar arithmetic.

### Extension completeness and exact UNION

After ALL roots for a size, derive the sorted canonical DISTINCT minimal support
table, including empty tables. For every table index in order, enumerate all
nondecreasing extras from V of length13-s, lexicographically. Length0 has ONE
empty extension. Canonicalize support+extras; emit EVERY extension, including
duplicate images. Only final UNION deduplicates. Count per support is
binomial(68+13-s,13-s), derived rather than assumed.

Any original covering13-multiset contains a minimal S. Normalize S, append its
remaining entries transformed by the same unit, then canonicalize: its orbit is
emitted. Conversely every emitted extension contains a covering support, hence
covers. Thus equality follows, not just sound membership. Checker compares final
sorted DISTINCT data with the exact set it derives from ALL extension events.

## 3. Modules and trust boundary (R2/R3/R7)

Proposed separate OWN code files, versioned alongside frozen075A, never overwrite:
generator-v3 (optimized); checker-v1 (scalar/SET, explicit typed comparisons,
no assertions as security checks); fixed offline host-v3 (lifecycle/resources).
No checker import/exec of generator, host shared validator, author code or source
data oracle. Sharing stdlib primitives and the published format is permitted;
sharing semantic helpers or expected outcomes is not. Separate reviewer authors
the checker/controls in BUILD phase. Future pinned source review is still required.

Threat model: corrupt or coherently rehashed producer outputs/checkpoints,
accidental omission, forged counters and interrupted pinned local processes.
Local host/OS and isolated single-writer evidence root are trusted for admission
and lifecycle accounting. Cryptographic hashes authenticate neither mathematics
nor an adversarial privileged host. Concurrent hostile filesystem mutation and
hard OS RSS containment are NOT supplied by075A helpers or this document.
Future host must retain opened directory/file descriptors, reject links/nonregular
files and use single-writer locking; if that cannot be demonstrated, STOP. Local
storage is not a signed remote attestation or multi-tenant security mechanism.

Checker first checks bounded format/pins, then derives mathematical semantics.
Offline verified evidence does not authorize agent execution, source reseal or
runtime admission. Runtime integration remains SOURCE_REFUSED pending its own
authenticated source/auth/lease/replay/G2 release; no Markdown-to-live shortcut.

## 4. Format and safe cut contract (R2/R4)

New format ID WHOLE_G_P139_SEGMENTS_V1, NOT silently LRC139G1 acceptance.
Fixed domain/premises, algorithm/format ID and independent checker version pinned
in a campaign header, together with root, successor-epoch ID (UNGRANTED), original
history hashes, approved numeric envelope digest and producer/host/checker SHA.
Only bounded canonical ASCII JSON metadata with exact keys, typed integers (bool
not int), unique keys, no nonfinite values or paths/code/unknown tags accepted.
Byte blobs are separate raw fixed-format files, not an unbounded base64 JSON.
Exact field and byte limits become part of frozen BUILD format; until specified
and tested no executable-format/release claim is made here.

### Logical event stream

Keep075A root header244, deterministic node tags0..6, root footer245 and extension
246 as semantic events. The logical prologue occurs ONCE. Root footer node count
and byte length count the logical root payload across segments, not wrappers.
Any finite-width field overflow REFUSES; no wrap/truncation. Introduce typed
SUPPORT_END, SIZE_END and FINAL_END records with counts/digests/table identities; these are
cross-checks, not evidence replacing replay. No arbitrary producer-chosen jumps.

Phase ordering is exact: for each size, SEARCH all its roots -> SUPPORT_FINALIZE
and SUPPORT_END (the derived sorted table) -> EXTEND all that table's indices/
extras -> SIZE_END (all extensions for this size finished). Empty tables still
emit both barrier records, with no extension events. After the last SIZE_END,
FINAL_UNION merge/comparison -> FINAL_END -> TERMINAL. These logical transitions
are not optional producer declarations and cannot skip a remaining iterator.

A node event includes its full pivot/options when applicable. The next required
event is mechanically determined: child node, sibling node, root footer, support
table closure/extension, next root or terminal. All root footer/phase counts are
independently accumulated. Complete leaf event includes finishing canonical
support insertion before publishing its cut. Extension event similarly includes
finishing its canonical image and UNION insertion. Table closure/sort is an
atomic barrier; bounded external sorting may refuse before publication, never
declare a half-merged support table closed.

Safe cuts are AFTER whole semantic events and state updates, including within a
root with pending siblings. Never cut inside an event or while a leaf, extension,
merge or root footer is only partly validated. Checker consumes framed events,
reconstructs an explicit DFS stack (depth<=13), including per-frame remaining
options and next-child index. No recursion continuation/pickle/code serialization.
Serialized producer stack is only an untrusted hint and may be omitted entirely.

### Segment identity and chain

Segment descriptor exact fields: format/header digest; segment index; predecessor
commit digest (genesis for0); payload length/hash/event count; start/end logical
cursor digests; support/run snapshot digests; charge/start-record identity.
Payload may contain many complete events, never an empty segment. Its typed
start/end cursor identifies phase, size, rootIndex/P, DFS stack/next-child, or
extension support index/extras rank, plus counters/root offset; hashes are over
the canonical fully specified cursor representation. Final cursor is explicit
TERMINAL with no pending stack/root/extension. The producer does NOT define the
expected cursor: checker computes it from its prior verified state and events.

Checker validates header, exact contiguous segment indices and predecessor,
then parses payload expecting the unique next event. Start/end snapshots must
equal reconstructed state. Duplicate/overlap/reorder/orphan/subtree swap cannot
be hidden by recomputing hashes. Artifact listing is NOT the committed manifest;
every manifest entry must be consumed exactly once, every admitted run/table must
be referenced; unreferenced files are quarantined and storage-charged, not evidence.

## 5. Durable publication and resume (R2/R4/R5)

The proposed host holds an exclusive evidence-root lock and checks pins/envelope
and all predecessor records before work. Use create-only start records BEFORE
spawning any producer/checker. Reserve the entire admitted invocation quota in
the durable ledger first, with a UNIQUE invocation identity bound to campaign,
attempt slot and predecessor commit. Reservation is itself durably create-only
and fsynced before START. A crash between reservation and START leaves that
identity/attempt slot occupied and its full quota spent; do not refund or reuse
it. STOP for bounded reconciliation, preserving the orphan reservation. No
concurrent writer, unreserved process admission, changed source or automatic retry.

Publication order: bounded staging writes -> fsync each blob -> validate lengths/
hashes -> create-only segment descriptor -> fsync -> atomic create-only commit
record linking all bytes -> fsync directory. Commit records reference predecessor
and start. Atomicity requires actual filesystem controls/fault tests in BUILD;
ordinary overwrite/rename-to-existing is forbidden. Staging may be incomplete;
without a valid commit it is NEVER an accepted prefix. Every failure/start stays.

Committed segment initially CAPTURED_UNACCEPTED. Separate checker invocation
returns PREFIX_VERIFIED only after semantic replay up to that cut. Exact
generator state is reconstructed from the verified events/tables, not loaded
from producer memory. On checker process restart, independently replay the
ENTIRE committed prefix FROM GENESIS under the total replay budget; do not trust
a saved verifier frontier, even one bearing a valid hash. A trusted long-lived
checker may keep its own state in memory while the same pinned process lives.
Replaying old events consumes fresh resources and cannot reset totals.

Every committed tail must be replayed before continuation, including a tail not
yet independently verified. It cannot be silently dropped and replaced from an
earlier verified cut under the same chain/campaign. An invalid committed tail
REFUSES that chain: preserve it and all charges, STOP for reconciliation; any
new genesis/campaign requires separately authorized routing and retains the
whole-attempt history. Uncommitted staging is never a substitute for this tail.

Generator restart must reproduce state from the committed prefix (including all
canonical support/UNION data), compare it to the separately reconstructed checker
cursor and append only the next event. This replay is separately charged, not
free search. Host refuses resume if it cannot obtain a fresh pinned semantic
prefix verification or if budgets cannot cover reconstruction. Lost/torn state
stops; do not use298 diagnostic, file names, source counts or an old receipt as
replacement mathematical evidence. Version change invalidates reuse under this
contract until separately reviewed; no implicit migration.

### Crash cases

Before durable start/reservation: no child may exist. After start, before any
commit: invocation charged, no new verified prefix. Blobs without commit:
quarantine, never replay as admitted evidence. Commit without checker verdict:
captured only, replay required. Checker verdict before its durable receipt:
no stored acceptance, replay again. Missing terminal invocation receipt: charge
full reservation and STOP for reconciliation, no inferred success or retry.
After FINAL_END: still require entire independent verdict and exact UNION check.
No human-readable “complete” field alone closes anything.

## 6. Dataset/support storage and bounded replay (R1/R3/R5)

Produce fixed-width sorted-run files for canonical supports (widths8..13) and
final rows(width13). Runs/table snapshots are untrusted; checker derives its OWN
support and extension runs from parsed leaves/events. Each merge checks sorted
strict uniqueness/range/width and equality to reconstructed runs, not just hash.
No producer run is adopted as checker state. Allow disk-backed bounded merges,
charged temporaries, descriptors and open file count; refuse when quota exhausted.

At SUPPORT_END, exact equality to the independently derived support table BEFORE
extensions can start. At SIZE_END, verify that this same table's entire extension
schedule is consumed and its bound identity unchanged. At FINAL_END,
stream equality of sorted DISTINCT final table to the checker's reconstructed
UNION, with no trailing row/byte. Recompute orbit representatives directly over
all69 units; do not sample. Zero rows allowed ONLY if replay proves no extensions
at all and exact table equality. A count or hash agreement is not equality proof.

Checker resource needs include69x69 scalar relations, reconstructed stacks,
private SETs, candidate-option ordering, external support/UNION sort, checksum/
parsing overhead, entire-prefix restarts and final comparisons. No presumption
that075A128MiB or2MiB data caps suffice for this implementation. Tool correctness
remains empirically tested plus independently reviewed, not formal verification.

## 7. TOTAL resource contract and historical accounting (R5)

This section defines the required fields, NOT approved numeric values. Execution
is blocked until a concrete reviewed envelope is directly human-approved. Keep
old2.5M/120s/8MiB/2MiB facts historical; do not reinterpret them as segment quotas
or multiply them to grant unlimited computation. No suggested8M-node authority.

Future envelope must bound ALL of:

- producer search/reconstruction node-visits TOTAL across started invocations;
- checker semantic node/event visits TOTAL, including all prefix replays;
- cumulative producer and checker elapsed-time reservations separately, host
  publication/validation total elapsed allowance, per-process hard timeout;
- started invocation count, retries (none automatic), segment count, event count,
  extension count, source/metadata/stdout/stderr bytes and diagnostic allowance;
- total bytes written including staging, failed/orphan runs, checker runs and
  merge copies, plus live disk high-water/file count/open descriptors;
- per-process accounted memory/concurrent peak, host allocation allowance;
  any claimed hard OS memory/CPU limits require actual separately reviewed setup.

Conservative admission rule: reserve and PERMANENTLY CHARGE the FULL invocation
quota before spawn. No refund based on producer counters or a crash. Successful
early stop also spends that reservation: measured actual cost is telemetry only.
This intentionally wastes allowance rather than trusting forged counters. Parent
host enforces bounded pipes/time/writes; pinned child cooperative node accounting
must be independently tested. This is NOT a hard OS node-operation sandbox.
Aggregate charged reservations cannot exceed approved TOTAL. Every generator
resume consumes an invocation slot under the same root; it is not a free retry.

Lifecycle history has separate immutable dimensions: old whole attempts1..4;
future campaign ID; started invocations; mathematical event-prefix progress;
resource charges. A future campaign starts as cumulative whole attempt5 if
approved, with continuations charged as invocations; a restart from genesis or
changed candidate starts another whole attempt, never erases5. Limits on BOTH
campaign attempts and invocations must be approved. TIP/segment rename cannot
wash any dimension. Failed started work remains visible even without output.

Total budget exhausted or ledger missing/ambiguous -> NOT_ESTABLISHED/STOP,
retaining prefix evidence without converting it into G. Continuation beyond it
requires explicit human revision preserving all previous charges/attempts.
Numeric envelope must include terminal bounded refusal/reservation storage; if
no capacity for a start record exists, do not spawn. Expensive reconciliation is
work with its own reserved quota, not an unbounded exception path.

## 8. Verdict and release sequence (R6/R7/R8)

Allowed verdicts: REFUSED; CAPTURED_UNACCEPTED; PREFIX_VERIFIED_G_OPEN;
WHOLE_G_VERIFIED_CTB_OPEN. A timeout/crash/incomplete tree is NOT_ESTABLISHED,
not a counterexample or empty result. Whole-G acceptance requires all409 roots,
all required events/tables/extensions, terminal empty frontier, exact UNION and
separate pinned checker verdict bound to the entire manifest/header/history.
No reviewer/model vote can substitute for the checker. False positives in tiny
controls block release; successful controls do not close p139.

Gate order:

1. This DESIGN with independent hostile review + fresh reader. No computation.
2. Separately approve BUILD_ONLY: new producer/checker/host and bounded tiny
   controls/fault injection only; exact binary framing/metadata/safe-cut semantics
   frozen, old075A untouched. No whole run or live integration attached.
3. Independent BUILD review and Main inspection: soundness proof, all negative
   controls, parser/durability/accounting evidence; pins freeze. Refuse hidden
   shared oracle or template-only checker. Numeric whole envelope still pending.
4. Approve concrete TOTAL generation+replay+storage/host envelope and number of
   attempts/invocations; dedicated immutable amendment binds frozen sources.
5. Authorized whole generation/capture and independent replay. If incomplete,
   report precise obstruction and STOP at envelope; never switch to local theorem.
6. Only WHOLE_G_VERIFIED enables proposing later independent C/T/B implementation
   and releases; these are NOT granted here. Whole J proof needs all four.

Evaluation records: exact accepted G data and full certificate; derivation/control
coverage; failed starts, costs/replay overhead and refusals; source comparison
with provenance (different counts not automatically an error); G vs C/T/B vs
whole J vs global14/15 vs novelty. A future controlled method comparison is a
separate experiment, not automatically granted here. Value is reproducible
exhaustive verification and ability to reject incomplete evidence, not number
of UI panels, passing tests or iteration count. No breakthrough promised.

## 9. Design walkthroughs and implementation acceptance debt

A1: replay root schedule and each subtree; support barrier then exhaustive extras;
final exact UNION and empty frontier. Only then G verified.
A2: node6 opens options; cut after its event or a finished child. Checker stack
keeps next sibling. Restart replays prefix; resumed node must be that sibling.
A3: coherently rehashed omission fails next expected event, table/UNION equality;
fake prune fails independently derived first applicable condition.
A4: exact predecessor/index + reconstructed next state rejects overlap, duplicate,
reorder, orphan or a valid tree transplanted to another state.
A5: hashed frontier/counter/table hint is not trusted. Replay rederives it or rejects.
A6: staged bytes/start remain charged; absent commit/verdict/receipt cannot accept.
A7: precharged total reservations bound all starts; spent ledger stops before spawn.
A8: fixed header/pins/history/domain reject cross-scope; old298 has no event payload.
A9: missing roots/extras/tail keeps frontier unfinished: verified prefix, G OPEN.
A10: independent checker refusal/time exhaustion does not admit; zero rows must
follow exhaustive semantic reconstruction, not source expected counts.

These are PAPER walkthroughs, not executed tests. BUILD must specify exact wire
field widths/key limits/event framing and crash atomicity, prove checkpoint
state equivalence, test every cut on exhaustive tiny domains, coherent-rehash
mutations, real bounded pipes/files and ledger corruption/crashes. Whole soundness
requires independent source review; whole data requires later actual replay.
No unfinished specification or resource issue is hidden as a mathematical gate.
