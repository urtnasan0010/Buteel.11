import { t } from "@/shared/translations";
import Link from "next/link";
import MslVideo from "@/shared/msl-video";
import {
  categories,
  features,
  featureLabels,
  filterServices,
  services,
} from "@/shared/data";
import { SourceNotice, DistrictSelect, ServiceCard, } from "@/shared/ui";
export default async function Directory({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  const scalar = (k: string) =>
    typeof p[k] === "string" ? (p[k] as string) : "";
  const lang = scalar("lang") === "en" ? "en" : "mn";
  const access = Array.isArray(p.access)
    ? p.access
    : p.access
      ? [p.access]
      : [];
  const results = filterServices(services, {
    q: scalar("q"),
    category: scalar("category"),
    district: scalar("district"),
    cost: scalar("cost"),
    access,
  });
  return (
    <main id="main" className="content page">
      <Link className="breadcrumb" href={`/?lang=${lang}`}>
        {t(lang, "home")}
      </Link>
      <h1>{t(lang, "service_directory")}</h1>
      <SourceNotice lang={lang} />
      <div className="directory">
        <form key={JSON.stringify(p)} action="/services" className="filters">
          <input type="hidden" name="lang" value={lang} />

          <label htmlFor="search">{t(lang, "search_term")}</label>
          <input
            id="search"
            name="q"
            defaultValue={scalar("q")}
            placeholder={t(lang, "name_need_keyword")}
          />
          <label htmlFor="category">
            {t(lang, "support_category")}
          </label>
          <select
            id="category"
            name="category"
            defaultValue={scalar("category")}
          >
            <option value="">{t(lang, "all_categories")}</option>
            {categories.map((c, i) => (
              <option key={i} value={i}>
                {c[lang]}
              </option>
            ))}
          </select>
          <label htmlFor="district">
            {t(lang, "office_district")}
          </label>
          <DistrictSelect lang={lang} value={scalar("district")} />
          <details
            className="more-filters"
            open={!!scalar("cost") || access.length > 0}
          >
            <summary>{t(lang, "more_filters")}</summary>
            <label htmlFor="cost">{t(lang, "cost")}</label>
            <select id="cost" name="cost" defaultValue={scalar("cost")}>
              <option value="">{t(lang, "any_cost")}</option>
              <option value="free">{t(lang, "free")}</option>
              <option value="paid">{t(lang, "paid")}</option>
              <option value="unknown">
                {t(lang, "unknown")}
              </option>
            </select>
            <fieldset>
              <legend>{t(lang, "accessibility")}</legend>
              {features.map((f) => (
                <label className="check" key={f}>
                  <input
                    type="checkbox"
                    name="access"
                    value={f}
                    defaultChecked={access.includes(f)}
                  />
                  {featureLabels[f][lang]}
                </label>
              ))}
              <p className="meta">
                {t(lang, "only_shows_listings_with_the_selected_features_recorded_as_availa")}
              </p>
            </fieldset>
          </details>
          <button>{t(lang, "search")}</button>
          <Link className="reset" href={`/services?lang=${lang}`}>
            {t(lang, "reset_filters")}
          </Link>
        </form>
        <section aria-label={t(lang, "search_results")}>
          <div className="results-heading">
            <h2>
              {t(lang, "count_organisations", [results.length])}
            </h2>
            <span className="meta">
              {t(lang, "ulaanbaatar")}
            </span>
          </div>
          {results.length ? (
            results.map((s) => (
              <ServiceCard key={s.id} service={s} lang={lang} />
            ))
          ) : (
            <div className="empty">
              <h3>
                {t(lang, "no_matching_services")}
              </h3>
              <p>
                {t(lang, "try_a_different_keyword_or_fewer_filters_this_directory_does_not_")}
              </p>
              <Link className="button" href={`/services?lang=${lang}`}>
                {t(lang, "view_all_services")}
              </Link>
            </div>
          )}
        </section>
      </div>
      <MslVideo lang={lang} title={t(lang,"finding_support")}><p>{t(lang,"msl_find")}</p></MslVideo>
    </main>
  );
}
