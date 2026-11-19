# Home-only publishing

Current interface: Mongolian only. Staff open `/admin` directly and sign in with an authorised account. The language switch is removed, and all language query values resolve to Mongolian. Existing stored English fields and source URLs are preserved.

Admin authentication uses a protected route group for `/admin` and `/admin/verification`. `/admin/login` and `/admin/reset` are outside that layout, avoiding a cached-path redirect loop. Successful sign-in uses a fresh document navigation. The browser regression check opens `/admin` directly and checks that the sign-in form renders without repeated redirects.

As of 2026-11-17, every published admin post appears on Home only. Existing `announcement`, `event` and `warning` values are content categories, not page destinations. The editor and previews use bilingual category labels and explicitly explain the Home destination.

Home requests all categories, preserving existing published posts without rewriting records. Understand and Help no longer mount the post feed. The shared feed rejects non-Home paths before querying storage. Authentication, save validation, image handling, draft visibility and database schema are unchanged.

Validation: lint, TypeScript, render regressions and production build passed. Regression checks verify Home does not filter by category and non-Home feed paths return no content. No migration or deployment was performed.

## Editor recovery and regression checks (2026-11-17)

An unsaved editor now keeps its text and selected image files in tab memory across client-side Back/Forward navigation. Returning to Administration restores the editor and image previews. Saving, confirmed cancellation or a confirmed discard clears recovery and releases object URLs. This is not database storage and does not survive reload or tab closure; the existing unload warning remains active.

The password-reset flow captures the requested email once before sending the OTP and uses that same address after the response. `scripts/check-admin.cjs` verifies the race and real React editor history recovery in an isolated browser harness, without live authentication, storage or database operations.

CI now runs `npm test` and the complete browser suite with pinned, isolated Playwright/axe tools and Chromium. Local Windows runners retain Edge as their default; `BROWSER_CHANNEL` can select Chromium. Source exports include the current Help, Rights, Understand, public-site and Home-only review documents.
