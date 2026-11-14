import Link from 'next/link';
import InformationPage from '@/server/components/information-page';
import {t} from '@/shared/translations';
export default async function Page({searchParams}:{searchParams:Promise<{lang?:string}>}){const lang=(await searchParams).lang==='en'?'en':'mn';return <InformationPage lang={lang} title="for_organisations" sections={[
 ['listing_request','listing_request_text'],['listing_review','listing_review_text']
]}><Link className="text-link" href={`/contact?lang=${lang}#feedback`}>{t(lang,'prepare_a_copyable_report')}</Link></InformationPage>;}
