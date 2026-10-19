# TIP-079 A/C peer source review

2026-10-06. Root NATIVE_POLY19_SHOWCASE_079, ENGINEERING_IMPLEMENTATION.
Verdict: no unresolved P0/P1 found in the reviewed A/C source cut below.
This accepts an ENGINEERING_ONLY foundation for Main's separately controlled QA,
not live activation or fulfillment of 079-R2/R10.

## Scope and independence

Reviewer capability_transport_scan authored TIP079B, not A/C. Main separately
owns B's independent review; this report makes no self-independent B claim.
Main attempted another independent autonomy-agent dispatch, but the thread limit
prevented it. This is a disjoint-ownership peer review, not an external human,
different-model security audit, or mathematical reviewer acceptance.

Read approved079 tasks/frozen blueprint, AGENTS, latest handoff and commitment;
reviewed A authority/source/contracts/store/kernel/worker/checker, migration/RLS,
fixed launcher/installer, C actions/routes/UI/export and focused QA packaging.
Only this report was written by the peer. No product edits, database writes,
model/CLI invocation, browser run, Git operation, historical source reseal or
excluded LRC access/stat was performed. Vibecode's Builder/verify separation
kept implementation corrections with their owners and this peer read-only.
A announced source STABLE; C announced source HOLD before this final cut.

## Material findings raised and resolved

| Priority / finding | Final source evidence and disposition |
|---|---|
| P1 — reader could accept changed actor/source/provenance metadata against unchanged event/state hashes | RESOLVED. [store.ts:88](/Users/os/hiveos/src/modules/research-showcase/store.ts:88) hashes authority fields into every event body; [store.ts:103](/Users/os/hiveos/src/modules/research-showcase/store.ts:103) binds first APPROVED detail, strict ENGINEERING_ONLY manifest/limits, row identities and successful authenticated command payload/hash/outcome before projection. Unsupported LIVE_NATIVE metadata is refused. |
| P1 — crash after ROLE_RETAINED could advance a failed/malformed original before validation | RESOLVED. [store.ts:48](/Users/os/hiveos/src/modules/research-showcase/store.ts:48) leaves nextAction at the retained role; unique ROLE_VALIDATED requires its completed bounded original seal. [worker:164](/Users/os/hiveos/src/server/workers/research-showcase-cycle.ts:164) freshly reads and parses retained originals on recovery before progressing, including POSTREVIEW recovery without provider repetition. |
| P1 — executing job was not bound to the original approved command/outbox | RESOLVED. [worker:28](/Users/os/hiveos/src/server/workers/research-showcase-cycle.ts:28) requires exact outbox ID, tenant/workspace, approval command ID, topic, aggregate type/ID and DISPATCHED status, plus exact canonical run/epoch payload in both job and outbox, before START/adoption. |
| P1 — COMPLETED with explicitly UNKNOWN remote effect could advance | RESOLVED. [worker:106](/Users/os/hiveos/src/server/workers/research-showcase-cycle.ts:106), recovery165 and [store.ts:50](/Users/os/hiveos/src/modules/research-showcase/store.ts:50) refuse UNKNOWN admission; [worker:59](/Users/os/hiveos/src/server/workers/research-showcase-cycle.ts:59) preserves charges/originals and pauses unknown START/effect, rather than retrying. |
| P1 — critical concrete session authenticator missing from source inventory | RESOLVED. [source.ts:25](/Users/os/hiveos/src/modules/research-showcase/source.ts:25) now includes identity audit/errors, auth/index/session/workspace-page and fixed QA/browser config. The concrete session boundary is [context.ts:48](/Users/os/hiveos/src/modules/identity-workspace/context.ts:48), not merely an authenticated caller label. Exact inventory/hash/report admission is [source.ts:57](/Users/os/hiveos/src/modules/research-showcase/source.ts:57). |
| P1 — JSON-escaped credential-bearing string in base64 trace could evade export scan | RESOLVED. [presentation.ts:31](/Users/os/hiveos/src/components/research/poly19-showcase-presentation.ts:31) scans decoded string values recursively; trace canonical-base64/length/SHA and decoded JSONL checks are at47. Analogous original JSON scanning now precedes display/text export at12. No scientific-byte redaction or repair was introduced. |

Other corrected issues: malformed/NaN permit deadlines now refuse
[authority.ts:9](/Users/os/hiveos/src/modules/research-showcase/authority.ts:9);
paused runs can revoke without reopening/refunding; action/service normalized
runId DTOs and their mocks now agree. These corrections were reread, not assumed
from owner reports.

## Boundary checks and trust ceiling

- [kernel.ts:22](/Users/os/hiveos/src/modules/research-showcase/kernel.ts:22)
  guards isolated environment, mission-scoped authenticated request, explicit
  confirmation and reviewed purpose before durable approval/outbox. Native
  authority refuses before new aggregate/source reservation or transport effect.
  Reads/dossiers use tenant transaction plus workspace/mission authorization.
- [worker:23](/Users/os/hiveos/src/server/workers/research-showcase-cycle.ts:23)
  checks current exact job lease/version, actor/run/epoch and lineage;
  active workspace membership and current scoped permission are checked at33.
  Reserved/START/result/admission fences preserve four-request spend. Original
  admission clocks derive from createdAt, not a resumed worker's clock.
  Role timers/current-authority polling are at85–88; checker timer/poll/race at145–151.
  Adoption rechecks source/current authority/deadline. Local termination does not
  attest remote cancellation; stopped/unknown states cannot reopen.
- [checker.ts:18](/Users/os/hiveos/src/modules/research-showcase/checker.ts:18)
  accepts only fixed scripts, bounded certificate and source pins, snapshots exact
  pinned Python source into its own temp file, and executes fixed Python3.14 with
  `-I -S -B`, no shell and minimal environment. Timer/output/abort caps are explicit.
  The trusted host Python Cellar binary/stdlib and installed dependencies are not
  cryptographically attested by this source bundle. Source admission is a reviewed
  repository boundary, not hostile-host isolation or hard RSS/remote-stop proof.
  Exact finite identity still relies on the written irreducibility/projective
  lemma, not formal proof, official score or novelty. Synthetic fault bytes stay
  separately sealed; no replacement of original FINAL.
- [engineering.ts:5](/Users/os/hiveos/src/modules/research-showcase/engineering.ts:5)
  exposes only fixed HOST_ONLY negative controls under exact QA and VITEST=true;
  worker additionally requires an engineering row. No UI/service/HTTP/launcher
  selector accepts them, and no provider/model is called by this seam.
- [action.ts:20](/Users/os/hiveos/src/app/actions/research-showcase.ts:20)
  unconditionally refuses native direct POST. C uses authenticated A services,
  never alternate SQL/CLI/provider selection. Private no-store routes export
  exact original text or the authenticated full source/event/state/trace dossier;
  [presentation.ts:39](/Users/os/hiveos/src/components/research/poly19-showcase-presentation.ts:39)
  enforces retained FINAL equality, bounds and credential refusal without redaction.
  Credential heuristics are not a proof of absence of every possible secret encoding.

## Fresh peer verification

Final command, after A/C held source:

```text
vitest run --project unit tests/unit/research-showcase.test.ts
  tests/unit/poly19-showcase-ui.test.ts
  tests/unit/poly19-showcase-ui-boundaries.test.ts
  tests/unit/poly19-showcase-qa-config.test.ts
84/84 PASS, 4 files (A34 + C50), 10:21:38 local; Vitest378ms, wrapper0.624s.
```

Earlier peer cuts passed17,82,84; reruns are not summed as distinct tests.
Peer focused-check wall time across all four invocations approximately2.287s,
within shared600s ceiling. These were pure unit/mocked-boundary controls, not DB,
Python subprocess, model, browser or native scientific acceptance.

A reports tsc/lint clean and34 own unit PASS; C reports50 own unit PASS and lint
clean. Peer independently read actual SIGKILL fixture/integration source:
20 cases cover authenticated pipeline, append-only/RLS/lineage/refusal, concurrency,
lease/revoke/deadline, reserved/START/retained/replay crash cuts, and fixed
UNKNOWN/malformed/oversize/failed recovery. They are NOT_RUN at this checkpoint,
pending Main's engineering-only bundle; this report does not claim their success.
Browser tests and actual native originals likewise NOT_RUN by peer.

## Reviewed-cut SHA256

```text
authority.ts 48396edf8a362555431558d10b9ec6c5ca749946a2ea630ba13600e9a7ae61e8
contracts.ts 8ec3b5369e495b263a563476e2f64e4bbc238c84638ffcbb0fc6e28622bdd04d
source.ts 3bd05cb16901ad149390022bccbbc921d00bed23e895b24770411415151213de
store.ts 442ff3920055c4420a589654d14d4560a6bb98664f2e6f033875d50594f991c0
kernel.ts 2af42eb2910d9a639cd4c657dc04006b0a61a564dc1e7cfecc451e5d257584af
checker.ts 354b0f0684f293ca29136a550a75c321779a0a5e146dd92705f8fee353725442
engineering.ts 304beee508c0e4298efe4f238016622766c28197efd8b1b93771286667be0c4b
research-showcase-cycle.ts 5294a94ae6f8ef82c3d6e73ce79658a2781506d11d0c54d9f3859f815799132b
poly19-showcase-presentation.ts 116bc0f50374c751fcc212c6b82d2dfc3dedebfccfbc9b1c6a18c3282a5f4afc
research-showcase action.ts 5ad814d34e597a6f36a8a3b796158a16d0876e68ff3c35b666f69e95a739549b
unit/research-showcase.test.ts de9f61ba06bcb6018b37938cd23d566e561f3ac60ad7ef46ef31bea165500f9e
unit/poly19-showcase-ui.test.ts a200012a1cda14cedd2fb3db030ba0cc57d6b8f03671f347ee8d126adfdb8f1e
unit/poly19-showcase-ui-boundaries.test.ts 767ce4b2a6ef0f1ecbe09ac667471ef43305141f48d619dd3537f9f3020591b4
unit/poly19-showcase-qa-config.test.ts 44d14a44d51d1883817af9e406535c0e230146fe215743f12b26f8da1713fd42
integration/research-showcase.test.ts 5b39623021db7a43ca9ac91f639ce0a1acb64c11db07f8dc343bf2c965c4e6b1
fixtures/research-showcase-worker.ts 39abf35391e42cab68b06ea844fa726b202366f2d0b2acf9dcffc5bdbdafa0a8
playwright-tip079.config.ts bb20b1c1b749ddb98005c215abee621975915dcc162c630388717f509f4c7d81
```

STOP peer work at this cut. Main must finish independent source-bundle acceptance
and actual scoped engineering tests. No native enablement: complete pre-effect
all-model-tools denial remains BLOCKED_UNESTABLISHED. 079-R2/R10 remain open;
fixtures, hashes and this report do not close them or authorize a next cohort.

## Append-only R8 delta review — 2026-10-06

Predecessor report preserved unchanged as the first10442 bytes of this file,
SHA256 `4c3555d2fefbbd52c89cc002930b42c3a31ff2f9e78b08eb8defd84a78048283`.
The preceding84-test source cut is historical, not relabelled as this92-test cut.
Main's later R8 review identified an oversize UTF8 boundary defect: shortening an
invalid terminal codepoint changed the retained prefix, while fatal text decoding
could make a faithfully retained binary prefix unreadable through GET. This
addendum supersedes acceptance of that earlier byte/text boundary only.

A and C confirmed the delta STABLE/HELD before the following peer verification.
Scope remained approved079 engineering R8/refusal and adjacent R3 recovery;
Vibecode verify separation kept implementation with A/C. Peer performed source
reads and one pure focused unit command, plus this append-only report edit.
No DB/model/CLI/checker process/browser/Git effects or excluded history access.

### Delta findings and verified result

No unresolved P0/P1 found in this delta. The following are source-backed controls,
not a universal claim that all arbitrary encodings of secrets can be detected.

- [worker:97](/Users/os/hiveos/src/server/workers/research-showcase-cycle.ts:97)
  now stores exactly the first32768 encoded bytes without UTF8 backoff, repair or
  codepoint dropping. The full observed byte count and completeness flags remain
  in ROLE_RETAINED; the bounded prefix is not the entire oversize original.
  Oversize/incomplete results cannot validate or advance, immediately or after
  recovery. Unretained tails are not claimed retained or exported.
- [store.ts:147](/Users/os/hiveos/src/modules/research-showcase/store.ts:147)
  verifies raw original bytes/length/SHA before projection; incomplete originals
  have originalText=null, avoiding fatal text decoding and proof display/adoption.
  Complete originals still use strict UTF8 and unchanged exact text seals. Trace
  bytes are also verified. [kernel.ts:88](/Users/os/hiveos/src/modules/research-showcase/kernel.ts:88)
  exposes exact prefix base64/digest/byte length with complete:false in the
  authenticated bounded dossier, never silently converting it into proof text.
- [presentation.ts:69](/Users/os/hiveos/src/components/research/poly19-showcase-presentation.ts:69)
  binds each incomplete prefix to exactly one retained role/original seal;
  requires one unique entry per incomplete original and rejects omissions,
  duplicates, complete:true, non-null text, unsafe byte counts, changed SHA and
  noncanonical base64. Limits remain4 prefixes/32768 bytes each/base64 length43692.
  JSON exports preserve exact base64 and completeness/validation metadata;
  [presentation.ts:65](/Users/os/hiveos/src/components/research/poly19-showcase-presentation.ts:65)
  refuses incomplete TEXT export. A prefix is never presented as full FINAL.
- Peer specifically required truncated/malformed JSON regressions for escaped
  bearer markers and quoted/escaped password keys; plain regex plus failed
  JSON.parse would have missed these. [presentation.ts:40](/Users/os/hiveos/src/components/research/poly19-showcase-presentation.ts:40)
  now scans a bounded privacy-only shadow: raw and decoded credential markers,
  quoted secret keys, conservative refusal of malformed/truncated Unicode escapes
  and residual backslashes. The same guard applies to incomplete traces at83.
  Replacement decoding is confined to defensive scanning, not scientific output;
  stored/exported bytes remain exact. Conservative refusals can reject harmless
  escaped prefixes; no redacted/repaired scientific alternative is returned.
- [engineering.ts:19](/Users/os/hiveos/src/modules/research-showcase/engineering.ts:19)
  adds only fixed HOST_ONLY OVERSIZE_UTF8 within the existing exact QA/VITEST
  controls. No action/service/HTTP/launcher accepts it. The source-authored21st
  isolated integration case requires retained trailing0xe2, exact prefix SHA,
  null text and no CRITIC admission after actual SIGKILL. It is NOT_RUN here.
- Also reread the changed [checker.ts:28](/Users/os/hiveos/src/modules/research-showcase/checker.ts:28):
  abort/deadline is rechecked after source snapshot and before child spawn;
  minimal child environment explicitly includes NODE_ENV=test. Fixed pinned
  script/interpreter restrictions and the trusted-host/stdlib ceiling remain.
  No new math/model behavior, live authority or paid fallback was added.

### Fresh delta verification and coverage

Same four-file pure unit command as above, at10:28:36 local:
92/92 PASS (A35+C57), Vitest508ms, wrapper0.793s. This includes eight additional
named controls relative to the84-cut, not92 additional controls. Earlier reruns
remain retained; total peer focused wrapper time approximately3.080s across both
review phases, well below shared600s. No integration/browser/subprocess result
is inferred from these unit checks.

Requirement coverage for this delta: R8 byte-preservation/export/secret-refusal
sub-obligations source-reviewed and unit-tested; adjacent R3 no-admission controls
source-reviewed and unit-tested. This does not claim2/2 full product requirements
closed. Actual isolated21-case crash/recovery suite is source-reviewed NOT_RUN
pending Main bundle; native R2 and fresh native-browser R10 remain open.
Overall delta status READY_FOR_MAIN_ENGINEERING_QA, not LIVE_READY.

### Delta-cut SHA256

```text
contracts.ts cfd82192d239dda468a4b0570b7a88fdd32e2991441dc8541132c2f6de44f8b8
store.ts 9f3cc0109b6863a056e501cbec89a187020650764eaa74fa175454cd4e521a2a
kernel.ts f7bb62d86f78010d8eafb30ea0667988ce9eb11b812a645549886386be8bb1fd
checker.ts 97880c0c2cebc39b20101f09775a004a51d9398ad9bf1aa1eb685badfa00067f
engineering.ts 01ad445c4952d4209a1633b13cc897c346030e9264d71df5b89f65e1c44e5cc5
source.ts 3bd05cb16901ad149390022bccbbc921d00bed23e895b24770411415151213de
research-showcase-cycle.ts ea2821d92de163f6fd0f0d9523db67945f21322a39fe03886bbbf3a9aa8c23d7
poly19-showcase-presentation.ts 55278e2e5e1fd8fc658380c336a5b9656f8ff52c6ff8e0956d5a5965a17d6417
unit/research-showcase.test.ts d3bf57abe6ee4339b28002097bc7e5ae136e6129b72aaf5e5b9fb6dd3f2332ec
unit/poly19-showcase-ui.test.ts f6d9f54da7811fa4d9afbbe6b2fddaa1b0a320949d822a91355cb057a4ab7bd8
unit/poly19-showcase-ui-boundaries.test.ts 54ea203e22b3f54325722c8beee397d3aad45b9fd1d93112073d632b392048cf
unit/poly19-showcase-qa-config.test.ts 44d14a44d51d1883817af9e406535c0e230146fe215743f12b26f8da1713fd42
integration/research-showcase.test.ts 09fae35a9b643762bf4913bf600b41f6a1eafc8c4286da8d2506612e50daff70
fixtures/research-showcase-worker.ts 27171990a119e6c68bba70af94eabbb453d769b50fa4895736bafd3016801b10
```

STOP delta peer work. Main owns final source bundle, actual engineering QA and
any subsequent freeze decision. Native no-tool containment remains unestablished;
no inference was performed or admitted by this delta review.
