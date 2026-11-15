"use client";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { type Lang } from "@/shared/data";
import {t} from '@/shared/translations';
import { n } from '@/shared/nationwide';
export function Navigation({ lang }: { lang: Lang }) {
  const path = usePathname();
  return (
    <nav aria-label={t(lang,'main_navigation')}>
      {[
        ["/understand", "understand"],
        ["/help", "help"],
        ["/rights", "rights"],
      ].map(([href, key]) => (
        <Link
          key={href}
          href={`${href}?lang=${lang}`}
          aria-current={path.startsWith(href) ? "page" : undefined}
        >
          {n(lang,key as 'understand' | 'help' | 'rights' | 'admin')}
        </Link>
      ))}
    </nav>
  );
}
export default function LanguageSwitch() {
  const path = usePathname();
  const params = useSearchParams();
  const lang = params.get("lang") === "en" ? "mn" : "en";
  const query = new URLSearchParams(params.toString());
  query.set("lang", lang);
  return (
    <a
      className="language"
      href={`${path}?${query}`}
      hrefLang={lang}
      lang={lang}
    >
      {t(lang,'language_name')}
    </a>
  );
}
