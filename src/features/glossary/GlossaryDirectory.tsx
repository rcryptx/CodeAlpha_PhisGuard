import { useMemo, useState } from "react";
import { Bookmark, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

import {
  countGlossaryTermsByCategory,
  getRecentGlossaryTerms,
  glossarySortOptions,
  selectGlossaryTerms,
  validateGlossaryCatalog,
  type GlossarySortKey,
} from "./glossaryData";
import { glossaryTerms } from "./terms";
import {
  glossaryCategories,
  glossaryDifficulties,
  type GlossaryCategory,
  type GlossaryDifficulty,
  type GlossaryTerm,
} from "./types";
import { useGlossary } from "./useGlossary";

const chipClass = (active: boolean) =>
  cn(
    "min-h-9 rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:focus-visible:outline-slate-300",
    active
      ? "border-slate-800 bg-slate-800 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
  );

export function GlossaryDirectory({
  catalog = glossaryTerms,
}: {
  catalog?: unknown;
}) {
  const { terms, errors } = useMemo(
    () => validateGlossaryCatalog(catalog),
    [catalog],
  );
  const {
    bookmarkedIds,
    recentTermIds,
    storageNotice,
    isBookmarked,
    toggleBookmark,
    clearRecentTerms,
  } = useGlossary();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GlossaryCategory | "All">("All");
  const [difficulty, setDifficulty] = useState<GlossaryDifficulty | "All">(
    "All",
  );
  const [sortKey, setSortKey] = useState<GlossarySortKey>("alphabetical");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  const categoryCounts = useMemo(
    () => countGlossaryTermsByCategory(terms),
    [terms],
  );
  const visibleTerms = useMemo(
    () =>
      selectGlossaryTerms(
        terms,
        { query, category, difficulty, bookmarkedOnly, bookmarkedIds },
        sortKey,
      ),
    [terms, query, category, difficulty, bookmarkedOnly, bookmarkedIds, sortKey],
  );
  const recentTerms = useMemo(
    () => getRecentGlossaryTerms(recentTermIds, terms),
    [recentTermIds, terms],
  );

  const filtersActive =
    query.trim() !== "" ||
    category !== "All" ||
    difficulty !== "All" ||
    bookmarkedOnly;

  const resetFilters = () => {
    setQuery("");
    setCategory("All");
    setDifficulty("All");
    setBookmarkedOnly(false);
  };

  return (
    <div>
      {errors.length > 0 && (
        <p
          className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
          role="status"
        >
          Some glossary terms were omitted because their information was
          invalid.
        </p>
      )}

      {storageNotice && (
        <p
          className="mb-5 rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          role="status"
        >
          {storageNotice}
        </p>
      )}

      <div className="grid gap-5 border-b border-slate-200 pb-6 dark:border-slate-800 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label
            htmlFor="glossary-search"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Search glossary terms
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              size={17}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="glossary-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a term, definition, or keyword"
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-400"
            />
          </div>
        </div>
        <p
          className="text-sm text-slate-600 dark:text-slate-300"
          aria-live="polite"
        >
          {visibleTerms.length}{" "}
          {visibleTerms.length === 1 ? "term" : "terms"}
        </p>
      </div>

      <div className="grid gap-5 py-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Category
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter glossary by category"
            >
              {(["All", ...glossaryCategories] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={category === option}
                  onClick={() => setCategory(option)}
                  className={chipClass(category === option)}
                >
                  {option}
                  {option !== "All" && (
                    <span className="ml-1.5 text-xs opacity-70">
                      {categoryCounts[option]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Difficulty
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter glossary by difficulty"
            >
              {(["All", ...glossaryDifficulties] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={difficulty === option}
                  onClick={() => setDifficulty(option)}
                  className={chipClass(difficulty === option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label
              htmlFor="glossary-sort"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Sort terms
            </label>
            <select
              id="glossary-sort"
              value={sortKey}
              onChange={(event) =>
                setSortKey(event.target.value as GlossarySortKey)
              }
              className="min-h-10 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {glossarySortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            aria-pressed={bookmarkedOnly}
            onClick={() => setBookmarkedOnly((value) => !value)}
            className={chipClass(bookmarkedOnly)}
          >
            <Bookmark
              aria-hidden="true"
              size={15}
              strokeWidth={1.75}
              className="mr-1.5 inline"
            />
            Bookmarked only ({bookmarkedIds.length})
          </button>

          {filtersActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-9 rounded-full border border-transparent px-3 text-sm font-medium text-slate-600 underline underline-offset-4 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:text-slate-300 dark:hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {recentTerms.length > 0 && (
        <section
          aria-label="Recently viewed terms"
          className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Clock aria-hidden="true" size={15} strokeWidth={1.75} />
              Recently viewed
            </h2>
            <button
              type="button"
              onClick={clearRecentTerms}
              className="rounded-sm text-xs font-medium text-slate-500 underline underline-offset-4 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-slate-400 dark:hover:text-white"
            >
              Clear
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {recentTerms.map((term) => (
              <li key={term.id}>
                <Link
                  to={`/glossary/${term.id}`}
                  className="inline-block rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {term.term}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {visibleTerms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-7 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {terms.length === 0
              ? "No glossary terms are available"
              : "No matching terms"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {terms.length === 0
              ? "The glossary could not provide any valid entries."
              : "Try another search term, or clear the active filters."}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {visibleTerms.map((term) => (
            <li key={term.id}>
              <GlossaryRow
                term={term}
                bookmarked={isBookmarked(term.id)}
                onToggleBookmark={toggleBookmark}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GlossaryRow({
  term,
  bookmarked,
  onToggleBookmark,
}: {
  term: GlossaryTerm;
  bookmarked: boolean;
  onToggleBookmark: (termId: string) => void;
}) {
  return (
    <article className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {term.category} · {term.difficulty}
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
          <Link
            to={`/glossary/${term.id}`}
            className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:decoration-slate-600 dark:hover:decoration-slate-300"
          >
            {term.term}
          </Link>
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {term.definition}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onToggleBookmark(term.id)}
        aria-pressed={bookmarked}
        aria-label={
          bookmarked
            ? `Remove bookmark for ${term.term}`
            : `Bookmark ${term.term}`
        }
        className={cn(
          "inline-flex min-h-9 shrink-0 items-center gap-2 self-start rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:focus-visible:outline-slate-300",
          bookmarked
            ? "border-slate-800 bg-slate-800 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
        )}
      >
        <Bookmark
          aria-hidden="true"
          size={15}
          strokeWidth={1.75}
          fill={bookmarked ? "currentColor" : "none"}
        />
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </button>
    </article>
  );
}
