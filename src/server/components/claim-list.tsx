import {claims} from '@/shared/claims';
import type {Lang} from '@/shared/data';
import {t} from '@/shared/translations';
import {publicText,publicUrl} from '@/shared/public-content';
export default function ClaimList({ids,lang}:{ids:string[];lang:Lang}){
 const entries=ids.map(id=>claims.find(c=>c.id===id)).filter(c=>c!==undefined);
 const published=entries.filter(c=>c.status==='published'&&publicText(c.text[lang])&&c.lastReviewed&&c.sources.length&&c.sources.every(source=>publicUrl(source.url)));
 return <>
 {published.length>0&&<section className="claims-section"><h2>{t(lang,'sourced_context')}</h2><p className="meta">{t(lang,'claims_review_note')}</p>
 {published.map(claim=><article className="claim" data-claim-id={claim.id} key={claim.id}>
  <p className="claim-text">{claim.text[lang]}</p>{claim.note&&publicText(claim.note[lang])&&<p className="note">{claim.note[lang]}</p>}
  <dl><dt>{t(lang,'source_line')}</dt><dd><ul className="source-links">{claim.sources.map(source=><li key={source.url}><a href={source.url} lang={source.titleLang} hrefLang={source.titleLang}>{source.title}</a>{source.access==='unavailable'&&<p className="meta">{t(lang,'source_unavailable')}</p>}</li>)}</ul></dd>
  <dt>{t(lang,'content_review_date')}</dt><dd><time dateTime={claim.lastReviewed}>{claim.lastReviewed}</time></dd></dl>
 </article>)}
 </section>}
 </>;
}
