import { selectLanguage } from '@/shared/language';
import { t } from "@/shared/translations";
import Link from "next/link";
import {headers} from "next/headers";

export default async function NotFound() {
  const lang=selectLanguage((await headers()).get('x-language'));
  return (
    <main id="main" className="content page">
      <h1>{t(lang, "page_not_found")}</h1>
      <Link className="text-link" href={`/?lang=${lang}`}>{t(lang, "home")}</Link>
    </main>
  );
}

