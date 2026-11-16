# Mongolia disability rights guide — 2026-11-16

## Input and scope

The attachment provided `Pasted text.txt`, a Mongolian research narrative linking
to `/workspace/output/mongolia-disability-rights-2026-11-16.json`. No JSON file was
present in the attachment directory or project. This implementation uses the
actually supplied narrative and reopened official sources. It does not claim
record-for-record parity with the unavailable 22-record JSON. TODO: reconcile the
original JSON, including every original UNVERIFIED field, when supplied.

Public content is in `src/shared/rights.ts`; `/rights` uses the existing bilingual
types, language helper, header switch, design tokens and educational card styles.
Search uses a GET form and needs no JavaScript. Search matches both languages,
provisions, suggested steps and the benefit records. Search queries are not
written to the database. Other routes, posts, authentication and administration
were not edited. No migrations, external submissions or deployment were run.
No secret files or credentials were inspected or copied into public data.

Search covers visible bilingual content rather than schema/property names.
Amounts written as `600000`, `600,000` or `600 000` match the same benefit topic.

## Evidence and dates

- The actual check date is 2026-11-16 in Asia/Ulaanbaatar. `checkedOn` is set only
  for successfully opened and inspected source content within its stated scope.
- Failed pages have `verification: UNVERIFIED`, `checkedOn: null` and a separate
  `attemptedOn`. The attachment's claim of prior checking is not relabelled as our
  successful verification. The original narrative remains an attachment.
- `publishedOn` and `updatedOn` are separate. The ministry rate announcement
  displays 2026-10-29 as its publication date; a distinct update date could not
  be established and is left null. Unknown dates render explicitly as unknown.
- The ministry confirms the four displayed monthly rates from 2026-11-01.
  Eligibility accompanies every amount. Detailed care assessment, concurrent
  benefits, full document requirements and fees remain UNVERIFIED. No insurance
  pension amount or universal child-money amount is invented.
- Labour provisions 85.1.1, 99.4 and 144 were checked in MNUE's government
  university copy. Despite `lang=en`, its law content is Mongolian. The quota,
  accommodation, pay protection, basic leave and conditional shorter hours are
  distinguished. No universal 36-hour rule is asserted.
- Education provisions 6.5, 8.3 and 10.1.9 were checked in MNUE's copy.
- Disability law articles 4 and 6 were cross-checked in the ministry's 2019
  English white paper appendix. The copy is labelled historical, not a 2026
  consolidated law. Newer amendment history remains UNVERIFIED.
- CRPD and Optional Protocol texts, accession records, and the 30-day
  entry-into-force rules were checked. Mongolia's accession was 2009-05-13;
  country-specific entry into force was 2009-06-12. Individual communications
  are subject to admissibility rules, including exceptions to domestic remedies.
- Health privacy provisions 4, 8 and 9 were checked in a government-hosted PDF.
  Consent and other statutory grounds are distinguished.
- The official State Bulletin PDF contains the procedure under Government
  resolution 117 dated 2025-10-01. Bulletin publication 2026-03-16 is not used
  as the procedure's adoption date. The application routes do not establish local
  device availability or a complete current price list.
- NHRC Mongolian and official English complaint pages support its contacts,
  service guidance and emergency numbers. The complaint form was opened read-only;
  no complaint or personal information was submitted.
- SIGO's 7777-1289 and branch contact page were checked. Its apparent EN link
  returned the same Mongolian page; no English service text is falsely claimed.
- The ministry English landing page was checked, but no matching English rate
  announcement was established. Website English content is explanatory translation,
  not an authoritative English version of Mongolian legislation.

## Unresolved legal/content review

1. Original JSON reconciliation; full native Mongolian and bilingual legal review.
2. Legalinfo detail pages returned 403 or timeouts: disability, building, urban
   development, health insurance, welfare, pension law, education order A/81,
   welfare procedure, transport and its amendment, NHRC law, legal-aid procedure,
   and the reported 2026 amendments. These remain explicitly UNVERIFIED.
3. Parliament's disability amendment listing opened, but its DOCX was unsupported
   by the browsing tool. The research date 2025-07-09 is retained as a reported
   found date, not verified as the latest amendment.
4. Research-reported education amendment 2026-07-03 is not a latest-amendment
   claim. Reported welfare/pension changes effective 2027-01-01 are separated
   from present rules and remain UNVERIFIED. No bill is treated as enacted law.
5. NHRC portal and supplied narrative disagree on article numbering (portal
   13/16 versus research 23). Portal service guidance supports 30-day handling
   and one extension up to 30 days, but legal numbering, two-year limitation and
   detailed jurisdiction require current-law review. Do not apply NHRC deadlines
   to every court, employment or administrative proceeding.
6. Legal Aid Centre contact and news URLs timed out. Its research-reported phone
   and email are visibly UNVERIFIED and not enabled as call/mail actions. Universal
   free advice and representation rules require confirmation.
7. Welfare versus insurance pension eligibility, ages 16–17 and assessment age
   thresholds; permanent-care/caregiver criteria; simultaneous payments; fees,
   documents and application turnaround times need confirmation.
8. Transport cards, device stock/prices/replacement intervals, scholarship and
   tuition criteria, accessible legal aid/interpreters across all 21 aimags and
   9 districts remain unverified. No absence of local services is inferred.
9. OHCHR's CRPD/C/MNG/CO/2-3 listing opened, but its full linked report was blocked.
   No full-report findings were newly attributed as verified, and the 2023 report
   is not presented as a 2026 service audit.
10. The legal rights themselves do not establish real-time service availability.
    Suggested actions are labelled advice, not mandatory legal prerequisites.

## Reproduce browser checks

Run a production server on port 3216, then `node scripts/check-rights.cjs`.
Set `RIGHTS_BROWSER_TOOLS` to a temporary/external directory containing
`node_modules/playwright` and `node_modules/@axe-core/playwright` if these tools
are not installed locally. The runner uses installed Edge. No project dependency
or lockfile changes are needed. Results/screenshots go to `artifacts/rights/`.

Automated checks do not establish complete WCAG compliance, screen-reader
compatibility on every platform, physical-device behaviour or legal correctness.

## Check results

- Lint, TypeScript and production build passed.
- Both languages passed at 375, 768 and 1440 pixels: 11 keyboard-operated
  disclosures, visible focus, skip link, language switching, search, topic filters,
  combined-filter empty state and reset.
- Twelve axe A/AA scans passed (collapsed and expanded, six viewport/language
  combinations); no horizontal overflow or browser JavaScript errors were found.
- Search, disclosures and benefits also worked with JavaScript disabled at
  320 pixels in both languages. Mobile and desktop screenshots were reviewed.
- Physical devices, real screen readers and specialist legal/translation review
  were not tested or claimed.
