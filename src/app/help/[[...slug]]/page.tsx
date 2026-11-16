import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { selectLanguage } from '@/shared/language';
import { n, regions, type Item } from '@/shared/nationwide';
import { t } from '@/shared/translations';
import { contentPages } from '@/shared/content-pages';
import { listContent, publicItem } from '@/server/content';
import { PublishedItem } from '@/server/components/published-content';
import { TopicDetails } from '@/server/components/section-content';
import Checklist from '@/client/components/checklist';
import ReportForm from '@/client/components/report-form';
import {sortByRegionName} from '@/shared/public-content';

export default async function Help({ params, searchParams }: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  const scalar = (key: string) => typeof p[key] === 'string' ? p[key] as string : '';
  const lang = selectLanguage(p.lang);
  const slug = (await params).slug ?? [];
  if (slug.length) {
    const page = contentPages.find(page => page.path === '/help/' + slug.join('/'));
    if (!page) notFound();
    redirect(`/help?lang=${lang}&topic=${slug[0]}#${slug[0]}`);
  }
  const region = scalar('region');
  const area = region ? scalar('area').slice(0,150) : '';
  const q = scalar('q').slice(0,300);
  const focus=scalar('focus');
  const nationwide = scalar('nationwide') === '1';
  const organisation = scalar('organisation').slice(0,150);
  const reportPage = scalar('service').slice(0,500) || '/help';
  let items: Item[] = [], national: Item[] = [], guides: Item[] = [];
  let failed = false, guidesFailed = false;
  try {
    items = await listContent('organisations', { region, area, nationwide, q,focus });
    if (region && !nationwide && !items.some(item => item.status === 'confirmed')) national = await listContent('organisations', { nationwide: true,focus });
    if (organisation) {
      const selected = await publicItem('organisations', organisation);
      if (selected && !items.some(item => item.id === selected.id)) items.unshift(selected);
    }
  } catch { failed = true; }
  try { guides = await listContent('guides'); } catch { guidesFailed = true; }
  items=sortByRegionName(items,lang);
  national=sortByRegionName(national,lang);
  const noVerified = !items.some(item => item.status === 'confirmed');
  const topics = contentPages.filter(page => page.section === 'help' && page.path !== '/help');
  return <main id="main" className="content page help-page">
    <h1>{n(lang,'help')}</h1><p className="intro">{n(lang,'helpCard')}</p><p className="meta">{n(lang,'evidenceExplanation')}</p>
    <section id="organisations" aria-labelledby="organisations-title">
      <h2 id="organisations-title">{n(lang,'directory')}</h2>
      <form action="/help#organisations" className="region-filters">
        <input type="hidden" name="lang" value={lang}/>
        {focus&&<input type="hidden" name="focus" value={focus}/>}
        <label>{n(lang,'region')}<select name="region" defaultValue={region}><option value="">{n(lang,'allRegions')}</option>{regions.map(region=><option key={region.id} value={region.id}>{region.name[lang]}</option>)}</select></label>
        <label>{n(lang,'area')}<input name="area" defaultValue={area} maxLength={150} placeholder={n(lang,'areaHint')}/></label>
        <label>{n(lang,'query')}<input name="q" defaultValue={q} maxLength={300}/></label>
        <label className="check"><input type="checkbox" name="nationwide" value="1" defaultChecked={nationwide}/>{n(lang,'nationwide')}</label><button>{n(lang,'search')}</button>
      </form>
      {focus&&<Link className="text-link" href={`/help?lang=${lang}#organisations`}>{n(lang,'clearFocus')}</Link>}
      {failed ? <p role="alert">{n(lang,'unavailable')}</p> : <>
        {noVerified && <div className="empty-region"><p>{n(lang,'empty')}</p><Link href={`/help?lang=${lang}&report=1&service=${encodeURIComponent(region || '/help')}#report-problem`}>{n(lang,'suggest')}</Link></div>}
        {items.map(item=><PublishedItem key={item.id} item={item} lang={lang} kind="organisations" expanded={item.id===organisation}/>)}
        {noVerified && region && !nationwide && <section><h3>{n(lang,'nationalOptions')}</h3>{national.length ? national.map(item=><PublishedItem key={item.id} item={item} lang={lang} kind="organisations"/>) : <p>{n(lang,'noItems')}</p>}</section>}
      </>}
    </section>
    <section id="guides" className="help-reading"><h2>{n(lang,'guides')}</h2>
      {guidesFailed ? <p role="alert">{n(lang,'unavailable')}</p> : guides.length ? guides.map(item=><PublishedItem key={item.id} item={item} lang={lang} kind="guides"/>) : <p>{n(lang,'noItems')}</p>}
      <Checklist lang={lang}/>
    </section>
    <section className="help-reading"><h2>{n(lang,'helping')}</h2><p>{n(lang,'askFirst')}</p>
      {topics.map(page=><TopicDetails key={page.path} page={page} lang={lang} open={scalar('topic')===page.path.split('/').pop()}/>)}
      <details id="for-organisations" className="topic-details" open={scalar('topic')==='for-organisations'}><summary>{t(lang,'for_organisations')}</summary><h3>{t(lang,'listing_request')}</h3><p>{t(lang,'listing_request_text')}</p><h3>{t(lang,'listing_review')}</h3><p>{t(lang,'listing_review_text')}</p></details>
    </section>
    {scalar('report')==='1' && <div id="report" className="help-reading"><ReportForm lang={lang} page={reportPage}/></div>}
  </main>;
}
