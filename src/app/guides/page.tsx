import { listContent } from '@/server/content';
import { n } from '@/shared/nationwide';
import { selectLanguage } from '@/shared/language';
import { PublishedItem } from '@/server/components/published-content';
import Checklist from '@/client/components/checklist';
export default async function Guides({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }) {
  const lang = selectLanguage((await searchParams).lang); const items = await listContent('guides');
  return <main id="main" className="content page reading"><h1>{n(lang, 'guides')}</h1><p>{n(lang, 'askFirst')}</p>{items.length ? items.map(item => <PublishedItem key={item.id} item={item} lang={lang} kind="guides" />) : <p>{n(lang, 'todo')}</p>}<Checklist lang={lang} /></main>;
}
