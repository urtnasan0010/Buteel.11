import InformationPage from '@/server/components/information-page';
export default async function Page({searchParams}:{searchParams:Promise<{lang?:string}>}){const lang=(await searchParams).lang==='en'?'en':'mn';return <InformationPage lang={lang} title="privacy" intro="privacy_intro" sections={[
 ['search_privacy','search_privacy_text'],['local_form_data','local_form_data_text'],['tracking_and_links','tracking_and_links_text']
]}/>;}
