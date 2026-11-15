import { currentAdmin, sameOrigin, readJson } from '@/server/auth';
import { isKind } from '@/shared/nationwide';
import { listContent, saveContent, deleteContent } from '@/server/content';
import { getDatabase } from '@/server/neon-services';
import { z } from 'zod';

type Context = { params: Promise<{ kind: string }> };
export async function GET(request: Request, context: Context) {
  try {
    if (!await currentAdmin()) return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { kind } = await context.params;
    if (kind === 'reports') {
      const { rows } = await getDatabase().query('SELECT id, message, page, language, resolved, created_at FROM reports ORDER BY created_at DESC LIMIT 200');
      return Response.json(rows, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (!isKind(kind)) return Response.json({ error: 'Not found' }, { status: 404 });
    const id = new URL(request.url).searchParams.get('id');
    if (id !== null) {
      if (!id || id.length > 150) return Response.json({ error: 'Invalid id' }, { status: 400 });
      const tables = { organisations: 'organisations', rights: 'rights', guides: 'guides' } as const;
      const { rows } = await getDatabase().query(`SELECT id,raw_record AS research FROM ${tables[kind]} WHERE id=$1`, [id]);
      if (!rows.length) return Response.json({ error: 'Not found' }, { status: 404 });
      return Response.json(rows[0], { headers: { 'Cache-Control': 'no-store' } });
    }
    return Response.json(await listContent(kind, { admin: true }), { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Service unavailable' }, { status: 503 }); }
}
export async function POST(request: Request, context: Context) {
  if (!sameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  try {
    if (!await currentAdmin()) return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { kind } = await context.params;
    const input = await readJson(request);
    if (kind === 'reports') {
      const { id } = z.object({ id: z.uuid() }).strict().parse(input);
      await getDatabase().query('UPDATE reports SET resolved=true, updated_at=now() WHERE id=$1', [id]);
      return Response.json({ ok: true });
    }
    if (!isKind(kind)) return Response.json({ error: 'Not found' }, { status: 404 });
    const { id, item } = z.object({ id: z.string().min(1).max(150).optional(), item: z.unknown() }).strict().parse(input);
    return Response.json({ id: await saveContent(kind, item, id) });
  } catch { return Response.json({ error: 'Invalid item. Check both languages, source and review date.' }, { status: 400 }); }
}
export async function DELETE(request: Request, context: Context) {
  if (!sameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  try {
    if (!await currentAdmin()) return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { kind } = await context.params;
    if (!isKind(kind)) return Response.json({ error: 'Not found' }, { status: 404 });
    const { id } = z.object({ id: z.string().min(1).max(150) }).strict().parse(await readJson(request));
    await deleteContent(kind, id);
    return Response.json({ ok: true });
  } catch { return Response.json({ error: 'Invalid request' }, { status: 400 }); }
}
