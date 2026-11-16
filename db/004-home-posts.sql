BEGIN;
CREATE TABLE IF NOT EXISTS home_posts (
 id uuid PRIMARY KEY,
 title jsonb NOT NULL CHECK (bilingual(title)),
 body jsonb NOT NULL CHECK (bilingual(body)),
 type text NOT NULL CHECK (type IN ('event','announcement','warning')),
 posted_date date NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Ulaanbaatar')::date,
 start_date date, end_date date,
 publish_state text NOT NULL DEFAULT 'draft' CHECK (publish_state IN ('draft','published')),
 images jsonb NOT NULL DEFAULT '[]' CHECK (jsonb_typeof(images)='array' AND jsonb_array_length(images)<=70),
 version integer NOT NULL DEFAULT 1 CHECK (version>0),
 created_by text NOT NULL, updated_by text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz,
 CHECK (end_date IS NULL OR (start_date IS NOT NULL AND end_date>=start_date)),
 CHECK (publish_state<>'published' OR (
  btrim(title->>'mn')<>'' AND btrim(title->>'en')<>'' AND btrim(body->>'mn')<>'' AND btrim(body->>'en')<>''
  AND (title::text || body::text) !~* 'TODO'
 ))
);
CREATE INDEX IF NOT EXISTS home_posts_feed_idx ON home_posts(posted_date DESC,created_at DESC,id DESC) WHERE deleted_at IS NULL AND publish_state='published';
CREATE TABLE IF NOT EXISTS home_post_media_cleanup (object_key text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now());
INSERT INTO schema_migrations(name) VALUES ('004-home-posts') ON CONFLICT DO NOTHING;
COMMIT;
