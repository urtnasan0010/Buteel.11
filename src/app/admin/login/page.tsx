import { AdminLogin } from '@/client/components/admin-auth';
import { n } from '@/shared/nationwide';
import { selectLanguage } from '@/shared/language';
export default async function Login({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }) {
  const lang = selectLanguage((await searchParams).lang);
  return <main id="main" className="content page reading"><h1>{n(lang, 'login')}</h1><p>{n(lang, 'ownerOnly')}</p><AdminLogin lang={lang} /></main>;
}
