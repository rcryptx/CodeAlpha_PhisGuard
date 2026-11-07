import { Link } from "react-router-dom";

import type { Lesson } from "@/features/learning/curriculum";

type LessonNavigationProps = {
  previous?: Lesson;
  next?: Lesson;
};

export function LessonNavigation({ previous, next }: LessonNavigationProps) {
  return (
    <nav
      aria-label="Lesson navigation"
      className="grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          to={`/learn/${previous.slug}`}
        >
          <span className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Previous lesson
          </span>
          <span className="mt-2 block font-semibold text-slate-900">
            {previous.title}
          </span>
        </Link>
      ) : (
        <Link
          className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          to="/learn"
        >
          <span className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Back to curriculum
          </span>
          <span className="mt-2 block font-semibold text-slate-900">
            All lessons
          </span>
        </Link>
      )}
      {next ? (
        <Link
          className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 sm:text-right"
          to={`/learn/${next.slug}`}
        >
          <span className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Next lesson
          </span>
          <span className="mt-2 block font-semibold text-slate-900">
            {next.title}
          </span>
        </Link>
      ) : (
        <Link
          className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 sm:text-right"
          to="/learn"
        >
          <span className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Course complete
          </span>
          <span className="mt-2 block font-semibold text-slate-900">
            Return to all lessons
          </span>
        </Link>
      )}
    </nav>
  );
}
