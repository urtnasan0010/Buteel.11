BEGIN;
-- Relax only home_posts publication requirements. Preserve all stored text and dates.
DO $$
DECLARE publication_check record;
BEGIN
 FOR publication_check IN
  SELECT conname FROM pg_constraint
  WHERE conrelid='public.home_posts'::regclass AND contype='c'
   AND pg_get_constraintdef(oid) LIKE '%publish_state%'
   AND pg_get_constraintdef(oid) LIKE '%title%'
   AND pg_get_constraintdef(oid) LIKE '%body%'
 LOOP
  EXECUTE format('ALTER TABLE public.home_posts DROP CONSTRAINT %I',publication_check.conname);
 END LOOP;
END $$;
ALTER TABLE home_posts ADD CONSTRAINT home_posts_publication_mn CHECK (
 publish_state<>'published' OR (
  btrim(title->>'mn')<>'' AND btrim(body->>'mn')<>''
  AND ((title->>'mn') || (body->>'mn')) !~* 'TODO'
 )
);
INSERT INTO schema_migrations(name) VALUES ('005-mongolian-posts') ON CONFLICT DO NOTHING;
COMMIT;
