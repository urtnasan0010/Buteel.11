import Link from 'next/link';
import { selectLanguage } from '@/shared/language';
import { n } from '@/shared/nationwide';
export default async function Disclaimer({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }) {
  const lang = selectLanguage((await searchParams).lang);
  return <main id="main" className="content page reading"><h1>{n(lang,'disclaimer')}</h1><p>{n(lang,'legal')}</p><p>{n(lang,'todo')}</p><Link href={`/accessibility?lang=${lang}`}>{lang === 'mn' ? 'Хүртээмжийн мэдэгдэл' : 'Accessibility statement'}</Link></main>;
}
