import 'server-only';
import { randomUUID } from 'node:crypto';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getDatabase, getStorage } from './neon-services';
import { MAX_IMAGE_BYTES, MAX_POST_IMAGES, type Post, type PostInput, type PostPage } from '@/shared/posts';
import type { Text } from '@/shared/data';

export class PostError extends Error {
  constructor(public code: string, public status: number) { super(code); }
}
export type StoredImage = { id: string; alt: Text; key: string; mime: string };
type Row = Omit<PostInput, 'images'> & { images: StoredImage[] };
export const postColumns = `id, title, body, type, to_char(posted_date,'YYYY-MM-DD') AS "postedDate",
 COALESCE(to_char(start_date,'YYYY-MM-DD'),'') AS "startDate", COALESCE(to_char(end_date,'YYYY-MM-DD'),'') AS "endDate",
 publish_state AS "publishState", version, images`;
const toPost = (row: Row): Post => ({ ...row, images: row.images.map(image => ({ id: image.id, alt: image.alt, url: `/api/post-images/${image.id}` })) });

export async function listPosts({ admin = false, type = '', page = 1 }: { admin?: boolean; type?: string; page?: number } = {}): Promise<PostPage> {
  const safePage = Math.max(1, Math.min(10000, Math.floor(page) || 1));
  const result = await getDatabase().query<Row>(`SELECT ${postColumns} FROM home_posts
   WHERE deleted_at IS NULL AND ($1::boolean OR publish_state='published') AND ($2='' OR type=$2)
   ORDER BY posted_date DESC, created_at DESC, id DESC LIMIT 13 OFFSET $3`, [admin, type, (safePage - 1) * 12]);
  return { posts: result.rows.slice(0,12).map(toPost), page: safePage, hasMore: result.rows.length > 12 };
}
function imageMime(bytes: Buffer): string | null {
  if (bytes.length >= 8 && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
  if (bytes.length >= 12 && bytes.toString('ascii',0,4) === 'RIFF' && bytes.toString('ascii',8,12) === 'WEBP') return 'image/webp';
  if (['GIF87a','GIF89a'].includes(bytes.toString('ascii',0,6))) return 'image/gif';
  return null;
}
async function cleanupObjects(keys: string[]) {
  for (const key of keys) {
    try { await getStorage().send(new DeleteObjectCommand({ Bucket: 'assets', Key: key })); }
    catch { console.error('Post image cleanup needs a retry.'); }
  }
}
async function drainCleanup() {
  try {
    const queued = await getDatabase().query<{ object_key: string }>('SELECT object_key FROM home_post_media_cleanup ORDER BY created_at LIMIT 70');
    for (const row of queued.rows) {
      await getStorage().send(new DeleteObjectCommand({ Bucket: 'assets', Key: row.object_key }));
      await getDatabase().query('DELETE FROM home_post_media_cleanup WHERE object_key=$1', [row.object_key]);
    }
  } catch { console.error('Post image cleanup remains queued.'); }
}

export async function savePost(input: PostInput, files: Map<string, File>, actor: string): Promise<Post> {
  const database = getDatabase();
  // Check ownership of every retained image before sending anything to storage.
  const previous = await database.query<Row>(`SELECT ${postColumns} FROM home_posts WHERE id=$1 AND deleted_at IS NULL`, [input.id]);
  const existing = previous.rows[0];
  if ((existing?.version ?? 0) !== input.version || (!existing && input.version !== 0)) throw new PostError('conflict',409);
  const validated: { id: string; alt: Text; bytes: Buffer; mime: string }[] = [];
  const images: StoredImage[] = [];
  for (const image of input.images) {
    const file = files.get(image.id);
    if (file) {
      if (!file.size || file.size > MAX_IMAGE_BYTES) throw new PostError('fileError',400);
      const bytes = Buffer.from(await file.arrayBuffer()); const mime = imageMime(bytes);
      if (!mime || mime !== file.type) throw new PostError('fileError',400);
      validated.push({ ...image, bytes, mime });
    } else {
      const retained = existing?.images.find(item => item.id === image.id);
      if (!retained) throw new PostError('fileError',400);
      images.push({ ...retained, alt: image.alt });
    }
  }
  if (files.size !== validated.length || input.images.length > MAX_POST_IMAGES) throw new PostError('fileError',400);
  const staged: string[] = [];
  let commitAttempted = false;
  let saved: Post;
  const client = await database.connect();
  try {
    for (const image of validated) {
      const key = `home-posts/${input.id}/${randomUUID()}`;
      // Track before PutObject: a lost response can still mean the object was saved.
      staged.push(key);
      await getStorage().send(new PutObjectCommand({ Bucket: 'assets', Key: key, Body: image.bytes, ContentType: image.mime }));
      images.push({ id: image.id, alt: image.alt, key, mime: image.mime });
    }
    const sortedImages = input.images.map(image => images.find(saved => saved.id === image.id)!);
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`home-post:${input.id}`]);
    const locked = await client.query<{ version: number; deleted_at: unknown }>('SELECT version,deleted_at FROM home_posts WHERE id=$1 FOR UPDATE', [input.id]);
    if ((locked.rows[0]?.version ?? 0) !== input.version || locked.rows[0]?.deleted_at) throw new PostError('conflict',409);
    const values = [input.id,input.title,input.body,input.type,input.postedDate,input.startDate || null,input.endDate || null,input.publishState,JSON.stringify(sortedImages),actor];
    const result = input.version === 0
      ? await client.query<Row>(`INSERT INTO home_posts(id,title,body,type,posted_date,start_date,end_date,publish_state,images,created_by,updated_by)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10) RETURNING ${postColumns}`, values)
      : await client.query<Row>(`UPDATE home_posts SET title=$2,body=$3,type=$4,posted_date=$5,start_date=$6,end_date=$7,publish_state=$8,images=$9,
          updated_by=$10,updated_at=now(),version=version+1 WHERE id=$1 RETURNING ${postColumns}`, values);
    const removed = existing?.images.filter(image => !sortedImages.some(current => current.key === image.key)) ?? [];
    for (const image of removed) await client.query('INSERT INTO home_post_media_cleanup(object_key) VALUES ($1) ON CONFLICT DO NOTHING',[image.key]);
    commitAttempted = true;
    await client.query('COMMIT');
    saved = toPost(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    if (!commitAttempted) await cleanupObjects(staged);
    // Once COMMIT was sent, leave media in place rather than deleting a possible successful publication.
    throw error;
  } finally { client.release(); }
  // Release the transaction connection before cleanup borrows from the same small pool.
  await drainCleanup();
  return saved;
}

export async function deletePost(id: string, version: number, actor: string) {
  const result = await getDatabase().query(`UPDATE home_posts SET deleted_at=now(),updated_at=now(),updated_by=$3,version=version+1
   WHERE id=$1 AND version=$2 AND deleted_at IS NULL RETURNING id`,[id,version,actor]);
  if (!result.rowCount) throw new PostError('conflict',409);
  // Soft deletion keeps a recoverable record; the media route immediately denies public access.
}
