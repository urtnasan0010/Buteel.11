import Link from 'next/link';
import { selectLanguage } from '@/shared/language';
import { n } from '@/shared/nationwide';
export default async function About({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }) {
  const lang = selectLanguage((await searchParams).lang);
  return <main id="main" className="content page reading"><h1>{n(lang,'brand')}</h1><p>{n(lang,'homeIntro')}</p><p>{n(lang,'legal')}</p><Link href={`/services?lang=${lang}`}>{n(lang,'directory')}</Link></main>;
}
