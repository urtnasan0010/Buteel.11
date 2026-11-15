import pg from 'pg';
import { postgresUrl } from '../src/server/postgres-url.mjs';
const id = process.argv[2];
if (!id || !/^[a-zA-Z0-9_-]{1,128}$/.test(id)) throw new Error('Usage: npm run admin:grant -- <Neon Auth user ID>');
const client = new pg.Client({ connectionString: postgresUrl(process.env.DATABASE_URL_UNPOOLED) });
try {
 await client.connect();
 const existing = await client.query('SELECT id FROM neon_auth."user" WHERE id = $1', [id]);
 if (!existing.rowCount) throw new Error('Create the account in Neon Auth first. No permission granted.');
 await client.query('INSERT INTO admin_accounts(user_id) VALUES ($1) ON CONFLICT DO NOTHING', [id]);
 console.log('Admin access granted to the specified existing account.');
} finally { await client.end(); }
