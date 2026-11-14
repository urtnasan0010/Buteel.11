# MSL readiness - 2026-11-14

The website contains no sign language videos. Four empty slots retain complete written instructions: how this site works, directory search, preparation guides and report a problem. The new bilingual page is /understand/deaf-hard-of-hearing, reachable from Understand and Communication. Claims 14-17 have separate sources, medium confidence and editorial review dates.

## Every new or retained TODO relevant to this change

- Current adoption status of the Mongolian Sign Language bill: TODO [source needed]. The 5 June 2026 article establishes drafting at that time, not current adoption status.
- Current services and interpreting availability: TODO [source needed].
- Each organisation: sign language interpreting unknown; TODO [source needed]. Confirm directly without changing records based on assumptions.
- Written contact without a recorded email: text/messaging option unknown. A phone number does not prove SMS is supported.
- General guidance source and page review date remain TODO [source needed] and TODO [review date] in the shared content template. Individual claims separately show 2026-11-14.
- All Mongolian copy is draft: native review needed, including titles, placeholders, claims and interpreting terminology.
- Real MSL content: TODO commission Deaf signers, obtain consent and approval, and provide reviewed captions and full transcripts. No production video asset is configured.
- Internal Deaf organisation outreach leads: TODO confirm identities and obtain contact details from the organisations themselves. No outreach sent.
- Report delivery, response time and accessibility statement placeholders remain unconfigured and unchanged.

## Deaf-led review and manual checks

Deaf signers and reviewers must create and approve all signed content. Review page wording and navigation with deaf and hard-of-hearing users before launch. Native Mongolian reviewers must approve all Mongolian text. No native or Deaf-led review has been performed here.

Still test NVDA and VoiceOver reading order, Mongolian pronunciation, native video controls and caption selection; real browser 200% zoom (automated doubled text is only a proxy), Windows high contrast, physical phones, print preview, slow connections and the report workflow. When real MSL exists, review signing clarity, framing, caption synchronisation and transcript equivalence with Deaf signers. Automated checks do not establish full accessibility or WCAG compliance.

## Test media boundary

Only tests/browser/msl.spec.ts creates a static plain-colour canvas recording in tests/fixtures/plain-colour.webm. It contains no person, avatar or signing. Captions are in tests/fixtures/plain-colour.vtt. Playwright serves these through intercepted fixture requests only; application code has no fixture imports or test routes, and public/ has no fixture media. No media download is used.

## Automated validation

Lint, TypeScript checking, 14 unit tests and the production build passed. The full browser suite passed 81 tests after correcting timing of the test-only static-colour clip. The dedicated accessibility suite passed 66 checks. Browser checks include both languages, the new page, four empty states, caption cue loading, keyboard playback, 320px reflow with doubled text, reduced motion and print. These are automated checks, not native-language, Deaf-led or physical-device approval.
