# Mathematician-first research surface

Date: 2026-10-20. Owner: make HIVE usable by Phương and mathematicians who do not
operate AI/IT tooling. UI implementation only; no paid API, permissions, campaign,
deployment or claim of live mathematical collaboration is authorized here.

## Implementation brief

Outcome: a mathematician can enter a problem and a vague research intuition,
read mathematical notation, prepare a readable research note and find past work
without knowing JSON, solver protocols, adapters or worker configuration.
The offline/not-connected state must remain obvious. Existing collector is only
literature collection, not a general proof agent. No invented answers or sources.

Design: reuse Precision Instrument tokens, not a new brand. Base palette is canvas
#f4f6f8, surface #ffffff, ink #0c1424, secondary ink #617086, line #dce3eb and
navy action #17366a, with the existing dark equivalents. Existing interface font
and KaTeX carry prose and formulas. Use one quiet notebook-like working surface,
left-aligned readable prose (<80ch), generous equation space, consistent controls.
No KPI tiles, decorative mathematics, simulated progress or default model output.

The initial idea of adding a new chat was rejected: it would duplicate the host
and suggest a connected AI that does not exist. Adapt the current research form
and real action instead. The important distinction is research vs operation,
not novice vs expert mathematical ability.

```text
Research desk
  Problem and existing results       natural language + formula preview
  Direction                          I suggest / AI suggests
  References and earlier work        optional disclosure
  Connection state                   concise and truthful
  Prepare research note              readable preview and text download
  Earlier records                    optional, originals unchanged
  Operation                          explicit secondary link, never a prerequisite
```

Acceptance:

- Default `/research` uses mathematical, non-technical language in EN/VI. No JSON,
  raw receipts, model/worker/tool configuration or simulation controls in its
  normal path. Operational controls remain reachable explicitly, not deleted.
- Problem/intention stay editable and intact when changing direction or preview.
  Formulas render with the existing safe MathText component. No fabricated solve.
- Context selection is optional and uses understandable labels, not IDs as primary
  copy. Preserve goal/source inheritance, capability checks and bounded contracts.
- Readable note preparation/download works with the actual entered content and
  source restrictions. Do not imply durable server storage or model inference.
- Default shell should not overwhelm this surface with operational modules;
  preserve normal shell behavior elsewhere and reachable account/sign-out controls.
- Historical records and technical tools remain intact via explicit operational
  navigation. Technical UI hiding is not authorization and must not weaken checks.
- Keyboard, EN/VI and mobile390px verified in the actual browser. Keep current
  provider disabled. Unit/regression, typecheck and scoped lint on affected code.

Scope is the research entry/workbench routing/navigation, not a rewrite of every
historical mathematics dossier. Do not build a new runtime, upload pipeline,
parallel memory system or model transport. No claim of advantage over a direct
tool-enabled agent: usability is evaluated structurally here, real Phương use is
still required. A genuine connected research session is a deferred prerequisite
for handing this off as an independent AI research product.

## Completion

**Local UI acceptance PASS, 2026-10-20.** The default research entry now uses a
quiet mathematical notebook instead of exposing the operational form. Changes
reuse the current form, MathText, shell and source contracts. An opt-in researcher
shell has only desk/documents, note-writing and a secondary operation link; other
routes keep their existing navigator. Account and sign-out remain accessible.

Implemented:

- Problem/intuitions, optional safe formula preview and HUMAN/AI-proposal choices.
  No mission is required to prepare a note. Source/context choices are optional;
  human-readable record titles replace M/DOC prefixes in the default form.
- Plain EN/VI research notes contain the actual entered problem, chosen direction,
  selected document title and source limits. Document contents are explicitly not
  read or verified by note preparation. Original source boundaries still validate.
  Preparing notes does not call a model, search, verify mathematics or save to DB.
- Editing bound inputs invalidates the earlier note; language/preview/mode changes
  retain the original entered text. A generated note keeps its preparation language
  until regenerated; switching UI language does not translate the author's text.
- Default history shows a labelled excerpt of ten recent questions, at most three
  observations and references each, with actual statuses and mathematical content.
  Worker diagnostics, review forms and full records remain in explicit operation.
- The legacy JSON workbench is linked with `advanced=1`; the unqualified route
  returns to the desk after the same authentication/capability checks. This URL
  selection is presentation, not a security boundary or new permission.

Contractor independently reran158 distinct tests across13 files (not summed with
Builder's overlapping150): new mathematician UI/note, existing navigation/math
render/preferences, and the nine-file direction/core suite. Typecheck and scoped
lint passed, as did `git diff --check`. No production build, dependency upgrade or
database integration suite. The existing Vite future-loader warning remains.

Actual authenticated Codex browser at port3001:

- Entered a labelled UI example using positive integers, divisibility and a descent
  intuition. Math displayed from the actual text; no answer was generated.
- Verified EN/VI retention and keyboard radio changes. A mode change removed the
  old note without erasing the problem or intuition and without model dispatch.
- Selected a real existing document and arxiv.org restriction; both appeared in the
  note with the explicit not-read/not-verified qualification. Removed this unrelated
  ERP document after the test, so the final mathematics example does not imply it
  has relevant supporting evidence.
- Clicked download, captured the actual browser download and inspected
  `~/Downloads/hive-research-note.txt`: original prose/TeX and unverified status
  retained, no JSON protocol or model/system mandate. This is an output file,
  not durable server history.
- At390x844 document width remained390. A2380px-wide display equation stayed in
  a282px scroll region, accepted keyboard focus and scrolled horizontally by key;
  mobile drawer showed the reduced navigation and closed with Escape.
- Opened the explicit operator link and legacy workbench, then returned to the
  desk. No jobs, checker runs, reviews or provider calls were dispatched there.
- Inspected light and dark presentation. The final tab is back in Vietnamese and
  the original System appearance, with the entered example and readable note.

Screenshots: [desktop](../../artifacts/qa/mathematician-ux-20261020.jpg),
[mobile](../../artifacts/qa/mathematician-ux-mobile-20261020.jpg).

The frontend-design guidance drove subject-first copy, restrained existing tokens,
readable formulas and separation of mathematical expertise from IT operation.
Vibecode's Builder implemented; Contractor inspected, reran checks and exercised
the actual browser. This is structural/usability QA, not a real Phương user test
or evidence of better research than a direct tool-enabled LLM agent.

**READY-with-deferred for this UI slice; NOT READY for independent AI research
handoff.** Real AI collaboration is not connected. General live takeover, research
quality and durable notebook persistence remain untested/unimplemented in this
slice. Inputs are in page memory: navigating away/reloading can lose an untaken
note; the UI tells the author to download it. The separate legacy workbench's
existing local draft functionality was not relabeled as notebook persistence.
Historical dossier screens outside this entry were not redesigned. No new runtime,
API expense, DB/schema/auth/core change, campaign, commit/push or deploy. K6 stays
paused. No scratch projects, new Next output directories or installs; nothing
material was deleted. The downloaded note is kept as a user-visible QA output.

## Final acceptance pass requested by Owner

2026-10-20: Owner requests UI/designer + mathematician review, necessary targeted
repairs, Lean assessment, then commit/push; still no deploy or live execution.

Named gaps to close, without broadening the runtime:

1. Preserve a usable draft before leaving/reloading: an explicit bounded tab-local
   Save/Restore input draft, scoped to real user/workspace and expiry. No automatic
   server save, no restored receipts/verified state, and no silent overwrite of
   edited input. Reuse the existing local-input draft pattern rather than a new
   notebook/memory framework. Draft availability/failure is plain EN/VI.
2. Explain mathematical evidence in one optional readable help section: LaTeX
   preview is rendering, model output is a proposal, exact tools check only stated
   scope, and formal checking requires the intended statement to be formalized.
   Legacy Lean4.10 Std-only pilot exists for fixed targets, with independent replay
   code, but is not live arbitrary-problem verification in this desk. Never say
   the product has no Lean code or that the desk is Lean-enabled by appearance.
3. Keep final prose/equation reading widths and note hierarchy readable; correct
   concrete accessibility/navigation issues found in browser. No decorative redo,
   new chat, model transport, proof campaign, install, image build or new gate.

Acceptance must rerun relevant unit/type/lint and actual browser draft round-trip,
EN/VI, mobile/keyboard, note export and honest offline/formal status. User usability
or mathematics correctness is not certified by these checks. Git outcome will be
confirmed after execution, not inferred from the request.

### Final acceptance outcome

**Accepted for the local mathematician UI, with runtime/deployment deferrals.**
Designer review kept the existing palette/layout rather than adding another
dashboard or chat. Mathematician review retained exact assumptions/TeX, explicitly
unproved intuitions, source restrictions and limited verification meaning. This
is Contractor review from those perspectives, not external mathematician sign-off.

Closed concrete gaps:

- Explicit24-hour input draft in this browser tab, keyed by actual account and
  workspace, with bounded strict input fields. No automatic save/restore or DB
  persistence. Old/missing/changed references refuse restoration; inherited goal
  and document must still match the current authorized parent. No results,
  generated note, receipt, trusted snapshot or accepted state is restored.
- Edited inputs are not overwritten without an inline choice. Cancel preserves
  them, confirmed restore recovers original prose/TeX and resets generated views.
  Storage-blocked/quota/expiry cases stay honest; status codes follow UI language.
- References navigation now anchors to this desk instead of sending the researcher
  into generic business-document authoring. Operational navigation elsewhere is
  unchanged. Download helper text is separated from the button for readable spacing.
- Optional verification help distinguishes notation, proposals, scoped exact
  checking and formal proof. The operational manual-output workbench no longer
  uses a display name easily confused with the Lean theorem prover.

Lean finding: code already exists in `math-formal-claim.ts`,
`math-formal-check-runner.ts` and `math-formal-replay-runner.ts`. Its fixed claims
are EVEN_SQUARE and IMO1988Q6; source declares Lean4.10/Std without mathlib and
fresh-kernel replay support. This is a limited legacy pilot, not a general live
Lean notebook. No Lean compile, Docker image build or formal research run occurred
in this acceptance. The general desk is not connected to arbitrary formal checking.
Do not relabel `lean-execution` (small workflow) as Lean (proof assistant).

Decision: do not require Phương to write Lean to explore mathematics. Use formal
checking behind the scenes for selected formalized claims when such support is
separately integrated and accepted. A checked formal statement must still match
the intended mathematics. The official
[Lean validation guide](https://lean-lang.org/doc/reference/latest/ValidatingProofs/)
supports this distinction; reading it does not certify the retained old runtime.

Independent final verification:

- 206 distinct unit tests across17 files passed after the last presentation fix:
  mathematician UI/draft, navigation, TeX/preferences, old local drafts, formal
  claim/replay guards and the nine-file direction/core regressions. Earlier198,
  158 and Builder subsets are not added. Formal guards are structural tests, not
  actual theorem proving. Typecheck, scoped ESLint and diff check passed.
- Real browser: save -> reload -> explicit restore; edited input -> refuse/confirm
  overwrite; same-page References kept input; EN/VI retained source text and
  translated system statuses (a stale-language issue was found and repaired);
  mobile390px width stayed390, keyboard reached restore/delete controls. Earlier
  formula/overflow checks remain applicable. New note exported and actual downloaded
  text inspected. No fabricated AI response, source or verification.
- Production build using existing `.next-build`, `HIVE_BUILD_PROFILE=LOCAL_QA`,
  worker/OpenAI/local-model flags OFF: initial sandbox attempt FAILED because
  PostCSS/Turbopack could not create its internal process/port. Same build retried
  with local execution permission, bounded380seconds, PASSED on final source.
  Compiler6.0s, TypeScript20.6s as reported by Next; no aggregate wall-time/ROI
  claim. Standalone env scrub removed the copied env file, assets preparation passed.
  No new distDir, dependency or project copy. Dev server stayed on port3001.

Retained warnings: Vite future config-loader compatibility, and pre-existing
`src/server/kakeya-dossier.ts` dynamic filesystem tracing of the whole project.
The latter is a **before-deploy packaging review obligation**, not a reason to
silently ignore tracing or change retained proof/source contracts in a UI task.
No deployment or production-runtime acceptance is claimed.

Evidence: [final research note and verification help](../../artifacts/qa/mathematician-final-acceptance-20261020.jpg).
The saved browser draft and downloaded QA note are explicitly labelled UI examples.
No research data was deleted or altered. Source, tests, documents and screenshots
are authorized for commit/push in this pass; verify actual Git outcome separately.
K6 remains paused. General AI collaboration, durable server notebooks, real Phương
usability/benefit and arbitrary-problem Lean support remain deferred.
