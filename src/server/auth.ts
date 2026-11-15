import 'server-only';
import { createNeonAuth } from '@neon/auth/next/server';
import { getDatabase } from './neon-services';

let instance: ReturnType<typeof createNeonAuth> | undefined;
export function getAuth() {
  if (!process.env.NEON_AUTH_BASE_URL || !process.env.NEON_AUTH_COOKIE_SECRET) throw new Error('Managed auth is not configured');
  instance ??= createNeonAuth({ baseUrl: process.env.NEON_AUTH_BASE_URL, cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET, sessionDataTtl: 1 } });
  return instance;
}
export async function currentAdmin(): Promise<string | null> {
  const { data: session, error } = await getAuth().getSession();
  if (error || !session?.user?.id) return null;
  const result = await getDatabase().query('SELECT user_id FROM admin_accounts WHERE user_id=$1', [session.user.id]);
  return result.rowCount ? session.user.id : null;
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  if (process.env.APP_ORIGIN) return origin === process.env.APP_ORIGIN;
  try {
    const target = new URL(request.url); const supplied = new URL(origin);
    return supplied.protocol === target.protocol && supplied.host === (request.headers.get('host') || target.host);
  } catch { return false; }
}
export async function readJson(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('JSON required');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing body');
  const chunks: Uint8Array[] = []; let bytes = 0;
  while (true) {
    const { value, done } = await reader.read(); if (done) break;
    bytes += value.byteLength;
    if (bytes > 100000) { await reader.cancel(); throw new Error('Body too large'); }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
}
