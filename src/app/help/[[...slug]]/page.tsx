import SectionContent from '@/server/components/section-content';
export default async function Page({params,searchParams}:{params:Promise<{slug?:string[]}>;searchParams:Promise<{lang?:string}>}) {
 const {slug=[]}=await params;const lang=(await searchParams).lang==='en'?'en':'mn';
 return <SectionContent path={'/help'+(slug.length?'/'+slug.join('/'):'')} lang={lang}/>;
}
