"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { type Lang } from "@/shared/data";
import {t} from '@/shared/translations';
import { n } from '@/shared/nationwide';
export function LanguageSwitch({ lang }: { lang: Lang }) {
  const path = usePathname();
  const next = lang === 'mn' ? 'en' : 'mn';
  // A document navigation also refreshes the root layout's html language and navigation.
  return <a className="language" href={`${path}?lang=${next}`} hrefLang={next} lang={next}
    aria-label={lang === 'mn' ? 'Switch to English' : 'Монгол хэлээр үзэх'}>
    {lang === 'mn' ? 'English' : 'Монгол'}
  </a>;
}
export function Navigation({ lang }: { lang: Lang }) {
  const path = usePathname();
  return (
    <nav aria-label={t(lang,'main_navigation')}>
      {[
        ["/", "home"],
        ["/understand", "understand"],
        ["/help", "help"],
        ["/rights", "rights"],
      ].map(([href, key]) => (
        <Link
          key={href}
          href={`${href}?lang=${lang}`}
          aria-current={(href === '/' ? path === '/' : path.startsWith(href)) ? "page" : undefined}
        >
          {key === 'home' ? t(lang,'home') : n(lang,key as 'understand' | 'help' | 'rights')}
        </Link>
      ))}
    </nav>
  );
}
