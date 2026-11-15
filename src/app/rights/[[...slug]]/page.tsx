import { listContent } from '@/server/content';
import { selectLanguage } from '@/shared/language';
import { n } from '@/shared/nationwide';
import { PublishedItem } from '@/server/components/published-content';
import PrintButton from '@/client/components/print-button';
import { notFound } from 'next/navigation';
const steps = [
  { mn: 'Юу болсныг бичиж тэмдэглэ.', en: 'Write down what happened.' }, { mn: 'Ямар эрх хамаарахыг эх сурвалжаас шалга.', en: 'Check which right applies using its source.' },
  { mn: 'Тусламж хүс.', en: 'Ask for help.' }, { mn: 'Гомдлоо бичгээр гарга.', en: 'Complain in writing.' }, { mn: 'Хариуг лавлаж, явцыг тэмдэглэ.', en: 'Follow up and keep a record.' },
];
export default async function Rights({ params, searchParams }: { params: Promise<{ slug?: string[] }>; searchParams: Promise<{ lang?: string | string[] }> }) {
  const slug = (await params).slug || []; if (slug.length && !['know','defend'].includes(slug.join('/'))) notFound();
  const lang = selectLanguage((await searchParams).lang);
  const [items,allGuidance,organisations]=await Promise.all([listContent('rights'),listContent('guides'),listContent('organisations')]);
  const guidance=allGuidance.filter(item=>!['education_support','education_transport_benefit'].includes(item.publicationInfo?.category??''));
  const contacts=organisations.filter(item=>['National Human Rights Commission of Mongolia — complaints','Legal Aid Centre'].includes(item.title.en));
  return <main id="main" className="content page reading"><h1>{n(lang, 'rights')}</h1><p className="note">{n(lang, 'legal')}</p><p className="meta">{n(lang,'evidenceExplanation')}</p>
    {slug[0] !== 'defend' && <section id="know"><h2>{n(lang, 'know')}</h2>{items.map(item => <PublishedItem key={item.id} item={item} lang={lang} kind="rights" />)}{guidance.map(item=><PublishedItem key={item.id} item={item} lang={lang} kind="guides"/>)}{!items.length&&!guidance.length&&<p>{n(lang,'noItems')}</p>}</section>}
    {slug[0] !== 'know' && <section id="defend"><h2>{n(lang, 'defend')}</h2><ol className="rights-steps">{steps.map((step, i) => <li key={i}>{step[lang]}</li>)}</ol><h3>{n(lang, 'contact')}</h3><p>{n(lang,'contactRightsHelp')}</p>{contacts.map(item=><PublishedItem key={item.id} item={item} lang={lang} kind="organisations"/>)}{!contacts.length&&<a href="https://2026.nhrcm.gov.mn/complaint" rel="noreferrer">{lang==='mn'?'Хүний эрхийн Үндэсний Комисс — гомдол гаргах':'National Human Rights Commission — complaints'}</a>}<PrintButton lang={lang} /></section>}</main>;
}
