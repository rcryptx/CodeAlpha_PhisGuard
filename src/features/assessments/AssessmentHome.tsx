import { lessons } from "@/features/learning/curriculum";

import { assessmentQuestions } from "./questions";
import type { AssessmentMode } from "./types";

export function AssessmentHome({
  onStart,
}: {
  onStart: (mode: AssessmentMode) => void;
}) {
  const difficultyCounts = assessmentQuestions.reduce<Record<string, number>>(
    (counts, question) => {
      counts[question.difficulty] = (counts[question.difficulty] ?? 0) + 1;
      return counts;
    },
    {},
  );

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-9 border-b border-slate-200 pb-7">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Check your understanding
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
          Assessments
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          Apply practical phishing-awareness and account-safety knowledge to
          original questions based on the Learning Centre curriculum.
        </p>
        <p className="mt-4 border-l-2 border-slate-300 pl-4 text-sm leading-6 text-slate-600">
          Results are calculated in this browser for this visit only. Passing is
          a learning checkpoint, not a certification or claim of expertise.
        </p>
      </header>

      <section aria-labelledby="full-assessment-heading">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              All curriculum topics
            </p>
            <h2
              id="full-assessment-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-slate-950"
            >
              Full assessment
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Work through all {assessmentQuestions.length} questions across{" "}
              {lessons.length} lessons. You can navigate and change answers
              until you submit.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Difficulty mix:{" "}
              {Object.entries(difficultyCounts)
                .map(([difficulty, count]) => `${count} ${difficulty}`)
                .join(" · ")}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onStart({
                kind: "full",
                id: "full",
                title: "Full assessment",
              })
            }
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            Start full assessment
          </button>
        </div>
      </section>

      <section aria-labelledby="topic-assessments-heading" className="mt-9">
        <div className="border-b border-slate-200 pb-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Focused practice
          </p>
          <h2
            id="topic-assessments-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-slate-950"
          >
            Choose a topic
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Each topic assessment includes its own curriculum questions and
            lesson review link.
          </p>
        </div>
        <ul className="divide-y divide-slate-200">
          {lessons.map((lesson) => {
            const count = assessmentQuestions.filter(
              (question) => question.topicSlug === lesson.slug,
            ).length;
            return (
              <li
                key={lesson.slug}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-medium text-slate-900">{lesson.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {count} questions · {lesson.category}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onStart({
                      kind: "topic",
                      id: lesson.slug,
                      title: lesson.title,
                      lessonSlug: lesson.slug,
                    })
                  }
                  className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
                >
                  Start topic assessment
                  <span className="sr-only">: {lesson.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
