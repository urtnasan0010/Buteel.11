import type { Lang, Text } from './data';

// Categories retain existing storage identifiers. Every category appears on Home only.
export const postTypes = ['announcement', 'event', 'warning'] as const;
export type PostImage = { id: string; alt: Text; url: string };
export type Post = {
  id: string;
  title: Text;
  body: Text;
  type: typeof postTypes[number];
  postedDate: string;
  images: PostImage[];
};
export type PostPage = { posts: Post[]; page: number; hasMore: boolean };
export const postsCopy = {
  heading: { mn: 'Мэдээ, мэдээлэл', en: 'News and updates' },
  event: { mn: 'Үйл явдал', en: 'Event' }, announcement: { mn: 'Зарлал', en: 'Announcement' }, warning: { mn: 'Сэрэмжлүүлэг', en: 'Notice' },
  unavailable: { mn: 'Мэдээг ачаалж чадсангүй. Дахин оролдоно уу.', en: 'Posts could not load. Please try again.' },
  retry: { mn: 'Дахин оролдох', en: 'Try again' }, read: { mn: 'Дэлгэрэнгүй унших', en: 'Read more' },
  previous: { mn: 'Өмнөх', en: 'Previous' }, next: { mn: 'Дараах', en: 'Next' },
  images: { mn: 'Зураг', en: 'Pictures' },
} satisfies Record<string, Text>;
export const pc = (lang: Lang, key: keyof typeof postsCopy) => postsCopy[key][lang];
export function postDate(value: string, lang: Lang) {
  const parsed = new Date(value + 'T00:00:00Z');
  return Number.isFinite(parsed.getTime()) ? new Intl.DateTimeFormat(lang === 'mn' ? 'mn-MN' : 'en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(parsed) : '';
}
