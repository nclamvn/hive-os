# Current editorial checks — browser verification

Date: 2026-10-14. Tested in the existing signed-in Codex browser against local
Next dev, not a production build. No paid API, worker, deployment or research run.

## Preserved document

DOC-BD12906E, revision 3:
http://localhost:3000/w/mathematics-pilot-lab-156de0/authoring/5f672414-4a3e-4910-817e-87d8235a4441

Original saved content was restored after each synthetic check; no synthetic
revision was saved. Reload confirmed revision 3 and the original section body.
Recorded historical scores remain v3=90, v2=26, v1=0. Prior A/B results are not
reinterpreted as a method win: changing editorial rules is not better content.

## Observed checks

| Browser case | Observed result |
| --- | --- |
| Original UAV final, unchanged | Current checks 100/100, no content warnings; previous two false positives removed |
| User-attributed 1.000 ha followed by unsupported 99% in the same clause | One numeric warning remains; input attribution does not exempt the whole sentence |
| Technical absolute/relative accuracy plus negated 100% guarantee and a separate positive certainty claim | Exactly one certainty warning on the positive claim |
| Technical accuracy and negated guarantee only | No warnings |
| Original body plus em dash | One style advice, unchanged content score/status, export links available |
| Original body plus `[@missing]` | One content blocker; DOCX/PDF become disabled non-link controls |
| English attributed area plus 99%, negated guarantee plus positive certainty | Two content warnings; split headings and limitations translated |
| Library after returning from editor | Current 100/100 agrees with editor, revision 3 unchanged |
| PDF and DOCX from saved revision through visible export links | Both downloads complete; page remains on document |

Live QA found one additional false positive during implementation: negated
100% guarantee was still treated as an asserted numeric measurement. Builder
added a narrow exemption and regressions; the same browser case then passed.

Downloaded files:
- `/Users/os/Downloads/A-B-UAV-HIVE-assisted-14-10-2026-v3.pdf`
- `/Users/os/Downloads/A-B-UAV-HIVE-assisted-14-10-2026-v3.docx`

These verify the live export route after its required-document-type change;
this turn did not repeat full PDF visual pagination QA from the previous font
repair. Export creates its normal audit event, not a new document revision.

Screenshots: `before.jpg`, `style-advisory.jpg`, `current-en.jpg`, `after.jpg`.
The style screenshot is an unsaved test, not the final saved proposal.

## Limits

This is a deterministic editorial check, not semantic truth, source verification,
field acceptance or a blanket guarantee of zero false positives. Only directly
recognized input attribution and local negation are exempted. The UI now states
these limitations and distinguishes current checks from recorded save-time scores.
No database migration, new agent gate, dependency or build directory was added.
