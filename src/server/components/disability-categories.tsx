import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listContent } from '@/server/content';
import { n } from '@/shared/nationwide';
import type { Lang } from '@/shared/data';
import { categorySections,disabilityCategorySchema,categoryPublicationIssues,disabilityFocusTerms } from '@/shared/disability-categories';
import { publicText } from '@/shared/public-content';
import PrintButton from '@/client/components/print-button';
const sectionLabels={meaning:'categoryMeaning',barriers:'categoryBarriers',do:'categoryDo',avoid:'categoryAvoid',language:'categoryLanguage'} as const;

export async function publishedDisabilityCategories(){
  const items=await listContent('guides',{disabilityCategories:true});
  return items.flatMap(item=>{
    const parsed=disabilityCategorySchema.safeParse(item.disabilityCategory);
    return parsed.success&&!categoryPublicationIssues(parsed.data).length&&publicText(item.title.mn)&&publicText(item.title.en)?[{item,category:parsed.data}]:[];
  });
}
export default async function DisabilityCategories({slug,lang}:{slug?:string;lang:Lang}){
  const entries=await publishedDisabilityCategories();
  if(!entries.length)notFound();
  if(!slug)return <main id="main" className="content page"><Link className="breadcrumb" href={`/understand?lang=${lang}`}>{n(lang,'understand')}</Link><h1>{n(lang,'disabilityTypes')}</h1><p className="intro">{n(lang,'categoryTopics')}</p><div className="disability-category-grid">{entries.map(({item,category})=><article key={item.id}><h2><Link href={`/understand/disabilities/${category.slug}?lang=${lang}`}>{item.title[lang]}</Link></h2><p>{category.summary[lang]}</p></article>)}</div></main>;
  const entry=entries.find(entry=>entry.category.slug===slug);if(!entry)notFound();
  const {item,category}=entry;
  const focus=disabilityFocusTerms[category.slug].length?`&focus=${category.slug}`:'';
  return <main id="main" className="content page reading"><Link className="breadcrumb" href={`/understand?lang=${lang}`}>{n(lang,'understand')}</Link><h1>{item.title[lang]}</h1><p className="intro">{category.summary[lang]}</p>
    {categorySections.map(section=><section key={section}><h2>{n(lang,sectionLabels[section])}</h2>{category.facts.filter(fact=>fact.section===section).map((fact,index)=><p key={index}>{fact.text[lang]} <span className="fact-citations">{fact.sources.map(id=>{const source=category.sources.find(source=>source.id===id)!;return <a key={id} href={`#source-${id}`} aria-label={`${n(lang,'source')}: ${source.title[lang]||source.title.en}, ${source.reviewDate}`}>[{category.sources.indexOf(source)+1}]</a>;})}</span></p>)}</section>)}
    <section><h2>{n(lang,'categorySupport')}</h2><Link className="button" href={`/help?lang=${lang}${focus}#organisations`}>{n(lang,'directory')}</Link></section>
    <section><h2>{n(lang,'sources')}</h2><ol className="category-sources">{category.sources.filter(source=>category.facts.some(fact=>fact.sources.includes(source.id))).map(source=><li id={`source-${source.id}`} key={source.id}><a href={source.url}>{source.title[lang]||source.title.en}</a><p>{source.locator[lang]||source.locator.en}</p><p>{n(lang,'review')}: <time dateTime={source.reviewDate}>{source.reviewDate}</time></p></li>)}</ol></section>
    <p className="meta">{n(lang,category.livedExperienceReviewed?'experienceReviewed':'experienceReview')}</p>{category.nativeReviewNeeded&&<p className="note">{n(lang,'nativeReview')}</p>}<PrintButton lang={lang}/>
  </main>;
}
