# Accessibility audit — 2026-11-14

Scope: local `buteel` prototype, in Mongolian and English. This is a bounded source review and headless Microsoft Edge audit, not a WCAG conformance evaluation or a substitute for assistive-technology and user testing. No organisation records were changed, no delivery channel was configured, no messages were sent, and nothing was deployed. No other project was edited.

## Baseline, before application changes

Lint, TypeScript, production build, six existing data tests, and three existing browser tests passed. Axe was already installed and used by the browser suite, but coverage did not exercise every main page in both languages, error/report states, all keyboard filters, small link targets or non-text control contrast.

Six added probe tests failed against the unchanged build: contact names failed in both languages, prepared-report focus failed in both languages, language-selector border contrast measured 1.28:1, and a breadcrumb link measured 21.61px high. Those failures motivated the fixes below. A passing broad scan had not identified them.

## Fixes and evidence

| Finding | Change | Verification |
| --- | --- | --- |
| Call, email and map links were ambiguous in a standalone links list | Accessible names now include the visible action and organisation name; phone names retain the number | All three real organisations, both languages |
| Language selector and input boundaries needed stronger contrast | Introduced `--control-border: #607a70`; applied to inputs/selects/textareas, secondary actions and language selector | Measured control boundaries at least 4.34:1; sampled control text at least 6.81:1; search focus ring 6.07:1. Text threshold 4.5:1, control/focus threshold 3:1 |
| Breadcrumb and standalone source-link targets were too short for the requested 24px floor | Breadcrumbs now have a 44px minimum; source and reading-list links a 24px minimum | Visible target checks across main surfaces; native checkbox labels provide the larger target |
| Preparing a report left focus on the earlier button | Focus moves to the readonly report; its status region exists before updates | Keyboard report generation, both languages |
| A failed clipboard operation needed an easier recovery | Focus returns to the report and selects it for manual copying; a persistent status explains failure | Clipboard denial simulated and checked in both languages; no delivery claimed |
| Mixed-language loading/error text had no language-of-parts attributes; 404 navigation lost the chosen language | Added language tags to bilingual fallbacks; localised the 404 heading and return link | 404 semantics, document language, axe and reflow checks in both languages; loading/error source reviewed |
| Application-step numbering was removed by the CSS reset | Restored decimal list markers | Source review and rendered detail capture |
| Statement needed unresolved decisions to remain explicit | Visible `TODO [contact]`, `TODO [response time]`, `TODO [known limits]`, `TODO [date]` in both versions; retained factual known limitations | Both-language visibility assertions; footer link and language switching |

Contrast measurements cover rendered sampled controls, their effective solid backgrounds, placeholders, and the search focus ring. Axe covers detectable text-contrast failures on the audited pages/states. Decorative separators, browser-native internal checkbox painting, hover/forced-colour appearance, and every possible focus/background combination are not exhaustively certified by these measurements.

## Final automated coverage

- Existing six data/filter/provenance tests pass; organisation information was not expanded or altered.
- Twenty-six new accessibility tests plus the three existing browser tests pass (29 total).
- Axe WCAG A/AA tags cover home, directory, all three organisation details, guides/checklist, about/correction form, statement and 404, in both languages. Extra scans cover expanded filters, invalid feedback and the generated report/copy-failure state. No detected violations in these tested states.
- Each surface is checked for one h1, heading sequence, header/navigation/main/footer, mn/en document language, and the language switcher’s own lang/hreflang.
- Keyboard automation covers the skip link, search text, category/district/cost selectors, disclosure, every filter checkbox, search submission/reset, every checklist checkbox, print-button reachability, feedback errors, report focus and copy-failure recovery. It is not a human end-to-end keyboard session.
- Reflow checks run at 320 CSS pixels with normal and 200% root text size in both languages; existing checks retain 375/768/1440px coverage. Reduced-motion media and automatic scrolling behaviour are checked. True browser zoom is a separate outstanding check.
- Unknown access values appear as explicit text in the browser accessibility tree, beside the feature labels. Costs and source/direct-confirmation status remain textual rather than colour-only. This does not verify speech output or comprehension.
- Print emulation confirms that navigation, footer and print buttons disappear while all five checked items remain visible. Bilingual print-style screenshots and A4 PDFs are generated. Screenshots were inspected for Cyrillic, labels, visible checkmarks and clipping. PDF generation is not verification of paper output or PDF accessibility/tagging.

Commands:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:browser
# Re-run only the accessibility suite after building:
npm run test:a11y
```

Run the browser suite once to generate the complete artifact set under ignored `test-results/`: `checklist-print-mn.png`, `checklist-print-en.png`, `checklist-mn.pdf`, `checklist-en.pdf`, home/detail/statement captures, and the contrast JSON attachment under its test-result subdirectory. Playwright clears previous run artifacts when the next run starts.

## Still unresolved and why

| Item | Status / required follow-up |
| --- | --- |
| NVDA, VoiceOver and TalkBack; Mongolian voice selection/pronunciation | Not tested: this session has headless browser tooling, not a connected assistive-technology session or physical mobile device. Run with actual readers and installed voices |
| Complete human keyboard session, 200% browser zoom, forced colours and physical phones | Not tested: DOM text resizing and simulated keyboard input are bounded substitutes, not equivalent to those user environments |
| Real users and native Mongolian language review | Pending people/consent and a native reviewer; no interviews or outreach were performed |
| Physical printing, PDF tagging, offline use | Print styles and generated files only; check real print/PDF reading and offline behaviour before claiming support |
| Corrections recipient and response target | Intentionally unconfigured at the owner's request; visible TODOs are retained, with no invented address or response promise |
| Organisation accessibility and eligibility | Still unknown unless published evidence supports a field; site accessibility testing cannot confirm real premises or services |
| Statement final review and complete known-limit inventory | TODO markers remain until the owner reviews manual findings and finalises the statement |

Use ACCESSIBILITY_TEST_PLAN.md for the remaining manual checks. Do not describe this result as “fully accessible” or “WCAG compliant.”
