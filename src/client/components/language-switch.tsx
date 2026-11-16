"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { type Lang } from "@/shared/data";
import {t} from '@/shared/translations';
import { n } from '@/shared/nationwide';
export function Navigation({ lang }: { lang: Lang }) {
  const path = usePathname();
  return (
    <nav className="site-navigation" aria-label={t(lang,'main_navigation')}>
      {[
        ["/", "home"],
        ["/understand", "understand"],
        ["/help", "help"],
        ["/rights", "rights"],
      ].map(([href, key]) => (
        <Link
          key={href}
          href={`${href}?lang=${lang}`}
          aria-current={(path === href || (href !== '/' && path.startsWith(`${href}/`))) ? "page" : undefined}
        >
          {key === 'home' ? t(lang,'home') : n(lang,key as 'understand' | 'help' | 'rights')}
        </Link>
      ))}
    </nav>
  );
}
