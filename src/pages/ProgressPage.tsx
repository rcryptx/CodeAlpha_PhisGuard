import { Link } from "react-router-dom";

import { PageMetadata } from "@/components/seo/PageMetadata";
import { lessons, lessonBySlug } from "@/features/learning/curriculum";
import { getProgressSummary } from "@/features/progress/progressData";
import { ProgressNotice } from "@/features/progress/ProgressNotice";
import { useProgress } from "@/features/progress/useProgress";

function formatCompletionDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

export function ProgressPage() {
  const { completedLessons, storageNotice, clearProgress } = useProgress();
  const summary = getProgressSummary({
    version: 1,
    completedLessons,
  });
  const completedSlugs = new Set(
    completedLessons.map((record) => record.lessonSlug),
  );
  const remainingLessons = lessons.filter(
    (lesson) => !completedSlugs.has(lesson.slug),
  );

  return (
    <>
      <PageMetadata
        title="Learning progress"
        description="Review lessons you explicitly marked complete and local learning activity saved in this browser."
        path="/progress"
      />
      <div className="mx-auto max-w-5xl">
        <ProgressNotice message={storageNotice} />
        <header className="border-b border-slate-200 pb-7">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Your learning, on this device
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Learning progress
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            This dashboard reflects lessons you chose to mark complete. Opening
            a lesson does not automatically count it as complete.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Progress is stored locally in this browser. Assessment answers and
            results are not included or saved here.
          </p>
        </header>

        <section
          aria-labelledby="overall-progress-heading"
          className="mt-7 border-b border-slate-200 pb-7"
        >
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Overall lesson completion
              </p>
              <h2
                id="overall-progress-heading"
                className="mt-1 text-5xl font-semibold tracking-tight text-slate-950"
              >
                {summary.completionPercentage}%
              </h2>
            </div>
            <dl className="grid grid-cols-3 gap-5 sm:min-w-[26rem]">
              {[
                ["Total lessons", summary.totalLessons],
                ["Completed", summary.completedLessons],
                ["Remaining", summary.lessonsRemaining],
              ].map(([label, count]) => (
                <div key={label} className="border-t border-slate-300 pt-2">
                  <dt className="text-xs text-slate-600">{label}</dt>
                  <dd className="mt-1 text-xl font-semibold text-slate-950">
                    {count}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <progress
            aria-label="Overall lesson completion"
            className="mt-5 h-2 w-full accent-slate-800 dark:accent-slate-200"
            max={summary.totalLessons}
            value={summary.completedLessons}
          />
        </section>

        {summary.completedLessons === 0 ? (
          <section
            aria-labelledby="empty-progress-heading"
            className="mt-8 rounded-2xl border border-dashed border-slate-300 p-6 sm:p-8"
          >
            <h2
              id="empty-progress-heading"
              className="text-xl font-semibold text-slate-950"
            >
              A fresh place to begin
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              No lessons are marked complete yet. Start with any lesson, then
              use its completion control when you feel ready to record it.
            </p>
            <Link
              to="/learn"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:outline-slate-300"
            >
              Browse the learning centre
            </Link>
          </section>
        ) : (
          <>
            <section
              aria-labelledby="activity-heading"
              className="mt-7 grid gap-6 border-b border-slate-200 pb-7 sm:grid-cols-2"
            >
              <div>
                <h2
                  id="activity-heading"
                  className="font-semibold text-slate-900"
                >
                  Recent learning activity
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {summary.completedInRecentWindow}{" "}
                  {summary.completedInRecentWindow === 1
                    ? "lesson completed"
                    : "lessons completed"}{" "}
                  in the last seven days.
                </p>
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">
                  Most recent completion
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {summary.lastActivityAt
                    ? formatCompletionDate(summary.lastActivityAt)
                    : "No completion date available"}
                </p>
              </div>
            </section>

            <section
              aria-labelledby="recent-lessons-heading"
              className="mt-7 border-b border-slate-200 pb-7"
            >
              <h2
                id="recent-lessons-heading"
                className="text-xl font-semibold tracking-tight text-slate-950"
              >
                Recently completed
              </h2>
              <ul className="mt-3 divide-y divide-slate-200">
                {summary.recentlyCompleted.map((record) => {
                  const lesson = lessonBySlug(record.lessonSlug);
                  if (!lesson) return null;
                  return (
                    <li
                      key={record.lessonSlug}
                      className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <Link
                          to={`/learn/${lesson.slug}`}
                          className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                          {lesson.title}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          Completed {formatCompletionDate(record.completedAt)}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-slate-600">
                        Completed
                      </span>
                    </li>
                  );
                })}
              </ul>
              {summary.completedLessons > summary.recentlyCompleted.length && (
                <p className="mt-3 text-sm text-slate-600">
                  Showing the 5 most recently completed lessons.
                </p>
              )}
            </section>
          </>
        )}

        {remainingLessons.length > 0 && (
          <section aria-labelledby="remaining-lessons-heading" className="mt-7">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2
                  id="remaining-lessons-heading"
                  className="text-xl font-semibold tracking-tight text-slate-950"
                >
                  Lessons to explore
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {remainingLessons.length} lessons are not marked complete.
                </p>
              </div>
              <Link
                to="/learn"
                className="text-sm font-medium text-slate-800 underline decoration-slate-400 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Browse all lessons
              </Link>
            </div>
            <ul className="divide-y divide-slate-200">
              {remainingLessons.map((lesson) => (
                <li key={lesson.slug} className="py-3">
                  <Link
                    to={`/learn/${lesson.slug}`}
                    className="text-sm font-medium text-slate-800 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {completedLessons.length > 0 && (
          <section
            aria-labelledby="manage-progress-heading"
            className="mt-12 border-t border-slate-200 pt-7"
          >
            <h2
              id="manage-progress-heading"
              className="text-sm font-semibold text-slate-900"
            >
              Manage saved progress
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Clear all locally saved lesson completions on this device.
            </p>
            <button
              type="button"
              onClick={() => clearProgress()}
              className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:outline-slate-300"
            >
              Reset local progress
            </button>
          </section>
        )}
      </div>
    </>
  );
}
