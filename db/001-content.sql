BEGIN;
CREATE OR REPLACE FUNCTION public.bilingual(value jsonb) RETURNS boolean
LANGUAGE sql IMMUTABLE AS $$
 SELECT COALESCE(jsonb_typeof(value) = 'object' AND jsonb_typeof(value->'mn') = 'string'
 AND jsonb_typeof(value->'en') = 'string' AND (value - 'mn' - 'en') = '{}'::jsonb, false)
$$;
CREATE TABLE IF NOT EXISTS organisations (
 id text PRIMARY KEY, title jsonb NOT NULL CHECK (bilingual(title)), body jsonb NOT NULL CHECK (bilingual(body)),
 region text NOT NULL DEFAULT '', local_area jsonb NOT NULL DEFAULT '{"mn":"","en":""}' CHECK (bilingual(local_area)),
 nationwide boolean NOT NULL DEFAULT false, remote text NOT NULL DEFAULT 'unknown' CHECK (remote IN ('yes','no','unknown')),
 source text NOT NULL DEFAULT '', review_date date, status text NOT NULL DEFAULT 'unknown' CHECK (status IN ('confirmed','unknown')),
 publish_state text NOT NULL DEFAULT 'draft' CHECK (publish_state IN ('draft','published')),
 law_name jsonb NOT NULL DEFAULT '{"mn":"","en":""}' CHECK (bilingual(law_name)),
 article jsonb NOT NULL DEFAULT '{"mn":"","en":""}' CHECK (bilingual(article)),
 revision jsonb NOT NULL DEFAULT '{"mn":"","en":""}' CHECK (bilingual(revision)),
 checklist jsonb NOT NULL DEFAULT '{"mn":"","en":""}' CHECK (bilingual(checklist)),
 website text NOT NULL DEFAULT '', phone text NOT NULL DEFAULT '', email text NOT NULL DEFAULT '',
 legacy_record jsonb,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT publication_evidence CHECK (publish_state <> 'published' OR (
 source ~ '^https?://' AND review_date IS NOT NULL AND btrim(title->>'mn') <> '' AND btrim(title->>'en') <> ''
 AND btrim(body->>'mn') <> '' AND btrim(body->>'en') <> '' AND (title::text || body::text) !~* 'TODO'))
);
CREATE TABLE IF NOT EXISTS rights (LIKE organisations INCLUDING ALL);
CREATE TABLE IF NOT EXISTS guides (LIKE organisations INCLUDING ALL);
CREATE OR REPLACE FUNCTION public.validate_right_publication() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.publish_state = 'published' AND (btrim(NEW.law_name->>'mn') = '' OR btrim(NEW.law_name->>'en') = ''
 OR btrim(NEW.article->>'mn') = '' OR btrim(NEW.article->>'en') = '' OR NEW.source !~ '^https://'
 OR (NEW.law_name::text || NEW.article::text) ~* 'TODO') THEN
 RAISE EXCEPTION 'Published rights require bilingual law name, article and official HTTPS source';
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS right_evidence ON rights;
CREATE TRIGGER right_evidence BEFORE INSERT OR UPDATE ON rights FOR EACH ROW EXECUTE FUNCTION validate_right_publication();
CREATE TABLE IF NOT EXISTS reports (
 id uuid PRIMARY KEY, message jsonb NOT NULL CHECK (bilingual(message)), page jsonb NOT NULL CHECK (bilingual(page)),
 language text NOT NULL CHECK (language IN ('mn','en')), nonce text NOT NULL UNIQUE, rate_key text NOT NULL,
 resolved boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reports_rate_idx ON reports(rate_key, created_at);
CREATE INDEX IF NOT EXISTS reports_time_idx ON reports(created_at);
CREATE TABLE IF NOT EXISTS admin_accounts (user_id text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
INSERT INTO schema_migrations(name) VALUES ('001-content') ON CONFLICT DO NOTHING;
COMMIT;
