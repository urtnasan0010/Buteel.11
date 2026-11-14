import { t } from "@/shared/translations";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import LanguageSwitch, { Navigation } from "@/client/components/language-switch";
import { Icon, } from "@/shared/ui";
import "@/client/styles/globals.css";
export const metadata: Metadata = {
  title: {
    default: "Хүртээмж — дэмжлэгт хүрэх зам",
    template: "%s | Хүртээмж",
  },
  description:
    "Улаанбаатарын дэмжлэгийн байгууллагуудын лавлах. Support organisation directory for Ulaanbaatar.",
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const lang = h.get("x-language") === "en" ? "en" : "mn";
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
        <footer>
          <Link className="brand" href={`/?lang=${lang}`}>
            Хүртээмж
          </Link>
          <p>
            {t(lang, "access_to_information_for_everyone")}
          </p>
          <div className="footer-links">
            <Link href={`/how-it-works?lang=${lang}`}>{t(lang,'how_it_works')}</Link>
            <Link href={`/privacy?lang=${lang}`}>{t(lang,'privacy')}</Link>
            <Link href={`/for-organisations?lang=${lang}`}>{t(lang,'for_organisations')}</Link>
            <Link href={`/accessibility?lang=${lang}`}>
              {t(lang, "accessibility_statement")}
            </Link>
            <Link href={`/contact?lang=${lang}`}>
              {t(lang, "contact_page")}
            </Link>
          </div>
          <small>
            {t(lang, "ulaanbaatar_local_prototype")}
          </small>
        </footer>
      </body>
    </html>
  );
}
