import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Navigation } from '@/client/components/language-switch';
import { selectLanguage } from '@/shared/language';
import { t } from '@/shared/translations';
import { n } from '@/shared/nationwide';
import { Icon } from '@/shared/ui';
import { pc } from '@/shared/posts';
import { currentAdmin } from '@/server/auth';
import StaffSignOut from '@/client/components/staff-sign-out';
import '@/client/styles/globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const lang = selectLanguage(h.get('x-language'));
  const path = h.get('x-page') || '/';
  const admin = path === '/admin' || path.startsWith('/admin/');
  const title = admin ? pc(lang, 'manage') : path === '/understand' ? n(lang, 'understand')
    : path === '/help' ? n(lang, 'help')
    : path === '/rights' ? n(lang, 'rights') : t(lang, 'home');
  return { title: `${title} | ${n(lang, 'brand')}`, ...(admin ? { robots: { index:false,follow:false } } : {}) };
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const lang = selectLanguage(requestHeaders.get('x-language'));
  const path = requestHeaders.get('x-page') || '/';
  const adminPage = path === '/admin' || path.startsWith('/admin/');
  let signedIn = false;
  if (adminPage) try { signedIn = Boolean(await currentAdmin()); } catch { /* Authentication fails closed. */ }
  return <html lang={lang}><body>
    <a className="skip" href="#main">{t(lang, 'skip_to_main_content')}</a>
    <header className="site-header">
      <Link className="brand" href={`/?lang=${lang}`} aria-label="Нүүр хуудас">
        <span className="brand-icon" aria-hidden="true"><Icon kind="brand" /></span>
      </Link>
      {!signedIn && <Navigation lang={lang} />}
      <div className="staff-header-actions"><a className="button secondary staff-entry" href="/admin?lang=mn">{signedIn ? 'Удирдлага' : 'Ажилтан'}</a>
        {signedIn && <><Link className="language" href={`/?lang=${lang}`}>{t(lang,'home')}</Link><StaffSignOut /></>}
      </div>
    </header>
    {children}
    {path !== '/' && <footer className="compact-footer"><p>{n(lang,'brand')}</p></footer>}
  </body></html>;
}
