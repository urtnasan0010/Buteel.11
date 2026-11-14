import Link from 'next/link';
import {notFound} from 'next/navigation';
import {contentPages} from '@/shared/content-pages';
import {t} from '@/shared/translations';
import type {Lang} from '@/shared/data';
import PrintButton from '@/client/components/print-button';
import ClaimList from './claim-list';
export default function SectionContent({path,lang}:{path:string;lang:Lang}){
 const page=contentPages.find(p=>p.path===path);if(!page)notFound();
 const isIndex=page.path===`/${page.section}`;
 const links=isIndex?[...contentPages.filter(p=>p.section===page.section&&p.path!==path).map(p=>({path:p.path,label:p.title})),...(page.links||[])]:page.links||[];
 return <main id="main" className="content page reading">
  <Link className="breadcrumb" href={isIndex?`/?lang=${lang}`:`/${page.section}?lang=${lang}`}>{t(lang,isIndex?'home':page.section)}</Link>
  <h1>{t(lang,page.title)}</h1><p className="intro">{t(lang,page.summary)}</p>
  {page.path==='/understand/rights'&&<p className="note">{t(lang,'legal_caution')}</p>}
  {page.points.length>0&&<section><h2>{t(lang,'key_points')}</h2><ul className="reading-list">{page.points.map(key=><li key={key}>{t(lang,key)}</li>)}</ul></section>}
  {page.path==='/understand/deaf-hard-of-hearing'&&lang==='mn'&&<p className="note">{t(lang,'msl_native')}</p>}
  {page.claimIds&&<ClaimList ids={page.claimIds} lang={lang}/>}
  {page.path==='/understand/rights'&&<section><h2>{t(lang,'other_pending_information')}</h2><ul className="reading-list">{(['pending_helplines','pending_benefits','pending_population','pending_ratification','pending_terminology'] as const).map(key=><li key={key}>{t(lang,key)}</li>)}</ul></section>}
  {links.length>0&&<section><h2>{t(lang,'related_pages')}</h2><ul className="reading-list">{links.map(link=><li key={link.path}><Link href={`${link.path}?lang=${lang}`}>{t(lang,link.label)}</Link></li>)}</ul></section>}
  {page.path!=='/understand/rights'&&<p className="note">{t(lang,'editorial_note')}</p>}
  <dl className="content-provenance"><dt>{t(lang,page.claimIds?.length?'general_guidance_source':'source_line')}</dt><dd>TODO [source needed]</dd><dt>{t(lang,'content_review_date')}</dt><dd>TODO [review date]</dd></dl>
  <PrintButton lang={lang}/>
 </main>;
}
