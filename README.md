# Hurteemj

Mongolian-only website with Home, Understand, Help and Rights pages. Home includes bundled guidance and all published posts. Understand, Help and Rights contain educational guides without post feeds. Essential information does not require a seeded database. There is no language switch, and legacy `?lang=en` URLs serve Mongolian. Stored English fields remain intact for compatibility.

## Run locally

Use the Node.js version in `.node-version`. Keep credentials in the ignored `.env`; `.env.example` documents variable names.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm start
```

## Home posts

Visitors can read published posts with expandable descriptions, galleries and pagination. The site reads posts and images from the existing database and private bucket.

Runtime environment variables:

- `DATABASE_URL`: pooled Postgres connection.
- `AWS_ENDPOINT_URL_S3`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`: existing private `assets` bucket for post images.

Never commit secrets. `DATABASE_URL_UNPOOLED` is for maintenance commands, not the web process. The retired reporting feature no longer uses `REPORT_SECRET`; existing environment values can stay in place.

## Database and retained records

Versioned migrations remain under `db/`. Home reads from `home_posts`. Existing organisation, guide, rights, report and disability-category records are retained in Postgres but are no longer connected to the public pages. This cleanup does not delete or change database records.

The original listings, research translations, review flags and research maintenance scripts are retained as data history. They are not run by the website. Only the retired disability-category seed script and unused feature modules were removed.

Apply database changes only after owner approval:

```sh
npm run db:migrate
```

## Render configuration

Keep Root Directory blank for this repository. The checked-in `render.yaml` keeps automatic deployments disabled.

- Build: `npm ci --include=dev && npm run build`
- Start: `npm start -- --port $PORT`
- Health check: `/api/health` (returns 503 if the post table or private image bucket is unavailable).

Supply runtime variables in Render; do not run migrations, imports or publications as part of deployment. Configuring or syncing a Blueprint can initiate its first deployment, so do it only when authorized. Local changes do not push or deploy anything.

The Blueprint declares all required database and image-storage variables as manual inputs. For an existing Render service, add the four AWS variables and change the health-check path manually; local Blueprint edits do not update a running service.

## Share source safely

On Windows, run `npm run source:zip`. It creates `artifacts/hurteemj-source.zip` from an explicit source/configuration list, including migrations and maintenance scripts. It excludes `.env`, `.neon`, `.git`, `node_modules` and `.next`; only `.env.example` is included as the environment template. Never send an archive made by selecting the entire workspace. If actual credentials were shared in an earlier archive, rotate them at the provider and update local/host configuration; creating a clean ZIP does not revoke old credentials.

## Cleanup and undo

The unused directory, reporting, disability-guide and general-content-editor modules have been removed.

Review with `git diff`. Use `git checkout -p -- <file>` for selected tracked changes; inspect new files separately. Preserve unrelated uncommitted changes. Reverting source does not undo database migrations or stored posts. Do not commit `.env`, `.next`, `node_modules` or `*.tsbuildinfo`.
