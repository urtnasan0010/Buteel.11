"use client";
import { useState } from "react";
import { type Lang } from "@/shared/data";
import { t } from "@/shared/translations";
export default function Checklist({ lang }: { lang: Lang }) {
  const [checked, setChecked] = useState<number[]>([]);
  const items = [
    t(lang, "check_the_source_and_contact_details"),
    t(lang, "ask_about_eligibility_cost_and_opening_hours"),
    t(lang, "confirm_required_documents"),
    t(lang, "ask_about_step_free_access_toilets_and_communication_support"),
    t(lang, "plan_a_suitable_time_and_route"),
  ];
  return (
    <div className="checklist">
      <h2>
        {t(lang, "my_preparation_checklist")}
      </h2>
      <p role="status">
        {t(lang, "count_of_count_steps_ready", [items.length, checked.length])}
      </p>
      {items.map((item, i) => (
        <label className="check" key={item}>
          <input
            type="checkbox"
            checked={checked.includes(i)}
            onChange={(e) =>
              setChecked(
                e.target.checked
                  ? [...checked, i]
                  : checked.filter((v) => v !== i),
              )
            }
          />
          {item}
        </label>
      ))}
      <button className="print-button" onClick={() => window.print()}>
        {t(lang, "print_checklist")}
      </button>
      <p className="meta">
        {t(lang, "checkmarks_last_while_this_page_remains_open")}
      </p>
    </div>
  );
}
