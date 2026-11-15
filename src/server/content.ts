import 'server-only';
import { randomUUID } from 'node:crypto';
import { getDatabase } from './neon-services';
import { itemSchema, type Item, type Kind } from '@/shared/nationwide';

// Table identifiers come only from the closed Kind union, never user input.
const tables: Record<Kind, string> = { organisations: 'organisations', guides: 'guides', rights: 'rights' };
const columns = (kind:Kind) => `id, title, body, region, local_area AS "localArea", nationwide, remote, source,
 COALESCE(to_char(review_date, 'YYYY-MM-DD'), '') AS "reviewDate", status, publish_state AS "publishState",
 law_name AS "lawName", article, revision, checklist, contact, website, phone, email,
 COALESCE(to_jsonb(${tables[kind]})->>'confidence', raw_record->>'confidence') AS confidence,
 jsonb_build_object('category',raw_record->>'category','sources',COALESCE(raw_record->'source_urls','[]'::jsonb),
 'phones',COALESCE(to_jsonb(${tables[kind]})->'phones','[]'::jsonb),
 'emails',COALESCE(to_jsonb(${tables[kind]})->'emails','[]'::jsonb),
 'address',COALESCE(to_jsonb(${tables[kind]})->'address','{"mn":"","en":""}'::jsonb),
 'hours',COALESCE(to_jsonb(${tables[kind]})->'hours','{"mn":"","en":""}'::jsonb),
 'eligibility',COALESCE(to_jsonb(${tables[kind]})->'eligibility','{"mn":"","en":""}'::jsonb),
 'howToApply',COALESCE(to_jsonb(${tables[kind]})->'how_to_apply','{"mn":"","en":""}'::jsonb),
 'focus',COALESCE(to_jsonb(${tables[kind]})->'disability_focus','{"mn":"","en":""}'::jsonb),
 'contactTested',COALESCE(to_jsonb(${tables[kind]})->'contact_tested','false'::jsonb),
 'research',raw_record IS NOT NULL) AS "publicationInfo",
 created_at AS "createdAt", updated_at AS "updatedAt"`;

export async function listContent(kind: Kind, options: { admin?: boolean; region?: string; area?: string; nationwide?: boolean; q?: string } = {}): Promise<Item[]> {
  const values: unknown[] = [];
  const filters: string[] = [];
  if (!options.admin) filters.push("publish_state = 'published'");
  if (options.region && !options.nationwide) { values.push(options.region); filters.push(`region = $${values.length}`); }
  if (options.area?.trim() && !options.nationwide) { values.push(options.area.trim()); filters.push(`(lower(local_area->>'mn') = lower($${values.length}) OR lower(local_area->>'en') = lower($${values.length}))`); }
  if (options.nationwide) filters.push("(nationwide = true OR remote = 'yes')");
  if (options.q?.trim()) {
    values.push(options.q.trim().toLocaleLowerCase());
    filters.push(`position($${values.length} in lower(concat(title->>'mn', ' ', title->>'en', ' ', body->>'mn', ' ', body->>'en'))) > 0`);
  }
  const result = await getDatabase().query<Item>(`SELECT ${columns(kind)} FROM ${tables[kind]} ${filters.length ? 'WHERE ' + filters.join(' AND ') : ''} ORDER BY created_at, id LIMIT 500`, values);
  return result.rows;
}
export async function publicItem(kind: Kind, id: string): Promise<Item | null> {
  const result = await getDatabase().query<Item>(`SELECT ${columns(kind)} FROM ${tables[kind]} WHERE id = $1 AND publish_state = 'published'`, [id]);
  return result.rows[0] ?? null;
}
export async function saveContent(kind: Kind, input: unknown, id?: string): Promise<string> {
  const value = itemSchema.parse(input);
  if(kind==='organisations'&&value.publishState==='published'&&!['high','medium'].includes(value.confidence??''))throw new Error('High or medium confidence required');
  if (kind === 'organisations' && value.publishState === 'published' && !value.region && !value.nationwide) throw new Error('Region or nationwide service required');
  if (kind === 'rights' && value.publishState === 'published') {
    const official = new URL(value.source);
    if (official.protocol !== 'https:' || !['legalinfo.mn', 'parliament.mn', 'gov.mn'].some(d => official.hostname === d || official.hostname.endsWith('.' + d)) ||
        !value.lawName.mn || !value.lawName.en || !value.article.mn || !value.article.en || /TODO/i.test(JSON.stringify([value.lawName, value.article]))) {
      throw new Error('An official law link, bilingual law name and article are required');
    }
  }
  const fields = ['title','body','region','local_area','nationwide','remote','source','review_date','status','publish_state','law_name','article','revision','checklist','contact','website','phone','email'];
  const values = [value.title,value.body,value.region,value.localArea,value.nationwide,value.remote,value.source,value.reviewDate || null,value.status,value.publishState,value.lawName,value.article,value.revision,value.checklist,value.contact,value.website,value.phone,value.email];
  if(kind==='organisations'){fields.push('confidence');values.push(value.confidence);}
  const identifier = id ?? randomUUID();
  if (id) {
    const result = await getDatabase().query(`UPDATE ${tables[kind]} SET ${fields.map((field, i) => `${field}=$${i + 1}`).join(',')}, updated_at=now() WHERE id=$${values.length + 1} RETURNING id`, [...values, id]);
    if (!result.rowCount) throw new Error('Item not found');
  } else {
    await getDatabase().query(`INSERT INTO ${tables[kind]} (id,${fields.join(',')}) VALUES (${Array.from({ length: values.length + 1 }, (_, i) => '$' + (i + 1)).join(',')})`, [identifier, ...values]);
  }
  return identifier;
}
export async function deleteContent(kind: Kind, id: string) {
  await getDatabase().query(`DELETE FROM ${tables[kind]} WHERE id=$1`, [id]);
}
