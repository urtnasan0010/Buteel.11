import { selectLanguage } from '@/shared/language';
import SectionContent from '@/server/components/section-content';
import DisabilityCategories,{publishedDisabilityCategories} from '@/server/components/disability-categories';
export default async function Page({params,searchParams}:{params:Promise<{slug?:string[]}>;searchParams:Promise<{lang?: string | string[];topic?:string}>}) {
 const {slug=[]}=await params;const p=await searchParams;const lang=selectLanguage(p.lang);
 if(slug[0]==='disabilities'&&slug.length<=2)return <DisabilityCategories slug={slug[1]} lang={lang}/>;
 let hasCategories=false;
 if(!slug.length){try{hasCategories=(await publishedDisabilityCategories()).length>0;}catch{/* Keep existing educational content available during database outages. */}}
 return <SectionContent path={'/understand'+(slug.length?'/'+slug.join('/'):'')} lang={lang} topic={p.topic} hasDisabilityCategories={hasCategories}/>;
}
