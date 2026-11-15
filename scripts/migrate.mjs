import { readFile, readdir } from 'node:fs/promises';
import pg from 'pg';
import { postgresUrl } from '../src/server/postgres-url.mjs';
const client = new pg.Client({ connectionString: postgresUrl(process.env.DATABASE_URL_UNPOOLED), connectionTimeoutMillis: 15000 });
if (!process.env.DATABASE_URL_UNPOOLED) throw new Error('DATABASE_URL_UNPOOLED is required');
try {
 await client.connect();
 const directory = new URL('../db/', import.meta.url);
 for (const file of (await readdir(directory)).filter(file => file.endsWith('.sql')).sort()) {
  const name = file.replace(/\.sql$/, '');
  const exists = await client.query("SELECT to_regclass('public.schema_migrations') AS name");
  if (exists.rows[0].name && (await client.query('SELECT name FROM schema_migrations WHERE name=$1', [name])).rowCount) continue;
  await client.query(await readFile(new URL(file, directory), 'utf8'));
  console.log(`Migration ${name} applied.`);
 }
}
finally { await client.end(); }
