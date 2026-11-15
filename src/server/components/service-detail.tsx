import { notFound, redirect } from 'next/navigation';
import { publicItem } from '@/server/content';
import { selectLanguage } from '@/shared/language';
export default async function Detail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ lang?: string | string[] }> }) {
  const { id } = await params;
  const lang = selectLanguage((await searchParams).lang);
  if (!await publicItem('organisations', id)) notFound();
  redirect(`/help?lang=${lang}&organisation=${encodeURIComponent(id)}#organisation-${encodeURIComponent(id)}`);
}
