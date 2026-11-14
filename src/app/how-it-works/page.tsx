import InformationPage from '@/server/components/information-page';
export default async function Page({searchParams}:{searchParams:Promise<{lang?:string}>}){const lang=(await searchParams).lang==='en'?'en':'mn';return <InformationPage lang={lang} title="how_it_works" sections={[
 ['finding_support','finding_support_text'],['published_sources','published_sources_text'],['unknown_means','unknown_means_text'],['review_process','review_process_text']
]}/>;}
