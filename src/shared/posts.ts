import { z } from 'zod';
import type { Lang, Text } from './data';

// Categories retain existing storage identifiers. Every category appears on Home only.
export const postTypes = ['announcement', 'event', 'warning'] as const;
export const MAX_POST_IMAGES = 70;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_POST_BYTES = 32 * 1024 * 1024;
const plain = (max: number) => z.string().trim().max(max).refine(value => !/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(value), 'Use plain text');
const pair = (max: number) => z.object({ mn: plain(max), en: plain(max) }).strict();
const day = z.string().refine(value => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value, 'Invalid date');
export const postInputSchema = z.object({
  id: z.uuid(), version: z.number().int().min(0), title: pair(240), body: pair(20000),
  type: z.enum(postTypes), postedDate: day, startDate: z.union([z.literal(''), day]), endDate: z.union([z.literal(''), day]),
  publishState: z.enum(['draft', 'published']),
  images: z.array(z.object({ id: z.uuid(), alt: pair(500) }).strict()).max(MAX_POST_IMAGES),
}).strict().superRefine((value, context) => {
  if (new Set(value.images.map(image => image.id)).size !== value.images.length) context.addIssue({ code: 'custom', message: 'Duplicate images' });
  if (value.endDate && (!value.startDate || value.endDate < value.startDate)) context.addIssue({ code: 'custom', message: 'End date must follow start date' });
  if (value.publishState === 'published') {
    for (const text of [value.title, value.body, ...value.images.map(image => image.alt)]) {
      if (!text.mn || /TODO/i.test(text.mn)) context.addIssue({ code: 'custom', message: 'Published posts need Mongolian text and image descriptions' });
    }
  }
});
export type PostInput = z.infer<typeof postInputSchema>;
export type PostImage = { id: string; alt: Text; url: string };
export type Post = Omit<PostInput, 'images'> & { images: PostImage[] };
export type PostPage = { posts: Post[]; page: number; hasMore: boolean };
export const postsCopy = {
  heading: { mn: 'Мэдээ, мэдээлэл', en: 'News and updates' },
  all: { mn: 'Бүгд', en: 'All' }, event: { mn: 'Үйл явдал', en: 'Event' }, announcement: { mn: 'Зарлал', en: 'Announcement' }, warning: { mn: 'Сэрэмжлүүлэг', en: 'Notice' },
  homeOnly: { mn: 'Бүх нийтлэл зөвхөн Нүүр хуудсанд гарна. Төрөл нь нийтлэлийн ангилал юм.', en: 'All posts appear on Home only. Type is a content category.' },
  draftRestored: { mn: 'Хадгалаагүй нийтлэлийг сэргээсэн. Энэ цонхонд Удирдлага руу буцаж ирэхэд бичвэр, сонгосон зураг сэргээгдэнэ. Цонхыг хаах эсвэл дахин ачаалах үед хадгалагдахгүй.', en: 'Unsaved post restored. Text and selected images survive returning to Administration in this tab. They do not survive closing or reloading the tab.' },
  empty: { mn: 'Нийтлэгдсэн мэдээ хараахан алга.', en: 'No published posts yet.' },
  noMatch: { mn: 'Энэ төрөлд нийтлэл алга.', en: 'No posts in this category.' },
  unavailable: { mn: 'Мэдээг ачаалж чадсангүй. Дахин оролдоно уу.', en: 'Posts could not load. Please try again.' },
  retry: { mn: 'Дахин оролдох', en: 'Try again' }, read: { mn: 'Дэлгэрэнгүй унших', en: 'Read more' },
  previous: { mn: 'Өмнөх', en: 'Previous' }, next: { mn: 'Дараах', en: 'Next' },
  admin: { mn: 'Удирдлага', en: 'Administration' }, manage: { mn: 'Нийтлэл удирдах', en: 'Manage posts' },
  create: { mn: 'Нийтлэл нэмэх', en: 'New post' }, title: { mn: 'Гарчиг', en: 'Title' }, body: { mn: 'Тайлбар', en: 'Description' },
  type: { mn: 'Төрөл', en: 'Type' }, postedDate: { mn: 'Нийтэлсэн огноо', en: 'Publication date' }, startDate: { mn: 'Эхлэх огноо', en: 'Start date' }, endDate: { mn: 'Дуусах огноо', en: 'End date' },
  images: { mn: 'Зураг', en: 'Pictures' }, alt: { mn: 'Зургийн тайлбар', en: 'Image description' },
  uploadHint: { mn: 'JPEG, PNG, WebP эсвэл GIF. Нэг зураг 5 МБ хүртэл, нийт 70 зураг, нэг хадгалалтад 32 МБ хүртэл.', en: 'JPEG, PNG, WebP or GIF. Up to 5 MB per image, 70 images per post, and 32 MB per save.' },
  draft: { mn: 'Ноорог', en: 'Draft' }, published: { mn: 'Нийтлэгдсэн', en: 'Published' },
  saveDraft: { mn: 'Ноорог хадгалах', en: 'Save draft' }, publish: { mn: 'Нийтлэх', en: 'Publish' },
  savePublished: { mn: 'Өөрчлөлт нийтлэх', en: 'Publish changes' }, unpublish: { mn: 'Ноорог болгох', en: 'Move to draft' },
  publishHint: { mn: 'Нийтлэхийн өмнө гарчиг, тайлбар болон зургийн тайлбарыг бөглөнө үү.', en: 'Publishing requires Mongolian titles, descriptions and image descriptions.' },
  edit: { mn: 'Засах', en: 'Edit' }, remove: { mn: 'Устгах', en: 'Delete' }, removeImage: { mn: 'Зураг хасах', en: 'Remove image' },
  removeConfirm: { mn: 'Энэ нийтлэлийг сайтаас устгах уу?', en: 'Remove this post from the site?' },
  cancel: { mn: 'Болих', en: 'Cancel' }, preview: { mn: 'Урьдчилан харах', en: 'Preview' },
  discardConfirm: { mn: 'Хадгалаагүй өөрчлөлтийг орхих уу?', en: 'Discard unsaved changes?' },
  saving: { mn: 'Хадгалж байна…', en: 'Saving…' }, saved: { mn: 'Хадгаллаа.', en: 'Saved.' },
  savedRefresh: { mn: 'Хадгаллаа. Жагсаалтыг шинэчлэхийн тулд дахин ачаална уу.', en: 'Saved. Reload to refresh the list.' },
  deleted: { mn: 'Нийтлэлийг устгалаа.', en: 'Post removed.' },
  failed: { mn: 'Хадгалж чадсангүй. Оруулсан мэдээллээ шалгаад дахин оролдоно уу.', en: 'Could not save. Check the fields and try again.' },
  conflict: { mn: 'Нийтлэл өөрчлөгдсөн байна. Дахин ачаалж, шинэ хувилбарыг нээнэ үү.', en: 'This post changed. Reload and open the latest version.' },
  denied: { mn: 'Нэвтрэх эрхийг шалгахын тулд дахин нэвтэрнэ үү.', en: 'Please sign in again to verify your access.' },
  fileError: { mn: 'Зургийн төрөл, хэмжээ болон нийт тоог шалгана уу.', en: 'Check image types, sizes and total count.' },
  loading: { mn: 'Нийтлэл ачаалж байна…', en: 'Loading posts…' },
  setup: { mn: 'Нийтлэл хадгалах санг тохируулах шаардлагатай.', en: 'Post storage needs to be set up.' },
} satisfies Record<string, Text>;
export const pc = (lang: Lang, key: keyof typeof postsCopy) => postsCopy[key][lang];
export function todayInMongolia() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ulaanbaatar', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
export function postDate(value: string, lang: Lang) {
  const parsed = new Date(value + 'T00:00:00Z');
  return Number.isFinite(parsed.getTime()) ? new Intl.DateTimeFormat(lang === 'mn' ? 'mn-MN' : 'en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(parsed) : '';
}
