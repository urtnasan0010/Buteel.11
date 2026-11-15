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
export const metadata: Metadata = {
  title: {
    default: "Хүртээмж — дэмжлэгт хүрэх зам",
    template: "%s | Хүртээмж",
  },
  description:
    "Монгол орны дэмжлэг, хүртээмж, эрхийн мэдээлэл. Disability support and rights across Mongolia.",
};
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
