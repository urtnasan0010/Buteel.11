import { currentAdmin } from '@/server/auth';
import { redirect } from 'next/navigation';
import { AdminConsole } from '@/client/components/admin-console';
import { n } from '@/shared/nationwide';
import { selectLanguage } from '@/shared/language';
export default async function Admin({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }) {
  const lang = selectLanguage((await searchParams).lang);
  if (!await currentAdmin()) redirect(`/admin/login?lang=${lang}`);
  return <main id="main" className="content page"><h1>{n(lang, 'admin')}</h1><AdminConsole lang={lang} /></main>;
}
