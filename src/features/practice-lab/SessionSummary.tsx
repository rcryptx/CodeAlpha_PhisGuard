import { Link } from "react-router-dom";

import { lessonBySlug } from "@/features/learning/curriculum";

import { calculateSessionSummary } from "./scenarioEngine";
import type { PracticeAttempt } from "./types";

export function SessionSummary({
  attempts,
  onRestart,
  onReview,
}: {
  attempts: PracticeAttempt[];
  onRestart: () => void;
  onReview: () => void;
}) {
  const summary = calculateSessionSummary(attempts);

  return (
    <section
      aria-labelledby="session-summary-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
        Session complete · results for this visit only
      </p>
      <h2
        id="session-summary-heading"
        className="mt-3 text-3xl font-semibold tracking-tight text-slate-950"
      >
        Practice session summary
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        These results reflect decisions made in this session. They are not saved
        as permanent learning progress.
      </p>

      <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Scenarios attempted", summary.scenariosAttempted],
          ["Decisions made", summary.decisionsMade],
          ["Correct decisions", summary.correctDecisions],
          ["Incorrect decisions", summary.incorrectDecisions],
        ].map(([label, count]) => (
          <div key={label} className="border-t border-slate-300 pt-3">
            <dt className="text-xs leading-5 text-slate-600">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-950">
              {count}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 text-sm text-slate-700">
        Session accuracy:{" "}
        <strong>
          {summary.accuracyPercentage === null
            ? "Not available"
            : `${summary.accuracyPercentage}%`}
        </strong>
        {summary.accuracyPercentage !== null && (
          <span>
            {" "}
            ({summary.correctDecisions} correct of {summary.decisionsMade}{" "}
            decisions)
          </span>
        )}
      </p>

      <section
        aria-labelledby="practice-recommendations-heading"
        className="mt-8 border-t border-slate-200 pt-6"
      >
        <h3
          id="practice-recommendations-heading"
          className="font-semibold text-slate-900"
        >
          Topics to revisit
        </h3>
        {summary.topicsToPractice.length === 0 ? (
          <p className="mt-2 text-sm leading-6 text-slate-600">
            No incorrect decisions were recorded in this session. You can still
            revisit any topic to reinforce the safer responses.
          </p>
        ) : (
          <ul className="mt-3 space-y-4">
            {summary.topicsToPractice.map((topic) => {
              const lesson = lessonBySlug(topic.lessonSlug);
              return (
                <li
                  key={topic.category}
                  className="border-l-2 border-slate-300 pl-4"
                >
                  <h4 className="text-sm font-semibold text-slate-900">
                    {topic.category}
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {topic.recommendation}
                  </p>
                  {lesson && (
                    <Link
                      to={`/learn/${lesson.slug}`}
                      className="mt-2 inline-flex text-sm font-medium text-slate-800 underline decoration-slate-400 underline-offset-4 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:text-white"
                    >
                      Revisit: {lesson.title}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReview}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
        >
          Review scenarios
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:outline-slate-300"
        >
          Restart session
        </button>
      </div>
    </section>
  );
}
