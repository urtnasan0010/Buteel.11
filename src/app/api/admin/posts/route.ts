import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { currentAdmin, readJson, sameOrigin } from '@/server/auth';
import { deletePost, listPosts, PostError, savePost } from '@/server/posts';
import { MAX_POST_BYTES, MAX_POST_IMAGES, postInputSchema } from '@/shared/posts';

export const runtime = 'nodejs';
const json = (value: unknown, status = 200) => Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
function failure(error: unknown) {
  if (error instanceof PostError) return json({ error: error.code },error.status);
  if (error instanceof z.ZodError || error instanceof SyntaxError) return json({ error: 'failed' },400);
  if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') return json({ error: 'setup' },503);
  return json({ error: 'failed' },500);
}
export async function GET(request: Request) {
  try {
    if (!await currentAdmin()) return json({ error: 'denied' },401);
    const page = Number(new URL(request.url).searchParams.get('page')) || 1;
    return json(await listPosts({ admin: true, page }));
  } catch (error) { return failure(error); }
}
async function boundedForm(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.startsWith('multipart/form-data;')) throw new PostError('failed',415);
  if (Number(request.headers.get('content-length')) > MAX_POST_BYTES) throw new PostError('fileError',413);
  const reader = request.body?.getReader();
  if (!reader) throw new PostError('failed',400);
  let length = 0; const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    length += value.byteLength;
    if (length > MAX_POST_BYTES) { await reader.cancel(); throw new PostError('fileError',413); }
    chunks.push(value);
  }
  try { return await new Request(request.url, { method: 'POST', headers: { 'Content-Type': contentType }, body: Buffer.concat(chunks) }).formData(); }
  catch { throw new PostError('failed',400); }
}
export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) return json({ error: 'denied' },403);
    const actor = await currentAdmin(); if (!actor) return json({ error: 'denied' },401);
    const form = await boundedForm(request);
    const raw = form.get('post'); if (typeof raw !== 'string') throw new PostError('failed',400);
    const input = postInputSchema.parse(JSON.parse(raw));
    const files = new Map<string,File>();
    for (const [name,value] of form.entries()) {
      if (name === 'post') continue;
      if (!name.startsWith('image:') || !(value instanceof File) || files.has(name.slice(6))) throw new PostError('fileError',400);
      files.set(name.slice(6),value);
    }
    if (files.size > MAX_POST_IMAGES) throw new PostError('fileError',400);
    const post = await savePost(input,files,actor);
    revalidatePath('/'); revalidatePath('/understand'); revalidatePath('/help'); revalidatePath('/admin');
    return json(post);
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request) {
  try {
    if (!sameOrigin(request)) return json({ error: 'denied' },403);
    const actor = await currentAdmin(); if (!actor) return json({ error: 'denied' },401);
    const input = z.object({ id: z.uuid(), version: z.number().int().positive() }).strict().parse(await readJson(request));
    await deletePost(input.id,input.version,actor);
    revalidatePath('/'); revalidatePath('/understand'); revalidatePath('/help'); revalidatePath('/admin');
    return json({ ok: true });
  } catch (error) { return failure(error); }
}
