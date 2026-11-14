# Хүртээмж

Web directory for people with disabilities in Mongolia, starting with Ulaanbaatar. Mongolian is primary; English is available on every route. Users search by need and office district without registering or disclosing a diagnosis. Three real organisations replace the original fictional listings, following the user's request to base the site on their information. First-party source links and online review dates are recorded; no direct provider confirmation has occurred. Costs, documents, and accessibility remain unknown. No public deployment, authentication, payment, or feedback backend is included.

## Usability preference

Keep the experience simple, easy, and convenient. Home prioritizes search and category selection. Avoid repeated explanations and preview sections. Show optional filters only when needed, and keep active filters discoverable.

## Stack

Supporting modules follow client/server/shared organisation inspired by Nytheria, while Next.js retains `app` routing. Shared interface translations live in `src/shared/translations.ts`; sourced bilingual organisation content stays in `src/shared/listings.ts`.

Next.js App Router, TypeScript, Tailwind CSS. Server-rendered GET search; small client components for navigation state, language links, feedback, checklists, and error recovery.
