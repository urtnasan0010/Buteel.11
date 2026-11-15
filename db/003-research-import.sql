BEGIN;

ALTER TABLE organisations
 ADD COLUMN IF NOT EXISTS confidence text,
 ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT '',
 ADD COLUMN IF NOT EXISTS disability_focus jsonb NOT NULL DEFAULT '{"mn":"","en":""}',
 ADD COLUMN IF NOT EXISTS address jsonb NOT NULL DEFAULT '{"mn":"","en":""}',
 ADD COLUMN IF NOT EXISTS hours jsonb NOT NULL DEFAULT '{"mn":"","en":""}',
 ADD COLUMN IF NOT EXISTS phones jsonb NOT NULL DEFAULT '[]',
 ADD COLUMN IF NOT EXISTS emails jsonb NOT NULL DEFAULT '[]',
 ADD COLUMN IF NOT EXISTS how_to_apply jsonb NOT NULL DEFAULT '{"mn":"","en":""}',
 ADD COLUMN IF NOT EXISTS eligibility jsonb NOT NULL DEFAULT '{"mn":"","en":""}',
 ADD COLUMN IF NOT EXISTS contact_tested boolean NOT NULL DEFAULT false,
 ADD COLUMN IF NOT EXISTS confirmed_at date,
 ADD COLUMN IF NOT EXISTS confirmation_note text NOT NULL DEFAULT '',
 ADD COLUMN IF NOT EXISTS raw_record jsonb;

-- Preserve the original research for every destination, without changing legacy_record.
ALTER TABLE rights ADD COLUMN IF NOT EXISTS raw_record jsonb;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS raw_record jsonb;

DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'organisations'::regclass AND conname = 'organisation_research_shape') THEN
  ALTER TABLE organisations ADD CONSTRAINT organisation_research_shape CHECK (
   (confidence IS NULL OR confidence IN ('high','medium','low'))
   AND bilingual(disability_focus) AND bilingual(address) AND bilingual(hours)
   AND bilingual(how_to_apply) AND bilingual(eligibility)
   AND jsonb_typeof(phones) = 'array' AND jsonb_typeof(emails) = 'array'
   AND NOT jsonb_path_exists(phones, '$[*] ? (@.type() != "string")')
   AND NOT jsonb_path_exists(emails, '$[*] ? (@.type() != "string")')
  );
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'organisations'::regclass AND conname = 'organisation_publication_confidence') THEN
  ALTER TABLE organisations ADD CONSTRAINT organisation_publication_confidence CHECK (
   publish_state <> 'published' OR (confidence IS NOT NULL AND confidence IN ('high','medium'))
  );
 END IF;
END $$;

INSERT INTO schema_migrations(name) VALUES ('003-research-import') ON CONFLICT DO NOTHING;
COMMIT;
