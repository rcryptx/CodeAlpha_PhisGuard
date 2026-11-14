import { useRef, useState } from "react";

import { lessonBySlug } from "@/features/learning/curriculum";

import { scoreAssessment } from "./scoring";
import { QuestionView } from "./QuestionView";
import type {
  AnswerMap,
  AssessmentMode,
  AssessmentQuestion,
  AssessmentResult,
} from "./types";

export function AssessmentSession({
  mode,
  questions,
  attemptNumber,
  onComplete,
  onCancel,
}: {
  mode: AssessmentMode;
  questions: AssessmentQuestion[];
  attemptNumber: number;
  onComplete: (result: AssessmentResult) => void;
  onCancel: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [confirmUnanswered, setConfirmUnanswered] = useState(false);
  const submittedRef = useRef(false);
  const currentQuestion = questions[currentIndex];
  const answeredCount = questions.filter((question) =>
    Boolean(answers[question.id]),
  ).length;
  const unansweredCount = questions.length - answeredCount;
  const lesson = mode.kind === "topic" ? lessonBySlug(mode.lessonSlug) : null;

  if (!currentQuestion) {
    return (
      <section className="mx-auto max-w-3xl" aria-labelledby="empty-heading">
        <h1
          id="empty-heading"
          className="text-2xl font-semibold text-slate-950"
        >
          No questions available
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This assessment has no questions to present.
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="mt-5 rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:focus-visible:outline-slate-300"
        >
          Return to assessments
        </button>
      </section>
    );
  }

  function submit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    onComplete(
      scoreAssessment(mode.id, mode.title, questions, answers, attemptNumber),
    );
  }

  function requestSubmit() {
    if (unansweredCount > 0) {
      setConfirmUnanswered(true);
      return;
    }
    submit();
  }

  function chooseAnswer(optionId: string) {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: optionId }));
    setConfirmUnanswered(false);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6 border-b border-slate-200 pb-5">
        <button
          type="button"
          onClick={onCancel}
          className="mb-4 inline-flex min-h-10 items-center text-sm font-medium text-slate-700 underline decoration-slate-400 underline-offset-4 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:text-white"
        >
          ← All assessments
        </button>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          Attempt {attemptNumber} ·{" "}
          {mode.kind === "full" ? "Full assessment" : "Topic assessment"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {mode.title}
        </h1>
        {lesson && (
          <p className="mt-2 text-sm text-slate-600">Topic: {lesson.title}</p>
        )}
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Select one answer for each question. Correct answers and explanations
          remain hidden until final submission. You may change responses and
          revisit questions before submitting.
        </p>
      </header>

      <section
        aria-label="Assessment progress"
        className="mb-5 rounded-xl border border-slate-200 bg-white p-4"
      >
        <div className="flex flex-wrap justify-between gap-2 text-sm">
          <p className="font-medium text-slate-800">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <p className="text-slate-600">
            {answeredCount} of {questions.length} answered
          </p>
        </div>
        <progress
          aria-label="Question position"
          className="mt-3 h-2 w-full accent-slate-800 dark:accent-slate-200"
          max={questions.length}
          value={currentIndex + 1}
        />
        <nav aria-label="Question navigation" className="mt-4">
          <ol className="flex flex-wrap gap-2">
            {questions.map((question, index) => {
              const isAnswered = Boolean(answers[question.id]);
              return (
                <li key={question.id}>
                  <button
                    type="button"
                    aria-current={index === currentIndex ? "step" : undefined}
                    aria-label={`Question ${index + 1}, ${isAnswered ? "answered" : "unanswered"}`}
                    onClick={() => {
                      setCurrentIndex(index);
                      setConfirmUnanswered(false);
                    }}
                    className={`min-h-10 min-w-10 rounded-full border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 ${
                      index === currentIndex
                        ? "border-slate-800 bg-slate-800 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                        : isAnswered
                          ? "border-slate-500 bg-slate-100 text-slate-900 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100"
                          : "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </section>

      <QuestionView
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        selectedOptionId={answers[currentQuestion.id]}
        onSelect={(option) => chooseAnswer(option.id)}
      />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => {
            setCurrentIndex((index) => Math.max(0, index - 1));
            setConfirmUnanswered(false);
          }}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous question
        </button>
        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              setCurrentIndex((index) =>
                Math.min(questions.length - 1, index + 1),
              );
              setConfirmUnanswered(false);
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Next question
          </button>
        ) : (
          <button
            type="button"
            onClick={requestSubmit}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:outline-slate-300"
          >
            Submit assessment
          </button>
        )}
      </div>

      {confirmUnanswered && (
        <section
          role="alertdialog"
          aria-labelledby="unanswered-confirmation-heading"
          aria-describedby="unanswered-confirmation-description"
          className="mt-5 rounded-xl border border-slate-300 bg-slate-50 p-5"
        >
          <h2
            id="unanswered-confirmation-heading"
            className="font-semibold text-slate-900"
          >
            Submit with unanswered questions?
          </h2>
          <p
            id="unanswered-confirmation-description"
            className="mt-2 text-sm leading-6 text-slate-700"
          >
            {unansweredCount}{" "}
            {unansweredCount === 1 ? "question is" : "questions are"} unanswered
            and will not count as correct. You can return to the questions or
            submit now.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={submit}
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
            >
              Submit with unanswered questions
            </button>
            <button
              type="button"
              onClick={() => setConfirmUnanswered(false)}
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Return to questions
            </button>
          </div>
        </section>
      )}
      <p className="mt-5 text-xs leading-5 text-slate-500">
        Your answers stay in this browser session and are not saved after
        leaving this page.
      </p>
    </div>
  );
}
