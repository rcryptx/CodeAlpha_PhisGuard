import { useEffect } from "react";
import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

import {
  getGlossaryLessonTitle,
  getRelatedGlossaryTerms,
} from "./glossaryData";
import { glossaryTerms } from "./terms";
import type { GlossaryTerm } from "./types";
import { useGlossary } from "./useGlossary";

export function GlossaryTermView({
  term,
  catalog = glossaryTerms,
}: {
  term: GlossaryTerm;
  catalog?: GlossaryTerm[];
}) {
  const { isBookmarked, toggleBookmark, recordTermView } = useGlossary();
  const relatedTerms = getRelatedGlossaryTerms(term, catalog);
  const bookmarked = isBookmarked(term.id);

  useEffect(() => {
    recordTermView(term.id);
  }, [recordTermView, term.id]);

  return (
    <article>
      <header className="border-b border-slate-200 pb-7 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {term.category} · {term.difficulty}
          </p>
          <button
            type="button"
            onClick={() => toggleBookmark(term.id)}
            aria-pressed={bookmarked}
            className={cn(
              "inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:focus-visible:outline-slate-300",
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
            {bookmarked ? "Bookmarked" : "Bookmark this term"}
          </button>
        </div>

        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl">
          {term.term}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-200">
          {term.definition}
        </p>
      </header>

      <section className="mt-7">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          In plain language
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-300">
          {term.explanation}
        </p>
      </section>

      <section className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Example
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-200">
          {term.example}
        </p>
      </section>

      {term.keywords.length > 0 && (
        <section className="mt-7">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Keywords
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {term.keywords.map((keyword) => (
              <li
                key={keyword}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {keyword}
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedTerms.length > 0 && (
        <section className="mt-7">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Related terms
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {relatedTerms.map((related) => (
              <li key={related.id}>
                <Link
                  to={`/glossary/${related.id}`}
                  className="inline-block rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {related.term}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {term.lessonSlugs.length > 0 && (
        <section className="mt-7 border-t border-slate-200 pt-6 dark:border-slate-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Related lessons
          </h2>
          <ul className="mt-3 space-y-2">
            {term.lessonSlugs.map((slug) => {
              const title = getGlossaryLessonTitle(slug);
              if (!title) return null;
              return (
                <li key={slug}>
                  <Link
                    to={`/learn/${slug}`}
                    className="text-base text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-slate-200 dark:decoration-slate-600 dark:hover:decoration-slate-300"
                  >
                    {title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </article>
  );
}
