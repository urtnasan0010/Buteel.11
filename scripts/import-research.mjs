// Dry run by default. --apply is restricted to the exact research approved by the owner.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import pg from 'pg';
import { postgresUrl } from '../src/server/postgres-url.mjs';
import { regions } from '../src/shared/nationwide.ts';
import { services } from '../src/shared/listings.ts';

const input = process.argv[2];
const apply = process.argv[3] === '--apply';
if (!input || process.argv.length !== (apply ? 4 : 3)) throw new Error('Usage: node --env-file=.env scripts/import-research.mjs INPUT_JSON [--apply]');
const approvedHash = 'ba30fc6b47bf4fc55f3ca44218b492e3bab491d8d3f032fcc9a118245fbeacd7';
const tables = ['organisations', 'rights', 'guides'];
const guideCategories = new Set(['benefit', 'education_support', 'transport_service', 'employment_right', 'social_insurance_benefit', 'education_transport_benefit']);
const missing = /\b(?:unverified|unknown|not applicable|not available|not established|not confirmed|not provided|not specified|n\/a)\b/i;
const clean = value => typeof value === 'string' && !missing.test(value) ? value.trim() : '';
const english = value => ({ mn: '', en: clean(value) });
const normalizeName = value => value.normalize('NFKC').toLocaleLowerCase('mn').replace(/[^\p{L}\p{N}]/gu, '');
const phoneKey = value => value.replace(/\D/g, '').replace(/^976(?=\d{8}$)/, '');
const list = value => Array.isArray(value) ? value : value == null ? [] : [value];
function contacts(value, type, warnings) {
  const result = [];
  for (const original of list(value)) {
    const text = clean(original);
    if (!text) continue;
    const found = type === 'phone'
      ? text.match(/\+?\d[\d ()-]*\d|\b\d{3}\b/g) ?? []
      : text.match(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9.-]*[A-Z0-9])?\.[A-Z]{2,}/gi) ?? [];
    if (!found.length) warnings.push(`Unparsed ${type}: retained only in raw_record`);
    for (const contact of found) {
      const normalized = contact.trim();
      if (type === 'phone' && !/^(?:\d{3,4}|\d{6,8})$/.test(phoneKey(normalized))) {
        warnings.push(`Unparsed ${type}: retained only in raw_record`);
        continue;
      }
      const key = type === 'phone' ? phoneKey(normalized) : normalized.toLowerCase();
      if (!result.some(item => (type === 'phone' ? phoneKey(item) : item.toLowerCase()) === key)) result.push(normalized);
    }
  }
  return result;
}
function applyText(value) {
  if (typeof value === 'string') return clean(value);
  if (!value || typeof value !== 'object') return '';
  // Preserve verified clauses and original ordering; omit uncertain fields as a whole.
  return Object.entries(value).flatMap(([key, text]) => {
    const values = list(text).map(clean).filter(Boolean);
    return values.length ? [`${key}: ${values.join('\n')}`] : [];
  }).join('\n');
}
function url(value) {
  if (!clean(value)) return '';
  try { const parsed = new URL(value); return ['http:', 'https:'].includes(parsed.protocol) && !parsed.username && !parsed.password ? value : ''; }
  catch { return ''; }
}
const aliases = { tuv: 'tov', uvurkhangai: 'ovorkhangai', umnugovi: 'omnogovi', khuvsgul: 'khovsgol', 'bayan-ulgii': 'bayan-olgii' };
function location(value, decisions, row) {
  // Owner-approved exceptions; uncertain or multiple coverage stays empty in drafts.
  if ([28, 40, 42, 92].includes(row)) return { region: '', nationwide: false };
  if ([89, 90].includes(row)) return { region: '', nationwide: true };
  if (typeof value !== 'string') {
    decisions.push('Multiple regions: choose representation; one region column cannot retain all regions');
    return { region: '', nationwide: false };
  }
  if (value === 'Nationwide') return { region: '', nationwide: true };
  const office = value.split(';')[0].trim().toLowerCase();
  const region = aliases[office] ?? office;
  if (regions.some(item => item.id === region)) return { region, nationwide: false };
  decisions.push(`Ambiguous coverage: ${value}`);
  return { region: '', nationwide: false };
}
function mapRecord(raw, index) {
  const decisions = [], warnings = [];
  const target = ['law', 'international_treaty'].includes(raw.category) ? 'rights' : guideCategories.has(raw.category) ? 'guides' : 'organisations';
  const title = { mn: clean(raw.name_mn), en: clean(raw.name_en) };
  if (!title.mn || !title.en) decisions.push('Missing bilingual name');
  const area = english(raw.district_or_soum === 'Nationwide' ? '' : raw.district_or_soum);
  const phones = contacts(raw.phone, 'phone', warnings), emails = contacts(raw.email, 'email', warnings);
  const sources = list(raw.source_urls);
  const source = sources[0] ?? '';
  if (!url(source)) decisions.push('Missing or malformed first source URL; do not silently substitute another source');
  if (sources.some(item => !url(item))) warnings.push('Malformed source URL retained unchanged in raw_record');
  const reviewDate = clean(raw.last_verified_date);
  if (reviewDate && (!/^\d{4}-\d{2}-\d{2}$/.test(reviewDate) || !Number.isFinite(Date.parse(reviewDate)) || new Date(reviewDate).toISOString().slice(0, 10) !== reviewDate)) decisions.push('Invalid review date');
  if (!['high', 'medium', 'low'].includes(raw.confidence)) decisions.push('Invalid confidence');
  const mapped = {
    id: `research-${createHash('sha256').update(`${target}\0${normalizeName(raw.name_mn)}`).digest('hex').slice(0, 24)}`,
    title, body: english(list(raw.services).map(clean).filter(Boolean).join('\n')),
    ...location(raw.region, decisions, index + 1), local_area: area, remote: 'unknown',
    source, review_date: reviewDate || null, status: 'unknown', publish_state: 'draft',
    law_name: target === 'rights' ? title : { mn: '', en: '' }, article: { mn: '', en: '' },
    website: url(raw.website), phone: phones[0] ?? '', email: emails[0] ?? '',
    // Stored identically to the attachment, including all source URLs and uncertainty markers.
    raw_record: raw,
  };
  if (target === 'organisations') Object.assign(mapped, {
    confidence: raw.confidence, category: raw.category,
    disability_focus: english(raw.disability_focus), address: english(raw.address), hours: english(raw.hours),
    phones, emails, how_to_apply: english(applyText(raw.how_to_apply)), eligibility: english(raw.eligibility),
    contact_tested: false, confirmed_at: null, confirmation_note: '',
  });
  return { row: index + 1, target, name: title.en, mapped, phones, decisions, warnings };
}

let client, transactionOpen = false, committed = false, commitAttempted = false;
try {
  const bytes = await readFile(input);
  const inputHash = createHash('sha256').update(bytes).digest('hex');
  if (inputHash !== approvedHash) throw new Error('Research does not match the owner-approved attachment');
  const research = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
  if (!Array.isArray(research.records)) throw new Error('Input must contain records');
  const connectionString = apply ? process.env.DATABASE_URL_UNPOOLED : process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!connectionString) throw new Error('Database connection is not configured');
  if (apply && new URL(connectionString).hostname.includes('-pooler')) throw new Error('Migration requires a direct connection');
  client = new pg.Client({ connectionString: postgresUrl(connectionString), connectionTimeoutMillis: 15000 });
  await client.connect();
  await client.query(apply ? 'BEGIN' : 'BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY');
  transactionOpen = true;
  if (apply) {
    await client.query("SET LOCAL lock_timeout = '10s'");
    await client.query("SET LOCAL statement_timeout = '60s'");
    await client.query("SELECT pg_advisory_xact_lock(hashtext('hurteemj-research-import-003'))");
    // Block concurrent editorial writes while deduplicating; public reads remain possible.
    await client.query('LOCK TABLE organisations, rights, guides IN SHARE ROW EXCLUSIVE MODE');
  }
  const existing = [];
  for (const table of tables) {
    // Identifiers come only from the closed constant list above. Never from input JSON.
    const result = await client.query(`SELECT id,title,phone,legacy_record,publish_state,to_jsonb(entry)->'phones' AS phones,to_jsonb(entry) AS original_record FROM ${table} AS entry`);
    existing.push(...result.rows.map(row => ({ ...row, target: table })));
  }
  const columns = await client.query("SELECT table_name,column_name FROM information_schema.columns WHERE table_schema='public' AND table_name = ANY($1::text[])", [tables]);
  const migrations = await client.query('SELECT name FROM schema_migrations ORDER BY name');
  const plans = research.records.map(mapRecord), accepted = [], skipped = [], held = [];
  const original = services.map(item => ({ id: item.id, title: item.name, phone: item.phone, target: 'organisations' }));
  for (const item of plans) {
    const name = normalizeName(item.mapped.title.mn);
    const names = [...existing, ...original, ...accepted.map(p => ({ id: p.mapped.id, title: p.mapped.title, phone: '', target: p.target }))];
    const match = names.find(row => row.target === item.target && normalizeName(row.title.mn) === name);
    const protectedPhone = item.target === 'organisations' && original.find(row => item.phones.some(number => row.phone && phoneKey(number) === phoneKey(row.phone)));
    if (match || protectedPhone) {
      skipped.push({ row: item.row, name: item.name, reason: match ? 'Duplicate Mongolian name' : 'Matches protected legacy organisation phone', matches: (match ?? protectedPhone).id });
      continue;
    }
    // Shared hotlines do not imply duplicate entities. Hold collisions for owner review.
    if (item.target === 'organisations') {
      const peers = [...existing.filter(row => row.target === item.target).map(row => ({ name: row.title.en, phones: contacts(row.phones ?? row.phone, 'phone', []) })), ...accepted.filter(p => p.target === item.target)];
      const peer = peers.find(row => row.phones.some(number => item.phones.some(other => phoneKey(number) === phoneKey(other))));
      if (peer) item.decisions.push(`Shared phone with ${peer.name}: confirm duplicate or separate service`);
    }
    if (item.decisions.length) held.push(item); else accepted.push(item);
  }
  const count = items => Object.fromEntries(tables.map(table => [table, items.filter(item => item.target === table).length]));
  let insertedCounts;
  if (apply) {
    if (held.length) throw new Error('Unresolved import decisions');
    const knownImports = existing.filter(row => plans.some(item => item.target === row.target && item.mapped.id === row.id));
    if (accepted.length + knownImports.length !== 90 || original.some(row => !existing.some(item => item.target === row.target && item.id === row.id))) throw new Error('Database differs from the approved import plan');
    const migration = await readFile(new URL('../db/003-research-import.sql', import.meta.url), 'utf8');
    if (!/^BEGIN;\s/.test(migration) || !/COMMIT;\s*$/.test(migration)) throw new Error('Unexpected migration transaction wrapper');
    // Migration and every insert commit together. No migration is applied on a failed import.
    await client.query(migration.replace(/^BEGIN;\s*/, '').replace(/COMMIT;\s*$/, ''));
    insertedCounts = Object.fromEntries(tables.map(table => [table, 0]));
    for (const item of accepted) {
      const fields = Object.keys(item.mapped);
      const values = fields.map(field => {
        const value = item.mapped[field];
        return value !== null && typeof value === 'object' ? JSON.stringify(value) : value;
      });
      // Table and column identifiers are from the closed mapping above; all input values are parameters.
      const result = await client.query(`INSERT INTO ${item.target} (${fields.join(',')}) VALUES (${values.map((_, index) => '$' + (index + 1)).join(',')}) RETURNING id`, values);
      if (result.rowCount !== 1) throw new Error('Unexpected insert count');
      insertedCounts[item.target]++;
    }
    for (const table of tables) {
      const result = await client.query(`SELECT id,to_jsonb(entry) AS record FROM ${table} AS entry WHERE id = ANY($1::text[])`, [existing.filter(row => row.target === table).map(row => row.id)]);
      for (const row of result.rows) {
        const before = existing.find(item => item.target === table && item.id === row.id).original_record;
        if (Object.entries(before).some(([key, value]) => JSON.stringify(value) !== JSON.stringify(row.record[key]))) throw new Error('An existing record changed');
      }
      const imported = await client.query(`SELECT id,publish_state,status,source,to_char(review_date,'YYYY-MM-DD') AS review_date,raw_record FROM ${table} WHERE id = ANY($1::text[])`, [accepted.filter(item => item.target === table).map(item => item.mapped.id)]);
      if (imported.rowCount !== insertedCounts[table]) throw new Error('Import verification count mismatch');
      for (const row of imported.rows) {
        const item = accepted.find(item => item.target === table && item.mapped.id === row.id);
        // jsonb object key order differs from JSON; compare canonical content recursively.
        const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
        if (row.publish_state !== 'draft' || row.status !== 'unknown' || row.source !== item.mapped.source || row.review_date !== item.mapped.review_date || JSON.stringify(canonical(row.raw_record)) !== JSON.stringify(canonical(item.mapped.raw_record))) throw new Error('Imported draft does not preserve the approved research');
      }
    }
    commitAttempted = true;
    await client.query('COMMIT');
    transactionOpen = false;
    committed = true;
  } else {
    await client.query('ROLLBACK');
    transactionOpen = false;
  }
  const report = {
    mode: apply ? 'COMMITTED — migration 003 and draft inserts in one transaction' : 'READ ONLY — no migration or inserts executed',
    inputSha256: inputHash, inputRecords: plans.length, insertedCounts,
    existingCountsBeforeRun: count(existing), migrationsAppliedBeforeRun: migrations.rows.map(row => row.name),
    migration003Applied: apply || columns.rows.some(row => row.table_name === 'organisations' && row.column_name === 'confidence'),
    existingPublishedOrganisationsRequiringConfidenceReview: existing.filter(row => row.target === 'organisations' && row.publish_state === 'published').map(row => row.id),
    routedCountsBeforeDedupe: count(plans), readyDraftCounts: count(accepted), heldCounts: count(held),
    skipped, decisions: held.map(({ row, name, target, decisions }) => ({ row, name, target, decisions })),
    warnings: plans.filter(item => item.warnings.length).map(({ row, name, warnings }) => ({ row, name, warnings })),
    missingMongolianDetails: plans.filter(item => !item.mapped.body.mn).length,
    rightsWithoutArticle: plans.filter(item => item.target === 'rights').length,
    policies: ['All inserts draft / unknown; remote unknown; contact_tested false', 'English names descriptive, not asserted official', 'No source URLs or review dates changed', 'English-only detail fields keep mn empty; no invented translations', 'Only first contact mirrored into legacy phone/email fields; full arrays on organisations', 'Guide/right extra fields remain in exact raw_record', 'No existing record updates; no legacy_record changes'],
  };
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  if (transactionOpen && client) {
    try { await client.query('ROLLBACK'); } catch { /* Preserve the safe original failure classification. */ }
  }
  // Driver errors can contain connection details. Print only a safe classification.
  console.error(`Research ${apply ? 'import' : 'dry run'} failed (${typeof error.code === 'string' ? error.code.replace(/[^A-Z0-9_]/gi, '') : 'INVALID_INPUT_OR_CONFIGURATION'}). ${committed ? 'Transaction committed; inspect counts before retrying.' : commitAttempted ? 'Commit outcome uncertain; inspect counts before retrying.' : 'No transaction was committed.'}`);
  process.exitCode = 1;
} finally { if (client) await client.end(); }
