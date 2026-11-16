import { selectLanguage } from '@/shared/language';
import { t } from "@/shared/translations";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import LanguageSwitch, { Navigation } from "@/client/components/language-switch";
import { Icon, } from "@/shared/ui";
import "@/client/styles/globals.css";
import { n } from '@/shared/nationwide';
import {publishedDisabilityCategories} from '@/server/components/disability-categories';
export async function generateMetadata():Promise<Metadata> {
  const h=await headers();
  const lang=selectLanguage(h.get('x-language'));
  const path=h.get('x-page')||'/';
  const admin=path==='/admin'||path.startsWith('/admin/');
  const info=new URLSearchParams(h.get('x-query')||'').get('info');
  const infoTitle=info==='privacy'?t(lang,'privacy'):info==='disclaimer'?n(lang,'disclaimer'):info==='accessibility'?t(lang,'accessibility_statement'):info?n(lang,'siteInfo'):'';
  let categoryTitle='';
  if(path==='/understand/disabilities')categoryTitle=n(lang,'disabilityTypes');
  else if(path.startsWith('/understand/disabilities/')){
    const slug=path.slice('/understand/disabilities/'.length);
    categoryTitle=(await publishedDisabilityCategories()).find(entry=>entry.category.slug===slug)?.item.title[lang]||n(lang,'disabilityTypes');
  }
  const title=categoryTitle||(path==='/admin/login'?n(lang,'login'):path==='/admin/reset'?n(lang,'resetPassword'):admin?n(lang,'admin'):path.startsWith('/rights')?n(lang,'rights'):path.startsWith('/help')?n(lang,'help'):path.startsWith('/understand')?n(lang,'understand'):infoTitle||t(lang,'home'));
  return {
    title:{default:`${title} | ${n(lang,'brand')}`,template:`%s | ${n(lang,'brand')}`},
    description:n(lang,'homeShort'),
    ...(admin?{robots:{index:false,follow:false}}:{}),
  };
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const lang = selectLanguage(h.get("x-language"));
  return (
    <html lang={lang}>
      <body>
        <a className="skip" href="#main">
          {t(lang, "skip_to_main_content")}
        </a>
        <header className="site-header">
          <Link className="brand" href={`/?lang=${lang}`}>
            <span className="brand-icon">
              <Icon kind="brand" />
            </span>
            Хүртээмж
          </Link>
          <Navigation lang={lang} />
          <Suspense>
            <LanguageSwitch />
          </Suspense>
        </header>
        {children}
        <footer className="compact-footer">
          <div className="footer-links">
            <Link href={`/?lang=${lang}&info=site-info#site-info`}>{n(lang,'siteInfo')}</Link>
            <Link href={`/help?lang=${lang}&report=1#report-problem`}>{n(lang,'reportLink')}</Link>
            <Link href={`/admin?lang=${lang}`}>{n(lang,'admin')}</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
