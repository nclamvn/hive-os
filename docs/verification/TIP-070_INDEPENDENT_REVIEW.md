# TIP-070 independent consequential review

Date: 2026-10-04, local timezone +07. Reviewer scope: local source review and new
synthetic controls only. No product edits, browser/model/API/DB access, private
diagnostics-root access, Git, install, migration or execution-authority action.

Disposition: **PASS_WITH_DEFERRED** for the reviewed authenticated retained-read
boundary. No remaining consequential finding identified in the reviewed source.
This is not live campaign, production security, mathematical theorem or G2
readiness certification. Main owns final aggregate QA and actual browser evidence.

## Contract and source basis

AGENTS.md, the durable handoff's identity/tenant and TIP-065–069 boundaries, the
sealed TIP-070 requirements, actual authentication/authorization/tenant code,
worker retention and source-free method adapter were the review basis. Relevant
installed Next.js guides for async headers and server/client module boundaries
were read before creating review controls.

Initial TIP seal:
`372be1da7022d8104662db0f48a2fb110ea50509c4c0bb3308aea554395671a5`.
Contractor's append-only pre-implementation clarification seal:
`63f94205c7ffe0148431baef6463ada470fa2699197fdc39c8991d8b4e9f1e99`.

The approved existing Better Auth resolver can refresh active sessions or remove
expired sessions. This ordinary authentication lifecycle housekeeping is an
explicit contract exception. Do not describe the page as guaranteeing zero
authentication-table writes. No scientific/run/job/outbox/private-capture/model
mutation is authorized by this slice. No custom cookie or authority architecture
was introduced.

## Findings and resolution

1. **MR070-1: pre-query foreign review guard.** The first strengthened `scopedRows`
   filter checked case/run scope but omitted the related review's scope. A corrupt
   or mocked foreign review could therefore contribute its job ID to a bounded
   tenant-scoped lookup and produce a distinguishable binding refusal. Existing
   RLS should hide actual foreign rows, but the explicit defense-in-depth contract
   required rejecting that linkage before deriving IDs or hashing bodies.
   Reviewer reported the finding to Main before requesting Core's repair.
   Core now includes review organization/workspace/mission/case linkage in that
   pre-query filter. Missing review remains a legitimate incomplete state. The
   new independent regression confirms no job lookup and an identical DTO to an
   absent requested case. **CLOSED** on final reviewed loader bytes.
2. **Authentication housekeeping interpretation.** Reviewer inspected installed
   Better Auth session handling and noted that `disableRefresh` alone would not
   eliminate expired-row deletion. Main explicitly amended the contract to
   permit ordinary approved resolver housekeeping. **RESOLVED BY SCOPE
   CLARIFICATION**, not by pretending authentication was mutation-free.
3. **Manual reload behavior.** A Next Link to the current URL could use client
   navigation/cache instead of guaranteeing a new server read. UI switched to
   the Main-authorized native anchor; no prefetch, polling or client execution
   seam was added. **RESOLVED**; actual navigation belongs to Main's browser QA.
4. **Main-reported actual runtime checkpoint.** Main's browser caught the initial
   `Mission.where.organizationId` filter, a field not present on that Prisma
   model. Loose query mocks had not caught it. Core repaired the query to
   workspace ID plus nested workspace organization scope. The independent exact
   query-shape control passes. This was Main's actual browser observation, not
   independently reproduced by this reviewer.

The historical064 wrapper/cockpit placement was initially questioned from the
current file without a byte-baseline comparison. Main's pre-work baseline and
reverse-addition hash established it was already present in unrelated dirty
work. That is **not** a TIP-070 finding or new authorized change; ownership must
not be inferred from Git HEAD or incomplete text searches.

## Independent execution checkpoints

Exact command for each focused checkpoint:

```text
npx vitest run --project unit tests/unit/math-lrc-loop-readiness-review.test.ts --no-file-parallelism --maxWorkers=1
```

| Local start | Executed controls | Result | Duration | Explanation |
| --- | ---: | --- | ---: | --- |
| 20:39:02 | 58 | 57 PASS, 1 FAIL | 967 ms | Reviewer's static no-write regex falsely matched private `WeakSet.delete` bookkeeping. |
| 20:39:18 | 58 | 58 PASS, 0 FAIL | 808 ms | Test-only regex narrowed to database mutation calls; no product behavior or limit weakened. |
| 20:41:43 | 59 | 59 PASS, 0 FAIL | 643 ms | Includes the new MR070-1 foreign-review pre-query/non-disclosure control, after Core's repair. |

Final count is **59/59**, not the sum of repeated checkpoints. Core/UI focused
suites were coordinated serially; this reviewer did not run full types, lint,
build, broad unit/DB integration or browser QA. Main must verify final frozen
bytes with its aggregate commands. The new fixture builds bounded finite
synthetic controls before loading; that is not a checker run on GET or a new
retained scientific experiment. Authentication, DB and source-loader calls in
these tests are module mocks, not injected production resolvers.

## Acceptance coverage and trust ceiling

| AC | Independent evidence | Ceiling |
| --- | --- | --- |
| A1 | Current principal/capability revalidation, drift/revocation refusals, original Headers copied before await, viewer not original actor, safe errors and foreign-review pre-query control. | Resolver/DB mocked; not empirical live revocation or production authentication certification. |
| A2 | Positive exact synthetic v4/ledger7 admission; independent case/run/question/scope/job/outbox/command/result/dossier/ledger mutations refuse. Original requester is bound to persisted command actor, not the current ordinary viewer. | Authoritative-row fixtures are synthetic and never persisted. |
| A3 | Legacy v3 refusal, missing selection/cohort, altered anchors and source error refuse without tasks. Source-free result digest is independently reconstructed in controls from the exact frozen adapter shape, not approximated by dossier hash. | Historical064 itself was not queried by reviewer. |
| A4 | Full existing ledger7 admission and same-process registry/record identities; batch null, no associations/information/relations, 13 UNROUTABLE tasks/39 exact source references for one synthetic record; PLANNING_ONLY and dispatch/closure false. Static transitive inspection finds no checker/model/transport/capture call in this read path. | No live execution, task consumption, fresh finite replay or independently anchored new information. |
| A5 | Duplicate/17-case/path/extra-grant inputs refuse before auth; depth/byte/accessor raw controls refuse; repeated/shuffled equivalent selections deterministic; immutable bounded DTO. | Cooperative local process limits, not hostile-host hard quotas. |
| A6 | Static panel/page review: server types imported type-only; literal escaped reason text; actual session → jobs → admission → replay/info → execution sequence; compact existing tokens, native reload anchor, wrap-safe references and no run/toggle/polling seam. | Reviewer did not execute UI/browser accessibility or responsive screenshots. |
| A7 | NOT_RUN by reviewer. Main reported actual historical refusal and reload after its Prisma repair. | Main report/screenshots are the authority for actual visible E2E; synthetic positive controls cannot replace it. |
| A8 | Direct 37-source hash audit: 37 entries, 0 mismatches. Four frozen069 source/test/fixture/review hashes match handoff. | Complete pre-turn baseline/page seam preservation audit belongs to Main. |

Thus A1–A5 have independent synthetic controls; A6 has static source review; A7
has no reviewer-run observation; A8 has a limited independent pin audit. These
are not eight empirical end-to-end acceptance claims.

The server ingress accepts only original request Headers, bounded workspace
slug, UUID mission and 1–16 distinct UUID cases. It does not accept caller
context/grants/ADMITTED flags/digests/batch/receipts/resolvers. Requested missing
IDs are non-disclosing. Exact persisted run/review IDs select scoped jobs and
outboxes, not display latest-job approximations. Attempts and maxAttempts are
one; statuses, payloads, aggregate/topic/command lineage and persisted result
anchors are checked. Raw attempts/ledgers/prepared stdin/schema/context IDs and
private admission identities remain server-side. The passive source loader
hashes the fixed repository registry; it does not access private diagnostics.

37 reviewed source hashes are not recursive import closure, runtime attestation
or authentication of a malicious DB/host. The new069/070 files are outside that
old registry and require separate frozen QA pins. No new LRC14/15 theorem,
formal proof, external acceptance or novelty claim is supported. Old064's UNKNOWN
failure and exhausted one-shot authority are not recovered or retried.

Remaining gates: actual R5 execution/task consumption, R8 durable private
batch/information/relation/capture anchors and ownership/atomicity/crash recovery/
retention/refresh design, R12 activation, exact fresh executable manifest and
authority mint. G2 remains **NOT_AUTHORIZED**. Original30min/240s/49KiB/1MiB/
32KiB/256-bit/5s/2M/d3d5 limits were not changed.

## Final reviewed pins

| File | SHA-256 |
| --- | --- |
| `src/server/operations/math-lrc-loop-readiness.ts` | `b2a03dc3f20386ef42e7e5d81c39dcf03beb80580e52a2bb6ca5ea4798f33720` |
| `tests/unit/math-lrc-loop-readiness-review.test.ts` | `1f58b23fd0a3b22edce7c4694262d10c2044a08ffeace5f45ab9c326e9792455` |
| `tests/unit/math-lrc-loop-readiness-fixture.ts` | `ff25155f08c548b8e144cbf8a6077c7cac8ca606cbf62a076df7221aebd7b261` |
| `src/components/research/math-lrc-loop-readiness-panel.tsx` | `92ca20fcfc165303aa7babce6ab47c96485d6fa3b43314311a5de83d3c9432a0` |
| `src/app/w/[workspaceSlug]/research/math-pilot/page.tsx` | `dbd8fb14d7bcefe5b36be99654ce3df41f91a4990a0868c8166f6d9e0edbf291` |
| `src/modules/research-sandbox/math-method-unit-source-registry.ts` | `1f664c01e327b70c2e64b55b5e45af5604a52b4104dceb2337f37912cf539bfa` |

Panel/page pins were read at 20:42:06 after the Main-requested pure scroll offset
addition. Final independent behavioral59 run targets the loader, not panel UI.
Any later source edits require new pins and relevant frozen QA before closure.
