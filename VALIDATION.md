# Local validation — 2026-11-14

## Bilingual accessibility audit (current)

Supplied-claims update: `src/shared/claims.ts` records all 13 supplied claims with bilingual text, sources/title language/type/access, confidence, editorial review date and publication status. Ten are published as dated attributions on five existing pages; claims 1, 2 and 13 remain TODO-only. The legalinfo URL was inaccessible, the consultation article/footer does not substantiate claim 2, and the assessment body's identity/process has no supplied official source. `CLAIMS_REVIEW.md` records evidence/access limitations; CONTENT_REVIEW.md tracks native-speaker, disabled-person and legal/process reviews. Internal-only OUTREACH_LEADS.md contains the requested names/years without contact details. No directory record changed.

Build, lint, typecheck and 12 unit tests passed. The 75-test browser run passed, including per-claim citations/dates/source language, published/TODO boundaries and print visibility. Rights desktop and 320px Mongolian captures were inspected; final wording distinguishes individually cited claims from the general-guidance page-level TODO. All previously recorded manual-testing limits remain. A prior redundant unit rerun was temporarily stopped by an approval-review usage limit, then retried through normal approval and passed.

The final-build dedicated accessibility command separately passed all 64 tests, including both languages on the five updated claims pages. These tests overlap with the full browser suite; they are not human assistive-technology sessions.

Approved three-section update: added 15 registry-backed paths under `/understand`, `/help` and `/reach`; existing URLs remain. Primary navigation is Find support / Understand / Help / Reach. Home retains prominent search, adds three large entry links and a link-only audience chooser. The shared section-content template supplies one h1, summary, points/related links, source and review-date TODOs, and a print button. Families link to existing guides/checklists. Organisation data and evidence are unchanged; correction delivery and deployment remain unconfigured.

The dedicated `npm run test:a11y` command separately passed all 64 accessibility tests. These are also included in the 73-test full browser run; they are not additional independent manual evaluations.

Build, lint, typecheck, ten unit tests and 73 browser tests passed. Registry routes are covered in both languages by axe, document language, heading/landmark, keyboard skip, 320px reflow and 200% root-text checks. Home chooser and active-section navigation, no chooser cookies/localStorage, every new page's print invocation and print visibility of source/date placeholders are checked. Home desktop and 320px Mongolian captures were inspected. CONTENT_REVIEW.md tracks native Mongolian and disabled-person review for all new/changed copy. Legal/rights assertions remain source placeholders and voices requires consent; no personal stories, official claims, statistics, helplines or contacts were invented. These are automated/visual checks, not physical printing or assistive-technology user testing.

Subsequent information-pages update: added bilingual `/how-it-works`, `/privacy`, `/contact` and `/for-organisations`, all linked in the footer. Detail and statement correction links now target `/contact`; the legacy about form remains for existing links. Shared translations describe the incomplete directory, unknown information, source-review distinction, unassigned review cadence, URL/history exposure, in-memory forms, external links and unconfigured delivery. No contact channels, emergency numbers or organisation facts were invented. No cleanup candidate was deleted. Offline support, dark mode and later content formats are not delivered by this change.

Build, lint, typecheck, eight logic/translation tests and 39 browser tests passed. New routes are covered in both languages by axe, landmarks/headings/language checks and 320px reflow with 200% root text size. Dedicated navigation/report tests also passed; desktop how-it-works and 320px Mongolian contact captures were inspected inline. These checks do not replace screen-reader or real-user testing. Contact delivery and deployment remain unconfigured.

Subsequent structure update: kept Next.js routes while moving interactive modules/styles to `src/client`, the detail renderer to `src/server/components`, and types, filters, sourced listings, shared UI and translations to `src/shared`. Added two translation tests for bilingual completeness, matching placeholders, Cyrillic and language-specific checklist count order. Build, lint and eight logic/translation tests passed. Nytheria was not edited. See STRUCTURE.md for editing conventions.

See ACCESSIBILITY_AUDIT.md for the before/after findings and exact limits. Baseline build/lint/typecheck, six data tests and three browser tests passed before changes; six targeted probes then exposed missing organisation context, report-focus gaps, low-contrast language-selector boundaries and short link targets. Fixed accessible contact names, control boundaries, link target heights, report focus/manual-copy recovery, fallback language markup, localised 404 navigation and step numbering. Added the four requested visible statement TODOs without configuring delivery.

Final build/lint/typecheck, six data tests and 29 browser tests pass. Coverage now includes both languages, all three detail pages, 320px and 200% text reflow, expanded filters, feedback error/report states, keyboard filter/checklist flows and print emulation. Sampled control boundary contrast is at least 4.34:1, text at least 6.81:1 and search focus 6.07:1. Bilingual print-style captures were inspected inline. No assistive-technology speech session, human keyboard walkthrough, real browser zoom, real-user session, physical device or printer test was performed. The statement makes no conformance claim; no data, delivery or deployment changes were made.

## Accessibility statement and manual-test preparation

Added `/accessibility` in Mongolian and English, linked from the footer. It describes actual automated coverage and explicitly leaves NVDA, VoiceOver, physical devices, a complete keyboard walkthrough, real-user sessions, browser zoom, physical printing and offline support unverified. The owner deferred choosing a correction recipient, so delivery remains unconfigured and no response-time promise is made. ACCESSIBILITY_TEST_PLAN.md provides the unexecuted test matrix, real-user tasks, proposed listing review cadence and an unsent organisation-confirmation draft.

Build, lint and typecheck passed. All three browser tests passed, including keyboard activation of the footer statement link, mn/en page-language checks and axe/responsive checks on both statement variants. Inspected desktop and mobile statement screenshots inline; no material layout issue found at those captured sizes. This is validation of the added page and links, not completion of the manual test plan. No organisations or testers were contacted; no deployment occurred.

## Real-organisation update

The active dataset now contains three real organisations from first-party websites. The fictional listings were removed. See SOURCES.md for field coverage and conflicts with older directories. Source review is explicitly distinguished from direct provider confirmation. The office-district filter does not imply eligibility or service coverage. Call, email, and optional name/address map-search links are available before extended detail content.

Passed: lint, typecheck, production build, six logic/data tests, and three headless Edge browser tests on the dedicated production test server. Browser checks now cover the home, directory, all three real detail pages, guides, and about page, with responsive widths and axe WCAG A/AA tags. Contact links, source link, review date, unknown status, filter reset, and feedback reporting are asserted. Inspected final desktop home and APDC mobile/desktop detail screenshots inline; disposition: ship for the local prototype. No real phone call, email, provider confirmation, physical visit, assistive-technology user session, or Google Maps pin/route check was performed. Earlier sections below describe the previous prototype iterations.

## Simplification update

Shortened home to its search, categories, and guide link. Removed the repeated explanation panel, three-step promotion, and sample preview list; guides and the complete directory remain directly reachable. Service rows omit the identical generic description; full descriptions remain on detail pages. The directory now uses a single column with basic search above results. Cost and accessibility remain available under a native keyboard-operated disclosure, automatically expanded when active.

Fixed stale checkbox selections on reset by remounting the filter form when its URL parameters change. Added browser assertions for cleared selections, keyboard disclosure activation, cost filtering, and active-filter visibility. Build, lint, typecheck, and all three browser tests passed again. Tests now launch the production build on port 3100 to avoid reusing an existing development server. Inspected final desktop home and mobile directory screenshots inline; local prototype review disposition: ship. Earlier screen-reader and physical-device limitations still apply.

Passed: ESLint (no warnings), TypeScript, production build, four focused logic tests, and three Playwright tests in headless Microsoft Edge. Node test/build/browser workers required running outside the process-restricted sandbox.

Browser coverage: keyboard skip link; bilingual search; query-preserving language switch; service navigation; honest feedback validation and report preparation; no-results reset; checklist interaction and print-action invocation; all five primary page types at 375/768/1440px; axe WCAG A/AA tags including 2.2 with zero detected violations on tested pages; home at 200% root text size and reduced motion. Print invocation is checked with a stub; physical print output is unverified. Real screen readers and physical devices were not tested. Automated checks do not establish full WCAG conformance.

## Review and fixes

The design review was performed inline. Desktop and enlarged mobile home screenshots were inspected after the final CSS correction. Disposition: ship for the local prototype at this tested scope.

| Finding                                                                | Correction                                                             | Evidence                           |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------- |
| Long Mongolian text overflowed at 200% text size                       | Added wrapping and zero minimum grid child widths                      | Zoom assertion and home-mobile.png |
| Language URL could retain an earlier route after client navigation     | Read the current pathname and query in the toggle                      | Browser flow test                  |
| Active navigation could reflect the initial route                      | Derive active state from the current pathname                          | Navigation component               |
| Missing access information could be confused with unavailable features | Explicit unknown values, explanatory text, confirmed-true filter logic | Logic test and detail page         |
| Feedback needed a truthful non-backend state                           | Copyable report with explicit not-saved/not-submitted status           | Browser feedback flow              |

Screenshot files are generated in ignored `test-results/` by `npm run test:browser`. No public deployment was performed. Nytheria was only read; no files or live data there were changed.

## MSL preparation

See MSL_READINESS.md for scope, TODOs and manual review requirements. Lint and typecheck passed; 14 unit tests passed; production build passed; full browser suite 81 passed; dedicated accessibility suite 66 passed. No production videos, organisation record changes, report delivery setup or deployment. Test media is a plain-colour non-signed WebM with VTT captions under tests/fixtures only.
