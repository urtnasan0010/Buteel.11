import { t } from "@/shared/translations";
﻿import Link from "next/link";
import {
  categories,
  districtEnglish,
  districts,
  type Lang,
  type Service,
} from "./data";
export function CategoryIcon({ index }: { index: number }) {
  const paths = [
    "M5 7h14v12H5zM5 10h14M9 4v3m6-3v3M9 14h6",
    "M12 4v16M4 12h16",
    "m5 19 7-7m1-7a5 5 0 0 0-6 6l6 6a5 5 0 0 0 6-6l-4 2-3-3z",
    "m3 8 9-4 9 4-9 4zM6 10v6l6 3 6-3v-6",
    "M4 8h16v12H4zM9 8V4h6v4M4 13h16M10 13v3h4v-3",
    "M5 17V5h14v12zM5 9h14M5 14h14M7 20v-3m10 3v-3",
    "M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0M4 21v-2a4 4 0 0 1 4-4m12 6v-2a4 4 0 0 0-4-4",
    "M4 4h16v12H9l-5 4zM8 8h8M8 12h5",
  ];
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[index]} />
    </svg>
  );
}
export function Icon({
  kind = "arrow",
}: {
  kind?: "arrow" | "search" | "book" | "brand";
}) {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === "search" ? (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </>
      ) : kind === "book" ? (
        <>
          <path d="M4 4h6l2 2 2-2h6v15h-6l-2 2-2-2H4zM12 6v15" />
        </>
      ) : kind === "brand" ? (
        <>
          <path d="M4 19V9l8-5 8 5v10M8 19v-7h8v7M2 19h20" />
          <path d="M11 8h2" />
        </>
      ) : (
        <path d="M5 12h14m-5-5 5 5-5 5" />
      )}
    </svg>
  );
}
export function SourceNotice({ lang }: { lang: Lang }) {
  return (
    <aside
      className="demo"
      aria-label={t(lang, "about_this_information")}
    >
      <strong>
        {t(lang, "check_before_visiting")}
      </strong>
      <span>
        {t(lang, "based_on_the_organisations_websites_not_confirmed_directly_ask_ab")}
      </span>
    </aside>
  );
}
export function DistrictSelect({
  lang,
  value = "",
}: {
  lang: Lang;
  value?: string;
}) {
  return (
    <select name="district" id="district" defaultValue={value}>
      <option value="">{t(lang, "all_districts")}</option>
      {districts.map((d, i) => (
        <option key={d} value={d}>
          {lang === "mn" ? d : districtEnglish[i]}
        </option>
      ))}
    </select>
  );
}
export function ServiceCard({
  service: s,
  lang,
}: {
  service: Service;
  lang: Lang;
}) {
  return (
    <article className="service-row">
      <div>
        <div className="meta">
          {categories[s.category][lang]} <span>·</span>{" "}
          {lang === "mn"
            ? s.district
            : districtEnglish[districts.indexOf(s.district)]}
        </div>
        <h3>
          <Link href={`/services/${s.id}?lang=${lang}`}>
            {s.name[lang]} <Icon />
          </Link>
        </h3>
        <p className="service-summary">{s.description[lang]}</p>
        <div className="tags">
          <span>{t(lang, "source_checked")}</span>
          <span>
            {s.cost === "free"
              ? t(lang, "free")
              : s.cost === "paid"
                ? t(lang, "paid")
                : t(lang, "cost_unknown")}
          </span>
        </div>
      </div>
    </article>
  );
}
export function SearchForm({ lang }: { lang: Lang }) {
  return (
    <form action="/services" className="home-search">
      <input type="hidden" name="lang" value={lang} />
      <div className="search-main">
        <label htmlFor="q">
          {t(lang, "what_support_are_you_looking_for")}
        </label>
        <div className="input-icon">
          <Icon kind="search" />
          <input
            id="q"
            name="q"
            placeholder={t(lang, "service_need_or_keyword")}
          />
        </div>
      </div>
      <div>
        <label htmlFor="district">
          {t(lang, "office_district")}
        </label>
        <DistrictSelect lang={lang} />
      </div>
      <button type="submit">
        {t(lang, "find_support")}
        <Icon />
      </button>
    </form>
  );
}
