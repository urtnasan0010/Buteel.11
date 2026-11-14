"use client";
import { useEffect, useRef, useState } from "react";
import { type Lang } from "@/shared/data";
import { t } from "@/shared/translations";
export default function Feedback({
  lang,
  service,
}: {
  lang: Lang;
  service: string;
}) {
  const [report, setReport] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const reportRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (report) reportRef.current?.focus(); }, [report]);
  return (
    <section id="feedback">
      <h2>
        {t(lang, "corrections_and_feedback")}
      </h2>
      <p>
        {t(lang, "no_submission_backend_is_configured_this_form_prepares_a_report_n")}
      </p>
      <p className="note">
        {t(lang, "do_not_include_diagnoses_medical_records_identity_numbers_or_othe")}
      </p>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          const message = String(d.get("message") || "").trim();
          if (!message) {
            setError(
              t(lang, "please_describe_your_correction_or_suggestion"),
            );
            document.getElementById("message")?.focus();
            return;
          }
          setError("");
          setStatus("");
          setReport(
            `${t(lang, "hurteemj_feedback_report")}\n${t(lang, "service")}: ${d.get("service") || "—"}\n${message}\n\n${t(lang, "not_submitted_or_saved")}`,
          );
        }}
      >
        <label htmlFor="service">
          {t(lang, "service_name_or_link_optional")}
        </label>
        <input
          id="service"
          name="service"
          defaultValue={service}
          maxLength={300}
        />
        <label htmlFor="message">
          {t(lang, "correction_or_suggestion_required")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={3000}
          required
          aria-invalid={!!error}
          aria-describedby={error ? "feedback-error" : undefined}
        />
        {error && (
          <p className="error" id="feedback-error" role="alert">
            {error}
          </p>
        )}
        <button>
          {t(lang, "prepare_copyable_report")}
        </button>
      </form>
      {report && (
        <div className="report">
          <label htmlFor="report">
            {t(lang, "unsubmitted_report")}
          </label>
          <textarea id="report" rows={8} value={report} readOnly ref={reportRef} aria-describedby="report-status" />
          <button
            className="secondary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(report);
                setStatus(
                  t(lang, "report_copied_it_has_not_been_submitted"),
                );
              } catch {
                setStatus(
                  t(lang, "could_not_copy_select_the_report_text_and_copy_it_manually"),
                );
                reportRef.current?.focus();
                reportRef.current?.select();
              }
            }}
          >
            {t(lang, "copy_report")}
          </button>
        </div>
      )}
      <p id="report-status" role="status">{report ? status || t(lang, "report_ready_not_submitted_or_saved") : ''}</p>
    </section>
  );
}
