// Preserve the existing records exactly in legacy_record. They start as drafts:
// an online source check must never become direct provider confirmation.
import pg from 'pg';
import { postgresUrl } from '../src/server/postgres-url.mjs';
import { services } from '../src/shared/listings.ts';
const client = new pg.Client({ connectionString: postgresUrl(process.env.DATABASE_URL_UNPOOLED) });
try {
  await client.connect(); await client.query('BEGIN');
  let imported = 0;
  for (const item of services) {
    const result = await client.query(`INSERT INTO organisations(id,title,body,region,local_area,source,review_date,status,publish_state,remote,phone,email,website,legacy_record)
      VALUES ($1,$2,$3,'ulaanbaatar',$4,$5,$6,'unknown','draft','unknown',$7,$8,$9,$10) ON CONFLICT (id) DO NOTHING`,
      [item.id, item.name, item.description, { mn: item.district, en: ({'Сүхбаатар':'Sukhbaatar','Хан-Уул':'Khan-Uul','Баянгол':'Bayangol'})[item.district] || item.district }, item.sourceUrl || '', item.lastChecked, item.phone || '', item.email || '', item.sourceUrl || '', JSON.stringify(item)]);
    imported += result.rowCount;
  }
  await client.query('COMMIT'); console.log(`Imported ${imported} existing records as drafts. Sources, review dates and original records preserved.`);
} catch(error) { await client.query('ROLLBACK'); throw error; } finally { await client.end(); }
