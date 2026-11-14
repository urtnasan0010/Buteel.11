import Link from "next/link";
import MslVideo from "@/shared/msl-video";
import { t } from "@/shared/translations";
import Checklist from "@/client/components/checklist";
export default async function Guides({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const lang = (await searchParams).lang === "en" ? "en" : "mn";
  return (
    <main id="main" className="content page reading">
      <Link className="breadcrumb" href={`/?lang=${lang}`}>
        {t(lang, "home")}
      </Link>
      <h1>
        {t(lang, "prepare_to_contact_a_service")}
      </h1>
      <p className="intro">
        {t(lang, "describe_your_needs_in_your_own_words_and_get_the_information_you")}
      </p>
      <aside className="demo">
        <strong>
          {t(lang, "general_preparation_advice")}
        </strong>
        <span>
          {t(lang, "this_is_not_an_official_requirement_no_verified_official_requirem")}
        </span>
      </aside>
      <MslVideo lang={lang} title={t(lang,"prepare_to_contact_a_service")}>
      <section>
        <h4>
          {t(lang, "1_decide_what_support_you_need")}
        </h4>
        <p>
          {t(lang, "write_down_the_activity_you_want_support_with_you_do_not_need_to_")}
        </p>
      </section>
      <section>
        <h4>
          {t(lang, "2_ask_the_provider")}
        </h4>
        <p>
          {t(lang, "you_could_ask_what_does_this_service_cost_which_documents_do_i_ne")}
        </p>
      </section>
      <section>
        <h4>
          {t(lang, "3_prepare_documents_safely")}
        </h4>
        <p>
          {t(lang, "confirm_requirements_with_an_official_source_and_prepare_only_the")}
        </p>
      </section>
      </MslVideo>
      <Checklist lang={lang} />
      <Link className="text-link" href={`/services?lang=${lang}`}>
        {t(lang, "find_a_service")}
      </Link>
    </main>
  );
}
