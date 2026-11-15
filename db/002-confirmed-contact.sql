BEGIN;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS contact jsonb NOT NULL DEFAULT '{"mn":"","en":""}' CHECK (bilingual(contact));
ALTER TABLE rights ADD COLUMN IF NOT EXISTS contact jsonb NOT NULL DEFAULT '{"mn":"","en":""}' CHECK (bilingual(contact));
ALTER TABLE guides ADD COLUMN IF NOT EXISTS contact jsonb NOT NULL DEFAULT '{"mn":"","en":""}' CHECK (bilingual(contact));
INSERT INTO schema_migrations(name) VALUES ('002-confirmed-contact') ON CONFLICT DO NOTHING;
COMMIT;
