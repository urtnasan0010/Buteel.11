# Content review register

All Mongolian text is a draft: TODO [native-speaker review]. All new guidance and navigation also require TODO [review by disabled people]. No row below is an approval, source verification or user-test result. English text needs editorial and lived-experience review too. Organisation records and their evidence have not been changed.

| Route / content | Native Mongolian review | Review by disabled people | Source / other input |
| --- | --- | --- | --- |
| `/` home and audience links | TODO | TODO | Check words, choices and direct directory access |
| Global navigation/footer (every route) | TODO | TODO | Same words and order everywhere |
| `/understand` | TODO | TODO | TODO [source needed]; TODO [review date] |
| `/understand/needs` | TODO | TODO | TODO [source needed]; TODO [review date] |
| `/understand/respectful-language` | TODO | TODO | TODO [source needed]; TODO [review date] |
| `/understand/myths` | TODO | TODO | TODO [source needed]; TODO [review date] |
| `/understand/rights` | TODO | TODO | Official sources must be supplied for all Mongolian legal claims; TODO [source needed]; TODO [review date] |
| `/understand/voices` | TODO | TODO | TODO [consent needed]; no quotes or stories; agree attribution, edits and withdrawal before publication; TODO [source needed]; TODO [review date] |
| `/help` | TODO | TODO | TODO [source needed]; TODO [review date] |
| `/help/families` | TODO | TODO | Reuses `/guides`; TODO [source needed]; TODO [review date] |
| `/help/friends-volunteers` | TODO | TODO | Ask first / follow the person; TODO [source needed]; TODO [review date] |
| `/help/employers-schools` | TODO | TODO | Legal duties require supplied official sources; TODO [source needed]; TODO [review date] |
| `/help/support-organisations` | TODO | TODO | General guidance only; TODO [source needed]; TODO [review date] |
| `/reach` | TODO | TODO | TODO [source needed]; TODO [review date] |
| `/reach/communication` | TODO | TODO | TODO [source needed]; TODO [review date] |
| `/reach/accessible-formats` | TODO | TODO | No claim that easy-read/captions/sign-language content has been produced; TODO [source needed]; TODO [review date] |
| `/reach/offline` | TODO | TODO | Printable advice, not a service worker or fully offline site; physical print test pending; TODO [source needed]; TODO [review date] |
| `/how-it-works`, `/privacy`, `/contact`, `/for-organisations` | TODO | TODO | Existing pages reused unchanged; confirm wording still matches operations before launch |
| `/about`, `/accessibility`, `/guides`, checklist | TODO | TODO | Existing draft wording; no manual accessibility review claimed |
| `/services`, `/services/[id]` | TODO | TODO | Existing interface/translation review; facts and evidence unchanged |
| Loading, error and 404 text | TODO | TODO | Include in reading and keyboard review |

## Supplied claims review — 2026-11-14 editorial check

Every Mongolian claim in `src/shared/claims.ts` is draft text: TODO [native-speaker review]. All claim wording and placement also need TODO [review by disabled people]. Legal interpretations require TODO [lawyer review]; the review date is not legal sign-off or proof of current service operation.

| Claim | Page | Publication | Required reviews / remaining input |
| --- | --- | --- | --- |
| 1 `law-2016` | Rights | TODO only | Native speaker, disabled people, lawyer; legalinfo 403; readable official source needed |
| 2 `revision-status` | Rights | TODO only | Native speaker, disabled people, lawyer; consultation article/date and general footer do not support supplied September-2026/144/adoption inference |
| 3 `reported-draft-return` | Rights | Published as reported proposal | Native speaker, disabled people, lawyer; not adopted rules |
| 4 `accessibility-draft` | Rights | Published as government statement | Native speaker, disabled people, lawyer; indexed PDF extract, not a claim of adoption |
| 5 `employment-quota` | Employers/schools | Published UN attribution | Native speaker, disabled people, lawyer; TODO [official source needed] for current Labour Law and threshold conflict |
| 6 `employment-protections` | Employers/schools | Published historical UN summary | Native speaker, disabled people, lawyer; reasonable-accommodation terminology needs particular review |
| 7 `reported-quota-compliance` | Employers/schools | Published historical reported note | Native speaker, disabled people; original short URL unavailable, canonical indexed article supports supplied figure |
| 8 `pension-online` | Families | Published historical report | Native speaker, disabled people, service/process reviewer; TODO [information date], TODO [current requirements], TODO [verify steps] |
| 9 `authority-established` | Rights | Published UN attribution | Native speaker, disabled people; not a new directory record |
| 10 `commission-2023` | Needs | Published Commission attribution, 2023 | Native speaker, disabled people; not current statistics or individual eligibility |
| 11 `sign-language-2023` | Communication | Published delegation/expert attribution, 2023 | Native speaker, disabled people including deaf reviewers; not current interpreter availability |
| 12 `expert-concerns-2023` | Rights | Published attributed expert concerns | Native speaker, disabled people, lawyer; not current legal advice |
| 13 `assessment-process` | Rights | TODO only | Native speaker, disabled people, lawyer/process reviewer; no official committee/process source supplied |

All page-level general-guidance source/review TODOs remain; claim citations only support their adjacent claim. Other visible TODOs remain for emergency/helpline numbers, benefit amounts/eligibility/rules, population figure/year, Convention ratification, and terminology consultation. The voices consent placeholder is unchanged. Existing accessibility-statement contact, response target, date and known-limit TODOs remain. Outreach leads are internal only, without contact details or public links.

## Other outstanding inputs

- Supply official sources before replacing any Mongolian law/rights, legal-duty, helpline or statistics placeholder. No helplines or statistics were introduced.
- Obtain contributor consent before adding voices content; do not turn the empty structure into invented testimony.
- Review all Mongolian entries in `src/shared/translations.ts`, plus existing bilingual listing translations, with a native speaker. Keep source facts intact unless separately authorised.
- Test the wording, section labels and audience chooser with disabled people and people around them. The chooser is ordinary links, not a profile or stored preference.
- Source and last-reviewed TODOs must remain until a real review occurs. Existing accessibility-statement contact/date/known-limit TODOs are separate and remain.
- Actual screen-reader speech (NVDA, VoiceOver, TalkBack), human keyboard runs, true browser zoom, physical phones and paper printing remain unverified. Automated accessibility-tree, keyboard, text-size and print-emulation tests do not complete these tasks.

## Page registry

`src/shared/content-pages.ts` owns the new paths, translation keys, points and related links. `src/shared/translations.ts` owns bilingual copy. `src/server/components/section-content.tsx` is the shared new-content template; its provenance placeholders deliberately do not manufacture sources or dates. The existing information-page component remains for existing routes.

## Mongolian Sign Language preparation - 2026-11-14
All Mongolian text needs native review. All MSL content must be created and approved by Deaf signers and reviewed by Deaf signers before publication. No sign language videos are available. TODO: commission real content with consent, captions and complete transcripts; confirm terminology with Deaf reviewers. TODO: verify current adoption status of the MSL bill and current services/interpreting availability with official sources. Organisation interpreting remains unknown pending direct confirmation. The ministry quotation was readable at the non-www URL; the cited www URL was unavailable to the research tool.
