import InformationPage from '@/server/components/information-page';
import Feedback from '@/client/components/feedback';
export default async function Page({searchParams}:{searchParams:Promise<{lang?:string;service?:string}>}){const p=await searchParams;const lang=p.lang==='en'?'en':'mn';return <InformationPage lang={lang} title="contact_page" sections={[
 ['contact_unavailable','contact_unavailable_text'],['contact_provider','contact_provider_text']
]}><Feedback lang={lang} service={p.service||''}/></InformationPage>;}
