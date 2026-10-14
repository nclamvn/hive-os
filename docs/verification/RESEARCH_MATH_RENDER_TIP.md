# TIP-117: Research narrative mathematics rendering

Date: 2026-10-14. Scope: engineering-only correction to the approved UX work.

## Task and acceptance

The Research history question in the user's screenshot is raw text rather than
typeset mathematics. Reuse MathText for questions, claims, excerpts and decision
rationales, keeping form inputs, codes and stored evidence literal.

Recognize the complete legacy scaled modular-distance inequality as one bounded
display span; validate repeated variables and preserve operator order. Support
the accompanying integer range. Keep explicit TeX handling, unsafe-command
rejection, malformed/unsupported raw fallback and source reconstruction intact.
Do not infer arbitrary mathematical prose, generalize a parser, rewrite records,
alter research results, change dependencies or run research.

Acceptance: screenshot rendered through the actual Research page with MathML;
whole compound formula, not disconnected fragments; links/tags/code and observed
identifier prose unaffected; long formula keyboard-scrollable on narrow screens.
Builder: focused unit/type/lint; Contractor: live Codex browser visual/keyboard QA.
No build, commit, push or deploy is part of this correction.
