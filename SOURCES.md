# Listing sources — reviewed 2026-11-14

The three listings are real organisations, replacing the fictional prototype dataset. The review date records when the online source was read; it is not the date a provider confirmed the facts. No phone calls, emails, site visits, or live appointment checks were made. English summaries and address transliterations are editorial translations. Website pages may be undated or outdated.

| Listing                                                | First-party source                                       | Facts supported                                                                                |
| ------------------------------------------------------ | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Employment Support Centre for People with Disabilities | https://dmart.mn/contact-us/                             | Name, enquiry route, office district/address, phone, email, published opening hours            |
| Mongolian National Federation of the Blind             | https://mnfb.mn/mn/about and https://mnfb.mn/mn/programs | Name, purpose/audience, education and accessible-book programmes, office address, phone, email |
| Association of Parents with Differently-abled Children | https://apdc.mn/байгууллагын-товч-мэдээлэл-4/            | Name, parent information/peer-support focus, office address, phone, email                      |

Some older third-party directories and historical documents contain different addresses or phone numbers. Those were not merged into these records. For APDC, use its organisation-overview page, not the historical address in its 2016 constitution. For MNFB, use its current first-party contact details rather than older directory entries. Prefer direct provider confirmation before relying on a visit.

## Information boundaries

- Costs, document requirements, physical access and dedicated communication accommodations remain unknown. Publishing an email address alone does not confirm an accessibility accommodation.
- Audience text describes a provider’s focus, not a guaranteed entitlement or verified enrolment rule. General contact steps are advice, not a provider’s official application process.
- District describes the published office location. It does not restrict eligible residents or claim a service area. The directory is intentionally incomplete.
- Google Maps links are name/address searches under [Google’s Maps URL documentation](https://developers.google.com/maps/documentation/urls/get-started). No precise pin, accessible route, Places data feed, or Google listing was verified. The website does not load a map or request geolocation.

## Updating

Edit `src/shared/listings.ts`; `Service` and `SourceRecord` types live in `src/shared/data.ts`. Every published fact must have a source record listing the fields it supports and its own review date. Leave absent facts null and missing document lists empty. Use `source-checked` after reading the source. Only use `provider-confirmed` with a recorded direct-confirmation date and evidence; never promote a listing just because it appears on Google Maps. Keep `lastChecked` consistent with the latest full source review. Recheck contact details and page changes manually before updating a date.

