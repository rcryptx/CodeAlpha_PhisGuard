import { useState } from "react";
import { Link } from "react-router-dom";

import { lessonBySlug } from "@/features/learning/curriculum";

import { PASSING_SCORE_PERCENTAGE } from "./scoring";
import type { AssessmentResult, QuestionReview } from "./types";

function AnswerReview({
  item,
  index,
  open,
}: {
  item: QuestionReview;
  index: number;
  open: boolean;
}) {
  const selectedAnswer = item.question.options.find(
    (option) => option.id === item.selectedOptionId,
  );
  const correctAnswer = item.question.options.find(
    (option) => option.id === item.question.correctOptionId,
  );
  const lesson = lessonBySlug(item.question.lessonSlug);

  return (
    <details open={open} className="border-t border-slate-200 py-4">
      <summary className="cursor-pointer rounded-sm py-1 text-sm font-medium text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
        <span className="ml-1">
          Question {index + 1} ·{" "}
          {item.outcome === "correct"
            ? "Correct"
            : item.outcome === "incorrect"
              ? "Incorrect"
              : "Unanswered"}
        </span>
      </summary>
      <div className="mt-4">
        {item.question.scenarioContext && (
          <p className="text-sm leading-6 text-slate-600">
            {item.question.scenarioContext}
          </p>
        )}
        <h4 className="mt-2 font-semibold leading-6 text-slate-900">
          {item.question.prompt}
        </h4>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
          <dt className="font-medium text-slate-600">Your answer</dt>
          <dd className="text-slate-800">
            {selectedAnswer?.text ?? "No answer submitted"}
          </dd>
          <dt className="font-medium text-slate-600">Correct answer</dt>
          <dd className="text-slate-800">
            {correctAnswer?.text ?? "Question data is unavailable"}
          </dd>
          <dt className="font-medium text-slate-600">Explanation</dt>
          <dd className="leading-6 text-slate-700">
            {item.question.explanation}
          </dd>
          <dt className="font-medium text-slate-600">Learning objective</dt>
          <dd className="leading-6 text-slate-700">
            {item.question.learningObjective}
          </dd>
        </dl>
        {lesson && (
          <Link
            to={`/learn/${lesson.slug}`}
            className="mt-4 inline-flex text-sm font-medium text-slate-800 underline decoration-slate-400 underline-offset-4 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:text-white"
          >
            Revisit: {lesson.title}
          </Link>
        )}
      </div>
    </details>
  );
}

export function AssessmentResults({
  result,
  previousAttempts,
  onRetry,
  onReturn,
}: {
  result: AssessmentResult;
  previousAttempts: number;
  onRetry: () => void;
  onReturn: () => void;
}) {
  const [reviewExpanded, setReviewExpanded] = useState(false);
  const topics = Object.entries(result.topicPerformance);
  const difficulties = Object.entries(result.difficultyPerformance);

  return (
    <div className="mx-auto max-w-5xl">
      <header className="border-b border-slate-200 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          Results for this visit · Attempt {result.attemptNumber}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {result.assessmentTitle}
        </h1>
      </header>

      <section
        aria-labelledby="assessment-result-heading"
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"
      >
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Final score
            </p>
            <h2
              id="assessment-result-heading"
              className="mt-2 text-5xl font-semibold tracking-tight text-slate-950"
            >
              {result.percentage === null ? "—" : `${result.percentage}%`}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {result.passed ? "Passed" : "Needs improvement"} · Passing
              threshold: {PASSING_SCORE_PERCENTAGE}%
            </p>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            This score reflects only the answers submitted in this attempt. A
            passing result is a learning checkpoint, not a certification or
            measure of professional expertise.
          </p>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Questions", result.totalQuestions],
            ["Correct", result.correctAnswers],
            ["Incorrect", result.incorrectAnswers],
            ["Unanswered", result.unansweredQuestions],
          ].map(([label, count]) => (
            <div key={label} className="border-t border-slate-300 pt-3">
              <dt className="text-xs text-slate-600">{label}</dt>
              <dd className="mt-1 text-2xl font-semibold text-slate-950">
                {count}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="topic-results-heading" className="mt-8">
        <h2
          id="topic-results-heading"
          className="text-xl font-semibold tracking-tight text-slate-950"
        >
          Topic performance
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Topic accuracy is correct answers divided by all questions in that
          topic; unanswered questions are not correct.
        </p>
        <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
          {topics.map(([slug, performance]) => {
            const lesson = lessonBySlug(slug);
            return (
              <li
                key={slug}
                className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-medium text-slate-900">
                    {lesson?.title ?? slug}
                  </h3>
                  {performance.percentage !== null &&
                    performance.percentage < PASSING_SCORE_PERCENTAGE && (
                      <p className="mt-1 text-xs text-slate-600">
                        Consider revisiting this topic.
                      </p>
                    )}
                </div>
                <p className="text-sm text-slate-700">
                  {performance.percentage ?? "—"}% · {performance.correct}/
                  {performance.total} correct
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {difficulties.length > 0 && (
        <section aria-labelledby="difficulty-results-heading" className="mt-7">
          <h2
            id="difficulty-results-heading"
            className="text-lg font-semibold text-slate-950"
          >
            Difficulty breakdown
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700">
            {difficulties.map(([difficulty, performance]) => (
              <li key={difficulty}>
                {difficulty}: {performance.correct}/{performance.total} correct
                {performance.percentage !== null
                  ? ` (${performance.percentage}%)`
                  : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="answer-review-heading" className="mt-9">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Learn from every answer
            </p>
            <h2
              id="answer-review-heading"
              className="mt-2 text-xl font-semibold tracking-tight text-slate-950"
            >
              Answer review
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setReviewExpanded((expanded) => !expanded)}
            className="text-sm font-medium text-slate-700 underline decoration-slate-400 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {result.review.length > 0
              ? reviewExpanded
                ? "Collapse answer review"
                : "Expand answer review"
              : "No answers to review"}
          </button>
        </div>
        <div className="mt-2">
          {result.review.map((item, index) => (
            <AnswerReview
              key={`${result.assessmentId}-${result.attemptNumber}-${item.question.id}`}
              item={item}
              index={index}
              open={reviewExpanded}
            />
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:outline-slate-300"
        >
          Retry assessment
        </button>
        <button
          type="button"
          onClick={onReturn}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Choose another assessment
        </button>
        {previousAttempts > 0 && (
          <p className="self-center text-xs text-slate-500">
            {previousAttempts} earlier{" "}
            {previousAttempts === 1 ? "attempt remains" : "attempts remain"}{" "}
            unchanged for this visit.
          </p>
        )}
      </div>
    </div>
  );
}
