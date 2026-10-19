# TIP-070 UI completion

Status: READY_FOR_MAIN_VERIFICATION, local passive UI scope only.
Date: 2026-10-04. Sealed TIP including G1 clarification:
`63f94205c7ffe0148431baef6463ada470fa2699197fdc39c8991d8b4e9f1e99`.

## Delivered scope and design

New `MathLrcLoopReadinessPanel` consumes only the authenticated server DTO
through a type-only import. It shows actual session/read status, scoped retained
job admission, admitted record count and safe refusal reasons, fresh finite replay
`NOT_RUN`, independent information/batch `NOT_BOUND`, `PLANNING_ONLY`, and
`G2_NOT_AUTHORIZED`. Dispatch and proof closure remain false; global LRC, formal
proof, external acceptance and novelty remain `NOT_ESTABLISHED`.

Proposed task references use a native disclosure with exact finding/ledger/task
digests, case binding, role, status and literal escaped retained reason. They are
explicitly `PROPOSED / UNROUTABLE`, not queued, executed or proof closure. No
raw records, principal/grant tokens, private captures, polling, checker, model,
execution button, forms, new API, database write or scientific fixtures were added.

Frontend Design informed a compact, left-aligned process definition list, one
warning boundary, <=76ch explanatory lines and mobile-stacking rows. Existing
HIVE surface/canvas/ink/muted/line/warning tokens and interface font remain
binding, including existing dark equivalents. No decorative cards, gradient,
font replacement or progress percentage. Both Vietnamese and English frame safe
refusals and the next required action; mathematical finding reasons stay original.

The only product integration is three imports, one bounded awaited server load
using current request `Headers` plus exact selected mission/case, and one panel
insertion before the original history. Existing pure family selection guards,
legacy forms, source scope, historical output and inactive refresh behavior remain
unchanged. No page `WorkspaceContext` is passed as authority. Actual legacy064
remains historical; safe readiness calls it `LEGACY_NOT_ADMISSIBLE`, never method
evidence or recovered output, and says not to retry it.

Manual reload clarification approved by Contractor: use a native `<a>` to the
current selected-case URL, which does not prefetch and performs document navigation.
Next Link's same-URL interception could otherwise yield a router-cache/no-op read
even with `prefetch=false`. No client runtime or mutation is needed.

G1 permits ordinary Better Auth session refresh/removal housekeeping in the
approved resolver. This is not a scientific/job/outbox/model mutation. The UI
does not claim zero authentication-table writes.

## Verification and failure history

Final serial focused command:

```sh
node ./node_modules/vitest/vitest.mjs run --project unit tests/unit/math-lrc-loop-readiness-panel.test.ts tests/unit/math-lrc-loop-readiness-page.test.ts tests/unit/math-lrc-research-cockpit-page.test.ts tests/unit/math-lrc-proof-unit-run-page.test.ts --maxWorkers=1
```

PASS 60/60, four suites, start 20:42:00 local, duration 2.21s, exit 0.
This is 33 new controls (20 panel + 13 page) and 27 old controls (16 cockpit page
+ 11 proof-unit page), not additive repeated-run totals. Every new positive DTO
and page dependency is SYNTHETIC, not browser scientific evidence.

Controls cover VN/EN refusal and closed gates; all defined refusal labels; literal
escaping/no automatic TeX; exact proposed references; process order; passive source
hash versus fresh execution distinction; no input mutation; no privileged runtime
import; request DTO key minimization; exact selection; damaged family markers;
legacy064 UNKNOWN preservation; campaignv2 exclusion; absent/repeated selection;
membership refusal; independent DAL refusal; inactive refresh on invalid selection.

Initial run at 20:36:17: 57/60 PASS, three NEW invalid/unavailable-selection tests
failed because their test-only refresh mock incorrectly threw when the existing
page rendered its inactive refresh component. The NEW mock was corrected to a
null-rendering observer and those controls assert `active:false`. No product
guard, old assertion, timeout or resource cap changed. Subsequent 60/60 at
20:36:58 was superseded by the 20:37:34 run after a strict mock-type annotation,
then by the final 20:42:00 run after the narrow scroll-offset repair below.

Main's visible mobile 390px observation found no horizontal overflow but the
direct `#math-lrc-loop-readiness` anchor heading was obscured by the existing
64px sticky header. Contractor requested and authorized only `scroll-mt-24` on
this NEW section. That class was added without any other UI change; the existing
NEW panel static test now asserts the exact section offset. Unique test count is
unchanged. The final focused run occurred after Core's 65/65 and Reviewer's 59/59
serial test slots completed. Main owns the subsequent live offset confirmation.

Exact owned/adjacent lint command:

```sh
node ./node_modules/eslint/bin/eslint.js src/components/research/math-lrc-loop-readiness-panel.tsx 'src/app/w/[workspaceSlug]/research/math-pilot/page.tsx' tests/unit/math-lrc-loop-readiness-panel.test.ts tests/unit/math-lrc-loop-readiness-page.test.ts tests/unit/math-lrc-loop-readiness-ui-fixture.ts tests/unit/math-lrc-research-cockpit-page.test.ts tests/unit/math-lrc-proof-unit-run-page.test.ts
```

PASS exit 0, no errors/warnings. Whole types/lint/build, Core auth/admission tests,
full baseline hash audit and visible browser/mobile E2E belong to Main and are
NOT_RUN by this Builder. Static wrapping/SSR is not browser geometry acceptance.

## Preservation proof and frozen file pins

Two existing page unit tests received exactly two mechanical dependency mocks
each (`next/headers`, new server loader returning null). All prior controls and
assertions are intact. Read-only reverse-addition hash checks (no Git operation)
produce these pre-addition bytes. Main confirmed all three match its 1390-file
baseline exactly:

| File with only this slice removed | SHA-256 |
| --- | --- |
| Page, removing three imports/load/insertion only | `21538d49e5f15217afbda4bedf4f8d83e81f6f802a469d931b7ed10ca3dd4575` |
| Existing cockpit page test, removing two new mock lines only | `4e0f5828f1f24d0b1bcef57c70a24e8f80cf3f96147af1881b61fb2dc5e502f2` |
| Existing proof-unit page test, removing two new mock lines only | `6447cca18b7cc25fd61c1a2b32bfcefb3b5457da3b0ba8a9967aa5f2d4105c2a` |

Final files:

| File | SHA-256 |
| --- | --- |
| `src/components/research/math-lrc-loop-readiness-panel.tsx` | `92ca20fcfc165303aa7babce6ab47c96485d6fa3b43314311a5de83d3c9432a0` |
| `src/app/w/[workspaceSlug]/research/math-pilot/page.tsx` | `dbd8fb14d7bcefe5b36be99654ce3df41f91a4990a0868c8166f6d9e0edbf291` |
| `tests/unit/math-lrc-loop-readiness-panel.test.ts` | `391e52465f9c4d1a28071e17e3c1ac80a2301270fd2a9fa4e492d16ef2d9418d` |
| `tests/unit/math-lrc-loop-readiness-page.test.ts` | `fa9d53b1e9e31324db7d975bc7b91aaea8d47341b9879cb8b6bf5d32c7286fd4` |
| `tests/unit/math-lrc-loop-readiness-ui-fixture.ts` | `ec5c6f92b4639611567292a4120c12e051a1271657a5a15ba8ee1c37ede4fb15` |
| `tests/unit/math-lrc-research-cockpit-page.test.ts` | `9e7dc636f47a881719b638608fe76cbb6bf41d79b98b10f659649a9fc18353e7` |
| `tests/unit/math-lrc-proof-unit-run-page.test.ts` | `abda9cc4e9ee81f3e841b069c8c815fec4effaaf71bf87dea1fa03dc42ad69a4` |

No Git, browser, model/API, worker, scientific database write, private-root,
installation, migration, campaign or production command was run by this Builder.
One temporary missing-module HMR error occurred because the first page seam was
added before Core's real module existed; only that exact additive seam was removed
at Main's request, then reapplied after the real export/type existed. No fake stub
was created. Existing unrelated dirty page content was preserved.

## Acceptance boundary and remaining work

A6: 33/33 new synthetic UI/page controls PASS. A3 historical refusal and A4 closed
planning dimensions are rendered/tested, but server validation authority is Core's
evidence. A8 additive preservation has reverse-hash evidence confirmed against
Main's baseline. A1/A2/A5 belong to Core/Main, A7 browser E2E to Main. This completion
does not claim all eight criteria or the whole research program are complete.

R5 actual execution/task consumption, R8 durable independent capture/batch/new
information/relation/association anchors and R12 runtime activation remain open.
Durable ownership/atomicity/crash recovery/retention/auth refresh, exact executable
manifest scope and authority mint require a future security/activation decision.
G2 remains NOT_AUTHORIZED. No new LRC14/15 theorem, novelty, formal proof, external
acceptance or scientific breakthrough is claimed.
