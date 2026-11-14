import Link from 'next/link';
import MslVideo from '@/shared/msl-video';
import {t,type TranslationKey} from '@/shared/translations';
import type {Lang} from '@/shared/data';

export default function InformationPage({lang,title,intro,sections,children}:{lang:Lang;title:TranslationKey;intro?:TranslationKey;sections:readonly (readonly [TranslationKey,TranslationKey])[];children?:React.ReactNode}) {
 return <main id="main" className="content page reading">
  <Link className="breadcrumb" href={`/?lang=${lang}`}>{t(lang,'home')}</Link>
  <h1>{t(lang,title)}</h1>
  {intro&&<p className="intro">{t(lang,intro)}</p>}
  {(['how_it_works','contact_page'] as string[]).includes(title)?<MslVideo lang={lang} title={t(lang,title)}>{sections.map(([heading,body])=><div key={heading}><h4>{t(lang,heading)}</h4><p>{t(lang,body)}</p></div>)}</MslVideo>:sections.map(([heading,body])=><section key={heading}><h2>{t(lang,heading)}</h2><p>{t(lang,body)}</p></section>)}
  {children}
 </main>;
}
