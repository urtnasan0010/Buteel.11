import { selectLanguage } from '@/shared/language';
import { n } from '@/shared/nationwide';
import ReportForm from '@/client/components/report-form';
export default async function Contact({ searchParams }: { searchParams: Promise<{ lang?: string | string[]; service?: string | string[] }> }) {
  const p = await searchParams; const lang = selectLanguage(p.lang);
  const page = typeof p.service === 'string' ? p.service.slice(0,500) : '/contact';
  return <main id="main" className="content page reading"><h1>{n(lang,'report')}</h1><ReportForm lang={lang} page={page} /></main>;
}
