import {notFound} from 'next/navigation';
import {contentPages} from '@/shared/content-pages';
import {t} from '@/shared/translations';
import type {Lang} from '@/shared/data';
import PrintButton from '@/client/components/print-button';
import ClaimList from './claim-list';
import {redirect} from 'next/navigation';
import type {ContentPage} from '@/shared/content-pages';
import {publicText} from '@/shared/public-content';
import Link from 'next/link';
import {n} from '@/shared/nationwide';

export function TopicDetails({page,lang,open=false}:{page:ContentPage;lang:Lang;open?:boolean}) {
 const id=page.path.split('/').pop()!;
 return <details id={id} className="topic-details" open={open}>
  <summary><h2>{t(lang,page.title)}</h2></summary>
  <p>{t(lang,page.summary)}</p>
  {page.points.length>0&&<ul className="reading-list">{page.points.filter(key=>publicText(t(lang,key))).map(key=><li key={key}>{t(lang,key)}</li>)}</ul>}
  {page.path==='/understand/deaf-hard-of-hearing'&&lang==='mn'&&publicText(t(lang,'msl_native'))&&<p className="note">{t(lang,'msl_native')}</p>}
  {page.claimIds&&<ClaimList ids={page.claimIds} lang={lang}/>}
  {publicText(t(lang,'editorial_note'))&&<p className="meta">{t(lang,'editorial_note')}</p>}
 </details>;
}
export default function SectionContent({path,lang,topic:selectedTopic,hasDisabilityCategories=false}:{path:string;lang:Lang;topic?:string;hasDisabilityCategories?:boolean}) {
 if(path==='/understand/rights')redirect(`/rights?lang=${lang}`);
 const page=contentPages.find(page=>page.path===path);
 if(!page)notFound();
 if(page.path==='/reach')redirect(`/understand?lang=${lang}&topic=communication#communication`);
 if(page.path!==`/${page.section}`) {
  const topic=page.path.split('/').pop()!;
  redirect(`/${page.section==='help'?'help':'understand'}?lang=${lang}&topic=${encodeURIComponent(topic)}#${topic}`);
 }
 const topics=contentPages.filter(page=>(page.section==='understand'||page.section==='reach')&&page.path.split('/').length>2&&page.path!=='/understand/rights');
 return <main id="main" className="content page reading"><h1>{t(lang,page.title)}</h1><p className="intro">{t(lang,page.summary)}</p>{hasDisabilityCategories&&<p><Link className="text-link" href={`/understand/disabilities?lang=${lang}`}>{n(lang,'disabilityTypes')}</Link></p>}{topics.map(topic=><TopicDetails key={topic.path} page={topic} lang={lang} open={selectedTopic===topic.path.split('/').pop()}/>)}<PrintButton lang={lang}/></main>;
}
