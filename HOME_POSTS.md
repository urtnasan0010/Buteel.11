# Home posts

The Home feed adapts Nytheria's news-post flow to Hurteemj's existing Next.js app and cream/green design. Understand, Help and Rights keep their blank bodies.

## Use

- Open Administration in the footer, or `/admin?lang=mn`. Existing Neon sign-in and the `admin_accounts` allowlist protect the editor and every post API request. No public signup endpoint is enabled.
- Create a post with a Mongolian title, description, type (event, announcement or warning), publication date, and pictures. Drafts can be incomplete. Publishing requires Mongolian text and image descriptions, without TODO placeholders. English fields and event start/end controls are not shown.
- Save drafts, preview in the selected language, edit, publish, move back to draft, or delete. Deleting hides a post while retaining its database record and images for recovery. No other content editor was restored.
- Changed fields or pictures trigger a discard confirmation for header/footer navigation, language changes, Cancel and sign-out. Unchanged records can close directly; reload/close retains the browser's native warning. Navigation is blocked while a save is pending.
- Visitors see published posts only, newest post date first. Pagination works without JavaScript. The Home heading, category filters and empty-feed message are intentionally hidden. Long descriptions expand with native keyboard-accessible disclosures. Galleries support horizontal scrolling.

## Storage

`db/004-home-posts.sql` adds `home_posts` and `home_post_media_cleanup` and registers the migration. It does not import, publish, overwrite or delete existing content. Apply it only with the owner's approval, using the existing direct database connection. This migration was approved and applied on 2026-11-16; the post table was empty immediately afterwards.

`db/005-mongolian-posts.sql` changes only the Home post publication constraint to require Mongolian text rather than both languages. The owner approved it and it was applied on 2026-11-16. Existing English fields and event dates remain stored for compatibility; the current site renders Mongolian content and the publication date only. No record is published by this migration.

Images use the existing `assets` S3-compatible bucket, under `home-posts/`. Maximums: 70 pictures per post, 5 MiB per picture, 32 MiB per save including text and multipart overhead. JPEG, PNG, WebP and GIF are checked by MIME type and file signature. Images have opaque IDs; application image routes check the associated publication state on every request and send no-store responses. Keep the bucket private: application checks cannot restrict independently public storage URLs.

Removed images enter a cleanup queue in the same transaction as the edit. Successful saves retry queued deletion. Failed uploads are cleaned up when their outcome is known. If a commit response is lost, images are retained to avoid breaking a possibly successful post. A stable post ID and version conflict prevent a blind retry from creating duplicates. Concurrent edits require loading the latest version.

## Verification and limits

- Lint, TypeScript and production build checks.
- Service behavior and the migration checked in an isolated temporary PostgreSQL database. Image storage was mocked for fault scenarios; no test posts or pictures were written to live services.
- Browser checks of the real public feed and login routes, plus the actual editor component in an isolated harness with mocked authentication/API responses. This does not substitute for an owner signing in and uploading a real picture through Neon Auth and object storage.
- No automated test files were added. No deployment or push was performed.

## Undo

Use `git diff` and selective `git checkout -p -- <file>` to undo source changes without discarding earlier work. Newly added files need separate review/removal. Keep the additive database tables unless their data has been backed up and the owner explicitly approves a separate database rollback; reverting source does not remove stored posts.

## Post destinations

The Type selector now chooses ???? (`/`), ?????? (`/understand`) or ??????? (`/help`). Each destination lists only its assigned published posts. Existing storage IDs remain `announcement`, `event` and `warning`, respectively, to avoid rewriting stored records. Existing posts follow that same mapping; no migration or publication change is performed. Rights remains blank.
