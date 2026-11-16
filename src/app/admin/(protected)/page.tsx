import { redirect } from 'next/navigation';
import { currentAdmin } from '@/server/auth';
import { selectLanguage } from '@/shared/language';
import { pc } from '@/shared/posts';
import PostAdmin from '@/client/components/post-admin';

export default async function Admin({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }) {
  const lang = selectLanguage((await searchParams).lang);
  if (!await currentAdmin()) redirect(`/admin/login?lang=${lang}`);
  return <main id="main" className="content page"><h1>{pc(lang,'manage')}</h1><a className="text-link" href={`/admin/verification?lang=${lang}`}>{lang === 'mn' ? 'Эх сурвалжийн хяналт' : 'Source verification'}</a><PostAdmin lang={lang}/></main>;
}
