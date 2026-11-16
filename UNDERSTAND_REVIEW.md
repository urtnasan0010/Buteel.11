# /understand content review

Source verification: 2026-11-16 (Asia/Ulaanbaatar). Each source in
`src/shared/understand.ts` was opened and the relevant content inspected on this
date. Dates describe this check, not the publisher's review or publication date.
Keep each source's date unchanged until someone checks that source again.

The supplied research was a starting point, not evidence of verification. The
Sense blog returned HTTP 403; its claims were checked against the two linked
Deafblind UK pages instead. No verification date is assigned to the blocked page.
The old NHS deafblindness URL redirected to a charity homepage and is not cited.

The topic source arrays support the topic's explanation, variation,
misunderstanding corrections and advice. General consent, personal preferences
and access advice also follow United Spinal and the New Zealand Ministry of
Social Development. Advice is a plain-language synthesis, not a quotation or a
promise of locally available services. ME/CFS is an example, not a description of
every chronic illness. Intellectual disability, autism, ADHD, dyslexia and
psychosocial disability remain separate topics.

## Outstanding review

- TODO: Native Mongolian editorial and terminology review, including the distinct
  concepts of intellectual disability, specific learning difficulties and
  psychosocial disability. The English and Mongolian fields need joint review.
- TODO: Review by people with the relevant lived experiences and disability
  representative organisations; no such review is claimed.
- TODO: A clinician or qualified first-aid instructor should review the
  Mongolian seizure translation. The updated sequence follows NHS guidance on
  moving only away from danger, side positioning after convulsions stop, and
  remaining in a wheelchair with brakes applied and belt/harness left on.
  CDC cross-checks the prohibition on restraint, objects in the mouth, food or
  drink before full alertness, and mouth-to-mouth during a seizure. Epilepsy
  Foundation supports calling at five minutes or longer; the page explicitly
  says not to wait for five minutes when another danger sign appears. Do not
  interpret positioning as forcibly moving or restraining a person. Criteria include
  prolonged or repeated seizures, breathing/waking problems, injury, water,
  first seizure, pregnancy, and diabetes with loss of consciousness.
- The local Emergency Medical Centre page supports calling 103. No SMS,
  accessible dispatch or interpreter availability is claimed or verified.
- The original unverified hearing-aid generalisation remains omitted. The new
  Scope source supports wheelchair use for longer journeys; NHS aphasia guidance
  now supports the explanation of language, reading and writing difficulties.
- Braille, tactile systems, sign languages and assistive communication are
  individual choices. Foreign source examples do not establish Mongolian service
  availability. No foreign emergency number is presented as Mongolia's number.

## Maintenance and scope

Edit bilingual topic data and source dates in `src/shared/understand.ts`.
Seizure instructions have a separate ordered data block for safety review.
The page uses native details/summary, the site's language query and design tokens.
Existing event posts remain below the guide, with their pagination and storage
identifiers retained. Existing post bodies remain in their original language.
No migrations, database writes, deployment or authentication changes are needed.

## Expanded research update — 2026-11-16

All 12 records now include everyday experiences, school/work support, digital
access and deeper explanations in Mongolian and English. Added sources were
opened and checked on 2026-11-16; publisher dates in the supplied research are
not copied into verification fields. Existing source dates remain unchanged.

New material includes cerebral palsy, AAC, supported decisions, autistic
overload and masking, executive functioning, different mental-health support
approaches, photosensitivity, pain, Long COVID and individual energy management.
These remain educational summaries, not diagnostic or treatment instructions.
General school/work and digital suggestions are applications of the cited access
principles, not claims that any adjustment is required or suitable for everyone.

Both supplied WFDB URLs (`https://wfdb.eu/what-is-deafblindness/` and
`https://wfdb.eu/interpretation/`) timed out on repeated attempts. They have no
verification dates and are not included as checked sources. Deafblind UK and W3C
support the retained communication/access summaries. TODO: check WFDB's distinct
definition and interpreter-guide material before attributing further claims to it.

The UK-specific learning disability/difficulty terminology note was shortened
to a general reminder to read terms in context. TODO: specialist bilingual review
before publishing a broader translation rule. Clinical definitions and support
needs remain separate throughout.

The Ministry of Education JICA START 2 page was opened and checked. It is linked
as historical Mongolian reading about 2021–2022 educational projects. Linked
videos/documents were not audited, downloaded, embedded or presented as current
services. TODO: lived-experience and accessibility review of linked materials.

The research's proposed website changes are presented as access advice within
the guide. No new contact channel, timeout behaviour elsewhere, admin workflow
or claim of site-wide WCAG conformance is introduced.

## Verification

- `npm run lint`, `npm run typecheck`, `npm run build` passed.
- Production page checked in headless Edge at 375, 768 and 1440 pixels in both
  languages, with 320-pixel reflow checked in both languages.
- All 12 disclosures reached with Tab and operated with Enter and Space; skip
  link and visible focus checked. Language switch checked in both directions,
  including the root document language attribute.
- Axe WCAG A/AA scans passed with details collapsed and expanded at all six
  language/viewport combinations (12 scans). No horizontal overflow or browser
  JavaScript errors were found. Screenshots are under `artifacts/understand/`.
- These are browser automation and visual checks, not physical-device,
  screen-reader or complete WCAG conformance certification.
- Reproduce with a production server on port 3216 and
  `node scripts/check-understand.cjs`. The script needs `playwright` and
  `@axe-core/playwright`, plus installed Edge. Set `UNDERSTAND_BROWSER_TOOLS` to
  an external directory containing their `node_modules` if they are not local.
  No project dependencies were added for these checks.
