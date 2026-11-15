import Link from 'next/link';
import type { Lang } from '@/shared/data';
import { n, type Item, type Kind } from '@/shared/nationwide';
import PrintButton from '@/client/components/print-button';
function sourceLinks(item:Item) {
  return [...new Set([item.source,...(item.publicationInfo?.sources??[])])].filter(value=>{
    try {const url=new URL(value);return ['http:','https:'].includes(url.protocol)&&!url.username&&!url.password;}catch{return false;}
  });
}
export function Evidence({ item, lang }: { item: Item; lang: Lang }) {
  const sources=sourceLinks(item);
  return <><dl className="evidence"><div><dt>{n(lang,'sources')}</dt><dd>{sources.length?<ul className="source-links">{sources.map((source,index)=><li key={source}><a href={source} rel="noreferrer">{index+1}. {new URL(source).hostname}</a></li>)}</ul>:n(lang,'todo')}</dd></div><div><dt>{n(lang,'review')}</dt><dd><time dateTime={item.reviewDate}>{item.reviewDate||n(lang,'todo')}</time></dd></div>{item.confidence&&<div><dt>{n(lang,'confidence')}</dt><dd>{n(lang,item.confidence)}</dd></div>}<div><dt>{n(lang,'status')}</dt><dd>{n(lang,item.status)}</dd></div></dl>{item.publicationInfo?.research&&lang==='en'&&<p className="meta">{n(lang,'descriptiveEnglish')}</p>}</>;
}
export function PublishedItem({ item, lang, kind, expanded = false }: { item: Item; lang: Lang; kind: Kind; expanded?: boolean }) {
  if (kind === 'organisations') return <details id={`organisation-${item.id}`} className="published-item organisation-details" open={expanded}>
    <summary><h3>{item.title[lang]}</h3></summary><p className="preserve-lines">{item.body[lang]}</p><p>{item.localArea[lang]}</p><p>{n(lang,'remote')}: <strong>{n(lang,item.remote)}</strong></p>
    <dl className="organisation-information">{(['focus','address','hours','eligibility','howToApply'] as const).map(field=>{const value=item.publicationInfo?.[field]?.[lang];return value?<div key={field}><dt>{n(lang,field)}</dt><dd className="preserve-lines">{value}</dd></div>:null;})}</dl>
    <div className="contact-actions">{[...new Set([item.phone,...(item.publicationInfo?.phones??[])])].filter(Boolean).map(phone=><a key={phone} href={`tel:${phone.replace(/[^+\d]/g,'')}`}>{n(lang,'phone')}: {phone}</a>)}{[...new Set([item.email,...(item.publicationInfo?.emails??[])])].filter(Boolean).map(email=><a key={email} href={`mailto:${email}`}>{email}</a>)}{item.website&&<a href={item.website} rel="noreferrer">{n(lang,'website')}</a>}</div>
    {!item.publicationInfo?.contactTested&&<p className="meta">{n(lang,'notContactTested')}</p>}
    <Evidence item={item} lang={lang}/><Link href={`/help?lang=${lang}&report=1&service=${encodeURIComponent(item.id)}#report-problem`}>{n(lang,'reportLink')}</Link>
  </details>;
  return <article className="published-item"><h3>{item.title[lang]}</h3><p className="preserve-lines">{item.body[lang]}</p>
    {kind==='guides'&&(item.phone||item.email||item.website)&&<div className="contact-actions">{item.phone&&<a href={`tel:${item.phone.replace(/[^+\d]/g,'')}`}>{n(lang,'phone')}: {item.phone}</a>}{item.email&&<a href={`mailto:${item.email}`}>{item.email}</a>}{item.website&&<a href={item.website} rel="noreferrer">{n(lang,'website')}</a>}</div>}
    {kind === 'rights' && <dl className="evidence"><div><dt>{n(lang, 'law')}</dt><dd>{item.lawName[lang]}</dd></div><div><dt>{n(lang, 'article')}</dt><dd>{item.article[lang]}</dd></div><div><dt>{n(lang, 'revised')}</dt><dd>{item.revision[lang] || n(lang, 'todo')}</dd></div></dl>}
    {kind === 'guides' && item.checklist[lang] && <fieldset className="print-checklist"><legend>{n(lang, 'checklist')}</legend>{item.checklist[lang].split('\n').filter(Boolean).map((line, i) => <label key={i}><input type="checkbox" />{line}</label>)}</fieldset>}
    {kind === 'rights' && <><h3>{n(lang,'contact')}</h3><p className="preserve-lines">{item.status === 'confirmed' && item.contact.mn && item.contact.en ? item.contact[lang] : n(lang,'todo')}</p></>}
    <Evidence item={item} lang={lang} />{kind === 'guides' && item.checklist[lang] && <PrintButton lang={lang} />}</article>;
}
