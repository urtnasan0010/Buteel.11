# Хүртээмж

Local bilingual support directory with three real organisations, based on their own published information. Contact details and source-review dates are available on each listing. These records are source checked, not directly provider confirmed. Unknown costs, requirements, and accessibility remain unknown. No database or account is required. See [SOURCES.md](SOURCES.md) for evidence and limitations.

## Run

Next.js routes stay in `src/app`. Supporting code uses client/server/shared folders; see [STRUCTURE.md](STRUCTURE.md). Edit interface text in `src/shared/translations.ts`; organisation facts and evidence remain in `src/shared/listings.ts`.

Requires Node.js 20.9+ and npm.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. For production locally, run `npm run build` then `npm start`.

## Validate

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:browser
npm run test:a11y
```

Browser checks use installed Microsoft Edge through Playwright, including axe accessibility checks. Change the channel in playwright.config.ts and install Chromium with `npx playwright install chromium` if Edge is unavailable. Browser tests require the production build. Automated tests are not a guarantee of WCAG conformance or a substitute for assistive-technology user testing.

See [ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md) for baseline results, fixes, bilingual audit coverage and explicit limits. The statement retains visible TODOs for its final date, known limits, contact and response target. `test:a11y` runs the focused accessibility suite; `test:browser` includes it along with the existing flows.

## Content replacement

Sourced general-content claims live in `src/shared/claims.ts`, separate from directory records. `CLAIMS_REVIEW.md` explains source checks and why claims 1, 2 and 13 remain TODO-only. Published claims have bilingual attributed text, confidence, per-source title/language/type/access, and an editorial review date. `CONTENT_REVIEW.md` tracks native-speaker, disabled-person and legal/process review; the dates are not legal sign-off. `OUTREACH_LEADS.md` is internal and must not be linked from or imported into the site. No contact details are supplied for those leads.

Edit `src/shared/listings.ts`; types and filtering live in `src/shared/data.ts`. Each listing has bilingual content, contacts, office district, cost, accessibility, sources with field coverage, review dates, and a separate direct-confirmation date. Unknown fields must remain `null`; never convert missing accessibility information to false. A filter only matches features explicitly true. Preserve both languages.

When adding a listing, record its first-party source and the fields it supports. Reading a web page supports `source-checked`; only direct confirmation supports `provider-confirmed` and its date. Do not infer opening hours, eligibility, costs, documents, or accessible features. Guides and contact steps are general advice. District means office location, not service eligibility. Home shows categories with entries; the remaining categories stay searchable as the directory grows. Google Maps links search published names/addresses; they are not verified pins or accessible directions and require no API key.

## Privacy and feedback

The main navigation is Find support, Understand, Help and Reach. New general-guidance pages use `src/shared/content-pages.ts`, bilingual keys in `src/shared/translations.ts`, and the reusable server content template. The home audience chooser is ordinary links; no selection is stored. Existing directory and information URLs remain available. See [CONTENT_REVIEW.md](CONTENT_REVIEW.md) for every page awaiting native Mongolian and disabled-person review. All new guidance carries source and review-date TODOs; rights/legal duties await supplied official sources and the voices page awaits consent. Print buttons use browser printing, not whole-site offline caching.

The footer links to `/how-it-works`, `/privacy`, `/contact`, and `/for-organisations` in both languages. The contact page is the main correction-report destination; the existing about-page form remains available for older links. Contact delivery, multiple directory contact channels and a regular review operation are explicitly not configured. No emergency directory or unverified helpline numbers were added. Offline checklists, system dark-mode support and future rights/easy-read/glossary/sign-language content remain separate follow-up work; this change does not claim them as delivered.

The public `/accessibility` page describes completed checks and outstanding testing in both languages. Follow [ACCESSIBILITY_TEST_PLAN.md](ACCESSIBILITY_TEST_PLAN.md) for keyboard, NVDA, VoiceOver, real-user sessions, listing review and launch preparation. Correction delivery is intentionally deferred by the owner; no monitored address, reviewer, or response-time commitment has been set. The provider outreach message is only a draft and has not been sent.

Search and filters are stored in shareable GET URLs. Do not enter sensitive personal information. Feedback is kept only in page memory; the form makes a copyable report and never claims delivery. Clipboard failure offers manual copying. Checklists last while their page is open and can be printed with the browser print dialog. No analytics, external fonts, large assets, login, payment, or public deployment is included.

