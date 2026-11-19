import 'server-only';
import { getDatabase } from './neon-services';
import type { Post, PostPage } from '@/shared/posts';
import type { Text } from '@/shared/data';

export type StoredImage = { id: string; alt: Text; key: string; mime: string };
type Row = Omit<Post, 'images'> & { images: StoredImage[] };
const postColumns = `id, title, body, type, to_char(posted_date,'YYYY-MM-DD') AS "postedDate", images`;
const toPost = (row: Row): Post => ({ ...row, images: row.images.map(image => ({ id: image.id, alt: image.alt, url: `/api/post-images/${image.id}` })) });

export async function listPosts({ page = 1 }: { page?: number } = {}): Promise<PostPage> {
  const safePage = Math.max(1, Math.min(10000, Math.floor(page) || 1));
  const result = await getDatabase().query<Row>(`SELECT ${postColumns} FROM home_posts
   WHERE deleted_at IS NULL AND publish_state='published'
   ORDER BY posted_date DESC, created_at DESC, id DESC LIMIT 13 OFFSET $1`, [(safePage - 1) * 12]);
  return { posts: result.rows.slice(0,12).map(toPost), page: safePage, hasMore: result.rows.length > 12 };
}
