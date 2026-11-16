# Public website fixes

Current policy (2026-11-17): the site is Mongolian-only, with no language switch. A visible Ажилтан header link opens `/admin`; anonymous users are redirected to sign-in and private routes remain protected. This supersedes the historical hidden-admin and bilingual-navigation behavior described below.

## Root cause and baseline content

Home and Help used only `listPosts()` server output. When the query succeeded
with zero published posts, the renderer mapped an empty array into an empty
section. It had no h1, introduction or empty-state copy. The previous README
explicitly described these elements as intentionally hidden. Legacy directory
records are not queried by these routes, so reseeding organisations would not
repair this rendering path.

The fix provides a deterministic, idempotent bundled baseline in
`src/shared/landing-content.ts`. Every build/start includes it without an import,
database seed, migration or auto-publication. Repeated starts cannot duplicate or
overwrite database posts. Existing published announcement/warning/event records
now appear on Home only, with their stored categories retained (updated 2026-11-17). Empty and unavailable feeds show a short
message and a link to the official-advice contact section; render errors have a
contact link too. Errors are logged generically without driver details/secrets.

Production-like reproduction used a new local PostgreSQL 18 cluster entirely
under ignored `artifacts/isolated-postgres`, bound to 127.0.0.1:55436. No seed was
run. First, missing tables exercised the unavailable path. Then only schema
files 001, 004 and 005 were applied to that disposable local cluster, leaving
`home_posts` empty. A production build/start used that explicit local connection,
`RENDER=true`, a local APP_ORIGIN and no managed-auth configuration. Home and Help
returned HTTP 200, headings and useful main content in both languages. This never
connected to or changed the live database.

`postgresUrl()` allows explicit `sslmode=disable` only for loopback hosts so the
disposable local cluster can be used. Remote database URLs still force verified
TLS. No environment variable values or secret files were read or printed.

The live Render URLs could not be fetched through the available web tool. The
live deployment/data state and any host-specific outage are not confirmed. The
source defect and its empty/failing database reproduction are confirmed locally.

## Files by task

1. `src/shared/landing-content.ts`, `src/server/components/posts-page.tsx`,
   `src/server/postgres-url.mjs`, `scripts/test-loader.cjs`,
   `scripts/test-public.cjs`: bundled guides, fallback, isolated render tests.
2. `src/shared/rights-public.ts`, `src/app/rights/page.tsx`,
   `src/app/admin/verification/page.tsx`, `src/app/admin/page.tsx`: separate public
   copy and protected internal evidence. Raw `rights.ts` research metadata is
   retained. Search uses public copy, so internal terminology does not leak through
   matching results. Generic verified/unconfirmed wording replaces process notes.
3. `src/shared/rights-publication.ts`, public Rights projection/rendering and
   regression scripts: suppress unconfirmed phone/email and legal provisions.
   Source-controlled per-item overrides require `publishUnverified`, `approvedBy`,
   `approvedAt`, and `reason`. No override is enabled. This is a deliberate admin
   setting, not a public query parameter or an editable visitor control. It does
   not turn an unconfirmed item into a verified one. Ministry benefit amounts and
   dated 2027-01-01 notes remain. Internal contact data stays in the protected view.
4. `src/app/layout.tsx`, `src/app/admin/layout.tsx`, `src/server/auth.ts`,
   Understand and PostsPage: no public Staff/Administration links; fail-closed
   shared admin guard; empty related-post headings are omitted. `/admin/login`
   and `/admin/reset` necessarily remain anonymous authentication entry forms;
   neither contains private editor/verification content. Actual editor and
   verification routes require an allowlisted admin. No visitor accounts/third
   product role added.
5. `src/shared/understand.ts`, `src/app/understand/page.tsx`, stylesheet and
   Understand tests: second sourced epilepsy tip; 12-link topic index; brief
   Mongolian glosses for meltdown/shutdown/masking; medical-review warning next
   to first aid. Each source has added_at, reviewed_by and reviewed_at. All human
   review fields remain null. Historical automated checkedOn is retained for
   internal evidence but no longer presented as a human review date. A review
   date appears only with a named reviewer and valid review date.

README.md and HOME_POSTS.md now describe current public navigation and fallback
behaviour. `src/app/error.tsx` adds a contact link. `package.json` exposes the new
test commands; no dependency or lockfile change was needed.

## Verification and limits

Each task was followed by a production build and the available render/browser
regressions before moving to the next task. Final commands:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run test:browser`

Browser runners use installed headless Edge, Playwright and axe from an already
available external tools directory (no new project dependency). Set
PUBLIC_BROWSER_TOOLS, RIGHTS_BROWSER_TOOLS and UNDERSTAND_BROWSER_TOOLS to its
parent directory; start a local production server on port 3216 first. For a
different server, set the corresponding *_BASE_URL variables.

Public checks cover all four routes in both languages at 360/1440px: headings,
main content, no admin links, no unverified known contacts, no internal phrases,
no horizontal overflow and Home/Help axe checks. Anonymous editor/verification
redirects and API 401 are checked; login/reset forms remain accessible.

Rights covers 375/768/1440px in both languages, keyboard disclosure operation,
visible focus, skip link, search, combined filters, language switch, 12 collapsed/
expanded axe scans and no-JavaScript 320px reflow. Understand adds 360px to its
375/768/1440px checks, tests all topic-index anchors, human-review date selection,
medical warning visibility and 16 collapsed/expanded axe scans.

Render tests simulate empty and failed reads, plus authenticated and anonymous
admin guards. Authenticated verification is tested using a mocked allowlisted
identity; no real account was used to sign in. Physical-device tests, actual
screen-reader use and a live authenticated Neon end-to-end session remain undone.
Automated axe results do not establish complete WCAG conformance.

## Render

No deployment or Render configuration changes were made. No new env var,
persistent disk, seed hook, build command or start command is needed for the
bundled public baseline. Existing build `npm ci --include=dev && npm run build`
and start `npm start -- --port $PORT` remain suitable. Posts/admin/images still
require their existing external Postgres, auth and object-storage configuration;
new post databases need the existing schema migrations through the approved
maintenance workflow. `/api/health` still checks those services, so missing
service configuration can fail host health checks even though public guide
content is database-independent. This change does not hide infrastructure health.

## Human review TODO

- Native Mongolian editor: all new landing/fallback/status/contact wording,
  topic-index label and three autism glosses; English equivalence as well.
- Medical reviewer: Mongolian seizure first aid and the new recovery tip. The
  warning remains visibly next to the first-aid instructions.
- Lawyer/disability representatives: Rights terminology, old copies versus
  current consolidated law, benefit eligibility and upcoming amendments. See
  RIGHTS_REVIEW.md for retained evidence gaps. No new legal facts were invented.
- Site owner: any deliberate unconfirmed publication override must have the
  per-item approval fields and remain clearly unconfirmed to visitors.
