import Link from 'next/link';
import { selectLanguage } from '@/shared/language';
import { listContent } from '@/server/content';
import { n, regions, type Item } from '@/shared/nationwide';
import { PublishedItem } from '@/server/components/published-content';
export default async function Directory({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const p = await searchParams; const scalar = (k: string) => typeof p[k] === 'string' ? p[k] as string : '';
  const lang = selectLanguage(p.lang); const region = scalar('region'); const area = region ? scalar('area').slice(0, 150) : ''; const nationwide = scalar('nationwide') === '1';
  let items: Item[] = []; let national: Item[] = []; let failed = false;
  try { items = await listContent('organisations', { region, area, nationwide, q: scalar('q').slice(0, 300) }); if (region && !nationwide && !items.some(i => i.status === 'confirmed')) national = await listContent('organisations', { nationwide: true }); } catch { failed = true; }
  const noVerified = !items.some(i => i.status === 'confirmed');
  return <main id="main" className="content page"><h1>{n(lang, 'directory')}</h1><p>{n(lang, 'homeIntro')}</p>
    <form action="/services" className="region-filters"><input type="hidden" name="lang" value={lang} />
      <label>{n(lang, 'region')}<select name="region" defaultValue={region}><option value="">{n(lang, 'allRegions')}</option>{regions.map(r => <option key={r.id} value={r.id}>{r.name[lang]}</option>)}</select></label>
      <label>{n(lang, 'area')}<input name="area" defaultValue={area} maxLength={150} placeholder={n(lang, 'areaHint')} /></label><label>{n(lang, 'query')}<input name="q" defaultValue={scalar('q')} maxLength={300} /></label>
      <label className="check"><input type="checkbox" name="nationwide" value="1" defaultChecked={nationwide} />{n(lang, 'nationwide')}</label><button>{n(lang, 'search')}</button></form>
    {failed ? <p role="alert">{n(lang, 'unavailable')}</p> : <>{noVerified && <section className="empty-region"><h2>{n(lang, 'empty')}</h2><Link href={`/contact?lang=${lang}&service=${encodeURIComponent(region)}#report-problem`}>{n(lang, 'suggest')}</Link></section>}
      {items.map(item => <PublishedItem key={item.id} item={item} lang={lang} kind="organisations" />)}
      {noVerified && region && !nationwide && <section><h2>{n(lang, 'nationalOptions')}</h2>{national.length ? national.map(item => <PublishedItem key={item.id} item={item} lang={lang} kind="organisations" />) : <p>{n(lang, 'todo')}</p>}</section>}</>}
  </main>;
}
