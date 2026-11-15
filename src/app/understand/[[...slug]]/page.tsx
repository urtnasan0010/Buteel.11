import { selectLanguage } from '@/shared/language';
import SectionContent from '@/server/components/section-content';
export default async function Page({params,searchParams}:{params:Promise<{slug?:string[]}>;searchParams:Promise<{lang?: string | string[];topic?:string}>}) {
 const {slug=[]}=await params;const p=await searchParams;const lang=selectLanguage(p.lang);
 return <SectionContent path={'/understand'+(slug.length?'/'+slug.join('/'):'')} lang={lang} topic={p.topic}/>;
}
