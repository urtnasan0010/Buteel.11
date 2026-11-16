import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { LanguageSwitch, Navigation } from '@/client/components/language-switch';
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
  const lang = selectLanguage((await headers()).get('x-language'));
  let signedIn = false;
  try { signedIn = Boolean(await currentAdmin()); } catch { /* Public navigation remains available if auth is unavailable. */ }
  return <html lang={lang}><body>
    <a className="skip" href="#main">{t(lang, 'skip_to_main_content')}</a>
    <header className="site-header">
      <Link className="brand" href={`/?lang=${lang}`}>
        <span className="brand-icon"><Icon kind="brand" /></span>{n('mn', 'brand')}
      </Link>
      {!signedIn && <Navigation lang={lang} />}
      <div className="staff-header-actions"><LanguageSwitch lang={lang} />
        {signedIn ? <><Link className="language" href={`/?lang=${lang}`}>{t(lang,'home')}</Link><StaffSignOut /></>
          : <Link className="language" href={`/admin/login?lang=${lang}`}>Staff</Link>}
      </div>
    </header>
    {children}
    <footer className="compact-footer"><Link className="text-link" href={`/admin?lang=${lang}`}>{pc(lang,'admin')}</Link></footer>
  </body></html>;
}
