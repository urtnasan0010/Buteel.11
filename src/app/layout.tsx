import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Navigation } from '@/client/components/language-switch';
import { selectLanguage } from '@/shared/language';
import { t } from '@/shared/translations';
import { n } from '@/shared/nationwide';
import { Icon } from '@/shared/ui';
import '@/client/styles/globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const lang = selectLanguage(h.get('x-language'));
  const path = h.get('x-page') || '/';
  const title = path === '/understand' ? n(lang, 'understand')
    : path === '/help' ? n(lang, 'help')
    : path === '/rights' ? n(lang, 'rights') : t(lang, 'home');
  return { title: `${title} | ${n(lang, 'brand')}` };
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const lang = selectLanguage(requestHeaders.get('x-language'));
  const path = requestHeaders.get('x-page') || '/';
  return <html lang={lang}><body>
    <a className="skip" href="#main">{t(lang, 'skip_to_main_content')}</a>
    <header className="site-header">
      <Link className="brand" href={`/?lang=${lang}`} aria-label="Нүүр хуудас">
        <span className="brand-icon" aria-hidden="true"><Icon kind="brand" /></span>
      </Link>
      <Navigation lang={lang} />
    </header>
    {children}
    {path !== '/' && <footer className="compact-footer"><p>{n(lang,'brand')}</p></footer>}
  </body></html>;
}
