# Cybersecurity Glossary

The glossary is a locally bundled, typed reference of cybersecurity terms. It
ships as data only — no definitions, queries, bookmarks, or recently viewed
terms leave the browser.

## Content model

Terms live in `terms.ts` as a `GlossaryTerm[]`. Each entry has a stable `id`,
`term`, a concise `definition`, a plain-language `explanation`, a real-world
`example`, a `category` and `difficulty`, searchable `keywords`, `relatedTerms`
(other term ids), and `lessonSlugs` (Learning Centre lessons). The 12 categories
and three difficulty levels are declared in `types.ts`.

## Data helpers

`glossaryData.ts` keeps all pure logic out of React:

- `validateGlossaryCatalog(input)` checks shape, category, difficulty, unique
  ids, lesson slugs, and cross-references. Invalid records are excluded and
  reported; dangling or self-referential `relatedTerms` and unknown lesson
  slugs are dropped. The shipped catalog is expected to validate with **no
  errors**.
- `filterGlossaryTerms`, `sortGlossaryTerms`, and `selectGlossaryTerms` power
  search, category/difficulty/bookmark filtering, and A–Z/category/difficulty
  sorting.
- `getGlossaryTerm`, `getRelatedGlossaryTerms`, `getGlossaryLessonTitle`, and
  `getRecentGlossaryTerms` resolve cross-references for the detail and
  directory views.

## Persistence

Bookmarks and recently viewed terms are stored in `localStorage` under
`phisguard.glossary-bookmarks` and `phisguard.glossary-recent`. `glossaryStorage.ts`
parses these values defensively: unreadable or unsupported data yields an empty
list plus a notice, and unknown or duplicate ids are ignored. `glossaryStore.ts`
maintains one `useSyncExternalStore` snapshot (bookmarks, recent terms, storage
notice) that `useGlossary.ts` exposes to components. Recently viewed terms are
deduplicated, most-recent first, and capped at `MAX_RECENT_TERMS` (8).

## UI

- `GlossaryDirectory.tsx` provides search (`role="searchbox"`), category and
  difficulty filters (`aria-pressed` chips), sorting, a bookmarked-only toggle,
  a recently viewed section, clear controls, and empty/error states.
- `GlossaryTermView.tsx` renders a single term with its definition,
  explanation, example, keywords, related terms, related lessons, and a
  bookmark toggle. Viewing a term records it as recently viewed.
- Routes: `/glossary` and `/glossary/:termId` (`GlossaryPage.tsx`,
  `GlossaryTermPage.tsx`). An unknown term id renders a not-found state.

## Extending the catalog

Add terms to `terms.ts` with unique ids and references that resolve to other
entries. Run the glossary tests — `validateGlossaryCatalog` reports dangling
`relatedTerms`, duplicate ids, unknown lesson slugs, and invalid fields, so
authoring mistakes surface immediately.
