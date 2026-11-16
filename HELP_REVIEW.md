# Practical help content

Implemented 2026-11-16 at `/help`, in Mongolian and English. Twelve native disclosures and six need filters work on the server without client JavaScript. Since 2026-11-17, published posts appear on Home only; Help has no post feed. No database migrations, service records, deployment or authentication changes are required by this addition.

## Maintenance

- `src/shared/help-guides.ts`: questions, training boundaries, suggested examples, need tags, rights links and explicit source provenance; it reuses the existing structured Understand explanations and support tips.
- `src/shared/help-research-links.json`: all 17 URLs retained from the supplied attachment, in original order. The topic mapping uses these indices; update both together if changing the list.
- `src/shared/understand.ts`: shared educational content and the single seizure first-aid sequence.
- Research-reported and implementation dates are separate. Successful source opens during this implementation receive a recheck date; recorded/added dates do not assert rechecking. No human reviewer or human review date has been assigned.

## Source checks and review limitations

Successfully opened on 2026-11-16: United Spinal etiquette article, WHO wheelchair guideline overview, RNIB guiding, W3C principles, ASHA AAC, National Autistic Society meltdowns, Acas adjustments, CDC ME/CFS, CDC seizure first aid, NHS seizure first aid, Epilepsy Foundation emergency guidance, the official Ulaanbaatar ambulance 103 notice, Alzheimer Society of Canada communication advice, RNID and Deafblind UK communication advice. Foreign workplace examples are support suggestions, not Mongolian legal obligations.

Mass.gov and Sense returned HTTP 403. Their research URLs are retained and marked as needing verification. Social Care Wales, BDA, WHO psychological-first-aid article, AT2030 and ADB are retained as research reading without a new verification assertion. Current Mongolian service availability, costs, referral pathways and interpreting provision are not asserted.

Seizure guidance is shared with Understand. CDC and NHS agree on timing, hazards, avoiding restraint/objects in the mouth, waiting for full recovery before food/drink, and ambulance danger signs. Side positioning after convulsions follows NHS. The existing five-minute threshold also cites Epilepsy Foundation through the shared sources. 103 is linked to the local official ambulance notice; no foreign emergency number is copied. Rescue medicine requires a trained person and an individual plan; no doses or lifting/transfer techniques are provided.

Pending: native Mongolian terminology review, Deaf-led/deafblind and AAC-user review, disability-led/lived-experience review, medical review of seizure translation, and local professional assessment of suggested adaptations. Dementia communication advice is not a diagnosis or a guide to all acquired cognitive conditions. Examples describe suggestions to discuss, not actual individual cases or guaranteed services.

## Verification

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, then the existing browser regressions and `node scripts/check-help.cjs` against a local production server. Set `PUBLIC_BROWSER_TOOLS` to an existing Playwright/axe installation if these are not installed in the project. The help runner covers both languages, 320/375/1440px, native keyboard disclosure activation and visible outlines, need/search/reset flows, rights anchors, axe checks, print disclosure content and no-JavaScript access. Screenshots/PDFs go to ignored `artifacts/help`.

Automated browser emulation does not establish full WCAG conformance, real screen-reader usability or physical-device behavior. These require manual and user testing.

Completed on 2026-11-16: lint, TypeScript, public render regressions, production build and the complete `test:browser` chain passed. Help passed six expanded axe scans, keyboard activation using Enter/Space, form Tab order, combined search/filter and reset, all six needs, existing rights anchors, print PDF generation with closed details exposed, 200% text reflow, and no-JavaScript first-aid access. Mobile and desktop screenshots were visually inspected. Browser preview used an isolated local database address; live records were not accessed. Database-unavailable fallback was exercised; existing published-post rendering was covered by the mocked render regressions.
