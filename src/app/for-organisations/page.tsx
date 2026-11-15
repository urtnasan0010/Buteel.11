import { selectLanguage } from '@/shared/language';
import Link from 'next/link';
import InformationPage from '@/server/components/information-page';
import {n} from '@/shared/nationwide';
export default async function Page({searchParams}:{searchParams:Promise<{lang?: string | string[]}>}){const lang=selectLanguage((await searchParams).lang);return <InformationPage lang={lang} title="for_organisations" sections={[
 ['listing_request','listing_request_text'],['listing_review','listing_review_text']
]}><Link className="text-link" href={`/contact?lang=${lang}#report-problem`}>{n(lang,'report')}</Link></InformationPage>;}
