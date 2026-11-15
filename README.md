# Хүртээмж

Disability support and rights across Mongolia. Mongolian is primary; English is secondary. No visitor account is needed. Public content queries select published items only. Missing legal and contact information remains TODO [source needed].

## Run

Use Node.js 24. Keep credentials in the ignored .env file; variable names are in .env.example.

```sh
npm ci
npm run dev
npm run lint
npm run build
npm start
```

## Render deployment

Use a Node Web Service for this repository, with Root Directory blank. The checked-in render.yaml defines a free Singapore service with automatic deploys disabled; .node-version pins the verified Node version. For an existing Render service, enter these settings manually instead of creating a second service:

- Build: `npm ci --include=dev && npm run build`
- Start: `npm start -- --port $PORT` (npm start binds to 0.0.0.0)
- Health check: `/`
- Node: `24.14.1`

Copy DATABASE_URL, NEON_AUTH_BASE_URL, NEON_AUTH_COOKIE_SECRET and REPORT_SECRET from the local ignored .env into Render Environment. Set APP_ORIGIN to the exact public HTTPS origin, with no trailing slash, and add that origin to Neon Auth trusted domains on the production branch. Keep public sign-up disabled. The Blueprint prompts for these values; it contains no credentials. Existing services need their environment values entered manually.

Optional storage monitoring uses AWS_ENDPOINT_URL_S3, AWS_REGION, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from .env. They are only needed for the existing /api/health/services probe; that probe is not the Render health check. DATABASE_URL_UNPOOLED is for maintenance scripts and is not required by the web process.

Do not run migration, import, publication or admin-grant commands as part of deployment. The existing Neon database already contains the reviewed data. Do not commit .env, .next, node_modules or *.tsbuildinfo. Creating/syncing a Render Blueprint can start the first deployment even with automatic deploys disabled; do that only when ready. Application preparation does not push code or deploy a service.

## Data and content

Neon Postgres tables: organisations, rights, guides, reports. Editorial records store paired mn/en title, body, local area, law name, article, revision, checklist and contact text. URLs, identifiers, contact addresses, timestamps and enum values are language-neutral. Reports retain the original message in its submitted-language field; the other language is empty rather than a fabricated translation.

All 21 aimags and Ulaanbaatar remain selectable even with no records. District/soum matching is scoped to the selected region. Nationwide/online options are separate. Remote service is yes/no/unknown. Source and review date are required for publication in validation and database constraints. Rights also require an official HTTPS law source, bilingual law name and article. Unknown contact instructions remain TODO until an admin confirms them.

```sh
npm run db:migrate
node --env-file=.env scripts/import-existing.mjs
```

Migrations are versioned under db/. The existing three organisation records were imported as drafts, retaining their original sources/dates and full original record in legacy_record. No claim of direct provider confirmation was added. The original source registries remain available for editorial reference; the directory now reads from Postgres. Import is idempotent and never overwrites existing database records.

## Public pages

The four main pages are Home, Understand, Help and Rights. Help contains the organisation directory, guides, printable checklist and report form. Understand topics open inline. Privacy, disclaimer and accessibility information open within Home. Older public URLs redirect to the matching section; admin/auth and API routes remain separate.

After owner approval, 55 research organisations and 11 support guides were translated and published. All 21 aimags have a published branch listing. Twelve incomplete organisation records and twelve law-level records remain private drafts; the three original organisation records were not modified. Source URLs, original review dates, raw records and legacy records were preserved. Published entries show all research source links and distinguish source confidence from direct provider confirmation. Contacts have not been telephone-tested. Rights also shows published support and entitlement guides; incomplete law-level records are not exposed. Admins can review original research through the authenticated admin API.

## Owner-controlled administration

/admin/login uses managed Neon Auth. Public email sign-up is disabled at Neon; the default Google sign-up provider is removed. The application proxies only email sign-in, sign-out, session and password reset endpoints. Every admin API read and write checks both a verified Neon session and the database admin_accounts allowlist. A logged-in non-admin has no editorial permission.

Create an account as owner using Neon Console, or the authenticated owner CLI:

```sh
neon neon-auth user create --email YOUR_EMAIL --name OWNER_NAME
npm run admin:grant -- USER_ID
```

Then use Set or reset password on /admin/login. No password is embedded in the app. The first owner account has been created and granted admin access. Removing its admin_accounts row revokes editorial access. Account provisioning and permission grants are not exposed through public HTTP APIs.

Managed Neon Auth's documented/plugin-supported feature set does not currently include two-factor authentication, so it is not enabled or claimed. Password reset revokes existing sessions. Set APP_ORIGIN to the actual HTTPS origin before hosting. Authentication is managed by Neon; the website itself has not been deployed.

## Public reports

The footer opens the report form within Help; /contact redirects there. The form writes to reports. Only admins can read/resolve reports. Protection includes same-origin JSON requests, input limits, plain text, honeypot, signed timed one-use tokens, HTTP-only SameSite cookie, and atomic database limits: three reports per session per 15 minutes and 100 total per hour. The global cap protects against session-cookie resets; it can temporarily limit legitimate reports during abuse. No IP addresses or personal identifiers are collected for throttling. Reports are stored, not sent to an external email service.

## Verification

No test files are retained or created, as requested. The previous test suites, test configuration, dependencies and test workflow were removed. CI now runs lint, type generation, typecheck and build.

Completed inline/manual checks: migration on an isolated expiring Neon branch; missing-source/review publication rejected for all three content tables; empty-region and draft isolation; signed-out admin redirects; public admin reads/writes/deletes denied; signup endpoint blocked; live report persistence, honeypot and rate limiting. Temporary verification rows were removed. Signed-in owner CRUD and report resolution still require owner verification and are not claimed as verified.

The site uses system fonts, no heavy media, and printable guides/checklists. Browser print is local. Native Mongolian wording, real-user accessibility, and factual/legal source confirmation remain editorial review tasks.

## Original organisation evidence

The following source notes are preserved from the earlier directory. Their recorded review dates are historical evidence, not current provider confirmation.

<a id="sources"></a>

## Organisation sources

# Listing sources — reviewed 2026-11-14

The three listings are real organisations, replacing the fictional prototype dataset. The review date records when the online source was read; it is not the date a provider confirmed the facts. No phone calls, emails, site visits, or live appointment checks were made. English summaries and address transliterations are editorial translations. Website pages may be undated or outdated.

| Listing                                                | First-party source                                       | Facts supported                                                                                |
| ------------------------------------------------------ | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Employment Support Centre for People with Disabilities | https://dmart.mn/contact-us/                             | Name, enquiry route, office district/address, phone, email, published opening hours            |
| Mongolian National Federation of the Blind             | https://mnfb.mn/mn/about and https://mnfb.mn/mn/programs | Name, purpose/audience, education and accessible-book programmes, office address, phone, email |
| Association of Parents with Differently-abled Children | https://apdc.mn/байгууллагын-товч-мэдээлэл-4/            | Name, parent information/peer-support focus, office address, phone, email                      |

Some older third-party directories and historical documents contain different addresses or phone numbers. Those were not merged into these records. For APDC, use its organisation-overview page, not the historical address in its 2016 constitution. For MNFB, use its current first-party contact details rather than older directory entries. Prefer direct provider confirmation before relying on a visit.

## Information boundaries

- Costs, document requirements, physical access and dedicated communication accommodations remain unknown. Publishing an email address alone does not confirm an accessibility accommodation.
- Audience text describes a provider’s focus, not a guaranteed entitlement or verified enrolment rule. General contact steps are advice, not a provider’s official application process.
- District describes the published office location. It does not restrict eligible residents or claim a service area. The directory is intentionally incomplete.
- Google Maps links are name/address searches under [Google’s Maps URL documentation](https://developers.google.com/maps/documentation/urls/get-started). No precise pin, accessible route, Places data feed, or Google listing was verified. The website does not load a map or request geolocation.

## Updating

Edit `src/shared/listings.ts`; `Service` and `SourceRecord` types live in `src/shared/data.ts`. Every published fact must have a source record listing the fields it supports and its own review date. Leave absent facts null and missing document lists empty. Use `source-checked` after reading the source. Only use `provider-confirmed` with a recorded direct-confirmation date and evidence; never promote a listing just because it appears on Google Maps. Keep `lastChecked` consistent with the latest full source review. Recheck contact details and page changes manually before updating a date.



---

