# Project structure

Next.js remains the framework. This borrows Nytheria's separation of client, server and shared code without copying its Express/Vite app, authentication, database, assets, or deployment setup.

```text
src/
  app/                     Next.js routes, layouts and route fallbacks
  client/
    components/            Interactive checklist, feedback and navigation
    styles/globals.css     Shared visual styles and print rules
  server/
    components/            Server-rendered organisation detail content
  shared/
    translations.ts        Mongolian/English interface messages and labels
    data.ts                Shared types and search/filter logic
    listings.ts            Organisation facts, evidence and map-link helper
    ui.tsx                 Shared rendering components, no browser state
  proxy.ts                 Request language headers for Next.js
tests/
  browser/                 User flows and bilingual accessibility checks
```

## Translation changes

Section pages are registered in `src/shared/content-pages.ts` and rendered by `src/server/components/section-content.tsx`. Next.js optional catch-all routes under Understand, Help and Reach accept only registry paths; other paths return 404. Generic content is not organisation data. Keep source/review TODOs until evidence and an actual editorial review are available. `CONTENT_REVIEW.md` tracks native-language and lived-experience review needs.

Edit `src/shared/translations.ts`. Every typed key has `mn` and `en` values. Components call `t(lang, "home")`, or pass positional values such as `t(lang, "count_of_count_steps_ready", [total, completed])`. Slots `{0}`, `{1}` can appear in a different order in each language. Values are rendered as React text, not HTML.

Keep keys stable when editing wording. Add both languages together; TypeScript catches unknown keys and tests catch missing translations or mismatched slots. Category and feature labels, district spellings, and navigation copy use this same file. Sourced organisation names, descriptions and addresses remain bilingual in `listings.ts` so editorial changes retain their provenance; they are not generic interface translations.

Keep the `use client` directive on browser-interactive components. Do not import server components into client modules. Keep Next.js route names under `app` rather than imitating Nytheria's HTML entry filenames. Routes, query strings, mn/en document language and source-review status remain unchanged.
