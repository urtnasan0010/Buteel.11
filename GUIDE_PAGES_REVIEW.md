# Educational page refinement

The Understand, Help and Rights routes now render Mongolian content directly and do not read language, search or filter query parameters. Primary navigation URLs no longer carry language parameters. Existing paths, Home, authentication and navigation design are unchanged.

All three pages share the locally hosted Cyrillic Noto Serif hero, green gradient title, centered bar and Mongolian subtitle. Native topic disclosures retain their content and keyboard behavior. Understand keeps its twelve-topic anchor list. Body text inside cards is at least 16px. Motion is disabled under reduced-motion preferences.

Public source lists, review badges, source dates and supplemental research links were removed. Source records and human-review metadata remain in the structured files and internal admin verification report; this UI change does not change their verification status. Seizure steps are unchanged, each relevant page keeps one pending-medical-review note and a 103 button. Rights retains 102/103/108, benefit eligibility, benefit commencement dates, contacts, future-change distinctions and the single short footer disclaimer. Unverified contact numbers remain suppressed by the existing public-data projection.

No database columns or records changed. No database column became newly unused everywhere: these pages already read bundled TypeScript/JSON data, not database source/review columns. Existing legacy database fields still have import, publication or archival uses; they were not removed.

Shared browser checks cover ignored legacy query parameters, all topic counts, absence of filters/source UI, keyboard disclosure activation, visible focus, accessibility scans, 360/1280px layouts, 320px without JavaScript, printing, reduced motion, emergency links, benefit dates and contacts. Automated checks do not establish physical-device or screen-reader conformance.

Completed on 2026-11-17: lint, TypeScript, render regressions, production build and the complete public/guide/admin browser suite passed. Mobile and desktop screenshots were visually inspected. No deployment or live database operations were performed.
