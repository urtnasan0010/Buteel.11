import { selectLanguage } from '@/shared/language';
import SectionContent from '@/server/components/section-content';
export default async function Page({params,searchParams}:{params:Promise<{slug?:string[]}>;searchParams:Promise<{lang?: string | string[]}>}) {
 const {slug=[]}=await params;const lang=selectLanguage((await searchParams).lang);
 return <SectionContent path={'/reach'+(slug.length?'/'+slug.join('/'):'')} lang={lang}/>;
}
