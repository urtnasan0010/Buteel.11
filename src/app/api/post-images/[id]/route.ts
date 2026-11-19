import { z } from 'zod';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getDatabase, getStorage } from '@/server/neon-services';
import type { StoredImage } from '@/server/posts';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = z.uuid().safeParse((await params).id);
  if (!id.success) return new Response(null,{ status:404 });
  try {
    const result = await getDatabase().query<{ image: StoredImage }>(`SELECT image.value AS image
     FROM home_posts CROSS JOIN LATERAL jsonb_array_elements(images) AS image(value)
     WHERE deleted_at IS NULL AND publish_state='published' AND image.value->>'id'=$1 LIMIT 1`,[id.data]);
    const row = result.rows[0];
    if (!row) return new Response(null,{ status:404 });
    const object = await getStorage().send(new GetObjectCommand({ Bucket: 'assets', Key: row.image.key }));
    if (!object.Body) return new Response(null,{ status:404 });
    return new Response(object.Body.transformToWebStream(),{ headers: {
      'Content-Type':row.image.mime, 'Cache-Control':'private, no-store', 'X-Content-Type-Options':'nosniff',
      'Content-Security-Policy':"default-src 'none'; sandbox", 'Content-Disposition':'inline',
      ...(object.ContentLength ? { 'Content-Length':String(object.ContentLength) } : {}),
    } });
  } catch { return new Response(null,{ status:404 }); }
}
